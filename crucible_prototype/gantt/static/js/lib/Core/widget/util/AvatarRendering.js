import Base from '../../Base.js';
import DomHelper from '../../helper/DomHelper.js';
import EventHelper from '../../helper/EventHelper.js';
import Tooltip from '../../widget/Tooltip.js';
import StringHelper from '../../helper/StringHelper.js';

/**
 * @module Core/widget/util/AvatarRendering
 */

/**
 * An object that describes properties of an avatar.
 *
 * @typedef {Object} AvatarConfig
 * @property {String} initials Resource initials
 * @property {String} color Background color for initials
 * @property {String} iconCls Icon cls
 * @property {String} imageUrl Image url
 * @property {String} defaultImageUrl Default image url, fallback if image fails to load or there is none
 * specified. Leave out to show initials instead.
 * @property {Object} [dataset] Dataset to apply to the resulting element
 * @property {String} [alt] Image description
 */

/**
 * A utility class providing rendering of avatars / resource initials.
 *
 * {@inlineexample Core/widget/AvatarRendering.js}
 *
 * @extends Core/Base
 */
export default class AvatarRendering extends Base {

    static $name = 'AvatarRendering';

    static get configurable() {
        return {
            /**
             * Element used to listen for load errors. Normally the owning widgets own element.
             * @config {HTMLElement}
             */
            element : null,

            /**
             * Prefix prepended to a supplied color to create a CSS class applied when showing initials.
             * @config {String}
             * @default
             */
            colorPrefix : 'b-sch-',

            /**
             * A tooltip config object to enable using a custom tooltip for the avatars. Listen for `beforeShow` and set
             * your html there.
             * @config {TooltipConfig}
             */
            tooltip : null,

            size : null
        };
    }

    doDestroy() {
        this.tooltip?.destroy();

        super.doDestroy();
    }

    updateElement(element) {
        // Error listener
        EventHelper.on({
            element,
            delegate : '.b-resource-image',
            error    : 'onImageErrorEvent',
            thisObj  : this,
            capture  : true
        });
    }

    changeTooltip(config) {
        return Tooltip.new({
            forElement  : this.element,
            forSelector : '.b-resource-avatar',
            cls         : 'b-resource-avatar-tooltip'
        }, config);
    }

    static get failedUrls() {
        return this._failedUrls || (this._failedUrls = new Set());
    }

    /**
     * Returns a DOM config object containing a resource avatar, icon or resource initials. Display priority in that
     * order.
     * @param {AvatarConfig|AvatarConfig[]} options A single avatar config object or an array of the same.
     * @returns {DomConfig}
     */
    getResourceAvatar(options) {
        if (Array.isArray(options)) {
            return options.map(item => this.getResourceAvatar(item));
        }

        const
            { initials, color, iconCls, imageUrl, defaultImageUrl, dataset = {}, resourceRecord, alt = StringHelper.encodeHtml(resourceRecord?.name) } = options,
            config = this.getImageConfig(initials, color, imageUrl, defaultImageUrl, dataset, alt) ||
                this.getIconConfig(iconCls, dataset, alt) ||
                this.getResourceInitialsConfig(initials, color, dataset, alt),
            { size } = this;

        Object.assign(config.style, {
            ...(size ? { height : size, width : size } : undefined)
        });

        return config;
    }

    getImageConfig(initials, color, imageUrl, defaultImageUrl, dataset, alt) {
        // Fall back to defaultImageUrl if imageUrl is known to fail
        imageUrl = AvatarRendering.failedUrls.has(imageUrl) ? defaultImageUrl : (imageUrl  || defaultImageUrl);

        if (imageUrl) {
            return {
                tag       : 'img',
                draggable : 'false',
                loading   : 'lazy',
                class     : {
                    'b-resource-avatar' : 1,
                    'b-resource-image'  : 1
                },
                style        : {},
                alt,
                'aria-label' : alt,
                elementData  : {
                    defaultImageUrl,
                    imageUrl,
                    initials,
                    color,
                    dataset
                },
                src : imageUrl,
                dataset
            };
        }
    }

    getIconConfig(iconCls, dataset, name) {
        if (iconCls) {
            return iconCls && {
                tag          : 'i',
                style        : {},
                'aria-label' : name,
                class        : {
                    'b-resource-avatar' : 1,
                    'b-resource-icon'   : 1,
                    [iconCls]           : 1
                },
                dataset
            };
        }
    }

    getResourceInitialsConfig(initials, color, dataset, name) {
        const
            // eventColor = #FF5555, apply as background-color
            namedColor = DomHelper.isNamedColor(color) && color,
            // eventColor = red, add b-sch-red cls
            hexColor   = !namedColor && color,
            { size }   = this;

        return {
            tag          : 'div',
            'aria-label' : name,
            class        : {
                'b-resource-avatar'                  : 1,
                'b-resource-initials'                : 1,
                [`${this.colorPrefix}${namedColor}`] : namedColor
            },
            style : {
                backgroundColor : hexColor || null,
                ...(size ? { height : size, width : size } : undefined)
            },
            text : initials,
            dataset
        };
    }

    onImageErrorEvent({ target }) {
        if (!target.matches('.b-resource-avatar')) {
            return;
        }

        const { defaultImageUrl, initials, color, imageUrl, dataset } = target.elementData;

        if (defaultImageUrl && !target.src.endsWith(defaultImageUrl.replace(/^[./]*/gm, ''))) {
            target.src = defaultImageUrl;
        }
        else {
            const
                { parentElement } = target,
                targetIdx        = Array.from(parentElement.childNodes).indexOf(target),
                domConfig        = this.getResourceInitialsConfig(initials, color, dataset, target.alt),
                initialsEl       = DomHelper.createElement(domConfig);

            initialsEl.elementData = target.elementData;
            // Ensure DomSync data matches what we have just rendered
            initialsEl.lastDomConfig = domConfig;
            parentElement.lastDomConfig && (parentElement.lastDomConfig.children[targetIdx] = domConfig);
            parentElement.replaceChild(initialsEl, target);
        }

        // Remember failed urls, to avoid trying to load them again next time
        AvatarRendering.failedUrls.add(imageUrl);
    }
}
