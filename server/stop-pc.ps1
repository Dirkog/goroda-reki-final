# Остановка локального сервера сайта, запущенного через server\serve-pc.ps1
$root = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $root 'server\serve-pc.pid'
if (-not (Test-Path $pidFile)) { Write-Host 'сервер не запущен (нет файла с его номером)'; exit 0 }
$serverPid = (Get-Content $pidFile -Raw).Trim()
try {
  Stop-Process -Id $serverPid -Force -ErrorAction Stop
  Write-Host "сервер остановлен (номер $serverPid)"
} catch {
  Write-Host "процесс $serverPid уже не работает"
}
Remove-Item $pidFile -ErrorAction SilentlyContinue
