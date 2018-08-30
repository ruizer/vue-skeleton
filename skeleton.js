const fs = require('fs');
const { resolve } = require('path');
const htmlMinifier = require('html-minifier');

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer;

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, 'utf-8', function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const writeFile = function (fileName, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fileName, data, function (error) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

(async function () {
  // 读取缓存的入口html
  const html = await readFile(resolve(__dirname, './index.skeleton.html'));
  // 将入口html文件内容覆盖，实现自动化，防止没有标识不能写入skeleton模板
  await writeFile(resolve(__dirname, './index.html'), html);

  // 读取`skeleton.json`，以`index.html`为模板写入内容
  const renderer = createBundleRenderer(resolve(__dirname, './dist/skeleton.json'), {
    template: fs.readFileSync(resolve(__dirname, './index.html'), 'utf-8')
  });

  // 把上一步模板完成的内容写入（替换）`index.html`
  renderer.renderToString({}, (err, html) => {
    html = htmlMinifier.minify(html, {
      collapseWhitespace: true,
      minifyCSS: true
    });
    fs.writeFileSync('index.html', html, 'utf-8')
  });
})();
