import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

import { anchorFor } from '../../anchors'

/**
 * Якоря у заголовков h1–h3: ставит каждому стабильный id.
 *
 * Нужно для оглавления и для ссылок «#anchor» внутри статьи.
 *
 * id ставится ДЕКОРАЦИЕЙ, а не атрибутом ноды, и это не вкусовщина:
 *
 *   * дедупликация повторяющихся заголовков требует знания всего документа, а
 *     renderHTML у ноды видит только себя;
 *   * документ остаётся чистым — фича не требует миграции сохранённого JSON;
 *   * переименовал заголовок — якорь и пункт оглавления поменялись
 *     одновременно, устаревший id не остался в базе навсегда.
 *
 * Цена, названная вслух: внешняя ссылка «#ustanovka» ломается при
 * переименовании заголовка (как в Confluence и Notion), а editor.getHTML()
 * якорей не содержит — декорации в разметку не попадают.
 *
 * Алгоритм нумерации повторов — общий с collectHeadings (anchors.ts:anchorFor),
 * поэтому оглавление и разметка не могут разъехаться.
 */
const HEADING_ANCHOR_KEY = new PluginKey('headingAnchor')

export const headingAnchorExtension = Extension.create({
    name: 'headingAnchor',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: HEADING_ANCHOR_KEY,
                props: {
                    decorations(state) {
                        const taken = new Map<string, number>()
                        const decorations: Decoration[] = []

                        // Только верхний уровень: заголовок внутри таблицы или
                        // цитаты пунктом оглавления не является, и размечать
                        // его якорем незачем (см. collectHeadings).
                        state.doc.forEach((node, offset) => {
                            if (node.type.name !== 'heading') return
                            const level = node.attrs.level
                            if (level !== 1 && level !== 2 && level !== 3) return
                            const id = anchorFor(node.textContent, taken)
                            decorations.push(
                                Decoration.node(offset, offset + node.nodeSize, { id }),
                            )
                        })

                        return DecorationSet.create(state.doc, decorations)
                    },
                },
            }),
        ]
    },
})
