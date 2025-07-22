import fs from 'fs';
import path from 'path';

function walkDir(dir, base = '') {
  let results = {};
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of list) {
    const relPath = base ? path.join(base, dirent.name) : dirent.name;
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      Object.assign(results, walkDir(fullPath, relPath));
    } else if (dirent.isFile()) {
      try {
        results[relPath.replace(/\\/g, '/')] = fs.readFileSync(fullPath, 'utf8');
      } catch (err) {
        results[relPath.replace(/\\/g, '/')] = `// Error reading file: ${err.message}`;
      }
    }
  }
  return results;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const contractFolder = searchParams.get('contractFolder');
  if (!contractFolder) {
    return new Response(JSON.stringify({ error: 'Missing contractFolder parameter' }), { status: 400 });
  }

  const baseDir = path.join(process.cwd(), 'crytic-export', 'etherscan-contracts', contractFolder);
  let fileContents = {};
  try {
    if (!fs.existsSync(baseDir)) {
      return new Response(JSON.stringify({ error: 'Folder not found' }), { status: 404 });
    }
    fileContents = walkDir(baseDir);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ fileContents }), { status: 200 });
}
