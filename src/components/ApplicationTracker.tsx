import React, { useState, useEffect } from 'react';
import { JobApplication } from '../types';
import { Briefcase, Plus, Trash2, X } from 'lucide-react';

interface ApplicationTrackerProps {
  applications: JobApplication[];
  onAddApplication: (app: Omit<JobApplication, 'id' | 'dateAdded'>) => void;
  onDeleteApplication: (id: string) => void;
  onUpdateStatus: (id: string, status: JobApplication['status']) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onAddApplication,
  onDeleteApplication,
  onUpdateStatus
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [score, setScore] = useState(85);
  const [status, setStatus] = useState<JobApplication['status']>('Tailored');
  const [salary, setSalary] = useState('$130k - $155k');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) {
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    onAddApplication({
      company,
      role,
      score,
      status,
      salary
    });

    setCompany('');
    setRole('');
    setShowAddModal(false);
  };

  const getStatusBadge = (st: JobApplication['status']) => {
    switch (st) {
      case 'Tailored':
        return 'bg-lime-400/20 text-lime-200 border-lime-400/40';
      case 'Applied':
        return 'bg-sky-400/20 text-sky-200 border-sky-400/40';
      case 'Interviewing':
        return 'bg-violet-400/20 text-violet-200 border-violet-400/40';
      case 'Offer':
        return 'bg-emerald-400/25 text-emerald-200 border-emerald-400/50 font-bold';
      default:
        return 'bg-slate-400/20 text-slate-200 border-slate-400/30';
    }
  };

  return (
    <section id="applications" aria-labelledby="applications-heading" className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.1]">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-lime-300" aria-hidden="true" />
            <h3 id="applications-heading" className="font-display text-lg font-bold text-white tracking-tight">
              Applications & Tailored Versions Hub
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Track each job application, customized resume version, ATS match scores, and interview pipeline.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
          aria-label="Add a new job application target"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New Application</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="mt-5 divide-y divide-white/[0.08] border border-white/[0.1] rounded-xl overflow-hidden bg-black/40" role="list">
        {applications.map(app => (
          <div
            key={app.id}
            role="listitem"
            className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.03] transition"
          >
            <div className="flex items-center gap-3.5 min-w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center font-bold text-white text-base" aria-hidden="true">
                {app.company.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{app.company}</h4>
                <p className="text-xs text-slate-300">{app.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Match</span>
                <span className="font-mono text-sm font-bold text-lime-300">{app.score}%</span>
              </div>

              <div>
                <label htmlFor={`status-select-${app.id}`} className="sr-only">
                  Update status for {app.company}
                </label>
                <select
                  id={`status-select-${app.id}`}
                  value={app.status}
                  onChange={(e) => onUpdateStatus(app.id, e.target.value as any)}
                  className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none ${getStatusBadge(app.status)}`}
                >
                  <option value="Draft" className="bg-slate-900 text-slate-100">Draft</option>
                  <option value="Tailored" className="bg-slate-900 text-lime-200">Tailored</option>
                  <option value="Applied" className="bg-slate-900 text-sky-200">Applied</option>
                  <option value="Interviewing" className="bg-slate-900 text-violet-200">Interviewing</option>
                  <option value="Offer" className="bg-slate-900 text-emerald-200">Offer</option>
                </select>
              </div>

              {app.salary && (
                <span className="hidden sm:inline-block font-mono text-xs text-slate-300">
                  {app.salary}
                </span>
              )}

              <button
                type="button"
                onClick={() => onDeleteApplication(app.id)}
                className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition cursor-pointer flex items-center justify-center"
                aria-label={`Delete application for ${app.company}`}
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Accessible Add Application Dialog */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-app-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h4 id="modal-app-title" className="text-base font-bold text-white">
                Add Target Job Application
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="min-h-[44px] min-w-[44px] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-company" className="block text-xs font-semibold text-slate-200 mb-1">
                  Company Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="modal-company"
                  type="text"
                  required
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Google, Notion"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label htmlFor="modal-role" className="block text-xs font-semibold text-slate-200 mb-1">
                  Role Title <span className="text-rose-400">*</span>
                </label>
                <input
                  id="modal-role"
                  type="text"
                  required
                  autoComplete="job-title"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Backend Systems Engineer"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-score" className="block text-xs font-semibold text-slate-200 mb-1">
                    Match Score (%)
                  </label>
                  <input
                    id="modal-score"
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label htmlFor="modal-status" className="block text-xs font-semibold text-slate-200 mb-1">
                    Pipeline Status
                  </label>
                  <select
                    id="modal-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-white focus:outline-none focus:border-lime-400 cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Tailored">Tailored</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="modal-salary" className="block text-xs font-semibold text-slate-200 mb-1">
                  Salary Range / Target (Optional)
                </label>
                <input
                  id="modal-salary"
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. $140k - $160k"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition shadow-md cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
