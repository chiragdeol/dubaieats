import fs from 'fs';
import path from 'path';

const indexPath = path.join('dist', 'client', 'index.html');

if (fs.existsSync(indexPath)) {
  console.log('Keeping the generated TanStack Start index.html.');
} else {
  console.warn('Warning: generated index.html was not found in dist/client.');
}
