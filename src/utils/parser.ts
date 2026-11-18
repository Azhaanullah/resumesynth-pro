import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

// pdf-parse v2 uses pdfjs-dist under the hood, which requires a worker URL
// in the browser. Set it once at module load time.
PDFParse.setWorker(typeof window !== 'undefined' ? `${window.location.origin}/pdf.worker.mjs` : '/pdf.worker.mjs');

export interface ParsedDate {
  raw: string;
  normalized: string;
  lineNumber: number;
  context: string;
}

export interface ParsedTitle {
  title: string;
  company?: string;
  lineNumber: number;
  isCurrent: boolean;
}

export interface ParsedDocument {
  text: string;
  pages: number;
  sections: ParsedSection[];
  dates: ParsedDate[];
  titles: ParsedTitle[];
  warnings: string[];
  jdText?: string;
  resumeText?: string;
  structuredSections?: StructuredSection[];
}

export interface ParsedSection {
  type: 'header' | 'experience' | 'education' | 'skills' | 'projects' | 'summary' | 'other';
  heading: string;
  content: string;
  lineStart: number;
  lineEnd: number;
}

export interface StructuredSection {
  key: string;
  label: string;
  type: ParsedSection['type'];
  content: string;
  sourceHeading?: string;
  missing: boolean;
}

const SECTION_HEADINGS = {
  experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience', 'career'],
  education: ['education', 'academic background', 'degrees', 'qualifications'],
  skills: ['skills', 'technical skills', 'technologies', 'tools', 'competencies', 'expertise', 'stack'],
  projects: ['projects', 'personal projects', 'key projects', 'selected projects'],
  summary: ['summary', 'profile', 'objective', 'about me', 'professional summary'],
};

const JD_HEADING_KEYWORDS = [
  'requirements', 'responsibilities', 'qualifications', 'what you will do',
  'what we are looking for', 'preferred qualifications', 'must-haves',
  'your responsibilities', 'the role', 'the ideal candidate',
];

const RESUME_SECTION_KEYWORDS = [
  ...Object.entries(SECTION_HEADINGS).flatMap(([, kws]) => kws),
];

const FIXED_SECTION_ORDER = [
  'experience',
  'education',
  'skills',
  'projects',
  'summary',
] as const;

export const SECTION_TITLES: Record<ParsedSection['type'], string> = {
  experience: 'Professional Experience',
  education: 'Education',
  skills: 'Technical Skills',
  projects: 'Key Projects',
  summary: 'Professional Summary',
  header: 'Header',
  other: 'Other',
};

export function splitIntoPanels(text: string): { jdText?: string; resumeText?: string } {
  const lines = text.split('\n');
  let currentSectionType: 'jd' | 'resume' | null = null;
  let jdLines: string[] = [];
  let resumeLines: string[] = [];
  let currentAccum: string[] = [];
  let currentLabel: 'jd' | 'resume' = 'resume';

  function flushCurrent() {
    if (currentAccum.length === 0) return;
    const block = currentAccum.join('\n').trim();
    if (!block) return;
    if (currentLabel === 'jd') jdLines.push(block);
    else resumeLines.push(block);
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isAllCapsHeading = /^[A-Z][A-Z\s]{1,30}$/.test(trimmed) && trimmed.length < 50 && /[A-Z]{2,}/.test(trimmed);
    const lowerTrimmed = trimmed.toLowerCase();

    let detectedLabel: 'jd' | 'resume' | null = null;

    if (isAllCapsHeading) {
      const isJDHeading = JD_HEADING_KEYWORDS.some(kw => lowerTrimmed.includes(kw));
      const isResumeHeading = RESUME_SECTION_KEYWORDS.some(kw => lowerTrimmed.includes(kw));

      if (isJDHeading) detectedLabel = 'jd';
      else if (isResumeHeading) detectedLabel = 'resume';
    }

    if (detectedLabel !== null && currentSectionType !== detectedLabel) {
      flushCurrent();
      currentSectionType = detectedLabel;
      currentLabel = detectedLabel;
      currentAccum = [];
    }

    if (detectedLabel === null) {
      currentAccum.push(line);
    } else {
      currentAccum = [line];
      currentLabel = detectedLabel;
    }
  }

  flushCurrent();

  const result: { jdText?: string; resumeText?: string } = {};
  if (jdLines.length > 0) result.jdText = jdLines.join('\n\n').trim();
  if (resumeLines.length > 0) result.resumeText = resumeLines.join('\n\n').trim();

  if (!result.jdText && !result.resumeText) {
    result.resumeText = text.trim();
  }

  return result;
}

export function buildStructuredSections(
  sections: ParsedSection[],
): StructuredSection[] {
  const byType = new Map<ParsedSection['type'], ParsedSection[]>();
  for (const s of sections) {
    if (!byType.has(s.type)) byType.set(s.type, []);
    byType.get(s.type)!.push(s);
  }

  return FIXED_SECTION_ORDER.map(type => {
    const found = byType.get(type);
    if (!found || found.length === 0) {
      return {
        key: type,
        label: SECTION_TITLES[type],
        type,
        content: '',
        missing: true,
      };
    }

    const content = found
      .map(s => `## ${s.heading}\n${s.content.trim()}`)
      .join('\n\n');

    return {
      key: type,
      label: SECTION_TITLES[type],
      type,
      content,
      sourceHeading: found.map(s => s.heading).join(', '),
      missing: false,
    };
  });
}

const DATE_PATTERNS = [
  /(\d{1,2})\/(\d{4})/g,
  /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/gi,
  /(\d{4})\s*[-–—]\s*(\d{4}|Present|Current)/gi,
  /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*(\d{4}|Present|Current)/gi,
];

function detectSectionType(heading: string): ParsedSection['type'] {
  const lower = heading.toLowerCase();
  for (const [type, keywords] of Object.entries(SECTION_HEADINGS)) {
    if (keywords.some(k => lower.includes(k))) return type as ParsedSection['type'];
  }
  return 'other';
}

function extractDates(text: string): ParsedDate[] {
  const dates: ParsedDate[] = [];
  const lines = text.split('\n');

  lines.forEach((line, idx) => {
    DATE_PATTERNS.forEach(pattern => {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        dates.push({
          raw: match[0],
          normalized: match[0],
          lineNumber: idx + 1,
          context: line.trim().slice(0, 80),
        });
      }
    });
  });

  return dates;
}

function extractTitles(text: string): ParsedTitle[] {
  const titles: ParsedTitle[] = [];
  const lines = text.split('\n');

  const titlePatterns = [
    /^([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Lead|Architect|Analyst|Designer|Scientist|Consultant|Intern|Director|VP|CTO|CFO|CEO))\s+(?:at|@|\||-)\s+([A-Z][a-zA-Z0-9\s&.,'-]+)/,
    /^([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Lead|Architect|Analyst|Designer|Scientist|Consultant|Intern|Director|VP|CTO|CFO|CEO))/,
  ];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    for (const pattern of titlePatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        titles.push({
          title: match[1].trim(),
          company: match[2]?.trim(),
          lineNumber: idx + 1,
          isCurrent: /present|current/i.test(trimmed),
        });
        break;
      }
    }
  });

  return titles;
}

function extractSections(text: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lines = text.split('\n');
  let currentSection: ParsedSection | null = null;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const isHeading = /^[A-Z][A-Z\s]{2,}$/.test(trimmed) || /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:?$/.test(trimmed);

    if (isHeading && trimmed.length > 2 && trimmed.length < 50) {
      if (currentSection) {
        const closed: ParsedSection = { ...currentSection, lineEnd: idx };
        sections.push(closed);
      }

      currentSection = {
        type: detectSectionType(trimmed),
        heading: trimmed,
        content: '',
        lineStart: idx + 1,
        lineEnd: idx + 1,
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  });

  if (currentSection) {
    const closed: ParsedSection = { ...currentSection as ParsedSection, lineEnd: lines.length };
    sections.push(closed);
  }

  return sections;
}

function checkParsingIssues(parsed: ParsedDocument): string[] {
  const warnings: string[] = [];

  const hasExperience = parsed.sections.some(s => s.type === 'experience');
  const hasEducation = parsed.sections.some(s => s.type === 'education');
  const hasSkills = parsed.sections.some(s => s.type === 'skills');

  if (!hasExperience) warnings.push('No "Experience" section detected — ATS may not find your work history');
  if (!hasEducation) warnings.push('No "Education" section detected');
  if (!hasSkills) warnings.push('No "Skills" section detected — critical for keyword matching');

  if (parsed.dates.length === 0) {
    warnings.push('No employment dates found — ATS cannot determine tenure');
  }

  if (parsed.titles.length === 0) {
    warnings.push('No job titles recognized — use standard titles like "Software Engineer at Company"');
  }

  if (parsed.text.includes('\t') || /  {4,}/.test(parsed.text)) {
    warnings.push('Possible table/column layout detected — may parse incorrectly in ATS');
  }

  if (/[•‣◦⁃∙]/.test(parsed.text)) {
    warnings.push('Bullet characters detected — use plain hyphens or asterisks for compatibility');
  }

  return warnings;
}

export async function parseResume(file: File): Promise<ParsedDocument> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  let text = '';
  let pages = 1;

  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const parser = new PDFParse({ data: arrayBuffer });
    const result = await parser.getText();
    text = result.text;
    pages = Math.max(1, Math.ceil(text.length / 3000));
  } else if (ext === 'docx' || ext === 'doc') {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
    pages = Math.max(1, Math.ceil(text.length / 3000));
  } else {
    text = await file.text();
    pages = 1;
  }

  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const sections = extractSections(text);
  const dates = extractDates(text);
  const titles = extractTitles(text);
  const warnings = checkParsingIssues({ text, pages, sections, dates, titles, warnings: [] });

  const { jdText, resumeText } = splitIntoPanels(text);
  const structuredSections = buildStructuredSections(sections);

  return {
    text,
    pages,
    sections,
    dates,
    titles,
    warnings,
    jdText,
    resumeText,
    structuredSections,
  };
}
