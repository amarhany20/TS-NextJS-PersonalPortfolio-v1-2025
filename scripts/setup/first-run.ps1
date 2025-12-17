# First-run setup wrapper for Windows (Agent C)
# This script invokes the TypeScript interactive CLI using pnpm + tsx.

param(
  [switch]$NoDev
)

Write-Host "[first-run] Launching interactive setup (TypeScript CLI)..." -ForegroundColor Cyan

# Ensure pnpm is available
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Error "pnpm is not installed or not in PATH. Install from https://pnpm.io/installation"
  exit 1
}

# Run the TS CLI
$cmd = @('exec', 'tsx', 'scripts/setup/first-run.ts')
if ($NoDev) {
  # When NoDev is set, we rely on the TS CLI prompt to choose not to start dev
}

pnpm $cmd
if ($LASTEXITCODE -ne 0) {
  Write-Error "[first-run] Setup failed with exit code $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Host "[first-run] Setup completed." -ForegroundColor Green
