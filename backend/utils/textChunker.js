export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.trim().length === 0) return [];

  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/ \n/g, "\n")
    .trim();

  const paragraphs = cleanedText
    .split(/\n+/)
    .filter((p) => p.trim().length > 0);

  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    if (paragraphWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join("\n\n"),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(" "),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });
        if (i + chunkSize >= paragraphWords.length) break;
      }
      continue;
    }
    if (
      currentWordCount + paragraphWordCount > chunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      const prevChunkText = currentChunk.join(" ");
      const prevWords = prevChunkText.split(/\s+/);
      const overlapText = prevWords
        .slice(-Math.min(overlap, prevWords.length))
        .join(" ");

      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
    } else {
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n"),
      chunkIndex: chunkIndex,
      pageNumber: 0,
    });
  }

  if (chunks.length === 0 && cleanedText.trim().length > 0) {
    const allWords = cleanedText.split(/\s+/);
    for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
      const chunkWords = allWords.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(" "),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });
      if (i + chunkSize >= allWords.length) break;
    }
  }
  return chunks;
};

export const findRelevantChunks = (chunks, query, maxChunks = 5) => {
  if (!chunks || chunks.length === 0 || !query) return [];

  const stopWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "if",
    "in",
    "to",
    "from",
    "with",
    "as",
    "for",
    "on",
    "by",
    "of",
    "at",
    "up",
    "down",
    "out",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "some",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ]);
  const queryNoiseWords = new Set([
    "what",
    "who",
    "which",
    "is",
    "are",
    "was",
    "were",
    "define",
    "explain",
    "about",
    "tell",
    "me",
    "show",
    "give",
    "can",
    "you",
    "please",
  ]);

  // Clean the query: remove punctuation and split into words
  const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, " ");
  const queryWords = cleanQuery
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 1 && !stopWords.has(word) && !queryNoiseWords.has(word),
    );

  if (queryWords.length === 0) {
    // If all words were filtered, try again but keep the short/common words
    const fallbackWords = cleanQuery.split(/\s+/).filter((w) => w.length > 1);
    if (fallbackWords.length > 0) queryWords.push(...fallbackWords);
    else return [];
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;
    let matchedWordsCount = 0;

    for (const word of queryWords) {
      // Check for exact word match
      const exactMatchRegex = new RegExp(`\\b${word}\\b`, "g");
      const exactMatches = (content.match(exactMatchRegex) || []).length;

      // Check for plural form too if search word is singular
      const pluralMatchRegex = new RegExp(`\\b${word}s\\b`, "g");
      const pluralMatches = (content.match(pluralMatchRegex) || []).length;

      if (exactMatches > 0 || pluralMatches > 0) {
        matchedWordsCount++;
        score += exactMatches * 5 + pluralMatches * 4;
      } else if (content.includes(word)) {
        // Partial match
        score += 2;
      }
    }

    if (matchedWordsCount > 0) {
      // Bonus if chunk contains multiple different words from the query
      score += matchedWordsCount * 3;
    }

    // Normalize by content length to avoid favoring huge chunks too much,
    // but give a slight bias to longer chunks which might have more context
    const normalizedScore = score / Math.log10(contentWords + 10);
    const positionBonus = 1 - (index / chunks.length) * 0.15;

    const chunkData = chunk.toObject ? chunk.toObject() : chunk;
    return {
      content: chunkData.content || chunkData.text || "",
      chunkIndex: chunkData.chunkIndex !== undefined ? chunkData.chunkIndex : index,
      pageNumber: chunkData.pageNumber || 1,
      score: normalizedScore * positionBonus,
      matchedWords: matchedWordsCount,
    };
  });

  return scoredChunks
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
};
