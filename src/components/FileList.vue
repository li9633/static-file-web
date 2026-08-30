<script setup lang="ts">
import type { FileItem } from '../types'
import { fileIcon, highlight } from '../utils'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  files: FileItem[]
  keyword: string
  loading: boolean
  error: string
}>()

const { message, show } = useToast()

async function copyLink(file: FileItem) {
  const url = window.location.origin + file.path
  try {
    await navigator.clipboard.writeText(url)
    show(`已复制直链：${file.name}`)
  } catch {
    // 非 HTTPS 或无权限时的兜底方案
    const ta = document.createElement('textarea')
    ta.value = url
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    show(`已复制直链：${file.name}`)
  }
}
</script>

<template>
  <!-- 加载中 -->
  <div v-if="loading" class="file-list">
    <div v-for="i in 5" :key="i" class="skeleton"></div>
  </div>

  <!-- 加载失败 -->
  <div v-else-if="error" class="card state-box">
    <span class="emoji">📭</span>
    <div class="title">索引加载失败</div>
    <div>找不到 files.json（{{ error }}）。请先执行 npm run build 生成索引。</div>
  </div>

  <!-- 空结果 -->
  <div v-else-if="files.length === 0" class="card state-box">
    <span class="emoji">🔍</span>
    <div class="title">没有匹配的文件</div>
    <div>换个关键词，或重置筛选条件试试。</div>
  </div>

  <!-- 文件列表 -->
  <div v-else class="file-list">
    <div v-for="file in files" :key="file.path" class="file-item">
      <div class="file-icon">{{ fileIcon(file.ext) }}</div>

      <div class="file-main">
        <div class="file-name" v-html="highlight(file.name, props.keyword)"></div>
        <div class="file-meta">
          <span class="badge">{{ file.ext }}</span>
          <span>{{ file.size }}</span>
          <span class="sep">·</span>
          <span>{{ file.modified }}</span>
          <template v-if="file.dir !== '/'">
            <span class="sep">·</span>
            <span>{{ file.dir }}</span>
          </template>
        </div>
      </div>

      <div class="file-actions">
        <button class="act-btn" @click="copyLink(file)">复制链接</button>
        <a class="act-btn primary" :href="file.path" download>下载</a>
      </div>
    </div>
  </div>

  <div v-if="message" class="toast">{{ message }}</div>
</template>
