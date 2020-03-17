
const fs = require('fs');
const ejs = require('ejs');

const template = fs.readFileSync('app.tpl.yaml').toString();
const content = ejs.render(template, process.env);

try {
  fs.writeFileSync('app.yaml', content);
  console.log('app.yaml written successfully');
} catch (e) {
  console.error(`${JSON.stringify(e)}`);
};
