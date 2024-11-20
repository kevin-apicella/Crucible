import Field from './Field.js';
import TimeField from './TimeField.js';
import DateHelper from '../helper/DateHelper.js';
import EventHelper from '../helper/EventHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Widget from './Widget.js';
import './DateField.js';

const midnightDate = new Date(2000, 0, 1);
/**
 * @module Core/widget/DateTimeField
 */

/**
 * A field combining a {@link Core.widget.DateField} and a {@link Core.widget.TimeField}.
 *
 * {@inlineexample Core/widget/DateTimeField.js}
 *
 * @extends Core/widget/Field
 * @classtype datetimefield
 * @classtypealias datetime
 * @inputfield
 */
export default class DateTimeField extends Field {

    static $name = 'DateTimeField';

    static type = 'datetimefield';

    static alias = 'datetime';

    static configurable = {
        /**
         * Returns the TimeField instance
         * @readonly
         * @member {Core.widget.TimeField} timeField
         */
        /**
         * Configuration for the {@link Core.widget.TimeField}
         * @config {TimeFieldConfig}
         */
        timeField : {},

        /**
         * Returns the DateField instance
         * @readonly
         * @member {Core.widget.DateField} dateField
         */
        /**
         * Configuration for the {@link Core.widget.DateField}
         * @config {DateFieldConfig}
         */
        dateField : {
            // To be able to use transformDateValue for parsing without loosing time, a bit of a hack
            keepTime : true,
            step     : '1 d'
        },

        /**
         * The week start day in the {@link Core.widget.DateField#config-picker}, 0 meaning Sunday, 6 meaning Saturday.
         * Uses localized value per default.
         *
         * @config {Number}
         */
        weekStartDay : null,

        inputTemplate : () => '',

        ariaElement : 'element'
    };

    doDestroy() {
        this.dateField.destroy();
        this.timeField.destroy();

        super.doDestroy();
    }

    get focusElement() {
        return this.dateField.input;
    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        return [
            this.dateField.element,
            this.timeField.element
        ];
    }

    // Each subfield handles its own keystrokes
    internalOnKeyEvent() { }

    // CellEdit sets this dynamically on its editor field
    updateRevertOnEscape(revertOnEscape) {
        this.timeField.revertOnEscape = revertOnEscape;
        this.dateField.revertOnEscape = revertOnEscape;
    }

    // Converts the timeField config into a TimeField
    changeTimeField(config) {
        const
            me = this,
            result = TimeField.new({
                revertOnEscape : me.revertOnEscape,
                syncInvalid(...args) {
                    const updatingInvalid = me.updatingInvalid;

                    TimeField.prototype.syncInvalid.apply(this, args);
                    me.timeField && !updatingInvalid && me.syncInvalid();
                }
            }, config);

        EventHelper.on({
            element : result.element,
            keydown : 'onTimeFieldKeyDown',
            thisObj : me
        });

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to
        if (me.readOnly) {
            result.readOnly = true;
        }

        return result;
    }

    // Set up change listener when TimeField is available. Not in timeField config to enable users to supply their own
    // listeners block there
    updateTimeField(timeField) {
        const me = this;

        timeField.ion({
            change({ userAction, value }) {
                if (userAction && !me.$settingValue) {
                    const dateAndTime = me.dateField.value;
                    me._isUserAction = true;
                    me.value = dateAndTime ? DateHelper.copyTimeValues(new Date(dateAndTime), value || midnightDate) : null;
                    me._isUserAction = false;
                }
            },
            thisObj : me
        });
    }

    // Converts the dateField config into a class based on { type : "..." } provided (DateField by default)
    changeDateField(config) {
        const
            me     = this,
            type   = config?.type || 'datefield',
            cls    = Widget.resolveType(config.type || 'datefield'),
            result = Widget.create(ObjectHelper.assign({
                type,
                revertOnEscape : me.revertOnEscape,
                syncInvalid(...args) {
                    const updatingInvalid = me.updatingInvalid;

                    cls.prototype.syncInvalid.apply(this, args);
                    me.dateField && !updatingInvalid && me.syncInvalid();
                }
            }, config));

        EventHelper.on({
            element : result.element,
            keydown : 'onDateFieldKeyDown',
            thisObj : me
        });

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to
        if (me.readOnly) {
            result.readOnly = true;
        }

        result.ion(({
            keydown : ({ event }) => {
                if (event.key === 'Tab' && !event.shiftKey && this.timeField?.isVisible) {
                    event.stopPropagation();
                    event.cancelBubble = true;
                }
            }
        }));

        return result;
    }

    get childItems() {
        return [this.dateField, this.timeField];
    }

    // Set up change listener when DateField is available. Not in dateField config to enable users to supply their own
    // listeners block there
    updateDateField(dateField) {
        const me = this;

        dateField.ion({
            change({ userAction, value }) {
                if (userAction && !me.$isInternalChange) {
                    me._isUserAction = true;

                    me.timeField.value = value;
                    me.value = value;

                    me._isUserAction = false;
                }
            },
            thisObj : me
        });
    }

    updateWeekStartDay(weekStartDay) {
        if (this.dateField) {
            this.dateField.weekStartDay = weekStartDay;
        }
    }

    changeWeekStartDay(value) {
        return typeof value === 'number' ? value : (this.dateField?.weekStartDay ?? DateHelper.weekStartDay);
    }

    // Apply our value to our underlying fields
    syncInputFieldValue(skipHighlight = this.isConfiguring) {
        super.syncInputFieldValue(true);

        const
            me                       = this,
            { dateField, timeField } = me,
            highlightDate            = dateField.highlightExternalChange,
            highlightTime            = timeField.highlightExternalChange;

        if (!skipHighlight && !me.highlightExternalChange) {
            skipHighlight = true;
        }

        me.$isInternalChange = true;

        dateField.highlightExternalChange = false;

        dateField.highlightExternalChange = highlightDate;

        if (skipHighlight) {
            timeField.highlightExternalChange = dateField.highlightExternalChange = false;
        }

        timeField.value = dateField.value = me.inputValue;

        dateField.highlightExternalChange = highlightDate;
        timeField.highlightExternalChange = highlightTime;

        me.$isInternalChange = false;

        // Must evaluate after child fields have been updated since our validity state depends on theirs.
        me.syncInvalid();
    }

    onTimeFieldKeyDown(e) {
        const me = this;

        // we need to handle keydown for composed field manually and before it's done by cellEdit feature
        if (e.key === 'Enter' || e.key === 'Tab') {
            const dateAndTime = me.dateField.value;
            me._isUserAction = true;
            me.value = dateAndTime ? DateHelper.copyTimeValues(new Date(dateAndTime), me.timeField.value || midnightDate) : null;
            me._isUserAction = false;
        }
    }

    onDateFieldKeyDown(e) {
        const me = this;

        if (e.key === 'Tab' && !e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            me.timeField.focus();
        }
        // we need to handle keydown for composed field manually and before it's done by cellEdit feature
        else if (e.key === 'Enter') {
            me.value = me.dateField.value;
        }
    }

    // Make us and our underlying fields required
    updateRequired(required) {
        this.timeField.required = this.dateField.required = required;
    }

    updateReadOnly(readOnly, was) {
        super.updateReadOnly(readOnly, was);

        if (!this.isConfiguring) {
            this.timeField.readOnly = this.dateField.readOnly = readOnly;
        }
    }

    // Make us and our underlying fields disabled
    onDisabled(value) {
        this.timeField.disabled = this.dateField.disabled = value;
    }

    focus() {
        this.dateField.focus();
    }

    hasChanged(oldValue, newValue) {
        if (oldValue?.getTime && newValue?.getTime) {
            return !DateHelper.isEqual(oldValue, newValue);
        }
        return super.hasChanged(oldValue?.getTime?.(), newValue?.getTime?.());
    }

    get isValid() {
        return this.timeField.isValid && this.dateField.isValid;
    }

    setError(error, silent) {
        [this.dateField, this.timeField].forEach(f => f.setError(error, silent));
    }

    getErrors() {
        const errors = [...(this.dateField.getErrors() || []), ...(this.timeField.getErrors() || [])];

        return errors.length ? errors : null;
    }

    clearError(error, silent) {
        [this.dateField, this.timeField].forEach(f => f.clearError(error, silent));
    }

    updateInvalid() {
        // use this flag in this level to avoid looping
        this.updatingInvalid = true;
        [this.dateField, this.timeField].forEach(f => f.updateInvalid());
        this.updatingInvalid = false;
    }
}

DateTimeField.initClass();
