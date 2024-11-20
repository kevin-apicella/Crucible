import Combo from './Combo.js';
import './ColorPicker.js';

/**
 * @module Core/widget/ColorField
 */

/**
 * Field that displays a CSS color and lets the user select from a pre-defined
 * {@link #config-colors range of CSS colors}.
 *
 * {@inlineexample Core/widget/ColorField.js}
 *
 * This field can be used as an {@link Grid.column.Column#config-editor} for the {@link Grid.column.Column}.
 *
 * This widget may be operated using the keyboard. `ArrowDown` opens the color picker, which itself is keyboard
 * navigable.
 *
 * ```javascript
 * let colorField = new ColorField({
 *   field: 'color'
 * });
 * ```
 *
 * @extends Core/widget/PickerField
 * @classtype colorfield
 * @inputfield
 */
export default class ColorField extends Combo {

    static $name = 'ColorField';

    static type = 'colorfield';

    static configurable = {

        /**
         * @hideconfigs text,color,editable,picker
         */

        displayField : 'text',
        valueField   : 'color',
        editable     : false,
        picker       : {
            type  : 'colorpicker',
            align : {
                align     : 't100-b100',
                matchSize : false
            }
        },
        showBoxForNoColor : true,

        /**
         * Array of CSS color strings to be able to chose from. This will override the
         * {@link Core.widget.ColorPicker#config-colors pickers default colors}.
         *
         * Provide an array of string CSS colors:
         * ```javascript
         * new ColorField({
         *     colors : ['#00FFFF', '#F0FFFF', '#89CFF0', '#0000FF', '#7393B3']
         * });
         * ```
         *
         * @prp {String[]}
         */
        colors : null,

        /**
         * Adds an option in the picker to set no background color
         * @prp {Boolean}
         */
        addNoColorItem : true
    };

    configure(config) {
        const pickerCfg = config.picker ?? {};

        if (config.colors) {
            pickerCfg.colors = config.colors;
        }

        if ('addNoColorItem' in config) {
            pickerCfg.addNoColorItem = config.addNoColorItem;
        }

        config.picker = pickerCfg;

        super.configure(config);
    }

    updatePicker(picker) {
        if (picker) {
            this.items = picker.store.records;
        }
    }

    updateColors(colors) {
        if (!this.isConfiguring) {
            this.picker.colors = colors;
        }
    }

    updateAddNoColorItem(addNoColorItem) {
        if (!this.isConfiguring) {
            this.picker.addNoColorItem = addNoColorItem;
        }
    }

    set value(value) {
        if (!this.store) {
            this.items = [];
            this.store = this.picker.store;
        }

        if (!value) {
            value = this.store.findRecord('color', null);
        }

        super.value = value;
    }

    showPicker() {
        // Not happy about this. Previously selected value doesn't trigger refresh
        this.picker.refresh();
        super.showPicker(...arguments);
    }

    get value() {
        return super.value;
    }

    syncInputFieldValue(...args) {
        const
            me        = this,
            { value } = me;

        let className = me.picker?.getColorClassName(value);

        if (!className) {
            me.colorBox.style.color = value;
        }

        className = 'b-colorbox ' + className;

        me.colorBox.className = className;

        if (!me.showBoxForNoColor) {
            me.element.classList.toggle('b-colorless', !value);
        }

        super.syncInputFieldValue(...args);
    }

    get innerElements() {
        return [
            {
                reference : 'colorBox',
                className : 'b-colorbox'
            },
            ...super.innerElements
        ];
    }
}

// Register this widget type with its Factory
ColorField.initClass();
