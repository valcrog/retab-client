import store from "..";
import { TDbDocSettings, TUser } from "./db-types";
import MeiDocGenerator from "./mei-modules/MeiDocGenerator";
import MeiHead from "./mei-modules/MeiHead";
import MeiTag, { TMeiTagFactoryArgs } from "./mei-modules/MeiTag";
import Note from "./Note";
import Section from "./Section";
import {
  DurNum,
  Instrumnet,
  TabType,
  TRezTabFileInfo,
  TStaffInfo,
} from "./types";
import axios from "axios";
import { downloadJsonDataAsFile, generateId } from "./utils";
import {
  HARD_CODED_HEADER_ARGS,
  HARD_CODED_HEADER_EMPTY_ARGS,
} from "./mei-modules/head-args";
import router from "@/router";

type DocSetttings = {
  linesCount: number;
  defaultFirstTabgrpDurSymShow: boolean;
  tabgroupsIncludeDurAttribute: boolean;
  proportion: {
    include: boolean;
    num: number;
    numbase: number;
    sign?: "C";
    slash?: 1;
  };
};

export default class RezTabFile {
  private undoStack: string[] = [];
  private redoStack: string[] = [];

  info: TRezTabFileInfo;
  docSettings: DocSetttings = {
    linesCount: 6,
    defaultFirstTabgrpDurSymShow: true,
    tabgroupsIncludeDurAttribute: true,
    proportion: { include: false, num: 3, numbase: 2 },
  };
  id?: number;
  head?: MeiHead;
  section: Section;
  private _lastFocusedNote: (Note | undefined);
  noteFocusKey = 0;
  set lastFocusedNote(n: Note | undefined) {
    this.noteFocusKey++;
    this._lastFocusedNote = n
  }
  get lastFocusedNote() {return this._lastFocusedNote || undefined}

  // measures: Measure[] = []
  constructor(info: TRezTabFileInfo) {
    this.info = info;
    this.section = new Section(this, [], {
      staves: [
        {
          n: 1,
          tabType: TabType.ITALIAN,
          linesCount: this.docSettings.linesCount!,
        },
      ],
    });
    this.section.initializeDefaultTuning();
    this.setTabgroupsIncludeDurAttribute(
      this.docSettings.tabgroupsIncludeDurAttribute
    );
  }

  toggleTabgroupsIncludeDurAttribute() {
    this.docSettings.tabgroupsIncludeDurAttribute =
      !this.docSettings.tabgroupsIncludeDurAttribute;

    this.setTabgroupsIncludeDurAttribute(
      this.docSettings.tabgroupsIncludeDurAttribute
    );
  }
  setTabgroupsIncludeDurAttribute(mode: boolean) {
    this.section.setTabgroupsIncludeDurAttribute(mode);
  }
  updateDocSettings() {
    this.section.info.staves[0].linesCount = this.docSettings.linesCount;
  }
  unfreeze() {
    this.section.measures.forEach((meausre) => {
      meausre.staves.forEach((staff) => {
        staff.tabGroups.forEach((tabgroup) => {
          tabgroup.notes = staff.lines.map((l) => {
            const c = l.courseInfo.number;

            return (
              tabgroup.getNoteOnCourse(c) ||
              new Note(tabgroup, { course: c })
            );
          });
        });
      });
    });


  }
  init() {
    /**just testing for now */
    this.section.addMeasure();
    this.initializeHead();
    return this;
  }

  async save() {
    /**
     * we want to:
     *  -   clean up the tabgroups
     *  -   make mei elements and wrap them inside their parents
     *  -   export the mei file
     */
    // this.cleanupTabGroups();
    const section = this.section;
    const jsonXmlElement = await MeiDocGenerator.generateJsonElem(section);
    this.head?.removeEmptyChildren();
    const headJsonXmlElement = this.head
      ? await MeiDocGenerator.generateJsonElem(this.head)
      : undefined;
    // return ;
    const jsonXmlElementParsed = JSON.parse(JSON.stringify(jsonXmlElement));

    const stavesInfo = this.section.getStavesInfo();
    // const options = {
    //    tuning: stavesInfo[0].tuning
    // }
    const fileInfo: TRezTabFileInfo = this.info;

    type TRetabDocDBType = {
      instruments?: any[];
      stavesInfo?: TStaffInfo[];
      title?: string;
      userId?: number;
      filename?: string;
    };
    // LOOK AT THE ABOVE!
    this.info.title = this.head?.getWorkTitle();
    this.info.altTitle = this.getAltTitle();
    const docInfo: TRetabDocDBType = {
      stavesInfo: this.section.getStavesInfo(),
      ...this.info,
    };
    const reqBody = {
      sectionJsonXmlElement: jsonXmlElementParsed,
      docId: this.id,
      headJsonXmlElement: headJsonXmlElement,
      docInfo,
      docSettings: this.docSettings,
    };

    // return;
    const jsonResult = await axios.post(
      process.env.VUE_APP_API_URL + "/retab/doc/" + (this.id || "new"),
      reqBody
    );
    return jsonResult.data;
  }

  static async getInstanceFromServer(id: number) {
    const someResponse = (
      await axios.get(process.env.VUE_APP_API_URL + "/retab/doc/" + id)
    ).data;
    const doc = new RezTabFile({
      createdAt: someResponse.createdAt,
      filename: someResponse.filename,
      instruments: someResponse.instruments,
      tabType: someResponse.stavesInfo?.map((si: any) => si.notationType)?.[0],
      title: someResponse.title,
      altTitle: someResponse.altTitle,
      // tuning: someResponse.stavesInfo?.map((si: any )=> si.tuning)?.[0],
    });
    doc.id = someResponse.id;
    doc.setLinesCount(someResponse.stavesInfo[0].tuning.length);
    doc.initializeSection(
      someResponse.sectionJsonXmlElement,
      someResponse.stavesInfo
    );
    doc.initializeHead(someResponse.headJsonXmlElement);
    doc.unfreeze();
    if (someResponse.settings) doc.assignSettings(someResponse.settings);
    return doc;
  }
  assignSettings(settings: TDbDocSettings) {
    this.docSettings.defaultFirstTabgrpDurSymShow =
      settings.defaultFirstTabgrpDurSymShow ||
      this.docSettings.defaultFirstTabgrpDurSymShow;
    this.docSettings.proportion.include =
      settings.proportionInclude || this.docSettings.proportion.include;
    this.docSettings.proportion.num =
      settings.proportionNum || this.docSettings.proportion.num;
    this.docSettings.proportion.numbase =
      settings.proportionNumbase || this.docSettings.proportion.numbase;
    this.docSettings.proportion.sign = (settings.proportionSign ||
      this.docSettings.proportion
        .sign) as this["docSettings"]["proportion"]["sign"];
    this.docSettings.proportion.slash = (settings.proportionSlash ||
      this.docSettings.proportion
        .slash) as this["docSettings"]["proportion"]["slash"];
    this.docSettings.tabgroupsIncludeDurAttribute =
      settings.tabgroupsIncludeDurAttribute ||
      this.docSettings.tabgroupsIncludeDurAttribute;
  }
  getAltTitle() {
    return this.head
      ?.__("fileDesc")
      .__("titleStmt")
      .__("title[type=Alternative]")?.textContent;
  }
  getTitle() {
    const title =
      this.info.title ||
      this.head?.__("fileDesc")?.__("titleStmt")?.__("title[type=main]")
        .textContent;
    return title;
  }
  setLinesCount(count: number, staffIndex = 0) {
    this.docSettings.linesCount = count;
    this.section.info.staves[staffIndex].linesCount = count;
  }
  getLinesCount(staffIndex = 0) {
    if (staffIndex == 0) return this.docSettings.linesCount;
    else return this.section.info.staves[staffIndex].linesCount;
  }
  async generateMEI() {
    if (!this.id) return alert("save it first!");
    const xmlResult = (
      await axios.get(process.env.VUE_APP_API_URL + "/retab/doc/" + this.id, {
        params: { fileType: "mei" },
      })
    ).data;
    return xmlResult;
  }

  async initializeHead(fetchedHead?: TMeiTagFactoryArgs) {
    try {
      this.head = new MeiHead(fetchedHead || HARD_CODED_HEADER_EMPTY_ARGS);
      this.head.setAllChildrenParent()
    } catch (err) {
      return;
    }
  }

  initializeSection(
    fetchedSection?: TMeiTagFactoryArgs,
    stavesInfo?: TStaffInfo[]
  ) {


    if (fetchedSection) {
      this.section = Section.fromMeiFactoryArgs(
        this,
        fetchedSection,
        stavesInfo
      );
      // this.section.setAttribute(
      //   new MeiAttribute(
      //     "xml:id",
      //     fetchedSection.attributes?.find((a) => a.title == "xml:id")?.value ||
      //     generateId()
      //   )
      // );
    } else {
      return;
      // this.section = this.section
    }
  }

  getAllNotes(justTheExistingOnes = true): Note[] {
    return this.section.getAllNotes(justTheExistingOnes);
  }

  getFocusedNote() {
    const id = document.activeElement?.id;
    return (
      (!id ? undefined : this.getAllNotes(false).find((n) => n.xmlId == id)) ||
      this.lastFocusedNote
    );
  }

  // private cleanupTabGroups() {
  //     this.measures.forEach(s => s.cleanupTabGroups())
  // }

  // static prettifyXmlFile(input: string) {
  //     try {

  //         const xmlDoc = new DOMParser().parseFromString(input, 'application/xml');
  //         const xsltDoc = new DOMParser().parseFromString([
  //         // describes how we want to modify the XML - indent everything
  //         '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
  //         '  <xsl:strip-space elements="*"/>',
  //         '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
  //         '    <xsl:value-of select="normalize-space(.)"/>',
  //         '  </xsl:template>',
  //         '  <xsl:template match="node()|@*">',
  //         '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
  //         '  </xsl:template>',
  //         '  <xsl:output indent="yes"/>',
  //         '</xsl:stylesheet>',
  //     ].join('\n'), 'application/xml');

  //     const xsltProcessor = new XSLTProcessor();
  //     xsltProcessor.importStylesheet(xsltDoc);
  //     const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  //     const resultXml = new XMLSerializer().serializeToString(resultDoc);
  //     return resultXml;
  //         } catch (err) {
  //
  //             console.error('there is some error inporting XSLT DOC at prettyfy Xml file; continuing with ugly xml file for now :)')
  //             return input
  //         }
  // }
  static download(text: string, filename = "result.mei") {
    const xml = text; // const xml = this.prettifyXmlFile(text)
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(xml)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    // document.body.removeChild(element)
  }

  turnOnDefaultFirstTabgroupDurSymShow(options?: {
    resetEachMeasure: boolean;
  }) {
    let prev:
      | {
        dur: DurNum | null;
        dots?: number;
      }
      | undefined = { dur: null, dots: undefined };
    this.section.measures.forEach((m) => {
      m.staves.forEach((s) => {
        s.tabGroups.forEach((t) => {
          let isFirst = false;

          const curr = {
            dots: t.getDurDots(),
            dur: t.dur,
          };
          if (!prev) isFirst = true;
          else {
            isFirst = !(prev.dur == curr.dur && prev.dots == (curr.dots || 0));
          }
          prev = { dur: curr.dur, dots: curr.dots };
          if (isFirst == true) t.showTabDurSym = true;
        });
      });
      if (options?.resetEachMeasure) prev = undefined;
    });
  }
  getTuning(staffIndex = 0) {
    return this.section.info.staves[staffIndex].tuning;
  }

  setupNotesEls() {
    setTimeout(() => {
      this.getAllNotes().forEach((n) =>
        /**n.xmlId && (n.el?.id == n.xmlId) || */ n.setupEl()
      );
    }, 2);
  }

  getTabType(): TabType {
    return String(this.info.tabType).match(/\.(\w*)$/)?.[1] as TabType;
  }
  private async changeTabType(tabType: TabType, staffIndex: number) {
    this.info.tabType = `tab.lute.${tabType}`;
    const staff = this.section.info.staves[staffIndex];
    staff.tabType = tabType;
    staff.notationType = `tab.lute.${tabType}`;
    await this.reorderStaffLines();
  }
  async setTabType(tabType: TabType, staffIndex = 0) {
    await this.changeTabType(tabType, staffIndex);
    await new Promise((r) => setTimeout(r, 500));
    this.updateUI();
  }
  async reorderStaffLines(staffIndex = 0) {
    const tt = this.getTabType();
    for (const measure of this.section.measures) {
      measure.staves[staffIndex].reorderLines(tt);
    }
  }
  updateUI() {
    if (store) {
      store.state.utils.keyCoefficient++;
    }
  }
  
  async generateAndDownloadMei() {
    const result = await this.generateMEI();
    const altTitle = this.getAltTitle();

    RezTabFile.download(result, altTitle ? altTitle + ".mei" : undefined);
    this.unfreeze();
  }

  static async instanceFromXmlString(xmlString?: string) {
    if (!xmlString) throw new Error("there is no xml string");
    const parsed = parseXml(xmlString);
    const title = parsed.querySelector('title[type=main]')?.textContent || '';
    const altTitle = parsed.querySelector('title[type=alternative]')?.textContent || '';
    const tabType = parsed.querySelector('staffDef')?.getAttribute('notationtype') as `tab.lute.${TabType}`

    const p: TabType = TabType.FRENCH;
    const head = MeiTag.instanceFromXmlElement(parsed.querySelector('meiHead')!) as MeiHead
    const doc = new RezTabFile({
      title,
      createdAt: new Date(),
      filename: '',
      instruments: [Instrumnet.LUTE],
      tabType,
      altTitle,
    })
    const section = MeiTag.instanceFromXmlElement(parsed.querySelector('section')!) as Section;
    head.setAllChildrenParent();
    section.setAllChildrenParent();
    
    await doc.initializeHead(head);
    await doc.initializeSection(section, [{
      linesCount: parsed.querySelector('tuning')?.children.length || 0,
      tabType: /tab.lute.(.w*)/.exec(tabType)?.[1] as TabType,
      n: 1,
      notationType: tabType,
      tuning: (Array.from(parsed.querySelector('tuning')?.children || []) || []).map(el => ({
        n: Number(el.getAttribute('n') || 0),
        pname: el.getAttribute('pname') + (el.getAttribute('accid') || ''),
        oct: Number(el.getAttribute('oct') || 0),
      }))
    }])

    store.state.currentDoc = doc;
    router.push('doc/imported')
    function parseXml(readResult: string) {
      const parser = new DOMParser();
      const xml = parser.parseFromString(readResult, "text/xml");
      return xml;
    }
  }


  snapshot() {
    this.redoStack = [];
    this.undoStack.push(this.serialize())
    this.updateUI();
    this.unfreeze();
  }

  getNoteById(xmlId?: string) {
    return this.getAllNotes().find(n => n.xmlId == xmlId)
  }

  private serialize() {
    const head = this.head?.toJsonXmlElement();
    const section = this.section.toJsonXmlElement({ keepEmptyNotes: true });
    const sectionInfo = this.section.info
    const docSettings = this.docSettings
    const info = this.info;
    const state = JSON.stringify({
      head, section, docSettings, info, sectionInfo, focusedNoteId: this.lastFocusedNote?.xmlId
    })
    //  this.redoStack = [];
    return state;
  }
  undo() {

    if (this.undoStack.length == 0) return;
    const prevState = this.undoStack.pop();

    this.redoStack.push(this.serialize());

    this.restore(prevState!);
    this.updateUI();


  }

  private async restore(serialized: string) {
    const parsed = JSON.parse(serialized);


    this.lastFocusedNote = this.getNoteById(parsed.focusedNoteId)
    this.info = parsed.info;
    this.docSettings = parsed.docSettings;
    await this.initializeHead(parsed.head)
    this.initializeSection(parsed.section, parsed.sectionInfo?.staves);
    this.updateUI();
    const focusedNote = this.getNoteById(parsed.focusedNoteId);
    setTimeout(() => {
      focusedNote?.setupEl()
      focusedNote?.focus();
    }, 50)
  }

  redo() {
    if (this.redoStack.length === 0) return;

    const nextState = this.redoStack.pop()!;
    this.undoStack.push(this.serialize());

    this.restore(nextState);
    this.updateUI();
  }
}