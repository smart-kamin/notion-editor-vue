import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { reactive } from 'vue'
import {
  Type, Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare,
  Quote, Code2, Table, Minus, Image,
} from 'lucide-vue-next'
import type { Range } from '@tiptap/core'
import type { Editor } from '@tiptap/core'

// ── Типы ─────────────────────────────────────────────────────────────────────

export interface SlashItem {
  title:             string
  description:       string
  icon:              unknown
  category:          string
  showImagePopover?: boolean
  _src?:             string
  command:           (params: { editor: Editor; range: Range; item: SlashItem }) => void
}

// ── Все доступные команды ─────────────────────────────────────────────────────

export const SLASH_ITEMS: SlashItem[] = [
  // Основные
  {
    title: 'Текст', description: 'Обычный параграф', icon: Type, category: 'Основные',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: 'Заголовок 1', description: 'Большой заголовок', icon: Heading1, category: 'Основные',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run(),
  },
  {
    title: 'Заголовок 2', description: 'Средний заголовок', icon: Heading2, category: 'Основные',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: 'Заголовок 3', description: 'Небольшой заголовок', icon: Heading3, category: 'Основные',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },

  // Списки
  {
    title: 'Маркированный список', description: 'Список с точками', icon: List, category: 'Списки',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Нумерованный список', description: 'Список с номерами', icon: ListOrdered, category: 'Списки',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'Список задач', description: 'Список с чекбоксами', icon: CheckSquare, category: 'Списки',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({
      type: 'taskList',
      content: [{ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph' }] }],
    }).run(),
  },

  // Блоки
  {
    title: 'Цитата', description: 'Выделенная цитата', icon: Quote, category: 'Блоки',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: 'Блок кода', description: 'Код с подсветкой синтаксиса', icon: Code2, category: 'Блоки',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setCodeBlock().run(),
  },
  {
    title: 'Таблица', description: 'Вставить таблицу 3×3', icon: Table, category: 'Блоки',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: 'Разделитель', description: 'Горизонтальная линия', icon: Minus, category: 'Блоки',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },

  // Медиа
  {
    title: 'Изображение', description: 'По ссылке или с компьютера', icon: Image, category: 'Медиа',
    showImagePopover: true,
    command: ({ editor, range, item }) => {
      const src = item._src
      if (src) editor.chain().focus().deleteRange(range).setImage({ src }).run()
      else     editor.chain().focus().deleteRange(range).run()
    },
  },
]

// ── Реактивный стейт (связь с Vue-компонентом) ────────────────────────────────

interface SlashState {
  visible:          boolean
  x:                number
  y:                number
  items:            SlashItem[]
  selectedIndex:    number
  runCommand:       ((item: SlashItem) => void) | null
  pendingEditor:    Editor | null
  pendingRange:     Range | null
  openImagePopover: boolean
}

export const slashState: SlashState = reactive({
  visible:             false,
  x:                   0,
  y:                   0,
  items:               [],
  selectedIndex:       0,
  runCommand:          null,
  pendingEditor:       null,
  pendingRange:        null,
  openImagePopover:    false,
})

// ── Расширение ────────────────────────────────────────────────────────────────

export const slashMenuExtension = Extension.create({
  name: 'slashMenu',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor:      this.editor,
        char:        '/',
        allowSpaces: false,

        items: ({ query }) => {
          const q = query.toLowerCase().trim()
          if (!q) return SLASH_ITEMS
          return SLASH_ITEMS.filter(item =>
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.category.toLowerCase().includes(q),
          )
        },

        command: ({ editor, range, props }) => {
          props.command({ editor, range, item: props })
        },

        render: () => ({
          onStart(props) {
            slashState.items          = props.items as SlashItem[]
            slashState.selectedIndex  = 0
            slashState.runCommand     = (item: SlashItem) => props.command(item)
            slashState.pendingEditor  = props.editor
            slashState.pendingRange   = props.range

            const rect = props.clientRect?.()
            if (rect) {
              slashState.x = rect.left
              slashState.y = rect.bottom + 6
            }
            slashState.visible = true
          },

          onUpdate(props) {
            slashState.items          = props.items as SlashItem[]
            slashState.selectedIndex  = 0
            slashState.runCommand     = (item: SlashItem) => props.command(item)
            slashState.pendingEditor  = props.editor
            slashState.pendingRange   = props.range

            const rect = props.clientRect?.()
            if (rect) {
              slashState.x = rect.left
              slashState.y = rect.bottom + 6
            }
          },

          onKeyDown({ event }) {
            const len = slashState.items.length
            if (!len) return false

            if (event.key === 'ArrowUp') {
              slashState.selectedIndex = (slashState.selectedIndex - 1 + len) % len
              return true
            }
            if (event.key === 'ArrowDown') {
              slashState.selectedIndex = (slashState.selectedIndex + 1) % len
              return true
            }
            if (event.key === 'Enter') {
              const item = slashState.items[slashState.selectedIndex]
              if (!item) return true
              if (item.showImagePopover) {
                // Скрываем меню и сигнализируем Vue-компоненту открыть поповер
                slashState.visible          = false
                slashState.openImagePopover = true
              } else {
                slashState.runCommand?.(item)
              }
              return true
            }
            return false
          },

          onExit() {
            slashState.visible = false
          },
        }),
      }),
    ]
  },
})