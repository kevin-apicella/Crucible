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

import { isLWS } from './runtime.js';
import { MapPolyfill } from './map.js';
import { SetPolyfill } from './set.js';

// Extend polyfills if running in LWS, otherwise extend built-in objects.
class XMap extends (isLWS() ? MapPolyfill : Map) {}
class XSet extends (isLWS() ? SetPolyfill : Set) {}

// Extract base classes from extensions to remove the unnecessary wrappers.
const BMap = Object.getPrototypeOf(XMap);
const BSet = Object.getPrototypeOf(XSet);

// Export pure classes (polyfills in LWS / built-ins in Locker).
export { BMap as Map };
export { BSet as Set };
