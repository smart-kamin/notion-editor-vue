import { defineConfig } from 'vite'
import vue              from '@vitejs/plugin-vue'
import dts              from 'vite-plugin-dts'
import { resolve }      from 'path'

export default defineConfig({
    plugins: [
        vue(),
        dts({
            include:     ['src/**/*.ts', 'src/**/*.vue'],
            outDir:      'dist',
            // Свой tsconfig, а не корневой: тот тянет в программу vite.config.ts
            // и "types": ["node"], которых генерации типов не нужно.
            tsconfigPath: './tsconfig.build.json',
            // Корень entry фиксирован, иначе свёрнутый файл может уехать в
            // dist/src/index.d.ts, а package.json ждёт его в dist/index.d.ts.
            entryRoot:   'src',
            rollupTypes: true,
            // Страховка: если свёртка типов деградирует, entry всё равно
            // появится и будет реэкспортировать пофайловые декларации.
            insertTypesEntry: true,
        }),
    ],

    build: {
        lib: {
            entry:    resolve(__dirname, 'src/index.ts'),
            name:     'NotionEditorVue',
            fileName: 'index',
            formats:  ['es', 'cjs'],
        },
        rolldownOptions: {
            external: [
                'vue',
                /^@tiptap\//,
                /^@codemirror\//,
                /^@lezer\//,
                // lucide НЕ external намеренно. Иконки — это tree-shakeable
                // SVG-компоненты (их тут ~35), и вписать их в бандл дешевле,
                // чем требовать от потребителя ту же мажорную версию: портал
                // сидит на lucide-vue-next@0.x плюс @lucide/vue@1.x, и external
                // означал бы либо конфликт версий, либо вторую копию lucide в
                // его бандле.
                'marked',
                'turndown',
                'lowlight',
            ],
            output: {
                // CSS собирается в один dist/style.css
                assetFileNames: 'style.css',
                globals: { vue: 'Vue' },
            },
        },
        cssCodeSplit: false,
        sourcemap:    true,
    },
})