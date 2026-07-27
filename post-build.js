import fs from 'fs';
import path from 'path';

const shellPath = path.join('dist', 'client', '_shell.html');
const indexPath = path.join('dist', 'client', 'index.html');

if (fs.existsSync(shellPath)) {
  fs.copyFileSync(shellPath, indexPath);
  console.log('Successfully copied _shell.html to index.html for web hosting!');
} else {
  console.warn('Warning: _shell.html was not found in dist/client.');
}
