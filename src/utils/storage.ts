import { ResumeProfile, BaselineSnapshot, JobApplication } from '../types';
import { PRESETS } from '../data/presets';

const STORAGE_KEYS = {
  PROFILES: 'resumesynth_profiles_v1',
  ACTIVE_PROFILE_ID: 'resumesynth_active_profile_id_v1',
  BASELINE: 'resumesynth_baseline_v1',
  APPLICATIONS: 'resumesynth_applications_v1',
  THEME: 'resumesynth_theme',
  SIDEBAR: 'resumesynth_sidebar',
};

export function getDefaultProfiles(): ResumeProfile[] {
  return [
    {
      id: 'profile-backend',
      name: 'Backend Specialist',
      targetRole: PRESETS.backend.role,
      company: PRESETS.backend.company,
      resumeText: PRESETS.backend.resume,
      jobDescription: PRESETS.backend.jd,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'profile-fullstack',
      name: 'Full-Stack Developer',
      targetRole: PRESETS.fullstack.role,
      company: PRESETS.fullstack.company,
      resumeText: PRESETS.fullstack.resume,
      jobDescription: PRESETS.fullstack.jd,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'profile-aiml',
      name: 'AI / ML Engineer',
      targetRole: PRESETS.aiml.role,
      company: PRESETS.aiml.company,
      resumeText: PRESETS.aiml.resume,
      jobDescription: PRESETS.aiml.jd,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'profile-devops',
      name: 'DevOps & Cloud',
      targetRole: PRESETS.devops.role,
      company: PRESETS.devops.company,
      resumeText: PRESETS.devops.resume,
      jobDescription: PRESETS.devops.jd,
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function loadSavedProfiles(): ResumeProfile[] {
  if (typeof window === 'undefined') return getDefaultProfiles();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) return getDefaultProfiles();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultProfiles();
  } catch {
    return getDefaultProfiles();
  }
}

export function saveProfiles(profiles: ResumeProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles to localStorage', e);
  }
}

export function loadActiveProfileId(): string {
  if (typeof window === 'undefined') return 'profile-backend';
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID) || 'profile-backend';
}

export function saveActiveProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
}

export function loadBaselineSnapshot(): BaselineSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BASELINE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBaselineSnapshot(snapshot: BaselineSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BASELINE, JSON.stringify(snapshot));
  } catch (e) {
    console.error('Failed to save baseline snapshot', e);
  }
}

export function loadSavedApplications(): JobApplication[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveApplications(apps: JobApplication[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  } catch (e) {
    console.error('Failed to save applications to localStorage', e);
  }
}
