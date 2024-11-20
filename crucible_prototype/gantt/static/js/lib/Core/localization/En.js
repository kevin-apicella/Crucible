import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'En',
    localeDesc : 'English (US)',
    localeCode : 'en-US',

    Object : {
        Yes    : 'Yes',
        No     : 'No',
        Cancel : 'Cancel',
        Ok     : 'OK',
        Week   : 'Week',
        None   : 'None'
    },

    ColorPicker : {
        noColor : 'No color'
    },

    Combo : {
        noResults          : 'No results',
        recordNotCommitted : 'Record could not be added',
        addNewValue        : value => `Add ${value}`
    },

    FilePicker : {
        file : 'File'
    },

    Field : {
        badInput              : 'Invalid field value',
        patternMismatch       : 'Value should match a specific pattern',
        rangeOverflow         : value => `Value must be less than or equal to ${value.max}`,
        rangeUnderflow        : value => `Value must be greater than or equal to ${value.min}`,
        stepMismatch          : 'Value should fit the step',
        tooLong               : 'Value should be shorter',
        tooShort              : 'Value should be longer',
        typeMismatch          : 'Value is required to be in a special format',
        valueMissing          : 'This field is required',
        invalidValue          : 'Invalid field value',
        minimumValueViolation : 'Minimum value violation',
        maximumValueViolation : 'Maximum value violation',
        fieldRequired         : 'This field is required',
        validateFilter        : 'Value must be selected from the list'
    },

    DateField : {
        invalidDate : 'Invalid date input'
    },

    DatePicker : {
        gotoPrevYear  : 'Go to previous year',
        gotoPrevMonth : 'Go to previous month',
        gotoNextMonth : 'Go to next month',
        gotoNextYear  : 'Go to next year'
    },

    NumberFormat : {
        locale   : 'en-US',
        currency : 'USD'
    },

    DurationField : {
        invalidUnit : 'Invalid unit'
    },

    TimeField : {
        invalidTime : 'Invalid time input'
    },

    TimePicker : {
        hour   : 'Hour',
        minute : 'Minute',
        second : 'Second'
    },

    List : {
        loading   : 'Loading...',
        selectAll : 'Select All'
    },

    GridBase : {
        loadMask : 'Loading...',
        syncMask : 'Saving changes, please wait...'
    },

    PagingToolbar : {
        firstPage         : 'Go to first page',
        prevPage          : 'Go to previous page',
        page              : 'Page',
        nextPage          : 'Go to next page',
        lastPage          : 'Go to last page',
        reload            : 'Reload current page',
        noRecords         : 'No records to display',
        pageCountTemplate : data => `of ${data.lastPage}`,
        summaryTemplate   : data => `Displaying records ${data.start} - ${data.end} of ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Collapse',
        Expand   : 'Expand'
    },

    Popup : {
        close : 'Close'
    },

    UndoRedo : {
        Undo           : 'Undo',
        Redo           : 'Redo',
        UndoLastAction : 'Undo last action',
        RedoLastAction : 'Redo last undone action',
        NoActions      : 'No items in the undo queue'
    },

    FieldFilterPicker : {
        equals                 : 'equals',
        doesNotEqual           : 'does not equal',
        isEmpty                : 'empty',
        isNotEmpty             : 'not empty',
        contains               : 'contains',
        doesNotContain         : 'does not contain',
        startsWith             : 'starts with',
        endsWith               : 'ends with',
        isOneOf                : 'one of',
        isNotOneOf             : 'not one of',
        isGreaterThan          : 'greater than',
        isLessThan             : 'less than',
        isGreaterThanOrEqualTo : 'greater or equals',
        isLessThanOrEqualTo    : 'less or equals',
        isBetween              : 'between',
        isNotBetween           : 'not between',
        isBefore               : 'before',
        isAfter                : 'after',
        isToday                : 'today',
        isTomorrow             : 'tomorrow',
        isYesterday            : 'yesterday',
        isThisWeek             : 'this week',
        isNextWeek             : 'next week',
        isLastWeek             : 'last week',
        isThisMonth            : 'this month',
        isNextMonth            : 'next month',
        isLastMonth            : 'last month',
        isThisYear             : 'this year',
        isNextYear             : 'next year',
        isLastYear             : 'last year',
        isYearToDate           : 'year to date',
        isTrue                 : 'true',
        isFalse                : 'false',
        selectAProperty        : 'Select property',
        selectAnOperator       : 'Select operator',
        caseSensitive          : 'Case-sensitive',
        and                    : 'and',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Select value',
        selectOneOrMoreValues  : 'Select value(s)',
        enterAValue            : 'Enter value',
        enterANumber           : 'Enter number',
        selectADate            : 'Select date',
        selectATime            : 'Select time'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Add filter'
    },

    DateHelper : {
        locale         : 'en-US',
        weekStartDay   : 0,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'millisecond', plural : 'ms', abbrev : 'ms' },
            { single : 'second', plural : 'seconds', abbrev : 's' },
            { single : 'minute', plural : 'minutes', abbrev : 'min' },
            { single : 'hour', plural : 'hours', abbrev : 'h' },
            { single : 'day', plural : 'days', abbrev : 'd' },
            { single : 'week', plural : 'weeks', abbrev : 'w' },
            { single : 'month', plural : 'months', abbrev : 'mon' },
            { single : 'quarter', plural : 'quarters', abbrev : 'q' },
            { single : 'year', plural : 'years', abbrev : 'yr' },
            { single : 'decade', plural : 'decades', abbrev : 'dec' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'sec'],
            ['m', 'min'],
            ['h', 'hr'],
            ['d'],
            ['w', 'wk'],
            ['mo', 'mon', 'mnt'],
            ['q', 'quar', 'qrt'],
            ['y', 'yr'],
            ['dec']
        ],
        parsers : {
            L   : 'MM/DD/YYYY',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = 'th';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : 'st', 2 : 'nd', 3 : 'rd' }[lastDigit] || 'th';
            }

            return number + suffix;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
