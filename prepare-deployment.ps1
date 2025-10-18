# Deployment Preparation Script for Windows PowerShell

Write-Host "🚀 BaseMinter.fun - Deployment Preparation" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean build artifacts
Write-Host "📦 Step 1: Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✓ Removed .next folder" -ForegroundColor Green
}

# Step 2: Test build
Write-Host ""
Write-Host "🔨 Step 2: Testing production build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Build successful!" -ForegroundColor Green
} else {
    Write-Host "   ✗ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}

# Step 3: Create deployment package
Write-Host ""
Write-Host "📦 Step 3: Creating deployment package..." -ForegroundColor Yellow

$deployFolder = "deployment-package"
if (Test-Path $deployFolder) {
    Remove-Item -Recurse -Force $deployFolder
}
New-Item -ItemType Directory -Path $deployFolder | Out-Null

# Copy necessary files
Copy-Item -Path "src" -Destination "$deployFolder/src" -Recurse
Copy-Item -Path "public" -Destination "$deployFolder/public" -Recurse
Copy-Item -Path "contracts" -Destination "$deployFolder/contracts" -Recurse
Copy-Item -Path "scripts" -Destination "$deployFolder/scripts" -Recurse
Copy-Item -Path "artifacts" -Destination "$deployFolder/artifacts" -Recurse

# Copy config files
$configFiles = @(
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "tailwind.config.js",
    "postcss.config.mjs",
    "hardhat.config.js",
    ".env.production",
    "ecosystem.config.js"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "$deployFolder/$file"
    }
}

Write-Host "   ✓ Deployment package created in '$deployFolder' folder" -ForegroundColor Green

# Step 4: Create ecosystem.config.js if it doesn't exist
$ecosystemFile = "$deployFolder/ecosystem.config.js"
if (-not (Test-Path $ecosystemFile)) {
    @"
module.exports = {
  apps: [{
    name: 'baseminter',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/baseminter',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
"@ | Out-File -FilePath $ecosystemFile -Encoding UTF8
    Write-Host "   ✓ Created ecosystem.config.js" -ForegroundColor Green
}

# Step 5: Show summary
Write-Host ""
Write-Host "✅ Preparation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Compress the '$deployFolder' folder to a ZIP file" -ForegroundColor White
Write-Host "2. Upload to your Hostinger VPS via FileZilla/WinSCP" -ForegroundColor White
Write-Host "3. Follow HOSTINGER-DEPLOYMENT-GUIDE.md for server setup" -ForegroundColor White
Write-Host ""
Write-Host "📁 Deployment package location:" -ForegroundColor Yellow
Write-Host "   $(Get-Location)\$deployFolder" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Use FileZilla with SFTP to upload files to your VPS" -ForegroundColor Cyan
Write-Host ""

# Optional: Create ZIP file if 7-Zip is available
if (Get-Command "7z" -ErrorAction SilentlyContinue) {
    Write-Host "📦 Creating ZIP archive..." -ForegroundColor Yellow
    & 7z a -tzip "baseminter-deployment.zip" ".\$deployFolder\*" | Out-Null
    Write-Host "   ✓ Created baseminter-deployment.zip" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
