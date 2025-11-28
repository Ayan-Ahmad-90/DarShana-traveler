# AI Mood Analyzer - Verification Script (Windows PowerShell)
# Run this to verify all files are created correctly

Write-Host "VERIFICATION: Verifying AI Mood Analyzer Implementation..." -ForegroundColor Cyan
Write-Host ""

$filesFound = 0
$filesExpected = 8

Write-Host "FRONTEND FILES:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow

# Frontend files
$frontendFiles = @(
    "src/pages/MoodAnalyzer.tsx",
    "src/hooks/useFaceDetection.ts",
    "src/services/moodApi.ts",
    "src/data/destinations.ts",
    "src/types/moodAnalyzer.ts"
)

foreach ($file in $frontendFiles) {
    $fullPath = Join-Path -Path (Get-Location) -ChildPath $file
    if (Test-Path $fullPath) {
        $size = (Get-Content $fullPath | Measure-Object -Line).Lines
        Write-Host "[OK] $file ($size lines)" -ForegroundColor Green
        $filesFound++
    } else {
        Write-Host "[MISSING] $file (NOT FOUND)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "BACKEND FILES:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow

# Backend files
$backendFiles = @(
    "backend/src/routes/moodAnalyzer.ts",
    "backend/src/controllers/moodAnalyzerController.ts",
    "backend/src/services/emotionService.ts"
)

foreach ($file in $backendFiles) {
    $fullPath = Join-Path -Path (Get-Location) -ChildPath $file
    if (Test-Path $fullPath) {
        $size = (Get-Content $fullPath | Measure-Object -Line).Lines
        Write-Host "[OK] $file ($size lines)" -ForegroundColor Green
        $filesFound++
    } else {
        Write-Host "[MISSING] $file (NOT FOUND)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "DOCUMENTATION FILES:" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow

# Documentation files
$docFiles = @(
    "AI_MOOD_ANALYZER_SETUP.md",
    "INTEGRATION_CHECKLIST.md",
    "BACKEND_INTEGRATION.md",
    "QUICK_START_AI_MOOD_ANALYZER.md"
)

foreach ($file in $docFiles) {
    $fullPath = Join-Path -Path (Get-Location) -ChildPath $file
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length / 1KB
        Write-Host "[OK] $file (${size}KB)" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $file (NOT FOUND)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "DEPENDENCY CHECK:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

Write-Host "Frontend dependencies:" -ForegroundColor Cyan
$pkgContent = Get-Content -Path "package.json" -Raw
if ($pkgContent -match "face-api\.js") {
    Write-Host "[OK] face-api.js found in package.json" -ForegroundColor Green
} else {
    Write-Host "[MISSING] face-api.js NOT in package.json" -ForegroundColor Red
}

if ($pkgContent -match "@tensorflow/tfjs") {
    Write-Host "[OK] @tensorflow/tfjs found in package.json" -ForegroundColor Green
} else {
    Write-Host "[MISSING] @tensorflow/tfjs NOT in package.json" -ForegroundColor Red
}

Write-Host ""
Write-Host "BACKEND DEPENDENCIES:" -ForegroundColor Cyan
$backendPkgPath = Join-Path -Path (Get-Location) -ChildPath "backend/package.json"
if (Test-Path $backendPkgPath) {
    $backendPkgContent = Get-Content -Path $backendPkgPath -Raw
    if ($backendPkgContent -match "express") {
        Write-Host "[OK] Express found in backend package.json" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] Express NOT in backend package.json" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "MODEL FILES CHECK:" -ForegroundColor Yellow
Write-Host "====================" -ForegroundColor Yellow

$modelsPath = Join-Path -Path (Get-Location) -ChildPath "public/models"
if (Test-Path $modelsPath) {
    $count = (Get-ChildItem -Path $modelsPath -File | Measure-Object).Count
    Write-Host "[OK] public/models/ directory exists ($count files)" -ForegroundColor Green
    if ($count -eq 0) {
        Write-Host "WARNING: Directory is empty - download models from:" -ForegroundColor Yellow
        Write-Host "   https://github.com/vladmandic/face-api/tree/master/model" -ForegroundColor Gray
    }
} else {
    Write-Host "WARNING: public/models/ directory does NOT exist" -ForegroundColor Yellow
    Write-Host "   Run: New-Item -ItemType Directory -Force -Path 'public/models'" -ForegroundColor Gray
}

Write-Host ""
Write-Host "BACKEND ROUTE CHECK:" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow

$backendIndexPath = Join-Path -Path (Get-Location) -ChildPath "backend/src/index.ts"
$backendServerPath = Join-Path -Path (Get-Location) -ChildPath "backend/server.js"

if ((Test-Path $backendIndexPath) -or (Test-Path $backendServerPath)) {
    $indexContent = Get-Content -Path $backendIndexPath -Raw 2>$null
    $serverContent = Get-Content -Path $backendServerPath -Raw 2>$null
    
    if (($indexContent -match "moodAnalyzer") -or ($serverContent -match "moodAnalyzer")) {
        Write-Host "[OK] moodAnalyzer routes already mounted" -ForegroundColor Green
    } else {
        Write-Host "WARNING: moodAnalyzer routes NOT yet mounted" -ForegroundColor Yellow
        Write-Host "   Add to backend/src/index.ts:" -ForegroundColor Gray
        Write-Host "   import moodAnalyzerRoutes from './routes/moodAnalyzer.js';" -ForegroundColor Cyan
        Write-Host "   app.use('/api/mood-analyze', moodAnalyzerRoutes);" -ForegroundColor Cyan
    }
} else {
    Write-Host "[MISSING] backend/src/index.ts or backend/server.js not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "ENVIRONMENT VARIABLES:" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow

$envLocalPath = Join-Path -Path (Get-Location) -ChildPath ".env.local"
$envPath = Join-Path -Path (Get-Location) -ChildPath ".env"

if ((Test-Path $envLocalPath) -or (Test-Path $envPath)) {
    $envContent = (Get-Content -Path $envLocalPath -Raw 2>$null) + (Get-Content -Path $envPath -Raw 2>$null)
    if ($envContent -match "VITE_API_URL") {
        Write-Host "[OK] VITE_API_URL configured" -ForegroundColor Green
    } else {
        Write-Host "WARNING: VITE_API_URL NOT in .env" -ForegroundColor Yellow
        Write-Host "   Create .env.local with:" -ForegroundColor Gray
        Write-Host "   VITE_API_URL=http://localhost:3001" -ForegroundColor Cyan
    }
} else {
    Write-Host "WARNING: No .env.local or .env file found" -ForegroundColor Yellow
    Write-Host "   Create .env.local with:" -ForegroundColor Gray
    Write-Host "   VITE_API_URL=http://localhost:3001" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "SUMMARY:" -ForegroundColor Yellow
Write-Host "===========" -ForegroundColor Yellow
Write-Host "Core Files Found: $filesFound / $filesExpected"

if ($filesFound -eq $filesExpected) {
    Write-Host "[OK] All core files present!" -ForegroundColor Green
} else {
    Write-Host "[MISSING] Missing $($filesExpected - $filesFound) files" -ForegroundColor Red
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan
Write-Host "1. Mount backend routes (see BACKEND_INTEGRATION.md)" -ForegroundColor White
Write-Host "2. Download face-api.js models to public/models/" -ForegroundColor White
Write-Host "3. Create .env.local with VITE_API_URL" -ForegroundColor White
Write-Host "4. Start backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "5. Start frontend: npm run dev" -ForegroundColor White
Write-Host "6. Visit /mood-analyzer route" -ForegroundColor White

Write-Host ""
Write-Host "DOCUMENTATION:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "- AI_MOOD_ANALYZER_SETUP.md - Complete setup guide" -ForegroundColor Gray
Write-Host "- INTEGRATION_CHECKLIST.md - Integration steps" -ForegroundColor Gray
Write-Host "- BACKEND_INTEGRATION.md - Code snippets" -ForegroundColor Gray
Write-Host "- QUICK_START_AI_MOOD_ANALYZER.md - Quick reference" -ForegroundColor Gray

Write-Host ""
Write-Host "[DONE] Verification complete!" -ForegroundColor Green
