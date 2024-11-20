import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'He',
    localeDesc : 'עִברִית',
    localeCode : 'he',

    Object : {
        Yes    : 'כן',
        No     : 'לא',
        Cancel : 'בטל',
        Ok     : 'אוקיי',
        Week   : 'שבוע',
        None   : 'אף אחד'
    },

    ColorPicker : {
        noColor : 'אין צבע'
    },

    Combo : {
        noResults          : 'אין תוצאות',
        recordNotCommitted : 'לא תאפשר להוסיף את הרשומה',
        addNewValue        : value => `${value} הוסף`
    },

    FilePicker : {
        file : 'קובץ'
    },

    Field : {
        badInput              : 'ערך שדה בלתי-חוקי',
        patternMismatch       : 'הערך נדרש להתאים לתבנית מסוימת',
        rangeOverflow         : value => `${value.max}-הערך חייב להיות קטן או שווה ל`,
        rangeUnderflow        : value => `${value.min}-הערך חייב להיות גדול או שווה ל`,
        stepMismatch          : 'הערך אמור להתאים לשלב',
        tooLong               : 'הערכים חייבים להיות קצרים יותר',
        tooShort              : 'הערך חייב להיות ארוך יותר',
        typeMismatch          : 'הערך נדרש להיות בפורמט מיוחד',
        valueMissing          : 'שדה זה נדרש',
        invalidValue          : 'ערך שדה בלתי-חוקי',
        minimumValueViolation : 'הפרת ערך מינימום',
        maximumValueViolation : 'הפרת ערך מקסימום',
        fieldRequired         : 'שדה זה נדרש',
        validateFilter        : 'יש לבחור את הערך מרשימה'
    },

    DateField : {
        invalidDate : 'הזנת תאריך בלתי-חוקי'
    },

    DatePicker : {
        gotoPrevYear  : 'עבור לשנה הקודמת',
        gotoPrevMonth : 'עבור לחודש הקודם',
        gotoNextMonth : 'עבור לחודש הבא',
        gotoNextYear  : 'עבור לשנה הבאה'
    },

    NumberFormat : {
        locale   : 'he',
        currency : 'NIS'
    },

    DurationField : {
        invalidUnit : 'יחידה בלתי-חוקית'
    },

    TimeField : {
        invalidTime : 'הזנת זמן בלתי-חוקי'
    },

    TimePicker : {
        hour   : 'שעה',
        minute : 'דקה',
        second : 'שנייה'
    },

    List : {
        loading   : 'מתבצעת טעינה...',
        selectAll : 'בחר הכל'
    },

    GridBase : {
        loadMask : '...מתבצעת טעינה',
        syncMask : '...שומר שינויים, אנא המתן'
    },

    PagingToolbar : {
        firstPage         : 'עבור לעמוד הראשון',
        prevPage          : 'עבור לעמוד הקודם',
        page              : 'עמוד',
        nextPage          : 'עבור לעמוד הבא',
        lastPage          : 'עבור לעמוד האחרון',
        reload            : 'טען מחדש את העמוד הנוכחי',
        noRecords         : 'אין רשומות להצגה',
        pageCountTemplate : data => `${data.lastPage} מתוך`,
        summaryTemplate   : data => `${data.allCount} מתוך ${data.end}-${data.start} מציג רשומות`
    },

    PanelCollapser : {
        Collapse : 'מזער',
        Expand   : 'הרחב'
    },

    Popup : {
        close : 'סגור חלון קופץ'
    },

    UndoRedo : {
        Undo           : 'בטל',
        Redo           : 'בצע שוב',
        UndoLastAction : 'בטל פעולה אחרונה',
        RedoLastAction : 'בצע שוב את הפעולה האחרונה שלא בוצעה',
        NoActions      : 'אין פריטים בטור הפעולות לביטול'
    },

    FieldFilterPicker : {
        equals                 : 'שווה',
        doesNotEqual           : 'לא שווה',
        isEmpty                : 'ריק',
        isNotEmpty             : 'אינו ריק',
        contains               : 'מכיל',
        doesNotContain         : 'אינו מכיל',
        startsWith             : 'מתחיל עם',
        endsWith               : 'מסתיים עם',
        isOneOf                : 'הוא אחד מ-',
        isNotOneOf             : 'אינו אחד מ-',
        isGreaterThan          : 'גדול מ-',
        isLessThan             : 'קטן מ-',
        isGreaterThanOrEqualTo : 'גדול או שווה ל-',
        isLessThanOrEqualTo    : 'קטן או שווה ל-',
        isBetween              : 'נמצא בין',
        isNotBetween           : 'אינו נמצא בין',
        isBefore               : 'נמצא לפני',
        isAfter                : 'נמצא אחרי',
        isToday                : 'מתקיים היום',
        isTomorrow             : 'יתקיים מחר',
        isYesterday            : 'התקיים אתמול',
        isThisWeek             : 'יתקיים השבוע',
        isNextWeek             : 'יתקיים בשבוע הבא',
        isLastWeek             : 'התקיים בשבוע שעבר',
        isThisMonth            : 'יתקיים החודש',
        isNextMonth            : 'יתקיים בחודש הבא',
        isLastMonth            : 'התקיים בחודש שעבר',
        isThisYear             : 'יתקיים השנה',
        isNextYear             : 'יתקיים בשנה הבאה',
        isLastYear             : 'התקיים בשנה שעברה',
        isYearToDate           : 'מתחילת השנה עד היום',
        isTrue                 : 'נכון',
        isFalse                : 'לא נכון',
        selectAProperty        : 'בחר תכונה',
        selectAnOperator       : 'בחר אופרטור',
        caseSensitive          : 'תלוי רישיות',
        and                    : 'ו-',
        dateFormat             : 'D/M/YY',
        selectValue            : 'בחר ערך',
        selectOneOrMoreValues  : 'בחר ערך אחד או יותר',
        enterAValue            : 'הזן ערך',
        enterANumber           : 'הזן מספר',
        selectADate            : 'בחר תאריך',
        selectATime            : 'בחר שעה'
    },

    FieldFilterPickerGroup : {
        addFilter : 'הוסף פילטר'
    },

    DateHelper : {
        locale         : 'he',
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
            { single : 'מילי-שנייה', plural : 'מ”ש', abbrev : 'מ”ש' },
            { single : 'שנייה', plural : 'שניות', abbrev : 'ש' },
            { single : 'דקה', plural : 'דקות', abbrev : 'דקה' },
            { single : 'שעה', plural : 'שעות', abbrev : 'ש' },
            { single : 'יום', plural : 'ימים', abbrev : 'י' },
            { single : 'שבוע', plural : 'שבועות', abbrev : 'ש' },
            { single : 'חודש', plural : 'חודשים', abbrev : 'חודש' },
            { single : 'רבעון', plural : 'רבעונים', abbrev : 'ר' },
            { single : 'שנה', plural : 'שנים', abbrev : 'שנה' },
            { single : 'עשור', plural : 'עשורים', abbrev : 'עש' }
        ],
        unitAbbreviations : [
            ['מיל'],
            ['ש', 'שנ'],
            ['ד', 'דק'],
            ['ש', 'שע'],
            ['י'],
            ['ש', 'שב'],
            ['חו', 'חוד', 'חודש'],
            ['ר', 'רבעון', 'רבעון'],
            ['ש', 'שנה'],
            ['עשור']
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number
    }
};

export default LocaleHelper.publishLocale(locale);
