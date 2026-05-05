<script setup lang="ts">
import { computed, ref } from 'vue'
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { Quote, ChevronDown } from 'lucide-vue-next'

const props = defineProps(nodeViewProps)

const PREVIEW_LIMIT    = 500
const COLLAPSED_HEIGHT = '7rem'

const isLong     = computed(() => (props.node.textContent?.length ?? 0) > PREVIEW_LIMIT)
const isExpanded = ref(false)
const bodyRef    = ref<HTMLElement | null>(null)
const bodyHeight = ref<string>(COLLAPSED_HEIGHT)
const showFade   = ref(true)

function toggle() {
  const el = bodyRef.value
  if (!el) return

  if (!isExpanded.value) {
    bodyHeight.value = el.scrollHeight + 'px'
    showFade.value   = false
    el.addEventListener('transitionend', () => {
      bodyHeight.value = 'auto'
    }, { once: true })
  } else {
    // Фиксируем текущую px-высоту перед анимацией вниз
    bodyHeight.value = el.scrollHeight + 'px'
    void el.offsetHeight  // force reflow — иначе браузер батчит оба изменения
    requestAnimationFrame(() => {
      bodyHeight.value = COLLAPSED_HEIGHT
      showFade.value   = true
    })
  }

  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <NodeViewWrapper as="blockquote" class="ed-blockquote">

    <!--
      contenteditable="false" — ключевой фикс:
      без него ProseMirror считает иконку частью редактируемого контента
      и смещает позиции курсора, из-за чего # пробел применялся к следующему абзацу.
      Источник: https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views
    -->
    <Quote
      class="ed-blockquote__icon"
      aria-hidden="true"
      contenteditable="false"
    />

    <div
      ref="bodyRef"
      class="ed-blockquote__body"
      :style="isLong ? { height: bodyHeight, overflow: 'hidden' } : { display: 'contents' }"
    >
      <NodeViewContent class="ed-blockquote__content" />
      <div v-if="isLong && showFade" class="ed-blockquote__fade" />
    </div>

    <!-- contenteditable="false" — кнопка тоже не редактируемый контент -->
    <button
      v-if="isLong"
      class="ed-blockquote__toggle"
      contenteditable="false"
      :title="isExpanded ? 'Свернуть' : 'Развернуть'"
      @click.prevent="toggle"
    >
      <ChevronDown
        :size="14"
        :stroke-width="2"
        :style="{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"
      />
      <span>{{ isExpanded ? 'Свернуть' : 'Читать полностью' }}</span>
    </button>

  </NodeViewWrapper>
</template>

<style>
.ed-blockquote {
  position: relative;
  border: 0.0625rem solid var(--border);
  border-radius: var(--radius-md, 0.375rem);
  padding: 1rem 1rem 1rem 1.25rem;
  margin: 1rem 0;
  color: var(--muted-foreground);
  font-style: italic;
}

.ed-blockquote__icon {
  position: absolute;
  top: 0;
  left: 1rem;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  padding: 0.2rem;
  border-radius: 9999px;
  background: var(--background);
  color: var(--muted-foreground);
  border: 0.0625rem solid var(--border);
  stroke-width: 1.5;
}

.ed-blockquote__body {
  position: relative;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ed-blockquote__content p {
  margin: 0;
  line-height: 1.6;
}

.ed-blockquote__fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  background: linear-gradient(to bottom, transparent, var(--background));
  pointer-events: none;
}

.ed-blockquote__toggle {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border: none;
  border-top: 0.0625rem solid var(--border);
  background: none;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-style: normal;
  cursor: pointer;
  transition: color 0.15s;
}

.ed-blockquote__toggle:hover {
  color: var(--foreground);
}
</style>
