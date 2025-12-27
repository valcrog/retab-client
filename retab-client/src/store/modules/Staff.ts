import { useStore } from "vuex";
import store from "..";
import Measure from "./Measure"
import MeiAttribute from "./mei-modules/MeiAttribute";
import MeiTag, { TMeiTagFactoryArgs } from "./mei-modules/MeiTag";
import RezTabFile from "./RezTabFile";
import TabGroup from "./TabGroup";
import { TabCourseTuningInfo, TabType, TCourseInfo } from "./types";
import Note from "./Note";
import { generateId } from "./utils";
import Layer from "./Layer";
import { useDoc } from "@/composables/useDoc";

export default class Staff extends MeiTag {
    tagTitle = 'staff';
    static DEFAULT_TUNING: TabCourseTuningInfo[] = [
        {n: 1 , pname: "g" , oct: 4}, 
        {n: 2 , pname: "d" , oct: 4},
        {n: 3 , pname: "a" , oct: 3},
        {n: 4 , pname: "f" , oct: 3},
        {n: 5 , pname: "c" , oct: 3},
        {n: 6 , pname: "g" , oct: 2},
        {n: 7 , pname: "f" , oct: 2},
        {n: 8 , pname: "eb" , oct: 2},
        {n: 9 , pname: "d" , oct: 2},
        {n: 10 , pname: "c" , oct: 2},
        {n: 11 , pname: "bb" , oct: 1},
        {n: 12 , pname: "a" , oct: 1},
        {n: 13 , pname: "g" , oct: 1},
        {n: 14 , pname: "f" , oct: 1},
   
    ]
    n?: number
    measure: Measure;
    linesCount = 6
    constructor(measure: Measure, info?: { linesCount: number }, n = 1) {
        super();
        this.measure = measure
        this.linesCount = info?.linesCount || this.linesCount;
        this.n = n
        this.initLines()
        this.reorderLines(this.getTabType())
    }
    getAllNotes(justTheExistingOnes = true): Note[] {
          return this.tabGroups.reduce((sf: Note[], tg) => [...sf, ...tg.getAllNotes(justTheExistingOnes)], [])
    }

    getDoc() {
        return this.measure.getDoc();
    }
    setTabgroupsIncludeDurAttribute(mode: boolean) {
        this.tabGroups.forEach(t => t.setIncludeDurAttribute(mode))
    }
    getLayer(index = 0) {
        if (!this.layers[index]){
            this.layers.push(new Layer(this))
        }
        return this.layers[index]
    }
    get tabGroups(): TabGroup[] {
        return this.getLayer().tabGroups
    }

    set tabGroups(tgs: TabGroup[]) {
        this.getLayer().tabGroups = tgs
    }
    static getDefaultTuning(number: number) {
        const found =  this.DEFAULT_TUNING.find(c => c.n == number);
        if (!found) console.error(`cannot find a tuning for number: `, number, this.DEFAULT_TUNING)
        return {n: found?.n || number, pname: found?.pname || "", oct: found?.oct || 0}
    }
    setLinesCount(c: number) { 
        this.linesCount = c;
    }
    getTabType() {
        // when there's only one staff:
        return this.measure.section.getDoc().getTabType();
    }

    removeLine(lineN: number) {
        this.linesCount--;

        const index = this.lines.indexOf(this.lines.find(l => l.courseInfo.number == lineN)!)

        this.lines.splice(index, 1);
        this.measure.sortSelfAndSiblingsLines()
        
        
    }
    sortLines() {

        this.lines = this.lines.sort((a, b) => {
            return b.courseInfo.number - a.courseInfo.number})
            .map((line, index, arr) => {
                line.setCourseNumber(arr.length - index);
                if (line.courseInfo.number <= 6 ) line.isLedgerLine = false

                return line
        })


    }

    setTuning() {
        this.measure.section.info.staves[0].linesCount = this.linesCount;


    }
    
    lines: StaffLine[] = []
    layers: Layer[] = []
    setAttributes(): void {
        if (this.n) this.attributes.push(new MeiAttribute('n', this.n!))
    }
    updateChildren(): MeiTag {
        this.children = this.layers.map(l => l.updateChildren());
        return this
    }
 
    addLine(){

        this.linesCount++;
        const newLine = new StaffLine(this, {
            number: this.linesCount,
            tuning: Staff.getDefaultTuning(this.linesCount)
        })
        this.lines.push(newLine) 
        this.measure.sortSelfAndSiblingsLines()
        
        return newLine

    }
    private initLines() {
        const foundStaffInfo = this.measure.section.info.staves.find(si => si.n == this.n)
        const docTuning = this.measure.section.getDoc().getTuning(!this.n ? 0 : this.n-1)
        
        // 
        this.lines = new Array(this.linesCount)
            .fill(null).map((i, index) => {
                const number = this.linesCount - index
                const foundTuning = docTuning?.find(t => t.n == number);
                
                
                return new StaffLine(this,   {number, tuning: foundTuning} )})

    }

    initializeTabgroups(tabGroupJsonXmlElements: TMeiTagFactoryArgs[]) {
        return
        
        // if (!this.lines.length) this.initLines();
        // this.tabGroups = tabGroupJsonXmlElements.map(tje => {
        //     return TabGroup.fromMeiFactoryArgs(this.getLayer(), tje)
        // })

    }

    static fromMeiFactoryArgs(measure: Measure, arg: TMeiTagFactoryArgs) {
                const instance =  new Staff(measure, {
            linesCount: measure.section.getDoc().docSettings.linesCount// measure.section.info.staves[0].linesCount
        });
                instance.id = arg.id
        
        // instance.setAttribute(new MeiAttribute('xml:id', arg.attributes?.find(a => a.title == 'xml:id')?.value || generateId()))
        instance.setXmlId( arg.attributes?.find(a => a.title == 'xml:id')?.value || generateId())
        if (arg.children?.length) instance.layers = arg.children
            .map(lje => Layer.fromMeiFactoryArgs(instance, lje));
        return instance;
    }

    initEmptyStaff() {
        this.initEmptyStaffLayer();
        return this;
    }
    initEmptyStaffLayer() {
        if (!this.layers.length)  {
            this.layers.push(new Layer(this, 1))
            this.layers[0].initEmptyLayerTabgroups()
            
        }
        return this.layers[0]
    }

    
    // init() {
    //             // this.linesCount = this.info.staves[0].linesCount
    //     // this.initLines()
    //     //ITALIAN:
    //     // this.addTabGroup();
    //     this.initEmptyStaff()
    //     // this.reorderLines(this.getTabType())
    //     return this;
    // }
    

    insertTabGroup(index?: number, tgToAdd?: TabGroup) {
        
        console.log('staff is Adding Tabgroup', tgToAdd);
  
        console.log(this.measure.wrongSize);
        let newOne: TabGroup;
        if (this.measure.wrongSize < 0) {
                  newOne = tgToAdd ||  new TabGroup(this.getLayer())
            this.addTabGroup(newOne, index)
        } else {
            // /next measure push to first/
            console.log(this.measure.getNeighbour(1)?.n);
            const nextMeasure = this.measure.getNeighbour(1) || this.measure.section.addMeasure(this.measure.section.measures.indexOf(this.measure) + 1);
            
            newOne = tgToAdd ||  new TabGroup(nextMeasure.getStaffFromN(this.n)?.getLayer() as Layer)
            const correspondingStaff = nextMeasure.getStaffFromN(this.n)
            correspondingStaff?.addTabGroup(newOne, 0)
        }

        return newOne
    }

    addTabGroup(tgToAdd: TabGroup, index?: number) {
        if (!index && index != 0) this.tabGroups.push(tgToAdd);
        else this.tabGroups.splice(index, 0, tgToAdd)
        
        this.updateChildren();
        this.getDoc().updateUI()
    }

    removeTabgroup(tg: TabGroup) {
        this.getDoc().snapshot();
        const index = this.tabGroups.indexOf(tg)
        this.tabGroups.splice(index, 1)
        // this.tabGroups.splice(1, 1);
        // this.updateChildren();
        
        if (this.tabGroups.length == 0) this.measure.remove();
        const doc = this.measure.section.getDoc()
        doc.setupNotesEls();
        doc.updateUI();

    }

    cleanupTabGroups() {

        
        this.tabGroups.forEach(tg => tg.cleanup());
    }
    // toJsonXmlElement(): MeiJsonElem {
    //     const superResult = super.toJsonXmlElement();
    //     // superResult.children = [
    //     //     new MeiJsonElem({
    //     //         attributes: [new MeiAttribute('n', 1)],
    //     //         children: superResult.children,
    //     //         tagTitle: 'layer',
    //     //     })
    //     // ]
    //     return superResult;
    // }
    insertTabgroupBefore(tg: TabGroup, tgToAdd?: TabGroup) {
        let index = this.tabGroups.indexOf(tg)

        if (index < 0) index = 0
        return this.insertTabGroup(index, tgToAdd)
    }

    insertTabgroupAfter(tg: TabGroup, tgToAdd?: TabGroup) {
        
        let index = this.tabGroups.indexOf(tg)
        
        if (index < 0) index = 0
        return this.insertTabGroup(index + 1, tgToAdd)
    }
    reorderLines(tabType: TabType) {
        if (tabType == TabType.ITALIAN) this.lines = this.lines.sort((a, b) => b.courseInfo.number - a.courseInfo.number)
            else if (tabType == TabType.FRENCH) this.lines = this.lines.sort((a, b) => a.courseInfo.number - b.courseInfo.number)
                
    }


}

export class StaffLine {
    staff: Staff;
    courseInfo: TCourseInfo
    tuning: TabCourseTuningInfo
    isLedgerLine = false;
    constructor(staff: Staff, courseInfo: TCourseInfo) {
        // 
        this.courseInfo = courseInfo
        this.staff = staff
        
        this.tuning = courseInfo.tuning || Staff.getDefaultTuning(this.courseInfo.number);
        if (courseInfo.number > 6) this.isLedgerLine = true
    }


    remove() {
        this.staff.removeLine(this.courseInfo.number)
    }

    setCourseNumber(n: number) {
        this.courseInfo.number = n
        if (this.tuning) {
            this.tuning.n = this.courseInfo.number
            this.courseInfo.tuning = this.tuning
        } 
    }

}


export class LedgerLine extends StaffLine {
    
}