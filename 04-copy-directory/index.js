const { mkdir, unlink, readdir, copyFile} = require("fs");
const path = require("path");

const folderName = path.join(__dirname, "files");
const folderNameCopy = path.join(__dirname, "files-copy");

function checkExistDir(callback) {
  readdir(__dirname, { withFileTypes: true }, (error, fileArray) => {
    let flag = true;
    fileArray.forEach((file) => {
      if (file.name === "files-copy" && file.isDirectory()) {
        flag = false;
        callback(false);
      }
    });
    if (flag) {
      callback(true);
    }
  });
}

function createDir() {
  checkExistDir(result => {
    if (result) {
      mkdir(folderNameCopy, { recursive: true }, (err) => {
        if (err) return console.log(err);
        copyDir(folderName, folderNameCopy);
      });
    } else {
      readdir(folderNameCopy, (error, fileArray) => {
        if (error) return console.log(error.message);
        fileArray.forEach((file) => {

          const srcCopyFile = path.join(folderNameCopy, file);
          unlink(srcCopyFile, (error) => {
            if (error) return console.log(error.message);
          });
        });
        copyDir(folderName, folderNameCopy);
      });
    }
  });
  console.log("Succesful! Folder was copy!")
}

function copyDir(folder, copyFolder) {
  readdir(folderName, { withFileTypes: true }, (error, fileArr) => {
    if (error) console.log(error.message);
    fileArr.forEach((file) => {
      let srcFolder = path.join(folder, file.name);
      let srcCopyFolder = path.join(copyFolder, file.name);

      copyFile(srcFolder, srcCopyFolder, (error) => {
        if (error) {
          return console.log(error.message);
        }
      });
    });
  });
}

createDir();
