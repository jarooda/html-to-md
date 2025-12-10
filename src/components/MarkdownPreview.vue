<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { marked } from 'marked'
import { useClipboard } from '@vueuse/core'
import * as prettier from 'prettier/standalone'
import prettierMarkdown from 'prettier/plugins/markdown'
import { isString } from 'jalutils'

const props = defineProps<{
  markdown: string
}>()

const hasContent = computed(() => isString(props.markdown) && props.markdown.trim().length > 0)

const renderedHtml = computed(() => {
  if (!hasContent.value) return ''
  try {
    return marked.parse(props.markdown)
  } catch (error) {
    console.error('Error parsing markdown:', error)
    return '<p>Error rendering markdown</p>'
  }
})

const formattedMarkdown = ref('')
const { copy, copied } = useClipboard()

const copyMarkdown = () => {
  copy(formattedMarkdown.value)
}

watch(
  () => props.markdown,
  async (newMarkdown) => {
    if (!isString(newMarkdown) || !newMarkdown.trim()) {
      formattedMarkdown.value = ''
      return
    }

    try {
      const formatted = await prettier.format(newMarkdown, {
        parser: 'markdown',
        plugins: [prettierMarkdown],
        printWidth: 80,
        proseWrap: 'always',
      })
      formattedMarkdown.value = formatted
    } catch (error) {
      console.error('Error formatting markdown:', error)
      formattedMarkdown.value = newMarkdown
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full flex flex-col p-6 bg-white">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Markdown Output</h2>

    <div v-if="hasContent" class="flex-1 overflow-auto">
      <!-- Markdown Preview -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-600 mb-2 uppercase">Preview</h3>
        <div
          class="prose prose-slate max-w-none p-4 bg-gray-50 rounded-md border border-gray-200"
          v-html="renderedHtml"
        />
      </div>

      <!-- Raw Markdown -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold text-gray-600 uppercase">Raw Markdown</h3>
          <button
            @click="copyMarkdown"
            class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
            :class="copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'"
          >
            {{ copied ? '✓ Copied!' : 'Copy' }}
          </button>
        </div>
        <pre
          class="p-4 bg-gray-900 text-green-400 rounded-md border border-gray-700 overflow-x-auto text-sm font-mono"
        ><code>{{ formattedMarkdown }}</code></pre>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
    >
      <div class="text-center text-gray-500">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-lg font-medium">No content yet</p>
        <p class="text-sm mt-1">Configure an HTML element on the left to see the Markdown output</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

code {
  display: block;
}
</style>
