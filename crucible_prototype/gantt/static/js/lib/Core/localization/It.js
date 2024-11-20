import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'It',
    localeDesc : 'Italiano',
    localeCode : 'it',

    Object : {
        Yes    : 'Sì',
        No     : 'No',
        Cancel : 'Annulla',
        Ok     : 'OK',
        Week   : 'Settimana',
        None   : 'Nessuno'
    },

    ColorPicker : {
        noColor : 'Nessun colore'
    },

    Combo : {
        noResults          : 'Nessun risultato',
        recordNotCommitted : 'Non è stato possibile aggiungere il record',
        addNewValue        : value => `Aggiungi ${value}`
    },

    FilePicker : {
        file : 'File'
    },

    Field : {
        badInput              : 'Valore del campo non valido',
        patternMismatch       : 'Il valore deve corrispondere a un modello specifico',
        rangeOverflow         : value => `Il valore deve essere uguale o inferiore a ${value.max}`,
        rangeUnderflow        : value => `Il valore deve essere uguale o superiore a ${value.min}`,
        stepMismatch          : 'Il valore deve adattarsi al passo',
        tooLong               : 'Il valore deve essere più breve',
        tooShort              : 'Il valore deve essere più lungo',
        typeMismatch          : 'Il valore deve essere in un formato speciale',
        valueMissing          : 'Questo campo è obbligatorio',
        invalidValue          : 'Valore del campo non valido',
        minimumValueViolation : 'Violazione del valore minimo',
        maximumValueViolation : 'Violazione del valore massimo',
        fieldRequired         : 'Questo campo è obbligatorio',
        validateFilter        : 'Il valore deve essere selezionato dall’elenco'
    },

    DateField : {
        invalidDate : 'Inserimento data non valido'
    },

    DatePicker : {
        gotoPrevYear  : 'Vai all’anno precedente',
        gotoPrevMonth : 'Vai al mese precedente',
        gotoNextMonth : 'Vai al mese successivo',
        gotoNextYear  : 'Vai all’anno successivo'
    },

    NumberFormat : {
        locale   : 'it',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unità non valida'
    },

    TimeField : {
        invalidTime : 'Inserimento ora non valido'
    },

    TimePicker : {
        hour   : 'Ora',
        minute : 'Minuto',
        second : 'Secondo'
    },

    List : {
        loading   : 'Caricamento...',
        selectAll : 'Seleziona tutto'
    },

    GridBase : {
        loadMask : 'Caricamento...',
        syncMask : 'Salvataggio delle modifiche, attendere prego...'
    },

    PagingToolbar : {
        firstPage         : 'Vai alla prima pagina',
        prevPage          : 'Vai alla pagina precedente',
        page              : 'Pagina',
        nextPage          : 'Vai alla pagina successiva',
        lastPage          : 'Vai all’ultima pagina',
        reload            : 'Ricarica la pagina corrente',
        noRecords         : 'Nessun record da visualizzare',
        pageCountTemplate : data => `di ${data.lastPage}`,
        summaryTemplate   : data => `Visualizzazione record ${data.start} - ${data.end} di ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Comprimi',
        Expand   : 'Espandi'
    },

    Popup : {
        close : 'Chiudi popup'
    },

    UndoRedo : {
        Undo           : 'Annulla',
        Redo           : 'Ripeti',
        UndoLastAction : 'Annulla l’ultima azione',
        RedoLastAction : 'Ripeti l’ultima azione annullata',
        NoActions      : 'Nessun elemento nella coda di annullamento'
    },

    FieldFilterPicker : {
        equals                 : 'uguale',
        doesNotEqual           : 'non uguale',
        isEmpty                : 'è vuoto',
        isNotEmpty             : 'non è vuoto',
        contains               : 'contiene',
        doesNotContain         : 'non contiene',
        startsWith             : 'inizia con',
        endsWith               : 'finisce con',
        isOneOf                : 'è uno di',
        isNotOneOf             : 'non è uno di',
        isGreaterThan          : 'è maggiore di',
        isLessThan             : 'è minore di',
        isGreaterThanOrEqualTo : 'è maggiore o uguale a',
        isLessThanOrEqualTo    : 'è minore o uguale a',
        isBetween              : 'è tra',
        isNotBetween           : 'non è tra',
        isBefore               : 'è prima',
        isAfter                : 'è dopo',
        isToday                : 'è oggi',
        isTomorrow             : 'è domani',
        isYesterday            : 'è ieri',
        isThisWeek             : 'è questa settimana',
        isNextWeek             : 'è la prossima settimana',
        isLastWeek             : 'è la settimana scorsa',
        isThisMonth            : 'è questo mese',
        isNextMonth            : 'è il prossimo mese',
        isLastMonth            : 'è il mese scorso',
        isThisYear             : "è quest'anno",
        isNextYear             : "è l'anno prossimo",
        isLastYear             : "è l'anno scorso",
        isYearToDate           : "è nell'ultimo anno",
        isTrue                 : 'è vero',
        isFalse                : 'è falso',
        selectAProperty        : 'Seleziona una proprietà',
        selectAnOperator       : 'Seleziona un operatore',
        caseSensitive          : 'Distingue tra maiuscole e minuscole',
        and                    : 'e',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Seleziona un valore',
        selectOneOrMoreValues  : 'Seleziona uno o più valori',
        enterAValue            : 'Inserisci un valore',
        enterANumber           : 'Inserisci un numero',
        selectADate            : 'Seleziona una data',
        selectATime            : 'Seleziona ora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Aggiungi filtro'
    },

    DateHelper : {
        locale         : 'it',
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
            { single : 'millisecondo', plural : 'millisecondi', abbrev : 'ms' },
            { single : 'secondo', plural : 'secondi', abbrev : 's' },
            { single : 'minuto', plural : 'minuti', abbrev : 'min' },
            { single : 'ora', plural : 'ore', abbrev : 'o' },
            { single : 'giorno', plural : 'giorni', abbrev : 'g' },
            { single : 'settimana', plural : 'settimane', abbrev : 'sett' },
            { single : 'mese', plural : 'mesi', abbrev : 'm' },
            { single : 'trimestre', plural : 'trimestri', abbrev : 'trim' },
            { single : 'anno', plural : 'anni', abbrev : 'a' },
            { single : 'decennio', plural : 'decenni', abbrev : 'dec' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 's'],
            ['m', 'm'],
            ['o', 'o'],
            ['gg'],
            ['sett', 'sett'],
            ['m', 'm'],
            ['trim', 'trim'],
            ['a', 'a'],
            ['dec']
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '°'
    }
};

export default LocaleHelper.publishLocale(locale);
