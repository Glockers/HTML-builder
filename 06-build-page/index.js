const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");

const pathDistFolder = path.join(__dirname, "project-dist");

async function replaceTemplate() {
  const pathComponentsFolder = path.join(__dirname, "components");
  const htmlFilesComponents = await readFolder(pathComponentsFolder);

  htmlFilesComponents.filter((file) => {
    if (
      !file.isDirectory() &&
      path.extname(file.name).toLocaleLowerCase() === ".html"
    ) {
      return true;
    }
    return false;
  });

  let templateFile = await readFile(path.join(__dirname, "template.html"));

  for (let file of htmlFilesComponents) {
    const pathFile = path.join(pathComponentsFolder, file.name);
    const replaceElement = file.name.replace(path.extname(file.name), "");
    const textComponentFile = await readFile(pathFile);
    templateFile = templateFile.replace(
      `{{${replaceElement}}}`,
      textComponentFile
    );
  }

  const bunldeIndex = fs.createWriteStream(
    path.join(pathDistFolder, "index.html"),
    "utf-8"
  );
  bunldeIndex.write(templateFile);
}

async function bundleCSS() {
   const pathStylesFolder = path.join(__dirname, "styles");
  const pathTestFilesFolder = path.join(__dirname, "test-files");
  const styleStyle = path.join(pathDistFolder, "style.css");

  const bunldeFileStyle = fs.createWriteStream(styleStyle, "utf-8");

  const styleFolder = (await readFolder(pathStylesFolder)).filter((file) => {
    if (
      !file.isDirectory() &&
      path.extname(file.name).toLocaleLowerCase() === ".css"
    ) {
      return true;
    }
    return false;
  });

  const testFileFolder = (
    await readFolder(path.join(pathTestFilesFolder, "styles"))
  ).filter((file) => {
    if (
      !file.isDirectory() &&
      path.extname(file.name).toLocaleLowerCase() === ".css"
    ) {
      return true;
    }
    return false;
  });

  for (let file of styleFolder) {
    const pathFile = path.join(pathStylesFolder, file.name);

    bunldeFileStyle.write(await readFile(pathFile));
  }

  for (let file of testFileFolder) {
    const pathFile = path.join(pathTestFilesFolder, "styles", file.name);
    bunldeFileStyle.write(await readFile(pathFile));
  }
}

async function copyDir(from, to) {
	const files = await readFolder(from);
	for (let file of files) {
		if (file.isFile()) {
			await fsPromise.copyFile(path.join(from, file.name), path.join(to, file.name));
		} else if (file.isDirectory()) {
			await fsPromise.mkdir(path.join(to, file.name), { recursive: true, force: true });
			await copyDir(path.join(from, file.name), path.join(to, file.name));
		}
	}
}


async function readFile(path) {
  const textComponentFile = (
    await fsPromise.readFile(path, {
      recursive: true,
      force: true,
      withFileTypes: true,
    })
  ).toString();
  return textComponentFile;
}

async function readFolder(path) {
  return await fsPromise.readdir(path, {
    recursive: true,
    force: true,
    withFileTypes: true,
  });
}

async function startBundle() {
  try {
    fsPromise.mkdir(pathDistFolder, { recursive: true, force: true });
    bundleCSS();
    replaceTemplate();
    copyDir(path.join(__dirname, "assets"), path.join(pathDistFolder, "assets"));
  } catch (error) {
    console.log(error);
  }
}


startBundle();