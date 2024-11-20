/**
 * Fixes exception thrown by DomHelper.isInView method which does not expect secure elements and modified APIs
 * https://github.com/bryntum/support/issues/4127
 * @private
 */
import DomHelper from '../../helper/DomHelper.js';
import Rectangle from '../../helper/util/Rectangle.js';
import Override from '../../mixin/Override.js';

const
    scrollStyles = {
        auto   : 1,
        scroll : 1
    },
    getParent = node => {
        // Accept a node or an event. "parent" will be parent node or target.
        const result = node.ownerSVGElement ? node.ownerSVGElement.parentNode : (node.parentNode || node.target);

        // If we reached a shadow root, return the host
        return result?.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? result.host : result;
    },
    isScrollable = (style) => {
        return scrollStyles[style?.overflowX] || scrollStyles[style?.overflowY];
    },
    getComputedStyle = (node) => {
        return node?.ownerDocument?.defaultView?.getComputedStyle(node);
    },
    { body } = document;

class DomHelperOverrideIsInView {
    static target = { class : DomHelper };

    static getVisibleViewport(startElement, docRect, targetEl) {
        const viewports = [];

        let result = docRect;

        for (let viewport = startElement; viewport && viewport !== body; viewport = getParent(viewport)) {
            const style = getComputedStyle(viewport);

            if (isScrollable(style) && style?.display !== 'contents') {
                viewports.unshift(Rectangle.client(viewport, null, true, true, targetEl));
            }
        }

        for (let i = 0, { length } = viewports; result && i < length; i++) {
            result = result.intersect(viewports[i]);
        }

        return result;
    }
}

Override.apply(DomHelperOverrideIsInView);
