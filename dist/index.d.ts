import { AnyExtension } from '@tiptap/core';
import { BlockquoteOptions } from '@tiptap/extension-blockquote';
import { CodeBlockOptions } from '@tiptap/extension-code-block';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { Editor as Editor_2 } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { ImageOptions } from '@tiptap/extension-image';
import { LinkOptions } from '@tiptap/extension-link';
import { Mark } from '@tiptap/core';
import { Node as Node_2 } from '@tiptap/core';
import { PublicProps } from 'vue';
import { Range as Range_2 } from '@tiptap/core';
import { ShallowRef } from 'vue';
import { TableOptions } from '@tiptap/extension-table';
import { TableRowOptions } from '@tiptap/extension-table';

declare type __VLS_Props = {
    modelValue?: string;
    outputFormat?: OutputFormat;
    /**
     * false — режим ПРОСМОТРА: документ не правится, панели инструментов,
     * слэш-меню и ручка перетаскивания не показываются. Выделение текста при
     * этом остаётся живым намеренно — на нём держится, например, комментирование
     * фрагмента у потребителя.
     *
     * Переключается и в рантайме (см. watch ниже), но состав расширений
     * фиксируется при создании редактора — поэтому просмотр и правку лучше
     * держать разными инстансами, а не переключать один.
     */
    editable?: boolean;
    /**
     * Куда девать выбранный файл картинки. Задан — картинка уходит сюда, а в
     * документ попадает возвращённый src. Не задан — прежнее поведение: файл
     * инлайнится в документ как base64 data URL.
     *
     * Возвращать надо СРАЗУ ОТОБРАЖАЕМЫЙ src: нода вставляется с ним как есть,
     * дожидаться второго запроса редактор не будет. Если ваш адрес требует
     * авторизации (и потому не годится для <img src>), верните blob-URL, а
     * канонический адрес подставьте у себя перед сохранением.
     */
    onImageUpload?: (file: File) => Promise<string>;
    /**
     * Свои расширения Tiptap — дописываются к встроенным. Через это потребитель
     * добавляет собственные ноды и плагины (подсветку комментариев, ссылки на
     * содержимое), не заводя их в общей либе.
     *
     * Читается ОДИН РАЗ при создании редактора: массив, изменившийся позже, не
     * подхватится.
     */
    extensions?: AnyExtension[];
};

/**
 * Присвоить якорь с учётом уже занятых: второй «Установка» станет
 * «ustanovka-2». Пустой заголовок получает позиционный якорь — без него два
 * пустых заголовка делили бы один id.
 */
export declare function anchorFor(text: string, taken: Map<string, number>): string;

export declare const blockquoteExtension: Node_2<BlockquoteOptions, any>;

/**
 * Блок кода с CodeMirror 6 внутри TipTap NodeView.
 *
 * CodeMirror полностью управляет редактированием внутри блока:
 * - Подсветка синтаксиса через @codemirror/language-data (150+ языков, ленивая загрузка)
 * - Авто-детект языка через lowlight.highlightAuto
 * - Правильный Backspace, стрелки, undo/redo — всё делегируется в нужный редактор
 * - Никаких конфликтов транзакций ProseMirror
 */
export declare const codeBlockExtension: Node_2<CodeBlockOptions, any>;

/**
 * Оглавление документа: h1–h3 в порядке появления.
 *
 * Принимает и ProseMirror-Node (у него есть toJSON), и уже разобранный JSON —
 * чтобы одной функцией пользовались и плагин, и потребитель, у которого на
 * руках jsonb из базы.
 */
export declare function collectHeadings(doc: DocLike | null | undefined): Heading[];

export declare const DocEditor: DefineComponent<__VLS_Props, {
editor: ShallowRef<Editor | undefined, Editor | undefined>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
"update:modelValue": (value: string) => any;
imageUploadError: (error: unknown) => any;
parseError: (error: unknown) => any;
}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{
"onUpdate:modelValue"?: ((value: string) => any) | undefined;
onImageUploadError?: ((error: unknown) => any) | undefined;
onParseError?: ((error: unknown) => any) | undefined;
}>, {
editable: boolean;
modelValue: string;
outputFormat: OutputFormat;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
wrapRef: HTMLDivElement;
}, HTMLDivElement>;

declare interface DocLike {
    content?: unknown[];
    toJSON?: () => DocLike;
}

export declare const dragHandleExtension: Extension<any, any>;

export declare const dragHandleState: {
    visible: boolean;
    y: number;
    blockPos: number;
    blockEl: HTMLElement | null;
    isDragging: boolean;
};

/**
 * Якоря заголовков: slug из текста и оглавление документа.
 *
 * Зачем это здесь, а не в атрибутах ноды. Дедупликация («установка»,
 * «установка-2») требует знания ВСЕГО документа, а renderHTML у ноды видит
 * только себя — детерминированного slug'а в атрибутах не сделать в принципе.
 * Поэтому id ставится декорацией (см. extensions/heading), а оглавление
 * считается этой функцией — она проходит документ целиком и нумерует
 * повторы тем же алгоритмом, что и декорация. Один проход, один результат.
 *
 * Следствие, о котором надо знать: editor.getHTML() якорей НЕ содержит —
 * декорации в разметку не попадают. Экспорт HTML на них строить нельзя.
 */
/** Заголовок документа: уровень, текст и якорь. */
export declare interface Heading {
    level: 1 | 2 | 3;
    text: string;
    id: string;
}

export declare const headingAnchorExtension: Extension<any, any>;

export declare const imageExtension: Node_2<ImageOptions, any>;

export declare const linkExtension: Mark<LinkOptions, any>;

export declare type OutputFormat = 'html' | 'json' | 'text' | 'markdown';

export declare const SLASH_ITEMS: SlashItem[];

export declare interface SlashItem {
    title: string;
    description: string;
    icon: unknown;
    category: string;
    showImagePopover?: boolean;
    _src?: string;
    command: (params: {
        editor: Editor_2;
        range: Range_2;
        item: SlashItem;
    }) => void;
}

export declare const slashMenuExtension: Extension<any, any>;

declare interface SlashState {
    visible: boolean;
    x: number;
    y: number;
    items: SlashItem[];
    selectedIndex: number;
    runCommand: ((item: SlashItem) => void) | null;
    pendingEditor: Editor_2 | null;
    pendingRange: Range_2 | null;
    openImagePopover: boolean;
}

export declare const slashState: SlashState;

/** Строка → слаг для якоря: латиница, цифры и дефис. */
export declare function slugify(text: string): string;

/**
 * Подтянуть блоки кода к текущему режиму редактора.
 *
 * Зовётся после editor.setEditable(...) — см. докстринг addStorage выше о том,
 * почему без этого блок кода в просмотре остаётся редактируемым.
 */
export declare function syncCodeBlocksEditable(editor: Editor_2): void;

export declare const tableExtensions: (Node_2<TableOptions, any> | Node_2<TableRowOptions, any>)[];

export { }


declare module '@tiptap/core' {
    interface Storage {
        codeBlock: CodeBlockStorage;
    }
}
