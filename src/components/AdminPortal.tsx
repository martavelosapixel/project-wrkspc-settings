import { useState } from 'react'
import TeamPage from './TeamPage'
import WorkspacePage from './WorkspacePage'

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = 'team' | 'workspace-graphics' | 'workspace-branding'

// ─── Icons ────────────────────────────────────────────────────────────────────

function TeamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11 7.5C12.38 7.5 13.5 6.38 13.5 5C13.5 3.62 12.38 2.5 11 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10.5C13 10.88 14 11.5 14 12.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 13.5V12.5C2 11 4 10 6.5 10C9 10 11 11 11 12.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 10.5L8 14L14.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 7L8 10.5L14.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 3.5L8 7L14.5 3.5L8 0.5L1.5 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9 7.5 8 8V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1.5V3M8 13V14.5M14.5 8H13M3 8H1.5M12.95 3.05L11.89 4.11M4.11 11.89L3.05 12.95M12.95 12.95L11.89 11.89M4.11 4.11L3.05 3.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface AdminSidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

function AdminSidebar({ activePage, onNavigate }: AdminSidebarProps) {
  const isWorkspace = activePage === 'workspace-graphics' || activePage === 'workspace-branding'

  return (
    <aside
      className="w-[220px] h-full flex flex-col shrink-0"
      style={{ background: '#0e0f12', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Workspace brand header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[20px]">
        <div
          className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #615fff 0%, #0283ff 100%)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="4.5" stroke="white" strokeWidth="1.5" />
            <path d="M8 3.5V5M8 11V12.5M3.5 8H5M11 8H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-[13px] text-[#fafaf9] leading-[17px] truncate">
            Breezy's Workspace
          </span>
          <span className="text-[11px] leading-[15px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Enterprise Plan
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-[8px] shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Nav items */}
      <nav className="flex flex-col gap-[2px] px-[8px] pt-[8px] flex-1">

        {/* Team */}
        <button
          onClick={() => onNavigate('team')}
          className="flex items-center gap-[10px] w-full px-[12px] py-[8px] rounded-[8px] cursor-pointer border-0 transition-colors text-left"
          style={activePage === 'team'
            ? { background: 'rgba(255,255,255,0.08)', color: '#fafaf9' }
            : { background: 'transparent', color: 'rgba(255,255,255,0.5)' }
          }
          onMouseEnter={e => { if (activePage !== 'team') { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fafaf9' } }}
          onMouseLeave={e => { if (activePage !== 'team') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
        >
          <TeamIcon className="shrink-0" />
          <span className="font-medium text-[13px] leading-[16px]">Team</span>
        </button>

        {/* Workspace parent */}
        <button
          onClick={() => onNavigate('workspace-graphics')}
          className="flex items-center gap-[10px] w-full px-[12px] py-[8px] rounded-[8px] cursor-pointer border-0 transition-colors text-left"
          style={isWorkspace
            ? { background: 'rgba(255,255,255,0.08)', color: '#fafaf9' }
            : { background: 'transparent', color: 'rgba(255,255,255,0.5)' }
          }
          onMouseEnter={e => { if (!isWorkspace) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fafaf9' } }}
          onMouseLeave={e => { if (!isWorkspace) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
        >
          <LayersIcon className="shrink-0" />
          <span className="font-medium text-[13px] leading-[16px]">Workspace</span>
        </button>

        {/* Workspace child items — shown when workspace is active */}
        {isWorkspace && (
          <div className="flex flex-col gap-[1px] pl-[8px]">
            {/* Left indent line */}
            <div className="relative">
              <div
                className="absolute left-[11px] top-0 bottom-0 w-px"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              />
              <div className="flex flex-col gap-[1px] pl-[20px]">
                {([
                  { id: 'workspace-graphics' as Page, label: 'Graphic Management' },
                  { id: 'workspace-branding' as Page, label: 'Branding Guidelines' },
                ]).map(({ id, label }) => {
                  const isActive = activePage === id
                  return (
                    <button
                      key={id}
                      onClick={() => onNavigate(id)}
                      className="w-full px-[10px] py-[6px] rounded-[6px] cursor-pointer border-0 transition-colors text-left"
                      style={isActive
                        ? { background: 'rgba(255,255,255,0.07)', color: '#fafaf9' }
                        : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }
                      }
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fafaf9' } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
                    >
                      <span className="text-[12px] font-medium leading-[15px]">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col px-[8px] pb-[16px]">
        <button
          className="flex items-center gap-[10px] w-full px-[12px] py-[8px] rounded-[8px] cursor-pointer border-0 bg-transparent transition-colors text-left"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)' }}
        >
          <HelpIcon className="shrink-0" />
          <span className="font-medium text-[13px] leading-[16px]">Help</span>
        </button>
        <button
          className="flex items-center gap-[10px] w-full px-[12px] py-[8px] rounded-[8px] cursor-pointer border-0 bg-transparent transition-colors text-left"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.color = '#fafaf9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)' }}
        >
          <SettingsIcon className="shrink-0" />
          <span className="font-medium text-[13px] leading-[16px]">Settings</span>
        </button>

        {/* Divider */}
        <div className="h-px mx-[4px] my-[8px]" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* User profile */}
        <div className="flex items-center gap-[10px] px-[12px] py-[8px]">
          <div
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #615fff 0%, #0283ff 100%)' }}
          >
            JS
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-medium text-[12px] text-[#fafaf9] leading-[15px] truncate">Jeff Smith</span>
            <span className="text-[10px] leading-[13px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
              jmt.smith@breezy.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Admin Portal ─────────────────────────────────────────────────────────────

export default function AdminPortal() {
  const [activePage, setActivePage] = useState<Page>('team')

  return (
    <div
      className="w-[1440px] h-[900px] flex overflow-hidden rounded-[8px]"
      style={{ background: '#0a0b0d' }}
    >
      <AdminSidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activePage === 'team' && <TeamPage />}
        {(activePage === 'workspace-graphics' || activePage === 'workspace-branding') && (
          <WorkspacePage section={activePage === 'workspace-branding' ? 'branding' : 'graphics'} />
        )}
      </main>
    </div>
  )
}
