<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl transition-colors">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold tracking-wide text-gray-900 dark:text-white">{{ t('help_title') }}</h2>
          <button
            class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none transition-colors"
            @click="$emit('update:modelValue', false)"
          >
            &times;
          </button>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ t('help_intro') }}</p>

        <hr class="mb-4 border-gray-200 dark:border-gray-700" />

        <!-- Color legend -->
        <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
          {{ t('help_colors_section') }}
        </h3>

        <div class="flex flex-col gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex-shrink-0 bg-green-600 text-white flex items-center justify-center text-lg font-bold rounded">
              W
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-200">
              <strong class="text-green-600 dark:text-green-400">{{ locale === 'ko' ? '초록색' : 'Green' }}</strong>
              — {{ t('help_green') }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex-shrink-0 bg-yellow-500 text-white flex items-center justify-center text-lg font-bold rounded">
              I
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-200">
              <strong class="text-yellow-600 dark:text-yellow-400">{{ locale === 'ko' ? '노란색' : 'Yellow' }}</strong>
              — {{ t('help_yellow') }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex-shrink-0 bg-gray-500 text-white flex items-center justify-center text-lg font-bold rounded">
              N
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-200">
              <strong class="text-gray-600 dark:text-gray-400">{{ locale === 'ko' ? '회색' : 'Gray' }}</strong>
              — {{ t('help_gray') }}
            </p>
          </div>
        </div>

        <hr class="mb-4 border-gray-200 dark:border-gray-700" />

        <!-- Hints -->
        <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
          {{ t('help_hints_section') }}
        </h3>
        <div class="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
          <div class="flex items-start gap-2">
            <span>💡</span>
            <p><strong>{{ t('reveal_letter') }}</strong> — {{ t('help_reveal_desc') }}</p>
          </div>
          <div class="flex items-start gap-2">
            <span>🗑️</span>
            <p><strong>{{ t('remove_letter') }}</strong> — {{ t('help_remove_desc') }}</p>
          </div>
        </div>

        <button
          class="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors"
          @click="$emit('update:modelValue', false)"
        >
          {{ t('got_it') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

defineProps<{ modelValue: boolean }>()
defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const { locale, t } = useI18n()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
