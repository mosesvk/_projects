const fs = require('fs');

const file = 'src/Index.html';
const map = {
  '153': '228', // Utility
  '154': '229', // Api
  '155': '230', // WeightedAverages
  '156': '231', // Header
  '157': '232', // DisplayCharts
  '158': '233', // CreateCharts
  '159': '234', // uiManagement
  '160': '235', // Report
  '220': '236', // PrintBase64
  '221': '237', // PrintExcel
};

let html = fs.readFileSync(file, 'utf8');
let count = 0;

html = html.replace(/pageID=(\d+)/g, (match, id) => {
  if (map[id]) {
    count++;
    console.log(`  pageID=${id} -> pageID=${map[id]}`);
    return `pageID=${map[id]}`;
  }
  console.log(`  pageID=${id} left alone`);
  return match;
});

fs.writeFileSync(file, html, 'utf8');
console.log(`\n${count} script tags repointed.`);