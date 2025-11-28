<script setup lang="ts">
import { ref, computed } from 'vue'
import { HTML_TAGS } from '../types/htmlConfig'
import type { AnyHtmlConfig } from '../types/htmlConfig'

const emit = defineEmits<{
  configChange: [config: AnyHtmlConfig | null]
}>()

const selectedTag = ref('')
const config = ref<Record<string, any>>({})
const tableData = ref<{ headers: string[]; cells: string[][] }>({
  headers: [],
  cells: [],
})

const configFields = computed(() => {
  switch (selectedTag.value) {
    case 'table':
      return [
        { name: 'rows', label: 'Rows', type: 'number', default: 3 },
        { name: 'cols', label: 'Columns', type: 'number', default: 3 },
      ]
    case 'a':
      return [
        { name: 'href', label: 'URL', type: 'text', default: 'https://example.com' },
        { name: 'text', label: 'Link Text', type: 'text', default: 'Click here' },
      ]
    case 'img':
      return [
        {
          name: 'src',
          label: 'Image URL',
          type: 'text',
          default: 'https://placehold.co/600x400',
        },
        { name: 'alt', label: 'Alt Text', type: 'text', default: 'Image description' },
      ]
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return [{ name: 'text', label: 'Heading Text', type: 'text', default: 'Heading' }]
    case 'p':
      return [
        {
          name: 'text',
          label: 'Paragraph Text',
          type: 'textarea',
          default: 'Lorem ipsum dolor sit amet.',
        },
      ]
    case 'ul':
    case 'ol':
      return [
        {
          name: 'items',
          label: 'List Items (comma-separated)',
          type: 'textarea',
          default: 'Item 1, Item 2, Item 3',
        },
      ]
    case 'blockquote':
      return [{ name: 'text', label: 'Quote Text', type: 'textarea', default: 'This is a quote.' }]
    case 'pre':
    case 'code':
      return [
        { name: 'code', label: 'Code', type: 'textarea', default: 'console.log("Hello, World!");' },
        { name: 'language', label: 'Language (optional)', type: 'text', default: 'javascript' },
      ]
    default:
      return []
  }
})

function initializeConfig() {
  config.value = {}
  configFields.value.forEach((field) => {
    config.value[field.name] = field.default
  })

  // Initialize table data if table is selected
  if (selectedTag.value === 'table') {
    const rows = Number(config.value.rows) || 3
    const cols = Number(config.value.cols) || 3
    tableData.value.headers = Array(cols)
      .fill(0)
      .map((_, i) => `Header ${i + 1}`)
    tableData.value.cells = Array(rows)
      .fill(0)
      .map((_, i) =>
        Array(cols)
          .fill(0)
          .map((_, j) => `Cell ${i + 1},${j + 1}`),
      )
  }

  updateConfig()
}

function handleTableSizeChange() {
  const rows = Number(config.value.rows) || 3
  const cols = Number(config.value.cols) || 3

  // Resize headers
  const currentHeaderCount = tableData.value.headers.length
  if (cols > currentHeaderCount) {
    tableData.value.headers.push(
      ...Array(cols - currentHeaderCount)
        .fill(0)
        .map((_, i) => `Header ${currentHeaderCount + i + 1}`),
    )
  } else if (cols < currentHeaderCount) {
    tableData.value.headers = tableData.value.headers.slice(0, cols)
  }

  // Resize cells
  const currentRowCount = tableData.value.cells.length
  if (rows > currentRowCount) {
    tableData.value.cells.push(
      ...Array(rows - currentRowCount)
        .fill(0)
        .map((_, i) =>
          Array(cols)
            .fill(0)
            .map((_, j) => `Cell ${currentRowCount + i + 1},${j + 1}`),
        ),
    )
  } else if (rows < currentRowCount) {
    tableData.value.cells = tableData.value.cells.slice(0, rows)
  }

  // Adjust column count in existing rows
  tableData.value.cells = tableData.value.cells.map((row, i) => {
    if (cols > row.length) {
      return [
        ...row,
        ...Array(cols - row.length)
          .fill(0)
          .map((_, j) => `Cell ${i + 1},${row.length + j + 1}`),
      ]
    } else if (cols < row.length) {
      return row.slice(0, cols)
    }
    return row
  })

  updateConfig()
}

function updateConfig() {
  if (!selectedTag.value) {
    emit('configChange', null)
    return
  }

  const baseConfig: any = { tag: selectedTag.value }

  // Handle special cases
  if (selectedTag.value === 'ul' || selectedTag.value === 'ol') {
    baseConfig.items = config.value.items
      ? config.value.items.split(',').map((item: string) => item.trim())
      : []
  } else if (selectedTag.value === 'table') {
    baseConfig.rows = Number(config.value.rows) || 3
    baseConfig.cols = Number(config.value.cols) || 3
    baseConfig.headers = tableData.value.headers
    baseConfig.data = tableData.value.cells
  } else {
    Object.assign(baseConfig, config.value)
  }

  emit('configChange', baseConfig as AnyHtmlConfig)
}

function handleTagChange() {
  initializeConfig()
}
</script>

<template>
  <div class="h-full flex flex-col p-6 bg-gray-50">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">HTML Configuration</h2>

    <div class="space-y-4">
      <!-- Tag Selector -->
      <div>
        <label for="tag-select" class="block text-sm font-medium text-gray-700 mb-2">
          Select HTML Tag
        </label>
        <select
          id="tag-select"
          v-model="selectedTag"
          @change="handleTagChange"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select a tag --</option>
          <option v-for="tag in HTML_TAGS" :key="tag.value" :value="tag.value">
            {{ tag.label }}
          </option>
        </select>
      </div>

      <!-- Dynamic Config Fields -->
      <div v-if="selectedTag" class="space-y-4 pt-4 border-t border-gray-200">
        <div v-for="field in configFields" :key="field.name">
          <label :for="field.name" class="block text-sm font-medium text-gray-700 mb-2">
            {{ field.label }}
          </label>
          <input
            v-if="field.type === 'text' || field.type === 'number'"
            :id="field.name"
            v-model="config[field.name]"
            :type="field.type"
            @input="
              selectedTag === 'table' && (field.name === 'rows' || field.name === 'cols')
                ? handleTableSizeChange()
                : updateConfig()
            "
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="field.name"
            v-model="config[field.name]"
            @input="updateConfig"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Table Editor -->
        <div v-if="selectedTag === 'table'" class="mt-6 space-y-4">
          <h3 class="text-sm font-semibold text-gray-700 uppercase">Edit Table Content</h3>

          <!-- Headers -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Headers</label>
            <div
              class="grid gap-2"
              :style="{ gridTemplateColumns: `repeat(${config.cols || 3}, 1fr)` }"
            >
              <input
                v-for="(header, index) in tableData.headers"
                :key="`header-${index}`"
                v-model="tableData.headers[index]"
                @input="updateConfig"
                type="text"
                class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50 font-medium"
                :placeholder="`Header ${index + 1}`"
              />
            </div>
          </div>

          <!-- Data Cells -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Data Cells</label>
            <div class="space-y-2">
              <div
                v-for="(row, rowIndex) in tableData.cells"
                :key="`row-${rowIndex}`"
                class="grid gap-2"
                :style="{ gridTemplateColumns: `repeat(${config.cols || 3}, 1fr)` }"
              >
                <input
                  v-for="(cell, colIndex) in row"
                  :key="`cell-${rowIndex}-${colIndex}`"
                  :value="tableData.cells[rowIndex]?.[colIndex] || ''"
                  @input="
                    (e) => {
                      if (tableData.cells[rowIndex]) {
                        tableData.cells[rowIndex][colIndex] = (e.target as HTMLInputElement).value
                        updateConfig()
                      }
                    }
                  "
                  type="text"
                  class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  :placeholder="`Cell ${rowIndex + 1},${colIndex + 1}`"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div v-if="!selectedTag" class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p class="text-sm text-blue-800">
          👆 Select an HTML tag from the dropdown above to start configuring your HTML element.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
select,
input,
textarea {
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}
</style>
