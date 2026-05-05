<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Trash2, ExternalLink, Copy } from 'lucide-vue-next'

const props = defineProps<{
  editor: Editor | undefined
}>()

const wrapRef = defineModel<HTMLElement | null>('wrap', { default: null })

// ── Предотвращение навигации (capture-фаза) ──────────────────────────────────

function onLinkMousedown(e: MouseEvent) {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.ed-link')
  if (!link) return
  e.preventDefault()
}

function onLinkClick(e: MouseEvent) {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.ed-link')
  if (!link) return
  e.preventDefault()
  e.stopImmediatePropagation()
  if (e.ctrlKey || e.metaKey) {
    window.open(link.href, '_blank', 'noopener,noreferrer')
  }
}

// ── Контекстный попап ─────────────────────────────────────────────────────────

interface CtxMenu {
  top:  number
  left: number
  pos:  number
  originalHref: string
}

const ctxMenu  = ref<CtxMenu | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const inputVal = ref('')

function openCtxMenu(e: MouseEvent) {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.ed-link')
  if (!link) return

  e.preventDefault()
  e.stopImmediatePropagation()

  const ed   = props.editor
  const wrap = wrapRef.value
  if (!ed || !wrap) return

  try {
    const pos      = ed.view.posAtDOM(link, 0)
    const wrapRect = wrap.getBoundingClientRect()

    ctxMenu.value = {
      top:          e.clientY - wrapRect.top  + 4,
      left:         e.clientX - wrapRect.left + 4,
      pos,
      originalHref: link.href,
    }
    inputVal.value = link.href

    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  } catch (err) {
    console.error('[LinkControls] posAtDOM error:', err)
  }
}

function close() {
  if (saveTimer) clearTimeout(saveTimer)
  ctxMenu.value = null
  inputVal.value = ''
}

// ── Автосохранение ────────────────────────────────────────────────────────────

let saveTimer: ReturnType<typeof setTimeout> | null = null

function applyLink(href: string) {
  const ed  = props.editor
  const ctx = ctxMenu.value
  if (!ed || !ctx) return
  try {
    ed.chain()
      .setTextSelection(ctx.pos)
      .extendMarkRange('link')
      .updateAttributes('link', { href })
      .run()
  } catch (err) {
    console.error('[LinkControls] save error:', err)
  }
}

watch(inputVal, (val) => {
  if (!ctxMenu.value) return
  if (saveTimer) clearTimeout(saveTimer)
  const href = val.trim()
  if (!href) return
  saveTimer = setTimeout(() => applyLink(href), 400)
})

function removeLink() {
  const ed  = props.editor
  const ctx = ctxMenu.value
  if (!ed || !ctx) return

  try {
    ed.chain()
      .focus()
      .setTextSelection(ctx.pos)
      .extendMarkRange('link')
      .unsetLink()
      .run()
  } catch (err) {
    console.error('[LinkControls] remove error:', err)
  }

  close()
}

function openInNewTab() {
  const href = inputVal.value.trim() || ctxMenu.value?.originalHref
  if (href) window.open(href, '_blank', 'noopener,noreferrer')
}

function copyLink() {
  const href = inputVal.value.trim() || ctxMenu.value?.originalHref
  if (href) navigator.clipboard.writeText(href)
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (saveTimer) clearTimeout(saveTimer)
    const href = inputVal.value.trim()
    if (href) applyLink(href)
    close()
  }
  if (e.key === 'Escape') close()
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

let cleanup: (() => void) | null = null

watch(wrapRef, (el, prevEl) => {
  if (prevEl) {
    prevEl.removeEventListener('contextmenu', openCtxMenu)
    prevEl.removeEventListener('mousedown', onLinkMousedown, { capture: true } as EventListenerOptions)
    prevEl.removeEventListener('click',     onLinkClick,    { capture: true } as EventListenerOptions)
  }
  if (el) {
    el.addEventListener('contextmenu', openCtxMenu)
    el.addEventListener('mousedown', onLinkMousedown, { capture: true })
    el.addEventListener('click',     onLinkClick,    { capture: true })
    cleanup = () => {
      el.removeEventListener('contextmenu', openCtxMenu)
      el.removeEventListener('mousedown', onLinkMousedown, { capture: true } as EventListenerOptions)
      el.removeEventListener('click',     onLinkClick,    { capture: true } as EventListenerOptions)
    }
  }
}, { immediate: true })

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <!-- Прозрачный оверлей для закрытия по клику вне попапа -->
  <Teleport to="body">
    <div v-if="ctxMenu" class="lnk-overlay" @mousedown.self="close" />
  </Teleport>

  <!-- Контекстный попап -->
  <Transition name="lnk-ctx">
    <div
      v-if="ctxMenu"
      class="lnk-ctx"
      :style="{ top: ctxMenu.top + 'px', left: ctxMenu.left + 'px' }"
    >
      <!-- Инпут + кнопка открыть -->
      <div class="lnk-ctx__input-row">
        <input
          ref="inputRef"
          v-model="inputVal"
          class="lnk-ctx__input"
          type="url"
          placeholder="https://example.com"
          autocomplete="off"
          spellcheck="false"
          @keydown="onKeydown"
        />
        <button
          class="lnk-ctx__icon-btn"
          title="Открыть в новой вкладке"
          @mousedown.prevent="openInNewTab"
        >
          <ExternalLink :size="13" />
        </button>
      </div>

      <div class="lnk-ctx-separator" />

      <!-- Действия -->
      <div class="lnk-ctx__actions">
        <button class="lnk-ctx-item lnk-ctx-item--danger" @mousedown.prevent="removeLink">
          <Trash2 :size="13" />
          <span>Удалить</span>
        </button>
        <button class="lnk-ctx-item lnk-ctx-item--copy" @mousedown.prevent="copyLink">
          <Copy :size="13" />
          <span>Копировать</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<!-- Стили ссылок внутри редактора (не scoped) -->
<style>
.doc-editor__content a.ed-link {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-decoration-thickness: 0.0625rem;
  text-decoration-color: color-mix(in oklch, var(--primary) 40%, transparent);
  cursor: text;
  transition: text-decoration-color 0.15s;
}

.doc-editor__content a.ed-link:hover {
  text-decoration-color: var(--primary);
  cursor: pointer;
}

.doc-editor__content a.ed-link::after {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 3h6v6'/%3E%3Cpath d='M10 14 21 3'/%3E%3Cpath d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/%3E%3C/svg%3E");
  display: inline-block;
  margin-left: 0.2em;
  opacity: 0.45;
  vertical-align: middle;
  transition: opacity 0.15s;
}

.doc-editor__content a.ed-link:hover::after {
  opacity: 0.8;
}
</style>

<style scoped>
.lnk-overlay {
  position: fixed;
  inset: 0;
  z-index: 49;
}

.lnk-ctx {
  position: absolute;
  z-index: 50;
  width: 19rem;
  padding: 0.375rem;
  border-radius: var(--radius-md, 0.375rem);
  border: 0.0625rem solid var(--border);
  background-color: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    0 0.25rem 0.375rem -0.0625rem color-mix(in oklch, var(--foreground) 8%, transparent),
    0 0.125rem 0.25rem -0.125rem color-mix(in oklch, var(--foreground) 5%, transparent);
  display: flex;
  flex-direction: column;
}

/* ── Инпут ── */
.lnk-ctx__input-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem;
}

.lnk-ctx__input {
  flex: 1;
  height: 1.875rem;
  border: 0.0625rem solid var(--border);
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: var(--background);
  padding: 0 0.5rem;
  font-size: 0.8125rem;
  color: var(--foreground);
  outline: none;
  min-width: 0;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.lnk-ctx__input::placeholder {
  color: var(--muted-foreground);
}

.lnk-ctx__input:focus {
  border-color: var(--ring, var(--primary));
  box-shadow: 0 0 0 0.1875rem color-mix(in oklch, var(--ring, var(--primary)) 20%, transparent);
}

.lnk-ctx__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.875rem;
  height: 1.875rem;
  border: none;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: background-color 0.1s, color 0.1s;
}

.lnk-ctx__icon-btn:hover {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

/* ── Разделитель ── */
.lnk-ctx-separator {
  height: 0.0625rem;
  margin: 0.25rem 0;
  background-color: var(--border);
}

/* ── Действия ── */
.lnk-ctx__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lnk-ctx-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  height: 1.875rem;
  padding: 0 0.5rem;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  border: none;
  background: none;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  cursor: pointer;
  transition: background-color 0.1s, color 0.1s;
}

.lnk-ctx-item svg {
  flex-shrink: 0;
  color: var(--muted-foreground);
  transition: color 0.1s;
}

.lnk-ctx-item--danger {
  color: var(--muted-foreground);
}

.lnk-ctx-item--danger:hover {
  background-color: color-mix(in oklch, var(--destructive) 10%, transparent);
  color: var(--destructive);
}

.lnk-ctx-item--danger:hover svg {
  color: var(--destructive);
}

.lnk-ctx-item--save {
  color: var(--popover-foreground);
  font-weight: 500;
}

.lnk-ctx-item--save:hover {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.lnk-ctx-item--copy {
  color: var(--muted-foreground);
}

.lnk-ctx-item--copy:hover {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.lnk-ctx-item--copy:hover svg {
  color: var(--accent-foreground);
}

/* ── Анимация ── */
.lnk-ctx-enter-active,
.lnk-ctx-leave-active {
  transition: opacity 0.1s, transform 0.1s;
}

.lnk-ctx-enter-from,
.lnk-ctx-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-0.25rem);
}
</style>
