/**
 * vite build 之后，把根目录的 file/ 拷贝进 dist/file/
 * 这样 dist/ 的结构就和你现在上传的结构完全一致
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const src = path.join(rootDir, 'file')
const dest = path.join(rootDir, 'dist', 'file')

if (!fs.existsSync(src)) {
  console.warn('⚠️  file/ 不存在，跳过拷贝')
  process.exit(0)
}
if (!fs.existsSync(path.join(rootDir, 'dist'))) {
  fs.mkdirSync(path.join(rootDir, 'dist'), { recursive: true })
}

fs.cpSync(src, dest, { recursive: true })
console.log('✅ file/ 已拷贝到 dist/file/')
