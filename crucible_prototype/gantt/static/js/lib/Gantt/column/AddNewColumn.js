import Column from '../../Grid/column/Column.js';
import Store from '../../Core/data/Store.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import Combo from '../../Core/widget/Combo.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Gantt/column/AddNewColumn
 */

/**
 * {@link Gantt/column/AddNewColumn "Add New.." column} combobox item data.
 *
 * @typedef {Object} AddNewColumnComboModelConfig
 * @property {String} text Column entry text in the combobox
 * @property {GridColumnConfig} value Column configuration
 */

/**
 * This column allows user to dynamically add columns to the Gantt chart by clicking the column header
 * and picking columns from a combobox.
 *
 * ## Customizing the combobox store data
 *
 * In order to add, update or remove a column from the combobox one can use {@link #config-processComboStoreConfig}
 * config:
 *
 * ```javascript
 * new Gantt{{
 *     columns : [
 *         {
 *             type : 'addnew',
 *             processComboStoreConfig({ config, column }) {
 *                 // Add a new custom column to the combobox
 *                 config.data.push({
 *                     text  : 'Custom date',
 *                     // column config
 *                     value : {
 *                         type  : 'date',
 *                         field : 'customDate',
 *                         text  : 'Custom date'
 *                     }
 *                 });
 *             }
 *         }
 *     ]
 * }}
 * ```
 *
 * ## Adding a custom column class
 *
 * In order to appear in the column combobox list a column class have to fulfill these conditions:
 *
 * 1. the class should have a static property `type` with unique string value that will identify the column.
 * 2. the class should be registered with the call to {@link Grid/data/ColumnStore#function-registerColumnType-static ColumnStore.registerColumnType}.
 * 3. the class should have a static property `isGanttColumn` with truthy value.
 * 4. the class should have a static `text` property with column name.
 *
 * For example:
 *
 * ```javascript
 * import ColumnStore from 'gantt-distr/lib/Grid/data/ColumnStore.js';
 * import Column from 'gantt-distr/lib/Grid/column/Column.js';
 *
 * // New column class to display task priority
 * export default class TaskPriorityColumn extends Column {
 *     // unique alias of the column
 *     static type = 'priority';
 *
 *     // indicates that the column should be present in "Add New..." column
 *     static isGanttColumn = true;
 *
 *     static defaults = {
 *         // the column is mapped to "priority" field of the Task model
 *         field : 'priority',
 *         // the column title
 *         text  : 'Priority'
 *     };
 * }
 *
 * // register new column
 * ColumnStore.registerColumnType(TaskPriorityColumn);
 * ```
 *
 * @extends Grid/column/Column
 * @classtype addnew
 * @column
 */
export default class AddNewColumn extends Column {

    static $name = 'AddNewColumn';

    static type = 'addnew';

    static defaults = {
        text       : 'L{New Column}',
        cls        : 'b-new-column-column',
        draggable  : false,
        sortable   : false,
        exportable : false,
        field      : null,
        editor     : null,
        readOnly   : true
    };

    static fields = [
        /**
         * Specify `true` to allow adding more than one column of the same type to the Gantt.
         * @config {Boolean} allowMultipleColumnInstances
         * @default false
         * @category Common
         */
        { name : 'allowMultipleColumnInstances', type : 'boolean', defaultValue : false },

        /**
         * A function to be called for processing the column combo store configuration object.
         * Can be specified as a function, or name of a function in the ownership.
         *
         * Can be used for editing the combo store data. For example:
         *
         * ```javascript
         * new Gantt({
         *     columns : [
         *         {
         *             type : 'addnew',
         *             processComboStoreConfig({ config, column }) {
         *                 // Adding a custom column
         *                 config.data.push({
         *                     text  : 'Custom date',
         *                     // column config
         *                     value : {
         *                         type  : 'date',
         *                         field : 'customDate',
         *                         text  : 'Custom date'
         *                     }
         *                 });
         *             }
         *         }
         *     ]
         * });
         * ```
         *
         * @config {Function|String} processComboStoreConfig
         * @param {Object} data Wrapping object
         * @param {StoreConfig} data.config The combo store configuration.
         * @param {AddNewColumnComboModelConfig[]} data.config.data The store data.
         * @param {Gantt.column.AddNewColumn} data.column The column.
         * @returns {void}
         * @category Common
         */
        'processComboStoreConfig',

        /**
         * A configuration object to apply to the {Core.widget.Combo} rendered into the column header.
         * @config {ComboConfig} combo
         * @category Common
         */
        'combo'
    ];

    doDestroy() {
        this._combo?.destroy();
        super.doDestroy();
    }

    /**
     * Returns the combo box field rendered into the header of this column
     * @property {Core.widget.Combo}
     * @readonly
     */
    get combo() {
        const
            me = this;

        if (!me._combo?.isCombo) {
            me._combo = new Combo(Combo.mergeConfigs({
                owner                   : me.grid,
                // use the column locale
                localeClass             : me,
                placeholder             : 'L{New Column}',
                triggers                : false,
                autoExpand              : true,
                // the combo translates its items automatically
                localizeDisplayFields   : true,
                // reapply items sorting after translating
                sortItemsOnLocaleChange : true,
                store                   : me.ganttColumnStore,
                displayField            : 'text',
                monitorResize           : false,
                picker                  : {
                    align : {
                        align    : 't0-b0',
                        axisLock : true
                    },
                    minWidth          : 200,
                    internalListeners : {
                        item       : 'onComboPickerItem',
                        beforeShow : 'onComboPickerBeforeShow',
                        thisObj    : this
                    }
                },
                syncInputFieldValue() {
                    this.input.value = '';
                },
                internalListeners : {
                    keydown : 'onComboKeydown',
                    thisObj : this
                }
            }, me.data.combo));
            me._combo.element.classList.add('b-new-column-combo');
        }

        return me._combo;
    }

    // region Listeners

    onComboKeydown({ event }) {
        // Keystrokes must not leak up to the Grid where its Navigator will react
        event.stopImmediatePropagation();
    }

    onComboPickerBeforeShow({ source }) {
        // Column elements are rerendered, so the forElement must be kept up to date
        source.forElement = this.element;
    }

    onComboPickerItem({ record : columnRecord }) {
        const { columns } = this.grid;

        let newColumn = columnRecord;

        if (ObjectHelper.isClass(newColumn.value)) {
            newColumn = new newColumn.value({
                region : this.region
            }, columns);
        }
        else {
            newColumn = {
                region : this.region,
                ...columnRecord.value
            };
        }

        // Insert the new column before the "New Column" column
        // then focus it to ensure it is in view.
        newColumn = columns.insert(columns.indexOf(this), newColumn)[0];
        newColumn.element.focus();
    }

    onKeyDown(event) {
        if (event.key === 'Enter') {
            this.combo.focus();
        }
    }

    // endregion Listeners

    addRecordToColumnStoreData(data, col) {
        // We must ensure that the defaultValues property is calculated
        // so that we can detect a text property.
        if (!col.$meta.fields.exposedData) {
            col.exposeProperties({});
        }

        // To be included, a column must have a static isGanttColumn
        // property which yields a truthy value, and a text value.
        if (col.isGanttColumn && col.text) {
            data.push({
                id          : col.type,
                text        : col.text,
                localeClass : col,
                value       : col
            });
        }

        return data;
    }

    get ganttColumnStore() {
        const
            me     = this,
            data   = Object.values(ColumnStore.columnTypes).reduce(this.addRecordToColumnStoreData, []),
            config = {
                data,
                sorters : [
                    { field : 'text' }
                ]
            };

        if (me.processComboStoreConfig) {
            me.callback(me.processComboStoreConfig, me, [{ config, column : me }]);
        }

        // Create a store containing the Gantt column classes.
        const store = new Store(config);

        if (!me.allowMultipleColumnInstances) {
            // A filter ensures that column types which are already
            // present in the grid are not shown.
            store.filter({
                id       : 'no-used-columns', 
                // A colRecord is only filtered in if the grid columns do not contain an instance.
                filterBy : colRecord => !me.grid.columns.some(gridCol => gridCol.constructor === colRecord.value)
            });
        }

        return store;
    }

    headerRenderer({ column, headerElement }) {
        column.combo.render(headerElement);
    }
}

ColumnStore.registerColumnType(AddNewColumn);
