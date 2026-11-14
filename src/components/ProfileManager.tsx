import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Copy, Check, ChevronDown, Sparkles } from 'lucide-react';
import { ResumeProfile } from '../types';

interface ProfileManagerProps {
  profiles: ResumeProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (id: string) => void;
  currentRole: string;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  currentRole,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    onCreateProfile(newProfileName.trim());
    setNewProfileName('');
    setIsCreating(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-white/15 bg-black/40 hover:bg-black/60 text-xs font-semibold text-white flex items-center gap-2 transition cursor-pointer shadow-sm"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <UserCheck className="w-4 h-4 text-lime-400" />
          <span className="text-slate-400">Profile:</span>
          <span className="font-bold text-white max-w-[140px] truncate">{activeProfile?.name || 'My Profile'}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => { setIsOpen(false); setIsCreating(false); }}
            aria-hidden="true"
          />

          <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs text-slate-400 font-semibold px-1">
              <span>Saved Resume Profiles</span>
              <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded">{profiles.length}</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 mb-2 pr-1">
              {profiles.map(p => {
                const isActive = p.id === activeProfileId;
                return (
                  <div
                    key={p.id}
                    className={`group flex items-center justify-between p-2 rounded-xl text-xs transition ${
                      isActive ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30 font-bold' : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProfile(p.id);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-left truncate cursor-pointer flex flex-col"
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal truncate">{p.targetRole}</span>
                    </button>

                    {profiles.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProfile(p.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Delete profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {isCreating ? (
              <form onSubmit={handleCreateSubmit} className="pt-2 border-t border-white/10 space-y-2">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g. Lead SRE / Cloud"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-lime-400"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1 rounded-lg bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 text-xs hover:bg-white/20 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="w-full pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-lime-400 hover:text-lime-300 hover:bg-lime-400/10 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save New Profile Draft</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
