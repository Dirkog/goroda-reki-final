# Показ сайта на этом компьютере: сборка и локальный сервер.
# Запуск (PowerShell):
#   powershell -ExecutionPolicy Bypass -File server\serve-pc.ps1
# Что делает:
#   1) собирает сайт из текущих исходников (главный адрес - российский);
#   2) поднимает локальный сервер: страницы, картинки, фильм с перемоткой, приём заявок;
#   3) открывает сайт в браузере.
# Сервер работает, пока компьютер включён. Остановить: server\stop-pc.ps1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $PSScriptRoot 'serve-pc.log'
function Say($text) {
  $line = "$text"
  Write-Output $line
  Add-Content -Path $logPath -Value $line -Encoding UTF8
}

Set-Location $root
$port = '8770'
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

# файл запуска: в нём прописаны пути и порт
$cmdFile = Join-Path $PSScriptRoot 'run-server.cmd'
$cmdLines = @(
  '@echo off',
  "set `"SITE_ROOT=$root\dist`"",
  "set `"PORT=$port`"",
  "set `"HOST=0.0.0.0`"",
  "cd /d `"$root`"",
  "node `"server\server.mjs`" >> `"$PSScriptRoot\server.log`" 2>&1"
)
$cmdLines | Set-Content -Path $cmdFile -Encoding ASCII

# запуск через службу WMI: процесс не закрывается вместе с этим окном
$command = 'cmd.exe /c ""' + $cmdFile + '""'
$res = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $command }
if ($res.ReturnValue -ne 0) { throw "сервер не запустился (код $($res.ReturnValue))" }
$res.ProcessId | Set-Content $pidFile
Start-Sleep -Seconds 3
Say "сервер запущен: http://127.0.0.1:$port (процесс $($res.ProcessId))"

try {
  $health = Invoke-WebRequest -Uri "http://127.0.0.1:$port/api/health" -UseBasicParsing -TimeoutSec 10
  Say "проверка: $($health.Content)"
  $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' } | Select-Object -First 1).IPAddress
  if ($ip) { Say "адрес для телефона в той же сети: http://${ip}:$port/" }
} catch {
  Say "сервер не ответил на проверку: $($_.Exception.Message)"
}

Start-Process "http://127.0.0.1:$port/"
Say 'готово: сайт открыт в браузере'
