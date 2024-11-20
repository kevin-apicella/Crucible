import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Sl',
    localeDesc : 'Slovensko',
    localeCode : 'sl',

    Object : {
        Yes    : 'Da',
        No     : 'Ne',
        Cancel : 'Prekliči',
        Ok     : 'OK',
        Week   : 'Teden',
        None   : 'Brez'
    },

    ColorPicker : {
        noColor : 'Brez barve'
    },

    Combo : {
        noResults          : 'Ni rezultatov',
        recordNotCommitted : 'Zapisa ni bilo mogoče dodati',
        addNewValue        : value => ` Dodajte ${value}`
    },

    FilePicker : {
        file : 'Datoteka'
    },

    Field : {
        badInput              : 'Neveljavna vrednost polja',
        patternMismatch       : 'Vrednost se mora ujemati z določenim vzorcem',
        rangeOverflow         : value => ` Vrednost mora biti manjša ali enaka ${value.max}`,
        rangeUnderflow        : value => ` Vrednost mora biti večja ali enaka ${value.min}`,
        stepMismatch          : 'Vrednost mora ustrezati koraku',
        tooLong               : 'Vrednost naj bo krajša',
        tooShort              : 'Vrednost naj bo daljša',
        typeMismatch          : 'Vrednost mora biti v posebni obliki',
        valueMissing          : 'To polje je obvezno',
        invalidValue          : 'Neveljavna vrednost polja',
        minimumValueViolation : 'Kršitev najmanjše vrednosti',
        maximumValueViolation : 'Kršitev največje vrednosti',
        fieldRequired         : 'To polje je obvezno',
        validateFilter        : 'Vrednost mora biti izbrana s seznama'
    },

    DateField : {
        invalidDate : 'Neveljaven vnos datuma'
    },

    DatePicker : {
        gotoPrevYear  : 'Pojdi na prejšnje leto',
        gotoPrevMonth : 'Pojdi na prejšnji mesec',
        gotoNextMonth : 'Pojdi na naslednji mesec',
        gotoNextYear  : 'Pojdi na naslednje leto'
    },

    NumberFormat : {
        locale   : 'sl',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Neveljavna enota'
    },

    TimeField : {
        invalidTime : 'Neveljaven vnos časa'
    },

    TimePicker : {
        hour   : 'Ura',
        minute : 'Minuta',
        second : 'Drugi'
    },

    List : {
        loading   : 'Nalaganje...',
        selectAll : 'Izberi vse'
    },

    GridBase : {
        loadMask : 'Nalaganje...',
        syncMask : 'Shranjevanje sprememb, prosim počakajte ...'
    },

    PagingToolbar : {
        firstPage         : 'Pojdi na prvo stran',
        prevPage          : 'Pojdi na prejšnjo stran',
        page              : 'Stran',
        nextPage          : 'Pojdi na naslednjo stran',
        lastPage          : 'Pojdi na zadnjo stran',
        reload            : 'Znova naloži trenutno stran',
        noRecords         : 'Ni zapisov za prikaz',
        pageCountTemplate : data => `od ${data.lastPage}`,
        summaryTemplate   : data => ` Prikaz zapisov ${data.start} - ${data.end} od ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Strni',
        Expand   : 'Razširi'
    },

    Popup : {
        close : 'Zapri pojavno okno'
    },

    UndoRedo : {
        Undo           : 'Razveljavi',
        Redo           : 'Ponovno uveljav',
        UndoLastAction : 'Razveljavi zadnje dejanje',
        RedoLastAction : 'Ponovi zadnje razveljavljeno dejanje',
        NoActions      : 'V čakalni vrsti za razveljavitev ni elementov'
    },

    FieldFilterPicker : {
        equals                 : 'enako',
        doesNotEqual           : 'ni enako',
        isEmpty                : 'je prazno',
        isNotEmpty             : 'ni prazno',
        contains               : 'vsebuje',
        doesNotContain         : 'ne vsebuje',
        startsWith             : 'začne se z',
        endsWith               : 'konča se z',
        isOneOf                : 'je eden od',
        isNotOneOf             : 'ni eden od',
        isGreaterThan          : 'je večje kot',
        isLessThan             : 'je manjše kot',
        isGreaterThanOrEqualTo : 'je večje ali enako',
        isLessThanOrEqualTo    : 'je manjše ali enako',
        isBetween              : 'je vmes',
        isNotBetween           : 'ni vmes',
        isBefore               : 'je pred',
        isAfter                : 'je potem',
        isToday                : 'je danes',
        isTomorrow             : 'je jutri',
        isYesterday            : 'je včeraj',
        isThisWeek             : 'je ta teden',
        isNextWeek             : 'je naslednji teden',
        isLastWeek             : 'je prejšnji teden',
        isThisMonth            : 'je ta mesec',
        isNextMonth            : 'je naslednji mesec',
        isLastMonth            : 'je prejšnji mesec',
        isThisYear             : 'je to leto',
        isNextYear             : 'je naslednje leto',
        isLastYear             : 'je prejšnje leto',
        isYearToDate           : 'je leto do danes',
        isTrue                 : 'je res',
        isFalse                : 'je napačno',
        selectAProperty        : 'Izberite lastnost',
        selectAnOperator       : 'Izberite operaterja',
        caseSensitive          : 'Razlikuje med velikimi in malimi črkami',
        and                    : 'in',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Izberi vrednost',
        selectOneOrMoreValues  : 'Izberite eno ali več vrednosti',
        enterAValue            : 'Vnesite vrednost',
        enterANumber           : 'Vnesite številko',
        selectADate            : 'Izberite datum',
        selectATime            : 'Izberite čas'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Dodajte filter'
    },

    DateHelper : {
        locale         : 'sl',
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
            { single : 'milisekunda', plural : 'milisekunde', abbrev : 'ms' },
            { single : 'sekunda', plural : 'sekunde', abbrev : 's' },
            { single : 'minuta', plural : 'minute', abbrev : 'min' },
            { single : 'ura', plural : 'ure', abbrev : 'ur' },
            { single : 'dan', plural : 'dnevi', abbrev : 'd' },
            { single : 'teden', plural : 'tedni', abbrev : 't' },
            { single : 'mesec', plural : 'meseci', abbrev : 'm' },
            { single : 'četrtletje', plural : 'četrtletja', abbrev : 'četrt' },
            { single : 'leto', plural : 'leta', abbrev : 'l' },
            { single : 'desetletje', plural : 'desetletja', abbrev : 'des' }
        ],
        unitAbbreviations : [
            ['ms'],
            ['s', 'sek'],
            ['m', 'min'],
            ['ur', 'ur'],
            ['d'],
            ['t', 't'],
            ['m', 'm', 'm'],
            ['četrt', 'četrt', 'četrt'],
            ['l', 'l'],
            ['des']
        ],
        parsers : {
            L   : 'D. M. YYYY.',
            LT  : 'HH:mm ',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.'
    }
};

export default LocaleHelper.publishLocale(locale);
