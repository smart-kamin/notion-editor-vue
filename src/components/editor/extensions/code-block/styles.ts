/**
 * Все стили code-block расширения живут здесь.
 * Инжектируются один раз в <head> — без зависимости от DocEditor.
 * Используют shadcn CSS-переменные, поэтому работают в light и dark режиме.
 */

const STYLE_ID = 'ed-code-block-styles'

export function injectCodeBlockStyles(): void {
  if (typeof document === 'undefined') return

  // Обновляем существующий элемент вместо пропуска —
  // при Vite HMR старый <style> остаётся в DOM, новые стили иначе не применяются.
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }
  style.textContent = `

/* ── Обёртка ──────────────────────────────────────────────────────────────── */
.ed-code-block {
  position: relative;
  margin: 1rem 0;
  border-radius: var(--radius-md, 0.5rem);
  border: 0.0625rem solid var(--border);
  background: color-mix(in oklch, var(--muted) 10%, transparent);
  overflow: visible;
  font-family: 'Monaspace Neon', 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}

.dark .ed-code-block {
  background: oklch(0.145 0.004 240 / 0.1);
}

/* ── Иконка на рамке ──────────────────────────────────────────────────────── */
.ed-code-block__icon {
  position: absolute;
  top: 0;
  left: 1rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0.2rem;
  border-radius: 9999px;
  background: var(--background);
  color: var(--muted-foreground);
  border: 0.0625rem solid var(--border);
}

.ed-code-block__icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 1.5;
}

/* ── Оверлей ──────────────────────────────────────────────────────────────── */
.ed-code-block__overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.ed-code-block:hover .ed-code-block__overlay {
  opacity: 1;
  pointer-events: auto;
}

/* ── Badge языка ──────────────────────────────────────────────────────────── */
.ed-code-block__lang-badge {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--muted-foreground);
  font-family: inherit;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm, 0.25rem);
  background: color-mix(in oklch, var(--background) 80%, transparent);
  border: 0.0625rem solid var(--border);
  line-height: 1.4;
  user-select: none;
  backdrop-filter: blur(4px);
}

/* ── Кнопка карандаша ─────────────────────────────────────────────────────── */
.ed-code-block__edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0.0625rem solid var(--border);
  border-radius: var(--radius-sm, 0.25rem);
  background: color-mix(in oklch, var(--background) 80%, transparent);
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.12s, background 0.12s, border-color 0.12s;
  backdrop-filter: blur(4px);
}

.ed-code-block__edit-btn:hover {
  color: var(--foreground);
  background: var(--background);
  border-color: color-mix(in oklch, var(--border) 70%, var(--foreground));
}

/* ── Кнопка копирования ───────────────────────────────────────────────────── */
.ed-code-block__copy-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.45rem;
  border: 0.0625rem solid var(--border);
  border-radius: var(--radius-sm, 0.25rem);
  background: color-mix(in oklch, var(--background) 80%, transparent);
  color: var(--muted-foreground);
  font-size: 0.6875rem;
  font-family: inherit;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.12s, background 0.12s, border-color 0.12s;
  backdrop-filter: blur(4px);
}

.ed-code-block__copy-btn:hover {
  color: var(--foreground);
  background: var(--background);
  border-color: color-mix(in oklch, var(--border) 70%, var(--foreground));
}

/* ── Collapse body ────────────────────────────────────────────────────────── */
.ed-code-block__body {
  position: relative;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Fade при свёрнутом состоянии ─────────────────────────────────────────── */
.ed-code-block__fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in oklch, var(--muted) 10%, var(--background))
  );
  pointer-events: none;
  border-radius: 0 0 var(--radius-md, 0.5rem) var(--radius-md, 0.5rem);
}

.dark .ed-code-block__fade {
  background: linear-gradient(to bottom, transparent, oklch(0.145 0.004 240));
}

/* ── Кнопка свернуть/развернуть ──────────────────────────────────────────── */
/*
  Точно повторяет .ed-blockquote__toggle.
  font-family явно НЕ inherit: родитель .ed-code-block задаёт monospace,
  inherit его и подхватил бы. Указываем sans-serif напрямую.
  box-sizing: border-box + width: 100% — граница идёт от края до края.
*/
.ed-code-block__toggle {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: calc(100% - 2rem);
  margin: 0.5rem 1rem 0;
  padding: 0.5rem 0 0.625rem;
  border: none;
  border-top: 0.0625rem solid var(--border);
  background: none;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-style: normal;
  cursor: pointer;
  transition: color 0.15s;
  user-select: none;
}

.ed-code-block__toggle:hover {
  color: var(--foreground);
}

/* ── CodeMirror контейнер ─────────────────────────────────────────────────── */
.ed-code-block__cm {
  padding: 1rem 1rem 0.875rem;
  overflow-x: auto;
}

.ed-code-block .cm-editor {
  background: transparent !important;
}

.ed-code-block .cm-focused {
  outline: none !important;
}

.ed-code-block .cm-scroller {
  overflow: visible;
}

.ed-code-block .cm-content {
  white-space: pre-wrap;
  word-break: break-word;
}

/* Placeholder не должен пробиваться в CM */
.ed-code-block .is-empty::before {
  display: none !important;
}


/* ── Lang picker — точная копия shadcn <Command> ──────────────────────────── */

.ed-lang-picker {
  position: fixed;
  z-index: 9999;
  width: 14rem;
  overflow: hidden;
  border-radius: var(--radius-md, 0.5rem);
  border: 0.0625rem solid var(--border);
  background: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    0 0 0 0.0625rem oklch(0 0 0 / 0.04),
    0 4px 6px -1px oklch(0 0 0 / 0.08),
    0 10px 24px -4px oklch(0 0 0 / 0.08);
  display: flex;
  flex-direction: column;
}

.ed-lang-picker__search-wrap {
  display: flex;
  align-items: center;
  padding: 0 0.625rem;
  border-bottom: 0.0625rem solid var(--border);
}

.ed-lang-picker__search-icon {
  color: var(--muted-foreground);
  flex-shrink: 0;
  margin-right: 0.375rem;
}

.ed-lang-picker__search {
  flex: 1;
  padding: 0.625rem 0;
  border: none;
  background: transparent;
  color: var(--popover-foreground);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  min-width: 0;
}

.ed-lang-picker__search::placeholder {
  color: var(--muted-foreground);
}

.ed-lang-picker__list {
  max-height: 15rem;
  overflow-y: auto;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain;
}

.ed-lang-picker__group-label {
  padding: 0.375rem 0.5rem 0.25rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--muted-foreground);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ed-lang-picker__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border: none;
  border-radius: calc(var(--radius-md, 0.5rem) - 2px);
  background: transparent;
  color: var(--popover-foreground);
  font-size: 0.8125rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
  user-select: none;
}

.ed-lang-picker__item:hover,
.ed-lang-picker__item:focus-visible {
  background: var(--accent);
  color: var(--accent-foreground);
  outline: none;
}

.ed-lang-picker__item--active {
  background: var(--accent);
  color: var(--accent-foreground);
  font-weight: 500;
}

.ed-lang-picker__item--active::after {
  content: '';
  margin-left: auto;
  width: 0.875rem;
  height: 0.875rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
}

.ed-lang-picker__item--auto {
  color: var(--muted-foreground);
  margin-bottom: 0.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 0.0625rem solid var(--border);
  border-radius: 0;
}

.ed-lang-picker__item--auto:hover {
  background: var(--accent);
  color: var(--accent-foreground);
  border-radius: calc(var(--radius-md, 0.5rem) - 2px);
  border-bottom-color: transparent;
}

`
}
