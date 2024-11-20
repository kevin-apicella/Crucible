import DataField from './DataField.js';

/**
 * @module Core/data/field/ModelDataField
 */

/**
 * This field class handles fields that hold other records.
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'address', type : 'model' }
 *         ];
 *     }
 * }
 * ```
 *
 * @internal
 * @extends Core/data/field/DataField
 * @classtype model
 * @datafield
 */
export default class ModelDataField extends DataField {
    static get $name() {
        return 'ModelDataField';
    }

    static get type() {
        return 'model';
    }

    static configurable = {
        /**
         * Class used to contain data values in this field; should be a subclass of {@link Core.data.Model}.
         * Defining this configuration is necessary for some functionality (like filter editing) to identify the
         * type of data held by the field without data present.
         *
         * @config {Core.data.Model}
         * @typings {typeof Model}
         * @category Common
         */
        modelClass : null
    };

    static get prototypeProperties() {
        return {
            complexMapping : true
        };
    }

    isEqual(first, second) {
        // Check for semantic equality. An instance of the same Model class of the same ID is equal.
        return (first && second) && (second instanceof first.constructor) && second.id == first.id;
    }
}

ModelDataField.initClass();
