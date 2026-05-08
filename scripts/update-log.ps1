# update-log.ps1 - Update PROJECT_LOG.md before git push
# Adds new commits not yet recorded in the history section

$logFile = Join-Path $PSScriptRoot "..\PROJECT_LOG.md"
$logFile = (Resolve-Path $logFile).Path

# Get all commits: hash|date|subject
$commits = git log --pretty=format:"%H|%ad|%s" --date=short | ForEach-Object {
    $parts = $_ -split "\|", 3
    [PSCustomObject]@{ Hash = $parts[0]; ShortHash = $parts[0].Substring(0,7); Date = $parts[1]; Subject = $parts[2] }
}

# Read current file
$content = [System.IO.File]::ReadAllText($logFile, [System.Text.UTF8Encoding]::new($false))

# Find hashes already in the file
$existingHashes = [System.Collections.Generic.HashSet[string]]::new()
$regexMatches = [regex]::Matches($content, '`([0-9a-f]{7})`')
foreach ($m in $regexMatches) { $null = $existingHashes.Add($m.Groups[1].Value) }

# Filter only new commits
$newCommits = $commits | Where-Object { -not $existingHashes.Contains($_.ShortHash) }

if ($newCommits.Count -eq 0) {
    Write-Host "PROJECT_LOG.md: no new commits to add"
    exit 0
}

# Group new commits by date
$grouped = $newCommits | Group-Object -Property Date | Sort-Object Name

# Build markdown block for new commits
$newSection = ""
foreach ($group in $grouped) {
    $newSection += "`n### $($group.Name)`n"
    foreach ($c in $group.Group) {
        $newSection += "`n**``$($c.ShortHash)``** - $($c.Subject)`n- (add details here)`n"
    }
}
$newSection += "`n"

# Insert new commits before the Features section
$insertMarker = "## Features"
if ($content.Contains($insertMarker)) {
    $content = $content.Replace($insertMarker, ($newSection + "---`n`n" + $insertMarker))
}

# Update "Last updated" date
$today = Get-Date -Format "yyyy-MM-dd"
$content = [regex]::Replace($content, "> Last updated: \d{4}-\d{2}-\d{2}", "> Last updated: $today")

# Write back (UTF-8 no BOM)
[System.IO.File]::WriteAllText($logFile, $content, [System.Text.UTF8Encoding]::new($false))

# Stage the file
git add PROJECT_LOG.md

Write-Host "PROJECT_LOG.md: updated ($($newCommits.Count) new commits) and staged"