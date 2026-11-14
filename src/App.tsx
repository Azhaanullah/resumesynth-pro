import React, { useState, useMemo, useEffect } from 'react';
import { PRESETS } from './data/presets';
import { runAtsAnalysis, detectQualityIssues, generateInterviewQuestions } from './utils/atsEngine';
import { JobApplication, TailorMode, QualityIssue, ResumeProfile, BaselineSnapshot } from './types';
import {
  loadSavedProfiles,
  saveProfiles,
  loadActiveProfileId,
  saveActiveProfileId,
  loadBaselineSnapshot,
  saveBaselineSnapshot,
  loadSavedApplications,
  saveApplications
} from './utils/storage';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroSection } from './components/HeroSection';
import { InputWorkspace } from './components/InputWorkspace';
import { ProfileManager } from './components/ProfileManager';
import { ScoreRing } from './components/ScoreRing';
import { SignalGraph } from './components/SignalGraph';
import { VocabularyGapMap } from './components/VocabularyGapMap';
import { VersionDiffViewer } from './components/VersionDiffViewer';
import { StarBulletOptimizer } from './components/StarBulletOptimizer';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { ResumeHealthSection } from './components/ResumeHealthSection';
import { ResumeEditorLivePreview } from './components/ResumeEditorLivePreview';
import { InterviewPrepRadar } from './components/InterviewPrepRadar';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ExportModal } from './components/ExportModal';
import { AtsPdfPreviewModal } from './components/AtsPdfPreviewModal';

import { Sparkles, ShieldCheck, Sliders, Printer } from 'lucide-react';

export const App: React.FC = () => {
  // Theme & Layout state with localStorage persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resumesynth_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('resumesynth_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // Unified Sidebar state with persistence and default open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resumesynth_sidebar');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('resumesynth_sidebar', String(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      showToast(next ? 'Sidebar opened · Normal view' : 'Sidebar closed · Enlarged view');
      return next;
    });
  };

  // Keyboard shortcut listener for opening/closing sidebar: '[' or Ctrl+B / Cmd+B or '\'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      );

      // Support:
      // 1. Bracket '[' key (when not typing in inputs)
      // 2. Ctrl+B / Cmd+B (universal sidebar shortcut)
      // 3. Backslash '\' (when not typing in inputs)
      if (
        (e.key === '[' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) ||
        ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'b' || e.code === 'KeyB') && !e.shiftKey) ||
        (e.key === '\\' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey)
      ) {
        e.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAtsPdfModal, setShowAtsPdfModal] = useState(false);

  // Saved Profiles State
  const [profiles, setProfiles] = useState<ResumeProfile[]>(() => loadSavedProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>(() => loadActiveProfileId());

  const initialProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Core Data state
  const [selectedPresetId, setSelectedPresetId] = useState('backend');
  const [jobDescription, setJobDescription] = useState(initialProfile?.jobDescription || PRESETS.backend.jd);
  const [resumeText, setResumeText] = useState(initialProfile?.resumeText || PRESETS.backend.resume);
  const [targetRole, setTargetRole] = useState(initialProfile?.targetRole || PRESETS.backend.role);
  const [tailorMode, setTailorMode] = useState<TailorMode>('Standard Tailor');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Baseline Snapshot for Before vs After Diff
  const [baseline, setBaseline] = useState<BaselineSnapshot | null>(() => loadBaselineSnapshot());

  // Applications Tracker state with localStorage persistence
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    return loadSavedApplications() || [
      { id: 'app-1', company: 'Stripe', role: 'Junior Backend Systems Engineer', score: 86, status: 'Tailored', dateAdded: '2026-10-01', salary: '$140k - $160k' },
      { id: 'app-2', company: 'Spotify', role: 'Data Analyst Intern', score: 79, status: 'Interviewing', dateAdded: '2026-10-02', salary: '$55/hr' },
      { id: 'app-3', company: 'Vercel', role: 'Full Stack Engineer', score: 92, status: 'Applied', dateAdded: '2026-10-03', salary: '$150k - $175k' },
      { id: 'app-4', company: 'Airbnb', role: 'Frontend Software Engineer', score: 74, status: 'Draft', dateAdded: '2026-10-04', salary: '$160k - $185k' },
    ];
  });

  // Sync state to localStorage
  useEffect(() => {
    saveApplications(applications);
  }, [applications]);

  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveActiveProfileId(activeProfileId);
  }, [activeProfileId]);

  // Keep active profile synced with local edits
  useEffect(() => {
    setProfiles(prev =>
      prev.map(p =>
        p.id === activeProfileId
          ? { ...p, resumeText, jobDescription, targetRole, updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, [resumeText, jobDescription, targetRole, activeProfileId]);

  // Accessible Toast Notification (announced via aria-live)
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run Real-time ATS Analysis Engine
  const analysis = useMemo(() => {
    return runAtsAnalysis(jobDescription, resumeText, tailorMode);
  }, [jobDescription, resumeText, tailorMode]);

  // Auto-initialize baseline snapshot if none exists
  useEffect(() => {
    if (!baseline && resumeText) {
      const initialSnapshot: BaselineSnapshot = {
        id: `baseline-${Date.now()}`,
        timestamp: new Date().toISOString(),
        resumeText,
        overallScore: analysis.overall,
        skillsFound: analysis.skills.found,
        verbsScore: analysis.verbs.score,
        proofScore: analysis.proof.score,
      };
      setBaseline(initialSnapshot);
      saveBaselineSnapshot(initialSnapshot);
    }
  }, []);

  const handleSetBaseline = () => {
    const snapshot: BaselineSnapshot = {
      id: `baseline-${Date.now()}`,
      timestamp: new Date().toISOString(),
      resumeText,
      overallScore: analysis.overall,
      skillsFound: analysis.skills.found,
      verbsScore: analysis.verbs.score,
      proofScore: analysis.proof.score,
    };
    setBaseline(snapshot);
    saveBaselineSnapshot(snapshot);
    showToast(`Baseline snapshot captured at ${analysis.overall}% ATS score.`);
  };

  const handleRestoreBaseline = () => {
    if (!baseline) return;
    setResumeText(baseline.resumeText);
    showToast(`Reverted resume text to baseline snapshot.`);
  };

  // Profile Management Handlers
  const handleSelectProfile = (id: string) => {
    const prof = profiles.find(p => p.id === id);
    if (!prof) return;
    setActiveProfileId(id);
    setResumeText(prof.resumeText);
    setJobDescription(prof.jobDescription);
    setTargetRole(prof.targetRole);
    showToast(`Switched to profile "${prof.name}".`);
  };

  const handleCreateProfile = (name: string) => {
    const newProf: ResumeProfile = {
      id: `profile-${Date.now()}`,
      name,
      targetRole,
      resumeText,
      jobDescription,
      updatedAt: new Date().toISOString(),
    };
    setProfiles(prev => [newProf, ...prev]);
    setActiveProfileId(newProf.id);
    showToast(`Created new profile "${name}".`);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      showToast('Cannot delete the last remaining profile.');
      return;
    }
    const remaining = profiles.filter(p => p.id !== id);
    setProfiles(remaining);
    if (activeProfileId === id) {
      handleSelectProfile(remaining[0].id);
    }
    showToast('Profile removed.');
  };

  // Detect Quality Audits
  const qualityIssues = useMemo(() => {
    return detectQualityIssues(resumeText, analysis, jobDescription);
  }, [resumeText, analysis, jobDescription]);

  // Generate Interview Questions
  const interviewQuestions = useMemo(() => {
    return generateInterviewQuestions(analysis, targetRole);
  }, [analysis, targetRole]);

  // Preset Selection Handler
  const handleSelectPreset = (presetId: string) => {
    const p = PRESETS[presetId];
    if (!p) return;
    setSelectedPresetId(presetId);
    setJobDescription(p.jd);
    setResumeText(p.resume);
    setTargetRole(p.role);
    showToast(`${p.label} preset loaded.`);
  };

  // Reset to default
  const handleReset = () => {
    handleSelectPreset('backend');
    showToast('Reset workspace to default.');
  };

  // Manual Re-Analysis Trigger
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast('ATS Compatibility Analysis refreshed with latest evidence!');
    }, 450);
  };

  // Insert a missing keyword into the resume
  const handleAddKeyword = (kw: string) => {
    const newBullet = `\n* Applied ${kw} in development to optimize system reliability and delivery.`;
    setResumeText(prev => prev.trim() + newBullet);
    showToast(`Added starter bullet for "${kw}" to resume.`);
  };

  // Apply STAR Bullet Rewrite into resume text
  const handleApplyBullet = (newBullet: string) => {
    setResumeText(prev => `${prev.trim()}\n* ${newBullet}`);
    showToast('STAR bullet appended to your resume editor.');
  };

  // Fix an issue automatically
  const handleFixIssue = (issue: QualityIssue) => {
    if (issue.category === 'verb') {
      const match = resumeText.match(new RegExp(issue.current.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i'));
      if (match) {
        setResumeText(prev => prev.replace(match[0], issue.suggested));
        showToast('Verb upgraded in resume text.');
      }
    } else {
      document.getElementById('resume-editor')?.scrollIntoView({ behavior: 'smooth' });
      showToast('Review and refine in editor.');
    }
  };

  // Navigation scroll handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      showToast(`Switched to ${next ? 'Dark' : 'Light'} Mode`);
      return next;
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#070c18] text-slate-100 selection:bg-lime-400 selection:text-slate-950' : 'light bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white'} font-sans transition-colors duration-200`}>
      {/* Ambient background glow orbs - active in dark mode only */}
      {isDark && (
        <>
          <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-lime-400/[0.035] rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
          <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-400/[0.035] rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
        </>
      )}

      {/* Header */}
      <Header
        onReset={handleReset}
        onOpenExport={() => setShowExportModal(true)}
        onToggleHowItWorks={() => setShowHowItWorks(v => !v)}
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          showToast('Sidebar closed · Enlarged view');
        }}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Accessibility: ARIA Live Toast Notification Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-50 pointer-events-none"
      >
        {toastMessage && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-lime-400/40 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
            <Sparkles className="w-4 h-4 text-lime-300 shrink-0" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Semantic Main Content: Enlarges dynamically when sidebar is closed */}
      <main
        id="main-content"
        role="main"
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:pl-64' : 'pl-0'
        }`}
      >
        <div
          className={`mx-auto py-8 lg:py-10 space-y-12 transition-all duration-300 ease-in-out ${
            isSidebarOpen
              ? 'max-w-[1440px] px-4 sm:px-8'
              : 'max-w-[1880px] px-6 sm:px-12 lg:px-16 enlarged-workspace'
          }`}
        >
          {/* Section 1: Hero & Role Presets */}
          <div id="dashboard">
            <HeroSection
              selectedPreset={selectedPresetId}
              onSelectPreset={handleSelectPreset}
              showHowItWorks={showHowItWorks}
              onToggleHowItWorks={() => setShowHowItWorks(v => !v)}
            />
          </div>

          {/* Profile Switcher & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/75 border border-white/10 backdrop-blur-xl shadow-lg">
            <div className="flex flex-wrap items-center gap-3">
              <ProfileManager
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSelectProfile={handleSelectProfile}
                onCreateProfile={handleCreateProfile}
                onDeleteProfile={handleDeleteProfile}
                currentRole={targetRole}
              />
              <span className="hidden sm:inline text-xs text-slate-300">
                • Target: <strong className="text-lime-300">{targetRole}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAtsPdfModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>ATS Resume Preview</span>
              </button>
            </div>
          </div>

          {/* Section 2: Input Workspace */}
          <InputWorkspace
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            resumeText={resumeText}
            onResumeChange={setResumeText}
            targetRole={targetRole}
            onTargetRoleChange={setTargetRole}
            onRunAnalysis={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
          />

          {/* Section 3: ATS Score Breakdown & Signal Matrix */}
          <section id="ats-analysis" aria-labelledby="matrix-heading" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.1]">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lime-300 font-bold">
                  <span>ATS Evidence Framework</span>
                  <span className="text-white/20">•</span>
                  <span>Transparent Scoring</span>
                </div>
                <h2 id="matrix-heading" className="font-display text-2xl font-bold text-white tracking-tight mt-1">
                  Match Signal & Compatibility Breakdown
                </h2>
              </div>

              {/* Mode Selector */}
              <fieldset className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/[0.1]">
                <legend className="sr-only">Tailor Optimization Mode</legend>
                <Sliders className="w-4 h-4 text-slate-400 ml-2" aria-hidden="true" />
                <span className="text-xs font-mono text-slate-300 mr-1 font-semibold uppercase">Mode:</span>
                {(['Standard Tailor', 'Technical Role', 'Fresher / Campus', 'Data / AI Role'] as TailorMode[]).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTailorMode(mode)}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      tailorMode === mode
                        ? 'bg-lime-400/25 text-lime-200 border border-lime-400/40 shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    aria-pressed={tailorMode === mode}
                  >
                    {mode}
                  </button>
                ))}
              </fieldset>
            </div>

            {/* Score Showcase Card */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-xl items-center">
              <div className="flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-white/[0.1]">
                <ScoreRing score={analysis.overall} />
                <p className="text-center text-xs text-slate-300 mt-3">
                  Grounded match computed from {analysis.skills.found} verified keyword signals & STAR metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/[0.08] bg-black/50">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="text-slate-200">Technical Requirements</span>
                    <span className="font-mono text-lime-300">{analysis.skills.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full bg-lime-400 rounded-full transition-all duration-700" style={{ width: `${analysis.skills.score}%` }} />
                  </div>
                  <span className="text-xs text-slate-300 mt-1 block">
                    {analysis.skills.found} of {analysis.skills.total} required technologies found
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.08] bg-black/50">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="text-slate-200">Power Action Verbs</span>
                    <span className="font-mono text-violet-300">{analysis.verbs.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full bg-violet-400 rounded-full transition-all duration-700" style={{ width: `${analysis.verbs.score}%` }} />
                  </div>
                  <span className="text-xs text-slate-300 mt-1 block">
                    {analysis.verbs.label} ({analysis.verbs.count} verbs detected)
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.08] bg-black/50">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="text-slate-200">Quantifiable Proof & Metrics</span>
                    <span className="font-mono text-cyan-300">{analysis.proof.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full transition-all duration-700" style={{ width: `${analysis.proof.score}%` }} />
                  </div>
                  <span className="text-xs text-slate-300 mt-1 block">
                    {analysis.proof.label}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.08] bg-black/50">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="text-slate-200">ATS Format & Headings</span>
                    <span className="font-mono text-emerald-300">{analysis.format.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${analysis.format.score}%` }} />
                  </div>
                  <span className="text-xs text-slate-300 mt-1 block">
                    {analysis.format.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Signal Balance Graph + Keyword Gap Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SignalGraph analysis={analysis} />
              <VocabularyGapMap analysis={analysis} onAddKeyword={handleAddKeyword} />
            </div>
          </section>

          {/* Section 4: Version & ATS Growth Delta */}
          <VersionDiffViewer
            currentResume={resumeText}
            currentAnalysis={analysis}
            baseline={baseline}
            onSetBaseline={handleSetBaseline}
            onRestoreBaseline={handleRestoreBaseline}
          />

          {/* Section 5: STAR Bullet Rewriter Studio */}
          <div id="feature-suite">
            <StarBulletOptimizer
              analysis={analysis}
              onApplyBullet={handleApplyBullet}
            />
          </div>

          {/* Section 6: AI Targeted Cover Letter Generator */}
          <CoverLetterGenerator
            targetRole={targetRole}
            resumeText={resumeText}
            jobDescription={jobDescription}
            analysis={analysis}
          />

          {/* Section 7: Resume Health Audits */}
          <ResumeHealthSection
            analysis={analysis}
            issues={qualityIssues}
            jobDescription={jobDescription}
            onFixIssue={handleFixIssue}
          />

          {/* Section 6: Live Editor & Real Rendered ATS Preview */}
          <ResumeEditorLivePreview
            resumeText={resumeText}
            onResumeChange={setResumeText}
            analysis={analysis}
            targetRole={targetRole}
          />

          {/* Section 7: Interview Prep Radar */}
          <InterviewPrepRadar
            questions={interviewQuestions}
            onCopyAll={(qs) => {
              const text = qs.map((q, i) => `${i + 1}. [${q.category}] ${q.question}\nSuggested Track: ${q.answer}\n`).join('\n');
              navigator.clipboard.writeText(text);
              showToast('All mock interview questions copied to clipboard!');
            }}
          />

          {/* Section 8: Applications Pipeline Tracker */}
          <ApplicationTracker
            applications={applications}
            onAddApplication={(newApp) => {
              const item: JobApplication = {
                id: `app-${Date.now()}`,
                dateAdded: new Date().toISOString().split('T')[0],
                ...newApp
              };
              setApplications(prev => [item, ...prev]);
              showToast(`Application for ${newApp.company} added!`);
            }}
            onDeleteApplication={(id) => {
              setApplications(prev => prev.filter(a => a.id !== id));
              showToast('Application removed.');
            }}
            onUpdateStatus={(id, st) => {
              setApplications(prev => prev.map(a => a.id === id ? { ...a, status: st } : a));
              showToast(`Status updated to ${st}.`);
            }}
          />

          {/* Semantic Footer */}
          <footer
            role="contentinfo"
            className="pt-8 pb-12 border-t border-white/[0.1] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-lime-400" aria-hidden="true" />
              <span>ResumeSynth Pro · Clear ATS Scoring & Intelligent AI Tailoring</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs text-slate-300">
              <span>Local Session Safe</span>
              <span>•</span>
              <span>WCAG AA Compliant</span>
              <span>•</span>
              <span>© 2026 ResumeSynth</span>
            </div>
          </footer>
        </div>
      </main>

      {/* Export Dialog */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        resumeText={resumeText}
        analysis={analysis}
        role={targetRole}
        onOpenAtsPreview={() => setShowAtsPdfModal(true)}
      />

      {/* ATS-Optimized Print & Preview Modal */}
      <AtsPdfPreviewModal
        isOpen={showAtsPdfModal}
        onClose={() => setShowAtsPdfModal(false)}
        resumeText={resumeText}
        role={targetRole}
        analysis={analysis}
      />
    </div>
  );
};
