export type TRezTabFileInfo = {
    instruments: Instrumnet[]
    tabType: `tab.lute.${TabType}`,
    filename: string,
    createdAt: Date,
    // tuning?: TabCourseTuningInfo[]
    title?: string,
    altTitle?: string,
    
}


export enum Instrumnet {
    LUTE = "lute",
    

}

export enum TabType {
    FRENCH = "french",
    GERMAN = "german",
    ITALIAN = "italian"

}




export type TNoteInfo = {
    course?: number
    fret?: number
    id?: string
    xmlId?: string

}

export type TabCourseTuningInfo = {
    n: number,
    pname?: string,
    oct?: number
}

export type TCourseInfo = {
    tuning?: TabCourseTuningInfo;
    number: number
}
export type TStaffInfo = {
    linesCount: number
    tabType: TabType,
    n?: number
    notationType?: `tab.lute.${TabType}`
    tuning?: TabCourseTuningInfo[]
}

export type TSectionInfo = {
    staves: TStaffInfo[]
}

export type DurNum = 1|2|4|8|16|32|64


export type TTimeSignature = `${number}-${number}`