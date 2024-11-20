import Override from '../../mixin/Override.js';
import Widget from '../../widget/Widget.js';

/*
 * executeAndAwaitAnimations uses element.getAnimations which we can't count on when running in SalesForce.
 * This override simply calls the passed function and does not wait for any animations
 * @private
 */
class WidgetOverrideExecuteAndAwaitAnimations {
    static get target() {
        return {
            class : Widget
        };
    }

    async executeAndAwaitAnimations(element, fn){
        return await fn();
    }
}

Override.apply(WidgetOverrideExecuteAndAwaitAnimations);
