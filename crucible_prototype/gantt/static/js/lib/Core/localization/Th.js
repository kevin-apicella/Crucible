import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Th',
    localeDesc : 'ไทย',
    localeCode : 'th',

    Object : {
        Yes    : 'ใช่',
        No     : 'ไม่ใช่',
        Cancel : 'ยกเลิก',
        Ok     : 'ตกลง',
        Week   : 'สัปดาห์',
        None   : 'ไม่มี'
    },

    ColorPicker : {
        noColor : 'ไม่มีสี'
    },

    Combo : {
        noResults          : 'ไม่พบผลลัพธ์',
        recordNotCommitted : 'ไม่สามารถเพิ่มบันทึกได้',
        addNewValue        : value => `เพิ่ม ${value}`
    },

    FilePicker : {
        file : 'ไฟล์'
    },

    Field : {
        badInput              : 'ค่าในช่องไม่ถูกต้อง',
        patternMismatch       : 'ค่าควรตรงกับรูปแบบที่เฉพาะเจาะจง',
        rangeOverflow         : value => `ค่าควรน้อยกว่าหรือเท่ากับ ${value.max}`,
        rangeUnderflow        : value => `ค่าควรมากกว่าหรือเท่ากับ ${value.min}`,
        stepMismatch          : 'ค่าควรสอดคล้องกับการก้าวกระโดด',
        tooLong               : 'ค่าควรสั้นกว่านี้',
        tooShort              : 'ค่าควรยาวกว่านี้',
        typeMismatch          : 'ค่าต้องอยู่ในรูปแบบพิเศษ',
        valueMissing          : 'จำเป็นต้องกรอกช่องนี้',
        invalidValue          : 'ค่าในช่องไม่ถูกต้อง',
        minimumValueViolation : 'ค่าน้อยกว่าค่าต่ำสุด',
        maximumValueViolation : 'ค่ามากกว่าค่าสูงสุด',
        fieldRequired         : 'ช่องนี้จำเป็นต้องกรอก',
        validateFilter        : 'ต้องเลือกค่าจากรายการ'
    },

    DateField : {
        invalidDate : 'วันที่ที่กรอกไม่ถูกต้อง'
    },

    DatePicker : {
        gotoPrevYear  : 'ไปที่ปีก่อนหน้า',
        gotoPrevMonth : 'ไปที่เดือนก่อนหน้า',
        gotoNextMonth : 'ไปที่เดือนถัดไป',
        gotoNextYear  : 'ไปที่ปีถัดไป'
    },

    NumberFormat : {
        locale   : 'th',
        currency : 'THB'
    },

    DurationField : {
        invalidUnit : 'หน่วยไม่ถูกต้อง'
    },

    TimeField : {
        invalidTime : 'เวลาที่กรอกไม่ถูกต้อง'
    },

    TimePicker : {
        hour   : 'ชั่วโมง',
        minute : 'นาที',
        second : 'วินาที'
    },

    List : {
        loading   : 'กำลังโหลด...',
        selectAll : 'เลือกทั้งหมด'
    },

    GridBase : {
        loadMask : 'กำลังโหลด...',
        syncMask : 'กำลังบันทึกการเปลี่ยนแปลง กรุณารอสักครู่...'
    },

    PagingToolbar : {
        firstPage         : 'ไปที่หน้าแรก',
        prevPage          : 'ไปที่หน้าก่อนหน้า',
        page              : 'หน้า',
        nextPage          : 'ไปที่หน้าถัดไป',
        lastPage          : 'ไปที่หน้าสุดท้าย',
        reload            : 'โหลดซ้ำหน้าปัจจุบัน',
        noRecords         : 'ไม่มีบันทึกที่ต้องแสดง',
        pageCountTemplate : data => `จาก ${data.lastPage}`,
        summaryTemplate   : data => `บันทึกที่แสดง ${data.start} - ${data.end} จาก ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'ย่อ',
        Expand   : 'ขยาย'
    },

    Popup : {
        close : 'ปิดป๊อปอัป'
    },

    UndoRedo : {
        Undo           : 'เลิกทำ',
        Redo           : 'ทำซ้ำ',
        UndoLastAction : 'เลิกทำการกระทำล่าสุด',
        RedoLastAction : 'ทำซ้ำการกระทำที่ถูกยกเลิก',
        NoActions      : 'ไม่มีการกระทำในรายการเลิกทำ'
    },

    FieldFilterPicker : {
        equals                 : 'เท่ากับ',
        doesNotEqual           : 'ไม่เท่ากับ',
        isEmpty                : 'ว่างเปล่า',
        isNotEmpty             : 'ไม่ว่างเปล่า',
        contains               : 'มี',
        doesNotContain         : 'ไม่มี',
        startsWith             : 'เริ่มต้นด้วย',
        endsWith               : 'ลงท้ายด้วย',
        isOneOf                : 'เป็นหนึ่งใน',
        isNotOneOf             : 'ไม่ได้เป็นหนึ่งใน',
        isGreaterThan          : 'มากกว่า',
        isLessThan             : 'น้อยกว่า',
        isGreaterThanOrEqualTo : 'มากกว่าหรือเท่ากับ',
        isLessThanOrEqualTo    : 'น้อยกว่าหรือเท่ากับ',
        isBetween              : 'อยู่ระหว่าง',
        isNotBetween           : 'ไม่อยู่ระหว่าง',
        isBefore               : 'ก่อน',
        isAfter                : 'หลังจาก',
        isToday                : 'เป็นวันนี้',
        isTomorrow             : 'เป็นวันพรุ่งนี้',
        isYesterday            : 'เป็นเมื่อวานนี้',
        isThisWeek             : 'เป็นสัปดาห์นี้',
        isNextWeek             : 'เป็นสัปดาห์หน้า',
        isLastWeek             : 'เป็นสัปดาห์ที่แล้ว',
        isThisMonth            : 'เป็นเดือนนี้',
        isNextMonth            : 'เป็นเดือนหน้า',
        isLastMonth            : 'เป็นเดือนที่แล้ว',
        isThisYear             : 'เป็นปีนี้',
        isNextYear             : 'เป็นปีหน้า',
        isLastYear             : 'เป็นปีที่แล้ว',
        isYearToDate           : 'เป็นปีจนถึงปัจจุบัน',
        isTrue                 : 'เป็นจริง',
        isFalse                : 'เป็นเท็จ',
        selectAProperty        : 'เลือกคุณสมบัติ',
        selectAnOperator       : 'เลือกผู้ปฏิบัติการ',
        caseSensitive          : 'การบังคับใช้ตัวอักษรเล็ก/ใหญ่',
        and                    : 'และ',
        dateFormat             : 'D/M/YY',
        selectValue            : 'เลือกค่า',
        selectOneOrMoreValues  : 'เลือกหนึ่งค่าหรือมากกว่า',
        enterAValue            : 'ป้อนค่า',
        enterANumber           : 'ป้อนหมายเลข',
        selectADate            : 'เลือกวันที่',
        selectATime            : 'เลือกเวลา'
    },

    FieldFilterPickerGroup : {
        addFilter : 'เพิ่มตัวกรอง'
    },

    DateHelper : {
        locale         : 'th',
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
            { single : 'มิลลิวินาที', plural : 'มิลลิวินาที', abbrev : 'มิลลิวินาที' },
            { single : 'วินาที', plural : 'วินาที', abbrev : 'วินาที' },
            { single : 'นาที', plural : 'นาที', abbrev : 'น.' },
            { single : 'ชั่วโมง', plural : 'ชั่วโมง', abbrev : 'ชม.' },
            { single : 'วัน', plural : 'วัน', abbrev : 'ว.' },
            { single : 'สัปดาห์', plural : 'สัปดาห์', abbrev : 'สัปดาห์' },
            { single : 'เดือน', plural : 'เดือน', abbrev : 'ด.' },
            { single : 'ไตรมาส', plural : 'ไตรมาส', abbrev : 'ไตรมาส' },
            { single : 'ปี', plural : 'ปี', abbrev : 'ป.' },
            { single : 'ทศวรรษ', plural : 'ทศวรรษ', abbrev : 'ทศวรรษ' }
        ],
        unitAbbreviations : [
            ['มิลลิวินาที'],
            ['วินาที', 'วินาที'],
            ['น.', 'น.'],
            ['ชม.', 'ชม.'],
            ['วัน'],
            ['สัปดาห์', 'สัปดาห์'],
            ['ด.', 'ด.', 'ด.'],
            ['ไตรมาส', 'ไตรมาส', 'ไตรมาส'],
            ['ป.', 'ป.'],
            ['ทศวรรษ']
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
