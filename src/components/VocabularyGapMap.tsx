import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, AlertCircle, Plus, Sparkles, Search } from 'lucide-react';
import { SmoothInput } from './ui/SmoothInput';

interface VocabularyGapMapProps {
  analysis: AnalysisResult;
  onAddKeyword: (keyword: string) => void;
}

export const VocabularyGapMap: React.FC<VocabularyGapMapProps> = ({ analysis, onAddKeyword }) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'missing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatched = analysis.matched.filter(m =>
    m.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMissing = analysis.missing.filter(m =>
    m.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <article
      aria-labelledby="gap-map-heading"
      className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
    >
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime-300" aria-hidden="true" />
              <h3 id="gap-map-heading" className="font-display text-base font-bold text-white tracking-tight">
                Vocabulary Gap Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Exact job requirements detected in your resume vs. signals still missing.
            </p>
          </div>

          {/* Filter Group */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/[0.1]" role="tablist" aria-label="Keyword filters">
            <button
              type="button"
              onClick={() => setFilter('all')}
              role="tab"
              aria-selected={filter === 'all'}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-lime-400/25 text-lime-200 border border-lime-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All ({analysis.matched.length + analysis.missing.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('matched')}
              role="tab"
              aria-selected={filter === 'matched'}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'matched'
                  ? 'bg-lime-400/25 text-lime-200 border border-lime-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Matched ({analysis.matched.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('missing')}
              role="tab"
              aria-selected={filter === 'missing'}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'missing'
                  ? 'bg-rose-400/25 text-rose-200 border border-rose-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Missing ({analysis.missing.length})
            </button>
          </div>
        </div>

        {/* Search Bar with Smooth Animated Caret */}
        <div className="mb-4">
          <label htmlFor="keyword-search-input" className="sr-only">
            Filter skills by name
          </label>
          <SmoothInput
            id="keyword-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter skills or tools (e.g., Docker, SQL, Python)..."
            leadingIcon={<Search className="w-4 h-4" aria-hidden="true" />}
            caretColor="bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]"
          />
        </div>

        <div className="space-y-4">
          {/* Verified Keywords Section */}
          {(filter === 'all' || filter === 'matched') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-lime-300 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 text-lime-400" aria-hidden="true" />
                  Verified in Resume ({filteredMatched.length})
                </span>
                <span className="text-xs text-slate-400">Occurrences counted</span>
              </div>

              {filteredMatched.length > 0 ? (
                <div className="flex flex-wrap gap-2" role="list">
                  {filteredMatched.map(item => (
                    <span
                      key={item.term}
                      role="listitem"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-lime-400/15 border border-lime-400/30 text-lime-200 shadow-sm"
                    >
                      <span>{item.term}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-lime-400/25 text-[10px] font-mono text-lime-100 font-bold" aria-label={`found ${item.count} times`}>
                        ×{item.count}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No matching keywords in this view.</p>
              )}
            </div>
          )}

          {/* Missing Keywords Section */}
          {(filter === 'all' || filter === 'missing') && (
            <div className="pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 uppercase tracking-wider font-mono">
                  <AlertCircle className="w-4 h-4 text-rose-400" aria-hidden="true" />
                  Missing Requirements ({filteredMissing.length})
                </span>
                <span className="text-xs text-slate-400">Click to append bullet</span>
              </div>

              {filteredMissing.length > 0 ? (
                <div className="flex flex-wrap gap-2" role="list">
                  {filteredMissing.map(item => (
                    <button
                      key={item.term}
                      type="button"
                      onClick={() => onAddKeyword(item.term)}
                      role="listitem"
                      className="group min-h-[40px] inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-200 hover:bg-rose-500/25 hover:border-rose-400 transition cursor-pointer active:scale-95"
                      aria-label={`Add starter bullet for missing keyword ${item.term}`}
                    >
                      <span>{item.term}</span>
                      {item.priority === 'high' && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/40 text-[9px] font-mono uppercase text-rose-100 font-bold">
                          High
                        </span>
                      )}
                      <Plus className="w-3.5 h-3.5 text-rose-300 group-hover:rotate-90 transition-transform duration-200" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-lime-300 italic">✓ No missing keywords detected for this role!</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs text-slate-300">
        <span>Grounded Rule: Only add terms you can truthfully defend in technical interviews.</span>
      </div>
    </article>
  );
};
