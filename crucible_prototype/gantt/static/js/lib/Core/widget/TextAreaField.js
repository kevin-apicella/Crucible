import Field from './Field.js';

/**
 * @module Core/widget/TextAreaField
 */

/**
 * TextAreaField widget for multiline text input. Wraps a native &lt;textarea&gt; HTML element.
 *
 * ```javascript
 * const textAreaField = new TextAreaField({
 *   placeholder: 'Enter some text'
 * });
 *```
 *
 * {@inlineexample Core/widget/TextAreaField.js}
 *
 * @extends Core/widget/Field
 * @classtype textareafield
 * @classtypealias textarea
 * @inputfield
 */
export default class TextAreaField extends Field {

    static $name = 'TextAreaField';

    static type = 'textareafield';

    static alias = 'textarea';

    static get configurable() {
        return {
            /**
             * The resize style to apply to the `<textarea>` element.
             * @config {'none'|'both'|'horizontal'|'vertical'}
             * @default
             */
            resize : 'none',

            inputAttributes : {
                tag : 'textarea'
            }
        };
    }

    updateResize(resize) {
        this.input.style.resize = resize;
    }
}

// Register this widget type with its Factory
TextAreaField.initClass();
