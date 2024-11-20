import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Sk',
    localeDesc : 'Slovenský',
    localeCode : 'sk',

    Object : {
        Yes    : 'Áno',
        No     : 'Nie',
        Cancel : 'Zrušiť',
        Ok     : 'OK',
        Week   : 'Týždeň',
        None   : 'Žiadny'
    },

    ColorPicker : {
        noColor : 'Žiadna farba'
    },

    Combo : {
        noResults          : 'Žiadne výsledky',
        recordNotCommitted : 'Záznam sa nepodarilo pridať',
        addNewValue        : value => `Pridať ${value}`
    },

    FilePicker : {
        file : 'Súbor'
    },

    Field : {
        badInput              : 'Neplatná hodnota poľa',
        patternMismatch       : 'Hodnota by sa mala zhodovať so špecifickým vzorom',
        rangeOverflow         : value => `Hodnota mus byť menšia alebo rovná ${value.max}`,
        rangeUnderflow        : value => `Hodnota musí byť väčšia alebo rovná ${value.min}`,
        stepMismatch          : 'Hodnota by sa mala zhodovať s krokom',
        tooLong               : 'Hodnota by mala byť kratšia',
        tooShort              : 'Hodnota by mala byť dlhšia',
        typeMismatch          : 'Požaduje sa, aby hodnota bola v špeciálnom formáte',
        valueMissing          : 'Toto políčko sa požaduje',
        invalidValue          : 'Neplatná hodnota políčka',
        minimumValueViolation : 'Narušenie minimálnej hodnoty',
        maximumValueViolation : 'Narušenie maximálnej hodnoty',
        fieldRequired         : 'Toto políčko sa požaduje',
        validateFilter        : 'Hodnota musí byť zvolená zo zoznamu'
    },

    DateField : {
        invalidDate : 'Vloženie neplatného dátumu'
    },

    DatePicker : {
        gotoPrevYear  : 'Prejsť na predchádzajúci rok',
        gotoPrevMonth : 'Prejsť na predchádzajúci mesiac',
        gotoNextMonth : 'Prejsť na nasledujúci mesiac',
        gotoNextYear  : 'Prejsť na nalsedujúci rok'
    },

    NumberFormat : {
        locale   : 'sk',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Neplatná jednotka'
    },

    TimeField : {
        invalidTime : 'Vloženie neplatného času'
    },

    TimePicker : {
        hour   : 'Hodina',
        minute : 'Minúta',
        second : 'Sekunda'
    },

    List : {
        loading   : 'Načítavanie...',
        selectAll : 'Vybrať všetko'
    },

    GridBase : {
        loadMask : 'Načítavanie...',
        syncMask : 'ukladajú sa zmeny, čakajte...'
    },

    PagingToolbar : {
        firstPage         : 'Prejsť na prvú stranu',
        prevPage          : 'Prejsť na predchádzajúcu stranu',
        page              : 'Strana',
        nextPage          : 'Prejsť na nasledujúcu stranu',
        lastPage          : 'Prejsť na poslednú stranu',
        reload            : 'Znovu načítať súčasnú stranu',
        noRecords         : 'Žiadne záznamy na zobrazenie',
        pageCountTemplate : data => `z ${data.lastPage}`,
        summaryTemplate   : data => `Zobrazujú sa záznamy ${data.start} - ${data.end} z ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Zbaliť',
        Expand   : 'Rozbaliť'
    },

    Popup : {
        close : 'Zatvoriť vyskakovacie okno'
    },

    UndoRedo : {
        Undo           : 'Vrátiť späť',
        Redo           : 'Znovu vykonať',
        UndoLastAction : 'Vrátiť späť poslednú akciu',
        RedoLastAction : 'Znovu urobiť poslednú nevykonanú akciu',
        NoActions      : 'Žiadne položky v rade na vrátenie späť'
    },

    FieldFilterPicker : {
        equals                 : 'rovná sa',
        doesNotEqual           : 'nerovná sa',
        isEmpty                : 'je prázdne',
        isNotEmpty             : 'nie je prázdne',
        contains               : 'obsahuje',
        doesNotContain         : 'neobsahuje',
        startsWith             : 'začína na',
        endsWith               : 'končí na',
        isOneOf                : 'je jeden z',
        isNotOneOf             : 'nie je jedno z',
        isGreaterThan          : 'je väčšie než',
        isLessThan             : 'je menšie než',
        isGreaterThanOrEqualTo : 'je väčšie alebo sa rovná',
        isLessThanOrEqualTo    : 'je menšie alebo sa rovná',
        isBetween              : 'je medzi',
        isNotBetween           : 'nie je medzi',
        isBefore               : 'je pred',
        isAfter                : 'je po',
        isToday                : 'je dnes',
        isTomorrow             : 'je zajtra',
        isYesterday            : 'je včera',
        isThisWeek             : 'je tento týždeň',
        isNextWeek             : 'je budúci týždeň',
        isLastWeek             : 'je minulý týždeň',
        isThisMonth            : 'je tento mesiac',
        isNextMonth            : 'je budúci mesiac',
        isLastMonth            : 'je minulý mesiac',
        isThisYear             : 'je tento rok',
        isNextYear             : 'je budúci rok',
        isLastYear             : 'je minulý rok',
        isYearToDate           : 'je rok do dnešného dňa',
        isTrue                 : 'je správne',
        isFalse                : 'je nesprávne',
        selectAProperty        : 'Vyberte vlastnosť',
        selectAnOperator       : 'Vyberte operátora',
        caseSensitive          : 'Rozlišuje malé a veľké písmená',
        and                    : 'a',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Vyberte hodnotu',
        selectOneOrMoreValues  : 'Vyberte jednu alebo viac hodnôt',
        enterAValue            : 'Zadajte hodnotu',
        enterANumber           : 'Zadajte číslo',
        selectADate            : 'Vyberte dátum',
        selectATime            : 'Vybrať čas'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Pridajte filter'
    },

    DateHelper : {
        locale         : 'sk',
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
            { single : 'milisekunda', plural : 'ms', abbrev : 'ms' },
            { single : 'sekunda', plural : 'sekundy', abbrev : 's' },
            { single : 'minúta', plural : 'minúty', abbrev : 'min' },
            { single : 'hodina', plural : 'hodiny', abbrev : 'h' },
            { single : 'deň', plural : 'dni', abbrev : 'd' },
            { single : 'týždeň', plural : 'týždne', abbrev : 'tžd' },
            { single : 'mesiac', plural : 'mesiace', abbrev : 'msc' },
            { single : 'štvrť', plural : 'štvrtiny', abbrev : '' },
            { single : 'rok', plural : 'roky', abbrev : 'rk' },
            { single : 'dekáda', plural : 'dekády', abbrev : 'dek' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'sec'],
            ['m', 'min'],
            ['h', 'h'],
            ['d'],
            ['tžd', 'tžd'],
            ['msc', 'msc', 'msc'],
            ['štvrť', 'štvrť', 'štvrť'],
            ['rk', 'rk'],
            ['dek']
        ],
        parsers : {
            L   : 'D. M. YYYY.',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.'
    }
};

export default LocaleHelper.publishLocale(locale);
