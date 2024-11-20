import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',

    Object : {
        Yes    : 'Ja',
        No     : 'Nein',
        Cancel : 'Abbrechen',
        Ok     : 'OK',
        Week   : 'Woche',
        None   : 'Keine'
    },

    ColorPicker : {
        noColor : 'Keine Farbe'
    },

    Combo : {
        noResults          : 'Keine Ergebnisse',
        recordNotCommitted : 'Datensatz konnte nicht hinzugefügt werden',
        addNewValue        : value => `Hinzufügen ${value}`
    },

    FilePicker : {
        file : 'Datei'
    },

    Field : {
        badInput              : 'Ungültiger Feldwert',
        patternMismatch       : 'Wert sollte einem bestimmten Muster entsprechen',
        rangeOverflow         : value => `Der Wert muss kleiner oder gleich sein als ${value.max}`,
        rangeUnderflow        : value => `Der Wert muss größer oder gleich sein als ${value.min}`,
        stepMismatch          : 'Der Wert sollte zum Schritt passen',
        tooLong               : 'Der Wert sollte kürzer sein',
        tooShort              : 'Wert sollte länger sein',
        typeMismatch          : 'Wert muss in einem speziellen Format vorliegen',
        valueMissing          : 'Dieses Feld ist erforderlich',
        invalidValue          : 'Ungültiger Feldwert',
        minimumValueViolation : 'Verletzung des Mindestwerts',
        maximumValueViolation : 'Verletzung des Maximalwerts',
        fieldRequired         : 'Dieses Feld ist erforderlich',
        validateFilter        : 'Wert muss aus der Liste ausgewählt werden'
    },

    DateField : {
        invalidDate : 'Ungültige Datumseingabe'
    },

    DatePicker : {
        gotoPrevYear  : 'Zum vorherigen Jahr gehen',
        gotoPrevMonth : 'Zum vorherigen Monat gehen',
        gotoNextMonth : 'Zum nächsten Monat gehen',
        gotoNextYear  : 'Zum nächsten Jahr gehen'
    },

    NumberFormat : {
        locale   : 'de-DE',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Ungültige Einheit'
    },

    TimeField : {
        invalidTime : 'Ungültige Zeiteingabe'
    },

    TimePicker : {
        hour   : 'Stunde',
        minute : 'Minute',
        second : 'Sekunde'
    },

    List : {
        loading   : 'Wird geladen...',
        selectAll : 'Alle auswählen'
    },

    GridBase : {
        loadMask : 'Wird geladen...',
        syncMask : 'Änderung werden gespeichert, bitte warten...'
    },

    PagingToolbar : {
        firstPage         : 'Zur ersten Seite gehen',
        prevPage          : 'Zur vorherigen Seite gehen',
        page              : 'Seite',
        nextPage          : 'Zur nächsten Seite gehen',
        lastPage          : 'Zur letzten Seite gehen',
        reload            : 'Aktuelle Seite neu laden',
        noRecords         : 'Keine Datensätze anzuzeigen',
        pageCountTemplate : data => `von ${data.lastPage}`,
        summaryTemplate   : data => ` Datensätze anzeigen ${data.start} - ${data.end} von ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Zusammenklappen',
        Expand   : 'Aufklappen'
    },

    Popup : {
        close : 'Popup schließen'
    },

    UndoRedo : {
        Undo           : 'Rückgängig machen',
        Redo           : 'Wiederholen',
        UndoLastAction : 'Letzte Aktion rückgängig machen',
        RedoLastAction : 'Letzte rückgängig gemachte Aktion wiederholen',
        NoActions      : 'Keine Einträge in der Rückgängig-Warteschlange'
    },

    FieldFilterPicker : {
        equals                 : 'ist gleich',
        doesNotEqual           : 'ist nicht gleich',
        isEmpty                : 'ist leer',
        isNotEmpty             : 'ist nicht leer',
        contains               : 'enthält',
        doesNotContain         : 'enthält nicht',
        startsWith             : 'beginnt mit',
        endsWith               : 'endet mit',
        isOneOf                : 'ist eins von',
        isNotOneOf             : 'ist nicht eins von',
        isGreaterThan          : 'ist größer als',
        isLessThan             : 'ist kleiner als',
        isGreaterThanOrEqualTo : 'ist größer oder gleich wie',
        isLessThanOrEqualTo    : 'ist kleiner oder gleich wie',
        isBetween              : 'ist zwischen',
        isNotBetween           : 'ist nicht zwischen',
        isBefore               : 'ist vor',
        isAfter                : 'ist nach',
        isToday                : 'ist heute',
        isTomorrow             : 'ist morgen',
        isYesterday            : 'ist gestern',
        isThisWeek             : 'ist diese Woche',
        isNextWeek             : 'ist nächste Woche',
        isLastWeek             : 'ist letzte Woche',
        isThisMonth            : 'ist dieser Monat',
        isNextMonth            : 'ist nächster Monat',
        isLastMonth            : 'ist letzter Monat',
        isThisYear             : 'ist dieses Jahr',
        isNextYear             : 'ist nächstes Jahr',
        isLastYear             : 'ist letztes Jahr',
        isYearToDate           : 'ist Jahr bis dato',
        isTrue                 : 'ist wahr',
        isFalse                : 'ist falsch',
        selectAProperty        : 'Eine Eigenschaft auswählen',
        selectAnOperator       : 'Einen Operator auswählen',
        caseSensitive          : 'Groß-/Kleinschreibung',
        and                    : 'und',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Wert auswählen',
        selectOneOrMoreValues  : 'Einen oder mehrere Wert(e) auswählen',
        enterAValue            : 'Einen Wert eingeben',
        enterANumber           : 'Eine Zahl eingeben',
        selectADate            : 'Ein Datum auswählen',
        selectATime            : 'Uhrzeit auswählen'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Filter hinzufügen'
    },

    DateHelper : {
        locale         : 'de-DE',
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
            { single : 'millisekunde', plural : 'ms', abbrev : 'ms' },
            { single : 'sekunde', plural : 'sekunden', abbrev : 's' },
            { single : 'minute', plural : 'minuten', abbrev : 'min' },
            { single : 'stunde', plural : 'stunden', abbrev : 'std' },
            { single : 'tag', plural : 'tage', abbrev : 't' },
            { single : 'woche', plural : 'wochen', abbrev : 'w' },
            { single : 'monat', plural : 'monate', abbrev : 'mon' },
            { single : 'quartal', plural : 'quartale', abbrev : 'q' },
            { single : 'jahr', plural : 'jahre', abbrev : 'yr' },
            { single : 'jahrzehnt', plural : 'jahrzehnte', abbrev : 'jahrz' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'sek'],
            ['m', 'min'],
            ['std', 'hr'],
            ['t'],
            ['w', 'wn'],
            ['mo', 'mon', 'mnt'],
            ['q', 'quar', 'qrt'],
            ['j', 'jr'],
            ['jahrz']
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => number + '.'
    }
};

export default LocaleHelper.publishLocale(locale);
