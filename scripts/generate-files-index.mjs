/**
 * 扫描项目根目录的 file/ 目录，生成 public/files.json 索引
 * 每次 npm run build 前自动执行
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const fileDir = path.join(rootDir, 'file')
const publicDir = path.join(rootDir, 'public')

// 需要排除的文件（Pages 特殊文件 / 隐藏文件）
const SKIP_NAMES = new Set(['_headers', '_redirects', '_routes.json', '.gitkeep'])
function shouldSkip(name) {
  return SKIP_NAMES.has(name) || name.startsWith('.')
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function walk(dir, base = '') {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    if (shouldSkip(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    const relPath = base ? path.join(base, entry.name) : entry.name
    if (entry.isDirectory()) {
      result.push(...walk(fullPath, relPath))
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath)
      const normalized = relPath.replace(/\\/g, '/')
      result.push({
        name: entry.name,
        path: `/file/${normalized}`,
        size: formatBytes(stat.size),
        sizeBytes: stat.size,
        ext: path.extname(entry.name).slice(1).toLowerCase() || 'file',
        dir: '/' + normalized.split('/').slice(0, -1).join('/'),
        modified: stat.mtime.toISOString().slice(0, 10),
      })
    }
  }
  return result
}

if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir, { recursive: true })
  console.warn('⚠️  file/ 目录不存在，已自动创建，请把文件放进去后重新构建')
}
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

const files = walk(fileDir).sort((a, b) => b.modified.localeCompare(a.modified))
const totalSizeBytes = files.reduce((sum, f) => sum + f.sizeBytes, 0)

const output = {
  generatedAt: new Date().toISOString(),
  total: files.length,
  totalSize: formatBytes(totalSizeBytes),
  totalSizeBytes,
  files,
}

fs.writeFileSync(
  path.join(publicDir, 'files.json'),
  JSON.stringify(output, null, 2),
  'utf-8'
)
console.log(`✅ 索引已生成：${files.length} 个文件，总大小 ${output.totalSize}`)
