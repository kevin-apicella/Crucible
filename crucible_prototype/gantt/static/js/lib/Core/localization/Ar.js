import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Ar',
    localeDesc : 'اللغة العربية',
    localeCode : 'ar',

    Object : {
        Yes    : 'نعم',
        No     : 'لا',
        Cancel : 'إلغاء',
        Ok     : 'موافق',
        Week   : 'الأسبوع',
        None   : 'لا شيء'
    },

    ColorPicker : {
        noColor : 'لا لون'
    },

    Combo : {
        noResults          : 'لا نتائج',
        recordNotCommitted : 'لا يمكن إضافة السجل',
        addNewValue        : value => `${value} إضافة`
    },

    FilePicker : {
        file : 'ملف'
    },

    Field : {
        badInput              : 'قيمة الحقل غير صالحة',
        patternMismatch       : 'يجب أن تتطابق القيمة مع نمط معين',
        rangeOverflow         : value => `${value.max} يجب أن تكون القيمة أقل من أو تساوي`,
        rangeUnderflow        : value => `${value.min} يجب أن تكون القيمة أكبر من أو تساوي`,
        stepMismatch          : 'يجب أن تتناسب القيمة مع الخطوة',
        tooLong               : 'يجب أن تكون القيمة أقصر',
        tooShort              : 'يجب أن تكون القيمة أكبر',
        typeMismatch          : 'يجب أن تكون القيمة بتنسيق خاص',
        valueMissing          : 'هذا الحقل مطلوب',
        invalidValue          : 'قيمة حقل غير صالحة',
        minimumValueViolation : 'تجاوز حد القيمة الأدنى',
        maximumValueViolation : 'تجاوز حد القيمة الأقصى',
        fieldRequired         : 'هذا الحقل مطلوب',
        validateFilter        : 'يجب تحديد القيمة من القائمة'
    },

    DateField : {
        invalidDate : 'تم إدخال تاريخ غير صالح'
    },

    DatePicker : {
        gotoPrevYear  : 'اذهب إلى السنة السابقة',
        gotoPrevMonth : 'اذهب إلى الشهر السابق',
        gotoNextMonth : 'اذهب إلى الشهر القادم',
        gotoNextYear  : 'اذهب إلى السنة القادمة'
    },

    NumberFormat : {
        locale   : 'ar',
        currency : 'USD'
    },

    DurationField : {
        invalidUnit : 'وحدة غير صالحة'
    },

    TimeField : {
        invalidTime : 'تم إدخال توقيت غير صالح'
    },

    TimePicker : {
        hour   : 'ساعة',
        minute : 'دقيقة',
        second : 'ثانية'
    },

    List : {
        loading   : '...جارٍ التحميل',
        selectAll : 'اختر الكل'
    },

    GridBase : {
        loadMask : '...جارٍ التحميل',
        syncMask : '...حفظ التغييرات، يُرجى الانتظار'
    },

    PagingToolbar : {
        firstPage         : 'اذهب للصفحة الأولى',
        prevPage          : 'اذهب للصفحة الثانية',
        page              : 'صفحة',
        nextPage          : 'اذهب للصفحة التالية',
        lastPage          : 'اذهب للصفحة الأخيرة',
        reload            : 'إعادة تحميل الصفحة الحالية',
        noRecords         : 'لا توجد سجلات لعرضها',
        pageCountTemplate : data => `${data.lastPage} من`,
        summaryTemplate   : data => `${data.allCount} من ${data.end} - ${data.start} عرض السجلات`
    },

    PanelCollapser : {
        Collapse : 'تصغير',
        Expand   : 'توسيع'
    },

    Popup : {
        close : 'أغلق النافذة'
    },

    UndoRedo : {
        Undo           : 'إلغاء',
        Redo           : 'إعادة',
        UndoLastAction : 'إلغاء الإجراء الأخير',
        RedoLastAction : 'إعادة آخر إجراء تم إلغاؤه',
        NoActions      : 'لا توجد عناصر في قائمة انتظار الإلغاء'
    },

    FieldFilterPicker : {
        equals                 : 'يساوي',
        doesNotEqual           : 'لا يساوي',
        isEmpty                : 'فارغ',
        isNotEmpty             : 'ليس فارغًا',
        contains               : 'يحتوي على',
        doesNotContain         : 'لا يحتوي على',
        startsWith             : 'يبدأ بـ',
        endsWith               : 'ينتهي بـ',
        isOneOf                : 'واحد من',
        isNotOneOf             : 'ليس واحدًا من',
        isGreaterThan          : 'أكبر من',
        isLessThan             : 'أقل من',
        isGreaterThanOrEqualTo : 'أكبر من أو يساوي',
        isLessThanOrEqualTo    : 'أقل من أو يساوي',
        isBetween              : 'يتراوح ما بين',
        isNotBetween           : 'لا يتراوح ما بين',
        isBefore               : 'قبل',
        isAfter                : 'بعد',
        isToday                : 'اليوم',
        isTomorrow             : 'غدًا',
        isYesterday            : 'أمس',
        isThisWeek             : 'هذا الأسبوع',
        isNextWeek             : 'الأسبوع القادم',
        isLastWeek             : 'الأسبوع الماضي',
        isThisMonth            : 'هذا الشهر',
        isNextMonth            : 'الشهر القادم',
        isLastMonth            : 'الشهر الماضي',
        isThisYear             : 'هذا العام',
        isNextYear             : 'العام القادم',
        isLastYear             : 'العام الماضي',
        isYearToDate           : 'منذ بداية العام حتى الآن',
        isTrue                 : 'صحيح',
        isFalse                : 'خطأ',
        selectAProperty        : 'اختر خاصية',
        selectAnOperator       : 'اختر مشغلاً',
        caseSensitive          : 'حساسية الموضوع',
        and                    : 'و',
        dateFormat             : 'D/M/YY',
        selectValue            : 'اختر قيمة',
        selectOneOrMoreValues  : 'اختر قيمة أو أكثر',
        enterAValue            : 'أدخل قيمة',
        enterANumber           : 'أدخل رقم',
        selectADate            : 'اختر تاريخًا',
        selectATime            : 'اختر الوقت'
    },

    FieldFilterPickerGroup : {
        addFilter : 'أضف عامل تصفية'
    },

    DateHelper : {
        locale         : 'ar-u-nu-latn',
        weekStartDay   : 6,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'ملليثانية', plural : 'مث', abbrev : 'مث' },
            { single : 'ثانية', plural : 'ثوانٍ', abbrev : 'ث' },
            { single : 'دقيقة', plural : 'دقائق', abbrev : 'د' },
            { single : 'ساعة', plural : 'ساعات', abbrev : 'س' },
            { single : 'يوم', plural : 'أيام', abbrev : 'ي' },
            { single : 'أسبوع', plural : 'أسابيع', abbrev : 'أ' },
            { single : 'شهر', plural : 'أشهر', abbrev : 'ش' },
            { single : 'ربعسنة', plural : 'أرباعسنوات', abbrev : 'ر' },
            { single : 'سنة', plural : 'سنوات', abbrev : 'سن' },
            { single : 'عقد', plural : 'عقود', abbrev : 'ع' }
        ],
        unitAbbreviations : [
            ['ملليث'],
            ['ث', 'ثانية'],
            ['د', 'دقيقة'],
            ['س', 'ساعة'],
            ['ي'],
            ['أ', 'أسبوع'],
            ['ش', 'شهر', 'شهر'],
            ['ر', 'ربعسنة', 'ربعسنة'],
            ['سن', 'سنة'],
            ['د']
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number
    }
};

export default LocaleHelper.publishLocale(locale);
