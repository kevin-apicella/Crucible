import Base from '../Base.js';
import VersionHelper from '../helper/VersionHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';

const { defineProperty } = Reflect;

let performance;

if (BrowserHelper.isBrowserEnv) {
    performance = globalThis.performance;
}
else {
    performance = {
        now() {
            return new Date().getTime();
        }
    };
}

/**
 * @module Core/mixin/Delayable
 */

// Global timeout collections for tests
let globalDelays = null;

if (VersionHelper.isTestEnv) {
    const bryntum = globalThis.bryntum || (globalThis.bryntum = {});

    globalDelays = bryntum.globalDelays = {
        timeouts        : new Map(),
        intervals       : new Map(),
        animationFrames : new Map(),
        idleCallbacks   : new Map(),
        isEmpty(includeIntervals = false) {
            return globalDelays.timeouts.size + globalDelays.animationFrames.size + globalDelays.idleCallbacks.size + (includeIntervals ? globalDelays.intervals.size : 0) === 0;
        },
        /**
         * Returns filtered delays array
         * @param {Object} options
         * @param {String[]} [options.ignoreTimeouts] array of delays names to ignore
         * @param {Number} [options.maxDelay] maximum delay in milliseconds. Timeouts with bigger delay will be filtered out
         * @param {Boolean} [options.includeIntervals] include intervals
         * @returns {Object[]} array of filtered delays
         * @internal
         */
        getFiltered({ ignoreTimeouts = [], maxDelay = 5000, includeIntervals = false }) {
            const
                result = [],
                scopes = ['timeouts', 'animationFrames', 'idleCallbacks'];
            if (includeIntervals) {
                scopes.push('intervals');
            }
            // Filter delays
            for (const scope of scopes) {
                const map = globalDelays[scope];
                for (const [, entry] of map.entries()) {
                    if (!ignoreTimeouts.includes(entry.name) && (!Number.isInteger(entry.delay) || entry.delay < maxDelay)) {
                        result.push(entry);
                    }
                }
            }
            return result;
        }
    };
}

const
    asapPromise    = Promise.resolve(),
    emptyArray     = Object.freeze([]),
    emptyFn        = () => {},
    emptyObject    = Object.freeze({}),
    queueMicrotask = globalThis.queueMicrotask,  // may be undefined but won't throw exception
    /**
     * Creates and returns a function that will call the user-supplied `fn`.
     *
     * @param {Core.mixin.Delayable} me
     * @param {Function} fn The user function to call when the timer fires.
     * @param {Function} wrapFn The function the user will call to start the timer.
     * @param {Object} options The invoke options.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Object} [options.thisObj] The `this` reference for `fn`.
     * @returns {Function}
     * @private
     */
    makeInvoker = (me, fn, wrapFn, options) => {
        const
            named      = typeof fn === 'string',
            appendArgs = options?.appendArgs || emptyArray,
            // The invoker fn is intended to be wired directly to native setTimeout/requestAnimationFrame/etc. and so
            // it does not receive any arguments worth passing on to the user's fn. Those come from the original call
            // to the wrapFn.
            invoker    = () => {
                wrapFn.timerId = null;
                wrapFn.lastCallTime = performance.now();

                // Grab args now and null the stored args out (to avoid leaks):
                const args = wrapFn.args;

                wrapFn.args = null;

                if (named) {
                    me[fn](...args, ...appendArgs);
                }
                else {
                    fn.call(me, ...args, ...appendArgs);
                }

                wrapFn.called = true;
                ++wrapFn.calls;
            };

        if (options) {
            me = options.thisObj || me;
        }

        // We put most everything as properties on the wrapFn so that it can all be inspected in the debugger (unlike
        // closure variables) and expected in tests.
        wrapFn.lastCallTime = -9e9;  // performance.now() = 0 at start...
        wrapFn.calls = 0;
        wrapFn.invoker = invoker;

        invoker.wrapFn = wrapFn;

        return invoker;
    },

    /**
     * Decorates the supported `wrapFn` with additional methods and an `isPending` readonly
     * property. These decorations are available to user code to help manage the scheduling
     * behavior of the buffered function.
     *
     * @param {Core.mixin.Delayable} me
     * @param {Function} wrapFn The function the user will call to start the timer.
     * @param {String} cancelFn The name of the function that will cancel a timer.
     * @returns {Function} The `wrapFn` is returned.
     * @private
     */
    decorateWrapFn = (me, wrapFn, cancelFn = 'clearTimeout') => {
        wrapFn.cancel = () => {
            if (wrapFn.isPending) {
                me[cancelFn](wrapFn.timerId);
                // avoid leaks and cleanup:
                wrapFn.args = wrapFn.timerId = null;
            }
        };

        wrapFn.flush = () => {
            if (wrapFn.isPending) {
                me[cancelFn](wrapFn.timerId);
                wrapFn.timerId = null;
                // we don't call cancel() since it also sets args=null

                wrapFn.invoker();
            }
        };

        wrapFn.now = (...args) => {
            wrapFn.cancel();
            wrapFn.args = args;
            wrapFn.invoker();
        };

        wrapFn.resume = all => {
            const n = wrapFn.suspended;

            wrapFn.suspended = (all || n < 1) ? 0 : (n - 1);
        };

        wrapFn.suspend = () => {
            ++wrapFn.suspended;
        };

        wrapFn.immediate = false;
        wrapFn.suspended = 0;
        wrapFn.timerId = null;

        defineProperty(wrapFn, 'isPending', {
            get() {
                return wrapFn.timerId !== null;
            }
        });

        return wrapFn;
    };

/**
 * Configuration options available when defining a delayable function.
 *
 * @typedef {Object} DelayableConfig
 * @property {'buffer'|'raf'|'idle'|'throttle'} type Type of delay to use. `raf` is short for `requestAnimationFrame`,
 * 'idle' for `requestIdleCallback` (not supported in Safari)
 * @property {Number} [delay] Number of milliseconds to wait before (buffer) or after (throttle) calling the underlying
 * method. A value of 0 is equivalent to setting `immediate: true`.
 * @property {Boolean} [immediate] Set to `true` to call immediately (effectively disabling the buffer/throttle)
 * @property {Boolean} [cancelOutstanding] Set to `true` to cancel any pending animation frame requests and
 * schedule a new one on each call.
 */

/**
 * Tracks setTimeout, setInterval and requestAnimationFrame calls and clears them on destroy.
 *
 * ```javascript
 * someClass.setTimeout(() => console.log('hi'), 200);
 * someClass.setInterval(() => console.log('annoy'), 100);
 * // can also use named timeouts for easier tracking
 * someClass.setTimeout(() => console.log('named'), 300, 'named');
 * someClass.clearTimeout('named');
 * ```
 *
 * @mixin
 */
export default Target => class Delayable extends (Target || Base) {
    static get $name() {
        return 'Delayable';
    }

    static get declarable() {
        return [
            /**
             * This class property returns an object that specifies methods to wrap with configurable timer behaviors.
             *
             * It is used like so:
             * ```javascript
             *  class Foo extends Base.mixin(Delayable) {
             *      static get delayable() {
             *          return {
             *              expensiveMethod : 500
             *          };
             *      }
             *
             *      expensiveMethod() {
             *          this.things();
             *          this.moreThings();
             *          this.evenMoreThings();
             *      }
             *  }
             * ```
             * With the above in place, consider:
             * ```javascript
             *  let instance = new Foo();
             *
             *  instance.expensiveMethod();
             * ```
             * Instead of the above code immediately calling the `expensiveMethod()`, it will start a timer that will
             * invoke the method 500ms later. Because `expensiveMethod()` is an instance method, each instance of `Foo`
             * will have its own timer.
             *
             * NOTE: Only instance methods are currently supported (i.e., only non-`static` methods).
             *
             * #### Options
             * The value of each key configures how the method will be scheduled. If the value is a number, it is
             * promoted to a config object of `type='buffer'` as in the following:
             * ```javascript
             *  class Foo extends Base.mixin(Delayable) {
             *      static get delayable() {
             *          return {
             *              expensiveMethod : {
             *                  type  : 'buffer',
             *                  delay : 500
             *              }
             *          };
             *      }
             *  }
             * ```
             * The `type` property of the config object must be one of three values. Other options can be provided
             * depending on the `type`:
             *
             *  - `buffer`<br>
             *    Other options:
             *     - `delay` (Number) : The number of milliseconds to wait before calling the underlying method. A
             *       value of 0 is equivalent to setting `immediate: true`.
             *     - `immediate` (Boolean) : Set to `true` to call immediately (effectively disabling the buffer).
             *  - `raf` (short for "request animation frame")<br>
             *  - `idle` (short for "request idle callback") __Not available on Safari__ <br>
             *    Other options:
             *     - `cancelOutstanding` (Boolean) : Set to `true` to cancel any pending animation frame requests and
             *       schedule a new one on each call.
             *     - `immediate` (Boolean) : Set to `true` to call immediately.
             *  - `throttle`<br>
             *    Other options:
             *     - `delay` (Number) : The number of milliseconds to wait after each execution before another
             *       execution takes place. A value of 0 is equivalent to setting `immediate: true`.
             *     - `immediate` (Boolean) : Set to `true` to call immediately (effectively disabling the throttle).
             *
             * While `immediate: true` can be specified at the class level, it is more typical to set it on the
             * instance's method as described below.
             *
             * #### Delayable Method API
             * Delayable methods have a consistent API to manage their scheduling. This API is added to the methods
             * themselves.
             *
             * For example:
             * ```javascript
             *  let instance = new Foo();
             *
             *  instance.expensiveMethod();         // schedule a call in 500ms
             *  instance.expensiveMethod.isPending; // true
             *  instance.expensiveMethod.cancel();
             *  instance.expensiveMethod.flush();
             *  instance.expensiveMethod.now();
             *
             *  instance.expensiveMethod.delay = 10;
             *  instance.expensiveMethod();         // schedule a call in 10ms
             * ```
             *
             * ##### `isPending` (Boolean, readonly)
             * This boolean property will be `true` if a call has been scheduled, and false otherwise.
             *
             * ##### `cancel()`
             * Cancels a pending call if one has been scheduled. Otherwise this method does nothing.
             *
             * ##### `flush()`
             * Cancels the timer and causes the pending call to execute immediately. If there is no pending call, this
             * method does nothing.
             *
             * ##### `now()`
             * Cancels the timer (if one is pending) and executes the method immediately. If there is no pending call,
             * this method will still call the underlying method.
             *
             * @static
             * @member {Object<String,'raf'|Number|DelayableConfig>} delayable
             * @internal
             */
            'delayable'
        ];
    }

    doDestroy() {
        // Normally one would expect this call at the end of this method... but in this case we need to run cleanup
        // of this stuff after config nullification since those can trigger delayable method calls.
        super.doDestroy();

        this.clearDelayables();
    }

    clearDelayables() {
        const
            me = this,
            [idleCallbackIds, animationFrameIds, intervalIds, timeoutMap, timeoutIds, microtasksPending] = [
                me.idleCallbackIds, me.animationFrameIds, me.intervalIds, me.timeoutMap, me.timeoutIds, me.microtasksPending];

        me.idleCallbackIds = me.animationFrameIds = me.intervalIds = me.timeoutMap = me.timeoutIds =
            me.microtasksPending = null;

        timeoutIds?.forEach((fn, id) => {
            if (typeof fn === 'function') {
                fn();
            }

            clearTimeout(id);
            globalDelays?.timeouts.delete(id);
        });

        timeoutMap?.forEach((name, id) => clearTimeout(id));

        intervalIds?.forEach(id => {
            clearInterval(id);
            globalDelays?.intervals.delete(id);
        });

        animationFrameIds?.forEach(id => {
            cancelAnimationFrame(id);
            globalDelays?.animationFrames.delete(id);
        });

        idleCallbackIds?.forEach(id => {
            cancelIdleCallback(id);
            globalDelays?.idleCallbacks.delete(id);
        });

        microtasksPending?.forEach(taskDef => taskDef.cancel());
    }

    /**
     * Check if a named timeout is active
     * @param name
     * @internal
     */
    hasTimeout(name) {
        return Boolean(this.timeoutMap?.has(name));
    }

    /**
     * Returns a function that when called will schedule a call to `fn` via {@link #function-queueMicrotask}.
     *
     * @param {Function|String} fn The function to call. If this is a string, it is looked up as a method on `this`
     * instance (or `options.thisObj` instead, if provided).
     * @param {Boolean|Object} [options] An options object.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Object} [options.thisObj] The `this` reference for the function.
     * @returns {Function}
     * @internal
     */
    asap(fn, options) {
        // NOTE: This method is only intended for use with `delayable`. It has a signature that is compatible
        // with `buffer()` and `throttle()`. The name is 'asap' to make the following aesthetically pleasing:
        //
        //  class Foo extends Delayable() {
        //      static delayable = {
        //          bar : 'asap'
        //      };
        //  }

        const
            me = this,
            asapWrapFn = (...params) => {
                if (!asapWrapFn.suspended) {
                    asapWrapFn.called = false;
                    asapWrapFn.args = params;

                    if (asapWrapFn.immediate) {
                        invoker();
                    }
                    else if (!asapWrapFn.isPending) {
                        asapWrapFn.timerId = me.queueMicrotask(invoker);
                    }
                }
            },

            invoker = makeInvoker(me, fn, asapWrapFn, options);

        return decorateWrapFn(me, asapWrapFn, 'cancelMicrotask');
    }

    /**
     * Equivalent to the native [`queueMicrotask`](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask), but
     * will be cancelled automatically on `destroy`. When `queueMicrotask` is not available, the provided `fn` is
     * called using `Promise.resolve().then(fn)`, which behaves similarly.
     *
     * Returns a function that when called will cancel the impending call. This function can also be viewed as a timer
     * id that can be passed to {@link #function-cancelMicrotask}
     *
     * @param {Function|String} fn The function to call, or name of function in this object to call.
     * @param {Array} [args] The arguments to pass.
     * @param {Object} [options] An object containing the details about that function, and the time delay.
     * @param {Array} [options.args] The arguments to pass if
     * @param {Boolean} [options.runOnDestroy] Pass `true` if this function should be executed if the Delayable instance
     * is destroyed while function is scheduled.
     * @param {Boolean} [options.cancelOutstanding] Pass `true` to cancel any outstanding invocation of the passed function.
     * @returns {Function}
     * @internal
     */
    queueMicrotask(fn, args, options) {
        let key, taskDef;

        if (!options && args && !Array.isArray(args)) {
            options = args;
            args = null;
        }

        options = options || emptyObject;
        args    = args || options.args || emptyArray;

        const
            me      = this,
            string  = typeof fn === 'string',
            name    = string ? fn : fn.name,
            pending = me.microtasksPending || (me.microtasksPending = new Map()),
            cancel  = () => pending.delete(key),
            wrapFn  = () => {
                if (taskDef === pending.get(key)) {
                    pending.delete(key);

                    if (string) {
                        !me.isDestroyed && me[fn](...args);
                    }
                    else {
                        fn.apply(me, args);
                    }
                }
            };

        if (me.isDestroying && !options.runOnDestroy) {
            return emptyFn;
        }

        key     = options.cancelOutstanding ? name || fn : cancel;
        taskDef = { key, name, fn, args, options, cancel, wrapFn };

        cancel.taskDef = taskDef;

        queueMicrotask ? queueMicrotask(wrapFn) : asapPromise.then(wrapFn);

        pending.set(key, taskDef);

        return cancel;
    }

    /**
     * Given the return value from a call to {@link #function-queueMicrotask}, cancels the pending call. This method is
     * provided for symmetry with other timer functions, such as {@link #function-setTimeout}.
     *
     * @param {Function} task The value returned by `queueMicrotask`.
     * @internal
     */
    cancelMicrotask(task) {
        task?.();
    }

    /**
     * Same as native setTimeout, but will be cleared automatically on destroy. If a propertyName is supplied it will
     * be used to store the timeout id.
     * @param {Object} timeoutSpec An object containing the details about that function, and the time delay.
     * @param {Function|String} timeoutSpec.fn The function to call, or name of function in this object to call. Used as the `name` parameter if a string.
     * @param {Number} timeoutSpec.delay The milliseconds to delay the call by.
     * @param {Object[]} timeoutSpec.args The arguments to pass.
     * @param {String} [timeoutSpec.name] The name under which to register the timer. Defaults to `fn.name`.
     * @param {Boolean} [timeoutSpec.runOnDestroy] Pass `true` if this function should be executed if the Delayable instance is destroyed while function is scheduled.
     * @param {Boolean} [timeoutSpec.cancelOutstanding] Pass `true` to cancel any outstanding invocation of the passed function.
     * @returns {Number}
     * @internal
     */
    setTimeout({ fn, delay, name, runOnDestroy, cancelOutstanding, args }) {
        if (arguments.length > 1 || typeof arguments[0] === 'function') {
            [fn, delay, name, runOnDestroy, cancelOutstanding] = arguments;
        }
        if (typeof fn === 'string') {
            name = fn;
        }
        else if (!name) {
            name = fn.name || fn;
        }

        if (cancelOutstanding) {
            this.clearTimeout(name);
        }

        const
            me         = this,
            timeoutIds = me.timeoutIds || (me.timeoutIds = new Map()),
            timeoutMap = me.timeoutMap || (me.timeoutMap = new Map()),
            timeoutId  = setTimeout(() => {
                if (typeof fn === 'string') {
                    fn = me[name];
                }

                // Cleanup before invocation in case fn throws
                timeoutIds?.delete(timeoutId);
                timeoutMap?.delete(name);
                globalDelays?.timeouts.delete(timeoutId);

                fn.apply(me, args);

            }, delay);

        timeoutIds.set(timeoutId, runOnDestroy ? fn : true);

        // Commented out code is helpful when debugging timeouts in tests
        globalDelays?.timeouts.set(timeoutId, { fn, delay, name/*, stack : new Error().stack*/ });

        if (name) {
            timeoutMap.set(name, timeoutId);
        }

        return timeoutId;
    }

    /**
     * clearTimeout wrapper, either call with timeout id as normal clearTimeout or with timeout name (if you specified
     * a name to setTimeout())
     * property to null.
     * @param {Number|String} idOrName timeout id or name
     * @internal
     */
    clearTimeout(idOrName) {
        let id = idOrName;

        if (typeof id === 'string') {
            if (this.timeoutMap) {
                id = this.timeoutMap.get(idOrName);
                this.timeoutMap.delete(idOrName);
            }
            else {
                return;
            }
        }

        clearTimeout(id);

        this.timeoutIds?.delete(id);
        globalDelays?.timeouts.delete(id);
    }

    /**
     * clearInterval wrapper
     * @param {Number} id
     * @internal
     */
    clearInterval(id) {
        clearInterval(id);

        this.intervalIds?.delete(id);

        globalDelays?.intervals.delete(id);
    }

    /**
     * Same as native setInterval, but will be cleared automatically on destroy
     * @param {Function} fn callback method
     * @param {Number} delay delay in milliseconds
     * @param {String} name delay name for debugging
     * @returns {Number}
     * @internal
     */
    setInterval(fn, delay, name) {
        const intervalId = setInterval(fn, delay);

        (this.intervalIds || (this.intervalIds = new Set())).add(intervalId);

        globalDelays?.intervals.set(intervalId, { fn, delay, name });

        return intervalId;
    }

    /**
     * Relays to native requestAnimationFrame and adds to tracking to have call automatically canceled on destroy.
     * @param {Function} fn
     * @param {Object[]} [extraArgs] The argument list to append to those passed to the function.
     * @param {Object} [thisObj] `this` reference for the function.
     * @returns {Number}
     * @internal
     */
    requestAnimationFrame(fn, extraArgs = [], thisObj = this) {
        const
            animationFrameIds = this.animationFrameIds || (this.animationFrameIds = new Set()),
            frameId           = requestAnimationFrame(() => {
                globalDelays?.animationFrames.delete(frameId);
                // [dongriffin 2022-01-19] It was observed that we can still be called even though we issued the
                // cancelAnimationFrame call. Since delete() returns true if our frameId was present and is now
                // removed, we can tell that we haven't been cancelled before we call our fn:
                animationFrameIds.delete(frameId) && fn.apply(thisObj, extraArgs);
            });

        animationFrameIds.add(frameId);

        globalDelays?.animationFrames.set(frameId, { fn, extraArgs, thisObj });

        return frameId;
    }

    /**
     * Relays to native requestIdleCallback and adds to tracking to have call automatically canceled on destroy.
     * @param {Function} fn
     * @param {Object[]} [extraArgs] The argument list to append to those passed to the function.
     * @param {Object} [thisObj] `this` reference for the function.
     * @returns {Number}
     * @internal
     */
    requestIdleCallback(fn, extraArgs = [], thisObj = this) {
        const
            idleCallbackIds = this.idleCallbackIds || (this.idleCallbackIds = new Set()),
            frameId           = requestIdleCallback(() => {
                globalDelays?.idleCallbacks.delete(frameId);
                // Since delete() returns true if our frameId was present and is now
                // removed, we can tell that we haven't been cancelled before we call our fn:
                idleCallbackIds.delete(frameId) && fn.apply(thisObj, extraArgs);
            });

        idleCallbackIds.add(frameId);

        globalDelays?.idleCallbacks.set(frameId, { fn, extraArgs, thisObj });

        return frameId;
    }

    /**
     * Creates a function which will execute once, on the next animation frame. However many time it is
     * called in one event run, it will only be scheduled to run once.
     * @param {Function|String} fn The function to call, or name of function in this object to call.
     * @param {Object[]} [args] The argument list to append to those passed to the function.
     * @param {Object} [thisObj] `this` reference for the function.
     * @param {Boolean} [cancelOutstanding] Cancel any outstanding queued invocation upon call.
     * @internal
     */
    createOnFrame(fn, args = [], thisObj = this, cancelOutstanding) {
        let rafId;

        const result = (...callArgs) => {
            // Cancel if outstanding if requested
            if (rafId != null && cancelOutstanding) {
                this.cancelAnimationFrame(rafId);
                rafId = null;
            }
            if (rafId == null) {
                rafId = this.requestAnimationFrame(() => {
                    if (typeof fn === 'string') {
                        fn = thisObj[fn];
                    }
                    rafId = null;
                    callArgs.push(...args);
                    fn.apply(thisObj, callArgs);
                });
            }
        };

        result.cancel = () => this.cancelAnimationFrame(rafId);

        return result;
    }

    /**
     * Relays to native cancelAnimationFrame and removes from tracking.
     * @param {Number} handle
     * @internal
     */
    cancelAnimationFrame(handle) {
        cancelAnimationFrame(handle);

        this.animationFrameIds?.delete(handle);

        globalDelays?.animationFrames.delete(handle);
    }

    /**
     * Relays to native cancelIdleCallback and removes from tracking.
     * @param {Number} handle
     * @internal
     */
    cancelIdleCallback(handle) {
        cancelIdleCallback(handle);

        this.idleCallbackIds?.delete(handle);

        globalDelays?.idleCallbacks.delete(handle);
    }

    async nextAnimationFrame() {
        return new Promise(resolve => this.requestAnimationFrame(resolve));
    }

    /**
     * Wraps a function with another function that delays it specified amount of time, repeated calls to the wrapper
     * resets delay.
     * @param {Function|String} fn The function to call. If this is a string, it is looked up as a method on `this`
     * instance (or `options.thisObj` instead, if provided).
     * @param {Object|Number} options The delay in milliseconds or an options object.
     * @param {Number} options.delay The delay in milliseconds.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Object} [options.thisObj] The `this` reference for the function.
     * @returns {Function} Wrapped function to call.
     * @internal
     */
    buffer(fn, options) {
        let delay = options;

        if (options && typeof options !== 'number') {  // if (config object)
            delay = options.delay;
        }
        else {
            options = null;
        }

        const
            bufferWrapFn = (...params) => {
                if (bufferWrapFn.suspended) {
                    return;
                }

                const { delay } = bufferWrapFn;

                bufferWrapFn.cancel();
                bufferWrapFn.called = false;
                bufferWrapFn.args = params;

                // If delay=0, the buffer has been disabled so always call immediately.
                if (bufferWrapFn.immediate || !delay) {
                    invoker();
                }
                else {
                    bufferWrapFn.timerId = this.setTimeout(invoker, delay);
                }
            },

            invoker = makeInvoker(this, fn, bufferWrapFn, options);

        bufferWrapFn.delay = delay;

        return decorateWrapFn(this, bufferWrapFn);
    }

    /**
     * Returns a function that when called will schedule a call to `fn` on the next animation frame.
     *
     * @param {Function|String} fn The function to call. If this is a string, it is looked up as a method on `this`
     * instance (or `options.thisObj` instead, if provided).
     * @param {Boolean|Object} [options] An options object or the `cancelOutstanding` boolean property of it.
     * @param {Boolean} [options.cancelOutstanding] Pass `true` to cancel any pending animation frame requests and
     * schedule a new one on each call to the returned function.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Object} [options.thisObj] The `this` reference for the function.
     * @returns {Function}
     * @internal
     */
    raf(fn, options) {
        // NOTE: This method is only intended for use with `delayable`. It has a signature that is compatible
        // with `buffer()` and `throttle()`. The name is 'raf' to make the following aesthetically pleasing:
        //
        //  class Foo extends Delayable() {
        //      static get delayable() {
        //          return {
        //              bar : 'raf'
        //          };
        //      }
        //  }

        let cancelOutstanding = options;

        if (options && typeof options !== 'boolean') {  // if (config object)
            cancelOutstanding = options.cancelOutstanding;
        }
        else {
            options = null;
        }

        const
            rafWrapFn = (...params) => {
                if (rafWrapFn.suspended) {
                    return;
                }

                // Reschedule the frame on each call if requested
                if (rafWrapFn.cancelOutstanding) {
                    rafWrapFn.cancel();
                }

                rafWrapFn.called = false;
                rafWrapFn.args = params;

                if (rafWrapFn.immediate) {
                    invoker();
                }
                else if (!rafWrapFn.isPending) {
                    rafWrapFn.timerId = this.requestAnimationFrame(invoker);
                }
            },

            invoker = makeInvoker(this, fn, rafWrapFn, options);

        rafWrapFn.cancelOutstanding = cancelOutstanding;

        return decorateWrapFn(this, rafWrapFn, 'cancelAnimationFrame');
    }

    idle(fn, options) {
        let cancelOutstanding = options;

        if (options && typeof options !== 'boolean') {  // if (config object)
            cancelOutstanding = options.cancelOutstanding;
        }
        else {
            options = null;
        }

        const
            idleWrapFn = (...params) => {
                if (idleWrapFn.suspended) {
                    return;
                }

                // Reschedule the frame on each call if requested
                if (idleWrapFn.cancelOutstanding) {
                    idleWrapFn.cancel();
                }

                idleWrapFn.called = false;
                idleWrapFn.args = params;

                if (idleWrapFn.immediate) {
                    invoker();
                }
                else if (!idleWrapFn.isPending) {
                    idleWrapFn.timerId = this.requestIdleCallback(invoker);
                }
            },

            invoker = makeInvoker(this, fn, idleWrapFn, options);

        idleWrapFn.cancelOutstanding = cancelOutstanding;

        // If the timer is still there in 100ms, then invoke it.
        this.setTimeout(() => this.idleCallbackIds.delete(idleWrapFn.timerId) && idleWrapFn.now(), 100);

        return decorateWrapFn(this, idleWrapFn, 'cancelIdleCallback');
    }

    /**
     * Create a "debounced" function which will call on the "leading edge" of a timer period.
     * When first invoked will call immediately, but invocations after that inside its buffer
     * period will be rejected, and *one* invocation will be made after the buffer period has expired.
     *
     * This is useful for responding immediately to a first mousemove, but from then on, only
     * calling the action function on a regular timer while the mouse continues to move.
     *
     * @param {Function|String} fn The function to call. If this is a string, it is looked up as a method on `this`
     * instance (or `options.thisObj` instead, if provided).
     * @param {Number|Object} options The milliseconds to wait after each execution before another execution takes place
     * or a object containing options.
     * @param {Object} [options.thisObj] `this` reference for the function.
     * @param {Array} [options.appendArgs] The argument list to append to those passed to the function.
     * @param {Function|String} [options.throttled] A function to call when the invocation is delayed due to buffer
     * time not having expired. If this is a string, it is looked up as a method on `this` instance (or `options.thisObj`
     * instead, if provided). When called, the same arguments are passed as would have been passed to `fn`, including
     * any `options.appendArgs`.
     * @internal
     */
    throttle(fn, options) {
        let delay = options,
            throttled;

        if (options && typeof options !== 'number') {  // if (config object)
            delay = options.delay;
            throttled = options.throttled;
        }
        else {
            options = null;
        }

        const
            me = this,

            throttleWrapFn = (...args) => {
                if (throttleWrapFn.suspended) {
                    return;
                }

                const
                    { delay } = throttleWrapFn,
                    elapsed = performance.now() - throttleWrapFn.lastCallTime;

                throttleWrapFn.args = args;

                // If it's been more then the delay period since we invoked, we can call it now.
                // Setting delay=0 effectively disables the throttle (which is the goal)
                if (throttleWrapFn.immediate || elapsed >= delay) {
                    me.clearTimeout(throttleWrapFn.timerId);
                    invoker();
                }
                else {
                    // Kick off a timer for the requested period.
                    if (!throttleWrapFn.isPending) {
                        throttleWrapFn.timerId = me.setTimeout(invoker, delay - elapsed);
                        throttleWrapFn.called = false;
                    }

                    if (throttled) {
                        // Args have to be stored on the wrapFn for the invoker to pick them up:
                        throttled.wrapFn.args = args;
                        throttled();
                    }
                }
            },

            invoker = makeInvoker(me, fn, throttleWrapFn, options);

        throttleWrapFn.delay = delay;

        if (throttled) {
            // Make an invoker for this callback to handle thisObj and typeof=string etc (pass a dud wrapFn):
            throttled = makeInvoker(me, throttled, () => {}, options);
        }

        return decorateWrapFn(me, throttleWrapFn);
    }

    static setupDelayable(cls) {
        cls.setupDelayableMethods(cls.delayable);
    }

    /**
     * This method initializes the `delayable` methods on this class.
     * @param {Object} delayable The `delayable` property.
     * @param {Function} [cls] This parameter will be used internally to process static methods.
     * @private
     */
    static setupDelayableMethods(delayable, cls = null) {
        const
            me = this,
            statics = delayable.static,
            target = cls || me.prototype;

        if (statics) {



            delete delayable.static;
        }

        for (const name in delayable) {
            let options = delayable[name];
            const
                implName = name + 'Now',
                type = typeof options;

            if (!target[implName]) {
                // Only move foo() -> fooNow() if a base class hasn't done so already
                target[implName] = target[name];
            }

            if (type === 'number') {
                options = {
                    type  : 'buffer',
                    delay : options
                };
            }
            else if (type === 'string') {
                options = {
                    type : options
                };
            }



            // For instance methods, we place a getter on the prototype. When the method is first accessed from the
            // prototype, we create an instance-specific version by calling this.buffer()/throttle() (based on the type
            // desired) and set that as the instance-level property.
            defineProperty(target, name, {
                get() {
                    const value = this[options.type]((...params) => {
                        this[implName](...params);
                    }, options);

                    defineProperty(this, name, { value });

                    return value;
                }
            });
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
