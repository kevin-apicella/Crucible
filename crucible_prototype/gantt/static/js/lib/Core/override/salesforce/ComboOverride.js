import Combo from '../../widget/Combo.js';
import Override from '../../mixin/Override.js';

/*
 * Body element has a tabIndex of -1, which makes browser to move focus to it when scroll bar is clicked. Solution is to
 * add tab index to the picker element to keep focus inside.
 * https://github.com/bryntum/support/issues/7189
 * @private
 */
class ComboOverride {
    static get target() {
        return {
            class : Combo
        };
    }

    changePicker(picker, oldPicker) {
        const result = this._overridden.changePicker.call(this, picker, oldPicker);

        // We can be passed nullish which  means destroy the picker
        result?.element.setAttribute('tabindex', '-1');

        return result;
    }
}

Override.apply(ComboOverride);
