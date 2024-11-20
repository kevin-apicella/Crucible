import Field from './Field.js';

/**
 * @module Core/widget/PasswordField
 */

/**
 * Password field widget. Wraps native &lt;input type="password"&gt;
 *
 * ```javascript
 * let textField = new PasswordField({
 *     placeholder : 'Enter password'
 * });
 * ```
 *
 * {@inlineexample Core/widget/PasswordField.js}
 *
 * @extends Core/widget/Field
 * @classtype passwordfield
 * @classtypealias password
 * @inputfield
 */
export default class PasswordField extends Field {

    static $name = 'PasswordField';

    static type = 'passwordfield';

    static alias = 'password';

    construct(config = {}) {
        config.inputType = 'password';

        super.construct(...arguments);

        this.element.classList.add('b-textfield');
    }
}

// Register this widget type with its Factory
PasswordField.initClass();
