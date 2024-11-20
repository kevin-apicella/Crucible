import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Ro',
    localeDesc : 'Română',
    localeCode : 'ro',

    Object : {
        Yes    : 'Da',
        No     : 'Nu',
        Cancel : 'Anulare',
        Ok     : 'OK',
        Week   : 'Săptămână',
        None   : 'Niciun'
    },

    ColorPicker : {
        noColor : 'Fără culoare'
    },

    Combo : {
        noResults          : 'Niciun rezultat',
        recordNotCommitted : 'Nu s-a putut adăuga înregistrarea',
        addNewValue        : value => `Adăuga ${value}`
    },

    FilePicker : {
        file : 'Fișier'
    },

    Field : {
        badInput              : 'Valoare câmp nevalidă',
        patternMismatch       : 'Valoarea trebuie să se potrivească cu un șablon specific',
        rangeOverflow         : value => `Valoarea trebuie să fie mai mică sau egală cu ${value.max}`,
        rangeUnderflow        : value => `Valoarea trebuie să fie mai mare sau egală cu ${value.min}`,
        stepMismatch          : 'Valoarea trebuie să se potrivească cu pasul',
        tooLong               : 'Valoarea trebuie să fie mai scurtă',
        tooShort              : 'Valoarea trebuie să fie mai lungă',
        typeMismatch          : 'Valoarea trebuie să fie într-un format special',
        valueMissing          : 'Acest câmp este obligatoriu',
        invalidValue          : 'Valoare câmp nevalidă',
        minimumValueViolation : 'Încălcare a valorii minime',
        maximumValueViolation : 'Încălcare a valorii maxime',
        fieldRequired         : 'Acest câmp este obligatoriu',
        validateFilter        : 'Valoarea trebuie selectată din listă'
    },

    DateField : {
        invalidDate : 'Ați introdus o dată nevalidă'
    },

    DatePicker : {
        gotoPrevYear  : 'Mergeți la anul anterior',
        gotoPrevMonth : 'Mergeți la luna anterioară',
        gotoNextMonth : 'Mergeți la luna următoare',
        gotoNextYear  : 'Mergeți la anul următor'
    },

    NumberFormat : {
        locale   : 'ro',
        currency : 'RON'
    },

    DurationField : {
        invalidUnit : 'Unitate nevalidă'
    },

    TimeField : {
        invalidTime : 'Oră nevalidă introdusă'
    },

    TimePicker : {
        hour   : 'Oră',
        minute : 'Minut',
        second : 'Secunda'
    },

    List : {
        loading   : 'Se încarcă...',
        selectAll : 'Selectează tot'
    },

    GridBase : {
        loadMask : 'Se încarcă...',
        syncMask : 'Se salvează modificările, vă rugăm așteptați...'
    },

    PagingToolbar : {
        firstPage         : 'Mergeți la prima pagină',
        prevPage          : 'Mergeți la pagina anterioară',
        page              : 'Pagina',
        nextPage          : 'Mergeți la pagina următoare',
        lastPage          : 'Mergeți la ultima pagină',
        reload            : 'Reîncărcare pagină curentă',
        noRecords         : 'Nicio înregistrare de afișat',
        pageCountTemplate : data => `din${data.lastPage}`,
        summaryTemplate   : data => `Se afișează înregistrările ${data.start} - ${data.end} din ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Restrângere',
        Expand   : 'Extindere'
    },

    Popup : {
        close : 'Închidere popup'
    },

    UndoRedo : {
        Undo           : 'Anulare',
        Redo           : 'Refacere',
        UndoLastAction : 'Anulați ultima acțiune',
        RedoLastAction : 'Refaceți ultima acțiune anulată',
        NoActions      : 'Niciun element în coada de anulare'
    },

    FieldFilterPicker : {
        equals                 : 'egal',
        doesNotEqual           : 'nu este egal',
        isEmpty                : 'este gol',
        isNotEmpty             : 'nu este gol',
        contains               : 'conține',
        doesNotContain         : 'nu conține',
        startsWith             : 'începe cu',
        endsWith               : 'se termină cu',
        isOneOf                : 'face parte din',
        isNotOneOf             : 'nu face parte din',
        isGreaterThan          : 'este mai mare de',
        isLessThan             : 'este mai mic de',
        isGreaterThanOrEqualTo : 'este mai mare sau egal cu',
        isLessThanOrEqualTo    : 'este mai mic sau egal cu',
        isBetween              : 'este între',
        isNotBetween           : 'nu este între',
        isBefore               : 'este înainte',
        isAfter                : 'este după',
        isToday                : 'este azi',
        isTomorrow             : 'este mâine',
        isYesterday            : 'este ieri',
        isThisWeek             : 'este săptămâna aceasta',
        isNextWeek             : 'este săptămâna viitoare',
        isLastWeek             : 'este săptămâna trecută',
        isThisMonth            : 'este luna aceasta',
        isNextMonth            : 'este luna viitoare',
        isLastMonth            : 'este luna trecută',
        isThisYear             : 'este acest an',
        isNextYear             : 'este anul viitor',
        isLastYear             : 'este anul trecut',
        isYearToDate           : 'este anul acesta, până în prezent',
        isTrue                 : 'este adevărat',
        isFalse                : 'este fals',
        selectAProperty        : 'Selectați o proprietate',
        selectAnOperator       : 'Selectați un operator',
        caseSensitive          : 'Sensibil la litere mari şi mici',
        and                    : 'și',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Selectați valoare',
        selectOneOrMoreValues  : 'Selectați una sau mai multe valori',
        enterAValue            : 'Introduceți o valoare',
        enterANumber           : 'Introduceți un număr',
        selectADate            : 'Selectați o dată',
        selectATime            : 'Selectați ora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Adăugați filtru'
    },

    DateHelper : {
        locale         : 'ro',
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
            { single : 'millisecundă', plural : 'ms', abbrev : 'ms' },
            { single : 'secundă', plural : 'secunde', abbrev : 's' },
            { single : 'minut', plural : 'minute', abbrev : 'min' },
            { single : 'oră', plural : 'ore', abbrev : 'h' },
            { single : 'zi', plural : 'zile', abbrev : 'z' },
            { single : 'săptămână', plural : 'săptămâni', abbrev : 's' },
            { single : 'lună', plural : 'luni', abbrev : 'lu' },
            { single : 'trimestru', plural : 'trimestre', abbrev : 't' },
            { single : 'an', plural : 'ani', abbrev : 'an' },
            { single : 'decadă', plural : 'decade', abbrev : 'dec' }
        ],
        unitAbbreviations : [
            ['ms'],
            ['s', 'sec'],
            ['m', 'min'],
            ['h', 'h'],
            ['z'],
            ['s', 's'],
            ['lu', 'lun'],
            ['t', 'trim'],
            ['a', 'a'],
            ['dec']
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : (number, unit) => {
            let prefix = { 1 : '' }[number] || 'a ';
            let suffix = '-a';
            //Yo not used so far but legit to think it could
            if (unit === 'Qo' || unit === 'Yo') {
                prefix = { 1 : '' }[number] || 'al ';
                suffix = { 1 : '-ul' }[number] || '-lea';
            }
            return prefix + number + suffix;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
