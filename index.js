const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');
const { program } = require('commander');

function progressText(text) {
  const letterText = text.replaceAll(/[^a-zA-Z].*?/g, ',');
  let wordsArr = letterText.split(',');
  const wordsSet = new Set(wordsArr);
  wordsArr = Array.from(wordsSet);
  const wordsText = wordsArr.join(',');
  return wordsText;
}

async function main() {
  program.option('-p, --path <path>', '文件或文件夹路径');
  program.parse(process.argv);
  const options = program.opts();
  const path = options.path;
  // 检查是 文件 还是 文件夹
  const stat = await fsPromise.stat(path);
  const pathType = stat.isDirectory() ? 'directory' : 'file';
  console.log('TR: main -> pathType', pathType);
  // 待处理文件列表
  let filePathList = [];
  if (pathType === 'directory') {
    const files = await fsPromise.readdir(path);
    console.log('TR: main -> files', files);
    filePathList = files.map((item) => path + item);
  } else {
    filePathList.push(path);
  }
  filePathList.forEach((item) => {
    fsPromise.readFile(item, { encoding: 'utf8' }).then((text) => {
      const words = progressText(text);
      fsPromise.writeFile(item + '.txt', words);
    });
  });
}

main();
