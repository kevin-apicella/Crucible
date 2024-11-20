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
let windowSpy;

beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
});

afterEach(() => {
    windowSpy.mockRestore();
    jest.resetModules();
});

describe('isLocker()', () => {
    it('should return true if Worker is not defined on window', async () => {
        // GIVEN
        windowSpy.mockImplementation(() => ({
            Worker: undefined,
        }));

        // WHEN
        const { isLocker } = await import('../runtime.js');
        const result = isLocker();

        // THEN
        expect(result).toBeTruthy();
    });

    it('should return false if Worker is defined on window', async () => {
        // GIVEN
        class FakeWorker {
            constructor() {
                throw new Error('Error');
            }
        }

        windowSpy.mockImplementation(() => ({
            Worker: FakeWorker,
        }));

        // WHEN
        const { isLocker } = await import('../runtime.js');
        const result = isLocker();

        // THEN
        expect(result).toBeFalsy();
    });
});

describe('isLWS()', () => {
    it('should return true if Worker constructor throws an error', async () => {
        // GIVEN
        class FakeWorker {
            constructor() {
                throw new Error('Error');
            }
        }

        windowSpy.mockImplementation(() => ({
            Worker: FakeWorker,
        }));

        // WHEN
        const { isLWS } = await import('../runtime.js');
        const result = isLWS();

        // THEN
        expect(result).toBeTruthy();
    });

    it('should return false if Worker constructor throws a DOMException', async () => {
        // GIVEN
        class FakeWorker {
            constructor() {
                throw new DOMException('Error');
            }
        }

        windowSpy.mockImplementation(() => ({
            Worker: FakeWorker,
        }));

        // WHEN
        const { isLWS } = await import('../runtime.js');
        const result = isLWS();

        // THEN
        expect(result).toBeFalsy();
    });
});
