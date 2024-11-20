import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'El',
    localeDesc : 'Ελληνικά',
    localeCode : 'el',

    Object : {
        Yes    : 'Ναι',
        No     : 'Όχι',
        Cancel : 'Ακύρωση',
        Ok     : 'ΟΚ',
        Week   : 'Εβδομάδα',
        None   : 'Κανένα'
    },

    ColorPicker : {
        noColor : 'Χωρίς χρώμα'
    },

    Combo : {
        noResults          : 'Κανένα αποτέλεσμα',
        recordNotCommitted : 'Δεν είναι δυνατή η προσθήκη της εγγραφής',
        addNewValue        : value => `Προσθήκη ${value}`
    },

    FilePicker : {
        file : 'Αρχείο'
    },

    Field : {
        badInput              : 'Μη έγκυρη τιμή πεδίου',
        patternMismatch       : 'Η τιμή πρέπει να ακολουθεί ένα συγκεκριμένο μοτίβο',
        rangeOverflow         : value => `Η τιμή πρέπει να είναι μικρότερη από ή ίση με ${value.max}`,
        rangeUnderflow        : value => `Η τιμή πρέπει να είναι μεγαλύτερη από ή ίση με ${value.min}`,
        stepMismatch          : 'Η τιμή πρέπει να ταιριάζει με το βήμα',
        tooLong               : 'Η τιμή πρέπει να είναι μικρότερη',
        tooShort              : 'Η τιμή πρέπει να είναι μεγαλύτερη',
        typeMismatch          : 'Η τιμή πρέπει να έχει συγκεκριμένη μορφή',
        valueMissing          : 'Το συγκεκριμένο πεδίο είναι υποχρεωτικό',
        invalidValue          : 'Μη έγκυρη τιμή πεδίου',
        minimumValueViolation : 'Παραβίαση ως προς την ελάχιστη τιμή',
        maximumValueViolation : 'Παραβίαση ως προς τη μέγιστη τιμή',
        fieldRequired         : 'Το συγκεκριμένο πεδίο είναι υποχρεωτικό',
        validateFilter        : 'Η τιμή πρέπει να επιλεγεί από τη λίστα'
    },

    DateField : {
        invalidDate : 'Μη έγκυρη ημερομηνία εισόδου'
    },

    DatePicker : {
        gotoPrevYear  : 'Μετάβαση στο προηγούμενο έτος',
        gotoPrevMonth : 'Μετάβαση στον προηγούμενο μήνα',
        gotoNextMonth : 'Μετάβαση στον επόμενο μήνα',
        gotoNextYear  : 'Μετάβαση στο επόμενο έτος'
    },

    NumberFormat : {
        locale   : 'el',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Μη έγκυρη μονάδα'
    },

    TimeField : {
        invalidTime : 'Μη έγκυρη είσοδος ώρα'
    },

    TimePicker : {
        hour   : 'Ώρες',
        minute : 'Λεπτά',
        second : 'Δευτερόλεπτο'
    },

    List : {
        loading   : 'Φορτώνει...',
        selectAll : 'Επιλογή όλων'
    },

    GridBase : {
        loadMask : 'Φορτώνει...',
        syncMask : 'Αποθήκευση αλλαγών, παρακαλώ περιμένετε...'
    },

    PagingToolbar : {
        firstPage         : 'Μετάβαση στην πρώτη σελίδα',
        prevPage          : 'Μετάβαση στην προηγούμενη σελίδα',
        page              : 'Σελίδα',
        nextPage          : 'Μετάβαση στην επόμενη σελίδα',
        lastPage          : 'Μετάβαση στην τελευταία σελίδα',
        reload            : 'Επαναφόρτωση της τρέχουσας σελίδας',
        noRecords         : 'Δεν υπάρχουν καταγραφές',
        pageCountTemplate : data => `από ${data.lastPage}`,
        summaryTemplate   : data => `Εμφάνιση καταγραφών ${data.start} - ${data.end} από ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Σύμπτυξη',
        Expand   : 'Ανάπτυξη'
    },

    Popup : {
        close : 'Κλείσιμο Αναδυόμενου Παραθύρου'
    },

    UndoRedo : {
        Undo           : 'Αναίρεση',
        Redo           : 'Επανάληψη',
        UndoLastAction : 'Αναίρεση της τελευταίας ενέργειας',
        RedoLastAction : 'Επανάληψη της τελευταίας αναιρεμένης ενέργειας',
        NoActions      : 'Δεν υπάρχουν αντικείμενα στην ουρά αναίρεσης'
    },

    FieldFilterPicker : {
        equals                 : 'ισούται με',
        doesNotEqual           : 'δεν ισούται με',
        isEmpty                : 'είναι κενό',
        isNotEmpty             : 'δεν είναι κενό',
        contains               : 'περιέχει',
        doesNotContain         : 'δεν περιέχει',
        startsWith             : 'αρχίζει με',
        endsWith               : 'τελειώνει με',
        isOneOf                : 'είναι ένα από',
        isNotOneOf             : 'δεν είναι ένα από',
        isGreaterThan          : 'είναι μεγαλύτερο από',
        isLessThan             : 'είναι μικρότερο από',
        isGreaterThanOrEqualTo : 'είναι μεγαλύτερο από ή ίσο με',
        isLessThanOrEqualTo    : 'είναι μικρότερο ή ίσο με',
        isBetween              : 'βρίσκεται μεταξύ',
        isNotBetween           : 'δεν βρίσκεται μεταξύ',
        isBefore               : 'προηγείται του',
        isAfter                : 'έπεται του',
        isToday                : 'είναι σήμερα',
        isTomorrow             : 'είναι αύριο',
        isYesterday            : 'είναι χθες',
        isThisWeek             : 'είναι αυτήν την εβδομάδα',
        isNextWeek             : 'είναι την επόμενη εβδομάδα',
        isLastWeek             : 'είναι την προηγούμενη εβδομάδα',
        isThisMonth            : 'είναι αυτόν το μήνα',
        isNextMonth            : 'είναι τον επόμενο μήνα',
        isLastMonth            : 'είναι τον προηγούμενο μήνα',
        isThisYear             : 'είναι αυτόν το χρόνο',
        isNextYear             : 'είναι τον επόμενο χρόνο',
        isLastYear             : 'είναι τον προηγούμενο χρόνο',
        isYearToDate           : 'είναι μέχρι σήμερα',
        isTrue                 : 'είναι αληθές',
        isFalse                : 'είναι ψευδές',
        selectAProperty        : 'Επιλέξτε μια ιδιότητα',
        selectAnOperator       : 'Επιλέξτε έναν τελεστή',
        caseSensitive          : 'Με διάκριση πεζών-κεφαλαίων',
        and                    : 'και',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Επιλέξτε μια τιμή',
        selectOneOrMoreValues  : 'Επιλέξτε μία ή περισσότερες τιμές',
        enterAValue            : 'Εισαγάγετε μια τιμή',
        enterANumber           : 'Εισαγάγετε έναν αριθμό',
        selectADate            : 'Επιλέξτε μια ημερομηνία',
        selectATime            : 'Επιλέξτε ώρα'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Προσθήκη φίλτρου'
    },

    DateHelper : {
        locale         : 'el',
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
            { single : 'ΧιλιοστότουΔευτερολέπτου', plural : 'ΧιλιοστάτουΔευτερολέπτου', abbrev : 'Χιλ.τουΔευτ.' },
            { single : 'δευτερόλεπτο', plural : 'δευτερόλεπτα', abbrev : 'δευτ.' },
            { single : 'λεπτό', plural : 'λεπτά', abbrev : 'λεπ.' },
            { single : 'ώρα', plural : 'ώρες', abbrev : 'ώρ.' },
            { single : 'ημέρα', plural : 'ημέρες', abbrev : 'ημ.' },
            { single : 'εβδομάδα', plural : 'εβδομάδες', abbrev : 'εβδ.' },
            { single : 'μήνας', plural : 'μήνες', abbrev : 'μήν.' },
            { single : 'τρίμηνο', plural : 'τρίμηνα', abbrev : 'τρίμ.' },
            { single : 'έτος', plural : 'έτη', abbrev : 'έτ.' },
            { single : 'δεκαετία', plural : 'δεκαετίες', abbrev : 'δεκ.' }
        ],
        unitAbbreviations : [
            ['χιλ.τουδευτ.'],
            ['δ.', 'δευτ.'],
            ['λ.', 'λεπ.'],
            ['ω', 'ώρ.'],
            ['ημ.'],
            ['εβ', 'εβδ.'],
            ['μ', 'μην.'],
            ['τρίμ.'],
            ['ε', 'έτ.'],
            ['δεκ.']
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {

            const lastDigit = number[number.length - 1];
            const suffix = { 1 : 'ος', 2 : 'ο' }[lastDigit] || 'η';

            return number + suffix;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
