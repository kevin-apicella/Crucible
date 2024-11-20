import AjaxStore from '../../Core/data/AjaxStore.js';
import TaskModel from '../model/TaskModel.js';
import { ChronoEventTreeStoreMixin } from '../../Engine/quark/store/ChronoEventStoreMixin.js';
import PartOfProject from './mixin/PartOfProject.js';
import GetEventsMixin from '../../Scheduler/data/mixin/GetEventsMixin.js'; // To allow using TaskStore in Pro & Calendar
import DayIndexMixin from '../../Scheduler/data/mixin/DayIndexMixin.js'; // To allow using TaskStore in Calendar
import DateHelper from '../../Core/helper/DateHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Wbs from '../../Core/data/Wbs.js';

/**
 * @module Gantt/data/TaskStore
 */

const
    refreshWbsForChildrenOptions = { deep : true },
    wbsAuto                      = Object.freeze({
        add    : true,
        remove : true,
        sort   : true
    }),
    wbsManual                    = Object.freeze({
        add    : false,
        remove : false,
        sort   : false
    }),
    sortByWbs = (lhs, rhs) => Wbs.compare(lhs?.wbsCode, rhs?.wbsCode);

/**
 * An object that describes the actions that should trigger a {@link Gantt.model.TaskModel#function-refreshWbs} to
 * update WBS values. Objects of this type are passed to {@link #config-wbsMode} when the simpler
 * values of `'auto'` or (the default) `'manual'` are not desired.
 *
 * The value `'auto'` is equivalent to all properties of this object being `true`.
 * The value `'manual'` is equivalent to all properties of this object being `false`.
 *
 * @typedef WbsMode
 * @property {Boolean} [add] Set this property to `true` to refresh WBS values when nodes are added.
 * @property {Boolean} [remove] Set this property to `true` to refresh WBS values when nodes are removed.
 * @property {Boolean} [sort] Set this property to `true` to refresh WBS values when nodes are sorted.
 */

/**
 * A class representing the tree of tasks in the Gantt project. An individual task is represented as an instance of the
 * {@link Gantt.model.TaskModel} class. The store expects the data loaded to be hierarchical. Each parent node should
 * contain its children in a property called 'children'.
 *
 * ```javascript
 * const taskStore = new TaskStore({
 *     data : [
 *         {
 *             "id"           : 1000,
 *             "name"         : "Cool project",
 *             "percentDone"  : 50,
 *             "startDate"    : "2019-01-02",
 *             "expanded"     : true,
 *             "children"     : [
 *                 {
 *                     "id"           : 1,
 *                     "name"         : "A leaf node",
 *                     "startDate"    : "2019-01-02",
 *                     "percentDone"  : 50,
 *                     "duration"     : 10,
 *                 }
 *             ]
 *         }
 *     ]
 * });
 * ```
 *
 * @mixes Scheduler/data/mixin/GetEventsMixin
 * @extends Core/data/AjaxStore
 */
export default class TaskStore extends ChronoEventTreeStoreMixin.derive(AjaxStore).mixin(
    PartOfProject,
    DayIndexMixin,
    GetEventsMixin
) {

    static $name = 'TaskStore';

    static get defaultConfig() {
        return {
            modelClass : TaskModel,

            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @config {Number}
             * @private
             */
            loadPriority : 200,

            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @config {Number}
             * @private
             */
            syncPriority : 300,

            storeId : 'tasks',

            tree : true
        };
    }

    static get configurable() {
        return {
            /**
             * Set to `'auto'` to automatically update {@link Gantt.model.TaskModel#field-wbsValue} as records in the
             * store are manipulated (e.g., when the user performs drag-and-drop reordering).
             *
             * In manual mode, the WBS value is initialized as the store loads and only altered implicitly by the
             * {@link #function-indent} and {@link #function-outdent} methods. The WBS values are otherwise updated only
             * by an explicit call to {@link Gantt.model.TaskModel#function-refreshWbs}.
             *
             * This can also be a {@link #typedef-WbsMode} object that indicates what operations
             * should automatically {@link Gantt.model.TaskModel#function-refreshWbs refresh} WBS values.
             *
             * The operations that trigger WBS refresh can be enabled explicitly in this object, for example:
             *
             * ```javascript
             *  wbsMode : {
             *      add : true,
             *      remove : true
             *  }
             * ```
             * The above is an opt-in list that enable auto WBS refresh for node add and remove operations (these two
             * operations are associated with dragging to reorder items). No other operation will trigger WBS refresh.
             * At present, this leaves out only the `sort` operation, but if new auto-refreshing operations were added
             * in future releases, those would also not be included.
             *
             * Alternatively, this object can be an opt-out specification if all values are falsy:
             *
             * ```javascript
             *  wbsMode : {
             *      sort : false
             *  }
             * ```
             * The above two examples are (currently) equivalent in outcome. The choice between opt-in or opt-out form
             * is a matter of convenience as well as future-proofing preference.
             *
             * The value `'auto'` is equivalent to all properties being `true`.
             * The value `'manual'` (the default) is equivalent to all properties being `false`.
             * @config {String|WbsMode}
             */
            wbsMode : 'manual',

            /**
             * Specifies which tree to use to calculate WBS. Ordered tree is unsortable and unfilterable, it
             * always holds complete tree hierarchy. By default, it uses sortable and filterable tree.
             * @config {Boolean}
             * @default
             */
            useOrderedTreeForWbs : false,

            /**
             * Controls behavior of the outdent logic regarding siblings. By default, outdent will move child to be
             * its parent's sibling and will move all previous siblings to the outdented node's children. Visually, node
             * will remain in place just changing the level. When set to `true` only node with its subtree will be
             * outdented, siblings will not change parent. Visually, node will be moved as last child of the new parent.
             * @config {Boolean}
             * @default
             */
            outdentIgnoringSiblings : false,

            /**
             * Always return changes in increasing WBS order.
             * @config {Boolean}
             * @default
             */
            forceWbsOrderForChanges : false,

            /**
             * Whether to validate the loaded tasks data by checking if it is suitable for pre-rendering.
             * Pre-rendering is activated with the {@link Gantt.model.ProjectModel#config-delayCalculation}
             * config option, and it allows to improve the perceived loading performance - the tasks are rendered
             * immediately on load, before the initial calculation completes.
             *
             * For that to be possible, tasks need to have both start date and end date defined in the incoming data package.
             * If task is not supposed to be rendered (so called "unscheduled" task), it should have the
             * {@link Gantt.model.TaskModel#field-unscheduled} field set to `true`.
             *
             * Validation process will only be activated for the first data load and only if more than 1k tasks are loaded.
             * Validation will check the initial 100 tasks in the dataset and if less than 10 of them don't have enough data
             * for pre-rendering, validation will pass. Otherwise, validation will issue a `console.warn()` call
             * with the text, suggesting to include pre-rendering data in the initial dataset.
             *
             * @prp {Boolean}
             * @default
             */
            validatePreRenderData : true
        };
    }

    changeWbsMode(value) {
        if (value === 'auto') {
            return wbsAuto;
        }

        if (value && typeof value === 'object') {
            if (ObjectHelper.values(value).every(v => !v)) {   // if (an opt-out list)
                value = ObjectHelper.assign({}, wbsAuto, value);
            }

            return value;
        }

        return wbsManual;
    }

    /**
     * For each task in this TaskStore, sets the data in the passed baseline index to the current state of the task.
     * @param {Number} index The index in the baselines list of the baseline to update.
     */
    setBaseline(index) {
        const data = this.storage.values;

        this.forEach(task => task.setBaseline(index));
        this.trigger('refresh', {
            action  : 'batch',
            records : data,
            data
        });
    }

    /**
     * Increase the indentation level of one or more tasks in the tree
     * @param {Gantt.model.TaskModel|Gantt.model.TaskModel[]} nodes The nodes to indent.
     * @returns {Promise} A promise which yields the result of the operation
     * @fires indent
     * @fires change
     */
    async indent(nodes) {
        const
            me                     = this,
            { taskStore, project } = me;

        let result = false;

        nodes = Array.isArray(nodes) ? nodes.slice() : [nodes];

        // 1. Filter out project nodes
        nodes = nodes.filter(node => !node.isProjectModel);

        // 2. Filtering out all nodes which parents are also to be indented as well as the ones having no previous
        //    sibling since such nodes can't be indented
        nodes = nodes.filter(node => {
            let result = Boolean(node.previousSibling);

            while (result && !node.isRoot) {
                result = !nodes.includes(node.parent);
                node   = node.parent;
            }

            return result;
        });

        /**
         * Fired before tasks in the tree are indented. Return `false` from a listener to prevent the indent.
         * @event beforeIndent
         * @preventable
         * @param {Gantt.data.TaskStore} source The task store
         * @param {Gantt.model.TaskModel[]} records Tasks to be indented
         */
        if (nodes.length && taskStore.trigger('beforeIndent', { records : nodes }) !== false) {
            // 3. Sorting nodes into tree walk order (visible order)
            nodes.sort((lhs, rhs) => Math.max(0, me.indexOf(lhs)) - Math.max(0, me.indexOf(rhs)));

            // No events should go to the UI until we have finished the operation successfully
            taskStore.beginBatch();

            // Ask the project to try the indent operation
            result = await project.tryPropagateWithChanges(() => {
                for (const node of nodes) {
                    const newParent = node.previousSibling;
                    newParent.appendChild(node);
                    me.toggleCollapse(newParent, false);
                }

                // https://github.com/bryntum/support/issues/6599
                // this is probably not enough - need to consider also transitive parent->child dependencies
                // but should do for now, since this deps removal is cosmetic anyway
                const
                    nodesIndexed = new Set(nodes),
                    depsToRemove = [];

                nodes.forEach(node => {
                    const parent = node.parent;

                    if (parent.manuallyScheduled) {
                        for (const dep of parent.outgoingDeps) {
                            if (nodesIndexed.has(dep.toEvent)) {
                                depsToRemove.push(dep);
                            }
                        }
                        for (const dep of parent.incomingDeps) {
                            if (nodesIndexed.has(dep.fromEvent)) {
                                depsToRemove.push(dep);
                            }
                        }
                    }
                });

                taskStore.project.dependencyStore.remove(depsToRemove);
            });

            if (me.isDestroyed) {
                return;
            }

            // Now show the successful result
            taskStore.endBatch();

            if (result) {
                me.refreshWbsForChildren({
                    up : 2,  // the nodes are now deeper but that move affects their grandparent node's WBS
                    nodes
                });

                /**
                 * Fired after tasks in the tree are indented
                 * @event indent
                 * @param {Gantt.data.TaskStore} source The task store
                 * @param {Gantt.model.TaskModel[]} records Tasks that were indented
                 */
                me.trigger('indent', { records : nodes });
                me.trigger('change', {
                    action  : 'indent',
                    records : nodes
                });
            }
        }

        return result;
    }

    /**
     * Decrease the indentation level of one or more tasks in the tree
     * @param {Gantt.model.TaskModel|Gantt.model.TaskModel[]} nodes The nodes to outdent.
     * @returns {Promise} A promise which yields the result of the operation
     * @fires outdent
     * @fires change
     */
    async outdent(nodes) {
        const
            me                     = this,
            { taskStore, project } = me;

        let result = false;

        nodes = Array.isArray(nodes) ? nodes.slice() : [nodes];

        // 1. Filter out project nodes
        nodes = nodes.filter(node => !node.isProjectModel);

        // 2. Filtering out all nodes which parents are also to be outdented as well as the ones having no previous sibling
        //    since such nodes can't be indented
        nodes = nodes.filter(node => {
            let result;

            result = node.parent && !node.parent.isRoot;

            while (result && !node.isRoot) {
                result = !nodes.includes(node.parent);
                node   = node.parent;
            }

            return result;
        });

        /**
         * Fired before tasks in the tree are outdented. Return `false` from a listener to prevent the outdent.
         * @event beforeOutdent
         * @preventable
         * @param {Gantt.data.TaskStore} source The task store
         * @param {Gantt.model.TaskModel[]} records Tasks to be outdented
         */
        if (nodes.length && taskStore.trigger('beforeOutdent', { records : nodes }) !== false) {
            // 3. Process nodes in reverse tree walk (WBS) order
            nodes.sort((lhs, rhs) => Wbs.compare(rhs.wbsCode, lhs.wbsCode));

            // No events should go to the UI until we have finished the operation successfully
            taskStore.beginBatch();

            result = await project.tryPropagateWithChanges(() => {
                for (const node of nodes) {
                    const newChildren = !this.outdentIgnoringSiblings && node.parent.children.slice(node.parent.children.indexOf(node) + 1);

                    node.parent.parent.insertChild(node, node.parent.nextSibling, false, {
                        orderedBeforeNode : node.parent.nextOrderedSibling
                    });

                    // https://github.com/bryntum/support/issues/5721
                    // it seems appending empty array is recorded by stm but can not be correctly restored
                    // should be fixed in stm of course, but just avoiding this call (as its a no-op anyway)
                    // is much simpler fix
                    newChildren.length && node.appendChild(newChildren);
                    me.toggleCollapse(node, false);
                }
            });

            if (me.isDestroyed) {
                return;
            }

            taskStore.endBatch();

            if (result) {
                me.refreshWbsForChildren({
                    up : 1,  // only need to update the (new) parent
                    nodes
                });

                /**
                 * Fired after tasks in the tree are outdented
                 * @event outdent
                 * @param {Gantt.data.TaskStore} source The task store
                 * @param {Gantt.model.TaskModel[]} records Tasks that were outdented
                 */
                me.trigger('outdent', { records : nodes });
                me.trigger('change', {
                    action  : 'outdent',
                    records : nodes
                });
            }
        }

        return result;
    }

    onNodeAddChild(parent, children, index, isMove, silent = false) {
        super.onNodeAddChild(parent, children, index, isMove, silent);

        if (!this.isLoadingData && this.wbsMode.add) {
            parent.refreshWbs(refreshWbsForChildrenOptions);

            // Trigger refresh of old & new parent children for moved nodes, if needed
            const wbsRefreshed = new Set();
            children.forEach(child => {
                const oldParent = this.getById(child.meta.oldParentId);
                if (oldParent && parent !== oldParent && !wbsRefreshed.has(oldParent)) {
                    wbsRefreshed.add(oldParent);
                    oldParent.refreshWbs(refreshWbsForChildrenOptions, -1);
                }
            });
        }
    }

    onNodeRemoveChild(parent, children, index, flags = { isMove : false, silent : false, unfiltered : false }) {
        const result = super.onNodeRemoveChild(parent, children, index, flags);

        if (this.wbsMode.remove && !flags.isMove) {
            parent.refreshWbs(refreshWbsForChildrenOptions);
        }

        return result;
    }

    // Preserve outdented nodes' position among new siblings when unsorted (#7135)
    // Requires forceWbsOrderInChanges=true
    // NOTE: This code is trying to solve a subset of the problem of keeping visual trees consistent among
    // different projects. However, since we do not have enough information to tell outdent and cut/paste/move apart,
    // we erroneously apply same solution to those problems too corrupting WBS (#7311).
    // When working on a general solution of that problem we need to make sure we keep the tests ensuring behavior and
    // remove this code which will likely interfere with any solution.
    applyChangeset(changes, transformFn = null, ...rest) {
        const
            me                    = this,
            { updated, modified } = transformFn?.(changes, me) ?? changes,
            altered               = updated ?? modified ?? [];

        // For nodes whose parent ID is changing to their grandparent, remember the original node above and
        // later, reorder to keep it that way (below)
        const outdented = (me.forceWbsOrderForChanges && me.tree && !me.isSorted && !me.isGrouped)
            ? altered.reduce((outdented, { id, parentId }) => {
                if (parentId !== undefined) {
                    const
                        node = me.getById(id),
                        currentGrandparentId = node?.parent?.parentId;
                    if (parentId === currentGrandparentId) {
                        outdented.push({
                            node,
                            originalNodeAbove : node.previousSibling ?? node.parent
                        });
                    }
                }
                return outdented;
            }, [])
            : [];

        const log = super.applyChangeset(changes, transformFn, ...rest);

        if (outdented.length > 0) {
            // Restore position of outdented nodes, requires forceWbsOrderInChanges=true (#7135)
            for (const { node, originalNodeAbove } of outdented) {
                const
                    { parent } = node,
                    nodeAboveIndex = originalNodeAbove.parent === parent ? originalNodeAbove.parentIndex
                        : (originalNodeAbove.parent?.parent === parent ? originalNodeAbove.parent.parentIndex : undefined);
                if (nodeAboveIndex !== undefined && parent.children.includes(node)) {
                    // When moving nodes to their final place ignore ordered tree - ordered tree is already correct
                    parent.insertChild(node, nodeAboveIndex + 1, false, { orderedParentIndex : { skip : true } });
                }
            }
        }

        return log;
    }

    afterChangesetApplied(modifiedParents) {
        super.afterChangesetApplied(modifiedParents);

        const
            modifiedParentsByDepth = modifiedParents.slice().sort((a, b) => a.childLevel - b.childLevel),
            refreshed = new Set();

        modifiedParentsByDepth.forEach(record => {
            if (!refreshed.has(record)) {
                // check if it works w/o `useOrderedTree : true`
                record.refreshWbs({ deep : true, /*useOrderedTree : true,*/ refreshed });
            }
        });
    }

    afterPerformSort(silent) {
        if (this.wbsMode.sort) {
            this.rootNode.refreshWbs(refreshWbsForChildrenOptions);
        }

        super.afterPerformSort(silent);
    }

    /**
     * This method updates the WBS values due to changes in the indentation of a given set of child nodes.
     * @param {Object} options An object containing options in addition to a `nodes` property with the children.
     * @param {Gantt.model.TaskModel[]} options.nodes The array of child record to refresh. This is required.
     * @param {Boolean} [options.silent=false] Pass `true` to update the `wbsValue` silently (no events).
     * @param {Number} [options.up=1] The number of ancestors to ascend when determining the parent(s) to refresh.
     * By default, this value is 1 which indicates the immediate parent of the supplied nodes. This is suitable for
     * outdenting. For indenting, this value should be 2. This is because the previous parent node (now grandparent
     * node) needs to be refreshed, not merely the new parent.
     * @private
     */
    refreshWbsForChildren(options) {
        const
            nodes   = options.nodes,
            opts    = { ...refreshWbsForChildrenOptions, ...options },
            parents = new Set(),
            up      = opts.up || 0;

        let n, parent;

        nodes.forEach(node => {
            for (parent = node, n = up; parent && n; --n) {
                parent = parent.parent;
            }

            parents.add(parent);
        });

        for (parent of parents) {
            parent.refreshWbs(opts);
        }
    }

    getTotalTimeSpan() {
        return {
            startDate : this.getProject().startDate,
            endDate   : this.getProject().endDate
        };
    }

    getEventsForResource(resourceId) {
        const
            resource    = this.resourceStore.getById(resourceId),
            assignments = resource?.assignments.filter(assignment => assignment.isPartOfStore(this.assignmentStore)) || [],
            events      = [];

        assignments.forEach(({ event }) => event && events.push(event));

        return events;
    }

    /**
     * Checks if a date range is allocated or not for a given resource.
     * @param {Date} start The start date
     * @param {Date} end The end date
     * @param {Scheduler.model.EventModel|null} excludeEvent An event to exclude from the check (or null)
     * @param {Scheduler.model.ResourceModel} resource The resource
     * @returns {Boolean} True if the timespan is available for the resource
     * @category Resource
     */
    isDateRangeAvailable(start, end, excludeEvent, resource) {
        // NOTE: Also exists in EventStoreMixin.js

        // This should be a collection of unique event records
        const allEvents = new Set(this.getEventsForResource(resource));

        // In private mode we can pass an AssignmentModel. In this case, we assume that multi-assignment is used.
        // So we need to make sure that other resources are available for this time too.
        // No matter if the event retrieved from the assignment belongs to the target resource or not.
        // We gather all events from the resources the event is assigned to except of the one from the assignment record.
        // Note, events from the target resource are added above.
        if (excludeEvent?.isAssignment) {
            const
                currentEvent = excludeEvent.event,
                resources    = currentEvent.resources;

            resources.forEach(resource => {
                // Ignore events for the resource which is passed as an AssignmentModel to excludeEvent
                if (resource.id !== excludeEvent.resourceId) {
                    this.getEventsForResource(resource).forEach(event => allEvents.add(event));
                }
            });
        }

        if (excludeEvent) {
            const eventToRemove = excludeEvent.isAssignment ? excludeEvent.event : excludeEvent;
            allEvents.delete(eventToRemove);
        }

        return !Array.from(allEvents).some(event => event.isScheduled && DateHelper.intersectSpans(start, end, event.startDate, event.endDate));
    }

    linkTasks(tasks) {
        for (let i = 1; i < tasks.length; i++) {
            const
                from = tasks[i - 1],
                to   = tasks[i];

            if (!this.dependencyStore.getEventsLinkingDependency(from, to)) {
                this.dependencyStore.add({ from, to });
            }
        }
    }

    unlinkTasks(tasks) {
        this.dependencyStore.remove(this.dependencyStore.query(({ fromTask, toTask }) => tasks.includes(fromTask) || tasks.includes(toTask)));
    }

    /**
     * Enforce `forceWbsOrderForChanges` if set.
     * @private
     */
    get changes() {
        const changes = super.changes;

        if (changes && this.forceWbsOrderForChanges) {
            changes.added.sort(sortByWbs);
            changes.modified.sort(sortByWbs);
            changes.removed.sort(sortByWbs);
        }

        return changes;
    }

    afterLoadData() {
        super.afterLoadData?.();

        if (this.validatePreRenderData && !this._preRenderDataValidated) {
            this._preRenderDataValidated = true;

            if (this.count > 1000) {
                let
                    count = 0,
                    missingRequiredPreRenderData = 0;

                this.forEach(task => {
                    count++;

                    if ((!task.startDate || !task.endDate) && !task.unscheduled) {
                        missingRequiredPreRenderData++;
                    }

                    if (count > 100) {
                        if (missingRequiredPreRenderData > 10) {
                            console.warn(
                                'It seems you are loading a lot of tasks (> 1k) and many of the initial 100 tasks miss both the `startDate` and the `endDate`\n' +
                                "It won't be possible to pre-render such tasks, and perceived performance will be impacted.\n" +
                                'Consider providing both `startDate` and `endDate` for all tasks and setting `unscheduled` flag for tasks that should not be rendered.\n' +
                                'You can disable the validation and this warning with the `validatePreRenderData` flag.'
                            );
                        }
                        return false;
                    }
                });
            }
        }
    }
}
