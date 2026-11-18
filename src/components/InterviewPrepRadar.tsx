import React, { useState, useEffect } from 'react';
import { InterviewQuestion } from '../types';
import { ChevronDown, ChevronUp, Mic, Play, Square, Sparkles, Copy, Check, Compass } from 'lucide-react';

interface InterviewPrepRadarProps {
  questions: InterviewQuestion[];
  onCopyAll: (questions: InterviewQuestion[]) => void;
}

const isDark = (): boolean => document.documentElement.classList.contains('dark');
const tc = (dark: string, light: string) => isDark() ? dark : light;

export const InterviewPrepRadar: React.FC<InterviewPrepRadarProps> = ({ questions, onCopyAll }) => {
  const [openQuestionIds, setOpenQuestionIds] = useState<Set<string>>(new Set([questions[0]?.id || '']));
  const [activePracticeId, setActivePracticeId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);
  const dark = isDark();

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleQuestion = (id: string) => {
    setOpenQuestionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStartPractice = (id: string) => {
    setActivePracticeId(id);
    setIsRecording(true);
    setTimerSeconds(0);
  };

  const handleStopPractice = () => {
    setIsRecording(false);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleCopyQuestions = () => {
    onCopyAll(questions);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <section id="interview-radar" aria-labelledby="interview-radar-heading" className="rounded-2xl border p-6 shadow-xl" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(32,25,19,0.86)' : 'rgba(255,253,245,0.95)', boxShadow: dark ? '0 18px 44px rgba(23,17,14,0.14)' : '0 14px 36px rgba(53,32,20,0.08)' }}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5" style={{ borderBottomColor: 'var(--border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5" aria-hidden="true" style={{ color: 'var(--accent)' }} />
            <h3 id="interview-radar-heading" className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
              Interview Question Radar & STAR Practice Simulator
            </h3>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Tailored mock questions generated dynamically from your matched evidence and missing skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
            Simulation Ready
          </span>

          <button
            type="button"
            onClick={handleCopyQuestions}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border"
            style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
            aria-label="Copy all mock interview questions to clipboard"
          >
            {copiedAll ? <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" /> : <Copy className="w-4 h-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />}
            <span>{copiedAll ? 'Copied' : 'Copy Questions'}</span>
          </button>
        </div>
      </div>

      {/* Practice Timer Banner */}
      {activePracticeId && (
        <div
          role="region"
          aria-label="Live practice session"
          className="mt-4 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: dark ? 'rgba(163,230,53,0.3)' : 'rgba(53,32,20,0.2)', backgroundColor: dark ? 'rgba(163,230,53,0.06)' : 'rgba(53,32,20,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'animate-ping' : ''}`}
              style={{ backgroundColor: isRecording ? '#f43f5e' : 'var(--text-subtle)' }}
              aria-hidden="true"
            />
            <div>
              <span className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>Live STAR Answer Practice Active</span>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Deliver your answer using Situation → Task → Action → Result.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="font-mono text-base font-bold px-3.5 py-1.5 rounded-xl border"
              aria-live="polite"
              aria-label={`Practice duration: ${formatTimer(timerSeconds)}`}
              style={{ backgroundColor: dark ? 'rgba(0,0,0,0.4)' : 'rgba(53,32,20,0.06)', borderColor: 'var(--border)', color: 'var(--accent)' }}
            >
              {formatTimer(timerSeconds)}
            </span>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopPractice}
                className="min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
                style={{ backgroundColor: '#f43f5e', color: '#FFFFFF' }}
              >
                <Square className="w-4 h-4" aria-hidden="true" />
                <span>Finish Practice</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleStartPractice(activePracticeId)}
                className="min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
                style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                <span>Restart Timer</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Cards List */}
      <div className="space-y-3 mt-6">
        {questions.map((q, idx) => {
          const isOpen = openQuestionIds.has(q.id);
          const isSelectedForPractice = activePracticeId === q.id;

          return (
            <article
              key={q.id}
              className="rounded-xl border transition-all duration-200"
              style={{
                borderColor: isOpen ? (dark ? 'rgba(46,99,245,0.2)' : 'rgba(46,99,245,0.3)') : 'var(--border)',
                backgroundColor: isOpen
                  ? (dark ? 'rgba(46,99,245,0.08)' : 'rgba(46,99,245,0.04)')
                  : (dark ? 'rgba(0,0,0,0.25)' : 'rgba(53,32,20,0.03)'),
                ...(isOpen ? { boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(53,32,20,0.06)' } : {})
              }}
            >
              {/* Header Accordion Button */}
              <div className="flex items-start justify-between gap-4 p-4">
                <button
                  type="button"
                  onClick={() => toggleQuestion(q.id)}
                  aria-expanded={isOpen}
                  aria-controls={`answer-panel-${q.id}`}
                  className="flex-1 text-left flex items-start gap-3 cursor-pointer focus:outline-none"
                >
                  <span
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border"
                    aria-hidden="true"
                    style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }}
                  >
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold" style={{ backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(53,32,20,0.08)', color: 'var(--text-main)' }}>
                        {q.category}
                      </span>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        • {q.why}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-main)' }}>
                      {q.question}
                    </h4>
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartPractice(q.id)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${isSelectedForPractice && isRecording ? 'shadow-md' : ''}`}
                    style={isSelectedForPractice && isRecording
                      ? { backgroundColor: '#f43f5e', borderColor: '#f43f5e', color: '#FFFFFF' }
                      : { backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }
                    }
                    aria-label={`Start practice timer for question: ${q.question}`}
                  >
                    <Mic className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                    <span>Practice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleQuestion(q.id)}
                    className="min-h-[40px] min-w-[40px] p-2 transition cursor-pointer flex items-center justify-center rounded-xl"
                    style={{ color: 'var(--text-muted)', backgroundColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(53,32,20,0.04)' }}
                    aria-label={isOpen ? "Hide suggested answer" : "Show suggested answer"}
                  >
                    {isOpen ? <ChevronUp className="w-5 h-5" aria-hidden="true" /> : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {/* Expandable Answer */}
              {isOpen && (
                <div
                  id={`answer-panel-${q.id}`}
                  className="px-4 pb-4 pt-2 space-y-3 text-xs"
                  style={{ borderTopColor: 'var(--border)' }}
                >
                  <div className="rounded-xl p-4" style={{ borderColor: dark ? 'rgba(34,211,238,0.25)' : 'rgba(53,32,20,0.15)', backgroundColor: dark ? 'rgba(34,211,238,0.06)' : 'rgba(53,32,20,0.03)' }}>
                    <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold mb-1.5" style={{ color: 'var(--accent)' }}>
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      Suggested STAR Talking Track
                    </div>
                    <p className="leading-relaxed whitespace-pre-line font-medium" style={{ color: 'var(--text-main)' }}>
                      {q.answer}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-mono uppercase font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Key Points to Emphasize in Interview:
                    </span>
                    <ul className="space-y-1.5 pl-4 list-disc" style={{ color: 'var(--text-main)' }}>
                      {q.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="leading-snug">{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
