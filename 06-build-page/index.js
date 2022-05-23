const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const pagePath = path.join(__dirname, 'template.html');
const componentsDirPath = path.join(__dirname, 'components');
const stylesDirPath = path.join(__dirname, 'styles');
const assetsDirPath = path.join(__dirname, 'assets');

async function createHTML(pagePath, componentsDirPath) {
  try {
    const streamTemplate = fs.createReadStream(pagePath, 'utf-8');
    let dataTemplate = '';
    streamTemplate.on('data', chunk => dataTemplate += chunk);
    streamTemplate.on('end', async () => {
      const components = await fs.promises.readdir(componentsDirPath, {withFileTypes: true});
      components.forEach((component) => {
        const streamComponents = fs.createReadStream(path.join(componentsDirPath, component.name), 'utf-8');
        const componentName = path.basename(path.join(componentsDirPath, component.name), '.html');
        let dataComponents = '';
        streamComponents.on('data', chunk => dataComponents += chunk);
        streamComponents.on('end', () => {
          dataTemplate = dataTemplate.replace(`{{${componentName}}}`, dataComponents);
          const output = fs.createWriteStream(path.join(projectDistPath, 'index.html'));
          output.write(dataTemplate);
          console.log(`${component.name} merged to index.html`);
        });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
}
  
async function mergeStyles(stylesDirPath, projectDistPath) {
  try {
    const style = fs.createWriteStream(path.join(projectDistPath, 'style.css'));
    const stylesFiles = await fs.promises.readdir(stylesDirPath, {withFileTypes: true});
    stylesFiles.forEach((file) => {
      if (file.isFile() && path.extname(path.join(stylesDirPath, file.name)) === '.css') {
        const data = fs.createReadStream(path.join(stylesDirPath, file.name), 'utf-8');
        data.pipe(style);
        console.log(`${file.name} merged to style.css`);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

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
  
async function buildPage(projectDistPath, pagePath, componentsDirPath, stylesDirPath, assetsDirPath) {
  try {
    await fs.promises.rm(projectDistPath, {recursive: true, force: true});
    await fs.promises.mkdir(projectDistPath, {recursive: true});
    createHTML(pagePath, componentsDirPath);
    mergeStyles(stylesDirPath, projectDistPath);
    copyDirectory(assetsDirPath, path.join(projectDistPath, 'assets'));
    console.log('Page has been built successfully');
  } catch (error) {
    console.error(error);
  }
}

buildPage(projectDistPath, pagePath, componentsDirPath, stylesDirPath, assetsDirPath);