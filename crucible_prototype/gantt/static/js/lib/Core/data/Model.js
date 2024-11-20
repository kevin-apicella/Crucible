import Base from '../Base.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';
import ModelStm from './stm/mixin/ModelStm.js';
import TreeNode from './mixin/TreeNode.js';
import ModelLink from './mixin/ModelLink.js';
import DataField from './field/DataField.js';

// The built-in model field types:
import './field/ArrayDataField.js';
import './field/BooleanDataField.js';
import './field/DateDataField.js';
import './field/DurationUnitDataField.js';
import './field/IntegerDataField.js';
import './field/ModelDataField.js';
import './field/NumberDataField.js';
import './field/ObjectDataField.js';
import './field/StoreDataField.js';
import './field/StringDataField.js';

/**
 * @module Core/data/Model
 */

const
    nestedRe = new RegExp(/^(.*?)\.(.*)/),
    arrayRe  = /(.*)\[(.*)]\.?(.*)/;

/**
 * Defines the properties of a relation between two stores.
 *
 * Used as the values of a Model's {@link Core.data.Model#property-relations-static} definition.
 *
 * This snippet will define a relation called `team`, allowing access to the foreign record via `player.team`. It will
 * point to a record in the `teamStore` (must be available as `record.firstStore.teamStore)` with an id matching the
 * players `teamId` field. The team record in turn, will have a field called `players` which is a collection of all
 * players in the team.
 *
 * ```javascript
 * class Player extends Model {
 *     static relations = {
 *         team : {
 *             foreignKey            : 'teamId',
 *             foreignStore          : 'teamStore',
 *             relatedCollectionName : 'players'
 *         }
 *     }
 * }
 * ```
 *
 * See {@link Core.data.Model#property-relations-static} for a more extensive example.
 *
 * @typedef {Object} RelationConfig
 * @property {String} foreignKey Name of a field on this model which holds the foreign key value.
 * @property {String|Core.data.Store} foreignStore Name of a property on the model's first store, which holds the
 * foreign store. Or the actual store instance
 * @property {String} [relatedCollectionName] Optionally, name of a property that will be added to the records of the
 * foreign store, which will hold all records from the model's store related to it.
 * @property {Boolean} [propagateRecordChanges] Set to `true` to propagate record changes (add, remove, update) to the
 * related records stores. The related stores will in turn trigger an update event which makes it possible for the UI
 * to react.
 */

const
    { defineProperty } = Reflect,
    { hasOwn }         = ObjectHelper,
    _undefined         = undefined,
    internalProps      = {
        children : 1,
        data     : 1,
        meta     : 1
    },
    abbreviationFields = [
        'name',
        'title',
        'text',
        'label',
        'description'
    ],
    fieldDataTypes = {
        boolean : 1,
        number  : 1,
        date    : 1,
        object  : 1
    },
    fieldsOrder = {
        parentId   : 1,
        $PhantomId : 2,
        id         : 3
    };

/**
 * A Model is the definition of a record which can be added to (or loaded into) a {@link Core.data.Store}. It defines
 * which fields the data contains and exposes an interface to access and manipulate that data. The Model data is
 * populated through simple a JSON object.
 *
 * By default, a Model stores a shallow copy of its raw json, but for records in stores configured with
 * `useRawData: true` it stores the supplied json object as is.
 *
 * ## Defining fields
 *
 * A Model can either define its fields explicitly (see {@link #property-fields-static}) or have them created from its
 * data (see {@link #property-autoExposeFields-static}). This snippet shows a model with 4 fields defined explicitly:
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         'name',
 *         { name : 'birthday', type : 'date', format : 'YYYY-MM-DD' },
 *         { name : 'shoeSize', type : 'number', defaultValue : 11 },
 *         { name : 'age', readOnly : true }
 *     ]
 * }
 * ```
 *
 * The first field (name) has an unspecified type, which means the field's value is held as received with no conversion
 * applied. The second field (birthday) is defined to be a date, which will make the model parse any supplied value into
 * an actual date. The parsing is handled by {@link Core/helper/DateHelper#function-parse-static DateHelper.parse()}
 * using the specified `format`, or if no format is specified using
 * {@link Core/helper/DateHelper#property-defaultFormat-static DateHelper.defaultFormat}.
 *
 * While defining `fields` on {@link Core.data.Model} in TypeScript, data fields should be of type `ModelFieldConfig`
 * instead of `DataField`, because it is a union type that gives completion based on specified type.
 *
 * ```typescript
 * class Person extends Model {
 *     static fields: Partial<ModelFieldConfig>[] = [
 *         'name',
 *         { name : 'birthday', type : 'date', format : 'YYYY-MM-DD' },
 *         { name : 'shoeSize', type : 'number', defaultValue : 11 },
 *         { name : 'age', readOnly : true }
 *     ]
 * }
 * ```
 *
 * The set of standard field types is as follows:
 *
 *  - {@link Core.data.field.ArrayDataField `array`}
 *  - {@link Core.data.field.BooleanDataField `boolean`}
 *  - {@link Core.data.field.DateDataField `date`}
 *  - {@link Core.data.field.IntegerDataField `integer`}
 *  - {@link Core.data.field.ObjectDataField `object`}
 *  - {@link Core.data.field.NumberDataField `number`}
 *  - {@link Core.data.field.StoreDataField `store`}
 *  - {@link Core.data.field.StringDataField `string`}
 *
 * You can also set a `defaultValue` that will be used if the data does not contain a value for the field:
 *
 * ```javascript
 * { name : 'shoeSize', type : 'number', defaultValue : 11 }
 * ```
 *
 * To create a record from a Model, supply data to its constructor:
 *
 * ```javascript
 * let guy = new Person({
 *     id       : 1,
 *     name     : 'Dude',
 *     birthday : '2014-09-01'
 * });
 * ```
 *
 * If no id is specified, a temporary id based on a UUID will be generated. This id is not meant to be serialized, it
 * should instead be replaced by the backend with a proper id from the underlying database (or similar).
 *
 * Please avoid using reserved names for your fields (such as `parent`, `children` and others that are used as Model
 * properties) to avoid possible data collisions and bugs.
 *
 * ## Nested fields
 *
 * Model supports mapping fields to nested data structures using dot `.` separated paths as the `dataSource`. For
 * example given this JSON object:
 *
 * ```json
 * {
 *     name : 'Borje Salming',
 *     team : {
 *         name   : 'Toronto Maple Leafs',
 *         league : 'NHL'
 *     }
 * }
 * ```
 *
 * A field can be mapped to the nested team name by using `dataSource : 'team.name'`:
 *
 * ```javascript
 * class Player extends Model {
 *     static fields = [
 *         'name',
 *         // Field mapped to a property on a nested object
 *         { name : 'teamName', dataSource : 'team.name' }
 *     ];
 * }
 * ```
 *
 * Usage:
 *
 * ```javascript
 * const player = new Player(json);
 *
 * console.log(player.teamName); // > Toronto Maple Leafs
 * player.teamName = 'Minnesota Wild'; // Updates name property of the team object
 * ```
 *
 * Alternatively, you can define the top level of the nested object as a field of type `object`:
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         'name',
 *         // Nested object
 *         { name : 'address', type : 'object' }
 *     ];
 * }
 * ```
 *
 * You can then access properties of the nested object using dot notation with the {@link #function-get} function:
 *
 * ```javascript
 * const person = new Person({
 *    name    : 'Borje Salming',
 *    address : {
 *        city : 'Toronto'
 *    }
 * });
 *
 * person.get('address.city'); // > Toronto
 * ```
 *
 * ### Updating a nested object
 *
 * Note that directly altering a property of the nested object won't register as an update of the record, record does
 * not track changes deeply. If nested fields (as described above) is not enough for your usecase you can map a field
 * directly to the nested object and then assign a shallow copy of it to the record on changes:
 *
 * ```javascript
 * class Player extends Model {
 *     static get fields() {
 *         return [
 *             ...,
 *             // Field mapped directly to the nested object
 *             { name : 'team', type : 'object' }
 *         ]
 *     }
 * }
 *
 * // "External object" to nest
 * const team = {
 *     name   : 'Brynas',
 *     league : 'SHL'
 * }
 *
 * const player = new Player({
 *     name : 'Borje Salming',
 *     team
 * });
 *
 * // This will not flag player as dirty
 * team.league = 'CHL';
 *
 * // Instead you have to reassign the mapped field
 * player.team = { ...player.team };
 * ```
 *
 * You can also use the {@link #function-set} function to update a property of the nested object:
 *
 * ```javascript
 * // This will flag player as dirty
 * player.set('team.name', 'BIF');
 * ```
 *
 * ## Arrays of atomic types
 *
 * When a field holds an array of atomic types (strings, numbers etc.) we recommend using the
 * {@link Core/data/field/ArrayDataField `array`} type for the field:
 *
 * ```javascript
 * class GroceryList extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'items', type : 'array' }
 *         ];
 *     }
 * }
 *
 * const list = new GroceryList({
 *    name  : 'My list',
 *    items : ['Milk', 'Bread', 'Eggs']
 * });
 * ```
 *
 * {@note}Modifying items in the array will not flag the field as updated, since the array itself does not
 * change. For it to register a change, you must assign it a new array (could be a copy of the old one). For more info,
 * see {@link Core/data/field/ArrayDataField}{/@note}
 *
 * ## Arrays of objects
 *
 * When a field holds an array of objects, we recommend using the {@link Core/data/field/StoreDataField `store`} type
 * for the field:
 *
 * ```javascript
 * class GroceryList extends Model {
 *     static fields = [
 *         'name',
 *         { name : 'items', type : 'store', storeClass : Store }
 *     ]
 * }
 *
 * const list = new GroceryList({
 *    name  : 'My list',
 *    items : [
 *        { name : 'Milk', quantity : 1 },
 *        { name : 'Bread', quantity : 2 },
 *        { name : 'Eggs', quantity : 12 }
 *    ]
 * });
 * ```
 *
 * The `items` field on the `list` above will be a {@link Core.data.Store} instance (because we passed that as
 * `storeClass`), which can be used to manipulate the items in the list. Doing so will flag the `list` as modified. For
 * more info, see {@link Core.data.field.StoreDataField}.
 *
 * ## Persisting fields
 *
 * By default, all fields are persisted. If you don't want particular field to get saved to the server, configure it
 * with `persist: false`. In this case field will not be among changes which are sent by
 * {@link Core/data/AjaxStore#function-commit store.commit()}, otherwise its behavior doesn't change.
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'age', persist : false }
 *         ];
 *     }
 * }
 * ```
 *
 * ## The `id` field
 * By default Model expects its id field to be stored in a data source named "id". The data source for the id field can
 * be customized by setting {@link Core/data/field/DataField#config-dataSource} on the id field object configuration.
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         { name : 'id', dataSource: 'personId'},
 *         'name',
 *         { name : 'age', persist : false },
 *         { name : 'birthday', type : 'date' }
 *      ];
 * }
 *
 * let girl = new Person({
 *     personId : 2,
 *     name     : 'Lady',
 *     birthday : '2011-11-05'
 * });
 * ```
 *
 * Also, it is possible to change the id field data source by setting {@link #property-idField-static}:
 *
 * ```javascript
 * class Person extends Model {
 *     // Id drawn from 'id' property by default; use custom field here
 *     static idField = 'personId';
 *
 *     static fields = [
 *         'name',
 *         { name : 'age', persist : false },
 *         { name : 'birthday', type : 'date' }
 *     ];
 * }
 * ```
 *
 * ## Getting and setting values
 *
 * Fields are used to generate getters and setters on the records. Use them to access or modify values (they are
 * reactive):
 *
 * ```javascript
 * console.log(guy.name);
 * girl.birthday = new Date(2011,10,6);
 * ```
 *
 * NOTE: In an application with multiple different models you should subclass Model, since the prototype is decorated
 * with getters and setters. Otherwise, you might get unforeseen collisions.
 *
 * ## Field data mapping
 *
 * By default, fields are mapped to data using their name. If you for example have a "name" field it expects data to be
 * `{ name: 'Some name' }`. If you need to map it to some other property, specify `dataSource` in your field definition:
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields {
 *         return [
 *             { name : 'name', dataSource : 'TheName' }
 *         ];
 *     }
 * }
 *
 * // This is now OK:
 * let dude = new Person({ TheName : 'Manfred' });
 * console.log(dude.name); // --> Manfred
 * ```
 *
 * ## Field inheritance
 *
 * Fields declared in a derived model class are added to those from its superclass. If a field declared by a derived
 * class has also been declared by its super class, the field properties of the super class are merged with those of
 * the derived class.
 *
 * For example:
 * ```javascript
 *  class Person extends Model {
 *      static get fields() {
 *          return [
 *              'name',
 *              { name : 'birthday', type : 'date', format : 'YYYY-MM-DD' }
 *          ];
 *      }
 *  }
 *
 *  class User extends Person {
 *      static get fields() {
 *          return [
 *              { name : 'birthday', dataSource : 'dob' },
 *              { name : 'lastLogin', type : 'date' }
 *          ];
 *      }
 *  }
 * ```
 *
 * In the above, the `Person` model declares the `birthday` field as a `date` with a specified `format`. The `User`
 * model extends `Person` and also declares the `birthday` field. This redeclared field only specifies `dataSource`, so
 * all the other fields are preserved from `Person`. The `User` model also adds a `lastLogin` field.
 *
 * The `User` from above could have been declared like so to achieve the same `fields`:
 *
 * ```javascript
 *  class User extends Model {
 *      static get fields() {
 *          return [
 *              'name',
 *              { name : 'birthday', type : 'date', format : 'YYYY-MM-DD', dataSource : 'dob' },
 *              { name : 'lastLogin', type : 'date' }
 *          ];
 *      }
 *  }
 * ```
 *
 * ## Override default values
 *
 * In case you need to define default value for a specific field, or override an existing default value, you can
 * define a new or re-define an existing field definition in {@link #property-fields-static} static getter:
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             { name : 'username', defaultValue : 'New person' },
 *             { name : 'birthdate', type : 'date' }
 *         ];
 *     }
 * }
 *
 * class Bot extends Person {
 *     static get fields() {
 *         return [
 *             { name : 'username', defaultValue : 'Bot' } // default value of 'username' field is overridden
 *         ];
 *     }
 * }
 * ```
 *
 * ## Read-only records
 *
 * Model has a default field called {@link #field-readOnly}, which is used to make the record read-only in the UI while
 * still allowing programmatic changes to it. Setting it to `true` will prevent it from being edited by the built-in
 * editing features (cell editing in Grid, event draging in Scheduler, task editor in Gantt etc.). Please note that it
 * is not made read-only on the data level, the record can still be manipulated by application code.
 *
 * ```javascript
 * // Prevent record from being manipulated by the user
 * record.readOnly = true;
 *
 * // Programmatic manipulation is still allowed
 * record.remove();
 * ```
 *
 * ## Tree API
 *
 * This class mixes in the {@link Core/data/mixin/TreeNode TreeNode} mixin which provides an API for tree related
 * functionality (only relevant if your store is configured to be a {@link Core/data/Store#config-tree tree}).
 *
 * @mixes Core/data/mixin/ModelLink
 * @mixes Core/data/mixin/TreeNode
 * @mixes Core/data/stm/mixin/ModelStm
 */
export default class Model extends Base.mixin(ModelStm, TreeNode, ModelLink) {
    static get $name() {
        return 'Model';
    }

    static get declarable() {
        return [
            /**
             * Array of defined fields for this model class. Subclasses add new fields by implementing this static
             * getter:
             *
             * ```javascript
             * // Model defining two fields
             * class Person extends Model {
             *     static get fields() {
             *         return [
             *             { name : 'username', defaultValue : 'New person' },
             *             { name : 'birthdate', type : 'date' }
             *         ];
             *     }
             * }
             *
             * // Subclass overriding one of the fields
             * class Bot extends Person {
             *     static get fields() {
             *         return [
             *             // Default value of 'username' field is overridden, any other setting from the parents
             *             // definition is preserved
             *             { name : 'username', defaultValue : 'Bot' }
             *         ];
             *     }
             * }
             * ```
             *
             * Fields in a subclass are merged with those from the parent class, making it easy to override mappings,
             * formats etc.
             *
             * @member {Array<String|ModelFieldConfig|Core.data.field.DataField>} fields
             * @readonly
             * @static
             * @category Fields
             */
            'fields'
        ];
    }

    static get fields() {
        return [
            // The index of this item in its parent (respects filtering)
            {
                name     : 'parentIndex',
                type     : 'number',
                persist  : false,
                internal : true
            },

            // The index of this item in its parent ghost (non-sortable) children array
            {
                name     : 'orderedParentIndex',
                type     : 'number',
                persist  : false,
                internal : true
            },

            /**
             * Flag the record as read-only on the UI level, preventing the end user from manipulating it using editing
             * features such as cell editing and event dragging.
             *
             * Does not prevent altering the record programmatically, it can still be manipulated by application code.
             *
             * For more info, see the "Read-only records" section above.
             *
             * @field {Boolean} readOnly
             * @category Common
             */
            {
                name : 'readOnly',
                type : 'boolean'
            },

            /**
             * Start expanded or not (only valid for tree data)
             * @readonly
             * @field {Boolean} expanded
             * @category Tree
             */
            {
                name     : 'expanded',
                internal : true
            },

            /**
             * Only used when the store is grouped. This field references the owning group record(s), kept in a map
             * keyed by store id.
             * @internal
             * @field {Map} groupParent
             */
            {
                name     : 'groupParent',
                persist  : false,
                internal : true
            }
        ];
    }

    /**
     * Override in a subclass of Model to define relations to records in other stores.
     *
     * Always defined on the "one" side, not the "many" side.
     *
     * Expects an object where keys are relation names and values are {@link #typedef-RelationConfig relation configs}.
     *
     * This snippet will define a relation called `team`, allowing access to the foreign record via `player.team`. It
     * will point to a record in the `teamStore` (must be available as `record.firstStore.teamStore)` with an id
     * matching the players `teamId` field. The team record in turn, will have a field called `players` which is a
     * collection of all players in the team.
     *
     * ```javascript
     * class Player extends Model {
     *     static relations = {
     *         // Define a relation between a player and a team
     *         team : {
     *             foreignKey            : 'teamId',
     *             foreignStore          : 'teamStore',
     *             relatedCollectionName : 'players'
     *         }
     *     }
     * }
     *
     * const teamStore = new Store({
     *     data : [
     *         { id : 1, name : 'Brynas' },
     *         { id : 2, name : 'Leksand' }
     *     ]
     * });
     *
     * const playerStore = new Store({
     *     modelClass : Player,
     *     // Matches foreignStore, allowing records of playerStore to find the related store
     *     teamStore,
     *     data       : [
     *         // teamId is specified as foreignKey, will be used to match the team
     *         { id : 1, name : 'Nicklas Backstrom', teamId : 1  },
     *         { id : 2, name : 'Elias Lindholm',   teamId : 1  },
     *         { id : 3, name : 'Filip Forsberg',  teamId : 2  }
     *     ],
     * }
     *
     * playerStore.first.team.name // > Brynas
     * playerStore.last.team.name // > Leksand
     * teamStore.first.players // > [nick, elias]
     * teamStore.last.players // > [filip]
     * ```
     *
     * To access the related record from the many side, use dot notation for the field name. For example in a Grid
     * column:
     *
     * ```javascript
     * const grid = new Grid({
     *    store : playerStore,
     *    columns : [
     *        { field : 'name', text : 'Name' },
     *        { field : 'team.name', text : 'Team' }
     *    ]
     * });
     * ```
     *
     * @member {Object<String,RelationConfig>} relations
     * @static
     */
    static relations = null;

    /**
     * Template static getter which is supposed to be overridden to define default field values for the Model class.
     * Overrides `defaultValue` config specified by the {@link #property-fields-static} getter.
     * Returns a named object where key is a field name and value is a default value for the field.
     *
     * NOTE: This is a legacy way of defining default values, we recommend using {@link #property-fields-static} moving
     * forward.
     *
     * ```javascript
     * class Person extends Model {
     *     static get fields() {
     *         return [
     *             { name : 'username', defaultValue : 'New person' }
     *         ];
     *     }
     * }
     *
     * class Bot extends Person {
     *     static get defaults() {
     *         return {
     *             username : 'Bot' // default value of 'username' field is overridden
     *         };
     *     }
     * }
     * ```
     *
     * @member {Object} defaults
     * @static
     * @category Fields
     */


    /**
     * The data source for the id field which provides the ID of instances of this Model.
     * @property {String}
     * @category Fields
     */
    static set idField(idField) {
        this._assignedIdField = true;
        this._idField = idField;
    }

    static get idField() {
        return this._idField;
    }

    get id() {
        // Id is cached for faster access, since it is used a lot especially during record creation
        return this._id ?? this.getData('id');
    }

    set id(id) {
        this.set('id', id);
    }

    /**
     * The name of the data field which holds children of this Model when used in a tree structure
     * ```javascript
     * MyModel.childrenField = 'kids';
     * const parent = new MyModel({
     *     name : 'Dad',
     *     kids : [
     *         { name : 'Daughter' },
     *         { name : 'Son' }
     *     ]
     * });
     * ```
     * @property {String}
     * @category Fields
     */
    static set childrenField(childrenField) {
        this._childrenField = childrenField;
    }

    static get childrenField() {
        if (!this._childrenField) {
            const dataField = this.fieldMap.children;
            this._childrenField = dataField?.dataSource || 'children';
        }
        return this._childrenField;
    }

    /**
     * Returns index path to this node. This is the index of each node in the node path
     * starting from the topmost parent. (only relevant when its part of a tree store).
     * @returns {Number[]} The index of each node in the path from the topmost parent to this node.
     * @category Parent & children
     * @private
     */
    get indexPath() {
        const indices = [];

        let node = this,
            depth = node.childLevel;

        for (node = this; node && !node.isRoot; node = node.parent) {
            indices[depth--] = node.parentIndex + 1;
        }

        return indices;
    }

    /**
     * Unique identifier for the record. Might be mapped to another dataSource using idField, but always exposed as
     * record.id. Will get a generated value if none is specified in records data.
     *
     * {@note}Note that generated ids are meant to be temporary (phantom ids), they should not be serialized
     * but instead replaced by the backend on commit{/@note}
     *
     * @field {String|Number} id
     * @category Common
     */

    //region Init

    /**
     * Constructs a new record from the supplied data config.
     * @param {Object} [config] Raw model config
     * @param {Core.data.Store} [store] Data store
     * @param {Object} [meta] Meta data
     * @privateparam {Boolean} [skipExpose] Skip exposing properties from data
     * @privateparam {Boolean} [forceUseRaw] Force using raw data, used by copy to not clone data twice
     * @function constructor
     * @category Lifecycle
     */
    construct(config = {}, store = null, meta = null, skipExpose = false, forceUseRaw = false, rawData = false) {
        const
            me                        = this,
            { constructor, fieldMap } = me;

        me.meta = {
            modified : {},
            ...constructor.metaConfig,
            ...meta
        };

        // Should apply configs?
        if (constructor.applyConfigs) {
            const configs = {};

            if (!me.useRawData || !me.useRawData.enabled) {
                // Shallow copy of data to not mutate incoming object
                config = { ...config };
            }

            const defaultConfig = me.getDefaultConfiguration();

            // Here we split provided object into two: configs and fields. If we're auto-exposing fields, then we should
            // make everything which is specifically not a config into a field, so we read default configuration and
            // remove all defined configs from the passed object.
            // If we're not auto-exposing fields, then we take predefined set of fields and remove those from the passed
            // object, making everything else a config.
            // This is mostly required for ProjectModel, because it also triggers events and allows providing listeners
            // using `on...` config. And probably even more. At the same time it does not make sense for Project to have
            // autoExposed fields.
            // https://github.com/bryntum/support/issues/7457
            if (constructor.autoExposeFields) {
                // Extract from data and combine with defaultConfigs
                for (const key in defaultConfig) {
                    // Loop through configs excluding fields
                    if (key in config) {
                        // Let defaults override any config supplied with an `undefined` value
                        if (config[key] !== undefined) {
                            // Use as config
                            configs[key] = config[key];
                        }

                        // Always remove config from data
                        delete config[key];
                    }
                }
            }
            else {
                for (const key in config) {
                    if (!(key in constructor.fieldMap)) {
                        if (config[key] === undefined) {
                            // In GanttBase class we generate a default config for project model which includes
                            // `undefined` values for most configs, like `eventStore`. Previous logic replaced `undefined`
                            // with default value. If we do not do that, providing `tasks` config to a project will
                            // throw, because `eventStore` will be undefined
                            configs[key] = defaultConfig[key];
                        }
                        else {
                            configs[key] = config[key];
                        }
                        delete config[key];
                    }
                }
            }

            super.construct(configs);
        }
        else {
            // null passed to Base construct inhibits config processing.
            super.construct(null);
        }

        // make getters/setters for fields, needs to be done before processing data to make sure defaults are available
        if (!skipExpose) {
            constructor.exposeProperties(config, rawData);
        }

        // It's only valid to do this once, on construction of the first instance
        if (!hasOwn(constructor, 'idFieldProcessed')) {
            // idField can be overridden from meta, or from the store if we have not had an idField set programmatically
            // and if we have not had an id field defined above the base Model class level.

            let overriddenIdField = me.meta.idField;

            if (!overriddenIdField) {
                // Might have been set to Model after construction but before load
                if (constructor._assignedIdField) {
                    overriddenIdField = constructor.idField;
                }

                else if (store) {
                    overriddenIdField = store.idField;
                }
            }

            // If it's overridden to something different than we already have, replace the 'id' field in the fieldMap
            if (overriddenIdField && overriddenIdField !== fieldMap.id.dataSource) {
                constructor.addField({
                    name       : 'id',
                    dataSource : overriddenIdField,
                    internal   : true
                });
            }
            // Model.idField should always reflect the idField mapping
            constructor._idField = fieldMap.id.dataSource;
            constructor.idFieldProcessed = true;
        }

        // assign internalId, unique among all records
        me._internalId = Model._internalIdCounter++;

        // Superclass constructors may set this in their own way before this is called.
        if (!me.originalData) {
            me.originalData = config;
        }

        me.data = constructor.processData(config, false, store, me, forceUseRaw);

        // Cache id for faster access
        me._id = fieldMap.id.complexMapping ? ObjectHelper.getPath(me.data, constructor._idField) : me.data[constructor._idField];

        // Assign any intiable value last, so that it can reference this record if needed
        me.meta.initableValues?.size && me.assignInitables();

        // Consider undefined and null as missing id and generate one
        if (me._id == null) {
            // Assign a generated id silently, record should not be considered modified
            me.setData('id', me.generateId(store));
        }

        if (me.data[constructor.childrenField]) {
            me.processChildren(ArrayHelper.asArray(store) ?? []);
        }
        me.generation = 0;
    }

    /**
     * Set this property to `true` when adding a record on a conditional basis, that is, it is yet
     * to be confirmed as an addition.
     *
     * When this is set, the {@link #property-isPersistable} value of the record is **false**, and upon being
     * added to a Store it will *not* be eligible to be synced with the server as an added record.
     *
     * Subsequently, *clearing* this property means this record will become persistable and eligible
     * for syncing as an added record.
     * @property {Boolean}
     * @category Editing
     */
    set isCreating(isCreating) {
        const me = this;

        // A no-change must not have any effect.
        if (Boolean(me.meta.isCreating) !== isCreating) {
            // This flag contributes to the evaluation of isPersistable.
            // A record is not persistable if it isCreating.
            me.meta.isCreating = isCreating;

            // Owning Stores may have things to do at this lifecycle point
            me.stores?.forEach(s => s.onIsCreatingToggle(me, isCreating));
        }
    }

    get isCreating() {
        return Boolean(this.meta.isCreating);
    }

    /**
     * Compares this Model instance to the passed instance. If they are of the same type, and all fields
     * (except, obviously, `id`) are equal, this returns `true`.
     * @param {Core.data.Model} other The record to compare this record with.
     * @returns {Boolean} `true` if the other is of the same class and has all fields equal.
     * @category Misc
     */
    equals(other) {
        if (other instanceof this.constructor) {
            for (let fields = this.$meta.fields.defs, i = 0, { length } = fields; i < length; i++) {
                const
                    field    = fields[i],
                    { name } = field;

                if (name !== 'id' && !field.isEqual(this.getValue(name), other.getValue(name))) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    get subclass() {
        return new this.constructor(Object.setPrototypeOf({
            id : _undefined
        }, this.data), this.stores[0], null, true);
    }

    /**
     * Processes raw data, converting values and setting defaults.
     * @private
     * @param {Object} data Raw data
     * @param {Boolean} [ignoreDefaults] Ignore setting default values, used when updating
     * @returns {Object} Processed data
     * @category Fields
     */
    static processData(data, ignoreDefaults = false, store, record, forceUseRaw) {
        const
            { fieldMap, fieldDataSourceMap, defaultValues } = this,
            { useRawData = { enabled : false } } = store || { },
            // Store configured with useRawData uses the supplied data object, polluting it. When not configured with
            // useRawData it instead makes a copy (intentionally deep, in case data has a prototype chain or contains
            // arrays or objects)
            processed = (forceUseRaw || useRawData.enabled) ? data : ObjectHelper.clone(data);

        let fieldName;

        ignoreDefaults = ignoreDefaults || useRawData.disableDefaultValue || forceUseRaw;

        if (!ignoreDefaults) {
            for (fieldName in defaultValues) {
                const field = fieldDataSourceMap[fieldName];

                let defaultValue = defaultValues[fieldName];

                // Avoid sharing arrays across instances
                if (Array.isArray(defaultValue)) {
                    defaultValue = defaultValue.slice();
                }

                if (field?.complexMapping) {
                    if (ObjectHelper.getPath(processed, fieldName) === _undefined) {
                        ObjectHelper.setPath(processed, fieldName, defaultValue);
                    }
                }
                else if (processed[fieldName] === _undefined) {
                    processed[fieldName] = defaultValue;
                }
            }
        }

        if (!useRawData.disableTypeConversion && !forceUseRaw) {
            // Convert field types which need converting
            for (fieldName in fieldMap) {
                const
                    field                = fieldMap[fieldName],
                    { name, dataSource } = field,
                    // Value might have been supplied either using mapped dataSource (when loading JSON etc. for example
                    // event.myStartDate) or as field name (from internal code, for example event.startDate). If [name]
                    // exists but not [dataSource], use it.
                    hasSource            = dataSource !== name,
                    complex              = field.complexMapping,
                    sourceExists         = hasSource && (complex
                        ? ObjectHelper.pathExists(data, dataSource)
                        : dataSource in data),
                    useNameForValue      = (name in data) && (!hasSource || !sourceExists),
                    convert              = !useRawData.disableTypeConversion && field.convert;

                // Only action field definitions which have a convert function or remap data
                if (useNameForValue || convert) {
                    // When ignoringDefaults, do not convert unspecified values
                    if (!ignoreDefaults || useNameForValue || sourceExists) {
                        const
                            value     = useNameForValue
                                ? processed[name]
                                : complex
                                    ? ObjectHelper.getPath(processed, dataSource)
                                    : processed[dataSource],
                            converted = convert ? field.convert(value, data, record) : value;

                        if (complex) {
                            ObjectHelper.setPath(processed, dataSource, converted);
                        }
                        else {
                            processed[dataSource] = converted;
                        }

                        // Remove [startDate] from internal data holder, only keeping [myStartDate]
                        if (hasSource) {
                            delete processed[name];
                        }
                    }
                }
            }
        }

        // Fields that needs initializing
        this.$meta.fields.initable.length && this.initInitables(record, processed);

        return processed;
    }

    static setupClass(meta) {
        super.setupClass(meta);

        if (!meta.fields) {
            // Normally setupFields will only run when a Model defines a fields getter, but we want to always run it:
            this.setupFields(this, meta);
        }
    }

    static setupFields(cls, meta) {
        const
            classFields = hasOwn(cls, 'fields') && cls.fields,
            base        = meta.super.fields,
            fieldsInfo  = meta.fields = {
                defs : base?.defs.slice() ?? [],

                // Set to true when an instance's data object is run through exposeProperties
                exposedData : false,

                // These objects are all keyed by field name:
                defaults : base ? { ...base.defaults } : {}, // value=field.defaultValue
                exposed  : Object.create(base?.exposed  ?? null),   // value=true if we've done defineProperty
                ordinals : Object.create(base?.ordinals ?? null),   // value=index in the defs array
                map      : Object.create(base?.map      ?? null),   // value=definition object
                sources  : Object.create(base?.sources  ?? null)    // value=source definition object
            };

        // We use Object.create(null) as the base for these maps because some models declare "constructor" as a field
        // NOTE: instead of chaining the defaults, we copy them so the defaults object can be used with Object.assign
        // in other contexts (since it does not copy inherited properties from the prototype chain)

        // Clone the superclass's defaults, and override that with our own defaults.
        // As we find fields with a defaultValue, more defaults may be added
        if (hasOwn(cls, 'defaults')) {
            Object.assign(fieldsInfo.defaults, cls.defaults);
        }

        // Hook up our field maps with the class hierarchy's fieldMaps.
        // We need to be able to look up field definitions by the name, or by the dataSource property name

        // If the idField is overridden at this level, create a new field
        if (hasOwn(cls, 'idField')) {
            cls.addField({
                name       : 'id',
                dataSource : cls.idField,
                internal   : true
            });
            fieldsInfo.exposed[cls.idField] = true;
        }

        // Process fields defined in the class definition
        if (classFields?.length) {
            classFields.map(cls.addField, cls);
        }

        // Collect fields that need to be initialized (StoreDataField for example)
        fieldsInfo.initable = fieldsInfo.defs.filter(field => field.init);

        cls.exposeRelations();
    }

    static get defaultValues() {
        return this.$meta.fields.defaults;
    }

    /**
     * An array containing all the _defined_ fields for this Model class. This will include all superclass's
     * defined fields.
     * @property {Core.data.field.DataField[]}
     * @static
     * @readonly
     * @category Fields
     */
    static get allFields() {
        return this.$meta.fields.defs;
    }

    /**
     * Same as {@link #property-allFields-static}.
     * @property {Core.data.field.DataField[]}
     * @readonly
     * @category Fields
     */
    get allFields() {
        return this.$meta.fields.defs;
    }

    /**
     * An object containing all the _defined_ fields for this Model class. This will include all superclass's
     * defined fields through its prototype chain. So be aware that `Object.keys` and `Object.entries` will only
     * access this class's defined fields.
     * @property {Object<String,Core.data.field.DataField>}
     * @static
     * @readonly
     * @category Fields
     */
    static get fieldMap() {
        return this.$meta.fields.map;
    }

    /**
     * Same as {@link #property-fieldMap-static}.
     * @property {Object<String,Core.data.field.DataField>}
     * @readonly
     * @category Fields
     */
    get fieldMap() {
        return this.$meta.fields.map;
    }

    static get fieldDataSourceMap() {
        return this.$meta.fields.sources;
    }

    /**
     * Makes getters and setters for fields (from definitions and data). Called once when class is defined and once when
     * data is loaded first time.
     * @internal
     * @param {Object} [data] Raw data
     * @param {Boolean} [raw=true] True if data is raw (contains data sources), False if data contains field names
     * @category Fields
     */
    static exposeProperties(data, raw = true) {
        const
            me               = this,
            fieldsInfo       = me.$meta.fields,
            // exposeProperties method is called from two different places: from the model constructor which receives
            // field names, and from store loadData method, which handles raw data. When loading data to store we need
            // to use names as specified in the dataSource. And when calling a model constructor we need to use field
            // names
            fieldMapProperty = raw ? 'exposed' : 'map';

        // Process the raw data properties and expose them as fields unless the property name
        // has already been used by the "dataSource" of a defined field.
        if (data && me.autoExposeFields && !fieldsInfo.exposedData) {
            let dataProperty, fieldDef, type;

            for (dataProperty in data) {
                // We need to skip children field because it can be `true` and that would create boolean field.
                // See https://github.com/bryntum/support/issues/2705
                if (!fieldsInfo[fieldMapProperty][dataProperty] && dataProperty !== me.childrenField) {
                    type = ObjectHelper.typeOf(data[dataProperty]);

                    // Create a field definition in our fieldMap with the flag that it's from data
                    fieldDef = {
                        name       : dataProperty,
                        dataSource : dataProperty,
                        fromData   : true
                    };

                    if (fieldDataTypes[type]) {
                        fieldDef.type = type;
                    }

                    me.addField(fieldDef);
                }
            }

            fieldsInfo.exposedData = true;
        }

        me.exposeRelations();
    }

    /**
     * Add a field definition in addition to those predefined in `fields`.
     * @param {String|ModelFieldConfig} fieldDef A field name or definition
     * @category Fields
     */
    static addField(fieldDef) {
        if (fieldDef == null) {
            return;
        }

        if (typeof fieldDef === 'string') {
            fieldDef = {
                name : fieldDef
            };
        }

        const
            me                = this.initClass(),
            fieldsInfo        = me.$meta.fields,
            { ordinals }      = fieldsInfo,
            propertiesExposed = fieldsInfo.exposed,
            { name }          = fieldDef,
            existing          = fieldsInfo.map[name],
            dataSource        = fieldDef.dataSource || (fieldDef.dataSource = name);

        let field, key;

        if (!existing || (fieldDef.type && fieldDef.type !== existing.type)) {
            field = DataField.create(fieldDef);
            field.definedBy = existing ? existing.definedBy : me;
            field.ordinal = existing ? existing.ordinal : (ordinals[name] = fieldsInfo.defs.length);
        }
        else {
            field = Object.create(existing);

            for (key in fieldDef) {
                if (key !== 'type') {
                    field[key] = fieldDef[key];
                }
            }
        }

        field.owner = me;
        fieldsInfo.defs[field.ordinal] = field;
        fieldsInfo.map[name] = field;

        if (!fieldsInfo.sources[dataSource]) {
            fieldsInfo.sources[dataSource] = field;
        }

        // With complex mapping avoid exposing object as model field
        if (dataSource.includes('.')) {
            field.complexMapping = true;

        }
        if (field.complexMapping) {  // model fields have this set on their prototype...
            propertiesExposed[dataSource.split('.')[0]] = true;
        }
        else {
            // When iterating through the raw data, if autoExposeFields is set
            // We do not need to create properties for raw property names we've processed here
            propertiesExposed[dataSource] = true;
        }

        // Maintain an object of defaultValues for fields.
        if ('defaultValue' in field) {
            fieldsInfo.defaults[dataSource] = field.defaultValue;
        }

        // Create a property on this Model's prototype, named for the defined field name
        // which reads the correct property out of the raw data object.
        if (!internalProps[name]) {
            // Either creates a new accessor or redefines an existing
            field.defineAccessor(me.prototype);
        }

        me._nonPersistableFields = null;
        me._alwaysWriteFields = null;

        return field;
    }

    /**
     * Remove a field definition by name.
     * @param {String} fieldName Field name
     * @category Fields
     */
    static removeField(fieldName) {
        const
            me = this.initClass(),
            fieldsInfo = me.$meta.fields,
            definition = fieldsInfo.map[fieldName],
            { ordinals } = fieldsInfo,
            index = ordinals[fieldName];

        if (definition) {
            fieldsInfo.defs.splice(index, 1);

            delete ordinals[fieldName];
            delete fieldsInfo.defaults[fieldName];
            delete fieldsInfo.exposed[fieldName];
            delete fieldsInfo.map[fieldName];
            delete fieldsInfo.sources[definition.dataSource];

            for (const name in ordinals) {
                if (ordinals[name] > index) {
                    --ordinals[name];
                }
            }

            // Note: if field was exposed by superclass, this won't do anything...
            delete me.prototype[fieldName];
        }
    }

    /**
     * Makes getters and setters for related records. Populates a Model#relation array with the relations, to allow it
     * to be modified later when assigning stores.
     * @internal
     * @category Relations
     */
    static exposeRelations() {
        const me = this;

        if (hasOwn(me, 'exposedRelations')) {
            return;
        }

        if (me.relations) {
            me.exposedRelations = [];

            for (const relationName in me.relations) {
                const relation = me.relations[relationName];
                relation.relationName = relationName;
                me.exposedRelations.push(relation);

                // getter and setter for related object
                if (!Reflect.ownKeys(me.prototype).includes(relationName)) {
                    defineProperty(me.prototype, relationName, {
                        enumerable : true,
                        get        : function() {
                            // noinspection JSPotentiallyInvalidUsageOfClassThis
                            return this.getForeign(relationName);
                        },
                        set : function(value) {
                            // noinspection JSPotentiallyInvalidUsageOfClassThis
                            this.setForeign(relationName, value, relation);
                        }
                    });
                }
            }
        }
    }

    //endregion

    //region Initable fields

    // Initializes any fields using a data type that has an init method, and caches the value to assign to that field to
    // be able to assign it after all others. That allows the initter to reference the records other data if needed
    // (baselines use that to reference the task to get default values)
    static initInitables(record, processedData) {
        const laterValues = record.meta.initableValues = new Map();
        // Initialize any initializable fields (only StoreDataField currently)
        for (const field of this.$meta.fields.initable) {
            // Set data (if any) later, in case it needs to reference this record
            const value = ObjectHelper.getPath(processedData, field.dataSource);
            value !== undefined && laterValues.set(field, value);

            // Init field if not lazy, if lazy app is responsible for doing it
            !field.lazy && field.init(processedData, record);
        }
    }

    // Assigns values to the fields that were initialized earlier (see initInitables above)
    assignInitables() {
        const { initableValues } = this.meta;

        for (const [field, value] of initableValues) {
            if (field.set(value, this.data, this) !== false) {
                initableValues.delete(field);
            }
        }
    }

    //endregion

    //region Fields

    /**
     * Flag checked from Store when loading data that determines if fields found in first records should be exposed in
     * same way as predefined fields.
     *
     * {@note}Note that we for all but the most basic use cases recommend explicitly defining the fields.
     * Having them auto exposed can lead to unexpected behavior, if the first record is not complete (fields missing,
     * null etc).
     * {/@note}
     *
     * @property {Boolean}
     * @category Fields
     */
    static get autoExposeFields() {
        return true;
    }

    /**
     * This function forces correct field order. Correct order is parentId before id. If we process id field before
     * parentId, idMap won't be updated and changing parent node will lead to duplicated records in storage
     * @param {String} a
     * @param {String} b
     * @returns {number}
     * @private
     */
    static fieldSorter(a, b) {
        return (fieldsOrder[a] || 100) - (fieldsOrder[b] || 100);
    }

    /**
     * Convenience getter to get field definitions from class.
     * @property {Core.data.field.DataField[]}
     * @readonly
     * @category Fields
     */
    get fields() {
        return this.$meta.fields.defs;
    }

    /**
     * Convenience function to get the definition for a field from class.
     * @param {String} fieldName Field name
     * @returns {Core.data.field.DataField}
     * @category Fields
     */
    getFieldDefinition(fieldName) {
        return this.constructor.getFieldDefinition(fieldName);
    }

    getFieldDefinitionFromDataSource(dataSource) {
        return this.$meta.fields.sources[dataSource];
    }

    /**
     * Get the names of all fields in data.
     * @property {String[]}
     * @readonly
     * @category Fields
     */
    get fieldNames() {
        return Object.keys(this.data);
    }

    /**
     * Get the definition for a field by name.
     * @param {String} fieldName Field name
     * @returns {Core.data.field.DataField} Field definition or null if none found
     * @category Fields
     */
    static getFieldDefinition(fieldName) {
        const field = this.fieldMap[fieldName];
        if (!field) {
            if (fieldName.includes('[')) {
                const
                    // e.g. players[0].name
                    [, arrayFieldName, , path] = fieldName.match(arrayRe),
                    arrayField = arrayFieldName.includes('.')
                        ? this.getFieldDefinition(arrayFieldName)
                        : this.fieldMap[arrayFieldName];
                if (arrayField?.isStoreDataField) {
                    return arrayField.modelClass?.getFieldDefinition(path);
                }
            }
            else if (fieldName.includes('.')) {
                const
                    // e.g. coach.name
                    [localFieldName, path] = fieldName.split('.', 2),
                    modelField = this.fieldMap[localFieldName];
                if (modelField?.isModelDataField && modelField.modelClass) {
                    return modelField.modelClass.getFieldDefinition(path);
                }
            }
        }
        return field;
    }

    /**
     * Returns dataSource configuration for a given field name
     * @param {String} fieldName
     * @returns {String} Field `dataSource` mapping
     * @internal
     */
    static getFieldDataSource(fieldName) {
        return this.getFieldDefinition(fieldName)?.dataSource || fieldName;
    }

    /**
     * Get the data source used by specified field. Returns the fieldName if no data source specified.
     * @param {String} fieldName Field name
     * @returns {String}
     * @category Fields
     */
    getDataSource(fieldName) {
        const def = this.constructor.getFieldDefinition(fieldName);

        return def?.dataSource || def?.name;
    }

    /**
     * Processes input to a field, converting to expected type.
     * @param {String} fieldName Field name
     * @param {*} value Value to process
     * @returns {*} Converted value
     * @category Fields
     */
    static processField(fieldName, value, record) {
        const field = this.fieldMap[fieldName];
        return field?.convert ? field.convert(value, this.data, record) : value;
    }

    //endregion

    //region Relations

    /**
     * Initializes model relations. Called from store when adding a record.
     * @private
     * @category Relations
     */
    initRelations() {
        const
            me        = this,
            relations = me.constructor.exposedRelations;

        if (!relations) {
            return;
        }



        me.stores.forEach(store => {
            if (!store.modelRelations) {
                store.initRelations();
            }


            const relatedRecords = [];

            store.modelRelations?.forEach(config => {
                relatedRecords.push({ related : me.initRelation(config), config });
            });
            store.updateRecordRelationCache(me, relatedRecords);
        });
    }

    /**
     * Initializes/updates a single relation.
     * @param config Relation config
     * @returns {Core.data.Model} Related record
     * @private
     * @category Relations
     */
    initRelation(config) {
        const
            me            = this,
            foreignId     = me.get(config.foreignKey),
            foreign       = foreignId !== _undefined && typeof config.foreignStore !== 'string' && config.foreignStore.getById(foreignId),
            relationCache = me.meta.relationCache || (me.meta.relationCache = {});

        // apparently scheduler tests expect cache to work without matched related record, thus the placeholder
        relationCache[config.relationName] = foreign || (foreignId != null ? { id : foreignId, placeHolder : true } : null);

        return foreign;
    }

    removeRelation(config) {
        const { relationName, foreignKey, nullFieldOnRemove } = config;
        // (have to check for existence before deleting to work in Safari)
        if (this.meta.relationCache[relationName]) {
            delete this.meta.relationCache[relationName];
            if (nullFieldOnRemove) {
                // Setting to null silently, to not trigger additional relation behaviour
                this.setData(foreignKey, null);
            }
        }
    }

    getForeign(name) {
        return this.meta.relationCache?.[name];
    }

    setForeign(name, value, config) {
        const id = Model.asId(value);
        return this.set(config.foreignKey, id);
    }

    /**
     * Get a relation config by name, from the first store.
     * @param {String} name
     * @returns {Object}
     * @private
     * @category Relations
     */
    getRelationConfig(name) {
        //?
        // Using first store for relations, might have to revise later...
        return this.firstStore?.modelRelations?.find(r => r.foreignKey === name);
    }

    //endregion

    //region Get/set values, data handling

    flatGet(fieldName, dataSource) {
        // NOTE: There is an inlined copy of this fn in DataField, when changing here make sure it is updated too

        // When changes are batched, they get stored by field name, not dataSource
        if (this.batching && fieldName in this.meta.batchChanges) {
            return this.meta.batchChanges[fieldName];
        }

        return this.data[dataSource];
    }

    complexGet(fieldName, dataSource) {
        // When changes are batched, they get stored by field name, not dataSource
        if (this.batching && fieldName in this.meta.batchChanges) {
            return this.meta.batchChanges[fieldName];
        }

        return ObjectHelper.getPath(this.data, dataSource);
    }

    /**
     * Get value for specified field name. You can also use the generated getters if loading through a Store.
     * If model is currently in batch operation this will return updated batch values which are not applied to Model
     * until endBatch() is called.
     * @param {String} fieldName Field name to get value from
     * @returns {*} Fields value
     * @category Fields
     */
    get(fieldName) {
        if (!fieldName) {
            return;
        }

        const
            me           = this,
            { fieldMap } = me,
            field        = fieldMap[fieldName];

        if (!field) {
            // team.players[0], team.players[0].name
            if (fieldName.includes('[')) {
                const [, arrayFieldName, index, path] = fieldName.match(arrayRe);
                // team
                const arrayField = fieldMap[arrayFieldName];
                if (arrayField?.getAt) {
                    // Access the field to make sure it is initialized if lazy
                    me._thisIsAUsedExpression(me[arrayFieldName]);

                    // 0
                    const subRecord = arrayField.getAt(me, index);

                    // name
                    if (subRecord && path) {
                        if (subRecord.isModel) {
                            return subRecord.getValue(path);
                        }

                        return subRecord[path];
                    }

                    return subRecord;
                }

                return null;
            }

            if (fieldName.includes('.')) {
                const
                    [localFieldName, nestedFieldName] = fieldName.split('.', 2),
                    localField                        = fieldMap[localFieldName];

                // Aggregate a value from a StoreDataField?
                if (localField?.isStoreDataField) {
                    return me[localFieldName]?.getDistinctValues(nestedFieldName);
                }
                // Related record?
                else if (!ObjectHelper.hasPath(me.data, fieldName)) {
                    return ObjectHelper.getPath(me, fieldName);
                }
                // Nested data object
                return me.complexGet(fieldName, fieldName);
            }

        }

        if (field?.complexMapping) {
            return me.complexGet(fieldName, field.dataSource);
        }

        return me.flatGet(fieldName, field?.dataSource || fieldName);
    }

    // Used to get field values, replaces `record[fieldName]` in internal code to allow relations etc.
    getValue(fieldName) {
        if (!fieldName) {
            return;
        }

        // Try matching "user defined" getters
        if (fieldName in this && !fieldName.includes('.')) {
            return this[fieldName];
        }

        // Fall back to normal get
        return this.get(fieldName);
    }

    // Used to set field values, replacing `record[fieldName] = value` to handle dot notation
    setValue(fieldName, value) {
        if (fieldName in this) {
            this[fieldName] = value;
        }
        else {
            this.set(fieldName, value);
        }
    }

    /**
     * Internal function used to update a records underlying data block (record.data) while still respecting field
     * mappings. Needed in cases where a field needs setting without triggering any associated behaviour and it has a
     * dataSource with a different name.
     *
     * For example:
     * ```javascript
     * // startDate mapped to data.beginDate
     * { name : 'startDate', dataSource : 'beginDate' }
     *
     * // Some parts of our code needs to update the data block without triggering any of the behaviour associated with
     * // calling set. This would then not update "beginDate":
     * record.data.startDate = xx;
     *
     * // But this would
     * record.setData('startDate', xx);
     * ```
     * @internal
     * @category Editing
     */
    setData(toSet, value) {
        const { data, fieldMap } = this;

        // Two separate paths for performance reasons

        // setData('name', 'Quicksilver');
        if (typeof toSet === 'string') {
            const
                field      = fieldMap[toSet],
                dataSource = field?.dataSource ?? toSet;

            if (field?.set) {
                field.set(value, this.data, this);
            }
            else if (field?.complexMapping) {
                ObjectHelper.setPath(data, dataSource, value);
            }
            else {
                data[dataSource] = value;
            }

            // A couple of places in the code set id silently this way
            if (field === 'id') {
                this._id = value;
            }
        }
        // setData({ name : 'Magneto', power : 'Magnetism' });
        else {
            const keys = Object.keys(toSet);

            for (let i = 0; i < keys.length; i++) {
                const
                    fieldName  = keys[i],
                    field      = fieldMap[fieldName],
                    dataSource = field?.dataSource ?? fieldName;

                if (field?.set) {
                    field.set(value, this.data, this);
                }
                else if (dataSource) {
                    if (field?.complexMapping) {
                        ObjectHelper.setPath(data, dataSource, toSet[fieldName]);
                    }
                    else {
                        data[dataSource] = toSet[fieldName];
                    }
                }
            }
        }

    }

    /**
     * Returns raw data from the encapsulated data object for the passed field name
     * @param {String} fieldName The field to get data for.
     * @returns {*} The raw data value for the field.
     * @category Editing
     */
    getData(fieldName) {
        const
            field      = this.fieldMap[fieldName],
            dataSource = field?.dataSource ?? fieldName;

        if (dataSource) {
            if (field?.complexMapping) {
                return ObjectHelper.getPath(this.data, dataSource);
            }

            return this.data[dataSource];
        }
    }

    /**
     * Silently updates record's id with no flagging the property as modified.
     * Triggers onModelChange event for changed id.
     * @param {String|Number} value id value
     * @private
     */
    syncId(value) {
        const oldValue = this.id;
        if (oldValue !== value) {
            this._id = value;
            this.setData('id', value);
            const data = { id : { value, oldValue } };
            this.afterChange(data, data);
        }
    }

    /**
     * Set value for the specified field. You can also use the generated setters if loading through a Store.
     *
     * Setting a single field, supplying name and value:
     *
     * ```javascript
     * record.set('name', 'Clark');
     * ```
     *
     * Setting multiple fields, supplying an object:
     *
     * ```javascript
     * record.set({
     *     name : 'Clark',
     *     city : 'Metropolis'
     * });
     * ```
     *
     * @param {String|Object} field The field to set value for, or an object with multiple values to set in one call
     * @param {*} [value] Value to set
     * @param {Boolean} [silent] Set to true to not trigger events. If event is recurring, occurrences won't be updated automatically.
     * @privateparam {Boolean} [validOnly] If set to `true` it will ignore setting a `undefined` value, allowing conversion functions to invalidate a data input
     * @privateparam {Boolean} [triggerBeforeUpdate]
     * @fires Core.data.Store#event-idChange
     * @fires Core.data.Store#event-update
     * @fires Core.data.Store#event-change
     * @category Editing
     */
    set(field, value, silent = false, fromRelationUpdate = false, skipAccessors = false, validOnly = false, triggerBeforeUpdate = true) {
        const me = this;

        if (me.isBatchUpdating) {
            me.inBatchSet(field, value, silent || me.$silenceBatch);
            return null;
        }
        else {
            // We use inSet/afterSet approach here because mixin interested in overriding set() method like STM, for
            // example, might be mixed before Model class or after. In general, we have no control over this.
            // STM mixed before, so the only option to wrap set() method body is actually to call afterSet().

            const wasSet = me.inSet(field, value, silent, fromRelationUpdate, skipAccessors, validOnly, triggerBeforeUpdate);
            me.afterSet?.(field, value, silent, fromRelationUpdate, wasSet);
            return wasSet;
        }
    }

    fieldToKeys(field, value) {
        if (typeof field !== 'string') {
            // will get in trouble when setting same field on multiple models without this
            return ObjectHelper.assign({}, field);
        }

        return {
            [field] : value
        };
    }

    inBatchSet(field, value, silent) {
        const
            me     = this,
            {
                meta,
                constructor,
                fieldMap
            }      = me,
            wasSet = {};

        let cmp, changed = false;

        if (typeof field !== 'string') {
            Object.keys(me.fieldToKeys(field, value)).forEach(key => {
                cmp = fieldMap[key] || ObjectHelper;
                value = constructor.processField(key, field[key], me);

                // Store batch changes
                if (!cmp.isEqual(meta.batchChanges[key], value)) {
                    wasSet[key] = {
                        value,
                        oldValue : me.get(key)
                    };
                    meta.batchChanges[key] = value;
                    changed = true;
                }
            });
        }
        else {
            cmp = fieldMap[field] || ObjectHelper;

            // Minor optimization for engine writing back a lot of changes
            if (!cmp.isEqual(meta.batchChanges[field], value)) {
                wasSet[field] = {
                    value,
                    oldValue : me.get(field)
                };
                meta.batchChanges[field] = value;
                changed = true;
            }
        }

        // Callers need to be able to detect changes
        if (changed) {
            me.generation++;

            if (!silent) {
                // Fire batched events for UIs which need to update themselves during batched updates.
                // An example is evenResize feature which batches the changes to the endDate
                // or startDate, but the UI must update during the drag.
                const event = {
                    action  : 'update',
                    record  : me,
                    records : [me],
                    changes : wasSet
                };
                me.stores?.forEach(store =>
                    store.trigger('batchedUpdate', { ...event })
                );

                // Propagate to linked records
                me.forEachLinked((store, record) =>
                    store.trigger('batchedUpdate', { ...event, record, records : [record] })
                );
            }
        }
    }

    inSet(fieldNameOrObject, value, silent, fromRelationUpdate, skipAccessors = false, validOnly = false, triggerBeforeUpdate = true) {
        const
            me       = this,
            {
                data,
                meta,
                fieldMap,
                constructor
            }        = me,
            {
                prototype : myProto,
                childrenField,
                relations
            }        = constructor,
            wasSet   = {},
            toSet    = me.fieldToKeys(fieldNameOrObject, value),
            // Sort fields to make sure parentId is processed before id
            // https://github.com/bryntum/support/issues/6851
            keys     = Object.keys(toSet).sort(constructor.fieldSorter),
            isSyncingDataOnLoad = me.stores?.some(store => store.isSyncingDataOnLoad);

        let
            changed  = false;

        // Give a chance to cancel action before records are updated.
        if (!silent && triggerBeforeUpdate && !me.triggerBeforeUpdate(toSet)) {
            return null;
        }

        me.inSetting = true;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            // Currently not allowed to set children in a TreeNode this way, will be ignored
            if (key === childrenField) {
                continue;
            }

            // Setting a field on a record in a store data field (players[0].name = 'foo')
            if (key.includes('[')) {
                const
                    [, arrayFieldName, index, path] = key.match(arrayRe),
                    field                           = me.fieldMap[arrayFieldName];

                if (field?.getAt) {
                    const subRecord = field.getAt(me, index) ?? field.onSubRecordMissingInSet?.(me, index);

                    if (subRecord == null) {
                        throw new Error(`The store field '${arrayFieldName}' does not contain a record at index ${index} - can not set the data`);
                    }

                    if (subRecord.isModel) {
                        subRecord.set(path, toSet[key]);
                    }
                    else {
                        ObjectHelper.setPath(subRecord, path, toSet[key]);
                    }

                    continue;
                }
            }

            const complexKey = key.includes('.');

            // Handle updating related record
            if (relations && complexKey) {
                const [, relationName, prop] = key.match(nestedRe);
                if (relations[relationName]) {
                    me[relationName].set(prop, toSet[key]);
                    continue;
                }
            }

            const
                field    = fieldMap[key],
                cmp      = field || ObjectHelper,
                readOnly = field?.readOnly,
                mapping  = field?.dataSource ?? key,
                useProp  = (!skipAccessors && !field && key in myProto) || field?.useProp,
                oldValue = useProp ? me[mapping] : field?.complexMapping || complexKey ? ObjectHelper.getPath(data, mapping) : data[mapping],
                value    = constructor.processField(key, toSet[key], me),
                val      = toSet[key] = { value },
                relation = me.getRelationConfig(key);

            if (
                !readOnly &&
                (isSyncingDataOnLoad && field?.bypassEqualityOnSyncDataset || !cmp.isEqual(oldValue, value)) &&
                (!validOnly || value !== undefined)
            ) {
                // Indicate to observers that data has changed.
                me.generation++;
                // Give fields a shot at affecting the old value (used by StoreDataField)
                val.oldValue = field?.getOldValue?.(me) ?? oldValue;

                changed = true;

                // Update `modified` state which is used in sync request
                // For change tracking, nullish is equal
                if (key in meta.modified && cmp.isEqual(meta.modified[key], value, false, true)) {
                    // Remove changes if values are the same
                    Reflect.deleteProperty(meta.modified, key);

                    // Hack for when reverting record changes when using engine. If data is not made up to date here,
                    // the write-back from engine coming later will detect the revert as a change. And round we go
                    if (me.isReverting) {
                        me.data[mapping] = value;
                    }
                }
                else if (!me.ignoreBag) { // Private flag in engine, speeds initial commit up by not recording changes
                    // Cache its original value
                    // For change tracking, nullish are equal
                    if (!(key in meta.modified) && !(oldValue == null && value == null)) {
                        me.storeFieldChange(key, oldValue);
                    }

                    if (val.oldValue === _undefined) {
                        Reflect.deleteProperty(val, 'oldValue');
                    }
                }

                // The wasSet object keys must be the field *name*, not its dataSource.
                wasSet[key] = val;

                me.applyValue(useProp, mapping, value, skipAccessors, field);

                // changing foreign key
                if (relation && !fromRelationUpdate) {
                    me.initRelation(relation);
                    me.stores.forEach(store => store.cacheRelatedRecord(me, value, relation.relationName, val.oldValue));
                }
            }
        }

        if (changed) {
            me.afterChange(toSet, wasSet, silent, fromRelationUpdate, skipAccessors);
        }

        me.inSetting = false;

        return changed ? wasSet : null;
    }

    // Provided as a hook for Engine to do what needs to be done which ever way a field value is changed
    applyValue(useProp, key, value, skipAccessors, field) {
        const me = this;

        // any id assignment clears the `$isPhantom` flag, which
        // is supposed to be set only for records, deleted by undo
        if ((field?.dataSource || key) === me.constructor.idField) {
            me.$isPhantom = false;
            // Update cached id
            me._id = value;
        }

        // Setting parentId moves the node, always route through setter
        if ((field?.dataSource || key) === me.constructor.parentIdField) {
            // do nothing if `value=null/undefined` (or unresolvable id) - supposed to move the node
            // to the children of root _and_ node is already a child of root
            if (!(me.parent?.isRoot && (value == null || !me.firstStore.getById(value)))) {
                // key is the dataSource, if we use property we need to use field name
                (me.firstStore.getById(value) || me.firstStore.rootNode).insertChild(me, null, false, {
                    orderedParentIndex : { skip : true }
                });
            }
        }
        // If we don't have a field, but we have a property define eg, the fullDuration property defined in TaskModel,
        // then use the property.
        else if (useProp) {
            // key is the dataSource, if we use property we need to use field name
            me[field?.name || key] = value;
        }
        else if (field?.set) {
            field.set(value, me.data, me);
        }
        else {
            let complexMapping = field?.complexMapping;

            // Might be setting value of nested object
            if (!field && key.includes('.')) {
                const nestedName = key.split('.')[0];

                field = me.constructor.fieldMap[nestedName];

                // We use complex mapping if the field's dataSource was defined as such,
                // OR if we are being asked to set using dot notation and field is of Object type.
                complexMapping = field?.complexMapping || field?.type === 'object';
            }

            // Use complex mapping?
            if (complexMapping) {
                ObjectHelper.setPath(me.data, key, value);
            }
            // Otherwise, push the value through into the data.
            else {
                me.data[key] = value;
            }
        }
    }

    // skipAccessors argument is used in the engine override
    afterChange(toSet, wasSet, silent, fromRelationUpdate, skipAccessors) {
        if (this.stores) {
            for (const store of this.stores) {
                store.onModelChange(this, toSet, wasSet, silent, fromRelationUpdate, skipAccessors);
            }
        }

        // Propagate to linked records
        this.forEachLinked((store, record) =>
            store.onModelChange(record, toSet, wasSet, silent, fromRelationUpdate, skipAccessors)
        );
    }

    // Run fn for each store on each linked record
    forEachLinked(fn) {
        for (const linked of this.$links) {
            for (const store of linked.stores) {
                fn(store, linked);
            }
        }
    }

    /**
     * This yields `true` if this record is eligible for syncing with the server.
     * It can yield `false` if the record is in the middle of a {@link #property-isBatchUpdating batched update},
     * or if it is a {@link #property-isCreating tentative record} yet to be confirmed as a new addition.
     * @property {Boolean}
     * @readonly
     */
    get isPersistable() {
        // Record is not persistable if the owning app is in the middle of a batch update
        // and the record is not flagged as being in the middle of a creation sequence.
        // This means that a "new" record can be added on a conditional basis with its
        // isCreating property set which means it is examplt from being synced until
        // the isCreating flag is cleared.
        return !this.isBatchUpdating && !this.isCreating;
    }

    /**
     * True if this model has any uncommitted changes.
     * @property {Boolean}
     * @readonly
     * @category Editing
     */
    get isModified() {
        return Boolean(this.meta.modified && Object.keys(this.meta.modified).length > 0);
    }


    get hasPersistableChanges() {
        return this.isPersistable && !ObjectHelper.isEmpty(this.rawModificationData);
    }

    /**
     * Returns `true` if this model has uncommitted changes for the provided field.
     * @param {String} fieldName Field name
     * @returns {Boolean} `true` if the field has an uncommitted change
     * @category Editing
     */
    isFieldModified(fieldName) {
        return this.isModified && fieldName in this.meta.modified;
    }

    /**
     * Returns the unmodified value of the field, as in the value it had after the last commit. If the field has not
     * been modified, the current value is returned.
     * @param {String} fieldName Field name
     * @returns {*} The unmodified value of the field, or its current value if not modified
     */
    getUnmodified(fieldName) {
        return this.isModified ? this.meta.modified[fieldName] : this.get(fieldName);
    }

    /**
     * Returns field value that should be persisted, or `undefined` if field is configured with `persist: false`.
     * @param {String|Core.data.field.DataField} nameOrField Name of the field to get value for, or its field definition
     * @private
     * @category Fields
     */
    getFieldPersistentValue(nameOrField) {
        const
            field = typeof nameOrField === 'string' ? this.getFieldDefinition(nameOrField) : nameOrField,
            name  = field?.name || nameOrField;

        let result;

        if (!field || field.persist) {
            result = this.getValue(name);
            // if serialize function is provided we use it to prepare the persistent value
            if (field?.serialize) {
                result = field.serialize(result, this);
            }
        }

        return result;
    }

    /**
     * Get a map of the modified fields in form of an object. The field *names* are used as the property names
     * in the returned object.
     * @property {Object}
     * @readonly
     * @category Editing
     */
    get modifications() {
        const data = this.rawModifications;

        if (data && Object.keys(data).length) {
            data[this.constructor.idField] = this.id;
        }

        return data;
    }

    get rawModifications() {
        const
            me = this,
            data = {};

        if (!me.isModified) {
            return null;
        }

        let keySet = false;

        Object.keys(me.meta.modified).forEach(key => {

            const value = me.getFieldPersistentValue(key);
            if (value !== _undefined) {
                data[key] = value;
                keySet = true;
            }
        });

        return keySet ? data : null;
    }

    /**
     * Get a map of the modified fields in form of an object. The field´s {@link Core.data.field.DataField#config-dataSource}
     * is used as the property name in the returned object. The record´s id is always included.
     * @property {Object}
     * @readonly
     * @category Editing
     */
    get modificationData() {
        const data = this.rawModificationData;

        // If there are some persistable field changes, append record id
        if (data && Object.keys(data).length) {
            ObjectHelper.setPath(data, this.constructor.idField, this.id);
        }

        return data;
    }

    /**
     * Returns a map of the modified persistable fields
     * @internal
     * @property {Object}
     * @category Editing
     */
    get rawModificationData() {
        const
            me = this,
            { fieldMap } = me.constructor,
            data = {};

        if (!me.isModified) {
            return null;
        }

        let keySet = false;

        Object.keys(me.meta.modified).forEach(fieldName => {

            let
                field      = fieldMap[fieldName],
                dataSource = field?.dataSource;

            // Nested field, get top level field definition, but set the dataSource to the full path
            if (fieldName.includes('.')) {
                const topLevelFieldName = fieldName.match(nestedRe)[1];
                field = fieldMap[topLevelFieldName];
                dataSource = fieldName;
            }

            // No field definition means there's no original dataSource to update
            if (field?.persist) {
                const value = me.getFieldPersistentValue(fieldName);

                if (value !== _undefined) {
                    ObjectHelper.setPath(data, dataSource, value);
                    keySet = true;
                }
            }
        });

        return keySet ? data : null;
    }

    /**
     * Get a map of the modified data fields along with any {@link Core/data/field/DataField#config-alwaysWrite} fields,
     * in form of an object. The field´s *dataSource* is used as the property name in the returned object.
     * Used internally by AjaxStore / CrudManager when sending updates.
     * @property {Object}
     * @readonly
     * @category Editing
     */
    get modificationDataToWrite() {
        const
            alwaysWriteFields = this.constructor.alwaysWriteFields,
            recordData        = this.modificationData;

        alwaysWriteFields.forEach(fieldName => {
            recordData[this.getFieldDefinition(fieldName).dataSource] = this.getFieldPersistentValue(fieldName);
        });

        return recordData;
    }

    /**
     * Returns data for **all** {@link Core.data.field.DataField#config-persist persistable} fields in form of an
     * object, using dataSource if present.
     * @property {Object}
     * @internal
     * @readonly
     * @category Editing
     */
    get persistableData() {
        const
            me   = this,
            data = {};

        me.fields.forEach(field => {
            const value = me.getFieldPersistentValue(field);

            if (value !== _undefined) {
                if (field?.complexMapping) {
                    ObjectHelper.setPath(data, field.dataSource, value);
                }
                else {
                    data[field.dataSource] = value;
                }
            }
        });

        return data;
    }

    get dataByFieldName() {
        const { data } = this;

        return this.fields.reduce((result, field) => {
            if (ObjectHelper.hasPath(data, field.dataSource)) {
                result[field.name] = data[field.dataSource];
            }
            return result;
        }, {});
    }

    /**
     * True if this models changes are currently being committed.
     * @property {Boolean}
     * @category Editing
     */
    get isCommitting() {
        return Boolean(this.meta.committing);
    }

    internalClearChanges(includeDescendants = true, removeFromStoreChanges = true, changes = null) {
        const
            me = this,
            { meta } = me;

        // If we've received an object with changes, we only need to clean that one up
        if (changes) {
            for (const key in changes) {
                delete meta.modified[key];
            }
        }
        else {
            meta.modified = {};
        }

        // We can only remove the record from the store´s "modified" bag if there are no modified fields in meta
        const noChanges = ObjectHelper.isEmpty(meta.modified);

        meta.committing = false;

        if (removeFromStoreChanges) {
            me.stores?.forEach(store => {
                noChanges && store.modified.remove(me);
                store.added.remove(me);
                if (includeDescendants) {
                    const descendants = store.collectDescendants(me).all;
                    store.added.remove(descendants);
                    noChanges && store.modified.remove(descendants);
                }
            });
        }
    }

    /**
     * Clears tracked changes, used on commit. Does not revert changes.
     * @param {Boolean} [includeDescendants] Supply `false` to not clear node descendants
     * @category Editing
     */
    clearChanges(includeDescendants) {
        this.internalClearChanges(includeDescendants);

        this.stores?.forEach(store => store.trigger('clearChanges', { record : this }));
    }

    storeFieldChange(key, oldValue) {
        this.meta.modified[key] = oldValue;
    }

    /**
     * Reverts changes in this back to their original values.
     * @privateparam {Boolean} [silent] Specify `true` to not trigger events.
     * @category Editing
     */
    revertChanges(silent = false) {
        // Flag checked by engine to not set startDate constraint on revert
        this.isReverting = true;

        this.set(this.meta.modified, _undefined, silent);

        this.isReverting = false;
    }

    setByDataSource(rawChanges) {
        const
            me                     = this,
            {
                fieldDataSourceMap
            } = me.constructor,
            rawChangesSimplePaths  = ObjectHelper.pathifyKeys(rawChanges, fieldDataSourceMap),
            changes                = {};

        // Collect the changes into a change set for field names.
        for (const dataSource in rawChangesSimplePaths) {
            const
                field    = fieldDataSourceMap[dataSource],
                propName = field?.name ?? dataSource;

            changes[propName] = rawChangesSimplePaths[dataSource];
        }

        return me.set(changes);
    }

    applyChangeset(rawChanges, phantomIdField = '$PhantomId', remote = true) {
        const
            me                     = this,
            modelClass             = me.constructor,
            {
                idField,
                fieldDataSourceMap
            } = modelClass,
            // rawChanges object contains dataSources for keys
            // rawChangesSimplePaths is a one-level object with dataSources (too) for keys
            rawChangesSimplePaths  = ObjectHelper.pathifyKeys(rawChanges, fieldDataSourceMap),
            ownChangesSimplePaths  = ObjectHelper.pathifyKeys(me.modificationData),
            changes                = {},
            // Value of id field cannot be changed, it can only be set. In which case phantom id field will be in the
            // rawChanges objects
            idChanged              = phantomIdField in rawChanges && !(idField in rawChanges);

        if (!idChanged && phantomIdField in rawChangesSimplePaths) {
            delete rawChangesSimplePaths[phantomIdField];
        }

        // Collect the changes into a change set for field names.
        for (const dataSource in rawChangesSimplePaths) {
            const
                field    = fieldDataSourceMap[dataSource],
                propName = field?.name ?? dataSource;

            // Only apply change to the model:
            // 1. if changes is remote
            // 2. or local change is not outdated
            // 3. we are setting id (in which case phantom id would be in raw changes). id value cannot be changed here,
            // only assigned if record is phantom - because we use id from the raw data to resolve this record in the
            // first place
            if (
                remote ||
                (
                    field?.name === idField
                        ? idChanged
                        : (rawChangesSimplePaths[dataSource] === ownChangesSimplePaths[dataSource])
                )
            ) {
                changes[propName] = rawChangesSimplePaths[dataSource];
            }
        }

        // Apply all changes in one go, making sure record is considered unmodified after
        const wasSet = me.set(changes);

        me.internalClearChanges(false, true, remote ? null : changes);

        // wasSet has format { field : { oldValue, value }}, convert to { field : value }
        return wasSet ? Object.entries(wasSet).reduce((result, [field, change]) => {
            result[field] = change.value;
            return result;
        }, {}) : {};
    }



    //endregion

    //region Id

    /**
     * Gets the records internalId. It is assigned during creation, guaranteed to be globally unique among models.
     * @property {Number}
     * @category Identification
     */
    get internalId() {
        return this._internalId;
    }

    /**
     * Returns true if the record is new and has not been persisted (and received a proper id).
     * @property {Boolean}
     * @readonly
     * @category Identification
     */
    get isPhantom() {
        return this.id === '' || this.id == null || this.hasGeneratedId || Boolean(this.$isPhantom);
    }

    get isModel() {
        return true;
    }

    /**
     * Checks if record has a generated id.
     *
     * New records are assigned a generated id based on a UUID (starting with `_generated`), which is intended to be
     * temporary and should be replaced by the backend on commit.
     *
     * @property {Boolean}
     * @category Identification
     */
    get hasGeneratedId() {
        return typeof this.id === 'string' && this.id.startsWith('_generated');
    }

    static generateId(text = this.$$name) {
        return `_generated${text}_${StringHelper.generateUUID()}`;
    }

    /**
     * Generates an id for a new record (a phantom id), based on a UUID (starting with `_generated`).
     *
     * Generated ids are intended to be temporary and should be replaced by the backend on commit.
     *
     * @category Identification
     * @returns {String}
     */
    generateId() {
        return this.constructor.generateId();
    }

    /**
     * Gets the id of specified model or model data object, or the value if passed string/number.
     * @param {Core.data.Model|String|Number} model
     * @returns {String|Number} id
     * @category Identification
     */
    static asId(model) {
        return model?.isModel ? model.id : ObjectHelper.isObject(model) ? model[this.fieldMap.id.dataSource] : model;
    }

    //endregion

    //region JSON

    /**
     * Get the records data as a json string.
     *
     * ```javascript
     * const record = new Model({
     *     title    : 'Hello',
     *     children : [
     *         ...
     *     ]
     * });
     *
     * const jsonString = record.json;
     *
     * //jsonString:
     * '{"title":"Hello","children":[...]}'
     * ```
     *
     * @member {String}
     * @category JSON
     */
    get json() {
        return StringHelper.safeJsonStringify(this);  // calls our toJSON() method
    }

    /**
     * Used by `JSON.stringify()` to correctly convert this record to json.
     *
     * In most cases no point in calling it directly.
     *
     * ```
     * // This will call `toJSON()`
     * const json = JSON.stringify(record);
     * ```
     *
     * If called manually, the resulting object is a clone of `record.data` + the data of any children:
     *
     * ```
     * const record = new Model({
     *     title    : 'Hello',
     *     children : [
     *         ...
     *     ]
     * });
     *
     * const jsonObject = record.toJSON();
     *
     * // jsonObject:
     * {
     *     title : 'Hello',
     *     children : [
     *         ...
     *     ]
     * }
     * ```
     *
     * @returns {Object}
     * @category JSON
     */
    toJSON() {
        const
            { children, unfilteredChildren } = this,
            jsonData                         = this.persistableData;

        if (unfilteredChildren || children) {
            jsonData[this.constructor.childrenField] = (unfilteredChildren || children).map(c => c.toJSON());
        }

        return jsonData;
    }

    /**
     * Represent the record as a string, by default as a JSON string. Tries to use an abbreviated version of the
     * object's data, using id + name/title/text/label/description. If no such field exists, the full data is used.
     *
     * ```javascript
     * const record = new Model({ id : 1, name : 'Steve Rogers', alias : 'Captain America' });
     * console.log(record.toString()); // logs { "id" : 1, "name" : "Steve Rogers" }
     * ```
     *
     * @returns {String}
     * @category JSON
     */
    toString() {
        const
            me        = this,
            nameField = abbreviationFields.find(field => field in me.constructor.fieldMap),
            data      = nameField ? { [me.constructor.idField] : me.id, [nameField] : me[nameField] } : me.data;

        return StringHelper.safeJsonStringify(data);
    }

    //endregion

    //region Batch

    /**
     * True if this Model is currently batching its changes.
     * @property {Boolean}
     * @readonly
     * @category Editing
     */
    get isBatchUpdating() {
        return Boolean(this.batching);
    }

    /**
     * Returns `true` if this Model currently has outstanding batched changes for the specified field name.
     * @param {String} fieldName The field name to check for batched updates on.
     * @returns {Boolean}
     * @category Editing
     */
    hasBatchedChange(fieldName) {
        return this.meta?.batchChanges?.[fieldName];
    }

    /**
     * Begin a batch, which stores changes and commits them when the batch ends.
     * Prevents events from being fired during batch.
     *
     * ```javascript
     * record.beginBatch();
     * record.name = 'Mr Smith';
     * record.team = 'Golden Knights';
     * record.endBatch();
     * ```
     *
     * Please note that you can also set multiple fields in a single call using {@link #function-set}, which in many
     * cases can replace using a batch:
     *
     * ```javascript
     * record.set({
     *   name : 'Mr Smith',
     *   team : 'Golden Knights'
     * });
     * ```
     * @category Editing
     * @privateparam {Boolean} silentUpdates Suppress firing the `batchUpdatedEvent`
     */
    beginBatch(silentUpdates = false) {
        const me = this;

        if (!me.batching) {
            me.batching = 0;
            me.meta.batchChanges = {};
        }

        if (silentUpdates) {
            me.$silenceBatch = (me.$silenceBatch || 0) + 1;
        }

        me.batching++;
    }

    /**
     * End a batch, triggering events if data has changed.
     * @param {Boolean} [silent] Specify `true` to not trigger events. If event is recurring, occurrences won't be updated automatically.
     * @privateparam {Boolean} [silent=false] Specify `true` to not trigger events. If event is recurring, occurrences won't be updated automatically.
     * @privateparam {Boolean} [triggerBeforeUpdate=true]
     * @category Editing
    */
    endBatch(silent = false, skipAccessors = false, triggerBeforeUpdate = true) {
        const
            me                = this,
            { parentIdField } = me.constructor;

        if (!me.batching) {
            return;
        }

        me.batching--;

        // Ideally we should track which batch was silenced, but that will complicate code more than what avoiding a few
        // triggered events is worth (this is private and we do not start batches while batches are ongoing in the
        // critical code path in engine)
        me.$silenceBatch && me.$silenceBatch--;

        if (me.batching > 0) {
            return;
        }

        // Set pending batch changes
        if (!ObjectHelper.isEmpty(me.meta.batchChanges)) {
            let { batchChanges } = me.meta;
            me.meta.batchChanges = null;

            // Move to its new parent before applying the other changes.
            if (batchChanges[parentIdField]) {
                batchChanges = { ...batchChanges };
                me.parentId = batchChanges[parentIdField];
                delete batchChanges[parentIdField];
            }

            me.set(batchChanges, _undefined, silent, false, skipAccessors, undefined, triggerBeforeUpdate);
        }
    }

    /**
     * Cancels current batch operation. Any changes during the batch are discarded.
     * @category Editing
     */
    cancelBatch() {
        if (this.batching) {
            const
                me               = this,
                { batchChanges } = me.meta,
                wasSet           = {};

            me.batching = null;
            me.meta.batchChanges = null;

            me.generation++;

            if (!me.$silenceBatch) {
                // Create a wasSet describing the revert back from the batched values to the real values.
                Object.entries(batchChanges).forEach(([key, oldValue]) => {
                    wasSet[key] = {
                        oldValue,
                        value : me[key]
                    };
                });

                // Fire batched events for UIs which need to update themselves during batched updates.
                // An example is evenResize feature which batches the changes to the endDate
                // or startDate, but the UI must update during the drag.
                const event = {
                    action  : 'update',
                    record  : me,
                    records : [me],
                    changes : wasSet
                };
                me.stores?.forEach(store =>
                    // Cant use event directly, it will get polluted with `source` and then have that incorrect for
                    // following calls
                    store.trigger('batchedUpdate', { ...event })
                );

                // Propagate to linked records
                me.forEachLinked((store, record) =>
                    store.trigger('batchedUpdate', { ...event, record, records : [record] })
                );
            }

            me.$silenceBatch && me.$silenceBatch--;
        }
    }

    //endregion

    //region Events

    /**
     * Triggers beforeUpdate event for each store and checks if changes can be made from event return value.
     * @param {Object} changes Data changes
     * @returns {Boolean} returns true if data changes are accepted
     * @private
     */
    triggerBeforeUpdate(changes) {
        return !this.stores?.some(s => s.trigger('beforeUpdate', { record : this, changes }) === false);
    }

    //endregion

    //region Additional functionality

    /**
     * Makes a copy of this model, assigning the specified id or a generated id and also allowing you to pass field values to
     * the created copy.
     *
     * ```
     * const record = new Model({ name : 'Super model', hairColor : 'Brown' });
     * const clone = record.copy({ name : 'Super model clone' });
     * ```
     * @param {Number|String|Object} [newId] The id for the copied instance, or any field values to apply
     * (overriding the values from the source record). If no id provided, one will be auto-generated
     * @param {Boolean} [deep] True to also clone children
     * @returns {Core.data.Model} Copy of this model
     * @category Editing
     */
    copy(newId = null, deep) {
        const
            me      = this,
            data    = ObjectHelper.clone(me.data),
            idField = me.constructor.idField,
            // Chrono model is adding more logic to copy and that logic should be manageable from arguments. So there is
            // option to pass object as a last argument to switch method behavior. Used internally only, shouldn't be public.
            useDeep = ObjectHelper.isObject(deep) ?  deep.deep : deep;

        let id;

        if (newId && typeof newId === 'object') {
            id = newId[idField];

            Object.assign(data, newId);
        }
        else {
            id = newId;
        }

        // Iterate over instance children, because data may not reflect actual children state.
        // Copy's initial expanded state will be from the "expanded" property of the data object
        // which is cloned from the source.
        if (useDeep && me.children) {
            // newId is false means we want to preserve existing id value - let's pass it to nested calls too then
            data.children = me.children.map(child => child.copy(newId === false ? false : undefined, deep));
        }
        else {
            delete data.children;
            delete data.expanded;
        }

        if (me.$meta.fields.initable.length > 0) {
            const json    = me.toJSON();
            for (const field of me.$meta.fields.initable) {
                data[field.name] = json[field.name];
            }
        }

        if (newId !== false) {
            // We can use the value from the 'id' property, but as a fallback, generate the id.
            data[idField] = id || me.generateId(me.firstStore);
        }

        // Force using raw data when creating a copy, since data was cloned above anyway
        const copy = new me.constructor(data, null, null, false, true);

        // Store original record internal id to lookup from copy later
        copy.originalInternalId = me.internalId;

        return copy;
    }

    // Copies data using the real field names to trigger setters
    copyData(fromRecord, raw, silent) {
        const propertiesAndValues = {};

        fromRecord.allFields.forEach(({ name : fieldName }) => {
            if (fieldName !== fromRecord.constructor.idField) {
                propertiesAndValues[fieldName] = raw ? fromRecord.get(fieldName) : fromRecord.getValue(fieldName);
            }
        });

        this.set(propertiesAndValues, null, silent);
    }

    /**
     * Removes this record from all stores (and in a tree structure, also from its parent if it has one).
     * @param {Boolean} [silent] Specify `true` to not trigger events. If the event is recurring, occurrences won't be
     * updated automatically.
     * @category Editing
     */
    remove(silent = false) {
        const
            me                 = this,
            { parent, stores } = me;

        // Remove from parent if we're in a tree structure.
        // This informs the owning store(s)
        if (parent) {
            parent.removeChild(me);
        }
        // Store handles remove
        // Not sure what should happen if you try to remove a special row (group row for example), bailing out
        else if (stores?.length && !me.isSpecialRow) {
            // Create a shallow copy of the stores array, since the original may get modified when store is removed
            const storesCopy = stores.slice();
            storesCopy.forEach(s => s.remove(me, silent, false, true));
        }
    }

    // Called by stores before removing the record from the store. Returning false prevents the removal (overridden in
    // ModelLink.js)
    beforeRemove(stores, records) {
        return super.beforeRemove(stores, records);
    }

    //endregion

    //region Validation

    /**
     * Check if record has valid data. Default implementation returns true, override in your model to do actual validation.
     * @property {Boolean}
     * @category Editing
     */
    get isValid() {
        return true;
    }

    //endregion

    //region Store

    /**
     * Get the first store that this model is assigned to.
     * @property {Core.data.Store}
     * @readonly
     * @category Misc
     */
    get firstStore() {
        return this.stores?.[0];
    }

    /**
     * Joins this record and any children to specified store, if not already joined.
     * @internal
     * @param {Core.data.Store} store Store to join
     * @category Misc
     */
    joinStore(store) {
        const me = this;

        if (!me.stores || !me.stores.includes(store)) {
            super.joinStore(store);

            store.register(me);

            if (!me.stores) {
                me.stores = [store];
            }
            else {
                me.stores.push(store);
            }

            if (me.unjoinedStores && me.unjoinedStores.includes(store)) {
                me.unjoinedStores.splice(me.unjoinedStores.indexOf(store), 1);
            }
            me.children?.length && me.children.forEach(child => child.joinStore(store));
            me.constructor.exposedRelations && me.initRelations();

            // do not change the collapsed state during stm restoring
            if (store.tree && !me.isRoot && !store.stm?.isRestoring) {
                me.instanceMeta(store.id).collapsed = !me.expanded;
            }
        }
    }

    /**
     * Unjoins this record and any children from specified store, if already joined.
     * @internal
     * @param {Core.data.Store} store Store to join
     * @param {Boolean} [isReplacing] `true` if this record is being replaced
     * @category Misc
     */
    unjoinStore(store, isReplacing = false) {
        const
            me = this,
            { stores } = me;

        if (stores?.includes(store)) {
            if (!store.isDestroying) {
                store.unregister(me);

                // unjoinedStores is created here when used instead of in construct for performance reasons
                if (!me.unjoinedStores) {
                    me.unjoinedStores = [store];
                }
                else {
                    me.unjoinedStores.push(store);
                }
            }

            // me.children may === true...
            // If filtered, *all* children must be unjoined when we are.
            (me.unfilteredChildren || me.children)?.forEach?.(child => child.unjoinStore(store, isReplacing));

            stores.splice(stores.indexOf(store), 1);
            // keep the cord to allow removed records to reach the store when needed

            super.unjoinStore?.(store, isReplacing);

            // remove from relation cache
            store.uncacheRelatedRecord(me);
        }
    }

    /**
     * Returns `true` if this record is contained in the specified store, or in any store if store param is omitted.
     * @internal
     * @param {Core.data.Store} store Store to check
     * @returns {Boolean}
     * @category Misc
     */
    isPartOfStore(store) {
        if (store) {
            return store.includes(this);
        }

        return this.stores?.length > 0;
    }

    /**
     * Returns true if this record is not part of any store.
     * @property {Boolean}
     * @readonly
     * @internal
     */
    get isRemoved() {
        return !this.isPartOfStore();
    }

    //endregion

    //region Per instance meta

    /**
     * Used to set per external instance meta data. For example useful when using a record in multiple grids to store some state
     * per grid.
     * @param {String|Object} instanceOrId External instance id or the instance itself, if it has id property
     * @private
     * @category Misc
     */
    instanceMeta(instanceOrId) {
        const
            { meta } = this,
            id       = instanceOrId.id || instanceOrId;

        return meta.map?.[id] || this.setInstanceMeta(id, {});
    }

    setInstanceMeta(instanceOrId, value) {
        const
            { meta } = this,
            id       = instanceOrId.id || instanceOrId;

        if (!meta.map) {
            meta.map = {};
        }

        return meta.map[id] = value;
    }

    /**
     * When called on a group header row returns list of records in that group. Returns `undefined` otherwise.
     * @member {Core.data.Model[]|undefined} groupChildren
     * @category Grouping
     * @readonly
     */

    /**
     * Returns true for a group header record
     * @member {Boolean}
     * @category Grouping
     * @readonly
     */
    get isGroupHeader() {
        return 'groupRowFor' in this.meta;
    }

    get isGroupFooter() {
        return 'groupFooterFor' in this.meta;
    }

    get isSpecialRow() {
        return Boolean(this.meta?.specialRow);
    }

    get $original() {
        return this.isLinked ? this.proxyMeta.originalRecord : this;
    }

    //endregion

    static get nonPersistableFields() {
        const me = this;

        if (!me._nonPersistableFields) {
            me._nonPersistableFields = {};

            me.allFields.forEach(field => {
                if (!field.persist || field.calculated) {
                    me._nonPersistableFields[field.name] = 1;
                }
            });
        }

        return me._nonPersistableFields;
    }

    static get alwaysWriteFields() {
        const me = this;

        if (!me._alwaysWriteFields) {
            me._alwaysWriteFields = [];

            me.allFields.forEach(field => {
                if (field.alwaysWrite) {
                    me._alwaysWriteFields.push(field.name);
                }
            });
        }

        return me._alwaysWriteFields;
    }

    // Id with spaces and dots replaced by -, for safe usage as an id in DOM
    get domId() {
        return typeof this.id === 'string' ? this.id.replace(/[ .]/g, '-') : this.id;
    }

    //region Extract config

    // These functions are not meant to be called by any code other than Base#getCurrentConfig()

    // Convert custom modelClass to string, keeping custom fields
    static toJavaScriptValue(options) {
        // Get name, skipping the automatically extended name that goes last (MyModel, not MyModelEx)
        const
            { names } = this.$meta,
            className = names[names.length - 2],
            superName =  names[names.length - 3];

        return `class ${className} extends ${superName} { static fields = ${StringHelper.toJavaScriptValue(this.fields, options)}; }`;
    }

    // Get fields current values
    getCurrentConfig(options) {
        const
            { data, children }              = this,
            { defaultValues, applyConfigs } = this.constructor,
            result                          = applyConfigs ? super.getCurrentConfig(options) : {};

        if (result) {
            for (const field of this.fields) {
                if (field.persist) {
                    const value = ObjectHelper.getPath(data, field.dataSource);
                    if (value != null && !field.isEqual(value, defaultValues[field.name])) {
                        ObjectHelper.setPath(result, field.dataSource, Base.processConfigValue(value, options));
                    }
                }
            }

            // Always include children
            if (children) {
                // Inline available children
                if (Array.isArray(children)) {
                    result.children = [];
                    for (const child of children) {
                        result.children.push(child.getCurrentConfig(options));
                    }
                }
                // Load on demand
                else {
                    result.children = children;
                }
            }

            if (this.hasGeneratedId) {
                delete result.id;
            }

            delete result.parentId;
            delete result.parentIndex;
        }

        return result;
    }

    //endregion
}

Model._idField = 'id';
Model._internalIdCounter = 1;
Model._assignedIdField = false;

Model.exposeProperties();
