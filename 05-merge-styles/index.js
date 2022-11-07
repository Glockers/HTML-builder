const path = require("path");
const fs = require("fs/promises");
const { createReadStream, createWriteStream } = require("fs");

const stylesFolder = path.join(__dirname, "styles");
const projectDistFolder = path.join(__dirname, "test-files", "styles");
// dist
const srcBundle = path.join(__dirname, "project-dist", "bundle.css");

async function bundle() {
  fs.rm(srcBundle, { force: true });

  const folderStyle = (await fs.readdir(stylesFolder)).filter((file) => {
    const extname = file.split(".")[1];
    if (extname === "css") {
      return true;
    }
    return false;
  });

  const folderProject = (await fs.readdir(projectDistFolder)).filter((file) => {
    const extname = file.split(".")[1];
    if (extname === "css") {
      return true;
    }
    return false;
  });

  let bundleFile = createWriteStream(srcBundle, { flags: "a" });

  folderStyle.forEach((file) => {
    let readStream = createReadStream(path.join(stylesFolder, file), "utf-8");
    readStream.pipe(bundleFile);
  });

  folderProject.forEach((file) => {
    let readStream = createReadStream(
      path.join(projectDistFolder, file),
      "utf-8"
    );
    readStream.pipe(bundleFile);
  });

  //   console.log(folderStyle, folderProject);
}
bundle();
