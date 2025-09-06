# TaskMaster.pro 网站部署指南

本指南将帮助您将待办事项列表网站部署到服务器上，使其可以通过网络访问。

## 项目概述

这是一个基于HTML、JavaScript和Tailwind CSS的现代待办事项列表应用，具有以下功能：
- 任务管理（添加、编辑、删除、完成）
- 任务过滤和排序
- 列表视图和日历视图切换
- 任务优先级设置
- 本地存储功能

## 部署方法

### 方法一：使用内置PowerShell服务器（适合快速测试）

项目已包含一个简单的PowerShell服务器脚本 `server.ps1`，适合在Windows环境下快速测试：

1. 在服务器上打开PowerShell
2. 导航到项目目录：
   ```powershell
   cd C:\Code
   ```
3. 运行服务器脚本：
   ```powershell
   .\server.ps1
   ```
4. 默认情况下，服务器将在端口8000上启动

**注意**：此方法仅适合测试，不推荐用于生产环境。

### 方法二：使用Node.js HTTP服务器（推荐）

使用Node.js的http-server包可以提供更稳定的服务：

1. 确保服务器上已安装Node.js：
   ```powershell
   node -v
   ```
   如果未安装，请从官网下载并安装：https://nodejs.org/

2. 全局安装http-server包：
   ```powershell
   npm install -g http-server
   ```

3. 导航到项目目录并启动服务器：
   ```powershell
   cd C:\Code
   http-server -p 8000
   ```

### 方法三：使用IIS（Windows服务器推荐）

对于Windows服务器，使用Internet Information Services (IIS)是更专业的选择：

1. 打开"服务器管理器"并安装IIS角色
2. 打开"Internet Information Services (IIS)管理器"
3. 右键点击"网站"并选择"添加网站"
4. 填写以下信息：
   - 网站名称：TaskMaster
   - 物理路径：C:\Code
   - 端口：80（或您选择的其他端口）
5. 点击"确定"完成网站创建
6. 现在可以通过服务器IP地址或域名访问网站

### 方法四：使用Nginx（Linux服务器推荐）

如果您的服务器运行Linux系统，可以使用Nginx：

1. 安装Nginx：
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. 将项目文件复制到Nginx的网站目录：
   ```bash
   sudo cp -r /path/to/Code /var/www/taskmaster
   ```

3. 创建Nginx配置文件：
   ```bash
   sudo nano /etc/nginx/sites-available/taskmaster
   ```

4. 添加以下配置（修改server_name和root路径）：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/taskmaster;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

5. 启用配置：
   ```bash
   sudo ln -s /etc/nginx/sites-available/taskmaster /etc/nginx/sites-enabled/
   ```

6. 检查配置并重启Nginx：
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 网络访问配置

### 端口开放

确保服务器上的防火墙已开放您选择的端口（默认为8000或80）：

- Windows防火墙：通过"高级安全Windows Defender防火墙"创建入站规则
- Linux防火墙（UFW）：
  ```bash
  sudo ufw allow 8000/tcp
  sudo ufw reload
  ```

### 域名配置（可选）

如果您有域名，需要将其指向服务器的IP地址：
1. 在域名注册商处添加A记录，指向服务器的公共IP地址
2. 根据您选择的部署方法，配置Web服务器的域名设置

### 配置HTTPS（推荐）

为了提高安全性，建议配置HTTPS：

- 使用Let's Encrypt获取免费SSL证书
- 在Web服务器（IIS或Nginx）中配置SSL证书

## 注意事项

1. 本应用使用浏览器的localStorage存储数据，数据仅保存在用户本地，不会同步到服务器
2. 如果需要实现数据同步功能，需要额外开发后端API和数据库
3. 对于生产环境，建议使用方法三或方法四进行部署
4. 定期备份您的网站文件，特别是在进行更新之前

## 常见问题排查

- **无法访问网站**：检查服务器IP、端口和防火墙设置
- **样式或功能异常**：确认所有文件都已正确复制，浏览器缓存已清除
- **本地存储问题**：某些浏览器可能限制localStorage的使用，特别是在隐私模式下

如需进一步帮助，请参考相关Web服务器的官方文档或寻求专业IT支持。