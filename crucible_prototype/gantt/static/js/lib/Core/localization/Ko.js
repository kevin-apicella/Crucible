import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Ko',
    localeDesc : '한국어',
    localeCode : 'ko',

    Object : {
        Yes    : '예',
        No     : '아니요',
        Cancel : '취소',
        Ok     : '확인',
        Week   : '주',
        None   : '없음'
    },

    ColorPicker : {
        noColor : '색 없음'
    },

    Combo : {
        noResults          : '결과 없음',
        recordNotCommitted : '기록을 추가할 수 없습니다',
        addNewValue        : value => `${value} 추가`
    },

    FilePicker : {
        file : '파일'
    },

    Field : {
        badInput              : '잘못된 필드 값',
        patternMismatch       : '값은 특정 패턴과 일치해야 합니다',
        rangeOverflow         : value => `값은  ${value.max} 보다 작거나 같아야 합니다`,
        rangeUnderflow        : value => `값은  ${value.min} 보다 크거나 같아야 합니다`,
        stepMismatch          : '값은 단계에 맞아야 합니다',
        tooLong               : '값은 더 짧아야 합니다',
        tooShort              : '값은 더 길어야 합니다',
        typeMismatch          : '값은 특수 형식이어야 합니다',
        valueMissing          : '이 필드는 필수입니다',
        invalidValue          : '잘못된 필드 값',
        minimumValueViolation : '최소값 위반',
        maximumValueViolation : '최대값 위반',
        fieldRequired         : '이 필드는 필수입니다',
        validateFilter        : '목록에서 값을 선택해야 합니다'
    },

    DateField : {
        invalidDate : '잘못된 날짜 입력'
    },

    DatePicker : {
        gotoPrevYear  : '전년도로 이동',
        gotoPrevMonth : '지난달로 이동',
        gotoNextMonth : '다음 달로 이동',
        gotoNextYear  : '내년으로 이동'
    },

    NumberFormat : {
        locale   : 'ko',
        currency : 'KRW'
    },

    DurationField : {
        invalidUnit : '잘못된 단위'
    },

    TimeField : {
        invalidTime : '잘못된 시간 입력'
    },

    TimePicker : {
        hour   : '시간',
        minute : '분',
        second : '초'
    },

    List : {
        loading   : '로딩 중...',
        selectAll : '모두 선택'
    },

    GridBase : {
        loadMask : '로딩 중...',
        syncMask : '변경 내용 저장 중, 잠시 기다려 주십시오...'
    },

    PagingToolbar : {
        firstPage         : '첫 페이지로 이동',
        prevPage          : '이전 페이지로 이동',
        page              : '페이지',
        nextPage          : '다음 페이지로 이동',
        lastPage          : '마지막 페이지로 이동',
        reload            : '현재 페이지 새로고침',
        noRecords         : '표시할 기록 없음',
        pageCountTemplate : data => ` ${data.lastPage}`,
        summaryTemplate   : data => ` ${data.allCount}개 중 ${data.start} - ${data.end}  기록 표시하기`
    },

    PanelCollapser : {
        Collapse : '접기',
        Expand   : '펼치기'
    },

    Popup : {
        close : '팝업 닫기'
    },

    UndoRedo : {
        Undo           : '실행 취소',
        Redo           : '다시 실행',
        UndoLastAction : '마지막 작업 실행 취소',
        RedoLastAction : '마지막 실행 취소 작업 다시 실행',
        NoActions      : '실행 취소 대기열에 항목 없음'
    },

    FieldFilterPicker : {
        equals                 : '동일',
        doesNotEqual           : '동일하지 않음',
        isEmpty                : '비었음',
        isNotEmpty             : '비지 않았음',
        contains               : '포함함',
        doesNotContain         : '포함하지 않음',
        startsWith             : '이하로 시작함',
        endsWith               : '이하로 종료함',
        isOneOf                : '이하 중 하나',
        isNotOneOf             : '이하 중 하나가 아님',
        isGreaterThan          : '다음보다 더 많음',
        isLessThan             : '다음보다 더 적음',
        isGreaterThanOrEqualTo : '다음보다 더 많거나 동일함',
        isLessThanOrEqualTo    : '다음보다 더 적거나 동일함',
        isBetween              : '다음 사이임',
        isNotBetween           : '다음 사이가 아님',
        isBefore               : '다음 전임',
        isAfter                : '다음 후임',
        isToday                : '오늘임',
        isTomorrow             : '내일임',
        isYesterday            : '어제임',
        isThisWeek             : '이번주임',
        isNextWeek             : '다음주임',
        isLastWeek             : '저번주임',
        isThisMonth            : '이번달임',
        isNextMonth            : '다음달임',
        isLastMonth            : '저번달임',
        isThisYear             : '올해임',
        isNextYear             : '내년임',
        isLastYear             : '작년임',
        isYearToDate           : '지금까지임',
        isTrue                 : '맞음',
        isFalse                : '맞지 않음',
        selectAProperty        : '속성 선택',
        selectAnOperator       : '작업자 선택',
        caseSensitive          : '대소문자 구분',
        and                    : '및',
        dateFormat             : 'D/M/YY',
        selectValue            : '값을 선택하세요',
        selectOneOrMoreValues  : '하나 이상의 값 선택',
        enterAValue            : '값을 입력',
        enterANumber           : '숫자를 입력',
        selectADate            : '날짜를 선택',
        selectATime            : '시간 선택'
    },

    FieldFilterPickerGroup : {
        addFilter : '필터 추가'
    },

    DateHelper : {
        locale         : 'ko',
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
            { single : '1, 000분의1초', plural : 'ms', abbrev : 'ms' },
            { single : '초', plural : '초', abbrev : 's' },
            { single : '분', plural : '분', abbrev : 'min' },
            { single : '시간', plural : '시간', abbrev : 'h' },
            { single : '일', plural : '일', abbrev : 'd' },
            { single : '주', plural : '주', abbrev : 'w' },
            { single : '달', plural : '달', abbrev : 'mon' },
            { single : '분기', plural : '분기', abbrev : 'q' },
            { single : '년', plural : '년', abbrev : 'yr' },
            { single : '10년', plural : '10년', abbrev : 'dec' }
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
            L   : 'YYYY-MM-DD',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '번째'
    }
};

export default LocaleHelper.publishLocale(locale);
