<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { Link, Upload, X, ImageIcon } from 'lucide-vue-next'

// ── Props / emits ─────────────────────────────────────────────────────────────

const props = defineProps<{
  visible:   boolean
  x:         number
  y:         number
}>()

const emit = defineEmits<{
  insert: [src: string]
  close:  []
}>()

// ── Состояние ─────────────────────────────────────────────────────────────────

type Tab = 'url' | 'upload'

const activeTab = ref<Tab>('url')
const urlValue  = ref('')
const error     = ref('')
const urlInput  = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// ── Автофокус при открытии ────────────────────────────────────────────────────

watch(() => props.visible, (v) => {
  if (v) {
    activeTab.value = 'url'
    urlValue.value  = ''
    error.value     = ''
    nextTick(() => urlInput.value?.focus())
  }
})

// ── Позиция с учётом краёв экрана ────────────────────────────────────────────

const POPOVER_W = 320
const POPOVER_H = 160

const style = computed(() => {
  const x = Math.min(props.x, window.innerWidth  - POPOVER_W - 8)
  const y = props.y + POPOVER_H > window.innerHeight
    ? props.y - POPOVER_H - 12
    : props.y
  return { left: Math.max(8, x) + 'px', top: Math.max(8, y) + 'px' }
})

// ── Вставка по URL ────────────────────────────────────────────────────────────

function submitUrl() {
  const src = urlValue.value.trim()
  if (!src) { error.value = 'Введите ссылку'; return }
  if (!/^https?:\/\//i.test(src)) { error.value = 'Ссылка должна начинаться с http(s)://'; return }
  error.value = ''
  emit('insert', src)
}

function onUrlKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter')  { e.preventDefault(); submitUrl() }
  if (e.key === 'Escape') { e.preventDefault(); emit('close') }
}

// ── Загрузка файла ────────────────────────────────────────────────────────────

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { error.value = 'Выберите файл изображения'; return }
  const reader = new FileReader()
  reader.onload = (ev) => {
    const src = ev.target?.result as string
    emit('insert', src)
  }
  reader.readAsDataURL(file)
  // Сбрасываем input, чтобы можно было выбрать тот же файл снова
  ;(e.target as HTMLInputElement).value = ''
}

// ── Клик вне поповера ────────────────────────────────────────────────────────

function onOverlayClick() {
  emit('close')
}

function stopPropagation(e: MouseEvent) {
  e.stopPropagation()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="ip">
      <div v-if="visible" class="ip-overlay" @mousedown="onOverlayClick">
        <div
          class="ip"
          :style="style"
          @mousedown="stopPropagation"
        >
          <!-- Шапка -->
          <div class="ip__header">
            <div class="ip__icon">
              <ImageIcon :size="14" />
            </div>
            <span class="ip__title">Вставить изображение</span>
            <button class="ip__close" @mousedown.prevent="emit('close')">
              <X :size="14" />
            </button>
          </div>

          <!-- Табы -->
          <div class="ip__tabs">
            <button
              class="ip__tab"
              :class="{ 'ip__tab--active': activeTab === 'url' }"
              @mousedown.prevent="() => { activeTab = 'url'; nextTick(() => urlInput?.focus()) }"
            >
              <Link :size="12" />
              По ссылке
            </button>
            <button
              class="ip__tab"
              :class="{ 'ip__tab--active': activeTab === 'upload' }"
              @mousedown.prevent="activeTab = 'upload'"
            >
              <Upload :size="12" />
              С компьютера
            </button>
          </div>

          <!-- Контент -->
          <div class="ip__body">

            <!-- URL вкладка -->
            <template v-if="activeTab === 'url'">
              <div class="ip__field">
                <input
                  ref="urlInput"
                  v-model="urlValue"
                  class="ip__input"
                  type="url"
                  placeholder="https://example.com/image.png"
                  @keydown="onUrlKeydown"
                />
              </div>
              <p v-if="error" class="ip__error">{{ error }}</p>
              <button class="ip__submit" @mousedown.prevent="submitUrl">
                Вставить
              </button>
            </template>

            <!-- Upload вкладка -->
            <template v-else>
              <p v-if="error" class="ip__error">{{ error }}</p>
              <button class="ip__upload-btn" @mousedown.prevent="triggerFileInput">
                <Upload :size="16" />
                Выбрать файл
              </button>
              <p class="ip__hint">PNG, JPG, GIF, WebP, SVG, AVIF</p>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onFileChange"
              />
            </template>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay ── */
.ip-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  /* прозрачный — нужен только для перехвата клика вне */
}

/* ── Попover ── */
.ip {
  position: fixed;
  z-index: 61;
  width: 20rem;
  border-radius: var(--radius-md, 0.375rem);
  border: 0.0625rem solid var(--border);
  background: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    0 0.25rem 0.5rem -0.0625rem color-mix(in oklch, var(--foreground) 10%, transparent),
    0 0.125rem 0.25rem -0.125rem color-mix(in oklch, var(--foreground) 6%, transparent);
  overflow: hidden;
}

/* ── Шапка ── */
.ip__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem 0.5rem;
  border-bottom: 0.0625rem solid var(--border);
}

.ip__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  border: 0.0625rem solid var(--border);
  background: var(--background);
  color: var(--muted-foreground);
  flex-shrink: 0;
}

.ip__title {
  flex: 1;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
}

.ip__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
  flex-shrink: 0;
}

.ip__close:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}

/* ── Табы ── */
.ip__tabs {
  display: flex;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem 0;
}

.ip__tab {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.625rem;
  border: none;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: transparent;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.ip__tab:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}

.ip__tab--active {
  background: var(--accent);
  color: var(--accent-foreground);
}

/* ── Body ── */
.ip__body {
  padding: 0.5rem 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ── Инпут URL ── */
.ip__field {
  display: flex;
  align-items: center;
}

.ip__input {
  width: 100%;
  padding: 0.4375rem 0.625rem;
  border: 0.0625rem solid var(--border);
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: var(--background);
  color: var(--foreground);
  font-size: 0.8125rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  min-width: 0;
  box-sizing: border-box;
}

.ip__input:focus {
  border-color: var(--ring);
}

.ip__input::placeholder {
  color: var(--muted-foreground);
}

/* ── Кнопка вставить ── */
.ip__submit {
  align-self: flex-end;
  padding: 0.375rem 0.875rem;
  border: none;
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.1s;
}

.ip__submit:hover {
  opacity: 0.88;
}

/* ── Кнопка загрузки ── */
.ip__upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem;
  border: 0.0625rem dashed var(--border);
  border-radius: calc(var(--radius-md, 0.375rem) - 0.125rem);
  background: color-mix(in oklch, var(--muted) 30%, transparent);
  color: var(--muted-foreground);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}

.ip__upload-btn:hover {
  background: var(--accent);
  color: var(--accent-foreground);
  border-color: transparent;
}

/* ── Хинт ── */
.ip__hint {
  font-size: 0.6875rem;
  color: var(--muted-foreground);
  text-align: center;
  margin: 0;
}

/* ── Ошибка ── */
.ip__error {
  font-size: 0.75rem;
  color: var(--destructive);
  margin: 0;
}

/* ── Анимация ── */
.ip-enter-active,
.ip-leave-active {
  transition: opacity 0.12s, transform 0.12s;
}
.ip-enter-from,
.ip-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem) scale(0.98);
}
</style>
