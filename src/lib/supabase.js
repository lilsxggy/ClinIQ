import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vtrckjghmpxzyjouduwt.supabase.co'
const SUPABASE_KEY = 'sb_publishable_mmuuHjvitjv03T7U5hN2Bw_l30Bs_ft'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Subject name normalisation ────────────────────────────────────────────
const SUBJ_MAP = {
  'Medicine':'Medicine','Surgery':'Surgery',
  'Pediatrics':'Paediatrics','Paediatrics':'Paediatrics',
  'Gynaecology & Obstetrics':'Obs & Gynae','Obs & Gynae':'Obs & Gynae',
  'Pathology':'Pathology','Pharmacology':'Pharmacology',
  'Microbiology':'Microbiology','Anatomy':'Anatomy',
  'Physiology':'Physiology','Biochemistry':'Biochemistry',
  'Ophthalmology':'Ophthalmology','ENT':'ENT',
  'Forensic Medicine':'Forensic Med.','Forensic Med.':'Forensic Med.',
  'Social & Preventive Medicine':'PSM','PSM':'PSM',
  'Psychiatry':'Psychiatry','Radiology':'Radiology',
  'Orthopaedics':'Orthopaedics','Skin':'Dermatology',
  'Dermatology':'Dermatology','Anaesthesia':'Anaesthesia',
  'Unknown':'Medicine',
}

function mapRow(row) {
  const opts = [row.opa, row.opb, row.opc, row.opd].filter(x => x && x.trim().length > 0)
  if (opts.length < 2 || !row.question || row.question.trim().length < 10) return null
  return {
    id: row.id,
    q: row.question.trim(),
    o: opts,
    a: Math.min(Number(row.cop) || 0, opts.length - 1),
    e: (row.exp && row.exp.trim().length > 20)
      ? row.exp.trim()
      : 'Refer to standard textbooks for a detailed explanation of this concept.',
    s: SUBJ_MAP[row.subject_name] || 'Medicine',
    t: (row.topic_name || '').trim() || (SUBJ_MAP[row.subject_name] || 'Medicine'),
    d: 2,
    pyq: row.pyq_year ? `NEET PG ${row.pyq_year}` : null,
  }
}

export async function fetchQuestions(count = 300) {
  const offset = Math.floor(Math.random() * 48000)
  const { data, error } = await supabase
    .from('questions')
    .select('id,question,opa,opb,opc,opd,cop,exp,subject_name,topic_name,pyq_year')
    .range(offset, offset + count - 1)

  if (error) throw error
  const mapped = data.map(mapRow).filter(Boolean)
  // shuffle
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]]
  }
  return mapped
}

// ─── Progress ──────────────────────────────────────────────────────────────
export async function saveProgress(userId, questionId, correct, easeFactor = 2.5, intervalDays = 1) {
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + intervalDays)

  const { error } = await supabase
    .from('user_question_progress')
    .upsert({
      user_id: userId,
      question_id: questionId,
      ease_factor: easeFactor,
      interval_days: intervalDays,
      last_answered_at: new Date().toISOString(),
      next_review_date: nextReview.toISOString().split('T')[0],
      times_correct: correct ? 1 : 0,
      times_wrong: correct ? 0 : 1,
    }, {
      onConflict: 'user_id,question_id',
      ignoreDuplicates: false,
    })

  if (error) console.warn('saveProgress error:', error.message)
}

export async function saveSession(userId, questionsAttempted, questionsCorrect, xpEarned) {
  const { error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      ended_at: new Date().toISOString(),
      questions_attempted: questionsAttempted,
      questions_correct: questionsCorrect,
      xp_earned: xpEarned,
    })
  if (error) console.warn('saveSession error:', error.message)
}

export async function upsertProfile(userId, xp, rankLevel) {
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      total_xp: xp,
      rank_level: rankLevel,
      last_session_date: new Date().toISOString().split('T')[0],
    }, { onConflict: 'id' })
  if (error) console.warn('upsertProfile error:', error.message)
}

export async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}
