/** 按扩展名返回 emoji 图标 */
export function fileIcon(ext: string): string {
  const map: Record<string, string> = {
    // 配置 / 脚本
    conf: '⚙️', config: '⚙️', sh: '🖥️', bash: '🖥️', bat: '🖥️', ps1: '🖥️',
    yml: '📋', yaml: '📋', toml: '📋', ini: '📋', env: '🔐',
    // 文档
    pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗',
    ppt: '📙', pptx: '📙', md: '📝', txt: '📄', csv: '📊', log: '📜',
    // 压缩包
    zip: '🗜️', rar: '🗜️', '7z': '🗜️', gz: '🗜️', tar: '🗜️', tgz: '🗜️',
    // 媒体
    png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🎨', ico: '🎨',
    mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬', webm: '🎬',
    mp3: '🎵', wav: '🎵', flac: '🎵', m4a: '🎵',
    // 开发
    json: '🧩', js: '📦', ts: '📦', vue: '💚', html: '🌐', css: '🎨',
    iso: '💿', exe: '🚀', dmg: '🍎', apk: '📱', deb: '📦', rpm: '📦',
    bin: '🔧', img: '💿', sql: '🗄️', db: '🗄️',
  }
  return map[ext] || '📄'
}

/** 转义 HTML，防止 XSS */
function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  })
}

/** 搜索关键词高亮，返回安全的 HTML 字符串 */
export function highlight(text: string, keyword: string): string {
  if (!keyword) return escapeHtml(text)
  const escaped = escapeHtml(text)
  const kw = escapeHtml(keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return escaped.replace(new RegExp(kw, 'gi'), (m) => `<mark>${m}</mark>`)
}

/** 可在浏览器内直接预览的类型 */
export function isPreviewable(ext: string): boolean {
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf', 'mp4', 'webm', 'txt', 'md'].includes(ext)
}
