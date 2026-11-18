import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, AlertCircle, Plus, Sparkles, Search } from 'lucide-react';
import { SmoothInput } from './ui/SmoothInput';

const isDark = (): boolean => document.documentElement.classList.contains('dark');

interface VocabularyGapMapProps {
  analysis: AnalysisResult;
  onAddKeyword: (keyword: string) => void;
}

export const VocabularyGapMap: React.FC<VocabularyGapMapProps> = ({ analysis, onAddKeyword }) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'missing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const dark = isDark();

  const filteredMatched = analysis.matched.filter(m =>
    m.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMissing = analysis.missing.filter(m =>
    m.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabBtnBase = 'min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border';
  const activeTabStyle: React.CSSProperties = { backgroundColor: dark ? 'rgba(46,99,245,0.12)' : 'rgba(46,99,245,0.08)', borderColor: dark ? 'rgba(46,99,245,0.3)' : 'rgba(46,99,245,0.25)', color: 'var(--accent)' };
  const inactiveTabStyle: React.CSSProperties = { backgroundColor: 'transparent', borderColor: 'transparent', color: dark ? '#cbd5e1' : 'var(--text-muted)' };

  return (
    <article
      aria-labelledby="gap-map-heading"
      className="rounded-2xl border p-5 shadow-xl flex flex-col justify-between"
      style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(32,25,19,0.86)' : 'rgba(255,253,245,0.95)', boxShadow: dark ? '0 18px 44px rgba(23,17,14,0.14)' : '0 14px 36px rgba(53,32,20,0.08)' }}
    >
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
              <h3 id="gap-map-heading" className="font-display text-base font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                Vocabulary Gap Matrix
              </h3>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Exact job requirements detected in your resume vs. signals still missing.
            </p>
          </div>

          {/* Filter Group */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border" role="tablist" aria-label="Keyword filters" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(0,0,0,0.2)' : 'rgba(53,32,20,0.04)' }}>
            {[{ key: 'all' as const, label: `All (${analysis.matched.length + analysis.missing.length})` },
              { key: 'matched' as const, label: `Matched (${analysis.matched.length})` },
              { key: 'missing' as const, label: `Missing (${analysis.missing.length})` }].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                role="tab"
                aria-selected={filter === tab.key}
                className={tabBtnBase}
                style={filter === tab.key ? activeTabStyle : inactiveTabStyle}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <label htmlFor="keyword-search-input" className="sr-only">
            Filter skills by name
          </label>
          <SmoothInput
            id="keyword-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter skills or tools (e.g., Docker, SQL, Python)..."
            leadingIcon={<Search className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} aria-hidden="true" />}
            caretColor="bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]"
          />
        </div>

        <div className="space-y-4">
          {/* Verified Keywords Section */}
          {(filter === 'all' || filter === 'matched') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider font-mono" style={{ color: dark ? '#a3e635' : '#16a34a' }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: dark ? '#a3e635' : '#16a34a' }} aria-hidden="true" />
                  Verified in Resume ({filteredMatched.length})
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Occurrences counted</span>
              </div>

              {filteredMatched.length > 0 ? (
                <div className="flex flex-wrap gap-2" role="list">
                  {filteredMatched.map(item => (
                    <span
                      key={item.term}
                      role="listitem"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-border)', border: '1px solid', color: 'var(--accent)' }}
                    >
                      <span>{item.term}</span>
                      <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold" style={{ backgroundColor: dark ? 'rgba(163,230,53,0.2)' : 'rgba(53,32,20,0.1)', color: dark ? '#a3e635' : '#166534' }} aria-label={`found ${item.count} times`}>
                        ×{item.count}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No matching keywords in this view.</p>
              )}
            </div>
          )}

          {/* Missing Keywords Section */}
          {(filter === 'all' || filter === 'missing') && (
            <div className="pt-2" style={{ borderTopColor: 'var(--border)', borderTopWidth: 1, borderTopStyle: 'solid' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider font-mono" style={{ color: '#f43f5e' }}>
                  <AlertCircle className="w-4 h-4" style={{ color: '#f43f5e' }} aria-hidden="true" />
                  Missing Requirements ({filteredMissing.length})
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to append bullet</span>
              </div>

              {filteredMissing.length > 0 ? (
                <div className="flex flex-wrap gap-2" role="list">
                  {filteredMissing.map(item => (
                    <button
                      key={item.term}
                      type="button"
                      onClick={() => onAddKeyword(item.term)}
                      role="listitem"
                      className="group min-h-[40px] inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95"
                      style={{ backgroundColor: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.3)', border: '1px solid', color: '#f43f5e' }}
                      aria-label={`Add starter bullet for missing keyword ${item.term}`}
                    >
                      <span>{item.term}</span>
                      {item.priority === 'high' && (
                        <span className="px-1.5 py-0.2 rounded font-mono text-[9px] uppercase font-bold" style={{ backgroundColor: 'rgba(244,63,94,0.3)', color: '#fecdd3' }}>
                          High
                        </span>
                      )}
                      <Plus className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" style={{ color: '#fb7185' }} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic" style={{ color: dark ? '#a3e635' : '#16a34a' }}>✓ No missing keywords detected for this role!</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t text-xs" style={{ borderTopColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <span>Grounded Rule: Only add terms you can truthfully defend in technical interviews.</span>
      </div>
    </article>
  );
};
