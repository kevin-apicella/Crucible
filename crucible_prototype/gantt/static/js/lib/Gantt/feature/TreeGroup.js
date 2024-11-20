import GridTreeGroup from '../../Grid/feature/TreeGroup.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import WalkHelper from '../../Core/helper/WalkHelper.js';
import Delayable from '../../Core/mixin/Delayable.js';
import AttachToProjectMixin from '../../Scheduler/data/mixin/AttachToProjectMixin.js';

/**
 * @module Gantt/feature/TreeGroup
 */

/**
 * Extends Grid's {@link Grid.feature.TreeGroup} (follow the link for more info) feature to enable using it with Gantt.
 * Allows generating a new task tree where parents are determined by the values of specified task fields/functions:
 *
 * {@inlineexample Gantt/feature/TreeGroup.js}
 *
 * ## Important information
 *
 * Using the TreeGroup feature comes with some caveats:
 *
 * * Grouping replaces the store Gantt uses to display tasks with a temporary "display store". The original task store
 *   is left intact, when grouping stops Gantt will revert to using it to display tasks.
 * * `gantt.taskStore` points to the original store when this feature is enabled. To apply sorting or filtering programmatically, you should instead interact with the "display store" directly, using `gantt.store`.
 * * Generated parents are read-only, they cannot be edited using the default UI.
 * * Leaves in the new tree are still editable as usual, and any changes to them survives the grouping operation.
 * * Moving tasks in the tree (rearranging rows) is not supported while it is grouped.
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * @extends Grid/feature/TreeGroup
 *
 * @classtype treeGroup
 * @feature
 *
 * @typings Grid.feature.TreeGroup -> Grid.feature.GridTreeGroup
 */
export default class TreeGroup extends GridTreeGroup.mixin(AttachToProjectMixin, Delayable) {

    static $name = 'TreeGroup';

    static delayable = {
        refresh : 'raf'
    };

    updateParents(root) {
        // Since generated parents are not part of the project we have to manually set their dates etc. Walk them all
        // (since they are generated we are guaranteed there is no mix of parents and leaves at any give level), and
        // determine those
        root.children?.length && WalkHelper.postWalk(root, task => !task.children?.[0].isLeaf && task.children, task => {

            const { children } = task;

            let minStartDate = children[0].startDate,
                maxEndDate   = children[0].endDate,
                percentDone  = 0;

            for (const child of children) {
                if (child.startDate) {
                    minStartDate = Math.min(child.startDate, minStartDate || Number.MAX_SAFE_INTEGER);
                }
                if (child.endDate) {
                    maxEndDate   = Math.max(child.endDate, maxEndDate);
                }
                percentDone += child.percentDone;
            }

            task.startDate = minStartDate ? new Date(minStartDate) : null;
            task.endDate = maxEndDate ? new Date(maxEndDate) : null;
            task.duration = task.endDate && task.startDate ? this.client.project.taskStore.rootNode.run('calculateProjectedDuration', task.startDate, task.endDate) : 0;
            task.percentDone = percentDone / children.length;
        });
    }

    // Generate dates etc. for parents during grouping
    processTransformedData(transformedData) {
        this.updateParents(transformedData);
    }

    // Update dates etc. for parents when a task is changed
    onTaskStoreChange({ action, records }) {
        const { client } = this;
        if (client.isTreeGrouped && records.some(r => r.isLeaf) && action !== 'dataset') {
            client.suspendRefresh();
            this.updateParents(client.store.rootNode);
            client.resumeRefresh(false);

            this.refresh();
        }
    }

    refresh() {
        this.client.refreshWithTransition();
    }

    // Add task store listener when grouping, to catch task changes and update parents
    async applyLevels(levels) {
        // Detach prior to applying new levels, to avoid triggering old listeners in case tasks are affected
        // (they should not be, locked down in test, but just in case)
        this.detachListeners('taskStore');

        await super.applyLevels(levels);

        if (this.isDestroyed) {
            return;
        }

        if (levels?.length > 0) {
            // In case a 2nd called came here before a prior one completing
            this.detachListeners('taskStore');

            this.client.taskStore.ion({
                name    : 'taskStore',
                change  : 'onTaskStoreChange',
                thisObj : this
            });
        }
    }
}

GridFeatureManager.registerFeature(TreeGroup, false, 'Gantt');
