/**
 * @module Core/data/stm/Transaction
 */
import Base from '../../Base.js';

const ACTION_QUEUE_PROP = Symbol('ACTION_QUEUE_PROP');

/**
 * STM transaction class, holds list of actions constituting a transaction.
 *
 * A transaction can be undone and redone. Upon undo all the actions being held
 * are undone in reverse order. Upon redo all the actions being held are redone
 * in forward order.
 */
export default class Transaction extends Base {

    get defaultConfig() {
        return {
            /**
             * Transaction title
             *
             * @config {String}
             */
            title : null
        };
    }

    construct(...args) {
        this[ACTION_QUEUE_PROP] = [];

        super.construct(...args);
    }

    /**
     * Gets transaction's actions queue
     *
     * @property {Core.data.stm.action.ActionBase[]}
     */
    get queue() {
        return this[ACTION_QUEUE_PROP].slice(0);
    }

    /**
     * Gets transaction's actions queue length
     *
     * @property {Number}
     */
    get length() {
        return this[ACTION_QUEUE_PROP].length;
    }

    /**
     * Adds an action to the transaction.
     *
     * @param {Core.data.stm.action.ActionBase|Object} action
     */
    addAction(action) {


        this[ACTION_QUEUE_PROP].push(action);
    }

    /**
     * Undoes actions held
     */
    undo() {
        const queue = this[ACTION_QUEUE_PROP];

        for (let i = queue.length - 1; i >= 0; --i) {
            queue[i].undo();
        }
    }

    /**
     * Redoes actions held
     */
    redo() {
        const queue = this[ACTION_QUEUE_PROP];

        for (let i = 0, len = queue.length; i < len; ++i) {
            queue[i].redo();
        }
    }

    /**
     * Merges all update actions into one per model, keeping the oldest and the newest values
     */
    mergeUpdateModelActions() {
        const
            queue     = this[ACTION_QUEUE_PROP],
            recordMap = new Map(),
            keep      = [];

        for (const action of queue) {
            if (action.isUpdateAction && action.model?.isModel) {
                const mergedRecordAction = recordMap.get(action.model);

                if (!mergedRecordAction) {
                    recordMap.set(action.model, action);
                    keep.push(action);
                }
                else {
                    for (const key in action.oldData) {
                        // Must exist in both old and new data, maybe it always does??
                        if (action.newData.hasOwnProperty(key)) {
                            // If it doesn't exist in the merged old data. Add it there
                            if (!mergedRecordAction.oldData.hasOwnProperty(key)) {
                                mergedRecordAction.oldData[key] = action.oldData[key];
                            }
                            // Always overwrite the merged newData
                            mergedRecordAction.newData[key] = action.newData[key];
                        }
                    }
                }
            }
            else {
                keep.push(action);
                // If a model is removed, remove it from the map. If it is added and updated again, it should have a new
                // update action for that
                if (action.isRemoveAction && action.modelList?.length) {
                    for (const model of action.modelList) {
                        recordMap.delete(model);
                    }
                }
            }
        }

        this[ACTION_QUEUE_PROP] = keep;
    }
}
