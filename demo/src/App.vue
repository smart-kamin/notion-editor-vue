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
  text:     'Plain text',
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
  <div class="app-root" :class="{ dark }">

    <!-- ── Шапка ── -->
    <header class="topbar">
      <div class="topbar__left">
        <div class="topbar__logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          notion-editor-vue
        </div>
        <span class="topbar__badge">demo</span>
      </div>

      <div class="topbar__right">
        <div class="format-switcher">
          <span class="format-switcher__label">Output</span>
          <div class="format-switcher__pills">
            <button
                v-for="f in ['markdown','html','json','text']"
                :key="f"
                class="format-pill"
                :class="{ 'format-pill--active': outputFormat === f }"
                @click="outputFormat = f as OutputFormat"
            >{{ f }}</button>
          </div>
        </div>

        <div class="topbar__divider" />

        <button class="topbar__btn" @click="toggleDark">
          <span v-if="dark">☀︎</span><span v-else>☽</span>
        </button>

        <a
            class="topbar__btn topbar__btn--gh"
            href="https://github.com/smart-kamin/notion-editor-vue"
            target="_blank"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub
        </a>
      </div>
    </header>

    <!-- ── Основная область ── -->
    <div class="workspace">

      <!-- Редактор -->
      <section class="editor-pane">
        <div class="editor-pane__inner">
          <div class="editor-hero">
            <h1 class="editor-hero__title">Try the editor</h1>
            <p class="editor-hero__sub">
              Press <kbd>/</kbd> to insert blocks &middot; select text to format
            </p>
          </div>
          <div class="editor-wrap">
            <DocEditor v-model="content" :output-format="outputFormat" />
          </div>
        </div>
      </section>

      <!-- Панель вывода -->
      <aside class="output-pane">
        <div class="output-pane__header">
          <div class="output-pane__title">
            <span class="output-dot" />
            {{ outputLabel }}
          </div>
          <button class="copy-btn" :class="{ 'copy-btn--done': copied }" @click="copy">
            <template v-if="!copied">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="5" y="5" width="8" height="8" rx="1.5"/>
                <path d="M3 11V3h8" stroke-linecap="round"/>
              </svg>
              Copy
            </template>
            <template v-else>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8l3.5 3.5 6.5-7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Copied
            </template>
          </button>
        </div>
        <pre class="output-pane__body">{{ content || '// start typing in the editor...' }}</pre>
      </aside>

    </div>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background);
  color: var(--foreground);
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
}

/* ── Topbar ── */
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 3rem;
  border-bottom: 1px solid var(--border);
  background: color-mix(in oklch, var(--background) 85%, transparent);
  backdrop-filter: blur(12px);
}

.topbar__left  { display: flex; align-items: center; gap: 0.625rem; }
.topbar__right { display: flex; align-items: center; gap: 0.5rem; }

.topbar__logo {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.875rem; font-weight: 600; letter-spacing: -0.01em;
}

.topbar__badge {
  font-size: 0.6875rem; font-weight: 500;
  padding: 0.15rem 0.5rem; border-radius: 9999px;
  background: color-mix(in oklch, var(--primary) 8%, transparent);
  color: var(--muted-foreground); border: 1px solid var(--border);
}

.topbar__divider { width: 1px; height: 1.25rem; background: var(--border); margin: 0 0.25rem; }

.topbar__btn {
  display: flex; align-items: center; gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--border); border-radius: 0.375rem;
  background: transparent; color: var(--muted-foreground);
  font-size: 0.75rem; font-family: inherit;
  cursor: pointer; text-decoration: none;
  transition: background 0.12s, color 0.12s;
}
.topbar__btn:hover { background: var(--accent); color: var(--accent-foreground); }

/* ── Format switcher ── */
.format-switcher { display: flex; align-items: center; gap: 0.625rem; }

.format-switcher__label {
  font-size: 0.6875rem; font-weight: 500;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--muted-foreground);
}

.format-switcher__pills {
  display: flex; align-items: center; gap: 0.125rem;
  padding: 0.1875rem; border-radius: 0.5rem; background: var(--muted);
}

.format-pill {
  padding: 0.2rem 0.625rem;
  border: none; border-radius: 0.3125rem;
  background: transparent; color: var(--muted-foreground);
  font-size: 0.75rem; font-family: inherit; cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.format-pill:hover { color: var(--foreground); }
.format-pill--active {
  background: var(--background); color: var(--foreground); font-weight: 500;
  box-shadow: 0 1px 3px color-mix(in oklch, var(--foreground) 8%, transparent);
}

/* ── Workspace ── */
.workspace { flex: 1; display: flex; overflow: hidden; }

/* ── Editor pane ── */
.editor-pane { flex: 1; overflow-y: auto; display: flex; justify-content: center; }

.editor-pane__inner {
  width: 100%; max-width: 52rem;
  padding: 3.5rem 3rem 6rem;
}

.editor-hero { margin-bottom: 2rem; }

.editor-hero__title {
  font-size: 1.625rem; font-weight: 700;
  letter-spacing: -0.025em; margin-bottom: 0.5rem; line-height: 1.2;
}

.editor-hero__sub { font-size: 0.875rem; color: var(--muted-foreground); line-height: 1.5; }

.editor-hero__sub kbd {
  display: inline-block; padding: 0.1rem 0.4rem;
  border-radius: 0.25rem; background: var(--muted);
  border: 1px solid var(--border);
  font-family: ui-monospace, monospace; font-size: 0.8em;
}

.editor-wrap {
  border: 1px solid var(--border); border-radius: 0.75rem;
  padding: 1.75rem 0.5rem 1.75rem 0;
  background: color-mix(in oklch, var(--muted) 25%, transparent);
  min-height: 18rem;
}

/* ── Output pane ── */
.output-pane {
  width: 22rem; flex-shrink: 0;
  border-left: 1px solid var(--border);
  display: flex; flex-direction: column; overflow: hidden;
}

.output-pane__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.25rem; height: 2.75rem;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}

.output-pane__title {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.6875rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--muted-foreground);
}

.output-dot {
  width: 0.4375rem; height: 0.4375rem; border-radius: 9999px;
  background: oklch(0.65 0.16 150);
  box-shadow: 0 0 0 2px color-mix(in oklch, oklch(0.65 0.16 150) 25%, transparent);
}

.output-pane__body {
  flex: 1; overflow: auto; padding: 1.25rem;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
  font-size: 0.6875rem; line-height: 1.75;
  color: var(--muted-foreground);
  white-space: pre-wrap; word-break: break-word;
}

/* ── Copy button ── */
.copy-btn {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--border); border-radius: 0.375rem;
  background: transparent; color: var(--muted-foreground);
  font-size: 0.6875rem; font-family: inherit; cursor: pointer;
  transition: all 0.12s;
}
.copy-btn:hover { background: var(--accent); color: var(--accent-foreground); }
.copy-btn--done {
  color: oklch(0.6 0.15 150);
  border-color: color-mix(in oklch, oklch(0.6 0.15 150) 40%, transparent);
}
</style>