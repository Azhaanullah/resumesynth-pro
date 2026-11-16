import React from 'react';
import { Sparkles, RefreshCw, Sun, Moon, Download, Menu, ShieldCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenExport: () => void;
  onToggleHowItWorks: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenExport,
  onToggleHowItWorks,
  onToggleSidebar,
  isSidebarOpen,
  isDark,
  onToggleTheme
}) => {
  return (
    <>
      {/* 1. Skip to Content Link (WCAG 2.4.1 Bypass Blocks) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-lime-400 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-white/[0.12] bg-[#070c18]/90 backdrop-blur-xl transition-colors"
      >
        <div className={`mx-auto flex items-center justify-between py-3 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'max-w-[1440px] px-4 sm:px-8' : 'max-w-[1880px] px-6 sm:px-12 lg:px-16'
        }`}>
          {/* Left: Sidebar Toggle Key & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="sidebar-toggle-btn min-h-[44px] min-w-[44px] px-2.5 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-slate-200 hover:text-white hover:bg-white/[0.12] flex items-center justify-center cursor-pointer transition active:scale-95 gap-1.5 group"
              aria-label={isSidebarOpen ? "Close sidebar menu (Enlarge view) [Shortcut: [ or Ctrl+B]" : "Open sidebar menu (Normal view) [Shortcut: [ or Ctrl+B]"}
              title={isSidebarOpen ? "Close sidebar (Enlarge view) — Shortcut: [ or Ctrl+B" : "Open sidebar (Normal view) — Shortcut: [ or Ctrl+B"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 transition group-hover:-translate-x-0.5 text-slate-300" aria-hidden="true" />
              ) : (
                <PanelLeftOpen className="w-5 h-5 transition group-hover:translate-x-0.5 text-slate-300" aria-hidden="true" />
              )}
              <span className="hidden xl:inline text-[10px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded font-semibold shortcut-hint">
                [
              </span>
            </button>

            <div className="flex items-center gap-3">
              <div
                className="header-brand-logo grid h-10 w-10 place-items-center rounded-xl border border-lime-400/40 bg-lime-400/15 text-lime-300 shadow-[0_0_24px_rgba(163,230,53,0.2)] transition-colors"
                aria-hidden="true"
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-white header-brand-name transition-colors">
                  Resume<span className="text-lime-300 header-brand-accent transition-colors">Synth</span>
                </span>
                <span className="header-brand-badge hidden sm:inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-300 font-bold transition-colors">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Center: Semantic Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm text-slate-300"
          >
            <a
              href="#dashboard"
              className="hover:text-white transition py-2 font-medium"
            >
              Workspace
            </a>
            <button
              type="button"
              onClick={onToggleHowItWorks}
              className="hover:text-lime-300 transition py-2 font-medium cursor-pointer text-slate-300 flex items-center gap-1.5"
            >
              <span>How It Works</span>
            </button>
            <a
              href="#ats-analysis"
              className="hover:text-cyan-300 transition py-2 font-medium"
            >
              Match breakdown
            </a>
            <a
              href="#interview-radar"
              className="hover:text-violet-300 transition py-2 font-medium"
            >
              Interview Radar
            </a>
          </nav>

          {/* Right: Actions with 44px min tap targets */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Light / Dark Mode) */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="theme-toggle-btn group min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.06] text-xs font-semibold text-slate-200 hover:border-white/30 hover:bg-white/[0.12] hover:text-white transition active:scale-95 cursor-pointer flex items-center gap-2"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300 transition-transform group-hover:rotate-45" aria-hidden="true" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500 transition-transform group-hover:-rotate-12" aria-hidden="true" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="group min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.06] text-xs font-semibold text-slate-200 hover:border-white/30 hover:bg-white/[0.12] hover:text-white transition active:scale-95 cursor-pointer flex items-center gap-2"
              title="Reset resume and job description to default"
              aria-label="Reset workspace to default"
            >
              <RefreshCw className="w-4 h-4 transition group-hover:rotate-180 duration-500 text-slate-300" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="header-export-btn min-h-[44px] px-4 py-2 rounded-xl bg-lime-400 text-slate-950 text-xs font-bold hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95 cursor-pointer flex items-center gap-2"
              aria-label="Open export options and PDF generation dialog"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
