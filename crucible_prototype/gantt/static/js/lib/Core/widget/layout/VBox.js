import Box from './Box.js';

/**
 * @module Core/widget/layout/VBox
 */

/**
 * A {@link Core.widget.layout.Box} layout that defaults to `horizontal : false`.
 *
 * The following:
 *
 * ```javascript
 *  layout : {
 *      type : 'vbox'
 *  }
 * ```
 *
 * Is equivalent to:
 *
 * ```javascript
 *  layout : {
 *      type       : 'box',
 *      horizontal : false
 *  }
 * ```
 *
 * @extends Core/widget/layout/Box
 * @layout
 * @classtype vbox
 */
export default class VBox extends Box {

    static $name = 'VBox';

    static type = 'vbox';

    static configurable = {
        horizontal : false
    };
}

// Layouts must register themselves so that the static layout instantiation
// in Layout knows what to do with layout type names
VBox.initClass();
