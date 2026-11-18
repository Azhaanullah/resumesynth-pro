import React, { useState, useEffect } from 'react';
import { InterviewQuestion } from '../types';
import { ChevronDown, ChevronUp, Mic, Play, Square, Sparkles, Copy, Check, Compass } from 'lucide-react';

interface InterviewPrepRadarProps {
  questions: InterviewQuestion[];
  onCopyAll: (questions: InterviewQuestion[]) => void;
}

export const InterviewPrepRadar: React.FC<InterviewPrepRadarProps> = ({ questions, onCopyAll }) => {
  const [openQuestionIds, setOpenQuestionIds] = useState<Set<string>>(new Set([questions[0]?.id || '']));
  const [activePracticeId, setActivePracticeId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);

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
    <section id="interview-radar" aria-labelledby="interview-radar-heading" className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-white/[0.1]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-300" aria-hidden="true" />
            <h3 id="interview-radar-heading" className="font-display text-lg font-bold text-white tracking-tight">
              Interview Question Radar & STAR Practice Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Tailored mock questions generated dynamically from your matched evidence and missing skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 font-mono text-xs text-cyan-200 uppercase tracking-wider font-bold">
            Simulation Ready
          </span>

          <button
            type="button"
            onClick={handleCopyQuestions}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-xs font-bold text-slate-100 transition flex items-center gap-2 cursor-pointer"
            aria-label="Copy all mock interview questions to clipboard"
          >
            {copiedAll ? <Check className="w-4 h-4 text-lime-400" aria-hidden="true" /> : <Copy className="w-4 h-4 text-slate-300" aria-hidden="true" />}
            <span>{copiedAll ? 'Copied' : 'Copy Questions'}</span>
          </button>
        </div>
      </div>

      {/* Practice Timer Banner */}
      {activePracticeId && (
        <div
          role="region"
          aria-label="Live practice session"
          className="mt-4 p-4 rounded-xl border border-cyan-400/40 bg-cyan-500/[0.08] flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`}
              aria-hidden="true"
            />
            <div>
              <span className="text-xs font-bold text-white">Live STAR Answer Practice Active</span>
              <p className="text-xs text-slate-300">Deliver your answer using Situation → Task → Action → Result.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="font-mono text-base font-bold text-cyan-300 bg-black/60 px-3.5 py-1.5 rounded-xl border border-white/15"
              aria-live="polite"
              aria-label={`Practice duration: ${formatTimer(timerSeconds)}`}
            >
              {formatTimer(timerSeconds)}
            </span>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopPractice}
                className="min-h-[40px] px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <Square className="w-4 h-4" aria-hidden="true" />
                <span>Finish Practice</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleStartPractice(activePracticeId)}
                className="min-h-[40px] px-4 py-1.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
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
              className={`rounded-xl border transition-all duration-200 ${
                isOpen
                  ? 'border-cyan-400/40 bg-slate-900 shadow-xl'
                  : 'border-white/[0.1] bg-black/40 hover:border-white/20'
              }`}
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
                    className="font-mono text-xs font-bold text-cyan-300 bg-cyan-400/15 px-2.5 py-1 rounded-lg border border-cyan-400/30"
                    aria-hidden="true"
                  >
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-white/[0.1] text-slate-200">
                        {q.category}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        • {q.why}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {q.question}
                    </h4>
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartPractice(q.id)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                      isSelectedForPractice && isRecording
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                        : 'bg-white/[0.08] hover:bg-white/[0.16] text-slate-200 border-white/15'
                    }`}
                    aria-label={`Start practice timer for question: ${q.question}`}
                  >
                    <Mic className="w-3.5 h-3.5 text-cyan-300" aria-hidden="true" />
                    <span>Practice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleQuestion(q.id)}
                    className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
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
                  className="px-4 pb-4 pt-2 border-t border-white/[0.08] space-y-3 text-xs"
                >
                  <div className="bg-cyan-950/40 border border-cyan-400/25 rounded-xl p-4">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-cyan-300 mb-1.5">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      Suggested STAR Talking Track
                    </div>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-line text-xs font-medium">
                      {q.answer}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-mono uppercase text-slate-300 font-bold block mb-1.5">
                      Key Points to Emphasize in Interview:
                    </span>
                    <ul className="space-y-1.5 pl-4 list-disc text-slate-200 text-xs">
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
