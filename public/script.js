const socket = io();

const fileList = document.getElementById('file-list');

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
  const li = document.createElement('li');
  li.textContent = file;
  fileList.appendChild(li);
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