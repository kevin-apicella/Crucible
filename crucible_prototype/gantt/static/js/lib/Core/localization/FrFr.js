import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',

    Object : {
        Yes    : 'Oui',
        No     : 'Non',
        Cancel : 'Annuler',
        Ok     : 'OK',
        Week   : 'Semaine',
        None   : 'Aucun'
    },

    ColorPicker : {
        noColor : 'Pas de couleur'
    },

    Combo : {
        noResults          : 'Aucun résultat',
        recordNotCommitted : "L'enregistrement n'a pas pu être ajouté",
        addNewValue        : value => `Ajouter ${value}`
    },

    FilePicker : {
        file : 'Fichier'
    },

    Field : {
        badInput              : 'Valeur de champ invalide',
        patternMismatch       : 'La valeur doit correspondre à un modèle spécifique',
        rangeOverflow         : value => `La valeur doit être inférieure ou égale à ${value.max}`,
        rangeUnderflow        : value => `La valeur doit être supérieure ou égale à ${value.min}`,
        stepMismatch          : 'La valeur doit correspondre au pas',
        tooLong               : 'La valeur doit être plus courte',
        tooShort              : 'La valeur doit être plus longue',
        typeMismatch          : 'La valeur doit respecter un format spécial',
        valueMissing          : 'Ce champ est requis',
        invalidValue          : 'Valeur de champ invalide',
        minimumValueViolation : 'Non-respect de la valeur minimale',
        maximumValueViolation : 'Non-respect de la valeur maximale',
        fieldRequired         : 'Ce champ est requis',
        validateFilter        : 'La valeur doit être sélectionnée dans la liste'
    },

    DateField : {
        invalidDate : 'Saisie de la date invalide'
    },

    DatePicker : {
        gotoPrevYear  : "Aller à l'année précédente",
        gotoPrevMonth : 'Aller au mois précédent',
        gotoNextMonth : 'Aller au mois suivant',
        gotoNextYear  : "Aller à l'année suivante"
    },

    NumberFormat : {
        locale   : 'fr-FR',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unité invalide'
    },

    TimeField : {
        invalidTime : "Saisie de l'heure invalide"
    },

    TimePicker : {
        hour   : 'Heure',
        minute : 'Minute',
        second : 'Seconde'
    },

    List : {
        loading   : 'Chargement en cours...',
        selectAll : 'Tout sélectionner'
    },

    GridBase : {
        loadMask : 'Chargement en cours...',
        syncMask : "Modifications en cours d'enregistrement, veuillez patienter..."
    },

    PagingToolbar : {
        firstPage         : 'Aller à la première page',
        prevPage          : 'Aller à la page précédente',
        page              : 'Page',
        nextPage          : 'Aller à la page suivante',
        lastPage          : 'Aller à la dernière page',
        reload            : 'Recharger la page en cours',
        noRecords         : 'Aucun enregistrement à afficher',
        pageCountTemplate : data => `sur ${data.lastPage}`,
        summaryTemplate   : data => `Affichage des enregistrements ${data.start} - ${data.end} sur ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Réduire',
        Expand   : 'Développer'
    },

    Popup : {
        close : 'Fermer la fenêtre Popup'
    },

    UndoRedo : {
        Undo           : 'Annuler',
        Redo           : 'Rétablir',
        UndoLastAction : 'Annuler la dernière action',
        RedoLastAction : 'Rétablir la dernière action annulée',
        NoActions      : "Aucun élément dans la file d'attente Annuler"
    },

    FieldFilterPicker : {
        equals                 : 'est égal à',
        doesNotEqual           : "n'est pas égal à",
        isEmpty                : 'est vide',
        isNotEmpty             : "n'est pas vide",
        contains               : 'contient',
        doesNotContain         : 'ne contient pas',
        startsWith             : 'commence par',
        endsWith               : 'finit par',
        isOneOf                : "est l'un de",
        isNotOneOf             : "n'est pas l'un de",
        isGreaterThan          : 'est supérieur à',
        isLessThan             : 'est inférieur à',
        isGreaterThanOrEqualTo : 'est supérieur ou égal à',
        isLessThanOrEqualTo    : 'est inférieur ou égal à',
        isBetween              : 'est entre',
        isNotBetween           : "n'est pas entre",
        isBefore               : 'est avant',
        isAfter                : 'est après',
        isToday                : "est aujourd'hui",
        isTomorrow             : 'est demain',
        isYesterday            : 'est hier',
        isThisWeek             : 'est cette semaine',
        isNextWeek             : 'est la semaine prochaine',
        isLastWeek             : 'est la semaine dernière',
        isThisMonth            : 'est ce mois',
        isNextMonth            : 'est le mois prochain',
        isLastMonth            : 'est le mois dernier',
        isThisYear             : 'est cette année',
        isNextYear             : "est l'anné prochaine",
        isLastYear             : "est l'année dernière",
        isYearToDate           : "est l'année à ce jour",
        isTrue                 : 'est vrai',
        isFalse                : 'est faux',
        selectAProperty        : 'Sélectionnez une propriété',
        selectAnOperator       : 'Sélectionnez un opérateur',
        caseSensitive          : 'Sensible à la casse',
        and                    : 'et',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Sélectionnez valeur',
        selectOneOrMoreValues  : 'Sélectionnez une ou plusieurs valeurs',
        enterAValue            : 'Entrez une valeur',
        enterANumber           : 'Entrez un nombre',
        selectADate            : 'Sélectionnez une date',
        selectATime            : "Sélectionnez l'heure"
    },

    FieldFilterPickerGroup : {
        addFilter : 'Ajouter un filtre'
    },

    DateHelper : {
        locale         : 'fr-FR',
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
            { single : 'milliseconde', plural : 'millisecondes', abbrev : 'ms' },
            { single : 'seconde', plural : 'secondes', abbrev : 's' },
            { single : 'minute', plural : 'minutes', abbrev : 'min' },
            { single : 'heure', plural : 'heures', abbrev : 'h' },
            { single : 'jour', plural : 'jours', abbrev : 'j' },
            { single : 'semaine', plural : 'semaines', abbrev : 's' },
            { single : 'mois', plural : 'mois', abbrev : 'm' },
            { single : 'trimestre', plural : 'trimestres', abbrev : 't' },
            { single : 'année', plural : 'années', abbrev : 'a' },
            { single : 'décennie', plural : 'décennies', abbrev : 'déc' }
        ],
        unitAbbreviations : [
            ['ms'],
            ['s', 's'],
            ['m', 'min'],
            ['h', 'h'],
            ['j'],
            ['s', 'sem'],
            ['m', 'mon'],
            ['T', 'trim'],
            ['a', 'an'],
            ['déc']
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const suffix = { 1 : 'er' }[number] || 'ème';
            return number + suffix;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
