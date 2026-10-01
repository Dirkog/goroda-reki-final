# Остановка локального сервера сайта (запущенного через server\serve-pc.ps1)
$root = Split-Path -Parent $PSScriptRoot
$stopped = 0
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like '*server\server.mjs*' } | ForEach-Object {
  Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  $stopped += 1
}
Get-CimInstance Win32_Process -Filter "Name='cmd.exe'" | Where-Object { $_.CommandLine -like '*run-server.cmd*' } | ForEach-Object {
  Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}
if ($stopped -gt 0) { Write-Host "сервер остановлен (процессов: $stopped)" } else { Write-Host 'работающий сервер не найден' }
Remove-Item (Join-Path $PSScriptRoot 'serve-pc.pid') -ErrorAction SilentlyContinue
