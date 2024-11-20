import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Hr',
    localeDesc : 'Hrvatski',
    localeCode : 'hr',

    Object : {
        Yes    : 'Da',
        No     : 'Ne',
        Cancel : 'Otkaži',
        Ok     : 'U redu',
        Week   : 'Tjedan',
        None   : 'Nema'
    },

    ColorPicker : {
        noColor : 'Nema boje'
    },

    Combo : {
        noResults          : 'Nema rezultata',
        recordNotCommitted : 'Zapis nije moguće dodati',
        addNewValue        : value => `Dodaj ${value}`
    },

    FilePicker : {
        file : 'Datoteka'
    },

    Field : {
        badInput              : 'Nevažeća vrijednost polja',
        patternMismatch       : 'Vrijednost treba odgovarati određenom obrascu',
        rangeOverflow         : value => `Vrijednost treba biti manja ili jednaka ${value.max}`,
        rangeUnderflow        : value => `Vrijednost treba biti veća ili jednaka ${value.min}`,
        stepMismatch          : 'Vrijednost treba odgovarati koraku',
        tooLong               : 'Vrijednost treba biti kraća',
        tooShort              : 'Vrijednost treba biti duža',
        typeMismatch          : 'Vrijednost treba biti u određenom formatu',
        valueMissing          : 'Polje je obavezno',
        invalidValue          : 'Nevažeća vrijednost polja',
        minimumValueViolation : 'Pogreška minimalne vrijednosti',
        maximumValueViolation : 'Pogreška maksimalne vrijednosti',
        fieldRequired         : 'Polje je obavezno',
        validateFilter        : 'Vrijednost treba odabrati s popisa'
    },

    DateField : {
        invalidDate : 'Uneseni datum nije važeći'
    },

    DatePicker : {
        gotoPrevYear  : 'Idi na prethodnu godinu',
        gotoPrevMonth : 'Idi na prethodni mjesec',
        gotoNextMonth : 'Idi na sljedeći mjesec',
        gotoNextYear  : 'Idi na sljedeću godinu'
    },

    NumberFormat : {
        locale   : 'hr',
        currency : 'HRK'
    },

    DurationField : {
        invalidUnit : 'Nevažeća jedinica'
    },

    TimeField : {
        invalidTime : 'Unos vremena nije važeći'
    },

    TimePicker : {
        hour   : 'Sat',
        minute : 'Minuta',
        second : 'Sekunde'
    },

    List : {
        loading   : 'Učitavanje...',
        selectAll : 'Odaberi sve'
    },

    GridBase : {
        loadMask : 'Učitavanje...',
        syncMask : 'Spremanje promjena u tijeku, pričekajte...'
    },

    PagingToolbar : {
        firstPage         : 'Idi na prvu stranicu',
        prevPage          : 'Idi na prethodnu stranicu',
        page              : 'Stranica',
        nextPage          : 'Idi na sljedeću stranicu',
        lastPage          : 'Idi na posljednju stranicu',
        reload            : 'Ponovno učitaj trenutačnu stranicu',
        noRecords         : 'Nema zapisa za prikazivanje',
        pageCountTemplate : data => `od ${data.lastPage}`,
        summaryTemplate   : data => `Prikazivanje zapisa ${data.start} - ${data.end} od ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Sažmi',
        Expand   : 'Proširi'
    },

    Popup : {
        close : 'Zatvori skočni prozorčić'
    },

    UndoRedo : {
        Undo           : 'Poništi',
        Redo           : 'Vrati poništeno',
        UndoLastAction : 'Poništi posljednju radnju',
        RedoLastAction : 'Vrati posljednje poništenu radnju',
        NoActions      : 'Nema stavki u redoslijedu poništavanja'
    },

    FieldFilterPicker : {
        equals                 : 'jednako',
        doesNotEqual           : 'nije jednako',
        isEmpty                : 'prazno',
        isNotEmpty             : 'nije prazno',
        contains               : 'sadrži',
        doesNotContain         : 'ne sadrži',
        startsWith             : 'počinje s',
        endsWith               : 'završava s',
        isOneOf                : 'jedan je od',
        isNotOneOf             : 'nije jedan od',
        isGreaterThan          : 'veći je od',
        isLessThan             : 'manji je od',
        isGreaterThanOrEqualTo : 'je veći ili jednak',
        isLessThanOrEqualTo    : 'je manji ili jednak',
        isBetween              : 'je između',
        isNotBetween           : 'nije između',
        isBefore               : 'je prije',
        isAfter                : 'je nakon',
        isToday                : 'je danas',
        isTomorrow             : 'je sutra',
        isYesterday            : 'je jučer',
        isThisWeek             : 'je ovaj tjedan',
        isNextWeek             : 'je sljedeći tjedan',
        isLastWeek             : 'je prošli tjedan',
        isThisMonth            : 'je ovaj mjesec',
        isNextMonth            : 'je sljedeći mjesec',
        isLastMonth            : 'je zadnji mjesec',
        isThisYear             : 'je ove godine',
        isNextYear             : 'je sljedeće godine',
        isLastYear             : 'je prethodne godine',
        isYearToDate           : 'je godina do danas',
        isTrue                 : 'je istina',
        isFalse                : 'je neispravno',
        selectAProperty        : 'Odaberite nekretninu',
        selectAnOperator       : 'Odaberite operatera',
        caseSensitive          : 'Osjetljivo na velika i mala slova',
        and                    : 'i',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Odaberite vrijednost',
        selectOneOrMoreValues  : 'Odaberite jednu ili više vrijednosti',
        enterAValue            : 'Unos vrijednosti',
        enterANumber           : 'Unos broja',
        selectADate            : 'Odaberite datum',
        selectATime            : 'Odaberite vrijeme'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Dodaj filter'
    },

    DateHelper : {
        locale         : 'hr',
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
            { single : 'sat', plural : 'sati', abbrev : 'h' },
            { single : 'dan', plural : 'dani', abbrev : 'd' },
            { single : 'tjedan', plural : 'tjedni', abbrev : 'w' },
            { single : 'mjesec', plural : 'mjeseci', abbrev : 'mon' },
            { single : 'tromjesečje', plural : 'tromjesečja', abbrev : 'q' },
            { single : 'godina', plural : 'godine', abbrev : 'yr' },
            { single : 'desetljeće', plural : 'desetljeća', abbrev : 'dec' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'sec'],
            ['m', 'min'],
            ['h', 'hr'],
            ['d'],
            ['w', 'wk'],
            ['mo', 'mon', 'mnt'],
            ['q', 'quar', 'qrt'],
            ['y', 'yr'],
            ['dec']
        ],
        parsers : {
            L   : 'D.M.YYYY.',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.'
    }
};

export default LocaleHelper.publishLocale(locale);
