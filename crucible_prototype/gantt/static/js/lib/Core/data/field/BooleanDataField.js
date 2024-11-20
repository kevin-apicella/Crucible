import DataField from './DataField.js';

/**
 * @module Core/data/field/BooleanDataField
 */

/**
 * This field class handles field of type `Boolean`.
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'active', type : 'boolean' }
 *         ];
 *     }
 * }
 * ```
 *
 * When a field is declared as a `'boolean'`, non-null values are promoted to `Boolean` type. This is seldom required,
 * but can be useful if a field value is received as a number but should be treated as a boolean.
 *
 * @extends Core/data/field/DataField
 * @classtype boolean
 * @classtypealias bool
 * @datafield
 */
export default class BooleanDataField extends DataField {

    static $name = 'BooleanDataField';

    static type = 'boolean';

    static alias = 'bool';

    static get prototypeProperties() {
        return {
            /**
             * The value to replace `null` when the field is not `nullable`.
             * @config {Boolean}
             * @default
             */
            nullValue : false
        };
    }

    isEqual(first, second) {
        if (first == null && second == null) {
            return true;
        }

        return super.isEqual(first, second);
    }

    convert(value) {
        if (value == null) {
            return this.nullable ? value : this.nullValue;
        }
        // string 'false' will convert to false, other strings to true
        if (value.toLowerCase?.() === 'false') {
            return false;
        }

        return Boolean(value);
    }
}

BooleanDataField.initClass();
