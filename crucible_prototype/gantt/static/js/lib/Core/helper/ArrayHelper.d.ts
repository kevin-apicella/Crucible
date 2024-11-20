export default class ArrayHelper {

    static clean(array : any[]) : any[]

    static from(iterable : any[], filter : () => boolean, map : (any) => any) : any[]

    static remove(array : any[], ...items) : boolean

    static findInsertionIndex(item, array : any[], comparatorFn? : (a, b) => -1 | 0 | 1, index? : number) : number

    static findLast(array : any[], fn : (item) => boolean, thisObj : any) : any

    static binarySearch(array : any[], item, begin? : number, end? : number, compareFn? : (a, b) => number) : number

    static fill(count : number, itemOrArray, fn? : (item) => any) : any[]

    static populate(count : number, fn : () => any, oneBased?) : any[]

    static include(array : any[], item) : any[]

    static unique(array : any[]) : any[]

    static asArray(arrayOrObject) : any[]
}
