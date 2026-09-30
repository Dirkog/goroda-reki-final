#!/usr/bin/env node
// Сборка для зеркала на GitHub Pages: base = /goroda-reki-final/, canonical —
// на основной адрес (olgatour.pages.dev), чтобы поисковики не считали это дублем.
import { spawnSync } from 'node:child_process'
process.env.BASE_PATH = '/goroda-reki-final/'
process.env.VITE_SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://olgatour.pages.dev'
process.env.VITE_CANONICAL_BASE = '/'
process.env.PRERENDER_MIRROR = '1'
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', env: process.env }); if (r.status) process.exit(r.status) }
run('npm', ['run', 'build'])
