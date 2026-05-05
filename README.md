# LUME

Event networking app for conferences and startup weeks. Attendees discover sessions, pitch ideas, organize informal gatherings, and find nearby people through real-time networking signals with expiry-based availability.

Built for **Web Summit Vancouver** (May 11–14, 2026) as a controlled invite-only beta (~50–200 attendees). Designed to evolve into a multi-event platform with per-event configuration, starting with **Vancouver Startup Week** (September 2026).

**Status:** Pre-launch. Active development. Not yet production-ready — see [Known Limitations](#known-limitations) for an honest accounting.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.1 |
| Language | TypeScript (strict mode) | 5.5.3 |
| Build | Vite | 5.4.2 |
| Styling | Tailwind CSS + CSS custom properties | 3.4.1 |
| Database | Supabase (PostgreSQL + Auth + Realtime) | JS SDK 2.39.0 |
| Charts | Chart.js (dynamic import) | 4.4.0 |
| Icons | lucide-react | 0.344.0 |
| Linting | ESLint 9 (flat config) | 9.x |

**Development workflow:** [Goose](https://github.com/block/goose) + Claude Opus 4.7 + Visual Studio Code.

---

## Prerequisites

- Node.js 18+ and npm
- A Supabase project (free tier is sufficient for development)
- Git

---

## Environment Setup

Copy the example below into a `.env` file at the project root. **Both variables are required** — the app will fail silently with empty UI if either is missing or malformed. See [Known Limitations](#known-limitations) §1.1 for details.

```env
# Supabase project credentials (required)
# Find these at: https://supabase.com/dashboard → Project → Settings → API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

No other environment variables are required. The app has no analytics, error tracking, or third-party service integrations at this time.

---

## Local Development

```bash
# Clone and install
git clone https://github.com/MartinMontero/LUME-App-Version-VSW-.git
cd LUME-App-Version-VSW-
npm install

# Set up environment (see above)
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migrations against your Supabase project
# Apply in order via the Supabase dashboard SQL editor or CLI:
#   1. supabase/migrations/20250611000605_copper_l*.sql  (schema + RLS + seed data)
#   2. supabase/migrations/20250612040221_green_tr*.sql  (networking tables + geolocation RPC)
#   3. supabase/migrations/20250628155718_curly_flo*.sql (public read access fix)
#   4. supabase/migrations/20250628194550_broad_gl*.sql  (events anon access fix)

# IMPORTANT: You also need a handle_new_user trigger on auth.users
# that creates a profiles row on signup. This trigger exists in the
# hosted project but is NOT in the migrations directory. Without it,
# the first pitch/gathering/signal creation fails with a FK constraint
# violation. See Known Limitations §1.7.

# Start dev server
npm run dev
```

Available scripts:

```bash
npm run dev       # Vite dev server (default: http://localhost:5173)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

---

## Project Structure
src/
├── components/
│   ├── Auth/
│   │   └── AuthModal.tsx          # Email/password signup and login
│   ├── common/
│   │   ├── Card.tsx               # Reusable card primitive (3 variants)
│   │   ├── ErrorBoundary.tsx      # Class-based error boundary with fallback UI
│   │   ├── LoadingSpinner.tsx     # Loading indicator wrapper
│   │   ├── Section.tsx            # Layout section primitive (3 backgrounds)
│   │   └── SectionHeader.tsx      # Section heading with optional badge
│   ├── forms/
│   │   ├── Button.tsx             # Button primitive (6 variants, 3 sizes)
│   │   └── FormField.tsx          # Form field, Input, Textarea, Select
│   ├── ui/
│   │   ├── EmptyState.tsx         # Decorative empty-state placeholder
│   │   ├── ErrorMessage.tsx       # Error display with optional retry
│   │   ├── Modal.tsx              # Shared modal primitive
│   │   ├── SkeletonLoader.tsx     # Loading skeleton (5 variants)
│   │   └── Toast.tsx              # Individual toast notification renderer
│   ├── AccessibilityMenu.tsx      # A11y preferences panel
│   ├── Approach.tsx               # "Insights" section with accordion
│   ├── BrightnessCard.tsx         # Project card sub-component
│   ├── Community.tsx              # Gatherings section (create, join, browse)
│   ├── FloatingParticles.tsx      # Background decoration
│   ├── Home.tsx                   # Landing / hero section
│   ├── LoadingLight.tsx           # Animated loading indicator
│   ├── NaturalRhythms.tsx         # Time-of-day sidebar widget
│   ├── Navigation.tsx             # Top nav with scroll-based active state
│   ├── Networking.tsx             # Pitch cards section (create, like, browse)
│   ├── NetworkingSignals.tsx      # Real-time networking signals + geolocation
│   ├── ProjectShowcase.tsx        # Hardcoded project showcase (to be removed)
│   └── ToastContainer.tsx         # Toast list renderer
├── constants/
│   └── index.ts                   # APP_CONFIG, TRACK_COLORS, SIGNAL_TYPES, PITCH_STAGES
├── data/
│   └── sampleData.ts             # Approach accordion lessons (4 entries)
├── hooks/
│   ├── useAccessibility.ts       # A11y preferences + media query detection
│   ├── useAuth.ts                # Supabase auth state management
│   ├── useDebounce.ts            # Generic debounce hook
│   ├── useModal.ts               # Modal open/close state
│   └── useToast.ts               # Toast notification state (see §1.2)
├── lib/
│   ├── api.ts                    # ApiCache (LRU), retryApiCall, batchApiCalls, checkApiHealth
│   └── supabase.ts               # All Supabase queries, subscriptions, auth helpers
├── types/
│   └── database.ts               # Hand-maintained Supabase type definitions
├── utils/
│   └── index.ts                  # Date formatters, validators, a11y helpers, debounce, throttle
├── App.tsx                        # Root component (single-page, no router)
├── index.css                      # Tailwind base + custom properties + animations (1045 lines)
├── main.tsx                       # Entry point
└── vite-env.d.ts                  # Vite type declarations
supabase/
└── migrations/
├── 20250611000605_copper_.sql  # Initial schema, RLS, triggers, seed data
├── 20250612040221_green_.sql   # Networking signals, responses, locations, nearby-users RPC
├── 20250628155718_curly_.sql   # Public read access for events/pitches/gatherings
└── 20250628194550_broad_.sql   # Events accessible to anon role
---

## Database Schema

Ten tables across four functional areas:

**Core:** `profiles` (user info, FK to auth.users), `events` (conference schedule)

**Pitches:** `pitches` (startup pitches with stage progression), `pitch_interactions` (polymorphic — likes and comments via CHECK constraint), `event_saves` (user favorites)

**Community:** `gatherings` (informal meetups), `gathering_attendees` (RSVP with status)

**Networking:** `networking_signals` (time-limited availability broadcasts — coffee/lunch/cowork/walk/chat), `networking_responses` (replies to signals), `user_locations` (geolocation for proximity-based discovery)

**RPC:** `get_nearby_users(user_lat, user_lng, radius_km)` — Haversine distance calculation, returns nearby users within radius. Defaults to 1km. SECURITY DEFINER.

**RLS:** Enabled on all tables. Policies use `auth.uid()` for authorization. Events are publicly readable (including anonymous/unauthenticated). All other tables require authentication for reads. Write operations restricted to row owners.

---

## Key Architecture Decisions

**Single-page, no router.** All sections render in a single scrollable view. Navigation uses scroll-to-section with `id` anchors. This was a deliberate choice for the initial VSW prototype; the platform version will need proper routing and code splitting.

**Separate profiles table from auth.users.** User-facing data (name, company, bio, interests) lives in `profiles`, not in `auth.users.raw_user_meta_data`. Auth metadata is written at signup; a trigger syncs it to `profiles`. This separation is correct — it means RLS policies on profile data don't depend on user-editable auth metadata.

**Realtime subscriptions for live data.** Networking.tsx, Community.tsx, and NetworkingSignals.tsx subscribe to Supabase Realtime channels for INSERT/UPDATE/DELETE events. Subscription cleanup is consistently correct across all components.

**ApiCache with LRU eviction** in `lib/api.ts`. Supports TTL per entry, pattern-based invalidation, and stats. Currently used only for events (10-minute TTL). Other data bypasses the cache.

---

## Known Limitations

This project has undergone a comprehensive code audit (50 of 50 source files, all 4 migrations). The findings are documented in a separate audit report. The summary below is for developer orientation.

### Critical (must fix before any external use)

1. **§1.1 — Silent failure on missing env vars.** If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing, the app falls back to a placeholder URL and shows empty state everywhere with no error indication. The `checkApiHealth()` function in `lib/api.ts` can detect this but is never called.

2. **§1.2 — Toast notifications are invisible.** `useToast` uses `useState` instead of React Context. Every component that calls `useToast()` gets its own isolated state. Toasts triggered from Community.tsx and Schedule.tsx never render. Users get no feedback on successful actions.

3. **§1.7 — Missing profile sync trigger.** The `handle_new_user` trigger that creates a `profiles` row on signup is not in the migrations directory. Without it, any fresh Supabase deployment breaks on the first user action (FK constraint violation).

4. **§1.3 — No Privacy Policy or Terms of Service.** Footer links are `href="#"` placeholders. No GDPR consent flow at signup.

5. **§1.4 — Geolocation captured without consent UX.** `NetworkingSignals.tsx` requests location immediately on auth with no in-app explanation. Browser prompt alone is not sufficient under PIPEDA or GDPR.

6. **§1.6 — Hardcoded fake statistics.** Multiple components display fabricated numbers (attendee counts, community stats, fake projects with fictional collaborators) that are not backed by real data.

### Functional bugs

7. **§2.1 — Realtime payloads lack joined profile data.** Newly-created pitches and gatherings show 'A' as the organizer initial until the page is reloaded.

8. **§2.7 — Modal accessibility.** The shared Modal component lacks `role="dialog"`, focus trap, ESC-to-close, and body scroll lock. The `trapFocus` utility exists in `utils/index.ts` but is not wired up.

9. **§2.11 — networking_responses RLS bug.** Response creators cannot SELECT their own responses — only the signal owner can view them.

10. **§3.4 — No multi-event support.** No `event_id` column exists on pitches, gatherings, signals, or any other table. All data is global. Adding a second event leaks data between events.

### Infrastructure

11. **No tests, no CI, no error tracking.** No test framework configured. No GitHub Actions. Sentry integration is scaffolded but not connected.

12. **No code splitting.** Single-page app ships the entire bundle on first paint.

13. **Hand-maintained database types.** `src/types/database.ts` is manually written rather than generated via `supabase gen types typescript`. Schema changes require manual type updates.

---

## Infrastructure Plan

**Stage 1 — MVP (Web Summit Vancouver, May 2026):**
Cloudflare Pages (frontend) + Cloudflare D1 (database) + Cloudflare Workers (API) + Durable Objects (realtime). Edge presence in Vancouver. Migration from current Supabase backend underway.

**Stage 2 — Platform (post-September 2026):**
Self-hosted on Vexxhost OpenStack in Montreal. Canadian-owned infrastructure, fully sovereign under Canadian law. Multi-tenant architecture with per-event configuration.

**Excluded infrastructure:** AWS, Oracle, and any services built on them (including hosted Supabase, Vercel, Netlify, and Convex).

---

## Contributing

This project is in active pre-launch development. If you're interested in contributing, open an issue first to discuss scope. The audit report documents the current state in detail and identifies the highest-leverage fixes.

Development uses **Goose + Claude Opus 4.7 + Visual Studio Code** as the primary workflow. AI-assisted development is the norm, not the exception.

---

## License

TBD — license selection pending. Contact the maintainer before reuse.
