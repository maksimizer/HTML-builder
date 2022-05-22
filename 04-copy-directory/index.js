const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');

async function copyDirectory(dirPath, dirCopyPath) {
  try {
    await fs.promises.rm(dirCopyPath, { recursive: true, force: true });
    await fs.promises.mkdir(dirCopyPath, {recursive: true});
    const files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    files.forEach((file) => {
      if (file.isFile()) {
        fs.promises.copyFile(path.join(dirPath, file.name), path.join(dirCopyPath, file.name));
        console.log(`File ${file.name} hass been copied`);
      } else if (file.isDirectory()) {
        copyDirectory(path.join(dirPath, file.name), path.join(dirCopyPath, file.name));
        console.log(`Folder ${file.name} has been copied`);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

copyDirectory(dirPath, dirCopyPath);