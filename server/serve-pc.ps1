# Показ сайта на этом компьютере: сборка и локальный сервер.
# Запуск (PowerShell):
#   powershell -ExecutionPolicy Bypass -File server\serve-pc.ps1
# Что делает:
#   1) собирает сайт из текущих исходников (главный адрес - российский);
#   2) поднимает локальный сервер (server.mjs): страницы, картинки, фильм с перемоткой, приём заявок;
#   3) открывает сайт в браузере.
# Остановить сервер: server\stop-pc.ps1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $PSScriptRoot 'serve-pc.log'
function Say($text) {
  $line = "$text"
  Write-Output $line
  Add-Content -Path $logPath -Value $line -Encoding UTF8
}

Set-Location $root
$port = if ($env:PORT) { $env:PORT } else { '8770' }
$pidFile = Join-Path $PSScriptRoot 'serve-pc.pid'
Set-Content -Path $logPath -Value "запуск $(Get-Date -Format s)" -Encoding UTF8

Say "каталог проекта: $root"
if (-not (Test-Path (Join-Path $root 'node_modules\vite'))) {
  Say 'ставлю зависимости (npm ci)'
  npm ci --no-audit --no-fund 2>&1 | ForEach-Object { Add-Content -Path $logPath -Value $_ -Encoding UTF8 }
}

Say 'сборка сайта'
$env:BASE_PATH = '/'
$env:VITE_SITE_ORIGIN = 'https://ivanmonaenkov3.sourcecraft.site'
$env:VITE_CANONICAL_BASE = '/olgatour/'
$env:PRERENDER_MIRROR = '1'
npm run build 2>&1 | ForEach-Object { Add-Content -Path $logPath -Value $_ -Encoding UTF8 }

if (-not (Test-Path (Join-Path $root 'dist\index.html'))) { throw 'сборка не дала dist\index.html' }
Say "сборка готова: $(Get-Item (Join-Path $root 'dist\index.html') | Select-Object -ExpandProperty LastWriteTime)"

$env:SITE_ROOT = Join-Path $root 'dist'
$env:PORT = $port
$env:HOST = '127.0.0.1'
$proc = Start-Process -FilePath 'node' -ArgumentList (Join-Path $PSScriptRoot 'server.mjs') -WindowStyle Hidden -PassThru
$proc.Id | Set-Content $pidFile
Start-Sleep -Seconds 3
Say "сервер запущен, номер процесса $($proc.Id), адрес http://127.0.0.1:$port"

try {
  $health = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/health" -UseBasicParsing -TimeoutSec 10
  Say "проверка: $($health.Content)"
} catch {
  Say "сервер не ответил на проверку: $($_.Exception.Message)"
}

Start-Process "http://127.0.0.1:$port/"
Say "готово: сайт открыт в браузере"
