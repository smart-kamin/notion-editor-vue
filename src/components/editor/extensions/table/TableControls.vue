<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import {
  Trash2, Plus,
  ArrowRightFromLine, ArrowLeftFromLine,
  ArrowDownFromLine, ArrowUpFromLine,
  AlignJustify, Maximize2,
} from 'lucide-vue-next'

const props = defineProps<{
  editor: Editor | undefined
}>()

const wrapRef = defineModel<HTMLElement | null>('wrap', { default: null })

// ── Контекстное меню ──────────────────────────────────────────────────────────

interface CtxMenu {
  top:        number
  left:       number
  anchorCell: HTMLElement
}

const ctxMenu    = ref<CtxMenu | null>(null)
const isFirstRow = ref(false)

function openCtxMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  const cell   = target.closest<HTMLElement>('td, th')
  if (!cell) return
  e.preventDefault()

  const wrap = wrapRef.value
  if (!wrap) return

  const wrapRect = wrap.getBoundingClientRect()
  const table    = cell.closest<HTMLElement>('table')
  isFirstRow.value = !!table && cell.closest('tr') === table.querySelector('tr')

  ctxMenu.value = {
    top:        e.clientY - wrapRect.top + 4,
    left:       e.clientX - wrapRect.left + 4,
    anchorCell: cell,
  }
}

function closeCtxMenu() { ctxMenu.value = null }

type TableCmd =
  | 'addColumnAfter' | 'addColumnBefore'
  | 'addRowAfter'    | 'addRowBefore'
  | 'deleteRow'      | 'deleteColumn'

function runCmd(cmd: TableCmd) {
  const ctx = ctxMenu.value
  const ed  = props.editor
  if (!ctx || !ed) return
  closeCtxMenu()
  try {
    const pos = ed.view.posAtDOM(ctx.anchorCell, 0) + 1
    ed.chain().focus().setTextSelection(pos).run()
    setTimeout(() => { ed.commands[cmd]() }, 20)
  } catch (err) {
    console.error('[TableControls] cmd error:', err)
  }
}

/** Делит суммарную ширину таблицы поровну между всеми столбцами */
function resetColWidths() {
  const ctx = ctxMenu.value
  const ed  = props.editor
  if (!ctx || !ed) return
  closeCtxMenu()

  const table = ctx.anchorCell.closest<HTMLTableElement>('table')
  if (!table) return

  const cells   = Array.from(table.querySelectorAll<HTMLElement>('tr:first-child th, tr:first-child td'))
  const n       = cells.length
  if (!n) return

  // Суммарная ширина = сумма текущих col-ширин или offsetWidth таблицы
  const cols      = Array.from(table.querySelectorAll<HTMLElement>('colgroup col'))
  const totalFromCols = cols.reduce((s, c) => s + (parseFloat(c.style.width) || 0), 0)
  const total     = totalFromCols > 0 ? totalFromCols : table.offsetWidth
  const colWidth  = Math.max(64, Math.floor(total / n))

  const view = ed.view
  let tr     = view.state.tr
  let changed = false
  table.querySelectorAll<HTMLElement>('tr').forEach(row => {
    Array.from(row.querySelectorAll<HTMLElement>('td, th')).forEach((cell, ci) => {
      if (ci >= n) return
      try {
        const pos  = view.posAtDOM(cell, 0) - 1
        const node = tr.doc.nodeAt(pos)
        if (!node) return
        tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, colwidth: [colWidth] })
        changed = true
      } catch {}
    })
  })
  if (changed) view.dispatch(tr)
}

/** По ширине: масштабирует столбцы под доступную ширину контейнера,
 *  сохраняя пропорции содержимого (natural min-content widths) */
function fitToWidth() {
  const ctx = ctxMenu.value
  const ed  = props.editor
  if (!ctx || !ed) return
  closeCtxMenu()

  const table   = ctx.anchorCell.closest<HTMLTableElement>('table')
  const wrapper = table?.closest<HTMLElement>('.tableWrapper') ?? table?.parentElement
  if (!table || !wrapper) return

  const available = wrapper.clientWidth
  if (!available) return

  // Временно переключаем в auto-layout — браузер покажет естественные ширины столбцов
  const prevLayout = table.style.tableLayout
  const prevWidth  = table.style.width
  table.style.tableLayout = 'auto'
  table.style.width       = 'auto'

  const headers = Array.from(table.querySelectorAll<HTMLElement>('tr:first-child th, tr:first-child td'))
  const natural = headers.map(h => h.offsetWidth)
  const total   = natural.reduce((s, w) => s + w, 0)

  table.style.tableLayout = prevLayout
  table.style.width       = prevWidth

  // Масштабируем пропорционально: если влезают — растянуть, если нет — сжать до минимума
  const scale  = available / Math.max(total, 1)
  const widths = natural.map(w => Math.max(64, Math.round(w * scale)))

  // Корректируем последний столбец чтобы сумма точно = available
  const sum = widths.reduce((s, w) => s + w, 0)
  const last = widths.length - 1
  if (last >= 0) widths[last] = Math.max(64, (widths[last] ?? 0) + (available - sum))

  const view = ed.view
  let tr     = view.state.tr
  let changed = false
  table.querySelectorAll<HTMLElement>('tr').forEach(row => {
    Array.from(row.querySelectorAll<HTMLElement>('td, th')).forEach((cell, ci) => {
      if (ci >= widths.length) return
      try {
        const pos  = view.posAtDOM(cell, 0) - 1
        const node = tr.doc.nodeAt(pos)
        if (!node) return
        tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, colwidth: [widths[ci]] })
        changed = true
      } catch {}
    })
  })
  if (changed) view.dispatch(tr)
}

interface FloatPos { top: number; left: number; table: HTMLTableElement }
interface HandlePos { top: number; left: number; height: number }

const addRowBtn    = ref<FloatPos | null>(null)
const addColBtn    = ref<FloatPos | null>(null)
const resizeHandle = ref<HandlePos | null>(null)

let hideTimer: ReturnType<typeof setTimeout> | null = null
let rafId:     number | null                        = null

function scheduleHide() {
  if (hideTimer) return
  hideTimer = setTimeout(() => {
    addRowBtn.value    = null
    addColBtn.value    = null
    resizeHandle.value = null
    hideTimer          = null
  }, 400)
}

function cancelHide() {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

function clearAll() {
  addRowBtn.value    = null
  addColBtn.value    = null
  resizeHandle.value = null
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

function onMousemove(e: MouseEvent) {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => { rafId = null; processMousemove(e) })
}

/**
 * Если у таблицы нет colwidth в PM state (новая таблица) —
 * прописываем равные ширины одной транзакцией.
 * Вызывается лениво при первом наведении мыши.
 */
function initColWidthsIfNeeded(table: HTMLTableElement) {
  const ed = props.editor
  if (!ed) return

  // Проверяем через DOM: если у <col> нет style.width — ширин нет
  const firstCol = table.querySelector<HTMLElement>('colgroup col')
  if (firstCol && firstCol.style.width) return // уже инициализировано

  const wrapper   = table.closest<HTMLElement>('.tableWrapper') ?? table.parentElement
  const available = wrapper?.clientWidth ?? table.offsetWidth
  const headers   = table.querySelectorAll<HTMLElement>('tr:first-child th, tr:first-child td')
  const n         = headers.length
  if (!n) return

  const colWidth = Math.max(64, Math.floor(available / n))
  const view     = ed.view
  let tr         = view.state.tr
  let changed    = false

  table.querySelectorAll<HTMLElement>('tr').forEach(row => {
    Array.from(row.querySelectorAll<HTMLElement>('td, th')).forEach((cell, ci) => {
      if (ci >= n) return
      try {
        const pos  = view.posAtDOM(cell, 0) - 1
        const node = tr.doc.nodeAt(pos)
        if (!node || node.attrs['colwidth']?.[0]) return
        tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, colwidth: [colWidth] })
        changed = true
      } catch {}
    })
  })

  if (changed) view.dispatch(tr)
}

function processMousemove(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.tbl-add-btn')) { cancelHide(); return }

  const table = (e.target as HTMLElement).closest<HTMLTableElement>('table')
  if (!table) { scheduleHide(); return }

  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }

  // Инициализация равных ширин при первом наведении на новую таблицу
  initColWidthsIfNeeded(table)

  const tableRect   = table.getBoundingClientRect()
  const wrapper     = table.closest<HTMLElement>('.tableWrapper') ?? table
  const wrapperRect = wrapper.getBoundingClientRect()

  addRowBtn.value = {
    top:   tableRect.bottom,
    left:  wrapperRect.left + wrapperRect.width / 2,
    table,
  }
  addColBtn.value = {
    top:   tableRect.top + tableRect.height / 2,
    left:  tableRect.right,
    table,
  }

  // Ручка ресайза — все вертикальные границы между th
  // Полная высота таблицы, позиция fixed, Tiptap сам обрабатывает drag
  let foundHandle = false
  const headers   = Array.from(table.querySelectorAll<HTMLElement>('tr:first-child th'))
  for (let i = 0; i < headers.length; i++) {
    const th        = headers[i]
    if (!th) continue
    const thRect    = th.getBoundingClientRect()
    const fromRight = thRect.right - e.clientX
    if (fromRight >= -8 && fromRight <= 8) {
      resizeHandle.value = {
        left:   thRect.right,
        top:    tableRect.top + tableRect.height / 2,
        height: 24,
      }
      foundHandle = true
      break
    }
  }
  if (!foundHandle) resizeHandle.value = null
}

// ── Добавить строку / столбец ─────────────────────────────────────────────────

function runAddRow() {
  const ed    = props.editor
  const table = addRowBtn.value?.table
  clearAll()
  if (!ed || !table) return
  const lastCell = table.querySelector('tr:last-child td, tr:last-child th')
  if (!lastCell) return
  try {
    const pos = ed.view.posAtDOM(lastCell, 0) + 1
    ed.chain().focus().setTextSelection(pos).run()
    setTimeout(() => { ed.commands.addRowAfter() }, 20)
  } catch {}
}

function runAddCol() {
  const ed    = props.editor
  const table = addColBtn.value?.table
  clearAll()
  if (!ed || !table) return
  const lastCell = table.querySelector('tr:first-child th:last-child, tr:first-child td:last-child')
  if (!lastCell) return
  try {
    const pos = ed.view.posAtDOM(lastCell, 0) + 1
    ed.chain().focus().setTextSelection(pos).run()
    setTimeout(() => { ed.commands.addColumnAfter() }, 20)
  } catch {}
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

let cleanup: (() => void) | null = null

watch(wrapRef, (el, prevEl) => {
  if (prevEl) {
    prevEl.removeEventListener('contextmenu', openCtxMenu)
    prevEl.removeEventListener('mousemove',   onMousemove)
    prevEl.removeEventListener('mouseleave',  scheduleHide)
  }
  if (el) {
    el.addEventListener('contextmenu', openCtxMenu)
    el.addEventListener('mousemove',   onMousemove)
    el.addEventListener('mouseleave',  scheduleHide)
    cleanup = () => {
      el.removeEventListener('contextmenu', openCtxMenu)
      el.removeEventListener('mousemove',   onMousemove)
      el.removeEventListener('mouseleave',  scheduleHide)
    }
  }
}, { immediate: true })

onBeforeUnmount(() => {
  cleanup?.()
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="ctxMenu" class="tbl-ctx-overlay" @mousedown.self="closeCtxMenu" />
  </Teleport>

  <!-- Контекстное меню -->
  <Transition name="tbl-ctx">
    <div
      v-if="ctxMenu"
      class="tbl-ctx-menu"
      :style="{ top: ctxMenu.top + 'px', left: ctxMenu.left + 'px' }"
    >
      <div class="tbl-ctx-group">
        <p class="tbl-ctx-label">Добавить</p>
        <button class="tbl-ctx-item" v-if="!isFirstRow" @mousedown.prevent="runCmd('addRowBefore')">
          <ArrowUpFromLine :size="13" /><span>Строку выше</span>
        </button>
        <button class="tbl-ctx-item" @mousedown.prevent="runCmd('addRowAfter')">
          <ArrowDownFromLine :size="13" /><span>Строку ниже</span>
        </button>
        <button class="tbl-ctx-item" @mousedown.prevent="runCmd('addColumnBefore')">
          <ArrowLeftFromLine :size="13" /><span>Столбец слева</span>
        </button>
        <button class="tbl-ctx-item" @mousedown.prevent="runCmd('addColumnAfter')">
          <ArrowRightFromLine :size="13" /><span>Столбец справа</span>
        </button>
      </div>
      <div class="tbl-ctx-separator" />
      <div class="tbl-ctx-group">
        <button class="tbl-ctx-item" @mousedown.prevent="resetColWidths">
          <AlignJustify :size="13" /><span>Равная ширина столбцов</span>
        </button>
        <button class="tbl-ctx-item" @mousedown.prevent="fitToWidth">
          <Maximize2 :size="13" /><span>По ширине страницы</span>
        </button>
      </div>
      <div class="tbl-ctx-separator" />
      <div class="tbl-ctx-group">
        <p class="tbl-ctx-label">Удалить</p>
        <button class="tbl-ctx-item tbl-ctx-item--danger" @mousedown.prevent="runCmd('deleteRow')">
          <Trash2 :size="13" /><span>Строку</span>
        </button>
        <button class="tbl-ctx-item tbl-ctx-item--danger" @mousedown.prevent="runCmd('deleteColumn')">
          <Trash2 :size="13" /><span>Столбец</span>
        </button>
      </div>
    </div>
  </Transition>

  <!-- + кнопки -->
  <Teleport to="body">
    <Transition name="tbl-resize">
      <div
        v-if="resizeHandle"
        class="tbl-resize-handle"
        :style="{
          left:   resizeHandle.left   + 'px',
          top:    resizeHandle.top    + 'px',
          height: resizeHandle.height + 'px',
        }"
      />
    </Transition>

    <Transition name="tbl-add">
      <button
        v-if="addRowBtn"
        class="tbl-add-btn tbl-add-btn--row"
        :style="{ top: addRowBtn.top + 'px', left: addRowBtn.left + 'px' }"
        @mouseenter="cancelHide"
        @mouseleave="scheduleHide"
        @mousedown.prevent="runAddRow"
        title="Добавить строку"
      ><Plus :size="12" /></button>
    </Transition>

    <Transition name="tbl-add">
      <button
        v-if="addColBtn"
        class="tbl-add-btn tbl-add-btn--col"
        :style="{ top: addColBtn.top + 'px', left: addColBtn.left + 'px' }"
        @mouseenter="cancelHide"
        @mouseleave="scheduleHide"
        @mousedown.prevent="runAddCol"
        title="Добавить столбец"
      ><Plus :size="12" /></button>
    </Transition>
  </Teleport>
</template>

<style>
/* ── Таблица ── */
.doc-editor__content .tableWrapper {
  overflow-x: auto;
  max-width: 100%;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
.doc-editor__content .tableWrapper::-webkit-scrollbar { height: 0.375rem; }
.doc-editor__content .tableWrapper::-webkit-scrollbar-track { background: transparent; }
.doc-editor__content .tableWrapper::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}
.doc-editor__content .tableWrapper::-webkit-scrollbar-thumb:hover { background: var(--muted-foreground); }

.doc-editor__content table {
  caption-side: bottom;
  font-size: 0.875rem;
  border-collapse: collapse;
  margin: 1rem 0;
  border: 0.0625rem solid var(--border);
}
.doc-editor__content table tr {
  border-bottom: 0.0625rem solid var(--border);
  transition: background-color 0.15s;
}
.doc-editor__content table tbody tr:last-child { border-bottom: none; }
.doc-editor__content table tbody tr:hover {
  background-color: color-mix(in oklch, var(--muted) 40%, transparent);
}
.doc-editor__content table th {
  height: 2.25rem;
  padding: 0 0.625rem;
  text-align: left;
  vertical-align: middle;
  font-weight: 500;
  color: var(--muted-foreground);
  min-width: 4rem;
  background: color-mix(in oklch, var(--muted) 40%, transparent);
  border-right: 0.0625rem solid var(--border);
  position: relative;
  user-select: none;
}
.doc-editor__content table th:last-child { border-right: none; }
.doc-editor__content table td {
  padding: 0.5rem 0.625rem;
  vertical-align: middle;
  min-width: 4rem;
  border-right: 0.0625rem solid var(--border);
  position: relative;
}
.doc-editor__content table td:last-child { border-right: none; }
.doc-editor__content .selectedCell {
  background-color: color-mix(in oklch, var(--primary) 8%, transparent) !important;
  outline: 0.125rem solid color-mix(in oklch, var(--primary) 40%, transparent);
  outline-offset: -0.125rem;
}
.doc-editor__content td .is-empty::before,
.doc-editor__content th .is-empty::before { display: none; }

/* Tiptap рендерит .column-resize-handle в каждой ячейке — скрываем,
   у нас своя ручка через Teleport на полную высоту таблицы */
.doc-editor__content .column-resize-handle { display: none; }

.doc-editor__content.resize-cursor { cursor: col-resize; }
</style>

<style scoped>
/* ── Ручка ресайза (Teleport в body, full table height) ── */
.tbl-resize-handle {
  position: fixed;
  width: 0.25rem;
  transform: translateX(-50%) translateY(-50%);
  background: var(--primary);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.85;
  box-shadow: 0 0 0 0.1875rem color-mix(in oklch, var(--primary) 15%, transparent);
}

/* ── Контекстное меню ── */
.tbl-ctx-overlay { position: fixed; inset: 0; z-index: 49; }
.tbl-ctx-menu {
  position: absolute;
  z-index: 50;
  min-width: 10.5rem;
  padding: 0.25rem;
  border-radius: var(--radius-md, 0.375rem);
  border: 0.0625rem solid var(--border);
  background-color: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    0 0.25rem 0.375rem -0.0625rem color-mix(in oklch, var(--foreground) 8%, transparent),
    0 0.125rem 0.25rem -0.125rem color-mix(in oklch, var(--foreground) 5%, transparent);
}
.tbl-ctx-group { display: flex; flex-direction: column; }
.tbl-ctx-label {
  padding: 0.25rem 0.5rem 0.125rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.tbl-ctx-separator { height: 0.0625rem; margin: 0.25rem 0; background-color: var(--border); }
.tbl-ctx-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.375rem 0.5rem;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  border: none;
  background: none;
  color: var(--popover-foreground);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.1s, color 0.1s;
}
.tbl-ctx-item svg { flex-shrink: 0; color: var(--muted-foreground); transition: color 0.1s; }
.tbl-ctx-item:hover { background-color: var(--accent); color: var(--accent-foreground); }
.tbl-ctx-item:hover svg { color: var(--accent-foreground); }
.tbl-ctx-item--danger:hover { background-color: color-mix(in oklch, var(--destructive) 10%, transparent); color: var(--destructive); }
.tbl-ctx-item--danger:hover svg { color: var(--destructive); }

/* ── + кнопки ── */
.tbl-add-btn {
  position: fixed;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: color-mix(in oklch, var(--primary) 30%, transparent);
  color: transparent;
  cursor: pointer;
  border-radius: 9999px;
  transition: width 0.2s ease, height 0.2s ease, background-color 0.2s, color 0.15s;
  overflow: hidden;
}
.tbl-add-btn--row {
  width: 4rem;
  height: 0.3125rem;
  transform: translateX(-50%) translateY(-50%);
}
.tbl-add-btn--row:hover {
  height: 1.5rem;
  background: var(--primary);
  color: var(--primary-foreground);
}
.tbl-add-btn--col {
  width: 0.3125rem;
  height: 4rem;
  transform: translateX(-50%) translateY(-50%);
}
.tbl-add-btn--col:hover {
  width: 1.5rem;
  background: var(--primary);
  color: var(--primary-foreground);
}
.tbl-add-btn svg { opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
.tbl-add-btn:hover svg { opacity: 1; }

/* ── Анимации ── */
.tbl-ctx-enter-active, .tbl-ctx-leave-active { transition: opacity 0.1s, transform 0.1s; }
.tbl-ctx-enter-from, .tbl-ctx-leave-to { opacity: 0; transform: scale(0.96) translateY(-0.25rem); }
.tbl-add-enter-active, .tbl-add-leave-active { transition: opacity 0.15s; }
.tbl-add-enter-from, .tbl-add-leave-to { opacity: 0; }
.tbl-resize-enter-active, .tbl-resize-leave-active { transition: opacity 0.1s; }
.tbl-resize-enter-from, .tbl-resize-leave-to { opacity: 0; }
</style>
