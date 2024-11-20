import DragCreateBase from '../../Scheduler/feature/base/DragCreateBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import Draggable from '../../Core/mixin/Draggable.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Gantt/feature/TaskDragCreate
 */

/**
 * A feature that allows the user to schedule tasks by dragging in the empty parts of the gantt timeline row. Note, this feature is only applicable for unscheduled tasks.
 *
 * {@inlineexample Gantt/feature/TaskDragCreate.js}
 *
 * This feature is **enabled** by default
 *
 * @demo Gantt/advanced
 *
 * @extends Scheduler/feature/base/DragCreateBase
 * @classtype taskDragCreate
 * @feature
 */
export default class TaskDragCreate extends DragCreateBase {
    //region Config

    static $name = 'TaskDragCreate';

    static configurable = {
        // used by gantt to only allow one task per row
        preventMultiple : true
    };

    //endregion

    //region Events

    /**
     * Fires on the owning Gantt after the task has been scheduled.
     * @event dragCreateEnd
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {MouseEvent} event The ending mouseup event.
     * @param {HTMLElement} proxyElement The proxy element showing the drag creation zone.
     */

    /**
     * Fires on the owning Gantt at the beginning of the drag gesture
     * @event beforeDragCreate
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Date} date The datetime associated with the drag start point.
     */

    /**
     * Fires on the owning Gantt after the drag start has created a proxy element.
     * @event dragCreateStart
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {HTMLElement} proxyElement The proxy representing the new event.
     */

    /**
     * Fires on the owning Gantt to allow implementer to prevent immediate finalization by setting `data.context.async = true`
     * in the listener, to show a confirmation popup etc
     * ```
     *  scheduler.on('beforedragcreatefinalize', ({context}) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          context.finalize();
     *      }, 1000);
     *  })
     * ```
     * @event beforeDragCreateFinalize
     * @on-owner
     * @param {Gantt.view.Gantt} source Scheduler instance
     * @param {HTMLElement} proxyElement Proxy element, representing future event
     * @param {Object} context
     * @param {Boolean} context.async Set true to handle drag create asynchronously (e.g. to wait for user
     * confirmation)
     * @param {Function} context.finalize Call this method to finalize drag create. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fires on the owning Gantt at the end of the drag create gesture whether or not
     * a task was scheduled by the gesture.
     * @event afterDragCreate
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {HTMLElement} proxyElement The element showing the drag creation zone.
     */

    //endregion

    //region Init

    get store() {
        return this.client.store;
    }

    //endregion

    //region Gantt specific implementation

    setupDragContext(event) {
        const { client } = this;

        // Only mousedown on an empty cell can initiate drag-create
        if (event.target.closest?.(`.${client.timeAxisColumn.cellCls}`)) {
            const taskRecord = client.getRecordFromElement(event.target);

            // And there must be a task backing the cell.
            if (taskRecord) {
                // Skip the EventResize's setupDragContext. We want the base one.
                const result = Draggable().prototype.setupDragContext.call(this, event);

                result.scrollManager = client.scrollManager;
                result.taskRecord = result.rowRecord = taskRecord;
                return result;
            }
        }
    }

    startDrag(drag) {
        // This flag must be set in startDrag
        const
            me           = this,
            draggingEnd  = me.draggingEnd = drag.event.pageX > drag.startEvent.pageX,
            { client }   = me,
            { timeAxis } = client,
            {
                mousedownDate,
                taskRecord,
                date
            }            = drag;

        client.beginListeningForBatchedUpdates();
        taskRecord.beginBatch();
        taskRecord.set('startDate', DateHelper.floor(draggingEnd ? mousedownDate : date, timeAxis.resolution, undefined, client.weekStartDay));
        taskRecord.set('endDate', DateHelper.ceil(draggingEnd ? date : mousedownDate, timeAxis.resolution, undefined, client.weekStartDay));

        // This presents the task to be scheduled for validation at the proposed mouse/date point
        // If rejected, we have to revert the batched changes
        if (me.handleBeforeDragCreate(drag, taskRecord, drag.event) === false) {
            me.onAborted(drag);
            return false;
        }

        // Now it will have an element, and that's what we are dragging
        drag.itemElement = drag.element = client.getElementFromTaskRecord(drag.taskRecord);

        return super.startDrag.call(me, drag);
    }

    handleBeforeDragCreate(drag, taskRecord, event) {
        const
            me     = this,
            result = me.client.trigger('beforeDragCreate', {
                taskRecord,
                date : drag.mousedownDate,
                event
            });

        // Save date constraints
        me.dateConstraints = me.client.getDateConstraints?.(taskRecord);

        return result;
    }

    checkValidity(context, event) {
        const me = this;

        context.taskRecord = me.dragging.taskRecord;
        return me.createValidatorFn.call(me.validatorFnThisObj || me, context, event);
    }

    // Row is not empty if task is scheduled
    isRowEmpty(taskRecord) {
        return !taskRecord.startDate || !taskRecord.endDate;
    }

    onAborted({ taskRecord }) {
        taskRecord.cancelBatch();
        this.client.endListeningForBatchedUpdates();
    }

    async internalUpdateRecord(context, taskRecord) {
        const
            {
                startDate,
                endDate
            } = context;

        // Quit listening for batchedUpdate *before* we cancel the batch so that the
        // change events from the revert do not update the UI.
        this.client.endListeningForBatchedUpdates();

        this.cancelEventRecordBatch(taskRecord);

        taskRecord.set({
            startDate,
            endDate
        });

        return true;
    }

    //endregion
}

GridFeatureManager.registerFeature(TaskDragCreate, true, 'Gantt');
