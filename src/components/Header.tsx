import { IconSearch, IconBell, IconMenu } from './icons'

interface HeaderProps {
  title: string
  subtitle: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  onOpenMobileMenu: () => void
  notificationCount?: number
  statusBadge?: string
}

export function Header({
  title,
  subtitle,
  searchQuery,
  setSearchQuery,
  onOpenMobileMenu,
  notificationCount = 8,
  statusBadge = 'ALL CLINICS ONLINE'
}: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <IconMenu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#08231A] tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls: Search + Notification + Clinic Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search command console..."
            className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded shadow-sm">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Notifications"
        >
          <IconBell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Clinic Status Pill (From Figma: ALL CLINICS ONLINE) */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{statusBadge}</span>
        </div>
      </div>
    </header>
  )
}
