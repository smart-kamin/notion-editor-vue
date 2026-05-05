// ── Главный компонент ─────────────────────────────────────────────────────────
export { default as DocEditor } from './components/editor/DocEditor.vue'
export type { OutputFormat }    from './components/editor/DocEditor.vue'

// ── Расширения (для кастомной сборки) ────────────────────────────────────────
export { blockquoteExtension }                         from './components/editor/extensions/blockquote'
export { codeBlockExtension }                          from './components/editor/extensions/code-block'
export { dragHandleExtension, dragHandleState }        from './components/editor/extensions/drag-handle'
export { imageExtension }                              from './components/editor/extensions/image'
export { linkExtension }                               from './components/editor/extensions/link'
export { slashMenuExtension, slashState, SLASH_ITEMS } from './components/editor/extensions/slash-menu'
export { tableExtensions }                             from './components/editor/extensions/table'

// ── Типы ──────────────────────────────────────────────────────────────────────
export type { SlashItem } from './components/editor/extensions/slash-menu'