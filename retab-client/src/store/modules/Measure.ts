import MeiAttribute from "./mei-modules/MeiAttribute";
import MeiTag, { TMeiTagFactoryArgs } from "./mei-modules/MeiTag";
import Note from "./Note";
import Section from "./Section";
import Staff, { StaffLine } from "./Staff";
import { TTimeSignature } from "./types";

export default class Measure extends MeiTag {
    getDoc() {
        return this.section.getDoc();
    }

    updateChildren(): MeiTag {
        this.children = this.staves.map(s => s.updateChildren());
        return this;
    }
    staves: Staff[] = []
    tagTitle = 'measure';
    n: number;

    get timeSignature(): TTimeSignature | undefined {
        return this.section.timeSignature
    }

    get totalDuration(): number {
        return this.staves[0].tabGroups.reduce((sum, t) => sum + t.durationToWholeNote, 0)
    }
    get wrongSize(): 0|-1|1 {
        if (!this.getDoc().docSettings.fixedMeasures || !this.timeSignature) return 0
        const exec = /(\d+)-(\d+)/.exec(this.timeSignature)
        const timeSinatureToWholeNote = Number(exec?.[1] || 0) / Number(exec?.[2] || 1)
        const diff =this.totalDuration - timeSinatureToWholeNote 
        return diff == 0 ? 0: diff>0 ?  1 : -1
    }
    setAttributes(): void {
        this.attributes.push(
            new MeiAttribute('n', this.n)
        )
    }


    showTimeSignature() {
        return (this.n == 1) && (this.getDoc().docSettings.fixedMeasures)
    }

    getAllNotes(justTheExistingOnes = true): Note[] {
        return this.staves.reduce((sf: Note[], s) => [...sf, ...s.getAllNotes(justTheExistingOnes)], [])
    }
    section: Section
    // linesCount = 6
    setTabgroupsIncludeDurAttribute(mode: boolean) {
        this.staves.forEach(s => s.setTabgroupsIncludeDurAttribute(mode))
    }

    constructor(section: Section, n: number) {

        super();
        this.section = section
        this.init();
        this.setN(n)
        this.n = n
    }
    initializeEmptyMeasureStaff() {
        this.addEmptyStaff();
    }
    initializeStaves(staffJsonXmlElements: TMeiTagFactoryArgs[]) {
        // if (!staffJsonXmlElements) this.addStaff();
        // else {
        this.staves = staffJsonXmlElements.map(sje => Staff.fromMeiFactoryArgs(this, sje))
        // }
        return this;

    }
    static fromMeiFactoryArgs(section: Section, arg: TMeiTagFactoryArgs) {

        const instance = new Measure(section, Number(arg.attributes?.find(a => a.title == 'n')?.value))//.initializeStaves(arg.children)
        instance.id = arg.id;
        const argXmlId = arg.attributes?.find(a => a.title == 'xml:id')?.value || 'XMLIDNOTFOUND'
        // instance.xmlId = argXmlId
        // instance.setAttribute(new MeiAttribute('xml:id', argXmlId))
        instance.setXmlId(argXmlId)
        if (arg.children?.length) instance.initializeStaves(arg.children);
        return instance;
    }
    findCurrentStaff(note: Note) {
        // this will be implemented later; we are returning the only staff our measure has, for now.
        return this.staves[0]


    }
    setN(n: number) {
        this.n = n;
        this.setAttribute({ title: 'n', value: this.n + '' })
    }
    sortSelfAndSiblingsLines(staffIndex = 0) {
        this.section.measures.forEach(m => m.sortLines(staffIndex));
        setTimeout(() => this.section.unfreeze(), 500)
    }
    sortLines(staffIndex = 0) {
        this.staves[staffIndex].sortLines()
    }
    init() {

        // this.linesCount = this.staff.linesCount
        // this.linesCount = this.section.info.staves[0].linesCount
        // this.lines = new Array(this.linesCount).fill(null).map((i, index) => new StaffLine(this, { number: index }))
        // this.initializeStaves();
        this.initializeEmptyMeasureStaff();
        return this
    }
    remove() {
        this.section.removeMeasure(this)
    }
    addEmptyStaff(n = 1) {
        const linesCount = this.section.getDoc().getLinesCount()// this.section.info.staves[n-1].linesCount  //this.section.getDoc().docSettings // previously: 
        this.staves.push(new Staff(this, {
            linesCount
            // linesCount: this.section.getDoc().docSettings.linesCount // this.section.info.staves[0].linesCount
        }, n).initEmptyStaff())
    }

    cleanupTabGroups() {
        this.staves.forEach(s => s.cleanupTabGroups())
    }


    getStaffFromN(n = 1) {
        return this.staves.find(s => s.n == n)
    }

    /**1 for next measure -1 for previous  measure */
    getNeighbour(diff: number): Measure | undefined {
        const thisIndex = this.section.measures.indexOf(this);
        return this.section.measures[thisIndex + diff]
    }
}