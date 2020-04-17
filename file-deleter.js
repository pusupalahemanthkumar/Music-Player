const fs = require("fs");
const path=require('path');

const deleteFile = filePath => {
  const str = filePath;
  console.log(str);
  const fspath=path.join(__dirname,'public',str);
  fs.unlink(fspath, err => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;