$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot 'artifacts'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$sourceFiles = @('index.html', 'styles.css', 'catalogue.js', 'hub.js', 'assets', 'games', 'README.md') | ForEach-Object { Join-Path $projectRoot $_ }
$archivePath = Join-Path $outputDirectory 'mis-class-games.zip'
Compress-Archive -LiteralPath $sourceFiles -DestinationPath $archivePath -Force
Write-Output $archivePath
