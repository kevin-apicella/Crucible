/**
 * @module Core/data/stm/state/RecordingState
 */
import StateBase, { throwInvalidMethodCall } from './StateBase.js';
import { STATE_PROP, TRANSACTION_PROP, QUEUE_PROP, POS_PROP, AUTO_RECORD_PROP } from '../Props.js';
import Registry from './Registry.js';
import { resetQueue } from '../Helpers.js';

/**
 * STM recording state class.
 *
 * @internal
 */
export class RecordingStateClass extends StateBase {

    canUndo() {
        return false;
    }

    canRedo() {
        return false;
    }

    onEnable() {}

    onDisable(stm) {
        const transaction = stm[TRANSACTION_PROP];

        stm.notifyStoresAboutStateRecordingStop(transaction, { disabled : true });

        return {
            [STATE_PROP]       : 'disabledstate',
            [TRANSACTION_PROP] : null
        };
    }

    onAutoRecordOn(stm) {
        return [{
            [STATE_PROP]       : 'autorecordingstate',
            [AUTO_RECORD_PROP] : true
        }, () => {
            stm.stopTransactionDelayed();
        }];
    }

    onAutoRecordOff() {
        throwInvalidMethodCall();
    }

    onStartTransaction() {
        throwInvalidMethodCall();
    }

    onStopTransaction(stm, title) {
        const
            transaction = stm[TRANSACTION_PROP],
            queue       = stm[QUEUE_PROP];

        let position = stm[POS_PROP];

        if (transaction.length) {

            if (!transaction.title && !title && stm.getTransactionTitle) {
                transaction.title = stm.getTransactionTitle(transaction);
            }
            else if (title) {
                transaction.title = title;
            }

            queue[position] = transaction;
            queue.length    = ++position;
        }

        return [{
            [STATE_PROP]       : 'readystate',
            [POS_PROP]         : position,
            [TRANSACTION_PROP] : null
        }, () => {
            stm.notifyStoresAboutStateRecordingStop(transaction, { stop : true });
        }];
    }

    onRejectTransaction(stm) {
        const transaction = stm[TRANSACTION_PROP];

        return [{
            [STATE_PROP]       : 'restoringstate',
            [TRANSACTION_PROP] : null
        }, () => {

            if (transaction.length) {
                transaction.undo();
            }

            return [
                'readystate',
                () => {
                    stm.notifyStoresAboutStateRecordingStop(transaction, { rejected : true });
                }
            ];
        }];
    }

    onStopTransactionDelayed() {
        throwInvalidMethodCall();
    }

    onResetQueue(stm, options) {
        return resetQueue(stm, options);
    }

    onModelUpdate(stm, model, newData, oldData, isInitialUserAction) {
        const transaction = stm[TRANSACTION_PROP];
        transaction.addAction(stm.makeModelUpdateAction(model, newData, oldData, isInitialUserAction));
    }

    onModelInsertChild(stm, parentModel, index, childModel, previousParent, previousIndex, orderedBeforeNode) {
        const transaction = stm[TRANSACTION_PROP];
        transaction.addAction(stm.makeModelInsertChildAction(parentModel, index, childModel, previousParent, previousIndex, orderedBeforeNode));
    }

    onModelRemoveChild(stm, parentModel, childModels, context) {
        const transaction = stm[TRANSACTION_PROP];
        transaction.addAction(stm.makeModelRemoveChildAction(parentModel, childModels, context));
    }

    onStoreModelAdd(stm, store, models, silent)    {
        const transaction = stm[TRANSACTION_PROP];
        transaction.addAction(stm.makeStoreModelAddAction(store, models, silent));
    }

    onStoreModelInsert(stm, store, index, models, context, silent) {
        const transaction = stm[TRANSACTION_PROP];
        transaction.addAction(stm.makeStoreModelInsertAction(store, index, models, context, silent));
    }

    onStoreModelRemove(stm, store, models, context, silent) {
        const transaction = stm[TRANSACTION_PROP];
        transaction.addAction(stm.makeStoreModelRemoveAction(store, models, context, silent));
    }

    onStoreRemoveAll(stm, store, allRecords, silent)   {
        const transaction = stm[TRANSACTION_PROP];
        transaction.addAction(stm.makeStoreRemoveAllAction(store, allRecords, silent));
    }
}

/**
 * STM recording state.
 *
 * @internal
 */
const RecordingState = new RecordingStateClass();
export default RecordingState;

Registry.registerStmState('recordingstate', RecordingState);
