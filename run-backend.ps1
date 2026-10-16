$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\startupsync-backend"
java -jar ".\target\startupsync-backend-1.0.0.jar" --spring.profiles.active=dev *>&1 | Tee-Object -FilePath ".\backend-server.log"
