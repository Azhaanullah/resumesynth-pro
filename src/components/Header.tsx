import React from 'react';
import { RefreshCw, Sun, Moon, Download, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[var(--accent)] focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-main)]/95 backdrop-blur-sm transition-colors"
      >
        <div className={`mx-auto flex items-center justify-between py-4 ${
          isSidebarOpen ? 'max-w-[1440px] px-6' : 'max-w-[1880px] px-8'
        }`}>
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="min-h-[38px] min-w-[38px] px-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent)] transition cursor-pointer flex items-center justify-center"
              aria-label={isSidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 grid place-items-center rounded-md bg-[var(--accent)] text-white font-bold text-sm"
                aria-hidden="true"
              >
                RS
              </div>
              <span className="font-display text-lg font-bold text-[var(--text-main)] tracking-tight">
                Resume<span className="text-[var(--accent)]">Synth</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                PRO
              </span>
            </div>
          </div>

          {/* Center: Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-sm"
          >
            <a
              href="#dashboard"
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition py-1 font-medium border-b-2 border-transparent hover:border-[var(--accent)]"
            >
              Workspace
            </a>
            <button
              type="button"
              onClick={onToggleHowItWorks}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition py-1 font-medium border-b-2 border-transparent hover:border-[var(--accent)] cursor-pointer"
            >
              How It Works
            </button>
            <a
              href="#ats-analysis"
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition py-1 font-medium border-b-2 border-transparent hover:border-[var(--accent)]"
            >
              Match breakdown
            </a>
            <a
              href="#interview-radar"
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition py-1 font-medium border-b-2 border-transparent hover:border-[var(--accent)]"
            >
              Interview Radar
            </a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="min-h-[38px] min-w-[38px] px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent)] transition active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-medium"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="min-h-[38px] min-w-[38px] px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent)] transition active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-medium"
              title="Reset workspace to default"
              aria-label="Reset workspace to default"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="min-h-[38px] px-4 py-2 rounded-md bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm"
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
