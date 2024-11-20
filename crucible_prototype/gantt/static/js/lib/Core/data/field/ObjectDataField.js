import DataField from './DataField.js';

/**
 * @module Core/data/field/ObjectDataField
 */

/**
 * This field class handles fields that hold an object.
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         'name',
 *         { name : 'address', type : 'object' }
 *     ];
 * }
 * ```
 *
 * For the field to count as modified, the whole object has to be replaced:
 *
 * ```javascript
 * person.address = { ...address };
 * ```
 *
 * Or, sub properties of the object has to be modified using calls to `set()`:
 *
 * ```javascript
 * person.set('address.street', 'Main Street');
 * ```
 *
 * Note that if any property of the nested object requires conversion after load, you have to define that property as
 * a field:
 *
 * ```javascript
 * class Order extends Model {
 *     static fields = [
 *         'title',
 *         { name : 'details', type : 'object' },
 *         { name : 'details.date', type : 'date' }
 *     ];
 * }
 *
 * const order = new Order({
 *    title   : 'Order 1',
 *    details : {
 *      customer : 'Bill',
 *      // Definition above required for this to be converted to a date
 *      date     : '2020-01-01'
 *    }
 * });
 * ```
 *
 * @extends Core/data/field/DataField
 * @classtype object
 * @datafield
 */
export default class ObjectDataField extends DataField {
    static get $name() {
        return 'ObjectDataField';
    }

    static get type() {
        return 'object';
    }

    static get prototypeProperties() {
        return {
            complexMapping : true
        };
    }
}

ObjectDataField.initClass();
