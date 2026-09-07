<script setup lang="ts">
import { watch, onBeforeUnmount, ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { imageExtension } from './extensions/image'
import Highlight from '@tiptap/extension-highlight'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { tableExtensions } from './extensions/table'
import TableControls from './extensions/table/TableControls.vue'
import { linkExtension } from './extensions/link'
import TextAlign from '@tiptap/extension-text-align'
import LinkControls from './extensions/link/LinkControls.vue'
import { blockquoteExtension } from './extensions/blockquote'
import { codeBlockExtension, syncCodeBlocksEditable } from './extensions/code-block'
import Underline from '@tiptap/extension-underline'
import BubbleMenuBar from './extensions/bubble-menu/BubbleMenuBar.vue'
import { slashMenuExtension } from './extensions/slash-menu'
import SlashMenu from './extensions/slash-menu/SlashMenu.vue'
import { dragHandleExtension } from './extensions/drag-handle'
import DragHandleBar from './extensions/drag-handle/DragHandleBar.vue'
import { headingAnchorExtension } from './extensions/heading'
import type { AnyExtension, Editor } from '@tiptap/core'

// ── Форматы вывода ────────────────────────────────────────────────────────────

export type OutputFormat = 'html' | 'json' | 'text' | 'markdown'

// ── marked: вставка Markdown через paste ─────────────────────────────────────

marked.use({ gfm: true, breaks: true })

function looksLikeMarkdown(text: string): boolean {
  return /^#{1,6}\s|^\s*[-*+]\s|^\s*\|.+\||\*\*.+\*\*|__.+__|`{1,3}|\[.+\]\(.+\)|\n\|[-:| ]+\|/m.test(text)
}

// ── turndown: HTML → Markdown ─────────────────────────────────────────────────

const td = new TurndownService({
  headingStyle:   'atx',       // ## Заголовок
  hr:             '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',    // ```lang
  fence:          '```',
  emDelimiter:    '_',
  strongDelimiter: '**',
  linkStyle:      'inlined',
})

// Таблицы
td.addRule('table', {
  filter: ['table'],
  replacement(_content, node) {
    const rows = Array.from((node as HTMLElement).querySelectorAll('tr'))
    if (!rows.length) return ''

    const toMd = (row: Element, isHeader: boolean) => {
      const cells = Array.from(row.querySelectorAll('th, td'))
          .map(cell => cell.textContent?.trim().replace(/\|/g, '\\|') ?? '')
      const line = `| ${cells.join(' | ')} |`
      const sep  = `| ${cells.map(() => '---').join(' | ')} |`
      return isHeader ? `${line}\n${sep}` : line
    }

    return '\n\n' + rows.map((row, i) => toMd(row, i === 0)).join('\n') + '\n\n'
  },
})

// Выделение цветом (<mark>) → ==текст==
td.addRule('highlight', {
  filter: ['mark'],
  replacement: (content) => `==${content}==`,
})

// Подчёркивание → <u>текст</u> (нет аналога в стандартном MD)
td.addRule('underline', {
  filter: ['u'],
  replacement: (content) => `<u>${content}</u>`,
})

// Task list: <li data-checked> → - [x] / - [ ]
td.addRule('taskItem', {
  filter(node) {
    return (
        node.nodeName === 'LI' &&
        node.parentElement?.getAttribute('data-type') === 'taskList'
    )
  },
  replacement(content, node) {
    const checked = (node as HTMLElement).getAttribute('data-checked') === 'true'
    return `- [${checked ? 'x' : ' '}] ${content.trim()}\n`
  },
})

function htmlToMarkdown(html: string): string {
  return td.turndown(html)
}

// ── Props / Emits ─────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  modelValue?:  string
  outputFormat?: OutputFormat
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
  editable?: boolean
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
  onImageUpload?: (file: File) => Promise<string>
  /**
   * Свои расширения Tiptap — дописываются к встроенным. Через это потребитель
   * добавляет собственные ноды и плагины (подсветку комментариев, ссылки на
   * содержимое), не заводя их в общей либе.
   *
   * Читается ОДИН РАЗ при создании редактора: массив, изменившийся позже, не
   * подхватится.
   */
  extensions?: AnyExtension[]
}>(), {
  modelValue:   '',
  outputFormat: 'html',
  editable:     true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  // Аплоад картинки не удался. Нода при этом НЕ вставляется: пустая картинка в
  // документе хуже, чем сообщение об ошибке.
  imageUploadError: [error: unknown]
  // modelValue не разобрался. Редактор при этом открывается пустым, а не падает.
  parseError: [error: unknown]
}>()

// ── Конвертация ввода (modelValue → контент для Tiptap) ───────────────────────

const EMPTY_DOC = '<p></p>'

/**
 * modelValue → контент для Tiptap.
 *
 * Разбор под try/catch не из осторожности, а по факту: битый или legacy-JSON
 * из базы роняет компонент НА МОНТИРОВАНИИ, то есть страница умирает целиком
 * вместо того чтобы показать пустой редактор и сказать, что не так.
 */
function parseInput(val: string): string | object {
  if (!val) return EMPTY_DOC
  try {
    if (props.outputFormat === 'json')     return JSON.parse(val)
    if (props.outputFormat === 'markdown') return marked.parse(val) as string
  } catch (error) {
    emit('parseError', error)
    return EMPTY_DOC
  }
  return val // html | text
}

// ── Конвертация вывода (Tiptap → modelValue) ──────────────────────────────────

function getOutput(e: Editor): string {
  switch (props.outputFormat) {
    case 'json':     return JSON.stringify(e.getJSON())
    case 'text':     return e.getText()
    case 'markdown': return htmlToMarkdown(e.getHTML())
    default:         return e.getHTML()
  }
}

// ── Защита от emit→watch→setContent цикла ────────────────────────────────────

let lastEmitted = props.modelValue

// ── Вставка картинки ─────────────────────────────────────────────────────────

/** Идёт аплоад — показываем бейдж и не даём открыть поповер второй раз. */
const uploading = ref(false)

/**
 * Единственный путь файла картинки в документ: и поповер вставки, и paste
 * скриншота, и drop файла зовут это.
 *
 * Оптимистичной вставки («сначала нода с локальным URL, потом подменим src»)
 * здесь нет намеренно: запомненная позиция уезжает, пока человек продолжает
 * печатать, и подмена попадает в чужую ноду. Ждём адрес и вставляем один раз.
 */
async function insertImageFile(file: File): Promise<void> {
  if (!props.onImageUpload) {
    // Обратная совместимость: без обработчика картинка инлайнится как раньше.
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      editor.value?.commands.setImage({ src })
    }
    reader.readAsDataURL(file)
    return
  }

  uploading.value = true
  try {
    const src = await props.onImageUpload(file)
    editor.value?.commands.setImage({ src })
  } catch (error) {
    emit('imageUploadError', error)
  } finally {
    uploading.value = false
  }
}

// ── Editor ───────────────────────────────────────────────────────────────────

const wrapRef = ref<HTMLElement | null>(null)

const editor = useEditor({
  content: parseInput(props.modelValue),
  editable: props.editable,
  extensions: [
    StarterKit.configure({
      heading:    { levels: [1, 2, 3] },
      blockquote: false,
      codeBlock:  false,
      link:       false,
      underline:  false,
    }),
    Placeholder.configure({
      // В просмотре подсказок нет: пустая статья не должна предлагать читателю
      // «нажмите / для команд» — команд у него нет.
      placeholder: ({ editor: e, node }) => {
        if (!e.isEditable) return ''
        if (node.type.name === 'codeBlock') return ''
        if (node.type.name === 'heading') {
          const labels: Record<number, string> = {
            1: 'Заголовок 1',
            2: 'Заголовок 2',
            3: 'Заголовок 3',
          }
          return labels[node.attrs.level] ?? ''
        }
        return 'Введите текст или нажмите / для команд'
      },
      includeChildren: true,
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Underline,
    imageExtension,
    Highlight.configure({ multicolor: true }),
    linkExtension,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    blockquoteExtension,
    codeBlockExtension,
    ...tableExtensions,
    slashMenuExtension,
    dragHandleExtension,
    headingAnchorExtension,
    // Пользовательские — последними, чтобы могли перекрыть встроенные.
    ...(props.extensions ?? []),
  ],
  editorProps: {
    attributes: { class: 'doc-editor__content' },
    handlePaste(_view, event) {
      const cd = event.clipboardData
      if (!cd) return false

      // ── 1. Файл изображения из буфера (скриншот, копирование файла) ──────
      const imageItem = Array.from(cd.items).find(
          item => item.kind === 'file' && item.type.startsWith('image/')
      )
      if (imageItem) {
        event.preventDefault()
        const file = imageItem.getAsFile()
        if (file) void insertImageFile(file)
        return true
      }

      // ── 2. URL картинки вставлен как plain-текст ──────────────────────────
      const text = cd.getData('text/plain') ?? ''
      const html = cd.getData('text/html') ?? ''

      if (!html && /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(text.trim())) {
        event.preventDefault()
        editor.value?.commands.setImage({ src: text.trim() })
        return true
      }

      // ── 3. HTML — отдаём Tiptap по умолчанию ─────────────────────────────
      if (html && /<[a-z][\s\S]*>/i.test(html)) return false

      // ── 4. Markdown ───────────────────────────────────────────────────────
      if (text && looksLikeMarkdown(text)) {
        event.preventDefault()
        editor.value?.commands.insertContent(marked.parse(text) as string)
        return true
      }

      return false
    },

    // Перетаскивание файла картинки из системы. Раньше не обрабатывалось
    // вовсе: браузер по умолчанию открывал файл вместо вставки, а README
    // обещал drag & drop — там он про перетаскивание БЛОКОВ (drag handle).
    handleDrop(_view, event) {
      const dropped = (event as DragEvent).dataTransfer?.files
      const file = dropped && dropped.length ? dropped[0] : null
      if (!file || !file.type.startsWith('image/')) return false
      event.preventDefault()
      void insertImageFile(file)
      return true
    },
  },
  onUpdate: ({ editor: e }) => {
    const value = getOutput(e)
    lastEmitted = value
    emit('update:modelValue', value)
  },
})

watch(() => props.modelValue, (val) => {
  if (!editor.value || val === lastEmitted) return
  editor.value.commands.setContent(parseInput(val), { emitUpdate: false })
})

// Переключение режима на живом редакторе. Состав расширений при этом не
// меняется (он зафиксирован при создании) — гейтится ПОВЕДЕНИЕ, а не
// регистрация: расширение, которого не зарегистрировали, потом не появится.
watch(() => props.editable, (value) => {
  const instance = editor.value
  if (!instance) return
  instance.setEditable(value)
  // setEditable до node view не доходит: документ не менялся, реконсиляция
  // ноду не трогает. Блоки кода приходится толкать вручную — иначе
  // CodeMirror внутри остаётся редактируемым в режиме просмотра.
  syncCodeBlocksEditable(instance)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

/**
 * Инстанс редактора наружу — для императива: focus(), insertContent(), скролл
 * к якорю, чтение текущего выделения (на нём держится комментирование
 * фрагмента у потребителя).
 *
 * Оглавление считать НЕ через него: для этого есть collectHeadings(doc) — она
 * работает одинаково в просмотре и в правке, не требует монтирования и не
 * расходится с сохранённым значением.
 */
defineExpose({ editor })
</script>

<template>
  <div ref="wrapRef" class="doc-editor" :class="{ 'doc-editor--readonly': !editable }">
    <!-- Инструменты правки. LinkControls СПЕЦИАЛЬНО не под v-if: он гасит
         навигацию по ссылкам внутри документа и даёт ctrl+click в новой
         вкладке — это нужно и в просмотре. -->
    <template v-if="editable">
      <BubbleMenuBar :editor="editor" />
      <SlashMenu :on-image-upload="onImageUpload" />
      <DragHandleBar :editor="editor" />
    </template>

    <EditorContent :editor="editor" />
    <LinkControls v-model:wrap="wrapRef" :editor="editor" />
    <TableControls v-if="editable" v-model:wrap="wrapRef" :editor="editor" />

    <!-- Аплоад картинки. Бейдж внутри корня, а не тост: своей системы
         уведомлений у либы нет и заводить её ради одной строки незачем. -->
    <div v-if="uploading" class="doc-editor__uploading">Загрузка изображения…</div>
  </div>
</template>

<style scoped>
.doc-editor {
  position: relative;
  background: var(--background);
}

:deep(.doc-editor__content) {
  outline: none;
  min-height: 60vh;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--foreground);
  caret-color: var(--foreground);
  padding-left: 4rem; /* место для [+][⠿] панели */
}

/* В просмотре панели [+][⠿] нет — незачем и место под неё. */
.doc-editor--readonly :deep(.doc-editor__content) {
  padding-left: 0;
  min-height: 0;
}

/* Инструменты внутри нод — от корня, а не изнутри самих нод.
   Причина: node view о переключении editable узнаёт не всегда (setEditable его
   перерисовки не вызывает), а корневой класс ставит Vue, и он всегда свеж.
   Само ДЕЙСТВИЕ при этом закрыто проверкой в обработчике — CSS прячет, но не
   защищает. */
.doc-editor--readonly :deep(.img-nv__toolbar),
.doc-editor--readonly :deep(.img-nv__handle),
.doc-editor--readonly :deep(.ed-code-block__edit-btn) {
  display: none;
}

/* ── Бейдж аплоада ── */
.doc-editor__uploading {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: var(--radius-md, 0.375rem);
  border: 0.0625rem solid var(--border);
  background: var(--popover);
  color: var(--muted-foreground);
  padding: 0.3125rem 0.625rem;
  font-size: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem -0.125rem color-mix(in oklch, var(--foreground) 10%, transparent);
}

/* ── Headings ── */
:deep(.doc-editor__content h1) {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 1.75rem 0 0.25rem;
}
:deep(.doc-editor__content h2) {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  margin: 1.5rem 0 0.2rem;
}
:deep(.doc-editor__content h3) {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 1.25rem 0 0.15rem;
}

:deep(.doc-editor__content p) { margin: 0.125rem 0; }

/* ── Inline code (не блок) ── */
:deep(.doc-editor__content code:not(.cm-content *)) {
  background: var(--muted);
  border: 0.0625rem solid var(--border);
  border-radius: 0.25rem;
  padding: 0.0625rem 0.3125rem;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 0.85em;
  color: var(--destructive);
}

/* ── Placeholder ── */
:deep(.doc-editor__content .is-empty::before) {
  content: attr(data-placeholder);
  color: color-mix(in oklch, var(--muted-foreground) 45%, transparent);
  pointer-events: none;
  float: left;
  height: 0;
}

/* ── Lists ── */
:deep(.doc-editor__content ul:not([data-type="taskList"])) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.25rem 0;
}

:deep(.doc-editor__content ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.25rem 0;
}

:deep(.doc-editor__content ul:not([data-type="taskList"]) ul:not([data-type="taskList"])) { list-style-type: circle; }
:deep(.doc-editor__content ul:not([data-type="taskList"]) ul:not([data-type="taskList"]) ul) { list-style-type: square; }

:deep(.doc-editor__content li) { margin: 0.125rem 0; }
:deep(.doc-editor__content li > p) { margin: 0; }

/* ── Task list ── */
:deep(.doc-editor__content ul[data-type="taskList"]) {
  padding-left: 0.25rem;
  margin: 0.25rem 0;
  list-style: none;
}

:deep(.doc-editor__content ul[data-type="taskList"] > li) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  list-style: none;
}

:deep(.doc-editor__content ul[data-type="taskList"] > li > label) {
  display: flex;
  flex-shrink: 0;
  cursor: pointer;
}

:deep(.doc-editor__content ul[data-type="taskList"] > li > label input[type="checkbox"]) {
  width: 0.875rem;
  height: 0.875rem;
  accent-color: var(--primary);
  cursor: pointer;
}

:deep(.doc-editor__content ul[data-type="taskList"] > li > div) {
  flex: 1;
  min-width: 0;
}

:deep(.doc-editor__content ul[data-type="taskList"] > li > div > p) {
  margin: 0;
  line-height: 1;
}

:deep(.doc-editor__content ul[data-type="taskList"] > li[data-checked="true"] > div) {
  opacity: 0.6;
  text-decoration: line-through;
}

/* Чекбоксы задач в просмотре не переключаются: щелчок по ним правил бы
   документ, а прав на правку у читателя может не быть вовсе. */
.doc-editor--readonly :deep(.doc-editor__content input[type="checkbox"]) {
  pointer-events: none;
}

/* ── Hover-подсветка блока (управляется drag-handle extension) ── */
:deep(.doc-editor__content [data-dh-hovered]) {
  background: color-mix(in oklch, var(--accent) 60%, transparent);
  border-radius: 0.25rem;
  transition: background 0.1s;
}

/* ── ProseMirror drop-cursor: жирная линия вставки при drag ── */
:deep(.ProseMirror-dropcursor) {
  border-top: 2px solid var(--primary) !important;
  margin: 2px 0;
  border-radius: 2px;
  opacity: 0.8;
}
</style>
