import { useState, useRef, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'Admin' | 'Editor' | 'Viewer'
type Tab  = 'members' | 'enterprise'

interface Member {
  id: string
  initials: string
  avatarColor: string
  name: string
  email: string
  role: Role
  joined: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MEMBERS: Member[] = [
  { id: '1',  initials: 'AU', avatarColor: '#3b82f6', name: 'Aaron Underwood', email: 'aaronu@breezy.com',    role: 'Viewer', joined: '2 hours ago'   },
  { id: '2',  initials: 'AK', avatarColor: '#8b5cf6', name: 'Anna Kim',        email: 'akim@breezy.com',      role: 'Viewer', joined: '5 days ago'    },
  { id: '3',  initials: 'BL', avatarColor: '#14b8a6', name: 'Brian Lee',       email: 'blee@breezy.com',      role: 'Editor', joined: '3 days ago'    },
  { id: '4',  initials: 'CM', avatarColor: '#f59e0b', name: 'Catherine Moss',  email: 'cmoss@breezy.com',     role: 'Viewer', joined: '1 day ago'     },
  { id: '5',  initials: 'DJ', avatarColor: '#10b981', name: 'David Jones',     email: 'djones@breezy.com',    role: 'Editor', joined: '2 days ago'    },
  { id: '6',  initials: 'DR', avatarColor: '#f43f5e', name: 'Dani Ramos',      email: 'dramos@breezy.com',    role: 'Viewer', joined: 'Feb 21, 2026'  },
  { id: '7',  initials: 'GH', avatarColor: '#6366f1', name: 'Grace Harper',    email: 'gharper@breezy.com',   role: 'Viewer', joined: 'Feb 26, 2026'  },
  { id: '8',  initials: 'GJ', avatarColor: '#ec4899', name: 'George Jenkins',  email: 'gjenkins@breezy.com',  role: 'Editor', joined: 'Mar 12, 2026'  },
  { id: '9',  initials: 'GW', avatarColor: '#0ea5e9', name: 'Gina Watson',     email: 'gwatson@breezy.com',   role: 'Viewer', joined: 'Apr 05, 2026'  },
  { id: '10', initials: 'JS', avatarColor: '#615fff', name: 'Jeff Smith',      email: 'jm.smith@breezy.com',  role: 'Admin',  joined: 'Feb 15, 2026'  },
  { id: '11', initials: 'JJ', avatarColor: '#84cc16', name: 'James Johnson',   email: 'jjohnson@breezy.com',  role: 'Viewer', joined: 'May 18, 2026'  },
  { id: '12', initials: 'JW', avatarColor: '#f97316', name: 'John Wick',       email: 'jconnor@breezy.com',   role: 'Viewer', joined: 'Mar 10, 2026'  },
  { id: '13', initials: 'KR', avatarColor: '#06b6d4', name: 'Kyle Reese',      email: 'kreese@breezy.com',    role: 'Editor', joined: 'Mar 10, 2026'  },
  { id: '14', initials: 'KM', avatarColor: '#a855f7', name: 'Kyle Miller',     email: 'kmiller@breezy.com',   role: 'Viewer', joined: 'Mar 10, 2026'  },
  { id: '15', initials: 'LB', avatarColor: '#22c55e', name: 'Laura Brown',     email: 'lbrown@breezy.com',    role: 'Viewer', joined: 'Jun 5, 2026'   },
]

const ROLE_OPTIONS: { role: Role; description: string }[] = [
  { role: 'Admin',  description: 'Full control over all graphics, members and settings' },
  { role: 'Editor', description: 'Can create and edit graphics'                         },
  { role: 'Viewer', description: 'Can view and apply graphics during meeting but not edit' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 2V10M4.5 7L7.5 10L10.5 7M2 12.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1.5V11.5M1.5 6.5H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M5.5 2V9M5.5 2L3 4.5M5.5 2L8 4.5M5.5 9L3 6.5M5.5 9L8 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDownSmIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2.5 4L5.5 7L8.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M5 3.5V2.5C5 2.22 5.22 2 5.5 2H8.5C8.78 2 9 2.22 9 2.5V3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M5.5 6.5V10.5M8.5 6.5V10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3 3.5L3.5 11.5C3.5 11.78 3.72 12 4 12H10C10.28 12 10.5 11.78 10.5 11.5L11 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2L12 5L4.5 12.5H2V10L9 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 3.5L10.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M8.5 2L4 6.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M4.5 2L9 6.5L4.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 7L6.2 8.7L9.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5L13 4V8C13 11 10.5 13.5 7.5 14C4.5 13.5 2 11 2 8V4L7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5 7.5L6.5 9L10 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="5.5" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 8.5L13.5 13.5M10.5 11L12 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7.5 4.5V7.5L9.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M10 7C11.1 7 12 6.1 12 5C12 3.9 11.1 3 10 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 9.5C11.8 9.8 13 10.4 13 11.5V12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 12.5V11.5C1.5 10 3.5 9 6 9C8.5 9 10.5 10 10.5 11.5V12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SeatBadgeProps {
  count: number
  label: string
  type: 'in-use' | 'available' | 'purchased'
}

function SeatBadge({ count, label, type }: SeatBadgeProps) {
  const style = {
    'in-use':    { color: '#4ade80', bg: 'rgba(74,222,128,0.1)'  },
    'available': { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
    'purchased': { color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.07)' },
  }[type]

  return (
    <div className="flex items-center gap-[5px]">
      <span className="font-semibold text-[13px]" style={{ color: '#fafaf9' }}>{count} seats</span>
      <span
        className="text-[11px] font-medium px-[8px] py-[3px] rounded-full"
        style={{ color: style.color, background: style.bg }}
      >
        {label}
      </span>
    </div>
  )
}

interface CheckboxProps {
  checked: boolean
  indeterminate?: boolean
  onChange: (v: boolean) => void
}

function Checkbox({ checked, indeterminate = false, onChange }: CheckboxProps) {
  const active = checked || indeterminate
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-[14px] h-[14px] rounded-[3px] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
      style={{
        background: active ? '#0283ff' : 'transparent',
        border: active ? '1px solid #0283ff' : '1px solid rgba(255,255,255,0.2)',
      }}
    >
      {indeterminate && !checked && (
        <div className="w-[6px] h-[1.5px] bg-white rounded-full" />
      )}
      {checked && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function CheckSmIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L4.5 8.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ROLE_STYLE: Record<Role, { bg: string; color: string }> = {
  Admin:  { bg: 'rgba(97,95,255,0.14)',  color: '#a5b4fc' },
  Editor: { bg: 'rgba(2,131,255,0.12)',  color: '#60a5fa' },
  Viewer: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' },
}

interface RoleDropdownProps {
  role: Role
  onChange: (r: Role) => void
}

function RoleDropdown({ role, onChange }: RoleDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { bg, color } = ROLE_STYLE[role]

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[6px] cursor-pointer border-0 select-none transition-opacity hover:opacity-80"
        style={{ background: bg, color }}
      >
        <span className="text-[12px] font-medium">{role}</span>
        <ChevronDownSmIcon />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-50 rounded-[10px] overflow-hidden py-[4px] min-w-[220px]"
          style={{
            background: '#1c1d21',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {ROLE_OPTIONS.map(({ role: r, description }) => {
            const isActive = r === role
            const s = ROLE_STYLE[r]
            return (
              <button
                key={r}
                onClick={() => { onChange(r); setOpen(false) }}
                className="w-full flex items-start justify-between gap-[10px] px-[14px] py-[10px] cursor-pointer border-0 text-left transition-colors"
                style={{ background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <div className="flex flex-col gap-[2px]">
                  <span
                    className="text-[12px] font-semibold px-[6px] py-[1px] rounded-[5px] self-start"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {r}
                  </span>
                  <span className="text-[11px] leading-[15px] mt-[3px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {description}
                  </span>
                </div>
                {isActive && (
                  <span className="shrink-0 mt-[2px]" style={{ color: '#60a5fa' }}>
                    <CheckSmIcon />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative flex items-center rounded-full cursor-pointer border-0 transition-colors shrink-0"
      style={{
        width: 36, height: 20,
        background: on ? '#0283ff' : 'rgba(255,255,255,0.12)',
        border: on ? '1px solid rgba(2,131,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span
        className="absolute top-[2px] rounded-full bg-white transition-transform duration-200"
        style={{
          width: 14, height: 14,
          transform: on ? 'translateX(18px)' : 'translateX(2px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}
      />
    </button>
  )
}

// ─── Enterprise view ──────────────────────────────────────────────────────────

function EnterpriseView() {
  const [sso, setSso] = useState(true)
  const [mfa, setMfa] = useState(true)
  const [auditLog, setAuditLog] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [advancedPerms, setAdvancedPerms] = useState(true)
  const [guestAccess, setGuestAccess] = useState(false)

  const FEATURES = [
    {
      icon: <KeyIcon />,
      title: 'Single Sign-On (SSO)',
      description: 'Allow members to authenticate via your identity provider (Okta, Azure AD, Google Workspace)',
      on: sso, toggle: () => setSso(v => !v),
    },
    {
      icon: <ShieldIcon />,
      title: 'Multi-Factor Authentication',
      description: 'Require all team members to verify their identity with a second factor',
      on: mfa, toggle: () => setMfa(v => !v),
    },
    {
      icon: <ClockIcon />,
      title: 'Audit Log',
      description: 'Track all admin actions, permission changes and graphic modifications across the workspace',
      on: auditLog, toggle: () => setAuditLog(v => !v),
    },
    {
      icon: <ClockIcon />,
      title: 'Session Timeout',
      description: 'Automatically sign out inactive users after 30 minutes of inactivity',
      on: sessionTimeout, toggle: () => setSessionTimeout(v => !v),
    },
    {
      icon: <UsersIcon />,
      title: 'Advanced Permissions',
      description: 'Enable granular role-based access controls per graphic type and workspace section',
      on: advancedPerms, toggle: () => setAdvancedPerms(v => !v),
    },
    {
      icon: <UsersIcon />,
      title: 'Guest Access',
      description: 'Allow external guests to join meetings and view graphics without a workspace account',
      on: guestAccess, toggle: () => setGuestAccess(v => !v),
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 px-[28px] pb-[28px]">
      <div className="max-w-[860px] mx-auto flex flex-col gap-[28px] pt-[28px]">

        {/* Plan overview */}
        <div
          className="rounded-[12px] p-[24px]"
          style={{
            background: 'linear-gradient(135deg, rgba(97,95,255,0.12) 0%, rgba(2,131,255,0.08) 100%)',
            border: '1px solid rgba(97,95,255,0.2)',
          }}
        >
          <div className="flex items-start justify-between mb-[20px]">
            <div>
              <div className="flex items-center gap-[8px] mb-[6px]">
                <span
                  className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full uppercase tracking-wide"
                  style={{ background: 'rgba(97,95,255,0.25)', color: '#a5b4fc' }}
                >
                  Enterprise Plan
                </span>
              </div>
              <h2 className="font-semibold text-[20px] text-[#fafaf9] mb-[4px]">Breezy's Workspace</h2>
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Renews on <span style={{ color: 'rgba(255,255,255,0.75)' }}>February 15, 2027</span> · Billed annually
              </p>
            </div>
            <button
              className="text-[12px] font-medium px-[14px] py-[7px] rounded-[8px] cursor-pointer border-0 transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fafaf9' }}
            >
              Manage Plan
            </button>
          </div>

          {/* Seat usage */}
          <div className="grid gap-[12px]" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { label: 'Seats in use',    count: 151, total: 275, color: '#4ade80', bg: 'rgba(74,222,128,0.1)'   },
              { label: 'Available seats', count: 124, total: 275, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'   },
              { label: 'Total purchased', count: 275, total: 275, color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.07)' },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className="rounded-[10px] px-[16px] py-[14px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-[8px]">
                  <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                  <span className="text-[11px] font-medium px-[6px] py-[2px] rounded-full" style={{ color, background: bg }}>{count}</span>
                </div>
                <div className="h-[4px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(count / 275) * 100}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Included features */}
        <div>
          <h3 className="text-[13px] font-semibold text-[#fafaf9] mb-[4px]">Plan Includes</h3>
          <p className="text-[12px] mb-[14px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            All features available on your Enterprise plan
          </p>
          <div className="grid gap-[8px]" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {[
              'Unlimited graphics templates',
              'Priority support & SLA',
              'Custom branding & white-label',
              'Advanced analytics & reporting',
              'API access & webhooks',
              'Dedicated account manager',
              'Custom integrations',
              'Enterprise SSO & security',
            ].map(feat => (
              <div key={feat} className="flex items-center gap-[8px]">
                <span style={{ color: '#4ade80' }}><CheckCircleIcon /></span>
                <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & access */}
        <div>
          <h3 className="text-[13px] font-semibold text-[#fafaf9] mb-[4px]">Security & Access</h3>
          <p className="text-[12px] mb-[14px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Configure security policies and access controls for your organization
          </p>
          <div
            className="rounded-[12px] overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {FEATURES.map((feat, idx) => (
              <div
                key={feat.title}
                className="flex items-center gap-[14px] px-[18px] py-[16px]"
                style={{
                  borderBottom: idx < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{feat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#fafaf9] mb-[2px]">{feat.title}</p>
                  <p className="text-[12px] leading-[16px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{feat.description}</p>
                </div>
                <Toggle on={feat.on} onChange={feat.toggle} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── TeamPage ─────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<Tab>('members')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [roles, setRoles] = useState<Record<string, Role>>(
    Object.fromEntries(MEMBERS.map(m => [m.id, m.role]))
  )

  const allSelected = selectedIds.size === MEMBERS.length
  const someSelected = selectedIds.size > 0 && !allSelected

  const toggleAll = (v: boolean) => {
    setSelectedIds(v ? new Set(MEMBERS.map(m => m.id)) : new Set())
  }

  const toggleOne = (id: string, v: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (v) next.add(id); else next.delete(id)
      return next
    })
  }

  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0a0b0d' }}>

      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between shrink-0 h-[64px] px-[28px]"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-[16px]">
          <h1 className="font-semibold text-[18px] text-[#fafaf9] leading-[22px] whitespace-nowrap">
            Team
          </h1>
          {activeTab === 'members' && <>
            <div className="w-px h-[16px] shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="flex items-center gap-[16px]">
              <SeatBadge count={151} label="In use"    type="in-use"    />
              <SeatBadge count={124} label="Available" type="available" />
              <SeatBadge count={275} label="Purchased" type="purchased" />
            </div>
          </>}
        </div>

        <div className="flex items-center gap-[8px]">
          {activeTab === 'members' && <>
            <button
              className="flex items-center justify-center w-[36px] h-[36px] rounded-[8px] cursor-pointer transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fafaf9')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              <DownloadIcon />
            </button>
            <button
              className="flex items-center gap-[6px] h-[36px] px-[14px] rounded-[8px] cursor-pointer border-0 text-white font-semibold text-[13px] transition-opacity hover:opacity-90"
              style={{ background: '#0283ff' }}
            >
              <PlusIcon />
              Add Member
            </button>
          </>}
        </div>
      </div>

      {/* ── Tab strip ── */}
      <div
        className="flex items-center gap-[4px] shrink-0 px-[28px]"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', height: 44 }}
      >
        {([
          { id: 'members'    as Tab, label: 'Team Members'  },
          { id: 'enterprise' as Tab, label: 'Enterprise'    },
        ]).map(({ id, label }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
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

      {/* ── Tab content ── */}
      {activeTab === 'enterprise' && <EnterpriseView />}

      {activeTab === 'members' && <>
        {/* ── Search ── */}
        <div
          className="shrink-0 px-[28px] py-[10px]"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="relative max-w-[380px]">
            <span className="absolute left-[11px] top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.28)' }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search team members"
              className="w-full h-[34px] rounded-[8px] pl-[34px] pr-[12px] text-[13px] outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fafaf9',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="pl-[28px] pr-[8px] py-[10px] w-[44px]">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                </th>
                <th className="px-[8px] py-[10px] text-left">
                  <div className="flex items-center gap-[5px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <span className="text-[12px] font-medium">Name</span>
                    <SortIcon />
                  </div>
                </th>
                <th className="px-[8px] py-[10px] text-left w-[220px]">
                  <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Email</span>
                </th>
                <th className="px-[8px] py-[10px] text-left w-[130px]">
                  <div className="flex items-center gap-[5px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <span className="text-[12px] font-medium">Role</span>
                    <SortIcon />
                  </div>
                </th>
                <th className="px-[8px] py-[10px] text-left w-[160px]">
                  <div className="flex items-center gap-[5px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <span className="text-[12px] font-medium">Date Joined</span>
                    <SortIcon />
                  </div>
                </th>
                <th className="px-[8px] pr-[28px] py-[10px] text-right w-[80px]">
                  <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => {
                const isSelected = selectedIds.has(member.id)
                return (
                  <tr
                    key={member.id}
                    className="group transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: isSelected ? 'rgba(2,131,255,0.04)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.015)' }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
                  >
                    <td className="pl-[28px] pr-[8px] py-[13px]">
                      <Checkbox checked={isSelected} onChange={v => toggleOne(member.id, v)} />
                    </td>
                    <td className="px-[8px] py-[13px]">
                      <div className="flex items-center gap-[10px]">
                        <div
                          className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                          style={{ background: member.avatarColor }}
                        >
                          {member.initials}
                        </div>
                        <span className="text-[13px] font-medium text-[#fafaf9]">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-[8px] py-[13px]">
                      <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{member.email}</span>
                    </td>
                    <td className="px-[8px] py-[13px]">
                      <RoleDropdown
                        role={roles[member.id] ?? member.role}
                        onChange={r => setRoles(prev => ({ ...prev, [member.id]: r }))}
                      />
                    </td>
                    <td className="px-[8px] py-[13px]">
                      <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{member.joined}</span>
                    </td>
                    <td className="px-[8px] pr-[28px] py-[13px]">
                      <div className="flex items-center justify-end gap-[6px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center cursor-pointer border-0 transition-colors"
                          style={{ background: 'transparent', color: 'rgba(255,255,255,0.3)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
                        >
                          <TrashIcon />
                        </button>
                        <button
                          className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center cursor-pointer border-0 transition-colors"
                          style={{ background: 'transparent', color: 'rgba(255,255,255,0.3)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fafaf9' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
                        >
                          <EditIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div
          className="flex items-center justify-between shrink-0 h-[50px] px-[28px]"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Showing 15 of 151 rows
          </span>

          <div className="flex items-center gap-[3px]">
            <button
              className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center cursor-pointer border-0 transition-colors"
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.25)' }}
            >
              <ChevronLeftIcon />
            </button>
            {[1, 2, 3, 4].map(p => (
              <button
                key={p}
                className="w-[28px] h-[28px] rounded-[6px] text-[12px] font-medium cursor-pointer border-0 transition-colors"
                style={p === 1
                  ? { background: 'rgba(255,255,255,0.1)', color: '#fafaf9', border: '1px solid rgba(255,255,255,0.14)' }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }
                }
              >
                {p}
              </button>
            ))}
            <span className="w-[28px] text-center text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>…</span>
            <button
              className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center cursor-pointer border-0 transition-colors"
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <ChevronRightIcon />
            </button>
          </div>

          <div className="flex items-center gap-[8px]">
            <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Rows per page</span>
            <div
              className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' }}
            >
              <span className="text-[12px] font-medium">15</span>
              <ChevronDownSmIcon />
            </div>
          </div>
        </div>
      </>}

    </div>
  )
}
