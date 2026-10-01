#!/usr/bin/env node
// Сборка копии сайта для «вторичного» адреса: свой путь (BASE_PATH) и canonical
// на главный адрес, чтобы поисковики не считали копию дублем.
//
//   BASE_PATH=/repo/  SITE_ORIGIN=https://главный-адрес  node scripts/build-mirror.mjs
import { spawnSync } from 'node:child_process'

process.env.BASE_PATH = process.env.BASE_PATH || '/'
process.env.VITE_SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://olgatour.pages.dev'
process.env.VITE_CANONICAL_BASE = '/'
process.env.PRERENDER_MIRROR = '1'

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', env: process.env })
  if (r.status) process.exit(r.status)
}
run('npm', ['run', 'build'])
