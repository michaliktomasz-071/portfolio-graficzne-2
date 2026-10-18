# Minimalny statyczny serwer HTTP dla portfolio (czysty PowerShell, bez zależności).
$ErrorActionPreference = "Stop"
$port = 4323
$root = $PSScriptRoot

$types = @{
  ".html" = "text/html; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".pdf"  = "application/pdf"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".gif"  = "image/gif"
  ".ico"  = "image/x-icon"
  ".woff2"= "font/woff2"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Portfolio dziala: http://localhost:$port"

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  try {
    $urlPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($urlPath -eq "/") { $urlPath = "/index.html" }
    $relative = $urlPath.TrimStart("/")
    $filePath = Join-Path $root $relative
    $full = [System.IO.Path]::GetFullPath($filePath)

    # Fallback dla ładnych URL-i bez rozszerzenia (np. /projekty -> projekty.html).
    if ($full.StartsWith($root) -and -not (Test-Path $full -PathType Leaf)) {
      $idx = Join-Path $full "index.html"
      $asHtml = $full + ".html"
      if (Test-Path $idx -PathType Leaf) { $full = $idx }
      elseif (Test-Path $asHtml -PathType Leaf) { $full = $asHtml }
    }

    if (-not $full.StartsWith($root) -or -not (Test-Path $full -PathType Leaf)) {
      $res.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
    } else {
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $ct = $types[$ext]
      if (-not $ct) { $ct = "application/octet-stream" }
      $res.ContentType = $ct
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $res.StatusCode = 200
    }
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.OutputStream.Close()
  }
}
