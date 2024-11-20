import Override from '../../mixin/Override.js';
import DomHelper from '../../helper/DomHelper.js';
import Rectangle from '../../helper/util/Rectangle.js';

// https://github.com/bryntum/support/issues/7681
// Applying override made by a client
class RectangleOverride {
    static get target() {
        return {
            class: Rectangle,
        };
    }

    alignTo(spec) {
        const { source, constrainTo } = spec;

        let boundingRect;

        // In regard of condition: constrainTo?.lastDomConfig?.className.toString().includes('b-float-root')
        // The original alignment was incorrect when the 'alignTo' function was used
        // with a constraint rectangle that was neither 'window' nor 'document'.
        // 'lastDomConfig' was used to detect and address this issue.
        // This solves 'Offset applied to a dropdown when next to bottom browser screen border' problem
        if (
            constrainTo === window ||
            constrainTo === document ||
            constrainTo?.lastDomConfig?.className.toString().includes('b-float-root')
        ) {
            const
                rootEl    = DomHelper.getRootElement(source.element),
                floatRoot = rootEl.querySelector('.b-float-root');

            if (floatRoot) {
                boundingRect = Rectangle.from(floatRoot);

                // Constrain to the float root element instead of window/body
                // as the viewport may be clipped by the slds-modal_container.
                //
                // Fixes 'Widgets slides off the screen if close enough to a modal border' problem.
                spec.constrainTo = floatRoot;
            }
        }

        const result = this._overridden.alignTo.call(this, spec);

        if (boundingRect) {
            const { x } = boundingRect;

            // Compensate for the position shift caused by slds-modal__container's CSS transform: translate(0, 0);
            // Fixes 'Offset applied to any floating widget used' problem.
            result.translate(-x, 0);
        }

        return result;
    }
}

Override.apply(RectangleOverride);
