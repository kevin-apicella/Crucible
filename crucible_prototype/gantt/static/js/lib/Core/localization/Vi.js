import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Vi',
    localeDesc : 'Tiếng Việt',
    localeCode : 'vi',

    Object : {
        Yes    : 'Có',
        No     : 'Không',
        Cancel : 'Hủy bỏ ',
        Ok     : 'OK',
        Week   : 'Tuần',
        None   : 'Không'
    },

    ColorPicker : {
        noColor : 'Không màu'
    },

    Combo : {
        noResults          : 'Ko có kết quả',
        recordNotCommitted : 'Không thể thêm hồ sơ',
        addNewValue        : value => `Thêm ${value}`
    },

    FilePicker : {
        file : 'Tập tin'
    },

    Field : {
        badInput              : 'Giá trị trường không hợp lệ',
        patternMismatch       : 'Giá trị phải phù hợp với một mẫu cụ thể',
        rangeOverflow         : value => `Giá trị phải nhỏ hơn hoặc bằng ${value.max}`,
        rangeUnderflow        : value => `Giá trị phải lớn hơn hoặc bằng ${value.min}`,
        stepMismatch          : 'Giá trị phải phù hợp với bước',
        tooLong               : 'Giá trị phải ngắn hơn',
        tooShort              : 'Giá trị phải dài hơn',
        typeMismatch          : 'Giá trị bắt buộc phải ở định dạng đặc biệt',
        valueMissing          : 'Trường này là bắt buộc',
        invalidValue          : 'Giá trị trường không hợp lệ',
        minimumValueViolation : 'Vi phạm giá trị tối thiểu',
        maximumValueViolation : 'Vi phạm giá trị tối đa',
        fieldRequired         : 'Trường này là bắt buộc',
        validateFilter        : 'Giá trị phải được chọn từ danh sách'
    },

    DateField : {
        invalidDate : 'Đầu vào ngày không hợp lệ'
    },

    DatePicker : {
        gotoPrevYear  : 'Chuyển đến năm trước',
        gotoPrevMonth : 'Chuyển đến tháng trước',
        gotoNextMonth : 'Chuyển đến tháng sau',
        gotoNextYear  : 'Sang năm sau'
    },

    NumberFormat : {
        locale   : 'vi',
        currency : 'VND'
    },

    DurationField : {
        invalidUnit : 'Đơn vị không hợp lệ'
    },

    TimeField : {
        invalidTime : 'Đầu vào thời gian không hợp lệ'
    },

    TimePicker : {
        hour   : 'Giờ',
        minute : 'Phút',
        second : 'Thứ hai'
    },

    List : {
        loading   : 'Đang tải...',
        selectAll : 'Chọn Tất cả'
    },

    GridBase : {
        loadMask : 'Đang tải...',
        syncMask : 'Đang lưu các thay đổi, vui lòng đợi ...'
    },

    PagingToolbar : {
        firstPage         : 'Đi đến trang đầu tiên',
        prevPage          : 'Đi đến trang trước',
        page              : 'Trang',
        nextPage          : 'Đi đến trang tiếp theo',
        lastPage          : 'Đi đến trang cuối cùng',
        reload            : 'Tải lại trang hiện tại',
        noRecords         : 'Không có hồ sơ nào để hiển thị',
        pageCountTemplate : data => `/ ${data.lastPage}`,
        summaryTemplate   : data => `Hiển thị hồ sơ ${data.start} - ${data.end} of ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Thu gọn',
        Expand   : 'Mở rộng'
    },

    Popup : {
        close : 'Đóng cửa sổ bật lên'
    },

    UndoRedo : {
        Undo           : 'Hoàn tác',
        Redo           : 'Làm lại',
        UndoLastAction : 'Hoàn tác hành động cuối cùng',
        RedoLastAction : 'Làm lại hành động đã hoàn tác cuối cùng',
        NoActions      : 'Không có mục nào trong hàng đợi hoàn tác'
    },

    FieldFilterPicker : {
        equals                 : 'bằng',
        doesNotEqual           : 'không bằng',
        isEmpty                : 'trống rỗng',
        isNotEmpty             : 'không trống rỗng',
        contains               : 'chứa',
        doesNotContain         : 'không chứa',
        startsWith             : 'bắt đầu với',
        endsWith               : 'kết thúc với',
        isOneOf                : 'là một trong những',
        isNotOneOf             : 'không phải là một trong những',
        isGreaterThan          : 'lớn hơn',
        isLessThan             : 'nhỏ hơn',
        isGreaterThanOrEqualTo : 'lớn hơn hoặc bằng',
        isLessThanOrEqualTo    : 'nhỏ hơn hoặc bằng',
        isBetween              : 'ở giữa',
        isNotBetween           : 'không ở giữa',
        isBefore               : 'trước',
        isAfter                : 'sau',
        isToday                : 'hôm nay',
        isTomorrow             : 'ngày mai',
        isYesterday            : 'hôm qua',
        isThisWeek             : 'tuần này',
        isNextWeek             : 'tuần sau',
        isLastWeek             : 'tuần trước',
        isThisMonth            : 'tháng này',
        isNextMonth            : 'tháng sau',
        isLastMonth            : 'tháng trước',
        isThisYear             : 'năm nay',
        isNextYear             : 'năm sau',
        isLastYear             : 'năm trước',
        isYearToDate           : 'năm cho đến nay',
        isTrue                 : 'đúng',
        isFalse                : 'sai',
        selectAProperty        : 'Chọn một tài sản',
        selectAnOperator       : 'Chọn một nhà điều hành',
        caseSensitive          : 'Phân biệt chữ hoa chữ thường',
        and                    : 'và',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Chọn một giá trị',
        selectOneOrMoreValues  : 'Chọn một hoặc nhiều giá trị',
        enterAValue            : 'Nhập một giá trị',
        enterANumber           : 'Nhập một số',
        selectADate            : 'Nhập một ngày',
        selectATime            : 'Chọn thời gian'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Thêm bộ lọc'
    },

    DateHelper : {
        locale         : 'vi',
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
            { single : 'milligiây', plural : 'ms', abbrev : 'ms' },
            { single : 'giây', plural : 'giây', abbrev : 'sec' },
            { single : 'phút', plural : 'phút', abbrev : 'min' },
            { single : 'giờ', plural : 'giờ', abbrev : 'h' },
            { single : 'ngày', plural : 'ngày', abbrev : 'd' },
            { single : 'tuần', plural : 'tuần', abbrev : 'w' },
            { single : 'tháng', plural : 'tháng', abbrev : 'mon' },
            { single : 'quý', plural : 'quý', abbrev : 'q' },
            { single : 'năm', plural : 'năm', abbrev : 'yr' },
            { single : 'thậpkỷ', plural : 'thậpkỷ', abbrev : 'dec' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'sec'],
            ['m', 'min'],
            ['h', 'hr'],
            ['d'],
            ['w', 'wk'],
            ['mo', 'mon', 'mnt'],
            ['q', 'quar', 'qrt'],
            ['y', 'yr'],
            ['dec']
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
