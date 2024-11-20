import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'PtBr',
    localeDesc : 'Português do Brasil',
    localeCode : 'pt-BR',

    Object : {
        Yes    : 'Sim',
        No     : 'Não',
        Cancel : 'Cancelar',
        Ok     : 'OK',
        Week   : 'Semana',
        None   : 'Nenhum'
    },

    ColorPicker : {
        noColor : 'Sem cor'
    },

    Combo : {
        noResults          : 'Sem resultados',
        recordNotCommitted : 'Não foi possível adicionar o registo',
        addNewValue        : value => `Adicionar ${value}`
    },

    FilePicker : {
        file : 'Arquivo'
    },

    Field : {
        badInput              : 'Valor de campo inválido',
        patternMismatch       : 'O valor deve corresponder a um padrão específico',
        rangeOverflow         : value => `O valor deve ser inferior ou igual a ${value.max}`,
        rangeUnderflow        : value => `O valor deve ser superior ou igual a ${value.min}`,
        stepMismatch          : 'O valor deve corresponder ao passo',
        tooLong               : 'O valor deve ser mais curto',
        tooShort              : 'O valor deve ser mais comprido',
        typeMismatch          : 'O valor deve estar num formato especial',
        valueMissing          : 'Este campo é obrigatório',
        invalidValue          : 'Valor de campo inválido',
        minimumValueViolation : 'Erro de valor mínimo',
        maximumValueViolation : 'Erro de valor máximo',
        fieldRequired         : 'Este campo é obrigatório',
        validateFilter        : 'O valor deve ser selecionado a partir da lista'
    },

    DateField : {
        invalidDate : 'Data inválida'
    },

    DatePicker : {
        gotoPrevYear  : 'Ir para o ano anterior',
        gotoPrevMonth : 'Ir para o mês anterior',
        gotoNextMonth : 'Ir para o mês seguinte',
        gotoNextYear  : 'Ir para o ano seguinte'
    },

    NumberFormat : {
        locale   : 'pt-BR',
        currency : 'BRL'
    },

    DurationField : {
        invalidUnit : 'Unidade inválida'
    },

    TimeField : {
        invalidTime : 'Hora inválida'
    },

    TimePicker : {
        hour   : 'Hora',
        minute : 'Minuto',
        second : 'Segundo'
    },

    List : {
        loading   : 'Carregando...',
        selectAll : 'Selecionar Todos'
    },

    GridBase : {
        loadMask : 'Carregando...',
        syncMask : 'Salvando alterações, aguarde...'
    },

    PagingToolbar : {
        firstPage         : 'Ir para a primeira página',
        prevPage          : 'Ir para a página anterior',
        page              : 'Página',
        nextPage          : 'Ir para a página seguinte',
        lastPage          : 'Ir para a última página',
        reload            : 'Recarregar página atual',
        noRecords         : 'Sem registos',
        pageCountTemplate : data => `de ${data.lastPage}`,
        summaryTemplate   : data => `Mostrando registos ${data.start} - ${data.end} até ${data.allCount}`
    },

    PanelCollapser : {
        Collapse : 'Fechar',
        Expand   : 'Expandir'
    },

    Popup : {
        close : 'Fechar mensagem pop-up'
    },

    UndoRedo : {
        Undo           : 'Desfazer',
        Redo           : 'Refazer',
        UndoLastAction : 'Desfazer a última ação',
        RedoLastAction : 'Refazer a última ação',
        NoActions      : 'Não existem itens na fila de ações'
    },

    FieldFilterPicker : {
        equals                 : 'igual a',
        doesNotEqual           : 'não é igual a',
        isEmpty                : 'está vazio',
        isNotEmpty             : 'não está vazio',
        contains               : 'contém',
        doesNotContain         : 'não contém',
        startsWith             : 'começa por',
        endsWith               : 'termina por',
        isOneOf                : 'é um de',
        isNotOneOf             : 'não é um de',
        isGreaterThan          : 'é maior do que',
        isLessThan             : 'é menor do que',
        isGreaterThanOrEqualTo : 'é maior do que ou igual a',
        isLessThanOrEqualTo    : 'é menor do que ou igual a',
        isBetween              : 'está entre',
        isNotBetween           : 'não está entre',
        isBefore               : 'está antes de',
        isAfter                : 'está depois de',
        isToday                : 'é hoje',
        isTomorrow             : 'é amanhã',
        isYesterday            : 'é ontem',
        isThisWeek             : 'é esta semana',
        isNextWeek             : 'é a próxima semana',
        isLastWeek             : 'é a semana passada',
        isThisMonth            : 'é este mês',
        isNextMonth            : 'é o próximo mês',
        isLastMonth            : 'é o último mês',
        isThisYear             : 'é este ano',
        isNextYear             : 'é o próximo ano',
        isLastYear             : 'é o último ano',
        isYearToDate           : 'é o ano até à data',
        isTrue                 : 'é verdadeiro',
        isFalse                : 'é falso',
        selectAProperty        : 'Selecione uma propriedade',
        selectAnOperator       : 'Selecione um operador',
        caseSensitive          : 'Case-sensitive',
        and                    : 'e',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Selecione valor',
        selectOneOrMoreValues  : 'Selecione um ou mais valores',
        enterAValue            : 'Digite um valor',
        enterANumber           : 'Digite um número',
        selectADate            : 'Selecione uma data',
        selectATime            : 'Selecione hora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Adicionar filtro'
    },

    DateHelper : {
        locale         : 'pt-BR',
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
            { single : 'milissegundo', plural : 'ms', abbrev : 'ms' },
            { single : 'segundo', plural : 'segundos', abbrev : 's' },
            { single : 'minuto', plural : 'minutos', abbrev : 'min' },
            { single : 'hora', plural : 'horas', abbrev : 'h' },
            { single : 'dia', plural : 'dias', abbrev : 'd' },
            { single : 'semana', plural : 'semanas', abbrev : 'sem' },
            { single : 'mês', plural : 'meses', abbrev : 'mês' },
            { single : 'trimestre', plural : 'trimestres', abbrev : 'trim' },
            { single : 'ano', plural : 'anos', abbrev : 'a' },
            { single : 'década', plural : 'décadas', abbrev : 'dec' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['s', 'seg'],
            ['m', 'min'],
            ['h', 'hr'],
            ['d'],
            ['sem', 'seman'],
            ['m', 'mês', 'mes'],
            ['t', 'trim', 'trmt'],
            ['a', 'ano'],
            ['dec']
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            return number + '°';
        }
    }
};

export default LocaleHelper.publishLocale(locale);
