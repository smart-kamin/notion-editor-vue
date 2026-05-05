import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { reactive } from 'vue'

export const dragHandleState = reactive({
  visible:    false,
  y:          0,
  blockPos:   -1,
  blockEl:    null as HTMLElement | null,
  isDragging: false,   // ← блокирует onMouseMove во время drag
})

const DRAG_HANDLE_KEY = new PluginKey('dragHandle')

function getTopLevelBlock(view: any, target: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = target
  while (el && el.parentElement !== view.dom) el = el.parentElement
  return el ?? null
}

export const dragHandleExtension = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    const editor = this.editor
    let containerEl: HTMLElement | null = null
    let lastHoveredEl: HTMLElement | null = null

    function getContainer() {
      if (!containerEl)
        containerEl = (editor.view.dom as HTMLElement).closest('.doc-editor') as HTMLElement | null
      return containerEl
    }

    function clearHover() {
      lastHoveredEl?.removeAttribute('data-dh-hovered')
      lastHoveredEl = null
    }

    function onMouseLeave() {
      if (dragHandleState.isDragging) return   // не прятать во время drag
      clearHover()
      dragHandleState.visible = false
      dragHandleState.blockEl = null
    }

    let mouseLeaveAttached = false
    let isSelecting = false

    function onMouseDown() { isSelecting = true }
    function onMouseUp()   { isSelecting = false }

    function onMouseMove(event: MouseEvent) {
      if (dragHandleState.isDragging) return   // ← ключевая проверка
      if (isSelecting) return                  // ← не мешаем выделению текста

      const container = getContainer()
      if (container && !mouseLeaveAttached) {
        container.addEventListener('mouseleave', onMouseLeave)
        mouseLeaveAttached = true
      }

      const target = event.target as HTMLElement
      if (!container || !container.contains(target)) return
      if (target.closest('[data-drag-panel]')) return

      const view = editor.view
      if (!view.dom.contains(target) || target === view.dom) return

      const blockEl = getTopLevelBlock(view, target)
      if (!blockEl) return

      try {
        // posAtDOM ненадёжен для leaf-нод (image): резолвит в предыдущий блок.
        // Ищем позицию напрямую через nodeDOM — точно как в getTopLevelBlocks.
        let blockPos = -1
        view.state.doc.forEach((node, offset) => {
          if (view.nodeDOM(offset) === blockEl) blockPos = offset
        })
        if (blockPos < 0) return
        const rect     = blockEl.getBoundingClientRect()
        const lineH    = parseInt(getComputedStyle(blockEl).lineHeight) || 24
        const cRect    = container!.getBoundingClientRect()

        const isLeafMedia = blockEl.querySelector('table, img') !== null
        if (lastHoveredEl !== blockEl) {
          clearHover()
          if (!isLeafMedia) {
            blockEl.setAttribute('data-dh-hovered', '')
            lastHoveredEl = blockEl
          }
        }

        dragHandleState.blockPos = blockPos
        dragHandleState.blockEl  = blockEl
        dragHandleState.y        = rect.top - cRect.top + Math.max(0, (lineH - 24) / 2)
        dragHandleState.visible  = true
      } catch {
        dragHandleState.visible = false
      }
    }

    return [
      new Plugin({
        key: DRAG_HANDLE_KEY,
        view() {
          document.addEventListener('mousemove',  onMouseMove)
          document.addEventListener('mousedown',  onMouseDown)
          document.addEventListener('mouseup',    onMouseUp)
          return {
            destroy() {
              document.removeEventListener('mousemove',  onMouseMove)
              document.removeEventListener('mousedown',  onMouseDown)
              document.removeEventListener('mouseup',    onMouseUp)
              containerEl?.removeEventListener('mouseleave', onMouseLeave)
            },
          }
        },
      }),
    ]
  },
})
