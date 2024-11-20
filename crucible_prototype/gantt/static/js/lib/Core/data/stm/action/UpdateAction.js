/**
 * @module Core/data/stm/action/UpdateAction
 */
import ActionBase from './ActionBase.js';

const
    MODEL_PROP    = Symbol('MODEL_PROP'),
    NEW_DATA_PROP = Symbol('NEW_DATA_PROP'),
    OLD_DATA_PROP = Symbol('OLD_DATA_PROP');

/**
 * Action to record the fact that a model has been updated.
 * @extends Core/data/stm/action/ActionBase
 */
export default class UpdateAction extends ActionBase {
    static $name = 'UpdateAction';

    static get defaultConfig() {
        return {
            /**
             * Reference to a model which has been updated.
             *
             * @prp {Core.data.Model}
             * @readonly
             * @default
             */
            model : undefined,

            /**
             * Map of updated properties with new values.
             *
             * @prp {Object}
             * @readonly
             * @typings {{[key: string]:any}}
             * @default
             */
            newData : undefined,

            /**
             * Map of updated properties with old values.
             *
             * @prp {Object}
             * @readonly
             * @typings {{[key: string]:any}}
             * @default
             */
            oldData : undefined,

            isInitialUserAction : false
        };
    }

    get type() {
        return 'UpdateAction';
    }



    get model() {
        return this[MODEL_PROP];
    }

    set model(value) {

        this[MODEL_PROP] = value;
    }

    get newData() {
        return this[NEW_DATA_PROP];
    }

    set newData(value) {

        this[NEW_DATA_PROP] = { ...value };
    }

    get oldData() {
        return this[OLD_DATA_PROP];
    }

    set oldData(value) {

        this[OLD_DATA_PROP] = { ...value };
    }

    undo() {
        const { model, oldData } = this;

        // engine needs the setters to be activated, since there's some additional logic (for example, invalidate
        // dispatcher)
        if (model.$) {
            Object.assign(model, oldData);
        }

        // it seems STM has to use `model.set()` because of `model.inSet` overrides or smth
        // w/o this call, just with `Object.assign()` above, the view is not refreshed
        // Since invoking accessor will just forward change to the engine, we need to pass `skipAccessors = true`
        // to this call to make this change on data level.
        // Covered by TaskEdit.t `autoSync` subtest

        // but it seems, bypassing the setters puts the change in the `data` property and does not
        // modify the engine-like caches, that Core uses
        // this may lead to change being lost, overwritten by some other change, which does
        model.set(oldData, null, null, null, Boolean(model.$));
    }

    redo() {
        const { model, newData } = this;

        // see comments above
        if (model.$) {
            Object.assign(model, newData);
        }

        model.set(newData, null, null, null, Boolean(model.$));
    }
}
