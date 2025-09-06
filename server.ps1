# 简单的PowerShell HTTP服务器

$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "服务器已启动在 http://localhost:$port"
Write-Host "按 Ctrl+C 停止服务器"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # 获取请求的文件路径
        $filePath = $request.Url.LocalPath
        
        # 默认请求根路径时返回index.html
        if ($filePath -eq '/') {
            $filePath = '/index.html'
        }
        
        # 构建完整的文件路径
        $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $filePath.Substring(1)
        
        # 检查文件是否存在
        if (Test-Path -Path $fullPath -PathType Leaf) {
            # 获取文件扩展名以设置正确的MIME类型
            $extension = [System.IO.Path]::GetExtension($fullPath)
            $mimeType = switch ($extension) {
                '.html' { 'text/html' }
                '.css' { 'text/css' }
                '.js' { 'application/javascript' }
                '.json' { 'application/json' }
                '.png' { 'image/png' }
                '.jpg' { 'image/jpeg' }
                '.gif' { 'image/gif' }
                '.svg' { 'image/svg+xml' }
                default { 'application/octet-stream' }
            }
            
            # 读取文件内容并发送响应
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $mimeType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            # 文件不存在，返回404错误
            $response.StatusCode = 404
            $content = [System.Text.Encoding]::UTF8.GetBytes("404 - 文件未找到")
            $response.ContentType = 'text/plain'
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}