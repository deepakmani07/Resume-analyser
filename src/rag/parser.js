import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;

/**
 * Extract raw text from a PDF File or ArrayBuffer
 * @param {File | ArrayBuffer} input 
 * @returns {Promise<{text: string, pageCount: number}>}
 */
export async function parsePdf(input) {
  try {
    let arrayBuffer;
    if (input instanceof File) {
      arrayBuffer = await input.arrayBuffer();
    } else {
      arrayBuffer = input;
    }

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;
    const pageCount = pdfDocument.numPages;

    let fullText = '';

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();

      let lastY = null;
      let pageText = '';

      for (const item of textContent.items) {
        if (!item.str) continue;

        // Detect newlines based on Y coordinate shift
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ')) {
          pageText += ' ';
        }

        pageText += item.str;
        lastY = item.transform[5];
      }

      fullText += pageText + '\n\n';
    }

    return {
      text: sanitizeText(fullText),
      pageCount
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please ensure it is a valid document or paste plain text instead.');
  }
}

/**
 * Read text file content
 * @param {File} file 
 * @returns {Promise<string>}
 */
export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(sanitizeText(e.target.result));
    reader.onerror = (e) => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}

/**
 * Clean up weird unicode symbols, zero-width spaces, and normalize newlines
 */
export function sanitizeText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
    .replace(/[^\x00-\x7F]/g, (char) => {
      // map common bullet point characters to standard bullet symbol
      if (['•', '▪', '▸', '►', '⁃', '–', '—', '●'].includes(char)) return '• ';
      return char;
    })
    .trim();
}
