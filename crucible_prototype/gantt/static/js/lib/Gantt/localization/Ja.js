import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Ja.js';

const locale = {

    localeName : 'Ja',
    localeDesc : '日本語',
    localeCode : 'ja',

    Object : {
        Save : '保存する'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'リソースカレンダーを無視する'
    },

    InactiveColumn : {
        Inactive : '非アクティブ'
    },

    AddNewColumn : {
        'New Column' : '新しい列'
    },

    BaselineStartDateColumn : {
        baselineStart : '基準開始日'
    },

    BaselineEndDateColumn : {
        baselineEnd : '基準終了日'
    },

    BaselineDurationColumn : {
        baselineDuration : '基準期間'
    },

    BaselineStartVarianceColumn : {
        startVariance : '開始日の差異'
    },

    BaselineEndVarianceColumn : {
        endVariance : '終了日の差異'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : '期間差異'
    },

    CalendarColumn : {
        Calendar : '予定表'
    },

    EarlyStartDateColumn : {
        'Early Start' : '最早開始日'
    },

    EarlyEndDateColumn : {
        'Early End' : '最早 終了日'
    },

    LateStartDateColumn : {
        'Late Start' : '最遅開始日'
    },

    LateEndDateColumn : {
        'Late End' : '最遅終了日'
    },

    TotalSlackColumn : {
        'Total Slack' : '総 余裕期間'
    },

    ConstraintDateColumn : {
        'Constraint Date' : '制約日'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : '制約タイプ'
    },

    DeadlineDateColumn : {
        Deadline : '納期'
    },

    DependencyColumn : {
        'Invalid dependency' : '無効な依存関係'
    },

    DurationColumn : {
        Duration : '期間'
    },

    EffortColumn : {
        Effort : ' 工数'
    },

    EndDateColumn : {
        Finish : '終了'
    },

    EventModeColumn : {
        'Event mode' : 'イベントモード',
        Manual       : '手動',
        Auto         : '自動'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : '手動スケジュール'
    },

    MilestoneColumn : {
        Milestone : 'マイルストーン'
    },

    NameColumn : {
        Name : '名前'
    },

    NoteColumn : {
        Note : '備考'
    },

    PercentDoneColumn : {
        '% Done' : '％完了'
    },

    PredecessorColumn : {
        Predecessors : '先行タスク'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'リソース割り当て',
        'more resources'     : 'その他のリソース'
    },

    RollupColumn : {
        Rollup : ' ロールアップ'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'スケジュールモード'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'スケジューリング方向',
        inheritedFrom       : '継承された',
        enforcedBy          : '強制された'
    },

    SequenceColumn : {
        Sequence : 'シーケンス'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'タイムラインビュー'
    },

    StartDateColumn : {
        Start : '開始'
    },

    SuccessorColumn : {
        Successors : '後続タスク'
    },

    TaskCopyPaste : {
        copyTask  : 'コピーする',
        cutTask   : '切り取る',
        pasteTask : '貼り付ける'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : '再割り当て'
    },

    DependencyField : {
        invalidDependencyFormat : '無効な依存フォーマット'
    },

    ProjectLines : {
        'Project Start' : 'プロジェクト開始',
        'Project End'   : 'プロジェクト終了'
    },

    TaskTooltip : {
        Start    : '開始',
        End      : '終了',
        Duration : '期間',
        Complete : '完了'
    },

    AssignmentGrid : {
        Name     : 'リソース名',
        Units    : '単位',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : '編集する',
        Indent                 : 'インデント',
        Outdent                : 'アウトデント',
        'Convert to milestone' : 'マイルストーンに変換する',
        Add                    : '・・・を追加する',
        'New task'             : '新しいタスク',
        'New milestone'        : '新しいマイルストーン',
        'Task above'           : '上部のタスク',
        'Task below'           : '下部のタスク',
        'Delete task'          : '削除する',
        Milestone              : 'マイルストーン',
        'Sub-task'             : 'サブタスク',
        Successor              : '後続タスク',
        Predecessor            : '先行タスク',
        changeRejected         : 'スケージュールエンジンが 変更を拒否',
        linkTasks              : '依存関係を追加する',
        unlinkTasks            : '依存関係を削除する',
        color                  : '色'
    },

    EventSegments : {
        splitTask : 'タスクを分割する'
    },

    Indicators : {
        earlyDates   : '最早開始日／終了日',
        lateDates    : '最遅開始日／終了日',
        Start        : '開始',
        End          : '終了',
        deadlineDate : '納期日'
    },

    Versions : {
        indented     : 'レベルを下げた',
        outdented    : 'レベル上げた',
        cut          : '切り取った',
        pasted       : '貼り付けた',
        deletedTasks : '削除したタスク'
    }
};

export default LocaleHelper.publishLocale(locale);
