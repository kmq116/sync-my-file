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

        const message = ref('Hello vue!')
        return {
            message,
            fileList,
            showQrCode
        }
    }
}).mount('#app')
