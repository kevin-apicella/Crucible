import Base from '../../../Core/Base.js';
import DomSync from '../../../Core/helper/DomSync.js';
import DomClassList from '../../../Core/helper/util/DomClassList.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';



/**
 * @module Gantt/view/orientation/NewTaskRendering
 * @internal
 */

const
    releaseEventActions  = {
        releaseElement : 1, // Not used at all at the moment
        reuseElement   : 1  // Used by some other element
    },
    renderEventActions   = {
        newElement      : 1,
        reuseOwnElement : 1,
        reuseElement    : 1
    };

/**
 * Handles rendering of tasks, using the following strategy:
 *
 * 1. When a row is rendered, it collects a DOM config for its task bar and stores in a map (row -> config)
 * 2. When a rendering pass is done, it syncs the DOM configs from the map to DOM
 *
 * The need for caching with this approach is minimal, only the map needs to be kept up to date with available rows.
 *
 * @internal
 * @extends Core/Base
 */
export default class NewTaskRendering extends Base {

    //region Config & Init

    static get properties() {
        return {
            rowMap : new Map()
        };
    }

    construct(gantt) {
        this.gantt = gantt;

        gantt.rowManager.ion({
            renderDone      : 'onRenderDone',
            removeRows      : 'onRemoveRows',
            beforeRowHeight : 'onBeforeRowHeightChange',
            translateRow    : 'onTranslateRow',
            thisObj         : this
        });

        super.construct({});
    }

    init() {}

    //endregion

    //region View hooks

    refreshRows() {}

    onTimeAxisViewModelUpdate() {
        // Update view bounds
        this.updateFromHorizontalScroll(this.gantt.timeAxisSubGrid.scrollable.x);
    }

    onViewportResize() {}

    onDragAbort() {}

    onBeforeRowHeightChange(event) {
        const
            { gantt } = this,
            { total } = gantt.resourceMarginObject;

        if (gantt.foregroundCanvas) {
            //gantt.element.classList.add('b-notransition');
            gantt.foregroundCanvas.style.fontSize = `${(event?.height ?? gantt.rowHeight) - total}px`;
            //gantt.element.classList.remove('b-notransition');
        }
    }

    // While Gantt by default uses fixed row height, it can be configured otherwise. Handle translation changes
    onTranslateRow({ row }) {
        // Newly added rows are translated prior to having an id, rule those out since they will be rendered later
        if (row.id != null) {
            this.redraw(this.gantt.store.getById(row.id));
        }
    }

    //endregion

    //region Region & coordinates

    get visibleDateRange() {
        return this._visibleDateRange;
    }


    getTaskBox(taskRecord, includeOutside = false, inner = false) {
        const
            { gantt }           = this,
            { start, total }    = gantt.resourceMarginObject,
            { isBatchUpdating } = taskRecord,
            { store }           = gantt,
            startDate           = isBatchUpdating ? taskRecord.get('startDate') : taskRecord.startDate,
            endDate             = isBatchUpdating ? taskRecord.get('endDate') : taskRecord.endDate;

        if (inner) {
            const innerElement = this.getElementFromTaskRecord(taskRecord);

            if (innerElement) {
                return Rectangle.from(innerElement, gantt.timeAxisSubGridElement);
            }
        }

        // A task that gets startDate during initial propagation, which seems not have happened yet.
        // Or a removed task (this fn is also used for baselines). Nothing to render then
        if (!startDate || !endDate || (taskRecord.isTask && (store.isDestroyed || !store.isAvailable(taskRecord)))) {
            return null;
        }

        const positionData = this.getSizeAndPosition(taskRecord, includeOutside, inner);

        if (!positionData) {
            return null;
        }

        const
            { position, width } = positionData,
            top = gantt.rowManager.calculateTop(store.indexOf(taskRecord.isBaseline ? taskRecord.task : taskRecord)) + start,
            height = gantt.rowHeight - total,
            bounds = new Rectangle(position, top, width, height);

        // Position always correct in Gantt, since there is no stacking
        bounds.layout = true;

        return bounds;
    }

    // returns an object with `position` + `width`. If task is not inside current time axis, position is -1
    getSizeAndPosition(taskRecord, includeOutside, inner) {
        const
            me                        = this,
            { gantt }                 = me,
            { total }                 = gantt.resourceMarginObject,
            { timeAxis }              = gantt,
            viewStart                 = timeAxis.startDate,
            viewEnd                   = timeAxis.endDate,
            isMilestone               = taskRecord.milestone,
            // Ensure dependencies feature is present (=== false if not)
            horizontalAdjustment      = isMilestone ? gantt.features.dependencies.pathFinder?.startArrowMargin : 0;

        let
            // Must use Model.get in order to get latest values in case we are inside a batch.
            // TaskResize changes the endDate using batching to enable a tentative change
            // via the batchedUpdate event which is triggered when changing a field in a batch.
            // Fall back to accessor if propagation has not populated date fields.
            taskStart            = taskRecord.isBatchUpdating ? taskRecord.get('startDate') : taskRecord.startDate,
            // Might get here before engine has normalized
            taskEnd              = taskRecord.isBatchUpdating
                ? taskRecord.get('endDate')
                : taskRecord.endDate || (taskRecord.duration != null
                    ? DateHelper.add(taskStart, taskRecord.duration, taskRecord.durationUnit) : null),
            startCoordinate, endCoordinate;

        // Early bailout for tasks that are fully out of timeaxis
        if (
            !includeOutside &&
            (isMilestone && (taskEnd < viewStart || taskStart > viewEnd) || !isMilestone && (taskEnd <= viewStart || taskStart >= viewEnd))
        ) {
            return null;
        }

        // The calls using `includeOutside` are not used during task rendering, but when rendering dependencies.
        // In those cases the lines are expected to be drawn even to tasks fully out of view, clipped to view bounds
        if (includeOutside && taskStart < viewStart) {
            startCoordinate = gantt.getCoordinateFromDate(viewStart) - horizontalAdjustment;
        }
        else if (includeOutside && taskStart > viewEnd) {
            startCoordinate = gantt.getCoordinateFromDate(viewEnd) + horizontalAdjustment;
        }
        // Starts before view and ends in or after view, approximate startCoordinate
        else if (taskStart < viewStart) {
            const
                // Using seconds instead of ms in a try to not lose too much precision in year views
                pxPerSecond      = gantt.timeAxisViewModel.getSingleUnitInPixels('second'),
                secondsOutOfView = (timeAxis.startMS - taskRecord.startDateMS) / 1000, // taskRecord.startDateMS is cached in TimeSpan
                pxOutOfView      = secondsOutOfView * pxPerSecond;

            startCoordinate = gantt.getCoordinateFromDate(viewStart) - pxOutOfView;
        }
        // The "normal" case, somewhere in the timeaxis
        else {
            if (gantt.fillTicks && !isMilestone && (!taskRecord.isBatchUpdating || gantt.snap)) {
                const
                    tick = timeAxis.getSnappedTickFromDate(taskStart);

                taskStart = tick.startDate;
            }
            startCoordinate = gantt.getCoordinateFromDate(taskStart);
        }

        if (!isMilestone) {
            // Same logic applies to `includeOutside` for end date, clip to view
            if (includeOutside && taskEnd < viewStart) {
                endCoordinate = gantt.getCoordinateFromDate(viewStart);
            }
            else if (includeOutside && taskEnd > viewEnd) {
                endCoordinate = gantt.getCoordinateFromDate(viewEnd);
            }
            // Starts in or before view and ends outside, approximate end
            else if (taskEnd > viewEnd) {
                const
                    pxPerSecond      = gantt.timeAxisViewModel.getSingleUnitInPixels('second'),
                    secondsOutOfView = (taskRecord.endDateMS - timeAxis.endMS) / 1000, // taskRecord.endDateMS is cached in TimeSpan
                    pxOutOfView      = secondsOutOfView * pxPerSecond;

                endCoordinate = gantt.getCoordinateFromDate(viewEnd) + pxOutOfView;
            }
            else {
                if (gantt.fillTicks && (!taskRecord.isBatchUpdating || gantt.snap)) {
                    const
                        tickIdx = Math.ceil(gantt.timeAxis.getTickFromDate(taskEnd)) - 1,
                        tick    = gantt.timeAxis.getAt(tickIdx);

                    taskEnd = tick.endDate;
                }
                endCoordinate = gantt.getCoordinateFromDate(taskEnd);
            }
        }

        let width = isMilestone ? 0 : Math.abs(startCoordinate - endCoordinate);

        // Requesting diamond width, in viewport space
        if (inner && isMilestone && taskStart > viewStart && taskStart < viewEnd) {
            // By default as wide as it is high
            width = gantt.rowHeight - total;
            startCoordinate -= width / 2;
        }

        if (!includeOutside && startCoordinate + width < 0) {
            return null;
        }

        return {
            position : startCoordinate,
            width
        };
    }

    getRowRegion(taskRecord, startDate, endDate) {
        const
            { gantt } = this,
            row       = gantt.getRowFor(taskRecord);

        // might not be rendered
        if (!row) {
            return null;
        }

        const
            rowElement = row.getElement(gantt.timeAxisSubGrid.region),
            taStart    = gantt.timeAxis.startDate,
            taEnd      = gantt.timeAxis.endDate,
            start      = startDate ? DateHelper.max(taStart, startDate) : taStart,
            end        = endDate ? DateHelper.min(taEnd, endDate) : taEnd,
            startX     = gantt.getCoordinateFromDate(start),
            endX       = gantt.getCoordinateFromDate(end, true, true),
            y          = row.top + gantt.scrollTop,
            x          = Math.min(startX, endX),
            bottom     = y + rowElement.offsetHeight;

        return new Rectangle(x, y, Math.max(startX, endX) - x, bottom - y);
    }

    getDateFromXY(xy, roundingMethod, local) {
        let coord = xy[0];

        if (!local) {
            coord = this.translateToScheduleCoordinate(coord);
        }

        return this.gantt.timeAxisViewModel.getDateFromPosition(coord, roundingMethod);
    }

    translateToScheduleCoordinate(x) {
        // Get rid of fractional pixels, to not end up with negative fractional values for pos
        const pos = x - Math.floor(this.gantt.timeAxisSubGridElement.getBoundingClientRect().left);
        return pos + this.gantt.scrollLeft;
    }

    translateToPageCoordinate(x) {
        const
            client = this.gantt,
            { scrollable } = client.timeAxisSubGrid;

        let result = x + client.timeAxisSubGridElement.getBoundingClientRect().left;

        if (client.rtl) {
            result -= scrollable.maxX - Math.abs(client.scrollLeft);
        }
        else {
            result -= client.scrollLeft;
        }

        return result;
    }

    //endregion

    //region Element <-> Record mapping

    getElementFromTaskRecord(taskRecord, inner = true) {
        const { syncIdMap } = this.gantt.foregroundCanvas;

        let wrapper = syncIdMap?.[taskRecord.id];

        // For linked tasks, we might be trying to find element for the original. If none found, we also check linked
        // tasks. Needed for dependencies, since they point to original tasks, not linked ones.
        if (!wrapper && taskRecord.hasLinks && syncIdMap) {
            taskRecord.forEachLinked((store, linked) => {
                if (syncIdMap[linked.id]) {
                    wrapper = syncIdMap[linked.id];
                }
            });
        }

        return inner ? wrapper?.syncIdMap.task : wrapper;
    }

    //endregion

    //region Dependency connectors

    // Cannot be moved from this file, called from currentOrientation.xx

    /**
     * Gets displaying item start side
     *
     * @param {Gantt.model.TaskModel} taskRecord
     * @returns {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorStartSide(taskRecord) {
        return this.gantt.rtl ? 'right' : 'left';
    }

    /**
     * Gets displaying item end side
     *
     * @param {Gantt.model.TaskModel} taskRecord
     * @returns {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorEndSide(taskRecord) {
        return this.gantt.rtl ? 'left' : 'right';
    }

    //endregion

    //region Rendering

    onRemoveRows({ rows }) {
        rows.forEach(row => this.rowMap.delete(row));
        !this.gantt.refreshSuspended && this.onRenderDone();
    }

    // Update header range on horizontal scroll. No need to draw any tasks, Gantt only cares about vertical scroll
    updateFromHorizontalScroll(scrollX) {
        const
            me            = this,
            { gantt }     = me,
            {
                timeAxisSubGrid,
                timeAxis,
                rtl
            }             = gantt,
            { width }     = timeAxisSubGrid,
            { totalSize } = gantt.timeAxisViewModel,
            start         = scrollX,
            // If there are few pixels left from the right most position then just render all remaining ticks,
            // there wouldn't be many. It makes end date reachable with more page zoom levels while not having any poor
            // implications.
            // 5px to make TimeViewRangePageZoom test stable in puppeteer.
            returnEnd     = timeAxisSubGrid.scrollable.maxX !== 0 && Math.abs(timeAxisSubGrid.scrollable.maxX) <= Math.round(start) + 5,
            startDate     = gantt.getDateFromCoord({ coord : Math.max(0, start), ignoreRTL : true }),
            endDate       = returnEnd ? timeAxis.endDate : (gantt.getDateFromCoord({ coord : start + width, ignoreRTL : true }) || timeAxis.endDate);

        if (startDate && !gantt._viewPresetChanging) {
            me._visibleDateRange = { startDate, endDate, startMS : startDate.getTime(), endMS : endDate.getTime() };
            me.viewportCoords  = rtl
                // RTL starts all the way to the right (and goes in opposite direction)
                ? { left : totalSize - scrollX - width, right : totalSize - scrollX }
                // LTR all the way to the left
                : { left : scrollX, right : scrollX + width };

            // Update timeaxis header making it display the new dates
            const range = gantt.timeView.range = { startDate, endDate };

            gantt.internalOnVisibleDateRangeChange(range);
        }
    }

    internalPopulateTaskRenderData(renderData, taskRecord) {
        const
            { gantt }   = this,
            taskContent = {
                className : 'b-gantt-task-content',
                dataset   : {
                    taskBarFeature : 'content'
                },
                children : []
            };

        if (renderData) {
            let resizable = (taskRecord.isResizable === undefined ? true : taskRecord.isResizable);

            if (renderData.startsOutsideView) {
                if (resizable === true) {
                    resizable = 'end';
                }
                else if (resizable === 'start') {
                    resizable = false;
                }
            }
            if (renderData.endsOutsideView) {
                if (resizable === true) {
                    resizable = 'start';
                }
                else if (resizable === 'end') {
                    resizable = false;
                }
            }

            Object.assign(renderData, {
                iconCls    : new DomClassList(taskRecord.taskIconCls),
                id         : gantt.getEventRenderId(taskRecord),
                style      : taskRecord.style || '',
                taskId     : taskRecord.id,
                // Classes for the wrapping div
                wrapperCls : new DomClassList({
                    [gantt.eventCls + '-wrap']   : 1,
                    [`${gantt.eventCls}-parent`] : taskRecord.isParent,
                    'b-milestone-wrap'           : taskRecord.milestone,
                    'b-inactive'                 : taskRecord.inactive,
                    'b-expanded'                 : taskRecord.isParent && taskRecord.isExpanded(gantt.store),
                    'b-readonly'                 : taskRecord.readOnly,
                    'b-linked'                   : taskRecord.isLinked,
                    'b-original'                 : taskRecord.hasLinks,
                    'b-temporary'                : !taskRecord.project
                }),
                // Task record cls property is now a DomClassList, so clone it
                // so that it can be manipulated here and by renderers.
                cls          : taskRecord.isResourceTimeRange ? new DomClassList() : taskRecord.cls.clone(),
                // Extra DOMConfigs to add to the tasks row, for example for indicators
                extraConfigs : []
            });

            // Gather event element classes as keys to add to the renderData.cls DomClassList.
            // Truthy value means the key will be added as a class name.
            Object.assign(renderData.cls, {
                [gantt.eventCls]                       : 1,
                [gantt.generatedIdCls]                 : taskRecord.hasGeneratedId,
                [gantt.dirtyCls]                       : taskRecord.modifications,
                [gantt.committingCls]                  : taskRecord.isCommitting,
                [gantt.endsOutsideViewCls]             : renderData.endsOutsideView,
                [gantt.startsOutsideViewCls]           : renderData.startsOutsideView,
                [gantt.fixedEventCls]                  : taskRecord.isDraggable === false,
                [`b-sch-event-resizable-${resizable}`] : 1,
                'b-milestone'                          : taskRecord.milestone,
                // 'b-critical'                           : taskRecord.critical,
                'b-task-started'                       : taskRecord.isStarted,
                'b-task-finished'                      : taskRecord.isCompleted,
                'b-task-selected'                      : gantt.selectedRecords.includes(taskRecord)
            });

            const
                eventStyle = taskRecord.eventStyle || gantt.eventStyle,
                eventColor = taskRecord.eventColor || gantt.eventColor;

            renderData.eventColor = eventColor;
            renderData.eventStyle = eventStyle;

            if (gantt.taskRenderer) {
                // User has specified a renderer fn, either to return a simple string, or an object
                const value = gantt.taskRenderer.call(gantt.taskRendererThisObj || gantt, {
                    taskRecord,
                    renderData
                });

                // If the user's renderer coerced it into a string, recreate a DomClassList.
                if (typeof renderData.cls === 'string') {
                    renderData.cls = new DomClassList(renderData.cls);
                }

                // Same goes for iconCls
                if (typeof renderData.iconCls === 'string') {
                    renderData.iconCls = new DomClassList(renderData.iconCls);
                }

                if (typeof renderData.wrapperCls === 'string') {
                    renderData.wrapperCls = new DomClassList(renderData.wrapperCls);
                }

                let childContent = null;

                // Likely HTML content
                if (StringHelper.isHtml(value)) {
                    childContent = {
                        tag  : 'span',
                        html : value
                    };
                }
                // DOM config or plain string can be used as is
                else if (typeof value === 'string' || typeof value === 'object') {
                    childContent = value;
                }
                // Other, use string
                else if (value != null) {
                    childContent = String(value);
                }

                if (childContent) {
                    if (Array.isArray(childContent)) {
                        taskContent.children.push(...childContent);
                    }
                    else {
                        taskContent.children.push(childContent);
                    }
                    renderData.cls.add('b-has-content');
                }
            }

            // If there are any iconCls entries...
            renderData.cls['b-gantt-task-withicon'] = renderData.iconCls.length;

            // renderers have last say on style & color
            renderData.wrapperCls[`b-sch-style-${renderData.eventStyle}`] = renderData.eventStyle;

            if (DomHelper.isNamedColor(renderData.eventColor)) {
                renderData.wrapperCls[`b-sch-color-${renderData.eventColor}`] = renderData.eventColor;
            }
            else if (renderData.eventColor) {
                const style = `background-color:${renderData.eventColor};`;

                renderData.style = style + renderData.style;
                renderData.wrapperCls['b-sch-custom-color'] = 1;
                renderData._customColorStyle = style;
            }
            else {
                renderData.wrapperCls['b-sch-color-none'] = 1;
            }

            // Milestones has to apply styling to b-sch-task-content
            if (renderData.style && taskRecord.isMilestone && taskContent) {
                taskContent.style = renderData.style;
                delete renderData.style;
            }

            if (renderData.iconCls?.length) {
                taskContent.children.unshift({
                    tag       : 'i',
                    className : renderData.iconCls
                });
            }

            // if we have some children collected or it's a milestone (milestone styling needs content element presence)
            if (taskContent.children.length || taskRecord.milestone) {
                renderData.children.push(taskContent);
            }
        }

        renderData.taskContent = taskContent;

        renderData.wrapperChildren = [];
    }

    populateTaskRenderData(renderData, taskRecord) {
        this.internalPopulateTaskRenderData(...arguments);

        // Method which features may chain in to
        this.gantt.onTaskDataGenerated(renderData);
    }

    // This method is a single entry point to get complete render data for the task
    getTaskRenderData(row, taskRecord) {
        const
            me        = this,
            { gantt } = me,
            { start } = gantt.resourceMarginObject,
            box       = me.getTaskBox(taskRecord, false, false, row),
            data      = {
                taskRecord,

                task     : taskRecord,
                row,
                children : []
            };

        if (box) {
            Object.assign(data, {
                isTask : true,
                top    : box.top,
                left   : box.left,
                width  : box.width,
                height : box.height
            });
        }
        else {
            // Calculate top position, used by Baselines feature to position its elements
            data.top = row.top + start;
        }

        me.populateTaskRenderData(data, taskRecord);

        return data;
    }

    // This method generates DOM config from the render data
    getTaskDOMConfig(data) {
        return {
            className : data.wrapperCls,
            tabIndex  : '0',
            children  : [
                {
                    className : data.cls,
                    style     : (data.internalStyle || '') + (data.style || ''),
                    children  : data.children,
                    dataset   : {
                        // Each feature putting contents in the task wrap should have this to simplify syncing and
                        // element retrieval after sync
                        taskFeature : 'task'
                    },
                    syncOptions : {
                        syncIdField : 'taskBarFeature'
                    }
                },
                ...data.wrapperChildren
            ],
            style : {
                top    : data.top,
                left   : data.left - (this.gantt.rtl ? data.width : 0),
                // DomHelper appends px to dimensions when using numbers
                width  : data.width,
                zIndex : data.zIndex
            },
            dataset : {
                taskId : data.taskId
            },
            // Will not be part of DOM, but attached to the element
            elementData : data,
            // Options for this level of sync, lower levels can have their own
            syncOptions : {
                syncIdField      : 'taskFeature',
                // Remove instead of release when a feature is disabled
                releaseThreshold : 0
            }
        };
    }

    // Called per row in "view", collect configs
    renderer({ row, record : taskRecord }) {
        const
            me   = this,
            data = me.getTaskRenderData(row, taskRecord);

        let config;

        if (data.isTask) {
            config = me.getTaskDOMConfig(data);
            me.gantt.trigger('beforeRenderTask', { renderData : data, domConfig : config });
        }
        else if (data.extraConfigs.length === 0) {
            me.rowMap.delete(row);
            return;
        }

        // Store DOM configs
        me.rowMap.set(row, [config, ...data.extraConfigs]);
    }

    // Called when the current row rendering "pass" is complete, sync collected configs to DOM
    onRenderDone() {
        const
            { gantt } = this,
            configs   = Array.from(this.rowMap.values()).flat();

        // Give features a chance to inject or manipulate task configs
        gantt.onBeforeTaskSync(configs);

        DomSync.sync({
            domConfig : {
                onlyChildren : true,
                children     : configs
            },
            targetElement : gantt.foregroundCanvas,
            syncIdField   : 'taskId',

            // Called by DomHelper when it creates, releases or reuses elements
            callback({ action, domConfig, lastDomConfig, targetElement : element }) {
                // If element is a task wrap, trigger appropriate events
                if (action !== 'none' && domConfig && domConfig.className && domConfig.className[gantt.eventCls + '-wrap']) {
                    const
                        // Some actions are considered first a release and then a render (reusing another element).
                        // This gives clients code a chance to clean up before reusing an element
                        isRelease = releaseEventActions[action],
                        isRender  = renderEventActions[action];

                    // If we are reusing an element that was previously released we should not trigger again
                    if (isRelease && lastDomConfig?.elementData?.isTask) {
                        const
                            event = {
                                renderData : lastDomConfig.elementData,
                                taskRecord : lastDomConfig.elementData.taskRecord,
                                element
                            };

                        // This event is documented on Gantt
                        gantt.trigger('releaseTask', event);
                    }

                    // Trigger only for actual tasks, not indicators or baselines
                    if (isRender && domConfig?.elementData?.isTask) {
                        const
                            event = {
                                renderData     : domConfig.elementData,
                                taskRecord     : domConfig.elementData.taskRecord,
                                reusingElement : action === 'reuseElement',
                                element
                            };

                        // This event is documented on Gantt
                        gantt.trigger('renderTask', event);
                    }
                }
            }
        });
    }

    // Redraws a single task by rerendering its cell

    redraw(taskRecord) {
        // Refresh cell, will call `renderer` above and update its DOM config
        if (this.gantt.rowManager.refreshCell(taskRecord, this.gantt.timeAxisColumn.id)) {
            // Update DOM
            this.onRenderDone();
        }
    }

    clearAll() {
        // Empty method, which is called for clearing rendered data on RTL changes in TimelineBase.
        // Add required procedures here.
    }

    //endregion
}
