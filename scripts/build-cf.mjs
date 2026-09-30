#!/usr/bin/env node
// Сборка под корень домена (Cloudflare Pages / свой домен): BASE_PATH=/
import { spawnSync } from 'node:child_process'
process.env.BASE_PATH = '/'
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', env: process.env }); if (r.status) process.exit(r.status) }
run('npm', ['run', 'build'])
