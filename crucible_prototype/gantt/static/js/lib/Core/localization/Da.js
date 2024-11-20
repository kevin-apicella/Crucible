import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Da',
    localeDesc : 'Dansk',
    localeCode : 'da',

    Object : {
        Yes    : 'Ja',
        No     : 'Nej',
        Cancel : 'Annullér',
        Ok     : 'OK',
        Week   : 'Uge',
        None   : 'Ingen'
    },

    ColorPicker : {
        noColor : 'Ingen farve'
    },

    Combo : {
        noResults          : 'Ingen resultater',
        recordNotCommitted : 'Række kunne ikke tilføjes',
        addNewValue        : value => `Tilføj ${value}`
    },

    FilePicker : {
        file : 'Fil'
    },

    Field : {
        badInput              : 'Ugyldig feltværdi',
        patternMismatch       : 'Værdien skal matche et bestemt mønster',
        rangeOverflow         : value => `Værdien skal være mindre end eller lig med ${value.max}`,
        rangeUnderflow        : value => `Værdien skal være større end eller lig med ${value.min}`,
        stepMismatch          : 'Værdien skal passe til trinnet',
        tooLong               : 'Værdien skal være kortere',
        tooShort              : 'Værdien skal være længere',
        typeMismatch          : 'Værdien skal være i et særligt format',
        valueMissing          : 'dette felt er påkrævet',
        invalidValue          : 'Ugyldig feltværdi',
        minimumValueViolation : 'Overtrædelse af minimumsværdien',
        maximumValueViolation : 'Maksimal værdikrænkelse',
        fieldRequired         : 'Dette felt er påkrævet',
        validateFilter        : 'Værdien skal vælges på listen'
    },

    DateField : {
        invalidDate : 'Ugyldig datoinput'
    },

    DatePicker : {
        gotoPrevYear  : 'Gå til forrige år',
        gotoPrevMonth : 'Gå til forrige måned',
        gotoNextMonth : 'Gå til næste måned',
        gotoNextYear  : 'Gå til næste år'
    },

    NumberFormat : {
        locale   : 'da',
        currency : 'DKK'
    },

    DurationField : {
        invalidUnit : 'Ugyldig enhed'
    },

    TimeField : {
        invalidTime : 'Ugyldig tidsangivelse'
    },

    TimePicker : {
        hour   : 'Time',
        minute : 'Minut',
        second : 'Sekund'
    },

    List : {
        loading   : 'Indlæser...',
        selectAll : 'Vælg alle'
    },

    GridBase : {
        loadMask : 'Indlæser...',
        syncMask : 'Gemmer ændringer, vent venligst...'
    },

    PagingToolbar : {
        firstPage         : 'Gå til første side',
        prevPage          : 'Gå til forrige side',
        page              : 'Side',
        nextPage          : 'Gå til næste side',
        lastPage          : 'Gå til sidste side',
        reload            : 'Genindlæs den aktuelle side',
        noRecords         : 'Ingen poster at vise',
        pageCountTemplate : data => `af ${data.lastPage}`,
        summaryTemplate   : data => `Viser poster ${data.start} - ${data.end} af ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Kollaps',
        Expand   : 'Udvide'
    },

    Popup : {
        close : 'Luk dialog'
    },

    UndoRedo : {
        Undo           : 'Fortryd',
        Redo           : 'Gentag',
        UndoLastAction : 'Fortryd foregående handling',
        RedoLastAction : 'Gentag den foregående fortrudte handling',
        NoActions      : 'Ingen handlinger registreret'
    },

    FieldFilterPicker : {
        equals                 : 'lig med',
        doesNotEqual           : 'er ikke lig',
        isEmpty                : 'er tom',
        isNotEmpty             : 'er ikke tom',
        contains               : 'indeholder',
        doesNotContain         : 'indeholder ikke',
        startsWith             : 'starter med',
        endsWith               : 'slutter med',
        isOneOf                : 'er en af',
        isNotOneOf             : 'er ikke en af',
        isGreaterThan          : 'er større end',
        isLessThan             : 'er mindre end',
        isGreaterThanOrEqualTo : 'er større end eller lig med',
        isLessThanOrEqualTo    : 'er mindre end eller lig med',
        isBetween              : 'er mellem',
        isNotBetween           : 'er ikke mellem',
        isBefore               : 'er før',
        isAfter                : 'er efter',
        isToday                : 'er i dag',
        isTomorrow             : 'er i morgen',
        isYesterday            : 'er i går',
        isThisWeek             : 'er denne uge',
        isNextWeek             : 'er i næste uge',
        isLastWeek             : 'er i sidste uge',
        isThisMonth            : 'er denne måned',
        isNextMonth            : 'er næste måned',
        isLastMonth            : 'er sidste måned',
        isThisYear             : 'er i år',
        isNextYear             : 'er næste år',
        isLastYear             : 'er sidste år',
        isYearToDate           : 'er år til dato',
        isTrue                 : 'er sand',
        isFalse                : 'er falsk',
        selectAProperty        : 'Vælg en ejendom',
        selectAnOperator       : 'Vælg en operatør',
        caseSensitive          : 'Stillende mellem store og små bogstaver',
        and                    : 'og',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Vælg værdi',
        selectOneOrMoreValues  : 'Vælg en eller flere værdier',
        enterAValue            : 'Indtast en værdi',
        enterANumber           : 'Indtast et tal',
        selectADate            : 'Vælg en dato',
        selectATime            : 'Vælg tid'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Tilføj filter'
    },

    DateHelper : {
        locale         : 'da',
        weekStartDay   : 1,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'Millisekund', plural : 'Millisekunder', abbrev : 'ms' },
            { single : 'Sekund', plural : 'Sekunder', abbrev : 's' },
            { single : 'Minut', plural : 'Minutter', abbrev : 'min' },
            { single : 'Time', plural : 'Timer', abbrev : 't' },
            { single : 'Dag', plural : 'Dage', abbrev : 'd' },
            { single : 'Uge', plural : 'Uger', abbrev : 'u' },
            { single : 'Måned', plural : 'Måneder', abbrev : 'mdr' },
            { single : 'Kvartal', plural : 'Kvartaler', abbrev : 'kv' },
            { single : 'År', plural : 'År', abbrev : 'år' },
            { single : 'Årti', plural : 'Årtier', abbrev : 'årti(er)' }
        ],
        unitAbbreviations : [
            ['mil', 'ms'],
            ['s', 'sek'],
            ['m', 'min'],
            ['t'],
            ['d'],
            ['u'],
            ['m', 'mdr'],
            ['k', 'kv'],
            ['å', 'år'],
            ['årti', 'årtier']
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => number
    }
};

export default LocaleHelper.publishLocale(locale);
