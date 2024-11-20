import List from './List.js';
import TemplateHelper from '../helper/TemplateHelper.js';
import StringHelper from '../helper/StringHelper.js';

/**
 * @module Core/widget/ColorPicker
 */

/**
 * A color picker that displays a list of {@link #config-colors} which the user can select by using mouse or keyboard.
 *
 * {@inlineexample Core/widget/ColorPicker.js}
 *
 * ```javascript
 * new ColorPicker({
 *    appendTo : 'container',
 *    width    : '10em',
 *    colorSelected() {
 *        console.log(...arguments);
 *    }
 * });
 * ```
 *
 * @extends Core/widget/List
 * @classtype colorpicker
 */
export default class ColorPicker extends List {

    static $name = 'ColorPicker';

    static type = 'colorpicker';

    static configurable = {
        itemsFocusable : false,
        navigator      : {
            focusCls : 'b-color-active'
        },

        itemWrapperTpl(record, i) {
            const
                { selected }    = this,
                { color, text } = record,
                colorClassName  = this.getColorClassName(color);

            return TemplateHelper.tpl`
                    <li
                        class="${this.getItemClasses(record, i)} ${colorClassName}"
                        role="option"
                        aria-selected="${selected.includes(record)}"
                        data-index="${i}"
                        data-id="${StringHelper.encodeHtml(color)}"
                        data-btip="${text}"
                        ${this.itemsFocusable ? 'tabindex="-1"' : ''}
                        style="${colorClassName ? '' : 'background-color: ' + color}"
                    ></li>`;
        },
        /**
         * Array of internal color class names, without prefix, like `red`, `violet` etc. If specified, this will
         * take precedence over {@link #config-colors}.
         * @config {String[]}
         * @private
         */
        colorClasses : null,

        /**
         * Prefix to be inserted before the color class names in {@link #config-colorClasses}, like `b-sch-`
         * @config {String}
         * @private
         */
        colorClassPrefix : null,

        /**
         * Array of CSS color strings from which the user can chose from.
         *
         * Provide an array of string CSS colors:
         * ```javascript
         * new ColorMenu({
         *     colors : ['#00FFFF', '#F0FFFF', '#89CFF0', '#0000FF', '#7393B3']
         * });
         * ```
         *
         * The colors can also be named. To do that, put them in an object with a `color` and a `text` property, like:
         * ```javascript
         * new ColorMenu({
         *    colors : [
         *        { color : '#000000', text : 'Black'},
         *        { color : '#FF0000', text : 'Red'},
         *        { color : '#00FF00', text : 'Green'},
         *        { color : '#0000FF', text : 'Blue'},
         *        { color : '#FFFFFF', text : 'White'},
         *    ]
         * });
         * ```
         *
         * Default colors are:
         * <div class="b-colorbox b-inline" style="background-color: #45171D"></div>#45171D
         * <div class="b-colorbox b-inline" style="background-color: #F03861"></div>#F03861
         * <div class="b-colorbox b-inline" style="background-color: #FF847C"></div>#FF847C
         * <div class="b-colorbox b-inline" style="background-color: #FECEA8"></div>#FECEA8
         * <div class="b-colorbox b-inline" style="background-color: #A5F2E7"></div>#A5F2E7
         * <div class="b-colorbox b-inline" style="background-color: #AA83F3"></div>#AA83F3
         * <div class="b-colorbox b-inline" style="background-color: #8983F3"></div>#8983F3
         * <div class="b-colorbox b-inline" style="background-color: #A10054"></div>#A10054
         * <div class="b-colorbox b-inline" style="background-color: #073059"></div>#073059
         * <div class="b-colorbox b-inline" style="background-color: #2866AB"></div>#2866AB
         * <div class="b-colorbox b-inline" style="background-color: #5FBDC5"></div>#5FBDC5
         * <div class="b-colorbox b-inline" style="background-color: #D8D95C"></div>#D8D95C
         * <div class="b-colorbox b-inline" style="background-color: #FFDEDE"></div>#FFDEDE
         * <div class="b-colorbox b-inline" style="background-color: #F7F3CE"></div>#F7F3CE
         * <div class="b-colorbox b-inline" style="background-color: #C5ECBE"></div>#C5ECBE
         * <div class="b-colorbox b-inline" style="background-color: #3E3E3E"></div>#3E3E3E
         * <div class="b-colorbox b-inline" style="background-color: #405559"></div>#405559
         * <div class="b-colorbox b-inline" style="background-color: #68868C"></div>#68868C
         * <div class="b-colorbox b-inline" style="background-color: #EDEDED"></div>#EDEDED
         * <div class="b-colorbox b-inline" style="background-color: #D3D6DB"></div>#D3D6DB
         * <div class="b-colorbox b-inline" style="background-color: #3A4750"></div>#3A4750
         * <div class="b-colorbox b-inline" style="background-color: #303841"></div>#303841
         * <div class="b-colorbox b-inline" style="background-color: #BE3144"></div>#BE3144
         * @prp {String[]}
         */
        colors : [
            '#45171D', '#F03861', '#FF847C', '#FECEA8', '#A5F2E7', '#AA83F3', '#8983F3', '#A10054', '#073059',
            '#2866AB', '#5FBDC5', '#D8D95C', '#FFDEDE', '#F7F3CE', '#C5ECBE', '#3E3E3E', '#405559', '#68868C',
            '#EDEDED', '#D3D6DB', '#3A4750', '#303841', '#BE3144'
        ],

        /**
         * Adds an option to set no background color
         * @prp {Boolean}
         */
        addNoColorItem : true,

        /**
         * The color items is displayed in a grid layout with 6 columns as default. Change this to another number to
         * affect appearance.
         * @prp {Number}
         */
        columns : 6,

        /**
         * A callback function that will be called when the user selects a color in the picker.
         * @param {Object} event Object containing event data
         * @param {Core.data.Model} event.record The selected color's record instance
         * @param {String} event.color The string color value
         * @config {Function}
         * @returns {void}
         */
        colorSelected : null
    };

    configure(config) {
        super.configure(config);

        this.setItems();

        this.ion({
            item : 'onColorSelect'
        });
    }

    setItems() {
        const
            me                       = this,
            { colors, colorClasses } = me;
        let useColors                = colorClasses || colors;

        if (me.addNoColorItem) {
            useColors = [...useColors];
            useColors.push(null);
        }

        me.items = useColors.map(color => (!color || typeof color == 'string'
            ? { color, text : (colorClasses ? StringHelper.capitalize(color) : color) || me.L('L{noColor}') }
            : color));
    }

    afterConfigure() {
        super.afterConfigure(...arguments);

        if (this.addNoColorItem || this.value) {
            this.select(this.value ?? null);
        }
    }

    updateColors() {
        if (!this.isConfiguring) {
            this.setItems();
        }
    }

    updateAddNoColorItem() {
        if (!this.isConfiguring) {
            this.setItems();
        }
    }

    onColorSelect({ record }) {
        this.refresh();
        const event = { color : record.color, record, bubbles : true };
        this.colorSelected?.(event);
        this.trigger('colorSelected', event);
    }

    select(value) {
        if (!value || typeof value === 'string') {
            value = this.store.findRecord('color', value ?? null);
        }
        value && super.select(value);
    }

    updateColumns(columns) {
        this.style = `grid-template-columns:repeat(${columns}, 1fr);`;
    }

    getColorClassName(color) {
        if (this.colorClasses?.includes(color) || this.colorClasses?.find(r => r && r.color === color)) {
            return this.colorClassPrefix + color;
        }
        return color ? '' : 'b-no-color';
    }
}

ColorPicker.initClass();
