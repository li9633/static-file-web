import { ref, computed, watch, type ComputedRef } from 'vue'
import type { FileItem, FilesIndex } from '../types'

export type SortKey = 'date' | 'name' | 'size'
export type SortDir = 'asc' | 'desc'

export function useFiles() {
  const files = ref<FileItem[]>([])
  const meta = ref<FilesIndex | null>(null)
  const loading = ref(true)
  const error = ref('')

  const keyword = ref('')
  const selectedExt = ref('all')
  const selectedDir = ref('all')
  const sortKey = ref<SortKey>('date')
  const sortDir = ref<SortDir>('desc')
  const currentPage = ref(1)
  const pageSize = ref(20)

  const load = async () => {
    loading.value = true
    error.value = ''
    try {
      // 时间戳防缓存，保证每次部署后拿到最新索引
      const res = await fetch(`/files.json?t=${Date.now()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: FilesIndex = await res.json()
      files.value = data.files ?? []
      meta.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '未知错误'
      files.value = []
    } finally {
      loading.value = false
    }
  }

  /** 所有扩展名（用于类型下拉） */
  const exts: ComputedRef<string[]> = computed(() => {
    const set = new Set(files.value.map((f) => f.ext))
    return ['all', ...[...set].sort()]
  })

  /** 所有目录（用于目录筛选条） */
  const dirs: ComputedRef<string[]> = computed(() => {
    const set = new Set(files.value.map((f) => f.dir))
    return ['all', ...[...set].sort()]
  })

  /** 搜索 + 类型 + 目录 + 排序 的最终结果 */
  const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    let list = files.value.filter((f) => {
      const matchKw =
        !kw ||
        f.name.toLowerCase().includes(kw) ||
        f.dir.toLowerCase().includes(kw) ||
        f.ext.toLowerCase().includes(kw)
      const matchExt =
        selectedExt.value === 'all' || f.ext === selectedExt.value
      const matchDir =
        selectedDir.value === 'all' || f.dir === selectedDir.value
      return matchKw && matchExt && matchDir
    })

    const dir = sortDir.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      switch (sortKey.value) {
        case 'name':
          return a.name.localeCompare(b.name, 'zh-CN') * dir
        case 'size':
          return (a.sizeBytes - b.sizeBytes) * dir
        case 'date':
        default:
          return (
            a.modified.localeCompare(b.modified) * dir ||
            a.name.localeCompare(b.name) * dir
          )
      }
    })
    return list
  })

  /** 分页后的当前页数据 */
  const paged = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filtered.value.slice(start, start + pageSize.value)
  })

  /** 总页数 */
  const totalPages = computed(
    () => Math.ceil(filtered.value.length / pageSize.value) || 1,
  )

  /** 当前结果总体积 */
  const filteredSize = computed(() => {
    const bytes = filtered.value.reduce((s, f) => s + f.sizeBytes, 0)
    return formatBytes(bytes)
  })

  /** 筛选条件变化时回到第 1 页 */
  watch([keyword, selectedExt, selectedDir, sortKey, sortDir], () => {
    currentPage.value = 1
  })

  /** 切换排序（同一字段再点则反转方向） */
  function toggleSort(key: SortKey) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = key === 'name' ? 'asc' : 'desc'
    }
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function reset() {
    keyword.value = ''
    selectedExt.value = 'all'
    selectedDir.value = 'all'
    sortKey.value = 'date'
    sortDir.value = 'desc'
    currentPage.value = 1
  }

  return {
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
    currentPage,
    pageSize,
    paged,
    totalPages,
    load,
    toggleSort,
    setPage,
    reset,
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}
