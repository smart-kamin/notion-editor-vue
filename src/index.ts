// ── Главный компонент ─────────────────────────────────────────────────────────
export { default as DocEditor } from './components/editor/DocEditor.vue'
export type { OutputFormat }    from './components/editor/DocEditor.vue'

// ── Расширения (для кастомной сборки) ────────────────────────────────────────
export { blockquoteExtension }                         from './components/editor/extensions/blockquote'
export { codeBlockExtension, syncCodeBlocksEditable }   from './components/editor/extensions/code-block'
export { dragHandleExtension, dragHandleState }        from './components/editor/extensions/drag-handle'
export { imageExtension }                              from './components/editor/extensions/image'
export { linkExtension }                               from './components/editor/extensions/link'
export { slashMenuExtension, slashState, SLASH_ITEMS } from './components/editor/extensions/slash-menu'
export { tableExtensions }                             from './components/editor/extensions/table'
export { headingAnchorExtension }                      from './components/editor/extensions/heading'

// ── Якоря и оглавление ────────────────────────────────────────────────────────
// collectHeadings работает по JSON документа, а не по инстансу редактора:
// поэтому оглавление считается одинаково в просмотре и в правке и не требует
// монтирования. Алгоритм якорей общий с headingAnchorExtension.
export { collectHeadings, slugify, anchorFor } from './components/editor/anchors'

// ── Типы ──────────────────────────────────────────────────────────────────────
export type { SlashItem } from './components/editor/extensions/slash-menu'
export type { Heading }   from './components/editor/anchors'