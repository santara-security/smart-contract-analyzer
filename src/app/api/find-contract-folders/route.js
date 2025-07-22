import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get('contractAddress');
  if (!contractAddress) {
    return new Response(JSON.stringify({ error: 'Missing contractAddress parameter' }), { status: 400 });
  }

  const baseDir = path.join(process.cwd(), 'crytic-export', 'etherscan-contracts');
  let matches = [];
  try {
    const folders = fs.readdirSync(baseDir, { withFileTypes: true });
    matches = folders
      .filter(dirent => dirent.isDirectory() && dirent.name.toLowerCase().startsWith(contractAddress.toLowerCase()))
      .map(dirent => dirent.name);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ matches }), { status: 200 });
}
