import Base from '../../Base.js';
import Factoryable from '../../mixin/Factoryable.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/data/field/DataField
 */

const { getOwnPropertyDescriptor } = Reflect;

/**
 * This is the base class for Model field classes. A field class defines how to handle the data for a particular type
 * of field. Many of these behaviors can be configured on individual field instances.
 *
 * While defining `fields` on {@link Core.data.Model} in TypeScript, data fields should be of type `ModelFieldConfig`
 * instead of `DataField`, because it is a union type that gives completion based on specified type.
 *
 * ```typescript
 * class Person extends Model {
 *      static name: string = 'Person'
 *
 *      static fields: Partial<ModelFieldConfig>[] = [
 *          { name: 'address', type: 'string' },
 *          { name: 'contact', type: 'int' }
 *      ]
 * }
 *
 * ```
 *
 * @extends Core/Base
 * @datafield
 */
export default class DataField extends Base.mixin(Factoryable) {
    static get $name() {
        return 'DataField';
    }

    static get type() {
        return 'auto';
    }

    static get factoryable() {
        return {
            defaultType : 'auto'
        };
    }

    static get prototypeProperties() {
        return {
            /**
             * The name of the field.
             * @config {String} name
             */

            /**
             * The label text for a form item generated for this field. This is also used to create
             * a column header for a {@link #config-column} for this field.
             * @config {String} label
             */

            /**
             * A column config object for a column to display this field in a grid. For simple, atomic
             * data types, such as `date`, `string`, `boolean`, `number` and `integer`, this is optional
             * and the appropriate column type can be inferred.
             *
             * This also provides default values for column configuration if a configured column definition
             * for a grid lacks a property.
             *
             * For complex fields, such as identifiers which link to other records, a more capable
             * column type may be specified, for example a `type : 'number'` field may be configured
             * with
             *
             * ```javascript
             * column : 'percent'
             * ```
             * or
             * ```javascript
             * column : {
             *     type : 'percent',
             *     width : 100
             * }
             * ```
             * if it represents a percentage value and needs appropriate rendering and editing.
             * @config {String|GridColumnConfig} column
             */

            /**
             * A config object for a widget to edit this field in a form. For simple, atomic
             * data types, such as `date`, `string`, `boolean`, `number` and `integer`, this is optional
             * and the appropriate input widget type can be inferred.
             *
             * For complex fields, such as identifiers which link to other records, a more capable
             * widget may be specified.
             * @config {String|InputFieldConfig} editor
             * @private
             */

            /**
             * A function that compares two values and returns a value < 0 if the first is less than the second, or 0
             * if the values are equal, or a value > 0 if the first is greater than the second.
             * @config {Function}
             * @param {Core.data.Model} value1
             * @param {Core.data.Model} value2
             * @returns {Number}
             * @default
             */
            compare : null,

            /**
             * A function that compares two objects or records using the `compare` function on the properties of each
             * object based on the `name` of this field.
             * @config {Function}
             * @param {Core.data.Model} value1
             * @param {Core.data.Model} value2
             * @returns {Number}
             * @default
             * @internal
             */
            compareItems : null,

            /**
             * The property in a record's data object that contains the field's value.
             * Defaults to the field's `name`.
             * @config {String}
             */
            dataSource : null,

            /**
             * The default value to assign to this field in a record if no value is provided.
             * @config {*} defaultValue
             */

            /**
             * Setting to `true` will ensure this field is included in any update/insert request payload
             * when a Store / Project / CrudManager performs a request.
             * @config {Boolean}
             * @default
             */
            alwaysWrite : false,

            /**
             * Setting to `false` indicates that `null` is not a valid value.
             * @config {Boolean}
             * @default
             */
            nullable : true,

            /**
             * The value to return from {@link #function-print} for a `null` or `undefined` value.
             * @config {String}
             * @default
             */
            nullText : null,

            /**
             * The value to replace `null` when the field is not `nullable`.
             * @config {*}
             * @default
             */
            nullValue : undefined,

            /**
             * Set to `false` to exclude this field when saving records to a server.
             * @config {Boolean}
             * @default
             */
            persist : true,

            /**
             * Set to `true` for the field's set accessor to ignore attempts to set this field.
             * @config {Boolean}
             * @default
             */
            readOnly : false,

            /**
             * By default, defined {@link Core.data.Model} fields may be used to create a grid column
             * suitable for displaying that field in a grid cell. Some fields may not be suitable for
             * features which automatically generate columns for view. These fields are created using
             * `internal : true`. Some examples are the `expanded` and `rowHeight` fields which are used
             * internally.
             * @config {Boolean}
             * @default
             */
            internal : false,

            /**
             * Set to `true` to indicate this field is calculated and cannot be edited via UI
             * @config {Boolean}
             * @internal
             * @default
             */
            calculated : false,

            useProp : null,

            /**
             * When this flag is enabled, this field will skip the equality check when store is syncing the new
             * dataset (see {@link Core.data.Store#config-syncDataOnLoad} config). This means, that even if the
             * new value in new dataset is the same as old, it will still be applied to the model. It is useful
             * in certain edge case scenarios, when the update of the field does not preserve extra context information,
             * which should be provided by other fields.
             *
             * @config {Boolean}
             * @default
             */
            bypassEqualityOnSyncDataset : false
        };
    }

    /**
     * The class that first defined this field. Derived classes that override a field do not change this property.
     * @member {Core.data.Model} definedBy
     * @private
     * @readonly
     */

    /**
     * The class that most specifically defined this field. Derived classes that override a field set this property to
     * themselves.
     * @member {Core.data.Model} owner
     * @private
     * @readonly
     */

    // NOTE: Since we create lots of instances, they have no life cycle (they are not destroyed) and are readonly after
    // creation, this class does not use configurable.
    construct(config) {
        const me = this;

        if (config) {
            me.name = config.name;  // assign name first for diagnostic reasons

            Object.assign(me, config);
        }

        if (me.compare) {
            // We wrap in this way to allow compareItems() to be used as an array sorter fn (which gets no "this"):
            me.compareItems = (itemA, itemB) => me.compare(itemA?.[me.name], itemB?.[me.name]);
        }
    }

    /**
     * This method transforms a data value into the desired form for storage in the record's data object.
     *
     * ```javascript
     * export default class Task extends TaskModel {
     *    static get fields() {
     *        return [
     *            {
     *                name    : 'status',
     *                convert : (value, data) => {
     *                    if (value >= 100) {
     *                        return 'done';
     *                    }
     *                    else if (value > 0) {
     *                        return 'started';
     *                    }
     *                }
     *            }
     *        ];
     *    }
     * }
     * ```
     *
     * @method convert
     * @param {*} value The value to convert for storage in a record.
     * @param {Object} data The raw record data object
     * @returns {*} The converted value.
     */

    /**
     * This method transforms a data value into the desired form for transmitting to a server.
     * @method serialize
     * @param {*} value The value to serialize
     * @param {Core.data.Model} record The record that contains the value being serialized.
     * @returns {*} The serialized value.
     */

    /**
     * This optional method is called when setting a data value on a record.
     * @method set
     * @param {*} value The value to set
     * @param {Object} data The records future or current data object to set value to
     * @param {Core.data.Model} record The record that owns or will own the data object
     * @internal
     */

    /**
     * This optional method is called when a record using this field is created.
     * @method init
     * @param {Core.data.Model} record The record being created
     * @internal
     */

    /**
     * Create getter and setter functions for the specified field name under the specified key.
     * @internal
     */
    defineAccessor(target, force) {
        const { name, dataSource } = this;

        // Bail out if trying to override an explicitly defined accessor
        if (
            !force &&
            name in target &&
            target.$meta.hierarchy.some(current => getOwnPropertyDescriptor(current.prototype, name)?.enumerable === false)
        ) {
            return;
        }

        Reflect.defineProperty(target, name, {
            configurable : true, // To allow removing it later
            enumerable   : true,

            // no arrow functions here, need `this` to change to instance
            get : this.complexMapping
                ? function() {
                    return this.complexGet(name, dataSource);
                }
                : function() {
                    // Inlined copy of Model#flatGet, to save a fn call since this is hit very often

                    // When changes are batched, they get stored by field name, not dataSource
                    if (this.batching && name in this.meta.batchChanges) {
                        return this.meta.batchChanges[name];
                    }

                    return this.data[dataSource];
                },

            // no arrow functions here, need `this` to change to instance
            set(value) {
                // Since the accessor is defined on a base class, we dip into the fields map for the actual
                // calling class to get the correct field definition
                const field = this.$meta.fields.map[name];

                // Only set if field is read/write. Privately, we use setData to set its value
                if (!(field && field.readOnly)) {
                    this.set(name, value);
                }
            }
        });
    }

    /**
     * Compares two values for this field and returns `true` if they are equal, and `false` if not.
     * @param {*} first The first value to compare for equality.
     * @param {*} second The second value to compare for equality.
     * @returns {Boolean} `true` if `first` and `second` are equal.
     */
    isEqual(first, second) {
        return ObjectHelper.isEqual(first, second);
    }

    /**
     * Returns the given field value as a `String`. If `value` is `null` or `undefined`, the value specified by
     * {@link #config-nullText} is returned.
     * @param {*} value The value to convert to a string.
     * @returns {String}
     */
    print(value) {
        return (value == null) ? this.nullText : this.printValue(value);
    }

    /**
     * Returns the given, non-null field value as a `String`.
     * @param {*} value The value to convert to a string (will not be `null` or `undefined`).
     * @returns {String}
     * @protected
     */
    printValue(value) {
        return String(value);
    }
}
