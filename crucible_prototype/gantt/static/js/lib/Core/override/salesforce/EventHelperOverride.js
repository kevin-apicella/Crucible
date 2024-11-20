import EventHelper from '../../helper/EventHelper.js';
import Override from '../../mixin/Override.js';

const
    regExp      = /-/,
    PROPS_CACHE = Symbol('props'),
    skipCopyProp = {
        originalTarget: true, // Mozilla specific
        explicitOriginalTarget: true, // Mozilla specific
        rangeParent: true // LWS restricted
    };

let composedPathThrows;

const newPropertyOwner = (event) => {
    // Locker Service returns secure object, which is in fact object
    // with null prototype and not Event instance. We wrap that fake
    // event with another object to allow redefining properties, and
    // use a Proxy to access property values.
    const wrapper = Object.create(event);

    // Locker reports relatedTarget as a plain object
    // with only toString() method and no other properties
    // if the related target is an unreachable secure element.
    // To avoid exceptions further in the code, we pretend
    // that there is no related target element at all.

    const { relatedTarget } = event;

    if (relatedTarget && !relatedTarget.nodeType) {
        Object.defineProperty(wrapper, 'relatedTarget', {
            get          : () => null,
            configurable : true
        });
    }

    // Cache some of the original event's property values to make sure
    // event can properly report target, key, etc. in a delayed listener
    // https://github.com/bryntum/support/issues/5635
    const props = Object.create(null);

    for (const key in event) {
        // If at some point this code starts skipping properties which throw exceptions,
        // try wrapping following condition into try/catch block to catch missed properties
        if (skipCopyProp[key]) {
            continue;
        }
        if (typeof event[key] !== 'function') {
            props[key] = event[key];
        }
    }

    wrapper[PROPS_CACHE] = props;

    return wrapper;
};

const getPropertyOwner = (target, propertyName) => {
    // Accessing original event's properties or methods via
    // the wrapper object under Lightning Web Security will
    // throw the "Illegal invocation" error. If a property
    // has not been defined on the wrapper, this function
    // will return the original secure event object.

    if (Object.hasOwn(target, propertyName)) {
        // Redefined properties
        return target;
    }

    if (propertyName in target[PROPS_CACHE]) {
        // Cached properties
        return target[PROPS_CACHE];
    }

    // Original event
    return Object.getPrototypeOf(target);
};

const wrap = (event) => {
    if (event[PROPS_CACHE]) {
        return event;
    }

    return new Proxy(newPropertyOwner(event), {
        get : (target, propertyName) => {
            const owner = getPropertyOwner(target, propertyName);
            const value = owner[propertyName];

            if (typeof value === 'function') {
                // Wrap function calls to assign the correct scope
                return (...args) => value.call(owner, ...args);
            }

            return value;
        }
    });
};

/*
 * This override fixes fixEvent by wrapping passed event (which is not an Event instance) with another object to allow
 * overriding locked property `target`
 * @private
 */
class EventHelperOverride {
    static target = { class : EventHelper };

    static getComposedPathTarget(event) {
        let result;

        // composedPath throws in salesforce
        // https://github.com/bryntum/support/issues/4432
        // First time try to access composed path to check if it throws. If it does, do not use it anymore to ease
        // debugging pausing on caught exceptions
        if (composedPathThrows == null) {
            try {
                // try to access composedPath just in case it gets fixed at some point
                result = event.composedPath()[0];
                composedPathThrows = false;
            }
            catch {
                composedPathThrows = true;
            }
        }

        if (composedPathThrows) {
            if (event.path) {
                result = event.path[0];
            }
            else {
                result = event.target;
            }
        }
        else {
            result = event.composedPath()[0];
        }

        return result;
    }

    static fixEvent(event) {
        event = this._overridden.fixEvent.call(this, wrap(event));

        // custom element must have dash in it
        // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
        // event.path is not a public API, but it is implemented
        // https://github.com/salesforce/lwc/pull/859
        if (event.target && event.path && regExp.test(event.target.tagName)) {
            const
                targetElement  = event.path[0],
                originalTarget = event.target;

            // Can there be an event which actually originated from custom element, not its shadow dom?
            if (event.target !== targetElement) {
                Object.defineProperty(event, 'target', {
                    get          : () => targetElement,
                    configurable : true
                });

                // Save original target just in case
                Object.defineProperty(event, 'originalTarget', {
                    get          : () => originalTarget,
                    configurable : true
                });
            }
        }

        return event;
    }
}

Override.apply(EventHelperOverride);
