import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Plan } from './AdminPortal'

// ─── Types ────────────────────────────────────────────────────────────────────

type GraphicId = 'logo' | 'ticker' | 'timer' | 'agenda' | 'qa' | 'poll' | 'external' | 'waiting-room' | 'nametag' | 'social-feed' | 'lower-third' | 'scoreboard' | 'sponsor-banner'
type Badge = 'default' | 'enterprise' | 'custom'
type PermissionKey = 'add' | 'edit' | 'view' | 'interact'

interface RolePermissions {
  add: boolean
  edit: boolean
  view: boolean
  interact: boolean
}

type GraphicPermissionMap = Record<string, Record<string, RolePermissions>>

interface ColorTheme {
  id: string
  name: string
  primary: string[]
  secondary: string[]
  font: string[]
}

const PERMISSION_LABELS: { key: PermissionKey; label: string }[] = [
  { key: 'add',      label: 'Add'      },
  { key: 'edit',     label: 'Edit'     },
  { key: 'view',     label: 'View'     },
  { key: 'interact', label: 'Interact' },
]

const ROLE_PERM_STYLES: Record<string, { color: string; dimColor: string }> = {
  Admin:  { color: '#a5b4fc', dimColor: 'rgba(165,180,252,0.5)' },
  Editor: { color: '#93c5fd', dimColor: 'rgba(147,197,253,0.5)' },
  Viewer: { color: 'rgba(255,255,255,0.55)', dimColor: 'rgba(255,255,255,0.25)' },
}

const DEFAULT_ROLE_PERMISSIONS: Record<string, RolePermissions> = {
  Admin:  { add: true,  edit: true,  view: true, interact: true  },
  Editor: { add: true,  edit: true,  view: true, interact: true  },
  Viewer: { add: false, edit: false, view: true, interact: true  },
}

interface Graphic {
  id: GraphicId
  name: string
  description: string
  badge: Badge
  Icon: React.ComponentType<{ className?: string }>
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="5.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 11L5 7.5L7.5 10L10 8L14.5 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TickerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 5.5H14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M1.5 8H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M1.5 10.5H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.5 8L14.5 10L12.5 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TimerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 6V9L10 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 1.5H9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M13 3.5L12 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function AgendaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4.5H13M3 7.5H13M3 10.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="11.5" cy="11.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.5 11.5L11.2 12.2L12.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function QAIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2.5H14V11.5H9L6 14V11.5H2V2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 5.5C7 4.95 7.45 4.5 8 4.5C8.55 4.5 9 4.95 9 5.5C9 6.05 8.5 6.3 8 6.8V7.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="9" r="0.6" fill="currentColor" />
    </svg>
  )
}

function PollIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 12.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 12.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12.5V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 12.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5" width="9" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.5 3H13V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 3L7 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function NameTagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 11.5C5 10.12 6.34 9 8 9C9.66 9 11 10.12 11 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function SocialFeedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="3" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="13" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="13" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 7.25L11.5 4.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4.5 8.75L11.5 11.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function WaitingRoomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.5 2H13.5V14H2.5V2H6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 1H9.5V3H6.5V1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="8" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 12.5C5.5 11.12 6.62 10 8 10C9.38 10 10.5 11.12 10.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function LowerThirdIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3.5" y="9" width="9" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 6H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ScoreboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 3.5V12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4.5 6.5H5.5M4.5 9H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M10 6.5H11.5M10 9H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function SponsorBannerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="5" width="13" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 8H11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3.5 3L4.5 5M12.5 3L11.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}


function PlusSmIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5L5 9.5L11 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GRAPHICS: Graphic[] = [
  { id: 'nametag',      name: 'Name Tag',          description: 'Personal information display shown alongside participants',        badge: 'default',  Icon: NameTagIcon     },
  { id: 'logo',         name: 'Logo',             description: 'Display your organization logo as a branded meeting overlay',   badge: 'default',    Icon: LogoIcon        },
  { id: 'ticker',       name: 'Ticker',            description: 'Scrolling text banner for live announcements and news feeds',   badge: 'default',    Icon: TickerIcon      },
  { id: 'timer',        name: 'Timer',             description: 'Countdown or elapsed time display visible to all participants', badge: 'default',    Icon: TimerIcon       },
  { id: 'agenda',       name: 'Agenda',            description: 'Structured meeting agenda shown alongside the video feed',      badge: 'default',    Icon: AgendaIcon      },
  { id: 'qa',           name: 'Q&A',               description: 'Interactive Q&A panel to collect and display audience questions', badge: 'default',  Icon: QAIcon          },
  { id: 'poll',         name: 'Poll',              description: 'Live polling to engage participants and gather real-time feedback', badge: 'default', Icon: PollIcon        },
  { id: 'external',     name: 'External Content',  description: 'Embed third-party media, websites, or interactive content',    badge: 'default',    Icon: ExternalIcon    },
  { id: 'waiting-room',    name: 'Waiting Room',     description: 'Branded pre-meeting area displayed to participants before start',    badge: 'default',    Icon: WaitingRoomIcon    },
  { id: 'social-feed',    name: 'Social Feed',      description: 'Live social media posts displayed during the meeting',                badge: 'default',    Icon: SocialFeedIcon     },
  { id: 'lower-third',    name: 'Lower Third',      description: 'Branded speaker name and title overlay anchored to the bottom frame', badge: 'enterprise', Icon: LowerThirdIcon     },
  { id: 'scoreboard',     name: 'Scoreboard',       description: 'Live score display for competitions, debates and sports events',      badge: 'enterprise', Icon: ScoreboardIcon     },
  { id: 'sponsor-banner', name: 'Sponsor Banner',   description: 'Rotating sponsor logos and branded ad placements during the meeting', badge: 'enterprise', Icon: SponsorBannerIcon  },
]

const BRAND_THEMES_DEFAULT: ColorTheme[] = [
  {
    id: 'theme-default',
    name: 'Default Theme',
    primary:   ['#615fff', '#0283ff'],
    secondary: ['#ffa726', '#ef4444', '#10b981'],
    font:      ['#fafaf9', '#94a3b8'],
  },
]

// ─── Toggle ───────────────────────────────────────────────────────────────────

interface ToggleProps {
  on: boolean
  onChange: (v: boolean) => void
  size?: 'sm' | 'md'
}

function Toggle({ on, onChange, size = 'md' }: ToggleProps) {
  const w = size === 'sm' ? 32 : 38
  const h = size === 'sm' ? 18 : 22
  const dot = size === 'sm' ? 12 : 16
  const offset = size === 'sm' ? 3 : 3
  const translateOn = w - dot - offset

  return (
    <button
      onClick={() => onChange(!on)}
      className="relative flex items-center rounded-full cursor-pointer border-0 transition-colors shrink-0"
      style={{
        width: w,
        height: h,
        background: on ? '#0283ff' : 'rgba(255,255,255,0.15)',
        border: `1px solid ${on ? 'rgba(2,131,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
      }}
    >
      <span
        className="absolute top-[2px] rounded-full bg-white transition-transform duration-200"
        style={{
          width: dot,
          height: dot,
          transform: `translateX(${on ? translateOn : offset - 1}px)`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}
      />
    </button>
  )
}

// ─── Graphic mini preview ─────────────────────────────────────────────────────

function GraphicMiniPreview({ id, enabled }: { id: string; enabled: boolean }) {
  const s: React.CSSProperties = {
    width: 80, height: 48, borderRadius: 6, overflow: 'hidden', flexShrink: 0,
    background: '#141518', border: '1px solid rgba(255,255,255,0.08)',
    opacity: enabled ? 1 : 0.35, transition: 'opacity 0.2s',
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  if (id === 'nametag') return (
    <div style={s}>
      <div style={{ width: 62, background: 'white', borderRadius: 5, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
        <div style={{ height: 3, background: '#615fff' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#2a2b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 5, fontWeight: 700, color: '#ffa726' }}>JS</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, marginBottom: 2, width: '80%' }} />
            <div style={{ height: 3, background: '#bbb', borderRadius: 2, marginBottom: 2, width: '65%' }} />
            <div style={{ height: 3, background: '#615fff', borderRadius: 2, width: '50%' }} />
          </div>
        </div>
      </div>
    </div>
  )

  if (id === 'logo') return (
    <div style={s}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#fafaf9', letterSpacing: '-0.5px' }}>B</span>
      </div>
    </div>
  )

  if (id === 'ticker') return (
    <div style={s}>
      <div style={{ position: 'absolute', bottom: 8, left: 4, right: 4, background: '#615fff', borderRadius: 3, padding: '3px 5px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 5, fontWeight: 800, color: 'white', letterSpacing: '0.05em', flexShrink: 0 }}>LIVE</span>
        <div style={{ width: 1, height: 8, background: 'rgba(255,255,255,0.4)' }} />
        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.6)', borderRadius: 2 }} />
      </div>
    </div>
  )

  if (id === 'timer') return (
    <div style={s}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fafaf9', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>00:30</div>
        <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: '0.1em' }}>COUNTDOWN</div>
      </div>
    </div>
  )

  if (id === 'agenda') return (
    <div style={s}>
      <div style={{ width: 56, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[80, 65, 50].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? '#615fff' : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
            <div style={{ height: 3, background: i === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', borderRadius: 2, width: `${w}%`, flex: '0 0 auto' }} />
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'qa') return (
    <div style={s}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px 6px 6px 2px', padding: '4px 7px' }}>
          <div style={{ height: 3, width: 40, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
        </div>
        <div style={{ background: 'rgba(97,95,255,0.3)', borderRadius: '6px 6px 2px 6px', padding: '4px 7px', alignSelf: 'flex-end' }}>
          <div style={{ height: 3, width: 28, background: 'rgba(97,95,255,0.9)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  )

  if (id === 'poll') return (
    <div style={s}>
      <div style={{ width: 56, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[{ w: 70, c: '#615fff' }, { w: 45, c: 'rgba(255,255,255,0.3)' }, { w: 25, c: 'rgba(255,255,255,0.3)' }].map((bar, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${bar.w}%`, height: '100%', background: bar.c, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 5, color: 'rgba(255,255,255,0.4)', width: 14, textAlign: 'right' }}>{bar.w}%</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'external') return (
    <div style={s}>
      <div style={{ width: 54, height: 34, background: 'rgba(255,255,255,0.06)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '12px solid rgba(255,255,255,0.6)', marginLeft: 3 }} />
      </div>
    </div>
  )

  if (id === 'waiting-room') return (
    <div style={{ ...s, background: 'linear-gradient(135deg, #1a1b2e 0%, #0f0f1a 100%)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(97,95,255,0.3)', border: '1.5px solid rgba(97,95,255,0.6)', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#615fff' }} />
        </div>
        <div style={{ height: 3, width: 36, background: 'rgba(255,255,255,0.4)', borderRadius: 2, margin: '0 auto 2px' }} />
        <div style={{ height: 2, width: 24, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '0 auto' }} />
      </div>
    </div>
  )

  if (id === 'social-feed') return (
    <div style={s}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 62 }}>
        {[{ bg: '#1da1f2', w: 55 }, { bg: '#e1306c', w: 40 }].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, padding: '3px 5px', display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.bg, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.5)', borderRadius: 1, marginBottom: 2, width: `${item.w}%` }} />
              <div style={{ height: 2, background: 'rgba(255,255,255,0.2)', borderRadius: 1, width: '80%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'lower-third') return (
    <div style={s}>
      <div style={{ position: 'absolute', bottom: 7, left: 4, right: 4 }}>
        <div style={{ background: '#615fff', padding: '3px 6px 2px' }}>
          <div style={{ height: 4, width: 44, background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
        </div>
        <div style={{ background: 'rgba(20,21,24,0.9)', padding: '2px 6px 3px', borderLeft: '2px solid #ffa726' }}>
          <div style={{ height: 3, width: 32, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )

  if (id === 'scoreboard') return (
    <div style={s}>
      <div style={{ width: 64, background: 'rgba(20,21,24,0.9)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ background: '#615fff', padding: '2px 6px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 5, fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>LIVE</span>
          <span style={{ fontSize: 5, fontWeight: 700, color: 'white' }}>Q1</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>24</span>
          <span style={{ fontSize: 6, color: '#ffa726', fontWeight: 700 }}>VS</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>17</span>
        </div>
      </div>
    </div>
  )

  if (id === 'sponsor-banner') return (
    <div style={s}>
      <div style={{ width: 66, background: 'rgba(255,255,255,0.05)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 4 }}>
        {['#615fff','#ffa726','#10b981'].map((c, i) => (
          <div key={i} style={{ width: 14, height: 10, borderRadius: 2, background: c, opacity: 0.7 }} />
        ))}
      </div>
    </div>
  )

  if (id === 'custom-template') return (
    <div style={s}>
      <div style={{ width: 60, height: 36, borderRadius: 4, border: '1px dashed rgba(52,211,153,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(52,211,153,0.7)', fontSize: 16 }}>+</div>
      </div>
    </div>
  )

  if (id === 'custom-overlay') return (
    <div style={s}>
      <div style={{ width: 60, height: 36, borderRadius: 4, border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.05)', padding: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[40, 28, 20].map((w, i) => <div key={i} style={{ height: 4, width: w, borderRadius: 2, background: 'rgba(52,211,153,0.4)' }} />)}
      </div>
    </div>
  )

  if (id === 'custom-widget') return (
    <div style={s}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 36, height: 36 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ borderRadius: 3, background: 'rgba(52,211,153,0.25)', border: '1px solid rgba(52,211,153,0.3)' }} />)}
      </div>
    </div>
  )

  return <div style={s}><div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }} /></div>
}

// ─── BadgeChip ────────────────────────────────────────────────────────────────

function BadgeChip({ type }: { type: Badge }) {
  if (type === 'custom') {
    return (
      <span
        className="text-[10px] font-medium px-[7px] py-[2px] rounded-full"
        style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}
      >
        Custom
      </span>
    )
  }
  if (type === 'enterprise') {
    return (
      <span
        className="text-[10px] font-medium px-[7px] py-[2px] rounded-full"
        style={{ color: '#93c5fd', background: 'rgba(2,131,255,0.12)' }}
      >
        Custom
      </span>
    )
  }
  return (
    <span
      className="text-[10px] font-medium px-[7px] py-[2px] rounded-full"
      style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)' }}
    >
      Default
    </span>
  )
}

// ─── Section card wrapper ─────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[12px]"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
    >
      {children}
    </div>
  )
}

// ─── Social platform icons ────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 1L5.8 7.35M1 13L7.6 5.5M5.8 7.35L8.2 13M5.8 7.35L13 1M8.2 13H10.5L13 1H10.8L8.2 13Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10.5" cy="3.5" r="0.65" fill="currentColor" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12.5 7.14C12.5 6.66 12.46 6.3 12.37 5.93H7.14V8.13H10.2C10.14 8.63 9.82 9.38 9.1 9.89L9.09 9.97L10.74 11.24L10.85 11.25C11.9 10.27 12.5 8.83 12.5 7.14Z" fill="currentColor" fillOpacity="0.6" />
      <path d="M7.14 12.5C8.64 12.5 9.9 12.01 10.85 11.25L9.1 9.89C8.62 10.22 7.97 10.45 7.14 10.45C5.68 10.45 4.44 9.47 3.98 8.12L3.9 8.13L2.19 9.44L2.17 9.52C3.11 11.38 4.98 12.5 7.14 12.5Z" fill="currentColor" fillOpacity="0.5" />
      <path d="M3.98 8.12C3.86 7.75 3.79 7.36 3.79 6.96C3.79 6.56 3.86 6.17 3.97 5.8L3.97 5.72L2.24 4.39L2.17 4.42C1.77 5.22 1.5 6.07 1.5 6.96C1.5 7.85 1.77 8.7 2.17 9.52L3.98 8.12Z" fill="currentColor" fillOpacity="0.7" />
      <path d="M7.14 3.47C8.18 3.47 8.88 3.91 9.28 4.28L10.89 2.72C9.9 1.8 8.64 1.5 7.14 1.5C4.98 1.5 3.11 2.62 2.17 4.42L3.97 5.8C4.44 4.45 5.68 3.47 7.14 3.47Z" fill="currentColor" fillOpacity="0.8" />
    </svg>
  )
}

function ThreadsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9.5 6.5C9.5 5.12 8.38 4 7 4C5.62 4 4.5 5.12 4.5 6.5V7.5C4.5 9.43 6.07 11 8 11C9.1 11 9.5 10.5 9.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9.5 5.5C9.5 3.57 7.93 2 6 2C4.34 2 3 3.12 3 5V9C3 11.21 4.79 13 7 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="9.5" cy="7" r="1" fill="currentColor" />
    </svg>
  )
}

function BlueskyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 4.5C7 4.5 4.5 2 2.5 2C2.5 2 2 5 4 6.5C4 6.5 2 6.5 1.5 8C1.5 8 3.5 8.5 5 7.5C5 7.5 5 10.5 7 12C7 12 9 10.5 9 7.5C9 7.5 10.5 8.5 12.5 8C12.5 8 12 6.5 10 6.5C10 6.5 12 5 11.5 2C11.5 2 9.5 2 7 4.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Social platforms data ────────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  { id: 'x',         name: 'X',         Icon: XIcon,         color: '#fafaf9' },
  { id: 'instagram', name: 'Instagram',  Icon: InstagramIcon, color: '#e879a0' },
  { id: 'google',    name: 'Google',     Icon: GoogleIcon,    color: '#4285f4' },
  { id: 'threads',   name: 'Threads',    Icon: ThreadsIcon,   color: '#fafaf9' },
  { id: 'bluesky',   name: 'Bluesky',    Icon: BlueskyIcon,   color: '#0285ff' },
]

// ─── Graphic permission panel ─────────────────────────────────────────────────

function RolesIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="4.5" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 10V9.5C1 7.85 2.62 6.5 4.5 6.5C6.38 6.5 8 7.85 8 9.5V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 4.5V7.5M10.5 6H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

interface GraphicPermissionPanelProps {
  permissions: Record<string, RolePermissions>
  onChange: (role: string, key: PermissionKey, value: boolean) => void
}

function GraphicPermissionPanel({ permissions, onChange }: GraphicPermissionPanelProps) {
  const roles = ['Admin', 'Editor', 'Viewer']

  return (
    <div
      className="rounded-[8px] overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
    >
        {/* Column headers */}
        <div
          className="flex items-center px-[14px] py-[8px]"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="flex-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Role
          </span>
          {PERMISSION_LABELS.map(({ key, label }) => (
            <span
              key={key}
              className="text-[10px] font-semibold uppercase tracking-wide text-center"
              style={{ width: 68, color: 'rgba(255,255,255,0.25)' }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Role rows */}
        {roles.map((role, ri) => {
          const perms = permissions[role]
          const isAdmin = role === 'Admin'
          const { color } = ROLE_PERM_STYLES[role]
          return (
            <div
              key={role}
              className="flex items-center px-[14px] py-[9px]"
              style={{ borderBottom: ri < roles.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              {/* Role label */}
              <div className="flex-1 relative group/adminlabel">
                <div className="flex items-center gap-[6px]">
                  <span
                    className="w-[7px] h-[7px] rounded-full shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-[12px] font-medium" style={{ color }}>
                    {role}
                  </span>
                  {isAdmin && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color, opacity: 0.6 }}>
                      <rect x="1.5" y="4.5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M3 4.5V3.5C3 2.12 3.9 1.5 5 1.5C6.1 1.5 7 2.12 7 3.5V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                {isAdmin && (
                  <div
                    className="absolute left-0 bottom-full mb-[6px] px-[8px] py-[4px] rounded-[6px] whitespace-nowrap pointer-events-none opacity-0 group-hover/adminlabel:opacity-100 transition-opacity duration-150"
                    style={{
                      background: '#2a2b30',
                      border: '1px solid rgba(255,255,255,0.09)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      Admin always has access
                    </span>
                    <div
                      className="absolute top-full left-[16px]"
                      style={{
                        width: 0, height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: '5px solid #2a2b30',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Permission checkboxes */}
              {PERMISSION_LABELS.map(({ key }) => {
                const isOn = perms[key]
                return (
                  <div key={key} className="flex justify-center" style={{ width: 68 }}>
                    <button
                      onClick={() => { if (!isAdmin) onChange(role, key, !isOn) }}
                      className="w-[20px] h-[20px] rounded-[5px] flex items-center justify-center border-0 transition-all"
                      style={{
                        background: isAdmin && isOn
                          ? 'rgba(255,255,255,0.07)'
                          : isOn
                          ? 'rgba(2,131,255,0.18)'
                          : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${
                          isAdmin && isOn
                            ? 'rgba(255,255,255,0.12)'
                            : isOn
                            ? 'rgba(2,131,255,0.4)'
                            : 'rgba(255,255,255,0.1)'
                        }`,
                        cursor: isAdmin ? 'default' : 'pointer',
                      }}
                      onMouseEnter={e => { if (!isAdmin && !isOn) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' }}
                      onMouseLeave={e => { if (!isAdmin && !isOn) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)' }}
                    >
                      {isOn && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M1.5 5L3.5 7L8.5 2.5"
                            stroke={isAdmin ? 'rgba(255,255,255,0.3)' : '#0283ff'}
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
    </div>
  )
}

// ─── Graphic row ─────────────────────────────────────────────────────────────

interface GraphicRowProps {
  graphic: Graphic
  enabled: boolean
  onToggle: () => void
  isLast: boolean
  children?: React.ReactNode
  permissions: Record<string, RolePermissions>
  onPermissionChange: (role: string, key: PermissionKey, value: boolean) => void
}

function GraphicRow({ graphic, enabled, onToggle, isLast, children, permissions, onPermissionChange }: GraphicRowProps) {
  const [showPerms, setShowPerms] = useState(false)
  const { name, description, badge } = graphic
  return (
    <div
      className="transition-colors"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Main row */}
      <div className="flex items-center gap-[12px] px-[20px] py-[10px]">
        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[8px] mb-[2px]">
            <span className="font-medium text-[13px] text-[#fafaf9]">{name}</span>
            <BadgeChip type={badge} />
          </div>
          <p className="text-[12px] leading-[16px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {description}
          </p>
        </div>
        {/* Graphic mini preview */}
        <GraphicMiniPreview id={graphic.id} enabled={enabled} />
        {/* Role permissions button */}
        <button
          onClick={() => setShowPerms(v => !v)}
          className="flex items-center gap-[5px] px-[8px] py-[5px] rounded-[6px] border-0 cursor-pointer shrink-0 text-[11px] font-medium transition-all"
          style={{
            background: showPerms ? 'rgba(2,131,255,0.15)' : 'rgba(255,255,255,0.05)',
            color: showPerms ? '#60a5fa' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${showPerms ? 'rgba(2,131,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
          }}
          onMouseEnter={e => { if (!showPerms) { (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' } }}
          onMouseLeave={e => { if (!showPerms) { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' } }}
        >
          <RolesIcon />
          Roles
        </button>
        {/* Toggle with tooltip */}
        <div className="relative flex items-center shrink-0 group/toggle">
          <Toggle on={enabled} onChange={onToggle} />
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[6px] px-[7px] py-[3px] rounded-[5px] whitespace-nowrap pointer-events-none opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-150"
            style={{
              background: '#2a2b30',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {enabled ? 'Visible' : 'Hidden'}
            </span>
            <div
              className="absolute top-full left-1/2 -translate-x-1/2"
              style={{
                width: 0, height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid #2a2b30',
              }}
            />
          </div>
        </div>
      </div>

      {/* Role permission matrix */}
      {showPerms && (
        <div className="px-[20px] pb-[14px]">
          <GraphicPermissionPanel permissions={permissions} onChange={onPermissionChange} />
        </div>
      )}

      {/* Expandable children (e.g. social feed platforms) */}
      {enabled && children && (
        <div className="px-[20px] pb-[16px]">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Graphic card preview (full-width) ───────────────────────────────────────

function GraphicCardPreview({ id, enabled }: { id: string; enabled: boolean }) {
  const base: React.CSSProperties = {
    width: '100%', height: '100%', position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: enabled ? 1 : 0.35, transition: 'opacity 0.2s',
  }

  if (id === 'nametag') return (
    <div style={base}>
      <div style={{ width: '78%', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
        <div style={{ height: 4, background: '#615fff' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2a2b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ffa726' }}>JS</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 5, background: '#1a1a1a', borderRadius: 2, marginBottom: 4, width: '70%' }} />
            <div style={{ height: 4, background: '#bbb', borderRadius: 2, marginBottom: 3, width: '55%' }} />
            <div style={{ height: 4, background: '#615fff', borderRadius: 2, width: '45%' }} />
          </div>
        </div>
      </div>
    </div>
  )

  if (id === 'logo') return (
    <div style={base}>
      <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#fafaf9' }}>B</span>
      </div>
    </div>
  )

  if (id === 'ticker') return (
    <div style={{ ...base, flexDirection: 'column', justifyContent: 'flex-end', padding: '0 0 12px' }}>
      <div style={{ width: '88%', background: '#615fff', borderRadius: 4, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 8, fontWeight: 800, color: 'white', letterSpacing: '0.06em', flexShrink: 0 }}>LIVE</span>
        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.65)', borderRadius: 2 }} />
      </div>
    </div>
  )

  if (id === 'timer') return (
    <div style={base}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#fafaf9', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>00:30</div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.12em' }}>COUNTDOWN</div>
      </div>
    </div>
  )

  if (id === 'agenda') return (
    <div style={base}>
      <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[{ w: '80%', active: true }, { w: '65%', active: false }, { w: '50%', active: false }].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.active ? '#615fff' : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
            <div style={{ height: 4, background: item.active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', borderRadius: 2, width: item.w }} />
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'qa') return (
    <div style={base}>
      <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '8px 8px 8px 2px', padding: '7px 10px' }}>
          <div style={{ height: 4, width: '75%', background: 'rgba(255,255,255,0.45)', borderRadius: 2 }} />
        </div>
        <div style={{ background: 'rgba(97,95,255,0.3)', borderRadius: '8px 8px 2px 8px', padding: '7px 10px', alignSelf: 'flex-end', width: '60%' }}>
          <div style={{ height: 4, background: 'rgba(97,95,255,0.9)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  )

  if (id === 'poll') return (
    <div style={base}>
      <div style={{ width: '82%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[{ w: '70%', c: '#615fff', label: '70%' }, { w: '45%', c: 'rgba(255,255,255,0.25)', label: '45%' }, { w: '25%', c: 'rgba(255,255,255,0.15)', label: '25%' }].map((bar, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: bar.w, height: '100%', background: bar.c, borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', width: 20, textAlign: 'right', flexShrink: 0 }}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'external') return (
    <div style={base}>
      <div style={{ width: '80%', height: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid rgba(255,255,255,0.55)', marginLeft: 4 }} />
      </div>
    </div>
  )

  if (id === 'waiting-room') return (
    <div style={{ ...base, background: 'linear-gradient(135deg, #1a1b2e 0%, #0f0f1a 100%)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(97,95,255,0.3)', border: '2px solid rgba(97,95,255,0.6)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#615fff' }} />
        </div>
        <div style={{ height: 4, width: 60, background: 'rgba(255,255,255,0.4)', borderRadius: 2, margin: '0 auto 4px' }} />
        <div style={{ height: 3, width: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '0 auto' }} />
      </div>
    </div>
  )

  if (id === 'social-feed') return (
    <div style={base}>
      <div style={{ width: '85%', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[{ bg: '#1da1f2', lines: ['75%', '55%'] }, { bg: '#e1306c', lines: ['60%', '80%'] }].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 5, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: item.bg, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.5)', borderRadius: 2, marginBottom: 3, width: item.lines[0] }} />
              <div style={{ height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2, width: item.lines[1] }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'lower-third') return (
    <div style={{ ...base, flexDirection: 'column', justifyContent: 'flex-end', padding: '0 0 12px' }}>
      <div style={{ width: '88%' }}>
        <div style={{ background: '#615fff', padding: '5px 10px' }}>
          <div style={{ height: 5, width: '55%', background: 'rgba(255,255,255,0.9)', borderRadius: 2 }} />
        </div>
        <div style={{ background: 'rgba(20,21,24,0.92)', padding: '4px 10px', borderLeft: '3px solid #ffa726' }}>
          <div style={{ height: 4, width: '45%', background: 'rgba(255,255,255,0.4)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  )

  if (id === 'scoreboard') return (
    <div style={base}>
      <div style={{ width: '80%', background: 'rgba(20,21,24,0.95)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ background: '#615fff', padding: '4px 12px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>LIVE</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: 'white' }}>Q1 · 12:34</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontWeight: 600, letterSpacing: '0.05em' }}>HOME</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1 }}>24</div>
          </div>
          <span style={{ fontSize: 12, color: '#ffa726', fontWeight: 700 }}>VS</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontWeight: 600, letterSpacing: '0.05em' }}>AWAY</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1 }}>17</div>
          </div>
        </div>
      </div>
    </div>
  )

  if (id === 'sponsor-banner') return (
    <div style={base}>
      <div style={{ width: '85%', background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.09)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 8 }}>
        {['#615fff', '#ffa726', '#10b981'].map((c, i) => (
          <div key={i} style={{ flex: 1, height: 16, borderRadius: 4, background: c, opacity: 0.7 }} />
        ))}
      </div>
    </div>
  )

  if (id === 'custom-template') return (
    <div style={{ ...base, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <div style={{ width: 52, height: 38, borderRadius: 6, border: '2px dashed rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 20, color: 'rgba(52,211,153,0.6)', fontWeight: 300 }}>+</span>
      </div>
      <div style={{ fontSize: 9, color: 'rgba(52,211,153,0.6)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Custom</div>
    </div>
  )

  if (id === 'custom-overlay') return (
    <div style={{ ...base, flexDirection: 'column', padding: 16, gap: 6 }}>
      <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(52,211,153,0.5)' }} />
      <div style={{ width: '75%', height: 4, borderRadius: 3, background: 'rgba(52,211,153,0.3)' }} />
      <div style={{ width: '55%', height: 4, borderRadius: 3, background: 'rgba(52,211,153,0.2)' }} />
      <div style={{ marginTop: 6, width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.06)' }} />
    </div>
  )

  if (id === 'custom-widget') return (
    <div style={base}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, width: 70, height: 50 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ borderRadius: 5, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }} />)}
      </div>
    </div>
  )

  return <div style={base}><div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(255,255,255,0.07)' }} /></div>
}

// ─── Graphic card (card view) ─────────────────────────────────────────────────

function GraphicCard({ graphic, enabled, onToggle, permissions, onPermissionChange }: Omit<GraphicRowProps, 'isLast' | 'children'>) {
  const [showPerms, setShowPerms] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const rolesRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { name, description, badge } = graphic

  const handleRolesClick = () => {
    if (!showPerms && rolesRef.current) {
      const rect = rolesRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 6, left: rect.left })
    }
    setShowPerms(v => !v)
  }

  useEffect(() => {
    if (!showPerms) return
    const handler = (e: MouseEvent) => {
      if (!rolesRef.current?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node)) {
        setShowPerms(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showPerms])

  const dropdown = showPerms ? createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: dropdownPos.top,
        left: dropdownPos.left,
        zIndex: 9999,
        width: 300,
        background: '#1c1d21',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
        borderRadius: 10,
        padding: '4px',
      }}
    >
      <GraphicPermissionPanel permissions={permissions} onChange={onPermissionChange} />
    </div>,
    document.body
  ) : null

  return (
    <div
      className="flex flex-col rounded-[10px]"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}
    >
      {/* Full-width preview */}
      <div style={{ height: 100, background: '#141518', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <GraphicCardPreview id={graphic.id} enabled={enabled} />
      </div>
      {/* Info + controls */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3, gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fafaf9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
            <BadgeChip type={badge} />
          </div>
          <div className="relative flex items-center shrink-0 group/toggle">
            <Toggle on={enabled} onChange={onToggle} size="sm" />
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[6px] px-[7px] py-[3px] rounded-[5px] whitespace-nowrap pointer-events-none opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-150 z-20"
              style={{ background: '#2a2b30', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
            >
              <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{enabled ? 'Visible' : 'Hidden'}</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #2a2b30' }} />
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: '14px', marginBottom: 8 }}>{description}</p>
        <button
          ref={rolesRef}
          onClick={handleRolesClick}
          className="flex items-center gap-[5px] px-[7px] py-[4px] rounded-[6px] border-0 cursor-pointer text-[11px] font-medium self-start"
          style={{
            background: showPerms ? 'rgba(2,131,255,0.15)' : 'rgba(255,255,255,0.05)',
            color: showPerms ? '#60a5fa' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${showPerms ? 'rgba(2,131,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
          }}
          onMouseEnter={e => { if (!showPerms) { (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' } }}
          onMouseLeave={e => { if (!showPerms) { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' } }}
        >
          <RolesIcon />
          Roles
        </button>
      </div>
      {dropdown}
    </div>
  )
}

// ─── Constraint row ───────────────────────────────────────────────────────────

// ─── Request Update Modal ─────────────────────────────────────────────────────

// ─── Contact Services Modal ───────────────────────────────────────────────────

function ContactServicesModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!message.trim()) return
    setSent(true)
    setTimeout(onClose, 1800)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="flex flex-col rounded-[14px] w-[440px] overflow-hidden"
        style={{ background: '#16181d', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 24px 48px rgba(0,0,0,0.55)' }}
      >
        {sent ? (
          <div className="flex flex-col items-center gap-[14px] px-[32px] py-[40px] text-center">
            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.5 10.5L8.5 14.5L15.5 7" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[15px] text-[#fafaf9] mb-[5px]">Request sent</p>
              <p className="text-[13px] leading-[19px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Your services representative will review your request and be in touch within 1–2 business days.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-[4px] px-[22px] py-[9px] rounded-[8px] border-0 cursor-pointer text-[13px] font-medium"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fafaf9' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-[22px] pt-[20px] pb-[16px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p className="font-semibold text-[14px] text-[#fafaf9] mb-[3px]">Contact Services Representative</p>
                <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Request branding changes from your managed services team</p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-0 cursor-pointer transition-colors shrink-0 mt-[1px]"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fafaf9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Rep card */}
            <div className="px-[22px] py-[16px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div
                className="flex items-center gap-[12px] px-[14px] py-[12px] rounded-[10px]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #615fff 0%, #0283ff 100%)' }}
                >
                  AJ
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13px] text-[#fafaf9] leading-[16px]">Alex Johnson</p>
                  <p className="text-[11px] leading-[14px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Enterprise Services Manager</p>
                  <p className="text-[11px] leading-[15px]" style={{ color: '#a5a3ff' }}>alex.j@enterprise.breezy.com</p>
                </div>
                <div
                  className="flex items-center gap-[5px] px-[8px] py-[4px] rounded-[6px] shrink-0"
                  style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}
                >
                  <div className="w-[5px] h-[5px] rounded-full" style={{ background: '#4ade80' }} />
                  <span className="text-[10px] font-medium" style={{ color: '#4ade80' }}>Available</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-[22px] py-[18px] flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>To</label>
                <div
                  className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #615fff 0%, #0283ff 100%)' }}
                  >
                    AJ
                  </div>
                  <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Brand Services Team</span>
                  <span className="text-[11px] ml-auto" style={{ color: 'rgba(255,255,255,0.25)' }}>alex.j@enterprise.breezy.com</span>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Message</label>
                <textarea
                  autoFocus
                  rows={4}
                  placeholder="Describe the branding changes you'd like to request…"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="resize-none rounded-[8px] text-[13px] leading-[18px] px-[12px] py-[10px] outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#fafaf9', fontFamily: 'inherit' }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid rgba(97,95,255,0.5)' }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-[8px] px-[22px] pb-[20px]">
              <button
                onClick={onClose}
                className="h-[34px] px-[16px] rounded-[8px] border-0 cursor-pointer text-[13px] font-medium transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fafaf9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex items-center gap-[6px] h-[34px] px-[16px] rounded-[8px] border-0 cursor-pointer text-[13px] font-medium transition-all"
                style={{
                  background: message.trim() ? '#615fff' : 'rgba(97,95,255,0.25)',
                  color: message.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                  cursor: message.trim() ? 'pointer' : 'default',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1.5 6H10.5M7 2.5L10.5 6L7 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Send Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

// ─── Constraint Row ───────────────────────────────────────────────────────────

interface ConstraintRowProps {
  Icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
  isLast: boolean
  children?: React.ReactNode
  onRequestUpdate?: () => void
}

function ConstraintRow({ title, description, enabled, onToggle, isLast, children, onRequestUpdate }: Omit<ConstraintRowProps, 'Icon'>) {
  return (
    <div
      className="px-[20px] py-[14px] transition-colors"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-start gap-[14px]">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-[12px]">
            <div>
              <p className="font-medium text-[13px] text-[#fafaf9] mb-[2px]">{title}</p>
              <p className="text-[12px] leading-[16px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {description}
              </p>
            </div>
            <div className="flex items-center shrink-0 mt-[1px]">
              {onRequestUpdate ? (
                <button
                  onClick={onRequestUpdate}
                  className="inline-flex items-center gap-[6px] px-[11px] py-[6px] rounded-[7px] border-0 cursor-pointer text-[12px] font-medium transition-colors"
                  style={{ background: 'rgba(97,95,255,0.1)', color: '#a5a3ff' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(97,95,255,0.18)'; e.currentTarget.style.color = '#c4c3ff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(97,95,255,0.1)'; e.currentTarget.style.color = '#a5a3ff' }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1.5V5.5L7.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  Request Update
                </button>
              ) : (
                <div className="relative group/ctoggle">
                  <Toggle on={enabled} onChange={onToggle} />
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[6px] px-[7px] py-[3px] rounded-[5px] whitespace-nowrap pointer-events-none opacity-0 group-hover/ctoggle:opacity-100 transition-opacity duration-150 z-20"
                    style={{
                      background: '#2a2b30',
                      border: '1px solid rgba(255,255,255,0.09)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {enabled ? 'Locked' : 'Unlocked'}
                    </span>
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2"
                      style={{
                        width: 0, height: 0,
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '4px solid #2a2b30',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expandable content */}
          {(enabled || onRequestUpdate) && children && (
            <div
              className="mt-[12px] rounded-[8px] p-[14px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Font Manager ─────────────────────────────────────────────────────────────

const GOOGLE_FONTS_CATALOG = [
  'Abril Fatface','Alegreya','Barlow','Bebas Neue','Bitter',
  'Cabin','Cairo','Crimson Text','Dancing Script','DM Sans',
  'Exo 2','Fira Sans','Fjalla One','Heebo','IBM Plex Sans',
  'Inter','Josefin Sans','Karla','Lato','Libre Baskerville',
  'Libre Franklin','Lora','Manrope','Merriweather','Montserrat',
  'Mulish','Nunito','Open Sans','Oswald','Outfit',
  'Playfair Display','Plus Jakarta Sans','Poppins','PT Sans',
  'Quicksand','Raleway','Roboto','Roboto Slab','Rubik',
  'Source Sans 3','Syne','Titillium Web','Ubuntu','Work Sans',
]

const _loadedFonts = new Set<string>()
function injectGoogleFont(name: string) {
  if (_loadedFonts.has(name)) return
  _loadedFonts.add(name)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@400;500;600&display=swap`
  document.head.appendChild(link)
}

interface FontManagerProps {
  selected: string[]
  onChange: (fonts: string[]) => void
}

function FontManager({ selected, onChange }: FontManagerProps) {
  const [open, setOpen] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null) // null = adding, number = replacing
  const [search, setSearch] = useState('')
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const addBtnRef = useRef<HTMLButtonElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // In edit mode exclude all selected except the one being replaced; in add mode exclude all selected
  const filtered = GOOGLE_FONTS_CATALOG.filter(f => {
    const excluded = editIdx !== null
      ? selected.filter((_, i) => i !== editIdx)
      : selected
    return !excluded.includes(f) && (!search.trim() || f.toLowerCase().includes(search.toLowerCase()))
  })

  useEffect(() => { filtered.slice(0, 24).forEach(injectGoogleFont) }, [search])
  useEffect(() => { selected.forEach(injectGoogleFont) }, [selected])

  const openDropdown = (anchor: HTMLElement, idx: number | null) => {
    const rect = anchor.getBoundingClientRect()
    setDropdownPos({ top: rect.bottom + 6, left: rect.left })
    setEditIdx(idx)
    setOpen(true)
    setSearch('')
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  const closeDropdown = () => { setOpen(false); setEditIdx(null); setSearch('') }

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      const isCard = cardRefs.current.some(r => r?.contains(target))
      if (!isCard && !addBtnRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectFont = (name: string) => {
    if (editIdx !== null) {
      const next = [...selected]
      next[editIdx] = name
      onChange(next)
    } else {
      onChange([...selected, name])
    }
    closeDropdown()
  }

  const isEditing = editIdx !== null

  const dropdown = open
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            zIndex: 9999,
            width: 264,
            background: '#1c1d21',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
            borderRadius: 10,
          }}
        >
          {/* Header */}
          <div style={{ padding: '8px 12px 4px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              {isEditing ? 'Replace font' : 'Add font'}
            </p>
          </div>
          {/* Search bar */}
          <div style={{ padding: '8px 8px 4px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(255,255,255,0.05)', borderRadius: 7,
              padding: '6px 10px', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 8L10.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Google Fonts…"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fafaf9', fontSize: 12, width: '100%' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Font list */}
          <div style={{ maxHeight: 228, overflowY: 'auto', padding: '4px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '20px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                No fonts found{search ? ` for "${search}"` : ''}
              </div>
            ) : filtered.map(name => {
              const isCurrent = editIdx !== null && selected[editIdx] === name
              return (
                <button
                  key={name}
                  onClick={() => selectFont(name)}
                  className="flex items-center gap-[10px] w-full px-[10px] py-[8px] rounded-[7px] cursor-pointer border-0 text-left"
                  style={{ background: isCurrent ? 'rgba(255,255,255,0.07)' : 'transparent', transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <span style={{ fontFamily: `'${name}', sans-serif`, fontSize: 15, fontWeight: 600, color: isCurrent ? '#fafaf9' : 'rgba(255,255,255,0.7)', width: 28, textAlign: 'center', flexShrink: 0 }}>Aa</span>
                  <span style={{ fontFamily: `'${name}', sans-serif`, fontSize: 12, fontWeight: 500, color: isCurrent ? '#fafaf9' : 'rgba(255,255,255,0.65)', flex: 1 }}>{name}</span>
                  {isCurrent
                    ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5 9.5L11 3.5" stroke="#0283ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}><path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  }
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '6px 12px 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: 0 }}>Powered by Google Fonts</p>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <div className="flex flex-wrap gap-[8px] items-center">
      {selected.map((name, idx) => {
        const isActiveEdit = open && editIdx === idx
        return (
          <div
            key={name}
            ref={el => { cardRefs.current[idx] = el }}
            onClick={() => openDropdown(cardRefs.current[idx]!, idx)}
            className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[8px] group/font cursor-pointer"
            style={{
              background: isActiveEdit ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActiveEdit ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
              position: 'relative',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { if (!isActiveEdit) { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)' } }}
            onMouseLeave={e => { if (!isActiveEdit) { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)' } }}
          >
            <span style={{ fontFamily: `'${name}', sans-serif`, fontSize: 15, fontWeight: 600, color: '#fafaf9', width: 24, textAlign: 'center', flexShrink: 0 }}>Aa</span>
            <div>
              <p style={{ fontFamily: `'${name}', sans-serif`, fontSize: 12, fontWeight: 500, color: '#fafaf9', lineHeight: '15px', margin: 0 }}>{name}</p>
              {idx === 0 && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>Organization default</p>}
            </div>
            {/* Edit pencil hint */}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
              className="opacity-0 group-hover/font:opacity-40 transition-opacity ml-[2px] shrink-0"
              style={{ color: '#fafaf9' }}
            >
              <path d="M1.5 7.5L5.5 3.5L7 5L3 9H1.5V7.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              <path d="M6 2.5L7.5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            {/* Remove button */}
            <button
              onClick={e => { e.stopPropagation(); onChange(selected.filter((_, i) => i !== idx)) }}
              className="opacity-0 group-hover/font:opacity-100 transition-opacity absolute -top-[5px] -right-[5px] flex items-center justify-center rounded-full cursor-pointer border-0"
              style={{ width: 14, height: 14, background: '#1a1b1e', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
            >
              <svg width="6" height="6" viewBox="0 0 7 7" fill="none">
                <path d="M1 1L6 6M6 1L1 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )
      })}

      {/* Add font button */}
      <button
        ref={addBtnRef}
        onClick={() => openDropdown(addBtnRef.current!, null)}
        className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] cursor-pointer border-0 text-[11px] font-medium"
        style={{
          background: (open && editIdx === null) ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.4)',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = (open && editIdx === null) ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)' }}
      >
        <PlusSmIcon />
        Add font
      </button>

      {dropdown}
    </div>
  )
}

// ─── Color palette editor ─────────────────────────────────────────────────────

function AddColorButton({ onAdd }: { onAdd: (color: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    const handleChange = () => onAdd(input.value)
    input.addEventListener('change', handleChange)
    return () => input.removeEventListener('change', handleChange)
  }, [onAdd])
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="color"
        defaultValue="#888888"
        className="sr-only"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer border-0 transition-colors"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1.5px dashed rgba(255,255,255,0.18)',
          color: 'rgba(255,255,255,0.4)',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLButtonElement).style.color = '#fafaf9'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.18)'
        }}
      >
        <PlusSmIcon />
      </button>
    </div>
  )
}

// ─── Color utilities ──────────────────────────────────────────────────────────

function hexToHsv(hex: string): [number, number, number] {
  const c = hex.replace('#', '').padEnd(6, '0')
  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return [h, max === 0 ? 0 : d / max, max]
}

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255)
      .toString(16).padStart(2, '0')
  }
  return `#${f(5)}${f(3)}${f(1)}`
}

function hueColor(h: number): string { return hsvToHex(h, 1, 1) }

// ─── Color Picker Popup ───────────────────────────────────────────────────────

function ColorPickerPopup({ color, onColorChange, onDelete, onClose, anchorRect }: {
  color: string
  onColorChange: (c: string) => void
  onDelete: () => void
  onClose: () => void
  anchorRect: DOMRect
}) {
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(color))
  const [hexInput, setHexInput] = useState(() => color.replace('#', '').toUpperCase())
  const [opacity, setOpacity] = useState(100)
  const gradRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const opRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'grad' | 'hue' | 'op' | null>(null)
  const hsvRef = useRef(hsv)
  hsvRef.current = hsv

  const [h, s, v] = hsv
  const currentHex = hsvToHex(h, s, v)

  const notify = (newH: number, newS: number, newV: number) => {
    const hex = hsvToHex(newH, newS, newV)
    setHexInput(hex.replace('#', '').toUpperCase())
    onColorChange(hex)
  }

  const applyGrad = (e: MouseEvent | React.MouseEvent) => {
    if (!gradRef.current) return
    const r = gradRef.current.getBoundingClientRect()
    const ns = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    const nv = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height))
    setHsv([hsvRef.current[0], ns, nv])
    notify(hsvRef.current[0], ns, nv)
  }
  const applyHue = (e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return
    const r = hueRef.current.getBoundingClientRect()
    const nh = Math.max(0, Math.min(360, (e.clientX - r.left) / r.width * 360))
    setHsv([nh, hsvRef.current[1], hsvRef.current[2]])
    notify(nh, hsvRef.current[1], hsvRef.current[2])
  }
  const applyOp = (e: MouseEvent | React.MouseEvent) => {
    if (!opRef.current) return
    const r = opRef.current.getBoundingClientRect()
    setOpacity(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100))
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current === 'grad') applyGrad(e)
      if (dragging.current === 'hue') applyHue(e)
      if (dragging.current === 'op') applyOp(e)
    }
    const onUp = () => { dragging.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  const handleHexInput = (val: string) => {
    setHexInput(val.toUpperCase())
    if (/^[0-9A-Fa-f]{6}$/.test(val)) {
      const newHsv = hexToHsv('#' + val)
      setHsv(newHsv)
      onColorChange('#' + val.toUpperCase())
    }
  }

  // Position: prefer below anchor, shift left if overflows right
  const PICKER_W = 236
  const top = anchorRect.bottom + 8
  let left = anchorRect.left
  if (left + PICKER_W > window.innerWidth - 8) left = window.innerWidth - PICKER_W - 8

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div
        className="fixed z-[61] rounded-[14px] overflow-hidden"
        style={{
          top, left, width: PICKER_W,
          background: '#1c1d22',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient area */}
        <div
          ref={gradRef}
          style={{
            width: '100%', height: 160, position: 'relative', cursor: 'crosshair',
            background: hueColor(h),
          }}
          onMouseDown={e => { dragging.current = 'grad'; applyGrad(e) }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff, transparent)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #000)' }} />
          <div style={{
            position: 'absolute',
            left: `${s * 100}%`, top: `${(1 - v) * 100}%`,
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid white',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            background: currentHex,
          }} />
        </div>

        <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Hue slider */}
          <div
            ref={hueRef}
            style={{
              height: 12, borderRadius: 6, cursor: 'pointer', position: 'relative',
              background: 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)',
            }}
            onMouseDown={e => { dragging.current = 'hue'; applyHue(e) }}
          >
            <div style={{
              position: 'absolute', top: '50%', left: `${h / 360 * 100}%`,
              transform: 'translate(-50%,-50%)',
              width: 16, height: 16, borderRadius: '50%',
              background: hueColor(h), border: '2px solid white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.5)', pointerEvents: 'none',
            }} />
          </div>

          {/* Opacity slider */}
          <div
            ref={opRef}
            style={{
              height: 12, borderRadius: 6, cursor: 'pointer', position: 'relative',
              background: `linear-gradient(to right,transparent,${currentHex}),repeating-conic-gradient(#555 0% 25%,#333 0% 50%) 0 0/8px 8px`,
            }}
            onMouseDown={e => { dragging.current = 'op'; applyOp(e) }}
          >
            <div style={{
              position: 'absolute', top: '50%', left: `${opacity}%`,
              transform: 'translate(-50%,-50%)',
              width: 16, height: 16, borderRadius: '50%',
              background: currentHex, border: '2px solid white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.5)', pointerEvents: 'none',
            }} />
          </div>

          {/* Hex + opacity inputs */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', fontFamily: 'inherit' }}>Hex</span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <path d="M2 3L4 5L6 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(255,255,255,0.06)', borderRadius: 7, padding: '6px 8px',
              }}>
                <input
                  value={`#${hexInput}`}
                  onChange={e => handleHexInput(e.target.value.replace('#', ''))}
                  maxLength={7}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#fafaf9', fontSize: 12, fontFamily: 'monospace', width: '100%',
                  }}
                />
              </div>
            </div>
            <div style={{ width: 64, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0)', fontFamily: 'inherit' }}>·</span>
              <div style={{
                display: 'flex', alignItems: 'center',
                background: 'rgba(255,255,255,0.06)', borderRadius: 7, padding: '6px 8px',
              }}>
                <input
                  value={opacity}
                  onChange={e => setOpacity(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  type="number" min={0} max={100}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#fafaf9', fontSize: 12, width: '100%', fontFamily: 'inherit',
                  }}
                />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>%</span>
              </div>
            </div>
          </div>

          {/* Delete color */}
          <button
            onClick={() => { onDelete(); onClose() }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              width: '100%', padding: '8px', borderRadius: 8, border: 'none',
              background: 'rgba(239,68,68,0.08)', color: '#f87171',
              fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.16)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 3H9.5M4 3V2H7V3M4.5 5V8.5M6.5 5V8.5M2 3L2.5 9.5H8.5L9 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Delete color
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}

// ─── Swatch row helper (shared across theme palette slots) ───────────────────

function SwatchRow({
  colors, onEdit, onRemove, onAdd, onSelect,
}: {
  colors: string[]
  onEdit: (i: number, color: string) => void
  onRemove: (i: number) => void
  onAdd: (color: string) => void
  onSelect?: (color: string | null) => void
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [editing, setEditing] = useState<{ idx: number; rect: DOMRect } | null>(null)

  const handleSelect = (i: number) => {
    const next = selectedIdx === i ? null : i
    setSelectedIdx(next)
    setEditing(null)
    onSelect?.(next !== null ? colors[next] : null)
  }

  return (
    <div className="flex items-center flex-wrap gap-[8px]">
      {colors.map((color, i) => {
        const isSelected = selectedIdx === i
        return (
        <div key={i} className="relative group/swatch">

          {/* Swatch */}
          <div
            className="w-[28px] h-[28px] rounded-[7px] cursor-pointer relative overflow-hidden"
            style={{
              background: color,
              border: isSelected ? '2px solid rgba(0,0,0,0.5)' : '2px solid rgba(255,255,255,0.15)',
              boxShadow: isSelected ? '0 0 0 2.5px #0283ff' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onClick={() => handleSelect(i)}
          >
            {/* Edit overlay — only visible on hover when swatch is selected */}
            {isSelected && (
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-150"
                onClick={e => {
                  e.stopPropagation()
                  const rect = (e.currentTarget.closest('.group\\/swatch') as HTMLElement).getBoundingClientRect()
                  setEditing(prev => prev?.idx === i ? null : { idx: i, rect })
                }}
              >
                <div
                  className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center shadow-sm"
                  style={{ background: '#ffffff' }}
                >
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M1.5 10.5H4L9.5 5L7 2.5L1.5 8V10.5Z" stroke="#222" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M7 2.5L9.5 5" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Hex tooltip — always shows on hover (selected or not) */}
          <div className="absolute bottom-[36px] left-1/2 -translate-x-1/2 hidden group-hover/swatch:flex flex-col items-center pointer-events-none z-20">
            <div
              className="px-[7px] py-[3px] rounded-[5px] whitespace-nowrap"
              style={{ background: '#2a2b2e', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            >
              <span className="text-[10px] font-semibold text-[#fafaf9] uppercase tracking-wide">{color}</span>
            </div>
            <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #2a2b2e' }} />
          </div>

          {/* Color picker popup */}
          {editing?.idx === i && (
            <ColorPickerPopup
              color={color}
              anchorRect={editing.rect}
              onColorChange={c => onEdit(i, c)}
              onDelete={() => { onRemove(i); setEditing(null); setSelectedIdx(null); onSelect?.(null) }}
              onClose={() => setEditing(null)}
            />
          )}
        </div>
        )
      })}
      {colors.length < 6 && <AddColorButton onAdd={onAdd} />}
    </div>
  )
}

// ─── Color Theme Editor ───────────────────────────────────────────────────────

interface ColorThemeEditorProps {
  themes: ColorTheme[]
  onChange: (themes: ColorTheme[]) => void
  onSwatchSelect?: (slot: 'primary' | 'secondary' | 'font', color: string | null) => void
}

const PALETTE_SLOTS = [
  { key: 'primary'   as const, label: 'Primary Colors'   },
  { key: 'secondary' as const, label: 'Secondary Colors' },
  { key: 'font'      as const, label: 'Font Colors'      },
]

function ColorThemeEditor({ themes, onChange, onSwatchSelect }: ColorThemeEditorProps) {
  const updateThemeName = (id: string, name: string) =>
    onChange(themes.map(t => (t.id === id ? { ...t, name } : t)))

  const editColor = (id: string, slot: 'primary' | 'secondary' | 'font', i: number, color: string) =>
    onChange(themes.map(t => t.id === id ? { ...t, [slot]: t[slot].map((c, ci) => ci === i ? color : c) } : t))

  const removeColor = (id: string, slot: 'primary' | 'secondary' | 'font', i: number) =>
    onChange(themes.map(t => t.id === id ? { ...t, [slot]: t[slot].filter((_, ci) => ci !== i) } : t))

  const addColor = (id: string, slot: 'primary' | 'secondary' | 'font', color: string) =>
    onChange(themes.map(t => t.id === id && t[slot].length < 6 ? { ...t, [slot]: [...t[slot], color] } : t))

  const removeTheme = (id: string) =>
    onChange(themes.filter(t => t.id !== id))

  const addTheme = () =>
    onChange([...themes, { id: `theme-${Date.now()}`, name: 'New Theme', primary: [], secondary: [], font: [] }])

  return (
    <div className="flex flex-col gap-[12px]">
      {themes.map(theme => (
        <div
          key={theme.id}
          className="rounded-[10px] overflow-hidden group/theme"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
        >
          {/* Theme header */}
          <div
            className="flex items-center justify-between gap-[8px] px-[14px] py-[10px]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-[5px] min-w-0">
              <input
                value={theme.name}
                onChange={e => updateThemeName(theme.id, e.target.value)}
                className="text-[12px] font-semibold bg-transparent border-0 outline-none p-0 cursor-text"
                style={{ color: '#fafaf9', width: `${Math.max(theme.name.length * 7.8 + 4, 80)}px` }}
              />
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none"
                className="opacity-0 group-hover/theme:opacity-60 transition-opacity shrink-0"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <path d="M1 6.5L5.5 2L7 3.5L2.5 8H1V6.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              </svg>
            </div>
            <button
              onClick={() => removeTheme(theme.id)}
              className="opacity-0 group-hover/theme:opacity-100 transition-opacity flex items-center gap-[4px] px-[6px] py-[3px] rounded-[5px] border-0 cursor-pointer text-[10px] font-medium shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)' }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Remove
            </button>
          </div>

          {/* Three fixed palette slots */}
          <div className="flex flex-col">
            {PALETTE_SLOTS.map(({ key, label }, idx) => (
              <div key={key} className="flex items-center gap-[12px] px-[14px] py-[10px]"
                style={idx > 0 ? { borderTop: '1px solid rgba(255,255,255,0.05)' } : undefined}>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide shrink-0 w-[110px]"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {label}
                </span>
                <SwatchRow
                  colors={theme[key]}
                  onEdit={(i, color) => editColor(theme.id, key, i, color)}
                  onRemove={i => removeColor(theme.id, key, i)}
                  onAdd={color => addColor(theme.id, key, color)}
                  onSelect={color => onSwatchSelect?.(key, color)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add theme */}
      <button
        onClick={addTheme}
        className="flex items-center gap-[6px] px-[10px] py-[8px] rounded-[8px] border-0 cursor-pointer text-[11px] font-medium transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
      >
        <PlusSmIcon />
        Add theme
      </button>
    </div>
  )
}

// ─── Theme preview ────────────────────────────────────────────────────────────

const PREVIEW_GRAPHICS = [
  { id: 'name-tag',     name: 'Name Tag'    },
  { id: 'lower-third',  name: 'Lower Third' },
  { id: 'score-board',  name: 'Score Board' },
]

function NameTagPreview({ primary, secondary, company }: { primary: string; secondary: string; company: string }) {
  return (
    <div style={{ width: 170, background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
      <div style={{ height: 5, background: primary }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#2a2b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: secondary }}>JS</span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>Jeff Smith</p>
          <p style={{ fontSize: 10, color: '#888', margin: '3px 0 0', lineHeight: 1.2 }}>Product Designer</p>
          <p style={{ fontSize: 10, fontWeight: 600, color: primary, margin: '3px 0 0', lineHeight: 1.2 }}>{company}</p>
        </div>
      </div>
    </div>
  )
}

function LowerThirdPreview({ primary, secondary, font, company }: { primary: string; secondary: string; font: string; company: string }) {
  return (
    <div style={{ width: 170 }}>
      <div style={{ background: primary, padding: '7px 12px 5px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: font, margin: 0, lineHeight: 1.2 }}>Jeff Smith</p>
      </div>
      <div style={{ background: 'rgba(20,21,24,0.92)', padding: '5px 12px 7px', borderLeft: `3px solid ${secondary}` }}>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.4 }}>Product Designer · {company}</p>
      </div>
    </div>
  )
}

function ScoreBoardPreview({ primary, secondary, font }: { primary: string; secondary: string; font: string }) {
  return (
    <div style={{ width: 170, background: 'rgba(20,21,24,0.95)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
      <div style={{ background: primary, padding: '5px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: font, letterSpacing: '0.06em' }}>LIVE</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: font }}>Q1 · 12:34</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '0 0 3px', fontWeight: 600, letterSpacing: '0.05em' }}>HOME</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>24</p>
        </div>
        <span style={{ fontSize: 12, color: secondary, fontWeight: 700 }}>VS</span>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '0 0 3px', fontWeight: 600, letterSpacing: '0.05em' }}>AWAY</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>17</p>
        </div>
      </div>
    </div>
  )
}

function ThemePreview({ themes, company, activeColors }: {
  themes: ColorTheme[]
  company: string
  activeColors?: { primary?: string | null; secondary?: string | null; font?: string | null }
}) {
  const [graphicIdx, setGraphicIdx] = useState(0)
  const [themeIdx, setThemeIdx] = useState(0)
  const safeThemeIdx = Math.min(themeIdx, Math.max(0, themes.length - 1))
  const theme = themes[safeThemeIdx]
  const primary   = activeColors?.primary   ?? theme?.primary[0]   ?? '#615fff'
  const secondary = activeColors?.secondary ?? theme?.secondary[0] ?? '#ffa726'
  const font      = activeColors?.font      ?? theme?.font[0]      ?? '#fafaf9'
  const graphic   = PREVIEW_GRAPHICS[graphicIdx]

  return (
    <div
      className="flex flex-col rounded-[10px] shrink-0"
      style={{ width: 216, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}
    >
      {/* Header */}
      <div className="px-[12px] pt-[10px] pb-[9px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-[7px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Preview</p>
        {/* Theme selector pills */}
        <div className="flex flex-wrap gap-[4px]">
          {themes.map((t, i) => {
            const isActive = i === safeThemeIdx
            const color = t.primary[0] ?? '#615fff'
            return (
              <button
                key={t.id}
                onClick={() => setThemeIdx(i)}
                className="border-0 cursor-pointer px-[8px] py-[3px] rounded-full text-[10px] font-medium transition-all duration-150 whitespace-nowrap"
                style={{
                  background: isActive ? `${color}22` : 'rgba(255,255,255,0.05)',
                  color: isActive ? color : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${isActive ? `${color}55` : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview area */}
      <div
        className="flex-1 flex items-center justify-center py-[22px] px-[14px]"
        style={{ background: '#141518', minHeight: 148 }}
      >
        {graphic.id === 'name-tag'    && <NameTagPreview    primary={primary} secondary={secondary} company={company} />}
        {graphic.id === 'lower-third' && <LowerThirdPreview primary={primary} secondary={secondary} font={font} company={company} />}
        {graphic.id === 'score-board' && <ScoreBoardPreview primary={primary} secondary={secondary} font={font} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-[8px] py-[8px]" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={() => setGraphicIdx(i => (i - 1 + PREVIEW_GRAPHICS.length) % PREVIEW_GRAPHICS.length)}
          className="flex items-center justify-center rounded-[6px] border-0 cursor-pointer"
          style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)' }}
        >
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M5 1.5L2 5L5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {graphic.name}
        </span>
        <button
          onClick={() => setGraphicIdx(i => (i + 1) % PREVIEW_GRAPHICS.length)}
          className="flex items-center justify-center rounded-[6px] border-0 cursor-pointer"
          style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)' }}
        >
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M2 1.5L5 5L2 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Font preview ─────────────────────────────────────────────────────────────

function NameTagFontPreview({ fontFamily, company }: { fontFamily: string; company: string }) {
  return (
    <div style={{ width: 170, background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
      <div style={{ height: 5, background: '#615fff' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#2a2b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#ffa726', fontFamily }}>JS</span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1.2, fontFamily }}>Jeff Smith</p>
          <p style={{ fontSize: 10, color: '#888', margin: '3px 0 0', lineHeight: 1.2, fontFamily }}>Product Designer</p>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#615fff', margin: '3px 0 0', lineHeight: 1.2, fontFamily }}>{company}</p>
        </div>
      </div>
    </div>
  )
}

function LowerThirdFontPreview({ fontFamily, company }: { fontFamily: string; company: string }) {
  return (
    <div style={{ width: 170 }}>
      <div style={{ background: '#615fff', padding: '7px 12px 5px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fafaf9', margin: 0, lineHeight: 1.2, fontFamily }}>Jeff Smith</p>
      </div>
      <div style={{ background: 'rgba(20,21,24,0.92)', padding: '5px 12px 7px', borderLeft: '3px solid #ffa726' }}>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.4, fontFamily }}>Product Designer · {company}</p>
      </div>
    </div>
  )
}

function ScoreBoardFontPreview({ fontFamily }: { fontFamily: string }) {
  return (
    <div style={{ width: 170, background: 'rgba(20,21,24,0.95)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
      <div style={{ background: '#615fff', padding: '5px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#fafaf9', letterSpacing: '0.06em', fontFamily }}>LIVE</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#fafaf9', fontFamily }}>Q1 · 12:34</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '0 0 3px', fontWeight: 600, letterSpacing: '0.05em', fontFamily }}>HOME</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1, fontFamily }}>24</p>
        </div>
        <span style={{ fontSize: 12, color: '#ffa726', fontWeight: 700, fontFamily }}>VS</span>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '0 0 3px', fontWeight: 600, letterSpacing: '0.05em', fontFamily }}>AWAY</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1, fontFamily }}>17</p>
        </div>
      </div>
    </div>
  )
}

function FontPreview({ fonts, company }: { fonts: string[]; company: string }) {
  const [graphicIdx, setGraphicIdx] = useState(0)
  const [fontIdx, setFontIdx] = useState(0)
  const safeFontIdx = Math.min(fontIdx, Math.max(0, fonts.length - 1))
  const fontName   = fonts[safeFontIdx] ?? 'Plus Jakarta Sans'
  const fontFamily = `'${fontName}', sans-serif`
  const graphic    = PREVIEW_GRAPHICS[graphicIdx]

  // Inject preview font
  useEffect(() => { fonts.forEach(injectGoogleFont) }, [fonts])

  return (
    <div
      className="flex flex-col rounded-[10px] shrink-0"
      style={{ width: 216, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}
    >
      {/* Header */}
      <div className="px-[12px] pt-[10px] pb-[9px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-[7px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Preview</p>
        {/* Font pills */}
        <div className="flex flex-wrap gap-[4px] mb-[5px]">
          {fonts.length === 0
            ? <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>No fonts added</span>
            : fonts.map((f, i) => {
                const isActive = i === safeFontIdx
                return (
                  <button
                    key={f}
                    onClick={() => setFontIdx(i)}
                    className="border-0 cursor-pointer px-[8px] py-[3px] rounded-full text-[10px] font-medium transition-all duration-150 whitespace-nowrap"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#fafaf9' : 'rgba(255,255,255,0.4)',
                      border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                      fontFamily: `'${f}', sans-serif`,
                    }}
                  >
                    {f}
                  </button>
                )
              })
          }
        </div>
      </div>

      {/* Preview area */}
      <div
        className="flex-1 flex items-center justify-center py-[22px] px-[14px]"
        style={{ background: '#141518', minHeight: 148 }}
      >
        {fonts.length === 0
          ? <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>Add a font to preview</p>
          : graphic.id === 'name-tag'    ? <NameTagFontPreview    fontFamily={fontFamily} company={company} />
          : graphic.id === 'lower-third' ? <LowerThirdFontPreview fontFamily={fontFamily} company={company} />
          : <ScoreBoardFontPreview fontFamily={fontFamily} />
        }
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-[8px] py-[8px]" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={() => setGraphicIdx(i => (i - 1 + PREVIEW_GRAPHICS.length) % PREVIEW_GRAPHICS.length)}
          className="flex items-center justify-center rounded-[6px] border-0 cursor-pointer"
          style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)' }}
        >
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M5 1.5L2 5L5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{graphic.name}</span>
        <button
          onClick={() => setGraphicIdx(i => (i + 1) % PREVIEW_GRAPHICS.length)}
          className="flex items-center justify-center rounded-[6px] border-0 cursor-pointer"
          style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)' }}
        >
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M2 1.5L5 5L2 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Enterprise Branding Guidelines ──────────────────────────────────────────

function EnterpriseBrandingGuidelines({ themes, fonts }: { themes: ColorTheme[]; fonts: string[] }) {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="flex flex-col gap-[16px] pt-[24px]">

      {/* Managed services notice */}
      <div
        className="flex items-center gap-[16px] px-[18px] py-[14px] rounded-[10px]"
        style={{ background: 'rgba(97,95,255,0.07)', border: '1px solid rgba(97,95,255,0.18)' }}
      >
        <div
          className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: 'rgba(97,95,255,0.14)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L3 5V9.5C3 13 5.8 16.1 9 17C12.2 16.1 15 13 15 9.5V5L9 2Z" stroke="#a5a3ff" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M6.5 9L8 10.5L11.5 7" stroke="#a5a3ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[13px] text-[#fafaf9] mb-[3px]">Managed by Enterprise Services</p>
          <p className="text-[12px] leading-[17px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            All branding is configured and maintained by your dedicated Breezy Enterprise Services team. Contact your representative to request any changes.
          </p>
        </div>
        <button
          onClick={() => setContactOpen(true)}
          className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[8px] border-0 cursor-pointer text-[12px] font-medium shrink-0 transition-colors"
          style={{ background: 'rgba(97,95,255,0.15)', color: '#c4c3ff', border: '1px solid rgba(97,95,255,0.28)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(97,95,255,0.26)'; e.currentTarget.style.color = '#e0dfff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(97,95,255,0.15)'; e.currentTarget.style.color = '#c4c3ff' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 6H10.5M7 2.5L10.5 6L7 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Contact Representative
        </button>
      </div>

      {/* Main content: brand assets + preview */}
      <div className="flex gap-[16px] items-start">

        {/* Left: read-only brand asset overview */}
        <div className="flex-1 min-w-0 flex flex-col gap-[10px]">

          {/* Brand Colors */}
          <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-[8px] px-[16px] py-[11px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                <circle cx="4" cy="6.5" r="1.5" fill="rgba(255,255,255,0.35)" />
                <circle cx="6.5" cy="4" r="1.5" fill="rgba(255,255,255,0.35)" />
                <circle cx="9" cy="6.5" r="1.5" fill="rgba(255,255,255,0.35)" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>Brand Colors</span>
              <div className="ml-auto flex items-center gap-[5px] px-[8px] py-[3px] rounded-[5px]" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <div className="w-[4px] h-[4px] rounded-full" style={{ background: '#4ade80' }} />
                <span className="text-[10px] font-medium" style={{ color: '#4ade80' }}>Active</span>
              </div>
            </div>
            <div className="flex flex-col">
              {themes.map((theme, ti) => (
                <div key={theme.id} className="px-[16px] py-[12px]" style={ti > 0 ? { borderTop: '1px solid rgba(255,255,255,0.04)' } : undefined}>
                  <p className="text-[12px] font-semibold text-[#fafaf9] mb-[10px]">{theme.name}</p>
                  <div className="flex flex-col gap-[7px]">
                    {[
                      { label: 'Primary',   colors: theme.primary   },
                      { label: 'Secondary', colors: theme.secondary },
                      { label: 'Font',      colors: theme.font      },
                    ].map(({ label, colors }) => (
                      <div key={label} className="flex items-center gap-[10px]">
                        <span className="text-[10px] font-semibold uppercase tracking-wide shrink-0 w-[64px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                        <div className="flex gap-[5px] flex-wrap">
                          {colors.length > 0
                            ? colors.map((c, i) => (
                                <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: c, border: '1.5px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                              ))
                            : <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-[8px] px-[16px] py-[11px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 3.5H10.5M6.5 3.5V9.5M4.5 9.5H8.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>Typography</span>
              <div className="ml-auto flex items-center gap-[5px] px-[8px] py-[3px] rounded-[5px]" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <div className="w-[4px] h-[4px] rounded-full" style={{ background: '#4ade80' }} />
                <span className="text-[10px] font-medium" style={{ color: '#4ade80' }}>Active</span>
              </div>
            </div>
            <div className="px-[16px] py-[14px] flex flex-wrap gap-[8px]">
              {fonts.length > 0
                ? fonts.map(font => (
                    <div key={font} className="flex items-center gap-[9px] px-[12px] py-[8px] rounded-[8px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <span style={{ fontFamily: `'${font}', sans-serif`, fontSize: 15, color: '#fafaf9', lineHeight: 1 }}>Aa</span>
                      <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{font}</span>
                    </div>
                  ))
                : <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.25)' }}>No fonts configured</span>
              }
            </div>
          </div>

          {/* Organization Logo */}
          <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-[8px] px-[16px] py-[11px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="1.5" y="3.5" width="10" height="6" rx="1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                <path d="M4.5 6.5H8.5M6.5 4.5V8.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>Organization Logo</span>
              <div className="ml-auto flex items-center gap-[5px] px-[8px] py-[3px] rounded-[5px]" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <div className="w-[4px] h-[4px] rounded-full" style={{ background: '#4ade80' }} />
                <span className="text-[10px] font-medium" style={{ color: '#4ade80' }}>Active</span>
              </div>
            </div>
            <div className="px-[16px] py-[14px] flex items-center gap-[12px]">
              <div className="w-[44px] h-[28px] rounded-[7px] flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
                  <rect x="1" y="1" width="20" height="12" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                  <circle cx="7" cy="7" r="2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                  <path d="M13 5H18M13 9H16" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#fafaf9]">Breezy Corp logo</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Applied across all graphic templates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <ThemePreview themes={themes} company="Breezy Corp" />
      </div>

      {contactOpen && <ContactServicesModal onClose={() => setContactOpen(false)} />}
    </div>
  )
}

// ─── Image uploader ───────────────────────────────────────────────────────────

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
  label: string
  hint?: string
}

function ImageUploader({ value, onChange, label, hint }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onChange(URL.createObjectURL(file))
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      {value ? (
        <div className="flex items-center gap-[14px]">
          <div
            className="w-[72px] h-[44px] rounded-[8px] flex items-center justify-center overflow-hidden shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <img src={value} alt="" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex flex-col gap-[5px]">
            <button
              onClick={() => inputRef.current?.click()}
              className="text-[12px] font-medium cursor-pointer border-0 bg-transparent p-0 text-left"
              style={{ color: '#0283ff' }}
            >
              Replace image
            </button>
            <button
              onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = '' }}
              className="text-[12px] font-medium cursor-pointer border-0 bg-transparent p-0 text-left"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-[8px] py-[18px] rounded-[8px] cursor-pointer border-0 transition-colors"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(255,255,255,0.12)' }}
          onMouseEnter={e => { ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="7" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M2 14.5L6.5 10L9.5 13L13 9L18 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-center">
            <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
            {hint && <p className="text-[11px] mt-[2px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{hint}</p>}
          </div>
        </button>
      )}
    </div>
  )
}

// ─── URL input ────────────────────────────────────────────────────────────────

function UrlInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div
      className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px]"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
        <path d="M5.5 8.5L7.5 6.5M7 3.5L8 2.5C9.1 1.4 10.9 1.4 12 2.5C13.1 3.6 13.1 5.4 12 6.5L11 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M6 9.5L5 10.5C3.9 11.6 2.1 11.6 1 10.5C-0.1 9.4 -0.1 7.6 1 6.5L2 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <input
        type="url"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'https://'}
        className="flex-1 bg-transparent border-0 outline-none text-[12px] font-medium"
        style={{ color: value ? '#fafaf9' : undefined }}
      />
    </div>
  )
}

// ─── PDF uploader ─────────────────────────────────────────────────────────────

function PdfUploader({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onChange(file.name)
  }
  return (
    <div>
      <input ref={inputRef} type="file" accept="application/pdf" className="sr-only" onChange={handleFile} />
      {value ? (
        <div
          className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(2,131,255,0.1)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#0283ff' }}>
              <path d="M3 1.5H8.5L11.5 4.5V12.5H3V1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M8.5 1.5V4.5H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M5 7H9M5 9H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="flex-1 text-[12px] font-medium text-[#fafaf9] truncate">{value}</p>
          <div className="flex items-center gap-[10px]">
            <button
              onClick={() => inputRef.current?.click()}
              className="text-[11px] font-medium border-0 bg-transparent cursor-pointer p-0"
              style={{ color: '#0283ff' }}
            >
              Replace
            </button>
            <button
              onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = '' }}
              className="text-[11px] font-medium border-0 bg-transparent cursor-pointer p-0"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-[8px] py-[18px] rounded-[8px] cursor-pointer border-0 transition-colors"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(255,255,255,0.12)' }}
          onMouseEnter={e => { ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <path d="M4 2H13L17 6V18H4V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M13 2V6H17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 10H13M7 13H10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <div className="text-center">
            <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Upload PDF</p>
            <p className="text-[11px] mt-[2px]" style={{ color: 'rgba(255,255,255,0.28)' }}>PDF files only · Max 50MB</p>
          </div>
        </button>
      )}
    </div>
  )
}

// ─── External source types ────────────────────────────────────────────────────

type ExternalSourceType = 'link' | 'image' | 'video' | 'pdf' | 'slides'

const EXTERNAL_SOURCE_TYPES: { id: ExternalSourceType; label: string; Icon: () => React.ReactElement }[] = [
  {
    id: 'link', label: 'Link',
    Icon: () => (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4.5 7.5L7.5 4.5M7 2.5L7.5 2C8.33 1.17 9.67 1.17 10.5 2C11.33 2.83 11.33 4.17 10.5 5L10 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M5 9.5L4.5 10C3.67 10.83 2.33 10.83 1.5 10C0.67 9.17 0.67 7.83 1.5 7L2 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'image', label: 'Image',
    Icon: () => (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="4" cy="5.5" r="1" fill="currentColor" />
        <path d="M1 8.5L3.5 6.5L5 8L7 5.5L11 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'video', label: 'Video',
    Icon: () => (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1.5 3.5H7.5V8.5H1.5V3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M7.5 5L10.5 3.5V8.5L7.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'pdf', label: 'PDF',
    Icon: () => (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 1H7.5L10 3.5V11H2.5V1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M7.5 1V3.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M4.5 6.5H7.5M4.5 8H6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'slides', label: 'Slides',
    Icon: () => (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="1.5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4 10.5H8M6 8.5V10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
]

// ─── WorkspacePage ────────────────────────────────────────────────────────────

interface GraphicState {
  [key: string]: boolean
}

interface BrandingState {
  colorLock: boolean
  fontLock: boolean
  logoLock: boolean
  customGraphics: boolean
}

export default function WorkspacePage({ plan = 'enterprise' }: { plan?: Plan }) {
  const [activeTab, setActiveTab] = useState<'graphics' | 'branding'>('graphics')
  const ALL_GRAPHICS = plan === 'enterprise'
    ? GRAPHICS
    : GRAPHICS.map(g => g.badge === 'enterprise' ? { ...g, badge: 'custom' as Badge } : g)

  // Reset filter when plan changes so stale 'enterprise'/'custom' tab doesn't persist
  useEffect(() => { setGraphicFilter('all') }, [plan])

  const [graphics, setGraphics] = useState<GraphicState>({
    logo: true, ticker: true, timer: true, agenda: true,
    qa: true, poll: false, external: false, 'waiting-room': true,
    nametag: true, 'social-feed': true,
    'lower-third': true, scoreboard: false, 'sponsor-banner': false,
  })

  const [branding, setBranding] = useState<BrandingState>({
    colorLock: true,
    fontLock: true,
    logoLock: true,
    customGraphics: true,
  })

  const [logoFile, setLogoFile] = useState<string | null>(null)
  const [externalContentType, setExternalContentType] = useState<ExternalSourceType>('link')
  const [externalLinkUrl, setExternalLinkUrl] = useState('')
  const [externalVideoUrl, setExternalVideoUrl] = useState('')
  const [externalSlidesUrl, setExternalSlidesUrl] = useState('')
  const [externalContentImageFile, setExternalContentImageFile] = useState<string | null>(null)
  const [externalContentPdfName, setExternalContentPdfName] = useState<string | null>(null)
  const [waitingRoomBackground, setWaitingRoomBackground] = useState<string | null>(null)

  const [graphicFilter, setGraphicFilter] = useState<'all' | Badge>('all')
  const [graphicSearch, setGraphicSearch] = useState('')
  const [graphicView, setGraphicView] = useState<'list' | 'card'>('list')

  const [graphicPermissions, setGraphicPermissions] = useState<GraphicPermissionMap>(() =>
    Object.fromEntries(GRAPHICS.map(g => [g.id, { ...DEFAULT_ROLE_PERMISSIONS }]))
  )

  const updateGraphicPermission = (graphicId: string, role: string, key: PermissionKey, value: boolean) => {
    setGraphicPermissions(prev => ({
      ...prev,
      [graphicId]: {
        ...prev[graphicId],
        [role]: { ...prev[graphicId][role], [key]: value },
      },
    }))
    setDirty(true)
    setSaved(false)
  }

  const [brandThemes, setBrandThemes] = useState<ColorTheme[]>(BRAND_THEMES_DEFAULT)
  const [selectedFonts, setSelectedFonts] = useState<string[]>(['Plus Jakarta Sans'])
  const [socialPlatforms, setSocialPlatforms] = useState<Record<string, boolean>>({
    x: true, instagram: true, google: false, threads: false, bluesky: false,
  })
  const [platformsOpen, setPlatformsOpen] = useState(false)

  const toggleSocialPlatform = (id: string) => {
    setSocialPlatforms(prev => ({ ...prev, [id]: !prev[id] }))
    setDirty(true)
    setSaved(false)
  }
  const [dirty, setDirty] = useState(false)
  const [activeSwatchColors, setActiveSwatchColors] = useState<{
    primary?: string | null; secondary?: string | null; font?: string | null
  }>({})
  const [saved, setSaved] = useState(false)

  const graphicsRef = useRef<HTMLDivElement>(null)
  const brandingRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)


  const toggleGraphic = (id: string) => {
    setGraphics(prev => ({ ...prev, [id]: !prev[id] }))
    setDirty(true)
    setSaved(false)
  }

  const toggleBranding = (key: keyof BrandingState) => {
    setBranding(prev => ({ ...prev, [key]: !prev[key] }))
    setDirty(true)
    setSaved(false)
  }

  const handleSave = () => {
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const enabledCount = Object.values(graphics).filter(Boolean).length

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0a0b0d' }}>

      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between shrink-0 h-[64px] px-[28px]"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-[14px]">
          <h1 className="font-semibold text-[18px] text-[#fafaf9] leading-[22px]">
            Workspace
          </h1>
          {activeTab === 'graphics' && <>
            <div className="w-px h-[16px]" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {enabledCount} of {ALL_GRAPHICS.length} graphics enabled
            </span>
          </>}
        </div>

        <div className="flex items-center gap-[10px]">
          {saved && (
            <div className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px]" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
              <CheckIcon />
              <span className="text-[12px] font-medium">Saved</span>
            </div>
          )}
          {dirty && (
            <button
              onClick={() => setDirty(false)}
              className="flex items-center gap-[6px] h-[36px] px-[16px] rounded-[8px] cursor-pointer border-0 font-semibold text-[13px] transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)' }}
            >
              Discard
            </button>
          )}
          <button
            onClick={dirty ? handleSave : undefined}
            className="flex items-center gap-[6px] h-[36px] px-[16px] rounded-[8px] cursor-pointer border-0 font-semibold text-[13px] transition-all"
            style={{
              background: dirty ? '#0283ff' : 'rgba(255,255,255,0.06)',
              color: dirty ? '#ffffff' : 'rgba(255,255,255,0.3)',
              cursor: dirty ? 'pointer' : 'default',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Tab strip ── */}
      <div
        className="flex items-center gap-[4px] shrink-0 px-[28px]"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', height: 44 }}
      >
        {([
          { id: 'graphics' as const, label: 'Graphics Library' },
          { id: 'branding' as const, label: 'Branding Guidelines' },
        ]).map(({ id, label }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); scrollRef.current?.scrollTo({ top: 0 }) }}
              className="relative flex items-center h-full px-[14px] text-[13px] font-medium cursor-pointer border-0 bg-transparent transition-colors"
              style={{ color: isActive ? '#fafaf9' : 'rgba(255,255,255,0.45)' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
            >
              {label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                  style={{ background: '#615fff' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Scrollable content ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide min-h-0 px-[40px] pb-[24px]">
        <div className="max-w-[860px] mx-auto flex flex-col gap-[28px]">

          {/* ── Section 1: Graphics Library ── */}
          {activeTab === 'graphics' && <div ref={graphicsRef}>
            <div className="flex items-start justify-between mb-[14px] pt-[24px]">
              <div>
                <h2 className="font-semibold text-[15px] text-[#fafaf9] mb-[4px]">
                  Graphics Library
                </h2>
                <p className="text-[13px] leading-[18px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Control which graphic types are available to your organization's users during meetings.
                  Disabled graphics will not appear as options for any user.
                </p>
              </div>
              {/* Quick-actions */}
              <div className="flex items-center gap-[6px] shrink-0 ml-[20px]">
                <button
                  onClick={() => { setGraphics(Object.fromEntries(ALL_GRAPHICS.map(g => [g.id, true]))); setDirty(true) }}
                  className="text-[12px] font-medium px-[10px] py-[5px] rounded-[6px] cursor-pointer border-0 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  Enable all
                </button>
                <button
                  onClick={() => { setGraphics(Object.fromEntries(ALL_GRAPHICS.map(g => [g.id, false]))); setDirty(true) }}
                  className="text-[12px] font-medium px-[10px] py-[5px] rounded-[6px] cursor-pointer border-0 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  Disable all
                </button>
              </div>
            </div>

            {/* Search + filter tabs + view toggle */}
            <div className="flex items-center gap-[8px] sticky top-0 z-10" style={{ background: '#0a0b0d', paddingTop: 10, paddingBottom: 10, marginBottom: 2 }}>
              <div className="relative flex items-center flex-1">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="absolute left-[9px] pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M9 9L11.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={graphicSearch}
                  onChange={e => setGraphicSearch(e.target.value)}
                  placeholder="Search graphics…"
                  className="w-full text-[12px] pl-[28px] pr-[10px] rounded-[8px] border-0 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#fafaf9', height: 34 }}
                />
              </div>
              <div className="flex gap-[2px] p-[3px] rounded-[8px] shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {(['all', 'default', plan === 'enterprise' ? 'enterprise' : 'custom'] as ('all' | Badge)[]).map(tab => {
                  const count = tab === 'all' ? ALL_GRAPHICS.length : ALL_GRAPHICS.filter(g => g.badge === tab).length
                  return (
                    <button
                      key={tab}
                      onClick={() => setGraphicFilter(tab as typeof graphicFilter)}
                      className="flex items-center gap-[5px] text-[12px] font-medium px-[12px] py-[5px] rounded-[6px] capitalize cursor-pointer border-0 transition-all"
                      style={graphicFilter === tab
                        ? { background: 'rgba(255,255,255,0.1)', color: '#fafaf9' }
                        : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }}
                    >
                      {tab === 'enterprise' ? 'Custom' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      <span
                        className="text-[10px] font-semibold px-[5px] py-[1px] rounded-full"
                        style={{
                          background: graphicFilter === tab ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
                          color: graphicFilter === tab ? '#fafaf9' : 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-[2px] p-[3px] rounded-[8px] shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {(['list', 'card'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setGraphicView(v)}
                    className="flex items-center justify-center rounded-[6px] border-0 cursor-pointer transition-all"
                    style={{
                      width: 28, height: 28,
                      background: graphicView === v ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: graphicView === v ? '#fafaf9' : 'rgba(255,255,255,0.4)',
                    }}
                    title={v === 'list' ? 'List view' : 'Card view'}
                  >
                    {v === 'list'
                      ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 3h11M1 6.5h11M1 10h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                      : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="7.5" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="1" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg>
                    }
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const filtered = ALL_GRAPHICS
                .filter(g => graphicFilter === 'all' || g.badge === graphicFilter)
                .filter(g => !graphicSearch.trim() || g.name.toLowerCase().includes(graphicSearch.toLowerCase()))

              if (filtered.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-[48px] rounded-[12px]" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ color: 'rgba(255,255,255,0.2)' }} className="mb-[12px]">
                      <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M21 21L28 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M11 14h6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <p className="text-[13px] font-medium mb-[4px]" style={{ color: 'rgba(255,255,255,0.45)' }}>No graphics found</p>
                    <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      No results for <span style={{ color: 'rgba(255,255,255,0.5)' }}>"{graphicSearch}"</span>
                    </p>
                  </div>
                )
              }

              if (graphicView === 'card') {
                return (
                  <div className="grid gap-[12px]" style={{ gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'start' }}>
                    {filtered.map(graphic => (
                      <GraphicCard
                        key={graphic.id}
                        graphic={graphic}
                        enabled={!!graphics[graphic.id]}
                        onToggle={() => toggleGraphic(graphic.id)}
                        permissions={graphicPermissions[graphic.id] ?? DEFAULT_ROLE_PERMISSIONS}
                        onPermissionChange={(role, key, value) => updateGraphicPermission(graphic.id, role, key, value)}
                      />
                    ))}
                  </div>
                )
              }

              return (
            <SectionCard>
              {filtered.map((graphic, i, arr) => (
                <GraphicRow
                  key={graphic.id}
                  graphic={graphic}
                  enabled={!!graphics[graphic.id]}
                  onToggle={() => toggleGraphic(graphic.id)}
                  isLast={i === arr.length - 1}
                  permissions={graphicPermissions[graphic.id] ?? DEFAULT_ROLE_PERMISSIONS}
                  onPermissionChange={(role, key, value) => updateGraphicPermission(graphic.id, role, key, value)}
                >
                  {graphic.id === 'social-feed' && (
                    <div
                      className="rounded-[8px]"
                      style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                    >
                      <button
                        onClick={() => setPlatformsOpen(v => !v)}
                        className="flex items-center justify-between w-full px-[14px] pt-[10px] pb-[10px] cursor-pointer border-0 bg-transparent text-left"
                        style={{ borderBottom: platformsOpen ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          Platforms
                        </span>
                        <svg
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                          style={{ color: 'rgba(255,255,255,0.3)', transform: platformsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                        >
                          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {platformsOpen && SOCIAL_PLATFORMS.map((platform, pi) => {
                        const isOn = !!socialPlatforms[platform.id]
                        return (
                          <div
                            key={platform.id}
                            className="flex items-center gap-[10px] px-[14px] py-[9px]"
                            style={{
                              borderBottom: pi < SOCIAL_PLATFORMS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            }}
                          >
                            <span style={{ color: isOn ? platform.color : 'rgba(255,255,255,0.3)', transition: 'color 0.15s' }}>
                              <platform.Icon />
                            </span>
                            <span
                              className="flex-1 text-[12px] font-medium leading-[15px]"
                              style={{ color: isOn ? '#fafaf9' : 'rgba(255,255,255,0.4)', transition: 'color 0.15s' }}
                            >
                              {platform.name}
                            </span>
                            <div className="relative flex items-center shrink-0 group/ptoggle">
                              <Toggle on={isOn} onChange={() => toggleSocialPlatform(platform.id)} size="sm" />
                              <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[6px] px-[7px] py-[3px] rounded-[5px] whitespace-nowrap pointer-events-none opacity-0 group-hover/ptoggle:opacity-100 transition-opacity duration-150 z-20"
                                style={{
                                  background: '#2a2b30',
                                  border: '1px solid rgba(255,255,255,0.09)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                }}
                              >
                                <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {isOn ? 'Visible' : 'Hidden'}
                                </span>
                                <div
                                  className="absolute top-full left-1/2 -translate-x-1/2"
                                  style={{
                                    width: 0, height: 0,
                                    borderLeft: '4px solid transparent',
                                    borderRight: '4px solid transparent',
                                    borderTop: '4px solid #2a2b30',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {graphic.id === 'external' && (
                    <div className="flex flex-col gap-[10px]">
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Default Source
                      </p>
                      <div className="flex gap-[2px] p-[3px] rounded-[8px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {EXTERNAL_SOURCE_TYPES.map(type => (
                          <button
                            key={type.id}
                            onClick={() => { setExternalContentType(type.id); setDirty(true) }}
                            className="flex-1 flex items-center justify-center gap-[4px] py-[5px] rounded-[6px] text-[11px] font-medium transition-all border-0 cursor-pointer"
                            style={externalContentType === type.id
                              ? { background: 'rgba(255,255,255,0.1)', color: '#fafaf9' }
                              : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }
                            }
                          >
                            <type.Icon />
                            {type.label}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: externalContentType === 'link' ? 'block' : 'none' }}>
                        <UrlInput value={externalLinkUrl} onChange={v => { setExternalLinkUrl(v); setDirty(true) }} placeholder="https://example.com/embed" />
                      </div>
                      <div style={{ display: externalContentType === 'image' ? 'block' : 'none' }}>
                        <ImageUploader value={externalContentImageFile} onChange={v => { setExternalContentImageFile(v); setDirty(true) }} label="Upload image" hint="PNG, JPG or GIF" />
                      </div>
                      <div style={{ display: externalContentType === 'video' ? 'block' : 'none' }}>
                        <UrlInput value={externalVideoUrl} onChange={v => { setExternalVideoUrl(v); setDirty(true) }} placeholder="YouTube or Vimeo URL" />
                      </div>
                      <div style={{ display: externalContentType === 'pdf' ? 'block' : 'none' }}>
                        <PdfUploader value={externalContentPdfName} onChange={v => { setExternalContentPdfName(v); setDirty(true) }} />
                      </div>
                      <div style={{ display: externalContentType === 'slides' ? 'block' : 'none' }}>
                        <UrlInput value={externalSlidesUrl} onChange={v => { setExternalSlidesUrl(v); setDirty(true) }} placeholder="Google Slides share link" />
                      </div>
                    </div>
                  )}
                  {graphic.id === 'waiting-room' && (
                    <div className="flex flex-col gap-[8px]">
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Background Image
                      </p>
                      <ImageUploader
                        value={waitingRoomBackground}
                        onChange={v => { setWaitingRoomBackground(v); setDirty(true) }}
                        label="Upload background image"
                        hint="PNG, JPG or GIF · Recommended 1920×1080"
                      />
                    </div>
                  )}
                </GraphicRow>
              ))}
            </SectionCard>
              )
            })()}
          </div>}

          {/* ── Section 2: Branding Constraints ── */}
          {activeTab === 'branding' && <div ref={brandingRef}>
            {plan === 'enterprise' ? (
              <EnterpriseBrandingGuidelines themes={brandThemes} fonts={selectedFonts} />
            ) : (
              <>
                <div className="mb-[14px] pt-[24px]">
                  <h2 className="font-semibold text-[15px] text-[#fafaf9] mb-[4px]">
                    Branding Guidelines
                  </h2>
                  <p className="text-[13px] leading-[18px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Enforce brand consistency across all meeting graphics. These settings apply
                    organization-wide and override individual user preferences.
                  </p>
                </div>

                <SectionCard>
                  {/* Color Palette Lock */}
                  <ConstraintRow
                    title="Color Palette Lock"
                    description="Restrict users to organization-approved brand colors only. Users cannot set custom colors outside this palette."
                    enabled={branding.colorLock}
                    onToggle={() => toggleBranding('colorLock')}
                    isLast={false}
                  >
                    <div className="flex gap-[14px] items-start">
                      <div className="flex-1 min-w-0">
                        <ColorThemeEditor
                          themes={brandThemes}
                          onChange={t => { setBrandThemes(t); setDirty(true) }}
                          onSwatchSelect={(slot, color) => setActiveSwatchColors(prev => ({ ...prev, [slot]: color }))}
                        />
                      </div>
                      <ThemePreview themes={brandThemes} company="Loom" activeColors={activeSwatchColors} />
                    </div>
                  </ConstraintRow>

                  {/* Font Override Lock */}
                  <ConstraintRow
                    title="Font Override Lock"
                    description="Prevent users from changing the default organization typeface in graphic templates."
                    enabled={branding.fontLock}
                    onToggle={() => toggleBranding('fontLock')}
                    isLast={false}
                  >
                    <div className="flex gap-[14px] items-start">
                      <div className="flex-1 min-w-0">
                        <FontManager
                          selected={selectedFonts}
                          onChange={f => { setSelectedFonts(f); setDirty(true) }}
                        />
                      </div>
                      <FontPreview fonts={selectedFonts} company="Loom" />
                    </div>
                  </ConstraintRow>

                  {/* Logo Lock */}
                  <ConstraintRow
                    title="Logo Lock"
                    description="Set the approved organization logo. This logo is used across all graphic templates and cannot be changed by users."
                    enabled={branding.logoLock}
                    onToggle={() => toggleBranding('logoLock')}
                    isLast={false}
                  >
                    <ImageUploader
                      value={logoFile}
                      onChange={v => { setLogoFile(v); setDirty(true) }}
                      label="Upload organization logo"
                      hint="PNG, SVG or JPG · Displayed at original aspect ratio"
                    />
                  </ConstraintRow>

                  {/* Custom Team Graphics */}
                  <ConstraintRow
                    title="Custom Team Graphics"
                    description="Allow users to access and activate team-tier custom graphic templates created for your organization."
                    enabled={branding.customGraphics}
                    onToggle={() => toggleBranding('customGraphics')}
                    isLast={true}
                  >
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: '#4ade80' }} />
                      <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <span className="text-[#fafaf9] font-medium">3 custom templates</span> available for this workspace —
                        users will see them in their graphic panel.
                      </p>
                    </div>
                  </ConstraintRow>
                </SectionCard>
              </>
            )}
          </div>}

          {/* Bottom spacing */}
          <div className="h-[8px]" />
        </div>
      </div>
    </div>
  )
}
