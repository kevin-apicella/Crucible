import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Et',
    localeDesc : 'Eesti keel',
    localeCode : 'et',

    Object : {
        Yes    : 'Jah',
        No     : 'Ei',
        Cancel : 'Tühista',
        Ok     : 'OK',
        Week   : 'Nädal',
        None   : 'Mitte ühtegi'
    },

    ColorPicker : {
        noColor : 'Ühtegi värvi pole'
    },

    Combo : {
        noResults          : 'Tulemusi ei ole',
        recordNotCommitted : 'Kirjet ei saanud lisada',
        addNewValue        : value => `Lisa ${value}`
    },

    FilePicker : {
        file : 'Fail'
    },

    Field : {
        badInput              : 'Kehtetu välja väärtus',
        patternMismatch       : 'Väärtus peab klappima kindla mustriga',
        rangeOverflow         : value => `Väärtus peab olema järgmisest väiksem või sellega võrdne: ${value.max}`,
        rangeUnderflow        : value => `Väärtus peab olema järgmisest suurem või sellega võrdne: ${value.min}`,
        stepMismatch          : 'Väärtus peab mahtuma sammu',
        tooLong               : 'Väärtus peab olema lühem',
        tooShort              : 'Väärtus peab olema lühem',
        typeMismatch          : 'Väärtus peab olema kindlas vormingus',
        valueMissing          : 'See väli on kohustuslik',
        invalidValue          : 'Kehtetu välja väärtus',
        minimumValueViolation : 'Miinimumväärtuse rikkumine',
        maximumValueViolation : 'Maksimumväärtuse rikkumine',
        fieldRequired         : 'See väli on kohustuslik',
        validateFilter        : 'Väärtus tuleb valida loendist'
    },

    DateField : {
        invalidDate : 'Kehtetu kuupäeva sisend'
    },

    DatePicker : {
        gotoPrevYear  : 'Mine eelmisesse aastasse',
        gotoPrevMonth : 'Mine eemisesse kuusse',
        gotoNextMonth : 'Mine järgmisesse kuusse',
        gotoNextYear  : 'Mine järgmisesse aastasse'
    },

    NumberFormat : {
        locale   : 'et',
        currency : 'USD'
    },

    DurationField : {
        invalidUnit : 'Kehtetu üksus'
    },

    TimeField : {
        invalidTime : 'Kehtetu ajasisend'
    },

    TimePicker : {
        hour   : 'Tund',
        minute : 'Minut',
        second : 'sekund'
    },

    List : {
        loading   : 'Laadimine...',
        selectAll : 'Vali kõik'
    },

    GridBase : {
        loadMask : 'Laadimine...',
        syncMask : 'Muudatuste salvestamine, palun oodake...'
    },

    PagingToolbar : {
        firstPage         : 'Mine esimesele leheküljele',
        prevPage          : 'Mine eelmisele leheküljele',
        page              : 'Lehekülg',
        nextPage          : 'Mine järgmisele leheküljele',
        lastPage          : 'Mine viimasele leheküljele',
        reload            : 'Laadi uuesti praegune lehekülg',
        noRecords         : 'Kuvatavaid kirjeid ei ole',
        pageCountTemplate : data => `/ ${data.lastPage}`,
        summaryTemplate   : data => `Kuvab järgmisi kirjeid: ${data.start} - ${data.end} / ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Koonda',
        Expand   : 'Laienda'
    },

    Popup : {
        close : 'Sulge hüpikaken'
    },

    UndoRedo : {
        Undo           : 'Ennista',
        Redo           : 'Soorita uuesti',
        UndoLastAction : 'Ennista viimane toiming',
        RedoLastAction : 'Soorita uuesti viimane ennistatud toiming',
        NoActions      : 'Ennistamise järjekorras ei ole toiminguid'
    },

    FieldFilterPicker : {
        equals                 : 'võrdub',
        doesNotEqual           : 'ei võrdu',
        isEmpty                : 'on tühi',
        isNotEmpty             : 'ei ole tühi',
        contains               : 'sisaldab',
        doesNotContain         : 'ei sisalda',
        startsWith             : 'algab',
        endsWith               : 'lõpeb',
        isOneOf                : 'on üks järgmistest:',
        isNotOneOf             : 'ei ole üks järgmistest',
        isGreaterThan          : 'on suurem kui',
        isLessThan             : 'on väiksem kui',
        isGreaterThanOrEqualTo : 'on suurem/võrdne:',
        isLessThanOrEqualTo    : 'on väiksem/võrdne:',
        isBetween              : 'on vahemikus',
        isNotBetween           : 'ei ole vahemikus',
        isBefore               : 'on enne',
        isAfter                : 'on pärast',
        isToday                : 'on täna',
        isTomorrow             : 'on homme',
        isYesterday            : 'on eile',
        isThisWeek             : 'on sel nädalal',
        isNextWeek             : 'on järgmisel nädalal',
        isLastWeek             : 'on eelmisel nädalal',
        isThisMonth            : 'on sel kuul',
        isNextMonth            : 'on järgmisel kuul',
        isLastMonth            : 'on eelmisel kuul',
        isThisYear             : 'on sel aastal',
        isNextYear             : 'on järgmisel aastal',
        isLastYear             : 'on eelmisel aastal',
        isYearToDate           : 'on sel aastal praeguse hetkeni',
        isTrue                 : 'on tõene',
        isFalse                : 'on väär',
        selectAProperty        : 'Valige vara',
        selectAnOperator       : 'Valige operaator',
        caseSensitive          : 'Tõusutundlik',
        and                    : 'ja',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Valige väärtus',
        selectOneOrMoreValues  : 'Valige üks või mitu väärtust',
        enterAValue            : 'Sisestage väärtus',
        enterANumber           : 'Sisestage number',
        selectADate            : 'Valige kuupäev',
        selectATime            : 'Valige aeg'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Lisa filter'
    },

    DateHelper : {
        locale         : 'et',
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
            { single : 'sekund', plural : 'sekunds', abbrev : 's' },
            { single : 'minut', plural : 'minutit', abbrev : 'min' },
            { single : 'tund', plural : 'tundi', abbrev : 'h' },
            { single : 'päev', plural : 'päeva', abbrev : 'p' },
            { single : 'nädal', plural : 'nädalat', abbrev : 'n' },
            { single : 'kuu', plural : 'kuud', abbrev : 'k' },
            { single : 'kvartal', plural : 'kvartalit', abbrev : 'kv' },
            { single : 'aasta', plural : 'aastat', abbrev : 'a' },
            { single : 'kümnend', plural : 'kümnendit', abbrev : 'kü' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'sek'],
            ['m', 'min'],
            ['h', 'hr'],
            ['p'],
            ['n', 'nd'],
            ['k', 'ku', 'kuu'],
            ['kv', 'kva', 'kvrt'],
            ['a', 'aa'],
            ['küm']
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.'
    }
};

export default LocaleHelper.publishLocale(locale);
