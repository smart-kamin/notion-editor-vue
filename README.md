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
- **Изображения** — вставка по URL, drag & drop, resize, выравнивание
- **Ссылки** — autolink, linkOnPaste, inline-редактор
- **Форматы вывода** — HTML, JSON, Markdown, plain text через `output-format`
- **Вставка Markdown** — автоматически конвертируется при paste
- **Тёмная тема** — через CSS-переменные shadcn/oklch, работает автоматически

## Demo

**[→ Открыть демо](https://smart-kamin.github.io/notion-editor-vue/)**

Live-редактор с переключением форматов вывода (Markdown / HTML / JSON / Text) и тёмной темой.

---



```bash
pnpm add github:smart-kamin/notion-editor-vue#v0.1.3
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