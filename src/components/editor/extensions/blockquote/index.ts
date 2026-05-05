import { Blockquote } from '@tiptap/extension-blockquote'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import BlockquoteView from './BlockquoteView.vue'

export const blockquoteExtension = Blockquote.extend({
  /**
   * Ctrl+A / Cmd+A внутри цитаты — выделяем только её содержимое.
   * addKeyboardShortcuts перехватывает до PM-обработчика, returning true блокирует дефолт.
   */
  addKeyboardShortcuts() {
    return {
      'Mod-a': ({ editor }) => {
        const { state } = editor
        const $pos = state.doc.resolve(state.selection.from)

        for (let d = $pos.depth; d >= 0; d--) {
          if ($pos.node(d).type.name === 'blockquote') {
            editor.commands.setTextSelection({
              from: $pos.start(d),
              to:   $pos.end(d),
            })
            return true
          }
        }

        return false
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(BlockquoteView)
  },
})
