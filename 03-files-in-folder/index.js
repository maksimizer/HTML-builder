const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

async function getFilesInfo(dirPath) {
  try {
    const data  = await fs.promises.readdir(dirPath, {withFileTypes: true});
    data.forEach(file => {
      if (file.isFile()) {
        fs.stat(path.join(dirPath, file.name), (error, stats) => {
          if (error) {
            console.log(error.message);
          } else {
            const filePath = path.join(dirPath, file.name);
            console.log(`${path.parse(filePath).name} - ${path.extname(filePath).slice(1)} - ${stats.size}b`);
          }
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
getFilesInfo(dirPath);