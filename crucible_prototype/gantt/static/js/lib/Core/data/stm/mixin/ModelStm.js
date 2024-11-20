/**
 * @module Core/data/stm/mixin/ModelStm
 */
import Base from '../../../Base.js';

const
    STM_PROP         = Symbol('STM_PROP'),
    unrecordedFields = {
        // This field's value is a by product of node insertion and must not be recorded here.
        // It's the node insertion operation which is recorded by STM.
        parentIndex : 1,

        // Ordered parent index is similar to parentIndex - it is recalculated on node insertion. No need to track it
        // https://github.com/bryntum/support/issues/8257
        orderedParentIndex : 1
    };

/**
 * Mixin making a model compatible with {@link Core/data/stm/StateTrackingManager}
 *
 * @mixin
 */
export default Target => class ModelStm extends (Target || Base) {
    static get $name() {
        return 'ModelStm';
    }

    static get defaultConfig() {
        return {
            stm : null
        };
    }



    joinStore(store) {
        // No super on purpose, micro optimization of critical perf path
        // super.joinStore && super.joinStore(store);

        if (!this.stm) {
            this.stm = store.stm;
        }
    }

    unjoinStore(store, isReplacing = false) {
        if (this.stm === store.stm) {
            this.stm = null;
        }

        super.unjoinStore?.(store, isReplacing);
    }

    /**
     * Reference to STM manager, if used
     * @member {Core.data.stm.StateTrackingManager}
     * @category Misc
     */
    get stm() {
        return this[STM_PROP];
    }

    set stm(stm) {
        this[STM_PROP] = stm;
    }

    // Hook for chronograph entity field accessors, for example; task.duration = 123.
    // Triggers before setting the value.
    beforeChronoFieldSet(fieldName, value) {
        const me = this;

        if (!me.inSetting && me.stm?.enabled && !unrecordedFields[fieldName] && !me.constructor.nonPersistableFields[fieldName]) {
            // Do not record changes of identifiers that are not fields
            if (me.getFieldDefinition(fieldName)) {
                return { [fieldName] : { value, oldValue : me[fieldName] } };
            }
        }

        return null;
    }

    // Hook for chronograph entity field accessors, for example; task.duration = 123
    // Triggers after setting the value.
    afterChronoFieldSet(fieldName, value, wasSet) {
        wasSet && this.afterSet(fieldName, value, false, false, wasSet, true);
    }

    shouldRecordFieldChange(fieldName, oldValue, newValue) {
        const store = this.firstStore;

        // By default, we do not record:
        // - not persistable field changes
        // - null vs undefined changes
        // - same value changes, compared by reference (by value for dates)
        // - "id" changes
        // - "parentId" changes caused by parent record idChange
        return !(
            this.constructor.nonPersistableFields[fieldName] ||
            (oldValue == null && newValue == null) ||
            (oldValue === newValue) ||
            ((oldValue instanceof Date) && (newValue instanceof Date) && oldValue.getTime() === newValue.getTime()) ||
            fieldName === 'id' ||
            fieldName === '$PhantomId' ||
            (fieldName === 'parentId' && store && store.oldIdMap[oldValue] === store.getById(newValue))
        );
    }

    /**
     * Overridden to store initial data of the changed fields and to notify STM
     * manager about the change action if anything has been changed in result.
     *
     * The method is called from within {@link Core/data/Model#function-set} method.
     *
     * @private
     */
    afterSet(field, value, silent, fromRelationUpdate, wasSet, isChronoFieldSet) {
        const
            { stm }              = this,
            nonPersistableFields = this.constructor.nonPersistableFields;

        if (stm?.isBase && stm.enabled && !unrecordedFields[field] && !nonPersistableFields[field]) {
            if (wasSet) {
                let shouldRecord;

                const [newData, oldData] = Object.keys(wasSet).reduce(
                    (data, fieldName) => {
                        const { value, oldValue } = wasSet[fieldName];

                        if (this.shouldRecordFieldChange(fieldName, oldValue, value)) {
                            shouldRecord       = true;
                            data[0][fieldName] = value;
                            data[1][fieldName] = oldValue;
                        }

                        return data;
                    },
                    [{}, {}]
                );

                if (shouldRecord) {
                    stm.onModelUpdate(this, newData, oldData, isChronoFieldSet);
                }
            }
        }

        // No super on purpose, micro optimization of critical perf path
        // super.afterSet?.afterSet(field, value, silent, fromRelationUpdate, wasSet, isChronoFieldSet);
    }

    /**
     * Called from {@link Core/data/mixin/TreeNode#function-insertChild} to obtain inserted
     * records initial parents and parent index, to be able to restore the state back upon undo.
     *
     * @param {Core.data.Model[]} childRecords
     * @returns {Array} Array of results from this call and any of super calls if any.
     *               This result is consumed by {@link #function-afterInsertChild} which pops
     *               from the result array to take only results of this method call and leave
     *               results from super calls untouched.
     *
     * @private
     */
    beforeInsertChild(childRecords) {
        const
            preResult = super.beforeInsertChild?.(childRecords) || [],
            { stm }   = this;

        if (stm?.enabled) {
            preResult.push(
                childRecords.reduce((result, childRecord) => {
                    // We are interested only in records from the same root node.
                    // Removing (which is done before insertion) of the records
                    // from another root (and store) should
                    // be handled by that store STM instance.
                    if (childRecord.root === this.root) {
                        result.set(childRecord, {
                            parent : childRecord.parent,
                            index  : childRecord.parent ? childRecord.parentIndex : undefined
                        });
                    }

                    return result;
                }, new Map())
            );
        }

        return preResult;
    }

    /**
     * Called from {@link Core/data/mixin/TreeNode#function-insertChild} to notify {@link Core/data/stm/StateTrackingManager}
     * about children insertion. Provides it with all necessary context information collected
     * in {@link #function-beforeInsertChild} required to undo/redo the action.
     *
     * @private
     */
    afterInsertChild(index, childRecords, beforeResult, inserted, orderedBeforeNode) {
        const { stm } = this;

        if (stm?.enabled) {
            const context = beforeResult.pop();

            if (inserted) {
                stm.onModelInsertChild(this, index, inserted, context, orderedBeforeNode);
            }
        }

        super.afterInsertChild?.(index, childRecords, beforeResult, inserted);
    }

    /**
     * Called from {@link Core/data/mixin/TreeNode#function-removeChild} to obtain removed
     * records initial parent index, to be able to restore the state back upon undo.
     *
     * @param {Core.data.Model[]} childRecords
     * @param {Boolean} isMove
     * @returns {Array} Array of results from this call and any of super calls if any.
     *               This result is consumed by {@link #function-afterRemoveChild} which pops
     *               from the result array to take only results of this method call and leave
     *               results from super calls untouched.
     *
     * @private
     */
    beforeRemoveChild(childRecords, isMove) {
        const
            preResult = super.beforeRemoveChild ? super.beforeRemoveChild(childRecords, isMove) : [],
            { stm }   = this;

        // If it's move then InsertChildAction will handle this case
        if (stm?.enabled && !isMove) {
            // Child records we receive are guaranteed to be direct children
            // of this node, see Core/data/mixin/TreeNode#removeChild method

            // Here we interested in the original index for each child removed,
            // we collect it and store for future use in RemoveChildAction
            preResult.push(
                childRecords.reduce((result, childRecord) => {
                    result.set(childRecord, { parentIndex : childRecord.parentIndex, orderedParentIndex : childRecord.orderedParentIndex });
                    return result;
                }, new Map())
            );
        }

        return preResult;
    }

    /**
     * Called from {@link Core/data/mixin/TreeNode#function-removeChild} to notify {@link Core/data/stm/StateTrackingManager}
     * about children removing. Provides it with all necessary context information collected
     * in {@link #function-beforeRemoveChild} required to undo/redo the action.
     *
     * @private
     */
    afterRemoveChild(childRecords, beforeResult, isMove) {
        const { stm } = this;

        // If it's move then InsertChildAction will handle this case
        if (stm?.enabled && !isMove) {
            const context = beforeResult.pop();

            if (childRecords && childRecords.length) {
                stm.onModelRemoveChild(this, childRecords, context);
            }
        }

        super.afterRemoveChild?.(childRecords, beforeResult, isMove);
    }
};
