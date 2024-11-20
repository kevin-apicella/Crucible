import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import EventMenu from '../../Scheduler/feature/EventMenu.js';
import Objects from '../../Core/helper/util/Objects.js';

/**
 * @module Gantt/feature/TaskMenu
 */

/**
 * Displays a context menu for tasks. Items are populated by other features and/or application code.
 * Configure it with `false` to disable it completely. If enabled, {@link Grid.feature.CellMenu} feature
 * is not available. Cell context menu items are handled by this feature.
 *
 * ## Default task menu items
 *
 * Here is the list of menu items provided by the Task menu feature and populated by the other features:
 *
 * | Reference                       | Text                 | Weight | Feature                                    | Description                                                                                                      |
 * |---------------------------------|----------------------|--------|--------------------------------------------|------------------------------------------------------------------------------------------------------------------|
 * | `editTask`                      | Edit task            | 100    | {@link Gantt.feature.TaskEdit}             | Edit the task                                                                                                    |
 * | `cut`                           | Cut task             | 110    | {@link Gantt.feature.TaskCopyPaste}        | Cut the task                                                                                                     |
 * | `copy`                          | Copy task            | 120    | {@link Gantt.feature.TaskCopyPaste}        | Copy the task                                                                                                    |
 * | `paste`                         | Paste task           | 130    | {@link Gantt.feature.TaskCopyPaste}        | Paste the task                                                                                                   |
 * | `search`*                       | Search for value     | 200    | {@link Grid.feature.Search}                | Search for cell text                                                                                             |
 * | `filterMenu`                    | Filter               | 400    | {@link Grid/feature/Filter}                | Shows a submenu to control filtering. See [Filter submenu](#Grid/feature/Filter#menu-items).                    |
 * | `add`                           | Add...               | 500    | *This feature*                             | Submenu for adding tasks                                                                                         |
 * | \>`addTaskAbove`                | Task above           | 510    | *This feature*                             | Add a new task above the selected task                                                                           |
 * | \>`addTaskBelow`                | Task below           | 520    | *This feature*                             | Add a new task below the selected task                                                                           |
 * | \>`milestone`                   | Milestone            | 530    | *This feature*                             | Add a new milestone below the selected task                                                                      |
 * | \>`subtask`                     | Subtask              | 540    | *This feature*                             | Add a new task as a child of the current, turning it into a parent                                               |
 * | \>`successor`                   | Successor            | 550    | *This feature*                             | Add a new task below current task, linked using an "Finish-to-Start" dependency                                  |
 * | \>`predecessor`                 | Predecessor          | 560    | *This feature*                             | Add a new task above current task, linked using an "Finish-to-Start" dependency                                  |
 * | `convertToMilestone`            | Convert to milestone | 600    | *This feature*                             | Turns the selected task into a milestone. Shown for leaf tasks only                                              |
 * | `splitTask`                     | Split task           | 650    | {@link SchedulerPro.feature.EventSegments} | Split the task                                                                                                   |
 * | `indent`                        | Indent               | 700    | *This feature*                             | Add the task as a child of its previous sibling, turning that task into a parent                                 |
 * | `outdent`                       | Outdent              | 800    | *This feature*                             | Turn the task into a sibling of its parent                                                                       |
 * | `deleteTask`                    | Delete task          | 900    | *This feature*                             | Remove the selected task                                                                                         |
 * | `linkTasks`                     | Add dependencies     | 1000   | *This feature*                             | Add dependencies between two or more selected tasks                                                              |
 * | `unlinkTasks`                   | Remove dependencies  | 1010   | *This feature*                             | Removes dependencies between selected tasks                                                                      |
 * | `taskColor` ¹                   | Color                | 1100   | *This feature*                             | Choose background color for the task bar                                                                         |
 *
 * **¹** Set {@link Gantt.view.GanttBase#config-showTaskColorPickers} to true to enable this item
*
 * <dl class="foot-note">
 *     <dt>*</dt><dd>items that are shown for the locked grid cells only</dd>
 *     <dt>></dt><dd>first level of submenu</dd>
 * </dl>
 *
 * ## Customizing the menu items
 *
 * The menu items in the Task menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * To add extra items for all events:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskMenu : {
 *             // Extra items for all events
 *             items : {
 *                 flagTask : {
 *                     text : 'Extra',
 *                     icon : 'b-fa b-fa-fw b-fa-flag',
 *                     onItem({taskRecord}) {
 *                         taskRecord.flagged = true;
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Remove menu/submenu items
 *
 * Items can be removed from the menu:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskMenu : {
 *             items : {
 *                 // Hide delete task option
 *                 deleteTask: false,
 *
 *                 // Hide item from the `add` submenu
 *                 add: {
 *                     menu: {
 *                          subtask: false
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Manipulate items for specific tasks
 *
 * Items can behave different depending on the type of the task:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskMenu : {
 *             // Process items before menu is shown
 *             processItems({ items, taskRecord }) {
 *                  // Push an extra item for conferences
 *                  if (taskRecord.type === 'conference') {
 *                      items.showSessions = {
 *                          text : 'Show sessions',
 *                          ontItem({taskRecord}) {
 *                              // ...
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for secret events
 *                  if (taskRecord.type === 'secret') {
 *                      return false;
 *                  }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Full information of the menu customization can be found in the "Customizing the Task menu" guide.
 *
 * This feature is **enabled** by default
 *
 * {@inlineexample Gantt/feature/TaskMenu.js}
 *
 * @demo Gantt/taskmenu
 *
 * @extends Scheduler/feature/EventMenu
 * @classtype taskMenu
 * @feature
 */
export default class TaskMenu extends EventMenu {
    //region Config

    static get $name() {
        return 'TaskMenu';
    }

    static get defaultConfig() {
        return {
            type : 'task',

            /**
             * A function called before displaying the menu that allows manipulations of its items.
             * Returning `false` from this function prevents the menu being shown.
             *
             * ```javascript
             * features         : {
             *    taskMenu : {
             *         processItems({ items, taskRecord }) {
             *             // Add or hide existing items here as needed
             *             items.myAction = {
             *                 text   : 'Cool action',
             *                 icon   : 'b-fa b-fa-fw b-fa-ban',
             *                 onItem : () => console.log(`Clicked ${eventRecord.name}`),
             *                 weight : 1000 // Move to end
             *             };
             *
             *            if (!eventRecord.allowDelete) {
             *                 items.deleteEvent.hidden = true;
             *             }
             *         }
             *     }
             * },
             * ```
             *
             * @config {Function}
             * @param {Object} context An object with information about the menu being shown.
             * @param {Core.feature.base.ContextMenuBase} context.feature A reference to the menu feature which owns this context.
             * @param {Event} context.domEvent The initiating event.
             * @param {Event} context.event DEPRECATED: The initiating event.
             * @param {Number[]} context.point The client `X` and `Y` position of the initiating event.
             * @param {HTMLElement} context.targetElement The target to which the menu is being applied.
             * @param {Gantt.model.TaskModel} context.taskRecord The record representing the current task.
             * @param {Grid.column.Column} context.column The current column.
             * @param {Object<String,MenuItemConfig|Boolean>} context.items An object containing the
             *   {@link Core.widget.MenuItem menu item} configs keyed by their id.
             * @returns {Boolean|null} Returning `false` from this function prevents the menu being shown
             * @preventable
             */
            processItems : null

            /**
             * This is a preconfigured set of items used to create the default context menu.
             *
             * ```javascript
             * const gantt = new Gantt({
             *     features : {
             *         taskMenu : {
             *             items : {
             *                 add                 : false,
             *                 convertToMilestone  : false
             *             }
             *         }
             *     }
             * });
             * ```
             * The `items` provided by this feature are listed below. These are the property names which you may
             * configure:
             *
             * - `add` A submenu option containing a `menu` config which contains the following named items:
             *     * `addTaskAbove` Inserts a sibling task above the context task.
             *     * `addTaskBelow` Inserts a sibling task below the context task.
             *     * `milestone` Inserts a sibling milestone below the context task.
             *     * `subtask` Appends a child task to the context task. This menu supports an "at" property that
             *       can be set to 'end' to append new tasks to the end of the parent task's children. By default,
             *       (at = 'start'), new subtasks are inserted as the firstChild of the parent task.
             *     * `successor` Adds a sibling task linked by a dependence below the context task.
             *     * `predecessor` Adds a sibling task linked by a dependence above the context task.
             *  - `deleteTask` Deletes the context task.
             *  - `indent` Indents the context task by adding it as a child of its previous sibling.
             *  - `outdent` Outdents the context task by adding it as the final sibling of its parent.
             *  - `convertToMilestone` Converts the context task to a zero duration milestone.
             *
             * See the feature config in the above example for details.
             *
             * @config {Object<String,MenuItemConfig|Boolean|null>} items
             */
        };
    }

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.chain.push('populateTaskMenu');

        return config;
    }

    //endregion

    construct(gantt, config = {}) {
        super.construct(...arguments);

        this.gantt = gantt;

        if (gantt.features.cellMenu) {
            console.warn('`CellMenu` feature is ignored, when `TaskMenu` feature is enabled. If you need cell specific menu items, please configure `TaskMenu` feature items instead.');
            gantt.features.cellMenu.disabled = true;
        }
    }

    //region Events

    /**
     * This event fires on the owning Gantt before the context menu is shown for a task. Allows manipulation of the items
     * to show in the same way as in `processItems`. Returning false from a listener prevents the menu from
     * being shown.
     * @event taskMenuBeforeShow
     * @on-owner
     * @preventable
     * @param {Gantt.view.Gantt} source
     * @param {MenuItemConfig[]} items Menu item configs
     * @param {Gantt.model.TaskModel} taskRecord Event record for which the menu was triggered
     * @param {HTMLElement} taskElement
     */

    /**
     * This event fires on the owning Gantt when an item is selected in the context menu.
     * @event taskMenuItem
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Core.widget.MenuItem} item
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {HTMLElement} taskElement
     */

    /**
     * This event fires on the owning Gantt after showing the context menu for an event
     * @event taskMenuShow
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Gantt.model.TaskModel} taskRecord Event record for which the menu was triggered
     * @param {HTMLElement} taskElement
     */

    //endregion

    getDataFromEvent(event) {
        const
            { client }    = this,
            targetElement = this.getTargetElementFromEvent(event),
            // to resolve record from a task element or from a grid cell
            taskRecord    = client.resolveTaskRecord(targetElement) || client.getRecordFromElement(targetElement),
            taskElement   = taskRecord && client.getElementFromTaskRecord(taskRecord, false); // get wrapper;

        return Objects.assign({
            feature  : this,
            event,
            domEvent : event,
            targetElement,
            taskElement,
            taskRecord
        }, client.getCellDataFromEvent(event));
    }

    callChainablePopulateMenuMethod(eventParams) {
        // When context menu is called for a task cell, need to collect items from features
        // which usually add items to CellMenu in Grid and Scheduler,
        // since CellMenu feature is disabled when TaskMenu feature is enabled.
        if (eventParams.cellData && this.client.populateCellMenu) {
            this.client.populateCellMenu(eventParams);
        }

        super.callChainablePopulateMenuMethod(...arguments);
    }

    shouldShowMenu(eventParams) {
        const { column } = eventParams;

        return eventParams.taskRecord && (!column || column.enableCellContextMenu !== false);
    }

    getElementFromRecord(record) {
        return this.client.getElementFromTaskRecord(record);
    }

    populateTaskMenu({ items, column, selection, taskRecord }) {
        const
            { client }    = this,
            {
                isTreeGrouped,
                usesDisplayStore
            }             = client,
            // Context menu on the selection offers multi actions on the selection.
            // Context menu on a non-selected record offers single actions on the context record.
            multiSelected = selection.includes(taskRecord) && selection.length > 1;

        items.add                = {
            disabled : client.readOnly || isTreeGrouped || usesDisplayStore,
            hidden   : multiSelected
        };
        items.convertToMilestone = {
            disabled : client.readOnly || taskRecord.readOnly,
            hidden   : taskRecord.isParent || taskRecord.milestone
        };
        items.indent             = {
            disabled : client.readOnly || !taskRecord.previousSibling || taskRecord.readOnly || isTreeGrouped || usesDisplayStore
        };
        items.outdent            = {
            disabled : client.readOnly || taskRecord.parent === client.taskStore.rootNode || taskRecord.readOnly || isTreeGrouped || usesDisplayStore
        };
        items.deleteTask         = {
            disabled : client.readOnly || taskRecord.readOnly
        };
        items.linkTasks          = {
            disabled : !multiSelected
        };
        items.unlinkTasks        = {
            disabled : items.linkTasks.disabled
        };

        // TaskMenu feature is responsible for cell items
        if (column?.cellMenuItems) {
            Objects.merge(items, column.cellMenuItems);
        }

        if (client.showTaskColorPickers) {
            items.taskColor = {
                disabled : client.readOnly || taskRecord.readOnly
            };
        }
        else {
            items.taskColor = {
                hidden : true
            };
        }
    }

    populateItemsWithData({ items, taskRecord }) {
        super.populateItemsWithData(...arguments);

        if (this.client.showTaskColorPickers && items.taskColor?.menu) {
            Objects.merge(items.taskColor.menu.colorMenu, {
                value  : taskRecord.eventColor,
                record : taskRecord
            });
        }
    }

    // This generates the fixed, unchanging part of the items and is only called once
    // to generate the baseItems of the feature.
    // The dynamic parts which are set by populateEventMenu have this merged into them.
    changeItems(items) {
        const { client } = this;

        return Objects.merge({
            add : {
                text   : 'L{Gantt.Add}',
                cls    : 'b-separator',
                icon   : 'b-icon-add',
                weight : 500,
                menu   : {
                    addTaskAbove : {
                        text   : 'L{Gantt.Task above}',
                        weight : 510,
                        icon   : 'b-icon-up',
                        onItem({ taskRecord }) {
                            client.addTaskAbove(taskRecord);
                        }
                    },
                    addTaskBelow : {
                        text   : 'L{Gantt.Task below}',
                        weight : 520,
                        icon   : 'b-icon-down',
                        onItem({ taskRecord }) {
                            client.addTaskBelow(taskRecord);
                        }
                    },
                    milestone : {
                        text   : 'L{Gantt.Milestone}',
                        weight : 530,
                        icon   : 'b-icon-milestone',
                        onItem({ taskRecord }) {
                            client.addMilestoneBelow(taskRecord);
                        }
                    },
                    subtask : {
                        text   : 'L{Gantt.Sub-task}',
                        weight : 540,
                        icon   : 'b-icon-subtask',
                        at     : 'start',
                        onItem({ taskRecord }) {
                            client.addSubtask(taskRecord, { at : this.at });
                        }
                    },
                    successor : {
                        text   : 'L{Gantt.Successor}',
                        weight : 550,
                        icon   : 'b-icon-successor',
                        onItem({ taskRecord }) {
                            client.addSuccessor(taskRecord);
                        }
                    },
                    predecessor : {
                        text   : 'L{Gantt.Predecessor}',
                        weight : 560,
                        icon   : 'b-icon-predecessor',
                        onItem({ taskRecord }) {
                            client.addPredecessor(taskRecord);
                        }
                    }
                }
            },
            convertToMilestone : {
                icon   : 'b-icon-milestone',
                text   : 'L{Gantt.Convert to milestone}',
                weight : 600,
                onItem({ taskRecord }) {
                    taskRecord.convertToMilestone();
                }
            },
            indent : {
                text      : 'L{Gantt.Indent}',
                icon      : 'b-icon-indent',
                weight    : 700,
                separator : true,
                onItem({ selection, taskRecord }) {
                    // Context menu on the selection offers multi actions on the selection.
                    // Context menu on a non-selected record offers single actions on the context record.
                    client.indent(selection.includes(taskRecord) ? selection : taskRecord);
                }
            },
            outdent : {
                text   : 'L{Gantt.Outdent}',
                icon   : 'b-icon-outdent',
                weight : 800,
                onItem({ selection, taskRecord }) {
                    // Context menu on the selection offers multi actions on the selection.
                    client.outdent(selection.includes(taskRecord) ? selection : taskRecord);
                }
            },
            deleteTask : {
                text   : 'L{Gantt.Delete task}',
                icon   : 'b-icon-trash',
                cls    : 'b-separator',
                weight : 900,
                onItem({ selection, taskRecord }) {
                    // Context menu on the selection offers multi actions on the selection.
                    // Context menu on a non-selected record offers single actions on the context record.
                    client.store.remove(selection.includes(taskRecord) ? selection : taskRecord);
                }
            },
            linkTasks : {
                text   : 'L{Gantt.linkTasks}',
                icon   : 'b-icon-link',
                cls    : 'b-separator',
                weight : 1000,
                onItem({ selection }) {
                    client.store.linkTasks(selection);
                }
            },
            unlinkTasks : {
                text   : 'L{Gantt.unlinkTasks}',
                icon   : 'b-icon-unlink',
                weight : 1010,
                onItem({ selection }) {
                    client.store.unlinkTasks(selection);
                }
            },
            taskColor : {
                text : 'L{Gantt.color}',
                icon : 'b-icon-palette',
                menu : {
                    colorMenu : {
                        type : 'eventcolorpicker'
                    }
                },
                separator : true,
                weight    : 1100
            }
        }, items);
    }

}

TaskMenu.featureClass = '';

GridFeatureManager.registerFeature(TaskMenu, true, 'Gantt');
