/**
 * @copyright 2024 Certinia Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**/
let env;

const detect = () => {
    const { Worker } = window;

    if (typeof Worker === 'function') {
        try {
            // This should throw
            Reflect.construct(Worker, ['//??']);
        } catch (e) {
            console.log(e);

            if (e instanceof DOMException) {
                // Worker constructor throws DOMException if the URL parameter cannot be parsed
                // https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker
                return {};
            }

            // Worker constructor throws an error in Lightning Web Security
            // https://developer.salesforce.com/docs/component-library/tools/lws-distortion-viewer#Worker_constructor-value
            return { isLWS: true };
        }
    }

    // Worker is not implemented in Locker Service
    // https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer
    return { isLocker: true };
};

/**
 * Detects whether code is running in Locker Service
 * @returns {Boolean} True if Locker Service is detected, false otherwise
 * @since next
 */
export const isLocker = () => {
    if (env == null) {
        env = detect();
    }

    return !!env.isLocker;
};

/**
 * Detects whether Lightning Web Security is switched on
 * @returns {Boolean} True if LWS is detected, false otherwise
 * @since next
 */
export const isLWS = () => {
    if (env == null) {
        env = detect();
    }

    return !!env.isLWS;
};
