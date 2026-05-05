import { CodeBlock } from '@tiptap/extension-code-block'
import { CodeMirrorNodeView } from './CodeMirrorNodeView'
import type { NodeViewRendererProps } from '@tiptap/core'

/**
 * Блок кода с CodeMirror 6 внутри TipTap NodeView.
 *
 * CodeMirror полностью управляет редактированием внутри блока:
 * - Подсветка синтаксиса через @codemirror/language-data (150+ языков, ленивая загрузка)
 * - Авто-детект языка через lowlight.highlightAuto
 * - Правильный Backspace, стрелки, undo/redo — всё делегируется в нужный редактор
 * - Никаких конфликтов транзакций ProseMirror
 */
export const codeBlockExtension = CodeBlock.extend({
  addNodeView() {
    return (props: NodeViewRendererProps) => {
      return new CodeMirrorNodeView(
        props.node,
        props.editor.view,
        props.getPos as () => number,
      )
    }
  },
}).configure({
  // Стрелки и Enter обрабатывает CodeMirror — отключаем TipTap-хендлеры
  exitOnTripleEnter: false,
  exitOnArrowDown: false,
})
