<script setup lang="ts">
import { ref } from 'vue'
import type { FileItem } from '@/types'
import { highlight } from '@/utils'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileCsv,
  faFileZipper,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileCode,
  faFileLines,
  faFile,
  faGear,
  faTerminal,
  faLock,
  faCompactDisc,
  faDatabase,
  faInbox,
  faMagnifyingGlass,
  faCopy,
  faDownload,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileCsv,
  faFileZipper,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileCode,
  faFileLines,
  faFile,
  faGear,
  faTerminal,
  faLock,
  faCompactDisc,
  faDatabase,
  faInbox,
  faMagnifyingGlass,
  faCopy,
  faDownload,
)

const faIconByExt: Record<string, string> = {
  conf: 'gear',
  config: 'gear',
  sh: 'terminal',
  bash: 'terminal',
  bat: 'terminal',
  ps1: 'terminal',
  yml: 'file-lines',
  yaml: 'file-lines',
  toml: 'file-lines',
  ini: 'file-lines',
  env: 'lock',
  pdf: 'file-pdf',
  doc: 'file-word',
  docx: 'file-word',
  xls: 'file-excel',
  xlsx: 'file-excel',
  ppt: 'file-powerpoint',
  pptx: 'file-powerpoint',
  md: 'file-lines',
  txt: 'file-lines',
  csv: 'file-csv',
  log: 'file-lines',
  zip: 'file-zipper',
  rar: 'file-zipper',
  '7z': 'file-zipper',
  gz: 'file-zipper',
  tar: 'file-zipper',
  tgz: 'file-zipper',
  png: 'file-image',
  jpg: 'file-image',
  jpeg: 'file-image',
  gif: 'file-image',
  webp: 'file-image',
  svg: 'file-image',
  ico: 'file-image',
  mp4: 'file-video',
  mov: 'file-video',
  avi: 'file-video',
  mkv: 'file-video',
  webm: 'file-video',
  mp3: 'file-audio',
  wav: 'file-audio',
  flac: 'file-audio',
  m4a: 'file-audio',
  json: 'file-code',
  js: 'file-code',
  ts: 'file-code',
  vue: 'file-code',
  html: 'file-code',
  css: 'file-code',
  iso: 'compact-disc',
  exe: 'file',
  dmg: 'file',
  apk: 'file',
  deb: 'file',
  rpm: 'file',
  bin: 'file',
  img: 'compact-disc',
  sql: 'database',
  db: 'database',
}

function getFileIcon(ext: string): string {
  return faIconByExt[ext] || 'file'
}

const props = defineProps<{
  files: FileItem[]
  keyword: string
  loading: boolean
  error: string
}>()

const dialogVisible = ref(false)
const dialogUrl = ref('')

async function copyLink(file: FileItem) {
  const url = window.location.origin + file.path
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success(`已复制直链：${file.name}`)
  } catch {
    dialogUrl.value = url
    dialogVisible.value = true
  }
}

function onDialogInputFocus(e: Event) {
  ;(e.target as HTMLInputElement).select()
}

async function copyFromDialog() {
  await navigator.clipboard.writeText(dialogUrl.value)
  dialogVisible.value = false
  ElMessage.success('已复制')
}
</script>

<template>
  <!-- 加载中 -->
  <div v-if="loading" class="file-list">
    <div v-for="i in 5" :key="i" class="skeleton"></div>
  </div>

  <!-- 加载失败 -->
  <div v-else-if="error" class="card state-box">
    <span class="emoji">
      <font-awesome-icon icon="inbox" />
    </span>
    <div class="title">索引加载失败</div>
    <div>
      找不到 files.json（{{ error }}）。请先执行 npm run build 生成索引。
    </div>
  </div>

  <!-- 空结果 -->
  <div v-else-if="files.length === 0" class="card state-box">
    <span class="emoji">
      <font-awesome-icon icon="magnifying-glass" />
    </span>
    <div class="title">没有匹配的文件</div>
    <div>换个关键词，或重置筛选条件试试。</div>
  </div>

  <!-- 文件列表 -->
  <div v-else class="file-list">
    <div v-for="file in files" :key="file.path" class="file-item">
      <div class="file-icon">
        <font-awesome-icon :icon="getFileIcon(file.ext)" />
      </div>

      <div class="file-main">
        <div
          class="file-name"
          v-html="highlight(file.name, props.keyword)"
        ></div>
        <div class="file-meta">
          <el-tag size="small" type="info">{{ file.ext }}</el-tag>
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
        <el-button size="small" @click="copyLink(file)">
          <font-awesome-icon icon="copy" />
          复制链接
        </el-button>
        <el-button
          size="small"
          type="primary"
          tag="a"
          :href="file.path"
          download
        >
          <font-awesome-icon icon="download" />
          下载
        </el-button>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="手动复制链接"
    width="560px"
    :close-on-click-modal="false"
  >
    <el-input :model-value="dialogUrl" readonly @focus="onDialogInputFocus" />
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="copyFromDialog">
        复制到剪贴板
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.file-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 15px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.14s,
    border-color 0.18s,
    box-shadow 0.18s;

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--primary) 42%, var(--border));
    box-shadow: var(--shadow);
  }
}

.file-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 19px;
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--text-dim);

  :deep(svg) {
    width: 19px;
    height: 19px;
  }
}

.file-main {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14.5px;
  font-weight: 600;
  word-break: break-all;
  line-height: 1.4;

  :deep(mark) {
    background: color-mix(in srgb, var(--primary) 24%, transparent);
    color: inherit;
    border-radius: 3px;
    padding: 0 2px;
  }
}

.file-meta {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  align-items: center;
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 3px;

  .sep {
    opacity: 0.4;
  }
}

.file-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.state-box {
  padding: 56px 20px;
  text-align: center;
  color: var(--text-dim);

  .emoji {
    font-size: 40px;
    display: block;
    margin-bottom: 10px;
    opacity: 0.8;
    color: var(--text-faint);
  }

  .title {
    font-size: 15.5px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 5px;
  }
}

.skeleton {
  height: 62px;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--surface-2) 25%,
    var(--border) 50%,
    var(--surface-2) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 640px) {
  .file-item {
    flex-wrap: wrap;
    gap: 10px;
  }

  .file-icon {
    width: 34px;
    height: 34px;
    font-size: 17px;

    :deep(svg) {
      width: 17px;
      height: 17px;
    }
  }

  .file-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
