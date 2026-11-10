import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User, Mail, Briefcase, MapPin, Link as LinkIcon, Camera, Trash2, Save, RotateCcw, Check } from 'lucide-react';

// ---------- Types ----------
export type ExperienceLevel = 'Student' | 'Entry' | 'Mid' | 'Senior' | 'Lead';

export interface Profile {
  fullName: string;
  email: string;
  targetRole: string;
  location: string;
  linkedin: string;
  experience: ExperienceLevel;
  avatar: string; // data URL or ''
  emailTips: boolean;
  autoSave: boolean;
}

type Errors = Partial<Record<keyof Profile, string>>;

// ---------- Constants / helpers ----------
const STORAGE_KEY = 'resumesynth_profile';
const MAX_AVATAR_BYTES = 400 * 1024; // keep localStorage small

const DEFAULT_PROFILE: Profile = {
  fullName: '',
  email: '',
  targetRole: '',
  location: '',
  linkedin: '',
  experience: 'Entry',
  avatar: '',
  emailTips: true,
  autoSave: true,
};

const loadProfile = (): Profile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
};

const persistProfile = (p: Profile): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
};

const validate = (p: Profile): Errors => {
  const e: Errors = {};
  if (!p.fullName.trim()) e.fullName = 'Name is required.';
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) e.email = 'Enter a valid email.';
  if (p.linkedin && !/^https?:\/\/.+\..+/.test(p.linkedin)) e.linkedin = 'Use a full URL starting with https://';
  return e;
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || '?';

const inputCls =
  'w-full rounded-lg border bg-white px-3 py-2 pl-9 text-sm text-slate-900 placeholder-slate-400 outline-none transition ' +
  'focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 ' +
  'border-slate-300 dark:border-slate-700';

// ---------- Small field wrapper ----------
const Field: React.FC<{
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}> = ({ id, label, icon, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
      {label}
    </label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      {children}
    </div>
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

// ---------- Component ----------
export const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [saved, setSaved] = useState<Profile>(profile);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(saved), [profile, saved]);

  const flash = (msg: string) => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setStatus(msg);
    statusTimer.current = setTimeout(() => setStatus(null), 3000);
  };

  useEffect(() => () => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
  }, []);

  // Auto-save (only when valid)
  useEffect(() => {
    if (!profile.autoSave || !isDirty) return;
    const t = setTimeout(() => {
      if (Object.keys(validate(profile)).length === 0 && persistProfile(profile)) {
        setSaved(profile);
        flash('Auto-saved');
      }
    }, 800);
    return () => clearTimeout(t);
  }, [profile, isDirty]);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(profile);
    setErrors(errs);
    if (Object.keys(errs).length) {
      flash('Fix the highlighted fields.');
      return;
    }
    if (persistProfile(profile)) {
      setSaved(profile);
      flash('Profile saved');
    } else {
      flash('Could not save (storage unavailable or full).');
    }
  };

  const handleDiscard = () => {
    setProfile(saved);
    setErrors({});
    flash('Changes discarded');
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return flash('Please choose an image file.');
    if (file.size > MAX_AVATAR_BYTES) return flash('Image too large (max 400 KB).');
    const reader = new FileReader();
    reader.onload = () => update('avatar', String(reader.result));
    reader.onerror = () => flash('Could not read that image.');
    reader.readAsDataURL(file);
  };

  return (
    <section
      aria-labelledby="profile-heading"
      className="border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-[#0a1020] lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="profile-form"
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-3">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {initials(profile.fullName)}
              </span>
            )}
            <span>
              <span id="profile-heading" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {profile.fullName || 'Profile settings'}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {profile.targetRole || 'Set up your profile'}
              </span>
            </span>
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400">{open ? 'Hide' : 'Edit'}</span>
        </button>

        {open && (
          <form id="profile-form" onSubmit={handleSave} noValidate className="mt-5 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Your avatar" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
                  {initials(profile.fullName)}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Camera size={14} /> Upload
                </button>
                {profile.avatar && (
                  <button
                    type="button"
                    onClick={() => update('avatar', '')}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field id="pf-name" label="Full name *" icon={<User size={14} />} error={errors.fullName}>
                <input
                  id="pf-name"
                  value={profile.fullName}
                  onChange={e => update('fullName', e.target.value)}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'pf-name-error' : undefined}
                  className={inputCls}
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
              </Field>

              <Field id="pf-email" label="Email" icon={<Mail size={14} />} error={errors.email}>
                <input
                  id="pf-email"
                  type="email"
                  value={profile.email}
                  onChange={e => update('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'pf-email-error' : undefined}
                  className={inputCls}
                  placeholder="jane@example.com"
                  autoComplete="email"
                />
              </Field>

              <Field id="pf-role" label="Target role" icon={<Briefcase size={14} />}>
                <input
                  id="pf-role"
                  value={profile.targetRole}
                  onChange={e => update('targetRole', e.target.value)}
                  className={inputCls}
                  placeholder="Backend Engineer"
                />
              </Field>

              <Field id="pf-location" label="Location" icon={<MapPin size={14} />}>
                <input
                  id="pf-location"
                  value={profile.location}
                  onChange={e => update('location', e.target.value)}
                  className={inputCls}
                  placeholder="Bengaluru, India"
                  autoComplete="address-level2"
                />
              </Field>

              <Field id="pf-linkedin" label="LinkedIn URL" icon={<LinkIcon size={14} />} error={errors.linkedin}>
                <input
                  id="pf-linkedin"
                  type="url"
                  value={profile.linkedin}
                  onChange={e => update('linkedin', e.target.value)}
                  aria-invalid={!!errors.linkedin}
                  aria-describedby={errors.linkedin ? 'pf-linkedin-error' : undefined}
                  className={inputCls}
                  placeholder="https://linkedin.com/in/you"
                />
              </Field>

              <Field id="pf-exp" label="Experience level" icon={<Briefcase size={14} />}>
                <select
                  id="pf-exp"
                  value={profile.experience}
                  onChange={e => update('experience', e.target.value as ExperienceLevel)}
                  className={inputCls}
                >
                  {(['Student', 'Entry', 'Mid', 'Senior', 'Lead'] as ExperienceLevel[]).map(l => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Preferences */}
            <fieldset className="space-y-3">
              <legend className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">Preferences</legend>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={profile.autoSave}
                  onChange={e => update('autoSave', e.target.checked)}
                  className="h-4 w-4 accent-indigo-600"
                />
                Auto-save changes
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={profile.emailTips}
                  onChange={e => update('emailTips', e.target.checked)}
                  className="h-4 w-4 accent-indigo-600"
                />
                Email me resume tips
              </label>
            </fieldset>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={!isDirty}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={14} /> Save profile
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                disabled={!isDirty}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <RotateCcw size={14} /> Discard
              </button>
              <span aria-live="polite" role="status" className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                {status && (
                  <>
                    <Check size={12} /> {status}
                  </>
                )}
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ProfileSettings;