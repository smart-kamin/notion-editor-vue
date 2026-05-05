<script setup lang="ts">
import { computed, ref } from 'vue'
import { GripVertical, Plus } from 'lucide-vue-next'
import type { Editor } from '@tiptap/core'
import type { EditorView } from '@tiptap/pm/view'
import { dragHandleState } from './index'

const props = defineProps<{ editor: Editor | undefined }>()
const style = computed(() => ({ top: `${dragHandleState.y}px` }))
const isDragging = ref(false)

interface BlockInfo {
  pos:  number
  size: number
  dom:  HTMLElement
  rect: DOMRect
}

function getTopLevelBlocks(view: EditorView): BlockInfo[] {
  const result: BlockInfo[] = []
  view.state.doc.forEach((node, offset) => {
    const dom = view.nodeDOM(offset)
    if (dom instanceof HTMLElement) {
      result.push({ pos: offset, size: node.nodeSize, dom, rect: dom.getBoundingClientRect() })
    }
  })
  return result
}

// ── Plus ──────────────────────────────────────────────────────────────
function onPlus() {
  const ed = props.editor
  if (!ed || dragHandleState.blockPos < 0) return
  const { doc } = ed.view.state
  const node = doc.nodeAt(dragHandleState.blockPos)
  if (!node) return
  const isEmpty = node.type.name === 'paragraph' && node.content.size === 0
  if (isEmpty) {
    ed.chain().focus().setTextSelection(dragHandleState.blockPos + 1).insertContent('/').run()
    return
  }
  const endPos = dragHandleState.blockPos + node.nodeSize
  ed.chain().focus()
    .insertContentAt(endPos, { type: 'paragraph' })
    .setTextSelection(endPos + 1)
    .insertContent('/').run()
}

// ── Drag ──────────────────────────────────────────────────────────────
function onGripMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()

  const ed = props.editor
  if (!ed || dragHandleState.blockPos < 0) return
  const view = ed.view

  const container = (view.dom as HTMLElement).closest('.doc-editor') as HTMLElement | null
  if (!container) return

  const allBlocks = getTopLevelBlocks(view)
  const sourceIdx = allBlocks.findIndex(b => b.pos === dragHandleState.blockPos)
  if (sourceIdx < 0) return
  const source = allBlocks[sourceIdx]
  if (!source) return
  const sourceEl = source.dom

  const nextBlock = allBlocks[sourceIdx + 1]
  const draggedH  = nextBlock ? nextBlock.rect.top - source.rect.top : source.rect.height

  // Реальный containing block для position:absolute — ближайший positioned ancestor.
  // offsetParent надёжнее жёсткого предположения про view.dom.
  const cb     = (sourceEl.offsetParent as HTMLElement | null) ?? document.documentElement as HTMLElement
  const cbRect = cb.getBoundingClientRect()
  const topInCB  = source.rect.top  - cbRect.top
  const leftInCB = source.rect.left - cbRect.left
  const offsetY  = e.clientY - source.rect.top

  isDragging.value           = true
  dragHandleState.isDragging = true
  dragHandleState.visible    = false
  document.body.style.userSelect = 'none'
  document.body.style.cursor     = 'grabbing'
  sourceEl.removeAttribute('data-dh-hovered')

  // ── Останавливаем PM DOMObserver ─────────────────────────────────────
  // ProseMirror слушает мутации через MutationObserver (view.domObserver).
  // При любом изменении style на PM-нодах он вызывает flush() → DOM reconciliation
  // и немедленно откатывает наши изменения.
  // domObserver.stop() вызывает observer.disconnect() — очередь мутаций сбрасывается.
  // domObserver.start() в cleanup() поднимает наблюдение заново на уже восстановленном DOM.
  const domObserver = (view as any).domObserver
  domObserver?.stop?.()

  // ── Снимаем sourceEl из нормального потока ───────────────────────────
  // position:absolute → блоки ниже физически сдвигаются вверх.
  // Компенсируем немедленно через updateBlocks(sourceIdx) без анимации.
  Object.assign(sourceEl.style, {
    position:   'absolute',
    top:        `${topInCB}px`,
    left:       `${leftInCB - 6}px`,
    width:      `${source.rect.width + 6}px`,
    margin:     '0',
    paddingLeft: '6px',
    boxSizing:  'border-box',
    zIndex:     '10',
    willChange: 'box-shadow',
    transition: 'none',
  })

  // ── Начальная компенсация сдвига (без transitions) ───────────────────
  allBlocks.forEach((b, i) => {
    if (i === sourceIdx) return
    b.dom.style.transition = 'none'
    b.dom.style.willChange = 'transform'
  })
  // updateBlocks(sourceIdx):
  //   блоки выше → translateY(0)       (не затронуты)
  //   блоки ниже → translateY(draggedH) (компенсация физического подъёма)
  updateBlocks(sourceIdx)
  void container.offsetHeight  // force reflow → фиксируем base state без анимации

  // ── Включаем transitions для остальных блоков ────────────────────────
  allBlocks.forEach((b, i) => {
    if (i === sourceIdx) return
    b.dom.style.transition = 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)'
  })

  // ── Анимация "подъёма" sourceEl ──────────────────────────────────────
  // top меняем мгновенно (cursor tracking), transform+shadow — плавно при старте.
  requestAnimationFrame(() => {
    sourceEl.style.transition   = 'box-shadow 0.15s ease-out'
    sourceEl.style.borderRadius = 'var(--radius-md, 0.375rem)'
    sourceEl.style.boxShadow    = 'inset 0 0 0 2px var(--border), 0 4px 16px -4px rgba(0,0,0,.12)'
    sourceEl.style.background   = 'var(--background)'
  })

  let currentDropIdx = sourceIdx

  // Hit-тест по оригинальным rect'ам: все блоки визуально на прежних местах
  // (благодаря начальному translateY), поэтому рекорды остаются актуальными.
  function computeDropIdx(clientY: number): number {
    let pos = 0
    for (let i = 0; i < allBlocks.length; i++) {
      if (i === sourceIdx) continue
      const r = allBlocks[i]?.rect
      if (r && clientY > r.top + r.height / 2) pos++
    }
    return pos
  }

  //  ri = индекс в массиве без source (i если i<sourceIdx, иначе i-1)
  //
  //  Блок ВЫШЕ source → base translateY(0)
  //    ri >= dropIdx  → сдвигаем вниз на draggedH (открываем место для source)
  //
  //  Блок НИЖЕ source → base translateY(draggedH) (компенсация физического подъёма)
  //    ri < dropIdx   → убираем компенсацию (заполняет старое место source)
  //    иначе          → translateY(draggedH) (остаётся на месте)
  function updateBlocks(dropIdx: number) {
    allBlocks.forEach((b, i) => {
      if (i === sourceIdx) return
      const ri = i < sourceIdx ? i : i - 1
      let dy = 0
      if (i < sourceIdx) {
        dy = ri >= dropIdx ? draggedH : 0
      } else {
        dy = ri < dropIdx ? 0 : draggedH
      }
      b.dom.style.transform = dy ? `translateY(${dy}px)` : ''
    })
  }

  function onMouseMove(ev: MouseEvent) {
    // cbRect пересчитываем на случай scroll'а страницы во время drag'а.
    const currentCbRect = cb.getBoundingClientRect()
    sourceEl.style.top = `${(ev.clientY - offsetY) - currentCbRect.top}px`

    const newIdx = computeDropIdx(ev.clientY)
    if (newIdx !== currentDropIdx) {
      currentDropIdx = newIdx
      updateBlocks(newIdx)
    }
  }

  function cleanup() {
    // Возвращаем sourceEl в нормальный поток, убираем translateY с остальных.
    // Всё синхронно → браузер рисует один кадр уже после PM-транзакции.
    Object.assign(sourceEl.style, {
      position: '', top: '', left: '', width: '',
      margin: '', zIndex: '', willChange: '',
      transform: '', transition: '', boxShadow: '',
      borderRadius: '',
      background: '', paddingLeft: '', boxSizing: '',
    })

    allBlocks.forEach((b, i) => {
      if (i === sourceIdx) return
      b.dom.style.transition = ''
      b.dom.style.transform  = ''
      b.dom.style.willChange = ''
    })

    // Возобновляем PM DOMObserver на уже восстановленном DOM.
    // disconnect() в stop() очистил очередь мутаций — start() наблюдает "с нуля".
    domObserver?.start?.()

    document.body.style.userSelect = ''
    document.body.style.cursor     = ''
    isDragging.value           = false
    dragHandleState.isDragging = false
  }

  function onMouseUp() {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup',   onMouseUp)
    const finalIdx = currentDropIdx
    cleanup()
    if (finalIdx !== sourceIdx) movePMBlock(ed!, sourceIdx, finalIdx)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup',   onMouseUp)
}

// ── ProseMirror транзакция ────────────────────────────────────────────
function movePMBlock(editor: Editor, sourceIdx: number, dropIdx: number) {
  const { state } = editor.view
  const { doc }   = state

  const nodes: { pos: number; size: number; node: any }[] = []
  doc.forEach((node, offset) => nodes.push({ pos: offset, size: node.nodeSize, node }))

  if (sourceIdx < 0 || sourceIdx >= nodes.length) return
  const src = nodes[sourceIdx]
  if (!src) return
  if (dropIdx === sourceIdx) return

  const remaining = nodes.filter((_, i) => i !== sourceIdx)

  let insertPos: number
  if (dropIdx <= 0) {
    const first = nodes[0]; if (!first) return
    insertPos = first.pos
  } else if (dropIdx >= remaining.length) {
    const last = remaining[remaining.length - 1]; if (!last) return
    insertPos = last.pos + last.size
  } else {
    const target = remaining[dropIdx]; if (!target) return
    insertPos = target.pos
  }

  const tr = state.tr
  tr.delete(src.pos, src.pos + src.size)
  if (src.pos < insertPos) insertPos -= src.size
  tr.insert(insertPos, src.node)
  editor.view.dispatch(tr)
  editor.view.focus()
}
</script>

<template>
  <Transition name="dh">
    <div
      v-if="dragHandleState.visible && editor && !isDragging"
      class="dh"
      :style="style"
      data-drag-panel
    >
      <button class="dh__btn" title="Добавить блок" @mousedown.prevent="onPlus">
        <Plus :size="14" />
      </button>
      <div class="dh__btn dh__grip" title="Перетащить блок" @mousedown="onGripMouseDown">
        <GripVertical :size="14" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dh {
  position: absolute; left: 2px; z-index: 40;
  transition: top 0.12s ease-out;
  display: flex; align-items: center; gap: 0.125rem;
  height: 1.75rem; pointer-events: auto; user-select: none;
}
.dh__btn {
  display: flex; align-items: center; justify-content: center;
  width: 1.625rem; height: 1.625rem;
  border: none; border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: transparent; color: var(--muted-foreground);
  cursor: pointer; flex-shrink: 0;
  transition: background-color 0.1s, color 0.1s; padding: 0;
}
.dh__btn:hover { background: var(--accent); color: var(--accent-foreground); }
.dh__grip { cursor: grab; }
.dh__grip:active { cursor: grabbing; }
.dh-enter-active, .dh-leave-active { transition: opacity 0.1s; }
.dh-enter-from, .dh-leave-to { opacity: 0; }
</style>
