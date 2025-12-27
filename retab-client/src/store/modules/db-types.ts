import { TRezTabFileInfo } from "./types"



export type TDbDocSettings = {
    doc?: TRezTabFileInfo
    id?: number
    docId?: number
    defaultFirstTabgrpDurSymShow?: boolean
    tabgroupsIncludeDurAttribute?: boolean
    fixedMeasures?: boolean
    proportionInclude?: boolean
    proportionNum?: number | null
    proportionNumbase?: number | null
    proportionSign?: string | null
    proportionSlash?: number | null
}
export type TTabCourseTuningInfo = {
    staves?: TStaffInfo[]
    id?: number
    n: number
    pname: string
    oct: number
    relatedXmlId?: string
}
export type TTuningPreset = {
    tuning?: TTabCourseTuningInfo[]
    id?: number
    title?: string | null
}
/**====================================================== */
export type TUser = {
    docs?: TRetabDoc[]
    id?: number
    name?: string
    username?: string
    password?: string | null
    email?: string | null
    encoderHeaders?: TEncoderHeader[]
}

export type TInstrument = {
    staves?: TStaffInfo[]
    id?: number
    title?: string
}

export type TRetabDoc = {

    user?: TUser
    mainChild?: TMeiTag | null
    stavesInfo?: TStaffInfo[]
    id?: number
    title?: string
    altTitle?: string
    userId?: number
    mainChildId?: number | null
    lastModifiedAt?: Date | string
    filename?: string
    createdAt?: Date | string
    settings?: TDocSettings
}

export type TStaffInfo = {
    doc?: TRetabDoc
    instrument?: TInstrument
    instrumentId?: number | null;
    tuning?: TTabCourseTuningInfo[]
    id?: number
    docId?: number
    n?: number
    linesCount?: number | null
    notationType?: string
}



export type TMeiTag = {
    attributes?: TMeiAttribute[]
    children?: TMeiTag[]
    parent?: TMeiTag | null
    doc?: TRetabDoc | null
    id?: number
    tagTitle?: string
    selfClosing?: boolean
    textContent?: string | null
    xmlId?: string
    indexAmongSiblings?: number
    parentId?: number | null
    docId?: number | null
    encoderHeaderRelated?: TEncoderHeader
}

export type TMeiAttribute = {
    containerTag?: TMeiTag
    id?: number
    title?: string
    value?: string | null
    containerTagId?: number
}


// export type TTabCourseTuningInfo = {
//         n: number,
//         pname: string,
//         oct: number
//     }


export type TDocSettings = {
    doc?: TRetabDoc
    id?: number
    docId?: number
    defaultFirstTabgrpDurSymShow?: boolean
    tabgroupsIncludeDurAttribute?: boolean
    fixedMeasures?: boolean
    proportionInclude?: boolean
    proportionNum?: number | null
    proportionNumbase?: number | null
    proportionSign?: string | null
    proportionSlash?: number | null
}






export type TEncoderHeader = {
    user?: TUser
    headerTag?: TMeiTag
    id?: number
    userId?: number
    headerTagId?: number
}

/**====================================================== */