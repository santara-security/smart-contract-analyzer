import fs from "fs";
import path from "path";

export function setCache(cacheDir, cacheKey, data) {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  const cacheFile = path.join(cacheDir, cacheKey);
  fs.writeFileSync(cacheFile, JSON.stringify(data));
}

// cache for 2 hours by default
export function getCache(cacheDir, cacheKey, maxAgeMs = 120 * 60 * 1000) {
  const cacheFile = path.join(cacheDir, cacheKey);
  if (fs.existsSync(cacheFile)) {
    try {
      const stat = fs.statSync(cacheFile);
      const now = Date.now();
      const mtime = new Date(stat.mtime).getTime();
      if (now - mtime < maxAgeMs) {
        return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      }
    } catch (e) {
      // ignore cache errors
    }
  }
  return null;
}
