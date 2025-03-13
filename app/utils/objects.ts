/**
 * @Project Summarised
 * @File objects.ts
 * @Path app/utils
 * @Author BRICE ZELE
 * @Date 16/04/2023
 */
export function getKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as Array<keyof T>
}
