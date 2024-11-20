import Base from '../../Base.js';
import BrowserHelper from '../../helper/BrowserHelper.js';

/**
 * @module Core/widget/mixin/RTL
 */

/**
 * Mixin for RTL operation
 *
 * @mixin
 * @private
 */
export default Target => class RTL extends (Target || Base) {

    static $name = 'RTL';

    get widgetClass() {}

    static configurable = {
        /**
         * If a widget is rendered into an element which has computed style `direction:rtl`, this property will be
         * set to `true`
         *
         * Rendering a widget into an element which, either by a CSS rule, or by its inline `style` has an
         * explicit direction will cause the widget to use that direction regardless of the owning document's
         * direction.
         *
         * In this way, an RTL widget may operate normally inside an LTR page and vice versa.
         *
         * If you are using Bryntum widgets in a different direction to that of the owning document, you
         * must use the following CSS rule to have Popups such as tooltips and event editors use
         * the desired direction instead of the direction of the document:
         *
         * ```CSS
         * .b-float-root {
         *     direction : xxx; // Floatings widgets to differ from the document
         * }
         * ```
         * @member {Boolean} rtl
         * @readonly
         * @private
         */
        /**
         * This may be configured as `true` to make the widget's element use the `direction:rtl` style.
         * @config {Boolean}
         * @default false
         * @private
         */
        rtl : null
    };

    // Replace generated is-property, to reduce risk of confusion
    get isRTL() {
        return this.rtl;
    }

    updateRtl(rtl) {
        const { element } = this;

        if (element) {
            element.classList.toggle('b-rtl', rtl === true);
            element.classList.toggle('b-ltr', rtl === false);
        }
    }

    startConfigure(config) {
        super.startConfigure?.(arguments);

        // If we are not configured with an rtl setting, acquire our rtl setting from our owner,
        // or our encapsulating (renderTo or adopt etc) element.
        // Floating widgets will do this at render time.
        if (!config.floating && config.rtl == null) {
            const
                me    = this,
                el    = config.rootElement || config.forElement || me.parent?.contentElement || (me.floating ? me.floatRoot : me.changeElementRef(me.getRenderContext(config)[0] || config.adopt));

            if (el) {
                config.rtl = el.nodeType === 1 && getComputedStyle(el).getPropertyValue('direction') === 'rtl';
            }
            else {
                const owner = config.owner || config.parent;

                if (owner) {
                    config.rtl = owner[owner.isConfiguring ? 'peekConfig' : 'getConfig']('rtl');
                }
                else {
                    config.rtl = getComputedStyle(document.body).getPropertyValue('direction') === 'rtl';
                }
            }

            // Ensure it is read in the ingestion phase.
            if (config.rtl) {
                me.configDone.rtl = false;
            }
        }
    }

    // Render is only called on outer widgets, children read their setting from their owner unless explicitly set
    render(...args) {
        super.render?.(...args);


        if (
            (BrowserHelper.isChrome && BrowserHelper.chromeVersion < 87) ||
            (BrowserHelper.isFirefox && BrowserHelper.firefoxVersion < 66) ||
            (BrowserHelper.isSafari && BrowserHelper.safariVersion < 14.1)
        ) {
            this.element.classList.add('b-legacy-inset');
        }
        // Detect if rtl (catches both attribute `dir="rtl"` and CSS `direction: rtl`, as well as if owner uses rtl)
        if (getComputedStyle(this.element).direction === 'rtl' || this.owner?.rtl) {
            this.rtl = true;
            this.childItems?.forEach(i => i.rtl = true);
        }
    }
};
