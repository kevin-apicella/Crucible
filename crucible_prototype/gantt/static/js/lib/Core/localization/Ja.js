import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Ja',
    localeDesc : '日本語',
    localeCode : 'ja',

    Object : {
        Yes    : 'はい',
        No     : 'いいえ',
        Cancel : '取り消す',
        Ok     : 'OK',
        Week   : '週',
        None   : 'なし'
    },

    ColorPicker : {
        noColor : '色なし'
    },

    Combo : {
        noResults          : '結果がありません',
        recordNotCommitted : 'レコードは追加できませんでした',
        addNewValue        : value => `${value} を追加`
    },

    FilePicker : {
        file : 'ファイル'
    },

    Field : {
        badInput              : '無効なフィールド値です',
        patternMismatch       : '値は特定のパターンに一致する必要があります',
        rangeOverflow         : value => `値は${value.max}以下である必要があります`,
        rangeUnderflow        : value => `値は${value.min}以上である必要があります`,
        stepMismatch          : '値はステップと合っている必要があります',
        tooLong               : '値が長すぎます',
        tooShort              : '値が短すぎます',
        typeMismatch          : '値は特殊な形式である必要があります',
        valueMissing          : 'このフィールドは必須です',
        invalidValue          : '無効なフィールド値です',
        minimumValueViolation : '最低値エラーです',
        maximumValueViolation : '最高値エラーです',
        fieldRequired         : 'このフィールドは必須です',
        validateFilter        : 'リストから値を選択してください'
    },

    DateField : {
        invalidDate : '無効な日付が入力されました'
    },

    DatePicker : {
        gotoPrevYear  : '前年へ行く',
        gotoPrevMonth : '前月へ行く',
        gotoNextMonth : '翌月へ行く',
        gotoNextYear  : '翌年へ行く'
    },

    NumberFormat : {
        locale   : 'ja',
        currency : 'JPY'
    },

    DurationField : {
        invalidUnit : '無効な単位です'
    },

    TimeField : {
        invalidTime : '無効な時間が入力されました'
    },

    TimePicker : {
        hour   : '時間',
        minute : '分',
        second : '秒'
    },

    List : {
        loading   : '読み込み中です',
        selectAll : 'すべて選択'
    },

    GridBase : {
        loadMask : '読み込み中です',
        syncMask : '変更を保存中です。お待ちください。'
    },

    PagingToolbar : {
        firstPage         : '先頭ページへ行く',
        prevPage          : '前のページへ行く',
        page              : 'ページ',
        nextPage          : '次のページへ行く',
        lastPage          : '最終ページへ行く',
        reload            : '現在のページを再読み込みする',
        noRecords         : '表示するレコードがありません',
        pageCountTemplate : data => ` ${data.lastPage}件のうち`,
        summaryTemplate   : data => `${data.allCount}件のうち ${data.start} - ${data.end} 件を表示 `
    },

    PanelCollapser : {
        Collapse : '縮小する',
        Expand   : '拡張する'
    },

    Popup : {
        close : 'ポップアップを閉じる'
    },

    UndoRedo : {
        Undo           : '取り消す',
        Redo           : 'やり直す',
        UndoLastAction : '最後のアクションを取り消す',
        RedoLastAction : '最後に取り消したアクションをやり直す',
        NoActions      : '取り消しキューにアイテムがありません'
    },

    FieldFilterPicker : {
        equals                 : 'に等しい',
        doesNotEqual           : 'に等しくない',
        isEmpty                : 'は空である',
        isNotEmpty             : 'は空でない',
        contains               : 'を含む',
        doesNotContain         : 'を含まない',
        startsWith             : 'で始まる',
        endsWith               : 'で終わる',
        isOneOf                : 'のひとつである',
        isNotOneOf             : 'のひとつでない',
        isGreaterThan          : 'より大きい',
        isLessThan             : 'より小さい',
        isGreaterThanOrEqualTo : '以上である',
        isLessThanOrEqualTo    : '以下である',
        isBetween              : 'との間である',
        isNotBetween           : 'との間ではない',
        isBefore               : 'より前である',
        isAfter                : 'より後である',
        isToday                : '今日である',
        isTomorrow             : '明日である',
        isYesterday            : '昨日である',
        isThisWeek             : '今週である',
        isNextWeek             : '来週である',
        isLastWeek             : '先週である',
        isThisMonth            : '今月である',
        isNextMonth            : '来月である',
        isLastMonth            : '先月である',
        isThisYear             : '今年である',
        isNextYear             : '来年である',
        isLastYear             : '昨年である',
        isYearToDate           : '今年の始めから今日までである',
        isTrue                 : 'は真実である',
        isFalse                : 'は偽りである',
        selectAProperty        : 'プロパティを選択する',
        selectAnOperator       : 'オペレーターを選択する',
        caseSensitive          : 'ケースセンシティブ',
        and                    : 'および',
        dateFormat             : 'YY/M/DD a',
        selectValue            : '値を選択',
        selectOneOrMoreValues  : 'ひとつ以上の値を選択する',
        enterAValue            : '値を入力する',
        enterANumber           : '数字を入力する',
        selectADate            : '日付を選択する',
        selectATime            : '時間を選択'
    },

    FieldFilterPickerGroup : {
        addFilter : 'フィルタ―を追加する'
    },

    DateHelper : {
        locale         : 'ja',
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
            { single : 'ミリ秒', plural : 'ミリ秒', abbrev : 'ms' },
            { single : '秒', plural : '秒', abbrev : 's' },
            { single : '分', plural : '分', abbrev : 'min' },
            { single : '時間', plural : '時間', abbrev : 'h' },
            { single : '日', plural : '日', abbrev : 'd' },
            { single : '週', plural : '週', abbrev : 'w' },
            { single : '月', plural : '月', abbrev : 'mon' },
            { single : '四半期', plural : '四半期', abbrev : 'q' },
            { single : '年', plural : '年', abbrev : 'yr' },
            { single : '十年', plural : '十年', abbrev : 'dec' }
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
            L   : 'YYYY年MM月DD日',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '位'
    }
};

export default LocaleHelper.publishLocale(locale);
