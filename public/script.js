
const socket = io();
const { createApp, ref } = Vue

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
      fileList.innerHTML = '';
      files.forEach(file => {
        addFileToList(file);
      });
    }

    function addFileToList(file) {
      console.log(file);
      fileList.value.push(file)
      console.log(fileList);
      // const li = document.createElement('li');
      // li.textContent = file;
      // fileList.appendChild(li);
    }

    function updateFileInList(file) {
      // 这里可以添加更新文件的逻辑，比如改变颜色等
      console.log('File updated:', file);
    }

    function removeFileFromList(file) {
      const items = fileList.getElementsByTagName('li');
      for (let item of items) {
        if (item.textContent === file) {
          fileList.removeChild(item);
          break;
        }
      }
    }

    const fileList = ref([])
    function showQrCode(item) {
      axios.get('create-qrcode?text=' + item.fileUrl).then(res => {
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
