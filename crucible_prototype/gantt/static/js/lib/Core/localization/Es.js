import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',

    Object : {
        Yes    : 'Sí',
        No     : 'No',
        Cancel : 'Cancelar',
        Ok     : 'Correcto',
        Week   : 'Semana',
        None   : 'Ninguno'
    },

    ColorPicker : {
        noColor : 'Sin color'
    },

    Combo : {
        noResults          : 'Sin resultados',
        recordNotCommitted : 'No se ha podido añadir un registro',
        addNewValue        : value => `Agregar ${value}`
    },

    FilePicker : {
        file : 'Archivo'
    },

    Field : {
        badInput              : 'Valor de campo no válido',
        patternMismatch       : 'El valor debe coincidir con un patrón específico',
        rangeOverflow         : value => `El valor debe ser inferior o igual a ${value.max}`,
        rangeUnderflow        : value => `El valor debe ser superior o igual a ${value.min}`,
        stepMismatch          : 'El valor debe adaptarse al paso',
        tooLong               : 'El valor debe ser más corto',
        tooShort              : 'El valor debe ser más largo',
        typeMismatch          : 'El valor debe estar en un formato especial',
        valueMissing          : 'Este campo es obligatorio',
        invalidValue          : 'Valor de campo no válido',
        minimumValueViolation : 'Infracción de valor mínimo',
        maximumValueViolation : 'Infracción de valor máximo',
        fieldRequired         : 'Este campo es obligatorio',
        validateFilter        : 'El valor debe seleccionarse de la lista'
    },

    DateField : {
        invalidDate : 'Entrada de fecha no válida'
    },

    DatePicker : {
        gotoPrevYear  : 'Ir al año anterior',
        gotoPrevMonth : 'Ir al mes anterior',
        gotoNextMonth : 'Ir al mes siguiente',
        gotoNextYear  : 'Ir al año siguiente'
    },

    NumberFormat : {
        locale   : 'es',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unidad no válida'
    },

    TimeField : {
        invalidTime : 'Entrada de hora no válida'
    },

    TimePicker : {
        hour   : 'Hora',
        minute : 'Minuto',
        second : 'Segundo'
    },

    List : {
        loading   : 'Cargando...',
        selectAll : 'Seleccionar todo'
    },

    GridBase : {
        loadMask : 'Cargando...',
        syncMask : 'Guardando cambios, espere...'
    },

    PagingToolbar : {
        firstPage         : 'Ir a la primera página',
        prevPage          : 'Ir a la página anterior',
        page              : 'Página',
        nextPage          : 'Ir a la página siguiente',
        lastPage          : 'Ir a la última página',
        reload            : 'Refrescar la página actual',
        noRecords         : 'Sin registros que mostrar',
        pageCountTemplate : data => `de ${data.lastPage}`,
        summaryTemplate   : data => `Mostrando registros ${data.start} - ${data.end} de ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Contrar',
        Expand   : 'Expandir'
    },

    Popup : {
        close : 'Cerrar desplegable'
    },

    UndoRedo : {
        Undo           : 'Deshacer',
        Redo           : 'Rehacer',
        UndoLastAction : 'Deshacer la última acción',
        RedoLastAction : 'Rehacer la última acción deshecha',
        NoActions      : 'Sin elementos en la cola de deshacer'
    },

    FieldFilterPicker : {
        equals                 : 'equivale a',
        doesNotEqual           : 'no equivale a',
        isEmpty                : 'está vacío',
        isNotEmpty             : 'no está vacío',
        contains               : 'contiene',
        doesNotContain         : 'no contiene',
        startsWith             : 'empieza por',
        endsWith               : 'termina por',
        isOneOf                : 'es uno de',
        isNotOneOf             : 'no es uno de',
        isGreaterThan          : 'es mayor que',
        isLessThan             : 'es menor que',
        isGreaterThanOrEqualTo : 'es mayor que o igual a',
        isLessThanOrEqualTo    : 'es menor que o igual a',
        isBetween              : 'está entre',
        isNotBetween           : 'no está entre',
        isBefore               : 'es anterior',
        isAfter                : 'es posterior',
        isToday                : 'es hoy',
        isTomorrow             : 'es mañana',
        isYesterday            : 'fue ayer',
        isThisWeek             : 'es esta semana',
        isNextWeek             : 'es la semana que viene',
        isLastWeek             : 'fue la semana pasada',
        isThisMonth            : 'es este mes',
        isNextMonth            : 'es el mes que viene',
        isLastMonth            : 'fue el mes pasado',
        isThisYear             : 'es este año',
        isNextYear             : 'es el año que viene',
        isLastYear             : 'fue el año pasado',
        isYearToDate           : 'es el año hasta la fecha',
        isTrue                 : 'es cierto',
        isFalse                : 'es falso',
        selectAProperty        : 'Seleccionar una propiedad',
        selectAnOperator       : 'Seleccionar un operador',
        caseSensitive          : 'Diferencia entre mayúsculas y minúsculas',
        and                    : 'y',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Seleccione valor',
        selectOneOrMoreValues  : 'Seleccionar uno o más valores',
        enterAValue            : 'Introducir un valor',
        enterANumber           : 'Introducir un número',
        selectADate            : 'Seleccionar fecha',
        selectATime            : 'Seleccionar hora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Añadir filtro'
    },

    DateHelper : {
        locale         : 'es',
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
            { single : 'milisegundo', plural : 'ms', abbrev : 'ms' },
            { single : 'segundo', plural : 'segundos', abbrev : 's' },
            { single : 'minuto', plural : 'minutos', abbrev : 'min' },
            { single : 'hora', plural : 'horas', abbrev : 'h' },
            { single : 'día', plural : 'días', abbrev : 'd' },
            { single : 'semana', plural : 'semanas', abbrev : 'sem.' },
            { single : 'mes', plural : 'meses', abbrev : 'mes' },
            { single : 'trimestre', plural : 'trimestres', abbrev : 'trim.' },
            { single : 'año', plural : 'años', abbrev : 'a.' },
            { single : 'década', plural : 'décadas', abbrev : 'déc.' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'seg'],
            ['m', 'min'],
            ['h', 'hr'],
            ['d'],
            ['sem.', 'sem'],
            ['m', 'mes'],
            ['T', 'trim'],
            ['a', 'añ'],
            ['déc']
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '°'
    }
};

export default LocaleHelper.publishLocale(locale);
