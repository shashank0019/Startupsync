$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\startupsync-frontend"
$env:BROWSER = "none"
npm.cmd start *>&1 | Tee-Object -FilePath ".\dev-server.log"
