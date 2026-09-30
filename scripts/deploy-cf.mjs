#!/usr/bin/env node
/*
  Сборка под корень домена (Cloudflare Pages) + деплой через wrangler.
  Требуется токен Cloudflare с правами «Cloudflare Pages: Edit»:
    $env:CLOUDFLARE_API_TOKEN = "..."      (PowerShell)
    npx wrangler pages deploy dist --project-name=goroda-reki
  Здесь всё то же самое, но одной командой: node scripts/deploy-cf.mjs [имя-проекта]
*/
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const project = process.argv[2] || 'goroda-reki'
process.env.BASE_PATH = '/'

function run(cmd, args) {
  console.log('→', cmd, args.join(' '))
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', env: process.env })
  if (r.status !== 0) process.exit(r.status || 1)
}

if (!fs.existsSync('node_modules')) run('npm', ['install', '--no-audit', '--no-fund'])
run('npm', ['run', 'build'])

const hasToken = !!(process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_AUTH_TOKEN)
if (process.env.CLOUDFLARE_AUTH_TOKEN && !process.env.CLOUDFLARE_API_TOKEN) {
  process.env.CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_AUTH_TOKEN
}
if (!hasToken) {
  console.log('\nНет переменной CLOUDFLARE_API_TOKEN — собрали dist/, но не задеплоили.')
  console.log('Создайте токен: dash.cloudflare.com → My Profile → API Tokens → Create Token → шаблон «Edit Cloudflare Workers» / права «Cloudflare Pages: Edit».')
  console.log('Затем: $env:CLOUDFLARE_API_TOKEN="<токен>"; node scripts/deploy-cf.mjs ' + project)
  process.exit(0)
}

run('npx', ['--yes', 'wrangler@latest', 'pages', 'deploy', 'dist',
  '--project-name=' + project, '--branch=main', '--commit-dirty=true'])
console.log('\nГотово. Домен вида: https://' + project + '.pages.dev')
