import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Bg',
    localeDesc : 'Български',
    localeCode : 'bg',

    Object : {
        Yes    : 'Да',
        No     : 'Не',
        Cancel : 'Отказ',
        Ok     : 'ОК',
        Week   : 'Седмица',
        None   : 'Няма'
    },

    ColorPicker : {
        noColor : 'Няма цвят'
    },

    Combo : {
        noResults          : 'Няма резултати',
        recordNotCommitted : 'Записът не може да бъде добавен',
        addNewValue        : value => `Добавете ${value}`
    },

    FilePicker : {
        file : 'Файл'
    },

    Field : {
        badInput              : 'Невалидна стойност на полето',
        patternMismatch       : 'Стойността трябва да съответства на определен шаблон',
        rangeOverflow         : value => `Стойността трябва да е по-малка или равна на ${value.max}`,
        rangeUnderflow        : value => `Стойността трябва да е по-голяма или равна на ${value.min}`,
        stepMismatch          : 'Стойността трябва да съответства на стъпката',
        tooLong               : 'Стойността трябва да е по-къса',
        tooShort              : 'Стойността трябва да е по-дълга',
        typeMismatch          : 'Стойността трябва да бъде в специален формат',
        valueMissing          : 'Това поле е задължително',
        invalidValue          : 'Невалидна стойност на полето',
        minimumValueViolation : 'Нарушение на минималната стойност',
        maximumValueViolation : 'Нарушение на максималната стойност',
        fieldRequired         : 'Това поле е задължително',
        validateFilter        : 'Стойността трябва да бъде избрана от списъка'
    },

    DateField : {
        invalidDate : 'Невалидно въвеждане на дата'
    },

    DatePicker : {
        gotoPrevYear  : 'Преминаване към предишната година',
        gotoPrevMonth : 'Преминаване към предишния месец',
        gotoNextMonth : 'Преминаване към следващия месец',
        gotoNextYear  : 'Преминаване към следващата година'
    },

    NumberFormat : {
        locale   : 'bg',
        currency : 'BGN'
    },

    DurationField : {
        invalidUnit : 'Невалидна единица'
    },

    TimeField : {
        invalidTime : 'Невалидно въведено време'
    },

    TimePicker : {
        hour   : 'Час',
        minute : 'Минута',
        second : 'Секунда'
    },

    List : {
        loading   : 'Зареждане...',
        selectAll : 'Избери всички'
    },

    GridBase : {
        loadMask : 'Зареждане...',
        syncMask : 'Запазване на промените, моля, изчакайте...'
    },

    PagingToolbar : {
        firstPage         : 'Преминаване на първа страница',
        prevPage          : 'Преминаване на предишната страница',
        page              : 'Стр.',
        nextPage          : 'Преминаване на следващата страница',
        lastPage          : 'Преминаване на последната страница',
        reload            : 'Презареждане на текущата страница',
        noRecords         : 'Няма записи за показване',
        pageCountTemplate : data => `от ${data.lastPage}`,
        summaryTemplate   : data => `Показване на записи ${data.start} - ${data.end} от ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Свиване',
        Expand   : 'Разгръщане'
    },

    Popup : {
        close : 'Затваряне на изскачащ прозорец'
    },

    UndoRedo : {
        Undo           : 'Отмяна',
        Redo           : 'Повтаряне',
        UndoLastAction : 'Отмяна на последното действие',
        RedoLastAction : 'Повторно извършване на последното отменено действие',
        NoActions      : 'Няма елементи в опашката за отмяна'
    },

    FieldFilterPicker : {
        equals                 : 'е равно на',
        doesNotEqual           : 'не е равно на',
        isEmpty                : 'е празно',
        isNotEmpty             : 'не е празно',
        contains               : 'съдържа',
        doesNotContain         : 'не съдържа',
        startsWith             : 'започва с',
        endsWith               : 'свършва с',
        isOneOf                : 'е част от',
        isNotOneOf             : 'не е част от',
        isGreaterThan          : 'е по-голямо от',
        isLessThan             : 'е по-малко от',
        isGreaterThanOrEqualTo : 'е по-голямо от или равно на',
        isLessThanOrEqualTo    : 'е по-малко от или равно на',
        isBetween              : 'е между',
        isNotBetween           : 'не е между',
        isBefore               : 'е преди',
        isAfter                : 'е след',
        isToday                : 'е днес',
        isTomorrow             : 'е утре',
        isYesterday            : 'е вчера',
        isThisWeek             : 'е тази седмица',
        isNextWeek             : 'е следващата седмица',
        isLastWeek             : 'е миналата седмица',
        isThisMonth            : 'е този месец',
        isNextMonth            : 'е следващият месец',
        isLastMonth            : 'е миналият месец',
        isThisYear             : 'е тази година',
        isNextYear             : 'е следващата година',
        isLastYear             : 'е миналата година',
        isYearToDate           : 'е от началото на годината до днес',
        isTrue                 : 'е вярно',
        isFalse                : 'е грешно',
        selectAProperty        : 'Избор на свойство',
        selectAnOperator       : 'Избор на оператор',
        caseSensitive          : 'Чувствителност към малки и големи букви',
        and                    : 'и',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Изберете стойност',
        selectOneOrMoreValues  : 'Избор на една или повече стойности',
        enterAValue            : 'Въвеждане на стойност',
        enterANumber           : 'Въвеждане на число',
        selectADate            : 'Избор на дата',
        selectATime            : 'Изберете час'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Добавяне на филтър'
    },

    DateHelper : {
        locale         : 'bg',
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
            { single : 'милисекунда', plural : 'милисекунди', abbrev : 'мсек' },
            { single : 'секунда', plural : 'секунди', abbrev : 'сек' },
            { single : 'минута', plural : 'минути', abbrev : 'мин' },
            { single : 'час', plural : 'часа', abbrev : 'ч' },
            { single : 'ден', plural : 'дни', abbrev : 'д' },
            { single : 'седмица', plural : 'седмици', abbrev : 'сед' },
            { single : 'месец', plural : 'месеци', abbrev : 'мес' },
            { single : 'тримесечие', plural : 'тримесечия', abbrev : 'трим' },
            { single : 'година', plural : 'години', abbrev : 'год' },
            { single : 'десетилетие', plural : 'десетилетия', abbrev : 'десетил' }
        ],
        unitAbbreviations : [
            ['милисек'],
            ['с', 'сек'],
            ['м', 'мин'],
            ['ч', 'часа'],
            ['д'],
            ['с', 'сед'],
            ['ме', 'мес', 'мсц'],
            ['тр', 'трим', 'тримес'],
            ['г', 'год'],
            ['дес']
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {

            const lastDigit = number[number.length - 1];
            const suffix = { 1 : '-во', 2 : '-ро', 3 : '-то' }[lastDigit] || '-ти';

            return number + suffix;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
