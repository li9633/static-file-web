<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Toolbar from '@/components/Toolbar.vue'
import FileList from '@/components/FileList.vue'
import { useFiles } from '@/composables/useFiles'

const {
  files,
  meta,
  loading,
  error,
  keyword,
  selectedExt,
  selectedDir,
  sortKey,
  sortDir,
  exts,
  dirs,
  filtered,
  filteredSize,
  load,
  reset,
} = useFiles()

const isDark = ref(false)

onMounted(() => {
  load()
  isDark.value = document.documentElement.classList.contains('dark')
})

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('sfw-theme', isDark.value ? 'dark' : 'light')
}

const totalCount = computed(() => meta.value?.total ?? files.value.length)
const totalSize = computed(() => meta.value?.totalSize ?? '0 B')
const generatedAt = computed(() => {
  if (!meta.value) return ''
  return new Date(meta.value.generatedAt).toLocaleString('zh-CN', {
    hour12: false,
  })
})
</script>

<template>
  <header class="site-header">
    <div class="header-top">
      <div class="brand">
        <div class="brand-logo">📦</div>
        <div>
          <h1>文件下载站</h1>
          <div class="sub">静态托管 · 实时搜索 · 一键下载</div>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-num">{{ totalCount }}</div>
          <div class="stat-label">文件总数</div>
        </div>
        <div class="stat">
          <div class="stat-num">{{ totalSize }}</div>
          <div class="stat-label">总体积</div>
        </div>
        <button
          class="theme-btn"
          :title="isDark ? '切换到亮色' : '切换到暗色'"
          @click="toggleTheme"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
  </header>

  <Toolbar
    v-model:keyword="keyword"
    v-model:selected-ext="selectedExt"
    v-model:selected-dir="selectedDir"
    v-model:sort-key="sortKey"
    v-model:sort-dir="sortDir"
    :exts="exts"
    :dirs="dirs"
    :result-count="filtered.length"
    :result-size="filteredSize"
    @reset="reset"
  />

  <main>
    <FileList
      :files="filtered"
      :keyword="keyword"
      :loading="loading"
      :error="error"
    />
  </main>

  <footer class="site-footer">
    <span v-if="generatedAt">索引生成于 {{ generatedAt }}</span>
    <span v-else>Powered by Cloudflare Pages</span>
  </footer>
</template>
