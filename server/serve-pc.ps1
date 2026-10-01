# Показ сайта на этом компьютере: сборка и локальный сервер.
# Запуск (PowerShell):
#   powershell -ExecutionPolicy Bypass -File server\serve-pc.ps1
# Что делает:
#   1) собирает сайт из текущих исходников (адрес главной версии — российский);
#   2) поднимает локальный сервер (server.mjs): страницы, картинки, фильм с перемоткой, приём заявок;
#   3) открывает сайт в браузере.
# Сервер продолжает работать после закрытия окна: остановить — server\stop-pc.ps1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$port = if ($env:PORT) { $env:PORT } else { '8770' }
$log = Join-Path $root 'server\serve-pc.log'
$pidFile = Join-Path $root 'server\serve-pc.pid'

Write-Host "→ каталог проекта: $root"

if (-not (Test-Path (Join-Path $root 'node_modules\vite'))) {
  Write-Host '→ ставлю зависимости (npm ci)'
  npm ci --no-audit --no-fund
}

Write-Host '→ сборка сайта'
$env:BASE_PATH = '/'
$env:VITE_SITE_ORIGIN = 'https://ivanmonaenkov3.sourcecraft.site'
$env:VITE_CANONICAL_BASE = '/olgatour/'
$env:PRERENDER_MIRROR = '1'
npm run build

if (-not (Test-Path (Join-Path $root 'dist\index.html'))) { throw 'сборка не дала dist\index.html' }

Write-Host "→ запускаю сервер на http://127.0.0.1:$port"
$env:SITE_ROOT = Join-Path $root 'dist'
$env:PORT = $port
$env:HOST = '127.0.0.1'
$proc = Start-Process -FilePath 'node' -ArgumentList (Join-Path $root 'server\server.mjs') `
  -WindowStyle Hidden -PassThru -RedirectStandardOutput $log -RedirectStandardError "$log.err"
$proc.Id | Set-Content $pidFile
Start-Sleep -Seconds 2

try {
  $health = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/health" -UseBasicParsing -TimeoutSec 10
  Write-Host "→ сервер отвечает: $($health.Content)"
} catch {
  Write-Host "! сервер не ответил на проверку — смотрю журнал"
  if (Test-Path $log) { Get-Content $log -Tail 20 }
  if (Test-Path "$log.err") { Get-Content "$log.err" -Tail 20 }
}

Start-Process "http://127.0.0.1:$port/"
Write-Host "готово. Сайт открыт в браузере: http://127.0.0.1:$port/"
Write-Host "остановить сервер: powershell -ExecutionPolicy Bypass -File server\stop-pc.ps1"
