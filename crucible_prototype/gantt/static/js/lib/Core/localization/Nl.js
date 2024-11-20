import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Nl',
    localeDesc : 'Nederlands',
    localeCode : 'nl',

    Object : {
        Yes    : 'Ja',
        No     : 'Nee',
        Cancel : 'Annuleren',
        Ok     : 'OK',
        Week   : 'Week',
        None   : 'Geen'
    },

    ColorPicker : {
        noColor : 'Geen kleur'
    },

    Combo : {
        noResults          : 'Geen resultaten',
        recordNotCommitted : 'Record kan niet worden toegevoegd',
        addNewValue        : value => `${value} toevoegen`
    },

    FilePicker : {
        file : 'Vijl'
    },

    Field : {
        badInput              : 'Ongeldige veldwaarde',
        patternMismatch       : 'Waarde moet overeenkomen met een specifiek patroon',
        rangeOverflow         : value => `Waarde moet kleiner zijn dan of gelijk aan ${value.max}`,
        rangeUnderflow        : value => `Waarde moet groter zijn dan of gelijk aan ${value.min}`,
        stepMismatch          : 'Waarde moet bij de stap passen',
        tooLong               : 'Waarde moet korter zijn',
        tooShort              : 'Waarde moet langer zijn',
        typeMismatch          : 'Waarde moet een speciaal formaat hebben',
        valueMissing          : 'Dit veld is verplicht',
        invalidValue          : 'Ongeldige veldwaarde',
        minimumValueViolation : 'Minimale waarde schending',
        maximumValueViolation : 'Maximale waarde schending',
        fieldRequired         : 'Dit veld is verplicht',
        validateFilter        : 'Waarde moet worden geselecteerd in de lijst'
    },

    DateField : {
        invalidDate : 'Ongeldige datuminvoer'
    },

    DatePicker : {
        gotoPrevYear  : 'Ga naar vorig jaar',
        gotoPrevMonth : 'Ga naar vorige maand',
        gotoNextMonth : 'Ga naar volgende maand',
        gotoNextYear  : 'Ga naar volgend jaar'
    },

    NumberFormat : {
        locale   : 'nl',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Ongeldige eenheid'
    },

    TimeField : {
        invalidTime : 'Ongeldige tijdsinvoer'
    },

    TimePicker : {
        hour   : 'Uur',
        minute : 'Minuut',
        second : 'Seconde'
    },

    List : {
        loading   : 'Laden...',
        selectAll : 'Alles selecteren'
    },

    GridBase : {
        loadMask : 'Laden...',
        syncMask : 'Bezig met opslaan...'
    },

    PagingToolbar : {
        firstPage         : 'Ga naar de eerste pagina',
        prevPage          : 'Ga naar de vorige pagina',
        page              : 'Pagina',
        nextPage          : 'Ga naar de volgende pagina',
        lastPage          : 'Ga naar de laatste pagina',
        reload            : 'Laad huidige pagina opnieuw',
        noRecords         : 'Geen rijen om weer te geven',
        pageCountTemplate : data => `van ${data.lastPage}`,
        summaryTemplate   : data => `Records ${data.start} - ${data.end} van ${data.allCount} worden weergegeven`
    },

    PanelCollapser : {
        Collapse : 'Klap in',
        Expand   : 'Klap uit'
    },

    Popup : {
        close : 'Sluiten'
    },

    UndoRedo : {
        Undo           : 'Ongedaan maken',
        Redo           : 'Opnieuw doen',
        UndoLastAction : 'Maak de laatste actie ongedaan',
        RedoLastAction : 'Herhaal de laatste ongedaan gemaakte actie',
        NoActions      : 'Geen items om ongedaan te maken'
    },

    FieldFilterPicker : {
        equals                 : 'gelijk',
        doesNotEqual           : 'niet gelijk',
        isEmpty                : 'is leeg',
        isNotEmpty             : 'is niet leeg',
        contains               : 'bevat',
        doesNotContain         : 'bevat geen',
        startsWith             : 'begint met',
        endsWith               : 'eindigt met',
        isOneOf                : 'is een van',
        isNotOneOf             : 'is niet een van',
        isGreaterThan          : 'is groter dan',
        isLessThan             : 'is kleiner dan',
        isGreaterThanOrEqualTo : 'is groter of gelijk aan',
        isLessThanOrEqualTo    : 'is kleiner of gelijk aan',
        isBetween              : 'zit tussen',
        isNotBetween           : 'zit niet tussen',
        isBefore               : 'is voor',
        isAfter                : 'is na',
        isToday                : 'is vandaag',
        isTomorrow             : 'is morgen',
        isYesterday            : 'is gisteren',
        isThisWeek             : 'is deze week',
        isNextWeek             : 'is volgende week',
        isLastWeek             : 'is afgelopen week',
        isThisMonth            : 'is deze maand',
        isNextMonth            : 'is volgende maand',
        isLastMonth            : 'is vorige maand',
        isThisYear             : 'is dit jaar',
        isNextYear             : 'is volgend jaar',
        isLastYear             : 'is vorige jaar',
        isYearToDate           : 'is dit jaar tot vandaag',
        isTrue                 : 'is waar',
        isFalse                : 'is niet waar',
        selectAProperty        : 'Selecteer een veld',
        selectAnOperator       : 'Selecteer een operator',
        caseSensitive          : 'Hoofdletter gevoelig',
        and                    : 'en',
        dateFormat             : 'D/M/YYYY',
        selectValue            : 'Selecteer waarde',
        selectOneOrMoreValues  : 'Selecteer een of meer waarden',
        enterAValue            : 'Voer een waarde in',
        enterANumber           : 'Voer een getal in',
        selectADate            : 'Selecteer een datum',
        selectATime            : 'Selecteer tijd'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Voeg filter toe'
    },

    DateHelper : {
        locale         : 'nl',
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
            { single : 'ms', plural : 'ms', abbrev : 'ms' },
            { single : 'seconde', plural : 'seconden', abbrev : 's' },
            { single : 'minuut', plural : 'minuten', abbrev : 'm' },
            { single : 'uur', plural : 'uren', abbrev : 'u' },
            { single : 'dag', plural : 'dagen', abbrev : 'd' },
            { single : 'week', plural : 'weken', abbrev : 'w' },
            { single : 'maand', plural : 'maanden', abbrev : 'ma' },
            { single : 'kwartaal', plural : 'kwartalen', abbrev : 'kw' },
            { single : 'jaar', plural : 'jaren', abbrev : 'j' },
            { single : 'decennium', plural : 'decennia', abbrev : 'dec' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'sec'],
            ['m', 'min'],
            ['u'],
            ['d'],
            ['w', 'wk'],
            ['ma', 'mnd', 'm'],
            ['k', 'kwar', 'kwt', 'kw'],
            ['j', 'jr'],
            ['dec']
        ],
        parsers : {
            L   : 'DD-MM-YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => number
    }
};

export default LocaleHelper.publishLocale(locale);
