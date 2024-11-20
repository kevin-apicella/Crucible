import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',

    Object : {
        Yes    : 'Да',
        No     : 'Нет',
        Cancel : 'Отмена',
        Ok     : 'OK',
        Week   : 'Неделя',
        None   : 'Нет'
    },

    ColorPicker : {
        noColor : 'Нет цвета'
    },

    Combo : {
        noResults          : 'Нет результатов',
        recordNotCommitted : 'Запись не может быть добавлена',
        addNewValue        : value => `добавить ${value}`
    },

    FilePicker : {
        file : 'Файл'
    },

    Field : {
        badInput              : 'Недопустимое значение поля',
        patternMismatch       : 'Значение должно соответствовать определенному шаблону',
        rangeOverflow         : value => `Значение должно быть меньше или равно ${value.max}`,
        rangeUnderflow        : value => `Значение должно быть больше или равно ${value.min}`,
        stepMismatch          : 'Значение должно соответствовать шагу',
        tooLong               : 'Значение должно быть короче',
        tooShort              : 'Значение должно быть длиннее',
        typeMismatch          : 'Значение должно быть в специальном формате',
        valueMissing          : 'Поле не может быть пустым',
        invalidValue          : 'Недопустимое значение поля',
        minimumValueViolation : 'Нарушение минимального значения',
        maximumValueViolation : 'Нарушение максимального значения',
        fieldRequired         : 'Поле не может быть пустым',
        validateFilter        : 'Выберите значение из списка'
    },

    DateField : {
        invalidDate : 'Неверный формат даты'
    },

    DatePicker : {
        gotoPrevYear  : 'Перейти к предыдущему году',
        gotoPrevMonth : 'Перейти к предыдущему месяцу',
        gotoNextMonth : 'Перейти в следующий месяц',
        gotoNextYear  : 'Перейти в следующий год'
    },

    NumberFormat : {
        locale   : 'ru',
        currency : 'RUB'
    },

    DurationField : {
        invalidUnit : 'Неверные единицы'
    },

    TimeField : {
        invalidTime : 'Неверный формат времени'
    },

    TimePicker : {
        hour   : 'Час',
        minute : 'Минуты',
        second : 'секунда'
    },

    List : {
        loading   : 'Загрузка...',
        selectAll : 'Выбрать все'
    },

    GridBase : {
        loadMask : 'Загрузка...',
        syncMask : 'Сохраняю данные, пожалуйста подождите...'
    },

    PagingToolbar : {
        firstPage         : 'Перейти на первую страницу',
        prevPage          : 'Перейти на предыдущую страницу',
        page              : 'страница',
        nextPage          : 'Перейти на следующую страницу',
        lastPage          : 'Перейти на последнюю страницу',
        reload            : 'Перезагрузить текущую страницу',
        noRecords         : 'Нет записей для отображения',
        pageCountTemplate : data => `из ${data.lastPage}`,
        summaryTemplate   : data => `Показаны записи ${data.start} - ${data.end} из ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Свернуть',
        Expand   : 'Развернуть'
    },

    Popup : {
        close : 'Закрыть'
    },

    UndoRedo : {
        Undo           : 'Отменить',
        Redo           : 'Повторить',
        UndoLastAction : 'Отменить последнее действие',
        RedoLastAction : 'Повторить последнее отмененное действие',
        NoActions      : 'Нет записей в очереди отмены'
    },

    FieldFilterPicker : {
        equals                 : 'равен',
        doesNotEqual           : 'не равен',
        isEmpty                : 'пустой',
        isNotEmpty             : 'не пустой',
        contains               : 'содержит',
        doesNotContain         : 'не содержит',
        startsWith             : 'начинается c',
        endsWith               : 'заканчивается с',
        isOneOf                : 'входит в',
        isNotOneOf             : 'не входит в',
        isGreaterThan          : 'больше чем',
        isLessThan             : 'меньше чем',
        isGreaterThanOrEqualTo : 'больше или равен',
        isLessThanOrEqualTo    : 'меньше или равен',
        isBetween              : 'между',
        isNotBetween           : 'не между',
        isBefore               : 'до',
        isAfter                : 'после',
        isToday                : 'сегодня',
        isTomorrow             : 'завтра',
        isYesterday            : 'вчера',
        isThisWeek             : 'эта неделя',
        isNextWeek             : 'следующая неделя',
        isLastWeek             : 'последняя неделя',
        isThisMonth            : 'этот месяц',
        isNextMonth            : 'следующий месяц',
        isLastMonth            : 'последний месяц',
        isThisYear             : 'этот год',
        isNextYear             : 'следующий год',
        isLastYear             : 'последний год',
        isYearToDate           : 'год по дате',
        isTrue                 : 'правда',
        isFalse                : 'ложь',
        selectAProperty        : 'Выбор свойства',
        selectAnOperator       : 'Выбор оператора',
        caseSensitive          : 'С учетом регистра',
        and                    : 'и',
        dateFormat             : 'D/M/YYYY',
        selectValue            : 'Выберите значение',
        selectOneOrMoreValues  : 'Выберите одно или несколько значений',
        enterAValue            : 'Введите значение',
        enterANumber           : 'Введите число',
        selectADate            : 'Выберите дату',
        selectATime            : 'Выбрать время'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Добавить фильтр'
    },

    DateHelper : {
        locale         : 'ru',
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
            { single : 'миллисек', plural : 'миллисек', abbrev : 'мс' },
            { single : 'секунда', plural : 'секунд', abbrev : 'с' },
            { single : 'минута', plural : 'минут', abbrev : 'мин' },
            { single : 'час', plural : 'часов', abbrev : 'ч' },
            { single : 'день', plural : 'дней', abbrev : 'д' },
            { single : 'неделя', plural : 'недели', abbrev : 'нед' },
            { single : 'месяц', plural : 'месяцев', abbrev : 'мес' },
            { single : 'квартал', plural : 'кварталов', abbrev : 'квар' },
            { single : 'год', plural : 'лет', abbrev : 'г' },
            { single : 'десятилетие', plural : 'десятилетия', abbrev : 'дес' }
        ],
        unitAbbreviations : [
            ['мс', 'мил'],
            ['с', 'сек'],
            ['м', 'мин'],
            ['ч'],
            ['д', 'ден', 'дне'],
            ['н', 'нед'],
            ['мес'],
            ['к', 'квар', 'квр'],
            ['г'],
            ['дес']
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => `${number}-й`
    }
};

export default LocaleHelper.publishLocale(locale);
