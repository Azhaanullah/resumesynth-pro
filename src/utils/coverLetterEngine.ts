import { AnalysisResult, CoverLetterTone } from '../types';

export interface GeneratedCoverLetter {
  company: string;
  role: string;
  candidateName: string;
  tone: CoverLetterTone;
  content: string;
  wordCount: number;
  highlightedKeywords: string[];
}

export function extractCandidateName(resumeText: string): string {
  const firstLines = resumeText.trim().split('\n').slice(0, 5);
  for (const line of firstLines) {
    const clean = line.replace(/^[#*\s-]+/, '').trim();
    // Name typically consists of 2-4 words, capitalized, no numbers or special symbols
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(clean)) {
      return clean;
    }
  }
  return 'Alex Mercer';
}

export function extractCompanyName(jobDescription: string, fallback = 'Innovative Tech Corp'): string {
  const patterns = [
    /(?:at|join|joining|about)\s+([A-Z][A-Za-z0-9&.\s]{2,25}?)(?:\s+(?:team|is|we|to|LLC|Inc|Corp|\.|\,))/i,
    /(?:Company|Organization):\s*([A-Za-z0-9&.\s]{2,25})/i,
    /Welcome to\s+([A-Z][A-Za-z0-9&.\s]{2,25})/i,
  ];

  for (const pattern of patterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (!['The', 'Our', 'A', 'An', 'This', 'We'].includes(name)) {
        return name;
      }
    }
  }
  return fallback;
}

export function generateCoverLetter(
  targetRole: string,
  companyName: string,
  resumeText: string,
  jobDescription: string,
  analysis: AnalysisResult,
  tone: CoverLetterTone = 'Confident'
): GeneratedCoverLetter {
  const candidateName = extractCandidateName(resumeText);
  const company = companyName.trim() || extractCompanyName(jobDescription);
  const role = targetRole.trim() || 'Software Engineer';

  // Gather top keywords matched
  const topKeywords = analysis.matched.slice(0, 6).map(k => k.term);
  const keywordListStr = topKeywords.length > 0 
    ? topKeywords.slice(0, 4).join(', ') 
    : 'modern system architecture, CI/CD, and agile engineering';

  // Find a strong metric bullet from resume
  const metricBullet = resumeText
    .split('\n')
    .find(line => /\d+[%kKxXmM]|\$\d+/.test(line) && line.length > 30)
    ?.replace(/^[-*•\s]+/, '')
    .trim() || 'optimized core processing pipelines, cutting latency by 35% and improving daily operational throughput';

  // Tone variations
  let opening = '';
  let bodyValue = '';
  let closing = '';

  switch (tone) {
    case 'Executive':
      opening = `I am writing to express my strategic interest in the ${role} position at ${company}. With a track record of translating complex product specifications into scalable, fault-tolerant engineering architectures, I have consistently aligned technical roadmaps with high-velocity business outcomes.`;
      bodyValue = `Throughout my recent career, I have specialized in driving performance across ${keywordListStr}. A key milestone in my work includes when I ${metricBullet}. My focus is perpetually on building sustainable infrastructure, minimizing technical debt, and fostering cross-functional alignment.`;
      closing = `I look forward to discussing how my architectural acumen and technical leadership can deliver immediate value to ${company}'s key growth objectives.`;
      break;

    case 'Enthusiastic':
      opening = `I was thrilled to discover the ${role} opening at ${company}! Having followed your team's inspiring technical milestones, I am energized by the opportunity to contribute my skills in ${keywordListStr} to your mission.`;
      bodyValue = `In my hands-on experience, I thrive when tackling challenging technical problems. For instance, I recently ${metricBullet}. I take immense pride in writing elegant, test-driven code and collaborating closely with product designers and fellow engineers.`;
      closing = `I would love the opportunity to share how my passion, energy, and hands-on expertise align with ${company}'s upcoming initiatives. Thank you for your time and consideration!`;
      break;

    case 'Professional':
      opening = `Please accept this letter and the enclosed resume as an application for the ${role} opening at ${company}. Given my background in software development and proven competency in ${keywordListStr}, I am confident in my ability to make an immediate impact on your engineering team.`;
      bodyValue = `In my previous work, I have focused on robust system design, automated testing, and reliable software delivery. Specifically, I ${metricBullet}. I bring a disciplined work ethic, strong problem-solving capabilities, and deep respect for high coding standards.`;
      closing = `Thank you for reviewing my qualifications. I welcome the opportunity to meet with your hiring team to discuss how my skill set aligns with the needs of ${company}.`;
      break;

    case 'Confident':
    default:
      opening = `I am excited to submit my candidacy for the ${role} role at ${company}. With proven expertise delivering high-performance systems and mastering ${keywordListStr}, I am primed to hit the ground running on your core deliverables.`;
      bodyValue = `My approach pairs rapid execution with rigorous engineering standards. A notable highlight of my work is when I ${metricBullet}. Leveraging modern tooling and best practices, I consistently deliver scalable features that improve user experience and system reliability.`;
      closing = `I am eager to bring this same results-oriented energy to ${company}. Let's connect soon to discuss how I can help accelerate your engineering velocity.`;
      break;
  }

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const letterText = `${candidateName}
contact@example.com · linkedin.com/in/profile · github.com/profile

${dateStr}

Hiring Team
${company}

Dear Hiring Team,

${opening}

${bodyValue}

Furthermore, your job specifications heavily emphasize requirements around ${analysis.matched[0]?.term || 'scalability'} and ${analysis.matched[1]?.term || 'maintainable code'}. Having implemented these exact workflows in production environments, I am well-prepared to contribute to ${company}'s highest priority projects from day one.

${closing}

Sincerely,

${candidateName}`;

  const wordCount = letterText.trim().split(/\s+/).length;

  return {
    company,
    role,
    candidateName,
    tone,
    content: letterText,
    wordCount,
    highlightedKeywords: topKeywords,
  };
}
