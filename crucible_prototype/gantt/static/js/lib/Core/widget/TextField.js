import Field from './Field.js';



/**
 * @module Core/widget/TextField
 */

/**
 * Textfield widget. Wraps native &lt;input type="text"&gt;
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the {@link Grid.column.Column Column}, {@link Grid.column.TemplateColumn TemplateColumn},
 * {@link Grid.column.TreeColumn TreeColumn}, and for other columns if another editor is not specified explicitly,
 * or disabled by setting `false` value.
 *
 *
 * ```javascript
 * let textField = new TextField({
 *   placeholder: 'Enter some text'
 * });
 * ```
 *
 * {@inlineexample Core/widget/TextField.js}
 *
 * @extends Core/widget/Field
 * @classtype textfield
 * @classtypealias text
 * @inputfield
 */
export default class TextField extends Field {

    static $name = 'TextField';

    static type = 'textfield';

    static alias = 'text';

    static get configurable() {
        return {
            /**
             * The tab index of the input field
             * @config {Number} tabIndex
             * @category Input element
             */

            /**
             * The min number of characters for the input field
             * @config {Number} minLength
             * @category Field
             */

            /**
             * The max number of characters for the input field
             * @config {Number} maxLength
             * @category Field
             */

            nullValue : ''
        };
    }

    construct(config) {
        if (config?.inputType === 'hidden') {
            config.hidden = true;
        }

        super.construct(...arguments);
    }
}

// Register this widget type with its Factory
TextField.initClass();
