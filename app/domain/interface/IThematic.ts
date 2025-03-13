/**
 * @Project Summarised
 * @File IThematic.ts
 * @Path app/domain/interface
 * @Author BRICE ZELE
 * @Date 02/04/2023
 */
export interface ICategory {
    id: string
    title: string
    color: string
}

export interface ITopic {
    id: string
    title: string
}

export interface IThematic {
    id: number
    title: string
    items: Array<ICategory>
}

export interface IAchievment {
    title: string
    component: any
    icon_name: string
    size: number
}
