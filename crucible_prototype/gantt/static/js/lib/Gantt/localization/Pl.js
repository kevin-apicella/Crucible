import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/Pl.js';

const locale = {

    localeName : 'Pl',
    localeDesc : 'Polski',
    localeCode : 'pl',

    Object : {
        Save : 'Zapisz'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignoruj kalendarz zasobów'
    },

    InactiveColumn : {
        Inactive : 'Nieaktywny'
    },

    AddNewColumn : {
        'New Column' : 'Nowa kolumna'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Rozpoczęcie według planu bazowego'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Zakończenie według planu bazowego'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Czas trwania według planu bazowego'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Odchylenie rozpoczęcia'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Odchylenie zakończenia'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Odchylenie czasu trwania'
    },

    CalendarColumn : {
        Calendar : 'Kalendarz'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Wczesne rozpoczęcie'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Wczesne zakończenie'
    },

    LateStartDateColumn : {
        'Late Start' : 'Późne rozpoczęcie'
    },

    LateEndDateColumn : {
        'Late End' : 'Późne zakończenie'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Całkowity zastój'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Data ograniczenia'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Rodzaj ograniczenia'
    },

    DeadlineDateColumn : {
        Deadline : 'Termin'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Nieprawidłowa zależność'
    },

    DurationColumn : {
        Duration : 'Czas trwania'
    },

    EffortColumn : {
        Effort : 'Wysiłek'
    },

    EndDateColumn : {
        Finish : 'Zakończ'
    },

    EventModeColumn : {
        'Event mode' : 'Tryb wydarzenia',
        Manual       : 'Ręczny',
        Auto         : 'Automatyczny'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Zaplanowany ręcznie'
    },

    MilestoneColumn : {
        Milestone : 'Krok milowy'
    },

    NameColumn : {
        Name : 'Nazwa'
    },

    NoteColumn : {
        Note : 'Uwaga'
    },

    PercentDoneColumn : {
        '% Done' : 'Ukończone w %'
    },

    PredecessorColumn : {
        Predecessors : 'Poprzednie wydarzenia'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Przypisane zasoby',
        'more resources'     : 'więcej zasobów'
    },

    RollupColumn : {
        Rollup : ' Zestawienie'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Tryb planowania'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Kierunek planowania',
        inheritedFrom       : 'Odziedziczone z',
        enforcedBy          : 'Narzucone przez'
    },

    SequenceColumn : {
        Sequence : 'Kolejność'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Pokaż na osi czasu'
    },

    StartDateColumn : {
        Start : 'Rozpocznij'
    },

    SuccessorColumn : {
        Successors : 'Następne wydarzenia'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiuj',
        cutTask   : 'Wytnij',
        pasteTask : 'Wklej'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Zmień numer'
    },

    DependencyField : {
        invalidDependencyFormat : 'Nieprawidłowy format zależności'
    },

    ProjectLines : {
        'Project Start' : 'Rozpoczęcie projektu',
        'Project End'   : 'Zakończenie projektu'
    },

    TaskTooltip : {
        Start    : 'Początek',
        End      : 'Koniec',
        Duration : 'Czas trwania',
        Complete : 'Zakończony'
    },

    AssignmentGrid : {
        Name     : 'Nazwa zasobu',
        Units    : 'Jednostki',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Edytuj',
        Indent                 : 'Akapit',
        Outdent                : 'Zmniejsz akapit',
        'Convert to milestone' : 'Konwertuj na krok milowy',
        Add                    : 'Dodaj..',
        'New task'             : 'Nowe zadanie',
        'New milestone'        : 'Nowy krok milowy',
        'Task above'           : 'Zadanie powyżej',
        'Task below'           : 'Zadanie poniżej',
        'Delete task'          : 'Usuń',
        Milestone              : 'Krok milowy',
        'Sub-task'             : 'Podzadanie',
        Successor              : 'Następne wydarzenie',
        Predecessor            : 'Poprzednie wydarzenie',
        changeRejected         : 'Mechanizm planowania odrzucił zmiany',
        linkTasks              : 'Dodaj zależności',
        unlinkTasks            : 'Usuń zależności',
        color                  : 'Kolor'
    },

    EventSegments : {
        splitTask : 'Podziel zadanie'
    },

    Indicators : {
        earlyDates   : 'Wczesny początek/koniec',
        lateDates    : 'Późny początek/koniec',
        Start        : 'Początek',
        End          : 'Koniec',
        deadlineDate : 'Termin'
    },

    Versions : {
        indented     : 'Z wcięciem',
        outdented    : 'Bez wcięcia',
        cut          : 'Wytnij',
        pasted       : 'Wklejono',
        deletedTasks : 'Usunięto zadania'
    }
};

export default LocaleHelper.publishLocale(locale);
