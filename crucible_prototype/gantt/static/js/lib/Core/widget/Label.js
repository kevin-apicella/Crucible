import Widget from './Widget.js';

/**
 * @module Core/widget/Label
 */

/**
 * The `Label` widget wraps an `<label>Text</label>` element.
 *
 * {@inlineexample Core/widget/Label.js vertical}
 *
 * @extends Core/widget/Widget
 * @classtype label
 * @widget
 */
export default class Label extends Widget {

    static $name = 'Label';

    static type = 'label';

    static configurable = {

        /**
         * Get/set label text
         * @prp {String}
         */
        text : null,

        localizableProperties : ['text']
    };

    compose() {
        const { text, html } = this;

        return {
            tag : 'label',
            text,
            html
        };
    }

}

Label.initClass();
