import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'SvSE',
    localeDesc : 'Svenska',
    localeCode : 'sv-SE',

    Object : {
        Yes    : 'Ja',
        No     : 'Nej',
        Cancel : 'Avbryt',
        Ok     : 'OK',
        Week   : 'Vecka',
        None   : 'Ingen'
    },

    ColorPicker : {
        noColor : 'Ingen färg'
    },

    Combo : {
        noResults          : 'Inga resultat',
        recordNotCommitted : 'Post kunde inte läggas till',
        addNewValue        : value => `Lägg till ${value}`
    },

    FilePicker : {
        file : 'Fil'
    },

    Field : {
        badInput              : 'Ogiltigt värde',
        patternMismatch       : 'Värdet ska matcha ett specifikt mönster',
        rangeOverflow         : value => `Värdet måste vara mindre än eller lika med ${value.max}`,
        rangeUnderflow        : value => `Värdet måste vara större än eller lika med ${value.min}`,
        stepMismatch          : 'Värdet bör passa steget',
        tooLong               : 'Värdet för långt',
        tooShort              : 'Värdet för kort',
        typeMismatch          : 'Värdet är inte i förväntat format',
        valueMissing          : 'Detta fält är obligatoriskt',
        invalidValue          : 'Ogiltigt värde',
        minimumValueViolation : 'För lågt värde',
        maximumValueViolation : 'För högt värde',
        fieldRequired         : 'Detta fält är obligatoriskt',
        validateFilter        : 'Värdet måste väljas från listan'
    },

    DateField : {
        invalidDate : 'Ogiltigt datum'
    },

    DatePicker : {
        gotoPrevYear  : 'Gå till föregående år',
        gotoPrevMonth : 'Gå till föregående månad',
        gotoNextMonth : 'Gå till nästa månad',
        gotoNextYear  : 'Gå till nästa år'
    },

    NumberFormat : {
        locale   : 'sv-SE',
        currency : 'SEK'
    },

    DurationField : {
        invalidUnit : 'Ogiltig enhet'
    },

    TimeField : {
        invalidTime : 'Ogiltig tid'
    },

    TimePicker : {
        hour   : 'Timme',
        minute : 'Minut',
        second : 'sekund'
    },

    List : {
        loading   : 'Laddar...',
        selectAll : 'Välj alla'
    },

    GridBase : {
        loadMask : 'Laddar...',
        syncMask : 'Sparar ändringar, vänligen vänta...'
    },

    PagingToolbar : {
        firstPage         : 'Gå till första sidan',
        prevPage          : 'Gå till föregående sida',
        page              : 'Sida',
        nextPage          : 'Gå till nästa sida',
        lastPage          : 'Gå till sista sidan',
        reload            : 'Ladda om den aktuella sidan',
        noRecords         : 'Inga rader att visa',
        pageCountTemplate : data => `av ${data.lastPage}`,
        summaryTemplate   : data => `Visar poster ${data.start} - ${data.end} av ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Fäll ihop',
        Expand   : 'Expandera'
    },

    Popup : {
        close : 'Stäng'
    },

    UndoRedo : {
        Undo           : 'Ångra',
        Redo           : 'Gör om',
        UndoLastAction : 'Ångra senaste åtgärden',
        RedoLastAction : 'Gör om senast ångrade åtgärden',
        NoActions      : 'Inga åtgärder inspelade'
    },

    FieldFilterPicker : {
        equals                 : 'är lika med',
        doesNotEqual           : 'är inte lika med',
        isEmpty                : 'är tom',
        isNotEmpty             : 'är inte tom',
        contains               : 'innehåller',
        doesNotContain         : 'innehåller inte',
        startsWith             : 'börjar med',
        endsWith               : 'slutar med',
        isOneOf                : 'är en av',
        isNotOneOf             : 'är inte en av',
        isGreaterThan          : 'är större än',
        isLessThan             : 'är mindre än',
        isGreaterThanOrEqualTo : 'är större än eller lika med',
        isLessThanOrEqualTo    : 'är mindre än eller lika med',
        isBetween              : 'är mellan',
        isNotBetween           : 'är inte mellan',
        isBefore               : 'är före',
        isAfter                : 'är efter',
        isToday                : 'är idag',
        isTomorrow             : 'är imorgon',
        isYesterday            : 'är igår',
        isThisWeek             : 'är denna vecka',
        isNextWeek             : 'är nästa vecka',
        isLastWeek             : 'är föregående vecka',
        isThisMonth            : 'är denna månad',
        isNextMonth            : 'är nästa månad',
        isLastMonth            : 'är föregående månad',
        isThisYear             : 'är i år',
        isNextYear             : 'är nästa år',
        isLastYear             : 'är föregående år',
        isYearToDate           : 'är i år fram till idag',
        isTrue                 : 'är sant',
        isFalse                : 'är falskt',
        selectAProperty        : 'Välj ett fält',
        selectAnOperator       : 'Välj en jämförelseoperator',
        caseSensitive          : 'Skiftlägeskänslig',
        and                    : 'och',
        dateFormat             : 'YYYY-MM-DD',
        selectValue            : 'Välj värde',
        selectOneOrMoreValues  : 'Välj ett eller flera värden',
        enterAValue            : 'Ange ett värde',
        enterANumber           : 'Ange ett nummer',
        selectADate            : 'Välj ett datum',
        selectATime            : 'Välj tid'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Lägg till filter'
    },

    DateHelper : {
        locale         : 'sv-SE',
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
            { single : 'millisekund', plural : 'millisekunder', abbrev : 'ms' },
            { single : 'sekund', plural : 'sekunder', abbrev : 's' },
            { single : 'minut', plural : 'minuter', abbrev : 'min' },
            { single : 'timme', plural : 'timmar', abbrev : 'tim' },
            { single : 'dag', plural : 'dagar', abbrev : 'd' },
            { single : 'vecka', plural : 'vecka', abbrev : 'v' },
            { single : 'månad', plural : 'månader', abbrev : 'mån' },
            { single : 'kvartal', plural : 'kvartal', abbrev : 'kv' },
            { single : 'år', plural : 'år', abbrev : 'år' },
            { single : 'årtionde', plural : 'årtionden', abbrev : 'årtionden' }
        ],
        unitAbbreviations : [
            ['ms', 'mil'],
            ['s', 'sek'],
            ['m', 'min'],
            ['t', 'tim', 'h'],
            ['d'],
            ['v', 've'],
            ['må', 'mån'],
            ['kv', 'kva'],
            [],
            []
        ],
        parsers : {
            L   : 'YYYY-MM-DD',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => {
            const lastDigit = number[number.length - 1];
            return number + (number !== '11' && number !== '12' && (lastDigit === '1' || lastDigit === '2') ? 'a' : 'e');
        }
    }
};

export default LocaleHelper.publishLocale(locale);
