import fs from "fs";
import path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams
    .get("contractAddress")
    ?.toLocaleLowerCase();
  if (!contractAddress) {
    return new Response(
      JSON.stringify({ error: "Missing contractAddress parameter" }),
      { status: 400 }
    );
  }

  const baseDir = path.join(
    process.cwd(),
    "crytic-export",
    "etherscan-contracts"
  );
  let matches = [];
  try {
    const folders = fs
      .readdirSync(baseDir, { withFileTypes: true })
      .map((dirent) => ({
        name: dirent.name,
        lc: dirent.name?.toLocaleLowerCase(),
        isDirectory: dirent.isDirectory(),
      }));
    console.log(folders);
    matches = folders.filter((folder) =>
      folder.lc.includes(contractAddress)
    );
    console.log(`Found matches: ${matches.length}`);
    console.log(matches);

    return new Response(JSON.stringify({ matches }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
