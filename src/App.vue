<script setup lang="ts">
import { ref, computed } from 'vue'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import HtmlConfigPanel from './components/HtmlConfigPanel.vue'
import MarkdownPreview from './components/MarkdownPreview.vue'
import { generateHtmlFromConfig } from './utils/htmlGenerator'
import type { AnyHtmlConfig } from './types/htmlConfig'

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})
turndownService.use(gfm)

const currentConfig = ref<AnyHtmlConfig | null>(null)

const markdownOutput = computed(() => {
  if (!currentConfig.value) {
    return ''
  }

  try {
    const html = generateHtmlFromConfig(currentConfig.value)
    return turndownService.turndown(html)
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error)
    return 'Error: Failed to convert HTML to Markdown'
  }
})

function handleConfigChange(config: AnyHtmlConfig | null) {
  currentConfig.value = config
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-linear-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <h1 class="text-3xl font-bold text-center">HTML to Markdown Converter</h1>
    </header>

    <!-- Main Content: 50/50 Split -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Panel -->
      <div class="w-1/2 border-r border-gray-300 overflow-y-auto">
        <HtmlConfigPanel @config-change="handleConfigChange" />
      </div>

      <!-- Right Panel -->
      <div class="w-1/2 overflow-y-auto">
        <MarkdownPreview :markdown="markdownOutput" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure full height layout */
#app {
  height: 100vh;
}
</style>
