import { useDoc } from "@/composables/useDoc";
import MeiAttribute from "./mei-modules/MeiAttribute";
import MeiTag, { TMeiTagFactoryArgs } from "./mei-modules/MeiTag";
import TabGroup from "./TabGroup";
import { DurNum, TabType, TNoteInfo } from "./types";
import { generateId } from "./utils";
export default class Note extends MeiTag {
    static FRENCH_TAB_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm']
    static FRENCH_TAB_UNICODES = ['\uEBC0', '\uEBC1', '\uEBC2', '\uEBC3', '\uEBC4', '\uEBC5', '\uEBC6', '\uEBC7', '\uEBC8', '\uEBC9', '\uEBCA', '\uEBCB', '\uEBCC']
    static FRENCH_TAB_DIAPAZONES_UNICODES = ['\uEBCD', '\uEBCE', '\uEBCF', '\uEBD0'] // 7 8 9 10
    static ITALIAN_TAB_UNICODES = ['\uEBE0', '\uEBE1', '\uEBE2', '\uEBE3', '\uEBE4', '\uEBE5', '\uEBE6', '\uEBE7', '\uEBE8', '\uEBE9', '\uEBE1\uEBE0', '\uEBE1\uEBE1', '\uEBE1\uEBE2', '\uEBE1\uEBE3', '\uEBE1\uEBE4']
    tagTitle = 'note';
    debugData: any;
    static MAX_FRET_INPUT = 14
    getDoc() {return this.tabGroup.getDoc()}
    setAttributes(): void {
        this.setAttribute(new MeiAttribute('tab.course', (this.course || 0)))
        this.setAttribute(new MeiAttribute('tab.fret', this.fret!))
        if (this.xmlId) this.setAttribute({ title: 'xml:id', value: this.xmlId })
    }
    isSelected = false;
    updateChildren(): MeiTag {
        return this as MeiTag;
    }
    getFretToShow() {
        // 
        const tabType = this.tabGroup.staff.getTabType();
        if (!this.fret && this.fret != 0) return ''
        else if (tabType == TabType.FRENCH && this.course! >= 7 && this.fret == 0) return Note.FRENCH_TAB_DIAPAZONES_UNICODES[Number(this.course) - 7]
        else if (tabType == TabType.FRENCH && this.fret != undefined) return Note.FRENCH_TAB_UNICODES[Number(this.fret)]

        else return Note.ITALIAN_TAB_UNICODES[Number(this.fret)] //this.fret
    }
    private _fret?: number;
    set fret(v: number | undefined | string) {
        const vNum = Number(v)
        if (v == undefined || v && isNaN(vNum)) {
            this._fret = Note.FRENCH_TAB_LETTERS.indexOf(v as string) > -1 ? Note.FRENCH_TAB_LETTERS.indexOf(v as string) : undefined
        } else if (!v || v && vNum <= Note.MAX_FRET_INPUT) {
            this._fret = vNum
        }
    }
    get fret() { return this._fret }
    updateSelectionMode(mode = true) {
        this.isSelected = mode
        this.tabGroup.updateSelectionMode();
        if (mode) this.el?.classList.add('selected')
        else this.el?.classList.remove('selected')
    }

    static fromMeiFactoryArgs(tabGroup: TabGroup, arg: TMeiTagFactoryArgs) {

        const info: TNoteInfo = {};
        arg.attributes?.forEach(at => {
            if (at.title == 'tab.course') info.course = Number(at.value)
            else if (at.title == 'tab.fret') info.fret = Number(at.value)
        })

        const instance = new Note(tabGroup, info);
        return instance;

    }
    focus() {
        this.setupEl()
        setTimeout(() => {

            // const el = document.querySelector('#' + this.xmlId) as HTMLInputElement;
            // if (el) el.focus()
            this.el?.focus()
        }, 50)
    }
    el?: HTMLElement;
    tabGroup: TabGroup;
    // fret?: number

    // id: number|string;
    course?: number;
    constructor(tabGroup: TabGroup, info?: TNoteInfo) {
        super();
        this.tabGroup = tabGroup
        this.id = Number(info?.id) || undefined
        // this.xmlId = info?.xmlId || generateId();
        this.setXmlId(info?.xmlId || generateId());
        // this.id = this.xmlId
        this.fret = info?.fret;
        this.course = info?.course;
        setTimeout(this.setupEl.bind(this), 100)
    }
    changeDuration(durnum: DurNum) {
        this.tabGroup.setDur(durnum);
    }

    static validCourseIndicator(someCourseNumber: string | undefined | number) {
        return !isNaN(Number(someCourseNumber))
    }
    
    setupEl() {
        this.el = document.querySelector('.note-input#' + this.xmlId)!
        if (!this.el && !this.fret) return;
        if (!this.el) {
            // console.error('no el found for this id: ', this.xmlId, this.tabGroup.getIndexInPiece())

        }
    }
    isInSelectionHighliterRange(range: number[]) {
        const bcr = this.el?.getBoundingClientRect();
        if (!bcr) return;

        const { x: initialx, y: initialy } = bcr;
        const x = initialx + window.scrollX
        const y = initialy + window.scrollY
        const isInRange = x >= range[0] && x <= range[2] && y >= range[1] && y <= range[3]
        return isInRange
    }

    getDebugData() {
        // if (!this.el) return;
        // this.setupEl()
        // const bcr = this.el.getBoundingClientRect();
        // const { x: initialx, y: initialy } = bcr;
        // const x = initialx + window.scrollX
        // const y = initialy + window.scrollY
        // return [this.el, x, y]
        return this.debugData
    }
    static validFretIndicator(somefret: string | undefined | number) {
        if ([0, '0'].includes(somefret!)) return true
        // if (somefret == '') somefret = undefined
        return (!!somefret && !isNaN(Number(somefret))) //(typeof somefret == 'number' ) ||  (somefret != undefined) && (typeof somefret == 'string' && somefret.trim())
    }

    isThere() {
        return Note.validCourseIndicator(this.course) && Note.validFretIndicator(this.fret)
    }
    /**1 for nextCourse -1 for previous course */
    getNeighbour(courseDiff: number) {
        const neighbour = this.tabGroup.notes.find(n => n.course == (this.course || 0) + courseDiff);
        return neighbour
    }

    getAboveNote() {
        return this.getNeighbour(1);
    }
    getBelowNote() {

        return this.getNeighbour(-1);
    }

    getRightNote() {
        console.log('wanna get %cRight %cNote', 'font-weight: bold; padding: 1rem; background-color: blue; color: white;', 'color: inherit; font-weight: normal;');
        const nextTabgroupNote =  this.tabGroup.getNeighbour(1)?.notes.find(n => n.course == this.course)
        const nextMasureFirstNote =  this.getNextMeasureFirstNote()
        const rightNote = nextTabgroupNote || nextMasureFirstNote
            
            console.log(this.tabGroup.staff.measure.n);
            
        return rightNote

    }
    getLeftNote() {
        return this.tabGroup.getNeighbour(-1)?.notes.find(n => n.course == this.course)
            || this.getPrevMeasureLastNote()
    }

    getNextMeasureFirstNote() {
        return this.tabGroup.getNextMeasureFirstNote(this.course);
    }
    getPrevMeasureFirstNote() {
        return this.tabGroup.getPrevMeasureFirstNote(this.course);
    }
    getPrevMeasureLastNote() {
        return this.tabGroup.getPrevMeasureLastNote(this.course);
    }

    softDelete() {
        useDoc().snapshot();
        this.fret = undefined
    }


    // clone(): Note {
    //     const n = new Note(this.tabGroup);
    //     n.course = this.course;
    //     n.fret = Number(this.fret);
    //     // n.setupEl();
    //     return n
    // }

}