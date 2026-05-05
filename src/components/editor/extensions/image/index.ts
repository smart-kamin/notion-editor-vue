import { Image } from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageView from './ImageView.vue'

export const imageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: el => el.getAttribute('width') ? Number(el.getAttribute('width')) : null,
        renderHTML: attrs => attrs.width ? { width: attrs.width } : {},
      },
      align: {
        default: 'center',
        parseHTML: el => el.getAttribute('data-align') ?? 'center',
        renderHTML: attrs => ({ 'data-align': attrs.align }),
      },
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageView as any)
  },
}).configure({ inline: false })
