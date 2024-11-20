import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import EventSegmentResize from '../../SchedulerPro/feature/EventSegmentResize.js';

/**
 * @module Gantt/feature/TaskSegmentResize
 */

/**
 * Feature that allows resizing a task segment by dragging its end.
 *
 * {@inlineexample Gantt/feature/TaskSegments.js}
 *
 * This feature is **enabled** by default.
 *
 * @extends SchedulerPro/feature/EventSegmentResize
 * @classtype taskSegmentResize
 * @feature
 */
export default class TaskSegmentResize extends EventSegmentResize {

    //region Events

    /**
     * Fired on the owning Gantt before resizing starts. Return `false` to prevent the action.
     * @event beforeTaskSegmentResize
     * @on-owner
     * @preventable
     * @param {Gantt.view.Gantt} source Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord Segment being resized
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the resize starts within
     * @param {MouseEvent} event Browser event
     */

    /**
     * Fires on the owning Gantt when event resizing starts
     * @event taskSegmentResizeStart
     * @on-owner
     * @param {Gantt.view.Gantt} source Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord Segment being resized
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the resize starts within
     * @param {MouseEvent} event Browser event
     */

    /**
     * Fires on the owning Gantt on each resize move event
     * @event taskSegmentPartialResize
     * @on-owner
     * @param {Gantt.view.Gantt} source Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord Segment being resized
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {HTMLElement} element
     */

    /**
     * Fired on the owning Gantt to allow implementer to prevent immediate finalization by setting
     * `data.context.async = true` in the listener, to show a confirmation popup etc.
     *
     * ```javascript
     *  gantt.on('beforeTaskSegmentResizeFinalize', ({context}) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          context.finalize();
     *      }, 1000);
     *  })
     * ```
     *
     * @event beforeTaskSegmentResizeFinalize
     * @on-owner
     * @param {Gantt.view.Gantt} source Gantt instance
     * @param {Object} context
     * @param {Boolean} context.async Set true to handle resize asynchronously (e.g. to wait for user confirmation)
     * @param {Function} context.finalize Call this method to finalize resize. This method accepts one argument:
     *                   pass `true` to update records, or `false`, to ignore changes
     */

    /**
     * Fires on the owning Gantt after the resizing gesture has finished.
     * @event taskSegmentResizeEnd
     * @on-owner
     * @param {Gantt.view.Gantt} source Gantt instance
     * @param {Boolean} changed Shows if the record has been changed by the resize action
     * @param {Gantt.model.TaskModel} taskRecord Segment being resized
     */

    //endregion

    //region Config

    static $name = 'TaskSegmentResize';

    static get configurable() {
        return {
            draggingItemCls : 'b-sch-event-resizing',

            resizingItemInnerCls : null,

            leftHandle : false
        };
    }

    static get pluginConfig() {
        return {

            chain : ['render', 'onEventDataGenerated', 'isTaskElementDraggable', 'isTaskSegmentElementDraggable']
        };
    }

    //endregion

    //region Init & destroy

    // Prevent task dragging when it starts over resize handles
    isTaskElementDraggable(eventElement, eventRecord, el, event) {
        return this.isEventElementDraggable(...arguments);
    }

    // Prevent segment dragging when it starts over resize handles
    isTaskSegmentElementDraggable(eventElement, eventRecord, el, event) {
        return this.isEventElementDraggable(...arguments);
    }

    checkValidity() {
        // Task resize just does basic validity checks which runs the validatorFn
        return this.basicValidityCheck(...arguments);
    }

    getBeforeResizeParams(context) {
        return {};
    }

    // Injects Gantt specific data into the drag context
    setupProductResizeContext(context, event) {
        const
            gantt      = this.client,
            taskRecord = gantt.resolveTaskRecord(context.element);

        Object.assign(context, {
            taskRecord,
            eventRecord     : taskRecord,
            dateConstraints : gantt.getDateConstraints?.(taskRecord)
        });
    }

    async internalUpdateRecord(context, timespanRecord) {
        const
            { client }     = this,
            { generation } = timespanRecord,
            {
                startDate,
                endDate
            }              = context,
            toSet          = { endDate };

        // Fix the duration according to the Entity's rules.
        context.duration = toSet.duration = timespanRecord.run('calculateProjectedDuration', startDate, endDate);

        // Fix the dragged date point according to the Entity's rules.
        const value = toSet[context.toSet] = timespanRecord.run('calculateProjectedXDateWithDuration', startDate, true, context.duration);

        // Update the record to its final correct state using *batched changes*
        // These will *not* be propagated, it's just to force the dragged event bar
        // into its corrected shape before the real changes which will propagate are applied below.
        // We MUST do it like this because the final state may not be a net change if the changes
        // got rejected, and in that case, the engine will not end up firing any change events.
        timespanRecord.set(toSet);

        // Quit listening for batchedUpdate *before* we cancel the batch so that the
        // change events from the revert do not update the UI.
        client.endListeningForBatchedUpdates();

        this.cancelEventRecordBatch(timespanRecord);

        if (this.pinSuccessors && context.event[this.pinSuccessors]) {
            await timespanRecord.setEndDatePinningSuccessors(value);
        }
        else {
            await timespanRecord.setEndDate(value, false);
        }

        timespanRecord.endBatch();

        // If the record has been changed
        return timespanRecord.generation !== generation;
    }

    get tipId() {
        return `${this.client.id}-task-segment-resize-tip`;
    }

    //endregion

}

GridFeatureManager.registerFeature(TaskSegmentResize, true, 'Gantt');
