import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FILE_DIR = path.join(__dirname, 'file')

export function fileServerPlugin(): Plugin {
  return {
    name: 'vite-plugin-file-server',
    configureServer(server) {
      server.middlewares.use('/file', (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()

        const filePath = path.join(FILE_DIR, path.basename(req.url!))

        if (!fs.existsSync(filePath)) return next()

        const content = fs.readFileSync(filePath, 'utf-8')
        const filename = path.basename(req.url!)

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`,
        )
        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.end(content)
      })
    },
  }
}
