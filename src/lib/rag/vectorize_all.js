import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import natural from "natural";

const prisma = new PrismaClient();

const SWC_DIR = path.join(process.cwd(), "crawl_result", "swc");
const SWCE_DIR = path.join(process.cwd(), "crawl_result", "swce");


function extractTitle(text) {
  // Extract the first non-empty line as the title
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0) return trimmed.replace(/^#\s*/, "");
  }
  return "";
}

function extractSourceAndCrawledAt(text) {
  // Looks for lines like: **Source URL:** ... and **Crawled on:** ...
  let source = null;
  let crawledAt = null;
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.startsWith("**Source URL:**")) {
      source = line.replace("**Source URL:**", "").trim();
    }
    if (line.startsWith("**Crawled on:**")) {
      crawledAt = line.replace("**Crawled on:**", "").trim();
    }
    if (source && crawledAt) break;
  }
  return { source, crawledAt };
}

function vectorizeText(text) {
  const tokens = new natural.WordTokenizer().tokenize(text);
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(tokens);
  return tfidf.listTerms(0);
}

async function processDir(DIR) {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith(".md"));
  for (const fileName of files) {
    const filePath = path.join(DIR, fileName);
    const text = fs.readFileSync(filePath, "utf-8");
    const title = extractTitle(text);
    const vectors = vectorizeText(text);
    const { source, crawledAt } = extractSourceAndCrawledAt(text);
    let crawledAtDate = null;
    if (crawledAt) {
      // Try to parse as 'YYYY-MM-DD HH:mm:ss' or 'YYYY-MM-DD'
      // If time is missing, add '00:00:00'
      let iso = crawledAt.replace(/\//g, '-').trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
        iso += 'T00:00:00Z';
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(iso)) {
        iso = iso.replace(' ', 'T') + 'Z';
      } else {
        // fallback: try Date constructor
        iso = new Date(iso).toISOString();
      }
      crawledAtDate = iso;
    }
    await prisma.fileVector.upsert({
      where: { filePath },
      update: { fileName, title, source, crawledAt: crawledAtDate, vectors, filePath },
      create: { filePath, fileName, title, source, crawledAt: crawledAtDate, vectors },
    });
    console.log(`Vectorized and saved: ${fileName}`);
  }
}

export async function vectorize() {
  await processDir(SWC_DIR);
  await processDir(SWCE_DIR);
  await prisma.$disconnect();
}
