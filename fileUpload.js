const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const syncDir = path.join(process.cwd(), 'sync');
    if (!fs.existsSync(syncDir)) {
      fs.mkdirSync(syncDir, { recursive: true });
    }
    cb(null, syncDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// 文件上传接口
router.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file)
  if (!req.file) {
    return res.status(400).json({
      code: 400,
      data: null,
      msg: '没有文件上传'
    });
  }

  res.status(200).json({
    code: 200,
    data: {
      filename: req.file.filename,
      path: req.file.path
    },
    msg: '文件上传成功'
  });
});

module.exports = router;
