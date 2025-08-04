import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

const runPython = async () => {
  const slitherCommand = `cd python && python crawler.py https://swcregistry.io/ https://swcregistry.io/docs/ --max-depth=2 --output=swc`;
  const slitherCommand2 = `cd python && python crawler.py https://scs.owasp.org/SCWE/ https://scs.owasp.org/SCWE/ --max-depth=2 --output=swce`;
  await Promise.all([
    execAsync(slitherCommand, {
      cwd: process.cwd(),
      timeout: 600000, // 10 minutes timeout
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large outputs
    }),
    execAsync(slitherCommand2, {
      cwd: process.cwd(),
      timeout: 600000, // 10 minutes timeout
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large outputs
    }),
  ]);
};

export async function GET(request) {
  try {
    const res = await runPython();
  } catch (error) {
    console.error("Error executing Python script:", error);
    return new Response("Error executing Python script", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response("Crawling Finish", {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
