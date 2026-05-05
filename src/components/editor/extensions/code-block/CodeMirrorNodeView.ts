import {
  EditorView as CMEditorView,
  keymap,
  drawSelection,
  ViewUpdate,
} from '@codemirror/view'
import { EditorState, Compartment, Text as CMText } from '@codemirror/state'
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands'
import {
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  LanguageDescription,
  LanguageSupport,
} from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { languages } from '@codemirror/language-data'
import { Node as PMNode } from '@tiptap/pm/model'
import { EditorView as PMEditorView } from '@tiptap/pm/view'
import { TextSelection, Selection } from '@tiptap/pm/state'
import { exitCode } from '@tiptap/pm/commands'
import { undo as pmUndo, redo as pmRedo } from '@tiptap/pm/history'
import { shadcnTheme, shadcnHighlightStyle } from './theme'
import { lowlight } from './lowlight'
import { injectCodeBlockStyles } from './styles'

// ── Отображаемые имена языков ──────────────────────────────────────────────────

const LANG_ALIASES: Record<string, string> = {
  js: 'javascript', ts: 'typescript', jsx: 'jsx', tsx: 'tsx',
  py: 'python', rb: 'ruby', rs: 'rust', sh: 'shell', bash: 'shell',
  zsh: 'shell', yml: 'yaml', md: 'markdown', kt: 'kotlin', cs: 'csharp',
}

const DISPLAY_NAMES: Record<string, string> = {
  javascript: 'JavaScript', typescript: 'TypeScript',
  jsx: 'JSX', tsx: 'TSX', vue: 'Vue',
  python: 'Python', ruby: 'Ruby', rust: 'Rust',
  go: 'Go', java: 'Java', csharp: 'C#', cpp: 'C++', c: 'C',
  php: 'PHP', swift: 'Swift', kotlin: 'Kotlin',
  shell: 'Shell', bash: 'Bash', sql: 'SQL',
  html: 'HTML', css: 'CSS', scss: 'SCSS', less: 'Less',
  json: 'JSON', yaml: 'YAML', toml: 'TOML', xml: 'XML',
  markdown: 'Markdown', graphql: 'GraphQL', dockerfile: 'Dockerfile',
}

// ── SVG-иконки (inline, без lucide) ───────────────────────────────────────────

const CODE2_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`

const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`

const PENCIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`

/** Все языки доступные для ручного выбора */
const ALL_LANGUAGES: { lang: string; label: string }[] = [
  { lang: 'javascript', label: 'JavaScript' },
  { lang: 'typescript', label: 'TypeScript' },
  { lang: 'jsx',        label: 'JSX' },
  { lang: 'tsx',        label: 'TSX' },
  { lang: 'vue',        label: 'Vue' },
  { lang: 'python',     label: 'Python' },
  { lang: 'ruby',       label: 'Ruby' },
  { lang: 'rust',       label: 'Rust' },
  { lang: 'go',         label: 'Go' },
  { lang: 'java',       label: 'Java' },
  { lang: 'kotlin',     label: 'Kotlin' },
  { lang: 'swift',      label: 'Swift' },
  { lang: 'csharp',     label: 'C#' },
  { lang: 'cpp',        label: 'C++' },
  { lang: 'c',          label: 'C' },
  { lang: 'php',        label: 'PHP' },
  { lang: 'scala',      label: 'Scala' },
  { lang: 'dart',       label: 'Dart' },
  { lang: 'elixir',     label: 'Elixir' },
  { lang: 'haskell',    label: 'Haskell' },
  { lang: 'lua',        label: 'Lua' },
  { lang: 'perl',       label: 'Perl' },
  { lang: 'r',          label: 'R' },
  { lang: 'shell',      label: 'Shell' },
  { lang: 'bash',       label: 'Bash' },
  { lang: 'powershell', label: 'PowerShell' },
  { lang: 'sql',        label: 'SQL' },
  { lang: 'html',       label: 'HTML' },
  { lang: 'css',        label: 'CSS' },
  { lang: 'scss',       label: 'SCSS' },
  { lang: 'less',       label: 'Less' },
  { lang: 'json',       label: 'JSON' },
  { lang: 'yaml',       label: 'YAML' },
  { lang: 'toml',       label: 'TOML' },
  { lang: 'xml',        label: 'XML' },
  { lang: 'markdown',   label: 'Markdown' },
  { lang: 'graphql',    label: 'GraphQL' },
  { lang: 'dockerfile', label: 'Dockerfile' },
]

// ── NodeView ───────────────────────────────────────────────────────────────────

export class CodeMirrorNodeView {
  node: PMNode
  view: PMEditorView
  getPos: () => number

  dom: HTMLElement
  cm: CMEditorView

  private langConf = new Compartment()
  private updating = false

  private langBadge: HTMLElement
  private copyBtn: HTMLButtonElement
  private editBtn: HTMLButtonElement
  private picker: HTMLElement | null = null
  private copyTimer: ReturnType<typeof setTimeout> | null = null

  private currentLang: string | null = null
  private detectTimer: ReturnType<typeof setTimeout> | null = null

  // ── Collapse ──────────────────────────────────────────────────────────────
  private static readonly COLLAPSE_LINES   = 10
  private static readonly COLLAPSED_HEIGHT = '17rem'

  private collapseBody: HTMLElement
  private collapseBtn:  HTMLButtonElement
  private fadeEl:       HTMLElement
  private isCollapsed   = false

  constructor(node: PMNode, view: PMEditorView, getPos: () => number) {
    this.node    = node
    this.view    = view
    this.getPos  = getPos
    injectCodeBlockStyles()

    // ── Внешняя обёртка ───────────────────────────────────────────────────────
    this.dom = document.createElement('div')
    this.dom.className = 'ed-code-block'

    // ── Иконка на рамке ───────────────────────────────────────────────────────
    const icon = document.createElement('span')
    icon.className = 'ed-code-block__icon'
    icon.setAttribute('contenteditable', 'false')
    icon.setAttribute('aria-hidden', 'true')
    icon.innerHTML = CODE2_SVG
    this.dom.appendChild(icon)

    // ── Оверлей (badge + copy) ────────────────────────────────────────────────
    const overlay = document.createElement('div')
    overlay.className = 'ed-code-block__overlay'
    overlay.setAttribute('contenteditable', 'false')

    this.langBadge = document.createElement('span')
    this.langBadge.className = 'ed-code-block__lang-badge'
    this.langBadge.style.display = 'none'
    overlay.appendChild(this.langBadge)

    this.editBtn = document.createElement('button')
    this.editBtn.className = 'ed-code-block__edit-btn'
    this.editBtn.type = 'button'
    this.editBtn.title = 'Выбрать язык'
    this.editBtn.innerHTML = PENCIL_SVG
    this.editBtn.addEventListener('mousedown', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.togglePicker()
    })
    overlay.appendChild(this.editBtn)

    this.copyBtn = document.createElement('button')
    this.copyBtn.className = 'ed-code-block__copy-btn'
    this.copyBtn.type = 'button'
    this.setCopyIdle()
    this.copyBtn.addEventListener('mousedown', (e) => {
      e.preventDefault()
      this.handleCopy()
    })
    overlay.appendChild(this.copyBtn)

    this.dom.appendChild(overlay)

    // ── Collapse body ─────────────────────────────────────────────────────────
    this.collapseBody = document.createElement('div')
    this.collapseBody.className = 'ed-code-block__body'

    // ── CM контейнер ─────────────────────────────────────────────────────────
    const cmWrap = document.createElement('div')
    cmWrap.className = 'ed-code-block__cm'
    this.collapseBody.appendChild(cmWrap)

    // ── Fade ──────────────────────────────────────────────────────────────────
    this.fadeEl = document.createElement('div')
    this.fadeEl.className = 'ed-code-block__fade'
    this.fadeEl.setAttribute('contenteditable', 'false')
    this.collapseBody.appendChild(this.fadeEl)

    this.dom.appendChild(this.collapseBody)

    // ── Toggle button ─────────────────────────────────────────────────────────
    this.collapseBtn = document.createElement('button')
    this.collapseBtn.className = 'ed-code-block__toggle'
    this.collapseBtn.type = 'button'
    this.collapseBtn.setAttribute('contenteditable', 'false')
    this.collapseBtn.addEventListener('mousedown', (e) => {
      e.preventDefault()
      this.toggleCollapse()
    })
    this.dom.appendChild(this.collapseBtn)

    // ── Начальное состояние collapse (до монтирования — без анимации) ─────────
    const initLines = node.textContent ? node.textContent.split('\n').length : 1
    this.isCollapsed = initLines > CodeMirrorNodeView.COLLAPSE_LINES
    if (this.isCollapsed) {
      this.collapseBody.style.height   = CodeMirrorNodeView.COLLAPSED_HEIGHT
      this.collapseBody.style.overflow = 'hidden'
    } else {
      this.fadeEl.style.display = 'none'
    }
    this.collapseBtn.style.display = this.isCollapsed ? '' : 'none'
    this.renderCollapseBtn()

    // ── CodeMirror ────────────────────────────────────────────────────────────
    this.cm = new CMEditorView({
      state: EditorState.create({
        doc: node.textContent,
        extensions: [
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          syntaxHighlighting(shadcnHighlightStyle, { fallback: true }),
          shadcnTheme,
          this.langConf.of([]),
          keymap.of([
            ...this.buildKeymap(),
            indentWithTab,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          CMEditorView.updateListener.of(u => this.forwardUpdate(u)),
        ],
      }),
      parent: cmWrap,
    })

    setTimeout(() => this.applyLanguage(node.attrs.language, node.textContent), 0)
  }

  // ── Определение языка ─────────────────────────────────────────────────────

  private normalizeLangName(raw: string): string {
    const lower = raw.toLowerCase()
    return LANG_ALIASES[lower] ?? lower
  }

  private displayName(lang: string): string {
    return DISPLAY_NAMES[lang.toLowerCase()] ?? lang
  }

  private updateBadge(lang: string | null) {
    if (lang) {
      this.langBadge.textContent = this.displayName(lang)
      this.langBadge.style.display = 'inline'
    } else {
      this.langBadge.textContent = ''
      this.langBadge.style.display = 'none'
    }
  }

  private applyLanguage(attrLang: string | null, code: string) {
    const langName = attrLang
      ? this.normalizeLangName(attrLang)
      : this.detectLang(code)

    if (langName === this.currentLang) return
    this.currentLang = langName
    this.updateBadge(langName)

    if (!langName) {
      this.cm.dispatch({ effects: this.langConf.reconfigure([]) })
      return
    }

    const desc = LanguageDescription.matchLanguageName(languages, langName, true)
    if (!desc) {
      this.cm.dispatch({ effects: this.langConf.reconfigure([]) })
      return
    }

    desc.load().then((lang: LanguageSupport) => {
      this.cm.dispatch({ effects: this.langConf.reconfigure(lang) })
    }).catch(() => {
      this.cm.dispatch({ effects: this.langConf.reconfigure([]) })
    })
  }

  private detectLang(code: string): string | null {
    if (!code || code.trim().length < 20) return null

    const SUBSET = [
      'javascript', 'typescript', 'python', 'java', 'c', 'cpp',
      'csharp', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
      'scala', 'r', 'perl', 'lua', 'dart', 'elixir', 'haskell',
      'shell', 'bash', 'powershell',
      'html', 'xml', 'css', 'scss',
      'json', 'yaml', 'toml', 'sql',
      'markdown', 'graphql', 'dockerfile',
    ]

    try {
      const result = lowlight.highlightAuto(code, { subset: SUBSET })
      return result.data?.language ?? null
    } catch {
      return null
    }
  }

  private scheduleDetect(code: string) {
    if (this.detectTimer) clearTimeout(this.detectTimer)
    this.detectTimer = setTimeout(() => {
      if (!this.node.attrs.language) {
        this.applyLanguage(null, code)
      }
    }, 600)
  }

  // ── PM → CM sync ──────────────────────────────────────────────────────────

  update(node: PMNode): boolean {
    if (node.type !== this.node.type) return false
    this.node = node
    if (this.updating) return true

    const newText = node.textContent
    const curText = this.cm.state.doc.toString()

    if (newText !== curText) {
      let start = 0
      let curEnd = curText.length
      let newEnd = newText.length
      while (start < curEnd && curText[start] === newText[start]) start++
      while (curEnd > start && newEnd > start && curText[curEnd - 1] === newText[newEnd - 1]) {
        curEnd--; newEnd--
      }
      this.updating = true
      this.cm.dispatch({
        changes: { from: start, to: curEnd, insert: newText.slice(start, newEnd) },
      })
      this.updating = false
    }

    this.applyLanguage(node.attrs.language, node.textContent)
    this.syncCollapseState(newText)

    return true
  }

  // ── CM → PM sync ──────────────────────────────────────────────────────────

  private forwardUpdate(update: ViewUpdate) {
    if (this.updating || !this.cm.hasFocus) return

    let offset = this.getPos() + 1
    const { main } = update.state.selection
    const selFrom = offset + main.from
    const selTo   = offset + main.to
    const pmSel   = this.view.state.selection

    if (update.docChanged || pmSel.from !== selFrom || pmSel.to !== selTo) {
      const tr = this.view.state.tr

      if (update.docChanged) {
        update.changes.iterChanges((fromA: number, toA: number, fromB: number, toB: number, text: CMText) => {
          if (text.length) {
            tr.replaceWith(
              offset + fromA,
              offset + toA,
              this.view.state.schema.text(text.toString()),
            )
          } else {
            tr.delete(offset + fromA, offset + toA)
          }
          offset += (toB - fromB) - (toA - fromA)
        })

        if (!this.node.attrs.language) {
          this.scheduleDetect(update.state.doc.toString())
        }
      }

      tr.setSelection(TextSelection.create(tr.doc, selFrom, selTo))
      this.view.dispatch(tr)
    }
  }

  // ── Selection (PM → CM) ───────────────────────────────────────────────────

  setSelection(anchor: number, head: number) {
    this.cm.focus()
    this.updating = true
    this.cm.dispatch({ selection: { anchor, head } })
    this.updating = false
  }

  selectNode() { this.cm.focus() }

  stopEvent() { return true }

  // ── Keymap ────────────────────────────────────────────────────────────────

  private buildKeymap() {
    return [
      { key: 'ArrowUp',    run: () => this.maybeEscape('line', -1) },
      { key: 'ArrowLeft',  run: () => this.maybeEscape('char', -1) },
      { key: 'ArrowDown',  run: () => this.maybeEscape('line',  1) },
      { key: 'ArrowRight', run: () => this.maybeEscape('char',  1) },

      {
        key: 'Ctrl-Enter',
        run: () => {
          if (exitCode(this.view.state, this.view.dispatch)) {
            this.view.focus(); return true
          }
          return false
        },
      },

      {
        key: 'Backspace',
        run: (cmView: CMEditorView) => {
          if (cmView.state.doc.length === 0) {
            const pos = this.getPos()
            this.view.dispatch(
              this.view.state.tr.delete(pos, pos + this.node.nodeSize),
            )
            this.view.focus()
            return true
          }
          return false
        },
      },

      { key: 'Ctrl-z', mac: 'Cmd-z',
        run: () => { pmUndo(this.view.state, this.view.dispatch); return true } },
      { key: 'Shift-Ctrl-z', mac: 'Shift-Cmd-z',
        run: () => { pmRedo(this.view.state, this.view.dispatch); return true } },
      { key: 'Ctrl-y', mac: 'Cmd-y',
        run: () => { pmRedo(this.view.state, this.view.dispatch); return true } },
    ]
  }

  private maybeEscape(unit: 'line' | 'char', dir: -1 | 1): boolean {
    const { state } = this.cm
    const { main }  = state.selection
    if (!main.empty) return false

    if (unit === 'line') {
      const line = state.doc.lineAt(main.head)
      if (dir < 0 ? line.from > 0 : line.to < state.doc.length) return false
    } else {
      if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false
    }

    const targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize)
    const selection = Selection.near(this.view.state.doc.resolve(targetPos), dir)
    this.view.dispatch(this.view.state.tr.setSelection(selection).scrollIntoView())
    this.view.focus()
    return true
  }

  // ── Copy ──────────────────────────────────────────────────────────────────

  private setCopyIdle() {
    this.copyBtn.innerHTML = `${COPY_SVG}<span>Копировать</span>`
  }

  private setCopied() {
    this.copyBtn.innerHTML = `${CHECK_SVG}<span>Скопировано</span>`
  }

  private async handleCopy() {
    try {
      await navigator.clipboard.writeText(this.node.textContent)
    } catch {
      const el = document.createElement('textarea')
      el.value = this.node.textContent
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    this.setCopied()
    if (this.copyTimer) clearTimeout(this.copyTimer)
    this.copyTimer = setTimeout(() => this.setCopyIdle(), 2000)
  }

  // ── Collapse ──────────────────────────────────────────────────────────────

  /**
   * Вызывается из update() при каждом изменении контента.
   * Синхронизирует видимость кнопки и корректирует высоту если:
   * - код стал короче порога (сброс)
   * - код свёрнут, но контент уже меньше COLLAPSED_HEIGHT (убираем лишний пустой отступ)
   */
  private syncCollapseState(text: string) {
    const lines  = text ? text.split('\n').length : 1
    const isLong = lines > CodeMirrorNodeView.COLLAPSE_LINES

    this.collapseBtn.style.display = isLong ? '' : 'none'

    if (this.isCollapsed) {
      if (!isLong) {
        // Код стал коротким — полностью сбрасываем коллапс без анимации
        this.collapseBody.style.transition = 'none'
        this.collapseBody.style.height     = ''
        this.collapseBody.style.overflow   = ''
        this.fadeEl.style.display          = 'none'
        this.isCollapsed                   = false
        // Восстанавливаем transition после сброса
        requestAnimationFrame(() => {
          this.collapseBody.style.transition = ''
        })
      } else {
        // Код ещё длинный, но мог уменьшиться ниже COLLAPSED_HEIGHT —
        // подгоняем высоту под реальный контент чтобы не было пустого места
        const naturalH   = this.collapseBody.scrollHeight
        const collapsedH = this.collapseBody.offsetHeight  // px из '17rem'
        if (naturalH < collapsedH) {
          this.collapseBody.style.transition = 'none'
          this.collapseBody.style.height     = naturalH + 'px'
          this.fadeEl.style.display          = 'none'
          requestAnimationFrame(() => {
            this.collapseBody.style.transition = ''
          })
        }
      }
    }
  }

  private toggleCollapse() {
    const el     = this.collapseBody
    const isNowCollapsed = this.isCollapsed

    if (isNowCollapsed) {
      // ── Раскрываем ────────────────────────────────────────────────────────
      // Текущая высота — фиксированный px (COLLAPSED_HEIGHT или naturalH).
      // Анимируем до scrollHeight.
      const targetH = el.scrollHeight + 'px'
      el.style.height = targetH
      this.fadeEl.style.display = 'none'
      el.addEventListener('transitionend', () => {
        el.style.height   = 'auto'
        el.style.overflow = ''
      }, { once: true })
    } else {
      // ── Сворачиваем ───────────────────────────────────────────────────────
      // height: auto → CSS не может транзишнить от auto.
      // Фиксируем текущую computed высоту → force reflow → анимируем вниз.
      el.style.height   = el.scrollHeight + 'px'
      el.style.overflow = 'hidden'
      void el.offsetHeight  // КРИТИЧНО: flush layout, иначе браузер батчит оба изменения
      requestAnimationFrame(() => {
        el.style.height = CodeMirrorNodeView.COLLAPSED_HEIGHT
        el.addEventListener('transitionend', () => {
          // Показываем fade только после завершения анимации
          this.fadeEl.style.display = ''
        }, { once: true })
      })
    }

    this.isCollapsed = !isNowCollapsed
    this.renderCollapseBtn()
  }

  private renderCollapseBtn() {
    const rot = this.isCollapsed ? '0deg' : '180deg'
    this.collapseBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"
           style="transform:rotate(${rot});transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);flex-shrink:0">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      <span>${this.isCollapsed ? 'Показать полностью' : 'Свернуть'}</span>
    `
  }

  // ── Language picker ───────────────────────────────────────────────────────

  private togglePicker() {
    if (this.picker) { this.closePicker(); return }
    this.openPicker()
  }

  private openPicker() {
    const picker = document.createElement('div')
    picker.className = 'ed-lang-picker'
    this.picker = picker

    const searchWrap = document.createElement('div')
    searchWrap.className = 'ed-lang-picker__search-wrap'

    const searchIcon = document.createElement('span')
    searchIcon.className = 'ed-lang-picker__search-icon'
    searchIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`

    const search = document.createElement('input')
    search.className = 'ed-lang-picker__search'
    search.type = 'text'
    search.placeholder = 'Поиск языка...'
    search.setAttribute('spellcheck', 'false')

    searchWrap.appendChild(searchIcon)
    searchWrap.appendChild(search)
    picker.appendChild(searchWrap)

    const list = document.createElement('div')
    list.className = 'ed-lang-picker__list'
    picker.appendChild(list)

    const renderList = (filter: string) => {
      list.innerHTML = ''
      const q = filter.toLowerCase()

      const autoItem = document.createElement('button')
      autoItem.className = 'ed-lang-picker__item ed-lang-picker__item--auto'
      autoItem.type = 'button'
      autoItem.textContent = 'Авто-определение'
      if (!this.node.attrs.language) autoItem.classList.add('ed-lang-picker__item--active')
      autoItem.addEventListener('mousedown', (e) => { e.preventDefault(); this.setLanguage(null) })
      list.appendChild(autoItem)

      ALL_LANGUAGES
        .filter(({ label }) => !q || label.toLowerCase().includes(q))
        .forEach(({ lang, label }) => {
          const item = document.createElement('button')
          item.className = 'ed-lang-picker__item'
          item.type = 'button'
          item.textContent = label
          if (this.node.attrs.language === lang) item.classList.add('ed-lang-picker__item--active')
          item.addEventListener('mousedown', (e) => { e.preventDefault(); this.setLanguage(lang) })
          list.appendChild(item)
        })
    }

    renderList('')
    search.addEventListener('input', () => renderList(search.value))

    document.body.appendChild(picker)
    const btnRect = this.editBtn.getBoundingClientRect()
    const pickerH = picker.getBoundingClientRect().height
    const pickerW = picker.getBoundingClientRect().width

    let top  = btnRect.bottom + 6
    let left = btnRect.right - pickerW

    if (left < 8) left = 8
    if (top + pickerH > window.innerHeight - 8) top = btnRect.top - pickerH - 6

    picker.style.top  = `${top}px`
    picker.style.left = `${left}px`

    const onOutside = (e: MouseEvent) => {
      if (!picker.contains(e.target as Node) && e.target !== this.editBtn) {
        this.closePicker()
        document.removeEventListener('mousedown', onOutside)
        document.removeEventListener('keydown', onEscape)
      }
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closePicker()
        document.removeEventListener('mousedown', onOutside)
        document.removeEventListener('keydown', onEscape)
      }
    }
    setTimeout(() => {
      document.addEventListener('mousedown', onOutside)
      document.addEventListener('keydown', onEscape)
      search.focus()
    }, 50)
  }

  private closePicker() {
    this.picker?.remove()
    this.picker = null
  }

  private setLanguage(lang: string | null) {
    const pos = this.getPos()
    const tr  = this.view.state.tr.setNodeMarkup(
      pos, undefined, { ...this.node.attrs, language: lang },
    )
    this.view.dispatch(tr)
    this.closePicker()

    if (lang) {
      this.currentLang = lang
      this.updateBadge(lang)
      this.applyLanguage(lang, this.node.textContent)
    } else {
      this.currentLang = null
      this.updateBadge(null)
      this.scheduleDetect(this.node.textContent)
    }
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────

  destroy() {
    if (this.copyTimer)   clearTimeout(this.copyTimer)
    if (this.detectTimer) clearTimeout(this.detectTimer)
    this.closePicker()
    this.cm.destroy()
  }
}
