import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Cs',
    localeDesc : 'Česky',
    localeCode : 'cs',

    Object : {
        Yes    : 'Ano',
        No     : 'Ne',
        Cancel : 'Zrušit',
        Ok     : 'OK',
        Week   : 'Týden',
        None   : 'Žádný'
    },

    ColorPicker : {
        noColor : 'žádná barva'
    },

    Combo : {
        noResults          : 'Žádné výsledky',
        recordNotCommitted : 'Záznam se nepodařilo přidat',
        addNewValue        : value => `Přidat ${value}`
    },

    FilePicker : {
        file : 'Soubor'
    },

    Field : {
        badInput              : 'Neplatná hodnota pole',
        patternMismatch       : 'Hodnota by měla odpovídat určitému vzoru',
        rangeOverflow         : value => `Hodnota musí být menší nebo rovna ${value.max}`,
        rangeUnderflow        : value => `Hodnota musí být větší nebo rovna ${value.min}`,
        stepMismatch          : 'Hodnota by měla odpovídat kroku',
        tooLong               : 'Hodnota by měla být kratší',
        tooShort              : 'Hodnota by měla být delší',
        typeMismatch          : 'Hodnota musí být ve zvláštním formátu',
        valueMissing          : 'Toto pole je povinné',
        invalidValue          : 'Neplatná hodnota pole',
        minimumValueViolation : 'Porušení minimální hodnoty',
        maximumValueViolation : 'Porušení maximální hodnoty',
        fieldRequired         : 'Toto pole je povinné',
        validateFilter        : 'Hodnota musí být vybrána ze seznamu'
    },

    DateField : {
        invalidDate : 'Neplatné zadání data'
    },

    DatePicker : {
        gotoPrevYear  : 'Přejít na předchozí rok',
        gotoPrevMonth : 'Přejít na předchozí měsíc',
        gotoNextMonth : 'Přejít na další měsíc',
        gotoNextYear  : 'Přejít na další rok'
    },

    NumberFormat : {
        locale   : 'cs',
        currency : 'CZK'
    },

    DurationField : {
        invalidUnit : 'Neplatná jednotka'
    },

    TimeField : {
        invalidTime : 'Neplatné zadání času'
    },

    TimePicker : {
        hour   : 'Hodina',
        minute : 'Minuta',
        second : 'Sekunda'
    },

    List : {
        loading   : 'Nahrávání...',
        selectAll : 'Vybrat vše'
    },

    GridBase : {
        loadMask : 'Nahrávání...',
        syncMask : 'Ukládání změn, čekejte, prosím...'
    },

    PagingToolbar : {
        firstPage         : 'Přejít na první stránku',
        prevPage          : 'Přejít na předchozí stránku',
        page              : 'Stránka',
        nextPage          : 'Přejít na další stránku',
        lastPage          : 'Přejít na poslední stránku',
        reload            : 'Znovu načíst aktuální stránku',
        noRecords         : 'Žádné záznamy k zobrazení',
        pageCountTemplate : data => `z ${data.lastPage}`,
        summaryTemplate   : data => `Zobrazení záznamů ${data.start} - ${data.end} z ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Sbalit',
        Expand   : 'Rozbalit'
    },

    Popup : {
        close : 'Zavřít vyskakovací okno'
    },

    UndoRedo : {
        Undo           : 'Vrátit',
        Redo           : 'Udělat znovu',
        UndoLastAction : 'Vrátit poslední akci',
        RedoLastAction : 'Udělat znovu poslední vrácenou akci',
        NoActions      : 'Žádné položky ve frontě vracení akcí'
    },

    FieldFilterPicker : {
        equals                 : 'rovná se',
        doesNotEqual           : 'nerovná se',
        isEmpty                : 'je prázdný',
        isNotEmpty             : 'není prázdný',
        contains               : 'obsahuje',
        doesNotContain         : 'neobsahuje',
        startsWith             : 'začíná na',
        endsWith               : 'končí na',
        isOneOf                : 'je jeden z',
        isNotOneOf             : 'není jeden z',
        isGreaterThan          : 'je větší než',
        isLessThan             : 'je menší než',
        isGreaterThanOrEqualTo : 'je větší než nebo se rovná',
        isLessThanOrEqualTo    : 'je menší než nebo se rovná',
        isBetween              : 'je mezi',
        isNotBetween           : 'není mezi',
        isBefore               : 'je před',
        isAfter                : 'je po',
        isToday                : 'je dnes',
        isTomorrow             : 'je zítra',
        isYesterday            : 'je včera',
        isThisWeek             : 'je tento týden',
        isNextWeek             : 'je příští týden',
        isLastWeek             : 'je minulý týden',
        isThisMonth            : 'je tento měsíc',
        isNextMonth            : 'je příští měsíc',
        isLastMonth            : 'je poslední měsíc',
        isThisYear             : 'je tento rok',
        isNextYear             : 'je příští rok',
        isLastYear             : 'je poslední rok',
        isYearToDate           : 'je od začátku roku',
        isTrue                 : 'je pravda',
        isFalse                : 'je lež',
        selectAProperty        : 'Vyberte vlastnost',
        selectAnOperator       : 'Vyberte operátora',
        caseSensitive          : 'Velká a malá písmena',
        and                    : 'a',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Vyberte hodnotu',
        selectOneOrMoreValues  : 'Vyberte jednu nebo více hodnot',
        enterAValue            : 'Zadejte hodnotu',
        enterANumber           : 'Zadejte číslo',
        selectADate            : 'Vyberte datum',
        selectATime            : 'Vyberte čas'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Přidat filtr'
    },

    DateHelper : {
        locale         : 'cs',
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
            { single : 'milisekunda', plural : 'milisekundy', abbrev : 'ms' },
            { single : 'sekunda', plural : 'sekundy', abbrev : 's' },
            { single : 'minuta', plural : 'minuty', abbrev : 'min' },
            { single : 'hodina', plural : 'hodiny', abbrev : 'h' },
            { single : 'den', plural : 'dny', abbrev : 'd' },
            { single : 'týden', plural : 'týdny', abbrev : 't' },
            { single : 'měsíc', plural : 'měsíce', abbrev : 'měs' },
            { single : 'čtvrtletí', plural : 'čtvrtletí', abbrev : 'č' },
            { single : 'rok', plural : 'roky', abbrev : 'r' },
            { single : 'desetiletí', plural : 'desetiletí', abbrev : 'des' }
        ],
        unitAbbreviations : [
            ['ms'],
            ['s', 'sek'],
            ['m', 'min'],
            ['h', 'hod'],
            ['d'],
            ['t', 'týd'],
            ['mě', 'měs', 'měsíce'],
            ['č', 'čtvr', 'čt'],
            ['r', 'ro'],
            ['des']
        ],
        parsers : {
            L   : 'D. M. YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number
    }
};

export default LocaleHelper.publishLocale(locale);
