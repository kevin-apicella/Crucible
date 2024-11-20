import Base from '../Base.js';
import Store from './Store.js';
import StateTrackingManager from './stm/StateTrackingManager.js';

export default class Model extends Base {
    id                  : string | number

    // TODO
    meta                : any

    isModel             : boolean

    internalId          : string | number
    generation          : number

    static fields?      : any[]

    fields              : any[]
    fieldMap            : Record<string, any>

    stores              : Store[]

    readonly firstStore : Store

    data                : object
    originalData        : object

    modifications       : Partial<this>
    rawModifications    : Partial<this>

    parent              : this
    children            : this[]
    firstChild          : this
    lastChild           : this
    previousSibling     : this
    nextSibling         : this

    childLevel          : number
    parentIndex         : number

    indexPath           : number[]
    wbsCode             : string

    isLeaf              : boolean
    isPhantom           : boolean
    isRoot              : boolean

    isBatchUpdating     : boolean

    isDestroyed         : boolean
    isDestroying        : boolean
    isLoading           : boolean

    stm                 : StateTrackingManager

    configure (config : object) : void

    constructor (...args : any[])

    construct (data? : object, store? : Store, meta? : object, skipExpose? : boolean, processingTree? : boolean) : void

    afterConstruct () : void
    afterConfigure () : void

    get (fieldName : string) : any
    set (fieldName : string | object, value? : any, silent? : boolean) : object
    setData (toSet : object | string, value? : any) : void
    getData (fieldName : string) : any

    applyValue (useProp : boolean, key : string, value : any, skipAccessors : boolean, field : any) : void
    afterChange (toSet : any, wasSet : any, silent : boolean, fromRelationUpdate : boolean, skipAccessors : boolean) : void

    joinStore (store : Store) : void
    unjoinStore (store : Store, isReplacing : boolean) : void

    appendChild<T extends Model> (child : T|T[]) : T|T[]|null
    insertChild<T extends Model> (child : T|T[], before? : T) : T|T[]|null
    removeChild<T extends Model> (childRecords : T|T[], isMove? : boolean, silent? : boolean) : T[]

    remove (silent? : boolean) : void

    traverse (fn : (node : this) => void, skipSelf? : boolean, includeFilteredOutRecords? : boolean) : void
    bubble (fn : (node : this) => void, skipSelf? : boolean) : void

    contains<T extends Model>(childOrId : T | string | number, skipSelf? : boolean) : boolean

    getFieldDefinition (fieldName : string) : object
    getFieldDefinitionFromDataSource (dataSource : string) : any
    getFieldPersistentValue (fieldName : string|object) : any
    static getFieldDataSource (fieldName : string) : string

    copy (newId : this[ 'id' ], deep : any) : this

    beginBatch (silentUpdates? : boolean) : void
    endBatch (silent? : boolean, skipAccessors? : boolean, triggerBeforeUpdate? : boolean): void
    cancelBatch (): void

    afterSet (field : string | object, value : any, silent : boolean, fromRelationUpdate : boolean, wasSet : any) : void

    isFieldModified (field : string) : boolean
    isModified () : boolean
    get isValid () : boolean

    storeFieldChange (key : string, oldValue : any) : void
    revertChanges () : void
    clearChanges (includeDescendants? : boolean)
    internalClearChanges (includeDescendants? : boolean, removeFromStoreChanges? : boolean, changes? : object)

    shouldRecordFieldChange (fieldName : string, oldValue : any, newValue : any) : boolean

    get $original() : Model

    // TODO
    triggerBeforeUpdate (...args : any[]) : any

    toJSON () : object
}
