export interface KeywordSignal {
  term: string;
  count: number;
  category?: 'technical' | 'tool' | 'methodology' | 'soft_skill';
}

export interface MissingKeyword {
  term: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  context?: string;
}

export interface ScoreCategory {
  score: number;
  label: string;
  found?: number;
  total?: number;
  count?: number;
  explanation?: string;
}

export interface AnalysisResult {
  overall: number;
  skills: {
    score: number;
    found: number;
    total: number;
  };
  verbs: {
    score: number;
    label: string;
    count: number;
  };
  proof: {
    score: number;
    count: number;
    label: string;
  };
  format: {
    score: number;
    label: string;
  };
  seniority: {
    score: number;
    label: string;
  };
  readability: {
    score: number;
    label: string;
  };
  matched: KeywordSignal[];
  missing: MissingKeyword[];
  enhanced: string;
  improvement: string;
  bulletsCount: number;
  wordCount: number;
}

export interface PresetData {
  id: string;
  label: string;
  role: string;
  company: string;
  category: string;
  jd: string;
  resume: string;
}

export interface QualityIssue {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  current: string;
  suggested: string;
  why: string;
  category: 'verb' | 'metric' | 'keyword' | 'format';
}

export interface InterviewQuestion {
  id: string;
  type: string;
  category: 'Technical' | 'System Design' | 'Project Impact' | 'Behavioral';
  question: string;
  why: string;
  answer: string;
  keyPoints: string[];
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  score: number;
  status: 'Draft' | 'Tailored' | 'Applied' | 'Interviewing' | 'Offer' | 'Archived';
  dateAdded: string;
  salary?: string;
  notes?: string;
}

export type PreviewTemplate = 'modern' | 'minimal' | 'ats_classic' | 'executive';
export type TailorMode = 'Standard Tailor' | 'Technical Role' | 'Fresher / Campus' | 'Data / AI Role' | 'Management / Lead';

export interface ResumeProfile {
  id: string;
  name: string;
  targetRole: string;
  company?: string;
  resumeText: string;
  jobDescription: string;
  updatedAt: string;
}

export type CoverLetterTone = 'Confident' | 'Professional' | 'Enthusiastic' | 'Executive';

export interface CoverLetterData {
  company: string;
  role: string;
  tone: CoverLetterTone;
  content: string;
  matchedKeywords: string[];
}

export interface BaselineSnapshot {
  id: string;
  timestamp: string;
  resumeText: string;
  overallScore: number;
  skillsFound: number;
  verbsScore: number;
  proofScore: number;
}
