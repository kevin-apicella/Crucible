import CalendarPanel from './CalendarPanel.js';
import YearPicker from './YearPicker.js';
import DateHelper from '../helper/DateHelper.js';
import EventHelper from '../helper/EventHelper.js';
import Combo from './Combo.js';
import DomHelper from '../helper/DomHelper.js';
import './DisplayField.js';

const
    generateMonthNames = () => DateHelper.getMonthNames().map((m, i) => [i, m]),
    dateSort           = (lhs, rhs) => lhs.valueOf() - rhs.valueOf(),
    emptyArray         = Object.freeze([]);

class ReadOnlyCombo extends Combo {
    static get $name() {
        return 'ReadOnlyCombo';
    }

    static get type() {
        return 'readonlycombo';
    }

    static get configurable() {
        return {
            editable        : false,
            inputAttributes : {
                tag      : 'div',
                tabIndex : -1
            },
            inputValueAttr          : 'innerHTML',
            highlightExternalChange : false,
            monitorResize           : false,
            triggers                : {
                expand : false
            },
            picker : {
                align : {
                    align     : 't-b',
                    axisLock  : true,
                    matchSize : false
                },
                cls        : 'b-readonly-combo-list',
                scrollable : {
                    overflowX : false
                }
            }
        };
    }
}

ReadOnlyCombo.initClass();

/**
 * @module Core/widget/DatePicker
 */

/**
 * A Panel which can display a month of date cells, which navigates between the cells, fires events upon user selection
 * actions, optionally navigates to other months in response to UI gestures, and optionally displays information about
 * each date cell.
 *
 * A date is selected (meaning a single value is selected if {@link #config-multiSelect} is not set, or
 * added to the {@link #property-selection} if {@link #config-multiSelect if set}) by clicking a cell
 * or by pressing `ENTER` when focused on a cell.
 *
 * The `SHIFT` and `CTRL` keys modify selection behaviour depending on the value of {@link #config-multiSelect}.
 *
 * This class is used as a {@link Core.widget.DateField#config-picker} by the {@link Core.widget.DateField} class.
 *
 * {@inlineexample Core/widget/DatePicker.js}
 *
 * ## Custom cell rendering
 * You can easily control the content of each date cell using the {@link #config-cellRenderer}. The example below shows
 * a view typically seen when booking hotel rooms or apartments.
 *
 * {@inlineexample Core/widget/DatePickerCellRenderer.js}
 *
 * ## Multi selection
 * You can select multiple date ranges or a single date range using the {@link #config-multiSelect} config.
 *
 * {@inlineexample Core/widget/DatePickerMulti.js}
 *
 * ## Configuring toolbar buttons
 *
 * The datepicker includes a few useful navigation buttons by default. Through the DatePicker´s {@link #config-tbar toolbar},
 * you can manipulate these, via the toolbar´s {@link Core/widget/Toolbar#config-items} config.
 *
 * There are four buttons by default, each of which can be reconfigured using
 * an object, or disabled by configuring them as `null`.
 *
 * ```javascript
 * new DatePicker({
 *    tbar : {
 *       // Remove all navigation buttons
 *       items : {
 *           prevYear  : null,
 *           prevMonth : null,
 *           nextYear  : null,
 *           nextMonth : null
 *       }
 *    }
 * })
 * ```
 *
 * Provided toolbar widgets include:
 *
 * - `prevMonth` Navigates to previous month
 * - `nextMonth` Navigates to next month
 * - `prevYear` Navigates to previous year
 * - `nextYear` Navigates to next year
 *
 * @extends Core/widget/CalendarPanel
 * @classtype datepicker
 * @widget
 */
export default class DatePicker extends CalendarPanel {

    static $name = 'DatePicker';

    static type = 'datepicker';

    static get delayable() {
        return {
            refresh : 'raf'
        };
    }

    static get configurable() {
        return {
            /**
             * The date that the user has navigated to using the UI *prior* to setting the widget's
             * value by selecting. The initial default is today's date.
             *
             * This may be changed using keyboard navigation. The {@link Core.widget.CalendarPanel#property-date} is set
             * by pressing `ENTER` when the desired date is reached.
             *
             * Programmatically setting the {@link Core.widget.CalendarPanel#config-date}, or using the UI to select the date
             * by clicking it also sets the `activeDate`
             * @config {Date}
             */
            activeDate : {
                value   : new Date(),
                $config : {
                    equal : 'date'
                }
            },

            focusable   : true,
            textContent : false,
            tbar        : {
                overflow : null,
                items    : {
                    prevYear : {
                        cls      : 'b-icon b-icon-first',
                        onAction : 'up.gotoPrevYear',
                        tooltip  : 'L{DatePicker.gotoPrevYear}'
                    },
                    prevMonth : {
                        cls      : 'b-icon b-icon-previous',
                        onAction : 'up.gotoPrevMonth',
                        tooltip  : 'L{DatePicker.gotoPrevMonth}'
                    },
                    fields : {
                        type  : 'container',
                        cls   : 'b-datepicker-title',
                        items : {
                            monthField : {
                                type              : 'readonlycombo',
                                cls               : 'b-datepicker-monthfield',
                                items             : generateMonthNames(),
                                internalListeners : {
                                    select : 'up.onMonthPicked'
                                }
                            },
                            yearButton : {
                                type              : 'button',
                                cls               : 'b-datepicker-yearbutton',
                                internalListeners : {
                                    click : 'up.onYearPickerRequested'
                                }
                            }
                        }
                    },
                    nextMonth : {
                        cls      : 'b-icon b-icon-next',
                        onAction : 'up.gotoNextMonth',
                        tooltip  : 'L{DatePicker.gotoNextMonth}'
                    },
                    nextYear : {
                        cls      : 'b-icon b-icon-last',
                        onAction : 'up.gotoNextYear',
                        tooltip  : 'L{DatePicker.gotoNextYear}'
                    }
                }
            },

            yearPicker : {
                value : {
                    type              : 'YearPicker',
                    yearButtonCount   : 16,
                    trapFocus         : true,
                    positioned        : true,
                    hidden            : true,
                    internalListeners : {
                        titleClick : 'up.onYearPickerTitleClick',
                        select     : 'up.onYearPicked'
                    }
                },
                $config : 'lazy'
            },

            /**
             * The initially selected date.
             * @config {Date}
             */
            date : null,

            /**
             * The minimum selectable date. Selection of and navigation to dates prior
             * to this date will not be possible.
             * @config {Date}
             */
            minDate : {
                value   : null,
                $config : {
                    equal : 'date'
                }
            },

            /**
             * The maximum selectable date. Selection of and navigation to dates after
             * this date will not be possible.
             * @config {Date}
             */
            maxDate : {
                value   : null,
                $config : {
                    equal : 'date'
                }
            },

            /**
             * By default, disabled dates cannot be navigated to, and they are skipped over
             * during keyboard navigation. Configure this as `true` to enable navigation to
             * disabled dates.
             * @config {Boolean}
             * @default
             */
            focusDisabledDates : null,

            /**
             * Configure as `true` to enable selecting multiple discontiguous date ranges using
             * click and Shift+click to create ranges and Ctrl+click to select/deselect individual dates.
             *
             * Configure as `'range'` to enable selecting a single date range by selecting a
             * start and end date. Hold "SHIFT" button to select date range. Ctrl+click may add
             * or remove dates to/from either end of the range.
             * @config {Boolean|'range'}
             * @default
             */
            multiSelect : false,

            /**
             * If {@link #config-multiSelect} is configured as `true`, this is an array of dates
             * which are selected. There may be multiple, discontiguous date ranges.
             *
             * If {@link #config-multiSelect} is configured as `'range'`, this is a two element array
             * specifying the first and last selected dates in a range.
             * @config {Date[]}
             */
            selection : {
                $config : {
                    equal : (v1, v2) => v1 && v1.equals(v2)
                },
                value : null
            },

            /**
             * By default, the month and year are editable. Configure this as `false` to prevent that.
             * @config {Boolean}
             * @default
             */
            editMonth : true,

            /**
             * The {@link Core.helper.DateHelper} format string to format the day names.
             * @config {String}
             * @default
             */
            dayNameFormat : 'dd',

            trapFocus : true,

            role : 'grid',

            focusDescendant : true,

            /**
             * By default, when the {@link #property-date} changes, the UI will only refresh
             * if it doesn't contain a cell for that date, so as to keep a stable UI when
             * navigating.
             *
             * Configure this as `true` to refresh the UI whenever the month changes, even if
             * the UI already shows that date.
             * @config {Boolean}
             * @internal
             */
            alwaysRefreshOnMonthChange : null,

            /**
             * Configure as `true` to add a highlighted border and background to the week row which
             * encapsulates the selected date.
             * @prp {Boolean}
             * @default false
             */
            highlightSelectedWeek : null
        };
    }

    static get prototypeProperties() {
        return {
            /**
             * The class name to add to the calendar cell whose date which is outside of the
             * {@link #config-minDate}/{@link #config-maxDate} range.
             * @config {String}
             * @private
             */
            outOfRangeCls : 'b-out-of-range',

            /**
             * The class name to add to the currently focused calendar cell.
             * @config {String}
             * @private
             */
            activeCls : 'b-active-date',

            /**
             * The class name to add to selected calendar cells.
             * @config {String}
             * @private
             */
            selectedCls : 'b-selected-date'
        };
    }

    // region Init

    construct(config) {
        const me = this;

        super.construct(config);

        me.externalCellRenderer = me.cellRenderer;
        me.cellRenderer         = me.internalCellRenderer;

        me.element.setAttribute('aria-activedescendant', `${me.id}-active-day`);
        me.weeksElement.setAttribute('role', 'grid');
        me.weekElements.forEach(w => w.setAttribute('role', 'row'));
        me.element.setAttribute('ariaLabelledBy', me.widgetMap.fields.id);

        EventHelper.on({
            element : me.weeksElement,
            click   : {
                handler  : 'onCellClick',
                delegate : `.${me.dayCellCls}:not(.${me.disabledCls}):not(.${me.outOfRangeCls})`
            },
            mousedown : {
                handler  : 'onCellMousedown',
                delegate : `.${me.dayCellCls}`
            },
            thisObj : me
        });

        me.widgetMap.monthField.readOnly = me.widgetMap.yearButton.disabled = !me.editMonth;

        // Ensure the DatePicker is immediately ready for use.
        me.refresh.flush();
    }

    afterHide() {
        this._yearPicker?.hide();
        super.afterHide(...arguments);
    }

    doDestroy() {
        this.yearButton?.destroy();
        this.monthField?.destroy();
        super.doDestroy();
    }

    // endregion

    get focusElement() {
        return this.weeksElement.querySelector(`.${this.dayCellCls}[tabIndex="0"]`);
    }

    doRefresh() {
        const
            me             = this,
            { date }       = me,
            oldActiveCell  = me.focusElement,
            // Coerce the active date to be in the visible range.
            // Do not use the setter, the sync is done below
            activeDate     = DateHelper.betweenLesser(me.activeDate, me.month.startDate, me.month.endDate) ? me.activeDate : (me._activeDate = date);

        // toolbar widgets must have been instantiated.
        me.getConfig('tbar');

        super.doRefresh(...arguments);

        me.widgetMap.monthField.value = date.getMonth();
        me.widgetMap.yearButton.text  = date.getFullYear();

        // The focused cell will have been repurposed for a new date
        const dateOfOldActiveCell = DateHelper.parseKey(oldActiveCell?.dataset.date);

        // The position of the cell may have changed, so the "from" cell must
        // be identified by the date that is stamped into it *after* the refresh..
        if (activeDate - dateOfOldActiveCell) {
            me.syncActiveDate(activeDate, dateOfOldActiveCell);
        }
    }

    internalCellRenderer({ cell, date }) {
        const
            me            = this,
            {
                activeCls,
                selectedCls,
                externalCellRenderer
            }             = me,
            isSelected    = me.isSelectedDate(date),
            cellClassList = {
                [activeCls]        : activeCls && me.isActiveDate(date),
                [selectedCls]      : isSelected,
                [me.outOfRangeCls] : (me.minDate && date < me.minDate) || (me.maxDate && date > me.maxDate)
            };

        if (isSelected) {
            // Fix up start/inner/end range classes
            if (me.multiSelect) {
                const
                    isStart = !me.isSelectedDate(DateHelper.add(date, -1, 'd')),
                    isEnd   = !me.isSelectedDate(DateHelper.add(date, 1, 'd'));

                cellClassList['b-range-start'] = isStart;
                cellClassList['b-range-end'] = isEnd;
                cellClassList['b-in-range'] = !isStart && !isEnd;
            }
        }

        DomHelper.updateClassList(cell, cellClassList);

        // Must replace entire content in case we have an externalCellRenderer
        cell.innerHTML = `<div class="b-datepicker-cell-inner">${date.getDate()}</div>`;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', DateHelper.format(date, 'MMMM D, YYYY'));

        if (me.isActiveDate(date)) {
            cell.id = `${me.id}-active-day`;
        }
        else {
            cell.removeAttribute('id');
        }

        if (externalCellRenderer) {
            arguments[0].cell = cell.firstChild;
            me.callback(externalCellRenderer, this, arguments);
        }
    }

    onCellMousedown(event) {
        const cell = event.target.closest('[data-date]');

        cell.focus();
        if (DomHelper.getActiveElement(cell) === cell) {
            // Only preventDefault if we succeeded in ingesting focus.
            event.preventDefault();
        }

        this.activeDate = DateHelper.parseKey(cell.dataset.date);
    }

    onCellClick(event) {
        const cell = event.target.closest('[data-date]');
        this.onUIDateSelect(DateHelper.parseKey(cell.dataset.date), event);
    }

    /**
     * Called when the user uses the UI to select the current activeDate. So ENTER when focused
     * or clicking a date cell.
     * @param {Date} date The active date to select
     * @param {Event} event the instigating event, either a `click` event or a `keydown` event.
     * @internal
     */
    onUIDateSelect(date, event) {
        const
            me = this,
            {
                lastClickedDate,
                multiSelect
            }  = me;

        me.lastClickedDate = date;

        if (!me.isDisabledDate(date)) {
            me.activatingEvent = event;

            // Handle multi selecting.
            // * single contiguous date range, eg: an event start and end
            // * multiple discontiguous ranges
            if (multiSelect) {
                me.handleMultiSelect(lastClickedDate, date, event);
            }
            else {
                me.selection = me.month.date = date;
                if (me.floating) {
                    me.hide();
                }
            }

            me.activatingEvent = null;
        }
    }

    // Calls updateSelection if the selection is mutated
    handleMultiSelect(lastClickedDate, date, event) {
        const
            me          = this,
            {
                multiSelect
            }           = me,
            _selection  = me._selection || (me._selection = new DateSet()),
            selection   = _selection.dates,
            singleRange = multiSelect === 'range',
            {
                size,
                generation
            }           = _selection,
            rangeEnds   = size && {
                [DateHelper.makeKey(DateHelper.add(selection[0], -1, 'd'))]                   : 1,
                [DateHelper.makeKey(selection[0])]                                            : 1,
                [DateHelper.makeKey(selection[selection.length - 1])]                         : 1,
                [DateHelper.makeKey(DateHelper.add(selection[selection.length - 1], 1, 'd'))] : 1
            },
            isSelected  = _selection.has(date),
            toggleFn    = isSelected ? 'delete' : 'add';

        // If we're allowed to create one range and they clicked on a togglable date of a range
        const clickedRangeEnd = singleRange && rangeEnds?.[DateHelper.makeKey(date)];

        // Ctrl+click means toggle the date, leaving remaining selection unchanged
        if (event.ctrlKey) {
            // Allow individual date toggling if we are allowing multi ranges
            // or there's no current selection, or they are on, or adjacent to the range end
            if (multiSelect === true || !size || clickedRangeEnd) {
                _selection[toggleFn](date);

                // Check that the start hasn't been deselected
                if (singleRange && !_selection.has(me.rangeStartDate)) {
                    me.rangeStartDate.setDate(me.rangeStartDate.getDate() + (date < selection[1] ? 1 : -1));
                }
            }
        }
        // Shift+click means add a range
        else if (event.shiftKey && size) {
            const [start, end] = [
                new Date(singleRange ? (me.rangeStartDate || (me.rangeStartDate = selection[0])) : lastClickedDate),
                date
            ].sort(dateSort);

            // If we can only have one range
            if (singleRange) {
                _selection.clear();
            }

            // Add all dates in the range
            for (const d = start; d <= end; d.setDate(d.getDate() + 1)) {
                _selection.add(d);
            }
        }
        // Make the clicked date the only selected date.
        // Avoid a no-op which would still cause a generation change
        else if (!(_selection.has(date) && _selection.size === 1)) {
            _selection.clear();
            _selection.add(date);
        }

        const newSize = _selection.size;

        // Keep track of the range start date. The first selected date is the start and the end then
        // can move to either side of that.
        if (newSize === 1) {
            me.rangeStartDate = date;
        }
        else if (!newSize) {
            me.rangeStartDate = null;
        }

        // Process selection change if we changed the selection.
        if (_selection.generation !== generation) {
            me.updateSelection(_selection);
        }
    }

    changeSelection(selection) {
        // We always need a _selection property to be a DateSet.
        // Falsy selection value means empty DateSet.
        const me = this;

        let result, rangeStartDate;

        if (selection) {
            // Convert single Date into Array
            if (!selection.forEach) {
                selection = [selection];
            }

            // Clamp selection into range. May duplicate, but the Set will dedupe.
            selection.forEach((d, i) => selection[i] = me.changeDate(d));

            // Cache the first date, regardless of sort order for use as the "clicked date"
            // around which the range revolves when shift+click is used.
            rangeStartDate = selection[0];
            selection.sort(dateSort);

            // A two element array means a start and end
            if (me.multiSelect === 'range' && selection.length === 2) {
                result = new DateSet();
                for (const d = new Date(selection[0]); d <= selection[1]; d.setDate(d.getDate() + 1)) {
                    result.add(d);
                }
            }
            else {
                // Multi dates may be in any order, so use the temporally first date as range start
                rangeStartDate = selection[0];
                result = new DateSet(selection);
            }
        }
        else {
            result = new DateSet();
        }

        if (rangeStartDate) {
            me.activeDate = me.rangeStartDate = DateHelper.clearTime(rangeStartDate);
        }

        return result;
    }

    updateHighlightSelectedWeek(highlightSelectedWeek) {
        this.element.classList.toggle('b-highlight-selected-week', Boolean(highlightSelectedWeek));
    }

    updateMultiSelect(multiSelect) {
        this.element.classList.toggle('b-multiselect', Boolean(multiSelect));
        if (!multiSelect) {
            this.selection = [...this.selection][0];
        }
    }

    updateSelection(dateSet) {
        const
            me        = this,
            { dates } = dateSet,
            selection = me.multiSelect === 'range' ? [dates[0], dates[dates.length - 1]] : dates;

        // "date" property must be seen to be the selected date.
        dates.length && (me.date = dates[0]);

        if (!me.isConfiguring) {
            // We're going to announce the change. UI must be up to date
            me.refresh.now();

            /**
             * Fires when a date or date range is selected. If {@link #config-multiSelect} is specified,
             * this will fire upon deselection and selection of dates.
             * @event selectionChange
             * @param {Date[]} selection The selected date. If {@link #config-multiSelect} is specified
             * this may be a two element array specifying start and end dates.
             * @param {Boolean} userAction This will be `true` if the change was caused by user interaction
             * as opposed to programmatic setting.
             */
            me.trigger('selectionChange', {
                selection,
                userAction : Boolean(me.activatingEvent)
            });
        }
    }

    /**
     * The selected Date(s).
     *
     * When {@link #config-multiSelect} is `'range'`, then this yields a two element array
     * representing the start and end of the selected range.
     *
     * When {@link #config-multiSelect} is `true`, this yields an array containing every selected
     * Date.
     * @member {Date[]} selection
     */
    get selection() {
        const
            { _selection } = this,
            dates          = _selection ? _selection.dates : emptyArray;

        return this.multiSelect === 'range' && dates.length ? [dates[0], dates[dates.length - 1]] : dates;
    }

    onInternalKeyDown(keyEvent) {
        const
            me         = this,
            keyName    = keyEvent.key.trim() || keyEvent.code,
            activeDate = me.activeDate;

        let newDate    = new Date(activeDate);

        if (keyName === 'Escape' && me.floating) {
            return me.hide();
        }

        // Only navigate if not focused on one of our child widgets.
        // We have a prevMonth and nextMonth tool and possibly month and year pickers.
        if (activeDate && me.weeksElement.contains(keyEvent.target)) {
            do {
                switch (keyName) {
                    case 'ArrowLeft':
                        // Disable browser use of this key.
                        // Ctrl+ArrowLeft navigates back.
                        // ArrowLeft scrolls if there is horizontal scroll.
                        keyEvent.preventDefault();

                        if (keyEvent.ctrlKey) {
                            newDate = me.gotoPrevMonth();
                        }
                        else {
                            newDate.setDate(newDate.getDate() - 1);
                        }
                        break;
                    case 'ArrowUp':
                        // Disable browser use of this key.
                        // ArrowUp scrolls if there is vertical scroll.
                        keyEvent.preventDefault();

                        newDate.setDate(newDate.getDate() - 7);
                        break;
                    case 'ArrowRight':
                        // Disable browser use of this key.
                        // Ctrl+ArrowRight navigates forwards.
                        // ArrowRight scrolls if there is horizontal scroll.
                        keyEvent.preventDefault();

                        if (keyEvent.ctrlKey) {
                            newDate = me.gotoNextMonth();
                        }
                        else {
                            newDate.setDate(newDate.getDate() + 1);
                        }
                        break;
                    case 'ArrowDown':
                        // Disable browser use of this key.
                        // ArrowDown scrolls if there is vertical scroll.
                        keyEvent.preventDefault();

                        newDate.setDate(newDate.getDate() + 7);
                        break;
                    case 'Enter':
                        return me.onUIDateSelect(activeDate, keyEvent);
                }
            } while (me.isDisabledDate(newDate) && !me.focusDisabledDates);

            // Don't allow navigation to outside of date bounds.
            if (me.minDate && newDate < me.minDate) {
                return;
            }
            if (me.maxDate && newDate > me.maxDate) {
                return;
            }
            me.activeDate = newDate;
        }
    }

    changeMinDate(minDate) {
        // Avoid changeDate which clamps incoming value into current allowable range
        return minDate && CalendarPanel.prototype.changeDate.apply(this, arguments);
    }

    updateMinDate(minDate) {
        this._yearpicker && (this._yearpicker.minYear = minDate?.getFullYear());
        this.refresh();
    }

    changeMaxDate(minDate) {
        // Avoid changeDate which clamps incoming value into current allowable range
        return minDate && CalendarPanel.prototype.changeDate.apply(this, arguments);
    }

    updateMaxDate(maxDate) {
        this._yearpicker && (this._yearpicker.maxYear = maxDate?.getFullYear());
        this.refresh();
    }

    changeDate(date) {
        return DateHelper.clamp(super.changeDate(date), this.minDate, this.maxDate);
    }

    updateDate(date, oldDate) {
        const
            me        = this,
            { month } = me;

        // Directly configuring a date creates the selection
        me.isConfiguring && !me.initializingActiveDate && (me.selection = date);

        // Only change the month's date if it is within our current month
        // or we have to because we don't have a cell for it.
        // If it's a date in the "otherMonth" part of the grid, do not update.
        if (!month.date || date.getMonth() === month.month || !me.getCell(date) || me.alwaysRefreshOnMonthChange || me.isNavigating) {
            super.updateDate(date);
        }
        else {
            const
                newMonth = month.getOtherMonth(date),
                // Collect changes as bitwise flags:
                // 0001 = date has changed.
                // 0010 = week has changed.
                // 0100 = month has changed.
                // 1000 = year has changed.
                // We need this because 10/1/2010 -> 10/1/2011 must fire a dateChange
                // and a monthChange in addition to the yearChange.
                // And 10/1/2010 -> 10/2/2010 must fire a dateChange in addition to the monthChange.
                changes  = me.eventListeners && (oldDate ? (
                    date.getDate()            !== oldDate.getDate())             |
                    (newMonth.getWeekId(date) !== month.getWeekId(oldDate)) << 1 |
                    (date.getMonth()          !== oldDate?.getMonth())      << 2 |
                    (date.getFullYear()       !== oldDate?.getFullYear())   << 3 : 15);

            me.trigger('dateChange', {
                changes : {
                    d : true,
                    w : Boolean(changes & 2),
                    m : Boolean(changes & 12),
                    y : Boolean(changes & 8),
                    r : newMonth.weekCount !== month.weekCount
                },
                value    : date,
                oldValue : oldDate
            });
        }
    }

    changeActiveDate(activeDate, oldActiveDate) {
        if (this.trigger('beforeActiveDateChange', { activeDate, oldActiveDate }) === false) {
            return;
        }

        activeDate = activeDate ? this.changeDate(activeDate) : this.date || (this.date = DateHelper.clearTime(new Date()));

        if (isNaN(activeDate)) {
            throw new Error('DatePicker date ingestion must be passed a Date, or a YYYY-MM-DD date string');
        }

        return DateHelper.clamp(activeDate, this.minDate, this.maxDate);
    }

    updateActiveDate(activeDate, wasActiveDate) {
        const
            me                = this,
            { isConfiguring } = me;

        if (isConfiguring || !me.getCell(activeDate)) {
            me.initializingActiveDate = isConfiguring;
            me.date = activeDate;
            me.initializingActiveDate = false;
        }
        if (!isConfiguring && !me.refresh.isPending) {
            me.syncActiveDate(activeDate, wasActiveDate);
        }
    }

    syncActiveDate(activeDate, wasActiveDate) {
        const
            me            = this,
            { activeCls } = me,
            activeCell    = me.getCell(activeDate),
            wasActiveCell = wasActiveDate && me.getCell(wasActiveDate),
            activeElement = DomHelper.getActiveElement(me.element);

        activeCell.setAttribute('tabIndex', 0);
        activeCls && activeCell.classList.add(activeCls);
        activeCell.id = `${me.id}-active-day`;

        if (me.weeksElement.contains(activeElement) /*|| me.owner?.element.contains(activeElement)*/) {
            activeCell.focus();
        }

        if (wasActiveCell && wasActiveCell !== activeCell) {
            wasActiveCell.removeAttribute('tabIndex');
            activeCls && wasActiveCell.classList.remove(activeCls);
            wasActiveCell.removeAttribute('id');
        }
    }

    set value(value) {
        const
            me = this,
            {
                selection,
                duration
            }  = me;

        // Setting the value must navigate to the encapsulating month even if we have
        // a cell for the date.
        // updateDate always calls super and CalendarPanel will refresh
        me.isNavigating = true;

        if (value) {
            value = me.changeDate(value, me.value);

            // If we're maintaining a single date range, move the range
            if (me.multiSelect === 'range' && selection?.length === 2) {
                if (!DateHelper.betweenLesserEqual(value, ...selection)) {
                    // Move range back to encapsulate date
                    if (value < selection[0]) {
                        me.selection = [value, DateHelper.add(value, duration - 1, 'd')];
                    }
                    // Move range forwards to encapsulate date
                    else {
                        me.selection = [DateHelper.add(value, -(duration - 1), 'd'), value];
                    }
                }
                me.date = me.activeDate = value;
                return;
            }

            // Undefined return value means no change
            if (value !== undefined) {
                me.selection = value;
            }
        }
        else {
            // Clearing the value - go to today's calendar
            me.date = new Date();
            me.selection = null;
        }
        me.isNavigating = false;
    }

    get value() {
        return this.selection[this.selection.length - 1];
    }

    get duration() {
        return this.multiSelect === 'range' ? DateHelper.diff(...this.selection, 'd') + 1 : 1;
    }

    gotoPrevYear() {
        return this.goto(-1, 'year');
    }

    gotoPrevMonth() {
        return this.goto(-1, 'month');
    }

    gotoNextMonth() {
        return this.goto(1, 'month');
    }

    gotoNextYear() {
        return this.goto(1, 'year');
    }

    goto(direction, unit) {
        const
            me                  = this,
            { activeDate }      = me,
            activeCell          = activeDate && me.getCell(activeDate);

        let newDate;

        // If active date is already in the month we're going to, use it
        if (unit === 'month' && activeCell && activeDate?.getMonth() === me.month.month + direction) {
            newDate = activeDate;
        }
        // Move the date by the requested unit
        else {
            newDate = DateHelper.add(activeCell ? activeDate : me.date, direction, unit);
        }
        const firstDateOfNewMonth = new Date(newDate);

        firstDateOfNewMonth.setDate(1);

        const lastDateOfNewMonth  = DateHelper.add(DateHelper.add(firstDateOfNewMonth, 1, 'month'), -1, 'day');

        // Don't navigate if month is outside bounds
        if ((me.minDate && direction < 0 && lastDateOfNewMonth < me.minDate) || (me.maxDate && direction > 0 && firstDateOfNewMonth > me.maxDate)) {
            return;
        }

        // We need to force a UI change even if the UI contains the target date.
        // updateDate always calls super and CalendarPanel will refresh
        me.isNavigating = true;

        const result = me.date = newDate;

        if (activeCell) {
            me.activeDate = newDate;
        }
        me.isNavigating = false;
        return result;
    }

    isActiveDate(date) {
        return !(date - this.activeDate);
    }

    isSelectedDate(date) {
        return this._selection?.has(date);
    }

    onMonthPicked({ record, userAction }) {
        if (userAction) {
            this.activeDate = DateHelper.add(this.activeDate, record.value - this.activeDate.getMonth(), 'month');
            this.focusElement?.focus();
        }
    }

    onYearPickerRequested() {
        const { yearPicker } = this;

        if (yearPicker.isVisible) {
            yearPicker.hide();
        }
        else {
            yearPicker.year = yearPicker.startYear = this.activeDate.getFullYear();
            yearPicker.show();
            yearPicker.focus();
        }
    }

    onYearPickerTitleClick() {
        this.yearPicker.hide();
    }

    onYearPicked({ value, source }) {
        const newDate = new Date(this.activeDate);

        newDate.setFullYear(value);
        this.activeDate = newDate;

        // Move focus without scroll *before* focus reversion from the hide.
        // Browser behaviour of scrolling to focused element would break animation.
        this.focusElement?.focus({ preventScroll : true });
        source.hide();
    }

    changeYearPicker(yearPicker, oldYearPicker) {
        return YearPicker.reconfigure(oldYearPicker, yearPicker ? YearPicker.mergeConfigs({
            owner    : this,
            appendTo : this.element,
            minYear  : this.minDate?.getFullYear(),
            maxYear  : this.maxDate?.getFullYear()
        }, yearPicker) : null, this);
    }

    get childItems() {
        const
            { _yearPicker } = this,
            result          = super.childItems;

        if (_yearPicker) {
            result.push(_yearPicker);
        }

        return result;
    }

    updateLocalization() {
        const
            {
                monthField
            }          = this.widgetMap,
            newData    = generateMonthNames();

        if (!this.isConfiguring && !newData.every((d, i) => d[1] === monthField.store.getAt(i).text)) {
            newData[monthField.value ?? this.date.getMonth()].selected = true;
            monthField.items = newData;
        }

        super.updateLocalization();
    }
}

// Dates are never equal, so raw Set won't work.
class DateSet extends Set {
    add(d) {
        d = DateHelper.makeKey(d);
        if (!this.has(d)) {
            this.generation = (this.generation || 0) + 1;
        }
        return super.add(d);
    }

    delete(d) {
        d = DateHelper.makeKey(d);
        if (this.has(d)) {
            this.generation++;
        }
        return super.delete(d);
    }

    has(d) {
        return super.has(DateHelper.makeKey(d));
    }

    clear() {
        if (this.size) {
            this.generation++;
        }
        return super.clear();
    }

    equals(other) {
        Array.isArray(other) && (other = new DateSet(other));

        return (other.size === this.size) && [...this].every(s => other.has(s));
    }

    get dates() {
        return [...this].sort().map(k => DateHelper.parseKey(k));
    }
}

// Register this widget type with its Factory
DatePicker.initClass();
