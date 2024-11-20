import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

/**
 * @module Gantt/view/mixin/GanttScroll
 */

const defaultScrollOptions = {
    block      : 'nearest',
    edgeOffset : 20
};

/**
 * Functions for scrolling to tasks, dates etc.
 *
 * @mixin
 */
export default Target => class GanttScroll extends (Target || Base) {
    static get $name() {
        return 'GanttScroll';
    }

    /**
     * Scrolls a task record into the viewport.
     *
     * @param {Gantt.model.TaskModel} taskRecord The task record to scroll into view
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     */
    async scrollTaskIntoView(taskRecord, options = defaultScrollOptions) {
        const me = this;

        let taskStart                                            = taskRecord.startDate,
            taskEnd                                              = taskRecord.endDate,
            { startDate : timeAxisStart, endDate : timeAxisEnd } = me.timeAxis;

        if (options.edgeOffset == null) {
            options.edgeOffset = 20;
        }

        if (!taskRecord.isScheduled) {
            return this.scrollRowIntoView(taskRecord, options);
        }

        if (me.timeAxisSubGrid.collapsed) {
            return;
        }

        // For infinite scroll: treat tasks that are in the buffer area as outside
        if (me.infiniteScroll) {
            const
                scrollable     = me.timelineScroller,
                { clientSize } = scrollable,
                requiredSize   = clientSize * me.bufferCoef,
                bufferPx       = requiredSize * me.bufferThreshold,
                bufferInMs     = me.timeAxisViewModel.getDateFromPosition(bufferPx) - timeAxisStart;

            timeAxisStart = new Date(timeAxisStart.valueOf() + bufferInMs);
            timeAxisEnd   = new Date(timeAxisEnd.valueOf() - bufferInMs);
        }

        taskStart = taskStart || taskEnd;
        taskEnd   = taskEnd || taskStart;

        const taskIsOutside = taskStart < timeAxisStart | ((taskEnd > timeAxisEnd) << 1);

        // Make sure task is within TimeAxis time span unless extendTimeAxis passed as false.
        // The TaskEdit feature passes false because it must not mutate the TimeAxis.
        // Bitwise flag:
        //  1 === start is before TimeAxis start.
        //  2 === end is after TimeAxis end.
        if (taskIsOutside && options.extendTimeAxis !== false) {
            const currentTimeSpanRange = me.timeAxis.endDate - me.timeAxis.startDate;
            let startAnchorPoint, endAnchorPoint;

            // Event is too wide, expand the range to encompass it.
            if (taskIsOutside === 3) {
                await me.timeAxis.setTimeSpan(
                    new Date(taskStart.valueOf() - currentTimeSpanRange / 2),
                    new Date(taskEnd.getTime() + currentTimeSpanRange / 2)
                );
            }
            else if (me.infiniteScroll) {
                const
                    { visibleDateRange } = me,
                    visibleMS            = visibleDateRange.endMS - visibleDateRange.startMS,
                    // If event starts before time axis, scroll to a date one full viewport after target date
                    // (reverse for an event starting after time axis), to allow a scroll animation
                    sign                 = taskIsOutside & 1 ? 1 : -1;

                await me.setTimeSpan(
                    new Date(taskStart.valueOf() - currentTimeSpanRange / 2),
                    new Date(taskStart.valueOf() + currentTimeSpanRange / 2),
                    {
                        visibleDate : new Date(taskEnd.valueOf() + (sign * visibleMS))
                    }
                );
            }
            // Event is partially or wholly outside but will fit.
            // Move the TimeAxis to include it. Attempt to maintain visual position.
            else {
                startAnchorPoint = me.getCoordinateFromDate((taskIsOutside & 1) ? taskEnd : taskStart);

                // Event starts before
                if (taskIsOutside & 1) {
                    await me.timeAxis.setTimeSpan(
                        new Date(taskStart),
                        new Date(taskStart.valueOf() + currentTimeSpanRange)
                    );
                }
                // Event ends after
                else {
                    await me.timeAxis.setTimeSpan(
                        new Date(taskEnd.valueOf() - currentTimeSpanRange),
                        new Date(taskEnd)
                    );
                }
                // Restore view to same relative scroll position.
                endAnchorPoint = (taskIsOutside & 1)
                    ? me.getCoordinateFromDate(taskEnd)
                    : me.getCoordinateFromDate(taskStart);

                await me.timeAxisSubGrid.scrollable.scrollBy(endAnchorPoint - startAnchorPoint);
            }
        }

        // Establishing element to scroll to
        const el = me.getElementFromTaskRecord(taskRecord);

        if (el) {
            const scroller = me.timeAxisSubGrid.scrollable;

            // Scroll into view with animation and highlighting if needed.
            await scroller.scrollIntoView(el, options);
        }
        else {
            // Event not rendered, scroll to calculated location
            await me.scrollUnrenderedTaskIntoView(taskRecord, options);
        }
    }

    /**
     * Scrolls an unrendered task into view. Internal function used from #scrollTaskIntoView.
     * @private
     */
    async scrollUnrenderedTaskIntoView(taskRec, options = defaultScrollOptions) {
        if (options.edgeOffset == null) {
            options.edgeOffset = 20;
        }

        const me = this;

        await me.expandTo(taskRec);

        const
            scroller         = me.timeAxisSubGrid.scrollable,
            box              = me.getTaskBox(taskRec),
            scrollerViewport = scroller.viewport,
            targetRect       = box.translate(scrollerViewport.x - scroller.x, scrollerViewport.y - scroller.y);

        await scroller.scrollIntoView(targetRect, Object.assign({}, options, { highlight : false }));

        if (options.highlight) {
            const element = me.getElementFromTaskRecord(taskRec);
            element && DomHelper.highlight(element);
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
