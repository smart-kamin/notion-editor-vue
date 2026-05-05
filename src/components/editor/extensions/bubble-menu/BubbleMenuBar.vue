<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Link, ChevronDown, ChevronLeft,
  Type, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Check,
  Highlighter, AlignLeft, AlignCenter, AlignRight,
} from 'lucide-vue-next'

const props = defineProps<{ editor: Editor | undefined }>()

// ── Позиционирование ──────────────────────────────────────────────────────────

const barRef  = ref<HTMLElement | null>(null)
const visible = ref(false)
const posX    = ref(0)
const posY    = ref(0)

// Пока мышь зажата — не показываем меню, ждём mouseup
let isMouseDown = false

function update() {
  const ed = props.editor
  if (!ed) { visible.value = false; return }

  if (barRef.value?.contains(document.activeElement)) return

  const { from, to } = ed.state.selection
  if (from === to || ed.isActive('image') || ed.isActive('codeBlock')) {
    visible.value = false
    return
  }

  // Выделение активно, но мышь ещё зажата — ждём mouseup
  if (isMouseDown) return

  visible.value = true

  nextTick(() => {
    const bar = barRef.value
    if (!bar) return
    try {
      const startCoords = ed.view.coordsAtPos(from)
      const endCoords   = ed.view.coordsAtPos(to)
      const GAP  = 8
      const rawX = (startCoords.left + endCoords.right) / 2
      posX.value = Math.max(bar.offsetWidth / 2 + GAP, Math.min(rawX, window.innerWidth - bar.offsetWidth / 2 - GAP))
      posY.value = Math.max(GAP, Math.min(startCoords.top, endCoords.top) - bar.offsetHeight - GAP)
    } catch { visible.value = false }
  })
}

watch(() => props.editor, (ed, prevEd) => {
  if (prevEd) prevEd.off('selectionUpdate', update)
  if (ed)     ed.on('selectionUpdate', update)
}, { immediate: true })

function onDocMousedown(e: MouseEvent) {
  isMouseDown = true
  if (barRef.value?.contains(e.target as Node)) return
  if (props.editor?.view.dom.contains(e.target as Node)) return
  visible.value = false
  resetMode()
}

function onDocMouseup() {
  isMouseDown = false
  update()  // показываем меню если есть выделение
}

onMounted(() => {
  document.addEventListener('mousedown', onDocMousedown)
  document.addEventListener('mouseup',   onDocMouseup)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocMousedown)
  document.removeEventListener('mouseup',   onDocMouseup)
  props.editor?.off('selectionUpdate', update)
})

// ── Режимы ────────────────────────────────────────────────────────────────────

type Mode = 'toolbar' | 'link' | 'turninto' | 'highlight'
const mode = ref<Mode>('toolbar')

function resetMode() {
  mode.value = 'toolbar'
  linkVal.value = ''
}

// ── Link ──────────────────────────────────────────────────────────────────────

const linkVal      = ref('')
const linkInputRef = ref<HTMLInputElement | null>(null)

function openLinkMode() {
  linkVal.value = props.editor?.getAttributes('link').href ?? ''
  mode.value = 'link'
  nextTick(() => { linkInputRef.value?.focus(); linkInputRef.value?.select() })
}

function applyLink() {
  const href = linkVal.value.trim()
  if (href) {
    props.editor?.chain().focus().extendMarkRange('link').setLink({ href }).run()
  } else {
    props.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
  }
  resetMode()
}

function onLinkKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter')  applyLink()
  if (e.key === 'Escape') { resetMode(); props.editor?.commands.focus() }
}

// ── Highlight ─────────────────────────────────────────────────────────────────

const HIGHLIGHT_COLORS = [
  { label: 'Жёлтый',    value: '#fef08a' },
  { label: 'Зелёный',   value: '#bbf7d0' },
  { label: 'Голубой',   value: '#bae6fd' },
  { label: 'Розовый',   value: '#fbcfe8' },
  { label: 'Оранжевый', value: '#fed7aa' },
  { label: 'Фиолетовый',value: '#e9d5ff' },
  { label: 'Красный',   value: '#fecaca' },
  { label: 'Серый',     value: '#e5e7eb' },
]

const activeHighlightColor = computed(() => {
  const ed = props.editor
  if (!ed || !ed.isActive('highlight')) return null
  return ed.getAttributes('highlight').color ?? null
})

function applyHighlight(color: string) {
  const ed = props.editor
  if (!ed) return
  if (activeHighlightColor.value === color) {
    ed.chain().focus().unsetHighlight().run()
  } else {
    ed.chain().focus().setHighlight({ color }).run()
  }
  resetMode()
}

function clearHighlight() {
  props.editor?.chain().focus().unsetHighlight().run()
  resetMode()
}

// ── Выравнивание ──────────────────────────────────────────────────────────────

const alignments = [
  { value: 'left',   icon: AlignLeft,   title: 'По левому краю' },
  { value: 'center', icon: AlignCenter, title: 'По центру' },
  { value: 'right',  icon: AlignRight,  title: 'По правому краю' },
] as const

const currentAlign = computed(() => {
  const ed = props.editor
  if (!ed) return 'left'
  if (ed.isActive({ textAlign: 'center' })) return 'center'
  if (ed.isActive({ textAlign: 'right' }))  return 'right'
  return 'left'
})

const currentAlignIcon = computed(() =>
  alignments.find(a => a.value === currentAlign.value)?.icon ?? AlignLeft
)

// ── Turn into ─────────────────────────────────────────────────────────────────

const savedFrom = ref(0)
const savedTo   = ref(0)

function openTurnInto() {
  const ed = props.editor
  if (!ed) return
  savedFrom.value = ed.state.selection.from
  savedTo.value   = ed.state.selection.to
  mode.value = 'turninto'
}

interface TurnOption {
  label:    string
  icon:     unknown
  action:   () => void
  isActive: () => boolean
}

const turnOptions = computed<TurnOption[]>(() => {
  const ed = props.editor
  if (!ed) return []

  const restore = () => ed.chain().focus().setTextSelection({ from: savedFrom.value, to: savedTo.value })

  return [
    { label: 'Текст',       icon: Type,        action: () => restore().setParagraph().run(),            isActive: () => ed.isActive('paragraph') },
    { label: 'Заголовок 1', icon: Heading1,    action: () => restore().setHeading({ level: 1 }).run(), isActive: () => ed.isActive('heading', { level: 1 }) },
    { label: 'Заголовок 2', icon: Heading2,    action: () => restore().setHeading({ level: 2 }).run(), isActive: () => ed.isActive('heading', { level: 2 }) },
    { label: 'Заголовок 3', icon: Heading3,    action: () => restore().setHeading({ level: 3 }).run(), isActive: () => ed.isActive('heading', { level: 3 }) },
    { label: 'Список',      icon: List,        action: () => wrapInList('bulletList'),                  isActive: () => ed.isActive('bulletList') },
    { label: 'Нумерация',   icon: ListOrdered, action: () => wrapInList('orderedList'),                 isActive: () => ed.isActive('orderedList') },
    { label: 'Цитата',      icon: Quote,       action: () => restore().toggleBlockquote().run(),        isActive: () => ed.isActive('blockquote') },
  ]
})

const currentBlockLabel = computed(() => {
  const ed = props.editor
  if (!ed) return 'Текст'
  if (ed.isActive('heading', { level: 1 })) return 'Заголовок 1'
  if (ed.isActive('heading', { level: 2 })) return 'Заголовок 2'
  if (ed.isActive('heading', { level: 3 })) return 'Заголовок 3'
  if (ed.isActive('bulletList'))  return 'Список'
  if (ed.isActive('orderedList')) return 'Нумерация'
  if (ed.isActive('blockquote'))  return 'Цитата'
  return 'Текст'
})

function runTurnOption(opt: TurnOption) {
  opt.action()
  resetMode()
}

function wrapInList(listType: 'bulletList' | 'orderedList') {
  const ed = props.editor
  if (!ed) return

  const { from, to } = ed.state.selection
  const lines = ed.state.doc.textBetween(from, to, '\n').split('\n')

  ed.chain()
    .focus()
    .deleteSelection()
    .insertContent({
      type: listType,
      content: lines.map(line => ({
        type: 'listItem',
        content: [{ type: 'paragraph', content: line ? [{ type: 'text', text: line }] : [] }],
      })),
    })
    .run()
}

function toggleCodeSmart() {
  const ed = props.editor
  if (!ed) return
  const { from, to } = ed.state.selection
  const text = ed.state.doc.textBetween(from, to, '\n')
  if (text.includes('\n')) {
    ed.chain()
      .focus()
      .deleteSelection()
      .insertContent({
        type: 'codeBlock',
        content: text ? [{ type: 'text', text }] : [],
      })
      .run()
  } else {
    ed.chain().focus().toggleCode().run()
  }
}

const isCodeActive = computed(() => {
  const ed = props.editor
  if (!ed) return false
  return ed.isActive('code') || ed.isActive('codeBlock')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="bm">
      <div
        v-if="visible && editor"
        ref="barRef"
        class="bm"
        :style="{ left: posX + 'px', top: posY + 'px' }"
        @mousedown.prevent
      >
        <!-- ── Основной тулбар ── -->
        <template v-if="mode === 'toolbar'">
          <button class="bm__turn-btn" @click="openTurnInto()">
            <span>{{ currentBlockLabel }}</span>
            <ChevronDown :size="11" />
          </button>
          <div class="bm__sep" />

          <!-- Форматирование -->
          <button class="bm__btn" :class="{ 'bm__btn--active': editor.isActive('bold') }"
                  title="Жирный (Ctrl+B)" @click="editor.chain().focus().toggleBold().run()"><Bold :size="13" /></button>
          <button class="bm__btn" :class="{ 'bm__btn--active': editor.isActive('italic') }"
                  title="Курсив (Ctrl+I)" @click="editor.chain().focus().toggleItalic().run()"><Italic :size="13" /></button>
          <button class="bm__btn" :class="{ 'bm__btn--active': editor.isActive('underline') }"
                  title="Подчёркнутый (Ctrl+U)" @click="editor.chain().focus().toggleUnderline().run()"><Underline :size="13" /></button>
          <button class="bm__btn" :class="{ 'bm__btn--active': editor.isActive('strike') }"
                  title="Зачёркнутый" @click="editor.chain().focus().toggleStrike().run()"><Strikethrough :size="13" /></button>
          <button class="bm__btn" :class="{ 'bm__btn--active': isCodeActive }"
                  title="Код" @click="toggleCodeSmart()"><Code :size="13" /></button>

          <!-- Highlight -->
          <button
            class="bm__btn bm__btn--highlight"
            :class="{ 'bm__btn--active': editor.isActive('highlight') }"
            title="Выделить цветом"
            @click="mode = 'highlight'"
          >
            <Highlighter :size="13" />
            <span
              class="bm__hl-dot"
              :style="activeHighlightColor ? { background: activeHighlightColor } : {}"
            />
          </button>

          <div class="bm__sep" />

          <!-- Выравнивание — показывает иконку текущего, по клику циклически меняет -->
          <button
            class="bm__btn"
            :title="`Выравнивание: ${currentAlign}`"
            @click="editor.chain().focus().setTextAlign(currentAlign === 'left' ? 'center' : currentAlign === 'center' ? 'right' : 'left').run()"
          >
            <component :is="currentAlignIcon" :size="13" />
          </button>

          <div class="bm__sep" />

          <button class="bm__btn" :class="{ 'bm__btn--active': editor.isActive('link') }"
                  title="Ссылка" @click="openLinkMode"><Link :size="13" /></button>
        </template>

        <!-- ── Ввод ссылки ── -->
        <template v-else-if="mode === 'link'">
          <button class="bm__btn" @click="resetMode(); editor.commands.focus()">
            <ChevronLeft :size="13" />
          </button>
          <div class="bm__sep" />
          <input
            ref="linkInputRef"
            v-model="linkVal"
            class="bm__link-input"
            type="url"
            placeholder="https://example.com"
            autocomplete="off"
            spellcheck="false"
            @mousedown.stop
            @keydown="onLinkKeydown"
          />
          <button class="bm__btn bm__btn--confirm" @click="applyLink">
            <Check :size="13" />
          </button>
        </template>

        <!-- ── Turn into ── -->
        <template v-else-if="mode === 'turninto'">
          <button class="bm__btn" @click="resetMode">
            <ChevronLeft :size="13" />
          </button>
          <div class="bm__sep" />
          <button
            v-for="opt in turnOptions" :key="opt.label"
            class="bm__btn" :class="{ 'bm__btn--active': opt.isActive() }"
            :title="opt.label" @click="runTurnOption(opt)">
            <component :is="opt.icon" :size="13" />
          </button>
        </template>

        <!-- ── Highlight палитра ── -->
        <template v-else-if="mode === 'highlight'">
          <button class="bm__btn" @click="resetMode">
            <ChevronLeft :size="13" />
          </button>
          <div class="bm__sep" />
          <button
            v-for="c in HIGHLIGHT_COLORS" :key="c.value"
            class="bm__hl-swatch"
            :class="{ 'bm__hl-swatch--active': activeHighlightColor === c.value }"
            :title="c.label"
            :style="{ background: c.value }"
            @click="applyHighlight(c.value)"
          />
          <div class="bm__sep" />
          <!-- Сброс выделения -->
          <button class="bm__btn bm__btn--hl-clear" title="Убрать выделение" @click="clearHighlight">
            <span class="bm__hl-clear-icon">✕</span>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bm {
  position: fixed;
  z-index: 50;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.25rem;
  border-radius: var(--radius-md, 0.375rem);
  border: 0.0625rem solid var(--border);
  background: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    0 0.25rem 0.5rem -0.0625rem color-mix(in oklch, var(--foreground) 10%, transparent),
    0 0.125rem 0.25rem -0.125rem color-mix(in oklch, var(--foreground) 6%, transparent);
  user-select: none;
}

.bm__btn {
  display: flex; align-items: center; justify-content: center;
  width: 1.75rem; height: 1.75rem;
  border: none; border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: transparent; color: var(--muted-foreground);
  cursor: pointer; flex-shrink: 0; transition: background-color 0.1s, color 0.1s;
}
.bm__btn:hover        { background: var(--accent); color: var(--accent-foreground); }
.bm__btn--active      { background: var(--accent); color: var(--accent-foreground); }
.bm__btn--confirm     { color: var(--primary); }
.bm__btn--confirm:hover { background: color-mix(in oklch, var(--primary) 12%, transparent); color: var(--primary); }

/* Highlight кнопка — иконка + цветная точка */
.bm__btn--highlight {
  position: relative;
  gap: 0;
}

.bm__hl-dot {
  position: absolute;
  bottom: 0.2rem;
  right: 0.2rem;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: var(--muted-foreground);
  border: 0.0625rem solid color-mix(in oklch, var(--foreground) 20%, transparent);
}

/* Свотчи палитры */
.bm__hl-swatch {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  border: 0.125rem solid transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.1s, border-color 0.1s;
}
.bm__hl-swatch:hover {
  transform: scale(1.15);
  border-color: color-mix(in oklch, var(--foreground) 30%, transparent);
}
.bm__hl-swatch--active {
  border-color: var(--foreground);
  transform: scale(1.1);
}

/* Кнопка сброса выделения */
.bm__hl-clear-icon {
  font-size: 0.625rem;
  line-height: 1;
  font-style: normal;
}

.bm__turn-btn {
  display: flex; align-items: center; gap: 0.25rem;
  height: 1.75rem; padding: 0 0.375rem 0 0.5rem;
  border: none; border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: transparent; color: var(--popover-foreground);
  font-size: 0.8125rem; font-weight: 500; cursor: pointer;
  white-space: nowrap; flex-shrink: 0; transition: background-color 0.1s;
}
.bm__turn-btn:hover { background: var(--accent); }
.bm__turn-btn svg   { color: var(--muted-foreground); flex-shrink: 0; }

.bm__sep {
  width: 0.0625rem; height: 1.125rem;
  background: var(--border); margin: 0 0.125rem; flex-shrink: 0;
}

.bm__link-input {
  height: 1.75rem; width: 14rem; border: none; background: transparent;
  padding: 0 0.25rem; font-size: 0.8125rem; color: var(--popover-foreground); outline: none;
  user-select: text;
}
.bm__link-input::placeholder { color: var(--muted-foreground); }

.bm-enter-active, .bm-leave-active { transition: opacity 0.1s, transform 0.1s; }
.bm-enter-from, .bm-leave-to { opacity: 0; transform: translateX(-50%) translateY(0.25rem); }
</style>
