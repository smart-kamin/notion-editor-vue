# @smart-kamin/notion-editor-vue

Notion-style rich text editor для Vue 3, построенный на базе Tiptap v3.

![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?logo=vue.js)
![Tiptap](https://img.shields.io/badge/Tiptap-3.x-6366f1)
![License](https://img.shields.io/badge/license-MIT-blue)

## Возможности

- **Slash-команды** — нажми `/` для вставки блоков: заголовки, списки, таблицы, изображения, цитаты, код
- **Bubble menu** — форматирование при выделении текста: жирный, курсив, подчёркивание, ссылки, выделение цветом, выравнивание
- **Drag & Drop блоков** — перетаскивание любого блока за иконку ручки
- **Блок кода** — CodeMirror 6 внутри: подсветка 150+ языков, авто-детект, кнопка копирования, collapse
- **Таблицы** — вставка, изменение размера колонок, контекстное меню управления строками/столбцами
- **Цитаты** — с выделением блока и `Ctrl+A` внутри цитаты
- **Изображения** — вставка по URL, выбор файла, paste скриншота, drag & drop файла, resize, выравнивание; аплоад на свой бэкенд через `onImageUpload`
- **Ссылки** — autolink, linkOnPaste, inline-редактор
- **Форматы вывода** — HTML, JSON, Markdown, plain text через `output-format`
- **Вставка Markdown** — автоматически конвертируется при paste
- **Режим просмотра** — `:editable="false"`: панели скрыты, документ не правится, выделение работает
- **Оглавление и якоря** — id у заголовков h1–h3 и `collectHeadings()` по JSON документа
- **Свои расширения** — проп `extensions` дописывает ноды и плагины потребителя к встроенным
- **Тёмная тема** — через CSS-переменные shadcn/oklch, работает автоматически

## Demo

**[→ Открыть демо](https://smart-kamin.github.io/notion-editor-vue/)**

Live-редактор с переключением форматов вывода (Markdown / HTML / JSON / Text) и тёмной темой.

---



```bash
pnpm add github:smart-kamin/notion-editor-vue#v0.2.0
```

Лучше пиннить на **коммит-SHA**, а не на тег: релизный workflow досылает
собранный `dist` отдельным коммитом и переставляет на него метку, то есть тег
указывает на разные коммиты до и после сборки.

```bash
pnpm add github:smart-kamin/notion-editor-vue#<40-символьный SHA>
```

Подключи стили в `main.ts`:

```ts
import { createApp } from 'vue'
import '@smart-kamin/notion-editor-vue/styles'
import App from './App.vue'

createApp(App).mount('#app')
```

---

## Использование

### Базовый пример

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DocEditor } from '@smart-kamin/notion-editor-vue'

const content = ref('')
</script>

<template>
  <DocEditor v-model="content" />
</template>
```

### Форматы вывода

```vue
<!-- HTML (по умолчанию) -->
<DocEditor v-model="content" />

<!-- JSON — рекомендуется для хранения в БД -->
<DocEditor v-model="content" output-format="json" />

<!-- Markdown — для LLM, git, API -->
<DocEditor v-model="content" output-format="markdown" />

<!-- Только текст — для поиска и превью -->
<DocEditor v-model="content" output-format="text" />
```

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `modelValue` | `string` | `''` | Содержимое редактора (v-model) |
| `outputFormat` | `'html' \| 'json' \| 'markdown' \| 'text'` | `'html'` | Формат значения в v-model |
| `editable` | `boolean` | `true` | `false` — режим просмотра |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Куда девать выбранный файл картинки |
| `extensions` | `AnyExtension[]` | — | Свои расширения Tiptap, дописываются к встроенным |

### Events

| Событие | Когда |
|---------|-------|
| `update:modelValue` | Содержимое изменилось |
| `imageUploadError` | `onImageUpload` бросил. Нода при этом **не** вставляется |
| `parseError` | `modelValue` не разобрался. Редактор открывается пустым, а не падает |

### Режим просмотра

```vue
<DocEditor :model-value="doc" output-format="json" :editable="false" />
```

Панели инструментов, слэш-меню и ручка перетаскивания скрыты, документ не
правится. **Выделение текста при этом остаётся живым** — намеренно: на нём
держатся сценарии вроде комментирования фрагмента.

Что продолжает работать в просмотре: сворачивание и копирование блока кода,
переходы по ссылкам, якоря заголовков.

`editable` переключается и на живом редакторе, но **состав расширений
фиксируется при создании**, поэтому просмотр и правку лучше держать разными
инстансами, а не переключать один.

### Загрузка картинок на свой бэкенд

```vue
<DocEditor
  v-model="content"
  output-format="json"
  :on-image-upload="upload"
  @image-upload-error="onUploadFailed"
/>
```

```ts
async function upload(file: File): Promise<string> {
  const { uid } = await api.uploadMedia(file)
  // ВАЖНО: вернуть СРАЗУ ОТОБРАЖАЕМЫЙ src — нода вставляется с ним как есть.
  // Если ваш адрес требует авторизации и потому не годится для <img src>,
  // верните blob-URL, а канонический адрес подставьте перед сохранением.
  return URL.createObjectURL(file)
}
```

Обработчик зовётся из всех трёх мест сразу: поповер вставки, вставка скриншота
из буфера (Ctrl+V) и перетаскивание файла в редактор. Пока файл грузится,
редактор показывает бейдж, а поповер блокирует кнопки.

**Без этого пропа поведение прежнее** — файл инлайнится в документ как base64
data URL. Для базы это плохо (документ раздувается до мегабайтов), но обратную
совместимость это сохраняет.

### Оглавление и якоря

Заголовкам h1–h3 автоматически проставляются `id`, а оглавление считается
чистой функцией по JSON документа:

```ts
import { collectHeadings } from '@smart-kamin/notion-editor-vue'

const toc = collectHeadings(JSON.parse(articleJson))
// [{ level: 1, text: 'Установка', id: 'ustanovka' }, …]
document.getElementById(toc[0].id)?.scrollIntoView()
```

Так оглавление работает одинаково в просмотре и в правке и не требует
монтирования редактора. Повторяющиеся заголовки нумеруются (`ustanovka-2`),
кириллица транслитерируется — чтобы скопированная в чат ссылка читалась.

**Якорей нет в `editor.getHTML()`**: они ставятся декорацией, а декорации в
разметку не попадают. Экспорт HTML на них строить нельзя. Причина именно такая:
дедупликация требует знания всего документа, а `renderHTML` у ноды видит только
себя — детерминированного `id` в атрибутах не сделать в принципе.

### Доступ к инстансу редактора

```vue
<DocEditor ref="editorRef" v-model="content" />
```

```ts
const editorRef = ref<InstanceType<typeof DocEditor> | null>(null)
const editor = computed(() => editorRef.value?.editor)

// текущее выделение — например чтобы прокомментировать фрагмент
const { from, to } = editor.value!.state.selection
const quote = editor.value!.state.doc.textBetween(from, to)
```

Нужен для императива: `focus()`, `insertContent()`, скролл к якорю, чтение
выделения. Оглавление через него считать **не надо** — для этого есть
`collectHeadings`.

### Свои расширения

```vue
<DocEditor v-model="content" :extensions="[commentHighlights, contentsLink]" />
```

Дописываются к встроенным последними, то есть могут их перекрыть. Читаются один
раз при создании редактора. Через это добавляют свои ноды и плагины, не заводя
их в общей либе.

### Использование отдельных расширений

Если нужна кастомная сборка редактора:

```ts
import {
  blockquoteExtension,
  codeBlockExtension,
  dragHandleExtension,
  imageExtension,
  linkExtension,
  slashMenuExtension,
  tableExtensions,
} from '@smart-kamin/notion-editor-vue'
```

---

## Горячие клавиши

| Клавиша | Действие |
|---------|----------|
| `/` | Открыть меню команд |
| `Ctrl+B` | Жирный |
| `Ctrl+I` | Курсив |
| `Ctrl+U` | Подчёркнутый |
| `Ctrl+A` внутри цитаты | Выделить только цитату |
| `Tab` в таблице | Перейти к следующей ячейке |

---

## Стили и темизация

Редактор использует CSS-переменные в формате oklch (совместимо с shadcn-vue). Тёмная тема применяется автоматически через класс `.dark` на родительском элементе.

Основные переменные:

```css
--background
--foreground
--muted
--muted-foreground
--border
--primary
--accent
--accent-foreground
--popover
--popover-foreground
--radius-md
--radius-sm
```

---

## Обновление версии

В репозитории пакета:

```bash
# Bump версии, коммит, тег — одной командой
pnpm version patch        # 0.1.3 → 0.1.4
git push --follow-tags    # запускает GitHub Actions → билд → релиз
```

В проекте-потребителе:

```bash
pnpm update @smart-kamin/notion-editor-vue
# или явно
pnpm add github:smart-kamin/notion-editor-vue#v0.1.4
```

---

## Разработка

```bash
git clone https://github.com/smart-kamin/notion-editor-vue
cd notion-editor-vue
pnpm install
pnpm dev      # watch-режим, пересборка при изменениях
pnpm build    # production сборка
```

### Демо на локальной сборке

```bash
pnpm build                  # демо смотрит на dist/, не на src/
cd demo && pnpm install && pnpm dev
```

Демо подключает пакет как `link:..`, то есть через симлинк на живой каталог.
Раньше стояло `file:..`, и pnpm делал **снимок** пакета на момент
`pnpm install`: после `pnpm build` демо продолжало показывать предыдущую сборку,
пока в нём заново не выполнить `pnpm install`. Ошибка при этом ничем себя не
выдавала — просто правка «не работала».

Если Vite всё равно отдаёт старое, у него свой кэш зависимостей:

```bash
cd demo && pnpm exec vite --force
```