import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Sr',
    localeDesc : 'Srpski',
    localeCode : 'sr',

    Object : {
        Yes    : 'Da',
        No     : 'Ne',
        Cancel : 'Otkaži',
        Ok     : 'OK',
        Week   : 'Nedelja',
        None   : 'Ништа'
    },

    ColorPicker : {
        noColor : 'Без боје'
    },

    Combo : {
        noResults          : 'Nema rezultata',
        recordNotCommitted : 'Rezultati nisu mogli biti dodati',
        addNewValue        : value => `Dodaj ${value}`
    },

    FilePicker : {
        file : 'Datoteka'
    },

    Field : {
        badInput              : 'Neispravna vrednost polja',
        patternMismatch       : 'Vrednost treba da odgovara određenom šablonu',
        rangeOverflow         : value => `Vrednost mora biti manja ili jednaka ${value.max}`,
        rangeUnderflow        : value => `Vrednost mora biti veća ili jednaka ${value.min}`,
        stepMismatch          : 'Vrednost treba da odgovara koraku',
        tooLong               : 'Vrednost treba da je kraća',
        tooShort              : 'Vrednost treba da je duža',
        typeMismatch          : 'Potrebno je da vrednost bude određenog formata',
        valueMissing          : 'Ovo polje je potrebno',
        invalidValue          : 'Neispravna vrednost polja',
        minimumValueViolation : 'Minimalna vrednost prekršaja',
        maximumValueViolation : 'Maksimalna vrednost prekršaja',
        fieldRequired         : 'Ovo polje je potrebno',
        validateFilter        : 'Vrednost mora da bude izabrana sa liste'
    },

    DateField : {
        invalidDate : 'Neispravni unos datuma'
    },

    DatePicker : {
        gotoPrevYear  : 'Idi na prethodnu godinu',
        gotoPrevMonth : 'Idi na prethodni mesec',
        gotoNextMonth : 'Idi na sledeći mesec',
        gotoNextYear  : 'Idi na sledeću godinu'
    },

    NumberFormat : {
        locale   : 'sr',
        currency : 'RSD'
    },

    DurationField : {
        invalidUnit : 'Neispravna jedinica'
    },

    TimeField : {
        invalidTime : 'Neispravan unos vremena'
    },

    TimePicker : {
        hour   : 'Sat',
        minute : 'Minut',
        second : 'Sekunda'
    },

    List : {
        loading   : 'Učitavanje...',
        selectAll : 'Odaberi sve'
    },

    GridBase : {
        loadMask : 'Učitavanje...',
        syncMask : 'Promene se čuvaju, molim sačekajte...'
    },

    PagingToolbar : {
        firstPage         : 'Idi na prvu stranu',
        prevPage          : 'Idi na prethodnu stranu',
        page              : 'Strana',
        nextPage          : 'Idi na sledeću stranu',
        lastPage          : 'Idi na poslednju stranu',
        reload            : 'Ponovo učitaj trenutnu stranu',
        noRecords         : 'Nema zapisa za prikaz',
        pageCountTemplate : data => `od ${data.lastPage}`,
        summaryTemplate   : data => `Prikazuju se zapisi ${data.start} - ${data.end} od ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Skupi',
        Expand   : 'Raširi'
    },

    Popup : {
        close : 'Zatvori iskačući prozor'
    },

    UndoRedo : {
        Undo           : 'Opozovi',
        Redo           : 'Ponovi',
        UndoLastAction : 'Opozovi poslednju radnju',
        RedoLastAction : 'Ponovi poslednju opozvanu radnju',
        NoActions      : 'Nema stavki u redu za opoziv'
    },

    FieldFilterPicker : {
        equals                 : 'jednako',
        doesNotEqual           : 'nije jednako',
        isEmpty                : 'je prazno',
        isNotEmpty             : 'nije prazno',
        contains               : 'sadrži',
        doesNotContain         : 'ne sadrži',
        startsWith             : 'počinje sa',
        endsWith               : 'završava sa',
        isOneOf                : 'je jedan od',
        isNotOneOf             : 'nije jedan od',
        isGreaterThan          : 'je veći od',
        isLessThan             : 'je manji od',
        isGreaterThanOrEqualTo : 'je veći ili jednak od',
        isLessThanOrEqualTo    : 'je manji ili jednak od',
        isBetween              : 'je između',
        isNotBetween           : 'nije između',
        isBefore               : 'je pre',
        isAfter                : 'je posle',
        isToday                : 'je danas',
        isTomorrow             : 'je sutra',
        isYesterday            : 'je juče',
        isThisWeek             : 'je ove nedelje',
        isNextWeek             : 'je sledeće nedelje',
        isLastWeek             : 'je prošle nedelje',
        isThisMonth            : 'je ovog meseca',
        isNextMonth            : 'je sledećeg meseca',
        isLastMonth            : 'je prošlog meseca',
        isThisYear             : 'je ove godine',
        isNextYear             : 'je sledeće godine',
        isLastYear             : 'je prošle godine',
        isYearToDate           : 'je od početka godine do danas',
        isTrue                 : 'je tačan',
        isFalse                : 'je netačan',
        selectAProperty        : 'Izaberite svojstvo',
        selectAnOperator       : 'Izaberite operatora',
        caseSensitive          : 'Osetljivo na mala i velika slova',
        and                    : 'i',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Izaberite vrednost',
        selectOneOrMoreValues  : 'Izaberite jednu ili više vrednosti',
        enterAValue            : 'Unesite vrednost',
        enterANumber           : 'Unesite broj',
        selectADate            : 'Izaberite datum',
        selectATime            : 'Izaberite vreme'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Dodajte filter'
    },

    DateHelper : {
        locale         : 'sr',
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
            { single : 'milisekund', plural : 'milisekundi', abbrev : 'ms' },
            { single : 'sekunda', plural : 'sekunde', abbrev : 's' },
            { single : 'minut', plural : 'minuta', abbrev : 'min' },
            { single : 'sat', plural : 'sati', abbrev : '' },
            { single : 'dan', plural : 'dana', abbrev : 'd' },
            { single : 'nedelja', plural : 'nedelje', abbrev : 'ned' },
            { single : 'mesec', plural : 'meseci', abbrev : 'mes' },
            { single : 'kvartal', plural : 'kvartala', abbrev : 'kv' },
            { single : 'godina', plural : 'godine', abbrev : 'god' },
            { single : 'dekada', plural : 'dekade', abbrev : 'dek' }
        ],
        unitAbbreviations : [
            ['ms'],
            ['s', 'sek'],
            ['m', 'min'],
            ['sat', 'sati'],
            ['d'],
            ['ned', 'ned'],
            ['mes', 'mes', 'mes'],
            ['kv', 'kv', 'kv'],
            ['g', 'god'],
            ['dek']
        ],
        parsers : {
            L   : 'D.M.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.'
    }
};

export default LocaleHelper.publishLocale(locale);
