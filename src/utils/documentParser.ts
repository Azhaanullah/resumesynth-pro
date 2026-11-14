import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export interface ParseResult {
  text: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md' | 'unknown';
  charCount: number;
  wordCount: number;
}

export async function parseResumeFile(file: File): Promise<ParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt' || extension === 'md') {
    const text = await file.text();
    return formatResult(text, file.name, extension as 'txt' | 'md');
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = cleanExtractedText(result.value);
    if (!text || text.length < 20) {
      throw new Error('Extracted text from Word document is empty or unreadable.');
    }
    return formatResult(text, file.name, 'docx');
  }

  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
      });
      const pdfDoc = await loadingTask.promise;

      let fullText = '';
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Group items with reasonable spacing
        let lastY: number | null = null;
        let pageText = '';
        for (const item of textContent.items as any[]) {
          if (!('str' in item)) continue;
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += item.str;
          lastY = item.transform[5];
        }

        fullText += pageText + '\n\n';
      }

      const text = cleanExtractedText(fullText);
      if (!text || text.length < 20) {
        throw new Error('PDF appears to be scanned or contains only images. Please paste raw text or upload a text-based PDF.');
      }
      return formatResult(text, file.name, 'pdf');
    } catch (err: any) {
      if (err.message && err.message.includes('PDF appears to be scanned')) {
        throw err;
      }
      throw new Error(`Failed to parse PDF: ${err.message || 'Unknown error'}`);
    }
  }

  throw new Error(`Unsupported file type: .${extension}. Please upload a PDF, DOCX, TXT, or MD file.`);
}

function cleanExtractedText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatResult(text: string, filename: string, fileType: ParseResult['fileType']): ParseResult {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return {
    text,
    filename,
    fileType,
    charCount: text.length,
    wordCount: words,
  };
}
