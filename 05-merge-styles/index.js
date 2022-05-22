const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const stylesDirPath = path.join(__dirname, 'styles');

async function mergeStyles(stylesDirPath, projectDistPath) {
  try {
    const bundle = fs.createWriteStream(path.join(projectDistPath, 'bundle.css'));
    const stylesFiles = await fs.promises.readdir(stylesDirPath, {withFileTypes: true});
    stylesFiles.forEach((file) => {
      if (file.isFile() && path.extname(path.join(stylesDirPath, file.name)) === '.css') {
        const data = fs.createReadStream(path.join(stylesDirPath, file.name), 'utf-8');
        data.pipe(bundle);
        console.log(`${file.name} merged to bundle.css`);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

mergeStyles(stylesDirPath, projectDistPath);