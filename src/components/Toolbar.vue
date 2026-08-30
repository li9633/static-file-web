<script setup lang="ts">
import type { SortKey } from '../composables/useFiles'

const keyword = defineModel<string>('keyword', { required: true })
const selectedExt = defineModel<string>('selectedExt', { required: true })
const selectedDir = defineModel<string>('selectedDir', { required: true })
const sortKey = defineModel<SortKey>('sortKey', { required: true })
const sortDir = defineModel<'asc' | 'desc'>('sortDir', { required: true })

defineProps<{
  exts: string[]
  dirs: string[]
  resultCount: number
  resultSize: string
}>()

const emit = defineEmits<{ reset: [] }>()

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'date', label: '修改日期' },
  { key: 'name', label: '文件名' },
  { key: 'size', label: '文件大小' },
]
</script>

<template>
  <div class="card toolbar">
    <div class="search-row">
      <div class="search-box" :class="{ 'has-value': keyword }">
        <span class="icon">🔍</span>
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索文件名、目录或类型…"
          autocomplete="off"
        />
        <button class="clear-btn" @click="keyword = ''" aria-label="清空">✕</button>
      </div>

      <select v-model="selectedExt" aria-label="按类型筛选">
        <option v-for="ext in exts" :key="ext" :value="ext">
          {{ ext === 'all' ? '全部类型' : ext.toUpperCase() }}
        </option>
      </select>

      <select v-model="sortKey" aria-label="排序方式">
        <option v-for="opt in sortOptions" :key="opt.key" :value="opt.key">
          按{{ opt.label }}
        </option>
      </select>

      <button
        class="act-btn"
        :title="sortDir === 'asc' ? '当前：升序' : '当前：降序'"
        @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'"
      >
        {{ sortDir === 'asc' ? '↑ 升序' : '↓ 降序' }}
      </button>
    </div>

    <div v-if="dirs.length > 2" class="dir-bar">
      <button
        v-for="d in dirs"
        :key="d"
        class="dir-chip"
        :class="{ active: selectedDir === d }"
        @click="selectedDir = d"
      >
        {{ d === 'all' ? '全部目录' : d }}
      </button>
    </div>

    <div class="result-line">
      <span>
        匹配 <strong>{{ resultCount }}</strong> 个文件 · {{ resultSize }}
      </span>
      <button class="reset-link" @click="emit('reset')">重置筛选</button>
    </div>
  </div>
</template>

<style scoped>
.result-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12.5px;
  color: var(--text-dim);
  padding: 0 2px;
}
.result-line strong { color: var(--text); }
.reset-link {
  border: none;
  background: none;
  color: var(--primary);
  font-size: 12.5px;
  font-weight: 500;
  padding: 0;
}
.reset-link:hover { text-decoration: underline; }
</style>
