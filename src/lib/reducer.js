import { rankIdx, xpFor, RANKS } from './constants.js'

export const initialState = {
  xp: 0,
  done: 0,
  correct: 0,
  questDone: 0,
  sessionIdx: 0,
  segments: Array(10).fill('pending'),
  used: [],
  answered: false,
  picked: null,
  drawerOpen: false,
  mastery: {},
  touched: [],
  comeback: false,
  toast: null,
  curIdx: null,
  rankUpFrom: null,
  questions: [],
  questionsLoaded: false,
}

export function reducer(state, action) {
  switch (action.type) {

    case 'SET_QUESTIONS': {
      return { ...state, questions: action.questions, questionsLoaded: true, curIdx: null, used: [] }
    }

    case 'LOAD_PROFILE': {
      const { xp, mastery, done, correct, questDone } = action.profile
      return { ...state, xp: xp || 0, mastery: mastery || {}, done: done || 0, correct: correct || 0, questDone: questDone || 0 }
    }

    case 'ENTER_PRACTICE': {
      if (state.curIdx != null) return state
      const idx = pickQ(state.questions, state.used)
      if (idx === -1) return state
      return { ...state, curIdx: idx, used: [...state.used, idx], answered: false, picked: null, drawerOpen: false }
    }

    case 'LOAD_Q': {
      return { ...state, curIdx: action.idx, used: [...state.used, action.idx], answered: false, picked: null, drawerOpen: false, toast: null }
    }

    case 'PICK': {
      if (!state.questions[state.curIdx]) return state
      const q = state.questions[state.curIdx]
      const correct = action.i === q.a
      const baseXp = xpFor(q.s, correct)
      const xpGain = state.comeback ? baseXp * 2 : baseXp
      const newSegs = [...state.segments]
      newSegs[state.sessionIdx] = correct ? 'done' : 'wrong'
      const newMastery = { ...state.mastery }
      if (correct) newMastery[q.s] = Math.min(100, (newMastery[q.s] || 0) + 4)
      const touched = [...new Set([...state.touched, q.s])]
      const newXp = state.xp + xpGain
      const oldRank = rankIdx(state.xp)
      const newRank = rankIdx(newXp)
      const rankUpFrom = newRank > oldRank ? RANKS[oldRank].n : null
      return {
        ...state,
        xp: newXp,
        done: state.done + 1,
        correct: state.correct + (correct ? 1 : 0),
        questDone: Math.min(10, state.questDone + 1),
        segments: newSegs,
        mastery: newMastery,
        touched,
        answered: true,
        picked: action.i,
        drawerOpen: true,
        lastXp: xpGain,
        lastCorrect: correct,
        toast: correct ? { delta: xpGain, label: 'XP earned' } : null,
        rankUpFrom,
      }
    }

    case 'SKIP': {
      const xpGain = 8
      const newSegs = [...state.segments]
      newSegs[state.sessionIdx] = 'done'
      const idx = pickQ(state.questions, state.used)
      const newXp = state.xp + xpGain
      const oldRank = rankIdx(state.xp)
      const newRank = rankIdx(newXp)
      return {
        ...state, xp: newXp, segments: newSegs,
        sessionIdx: Math.min(9, state.sessionIdx + 1),
        curIdx: idx, used: [...state.used, idx],
        answered: false, picked: null, drawerOpen: false,
        toast: { delta: 8, label: 'Disciplined skip' },
        rankUpFrom: newRank > oldRank ? RANKS[oldRank].n : null,
      }
    }

    case 'NEXT': {
      const nextSession = Math.min(9, state.sessionIdx + 1)
      const idx = pickQ(state.questions, state.used)
      return {
        ...state, sessionIdx: nextSession,
        curIdx: idx, used: [...state.used, idx],
        answered: false, picked: null, drawerOpen: false, comeback: false,
      }
    }

    case 'CLEAR_TOAST': return { ...state, toast: null }
    case 'DISMISS_RANKUP': return { ...state, rankUpFrom: null }
    case 'RESET_SESSION': return { ...state, sessionIdx: 0, segments: Array(10).fill('pending'), curIdx: null }

    default: return state
  }
}

function pickQ(questions, used) {
  if (!questions || questions.length === 0) return -1
  let pool = questions.map((_, i) => i).filter(i => !used.includes(i))
  if (pool.length === 0) pool = questions.map((_, i) => i)
  return pool[Math.floor(Math.random() * pool.length)]
}
