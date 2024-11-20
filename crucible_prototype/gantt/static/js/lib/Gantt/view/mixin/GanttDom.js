import Base from '../../../Core/Base.js';
import DomDataStore from '../../../Core/data/DomDataStore.js';

/**
 * @module Gantt/view/mixin/GanttDom
 */

const hyphenRe = /-/g;

/**
 * An object which encapsulates a Gantt timeline tick context based on a DOM event. This will include
 * the row (task) information and the tick and time information for a DOM pointer event detected
 * in the timeline.
 * @typedef {Object} GanttTimelineContext
 * @property {Event} domEvent The DOM event which triggered the context change.
 * @property {HTMLElement} eventElement If the `domEvent` was on an event bar, this will be the event bar element.
 * @property {HTMLElement} cellElement The cell element under the `domEvent`
 * @property {Date} date The date corresponding to the `domEvent` position in the timeline
 * @property {Scheduler.model.TimeSpan} tick A {@link Scheduler.model.TimeSpan} record which encapsulates the contextual tick
 * @property {Number} tickIndex The contextual tick index. This may be fractional.
 * @property {Number} tickParentIndex The integer contextual tick index.
 * @property {Date} tickStartDate The start date of the contextual tick.
 * @property {Date} tickEndDate The end date of the contextual tick.
 * @property {Grid.row.Row} row The contextual {@link Grid.row.Row}
 * @property {Number} index The contextual row index
 * @property {Gantt.model.TaskModel} [taskRecord] The contextual task record (if any) if the event source is a `Gantt`
 */

/**
 * Fired when the pointer-activated {@link Scheduler.view.mixin.TimelineDomEvents#property-timelineContext} has changed.
 * @event timelineContextChange
 * @override // this has different TimelineContext type from the one in TimelineDomEvents
 * @param {GanttTimelineContext} oldContext The tick/task context being deactivated.
 * @param {GanttTimelineContext} context The tick/task context being activated.
 */

/**
 * Mixin with TaskModel <-> HTMLElement mapping functions
 *
 * @mixin
 */
export default Target => class GanttDom extends (Target || Base) {
    static get $name() {
        return 'GanttDom';
    }

    // Alias for resolveTaskRecord method to satisfy the scheduler naming requirements.
    resolveEventRecord(element) {
        return this.resolveTaskRecord(element);
    }

    /**
     * Returns the task record for a DOM element
     * @param {HTMLElement} element The DOM node to lookup
     * @returns {Gantt.model.TaskModel} The task record
     */
    resolveTaskRecord(element) {
        const eventElement = element.closest(this.eventSelector);

        return eventElement ? this.store.getById(eventElement.dataset.taskId) : this.getRecordFromElement(element);
    }

    /**
     * Product agnostic method which yields the {@link Gantt.model.TaskModel} record which underpins the row which
     * encapsulates the passed element. The element can be a grid cell, or an event element, and the result
     * will be a {@link Gantt.model.TaskModel}
     * @param {HTMLElement|Event} elementOrEvent The HTML element or DOM event to resolve a record from
     * @returns {Gantt.model.TaskModel} The resource corresponding to the element, or null if not found.
     */
    resolveRowRecord(elementOrEvent) {
        return this.resolveTaskRecord(elementOrEvent);
    }

    /**
     * Relays keydown events as taskKeyDown if we have a selected task(s).
     * @private
     */
    onElementKeyDown(event) {
        const taskRecord = this.resolveTaskRecord(event.target);

        super.onElementKeyDown(event);

        if (taskRecord) {
            this.trigger('taskKeyDown', {
                taskRecord,
                event
            });
        }
    }

    /**
     * Relays keyup events as taskKeyUp if we have a selected task(s).
     * @private
     */
    onElementKeyUp(event) {
        const taskRecord = this.resolveTaskRecord(event.target);

        super.onElementKeyUp(event);

        if (taskRecord) {
            this.trigger('taskKeyUp', {
                taskRecord,
                event
            });
        }
    }

    /**
     * Returns the HTMLElement representing a task record.
     *
     * @param {Gantt.model.TaskModel} taskRecord A task record
     * @param {Boolean} [inner] Specify `false` to return the task wrapper element
     *
     * @returns {HTMLElement} The element representing the task record
     */
    getElementFromTaskRecord(taskRecord, inner = true) {
        return this.taskRendering.getElementFromTaskRecord(taskRecord, inner);
    }


    // Alias to make scheduler features applied to Gantt happy
    getElementFromEventRecord(eventRecord) {
        return this.getElementFromTaskRecord(eventRecord);
    }

    /**
     * Generates the element `id` for a task element. This is used when
     * recycling an event div which has been moved from one resource to
     * another. The event is assigned its new render id *before* being
     * returned to the free pool, so that when the render engine requests
     * a div from the free pool, the same div will be returned and it will
     * smoothly transition to its new position.
     * @param {Scheduler.model.EventModel} taskRecord
     * @private
     */
    getEventRenderId(taskRecord) {

        return `${this.id.toString().replace(hyphenRe, '_')}-${taskRecord.id}`;
    }

    /**
     * In Gantt, the task is the row, so it's valid to resolve a mouse event on a task to the TimeAxisColumn's cell.
     *
     * This method find the cell location of the passed event. It returns an object describing the cell.
     * @param {Event} event A Mouse, Pointer or Touch event targeted at part of the grid.
     * @returns {Object} An object containing the following properties:
     * - `cellElement` - The cell element clicked on.
     * - `columnId` - The `id` of the column clicked under.
     * - `record` - The {@link Core.data.Model record} clicked on.
     * - `id` - The `id` of the {@link Core.data.Model record} clicked on.
     * @private
     * @category Events
     */
    getEventData(event) {
        const
            me     = this,
            record = me.resolveTimeSpanRecord(event.target);

        // If the event was on a task, then we're in one of the TimeAxisColumn's cells.
        if (record) {
            const
                cellElement = me.getCell({
                    record,
                    column : me.timeAxisColumn
                }),
                cellData = DomDataStore.get(cellElement),
                id       = cellData.id,
                columnId = cellData.columnId;

            return {
                cellElement,
                cellData,
                columnId,
                id,
                record,
                cellSelector : { id, columnId }
            };
        }
        else {
            return super.getEventData(event);
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
