import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Ko.js';

const locale = {

    localeName : 'Ko',
    localeDesc : '한국어',
    localeCode : 'ko',

    Object : {
        Save : '저장'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : '리소스 일정 무시'
    },

    InactiveColumn : {
        Inactive : '비활성화'
    },

    AddNewColumn : {
        'New Column' : '신규 열'
    },

    BaselineStartDateColumn : {
        baselineStart : '초기 시작 날짜 필드'
    },

    BaselineEndDateColumn : {
        baselineEnd : '초기 완료 날짜 필드'
    },

    BaselineDurationColumn : {
        baselineDuration : '기준 기간'
    },

    BaselineStartVarianceColumn : {
        startVariance : '시작 날짜 차이'
    },

    BaselineEndVarianceColumn : {
        endVariance : '완료 날짜 차이'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : '기간차'
    },

    CalendarColumn : {
        Calendar : '캘린더'
    },

    EarlyStartDateColumn : {
        'Early Start' : '이른 시작'
    },

    EarlyEndDateColumn : {
        'Early End' : '이른 종료'
    },

    LateStartDateColumn : {
        'Late Start' : '늦은 시작'
    },

    LateEndDateColumn : {
        'Late End' : '늦은 종료'
    },

    TotalSlackColumn : {
        'Total Slack' : '전체 여유 시간'
    },

    ConstraintDateColumn : {
        'Constraint Date' : '날짜 제한'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : '제한 유형'
    },

    DeadlineDateColumn : {
        Deadline : '마감일'
    },

    DependencyColumn : {
        'Invalid dependency' : '의존 관계가 유효하지 않음'
    },

    DurationColumn : {
        Duration : '기간'
    },

    EffortColumn : {
        Effort : '업무'
    },

    EndDateColumn : {
        Finish : '마감'
    },

    EventModeColumn : {
        'Event mode' : '일정 모드',
        Manual       : '수동',
        Auto         : '자동'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : '수동으로 일정 예약'
    },

    MilestoneColumn : {
        Milestone : '마일스톤'
    },

    NameColumn : {
        Name : '이름'
    },

    NoteColumn : {
        Note : '참고'
    },

    PercentDoneColumn : {
        '% Done' : '% 완료'
    },

    PredecessorColumn : {
        Predecessors : '선행 활동'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : '할당된 리소스',
        'more resources'     : '추가 리소스'
    },

    RollupColumn : {
        Rollup : '롤업'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : '스케줄 관리 모드'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : '일정 방향',
        inheritedFrom       : '계승됨',
        enforcedBy          : '강제로 시행됨'
    },

    SequenceColumn : {
        Sequence : '연속'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : '타임라인에 표시'
    },

    StartDateColumn : {
        Start : '시작'
    },

    SuccessorColumn : {
        Successors : '후행 활동'
    },

    TaskCopyPaste : {
        copyTask  : '복사하기',
        cutTask   : '잘라내기',
        pasteTask : '붙여넣기'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : '번호 재지정'
    },

    DependencyField : {
        invalidDependencyFormat : '유효하지 않은 의존 관계 형식'
    },

    ProjectLines : {
        'Project Start' : '프로젝트 시작',
        'Project End'   : '프로젝트 종료'
    },

    TaskTooltip : {
        Start    : '시작',
        End      : '종료',
        Duration : '기간',
        Complete : '완료'
    },

    AssignmentGrid : {
        Name     : '리소스 이름',
        Units    : '단위',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : '편집',
        Indent                 : '들여쓰기',
        Outdent                : '내어쓰기',
        'Convert to milestone' : '마일스톤으로 변환',
        Add                    : '추가...',
        'New task'             : '새 작업',
        'New milestone'        : '새 마일스톤',
        'Task above'           : '이상의 작업',
        'Task below'           : '이하의 작업',
        'Delete task'          : '삭제',
        Milestone              : '마일스톤',
        'Sub-task'             : '하위 작업',
        Successor              : '후행 활동',
        Predecessor            : '선행 활동',
        changeRejected         : '스케줄링 엔진이 변경 사항을 거부했습니다',
        linkTasks              : '의존성 추가',
        unlinkTasks            : '의존성 제거',
        color                  : '색'
    },

    EventSegments : {
        splitTask : '작업 나누기'
    },

    Indicators : {
        earlyDates   : '이른 시작/종료',
        lateDates    : '늦은 시작/종료',
        Start        : '시작',
        End          : '종료',
        deadlineDate : '마감일'
    },

    Versions : {
        indented     : '들여쓰기',
        outdented    : '내어쓰기',
        cut          : '잘라내기',
        pasted       : '붙여넣기',
        deletedTasks : '삭제된 작업'
    }
};

export default LocaleHelper.publishLocale(locale);
