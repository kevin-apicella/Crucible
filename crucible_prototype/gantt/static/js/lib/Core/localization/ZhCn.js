import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'ZhCn',
    localeDesc : '中文（中国）',
    localeCode : 'zh-CN',

    Object : {
        Yes    : '是',
        No     : '否',
        Cancel : '取消',
        Ok     : '好',
        Week   : '周',
        None   : '无'
    },

    ColorPicker : {
        noColor : '无色'
    },

    Combo : {
        noResults          : '无结果',
        recordNotCommitted : '无法添加记录',
        addNewValue        : value => `添加 ${value}`
    },

    FilePicker : {
        file : '文件'
    },

    Field : {
        badInput              : '字段值无效',
        patternMismatch       : '值应与特定模式相匹配',
        rangeOverflow         : value => `值必须小于或等于 ${value.max}`,
        rangeUnderflow        : value => `值必须大于或等于 ${value.min}`,
        stepMismatch          : '值应符合步骤',
        tooLong               : '值应更短',
        tooShort              : '值应更长',
        typeMismatch          : '值要采用特殊格式',
        valueMissing          : '该字段为必填',
        invalidValue          : '字段值无效',
        minimumValueViolation : '不符合最小值限制',
        maximumValueViolation : '不符合最大值限制',
        fieldRequired         : '该字段为必填',
        validateFilter        : '必须从列表中选择值'
    },

    DateField : {
        invalidDate : '日期输入无效'
    },

    DatePicker : {
        gotoPrevYear  : '转至上一年',
        gotoPrevMonth : '转至上一月',
        gotoNextMonth : '转至下一月',
        gotoNextYear  : '转至下一年'
    },

    NumberFormat : {
        locale   : 'zh-CN',
        currency : 'CNY'
    },

    DurationField : {
        invalidUnit : '单位无效'
    },

    TimeField : {
        invalidTime : '时间输入无效'
    },

    TimePicker : {
        hour   : '时',
        minute : '分',
        second : '秒'
    },

    List : {
        loading   : '加载中……',
        selectAll : '全选'
    },

    GridBase : {
        loadMask : '加载中……',
        syncMask : '正在保存变更，请稍等……'
    },

    PagingToolbar : {
        firstPage         : '转至第一页',
        prevPage          : '转至上一页',
        page              : '页',
        nextPage          : '转至下一页',
        lastPage          : '转至最后一页',
        reload            : '重新载入当前页面',
        noRecords         : '无记录显示',
        pageCountTemplate : data => `的 ${data.lastPage}`,
        summaryTemplate   : data => `显示记录 ${data.start} - ${data.end} 的 ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : '折叠',
        Expand   : '展开'
    },

    Popup : {
        close : '关闭弹窗'
    },

    UndoRedo : {
        Undo           : '撤销',
        Redo           : '恢复',
        UndoLastAction : '撤销上个操作',
        RedoLastAction : '恢复上个撤销的操作',
        NoActions      : '撤销队列中没有项目'
    },

    FieldFilterPicker : {
        equals                 : '等于',
        doesNotEqual           : '不等于',
        isEmpty                : '为空',
        isNotEmpty             : '不为空',
        contains               : '包含',
        doesNotContain         : '不包含',
        startsWith             : '开始为',
        endsWith               : '结束为',
        isOneOf                : '是之一',
        isNotOneOf             : '不是之一',
        isGreaterThan          : '大于',
        isLessThan             : '小于',
        isGreaterThanOrEqualTo : '大于或等于',
        isLessThanOrEqualTo    : '小于或等于',
        isBetween              : '在之间',
        isNotBetween           : '不在之间',
        isBefore               : '在之前',
        isAfter                : '在之后',
        isToday                : '在今天',
        isTomorrow             : '在明天',
        isYesterday            : '在昨天',
        isThisWeek             : '在本周',
        isNextWeek             : '在下周',
        isLastWeek             : '在上周',
        isThisMonth            : '在本月',
        isNextMonth            : '在下月',
        isLastMonth            : '在上月',
        isThisYear             : '在今年',
        isNextYear             : '在明年',
        isLastYear             : '在去年',
        isYearToDate           : '是年初至今',
        isTrue                 : '为真',
        isFalse                : '为假',
        selectAProperty        : '选择一项属性',
        selectAnOperator       : '选择操作员',
        caseSensitive          : '区分大小写',
        and                    : '和',
        dateFormat             : '年/月/日',
        selectValue            : '选择一个值',
        selectOneOrMoreValues  : '选择一个或多个值',
        enterAValue            : '输入一个值',
        enterANumber           : '输入一个数字',
        selectADate            : '选择一个日期',
        selectATime            : '选择时间'
    },

    FieldFilterPickerGroup : {
        addFilter : '增加过滤条件'
    },

    DateHelper : {
        locale         : 'zh-CN',
        weekStartDay   : 0,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : '毫秒', plural : '毫秒', abbrev : 'ms' },
            { single : '秒', plural : '秒', abbrev : 's' },
            { single : '分', plural : '分', abbrev : 'min' },
            { single : '时', plural : '时', abbrev : 'h' },
            { single : '天', plural : '天', abbrev : 'd' },
            { single : '周', plural : '周', abbrev : 'w' },
            { single : '月', plural : '月', abbrev : 'mon' },
            { single : '季', plural : '季', abbrev : 'q' },
            { single : '年', plural : '年', abbrev : 'yr' },
            { single : '十年', plural : '十年', abbrev : 'dec' }
        ],
        unitAbbreviations : [
            ['毫秒'],
            ['s', '秒'],
            ['m', '分'],
            ['h', '时'],
            ['天'],
            ['w', '周'],
            ['mo', '月', '月'],
            ['q', '季', '季'],
            ['y', '年'],
            ['十年']
        ],
        parsers : {
            L   : 'YYYY-MM-DD',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => '第' + number
    }
};

export default LocaleHelper.publishLocale(locale);
