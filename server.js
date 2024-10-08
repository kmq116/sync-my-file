const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const QRCode = require('qrcode')
const os = require('os');
const portfinder = require('portfinder');
const open = require('open');

(async () => {


    function getIPv4Address() {
        const interfaces = os.networkInterfaces();
        for (const interfaceName in interfaces) {
            const _interface = interfaces[interfaceName];
            for (const network of _interface) {
                if (network.family === 'IPv4' && !network.internal) {
                    return network.address;
                }
            }
        }
        return null;
    }

    const ipv4Address = getIPv4Address();
    console.log('IPv4 地址:', ipv4Address);

    const syncDir = path.join(process.cwd(), 'sync');

    app.use(express.static('public'));
    app.use(express.static('sync'));

    // 确保同步目录存在
    if (!fs.existsSync(syncDir)) {
        fs.mkdirSync(syncDir);
    }

    // 设置文件监视器
    const watcher = chokidar.watch(syncDir, {
        ignored: /(^|[\/\\])\../, // 忽略点文件
        persistent: true
    });

    const genFilePath = (fPath) => {
        return { fileUrl: `http://${ipv4Address}:${PORT}/${path.basename(fPath)}` }
    }
    watcher
        .on('add', __path => {
            io.emit('file-added', genFilePath(__path))
        })
        .on('change', path => io.emit('file-changed', genFilePath(path)))
        .on('unlink', path => io.emit('file-deleted', genFilePath(path)));


    app.get('/create-qrcode', async (req, res) => {
        const text = req.query.text
        if (!text) {
            return res.status(400).send({
                code: 400,
                data: 'Missing required parameter: text',
                msg: '缺字段',
            })
        }

        try {
            const qrCodeBase64 = await QRCode.toDataURL(text, { width: 220, margin: 1 })
            return res.send({
                code: 200,
                data: {
                    base64: qrCodeBase64,
                },
                msg: '成功',
            })
        } catch (error) {
            console.error(error)
            return res.status(500).send({
                code: 500,
                data: 'Failed to generate QR code.',
                msg: '',
            })
        }
    })
    portfinder.setBasePort(8899);    // default: 8000

    // const {default: getPort} = await import('get-port')
    const __port = await portfinder.getPortPromise();
    console.log({ __port })

    const PORT = process.env.PORT || __port;
    io.on('connection', (socket) => {
        console.log('A user connected');

        // 发送当前文件列表
        fs.readdir(syncDir, (err, files) => {
            if (err) throw err;
            console.log({ files });
            socket.emit('file-list', files.map(fileName => ({ fileUrl: `http://${ipv4Address}:${PORT}/${fileName}` })));
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    server.listen(PORT, () => {
        const url = `http://${ipv4Address}:${PORT}`
        console.log(`Server running on ${url}`)
        console.log({ url });
        open(url)
    });

})()


