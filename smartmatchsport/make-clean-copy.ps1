param(
    [Parameter(Mandatory = $true)]
    [string]$Destination,

    [switch]$IncludeBuild
)

$ErrorActionPreference = 'Stop'

$Source = Split-Path -Parent $MyInvocation.MyCommand.Path
$Destination = [System.IO.Path]::GetFullPath($Destination)

if ($Source -eq $Destination) {
    throw 'Destination cannot be the same as source folder.'
}

if (-not (Test-Path -LiteralPath $Source)) {
    throw "Source folder not found: $Source"
}

if (-not (Test-Path -LiteralPath $Destination)) {
    New-Item -ItemType Directory -Path $Destination | Out-Null
}

$excludeDirs = @(
    'node_modules',
    '.git',
    '.idea',
    '.vscode',
    '.next',
    'dist',
    'coverage'
)

if (-not $IncludeBuild) {
    $excludeDirs += 'build'
}

Write-Host "Source      : $Source"
Write-Host "Destination : $Destination"
Write-Host "Exclude dirs: $($excludeDirs -join ', ')"

$robocopyArgs = @(
    $Source,
    $Destination,
    '/E',
    '/R:1',
    '/W:1',
    '/NFL',
    '/NDL',
    '/NJH',
    '/NJS',
    '/NP',
    '/XD'
) + $excludeDirs

& robocopy @robocopyArgs | Out-Host
$exitCode = $LASTEXITCODE

# Robocopy exit codes 0-7 mean success (including extra files/mismatches copied).
if ($exitCode -gt 7) {
    throw "Robocopy failed with exit code $exitCode"
}

Write-Host ''
Write-Host 'Clean copy completed successfully.' -ForegroundColor Green
Write-Host 'Run npm install in the destination before starting the app.' -ForegroundColor Yellow
