@echo off
setlocal

if "%~1"=="" (
    echo Usage: bin\version.bat [major|minor|patch]
    exit /b 1
)

powershell -Command "$p = Get-Content package.json | ConvertFrom-Json; $v = [version]$p.version; $newV = if ('%~1' -eq 'major') { '{0}.0.0' -f ($v.Major + 1) } elseif ('%~1' -eq 'minor') { '{0}.{1}.0' -f $v.Major, ($v.Minor + 1) } elseif ('%~1' -eq 'patch') { '{0}.{1}.{2}' -f $v.Major, $v.Minor, ($v.Build + 1) }; $p.version = $newV; $p | ConvertTo-Json -Depth 10 | Set-Content package.json; Write-Host 'Version updated to' $newV"
