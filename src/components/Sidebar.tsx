import {
  MedLogo,
  IconDashboard,
  IconPatients,
  IconDoctors,
  IconWorkforce,
  IconClinics,
  IconAppointments,
  IconPathways,
  IconReferrals,
  IconCommunications,
  IconAI,
  IconSafety,
  IconIntegration,
  IconClose
} from './icons'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'patients', label: 'Patients', icon: IconPatients, badge: '2.8k' },
    { id: 'doctors', label: 'Doctors', icon: IconDoctors, badge: '156' },
    { id: 'clinical-workforce', label: 'Clinical Workforce', icon: IconWorkforce },
    { id: 'clinics', label: 'Clinics', icon: IconClinics },
    { id: 'appointments', label: 'Appointments', icon: IconAppointments },
    { id: 'care-pathways', label: 'Care Pathways', icon: IconPathways },
    { id: 'referrals', label: 'Referrals', icon: IconReferrals },
    { id: 'communications', label: 'Communications', icon: IconCommunications },
    { id: 'ai-workforce', label: 'AI Workforce', icon: IconAI },
    { id: 'safety', label: 'Safety & Escalations', icon: IconSafety, alert: true },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#072118] text-slate-300 flex flex-col border-r border-[#0E3527] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#0E3527]">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <MedLogo className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-white font-bold tracking-tight text-base flex items-center gap-1.5">
                MedPresence
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-emerald-500/80">
                Command Center
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Clinical Operations
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsMobileOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#0E3A2C] text-white shadow-sm shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-[#0A2A1E]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#134937] text-emerald-300">
                    {item.badge}
                  </span>
                )}

                {item.alert && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                )}
              </button>
            )
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Systems & Telemetry
          </div>

          <button
            onClick={() => {
              setActiveTab('integration')
              setIsMobileOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group ${
              activeTab === 'integration'
                ? 'bg-[#0E3A2C] text-white shadow-sm shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white hover:bg-[#0A2A1E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <IconIntegration
                className={`w-4 h-4 transition-colors ${
                  activeTab === 'integration'
                    ? 'text-emerald-400'
                    : 'text-slate-500 group-hover:text-emerald-400'
                }`}
              />
              <span>Integrations Hub</span>
            </div>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              47 API
            </span>
          </button>
        </div>

        {/* User Profile Card (from Figma screen: Dr. Elizabeth Thorne - Chief Operations Officer) */}
        <div className="p-3 border-t border-[#0E3527] bg-[#051C14]">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#0A2A1E] transition-colors cursor-pointer group">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Dr. Elizabeth Thorne"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#051C14]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                Dr. Elizabeth Thorne
              </div>
              <div className="text-[11px] text-emerald-400/90 font-medium truncate">
                Chief Operations Officer
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
