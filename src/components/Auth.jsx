import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleMagicLink(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) setError(error.message)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0E0D0B',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', fontFamily: "'Inter Tight', sans-serif",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontFamily: "'Instrument Serif', serif", color: '#F2EDE3', letterSpacing: '-0.02em' }}>
          Clin<span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: 'oklch(0.62 0.18 30)' }}>IQ</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(242,237,227,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>
          NEET PG · Rank, not streak
        </div>
      </div>

      {sent ? (
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>📬</div>
          <div style={{ fontSize: 18, color: '#F2EDE3', fontFamily: "'Instrument Serif', serif", marginBottom: 8 }}>Check your inbox</div>
          <div style={{ fontSize: 14, color: 'rgba(242,237,227,0.5)', lineHeight: 1.6 }}>
            We sent a magic link to <strong style={{ color: '#F2EDE3' }}>{email}</strong>. Tap it to sign in — no password needed.
          </div>
          <button onClick={() => setSent(false)} style={{
            marginTop: 24, background: 'none', border: '0.5px solid rgba(242,237,227,0.15)',
            color: 'rgba(242,237,227,0.5)', padding: '10px 20px', borderRadius: 8,
            cursor: 'pointer', fontSize: 13, fontFamily: "'Inter Tight', sans-serif",
          }}>
            Use different email
          </button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <div style={{ fontSize: 22, color: '#F2EDE3', fontFamily: "'Instrument Serif', serif", marginBottom: 8 }}>Sign in</div>
          <div style={{ fontSize: 13, color: 'rgba(242,237,227,0.45)', marginBottom: 28, lineHeight: 1.6 }}>
            Enter your email to receive a magic link. No password required.
          </div>

          <form onSubmit={handleMagicLink}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '13px 16px',
                background: 'rgba(242,237,227,0.05)',
                border: '0.5px solid rgba(242,237,227,0.15)',
                borderRadius: 10, color: '#F2EDE3', fontSize: 15,
                fontFamily: "'Inter Tight', sans-serif",
                outline: 'none', marginBottom: 12,
                boxSizing: 'border-box',
              }}
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: 'oklch(0.55 0.18 30)',
                border: 'none', borderRadius: 10,
                color: '#fff', fontSize: 15, fontWeight: 600,
                fontFamily: "'Inter Tight', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: 16,
              }}
            >
              {loading ? 'Sending…' : 'Send magic link →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(242,237,227,0.1)' }} />
            <span style={{ fontSize: 11, color: 'rgba(242,237,227,0.3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>OR</span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(242,237,227,0.1)' }} />
          </div>

          <button
            onClick={handleGoogle}
            style={{
              width: '100%', padding: '13px',
              background: 'rgba(242,237,227,0.05)',
              border: '0.5px solid rgba(242,237,227,0.15)',
              borderRadius: 10, color: '#F2EDE3', fontSize: 14,
              fontFamily: "'Inter Tight', sans-serif",
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {error && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(220,50,50,0.1)', border: '0.5px solid rgba(220,50,50,0.3)', borderRadius: 8, fontSize: 13, color: '#f87171' }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 24, fontSize: 11, color: 'rgba(242,237,227,0.25)', textAlign: 'center', lineHeight: 1.6 }}>
            By signing in you agree to use this app for exam preparation purposes.
          </div>
        </div>
      )}
    </div>
  )
}
