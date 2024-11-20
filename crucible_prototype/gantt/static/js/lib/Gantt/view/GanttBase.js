import TimelineBase from '../../Scheduler/view/TimelineBase.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

import NewTaskRendering from './orientation/NewTaskRendering.js';

import CrudManagerView from '../../Scheduler/crud/mixin/CrudManagerView.js';
import CurrentConfig from '../../Scheduler/view/mixin/CurrentConfig.js';
import TransactionalFeatureMixin from '../../Scheduler/view/mixin/TransactionalFeatureMixin.js';
import ProjectProgressMixin from '../../SchedulerPro/view/mixin/ProjectProgressMixin.js';
import GanttDom from './mixin/GanttDom.js';
import GanttRegions from './mixin/GanttRegions.js';
import GanttScroll from './mixin/GanttScroll.js';
import GanttState from './mixin/GanttState.js';
import GanttStores from './mixin/GanttStores.js';
import GanttTimelineDateMapper from './mixin/GanttTimelineDateMapper.js';
import TaskNavigation from './mixin/TaskNavigation.js';

import EventNavigation from '../../Scheduler/view/mixin/EventNavigation.js';

import '../localization/En.js';
import '../../Gantt/column/TimeAxisColumn.js';

// Always required features
import '../../Grid/feature/Tree.js';
import '../../Scheduler/feature/RowReorder.js';
import '../feature/Dependencies.js';

import NameColumn from '../column/NameColumn.js';

import { DependencyType } from '../../Engine/scheduling/Types.js';
import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

import Toast from '../../Core/widget/Toast.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import SchedulingIssueResolution from '../../SchedulerPro/view/mixin/SchedulingIssueResolution.js';

/**
 * @module Gantt/view/GanttBase
 */

const emptyObject = Object.freeze({});

let newTaskCount = 0;

/**
 * A thin base class for {@link Gantt/view/Gantt}. Does not include any features by default, allowing smaller
 * custom-built bundles if used in place of {@link Gantt/view/Gantt}.
 *
 * @mixes Gantt/view/mixin/GanttDom
 * @mixes Gantt/view/mixin/GanttRegions
 * @mixes Gantt/view/mixin/GanttScroll
 * @mixes Gantt/view/mixin/GanttState
 * @mixes Gantt/view/mixin/GanttStores
 * @mixes Scheduler/crud/mixin/CrudManagerView
 * @mixes Scheduler/view/mixin/EventNavigation
 * @mixes Scheduler/view/mixin/TransactionalFeatureMixin
 * @mixes Gantt/view/mixin/TaskNavigation
 * @mixes SchedulerPro/view/mixin/ProjectProgressMixin
 * @mixes SchedulerPro/view/mixin/SchedulingIssueResolution
 *
 * @features Scheduler/feature/ColumnLines
 * @features Scheduler/feature/EventFilter
 * @features Scheduler/feature/HeaderZoom
 * @features Scheduler/feature/Labels
 * @features Scheduler/feature/NonWorkingTime
 * @features Scheduler/feature/Pan
 * @features Scheduler/feature/RowReorder
 * @features Scheduler/feature/ScheduleMenu
 * @features Scheduler/feature/ScheduleTooltip
 * @features Scheduler/feature/Summary
 * @features Scheduler/feature/TimeAxisHeaderMenu
 * @features Scheduler/feature/TimeRanges
 *
 * @features SchedulerPro/feature/PercentBar
 * @features SchedulerPro/feature/DependencyEdit
 * @features SchedulerPro/feature/EventSegments
 * @features SchedulerPro/feature/TimeSpanHighlight
 *
 * @features Gantt/feature/Baselines
 * @features Gantt/feature/CellEdit
 * @features Gantt/feature/CriticalPaths
 * @features Gantt/feature/Dependencies
 * @features Gantt/feature/Indicators
 * @features Gantt/feature/Labels
 * @features Gantt/feature/ParentArea
 * @features Gantt/feature/ProgressLine
 * @features Gantt/feature/ProjectLines
 * @features Gantt/feature/Rollups
 * @features Gantt/feature/ScrollButtons
 * @features Gantt/feature/Summary
 * @features Gantt/feature/TaskCopyPaste
 * @features Gantt/feature/TaskDrag
 * @features Gantt/feature/TaskDragCreate
 * @features Gantt/feature/TaskEdit
 * @features Gantt/feature/TaskMenu
 * @features Gantt/feature/TaskNonWorkingTime
 * @features Gantt/feature/TaskResize
 * @features Gantt/feature/TaskSegmentDrag
 * @features Gantt/feature/TaskSegmentResize
 * @features Gantt/feature/TaskTooltip
 * @features Gantt/feature/TreeGroup
 * @features Gantt/feature/Versions
 *
 * @features Gantt/feature/export/MspExport
 * @features Gantt/feature/export/PdfExport
 * @features Gantt/feature/export/Print
 *
 * @extends Scheduler/view/TimelineBase
 * @widget
 */
export default class GanttBase extends TimelineBase.mixin(
    CrudManagerView,
    GanttDom,
    GanttRegions,
    GanttScroll,
    GanttStores,
    GanttState,
    GanttTimelineDateMapper,
    EventNavigation,
    TaskNavigation,
    ProjectProgressMixin,
    SchedulingIssueResolution,
    TransactionalFeatureMixin,
    CurrentConfig
) {

    //region Task interaction events

    /**
     * Triggered after a mousedown on a task bar.
     * @event taskMouseDown
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a mouseup on a task bar.
     * @event taskMouseUp
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a click on a task bar.
     * @event taskClick
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a doubleclick on a task.
     * @event taskDblClick
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a rightclick (or long press on a touch device) on a task.
     * @event taskContextMenu
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a mouseover on a task.
     * @event taskMouseOver
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered for mouseout from a task.
     * @event taskMouseOut
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered when a keydown event is observed if there are selected tasks.
     * @event taskKeyDown
     * @param {Gantt.view.Gantt} source This Gantt
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {KeyboardEvent} event Browser event
     */

    /**
     * Triggered when a keyup event is observed if there are selected tasks.
     * @event taskKeyUp
     * @param {Gantt.view.Gantt} source This Gantt
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {KeyboardEvent} event Browser event
     */

    //endregion

    //region Other events

    /**
     * Task is rendered, its element is available in DOM.
     * @event renderTask
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Object} renderData Task render data
     * @param {Gantt.model.TaskModel} taskRecord Rendered task
     * @param {HTMLElement} element Task element
     */

    /**
     * Task is released, no longer in view/removed. A good spot for cleaning custom things added in a `renderTask`
     * listener up, if needed.
     * @event releaseTask
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Object} renderData Task render data
     * @param {Gantt.model.TaskModel} taskRecord Rendered task
     * @param {HTMLElement} element Task element
     */

    /**
     * Triggered when clicking a resource avatar or chip in the cells of the {@link Gantt.column.ResourceAssignmentColumn}.
     * @event resourceAssignmentClick
     * @param {Gantt.view.Gantt} source This Gantt
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {Gantt.model.ResourceModel} resourceRecord Resource record
     * @param {Event} event Browser event
     */
    //endregion

    // For documentation & typings purposes

    /**
     * Returns the dependency record for a DOM element
     *
     * *NOTE: Only available when the {@link Gantt/feature/Dependencies Dependencies} feature is enabled.*
     *
     * @function resolveDependencyRecord
     * @param {HTMLElement} element The dependency line element
     * @returns {Gantt.model.DependencyModel} The dependency record
     * @category Feature shortcuts
     */

    //endregion

    //region Config

    static $name = 'GanttBase';

    // Factoryable type name
    static get type() {
        return 'ganttbase';
    }

    static get defaultConfig() {
        return {
            /**
             * Configure as `true` to make the Gantt read-only, by disabling any UIs for modifying data.
             *
             * __Note that checks MUST always also be applied at the server side.__
             * @prp {Boolean} readOnly
             * @default false
             * @category Common
             */

            /**
             * The {@link Gantt.model.ProjectModel} instance containing the data visualized by the Gantt chart.
             * @member {Gantt.model.ProjectModel} project
             * @category Data
             */

            /**
             * A {@link Gantt.model.ProjectModel} instance or a config object. The project holds all Gantt data.
             * @config {Gantt.model.ProjectModel|ProjectModelConfig}
             * @category Data
             */
            project : null,

            /**
             * The path for resource images, used by various widgets such as the resource assignment column.
             * @config {String}
             * @category Common
             */
            resourceImageFolderPath : null,

            /**
             * The file name of an image file to use when a resource has no image, or its image cannot be loaded.
             * @config {String}
             * @category Common
             */
            defaultResourceImageName : null,

            /**
             * True to toggle the collapsed/expanded state when clicking a parent task bar.
             * @prp {Boolean}
             * @category Common
             * @default
             */
            toggleParentTasksOnClick : true,

            /**
             * True to scroll the task bar into view when clicking a cell, you can also pass a
             * {@link #function-scrollTaskIntoView scroll config} object.
             * @prp {Boolean|BryntumScrollOptions}
             * @category Common
             * @default false
             */
            scrollTaskIntoViewOnCellClick : null,

            // data for the stores, in the topological order
            calendars    : null,
            resources    : null,
            tasks        : null,
            dependencies : null,
            assignments  : null,

            eventCls                : 'b-gantt-task',
            eventBarTextField       : null,
            eventLayout             : 'none',
            eventSelectionDisable   : true,
            /**
             * Task color used by default. Tasks can specify their own {@link Gantt.model.TaskModel#field-eventColor},
             * which will override this config.
             *
             * For available standard colors, see
             * {@link Scheduler/model/mixin/EventModelMixin#typedef-EventColor}.
             *
             * @prp {EventColor} eventColor
             * @category Scheduled events
             */
            eventColor              : null,
            eventStyle              : null,
            rowHeight               : 45,
            scheduledEventName      : 'task',
            eventScrollMode         : 'move',
            overScheduledEventClass : 'b-gantt-task-hover',
            mode                    : 'horizontal',
            fixedRowHeight          : true,

            timeCellCls : 'b-sch-timeaxis-cell',


            focusCls : 'b-active',

            /**
             * An empty function by default, but provided so that you can override it. This function is called each time
             * a task is rendered into the gantt to render the contents of the task.
             *
             * Returning a string will display it in the task bar, it accepts both plain text or HTML. It is also
             * possible to return a DOM config object which will be synced to the task bars content.
             *
             * ```javascript
             * // using plain string
             * new Gantt({
             *    taskRenderer : ({ taskRecord }) => StringHelper.encodeHtml(taskRecord.name)
             * });
             *
             * // using html string
             * new Gantt({
             *    taskRenderer : ({ taskRecord }) => StringHelper.xss`${taskRecord.id} <b>${taskRecord.name}</b>`
             * });
             *
             * // using DOM config
             * new Gantt({
             *    taskRenderer({ taskRecord }) {
             *       return {
             *           tag  : 'b',
             *           html : StringHelper.encodeHtml(taskRecord.name)
             *       }
             *    }
             * });
             * ```
             *
             * @param {Object} detail An object containing the information needed to render a Task.
             * @param {Gantt.model.TaskModel} detail.taskRecord The task record.
             * @param {Object} detail.renderData An object containing details about the task rendering.
             * @param {Core.helper.util.DomClassList|String} detail.renderData.cls An object whose property names represent the CSS class names
             * to be added to the tasks's element. Set a property's value to truthy or falsy to add or remove the class
             * name based on the property name. Using this technique, you do not have to know whether the class is already
             * there, or deal with concatenation.
             * @param {String|Object<String,String>} detail.renderData.style Inline styles for the task bar DOM element. Use either
             * 'border: 1px solid black' or { border: '1px solid black' }
             * @param {Core.helper.util.DomClassList|String} detail.renderData.wrapperCls An object whose property names represent the CSS class names
             * to be added to the event wrapper element. Set a property's value to truthy or falsy to add or remove the class
             * name based on the property name. Using this technique, you do not have to know whether the class is already
             * there, or deal with concatenation.
             * @param {Core.helper.util.DomClassList|String} detail.renderData.iconCls An object whose property names represent the CSS class
             * names to be added to a task icon element.
             * @param {Scheduler.model.TimeSpan[]|TimeSpanConfig[]} indicators An array that can be populated with
             * TimeSpan records or their config objects to have them rendered in the task row
             * @returns {String|DomConfig|DomConfig[]} A simple string, or a DomConfig object defining the actual HTML
             * @config {Function}
             * @category Scheduled events
             */
            taskRenderer : null,

            /**
             * A callback function or a set of `name: value` properties to apply on tasks created using the task context menu.
             * Be aware that `name` value will be ignored since it's auto generated and may be configured with localization.
             *
             * Example:
             * ```javascript
             * // Object form:
             * newTaskDefaults : {
             *    duration          : 3,
             *    manuallyScheduled : true,
             *    percentDone       : 15
             * }
             * ```
             *
             * ```javascript
             * // Function form:
             * newTaskDefaults : (targetRecord) => {
             *    return {
             *        duration          : targetRecord.duration,
             *        manuallyScheduled : targetRecord.manuallyScheduled
             *    }
             * }
             * ```
             * @config {Gantt.model.TaskModelConfig|Object|Function}
             * @parameter {Gantt.model.TaskModel} task Reference task
             * @returns {Gantt.model.TaskModelConfig|Object} Set of properties to apply on tasks created using the task context menu
             */
            newTaskDefaults : {},

            /**
             * A task field (id, wbsCode, sequenceNumber etc) that will be used when displaying and editing linked tasks.
             * @config {String} dependencyIdField
             * @default 'id'
             * @category Common
             */
            dependencyIdField : 'id',

            /**
             * Returns dates that will constrain resize and drag operations. The method will be called with the
             * task being dragged.
             * @config {Function}
             * @param {Gantt.model.TaskModel} taskRecord The task record being moved or resized.
             * @returns {DateConstraint} Constraining object containing `start` and `end` constraints. Omitting either
             *   will mean that end is not constrained. So you can prevent a resize or move from moving *before*
             *   a certain time while not constraining the end date.
             * @category Scheduled events
             */
            getDateConstraints : null,

            /**
             * If set to `true` this will show a color field in the {@link Gantt.feature.TaskEdit} editor and also a
             * picker in the {@link Gantt.feature.TaskMenu}. Both enables the user to choose a color which will be
             * applied to the task bar's background. See TaskModel's {@link Gantt.model.TaskModel#field-eventColor}
             * config.
             * @config {Boolean}
             * @default false
             * @category Misc
             */
            showTaskColorPickers : null
        };
    }

    static configurable = {
        /**
         * See {@link Gantt.view.Gantt#keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,String>} keyMap
         * @category Common
         */
        keyMap : {
            'Alt+Shift+ArrowLeft'  : 'outdent',
            'Alt+Shift+ArrowRight' : 'indent'
        }
    };

    static bindStoreChangeset = false;

    timeCellSelector = '.b-sch-timeaxis-cell';

    get isGantt() {
        return true;
    }

    //endregion

    //region Init

    construct(config = {}) {
        const
            me              = this,
            hasInlineStores = Boolean(config.calendars || config.taskStore || config.dependencyStore || config.resourceStore || config.assignmentStore),
            hasInlineData   = Boolean(config.calendars || config.tasks || config.dependencies || config.resources || config.assignments);


        if (!config.features) {
            const defaults = me.getDefaultConfiguration().features;
            config.features = defaults && typeof defaults === 'object' ? defaults : {};
        }

        // gantt is always a tree
        if (!('tree' in config.features)) {
            config.features.tree = true;
        }

        // disable group feature by default
        if (!('group' in config.features)) {
            config.features.group = false;
        }

        const { project } = config;

        if (project && (hasInlineStores || hasInlineData)) {
            throw new Error('Providing both project and inline data is not supported');
        }

        // gather all data in the ProjectModel instance
        if (!project?.isModel) {
            config.project = ObjectHelper.assign({
                calendarsData    : config.calendars,
                eventsData       : config.tasks,
                dependenciesData : config.dependencies,
                resourcesData    : config.resources,
                assignmentsData  : config.assignments,

                resourceStore   : config.resourceStore,
                eventStore      : config.taskStore,
                assignmentStore : config.assignmentStore,
                dependencyStore : config.dependencyStore,
                timeRangeStore  : config.timeRangeStore
            }, project);

            delete config.resourceStore;
            delete config.taskStore;
            delete config.assignmentStore;
            delete config.dependencyStore;
            delete config.timeRangeStore;

            delete config.calendars;
            delete config.resources;
            delete config.tasks;
            delete config.assignments;
            delete config.dependencies;
        }
        // EOF data gathering

        super.construct(config);

        me.ion({
            taskclick  : 'onTaskBarClick',
            cellClick  : 'onNonTimeAxisCellClick',
            toggleNode : 'onToggleParentNode'
        });
    }

    changeColumns(columns, currentStore) {
        if (!this.isDestroying) {
            columns = columns || [];
        }

        if (columns?.length > 0 || (this.isConstructing && !this.initialConfig.columns)) {
            let cols = columns;

            if (!Array.isArray(columns)) {
                cols = columns.data;

                // Need to pull the taskstore in, to make sure any fields added by columns are added to it
                this._thisIsAUsedExpression(this.taskStore);
            }

            // Always include the name column
            if (!cols.some(column => {
                const constructor = column instanceof Column ? column.constructor : ColumnStore.getColumnClass(column.type) || Column;

                return constructor === NameColumn || constructor.prototype instanceof NameColumn;
            })) {
                cols.unshift({
                    type : 'name'
                });
            }
        }

        return super.changeColumns(columns, currentStore);
    }

    // Overrides TimelineBase to supply taskStore as its store (which is only used in passed events)
    set timeAxisViewModel(timeAxisViewModel) {
        super.timeAxisViewModel = timeAxisViewModel;

        if (this.store && timeAxisViewModel) {
            timeAxisViewModel.store = this.store;
        }
    }

    get timeAxisViewModel() {
        return super.timeAxisViewModel;
    }

    //endregion

    //region Overrides

    onPaintOverride() {
        // Internal procedure used for paint method overrides
        // Not used in onInternalPaint() because it may be chained on instance and Override won't be applied
    }

    //endregion

    //region Events

    resumeRefresh(trigger, useTransitions = true) {

        super.resumeRefresh(false);

        if (!this.refreshSuspended && trigger && this.isPainted) {
            if (!this.rowManager.topRow) {

                this.rowManager.reinitialize();
            }
            else {
                this.refreshWithTransition(undefined, false);
            }
        }
    }


    // Overriding grids behaviour to ignore individual updates caused by propagation
    onStoreUpdateRecord(params) {
        if (!this.project.isChangeTrackingSuspended) {
            let result;

            this.runWithTransition(() => {
                result = super.onStoreUpdateRecord(params);
            }, !this.refreshSuspended);

            return result;
        }
    }

    // Transition batch changes
    onStoreDataChange(params) {
        this.runWithTransition(() => {
            super.onStoreDataChange(params);
        }, params.action === 'batch');
    }

    // Features can hook into this to add to generated task data
    onTaskDataGenerated() {}

    // Features can hook into this to manipulate visible task configs before they are DomSynced
    onBeforeTaskSync() {}

    onTaskBarClick({ taskRecord }) {
        if (this.toggleParentTasksOnClick && !taskRecord.isLeaf) {
            this.toggleCollapse(taskRecord);
        }
    }

    onNonTimeAxisCellClick({ record, column }) {
        const { scrollTaskIntoViewOnCellClick } = this;
        if (column.type !== 'timeAxis' && scrollTaskIntoViewOnCellClick && record.isScheduled) {
            this.scrollTaskIntoView(record, scrollTaskIntoViewOnCellClick === true
                ? { animate : true, block : 'center', y : false }
                : scrollTaskIntoViewOnCellClick
            );
        }
    }

    onToggleParentNode({ record }) {
        // Repaint parent node on collapse / expand (unless in a collapsed parent, happens on collapse all)
        record.parent.isExpanded(this.taskStore) && this.taskRendering.redraw(record);
    }

    // Grid row selection change
    afterSelectionChange({ selectedRecords, deselectedRecords }) {
        const me = this;

        function setTaskSelection(record, selected) {
            const taskElement = me.getElementFromTaskRecord(record);
            if (taskElement) {
                DomSync[selected ? 'addCls' : 'removeCls']('b-task-selected', taskElement);
            }
        }

        selectedRecords?.map(record => setTaskSelection(record, true));
        deselectedRecords?.map(record => setTaskSelection(record, false));
    }

    //endregion

    //region TimelineBase implementations

    // Overrides grid to take project loading into account
    toggleEmptyText() {
        const
            me = this;
        if (me.bodyContainer && me.rowManager) {
            DomHelper.toggleClasses(me.bodyContainer, 'b-grid-empty', !(me.rowManager.rowCount || me.project.isLoadingOrSyncing));
        }
    }

    // Gantt only has one orientation, but TimelineBase expects this to work to call correct rendering code
    get currentOrientation() {
        const me = this;

        if (!me._currentOrientation) {
            //me.taskRendering = me._currentOrientation = new TaskRendering(me);
            me.taskRendering = me._currentOrientation = new NewTaskRendering(me);
        }

        return me._currentOrientation;
    }

    getTimeSpanMouseEventParams(taskElement, event) {
        const taskRecord = this.resolveTaskRecord(taskElement);

        return !taskRecord ? null : {
            taskRecord,
            taskElement,
            event
        };
    }

    getScheduleMouseEventParams(cellData) {
        return {
            taskRecord : this.store.getById(cellData.id)
        };
    }

    // Used by shared features to resolve an event or task
    resolveTimeSpanRecord(element) {
        return this.resolveTaskRecord(element);
    }

    repaintEventsForResource(taskRecord) {
        this.taskRendering.redraw(taskRecord);
    }

    // Used by the dependencies feature to keep it orientation (vertical, horizontal) independent
    get visibleResources() {
        return {
            first : this.store.getById(this.firstVisibleRow?.id),
            last  : this.store.getById(this.lastVisibleRow?.id)
        };
    }

    //endregion

    //region Feature hooks

    /**
     * Populates the task context menu. Chained in features to add menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown.
     * @param {Gantt.model.TaskModel} options.taskRecord The reference task record
     * @param {Scheduler.model.ResourceModel} options.resourceRecord The context resource.
     * @param {Scheduler.model.AssignmentModel} options.assignmentRecord The context assignment if any.
     * @param {Object<String,MenuItemConfig>} options.items A named object to describe menu items.
     * @internal
     */
    populateTaskMenu() {}

    //endregion

    // region ContextMenu API

    async addTask(referenceTask, options = emptyObject) {
        const
            me = this,
            {
                milestone,
                asPredecessor,
                asSuccessor
            } = options,
            project   = me.project,
            parent    = referenceTask.parent,
            defaults  = typeof me.newTaskDefaults == 'function' ? me.newTaskDefaults(referenceTask) : me.newTaskDefaults,
            newRecord = me.taskStore.modelClass.new({
                // use reference task values only if not provided in newTaskDefaults
                startDate    : referenceTask.startDate,
                duration     : referenceTask.duration,
                durationUnit : referenceTask.durationUnit,
                name         : null
            }, defaults, options.data);

        /**
         * Fires when adding a task from the UI to allow data mutation.
         * @event beforeTaskAdd
         * @param {Gantt.view.Gantt} source The Gantt instance
         * @param {Gantt.model.TaskModel} taskRecord The task
         */
        me.trigger('beforeTaskAdd', { taskRecord : newRecord });

        if (newRecord.name == null) {
            newRecord.name = `${me.L(milestone ? 'L{Gantt.New milestone}' : 'L{Gantt.New task}')} ${++newTaskCount}`;
        }

        project.suspendChangeTracking();

        if (options.asChild) {
            referenceTask.insertChild(newRecord, options.at === 'end' ? null : referenceTask.firstChild);
        }
        else if (options.above) {
            parent.insertChild(newRecord, referenceTask);
        }
        else {
            parent.insertChild(
                newRecord,
                referenceTask.nextSibling,
                false,
                // https://github.com/bryntum/support/issues/7220
                me.taskStore.useOrderedTreeForWbs ? { orderedBeforeNode : referenceTask.nextOrderedSibling } : {});
        }

        // Do not trigger change check, we've added a new record so project will trigger event anyway
        project.resumeChangeTracking(true);

        if (milestone) {
            await project.commitAsync();
            await newRecord.convertToMilestone();
        }
        else {
            await project.commitAsync();
        }

        // run propagation to handle the new task record
        // and then add a dependency if needed
        if (asSuccessor) {
            me.dependencyStore.add({
                fromEvent : referenceTask,
                toEvent   : newRecord,
                type      : DependencyType.EndToStart,
                fromSide  : 'right',
                toSide    : 'left'
            });
        }
        else if (asPredecessor) {
            me.dependencyStore.add({
                fromEvent : newRecord,
                toEvent   : referenceTask,
                type      : DependencyType.EndToStart,
                fromSide  : 'right',
                toSide    : 'left'
            });
        }

        if (asSuccessor || asPredecessor) {
            // wait for immediate commit to handle the new dependency
            await project.commitAsync();
        }

        return newRecord;
    }

    /**
     * Adds a new task above the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new task
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @async
     */
    addTaskAbove(taskRecord, options) {
        return this.addTask(taskRecord, { ...options, above : true });
    }

    /**
     * Adds a new task below the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new task
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @async
     */
    addTaskBelow(taskRecord, options) {
        return this.addTask(taskRecord, options);
    }

    /**
     * Adds a new milestone task below the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new milestone
     * @param {TaskModelConfig} [options.data] Data for the new milestone
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @async
     */
    addMilestoneBelow(taskRecord, options) {
        return this.addTask(taskRecord, { ...options, milestone : true });
    }

    /**
     * Adds a new subtask to the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new subtask
     * @param {'start'|'end'} [options.at='start'] Where to insert the new subtask in the parent's children.
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @async
     */
    addSubtask(taskRecord, options) {
        const promise = this.addTask(taskRecord, { ...options, asChild : true });

        this.toggleCollapse(taskRecord, false);

        return promise;
    }

    /**
     * Adds a successor task to the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new task
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @async
     */
    addSuccessor(taskRecord, options) {
        return this.addTask(taskRecord, { ...options, asSuccessor : true });
    }

    /**
     * Adds a predecessor task to the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new task
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @async
     */
    addPredecessor(taskRecord, options) {
        return this.addTask(taskRecord, { ...options, above : true, asPredecessor : true });
    }

    /**
     * Increase the indentation level of one or more tasks in the tree. Has no effect if {@link Gantt.feature.TreeGroup}
     * has regrouped the tree.
     * @param {Gantt.model.TaskModel[]|Gantt.model.TaskModel} tasks The task(s) to indent.
     * @returns {Promise} A promise which resolves if operation is successful
     */
    async indent(tasks) {
        const me = this;

        if (me.isTreeGrouped) {
            return;
        }

        // If called by keyboard shortcut
        if (!tasks || tasks instanceof Event) {
            tasks = me.selectedRecords;
        }

        // Might be indenting or outdenting already
        await this.project.commitAsync();

        const result = await me.taskStore.indent(tasks);

        // If `false`, the scheduling engine has found a reason that the operation could not happen.
        if (!result) {
            Toast.show({
                rootElement : me.rootElement,
                html        : me.L('L{Gantt.changeRejected}')
            });
        }

        return result;
    }

    /**
     * Decrease the indentation level of one or more tasks in the tree. Has no effect if {@link Gantt.feature.TreeGroup}
     * has regrouped the tree.
     *
     * @param {Gantt.model.TaskModel[]|Gantt.model.TaskModel} tasks The task(s) to outdent.
     * @returns {Promise} A promise which resolves if operation is successful
     */
    async outdent(tasks) {
        const me = this;

        if (me.isTreeGrouped) {
            return;
        }

        // If called by keyboard shortcut
        if (!tasks || tasks instanceof Event) {
            tasks = me.selectedRecords;
        }

        // Might be indenting or outdenting already
        await this.project.commitAsync();

        const result = await me.taskStore.outdent(tasks);

        // If `false`, the scheduling engine has found a reason that the operation could not happen.
        if (!result) {
            Toast.show({
                rootElement : me.rootElement,
                html        : me.L('L{Gantt.changeRejected}')
            });
        }

        return result;
    }

    // endregion

    // the 4 methods below are required since super cannot be called from GanttDom mixin

    onElementKeyDown(event) {
        super.onElementKeyDown(event);
    }

    onElementKeyUp(event) {
        super.onElementKeyUp(event);
    }

    onElementMouseOver(event) {
        super.onElementMouseOver(event);
    }

    onElementMouseOut(event) {
        super.onElementMouseOut(event);
    }

    onStoreAdd() {
        DomHelper.addTemporaryClass(this.element, 'b-no-transitions', 200, this);

        super.onStoreAdd(...arguments);
    }

    beforeRenderRow(data) {
        super.beforeRenderRow(data);

        data.cls['b-inactive'] = data.record.inactive;
    }
}

// Register this widget type with its Factory
GanttBase.initClass();

VersionHelper.setVersion('gantt', '5.6.11');
