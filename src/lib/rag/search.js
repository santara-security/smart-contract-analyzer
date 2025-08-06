import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 * Search for markdown files whose vectors contain a given word, returning the top-k by value (e.g., tfidf).
 * @param {string} word - The word to search for in the vectors.
 * @param {number} k - The number of top results to return.
 * @returns {Promise<Array>} - Array of top-k matching file vector records, each with the value for the word.
 */
export async function searchTopKByWord(word, k = 5) {
  const lowerWord = word.toLowerCase();
  const all = await prisma.fileVector.findMany();
  // Collect files with the word and their value (e.g., tfidf)
  const matches = all
    .map((fv) => {
      if (!Array.isArray(fv.vectors)) return null;
      const entry = fv.vectors.find(
        (v) => v.term && v.term.toLowerCase() === lowerWord
      );
      if (!entry) return null;
      // Use tfidf or value property if present, else fallback to 1
      const value = entry.tfidf ?? entry.value ?? 1;
      // Return all fields except vectors
      const { vectors, ...rest } = fv;
      return { ...rest, value };
    })
    .filter(Boolean);
  // Sort by value descending and return top-k
  return matches.sort((a, b) => b.value - a.value).slice(0, k);
}

/**
 * Search for markdown files whose vectors contain a given word.
 * @param {string} word - The word to search for in the vectors.
 * @returns {Promise<Array>} - Array of matching file vector records.
 */
export async function searchByWord(word) {
  const lowerWord = word.toLowerCase();
  // Fetch all FileVectors and filter in JS since SQLite/Prisma does not support array_contains
  const all = await prisma.fileVector.findMany();
  const results = all.filter(
    (fv) =>
      Array.isArray(fv.vectors) &&
      fv.vectors.some((v) => v.term && v.term.toLowerCase() === lowerWord)
  );
  return results;
}

// Example usage (uncomment to test):
// (async () => {
//   const results = await searchByWord("ether");
//   console.log(results.map(r => r.fileName));
//   await prisma.$disconnect();
// })();
