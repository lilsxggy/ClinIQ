import { useReducer, useEffect, useState, useRef } from 'react'
import { reducer, initialState } from '../lib/reducer.js'
import { RANKS, SUBJECTS, rankIdx, FALLBACK_QUESTIONS } from '../lib/constants.js'
import { fetchQuestions, saveProgress, saveSession, upsertProfile, loadProfile, supabase } from '../lib/supabase.js'

// Import Claude Design components
// These are loaded from the original design files
const Ico = window.Ico
const IOSDevice = window.IOSDevice

export default function App({ user, onSignOut }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    questions: FALLBACK_QUESTIONS,
    questionsLoaded: false,
  })
  const [tab, setTab] = useState('home')
  const sessionStartRef = useRef({ done: 0, correct: 0, xp: 0 })

  // Load questions from Supabase
  useEffect(() => {
    fetchQuestions(300)
      .then(qs => dispatch({ type: 'SET_QUESTIONS', questions: qs }))
      .catch(() => dispatch({ type: 'SET_QUESTIONS', questions: FALLBACK_QUESTIONS }))
  }, [])

  // Load user profile from Supabase
  useEffect(() => {
    if (!user) return
    loadProfile(user.id).then(profile => {
      if (profile) dispatch({ type: 'LOAD_PROFILE', profile: {
        xp: profile.total_xp,
        mastery: {},
        done: 0, correct: 0, questDone: 0,
      }})
    })
  }, [user])

  // Save progress to Supabase after each answer
  useEffect(() => {
    if (!state.answered || !user || !state.questions[state.curIdx]) return
    const q = state.questions[state.curIdx]
    if (!q.id) return
    saveProgress(user.id, q.id, state.lastCorrect)
    upsertProfile(user.id, state.xp, rankIdx(state.xp) + 1)
  }, [state.answered])

  // Auto-clear toast
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 1800)
      return () => clearTimeout(t)
    }
  }, [state.toast])

  // Save session when user leaves practice tab
  useEffect(() => {
    if (tab !== 'practice' && user) {
      const sessionDone = state.done - sessionStartRef.current.done
      const sessionCorrect = state.correct - sessionStartRef.current.correct
      const sessionXp = state.xp - sessionStartRef.current.xp
      if (sessionDone > 0) {
        saveSession(user.id, sessionDone, sessionCorrect, sessionXp)
        sessionStartRef.current = { done: state.done, correct: state.correct, xp: state.xp }
      }
    }
  }, [tab])

  const goTo = (screen) => {
    setTab(screen)
    if (screen === 'practice') dispatch({ type: 'ENTER_PRACTICE' })
  }

  const ri = rankIdx(state.xp)
  const r = RANKS[ri]
  const nx = RANKS[Math.min(ri + 1, RANKS.length - 1)]
  const xpPct = ri === RANKS.length - 1 ? 100 : Math.round((state.xp - r.min) / (nx.min - r.min) * 100)

  return (
    <div className="app">
      {/* Loading banner */}
      {!state.questionsLoaded && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
          background: 'rgba(14,13,11,0.9)', backdropFilter: 'blur(8px)',
          padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FBBF24', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(242,237,227,0.5)', letterSpacing: '0.08em' }}>
            LOADING QUESTION BANK…
          </span>
        </div>
      )}

      {/* Toast */}
      {state.toast && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(30,28,25,0.95)', border: '0.5px solid rgba(242,237,227,0.15)',
          backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: 20,
          fontSize: 13, fontWeight: 600, color: '#F2EDE3', zIndex: 100,
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          +{state.toast.delta} XP
        </div>
      )}

      {/* Screens */}
      {tab === 'home' && <HomeScreen state={state} xpPct={xpPct} r={r} nx={nx} onStart={() => goTo('practice')} user={user} onSignOut={onSignOut} />}
      {tab === 'practice' && <PracticeScreen state={state} dispatch={dispatch} />}
      {tab === 'progress' && <ProgressScreen state={state} xpPct={xpPct} r={r} nx={nx} />}
      {tab === 'profile' && <ProfileScreen state={state} r={r} user={user} onSignOut={onSignOut} />}

      {/* Tab bar */}
      <TabBar tab={tab} goTo={goTo} />

      {/* Rank up overlay */}
      {state.rankUpFrom && (
        <RankUpOverlay
          from={state.rankUpFrom}
          to={r.n}
          onDismiss={() => dispatch({ type: 'DISMISS_RANKUP' })}
        />
      )}
    </div>
  )
}

// ─── HOME ──────────────────────────────────────────────────────────────────
function HomeScreen({ state, xpPct, r, nx, onStart, user, onSignOut }) {
  const topSubjects = SUBJECTS.slice(0, 6)
  return (
    <div className="screen on" data-screen-label="01 Home">
      <Masthead xp={state.xp} rankName={r.n} />
      <div className="scroll">
        {/* Rank card */}
        <div className="rank-card">
          <div className="rank-card-eye">Current Rank</div>
          <div className="rank-card-name">{r.n}</div>
          <div className="rank-card-sub">{(nx.min - state.xp).toLocaleString()} XP to {nx.n}</div>
          <div className="xp-track"><div className="xp-fill" style={{ width: `${xpPct}%` }} /></div>
          <div className="xp-labels"><span>{state.xp.toLocaleString()} XP</span><span>{xpPct}%</span></div>
        </div>

        {/* Daily quest */}
        <div className="home-section">
          <div className="home-section-hd">Daily Quest</div>
          <div className="quest-box">
            <div className="quest-icon">⚡</div>
            <div className="quest-info">
              <div className="quest-title">Answer 10 questions</div>
              <div className="quest-desc">Complete for +50 bonus XP</div>
              <div className="quest-bar"><div className="quest-bar-fill" style={{ width: `${Math.min(100, state.questDone / 10 * 100)}%` }} /></div>
              <div className="quest-count">{state.questDone} / 10 done</div>
            </div>
          </div>
        </div>

        {/* Subject mastery */}
        <div className="home-section">
          <div className="home-section-hd">Subject Mastery</div>
          <div className="subj-grid">
            {topSubjects.map(s => (
              <div key={s} className="subj-tile">
                <div className="subj-tile-name">{s}</div>
                <div className="subj-tile-pct">{state.mastery[s] || 0}%</div>
                <div className="subj-bar"><div className="subj-bar-fill" style={{ width: `${state.mastery[s] || 0}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <button className="cta-btn" onClick={onStart}>Start Practice →</button>
      </div>
    </div>
  )
}

// ─── PRACTICE ─────────────────────────────────────────────────────────────
function PracticeScreen({ state, dispatch }) {
  const q = state.curIdx != null ? state.questions[state.curIdx] : null

  useEffect(() => {
    if (state.curIdx == null && state.questions.length > 0) {
      dispatch({ type: 'ENTER_PRACTICE' })
    }
  }, [state.curIdx, state.questions.length])

  if (!q) return (
    <div className="screen on" data-screen-label="02 Practice">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ink-faint)', fontSize: 14 }}>
        Loading questions…
      </div>
    </div>
  )

  const handlePick = (i) => { if (!state.answered) dispatch({ type: 'PICK', i }) }
  const handleNext = () => dispatch({ type: 'NEXT' })
  const handleSkip = () => dispatch({ type: 'SKIP' })

  return (
    <div className="screen on" data-screen-label="02 Practice">
      <Masthead xp={state.xp} rankName={RANKS[rankIdx(state.xp)].n} />

      {/* Progress header */}
      <div className="p-hd">
        <div className="p-hd-row">
          <div className="p-pill">{q.s}</div>
          <div className="p-meta">Q. <b>{String(state.sessionIdx + 1).padStart(2, '0')}</b> / 10</div>
        </div>
        <div className="seg-bar">
          {state.segments.map((s, i) => (
            <span key={i} className={`seg ${i === state.sessionIdx && !state.answered ? 'active' : s}`} />
          ))}
        </div>
      </div>

      <div className="p-body">
        {/* Question meta */}
        <div className="p-qhead">
          <div className="p-qhead-num">{String(state.sessionIdx + 1).padStart(2, '0')}</div>
          <div className="p-qhead-meta">
            <span className="lbl">Topic</span>
            <span className="topic">{q.t}</span>
          </div>
          {q.pyq && <div className="pyq-badge">{q.pyq}</div>}
        </div>

        {/* Question text */}
        <p className="q-text">{q.q}</p>

        {/* Options */}
        <div className="options">
          {q.o.map((opt, i) => {
            let cls = 'opt'
            if (state.answered) {
              if (i === q.a) cls += ' correct'
              else if (i === state.picked && state.picked !== q.a) cls += ' wrong'
              else cls += ' dim'
            }
            return (
              <button key={i} className={cls} onClick={() => handlePick(i)}>
                <span className="opt-letter">{'ABCD'[i]}</span>
                <span className="opt-text">{opt}</span>
              </button>
            )
          })}
        </div>

        {!state.answered && (
          <button className="skip-btn" onClick={handleSkip}>Skip (+8 XP)</button>
        )}
      </div>

      {/* Explanation drawer */}
      {state.drawerOpen && (
        <div className="drawer open">
          <div className="drawer-handle" />
          <div className="drawer-body">
            <div className="result-row">
              <span className={`result-badge ${state.lastCorrect ? 'correct' : 'wrong'}`}>
                {state.lastCorrect ? '✓ Correct' : '✗ Wrong'}
              </span>
              <span className="xp-earned">
                {state.lastCorrect ? `+${state.lastXp} XP` : 'Read for +5 XP'}
              </span>
            </div>
            <div className="exp-lbl">Explanation</div>
            <p className="exp-text">{q.e}</p>
            <button className="next-btn" onClick={handleNext}>Next Question →</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────
function ProgressScreen({ state, xpPct, r, nx }) {
  return (
    <div className="screen on" data-screen-label="03 Progress">
      <Masthead xp={state.xp} rankName={r.n} />
      <div className="scroll">
        <div className="prog-rank-card">
          <div className="prc-eye">Your Rank</div>
          <div className="prc-name">{r.n}</div>
          <div className="prc-sub">{state.xp.toLocaleString()} XP · {(nx.min - state.xp).toLocaleString()} to {nx.n}</div>
          <div className="xp-track"><div className="xp-fill" style={{ width: `${xpPct}%` }} /></div>
        </div>
        <div className="subj-list-hd">Subject Mastery</div>
        <div className="subj-list">
          {SUBJECTS.map(s => (
            <div key={s} className="subj-row">
              <div className="subj-row-top">
                <span className="subj-row-name">{s}</span>
                <span className="subj-row-pct">{state.mastery[s] || 0}%</span>
              </div>
              <div className="subj-bar"><div className="subj-bar-fill" style={{ width: `${state.mastery[s] || 0}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PROFILE ──────────────────────────────────────────────────────────────
function ProfileScreen({ state, r, user, onSignOut }) {
  const acc = state.done > 0 ? Math.round(state.correct / state.done * 100) : 0
  return (
    <div className="screen on" data-screen-label="04 Profile">
      <Masthead xp={state.xp} rankName={r.n} />
      <div className="scroll">
        <div className="prof-hero">
          <div className="prof-avatar">{r.n.charAt(0)}</div>
          <div className="prof-rank">{r.n}</div>
          <div className="prof-email">{user?.email || 'Guest'}</div>
          <div className="prof-xp">{state.xp.toLocaleString()} XP total</div>
        </div>
        <div className="stats-grid">
          <div className="stat-box"><div className="stat-n">{state.done}</div><div className="stat-l">Questions</div></div>
          <div className="stat-box"><div className="stat-n">{acc}%</div><div className="stat-l">Accuracy</div></div>
          <div className="stat-box"><div className="stat-n">{state.correct}</div><div className="stat-l">Correct</div></div>
          <div className="stat-box"><div className="stat-n">{state.touched.length}</div><div className="stat-l">Subjects</div></div>
        </div>
        <button onClick={onSignOut} style={{
          margin: '24px 16px 0', width: 'calc(100% - 32px)',
          background: 'none', border: '0.5px solid rgba(var(--ink-rgb),0.2)',
          color: 'var(--ink-faint)', padding: '12px', borderRadius: 10,
          cursor: 'pointer', fontSize: 13, fontFamily: "'Inter Tight', sans-serif",
        }}>
          Sign out
        </button>
      </div>
    </div>
  )
}

// ─── SHARED ────────────────────────────────────────────────────────────────
function Masthead({ xp, rankName }) {
  return (
    <div className="masthead">
      <div className="mast-left">
        <div className="mast-mark">
          Clin<span style={{ fontStyle: 'normal', fontFamily: "'JetBrains Mono', monospace", fontSize: 22 }}>IQ</span>
        </div>
      </div>
      <div className="mast-right" style={{ fontSize: 12, color: 'var(--ink-faint)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
        {rankName.toUpperCase()}
      </div>
    </div>
  )
}

function TabBar({ tab, goTo }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'practice', label: 'Practice', icon: '?' },
    { id: 'progress', label: 'Progress', icon: '▦' },
    { id: 'profile', label: 'Profile', icon: '◉' },
  ]
  return (
    <nav className="tab-bar">
      {tabs.map(t => (
        <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => goTo(t.id)}>
          <span className="tab-ico">{t.icon}</span>
          <span className="tab-lbl">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

function RankUpOverlay({ from, to, onDismiss }) {
  return (
    <div onClick={onDismiss} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(14,13,11,0.92)', backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, cursor: 'pointer',
    }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🏅</div>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 13, color: 'oklch(0.62 0.18 30)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Rank Up</div>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#F2EDE3', textAlign: 'center', lineHeight: 1.2, marginBottom: 8 }}>{to}</div>
      <div style={{ fontSize: 13, color: 'rgba(242,237,227,0.4)', marginBottom: 40 }}>You left {from} behind</div>
      <div style={{ fontSize: 12, color: 'rgba(242,237,227,0.25)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>TAP TO CONTINUE</div>
    </div>
  )
}
