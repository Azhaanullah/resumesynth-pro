import React, { useState, useEffect } from 'react';
import { JobApplication } from '../types';
import { Briefcase, Plus, Trash2, X } from 'lucide-react';

interface ApplicationTrackerProps {
  applications: JobApplication[];
  onAddApplication: (app: Omit<JobApplication, 'id' | 'dateAdded'>) => void;
  onDeleteApplication: (id: string) => void;
  onUpdateStatus: (id: string, status: JobApplication['status']) => void;
}

const isDark = (): boolean => document.documentElement.classList.contains('dark');

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
  const dark = isDark();

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

  const inputCls = `w-full min-h-[44px] px-3.5 py-2 rounded-xl text-sm sm:text-xs focus:outline-none focus:border-[var(--accent)]`;
  const labelCls = 'block text-xs font-semibold mb-1';

  return (
    <section id="applications" aria-labelledby="applications-heading" className="rounded-2xl border p-6 shadow-xl" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(32,25,19,0.86)' : 'rgba(255,253,245,0.95)', boxShadow: dark ? '0 18px 44px rgba(23,17,14,0.14)' : '0 14px 36px rgba(53,32,20,0.08)' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5" style={{ borderBottomColor: 'var(--border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" aria-hidden="true" style={{ color: 'var(--accent)' }} />
            <h3 id="applications-heading" className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
              Applications & Tailored Versions Hub
            </h3>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Track each job application, customized resume version, ATS match scores, and interview pipeline.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
          aria-label="Add a new job application target"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New Application</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="mt-5 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(0,0,0,0.2)' : 'rgba(53,32,20,0.02)' }} role="list">
        {applications.map(app => (
          <div
            key={app.id}
            role="listitem"
            className="p-4 flex flex-wrap items-center justify-between gap-4"
            style={{ borderBottomColor: 'var(--border)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}
          >
            <div className="flex items-center gap-3.5 min-w-[200px]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base border"
                style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.06)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                aria-hidden="true">
                {app.company.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>{app.company}</h4>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{app.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="block text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Match</span>
                <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent)' }}>{app.score}%</span>
              </div>

              <div>
                <label htmlFor={`status-select-${app.id}`} className="sr-only">
                  Update status for {app.company}
                </label>
                <select
                  id={`status-select-${app.id}`}
                  value={app.status}
                  onChange={(e) => onUpdateStatus(app.id, e.target.value as any)}
                  className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:border-[var(--accent)]`}
                  style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                >
                  <option value="Draft">Draft</option>
                  <option value="Tailored">Tailored</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                </select>
              </div>

              {app.salary && (
                <span className="hidden sm:inline-block font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  {app.salary}
                </span>
              )}

              <button
                type="button"
                onClick={() => onDeleteApplication(app.id)}
                className="min-h-[44px] min-w-[44px] p-2 rounded-xl transition cursor-pointer flex items-center justify-center"
                style={{ color: 'var(--text-muted)', backgroundColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(53,32,20,0.04)' }}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border" style={{ backgroundColor: dark ? '#201913' : '#fffdf5', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottomColor: 'var(--border)' }}>
              <h4 id="modal-app-title" className="text-base font-bold" style={{ color: 'var(--text-main)' }}>
                Add Target Job Application
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer rounded-xl transition"
                style={{ color: 'var(--text-muted)', backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.06)' }}
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-company" className={labelCls} style={{ color: 'var(--text-main)' }}>
                  Company Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="modal-company"
                  type="text"
                  required
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Google, Notion"
                  className={inputCls}
                  style={{ backgroundColor: dark ? 'rgba(0,0,0,0.3)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)' }}
                />
              </div>

              <div>
                <label htmlFor="modal-role" className={labelCls} style={{ color: 'var(--text-main)' }}>
                  Role Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="modal-role"
                  type="text"
                  required
                  autoComplete="job-title"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Backend Systems Engineer"
                  className={inputCls}
                  style={{ backgroundColor: dark ? 'rgba(0,0,0,0.3)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-score" className={labelCls} style={{ color: 'var(--text-main)' }}>
                    Match Score (%)
                  </label>
                  <input
                    id="modal-score"
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className={inputCls}
                    style={{ backgroundColor: dark ? 'rgba(0,0,0,0.3)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)' }}
                  />
                </div>

                <div>
                  <label htmlFor="modal-status" className={labelCls} style={{ color: 'var(--text-main)' }}>
                    Pipeline Status
                  </label>
                  <select
                    id="modal-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`${inputCls} cursor-pointer`}
                    style={{ backgroundColor: dark ? 'rgba(0,0,0,0.3)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
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
                <label htmlFor="modal-salary" className={labelCls} style={{ color: 'var(--text-main)' }}>
                  Salary Range / Target (Optional)
                </label>
                <input
                  id="modal-salary"
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. $140k - $160k"
                  className={inputCls}
                  style={{ backgroundColor: dark ? 'rgba(0,0,0,0.3)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)' }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3" style={{ borderTopColor: 'var(--border)' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition"
                  style={{ color: 'var(--text-muted)', backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.06)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer active:scale-95"
                  style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
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
