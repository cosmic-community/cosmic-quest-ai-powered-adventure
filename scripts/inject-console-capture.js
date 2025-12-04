const fs = require('fs');
const path = require('path');

const SCRIPT_TAG = '<script src="/dashboard-console-capture.js"></script>';

function injectScript(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('dashboard-console-capture.js')) {
    return false;
  }
  
  const headEndIndex = content.indexOf('</head>');
  if (headEndIndex !== -1) {
    content = content.slice(0, headEndIndex) + SCRIPT_TAG + content.slice(headEndIndex);
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  
  return results;
}

const outDir = path.join(process.cwd(), '.next');
if (fs.existsSync(outDir)) {
  const htmlFiles = findHtmlFiles(outDir);
  let injectedCount = 0;
  
  htmlFiles.forEach(file => {
    if (injectScript(file)) {
      injectedCount++;
    }
  });
  
  console.log(`Injected console capture script into ${injectedCount} files`);
} else {
  console.log('Build directory not found');
}