<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { NodeSelection } from '@tiptap/pm/state'
import { slashState } from './index'
import type { SlashItem } from './index'
import ImageInsertPopover from './ImageInsertPopover.vue'

// ── Группировка по категориям ─────────────────────────────────────────────────

const grouped = computed(() => {
  const groups: { category: string; items: (SlashItem & { index: number })[] }[] = []
  const seen: Record<string, number> = {}
  let globalIndex = 0

  for (const item of slashState.items) {
    if (!(item.category in seen)) {
      seen[item.category] = groups.length
      groups.push({ category: item.category, items: [] })
    }
    const groupIndex = seen[item.category] as number
    groups[groupIndex]!.items.push({ ...item, index: globalIndex++ })
  }
  return groups
})

// ── Автоскролл к выделенному элементу ────────────────────────────────────────

const listRef = ref<HTMLElement | null>(null)

watch(() => slashState.selectedIndex, () => {
  nextTick(() => {
    listRef.value
      ?.querySelector<HTMLElement>('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  })
})

// ── Позиция с учётом краёв экрана ────────────────────────────────────────────

const MENU_WIDTH  = 272
const MENU_MAX_H  = 360

const style = computed(() => {
  const x = Math.min(slashState.x, window.innerWidth - MENU_WIDTH - 8)
  const y = slashState.y + MENU_MAX_H > window.innerHeight
    ? slashState.y - MENU_MAX_H - 12   // открываем вверх
    : slashState.y

  return { left: Math.max(8, x) + 'px', top: Math.max(8, y) + 'px' }
})

// ── Image insert popover ──────────────────────────────────────────────────────

const imagePopoverVisible = ref(false)
const imagePopoverX       = ref(0)
const imagePopoverY       = ref(0)

function openImagePopover() {
  imagePopoverX.value       = slashState.x
  imagePopoverY.value       = slashState.y
  imagePopoverVisible.value = true
  slashState.openImagePopover = false
}

// Клик по пункту меню
function select(item: SlashItem) {
  if (item.showImagePopover) {
    slashState.visible = false
    openImagePopover()
    return
  }
  slashState.runCommand?.(item)
}

// Enter из onKeyDown выставляет флаг — наблюдаем и открываем поповер
watch(() => slashState.openImagePopover, (v) => {
  if (v) openImagePopover()
})

function onImageInsert(src: string) {
  imagePopoverVisible.value = false
  const editor = slashState.pendingEditor
  const range  = slashState.pendingRange
  if (editor && range) {
    editor.chain().focus().deleteRange(range).setImage({ src }).run()
    // Выделяем только что вставленную ноду, чтобы сразу показался тулбар
    nextTick(() => {
      const { doc, tr } = editor.view.state
      const from = range.from
      let imagePos = -1
      doc.nodesBetween(from, Math.min(from + 5, doc.content.size), (node: any, nodePos: number) => {
        if (node.type.name === 'image' && imagePos === -1) imagePos = nodePos
      })
      if (imagePos >= 0) {
        const sel = NodeSelection.create(editor.view.state.doc, imagePos)
        editor.view.dispatch(editor.view.state.tr.setSelection(sel))
      }
    })
  }
  slashState.pendingEditor = null
  slashState.pendingRange  = null
}

function onImageClose() {
  imagePopoverVisible.value   = false
  slashState.openImagePopover = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sm">
      <div
        v-if="slashState.visible"
        class="sm"
        :style="style"
      >
        <!-- Пустой результат -->
        <div v-if="!slashState.items.length" class="sm__empty">
          Ничего не найдено
        </div>

        <!-- Список с группами -->
        <div v-else ref="listRef" class="sm__list">
          <div v-for="group in grouped" :key="group.category" class="sm__group">
            <p class="sm__group-label">{{ group.category }}</p>

            <button
              v-for="item in group.items"
              :key="item.title"
              class="sm__item"
              :class="{ 'sm__item--active': item.index === slashState.selectedIndex }"
              :data-selected="item.index === slashState.selectedIndex"
              @mousedown.prevent="select(item)"
            >
              <span class="sm__item-icon">
                <component :is="item.icon" :size="15" />
              </span>
              <span class="sm__item-body">
                <span class="sm__item-title">{{ item.title }}</span>
                <span class="sm__item-desc">{{ item.description }}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Поповер вставки изображения -->
  <ImageInsertPopover
    :visible="imagePopoverVisible"
    :x="imagePopoverX"
    :y="imagePopoverY"
    @insert="onImageInsert"
    @close="onImageClose"
  />
</template>

<style scoped>
.sm {
  position: fixed;
  z-index: 50;
  width: 17rem;
  border-radius: var(--radius-md, 0.375rem);
  border: 0.0625rem solid var(--border);
  background: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    0 0.25rem 0.5rem -0.0625rem color-mix(in oklch, var(--foreground) 10%, transparent),
    0 0.125rem 0.25rem -0.125rem color-mix(in oklch, var(--foreground) 6%, transparent);
  overflow: hidden;
}

/* ── Список ── */
.sm__list {
  max-height: 22.5rem;
  overflow-y: auto;
  padding: 0.25rem;
  overscroll-behavior: contain;
}

/* ── Группа ── */
.sm__group { display: flex; flex-direction: column; }

.sm__group-label {
  padding: 0.375rem 0.5rem 0.125rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Элемент ── */
.sm__item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: none;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: transparent;
  color: var(--popover-foreground);
  font-size: 0.8125rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.1s;
}

.sm__item:hover,
.sm__item--active {
  background: var(--accent);
  color: var(--accent-foreground);
}

.sm__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  border: 0.0625rem solid var(--border);
  background: var(--background);
  color: var(--muted-foreground);
}

.sm__item--active .sm__item-icon,
.sm__item:hover .sm__item-icon {
  border-color: transparent;
  background: color-mix(in oklch, var(--accent-foreground) 10%, transparent);
  color: var(--accent-foreground);
}

.sm__item-body {
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
}

.sm__item-title {
  font-weight: 500;
  line-height: 1.25;
}

.sm__item-desc {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sm__item--active .sm__item-desc,
.sm__item:hover .sm__item-desc {
  color: color-mix(in oklch, var(--accent-foreground) 70%, transparent);
}

/* ── Пусто ── */
.sm__empty {
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
}

/* ── Анимация ── */
.sm-enter-active, .sm-leave-active { transition: opacity 0.1s, transform 0.1s; }
.sm-enter-from, .sm-leave-to { opacity: 0; transform: translateY(-0.25rem) scale(0.98); }
</style>
