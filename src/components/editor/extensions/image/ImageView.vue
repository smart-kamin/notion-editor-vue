<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Node } from '@tiptap/pm/model'
import { AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  node:             Node
  updateAttributes: (attrs: Record<string, unknown>) => void
  selected:         boolean
  editor:           any
  deleteNode:       () => void
}>()

const imgRef = ref<HTMLImageElement | null>(null)

// ── Resize ────────────────────────────────────────────────────────────────────

const isResizing = ref(false)
let resizeSide: 'left' | 'right' = 'right'
let startX    = 0
let startWidth = 0

function startResize(e: MouseEvent, side: 'left' | 'right') {
  e.preventDefault()
  resizeSide  = side
  startX      = e.clientX
  startWidth  = props.node.attrs.width ?? imgRef.value?.offsetWidth ?? 400
  isResizing.value = true

  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup',   onResizeEnd)
}

function onResizeMove(e: MouseEvent) {
  const delta    = resizeSide === 'right' ? e.clientX - startX : startX - e.clientX
  const newWidth = Math.max(80, Math.round(startWidth + delta))
  props.updateAttributes({ width: newWidth })
}

function onResizeEnd() {
  isResizing.value = false
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup',   onResizeEnd)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup',   onResizeEnd)
})

// ── Alignment ─────────────────────────────────────────────────────────────────

const align = computed<string>(() => props.node.attrs.align ?? 'center')

const justifyMap: Record<string, string> = {
  left:   'flex-start',
  center: 'center',
  right:  'flex-end',
}

// ── Computed styles ───────────────────────────────────────────────────────────

const wrapperStyle = computed(() => ({
  justifyContent: justifyMap[align.value] ?? 'center',
}))

const imgStyle = computed(() => ({
  width:    props.node.attrs.width ? `${props.node.attrs.width}px` : undefined,
  maxWidth: '100%',
}))
</script>

<template>
  <NodeViewWrapper
    class="img-nv"
    :class="{ 'img-nv--resizing': isResizing }"
    :style="wrapperStyle"
  >
    <div
      class="img-nv__wrap"
      :class="{
        'img-nv__wrap--selected': selected,
        'img-nv__wrap--active':   selected || isResizing,
      }"
    >
      <!-- Тулбар -->
      <Transition name="img-tb">
        <div v-if="selected || isResizing" class="img-nv__toolbar">
          <button
            class="img-nv__tb-btn"
            :class="{ 'img-nv__tb-btn--active': align === 'left' }"
            title="По левому краю"
            @mousedown.prevent="updateAttributes({ align: 'left' })"
          >
            <AlignLeft :size="13" />
          </button>
          <button
            class="img-nv__tb-btn"
            :class="{ 'img-nv__tb-btn--active': align === 'center' }"
            title="По центру"
            @mousedown.prevent="updateAttributes({ align: 'center' })"
          >
            <AlignCenter :size="13" />
          </button>
          <button
            class="img-nv__tb-btn"
            :class="{ 'img-nv__tb-btn--active': align === 'right' }"
            title="По правому краю"
            @mousedown.prevent="updateAttributes({ align: 'right' })"
          >
            <AlignRight :size="13" />
          </button>

          <div class="img-nv__tb-sep" />

          <button
            class="img-nv__tb-btn img-nv__tb-btn--danger"
            title="Удалить"
            @mousedown.prevent="deleteNode"
          >
            <Trash2 :size="13" />
          </button>
        </div>
      </Transition>

      <!-- Изображение -->
      <img
        ref="imgRef"
        :src="node.attrs.src"
        :alt="node.attrs.alt ?? ''"
        :style="imgStyle"
        draggable="false"
        class="img-nv__img"
      />

      <!-- Ручки ресайза -->
      <template v-if="selected || isResizing">
        <div
          class="img-nv__handle img-nv__handle--left"
          @mousedown.prevent="e => startResize(e, 'left')"
        />
        <div
          class="img-nv__handle img-nv__handle--right"
          @mousedown.prevent="e => startResize(e, 'right')"
        />
      </template>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.img-nv {
  display: flex;
  padding: 0.25rem 0;
}

.img-nv--resizing {
  cursor: ew-resize;
}

.img-nv__wrap {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  border-radius: var(--radius-md, 0.375rem);
  transition: box-shadow 0.15s, margin-top 0.15s;
  line-height: 0;
}

/* При выделении сдвигаем вниз — тулбар выходит в освободившееся место */
.img-nv__wrap--active {
  margin-top: 2.5rem;
}

.img-nv__wrap--selected {
  box-shadow: 0 0 0 0.1875rem color-mix(in oklch, var(--primary) 55%, transparent);
}

.img-nv__img {
  display: block;
  border-radius: var(--radius-md, 0.375rem);
  max-width: 100%;
}

/* ── Тулбар — над картинкой, абсолютно, но в пределах margin-top ── */
.img-nv__toolbar {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.25rem;
  border-radius: var(--radius-md, 0.375rem);
  border: 0.0625rem solid var(--border);
  background: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    0 0.25rem 0.375rem -0.0625rem color-mix(in oklch, var(--foreground) 8%, transparent),
    0 0.125rem 0.25rem -0.125rem color-mix(in oklch, var(--foreground) 5%, transparent);
  white-space: nowrap;
}

.img-nv__tb-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: background-color 0.1s, color 0.1s;
}

.img-nv__tb-btn:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}

.img-nv__tb-btn--active {
  background: var(--accent);
  color: var(--accent-foreground);
}

.img-nv__tb-btn--danger:hover {
  background: color-mix(in oklch, var(--destructive) 10%, transparent);
  color: var(--destructive);
}

.img-nv__tb-sep {
  width: 0.0625rem;
  height: 1rem;
  background: var(--border);
  margin: 0 0.125rem;
  flex-shrink: 0;
}

/* ── Ручки ресайза ── */
.img-nv__handle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 0.3125rem;
  height: 3.5rem;
  max-height: 50%;
  border-radius: 9999px;
  background: var(--primary);
  cursor: ew-resize;
  opacity: 0.75;
  transition: opacity 0.15s, transform 0.15s;
}

.img-nv__handle:hover {
  opacity: 1;
  transform: translateY(-50%) scaleX(1.3);
}

.img-nv__handle--left  { left:  -0.625rem; }
.img-nv__handle--right { right: -0.625rem; }

/* ── Анимация тулбара ── */
.img-tb-enter-active,
.img-tb-leave-active {
  transition: opacity 0.1s, transform 0.1s;
}

.img-tb-enter-from,
.img-tb-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(0.25rem);
}
</style>
