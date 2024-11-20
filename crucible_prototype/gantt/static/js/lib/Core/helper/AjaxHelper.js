/**
 * @module Core/helper/AjaxHelper
 */

import Objects from './util/Objects.js';

/**
 * Options for the requests. Please see
 * [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) for details
 *
 * To set default values for the options please use {@link #property-DEFAULT_FETCH_OPTIONS-static} property:
 *
 * ```javascript
 * // enable passing parameters in request body by default
 * AjaxHelper.DEFAULT_FETCH_OPTIONS = { addQueryParamsToBody : true };
 * ```
 *
 * @typedef {Object} FetchOptions
 * @property {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} [method] The request method, e.g., `GET`, `POST`
 * @property {Object} [queryParams] A key-value pair Object containing the params to add to the query string
 * @property {Object} [headers] Any headers you want to add to your request, contained within a `Headers` object or an
 * object literal with ByteString values
 * @property {Object} [body] Any body that you want to add to your request: this can be a `Blob`, `BufferSource`,
 * `FormData`, `URLSearchParams`, or `USVString` object. Note that a request using the `GET` or `HEAD` method cannot have a body.
 * @property {Boolean} [addQueryParamsToBody=false] Indicates whether `queryParams` should be passed in the request
 * body. Adding them to the body applies for `application/x-www-form-urlencoded` and `multipart/form-data`
 * content types only, so make sure to pass corresponding `Content-Type` header to `headers`.
 *
 * When the argument is `true` and:
 * - if `application/x-www-form-urlencoded` content-type header is passed
 *   the method will make a `URLSearchParams` instance with `queryParams` and set it as the request body.
 *   And if `body` already has a `URLSearchParams` instance provided the parameters will be set there.
 * - if `multipart/form-data` content-type header is passed
 *   the method will make a `FormData` instance with `queryParams` and set it as the request body.
 *   And if `body` already has a `FormData` instance provided the parameters will be set there.
 *
 * Otherwise, `queryParams` are added to the query string.
 * @property {'cors'|'no-cors'|'same-origin'} [mode] The mode you want to use for the request, e.g., `'cors'`, `'no-cors'`, or `'same-origin'`.
 * @property {'omit'|'same-origin'|'include'} [credentials] The request credentials you want to use for the request: `'omit'`, `'same-origin'`, or
 * `'include'`. To automatically send cookies for the current domain, this option must be provided
 * @property {Boolean} [parseJson] Specify `true` to parses the response and attach the resulting object to the
 * `Response` object as `parsedJson`
 */

const
    paramValueRegExp = /^(\w+)=(.*)$/,
    parseParams      = function(paramString) {
        const
            result = {},
            params = paramString.split('&');

        // loop through each 'filter={"field":"name","operator":"=","value":"Sweden","caseSensitive":true}' string
        // So we cannot use .split('=')
        for (const nameValuePair of params) {
            const
                [match, name, value] = paramValueRegExp.exec(nameValuePair),
                decodedName          = decodeURIComponent(name),
                decodedValue         = decodeURIComponent(value);

            if (match) {
                let paramValue = result[decodedName];

                if (paramValue) {
                    if (!Array.isArray(paramValue)) {
                        paramValue = result[decodedName] = [paramValue];
                    }
                    paramValue.push(decodedValue);
                }
                else {
                    result[decodedName] = decodedValue;
                }
            }
        }
        return result;
    };

/**
 * Simplifies Ajax requests. Uses fetch & promises.
 *
 * ```javascript
 * AjaxHelper.get('some-url').then(response => {
 *     // process request response here
 * });
 * ```
 *
 * Uploading file to server via FormData interface.
 * Please visit [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) for details.
 *
 * ```javascript
 * const formData = new FormData();
 * formData.append('file', 'fileNameToUpload');
 * AjaxHelper.post('file-upload-url', formData).then(response => {
 *     // process request response here
 * });
 * ```
 *
 */
export default class AjaxHelper {

    /**
     * Sets default options for {@link #function-fetch-static AjaxHelper#fetch()} calls. Please see
     * {@link #typedef-FetchOptions} and
     * [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) for details.
     *
     * ```javascript
     * // default content-type for all requests will be "application/json"
     * AjaxHelper.DEFAULT_FETCH_OPTIONS = {
     *     headers : {
     *         'content-type' : 'application/json'
     *     }
     * };
     * ```
     * @member {FetchOptions} DEFAULT_FETCH_OPTIONS
     * @static
     */
    static DEFAULT_FETCH_OPTIONS = {};

    /**
     * Make a request (using GET) to the specified url.
     * @param {String} url URL to `GET` from
     * @param {FetchOptions} [options] The options for the `fetch` API
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     * @async
     */
    static get(url, options) {
        return this.fetch(url, options);
    }

    /**
     * POST data to the specified URL.
     * @param {String} url URL to `POST` to
     * @param {String|Object|FormData} payload The data to post. If an object is supplied, it will be stringified
     * @param {FetchOptions} [options] The options for the `fetch` API
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     * @async
     */
    static post(url, payload, options = {}) {
        if (!(payload instanceof FormData) && !(typeof payload === 'string')) {
            payload = JSON.stringify(payload);

            options.headers = options.headers || {};

            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        }

        return this.fetch(url, Object.assign({
            method : 'POST',
            body   : payload
        }, options));
    }

    /**
     * Fetch the specified resource using the `fetch` API.
     * @param {String} url URL to fetch from
     * @param {FetchOptions} [options] The options for the `fetch` API
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     * @async
     */
    static fetch(url, options) {
        let controller;

        // inherit global options
        options = Objects.merge({}, AjaxHelper.DEFAULT_FETCH_OPTIONS, options);

        // AbortController is not supported by LockerService
        // https://github.com/bryntum/support/issues/3689
        if (typeof AbortController !== 'undefined') {
            controller = options.abortController = new AbortController();
            options.signal = controller.signal;
        }

        if (!('credentials' in options)) {
            options.credentials = 'include';
        }

        if (options.queryParams) {
            const params = Object.entries(options.queryParams);
            if (params.length) {
                let paramsAdded = false;

                // for some content types we are going to add parameters to body (if that's not disabled)
                if (options.headers && options.addQueryParamsToBody === true) {
                    const contentType = new Headers(options.headers).get('Content-Type');

                    let bodyClass;

                    switch (contentType) {
                        case 'application/x-www-form-urlencoded':
                            bodyClass = URLSearchParams;
                            break;

                        case 'multipart/form-data':
                            bodyClass = FormData;
                            break;
                    }

                    // if that's one of supported content types
                    if (bodyClass) {
                        const body = options.body || (options.body = new bodyClass());

                        // put parameters to body if it's of supported type
                        if (body instanceof bodyClass) {
                            params.forEach(([key, value]) => body.set(key, value));
                            // remember parameters are already added
                            paramsAdded = true;
                        }
                    }
                }

                // if parameters are not added yet append them to the query string
                if (!paramsAdded) {
                    url += (url.includes('?') ? '&' : '?') + params.map(([param, value]) =>
                        `${param}=${encodeURIComponent(value)}`
                    ).join('&');
                }
            }
        }



        // Promise that will be resolved either when network request is finished or when json is parsed
        const promise = new Promise((resolve, reject) => {
            fetch(url, options).then(
                response => {
                    if (options.parseJson) {
                        response.json().then(json => {
                            response.parsedJson = json;
                            resolve(response);
                        }).catch(error => {
                            response.parsedJson = null;
                            response.error = error;
                            reject(response);
                        });
                    }
                    else {
                        resolve(response);
                    }
                }
            ).catch(error => {
                error.stack = promise.stack;

                reject(error);
            });
        });

        promise.stack = new Error().stack;

        promise.abort = function() {
            controller?.abort();
        };

        return promise;
    }

    /**
     * Registers the passed URL to return the passed mocked up Fetch Response object to the
     * AjaxHelper's promise resolve function.
     * @param {String} url The url to return mock data for
     * @param {Object|Function} response A mocked up Fetch Response object which must contain
     * at least a `responseText` property, or a function to which the `url` and a `params` object
     * and the `Fetch` `options` object is passed which returns that.
     * @param {String} response.responseText The data to return.
     * @param {Boolean} [response.synchronous] resolve the Promise immediately
     * @param {Number} [response.delay=100] resolve the Promise after this number of milliseconds.
     */
    static mockUrl(url, response) {
        const me = this;

        (me.mockAjaxMap || (me.mockAjaxMap = {}))[url] = response;

        // Inject the override into the AjaxHelper instance
        if (!AjaxHelper.originalFetch) {
            AjaxHelper.originalFetch = AjaxHelper.fetch;
            AjaxHelper.fetch = me.mockAjaxFetch.bind(me);
        }
    }

    static async mockAjaxFetch(url, options) {
        const urlAndParams = url.split('?');

        let result     = this.mockAjaxMap[urlAndParams[0]],
            parsedJson = null;

        if (result) {
            if (typeof result === 'function') {
                result = await result(urlAndParams[0], urlAndParams[1] && parseParams(urlAndParams[1]), options);
            }
            try {
                parsedJson = options?.parseJson && JSON.parse(result.responseText);
            }
            catch (error) {
                parsedJson   = null;
                result.error = error;
            }

            result = Object.assign({
                status     : 200,
                ok         : true,
                headers    : new Headers(),
                statusText : 'OK',
                url,
                parsedJson,
                text       : () => new Promise((resolve) => {
                    resolve(result.responseText);
                }),
                json : () => new Promise((resolve) => {
                    resolve(parsedJson);
                })
            }, result);

            return new Promise(function(resolve, reject) {
                if (result.synchronous) {
                    resolve(result);
                }
                else {
                    setTimeout(function() {
                        resolve(result);
                    }, ('delay' in result ? result.delay : 100));
                }
            });
        }
        else {
            return AjaxHelper.originalFetch(url, options);
        }
    }
}
