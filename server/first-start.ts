import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(import.meta.dirname, '..');
const dataDir = path.join(rootDir, 'data');
const exampleDataDir = path.join(rootDir, 'example-data');

export function firstStart() {
  fs.mkdirSync(dataDir, { recursive: true });

  const entries = fs.readdirSync(dataDir);
  for(const entry of entries) {
    if (entry === '.gitkeep' || entry === '.gitignore') {
      continue;
    }
    // Skip seed
    return;
  }

  console.log(`data/ is empty — seeding from example-data/`);
  fs.cpSync(exampleDataDir, dataDir, { recursive: true });
}
