import DB from "../DB";
import { TDocSettings, TMeiTag, TRetabDoc, TTabCourseTuningInfo, TUser } from "../db-types";
import { MeiAttribute } from "../mei-tags/interfaces";
import TabIdeaDocGenerator from "../mei-adapters/TabIdeaDocGenerator";
import { MeiTag } from "../mei-tags";
import MeiMainTag from "../mei-tags/MeiMainTag";
import Section from "../mei-tags/Section";
import StaffInfoContainer from "./StaffInfoContainer";
import RetabUser from "./User";
import { debug, includeMeiTagChildrenRecursively } from "../../utils";
import Course from "../mei-tags/Course";



export default class RetabDoc implements TRetabDoc {
    settings?: TDocSettings;
    id?: number | undefined;
    lastModifiedAt?: string | Date | undefined;
    mainChildId?: number | undefined;
    mainChild?: MeiMainTag | null | undefined;
    title?: string | undefined;
    user?: TUser | undefined;
    createdAt?: string | Date | undefined;
    filename?: string | undefined;
    altTitle?: string | undefined;
    userId?: number | undefined;

    stavesInfo: StaffInfoContainer[] = []

    static makeInstance(id?: number) {
        const instance = new RetabDoc();

        if (!id) return instance;
        else return this.getInstanceFromDb(id) || new RetabDoc()
    }

    async initializeMeiMainTag() {
        this.mainChild = await new MeiMainTag({ docId: this.id }).init()
    }

    appendHead(head: MeiTag) {
        // this.mainChild?.addOrReplaceChild(head);
        this.mainChild?.appendHead(head)
    }

    getStaffInfo(n = 1) {
        return this.stavesInfo.find(si => si.n) || this.stavesInfo[n - 1]
    }
    setStavesInfo(stavesInfo: StaffInfoContainer[]) {
        // let sic = this.getStaffInfoContainer(staffN);
        for (const staffInfo of stavesInfo) {
            const staffN = staffInfo.n || 1
            const staffDefMeiTag = this.mainChild?.getStaffDefMeiTag(staffN)!;
            const sic = this.setTuning(staffInfo.tuning, staffInfo.n)
            sic.adjustStaffDef(staffDefMeiTag)
            if (this.settings?.proportionInclude) sic.appendProport(
                staffDefMeiTag,
                this.settings.proportionNum!, this.settings.proportionNumbase!,
                this.settings.proportionSign, this.settings.proportionSlash
            )
        }
    }

    setTuning(coursesInfo: TTabCourseTuningInfo[], staffN = 1) {
        let sic = this.getStaffInfoContainer(staffN);
        if (sic) sic.setTuning(coursesInfo)
        else {
            sic = new StaffInfoContainer({
                linesCount: coursesInfo.length,
                notationType: StaffInfoContainer.DEFAULT_INFO.notationType,
                tuning: StaffInfoContainer.DEFAULT_TUNING,
            });
            this.stavesInfo.push(sic)
        }
        return sic


    }

    getStaffInfoContainer(n = 1) { return this.stavesInfo.find(sic => sic.n == n); }
    appendSection(section: MeiTag | Section) {
        (this.mainChild as MeiMainTag).appendSection(section as MeiTag);
    }
    static async getInstanceFromDb(id: number) {
        console.log({id});
        
        try {
            const info = await DB.getInstance().retabDoc.findUniqueOrThrow({
                where: { id },
                include: {
                    user: true,
                    mainChild: includeMeiTagChildrenRecursively(),
                    stavesInfo: {
                        include: {
                            tuning: true
                        }
                    },
                    settings: true
                }
            });
            const instance = new RetabDoc();
            instance.setInfo(info as TRetabDoc)
            return instance;
        } catch (error) {
            console.log(error);
            
            console.log('Err: No Doc Record Found.')
        }

    }
    getDataToEdit() {
        return {
            id: this.id,
            title: this.title,
            filename: this.filename,
            createdAt: this.createdAt,
            instruments: this.stavesInfo.map(si => si.instrument?.title) || [],
            tabType: this.stavesInfo?.map((si: any) => si.notationType)?.[0],
            tuning: this.stavesInfo?.map((si: any) => si.tuning)?.[0],
            sectionJsonXmlElement: this.getSection()?.toJsonXmlElement(),
            headJsonXmlElement: this.getHead()?.toJsonXmlElement(),
            stavesInfo: this.stavesInfo,
            settings: this.settings
        }
    }

    getSection() {
        return this.mainChild?.getSection()
    }
    getHead() {
        return this.mainChild?.getHead()
    }
    setInfo(info: TRetabDoc) {
        // writeFileSync('./temp.json', JSON.stringify(info))
        this.id = info.id;
        this.lastModifiedAt = new Date(info.lastModifiedAt!);
        this.mainChild = new MeiMainTag(info.mainChild || undefined);
        this.mainChildId = info.mainChildId || undefined
        this.stavesInfo = info.stavesInfo?.map(s => s instanceof StaffInfoContainer ? s : new StaffInfoContainer(s)) || []
        this.title = info.title
        this.user = info.user
        this.altTitle = info.altTitle
        this.createdAt = info.createdAt
        this.filename = info.filename
        this.settings = info.settings
        this.userId = info.userId;
        return this;
    }
    getStaffDefMeiTag(n = 1) {
        const score = this.mainChild?.getScoreMeiTag();
        const staffGrp = score?.__('staffGrp')
        const staffDef = staffGrp?.getChildrenByTagName('staffDef')?.find(ch => ch.hasSameAttributeKeyValue(new MeiAttribute('n', n)))
        return staffDef
    }
    async save() {
        const userId = this.user?.id || this.userId
        if (!userId) throw new Error('User Id Must be provided to save the doc');

        const savedInfo = await this.initializeFileInDb({
            userId,
            title: this.title,
            altTitle: this.altTitle,
            id: this.id,
            settings: this.settings
        })
        this.id = savedInfo.id

        await this.saveStavesInfo();

        await this.mainChild?.save(this);
        // const header = this.mainChild?.getHead();
        const user = await RetabUser.getUser(userId);
        // commented for debug
        await user.saveEncoderHeader({ headerTagId: await this.mainChild?.getHeadId() })
    }
    async saveStavesInfo() {
        if (!this.id) throw new Error('RetabDoc Must be savedFirst')
        const saveResults = await Promise.all(this.stavesInfo.map(si => si.save(this.id!)))
        const relatedXmlIdsCoursesUnNested = saveResults.map(si => si.tuning).reduce((sf, c) => [...sf, ...c], []) as TTabCourseTuningInfo[]
        for (const staffIndex in this.stavesInfo) {
            this.mainChild?.getStaffDefMeiTag(Number(staffIndex || 0) + 1)
            const courses = this.mainChild?.getTuningTag(Number(staffIndex || 0) + 1).children.filter(ch => ch instanceof Course) as Course[];
            courses?.forEach(c => c.correctXmlId(relatedXmlIdsCoursesUnNested))
        }


    }

    generateFilename(title: string) { return `${title || 'unknownTitle'}-${this.user?.name}-${Date.now()}.mei` }
    async initializeFileInDb(payload: TRetabDoc) {
        const settingsData = {
            defaultFirstTabgrpDurSymShow: this.settings?.defaultFirstTabgrpDurSymShow,
            proportionInclude: this.settings?.proportionInclude,
            fixedMeasures: this.settings?.fixedMeasures,
            proportionNum: this.settings?.proportionNum,
            proportionNumbase: this.settings?.proportionNumbase,
            proportionSign: this.settings?.proportionSign || null,
            proportionSlash: Number(this.settings?.proportionSlash || 0) || null,
            tabgroupsIncludeDurAttribute: this.settings?.tabgroupsIncludeDurAttribute,

        }
        const saved = await DB.getInstance().retabDoc.upsert({
            where: { id: this.id || 0 },
            create: {
                title: payload.title || '',
                altTitle: payload.altTitle || null,
                user: { connect: { id: payload.userId } },
                filename: this.generateFilename(payload.title || 'unknown-title'),
                settings: {
                    connectOrCreate: {
                        where: { docId: this.id || 0 },
                        create: settingsData
                    }
                }

            },
            update: {
                lastModifiedAt: new Date(),
                title: payload.title || '',
                altTitle: payload.altTitle || null,
                filename: this.generateFilename(payload.title || 'unknown-title'),
                settings: {
                    upsert: {
                        where: {
                            docId: this.id || 0
                        },
                        create: settingsData, update: settingsData
                    }
                }
            }
        })
        return saved
    }

    async toMei() {
        const docGenerator = new TabIdeaDocGenerator();

        return docGenerator.setDoc(this)
    }

    async remove() {
        const prisma = DB.getInstance();
        if (!this.id) throw new Error('ID must be present; available docId is: ' + this.id);
        const deleteResult = await prisma.retabDoc.delete({
            where: { id: this.id },
            select: {
                mainChildId: true
            }
        });

        const nestedTags = await prisma.meiTag.findFirst({
            where: {
                id: deleteResult.mainChildId || 0
            },
            ...includeMeiTagChildrenRecursively()
        });


        const idsToDelete: number[] = [nestedTags?.id!];


        function pushChildrenIds(tag: TMeiTag) {
            const ids = tag.children?.map(ch => ch.id as number) || [];
            idsToDelete.push(...ids)
            if (!tag.children?.length) return;
            else tag.children?.forEach(ch => pushChildrenIds(ch))
        }
        if (nestedTags) pushChildrenIds(nestedTags)
        else console.log('no meiTag found');
        const idsSafeToDelete = (await prisma.meiTag.findMany({
            where: {
                AND: [
                    { id: { in: idsToDelete } },
                    {
                        parents: {
                            none: {
                                id: { notIn: idsToDelete }
                            }
                        }
                    }
                ]
            },
        })).map(i => i.id);
        await prisma.meiTag.deleteMany({
            where:{
                id: {in: idsSafeToDelete}
            }
        })

        return;
    }
    assignDocSettings(docStetings: {
        defaultFirstTabgrpDurSymShow: boolean,
        proportion: { include: boolean, num: number, numbase: number, sign?: string, slash?: number }
        tabgroupsIncludeDurAttribute: boolean,
        fixedMeasures?: boolean
    }) {
        this.settings = {
            defaultFirstTabgrpDurSymShow: docStetings.defaultFirstTabgrpDurSymShow,
            proportionInclude: docStetings.proportion.include,
            proportionNum: docStetings.proportion.num,
            proportionNumbase: docStetings.proportion.numbase,
            tabgroupsIncludeDurAttribute: docStetings.tabgroupsIncludeDurAttribute,
            proportionSign: docStetings.proportion.sign,
            proportionSlash: docStetings.proportion.slash,
            fixedMeasures: docStetings.fixedMeasures,
            docId: this.id || undefined
        }
    }
}


