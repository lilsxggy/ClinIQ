# ClinIQ — Setup & Deploy Guide

## 1. Install dependencies
```bash
npm install
```

## 2. Run locally
```bash
npm run dev
```
Opens at http://localhost:5173

## 3. Deploy to Netlify (drag & drop)

### Option A — Netlify CLI
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Option B — Netlify Dashboard (easiest)
1. Run `npm run build` — creates a `dist/` folder
2. Go to netlify.com → "Add new site" → "Deploy manually"
3. Drag the `dist/` folder onto the page
4. Your app is live at `https://random-name.netlify.app`

## 4. Enable Google Auth (after deploy)

Once you have your Netlify URL:

### In Supabase:
1. Go to Authentication → Providers → Google → Enable
2. Add your Google OAuth credentials (from console.cloud.google.com)
3. Add redirect URL: `https://YOUR-APP.netlify.app`

### In Google Cloud Console:
1. Create OAuth 2.0 credentials
2. Add authorized redirect URI: `https://vtrckjghmpxzyjouduwt.supabase.co/auth/v1/callback`

## 5. Add to iOS Home Screen

1. Open your Netlify URL in Safari on iPhone
2. Tap the Share button (box with arrow)
3. Tap "Add to Home Screen"
4. App installs with full-screen, no browser chrome

## 6. Supabase RLS — ensure these policies exist

Run in Supabase SQL Editor:
```sql
-- Questions: public read
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read questions" ON questions FOR SELECT TO anon USING (true);

-- User profiles: users own their data
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own profile" ON user_profiles FOR ALL TO authenticated USING (auth.uid() = id);

-- Progress: users own their progress
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own progress" ON user_question_progress FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Sessions: users own their sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own sessions" ON sessions FOR ALL TO authenticated USING (auth.uid() = user_id);
```
