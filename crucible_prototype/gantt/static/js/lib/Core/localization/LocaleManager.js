import Base from '../Base.js';
import AjaxHelper from '../helper/AjaxHelper.js';
import Events from '../mixin/Events.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import LocaleHelper from '../localization/LocaleHelper.js';
import VersionHelper from '../helper/VersionHelper.js';

/**
 * @module Core/localization/LocaleManager
 */

// Documented at the export below, to work for singleton
class LocaleManager extends Events(Base) {

    static get defaultConfig() {
        return {
            // Enable strict locale checking by default for tests
            throwOnMissingLocale : VersionHelper.isTestEnv
        };
    }

    construct(...args) {
        const me = this;

        super.construct(...args);

        if (BrowserHelper.isBrowserEnv) {
            // Try get locale name from script's `default-locale` tag
            const scriptTag = document.querySelector('script[data-default-locale]');

            if (scriptTag) {
                me.applyLocale(scriptTag.dataset.defaultLocale);
            }
            else if (me.locale?.localeName) {
                me.applyLocale(me.locale.localeName);
            }
        }
    }

    /**
     * Get/set currently registered locales.
     * Alias for {@link Core.localization.LocaleHelper#property-locales-static LocaleHelper.locales}.
     * @readonly
     * @member {Locales} locales
     */
    get locales() {
        return LocaleHelper.locales;
    }

    set locales(locales) {
        LocaleHelper.locales = locales;
    }

    /**
     * Get/set currently used locale.
     * Setter calls {@link #function-applyLocale}.
     * @member {Locales} locale
     * @accepts {String|Locale}
     */
    set locale(nameOrConfig) {
        this.applyLocale(nameOrConfig);
    }

    get locale() {
        return LocaleHelper.locale;
    }

    /**
     * Publishes a locale to make it available for applying.
     * @deprecated Since 5.3.0. Use {@link Core.localization.LocaleHelper#function-publishLocale-static LocaleHelper.publishLocale} instead.
     *
     * @param {String|Locale} nameOrConfig String name of locale (for example `En` or `SvSE`) or locale object.
     * @param {Locale} [config] Locale object. Not used if object is passed as first method parameter
     * @returns {Locale} published locale object is passed as first method parameter
     * @function registerLocale
     */
    registerLocale(nameOrConfig, config) {
        VersionHelper.deprecate('Core', '6.0.0', 'LocaleManager.registerLocale deprecated, use LocaleHelper.publishLocale instead');
        LocaleHelper.publishLocale(nameOrConfig, config);
    }

    /**
     * Extends locale specified by name to add additional translations and applies it.
     * @deprecated Since 5.3.0. Use {@link #function-applyLocale} instead.
     *
     * @param {String} name Name of locale (for example `En` or `SvSE`).
     * @param {Locale} config Locale object
     * @returns {Locale|Promise} locale object or Promise which resolves with locale object after it was loaded
     * @function extendLocale
     */
    extendLocale(name, config) {
        VersionHelper.deprecate('Core', '6.0.0', 'LocaleManager.extendLocale deprecated, use LocaleManager.applyLocale instead');
        const locale = LocaleHelper.publishLocale(name, config);
        return this.applyLocale(locale, true);
    }

    /**
     * Applies a locale by string name or publishes new locale configuration with
     * {@link Core.localization.LocaleHelper#function-publishLocale-static} and applies it.
     * If locale is specified by string name, like 'En', it must be published before applying it.
     *
     * @param {String|Locale} nameOrConfig String name of locale (for example `En` or `SvSE`) or locale object
     * @param {Locale|Boolean} [config] Locale object. Pass `true` to reapply locale which is passed as first method parameter.
     * @returns {Locale|Promise} locale object or Promise which resolves with locale object after it was loaded
     * @fires locale
     * @async
     * @function applyLocale
     */
    applyLocale(nameOrConfig, config, ignoreError = false) {
        const me = this;
        let localeConfig;

        if (typeof nameOrConfig === 'string') {
            if (typeof config !== 'object') {
                localeConfig = me.locales[nameOrConfig];
                if (!localeConfig) {
                    if (ignoreError) {
                        return true;
                    }
                    throw new Error(`Locale "${nameOrConfig}" is not published. Publish with LocaleHelper.publishLocale() before applying.`);
                }
            }
            else {
                localeConfig = LocaleHelper.publishLocale(nameOrConfig, config);
            }
        }
        else {
            localeConfig = LocaleHelper.publishLocale(nameOrConfig);
        }

        if (me.locale.localeName && me.locale.localeName === localeConfig.localeName && config !== true) {
            // no need to apply same locale again
            return me.locale;
        }

        // Set current locale name
        LocaleHelper.localeName = localeConfig.localeName;

        const triggerLocaleEvent = () => {
            /**
             * Fires when a locale is applied
             * @event locale
             * @param {Core.localization.LocaleManager} source The Locale manager instance.
             * @typings source -> {typeof LocaleManager}
             * @param {Locale} locale Locale configuration
             */
            me.trigger('locale', localeConfig);
        };

        if (localeConfig.localePath) {
            return new Promise((resolve, reject) => {
                me.loadLocale(localeConfig.localePath).then(response => {
                    response.text().then(text => {
                        const parseLocale = new Function(text);
                        parseLocale();

                        if (BrowserHelper.isBrowserEnv) {
                            localeConfig = me.locales[localeConfig.localeName];
                            // Avoid loading next time
                            if (localeConfig) {
                                delete localeConfig.localePath;
                            }
                        }

                        triggerLocaleEvent();
                        resolve(localeConfig);
                    });
                }).catch(response => reject(response));
            });
        }

        triggerLocaleEvent();
        return localeConfig;
    }

    /**
     * Loads a locale using AjaxHelper {@link Core.helper.AjaxHelper#function-get-static} request.
     * @private
     * @param {String} path Path to locale file
     * @async
     */
    loadLocale(path) {
        return AjaxHelper.get(path);
    }

    /**
     * Specifies if {@link Core.localization.Localizable#function-L-static Localizable.L()} function would throw error if no localization found at runtime.
     *
     * @member {Boolean} throwOnMissingLocale
     * @default false
     */
    set throwOnMissingLocale(value) {
        this._throwOnMissingLocale = value;
    }

    get throwOnMissingLocale() {
        return this._throwOnMissingLocale;
    }

}

const LocaleManagerSingleton = new LocaleManager();

/**
 * Singleton that handles switching locale.
 * Locales can be included on page with `<script>` tags or loaded using ajax.
 * When using script tags the first locale loaded is used per default, if another should be used as
 * default specify it on any `<script>` tag with `data-default-locale="En"`.
 *
 * Example for Grid (to use for other products replace grid with product name):
 *
 * index.html:
 *
 * ```html
 * // Using Ecma 6 modules and source
 * <script type="module" src="lib/Core/localization/SvSE.js">
 *
 * // Specify default locale when using bundled locales
 * <script data-default-locale="En" src="build/locales/grid.locale.En.js">
 * <script src="build/locales/grid.locale.SvSE.js">
 * ```
 *
 * app.js:
 *
 * ```javascript
 * // Import using sources
 * import LocaleManager from 'lib/Core/localization/LocaleManager.js';
 * // Or using module bundle
 * import { LocaleManager } from 'build/grid.module.js';
 *
 * // Set locale using method
 * LocaleManager.applyLocale('SvSE');
 *
 * // Or set locale using string property
 * LocaleManager.locale = 'SvSE';
 *
 * // Or set locale using locale object property
 * LocaleManager.locale = LocaleManager.locales.SvSE;
 * ```
 *
 * @demo Grid/localization
 * @class
 * @singleton
 */
export default LocaleManagerSingleton;
