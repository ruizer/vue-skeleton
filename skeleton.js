const fs = require('fs');
const { resolve } = require('path');
const htmlMinifier = require('html-minifier');

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer;

// 读取缓存的入口html
const html = fs.readFileSync(resolve(__dirname, './index.skeleton.html'), 'utf-8');
// 将入口html文件内容覆盖，实现自动化，防止没有标识不能写入skeleton模板
fs.writeFileSync(resolve(__dirname, './index.html'), html);

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
  fs.writeFileSync(resolve(__dirname, './index.html'), html, 'utf-8')
});

