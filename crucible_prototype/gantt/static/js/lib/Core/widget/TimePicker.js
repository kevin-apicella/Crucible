// Needs to be a panel for focus management in Safari
import Panel from './Panel.js';
import DateHelper from '../helper/DateHelper.js';
import './ButtonGroup.js';
import './NumberField.js';

/**
 * @module Core/widget/TimePicker
 */

/**
 * A Panel which displays hour and minute number fields and AM/PM switcher buttons for 12 hour time format.
 *
 * ```javascript
 * new TimeField({
 *     label     : 'Time field',
 *     appendTo  : document.body,
 *     // Configure the time picker
 *     picker    : {
 *         items : {
 *             minute : {
 *                 step : 5
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Contained widgets
 *
 * The default widgets contained in this picker are:
 *
 * | Widget ref | Type                            | Description                             |
 * |------------|---------------------------------|-----------------------------------------|
 * | `hour`     | {@link Core.widget.NumberField} | The hour field                          |
 * | `minute`   | {@link Core.widget.NumberField} | The minute field                        |
 * | `second`   | {@link Core.widget.NumberField} | The second field                        |
 * | `amPm`     | {@link Core.widget.ButtonGroup} | ButtonGroup holding the am & pm buttons |
 * | `amButton` | {@link Core.widget.Button}      | The am button                           |
 * | `pmButton` | {@link Core.widget.Button}      | The pm button                           |
 *
 * This class is not intended for use in applications. It is used internally by the {@link Core.widget.TimeField} class.
 *
 * @extends Core/widget/Panel
 * @classtype timepicker
 * @widget
 */
export default class TimePicker extends Panel {

    //region Config

    static $name = 'TimePicker';

    static type = 'timepicker';

    static configurable = {
        floating : true,
        layout   : 'hbox',
        items    : {
            hour : {
                label                   : 'L{TimePicker.hour}',
                type                    : 'number',
                min                     : 0,
                max                     : 23,
                highlightExternalChange : false,
                format                  : '2>9',
                wrapAround              : true
            },
            minute : {
                label                   : 'L{TimePicker.minute}',
                type                    : 'number',
                min                     : 0,
                max                     : 59,
                highlightExternalChange : false,
                format                  : '2>9',
                wrapAround              : true
            },
            second : {
                hidden                  : true,
                label                   : 'L{TimePicker.second}',
                type                    : 'number',
                min                     : 0,
                max                     : 59,
                highlightExternalChange : false,
                format                  : '2>9',
                wrapAround              : true
            },
            amPm : {
                type  : 'buttongroup',
                items : {
                    amButton : {
                        type        : 'button',
                        text        : 'AM',
                        toggleGroup : 'am-pm',
                        cls         : 'b-blue',
                        onClick     : 'up.onAmPmButtonClick'
                    },
                    pmButton : {
                        type        : 'button',
                        text        : 'PM',
                        toggleGroup : 'am-pm',
                        cls         : 'b-blue',
                        onClick     : 'up.onAmPmButtonClick'
                    }
                }
            }
        },

        autoShow : false,

        trapFocus : true,

        /**
         * By default the seconds field is not displayed. If you require seconds to be visible,
         * configure this as `true`
         * @config {Boolean}
         * @default false
         */
        seconds : null,

        /**
         * Time value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}
         * @prp {Date}
         * @accepts {Date|String}
         */
        value : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        /**
         * Time format. Used to set appropriate 12/24 hour format to display.
         * See {@link Core.helper.DateHelper#function-format-static DateHelper} for formatting options.
         * @prp {String}
         */
        format : null,

        /**
         * Max value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}
         * @prp {Date}
         * @accepts {Date|String}
         */
        max : null,

        /**
         * Min value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}
         * @prp {Date}
         * @accepts {Date|String}
         */
        min : null,

        /**
         * Initial value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}. Initial value is restored on Escape click
         * @member {Date} initialValue
         * @accepts {Date|String}
         */
        initialValue : null // Not documented as config on purpose, API was that way
    };

    //endregion

    //region Init

    construct(config) {
        super.construct(config);
        this.refresh();
    }

    updateSeconds(seconds) {
        this.widgetMap.second[seconds ? 'show' : 'hide']();
    }

    //endregion

    //region Event listeners

    // Automatically called by Widget's triggerFieldChange which announces changes to all ancestors
    onFieldChange() {
        if (!this.isConfiguring && !this.isRefreshing) {
            this.value = this.pickerToTime();
        }
    }

    onAmPmButtonClick({ source }) {
        this._pm = source.ref === 'pmButton';
        if (this._value) {
            this.value = this.pickerToTime();
        }
    }

    onInternalKeyDown(keyEvent) {
        const me = this;

        switch (keyEvent.key) {
            case 'Escape':
                // Support for undefined initial time
                me.triggerTimeChange(me._initialValue);
                me.hide();
                keyEvent.preventDefault();
                return;
            case 'Enter':
                me.value = me.pickerToTime();
                me.hide();
                keyEvent.preventDefault();
                return;
        }

        super.onInternalKeyDown?.(keyEvent);
    }

    //endregion

    //region Internal functions

    pickerToTime() {
        const
            me               = this,
            pm               = me._pm,
            { hour, minute, second } = me.widgetMap;

        hour.format = me._is24Hour ? '2>9' : null;

        let hours    = hour.value,
            newValue = new Date(me.value);

        if (!me._is24Hour) {
            if (pm && hours < 12) hours = hours + 12;
            if (!pm && hours === 12) hours = 0;
        }

        newValue.setHours(hours);
        newValue.setMinutes(minute.value);
        if (me.seconds) {
            newValue.setSeconds(second.value);
        }

        if (me._min) {
            newValue = DateHelper.max(me._min, newValue);
        }
        if (me._max) {
            newValue = DateHelper.min(me._max, newValue);
        }

        return newValue;
    }

    triggerTimeChange(time) {
        /**
         * Fires when a time is changed.
         * @event timeChange
         * @param {Date} time The selected time.
         */
        this.trigger('timeChange', { time });
    }

    //endregion

    //region Getters / Setters

    updateInitialValue(initialValue) {
        this.value = initialValue;
    }

    changeValue(value) {
        if (value) {
            value = typeof value === 'string' ? DateHelper.parse(value, this.format) : value;
        }
        if (!this.isVisible) {
            this._initialValue = value;
        }
        return value ?? DateHelper.getTime(0);
    }

    updateValue(value) {
        if (this.isVisible) {
            this.triggerTimeChange(value);
        }
        this.refresh();
    }

    updateFormat(format) {
        this._is24Hour = DateHelper.is24HourFormat(format);
        this.refresh();
    }

    changeMin(min) {
        return typeof min === 'string' ? DateHelper.parse(min, this.format) : min;
    }

    changeMax(max) {
        return typeof max === 'string' ? DateHelper.parse(max, this.format) : max;
    }

    //endregion

    //region Display

    refresh() {
        const me = this;

        if (!me.isConfiguring && me.value) {
            me.isRefreshing = true;
            const
                { hour, minute, second, amButton, pmButton } = me.widgetMap,
                time                                 = me.value,
                is24                                 = me._is24Hour,
                hours                                = time.getHours(),
                pm                                   = me._pm = hours >= 12;

            me.element.classList[is24 ? 'add' : 'remove']('b-24h');

            hour.min         = is24 ? 0 : 1;
            hour.max         = is24 ? 23 : 12;
            hour.value       = is24 ? hours : (hours % 12) || 12;
            minute.value     = time.getMinutes();
            second.value     = time.getSeconds();
            amButton.pressed = !pm;
            pmButton.pressed = pm;
            amButton.hidden  = pmButton.hidden = is24;
            me.isRefreshing  = false;
        }
    }

    //endregion

}

// Register this widget type with its Factory
TimePicker.initClass();
