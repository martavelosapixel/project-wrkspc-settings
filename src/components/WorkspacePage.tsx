import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type GraphicId = 'logo' | 'ticker' | 'timer' | 'agenda' | 'qa' | 'poll' | 'external' | 'waiting-room'
type Badge = 'default' | 'enterprise'

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

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2" y="6.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 6.5V4.5C4.5 3.12 5.62 2 7 2H8C9.38 2 10.5 3.12 10.5 4.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
    </svg>
  )
}

function FontIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 12L5.5 3H6.5L10 12M3.5 9H8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 6V12M11.5 6C11.5 5 12 4.5 13 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.5 9C11.5 9 12 10 13 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5L9.18 5.33L13.5 5.81L10.5 8.64L11.36 13L7.5 10.84L3.64 13L4.5 8.64L1.5 5.81L5.82 5.33L7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
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
  { id: 'logo',         name: 'Logo',             description: 'Display your organization logo as a branded meeting overlay',   badge: 'default',    Icon: LogoIcon        },
  { id: 'ticker',       name: 'Ticker',            description: 'Scrolling text banner for live announcements and news feeds',   badge: 'default',    Icon: TickerIcon      },
  { id: 'timer',        name: 'Timer',             description: 'Countdown or elapsed time display visible to all participants', badge: 'default',    Icon: TimerIcon       },
  { id: 'agenda',       name: 'Agenda',            description: 'Structured meeting agenda shown alongside the video feed',      badge: 'default',    Icon: AgendaIcon      },
  { id: 'qa',           name: 'Q&A',               description: 'Interactive Q&A panel to collect and display audience questions', badge: 'default',  Icon: QAIcon          },
  { id: 'poll',         name: 'Poll',              description: 'Live polling to engage participants and gather real-time feedback', badge: 'default', Icon: PollIcon        },
  { id: 'external',     name: 'External Content',  description: 'Embed third-party media, websites, or interactive content',    badge: 'enterprise', Icon: ExternalIcon    },
  { id: 'waiting-room', name: 'Waiting Room',      description: 'Branded pre-meeting area displayed to participants before start', badge: 'default',  Icon: WaitingRoomIcon },
]

const BRAND_COLORS_DEFAULT = ['#615fff', '#0283ff', '#ffa726', '#ef4444', '#10b981']

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

// ─── BadgeChip ────────────────────────────────────────────────────────────────

function BadgeChip({ type }: { type: Badge }) {
  if (type === 'enterprise') {
    return (
      <span
        className="text-[10px] font-semibold px-[7px] py-[2px] rounded-full uppercase tracking-wide"
        style={{ color: '#93c5fd', background: 'rgba(2,131,255,0.12)' }}
      >
        Enterprise
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
      className="rounded-[12px] overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
    >
      {children}
    </div>
  )
}

// ─── Graphic row ─────────────────────────────────────────────────────────────

interface GraphicRowProps {
  graphic: Graphic
  enabled: boolean
  onToggle: () => void
  isLast: boolean
}

function GraphicRow({ graphic, enabled, onToggle, isLast }: GraphicRowProps) {
  const { name, description, badge, Icon } = graphic
  return (
    <div
      className="flex items-center gap-[14px] px-[20px] py-[14px] transition-colors"
      style={{
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Icon */}
      <div
        className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center shrink-0"
        style={{
          background: enabled ? 'rgba(2,131,255,0.12)' : 'rgba(255,255,255,0.06)',
          color: enabled ? '#60a5fa' : 'rgba(255,255,255,0.35)',
        }}
      >
        <Icon />
      </div>

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

      {/* Status label + toggle */}
      <div className="flex items-center gap-[10px] shrink-0">
        <span
          className="text-[12px] font-medium"
          style={{ color: enabled ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
        <Toggle on={enabled} onChange={onToggle} />
      </div>
    </div>
  )
}

// ─── Constraint row ───────────────────────────────────────────────────────────

interface ConstraintRowProps {
  Icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
  isLast: boolean
  children?: React.ReactNode
}

function ConstraintRow({ Icon, title, description, enabled, onToggle, isLast, children }: ConstraintRowProps) {
  return (
    <div
      className="px-[20px] py-[14px] transition-colors"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-start gap-[14px]">
        <div
          className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center shrink-0 mt-[1px]"
          style={{
            background: enabled ? 'rgba(2,131,255,0.12)' : 'rgba(255,255,255,0.06)',
            color: enabled ? '#60a5fa' : 'rgba(255,255,255,0.35)',
          }}
        >
          <Icon />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-[12px]">
            <div>
              <p className="font-medium text-[13px] text-[#fafaf9] mb-[2px]">{title}</p>
              <p className="text-[12px] leading-[16px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {description}
              </p>
            </div>
            <div className="flex items-center gap-[10px] shrink-0 mt-[1px]">
              <span
                className="text-[12px] font-medium"
                style={{ color: enabled ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
              >
                {enabled ? 'On' : 'Off'}
              </span>
              <Toggle on={enabled} onChange={onToggle} />
            </div>
          </div>

          {/* Expandable content */}
          {enabled && children && (
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

// ─── Color palette editor ─────────────────────────────────────────────────────

interface ColorPaletteProps {
  colors: string[]
  onChange: (colors: string[]) => void
}

function ColorPaletteEditor({ colors, onChange }: ColorPaletteProps) {
  const addColor = () => {
    const sample = ['#a78bfa', '#fb923c', '#34d399', '#f472b6', '#facc15']
    const next = sample.find(c => !colors.includes(c)) ?? '#888888'
    onChange([...colors, next])
  }

  const removeColor = (i: number) => {
    onChange(colors.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <p className="text-[11px] font-medium mb-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
        APPROVED BRAND COLORS
      </p>
      <div className="flex items-center flex-wrap gap-[8px]">
        {colors.map((color, i) => (
          <div key={i} className="relative group/swatch">
            <div
              className="w-[32px] h-[32px] rounded-[8px] cursor-pointer transition-transform hover:scale-110"
              style={{ background: color, border: '2px solid rgba(255,255,255,0.15)' }}
            />
            <button
              onClick={() => removeColor(i)}
              className="absolute -top-[5px] -right-[5px] w-[14px] h-[14px] rounded-full bg-[#1a1b1e] border border-[rgba(255,255,255,0.15)] items-center justify-center cursor-pointer hidden group-hover/swatch:flex"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                <path d="M1 1L6 6M6 1L1 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            {/* Tooltip */}
            <div
              className="absolute bottom-[38px] left-1/2 -translate-x-1/2 hidden group-hover/swatch:block pointer-events-none px-[8px] py-[4px] rounded-[5px] whitespace-nowrap"
              style={{ background: '#2a2b2e', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-[10px] font-semibold text-[#fafaf9] uppercase tracking-wide">{color}</span>
            </div>
          </div>
        ))}
        {colors.length < 12 && (
          <button
            onClick={addColor}
            className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer border-0 transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px dashed rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <PlusSmIcon />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── WorkspacePage ────────────────────────────────────────────────────────────

interface GraphicState {
  [key: string]: boolean
}

interface BrandingState {
  colorLock: boolean
  fontLock: boolean
  customGraphics: boolean
}

export default function WorkspacePage() {
  const [graphics, setGraphics] = useState<GraphicState>({
    logo: true, ticker: true, timer: true, agenda: true,
    qa: true, poll: false, external: false, 'waiting-room': true,
  })

  const [branding, setBranding] = useState<BrandingState>({
    colorLock: true,
    fontLock: true,
    customGraphics: true,
  })

  const [brandColors, setBrandColors] = useState<string[]>(BRAND_COLORS_DEFAULT)
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)

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
          <div className="w-px h-[16px]" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {enabledCount} of {GRAPHICS.length} graphics enabled
          </span>
        </div>

        <div className="flex items-center gap-[10px]">
          {saved && (
            <div className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px]" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
              <CheckIcon />
              <span className="text-[12px] font-medium">Saved</span>
            </div>
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

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 px-[28px] py-[24px]">
        <div className="max-w-[860px] flex flex-col gap-[28px]">

          {/* ── Section 1: Graphics Availability ── */}
          <div>
            <div className="flex items-start justify-between mb-[14px]">
              <div>
                <h2 className="font-semibold text-[15px] text-[#fafaf9] mb-[4px]">
                  Graphics Availability
                </h2>
                <p className="text-[13px] leading-[18px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Control which graphic types are available to your organization's users during meetings.
                  Disabled graphics will not appear as options for any user.
                </p>
              </div>
              {/* Quick-actions */}
              <div className="flex items-center gap-[6px] shrink-0 ml-[20px]">
                <button
                  onClick={() => { setGraphics(Object.fromEntries(GRAPHICS.map(g => [g.id, true]))); setDirty(true) }}
                  className="text-[12px] font-medium px-[10px] py-[5px] rounded-[6px] cursor-pointer border-0 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  Enable all
                </button>
                <button
                  onClick={() => { setGraphics(Object.fromEntries(GRAPHICS.map(g => [g.id, false]))); setDirty(true) }}
                  className="text-[12px] font-medium px-[10px] py-[5px] rounded-[6px] cursor-pointer border-0 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  Disable all
                </button>
              </div>
            </div>

            <SectionCard>
              {GRAPHICS.map((graphic, i) => (
                <GraphicRow
                  key={graphic.id}
                  graphic={graphic}
                  enabled={!!graphics[graphic.id]}
                  onToggle={() => toggleGraphic(graphic.id)}
                  isLast={i === GRAPHICS.length - 1}
                />
              ))}
            </SectionCard>
          </div>

          {/* ── Section 2: Branding Constraints ── */}
          <div>
            <div className="mb-[14px]">
              <h2 className="font-semibold text-[15px] text-[#fafaf9] mb-[4px]">
                Branding Constraints
              </h2>
              <p className="text-[13px] leading-[18px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Enforce brand consistency across all meeting graphics. These settings apply
                organization-wide and override individual user preferences.
              </p>
            </div>

            <SectionCard>
              {/* Color Palette Lock */}
              <ConstraintRow
                Icon={LockIcon}
                title="Color Palette Lock"
                description="Restrict users to organization-approved brand colors only. Users cannot set custom colors outside this palette."
                enabled={branding.colorLock}
                onToggle={() => toggleBranding('colorLock')}
                isLast={false}
              >
                <ColorPaletteEditor colors={brandColors} onChange={c => { setBrandColors(c); setDirty(true) }} />
              </ConstraintRow>

              {/* Font Override Lock */}
              <ConstraintRow
                Icon={FontIcon}
                title="Font Override Lock"
                description="Prevent users from changing the default organization typeface in graphic templates."
                enabled={branding.fontLock}
                onToggle={() => toggleBranding('fontLock')}
                isLast={false}
              >
                <div className="flex items-center gap-[12px]">
                  <div
                    className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[8px]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <span className="text-[13px] font-semibold text-[#fafaf9]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Aa</span>
                    <div>
                      <p className="text-[12px] font-medium text-[#fafaf9] leading-[15px]">Plus Jakarta Sans</p>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Organization default</p>
                    </div>
                  </div>
                  <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Users will see this font and cannot override it
                  </span>
                </div>
              </ConstraintRow>

              {/* Custom Enterprise Graphics */}
              <ConstraintRow
                Icon={StarIcon}
                title="Custom Enterprise Graphics"
                description="Allow users to access and activate enterprise-tier custom graphic templates created for your organization."
                enabled={branding.customGraphics}
                onToggle={() => toggleBranding('customGraphics')}
                isLast={true}
              >
                <div className="flex items-center gap-[8px]">
                  <div
                    className="w-[6px] h-[6px] rounded-full shrink-0"
                    style={{ background: '#4ade80' }}
                  />
                  <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span className="text-[#fafaf9] font-medium">3 custom templates</span> available for this workspace —
                    users will see them in their graphic panel.
                  </p>
                </div>
              </ConstraintRow>
            </SectionCard>
          </div>

          {/* Bottom spacing */}
          <div className="h-[8px]" />
        </div>
      </div>
    </div>
  )
}
