import Base from '../../Base.js';

/**
 * @module Core/widget/mixin/Minifiable
 */

/**
 * Mixin for widgets that can present in a full and minified form. This behavior is used in
 * {@link Core.widget.Toolbar#config-overflow} handling.
 *
 * @mixin
 * @internal
 */
export default Target => class Minifiable extends (Target || Base) {

    static $name = 'Minifiable';

    static configurable = {
        /**
         * Set to `false` to prevent this widget from assuming its {@link #config-minified} form automatically (for
         * example, due to {@link Core.widget.Toolbar#config-overflow} handling.
         *
         * When this value is `true` (the default), the minifiable widget's {@link #config-minified} config may be
         * set to `true` to reduce toolbar overflow.
         *
         * @config {Boolean}
         * @default
         */
        minifiable : true,

        /**
         * Set to `true` to present this widget in its minimal form.
         * @config {Boolean}
         * @default false
         */
        minified : null
    };

    compose() {
        const { minified } = this;

        return {
            class : {
                'b-minified' : minified
            }
        };
    }

    get widgetClass() {}
};
