import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../SchedulerPro/localization/FrFr.js';

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',

    Object : {
        Save : 'Enregistrer'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorer le calendrier des ressources'
    },

    InactiveColumn : {
        Inactive : 'Inactive'
    },

    AddNewColumn : {
        'New Column' : 'Nouvelle colonne'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Début planifié'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Fin planifié'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Durée planifié'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Variation de début'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Variation de fin'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Variation de durée'
    },

    CalendarColumn : {
        Calendar : 'Calendrier'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Début au plus tôt'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Fin au plus tôt'
    },

    LateStartDateColumn : {
        'Late Start' : 'Début au plus tard'
    },

    LateEndDateColumn : {
        'Late End' : 'Fin au plus tard'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Marge totale'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Date de contrainte'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Type de contrainte'
    },

    DeadlineDateColumn : {
        Deadline : 'Délai'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dépendance invalide'
    },

    DurationColumn : {
        Duration : 'Durée'
    },

    EffortColumn : {
        Effort : 'Effort'
    },

    EndDateColumn : {
        Finish : 'Fin'
    },

    EventModeColumn : {
        'Event mode' : "Mode d'événement",
        Manual       : 'Manuel',
        Auto         : 'Auto'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Planifié manuellement'
    },

    MilestoneColumn : {
        Milestone : 'Jalon'
    },

    NameColumn : {
        Name : 'Nom'
    },

    NoteColumn : {
        Note : 'Note'
    },

    PercentDoneColumn : {
        '% Done' : 'Fait à %'
    },

    PredecessorColumn : {
        Predecessors : 'Prédécesseurs'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Ressources attribuées',
        'more resources'     : 'davantage de ressources'
    },

    RollupColumn : {
        Rollup : 'Report au récapitulatif'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Mode de planification'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Direction de planification',
        inheritedFrom       : 'Hérité de',
        enforcedBy          : 'Imposé par'
    },

    SequenceColumn : {
        Sequence : 'Séquence'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Afficher dans la chronologie'
    },

    StartDateColumn : {
        Start : 'Début'
    },

    SuccessorColumn : {
        Successors : 'Successeurs'
    },

    TaskCopyPaste : {
        copyTask  : 'Copier',
        cutTask   : 'Couper',
        pasteTask : 'Coller'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Renuméroter'
    },

    DependencyField : {
        invalidDependencyFormat : 'Format de dépendance invalide'
    },

    ProjectLines : {
        'Project Start' : 'Début du projet',
        'Project End'   : 'Fin du projet'
    },

    TaskTooltip : {
        Start    : 'Début',
        End      : 'Fin',
        Duration : 'Durée',
        Complete : 'Terminé'
    },

    AssignmentGrid : {
        Name     : 'Nom de la ressource',
        Units    : 'Unités',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    Gantt : {
        Edit                   : 'Éditer',
        Indent                 : 'Indenter',
        Outdent                : 'Désindenter',
        'Convert to milestone' : 'Convertir en jalon',
        Add                    : 'Ajouter...',
        'New task'             : 'Nouvelle tâche',
        'New milestone'        : 'Nouvel jalon',
        'Task above'           : 'Tâche ci-dessus',
        'Task below'           : 'Tâche ci-dessous',
        'Delete task'          : 'Supprimer la tâche',
        Milestone              : 'Jalon',
        'Sub-task'             : 'Sous-tâche',
        Successor              : 'Successeur',
        Predecessor            : 'Prédécesseur',
        changeRejected         : 'Le moteur de planification a rejeté les changements',
        linkTasks              : 'Ajouter des dépendances',
        unlinkTasks            : 'Supprimer les dépendances',
        color                  : 'Couleur'
    },

    EventSegments : {
        splitTask : 'Diviser la tâche'
    },

    Indicators : {
        earlyDates   : 'Début/fin au plus tôt',
        lateDates    : 'Début/fin au plus tard',
        Start        : 'Début',
        End          : 'Fin',
        deadlineDate : 'Délai'
    },

    Versions : {
        indented     : 'En retrait',
        outdented    : 'En retrait vers la gauche',
        cut          : 'Coupé',
        pasted       : 'Collé',
        deletedTasks : 'Tâches supprimées'
    }
};

export default LocaleHelper.publishLocale(locale);
