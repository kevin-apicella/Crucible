import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'No',
    localeDesc : 'Norsk',
    localeCode : 'no',

    Object : {
        Yes    : 'Ja',
        No     : 'Nei',
        Cancel : 'Avbryt',
        Ok     : 'OK',
        Week   : 'Uke',
        None   : 'Ingen'
    },

    ColorPicker : {
        noColor : 'Ingen farge'
    },

    Combo : {
        noResults          : 'Ingen treff',
        recordNotCommitted : 'Kunne ikke legge til oppføringen',
        addNewValue        : value => `Legg til ${value}`
    },

    FilePicker : {
        file : 'Fil'
    },

    Field : {
        badInput              : 'Ugyldig feltverdi',
        patternMismatch       : 'Verdien skal samsvare med et bestemt mønster',
        rangeOverflow         : value => `Verdien må være mindre eller lik ${value.max}`,
        rangeUnderflow        : value => `Verdien må være større eller lik ${value.min}`,
        stepMismatch          : 'Verdien skal passe til trinnet',
        tooLong               : 'Verdien skal være kortere',
        tooShort              : 'Verdien skal være lengre',
        typeMismatch          : 'Verdien skal være i et bestemt format',
        valueMissing          : 'Dette feltet er obligatorisk',
        invalidValue          : 'Ugyldig feltverdi',
        minimumValueViolation : 'Minimumsverdibrudd',
        maximumValueViolation : 'Maksimumsverdibrudd',
        fieldRequired         : 'Dette feltet er obligatorisk',
        validateFilter        : 'Verdien skal velges fra listen'
    },

    DateField : {
        invalidDate : 'Ugyldig datoinntasting'
    },

    DatePicker : {
        gotoPrevYear  : 'Gå til forrige år',
        gotoPrevMonth : 'Gå til forrige måned',
        gotoNextMonth : 'Gå til neste måned',
        gotoNextYear  : 'Gå til neste år'
    },

    NumberFormat : {
        locale   : 'no',
        currency : 'NOK'
    },

    DurationField : {
        invalidUnit : 'Ugyldig enhet'
    },

    TimeField : {
        invalidTime : 'Ugyldig tidsinntasting'
    },

    TimePicker : {
        hour   : 'Time',
        minute : 'Minutt',
        second : 'Sekund'
    },

    List : {
        loading   : 'Laster...',
        selectAll : 'Velg alle'
    },

    GridBase : {
        loadMask : 'Laster...',
        syncMask : 'Lagrer endringer, vennligst vent...'
    },

    PagingToolbar : {
        firstPage         : 'Gå til første side',
        prevPage          : 'Gå til forrige side',
        page              : 'Side',
        nextPage          : 'Gå til neste side',
        lastPage          : 'Gå til siste side',
        reload            : 'Last inn gjeldende side på nytt',
        noRecords         : 'Ingen oppføringer å vise',
        pageCountTemplate : data => `av ${data.lastPage}`,
        summaryTemplate   : data => `Viser oppføringer ${data.start} - ${data.end} av ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Skjul',
        Expand   : 'Utvid'
    },

    Popup : {
        close : 'Lukk popup'
    },

    UndoRedo : {
        Undo           : 'Angre',
        Redo           : 'Gjøre om',
        UndoLastAction : 'Angre siste handling',
        RedoLastAction : 'Gjøre om siste handling',
        NoActions      : 'Ingen elementer I angrekøen'
    },

    FieldFilterPicker : {
        equals                 : 'er lik',
        doesNotEqual           : 'er ikke lik',
        isEmpty                : 'er tom',
        isNotEmpty             : 'er ikke tom',
        contains               : 'inneholder',
        doesNotContain         : 'inneholder ikke',
        startsWith             : 'begynner med',
        endsWith               : 'slutter med',
        isOneOf                : 'er et av',
        isNotOneOf             : 'er ikke et av',
        isGreaterThan          : 'er større enn',
        isLessThan             : 'er mindre enn',
        isGreaterThanOrEqualTo : 'er større enn eller lik',
        isLessThanOrEqualTo    : 'er mindre enn eller lik',
        isBetween              : 'er mellom',
        isNotBetween           : 'er ikke mellom',
        isBefore               : 'er før',
        isAfter                : 'er etter',
        isToday                : 'er i dag',
        isTomorrow             : 'er i morgen',
        isYesterday            : 'er i går',
        isThisWeek             : 'er denne uken',
        isNextWeek             : 'er neste uke',
        isLastWeek             : 'er siste uke',
        isThisMonth            : 'er denne måneden',
        isNextMonth            : 'er neste måned',
        isLastMonth            : 'er siste måned',
        isThisYear             : 'er i år',
        isNextYear             : 'er neste år',
        isLastYear             : 'er i fjor',
        isYearToDate           : 'er år til dags dato',
        isTrue                 : 'er sant',
        isFalse                : 'er falsk',
        selectAProperty        : 'Velg egenskap',
        selectAnOperator       : 'Velg operatør',
        caseSensitive          : 'Skille mellom store og små bokstaver',
        and                    : 'og',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Velg verdi',
        selectOneOrMoreValues  : 'Velg én eller flere verdier',
        enterAValue            : 'Skriv inn en verdi',
        enterANumber           : 'Skriv inn et tall',
        selectADate            : 'Velg en dato',
        selectATime            : 'Velg tidspunkt'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Legg til filter'
    },

    DateHelper : {
        locale         : 'no',
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
            { single : 'millisekund', plural : 'ms', abbrev : 'ms' },
            { single : 'sekund', plural : 'sekunder', abbrev : 's' },
            { single : 'minutt', plural : 'minutter', abbrev : 'min' },
            { single : 'time', plural : 'timer', abbrev : 't' },
            { single : 'dag', plural : 'dager', abbrev : 'd' },
            { single : 'uke', plural : 'uker', abbrev : 'u' },
            { single : 'måned', plural : 'måneder', abbrev : 'mån' },
            { single : 'kvartal', plural : 'kvartaler', abbrev : 'k' },
            { single : 'år', plural : 'år', abbrev : 'år' },
            { single : 'tiår', plural : 'tiår', abbrev : 'tår' }
        ],
        unitAbbreviations : [
            ['mls'],
            ['s', 'sek'],
            ['m', 'min'],
            ['t', 't'],
            ['d'],
            ['u', 'uk'],
            ['må', 'mån', 'mdr'],
            ['k', 'kvart', 'kvt'],
            ['å', 'år'],
            ['dek']
        ],
        parsers : {
            L   : 'DD.MM.YYYY;',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number
    }
};

export default LocaleHelper.publishLocale(locale);
