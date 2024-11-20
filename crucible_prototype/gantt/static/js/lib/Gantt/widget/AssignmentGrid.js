import Grid from '../../Grid/view/Grid.js';
import NumberColumn from '../../Grid/column/NumberColumn.js';
import Objects from '../../Core/helper/util/Objects.js';
import AssignmentManipulationStore from '../data/AssignmentsManipulationStore.js';
import AssignmentModel from '../model/AssignmentModel.js';
import '../../Core/widget/Checkbox.js';
import '../../Grid/feature/FilterBar.js';
import '../../Gantt/localization/En.js';
import '../../Gantt/column/ResourceAssignmentGridResourceColumn.js';

/**
 * @module Gantt/widget/AssignmentGrid
 */

/**
 * This grid visualizes and lets users edit assignments of an {@link #config-projectEvent event}. Used by the
 * {@link Gantt.widget.AssignmentField}. This grid shows one column showing the resource name, and one showing
 * the units assigned. You can add additional columns by providing a {@link Grid.view.Grid#config-columns} array in your grid config.
 *
 * {@inlineexample Gantt/widget/AssignmentGrid.js}
 *
 * @extends Grid/view/Grid
 * @classtype assignmentgrid
 * @widget
 */
export default class AssignmentGrid extends Grid {

    static get $name() {
        return 'AssignmentGrid';
    }

    // Factoryable type name
    static get type() {
        return 'assignmentgrid';
    }

    //region Config
    static get configurable() {
        return {
            // Required by ResourceInfo column
            resourceImageExtension : '.jpg',
            minHeight              : 200,

            /**
             * A {@link Grid.column.Column} config object for the resource column. You can pass a `renderer` which
             * gives you access to the `resource` record.
             *
             * @config {ResourceAssignmentColumnConfig}
             */
            resourceColumn : {
                type : 'assignmentResource'
            },

            /**
             * A config object for the units column
             *
             * @config {NumberColumnConfig}
             */
            unitsColumn : {
                field       : 'units',
                type        : NumberColumn.type,
                text        : 'L{Units}',
                localeClass : this,
                width       : 70,
                min         : 0,
                max         : 100,
                step        : 10,
                unit        : '%',
                renderer    : ({ value }) => this.L('L{unitsTpl}', { value : Math.round(value) }),
                filterable  : false
            }
        };
    }

    static get defaultConfig() {
        return {
            selectionMode : {
                checkboxOnly : true,
                multiSelect  : true,
                showCheckAll : true
            },

            // If enabled blocks header checkbox click event
            features : {
                group       : false,
                filterBar   : true,
                contextMenu : false
            },

            disableGridRowModelWarning : true,

            /**
             * Event model to manipulate assignments of, the task should be part of a task store.
             * Either task or {@link Grid/view/Grid#config-store store} should be given.
             *
             * @config {Gantt.model.TaskModel}
             */
            projectEvent : null
        };
    }
    //endregion

    construct() {
        super.construct(...arguments);

        this.ion({
            selectionChange : ({ selected, deselected }) => {
                selected.forEach(assignment => assignment.units = assignment.units || assignment.getFieldDefinition('units').defaultValue);
                deselected.forEach(assignment => {
                    if (this.store.includes(assignment)) {
                        assignment.units = 0;
                    }
                });
            }
        });
    }

    get projectEvent() {
        const me = this,
            store = me.store;

        let projectEvent = me._projectEvent;

        if (store && (projectEvent !== store.projectEvent)) {
            projectEvent = me._projectEvent = store.projectEvent;
        }

        return projectEvent;
    }

    set projectEvent(projectEvent) {
        const me = this;

        me._projectEvent = projectEvent;

        me.store.projectEvent = projectEvent;

        if (projectEvent) {
            me.selectedRecords = me.store.query(as => projectEvent.assignments.find(existingAs => existingAs.resource === as.resource));
        }
    }

    get store() {
        return super.store;
    }

    set store(store) {
        const
            me       = this,
            oldStore = me.store;

        if (store && oldStore !== store) {
            if (!(store instanceof AssignmentManipulationStore)) {
                store = AssignmentManipulationStore.new({
                    modelClass   : me._projectEvent?.assignmentStore.modelClass || AssignmentModel,
                    projectEvent : me._projectEvent
                }, store);
            }

            super.store = store;

            me.storeDetacher?.();
            me.storeDetacher = store.ion({ update : 'onAssignmentUpdate', thisObj : me });
        }
    }

    set columns(columns) {
        if (columns) {
            // Clone is needed to flatten the properties from the prototype chain, the Model class wants data
            // in a flat simple object
            columns.unshift(Objects.clone(this.resourceColumn), Objects.clone(this.unitsColumn));
        }

        super.columns = columns;
    }

    get columns() {
        return super.columns;
    }

    onAssignmentUpdate({ record, changes }) {
        const { units } = changes;

        // Sync selection while cell editing
        if (units) {
            if (!units.value) {
                this.deselectRow(record);
            }
            else if (units.oldValue === 0) {
                this.selectRow({
                    record,
                    scrollIntoView : false,
                    addToSelection : this.selectionMode.multiSelect // keep selection only if multiSelect
                });
            }
        }
    }

    afterConstruct() {
        super.afterConstruct();

        this.ion({
            startCellEdit : 'onGridStartCellEdit',
            thisObj       : this
        });
    }

    onGridStartCellEdit({ editorContext }) {
        if (editorContext.column.field === 'units') {
            editorContext.editor.inputField.max = editorContext.record.resource?.maxUnits ?? 100;
        }
    }
}

// Register this widget type with its Factory
AssignmentGrid.initClass();
