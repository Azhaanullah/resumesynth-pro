import React, { useEffect } from 'react';
import { LayoutDashboard, FileText, BarChart2, Wand2, Edit3, Briefcase, HelpCircle, ShieldCheck, PanelLeftClose } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSection,
  onNavigate
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'my-resume', label: 'Inputs & File Upload', icon: FileText },
    { id: 'ats-analysis', label: 'Match breakdown', icon: BarChart2 },
    { id: 'feature-suite', label: 'STAR Bullet Rewriter', icon: Wand2 },
    { id: 'resume-editor', label: 'Resume Editor & Preview', icon: Edit3 },
    { id: 'resume-health', label: 'Quality & Health', icon: ShieldCheck },
    { id: 'applications', label: 'Job Applications', icon: Briefcase },
    { id: 'interview-radar', label: 'Interview Prep Radar', icon: HelpCircle },
  ];

  // Close on Escape key press for accessible modal navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Accessible Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar-navigation"
        role="navigation"
        aria-label="Section Navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-[var(--border)] bg-[var(--bg-secondary)] p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none pointer-events-none'
        }`}
      >
        <div>
          {/* Top Brand / Close */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-bold text-sm shadow-xs sidebar-brand-avatar" aria-hidden="true">
                RS
              </div>
              <span className="font-display font-bold text-[var(--text-main)] tracking-tight">
                Resume<span className="text-[var(--accent)] header-brand-accent">Synth</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="sidebar-close-btn min-h-[40px] min-w-[40px] p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border)] flex items-center justify-center cursor-pointer transition active:scale-95"
              aria-label="Close sidebar menu (Enlarge view) [Shortcut: [ or Esc]"
              title="Close sidebar (Enlarge view) — Shortcut: [ or Esc"
            >
              <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 text-xs font-mono uppercase tracking-widest text-[var(--text-subtle)] px-3 mb-2 font-semibold">
            Workspaces
          </div>

          <nav className="space-y-1.5" aria-label="Sections">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30 shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-subtle)]'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Grounded Guarantee Badge */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-[var(--text-main)] mb-1">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
            <span>Fact-Grounded Mode</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            ResumeSynth strictly anchors suggestions to verified evidence. No hallucinated experience.
          </p>
        </div>
      </aside>
    </>
  );
};
