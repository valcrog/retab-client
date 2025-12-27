import { TTabCourseTuningInfo } from "./db-types";
import Measure from "./Measure";
import MeiAttribute from "./mei-modules/MeiAttribute";
import MeiJsonElem from "./mei-modules/MeiJsonXmlElement";
import MeiTag, { TMeiTagFactoryArgs } from "./mei-modules/MeiTag";
import Note from "./Note";
import RezTabFile from "./RezTabFile";
import Staff, { StaffLine } from "./Staff";
import { TabCourseTuningInfo, TCourseInfo, TSectionInfo, TStaffInfo, TTimeSignature } from "./types";

export default class Section extends MeiTag {
    tagTitle = 'section';
    measures: Measure[]
    private doc: RezTabFile;
    info:TSectionInfo = {staves: []}
    constructor(doc: RezTabFile, measures: Measure[], info: TSectionInfo) {
        super();
        this.doc = doc
        this.measures = measures;
        this.info = info;
    }


    get timeSignature(): TTimeSignature | undefined {
        return !this.getDoc().docSettings.proportion.include ? undefined :   (this.getDoc().docSettings.proportion.num + '-' + this.getDoc().docSettings.proportion.numbase)  as TTimeSignature
    }
    getDoc() {return this.doc}
    getAllNotes(justTheExistingOnes = true): Note[] {
        return this.measures.reduce((sf: Note[], m) => [...sf, ...m.getAllNotes(justTheExistingOnes)], [])
    }
    initializeDefaultTuning(staffIndex = 0) {
        this.info.staves[staffIndex].tuning = [...Staff.DEFAULT_TUNING.slice(0, 6)]
    }
    static fromMeiFactoryArgs( doc: RezTabFile, arg: TMeiTagFactoryArgs, stavesInfo?: TStaffInfo[]) {
        
        const instance = new Section(doc, [], {staves: stavesInfo || [] })
        instance.id = arg.id
        instance.info = {
            staves: stavesInfo || []
        }
        instance.setXmlId(arg.xmlId || arg.attributes?.find(at => at.title == 'xml:id' )?.value)
        if (arg.children) instance.initializeMeasures(arg.children);
        setTimeout(() => {
            instance.updateChildren();
        }, 1000)
        return instance;
    }
    setAttributes(): void {
        // server will set the n attribute
        // this.setAttribute(new MeiAttribute('n', '1'))
        return;
    }
    setTabgroupsIncludeDurAttribute(mode: boolean) {
        this.measures.forEach(m => m.setTabgroupsIncludeDurAttribute(mode))
    }

    getStavesInfo() {
        
        return this.info.staves
        
        return this.info.staves.map((s, index) => ({...s,  tuning: this.measures[0].staves[index].lines.map(sl => sl.tuning)})).map(i => {
            return <TStaffInfo>{
                linesCount: i.linesCount,
                tabType: i.tabType,
                
                // n: i.n,
                // tuning: i.tuning.map(t => ({number: t.n, ...t})),
                // notationType: i.notationType
            }
        })
    }
    unfreeze() {
        this.measures.forEach(meausre => {
            meausre.staves.forEach(staff => {
                staff.tabGroups.forEach(tabgroup => {
                    const currentNotes = tabgroup.notes;
                    tabgroup.notes = staff.lines.map(l => {
                        const c = l.courseInfo.number;
                        return currentNotes.find(n => n.course == c) || new Note(tabgroup, {course: c})

                    })
                })
            })
        })
    }
    addLineToStaff(tuning?: TTabCourseTuningInfo, staffIndex = 0) {
        /**fake */
        let newLineTuning: TabCourseTuningInfo = {
            n: tuning?.n || 0,oct: tuning?.oct, pname: tuning?.pname
        }
        this.measures.forEach(m => {
            if (!newLineTuning.n) {
                const newLine = m.staves[staffIndex].addLine()
                newLineTuning = newLine.courseInfo.tuning!
            } else  m.staves[staffIndex].addLine()
        })
        this.info.staves[staffIndex].linesCount++;
        this.info.staves[staffIndex].tuning?.push(newLineTuning)
        this.doc.docSettings.linesCount = this.info.staves[staffIndex].linesCount;
        
    }
    initializeMeasures(measureJsonXmlElements: TMeiTagFactoryArgs[]) {
                
        this.measures = measureJsonXmlElements.map(mje => Measure.fromMeiFactoryArgs(this, mje))
                return this;
    }
   setTuning(tuning: TabCourseTuningInfo[], staffIndex: number) {
        this.info.staves[staffIndex].tuning = tuning
   }
    removeLineFromStaff(staffIndex = 0, lineN: number) {
        this.measures.forEach(m => m.staves[staffIndex].removeLine(lineN));
        // this.info.staves[staffIndex].linesCount--;
        const currentTuningIndex = this.info.staves[staffIndex].tuning?.indexOf(this.info.staves[staffIndex].tuning.find(t => t.n == lineN)!);
        
        if (typeof currentTuningIndex == 'number') this.info.staves[staffIndex].tuning?.splice(currentTuningIndex, 1)
        this.info.staves[staffIndex].linesCount = this.info.staves[staffIndex].tuning?.length || this.info.staves[staffIndex].linesCount - 1 
        this.doc.docSettings.linesCount = this.info.staves[staffIndex].linesCount;
        this.info.staves[staffIndex].tuning = this.info.staves[staffIndex].tuning?.sort((a, b) => a.n - b.n).map((t, index) => ({...t, n: index + 1}))
        // this.info.staves[staffIndex].linesCount--;
        // const tuningInStavesInfo = this.getStavesInfo()[staffIndex].tuning?.find(si => si.n == lineN)
        // if (tuningInStavesInfo ) {
        //     this.info.staves[staffIndex].tuning?.splice(this.info.staves[staffIndex].tuning?.indexOf(tuningInStavesInfo),1)
        // }
        const t = this.doc.getTuning(staffIndex)
        
        // const splicedTuning = t?.splice(t.indexOf(t.find(l => l.n == lineN)!), 1)
        this.setTuning(t!, staffIndex)
    }
    updateChildren(): MeiTag {
        this.children = this.measures.map(m => m.updateChildren());
        return this
    }
    addMeasure(index?: number): Measure {
        const m = new Measure(this, (index || 0) + 1 ||  this.measures[this.measures.length-1]?.n + 1 );
        if (index == undefined) {
            this.measures.push(m)
        } else {
            this.measures.splice(index, 0, m);
        }
        this.updateMeasuresN();
        return m;
    }
    updateMeasuresN() {

        this.measures.forEach((m, index) => m.setN(index + 1))
    }
    getMeasureFromN(n: number) {
        return this.measures.find(m => m.n == n)
    }

    cleanupChildren() {
        this.measures.forEach(m => m.cleanupTabGroups())
    }
    toJsonXmlElement(options = {keepEmptyNotes: false}): MeiJsonElem {
        if  (!options.keepEmptyNotes) this.cleanupChildren();
        return super.toJsonXmlElement(options)
    }

    removeMeasure(m: Measure) {
        this.measures.splice(this.measures.indexOf(m), 1);
    }


    showRawTabGroups() {
        return this.measures.map(m => m.staves.map(s => s.tabGroups.map(tg => tg.notes.map(n => n.course + ':' + n.fret))))
    }
}