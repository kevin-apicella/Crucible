import Base from '../../../Core/Base.js';
import ProjectConsumer from '../../../Scheduler/data/mixin/ProjectConsumer.js';
import ProjectModel from '../../model/ProjectModel.js';

/**
 * @module Gantt/view/mixin/GanttStores
 */

/**
 * Functions for store assignment and store event listeners.
 * Properties are aliases to corresponding
 * ones of Gantt's {@link Gantt.model.ProjectModel project} instance.
 *
 * @mixin
 */
export default Target => class GanttStores extends ProjectConsumer(Target || Base) {
    static get $name() {
        return 'GanttStores';
    }

    // This is the static definition of the Stores we consume from the project, and
    // which we must provide *TO* the project if we or our CrudManager is configured
    // with them.
    // The property name is the store name, and within that there is the dataName which
    // is the property which provides static data definition. And there is a listeners
    // definition which specifies the listeners *on this object* for each store.
    //
    // To process incoming stores, implement an updateXxxxxStore method such
    // as `updateEventStore(eventStore)`.
    //
    // To process an incoming Project implement `updateProject`. __Note that
    // `super.updateProject(...arguments)` must be called first.__
    static get projectStores() {
        return {
            calendarManagerStore : {},

            resourceStore : {
                dataName : 'resources'
            },

            eventStore : {
                dataName : 'events'
            },

            assignmentStore : {
                dataName : 'assignments'
            },

            dependencyStore : {
                dataName : 'dependencies'
            },

            timeRangeStore : {}
        };
    }

    static get configurable() {
        return {
            // Overridden. ProjectConsumer defaults to Scheduler's ProjectModel
            projectModelClass : ProjectModel,

            /**
             * Inline tasks, will be loaded into an internally created TaskStore.
             * @config {Gantt.model.TaskModel[]|TaskModelConfig[]}
             * @category Data
             */
            tasks : null,

            /**
             * The {@link Gantt.data.TaskStore} holding the tasks to be rendered into the Gantt.
             * @config {Gantt.data.TaskStore}
             * @category Data
             */
            taskStore : null
        };
    }

    updateProject(project, oldProject) {
        super.updateProject(project, oldProject);

        this.detachListeners('ganttStores');

        this.bindCrudManager(project);

        project?.ion({
            name                : 'ganttStores',
            refresh             : 'internalOnProjectRefresh',
            startApplyChangeset : 'internalOnProjectStartApplyChangeset',
            endApplyChangeset   : 'internalOnProjectEndApplyChangeset',
            thisObj             : this
        });
    }

    get replica() {
        return this.project.replica;
    }

    internalOnProjectStartApplyChangeset() {
        this.captureScrollTargetRow();
    }

    internalOnProjectEndApplyChangeset() {
        this.restoreScrollTargetRow();
    }

    internalOnProjectRefresh({ isInitialCommit, isCalculated }) {
        const
            me = this,
            { project } = me;

        if (!me.isPainted) {
            return;
        }

        // Unless user configured startDate, after initial project is loaded - scroll project start into view
        if (!me.appliedViewStartDate && !('startDate' in me.initialConfig) && project.startDate && project.endDate) {
            me.appliedViewStartDate = me.applyViewStartEndDates(project.startDate, project.endDate);
        }

        // Transition all refreshes except the initial one or any used for early rendering
        if (!isInitialCommit && isCalculated) {
            me.refreshWithTransition();
        }
        // No transition on initial refresh, nothing to transition and don't want to delay dependency drawing more
        // than necessary
        else {
            me.refresh();
        }

        me.trigger('projectRefresh', { isInitialCommit, isCalculated });
    }

    //endregion

    //region Inline data

    //region Store & model docs

    // Configs

    /**
     * Inline resources, will be loaded into the backing project's ResourceStore.
     * @config {Gantt.model.ResourceModel[]|ResourceModelConfig[]} resources
     * @category Data
     */

    /**
     * Inline assignments, will be loaded into the backing project's AssignmentStore.
     * @config {Gantt.model.AssignmentModel[]|AssignmentModelConfig[]} assignments
     * @category Data
     */

    /**
     * Inline dependencies, will be loaded into the backing project's DependencyStore.
     * @config {Gantt.model.DependencyModel[]|DependencyModelConfig[]} dependencies
     * @category Data
     */

    /**
     * Inline time ranges, will be loaded into the backing project's time range store.
     * @config {Scheduler.model.TimeSpan[]|TimeSpanConfig[]} timeRanges
     * @category Data
     */

    /**
     * Inline calendars, will be loaded into the backing project's CalendarManagerStore.
     * @config {Gantt.model.CalendarModel[]|CalendarModelConfig[]} calendars
     * @category Data
     */

    // Properties

    /**
     * Get/set resources, applies to the backing project's ResourceStore.
     * @member {Gantt.model.ResourceModel[]} resources
     * @accepts {Gantt.model.ResourceModel[]|ResourceModelConfig[]}
     * @category Data
     */

    /**
     * Get/set assignments, applies to the backing project's AssignmentStore.
     * @member {Gantt.model.AssignmentModel[]} assignments
     * @accepts {Gantt.model.AssignmentModel[]|AssignmentModelConfig[]}
     * @category Data
     */

    /**
     * Get/set dependencies, applies to the backing projects DependencyStore.
     * @member {Gantt.model.DependencyModel[]} dependencies
     * @accepts {Gantt.model.DependencyModel[]|DependencyModelConfig[]}
     * @category Data
     */

    /**
     * Get/set time ranges, applies to the backing project's TimeRangeStore.
     * @member {Scheduler.model.TimeSpan[]} timeRanges
     * @accepts {Scheduler.model.TimeSpan[]|TimeSpanConfig[]}
     * @category Data
     */

    /**
     * Get/set calendars, applies to the backing projects CalendarManagerStore.
     * @member {Gantt.model.CalendarModel[]} calendars
     * @accepts {Gantt.model.CalendarModel[]|CalendarModelConfig[]}
     * @category Data
     */

    //endregion

    get timeRanges() {
        return this.project.timeRanges;
    }

    set timeRanges(timeRanges) {
        this.project.timeRanges = timeRanges;
    }

    get calendars() {
        return this.project.calendars;
    }

    set calendars(calendars) {
        this.project.calendars = calendars;
    }

    //endregion

    //region TaskStore

    get usesDisplayStore() {
        return this.store !== this.taskStore;
    }

    /**
     * Get/set tasks, applies to the backing project's EventStore.
     * Returns a flat array of all tasks in the task store.
     * @member {Gantt.model.TaskModel[]} tasks
     * @accepts {Gantt.model.TaskModel[]|TaskModelConfig[]}
     * @category Data
     */
    get tasks() {
        return this.project.eventStore.allRecords;
    }

    changeTasks(tasks) {
        const { project } = this;

        if (this.buildingProjectConfig) {
            // Set the property in the project config object.
            project.eventsData = tasks;
        }
        else {
            // Live update the project when in use.
            project.eventStore.data = tasks;
        }
    }

    /**
     * Get/set the task store instance of the backing project.
     * @member {Gantt.data.TaskStore} taskStore
     * @category Data
     */
    changeTaskStore(taskStore) {
        const { project } = this;

        if (this.buildingProjectConfig) {
            // Set the property in the project config object.
            // Must not go through the updater. It's too early to
            // inform host of store change.
            project.eventStore = taskStore;
            return;
        }

        // Live update the project when in use.
        if (!this.initializingProject) {
            if (project.eventStore !== taskStore) {
                project.setEventStore(taskStore);
                taskStore = project.eventStore;
            }
        }
        return taskStore;
    }

    updateEventStore(eventStore) {
        const me = this;

        eventStore.metaMapId = me.id;

        // taskStore is used for rows (store) and tasks
        me.taskStore = me.store = eventStore;
    }

    bindStore(store) {
        const me = this;

        super.bindStore(store);

        me.bindEventStoreForEarlyPositioning(store);

        me.timeAxisViewModel.store = store;

        // Occasionally we need to track batched changes.
        // TaskResize requires this as it changes the endDate with task batched.
        me.detachListeners('storeBatchedUpdateListener');

        store.ion({
            name          : 'storeBatchedUpdateListener',
            batchedUpdate : 'onEventStoreBatchedUpdate',
            thisObj       : me
        });
    }

    /**
     * Listener to the batchedUpdate event which fires when a field is changed on a record which
     * is batch updating. Occasionally UIs must keep in sync with batched changes.
     * For example, the TaskResize feature performs batched updating of the startDate/endDate
     * and it tells its client to listen to batchedUpdate.
     * @private
     */
    onEventStoreBatchedUpdate(event) {
        const me = this;

        if (me.listenToBatchedUpdates) {
            const wasEnabled = me.enableEventAnimations;

            // This pathway is used from TaskResize during dragging, so we do not
            // want the size animating. It should follow the pointer in real time.
            me.enableEventAnimations = false;
            me.onStoreUpdateRecord(event);
            me.enableEventAnimations = wasEnabled;
        }
    }

    //endregion

    //region Internal

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    //endregion
};
