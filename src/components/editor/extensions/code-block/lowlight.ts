import { createLowlight, all } from 'lowlight'

/**
 * Единый инстанс lowlight со всеми языками highlight.js.
 * Вынесен отдельно, чтобы избежать circular import между index.ts и CodeBlockView.vue.
 */
export const lowlight = createLowlight(all)
