import { chunkResume, chunkJobDescription } from './chunker.js';
import { RAGRetriever } from './retriever.js';
import {
  STANDARD_SECTION_HEADERS,
  POWER_ACTION_VERBS,
  WEAK_PASSIVE_WORDS,
  ROLE_KEYWORD_PROFILES
} from './knowledgeBase.js';

export function analyzeResume(resumeText, jdText = '', targetRole = 'Software Engineer') {
  const parsedResume = chunkResume(resumeText);
  const { sections, bulletChunks, contactInfo } = parsedResume;

  const retriever = new RAGRetriever();
  retriever.loadJobDescription(jdText, targetRole);

  // Combine power verbs into flat set
  const allPowerVerbs = new Set(
    Object.values(POWER_ACTION_VERBS).flatMap((vList) => vList.map((v) => v.toLowerCase()))
  );

  const lowerResume = resumeText.toLowerCase();

  // -------------------------------------------------------------
  // 1. EVALUATE PILLAR 1: IMPACT & QUANTIFICATION (30%)
  // -------------------------------------------------------------
  let quantifiedBulletsCount = 0;
  const metricRegex = /\b(\d+(\.\d+)?%|\$\d+|\d+\+|\d+x|\d+\s*(users|clients|percent|million|billion|k|ms|s|hours|days|teams|projects))\b/i;

  bulletChunks.forEach((b) => {
    if (metricRegex.test(b.cleanText) || /\b\d+\b/.test(b.cleanText)) {
      quantifiedBulletsCount++;
    }
  });

  const totalBullets = bulletChunks.length || 1;
  const metricsRatio = quantifiedBulletsCount / totalBullets;
  const scoreImpact = Math.min(100, Math.round(metricsRatio * 150)); // Target 66%+ quantified

  // -------------------------------------------------------------
  // 2. EVALUATE PILLAR 2: KEYWORD RELEVANCE & MATCH (25%)
  // -------------------------------------------------------------
  let roleKeywords = [];
  if (ROLE_KEYWORD_PROFILES[targetRole]) {
    roleKeywords = [
      ...ROLE_KEYWORD_PROFILES[targetRole].technical,
      ...ROLE_KEYWORD_PROFILES[targetRole].soft
    ];
  }

  let jdKeywords = [];
  if (jdText) {
    const jdChunked = chunkJobDescription(jdText);
    jdKeywords = jdChunked.keywords;
  }

  const combinedTargetKeywords = Array.from(new Set([...roleKeywords, ...jdKeywords]));

  const presentKeywords = [];
  const missingKeywords = [];

  combinedTargetKeywords.forEach((kw) => {
    if (!kw || kw.length < 2) return;
    const kwLower = kw.toLowerCase();
    // Search keyword in resume
    if (lowerResume.includes(kwLower)) {
      presentKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const totalKwCount = combinedTargetKeywords.length || 1;
  const keywordMatchRatio = presentKeywords.length / totalKwCount;
  const scoreKeywords = Math.min(100, Math.round(keywordMatchRatio * 100 + (presentKeywords.length > 5 ? 15 : 0)));

  // -------------------------------------------------------------
  // 3. EVALUATE PILLAR 3: ATS FORMATTING & READABILITY (20%)
  // -------------------------------------------------------------
  let formattingIssuesCount = 0;
  const foundStandardSections = new Set();

  sections.forEach((sec) => {
    if (sec.standardType !== 'Header') {
      foundStandardSections.add(sec.standardType);
    }
  });

  const requiredSections = ['Work Experience', 'Skills', 'Education'];
  const missingRequiredSections = requiredSections.filter((reqSec) => !foundStandardSections.has(reqSec));

  let bulletsTooLong = 0;
  let bulletsTooShort = 0;

  bulletChunks.forEach((b) => {
    const wordCount = b.cleanText.split(/\s+/).length;
    if (wordCount > 40) bulletsTooLong++;
    if (wordCount < 5) bulletsTooShort++;
  });

  formattingIssuesCount += missingRequiredSections.length * 15;
  formattingIssuesCount += bulletsTooLong * 5;
  const scoreFormatting = Math.max(0, Math.min(100, 100 - formattingIssuesCount));

  // -------------------------------------------------------------
  // 4. EVALUATE PILLAR 4: BREVITY & STYLE (15%)
  // -------------------------------------------------------------
  let weakPhrasesFound = [];
  let strongBulletsCount = 0;

  bulletChunks.forEach((b) => {
    const firstWord = b.cleanText.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
    if (allPowerVerbs.has(firstWord)) {
      strongBulletsCount++;
    }

    WEAK_PASSIVE_WORDS.forEach((wp) => {
      if (b.cleanText.toLowerCase().includes(wp.word)) {
        weakPhrasesFound.push({
          bullet: b,
          weakWord: wp.word,
          alternative: wp.alternative
        });
      }
    });
  });

  const strongVerbRatio = strongBulletsCount / totalBullets;
  const scoreStyle = Math.min(100, Math.round(strongVerbRatio * 80 + 20 - weakPhrasesFound.length * 5));

  // -------------------------------------------------------------
  // 5. EVALUATE PILLAR 5: SECTION COMPLETENESS (10%)
  // -------------------------------------------------------------
  let completenessItems = 0;
  if (contactInfo.email) completenessItems += 25;
  if (contactInfo.phone) completenessItems += 25;
  if (contactInfo.linkedin || contactInfo.github) completenessItems += 25;
  if (sections.some((s) => s.standardType === 'Work Experience')) completenessItems += 25;

  const scoreCompleteness = Math.min(100, completenessItems);

  // -------------------------------------------------------------
  // OVERALL ATS SCORE COMPUTATION
  // -------------------------------------------------------------
  const overallScore = Math.round(
    scoreImpact * 0.30 +
    scoreKeywords * 0.25 +
    scoreFormatting * 0.20 +
    scoreStyle * 0.15 +
    scoreCompleteness * 0.10
  );

  // -------------------------------------------------------------
  // GENERATE CATEGORIZED MISTAKES
  // -------------------------------------------------------------
  const mistakes = [];
  let mId = 0;

  // Mistake 1: Missing Contact Info
  if (!contactInfo.email) {
    mId++;
    mistakes.push({
      id: `m_${mId}`,
      severity: 'critical',
      category: 'Section Completeness',
      title: 'Missing Email Address',
      snippet: 'Header Section',
      explanation: 'ATS systems and recruiters cannot contact you automatically without an explicit email address in the header.',
      fix: 'Add a clean email address (e.g. john.doe@email.com) at the top of your resume.'
    });
  }

  if (!contactInfo.linkedin) {
    mId++;
    mistakes.push({
      id: `m_${mId}`,
      severity: 'warning',
      category: 'Section Completeness',
      title: 'Missing LinkedIn Profile URL',
      snippet: 'Header Section',
      explanation: 'Over 85% of recruiters cross-reference LinkedIn profiles directly from ATS parsing output.',
      fix: 'Include your customized LinkedIn URL (e.g., linkedin.com/in/yourname).'
    });
  }

  // Mistake 2: Unquantified Bullet Points
  if (metricsRatio < 0.5) {
    const unquantifiedSample = bulletChunks.find((b) => !metricRegex.test(b.cleanText) && !/\b\d+\b/.test(b.cleanText));
    mId++;
    mistakes.push({
      id: `m_${mId}`,
      severity: 'critical',
      category: 'Impact & Quantification',
      title: 'Lack of Measurable Results & Numbers',
      snippet: unquantifiedSample ? `"${unquantifiedSample.cleanText}"` : 'Work Experience section',
      explanation: `${Math.round((1 - metricsRatio) * 100)}% of your bullet points lack quantifiable metrics (percentages, revenues, time saved, user growth).`,
      fix: 'Add specific figures to bullet points, e.g., "reduced latency by 35%" or "managed budget of $50K".'
    });
  }

  // Mistake 3: Weak Action Verbs
  weakPhrasesFound.forEach((wp) => {
    mId++;
    mistakes.push({
      id: `m_${mId}`,
      severity: 'warning',
      category: 'Brevity & Style',
      title: `Weak Passive Phrase: "${wp.weakWord}"`,
      snippet: `"${wp.bullet.cleanText}"`,
      explanation: `Passive phrases like "${wp.weakWord}" diminish your impact and decrease ATS action-verb scoring.`,
      fix: `Replace "${wp.weakWord}" with power verbs such as: ${wp.alternative}.`
    });
  });

  // Mistake 4: Missing Required Standard Sections
  missingRequiredSections.forEach((reqSec) => {
    mId++;
    mistakes.push({
      id: `m_${mId}`,
      severity: 'critical',
      category: 'ATS Formatting',
      title: `Missing Standard Section: "${reqSec}"`,
      snippet: 'Whole Document',
      explanation: `ATS parsers look for exact standard section names. Without "${reqSec}", your experience may be miscategorized or ignored.`,
      fix: `Add a dedicated section header titled "${reqSec}".`
    });
  });

  // Mistake 5: Overly Long Bullet Points
  if (bulletsTooLong > 0) {
    const longSample = bulletChunks.find((b) => b.cleanText.split(/\s+/).length > 40);
    mId++;
    mistakes.push({
      id: `m_${mId}`,
      severity: 'info',
      category: 'Brevity & Style',
      title: 'Overly Wordy Bullet Point (>40 words)',
      snippet: longSample ? `"${longSample.cleanText.slice(0, 80)}..."` : 'Work Experience section',
      explanation: 'Long paragraph-style bullet points slow down recruiter scanning time.',
      fix: 'Split long bullet points into 2 concise, action-focused bullet points (15-25 words each).'
    });
  }

  // -------------------------------------------------------------
  // GENERATE ACTIONABLE IMPROVEMENT REWRITES
  // -------------------------------------------------------------
  const improvements = [];

  bulletChunks.forEach((b) => {
    const isQuantified = metricRegex.test(b.cleanText);
    const firstWord = b.cleanText.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
    const isWeakVerb = !allPowerVerbs.has(firstWord);

    if (isWeakVerb || !isQuantified) {
      let suggestedVerb = 'Engineered';
      if (b.sectionType === 'Projects') suggestedVerb = 'Developed';
      if (b.cleanText.toLowerCase().includes('data') || b.cleanText.toLowerCase().includes('report')) suggestedVerb = 'Analyzed';
      if (b.cleanText.toLowerCase().includes('lead') || b.cleanText.toLowerCase().includes('manage')) suggestedVerb = 'Spearheaded';

      let cleanBase = b.cleanText.replace(/^(worked on|responsible for|helped with|handled|assisted in|did)\s+/i, '');
      cleanBase = cleanBase.charAt(0).toLowerCase() + cleanBase.slice(1);

      let rewrite = `${suggestedVerb} ${cleanBase}`;
      if (!isQuantified) {
        rewrite += ', resulting in a 25% increase in efficiency and performance.';
      }

      improvements.push({
        id: `imp_${b.id}`,
        section: b.sectionTitle,
        originalBullet: b.cleanText,
        rewrittenBullet: rewrite,
        changesMade: !isQuantified && isWeakVerb
          ? 'Injected strong action verb & added quantifiable performance metric (+25% efficiency).'
          : isWeakVerb
          ? 'Replaced weak lead-in phrase with high-impact power action verb.'
          : 'Added impact metric prompt to bullet point.',
        impactScoreBoost: '+12 Points'
      });
    }
  });

  return {
    overallScore,
    pillars: [
      { name: 'Impact & Quantification', score: scoreImpact, weight: '30%', description: 'Quantified metrics, %, $, user scale' },
      { name: 'Keyword Match & Relevance', score: scoreKeywords, weight: '25%', description: 'Match rate with target job profile' },
      { name: 'ATS Formatting & Structure', score: scoreFormatting, weight: '20%', description: 'Standard headers, bullet word limits' },
      { name: 'Brevity & Action Verbs', score: scoreStyle, weight: '15%', description: 'Active voice, power action verb lead-ins' },
      { name: 'Section Completeness', score: scoreCompleteness, weight: '10%', description: 'Email, Phone, LinkedIn, standard sections' }
    ],
    contactInfo,
    mistakes,
    improvements: improvements.slice(0, 6), // Top 6 actionable rewrites
    keywordAnalysis: {
      matchPercentage: Math.round(keywordMatchRatio * 100),
      presentKeywords: presentKeywords.slice(0, 15),
      missingKeywords: missingKeywords.slice(0, 15)
    },
    sections,
    bulletChunks,
    parsedAt: new Date().toISOString()
  };
}
