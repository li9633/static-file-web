<script setup lang="ts">
import type { SortKey } from '@/composables/useFiles'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faMagnifyingGlass,
  faXmark,
  faArrowUp,
  faArrowDown,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMagnifyingGlass, faXmark, faArrowUp, faArrowDown, faRotateLeft)

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
        <span class="icon">
          <font-awesome-icon icon="magnifying-glass" />
        </span>
        <el-input
          v-model="keyword"
          placeholder="搜索文件名、目录或类型…"
          clearable
          @clear="keyword = ''"
        />
      </div>

      <el-select v-model="selectedExt" placeholder="全部类型">
        <el-option
          v-for="ext in exts"
          :key="ext"
          :label="ext === 'all' ? '全部类型' : ext.toUpperCase()"
          :value="ext"
        />
      </el-select>

      <el-select v-model="sortKey" placeholder="排序方式">
        <el-option
          v-for="opt in sortOptions"
          :key="opt.key"
          :label="`按${opt.label}`"
          :value="opt.key"
        />
      </el-select>

      <el-button
        :title="sortDir === 'asc' ? '当前：升序' : '当前：降序'"
        @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'"
      >
        <font-awesome-icon
          :icon="sortDir === 'asc' ? 'arrow-up' : 'arrow-down'"
        />
        {{ sortDir === 'asc' ? '升序' : '降序' }}
      </el-button>
    </div>

    <div v-if="dirs.length > 2" class="dir-bar">
      <el-button
        v-for="d in dirs"
        :key="d"
        size="small"
        :type="selectedDir === d ? 'primary' : 'default'"
        round
        @click="selectedDir = d"
      >
        {{ d === 'all' ? '全部目录' : d }}
      </el-button>
    </div>

    <div class="result-line">
      <span>
        匹配 <strong>{{ resultCount }}</strong> 个文件 · {{ resultSize }}
      </span>
      <el-button link type="primary" @click="emit('reset')">
        <font-awesome-icon icon="rotate-left" />
        重置筛选
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  position: relative;
  flex: 1 1 240px;
  min-width: 0;

  .icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    opacity: 0.55;
    pointer-events: none;
    z-index: 1;
    color: var(--text-faint);
  }

  :deep(.el-input__wrapper) {
    padding-left: 38px;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    box-shadow: none;

    &:hover {
      box-shadow: none;
    }
  }

  :deep(.el-input__wrapper.is-focus) {
    border-color: var(--primary);
    background: var(--surface);
    box-shadow: none;
  }

  :deep(.el-input__inner) {
    color: var(--text);

    &::placeholder {
      color: var(--text-faint);
    }
  }
}

.result-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12.5px;
  color: var(--text-dim);
  padding: 0 2px;

  strong {
    color: var(--text);
  }
}

.dir-bar {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  padding-top: 2px;
}
</style>
