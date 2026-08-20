import fs from 'fs';
import path from 'path';

const srcDir = path.join('dist', 'client');
const destDir = '.';

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach((element) => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

if (fs.existsSync(srcDir)) {
  copyFolderSync(srcDir, destDir);
  console.log('Successfully copied all compiled static assets to the project root!');
} else {
  console.error('Error: dist/client directory does not exist.');
}

// Ensure index.html exists in root and dist/client for Vercel, Netlify, and Hostinger
if (fs.existsSync('_shell.html')) {
  fs.copyFileSync('_shell.html', 'index.html');
  if (fs.existsSync(srcDir)) {
    fs.copyFileSync('_shell.html', path.join(srcDir, 'index.html'));
  }
  console.log('Successfully created index.html for Vercel and web hosting!');
}
