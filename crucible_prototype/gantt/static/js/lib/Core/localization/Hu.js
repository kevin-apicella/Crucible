import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Hu',
    localeDesc : 'Magyar',
    localeCode : 'hu',

    Object : {
        Yes    : 'Igen',
        No     : 'Nem',
        Cancel : 'Mégse',
        Ok     : 'OK',
        Week   : 'Hét',
        None   : 'Nincs'
    },

    ColorPicker : {
        noColor : 'Nincs szín'
    },

    Combo : {
        noResults          : 'Nincs eredmény',
        recordNotCommitted : 'A bejegyzés nem adható hozzá',
        addNewValue        : value => `${value} hozzáadása`
    },

    FilePicker : {
        file : 'Fájl'
    },

    Field : {
        badInput              : 'A mező értéke érvénytelen',
        patternMismatch       : 'Az értéknek illeszkednie kell egy adott mintába',
        rangeOverflow         : value => `Az érték legyen kisebb vagy egyenlő mint ${value.max}`,
        rangeUnderflow        : value => `Az érték legyen nagyobb vagy egyenlő mint ${value.min}`,
        stepMismatch          : 'Az értéknek illeszkednie kell a lépésbe',
        tooLong               : 'Az érték legyen rövidebb',
        tooShort              : 'Az érték legyen hosszabb',
        typeMismatch          : 'Az értéknek speciális formátumúnak kell lennie',
        valueMissing          : 'A mező kitöltése kötelező',
        invalidValue          : 'A mező értéke érvénytelen',
        minimumValueViolation : 'Minimumérték hiba',
        maximumValueViolation : 'Maximumérték hiba',
        fieldRequired         : 'A mező kitöltése kötelező',
        validateFilter        : 'Az értéket a listáról kell kiválasztani'
    },

    DateField : {
        invalidDate : 'Érvénytelen dátumérték'
    },

    DatePicker : {
        gotoPrevYear  : 'Ugrás az előző évre',
        gotoPrevMonth : 'Ugrás az előző hónapra',
        gotoNextMonth : 'Ugrás a következő hónapra',
        gotoNextYear  : 'Ugrás a következő évre'
    },

    NumberFormat : {
        locale   : 'hu',
        currency : 'HUF'
    },

    DurationField : {
        invalidUnit : 'Érvénytelen egység'
    },

    TimeField : {
        invalidTime : 'Érvénytelen időérték'
    },

    TimePicker : {
        hour   : 'Óra',
        minute : 'Perc',
        second : 'Másodperc'
    },

    List : {
        loading   : 'Betöltés...',
        selectAll : 'Összes kiválasztása'
    },

    GridBase : {
        loadMask : 'Betöltés...',
        syncMask : 'Módosítások mentése, várjon...'
    },

    PagingToolbar : {
        firstPage         : 'Ugrás az első oldalra',
        prevPage          : 'Ugrás az előző oldalra',
        page              : 'Oldal',
        nextPage          : 'Ugrás a következő oldalra',
        lastPage          : 'Ugrás az utolsó oldalra',
        reload            : 'Aktuális oldal újratöltése',
        noRecords         : 'Nincs megjeleníthető bejegyzés',
        pageCountTemplate : data => `/ ${data.lastPage}`,
        summaryTemplate   : data => `Megjelenített bejegyzések: ${data.start} - ${data.end} / ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Összecsukás',
        Expand   : 'Kibontás'
    },

    Popup : {
        close : 'Felugró ablak bezárása'
    },

    UndoRedo : {
        Undo           : 'Mégse',
        Redo           : 'Mégis',
        UndoLastAction : 'Utolsó művelet visszavonása',
        RedoLastAction : 'Utolsó művelet helyreállítása',
        NoActions      : 'Nincsen visszavonható művelet'
    },

    FieldFilterPicker : {
        equals                 : 'egyenlő',
        doesNotEqual           : 'nem egyenlő',
        isEmpty                : 'üres',
        isNotEmpty             : 'nem üres',
        contains               : 'tartalmazza',
        doesNotContain         : 'nem tartalmazza',
        startsWith             : 'ezzel kezdődik',
        endsWith               : 'ezzel végződik',
        isOneOf                : 'ezek egyike',
        isNotOneOf             : 'nem ezek egyike',
        isGreaterThan          : 'nagyobb mint',
        isLessThan             : 'kisebb mint',
        isGreaterThanOrEqualTo : 'nagyobb vagy egyenlő',
        isLessThanOrEqualTo    : 'kisebb vagy egyenlő',
        isBetween              : 'a következők közötti',
        isNotBetween           : 'nem a következők közötti',
        isBefore               : 'korábbi, mint',
        isAfter                : 'későbbi mint',
        isToday                : 'ma lesz',
        isTomorrow             : 'holnap lesz',
        isYesterday            : 'tegnap volt',
        isThisWeek             : 'ezen a héten lesz',
        isNextWeek             : 'következő héten lesz',
        isLastWeek             : 'múlt héten volt',
        isThisMonth            : 'ebben a hónapban lesz',
        isNextMonth            : 'következő hónapban lesz',
        isLastMonth            : 'múlt hónapban volt',
        isThisYear             : 'ebben az évben lesz',
        isNextYear             : 'következő évben lesz',
        isLastYear             : 'múlt évben volt',
        isYearToDate           : 'a dátum évében lesz',
        isTrue                 : 'igaz',
        isFalse                : 'hamis',
        selectAProperty        : 'Jelöljön ki egy tulajdonságot',
        selectAnOperator       : 'Válasszon egy kezelőt',
        caseSensitive          : 'Kis- és nagybetűk felismerése',
        and                    : 'és',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Válasszon értéket',
        selectOneOrMoreValues  : 'Válasszon ki legalább egy értéket',
        enterAValue            : 'Adjon meg egy értéket',
        enterANumber           : 'Adjon meg egy számot',
        selectADate            : 'Válasszon ki egy dátumot',
        selectATime            : 'Válassz időt'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Szűrő hozzáadása'
    },

    DateHelper : {
        locale         : 'hu',
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
            { single : 'milliszekundum', plural : 'ms', abbrev : 'ms' },
            { single : 'másodperc', plural : 'másodpercs', abbrev : 'mp' },
            { single : 'perc', plural : 'perc', abbrev : 'p' },
            { single : 'óra', plural : 'óra', abbrev : 'ó' },
            { single : 'nap', plural : 'nap', abbrev : 'n' },
            { single : 'hét', plural : 'hét', abbrev : 'h' },
            { single : 'hónap', plural : 'hónap', abbrev : 'hó' },
            { single : 'negyedév', plural : 'negyedév', abbrev : 'n.é.' },
            { single : 'év', plural : 'év', abbrev : 'év' },
            { single : 'évtized', plural : 'évtized', abbrev : 'é.t.' }
        ],
        unitAbbreviations : [
            ['ms'],
            ['mp', 'mp'],
            ['p', 'perc'],
            ['ó', 'ó'],
            ['n'],
            ['h', 'h'],
            ['h', 'hó', 'hn'],
            ['né', 'n.év', 'n.é.'],
            ['é', 'év'],
            ['évt.']
        ],
        parsers : {
            L   : 'YYYY. MM. DD.',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.'
    }
};

export default LocaleHelper.publishLocale(locale);
