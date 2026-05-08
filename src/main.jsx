import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './lib/supabase.js'
import Auth from './components/Auth.jsx'
import App from './components/App.jsx'
import './app.css'

function Root() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0E0D0B',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'oklch(0.62 0.18 30)',
          animation: 'pulse 1s infinite',
        }} />
      </div>
    )
  }

  if (!user) return <Auth />

  return <App user={user} onSignOut={handleSignOut} />
}

// Add global pulse animation
const style = document.createElement('style')
style.textContent = `@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(<Root />)
