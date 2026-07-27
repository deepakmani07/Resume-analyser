import { STANDARD_SECTION_HEADERS } from './knowledgeBase.js';

/**
 * Segment full resume text into structural sections and bullet chunks.
 * @param {string} fullText 
 */
export function chunkResume(fullText) {
  if (!fullText || typeof fullText !== 'string') {
    return { sections: [], bulletChunks: [], contactInfo: {} };
  }

  const lines = fullText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  const sections = [];
  let currentSection = {
    title: 'Header / Contact',
    standardType: 'Header',
    lines: [],
    startLine: 0
  };

  lines.forEach((line, idx) => {
    // Check if line matches a known section header
    const lowerLine = line.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    let matchedHeader = null;
    for (const stdHeader of STANDARD_SECTION_HEADERS) {
      for (const kw of stdHeader.keywords) {
        if (lowerLine === kw || lowerLine === kw + 's' || lowerLine.startsWith(kw + ':')) {
          matchedHeader = stdHeader;
          break;
        }
      }
      if (matchedHeader) break;
    }

    if (matchedHeader && line.length < 50) {
      if (currentSection.lines.length > 0) {
        sections.push({ ...currentSection, text: currentSection.lines.join('\n') });
      }
      currentSection = {
        title: line,
        standardType: matchedHeader.name,
        lines: [],
        startLine: idx
      };
    } else {
      currentSection.lines.push(line);
    }
  });

  if (currentSection.lines.length > 0) {
    sections.push({ ...currentSection, text: currentSection.lines.join('\n') });
  }

  // Extract atomic bullet chunks
  const bulletChunks = [];
  let bulletId = 0;

  sections.forEach((sec) => {
    sec.lines.forEach((line, lIdx) => {
      const isBulletCandidate =
        line.startsWith('•') ||
        line.startsWith('-') ||
        line.startsWith('*') ||
        line.startsWith('–') ||
        /^\d+[\.\)]\s/.test(line) ||
        (sec.standardType === 'Work Experience' && line.length > 25);

      if (isBulletCandidate) {
        const cleanBulletText = line.replace(/^[\•\-\*\–\d\.\)\s]+/, '').trim();
        if (cleanBulletText.length >= 10) {
          bulletId++;
          bulletChunks.push({
            id: `bullet_${bulletId}`,
            sectionTitle: sec.title,
            sectionType: sec.standardType,
            rawText: line,
            cleanText: cleanBulletText,
            lineIndex: sec.startLine + lIdx
          });
        }
      }
    });
  });

  // Extract contact information heuristics
  const contactInfo = extractContactInfo(fullText);

  return {
    sections,
    bulletChunks,
    contactInfo
  };
}

/**
 * Heuristic contact info extractor
 */
function extractContactInfo(text) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);
  const websiteMatch = text.match(/(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*)/i);

  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    linkedin: linkedinMatch ? linkedinMatch[0] : null,
    github: githubMatch ? githubMatch[0] : null,
    website: websiteMatch ? websiteMatch[0] : null
  };
}

/**
 * Chunk job description into requirement vectors
 */
export function chunkJobDescription(jdText) {
  if (!jdText || typeof jdText !== 'string') return { keywords: [], requirements: [] };

  const cleanJD = jdText.toLowerCase();
  
  // Extract words / phrases
  const words = cleanJD
    .replace(/[^a-z0-9\+\#\s\.-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'you', 'will', 'that', 'have', 'are', 'this', 'our', 'from',
    'your', 'work', 'experience', 'team', 'ability', 'must', 'skills', 'about', 'role',
    'looking', 'candidate', 'responsibilities', 'qualifications', 'requirements'
  ]);

  const uniqueKeywords = Array.from(new Set(words.filter((w) => !stopWords.has(w))));

  // Extract sentences as specific requirements
  const sentences = jdText
    .split(/[\.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  return {
    keywords: uniqueKeywords,
    requirements: sentences
  };
}
