import { CodeBlock } from '@tiptap/extension-code-block'
import { CodeMirrorNodeView } from './CodeMirrorNodeView'
import type { Editor, NodeViewRendererProps } from '@tiptap/core'

/** Хранилище расширения: живые блоки кода этого редактора. */
export interface CodeBlockStorage {
  views: Set<CodeMirrorNodeView>
}

// Tiptap объявляет `interface Storage {}` пустым специально под declaration
// merging — так расширение типизирует свой ключ в editor.storage.
declare module '@tiptap/core' {
  interface Storage {
    codeBlock: CodeBlockStorage
  }
}

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
  /**
   * Живые блоки кода этого редактора.
   *
   * Нужны потому, что о переключении editable node view сам не узнаёт:
   * setEditable документ не меняет, реконсиляция ноду не трогает, update()
   * не зовётся — и блок кода остался бы редактируемым в режиме просмотра.
   * Поэтому редактор толкает их сам (syncCodeBlocksEditable ниже).
   *
   * Хранилище — на экземпляр редактора, а не модульное: на одной странице
   * может стоять и просмотр статьи, и её правка, и делить один список
   * значило бы переключать чужие блоки.
   */
  addStorage(): CodeBlockStorage {
    return { views: new Set<CodeMirrorNodeView>() }
  },

  addNodeView() {
    return (props: NodeViewRendererProps) => {
      return new CodeMirrorNodeView(
        props.node,
        props.editor.view,
        props.getPos as () => number,
        props.editor.storage.codeBlock?.views,
      )
    }
  },
}).configure({
  // Стрелки и Enter обрабатывает CodeMirror — отключаем TipTap-хендлеры
  exitOnTripleEnter: false,
  exitOnArrowDown: false,
})

/**
 * Подтянуть блоки кода к текущему режиму редактора.
 *
 * Зовётся после editor.setEditable(...) — см. докстринг addStorage выше о том,
 * почему без этого блок кода в просмотре остаётся редактируемым.
 */
export function syncCodeBlocksEditable(editor: Editor): void {
  editor.storage.codeBlock?.views?.forEach((view) => view.syncEditable())
}
