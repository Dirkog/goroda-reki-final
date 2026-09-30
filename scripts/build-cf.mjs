#!/usr/bin/env node
// Сборка под Cloudflare Pages (корень домена) с правильным canonical/OG/sitemap.
import { spawnSync } from 'node:child_process'
process.env.BASE_PATH = '/'
process.env.VITE_SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://goroda-reki.pages.dev'
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', env: process.env }); if (r.status) process.exit(r.status) }
run('npm', ['run', 'build'])
