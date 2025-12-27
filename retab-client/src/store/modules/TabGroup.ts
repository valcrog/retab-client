import Layer from "./Layer";
import Measure from "./Measure";
import MeiAttribute from "./mei-modules/MeiAttribute";
import MeiJsonElem from "./mei-modules/MeiJsonXmlElement";
import MeiTag, { TMeiTagFactoryArgs } from "./mei-modules/MeiTag";
import Note from "./Note";
import Staff from "./Staff";
import { DurNum, TabType, TNoteInfo } from "./types";
import { generateId } from "./utils";
class TabDurSym extends MeiTag {
    setAttributes(): void {
        return
    }
    updateChildren(): MeiTag {
        return this;
    }
    tagTitle = 'tabDurSym';
    setId(id?: number): this {
        this.id = id
        return this
    }
}


export default class TabGroup extends MeiTag {
    static INCLUDE_DUR_ATTRIBUTE = true
    static initializeStatics() { this.INCLUDE_DUR_ATTRIBUTE = true }
    durDots = 0;
    tagTitle = 'tabGrp';
    dur: DurNum = 4;
    isSelected = false
    private includeDurAttribute = TabGroup.INCLUDE_DUR_ATTRIBUTE
    showTabDurSym = false
    containerElId?: string
    tabDurSymId?: number;
    get staff() { return this.layer.staff }
    get durationToWholeNote() {
        return (1/this.dur) * 1.5**(this.durDots || 0)
    }

    
    setAttributes(): void {
        if (this.includeDurAttribute) {
            this.setAttribute(new MeiAttribute('dur', this.dur))
        }
    }
    getContainerEl() {
        return document.querySelector('#' + this.containerElId!)
    }
    updateSelectionMode(mode = true) {
        if (!mode) return this.deselect()
        if ((!this.getAllNotes().find(n => !n.isSelected))) {
            this.select()
        } else { this.deselect() }
    }
    select() {
        this.isSelected = true
        this.getContainerEl()?.classList.add('selected')
    }
    deselect() {
        this.isSelected = false
        this.getContainerEl()?.classList.remove('selected')

    }
    getAllNotes(justTheExistingOnes = true) {
        if (!justTheExistingOnes) return this.notes
        else return this.notes.filter(n => n.isThere())

    }
    focus(courseNumber?: number) {
        courseNumber = courseNumber || 1;
        this.notes.find(n => n.course == courseNumber)?.focus()
    }
    setIncludeDurAttribute(mode: boolean) {
        this.includeDurAttribute = mode;
        TabGroup.INCLUDE_DUR_ATTRIBUTE = mode;
        if (!this.includeDurAttribute) {
            const att = this.attributes.find(a => a.title == 'dur');
            if (att) this.attributes.splice(this.attributes.indexOf(att), 1);
            this.showTabDurSym = false
        } else {
            this.setAttribute(new MeiAttribute('dur', this.dur))
        }
    }
    /**Hotel room numberin! meaure 3, tabgroup 2: 302*/
    getIndexInPiece() { return this.staff.measure.n * 100 + this.staff.tabGroups.indexOf(this) }
    setDur(durNum: DurNum) {
        if (durNum < 1 || durNum > 64) return;
        this.dur = durNum
    }
    updateChildren(options = { keepEmptyNotes: false }): MeiTag {
        this.children = this.notes.filter(n => options.keepEmptyNotes ||  ((n.fret != undefined) && (n.course != undefined)));
        if (this.showTabDurSym && !this.children.find(ch => ch instanceof TabDurSym)) {
            // add <tabDurSym/> element to the children
            this.children.unshift(new TabDurSym().setId(this.tabDurSymId))
        }
        return this;
    }

    toggleShowTabDurSym() {
        this.showTabDurSym = !this.showTabDurSym
    }
    notes: Note[] = [];
    layer: Layer

    constructor(layer: Layer) {
        super();
        this.layer = layer;
        this.init()
    }

    private init() {
        // this.measure.lines.forEach(l => this.addNote({course: l.courseInfo.number}))
        if (!this.xmlId) this.setXmlId(generateId())
        this.staff.lines.forEach(l => {
            this.addNote({ course: l.courseInfo.number })
        })
    }
    addNote(info: TNoteInfo) {
        const alreadyThere = this.getNoteOnCourse(info.course || 0) // this.notes.find(i => i.course == info.course);
        const n = new Note(this, info);
        if (alreadyThere) this.notes.splice(this.notes.indexOf(alreadyThere), 1, n)
        else this.notes.push(n)
    }
    clone(staff?: Staff): TabGroup {
        const tg = new TabGroup(staff?.getLayer() || this.layer);
        tg.setDur(this.dur);
        this.notes.forEach((n, index, notes) => {
            if (n.isThere()) {
                const noteOnCourse = tg.getNoteOnCourse(n.course!) as Note
                noteOnCourse.fret = n.fret;
                setTimeout(() => {

                    noteOnCourse.setupEl()
                }, 1000);
            }
        })
        tg.setDurDots(this.getDurDots());
        tg.updateChildren();
        tg.setIncludeDurAttribute(this.includeDurAttribute);
        tg.showTabDurSym = this.showTabDurSym;


        return tg

    }
    cleanup() {
        this.notes = this.notes.filter(n => n.isThere())

    }

    /**1 for nextCourse -1 for previous course */
    getNeighbour(diff: number) {
        const thisIndex = this.staff.tabGroups.indexOf(this);
        return this.staff.tabGroups[thisIndex + diff]
    }

    getNextMeasureFirstNote(courseNumber = 6, staffIndex = 0) {
        const thisMeasure = this.staff.measure;
        const nextMeasure = thisMeasure.getNeighbour(1);
        return nextMeasure?.staves[staffIndex].tabGroups[0]?.notes.find(n => n.course == courseNumber)
    }
    getPrevMeasureFirstNote(courseNumber = 6, staffIndex = 0) {
        const thisMeasure = this.staff.measure;
        const prevMeasure = thisMeasure.getNeighbour(-1);
        return prevMeasure?.staves[staffIndex].tabGroups[0]?.getNoteOnCourse(courseNumber)
    }
    getCurrentMeasureLastTabgroup(staffIndex = 0) {
        const thisMeasure = this.staff.measure;
        return thisMeasure.staves[staffIndex].tabGroups.at(-1);
    }
    getNoteOnCourse(courseNumber: number) {
        return this.notes.find((n: Note) => n.course == courseNumber)
    }
    getPrevMeasureLastNote(courseNumber = 6, staffIndex = 0) {
        const thisMeasure = this.staff.measure;
        const prevMeasure = thisMeasure.getNeighbour(-1) as Measure;
        const lastIndex = prevMeasure?.staves[staffIndex].tabGroups?.length - 1
        return prevMeasure?.staves[staffIndex].tabGroups?.[lastIndex]?.getNoteOnCourse(courseNumber)
    }

    getDurDots() {

        return this.durDots || Number(this.attributes.find(a => a.title == 'dots')?.value || 0)
    }

    setDurDots(d: number) {
        this.durDots = d;
        this.setAttribute({ title: 'dots', value: this.durDots + '' })
    }
    dot(dotsCount?: number) {
        if (!dotsCount) dotsCount = (this.getDurDots() + 1)
        if (dotsCount > 2) dotsCount = 0
        this.setDurDots(dotsCount)
        if (dotsCount == 0) {
            this.removeAttribute('dots')
        } else {
            this.setAttribute(new MeiAttribute('dots', dotsCount));
        }
    }


    remove() {
        this.staff.removeTabgroup(this)
    }
    getDoc() {
        return this.staff.getDoc();
    }
    insertTabgroupBefore(newTg?: TabGroup) {
        const newOne = newTg || this.staff.insertTabgroupBefore(this);
        if (!newTg) {
            newOne.dur = this.dur;
            newOne.setDurDots(this.getDurDots())
        }
        return newOne
    }
    insertTabgroupAfter(newTg?: TabGroup) {
        const newOne = this.staff.insertTabgroupAfter(this, newTg);
        if (!newTg) {
            newOne.dur = this.dur;
            newOne.setDurDots(this.getDurDots())
        }

        return newOne
    }


    setFetchedNotes(noteJsonXmlElements: TMeiTagFactoryArgs[]) {
        noteJsonXmlElements.forEach(nje => {
            let course: number | undefined = undefined, fret: number | undefined = undefined, xmlId: string | undefined
            nje.attributes?.forEach(at => {
                if (at.title == 'tab.course') course = Number(at.value)
                else if (at.title == 'tab.fret') fret = Number(at.value)
                else if (at.title == 'xml:id') xmlId = at.value
            })

            const sameCourse = this.getNoteOnCourse(course!);
            if (sameCourse) {
                sameCourse.fret = fret
                // sameCourse.xmlId = xmlId!
                sameCourse.setXmlId(xmlId)
                sameCourse.id = nje.id
                nje.attributes?.forEach(at => sameCourse.setAttribute(new MeiAttribute(at.title, at.value)))
            }
        })
        // this.notes = noteJsonXmlElements.map(n => Note.fromMeiFactoryArgs(this, n))
    }
    static fromMeiFactoryArgs(layer: Layer, arg: TMeiTagFactoryArgs) {
        const instance = new TabGroup(layer);
        instance.id = arg.id
        arg.attributes?.forEach(at => {
            if (at.title == 'dur') instance.setDur(Number(at.value) as DurNum)
            else if (at.title == 'dots' && Number(at.value) > 0) instance.setDurDots(Number(at.value))
            else if (at.title == 'xml:id') instance.setXmlId(at.value)
        })

        const tabDurSymTag = arg.children?.find(ch => ch.tagTitle == 'tabDurSym')
        instance.showTabDurSym = !!tabDurSymTag
        instance.tabDurSymId = tabDurSymTag?.id

        // instance.setIncludeDurAttribute() 
        instance.setFetchedNotes(arg.children?.filter(ch => ch.tagTitle == 'note') || []);

        return instance;
    }


    showLedgerLines(untillCourseNumber: number): boolean {
        const tabType = this.staff.getTabType();
        if (tabType == TabType.ITALIAN) {

            const note = this.getNoteOnCourse(untillCourseNumber);
            const noteIsThere = note?.isThere();

            return noteIsThere || (this.staff.lines.length >= untillCourseNumber + 1 && this.showLedgerLines(untillCourseNumber + 1))
            // FRENCH
        } else {
            // if (untillCourseNumber <= 7 && this.staff.lines.length >= untillCourseNumber+1) return true
            return false
        }
    }


 
}