$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot 'artifacts'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$sourceFiles = @('index.html', 'styles.css', 'catalogue.js', 'hub.js', 'assets', 'games', 'docs', 'README.md') | ForEach-Object { Join-Path $projectRoot $_ }
$archivePath = Join-Path $outputDirectory 'mis-class-games.zip'
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$archiveStream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create)
try {
    $archive = [System.IO.Compression.ZipArchive]::new($archiveStream, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($sourcePath in $sourceFiles) {
            $entries = if (Test-Path -LiteralPath $sourcePath -PathType Container) {
                Get-ChildItem -LiteralPath $sourcePath -Recurse -File
            } else {
                Get-Item -LiteralPath $sourcePath
            }
            foreach ($entry in $entries) {
                # ZIP paths use forward slashes, including when created on Windows.
                $entryName = $entry.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $entry.FullName, $entryName) | Out-Null
            }
        }
    } finally {
        $archive.Dispose()
    }
} finally {
    $archiveStream.Dispose()
}
Write-Output $archivePath
