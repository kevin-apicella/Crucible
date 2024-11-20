import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Pl',
    localeDesc : 'Polski',
    localeCode : 'pl',

    Object : {
        Yes    : 'Tak',
        No     : 'Nie',
        Cancel : 'Anuluj',
        Ok     : 'OK',
        Week   : 'Tydzień',
        None   : 'Brak'
    },

    ColorPicker : {
        noColor : 'Brak koloru'
    },

    Combo : {
        noResults          : 'Brak wyników',
        recordNotCommitted : 'Dokument nie mógł zostać dodany',
        addNewValue        : value => `Add ${value}`
    },

    FilePicker : {
        file : 'Plik'
    },

    Field : {
        badInput              : 'Nieprawidłowa wartość pola',
        patternMismatch       : 'Wartość powinna pasować do określonego wzorca',
        rangeOverflow         : value => `Wartość powinna być mniejsza lub równa ${value.max}`,
        rangeUnderflow        : value => `Wartość musi być większa lub równa ${value.min}`,
        stepMismatch          : 'Wartość powinna pasować do kroku',
        tooLong               : 'Wartość powinna być krótsza',
        tooShort              : 'Wartość powinna być dłuższa',
        typeMismatch          : 'Wartość musi być w specjalnym formacie',
        valueMissing          : 'To pole jest wymagane',
        invalidValue          : 'Nieprawidłowa wartość pola',
        minimumValueViolation : 'Naruszenie wartości minimalnej',
        maximumValueViolation : 'Naruszenie wartości maksymalnej',
        fieldRequired         : 'To pole jest wymagane',
        validateFilter        : 'Wartość należy wybrać z listy'
    },

    DateField : {
        invalidDate : 'Wpisano nieprawidłową datę'
    },

    DatePicker : {
        gotoPrevYear  : 'Przejdź do poprzedniego roku',
        gotoPrevMonth : 'Przejdź do poprzedniego miesiąca',
        gotoNextMonth : 'Przejdź do następnego miesiąca',
        gotoNextYear  : 'Przejdź do następnego roku'
    },

    NumberFormat : {
        locale   : 'pl',
        currency : 'PLN'
    },

    DurationField : {
        invalidUnit : 'Nieprawidłowa jednostka'
    },

    TimeField : {
        invalidTime : 'Nieprawidłowe wprowadzenie czasu'
    },

    TimePicker : {
        hour   : 'Godzina',
        minute : 'Minuta',
        second : 'Sekunda'
    },

    List : {
        loading   : 'Ładowanie…',
        selectAll : 'Zaznacz wszystko'
    },

    GridBase : {
        loadMask : 'Ładowanie…',
        syncMask : 'Zapisywanie zmian, proszę czekać…'
    },

    PagingToolbar : {
        firstPage         : 'Przejdź do pierwszej strony',
        prevPage          : 'Przejdź do poprzedniej strony',
        page              : 'Strona',
        nextPage          : 'Przejdź do następnej strony',
        lastPage          : 'Przejdź do ostatniej strony',
        reload            : 'Odśwież bieżącą stronę',
        noRecords         : 'Brak danych do wyświetlenia',
        pageCountTemplate : data => `z ${data.lastPage}`,
        summaryTemplate   : data => `Wyświetlanie danych ${data.start} - ${data.end} z ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Zwiń',
        Expand   : 'Rozwiń'
    },

    Popup : {
        close : 'Zamknij wyskakujące okienko'
    },

    UndoRedo : {
        Undo           : 'Cofnij',
        Redo           : 'Popraw',
        UndoLastAction : 'Cofnij ostatnie działanie',
        RedoLastAction : 'Popraw ostatnie cofnięte działanie',
        NoActions      : 'Brak elementów w kolejce cofania'
    },

    FieldFilterPicker : {
        equals                 : 'równa się',
        doesNotEqual           : 'nie równa się',
        isEmpty                : 'pusty',
        isNotEmpty             : 'nie jest pusty',
        contains               : 'zawiera',
        doesNotContain         : 'nie zawiera',
        startsWith             : 'zaczyna się od',
        endsWith               : 'kończy się',
        isOneOf                : 'należy do',
        isNotOneOf             : 'nie należy do',
        isGreaterThan          : 'jest większa niż',
        isLessThan             : 'jest mniejsza niż',
        isGreaterThanOrEqualTo : 'jest większa lub równa',
        isLessThanOrEqualTo    : 'jest mniejsza lub równa',
        isBetween              : 'jest pomiędzy',
        isNotBetween           : 'nie jest pomiędzy',
        isBefore               : 'jest przed',
        isAfter                : 'jest po',
        isToday                : 'jest dziś',
        isTomorrow             : 'jest jutro',
        isYesterday            : 'było wczoraj',
        isThisWeek             : 'jest w tym tygodniu',
        isNextWeek             : 'jest w następnym tygodniu',
        isLastWeek             : 'jest w zeszłym tygodniu',
        isThisMonth            : 'jest w tym miesiącu',
        isNextMonth            : 'jest w następnym miesiącu',
        isLastMonth            : 'jest w zeszłym miesiącu',
        isThisYear             : 'jest w tym roku',
        isNextYear             : 'jest w następnym roku',
        isLastYear             : 'jest w zeszłym roku',
        isYearToDate           : 'jest aktualna',
        isTrue                 : 'jest prawdziwa',
        isFalse                : 'jest fałszywa',
        selectAProperty        : 'Wybierz właściwość',
        selectAnOperator       : 'Wybierz operatora',
        caseSensitive          : 'Istotna wielkość liter',
        and                    : 'i',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Wybierz wartość',
        selectOneOrMoreValues  : 'Wybierz przynajmniej jedną wartość',
        enterAValue            : 'Wprowadź wartość',
        enterANumber           : 'Wprowadź numer',
        selectADate            : 'Wybierz datę',
        selectATime            : 'Wybierz czas'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Dodaj filtr'
    },

    DateHelper : {
        locale         : 'pl',
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
            { single : 'godzina', plural : 'godziny', abbrev : 'godz.' },
            { single : 'dzień', plural : 'dni', abbrev : 'd' },
            { single : 'tydzień', plural : 'tygodnie', abbrev : 'tyg.' },
            { single : 'miesiąc', plural : 'miesiące', abbrev : 'm.' },
            { single : 'kwartał', plural : 'kwartały', abbrev : 'kw.' },
            { single : 'rok', plural : 'lata', abbrev : 'r.' },
            { single : 'dekada', plural : 'dekady', abbrev : 'dek.' }
        ],
        unitAbbreviations : [
            ['mil.'],
            ['s', 'sek'],
            ['m', 'min.'],
            ['godz.', 'hr'],
            ['d'],
            ['t', 'tydz.'],
            ['m', 'mies.', 'mnt'],
            ['k', 'kw.', 'qrt'],
            ['r', 'rok'],
            ['dek.']
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
