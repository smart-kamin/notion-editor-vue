/**
 * Якоря заголовков: slug из текста и оглавление документа.
 *
 * Зачем это здесь, а не в атрибутах ноды. Дедупликация («установка»,
 * «установка-2») требует знания ВСЕГО документа, а renderHTML у ноды видит
 * только себя — детерминированного slug'а в атрибутах не сделать в принципе.
 * Поэтому id ставится декорацией (см. extensions/heading), а оглавление
 * считается этой функцией — она проходит документ целиком и нумерует
 * повторы тем же алгоритмом, что и декорация. Один проход, один результат.
 *
 * Следствие, о котором надо знать: editor.getHTML() якорей НЕ содержит —
 * декорации в разметку не попадают. Экспорт HTML на них строить нельзя.
 */

/** Заголовок документа: уровень, текст и якорь. */
export interface Heading {
    level: 1 | 2 | 3
    text: string
    id: string
}

/**
 * Транслитерация кириллицы. Нужна не для работоспособности (getElementById
 * принимает любую строку), а для читаемости: «#ustanovka-servisa» в чате
 * читается, «#%D1%83%D1%81...» — нет.
 */
const TRANSLIT: Record<string, string> = {
    а: 'a',  б: 'b',  в: 'v',  г: 'g',  д: 'd',  е: 'e',  ё: 'e',  ж: 'zh',
    з: 'z',  и: 'i',  й: 'y',  к: 'k',  л: 'l',  м: 'm',  н: 'n',  о: 'o',
    п: 'p',  р: 'r',  с: 's',  т: 't',  у: 'u',  ф: 'f',  х: 'h',  ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '',  ы: 'y',  ь: '',   э: 'e',  ю: 'yu',
    я: 'ya',
}

/** Строка → слаг для якоря: латиница, цифры и дефис. */
export function slugify(text: string): string {
    const lower = text.toLowerCase().trim()
    let out = ''
    for (const char of lower) {
        if (char in TRANSLIT) out += TRANSLIT[char]
        else if (/[a-z0-9]/.test(char)) out += char
        else out += '-'
    }
    // Схлопываем подряд идущие дефисы и срезаем краевые: «а — б» не должно
    // превращаться в «a-----b».
    return out.replace(/-+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Присвоить якорь с учётом уже занятых: второй «Установка» станет
 * «ustanovka-2». Пустой заголовок получает позиционный якорь — без него два
 * пустых заголовка делили бы один id.
 */
export function anchorFor(text: string, taken: Map<string, number>): string {
    const base = slugify(text) || 'zagolovok'
    const seen = taken.get(base) ?? 0
    taken.set(base, seen + 1)
    return seen === 0 ? base : `${base}-${seen + 1}`
}

/** Плоский текст ноды документа (нужен и оглавлению, и декорации). */
function textOf(node: unknown): string {
    const candidate = node as { text?: string; content?: unknown[] }
    if (typeof candidate.text === 'string') return candidate.text
    if (Array.isArray(candidate.content)) return candidate.content.map(textOf).join('')
    return ''
}

interface DocLike {
    content?: unknown[]
    toJSON?: () => DocLike
}

/**
 * Оглавление документа: h1–h3 в порядке появления.
 *
 * Принимает и ProseMirror-Node (у него есть toJSON), и уже разобранный JSON —
 * чтобы одной функцией пользовались и плагин, и потребитель, у которого на
 * руках jsonb из базы.
 */
export function collectHeadings(doc: DocLike | null | undefined): Heading[] {
    if (!doc) return []
    const json = typeof doc.toJSON === 'function' ? doc.toJSON() : doc
    const taken = new Map<string, number>()
    const headings: Heading[] = []

    // Заголовки живут на верхнем уровне документа; глубже не спускаемся
    // намеренно — заголовок внутри таблицы или цитаты пунктом оглавления не
    // является, и декорация его тоже не размечает.
    for (const node of json.content ?? []) {
        const block = node as { type?: string; attrs?: { level?: number } }
        if (block.type !== 'heading') continue
        const level = block.attrs?.level
        if (level !== 1 && level !== 2 && level !== 3) continue
        const text = textOf(node)
        headings.push({ level, text, id: anchorFor(text, taken) })
    }
    return headings
}
