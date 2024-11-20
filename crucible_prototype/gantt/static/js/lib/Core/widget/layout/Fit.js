import Layout from './Layout.js';

/**
 * @module Core/widget/layout/Fit
 */

/**
 * A helper class for containers which must manage a single child widget which must fit the container's
 * {@link Core.widget.Widget#property-contentElement}.
 *
 * @extends Core/widget/layout/Layout
 * @layout
 * @classtype fit
 */
export default class Fit extends Layout {

    static $name = 'Fit';

    static type = 'fit';

    static configurable = {
        containerCls : 'b-fit-container',

        itemCls : 'b-fit-item'
    };
}

// Layouts must register themselves so that the static layout instantiation
// in Layout knows what to do with layout type names
Fit.initClass();
