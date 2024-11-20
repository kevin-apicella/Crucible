import Base from '../../../Core/Base.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DH from '../../../Core/helper/DateHelper.js';

/**
 * @module Gantt/view/mixin/GanttRegions
 */

/**
 * Functions to get regions (bounding boxes) for gantt, tasks etc.
 *
 * @mixin
 */
export default Target => class GanttRegions extends (Target || Base) {
    static get $name() {
        return 'GanttRegions';
    }

    /**
     * Gets the region represented by the timeline and optionally only for a single task. Returns `null` if passed a
     * task that is filtered out or not part of the task store.
     * @param {Gantt.model.TaskModel} taskRecord (optional) The task record
     * @returns {Core.helper.util.Rectangle|null} The region of the schedule
     */
    getScheduleRegion(taskRecord, local = true, dateConstraints) {
        const
            me                                   = this,
            { timeAxisSubGridElement, timeAxis } = me;

        let region;

        if (taskRecord) {
            const
                taskElement = me.getElementFromTaskRecord(taskRecord),
                row         = me.getRowById(taskRecord.id);

            if (!row) {
                return null;
            }

            region = Rectangle.from(row.getElement('normal'), timeAxisSubGridElement);

            if (taskElement) {
                const taskRegion = Rectangle.from(taskElement, timeAxisSubGridElement);

                region.y      = taskRegion.y;
                region.bottom = taskRegion.bottom;
            }
            else {
                region.y += me.barMargin;
                region.bottom -= me.barMargin;
            }
        }
        else {

            region       = Rectangle.from(timeAxisSubGridElement).moveTo(null, 0);
            region.width = timeAxisSubGridElement.scrollWidth;

            region.y      = region.y + me.barMargin;
            region.bottom = region.bottom - me.barMargin;
        }

        const
            taStart        = timeAxis.startDate,
            taEnd          = timeAxis.endDate,
            { start, end } = dateConstraints || {};

        if (start && end && !timeAxis.timeSpanInAxis(start, end)) {
            return null;
        }

        if (!start && !end) {
            dateConstraints = me.getDateConstraints?.(taskRecord) || {
                start : taStart,
                end   : taEnd
            };
        }

        let startX = me.getCoordinateFromDate(dateConstraints.start ? DH.max(taStart, dateConstraints.start) : taStart),
            endX   = me.getCoordinateFromDate(dateConstraints.end ? DH.min(taEnd, dateConstraints.end) : taEnd);

        if (!local) {
            startX = me.translateToPageCoordinate(startX);
            endX   = me.translateToPageCoordinate(endX);
        }

        region.x     = Math.min(startX, endX);
        region.width = Math.max(startX, endX) - Math.min(startX, endX);

        return region;
    }

    translateToPageCoordinate(x) {
        const element = this.timeAxisSubGridElement;

        return x + element.getBoundingClientRect().left - element.scrollLeft;
    }

    // Decide if a record is inside a collapsed tree node, or inside a collapsed group (using grouping feature)
    isRowVisible(taskRecord) {
        // records in collapsed groups/branches etc. are removed from processedRecords
        return this.store.indexOf(taskRecord) >= 0;
    }

    /**
     * Get the region for a specified task
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Boolean} [includeOutside]
     * @param {Boolean} [inner] Specify true to return the box for the task bar within the wrapper.
     * @returns {Core.helper.util.Rectangle}
     */
    getTaskBox(taskRecord, includeOutside = false, inner = false) {
        return this.taskRendering.getTaskBox(...arguments);
    }

    getSizeAndPosition() {
        return this.taskRendering.getSizeAndPosition(...arguments);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
