# Node.js 文件分享应用

这个 Node.js 应用可以将指定目录下的文件分享给其他设备，通过生成二维码和提供下载链接的方式，方便局域网内快速分享文件。

## 功能特点
- 将指定目录下的文件分享给其他设备
- 通过生成二维码的方式分享文件链接
- 扫描二维码即可下载对应文件

## 直接使用
- 下载 Release 中的 .zip 压缩包，然后解压，双击 server.exe 即可

## 本地运行方法
1. 克隆或下载本仓库到本地
2. 在终端进入项目目录，运行 `npm install` 安装依赖
3. 将需要分享的文件放置在 `sync` 文件夹中
4. 运行 `node server.js` 启动应用
5. 在浏览器中访问 `http://localhost:8899` 查看分享页面
6. 确保分享设备和接收设备连接同一个 WiFi
7. 可以通过扫描生成的二维码分享文件

## 技术栈
- Node.js
- Express
- QRCode.js

## 注意事项
- 请确保文件夹中的文件需要分享，并遵守法律法规
- 请在安全可信的网络环境下使用此应用，确保文件传输安全

## 联系方式
如有问题或建议，欢迎联系：your_email@example.com

感谢使用！
