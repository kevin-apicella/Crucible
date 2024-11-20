import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Hi',
    localeDesc : 'हिन्दी',
    localeCode : 'hi',

    Object : {
        Yes    : 'हाँ',
        No     : 'नहीं',
        Cancel : 'रद्द करें',
        Ok     : 'ओके',
        Week   : 'सप्ताह',
        None   : 'कोई नहीं'
    },

    ColorPicker : {
        noColor : 'कोई रंग नहीं'
    },

    Combo : {
        noResults          : 'कोई परिणाम नहीं',
        recordNotCommitted : 'रिकॉर्ड जोड़ा नहीं जा सका',
        addNewValue        : value => `जोड़ें  ${value}`
    },

    FilePicker : {
        file : 'फाइल'
    },

    Field : {
        badInput              : 'अमान्य फील्ड मान',
        patternMismatch       : 'मान को विशिष्ट पैटर्न के अनुरूप होना चाहिए',
        rangeOverflow         : value => `मान को ${value.max} से कम या बराबर होना चाहिए`,
        rangeUnderflow        : value => `मान को ${value.min} से अधिक या बराबर होना चाहिए `,
        stepMismatch          : 'मान इस स्टेप से फिट होना चाहिए',
        tooLong               : 'मान छोटा होना चाहिए',
        tooShort              : 'मान अधिक लंबा होना चाहिए',
        typeMismatch          : 'मान को विशेष फार्मेट में होना चाहिए',
        valueMissing          : 'यह फील्ड आवश्यक है',
        invalidValue          : 'अमान्य फील्ड मान',
        minimumValueViolation : 'न्यूनतम मान उल्लंघन',
        maximumValueViolation : 'अधिकतम मान उल्लंघन',
        fieldRequired         : 'यह फील्ड आवश्यक है',
        validateFilter        : 'इस सूची के लिए मान चुना जाना चाहिए'
    },

    DateField : {
        invalidDate : 'अमान्य तारीख इनपुट'
    },

    DatePicker : {
        gotoPrevYear  : 'पिछले साल पर जाएं',
        gotoPrevMonth : 'पिछले महीने पर जाएं',
        gotoNextMonth : 'अगले महीने पर जाएं',
        gotoNextYear  : 'अगले साल पर जाएं'
    },

    NumberFormat : {
        locale   : 'hi',
        currency : 'INR'
    },

    DurationField : {
        invalidUnit : 'अमान्य इकाई'
    },

    TimeField : {
        invalidTime : 'अमान्य समय इनपुट'
    },

    TimePicker : {
        hour   : 'साल',
        minute : 'मिनट',
        second : 'सेकंड'
    },

    List : {
        loading   : 'लोड कर रहा है...',
        selectAll : 'सभी का चयन करें'
    },

    GridBase : {
        loadMask : 'लोड कर रहा है...',
        syncMask : 'बदलाव सहेज रहा है, कृपया प्रतीक्षा करें...'
    },

    PagingToolbar : {
        firstPage         : 'पहले पेज पर जाएं',
        prevPage          : 'पिछले पेज पर जाएं',
        page              : 'पेज',
        nextPage          : 'अगले पेज पर जाएं',
        lastPage          : 'पिछले पेज पर जाएं',
        reload            : 'वर्तमान पेज रीलोड करें',
        noRecords         : 'दर्शाने के लिए कोई रिकॉर्ड नहीं',
        pageCountTemplate : data => `${data.lastPage} का`,
        summaryTemplate   : data => `${data.allCount} का ${data.start} - ${data.end} का रिकॉर्ड दर्शा रहा है`
    },

    PanelCollapser : {
        Collapse : 'समेटें',
        Expand   : 'फैलाएं'
    },

    Popup : {
        close : 'पॉपअप बंद करें'
    },

    UndoRedo : {
        Undo           : 'अनडू करें',
        Redo           : 'रीडू करें',
        UndoLastAction : 'पिछला ऐक्शन अनडू करें',
        RedoLastAction : 'पिछला ऐक्शन रीडू करें',
        NoActions      : 'कतार अनडू करें में कोई आइटम नहीं है'
    },

    FieldFilterPicker : {
        equals                 : 'बराबर है',
        doesNotEqual           : 'बराबर नहीं है',
        isEmpty                : 'खाली है',
        isNotEmpty             : 'खाली नहीं है',
        contains               : 'शामिल है',
        doesNotContain         : 'शामिल नहीं है',
        startsWith             : 'के साथ शुरू होता है',
        endsWith               : 'के साथ अंत होता है',
        isOneOf                : 'इनमें से एक है',
        isNotOneOf             : 'इनमें से एक नहीं है',
        isGreaterThan          : 'इससे बड़ा है',
        isLessThan             : 'इससे छोटा है',
        isGreaterThanOrEqualTo : 'इसके बराबर या बड़ा है',
        isLessThanOrEqualTo    : 'इसके बराबर या छोटा है',
        isBetween              : 'बीच में है',
        isNotBetween           : 'बीच में नहीं है',
        isBefore               : 'पहले है',
        isAfter                : 'बाद में है',
        isToday                : 'आज है',
        isTomorrow             : 'आगामी कल है',
        isYesterday            : 'बीते कल है',
        isThisWeek             : 'इस सप्ताह है',
        isNextWeek             : 'अगले सप्ताह है',
        isLastWeek             : 'पिछले सप्ताह हैं',
        isThisMonth            : 'इस माह है',
        isNextMonth            : 'अगले माह है',
        isLastMonth            : 'पिछले माह है',
        isThisYear             : 'इस साल है',
        isNextYear             : 'अगले साल है',
        isLastYear             : 'पिछले साल है',
        isYearToDate           : 'साल से आज तक है',
        isTrue                 : 'सच है',
        isFalse                : 'असत्य है',
        selectAProperty        : 'कोई गुण चुनें',
        selectAnOperator       : 'कोई ऑपरेटर चुनें',
        caseSensitive          : 'केस-संवेदी',
        and                    : 'और',
        dateFormat             : 'D/M/YY',
        selectValue            : 'कोई मान चुनें',
        selectOneOrMoreValues  : 'एक या अधिक मान चुनें',
        enterAValue            : 'एक मान दर्ज करें',
        enterANumber           : 'एक संख्या दर्ज करें',
        selectADate            : 'एक तारीख चुनें',
        selectATime            : 'समय चुनें'
    },

    FieldFilterPickerGroup : {
        addFilter : 'फिल्टर जोड़ें'
    },

    DateHelper : {
        locale         : 'hi',
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
            { single : 'मिलीसेकंड', plural : 'मिलीसेकंड', abbrev : 'मिसे' },
            { single : 'सेकंड', plural : 'सेकंड', abbrev : 'से' },
            { single : 'मिनट', plural : 'मिनट', abbrev : 'मि' },
            { single : 'घंटा', plural : 'घंटे', abbrev : 'घं' },
            { single : 'दिन', plural : 'दिन', abbrev : 'दि' },
            { single : 'हफ्ता', plural : 'हफ्ते', abbrev : 'ह' },
            { single : 'महीना', plural : 'महीने', abbrev : 'माह' },
            { single : 'तिमाही', plural : 'तिमाही', abbrev : 'ति' },
            { single : 'साल', plural : 'साल', abbrev : 'सा' },
            { single : 'दशक', plural : 'दशक', abbrev : 'द' }
        ],
        unitAbbreviations : [
            ['मिसे'],
            ['से', 'से'],
            ['मि', 'मि'],
            ['घं', 'घं'],
            ['दि'],
            ['ह', 'ह'],
            ['माह', 'माह', 'माह'],
            ['ति', 'ति', 'ति'],
            ['सा', 'सा'],
            ['द']
        ],
        parsers : {
            L   : 'MM/DD/YYYY',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const suffix = { 1 : '', 2 : '', 3 : '', 4 : '', 6 : '', 7 : '', 8 : '', 9 : '' }[number] || 'वां';
            return number + suffix;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
