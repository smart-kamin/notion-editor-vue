import { EditorView } from '@codemirror/view'
import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

/**
 * CodeMirror тема в shadcn-стилистике.
 * Использует CSS-переменные shadcn — работает в light и dark режиме автоматически.
 */
export const shadcnTheme = EditorView.theme({
  '&': {
    background: 'transparent',
    color: 'var(--foreground)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-scroller': {
    fontFamily: "'Monaspace Neon', 'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
    fontSize: '0.8125rem',
    lineHeight: '1.7',
    fontFeatureSettings: "'calt' 1, 'liga' 1, 'ss01' 1, 'ss02' 1",
  },
  '.cm-content': {
    padding: '0',
    caretColor: 'var(--foreground)',
  },
  '.cm-line': {
    padding: '0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--foreground)',
  },
  '.cm-selectionBackground': {
    background: 'color-mix(in oklch, var(--primary) 18%, transparent)',
  },
  '&.cm-focused .cm-selectionBackground': {
    background: 'color-mix(in oklch, var(--primary) 25%, transparent)',
  },
  '.cm-selectionMatch': {
    background: 'color-mix(in oklch, var(--primary) 12%, transparent)',
  },
  '.cm-matchingBracket, .cm-nonmatchingBracket': {
    background: 'color-mix(in oklch, var(--primary) 15%, transparent)',
    outline: 'none',
  },
  '.cm-gutters': {
    display: 'none',
  },
  '.cm-activeLine': {
    background: 'transparent',
  },
  '.cm-tooltip': {
    background: 'var(--popover)',
    border: '0.0625rem solid var(--border)',
    borderRadius: 'var(--radius-sm, 0.25rem)',
    color: 'var(--popover-foreground)',
  },
  '.cm-tooltip .cm-completionLabel': {
    color: 'var(--foreground)',
  },
})

/**
 * Подсветка синтаксиса — те же oklch-цвета, что были в hljs-теме,
 * но через lezer tags (нативный механизм CodeMirror 6).
 */
export const shadcnHighlightStyle = HighlightStyle.define([
  // Ключевые слова: if, for, return, const, class…
  { tag: [tags.keyword, tags.modifier], color: 'oklch(0.6 0.15 290)' },
  // Встроенные: console, Math, Array…
  { tag: [tags.standard(tags.name), tags.bool, tags.null, tags.self], color: 'oklch(0.6 0.15 290)' },
  // Строки и шаблонные литералы
  { tag: [tags.string, tags.special(tags.string)], color: 'oklch(0.62 0.14 150)' },
  // Числа
  { tag: tags.number, color: 'oklch(0.65 0.14 55)' },
  // Комментарии
  { tag: [tags.comment, tags.blockComment, tags.lineComment], color: 'var(--muted-foreground)', fontStyle: 'italic' },
  // Имена функций и классов
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'oklch(0.65 0.15 220)' },
  { tag: [tags.definition(tags.name), tags.className], color: 'oklch(0.65 0.15 220)' },
  // Атрибуты и свойства
  { tag: [tags.attributeName, tags.attributeValue], color: 'oklch(0.6 0.13 20)' },
  { tag: tags.propertyName, color: 'oklch(0.6 0.13 20)' },
  // Операторы и пунктуация
  { tag: [tags.operator, tags.punctuation], color: 'var(--muted-foreground)' },
  // HTML/JSX теги
  { tag: tags.tagName, color: 'oklch(0.6 0.15 290)' },
  // Регулярные выражения
  { tag: tags.regexp, color: 'oklch(0.62 0.14 150)' },
  // Meta: import, #pragma
  { tag: tags.meta, color: 'oklch(0.58 0.12 240)' },
  // Типы TypeScript
  { tag: tags.typeName, color: 'oklch(0.65 0.14 55)' },
  // Diff
  { tag: tags.inserted, color: 'oklch(0.58 0.16 150)', background: 'oklch(0.58 0.16 150 / 0.1)' },
  { tag: tags.deleted, color: 'oklch(0.55 0.18 20)', background: 'oklch(0.55 0.18 20 / 0.1)' },
  // Заголовки (Markdown)
  { tag: tags.heading, color: 'var(--foreground)', fontWeight: 'bold' },
])
