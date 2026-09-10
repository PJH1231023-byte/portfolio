# A dependency-free, loopback-only static server for the portable edition.
# Windows PowerShell 5.1 or newer. No administrator privileges are required.
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($PSScriptRoot).TrimEnd([IO.Path]::DirectorySeparatorChar)
$rootPrefix = $root + [IO.Path]::DirectorySeparatorChar
$sha = [Security.Cryptography.SHA256]::Create()
try { $rootToken = [BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($root))).Replace('-', '').ToLowerInvariant() }
finally { $sha.Dispose() }
$listener = $null
$port = 8877

function Open-Game([int]$gamePort) {
    Start-Process ('http://127.0.0.1:' + $gamePort + '/index.html')
}

function Send-Reply($stream, [int]$status, [string]$reason, [string]$mime, [byte[]]$body, [bool]$headOnly) {
    $header = "HTTP/1.1 $status $reason`r`nContent-Type: $mime`r`nContent-Length: $($body.Length)`r`nCache-Control: no-cache`r`nX-Content-Type-Options: nosniff`r`nReferrer-Policy: no-referrer`r`nConnection: close`r`n`r`n"
    $bytes = [Text.Encoding]::ASCII.GetBytes($header)
    $stream.Write($bytes, 0, $bytes.Length)
    if (-not $headOnly -and $body.Length -gt 0) { $stream.Write($body, 0, $body.Length) }
    $stream.Flush()
}

function Plain-Reply($stream, [int]$status, [string]$reason, [bool]$headOnly) {
    Send-Reply $stream $status $reason 'text/plain; charset=utf-8' ([Text.Encoding]::UTF8.GetBytes($reason)) $headOnly
}

for ($candidate = 8877; $candidate -le 8886; $candidate++) {
    $server = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $candidate)
    try {
        $server.Start()
        $listener = $server
        $port = $candidate
        break
    } catch {
        $server.Stop()
        # Reuse this exact game's server when the launcher is double-clicked again.
        $response = $null
        $reader = $null
        try {
            $request = [Net.WebRequest]::Create('http://127.0.0.1:' + $candidate + '/__identity')
            $request.Timeout = 700
            $request.Proxy = $null
            $response = $request.GetResponse()
            $reader = [IO.StreamReader]::new($response.GetResponseStream())
            $identity = $reader.ReadToEnd() | ConvertFrom-Json
            if ($identity.app -eq 'dream-guardians' -and $identity.root -eq $rootToken) {
                Open-Game $candidate
                return
            }
        } catch {
            # An occupied port may belong to an unrelated application. Leave it alone.
        } finally {
            if ($reader) { $reader.Dispose() }
            if ($response) { $response.Dispose() }
        }
    }
}

if (-not $listener) {
    Add-Type -AssemblyName PresentationFramework
    [Windows.MessageBox]::Show('Ports 8877-8886 are in use. Close another portable game window, wait for its server to stop, or serve this folder with your own local static server.', 'Dream Guardians') | Out-Null
    return
}

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css' = 'text/css; charset=utf-8'
    '.js' = 'text/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.webmanifest' = 'application/manifest+json; charset=utf-8'
    '.svg' = 'image/svg+xml'
    '.png' = 'image/png'
    '.jpg' = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.webp' = 'image/webp'
    '.ico' = 'image/x-icon'
    '.woff2' = 'font/woff2'
    '.wav' = 'audio/wav'
    '.mp3' = 'audio/mpeg'
}

$lastActivity = [DateTime]::UtcNow
try {
    Open-Game $port
    while (([DateTime]::UtcNow - $lastActivity).TotalMinutes -lt 30) {
        if (-not $listener.Pending()) { Start-Sleep -Milliseconds 50; continue }
        $client = $listener.AcceptTcpClient()
        $stream = $null
        $reader = $null
        try {
            $client.NoDelay = $true
            $stream = $client.GetStream()
            $stream.ReadTimeout = 2000
            $stream.WriteTimeout = 10000
            $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 4096, $true)
            $line = $reader.ReadLine()
            if (-not $line -or $line.Length -gt 8192 -or $line -notmatch '^([A-Z]+)\s+(\S+)\s+HTTP/1\.[01]$') {
                Plain-Reply $stream 400 'Bad Request' $false
                continue
            }
            $method = $Matches[1]
            $target = $Matches[2]
            $headOnly = $method -eq 'HEAD'
            $headerCount = 0
            do {
                $line = $reader.ReadLine()
                $headerCount++
                if ($headerCount -gt 100 -or ($line -and $line.Length -gt 8192)) { throw 'Request headers too large' }
            } while (-not [string]::IsNullOrEmpty($line))
            if ($method -ne 'GET' -and $method -ne 'HEAD') {
                Plain-Reply $stream 405 'Method Not Allowed' $headOnly
                continue
            }
            if (-not $target.StartsWith('/')) { Plain-Reply $stream 400 'Bad Request' $headOnly; continue }
            $path = [Uri]::UnescapeDataString(($target -split '\?', 2)[0])
            $lastActivity = [DateTime]::UtcNow
            if ($path -eq '/__identity') {
                $identity = '{"app":"dream-guardians","root":"' + $rootToken + '"}'
                Send-Reply $stream 200 'OK' 'application/json' ([Text.Encoding]::UTF8.GetBytes($identity)) $headOnly
                continue
            }
            if ($path -eq '/__heartbeat') {
                Send-Reply $stream 204 'No Content' 'text/plain' ([byte[]]@()) $headOnly
                continue
            }
            if ($path -eq '/') { $path = '/index.html' }
            $relative = $path.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
            if ($relative.Contains(':') -or $relative.Contains([char]0)) { Plain-Reply $stream 403 'Forbidden' $headOnly; continue }
            $filePath = [IO.Path]::GetFullPath([IO.Path]::Combine($root, $relative))
            if (-not $filePath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
                Plain-Reply $stream 403 'Forbidden' $headOnly
                continue
            }
            $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()
            if (-not $mimeTypes.ContainsKey($extension)) { Plain-Reply $stream 403 'Forbidden' $headOnly; continue }
            if (-not [IO.File]::Exists($filePath)) { Plain-Reply $stream 404 'Not Found' $headOnly; continue }
            $bytes = [IO.File]::ReadAllBytes($filePath)
            Send-Reply $stream 200 'OK' $mimeTypes[$extension] $bytes $headOnly
        } catch {
            # A disconnected tab or malformed local request must not stop the game server.
        } finally {
            if ($reader) { $reader.Dispose() }
            if ($stream) { $stream.Dispose() }
            $client.Dispose()
        }
    }
} finally {
    $listener.Stop()
}
