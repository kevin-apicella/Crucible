import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import TaskDrag from './TaskDrag.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';

/**
 * @module Gantt/feature/TaskSegmentDrag
 */

/**
 * Allows user to drag and drop task segments, to change their start date.
 *
 * {@inlineexample Gantt/feature/TaskSegments.js}
 *
 * This feature is **enabled** by default
 *
 * @extends Gantt/feature/TaskDrag
 * @demo Gantt/split-tasks
 * @classtype taskSegmentDrag
 * @feature
 */
export default class TaskSegmentDrag extends TaskDrag {



    //region Config

    static $name = 'TaskSegmentDrag';

    static get configurable() {
        return {
            capitalizedEventName : 'TaskSegment'
        };
    }

    static get pluginConfig() {
        return {
            chain : ['onInternalPaint', 'isTaskElementDraggable']
        };
    }

    //endregion

    //region Events

    /**
     * Fires on the owning Gantt before segment dragging starts. Return `false` to prevent the action.
     * @event beforeTaskSegmentDrag
     * @preventable
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel} taskRecord The segment about to be dragged
     * @param {Event} event The native browser event
     */

    /**
     * Fires on the owning Gantt when segment dragging starts
     * @event taskSegmentDragStart
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords Dragged segments
     */

    /**
     * Fires on the owning Gantt while a segment is being dragged
     * @event taskSegmentDrag
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords Dragged segments
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Object} dragData
     * @param {Boolean} changed `true` if startDate has changed.
     */

    /**
     * Fires on the owning Gantt to allow implementer to prevent immediate finalization by setting `data.context.async = true`
     * in the listener, to show a confirmation popup etc
     * ```javascript
     * scheduler.on('beforetasksegmentdropfinalize', ({ context }) => {
     *     context.async = true;
     *     setTimeout(() => {
     *         // async code don't forget to call finalize
     *         context.finalize();
     *     }, 1000);
     * })
     * ```
     * @event beforeTaskSegmentDropFinalize
     * @on-owner
     * @param {Gantt.view.Gantt} source Gantt instance
     * @param {Object} context
     * @param {Gantt.model.TaskModel[]} context.taskRecords Dragged segments
     * @param {Boolean} context.valid Set this to `false` to mark the drop as invalid
     * @param {Boolean} context.async Set true to handle dragdrop asynchronously (e.g. to wait for user
     * confirmation)
     * @param {Function} context.finalize Call this method to finalize dragdrop. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fires on the owning Gantt after a valid task drop
     * @event taskSegmentDrop
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords Dropped segments
     * @param {Boolean} isCopy
     */

    /**
     * Fires on the owning Gantt after a task drop, regardless if the drop validity
     * @event afterTaskSegmentDrop
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords Dropped segments
     * @param {Boolean} valid
     */

    //endregion

    // Prevent TaskDrag to handle a segment
    isTaskElementDraggable(taskElement, taskRecord, el, event) {
        const me = this;

        // We don't care dragging if that's a task having nothing to do w/ segments
        if (me.disabled || (!taskRecord.isEventSegment && !taskRecord.isSegmented)) {
            return true;
        }

        // Otherwise make sure TaskDrag is not trying to handle a segment element drag
        return !el.closest(me.drag.targetSelector);
    }

    //region Drag events

    triggerBeforeEventDrag(eventType, event) {
        return this.client.trigger('beforeTaskSegmentDrag', event);
    }

    triggerBeforeEventDropFinalize(eventType, eventData, client) {
        client.trigger(`before${this.capitalizedEventName}DropFinalize`, eventData);
    }

    triggerEventDrag(dragData, start) {
        // Trigger the event on every mousemove so that features which need to adjust
        // Such as dependencies and baselines can keep adjusted.
        this.client.trigger('taskSegmentDrag', {
            taskRecords : dragData.draggedEntities,
            startDate   : dragData.startDate,
            endDate     : dragData.endDate,
            dragData,
            changed     : dragData.startDate - start !== 0
        });
    }

    triggerDragStart(dragData) {
        this.client.trigger('taskSegmentDragStart', {
            taskRecords : dragData.draggedEntities,
            dragData
        });
    }

    triggerDragAbort(dragData) {
        this.client.trigger('taskSegmentDragAbort', {
            taskRecords : dragData.draggedEntities,
            context     : dragData
        });
    }

    triggerDragAbortFinalized(dragData) {
        this.client.trigger('taskSegmentDragAbortFinalized', {
            taskRecords : dragData.draggedEntities,
            context     : dragData
        });
    }

    triggerAfterDrop(dragData, valid) {
        this.currentOverClient.trigger('afterTaskSegmentDrop', {
            taskRecords : dragData.draggedEntities,
            context     : dragData,
            valid
        });
    }

    onInternalInvalidDrop(abort) {
        super.onInternalInvalidDrop(...arguments);

        // revert main task element width changes
        this.dragData.mainTaskElement.style.width = this.dragData.initialMainTaskElementWidth + 'px';
    }

    //endregion

    //region Drag data

    buildDragHelperConfig() {
        const config = super.buildDragHelperConfig();

        config.targetSelector = '.b-sch-event-segment:not(.b-first)';

        return config;
    }

    getTaskScheduleRegion(taskRecord, dateConstraints) {
        const
            { client }      = this,
            mainTaskElement = client.getElementFromTaskRecord(taskRecord.event),
            mainTaskRegion  = Rectangle.from(mainTaskElement, client.timeAxisSubGridElement),
            result          = this.client.getScheduleRegion(taskRecord.event, true, dateConstraints);

        // For segment we shift constrainRectangle by the main event offset
        result.translate(-mainTaskRegion.x);

        return result;
    }

    setupProductDragData(context) {
        const result = super.setupProductDragData(context);

        result.mainTaskElement = this.client.getElementFromTaskRecord(result.record.event, false);
        result.initialMainTaskElementWidth = parseFloat(result.mainTaskElement.style.width);

        return result;
    }

    updateDragContext(context, event) {
        super.updateDragContext(...arguments);

        const {
            dirty,
            record,
            mainTaskElement,
            initialMainTaskElementWidth
        } = this.dragData;

        // If dragging the last segment update the main task width accordingly
        // need this to update dependency properly while dragging
        if (dirty && !record.nextSegment) {
            // main task width = its origin width + drag distance
            mainTaskElement.style.width = (initialMainTaskElementWidth + context.clientX - context.startClientX) + 'px';
        }
    }

    get tipId() {
        return `${this.client.id}-task-segment-drag-tip`;
    }

    //endregion

    //region Finalize & validation

    /**
     * Update tasks being dragged.
     * @private
     * @param {Object} context Drag data.
     */
    async updateRecords(context) {
        const
            {
                startDate,
                draggedEntities : [taskRecord]
            }                = context,
            oldStartDate     = taskRecord.startDate;

        if (taskRecord.isEventSegment) {
            await taskRecord.setStartDate(startDate, true);

            // If not rejected (the startDate has changed), tell the world there was a successful drop.
            if (taskRecord.startDate - oldStartDate) {
                this.client.trigger('taskSegmentDrop', {
                    taskRecords : context.draggedEntities
                });
            }
            else {
                this.dragData.valid = false;
            }
        }
    }

    getDateConstraints(taskRecord) {
        const result = super.getDateConstraints(taskRecord) || {};

        let { minDate, maxDate } = result;

        // A segment movement is constrained by its neighbor segments if any
        if (taskRecord.previousSegment && (!minDate || minDate < taskRecord.previousSegment.endDate)) {
            minDate = taskRecord.previousSegment.endDate;
        }

        if (taskRecord.nextSegment && (!maxDate || maxDate < taskRecord.nextSegment.startDate)) {
            maxDate = taskRecord.nextSegment.startDate;
        }

        return (minDate || maxDate) && {
            start : minDate,
            end   : maxDate
        };
    }

    //endregion
}

GridFeatureManager.registerFeature(TaskSegmentDrag, true, 'Gantt');
