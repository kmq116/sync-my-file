const socket = io();
const {createApp, ref} = Vue

createApp({
    setup() {

        socket.on('file-list', (files) => {
            updateFileList(files);
        });

        socket.on('file-added', (path) => {
            addFileToList(path);
        });

        socket.on('file-changed', (path) => {
            updateFileInList(path);
        });

        socket.on('file-deleted', (path) => {
            removeFileFromList(path);
        });

        function updateFileList(files) {
            console.log(files)
            files.forEach(file => {
                addFileToList(file);
            });
        }

        function addFileToList(file) {
            fileList.value.push(file)
        }

        function updateFileInList(file) {
            // 这里可以添加更新文件的逻辑，比如改变颜色等
            console.log('File updated:', file);
        }

        function removeFileFromList(file) {
            const index = fileList.value.findIndex(({fileUrl}) => fileUrl === file.fileUrl)
            console.log({index})
            if (index !== -1) {
                fileList.value.splice(index, 1)
            }
        }

        const fileList = ref([])

        function showQrCode(item) {
            axios.get('create-qrcode?text=' + item.fileUrl).then(res => {
                item.showQrCode = !item.showQrCode
                console.log(res.data.data);
                item.src = res.data.data.base64
            })
        }


        function download(item) {
            console.log(item)
            const url = item.fileUrl
            // 解析文件路径
            function parseFilePath(url) {
                var parser = document.createElement('a');
                parser.href = url;
                return parser.pathname;
            }

            // 获取文件名
            function getFileNameFromPath(filePath) {
                var pathArray = filePath.split('/');
                var fileName = pathArray.pop();
                return fileName;
            }

            // 获取文件类型
            function getFileType(fileName) {
                var fileExtension = fileName.split('.').pop();
                return fileExtension;
            }

            const filePath = parseFilePath(url);
            const fileName = getFileNameFromPath(filePath);
            const fileType = getFileType(fileName);
            console.log({filePath, fileName, fileType})
            // https://minio.tiananborui.com/dw-cloud/20240106/4deb2d6ff88140e6a745516f3e7d60e1.pdf
            var link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
        }

        return {
            fileList,
            showQrCode,
            download
        }
    }
}).mount('#app')
