$brainDir = "$env:USERPROFILE\.gemini\antigravity\brain\dce758e7-4070-4b73-b302-19d813d9e6c0"
$publicDir = "C:\Users\micha\.antigravity\v0-plumbing-landing-page\public"

$src1 = Join-Path $brainDir "media__1773347264307.png"
$dst1 = Join-Path $publicDir "pipe-before.png"

$src2 = Join-Path $brainDir "media__1773347274891.png"
$dst2 = Join-Path $publicDir "plumber-after.png"

Copy-Item $src1 $dst1 -Force
Copy-Item $src2 $dst2 -Force

Write-Host "Copied: pipe-before.png"
Write-Host "Copied: plumber-after.png"
