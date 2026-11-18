import { AnalysisResult, KeywordSignal, MissingKeyword, QualityIssue, InterviewQuestion, TailorMode } from '../types';

// Synonym mappings — expand these as needed for each category
const SYNONYM_MAP: Record<string, string[]> = {
  // Languages
  "go": ["golang"],
  "golang": ["go"],
  "c++": ["cpp", "c plus plus"],
  "cpp": ["c++", "c plus plus"],
  "c#": ["csharp", "c sharp"],
  "csharp": ["c#", "c sharp"],
  "javascript": ["js"],
  "typescript": ["ts"],
  "python": [],
  "java": [],
  "rust": [],
  "ruby": [],
  "php": [],
  "swift": [],
  "kotlin": [],
  "scala": [],
  "sql": [],
  // Frameworks & Libraries
  "react": ["jsx", "tsx", "next.js", "nextjs"],
  "next.js": ["nextjs"],
  "vue": ["vue.js", "vuetify"],
  "angular": ["angularjs", "ng"],
  "node.js": ["nodejs", "node"],
  "express": ["express.js"],
  "nestjs": ["nest"],
  "fastapi": [],
  "django": [],
  "flask": [],
  "spring boot": ["spring"],
  "pytorch": ["torch"],
  "tensorflow": ["tf"],
  "hugging face": ["huggingface", "hf"],
  "langchain": [],
  "llamaindex": ["llama index"],
  "pandas": [],
  "numpy": ["np"],
  "scikit-learn": ["sklearn", "scikit"],
  "tailwind css": ["tailwind"],
  "graphql": [],
  "redux": [],
  "zustand": [],
  // Databases & Storage
  "postgresql": ["postgres", "psql"],
  "mysql": [],
  "mongodb": ["mongo"],
  "redis": [],
  "kafka": [],
  "elasticsearch": ["es"],
  "chromadb": [],
  "pinecone": [],
  "qdrant": [],
  "dynamodb": ["dynamo db"],
  "cassandra": [],
  "bigquery": ["bq"],
  "snowflake": [],
  "supabase": [],
  "prisma": [],
  // DevOps & Cloud
  "docker": [],
  "kubernetes": ["k8s"],
  "aws": [],
  "gcp": ["google cloud", "google cloud platform"],
  "azure": [],
  "terraform": [],
  "ci/cd": ["continuous integration", "continuous deployment"],
  "github actions": [],
  "gitlab ci": [],
  "argocd": [],
  "helm": [],
  "prometheus": [],
  "grafana": [],
  "datadog": [],
  "linux": ["unix", "ubuntu", "debian", "centos"],
  "git": [],
  "nginx": [],
  "microservices": ["microservice architecture", "service-oriented architecture", "soa"],
  "rest apis": ["rest", "restful"],
  "grpc": [],
  "websockets": ["websocket"],
  "serverless": [],
  // Architecture & Methodologies
  "distributed systems": ["distributed computing", "distributed architecture"],
  "system design": [],
  "acid": ["atomicity consistency isolation durability"],
  "concurrency": ["parallelism", "multithreading"],
  "rag": ["retrieval augmented generation"],
  "llms": ["large language models"],
  "ab testing": ["a/b testing", "A/B test", "split testing"],
  "agile": ["scrum", "kanban", "lean"],
  "tdd": ["test driven development"],
  "unit testing": ["unit tests", "testing"],
  "observability": ["monitoring", "telemetry", "logging"],
  "telemetry": [],
  "caching": [],
  "performance tuning": ["optimization", "perf tuning"],
  "vector search": ["semantic search", "embedding search"],
  "data warehousing": ["data warehouse"],
  "window functions": []
};

export const TECH_KEYWORDS_DICTIONARY = [
  // Languages
  "Go", "Golang", "C++", "C#", "Java", "Python", "TypeScript", "JavaScript", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "SQL", "HTML5", "CSS3", "Bash", "Shell",
  // Frameworks & Libraries
  "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", "PyTorch", "TensorFlow", "Hugging Face", "LangChain", "LlamaIndex", "Pandas", "NumPy", "Scikit-Learn", "Tailwind CSS", "GraphQL", "Redux", "Zustand",
  // Databases & Storage
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "Elasticsearch", "ChromaDB", "Pinecone", "Qdrant", "DynamoDB", "Cassandra", "BigQuery", "Snowflake", "Supabase", "Prisma",
  // DevOps & Cloud
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "CI/CD", "GitHub Actions", "GitLab CI", "ArgoCD", "Helm", "Prometheus", "Grafana", "Datadog", "Linux", "Git", "Nginx", "Microservices", "REST APIs", "gRPC", "WebSockets", "Serverless",
  // Architecture & Methodologies
  "Distributed Systems", "System Design", "ACID", "Concurrency", "RAG", "LLMs", "A/B Testing", "Agile", "Scrum", "TDD", "Unit Testing", "Observability", "Telemetry", "Caching", "Performance Tuning", "Vector Search", "Data Warehousing", "Window Functions"
];

export const POWER_ACTION_VERBS = [
  "architected", "engineered", "spearheaded", "developed", "built", "implemented", "optimized", "accelerated", "slashed", "scaled", "orchestrated", "automated", "designed", "deployed", "streamlined", "overhauled", "championed", "formulated", "revamped", "integrated", "transformed", "directed", "authored"
];

export const WEAK_VERBS_MAP: Record<string, string> = {
  "worked on": "Engineered",
  "helped with": "Collaborated to build",
  "responsible for": "Spearheaded",
  "did": "Executed",
  "made": "Constructed",
  "used": "Leveraged",
  "participated in": "Contributed to",
  "assisted in": "Co-engineered",
  "handled": "Orchestrated",
  "was part of": "Co-developed"
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalize only for keyword matching — preserves technical syntax like C++, Next.js
function normalizeKeyword(kw: string): string {
  return kw.toLowerCase().replace(/\s+/g, ' ').trim();
}

// Build a full lookup map: canonical normalized → [canonical, ...synonyms]
const KEYWORD_SYNONYM_MAP: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const [term, aliases] of Object.entries(SYNONYM_MAP)) {
    const all = [term, ...aliases].map(s => normalizeKeyword(s));
    all.forEach(a => map.set(a, all));
  }
  // Also add canonical names from dictionary
  TECH_KEYWORDS_DICTIONARY.forEach(kw => {
    const nk = normalizeKeyword(kw);
    if (!map.has(nk)) map.set(nk, [nk]);
  });
  return map;
})();

function expandKeywordGroup(term: string): string[] {
  const nk = normalizeKeyword(term);
  return KEYWORD_SYNONYM_MAP.get(nk) || [nk];
}

// Word-boundary aware match helper
function hasBoundaryMatch(text: string, normTerm: string): boolean {
  // Escape regex special chars except word chars and spaces
  const escaped = normTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(?:^|\\s|[-/])(?:${escaped})(?:\\s|$|[.,;!:@#])`, 'i');
  // Also allow bare standalone term
  const simplePattern = new RegExp(`\\b${escaped}\\b`, 'i');
  return simplePattern.test(text) || pattern.test(text);
}

// Count occurrences with boundary awareness
function countBoundaryMatches(text: string, normTerm: string): number {
  const escaped = normTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\b${escaped}\\b`, 'gi');
  let matches: RegExpExecArray | null;
  let count = 0;
  while ((matches = pattern.exec(text)) !== null) count++;
  return count;
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function countBullets(text: string): number {
  return text.match(/(^|\n)\s*(?:[*•-]|\d+[.)])\s+/g)?.length ?? (text.trim() ? 1 : 0);
}

// Required keywords — "must-have" signals from JD
const REQUIRED_SIGNALS = [
  /(?:required|mandatory|must\s+(?:have|possess)|essential|core.*skill|key.*requirement)/i,
  /(?:need.*[^ ]+.{0,20}(?:experience|proficiency|knowledge))/i,
];

// Preferred keywords — nice-to-have signals
const PREFERRED_SIGNALS = [
  /(?:preferred|nice.?to.?have|bonus|familiarity|exposure|knowledge\.?of)/i,
  /(?:desirable| advantageous| a\+\+)/i,
];

export function extractJobKeywords(jobDescription: string): Array<{ term: string; priority: 'required' | 'preferred' }> {
  const normalizedJd = normalizeText(jobDescription);
  const foundKeywords: Array<{ term: string; priority: 'required' | 'preferred' }> = [];

  // Match predefined keywords with priority detection
  TECH_KEYWORDS_DICTIONARY.forEach(kw => {
    const normKw = normalizeKeyword(kw);
    const synonyms = expandKeywordGroup(kw);

    const matches = synonyms.some(s => normalizedJd.includes(s));
    if (!matches) return;

    // Detect priority based on context
    let priority: 'required' | 'preferred' = 'preferred';

    // Check surrounding context for required/preferred signals
    const regex = new RegExp(`(?:${synonyms.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    let match;
    while ((match = regex.exec(normalizedJd)) !== null) {
      const start = Math.max(0, match.index - 80);
      const end = Math.min(normalizedJd.length, match.index + kw.length + 80);
      const context = normalizedJd.slice(start, end);

      if (REQUIRED_SIGNALS.some(sig => sig.test(context))) {
        priority = 'required';
        break;
      }
      if (PREFERRED_SIGNALS.some(sig => sig.test(context))) {
        priority = 'preferred';
      }
    }

    foundKeywords.push({ term: kw, priority });
  });

  // Extract custom phrases like "experience with X", "proficiency in Y"
  const customMatches = jobDescription.match(/(?:experience with|proficiency in|knowledge of|familiarity with|strong in|skills in|working with)\s+([A-Za-z0-9+#.\s]{2,40})(?=[.,;)])/gi) || [];
  customMatches.forEach(m => {
    const clean = m.replace(/^(?:experience with|proficiency in|knowledge of|familiarity with|strong in|skills in|working with)\s+/i, '').trim();
    if (clean.length > 2 && clean.length < 30) {
      const alreadyFound = foundKeywords.some(fk => fk.term === clean);
      if (!alreadyFound) {
        // Determine priority from original phrasing
        const isRequired = /(?:required|mandatory|must|essential|core)/i.test(m);
        const isPreferred = /(?:preferred|nice.?to.?have|bonus|familiarity|desirable)/i.test(m);
        foundKeywords.push({
          term: clean.charAt(0).toUpperCase() + clean.slice(1),
          priority: isRequired ? 'required' : isPreferred ? 'preferred' : 'preferred'
        });
      }
    }
  });

  // Sort: required first
  foundKeywords.sort((a, b) => {
    if (a.priority === 'required' && b.priority !== 'required') return -1;
    if (a.priority !== 'required' && b.priority === 'required') return 1;
    return 0;
  });

  return foundKeywords;
}

export function runAtsAnalysis(
  jobDescription: string,
  resumeText: string,
  mode: TailorMode = 'Standard Tailor'
): AnalysisResult {
  const normJd = normalizeText(jobDescription);
  const normResume = normalizeText(resumeText);
  const words = countWords(resumeText);
  const bullets = countBullets(resumeText);

  if (!normJd || !normResume) {
    return {
      overall: 0,
      skills: { score: 0, found: 0, total: 0 },
      verbs: { score: 0, label: "No evidence", count: 0 },
      proof: { score: 0, count: 0, label: "No metrics" },
      format: { score: 0, label: "Incomplete" },
      seniority: { score: 0, label: "Not assessed" },
      readability: { score: 0, label: "Not assessed" },
      matched: [],
      missing: [],
      enhanced: "",
      improvement: "+0 pts",
      bulletsCount: bullets,
      wordCount: words
    };
  }

  // 1. Technical keywords match (with synonym expansion and boundary checking)
  const jdKeywords = extractJobKeywords(jobDescription);
  const matchedKeywords: KeywordSignal[] = [];
  const missingKeywords: MissingKeyword[] = [];
  const keywordOccurrences: Record<string, number> = {}; // For stuffing detection

  // Semantic scoring improvements for required vs. preferred keywords
  let skillScore = 0;

  // Calculate skill score with improved semantics
  const semanticSkillScore = () => {
    const requiredJdCount = jdKeywords.filter(k => k.priority === 'required').length;
    const requiredMatched = matchedKeywords.filter(m =>
      jdKeywords.some(k => k.term === m.term && k.priority === 'required')
    ).length;
    const preferredJdCount = jdKeywords.filter(k => k.priority === 'preferred').length;
    const preferredMatched = matchedKeywords.filter(m =>
      jdKeywords.some(k => k.term === m.term && k.priority === 'preferred')
    ).length;

    // Base score from matched keywords
    let score = 0;

    // Required keywords are mandatory: missing one is severe penalty
    if (requiredJdCount > 0) {
      score += (requiredMatched / requiredJdCount) * 50;
    }

    // Preferred keywords add partial credit
    if (preferredJdCount > 0) {
      score += (preferredMatched / preferredJdCount) * 30;
    }

    // Cap at 100
    return Math.min(100, score);
  };

  // Calculate semantic skill score with improved prioritization
  skillScore = Math.round(semanticSkillScore());

  jdKeywords.forEach(kw => {
    const normKw = normalizeKeyword(kw.term);
    const synonyms = expandKeywordGroup(kw.term);

    // Check all synonyms for matches
    let foundCount = 0;
    let anyMatch = false;

    synonyms.forEach(syn => {
      const count = countBoundaryMatches(normResume, syn);
      if (count > 0) {
        foundCount += count;
        anyMatch = true;
      }
    });

    if (anyMatch) {
      // Apply stuffing penalty: cap useful mentions at 4
      const cappedCount = Math.min(foundCount, 4);
      matchedKeywords.push({
        term: kw.term,
        count: cappedCount,
        category: 'technical'
      });
      keywordOccurrences[normKw] = foundCount;
    } else {
      // Determine priority from JD context
      const jdKeywordEntry = jdKeywords.find(k => k.term === kw.term);
      missingKeywords.push({
        term: kw.term,
        priority: jdKeywordEntry?.priority === 'required' ? 'high' : 'medium',
        category: 'technical'
      });
    }
  });

  const totalJdTerms = Math.max(1, jdKeywords.length);
  const requiredTotal = jdKeywords.filter(k => k.priority === 'required').length;
  const preferredTotal = jdKeywords.filter(k => k.priority === 'preferred').length;

  // Additional semantic penalty for missing required keywords (beyond stuffing)
  const requiredMissing = requiredTotal - matchedKeywords.filter(m =>
    jdKeywords.some(k => k.term === m.term && k.priority === 'required')
  ).length;
  const requiredPenalty = requiredMissing * 25; // Stronger penalty per missing required term

  // Keyword stuffing penalty: if any keyword appears 5+ times, reduce score
  const stuffingCount = Object.values(keywordOccurrences).filter(c => c >= 5).length;
  let stuffingPenalty = 0;
  if (stuffingCount > 0) {
    stuffingPenalty = Math.min(
      stuffingCount * 8 + Object.values(keywordOccurrences).filter(c => c >= 5).reduce((sum, c) => sum + (c - 4) * 3, 0),
      30
    );
  }

  // 2. Action Verbs analysis
  const powerVerbMatches = POWER_ACTION_VERBS.filter(v => {
    const reg = new RegExp(`\\b${v}\\b`, 'i');
    return reg.test(normResume);
  });
  const verbCount = powerVerbMatches.length;
  const verbScore = Math.min(100, Math.max(20, Math.round(40 + verbCount * 12)));
  const verbLabel = verbScore >= 80 ? "High impact density" : verbScore >= 60 ? "Moderate verbs" : "Needs stronger action verbs";

  // 3. Quantifiable Proof (Numbers, percentages, metrics)
  const numbersRegex = /\b\d+(?:[\d,.]*\s?(?:%|k\b|m\b|x\b|ms\b|sec\b|hours?|users?|students?|records?|requests?|\+|\$|usd)?)\b/gi;
  const metricsFound = resumeText.match(numbersRegex) || [];
  const metricCount = metricsFound.length;
  const proofScore = Math.min(100, Math.round(metricCount * 22 + (metricCount > 0 ? 15 : 0)));
  const proofLabel = metricCount >= 4 ? `${metricCount} metrics verified` : metricCount > 0 ? `${metricCount} metrics found (aim for 4+)` : "Missing quantifiable metrics";

  // 4. Format & ATS Hygiene
  const hasMarkdownHeadings = resumeText.includes("##") || resumeText.includes("#");
  const hasBulletStructure = bullets >= 3;
  const wordCountAppropriate = words >= 80 && words <= 800;
  let formatScore = 70;
  if (hasMarkdownHeadings) formatScore += 15;
  if (hasBulletStructure) formatScore += 10;
  if (wordCountAppropriate) formatScore += 5;
  formatScore = Math.min(100, formatScore);
  const formatLabel = formatScore >= 90 ? "Clean ATS Markdown" : formatScore >= 75 ? "Good Structure" : "Needs cleaner formatting";

  // 5. Seniority & Readability
  const seniorityScore = Math.min(100, Math.max(50, Math.round(skillScore * 0.5 + verbScore * 0.3 + proofScore * 0.2)));
  const readabilityScore = Math.min(100, Math.max(60, Math.round(formatScore * 0.6 + (words > 100 ? 35 : 20))));

  // Weight adjustments based on Tailor Mode
  let weightSkill = 0.45;
  let weightVerbs = 0.20;
  let weightProof = 0.20;
  let weightFormat = 0.15;

  if (mode === 'Technical Role') {
    weightSkill = 0.55;
    weightVerbs = 0.15;
    weightProof = 0.20;
    weightFormat = 0.10;
  } else if (mode === 'Fresher / Campus') {
    weightSkill = 0.35;
    weightVerbs = 0.25;
    weightProof = 0.15;
    weightFormat = 0.25;
  } else if (mode === 'Data / AI Role') {
    weightSkill = 0.50;
    weightVerbs = 0.15;
    weightProof = 0.25;
    weightFormat = 0.10;
  } else if (mode === 'Management / Lead') {
    weightSkill = 0.30;
    weightVerbs = 0.30;
    weightProof = 0.30;
    weightFormat = 0.10;
  }

  const rawOverall = (
    skillScore * weightSkill +
    verbScore * weightVerbs +
    proofScore * weightProof +
    formatScore * weightFormat
  );

  const overall = Math.min(99, Math.max(15, Math.round(rawOverall)));

  // Generate STAR Bullet suggestion
  const firstBullet = resumeText
    .split(/\n(?=\s*(?:[*•-]|\d+[.)])\s+)/)
    .find(b => b.trim().length > 20)
    ?.replace(/^\s*[*•-]\s*/, "") || "Developed project modules using relevant stack.";

  const topSkillsStr = matchedKeywords.slice(0, 2).map(m => m.term).join(" and ") || "industry-standard tools";
  const enhancedBullet = `Architected modular services leveraging ${topSkillsStr}, optimizing throughput and cutting execution latency by 35% across simulated production load.`;
  const potentialBoost = Math.max(8, Math.round((100 - overall) * 0.45));

  return {
    overall,
    skills: {
      score: skillScore,
      found: matchedKeywords.length,
      total: totalJdTerms
    },
    verbs: {
      score: verbScore,
      label: verbLabel,
      count: verbCount
    },
    proof: {
      score: proofScore,
      count: metricCount,
      label: proofLabel
    },
    format: {
      score: formatScore,
      label: formatLabel
    },
    seniority: {
      score: seniorityScore,
      label: seniorityScore >= 80 ? "Well Aligned" : "Moderate Alignment"
    },
    readability: {
      score: readabilityScore,
      label: readabilityScore >= 85 ? "Optimal Scannability" : "Fair"
    },
    matched: matchedKeywords,
    missing: missingKeywords,
    enhanced: enhancedBullet,
    improvement: `+${potentialBoost} pts potential`,
    bulletsCount: bullets,
    wordCount: words
  };
}

export function detectQualityIssues(
  resumeText: string,
  analysis: AnalysisResult,
  jobDescription: string
): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // 1. Weak verbs detection
  for (const [weak, strong] of Object.entries(WEAK_VERBS_MAP)) {
    const reg = new RegExp(`\\b${weak}\\b[^.\\n]*`, 'i');
    const match = resumeText.match(reg);
    if (match) {
      const sentence = match[0];
      issues.push({
        id: `weak-verb-${weak}`,
        severity: 'high',
        category: 'verb',
        title: `Weak action verb: "${weak}"`,
        current: sentence,
        suggested: sentence.replace(new RegExp(`^${weak}`, 'i'), strong),
        why: `Replacing passive phrasing with active verbs like "${strong}" signals direct ownership and leadership.`
      });
      break; // Return highest priority verb issue
    }
  }

  // 2. Missing metrics in bullets
  if (analysis.proof.count < Math.max(1, Math.ceil(analysis.bulletsCount / 2))) {
    issues.push({
      id: 'missing-metrics',
      severity: 'medium',
      category: 'metric',
      title: 'Missing Quantifiable Impact',
      current: 'Several bullets describe tasks without measurable outcomes or scale.',
      suggested: 'Add metrics (e.g., "reduced latency by 40%", "supporting 10k users", "saved 6 hrs/week").',
      why: 'Recruiters and hiring managers look for numbers to validate the scale and real-world value of your contributions.'
    });
  }

  // 3. Top Missing Job Keyword
  if (jobDescription.trim() && analysis.missing.length > 0) {
    const topMissing = analysis.missing[0];
    issues.push({
      id: `missing-kw-${topMissing.term}`,
      severity: topMissing.priority === 'high' ? 'high' : 'medium',
      category: 'keyword',
      title: `Missing High-Priority Keyword: "${topMissing.term}"`,
      current: `Resume lacks evidence or mention of "${topMissing.term}".`,
      suggested: `Include a truthful bullet or coursework project where you applied "${topMissing.term}".`,
      why: 'ATS filters prioritize exact matches found in the core requirements section of the job posting.'
    });
  }

  // 4. Formatting checks
  if (analysis.format.score < 90) {
    issues.push({
      id: 'formatting-hygiene',
      severity: 'low',
      category: 'format',
      title: 'Formatting & Heading Consistency',
      current: 'Missing standard Markdown section headers (e.g., ## Technical Skills, ## Experience).',
      suggested: 'Structure resume with clear markdown headers (## Summary, ## Skills, ## Experience, ## Projects).',
      why: 'ATS parsers rely on recognized standard headers to segment contact details, skills, and work history correctly.'
    });
  }

  return issues;
}

export function generateInterviewQuestions(
  analysis: AnalysisResult,
  roleTitle: string
): InterviewQuestion[] {
  const topMatched = analysis.matched[0]?.term ?? "your primary technical project";
  const secondMatched = analysis.matched[1]?.term ?? "core framework in your resume";
  const topMissing = analysis.missing[0]?.term ?? "a key job requirement";

  return [
    {
      id: 'deep-dive',
      type: 'Deep Dive',
      category: 'Technical',
      question: `Walk me through how you engineered the system using ${topMatched}. What was your specific architectural contribution?`,
      why: 'Tests depth of understanding and separates real hands-on experience from passive resume claims.',
      answer: `Structure with STAR:\n1. Situation: Set the business problem and constraints.\n2. Task: Explain what you were individually accountable for.\n3. Action: Detail one non-obvious engineering decision using ${topMatched}.\n4. Result: Conclude with a verified outcome (e.g. latency, scale, time saved).`,
      keyPoints: [
        `Clarify your individual scope vs team effort`,
        `Name a technical trade-off with ${topMatched}`,
        `Share a concrete metric or deployment outcome`
      ]
    },
    {
      id: 'trade-offs',
      type: 'Architecture & Trade-offs',
      category: 'System Design',
      question: `Why did you select ${secondMatched} over alternative tools, and how would your architecture adapt if traffic scaled 10x?`,
      why: 'Tests engineering judgment, scalability mindset, and awareness of tool limitations.',
      answer: `Explain the initial rationale for ${secondMatched} (e.g. developer velocity, low latency, team familiarity). Then outline the exact bottleneck that would emerge at 10x scale (e.g. connection pool saturation, cache invalidation, network I/O) and how you would migrate or shard.`,
      keyPoints: [
        `State 2 specific technical reasons why ${secondMatched} was chosen`,
        `Identify the primary bottleneck under 10x load`,
        `Propose a concrete caching, indexing, or partitioning fix`
      ]
    },
    {
      id: 'quant-impact',
      type: 'Impact & Measurement',
      category: 'Project Impact',
      question: `Which bullet achievement on your resume are you most proud of, and how did you rigorously measure the result?`,
      why: 'Validates authenticity of numbers and tests whether you understand business/technical metrics.',
      answer: `Pick your strongest quantified bullet. Explain the baseline before your change, the monitoring/telemetry tool used to measure it (e.g. Grafana, Datadog, SQL query, user surveys), and how the improvement impacted end users or teammates.`,
      keyPoints: [
        `State the baseline before the intervention`,
        `Mention the measurement tooling used`,
        `Highlight personal problem-solving autonomy`
      ]
    },
    {
      id: 'gap-mitigation',
      type: 'Gap Strategy',
      category: 'Behavioral',
      question: `This position heavily emphasizes ${topMissing}. How would you ramp up and apply it quickly on the job?`,
      why: 'Evaluates intellectual honesty, rapid learning ability, and problem solving when encountering unfamiliar tech.',
      answer: `Be direct and honest: "I have not worked with ${topMissing} in a high-scale production setting yet, but I have extensive experience with [Adjacent Tool]." Detail your 30-day learning plan: building a proof-of-concept, studying docs, and pairing with teammates.`,
      keyPoints: [
        `Acknowledge the gap with confidence rather than bluffing`,
        `Bridge with an adjacent skill you already mastered`,
        `Provide a rapid 2-week hands-on learning roadmap`
      ]
    }
  ];
}
