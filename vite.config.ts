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
            rollupTypes: true,
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
                'lucide-vue-next',
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