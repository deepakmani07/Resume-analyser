/**
 * Simple TF-IDF Vectorizer & Cosine Similarity Store for Client-Side RAG
 */

export class VectorStore {
  constructor() {
    this.documents = []; // Array of { id, text, metadata, vector }
    this.vocabulary = new Map(); // term -> index
  }

  /**
   * Tokenize text into normalized terms & n-grams
   * @param {string} text 
   * @returns {string[]}
   */
  tokenize(text) {
    if (!text) return [];
    const sanitized = text.toLowerCase().replace(/[^a-z0-9\+\#\s\.-]/g, ' ');
    const unigrams = sanitized.split(/\s+/).filter((w) => w.length > 1);

    // Add bigrams for context
    const bigrams = [];
    for (let i = 0; i < unigrams.length - 1; i++) {
      bigrams.push(`${unigrams[i]} ${unigrams[i + 1]}`);
    }

    return [...unigrams, ...bigrams];
  }

  /**
   * Build TF vector for a list of tokens
   */
  createVector(tokens) {
    const tfMap = new Map();
    tokens.forEach((t) => {
      tfMap.set(t, (tfMap.get(t) || 0) + 1);
    });

    // Normalize TF
    const normVector = new Map();
    const totalTokens = tokens.length || 1;
    tfMap.forEach((count, term) => {
      normVector.set(term, count / totalTokens);
    });

    return normVector;
  }

  /**
   * Index document chunk into vector store
   */
  addDocument(id, text, metadata = {}) {
    const tokens = this.tokenize(text);
    const vector = this.createVector(tokens);
    const docObj = { id, text, metadata, vector, tokens };
    this.documents.push(docObj);
    return docObj;
  }

  /**
   * Calculate cosine similarity between two vector maps
   */
  calculateSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    vecA.forEach((val, term) => {
      normA += val * val;
      if (vecB.has(term)) {
        dotProduct += val * vecB.get(term);
      }
    });

    vecB.forEach((val) => {
      normB += val * val;
    });

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Search vector store for top-K matching documents to a query string
   * @param {string} queryText 
   * @param {number} topK 
   * @param {Function} [filterFn] 
   */
  search(queryText, topK = 5, filterFn = null) {
    const queryTokens = this.tokenize(queryText);
    const queryVector = this.createVector(queryTokens);

    const candidates = filterFn ? this.documents.filter(filterFn) : this.documents;

    const results = candidates.map((doc) => {
      const score = this.calculateSimilarity(queryVector, doc.vector);
      return {
        document: doc,
        score
      };
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  clear() {
    this.documents = [];
    this.vocabulary.clear();
  }
}
