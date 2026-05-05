<script setup lang="ts">
import { ref, computed } from 'vue'
import { DocEditor } from '@smart-kamin/notion-editor-vue'
import type { OutputFormat } from '@smart-kamin/notion-editor-vue'

const dark         = ref(false)
const outputFormat = ref<OutputFormat>('markdown')
const content      = ref('')
const copied       = ref(false)

const outputLabel = computed(() => ({
  html:     'HTML',
  json:     'JSON',
  markdown: 'Markdown',
  text:     'Text',
}[outputFormat.value]))

function toggleDark() {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
}

async function copy() {
  await navigator.clipboard.writeText(content.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="min-h-screen flex flex-col" :class="{ dark }">
    <!-- Шапка -->
    <header class="sticky top-0 z-10 flex items-center justify-between px-6 h-12 border-b"
            style="background: var(--background); border-color: var(--border)">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-sm">notion-editor-vue</span>
        <span class="text-xs px-1.5 py-0.5 rounded"
              style="background: var(--muted); color: var(--muted-foreground)">demo</span>
      </div>
      <div class="flex items-center gap-3">
        <!-- Переключатель формата -->
        <div class="flex items-center gap-1 text-xs" style="color: var(--muted-foreground)">
          <span>Формат:</span>
          <select
              v-model="outputFormat"
              class="text-xs px-2 py-1 rounded border outline-none cursor-pointer"
              style="background: var(--background); color: var(--foreground); border-color: var(--border)"
          >
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="text">Text</option>
          </select>
        </div>

        <!-- Тёмная тема -->
        <button
            class="text-xs px-3 py-1 rounded border transition-colors"
            style="border-color: var(--border); color: var(--muted-foreground)"
            @click="toggleDark"
        >
          {{ dark ? '☀️ Light' : '🌙 Dark' }}
        </button>

        <!-- GitHub -->
        <a
            href="https://github.com/smart-kamin/notion-editor-vue"
            target="_blank"
            class="text-xs px-3 py-1 rounded border transition-colors"
            style="border-color: var(--border); color: var(--muted-foreground)"
        >
          GitHub ↗
        </a>
      </div>
    </header>

    <!-- Основная область -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Редактор -->
      <div class="flex-1 overflow-y-auto px-8 py-8 max-w-3xl mx-auto w-full">
        <h1 class="text-2xl font-bold mb-1">Попробуй редактор</h1>
        <p class="text-sm mb-8" style="color: var(--muted-foreground)">
          Нажми <kbd class="px-1.5 py-0.5 rounded text-xs font-mono"
                     style="background: var(--muted); border: 1px solid var(--border)">/</kbd>
          для вставки блоков. Выдели текст для форматирования.
        </p>

        <DocEditor v-model="content" :output-format="outputFormat" />
      </div>

      <!-- Панель вывода -->
      <aside class="w-96 shrink-0 border-l flex flex-col overflow-hidden"
             style="border-color: var(--border)">
        <div class="flex items-center justify-between px-4 h-10 border-b shrink-0"
             style="border-color: var(--border)">
          <span class="text-xs font-medium" style="color: var(--muted-foreground)">
            Вывод · {{ outputLabel }}
          </span>
          <button
              class="text-xs px-2 py-1 rounded transition-colors"
              style="color: var(--muted-foreground)"
              :style="copied ? { color: 'oklch(0.6 0.15 150)' } : {}"
              @click="copy"
          >
            {{ copied ? '✓ Скопировано' : 'Копировать' }}
          </button>
        </div>
        <pre
            class="flex-1 overflow-auto p-4 text-xs leading-relaxed font-mono"
            style="color: var(--muted-foreground); white-space: pre-wrap; word-break: break-word"
        >{{ content || '// начни печатать в редакторе...' }}</pre>
      </aside>
    </div>
  </div>
</template>