
const fs = require('fs');
const path = require('path');

const reportIndex = path.join(__dirname, 'playwright-report', 'index.html');
const cssPath = 'report-theme.css';

if (!fs.existsSync(reportIndex)) {
  console.error('[decorate-report] index.html not found. Did you run `npx playwright test`?');
  process.exit(1);
}

let html = fs.readFileSync(reportIndex, 'utf-8');

if (!html.includes('report-theme.css')) {
  html = html.replace(
    '</head>',
    `  <link rel="stylesheet" href="/../${cssPath}">\n</head>`
  );
  fs.writeFileSync(reportIndex, html, 'utf-8');
  console.log('[decorate-report] Custom CSS injected into HTML report.');
} else {
  console.log('[decorate-report] CSS already injected, skipping.');
}
