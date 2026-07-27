import { VectorStore } from './vectorStore.js';
import { ATS_BEST_PRACTICE_RULES, POWER_ACTION_VERBS, WEAK_PASSIVE_WORDS, ROLE_KEYWORD_PROFILES } from './knowledgeBase.js';
import { chunkJobDescription } from './chunker.js';

export class RAGRetriever {
  constructor() {
    this.kbVectorStore = new VectorStore();
    this.jdVectorStore = new VectorStore();
    this.isInitialized = false;
  }

  /**
   * Initialize Knowledge Base Vector Index with ATS guidelines and Action Verbs
   */
  initKnowledgeBase() {
    if (this.isInitialized) return;

    this.kbVectorStore.clear();

    // Index ATS Rules
    ATS_BEST_PRACTICE_RULES.forEach((rule) => {
      this.kbVectorStore.addDocument(`rule_${rule.id}`, `${rule.name} ${rule.category} ${rule.description}`, {
        type: 'ATS_RULE',
        data: rule
      });
    });

    // Index Action Verb categories
    Object.entries(POWER_ACTION_VERBS).forEach(([category, verbs]) => {
      this.kbVectorStore.addDocument(`verbs_${category}`, `action verbs ${category}: ${verbs.join(' ')}`, {
        type: 'POWER_VERBS',
        category,
        verbs
      });
    });

    // Index Weak Passive words
    WEAK_PASSIVE_WORDS.forEach((item, idx) => {
      this.kbVectorStore.addDocument(`weak_${idx}`, `weak passive overused phrase: ${item.word}`, {
        type: 'WEAK_PHRASE',
        data: item
      });
    });

    this.isInitialized = true;
  }

  /**
   * Load and vector index target Job Description or Role Profile
   * @param {string} jdText 
   * @param {string} targetRole 
   */
  loadJobDescription(jdText, targetRole) {
    this.jdVectorStore.clear();

    if (jdText) {
      const { requirements } = chunkJobDescription(jdText);
      requirements.forEach((req, idx) => {
        this.jdVectorStore.addDocument(`jd_req_${idx}`, req, {
          type: 'JD_REQUIREMENT',
          index: idx
        });
      });
    }

    // Add role keyword profile if specified
    if (targetRole && ROLE_KEYWORD_PROFILES[targetRole]) {
      const profile = ROLE_KEYWORD_PROFILES[targetRole];
      this.jdVectorStore.addDocument(`role_profile_${targetRole}`, `Required technical skills: ${profile.technical.join(' ')}. Soft skills: ${profile.soft.join(' ')}`, {
        type: 'ROLE_PROFILE',
        role: targetRole,
        profile
      });
    }
  }

  /**
   * Retrieve Top-K ATS Context for a resume bullet point chunk
   * @param {string} bulletText 
   */
  retrieveContextForBullet(bulletText) {
    this.initKnowledgeBase();

    const kbMatches = this.kbVectorStore.search(bulletText, 3);
    const jdMatches = this.jdVectorStore.search(bulletText, 2);

    return {
      kbContext: kbMatches,
      jdContext: jdMatches
    };
  }
}
