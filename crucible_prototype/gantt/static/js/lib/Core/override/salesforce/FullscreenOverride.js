import Fullscreen from '../../helper/util/Fullscreen.js';

// https://github.com/bryntum/support/issues/6640
// Widget started to check fullscreen element on destroy, LWC does not support fullscreen
Object.defineProperty(Fullscreen, 'element', {
    get() {
        return null;
    }
});
