$studioPath = "C:\Pro" + "gram Files\Android\Andr" + "oid Studio\bin\stu" + "dio64.exe"
if (Test-Path $studioPath) {
    Start-Process -FilePath $studioPath -ArgumentList "C:\Users\User\.gemini\antigravity\scratch\trade-journal\android"
    Write-Output "Started $studioPath"
} else {
    Write-Output "Studio not found"
}
