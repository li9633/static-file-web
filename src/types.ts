export interface FileItem {
  /** 文件名 */
  name: string
  /** 可直接下载的绝对路径，如 /file/xxx.conf */
  path: string
  /** 格式化后的体积，如 8.0 KB */
  size: string
  /** 原始字节数，用于排序 */
  sizeBytes: number
  /** 扩展名（小写，无点）；无扩展名时为 'file' */
  ext: string
  /** 所在目录，如 /sub/dir */
  dir: string
  /** 修改日期 YYYY-MM-DD */
  modified: string
}

export interface FilesIndex {
  generatedAt: string
  total: number
  totalSize: string
  totalSizeBytes: number
  files: FileItem[]
}
