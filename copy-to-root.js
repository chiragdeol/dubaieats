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
