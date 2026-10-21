import { useState, useEffect } from 'react'

export function HospitalDashboard() {
  const [liveTime, setLiveTime] = useState<string>('Oct 17, 2026, 14:32:05 GMT')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toUTCString().replace('GMT', '') + 'GMT'
      setLiveTime(formatted)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const kpisRow1 = [
    { label: 'ACTIVE PATIENTS', value: '2,847', sub: '+14% this month' },
    { label: 'NEW REGISTRATIONS', value: '34', sub: "Today's goal: 40" },
    { label: 'IN CARE PATHWAY', value: '1,923', sub: '67.5% total fleet' },
    { label: "TODAY'S CONSULTATIONS", value: '186', sub: '84 completed' },
    { label: 'PENDING APPOINTMENTS', value: '412', sub: 'Requires scheduler triage' },
    { label: 'PENDING REFERRALS', value: '67', sub: '22 diagnostic' },
  ]

  const kpisRow2 = [
    { label: 'ACTIVE ESCALATIONS', value: '8', sub: '3 level-3 alerts', highlight: false },
    { label: 'SAFETY EVENTS', value: '3', sub: 'Investigation pending', highlight: true },
    { label: 'HUMAN OVERRIDES', value: '12', sub: 'AI actions audited by clinicians', highlight: false },
    { label: 'AI ACTIVITY RATE', value: '1,247', sub: 'Actions in past 24 hrs', highlight: false },
  ]

  const clinicBars = [
    { label: 'Cardio', height: 62, active: false },
    { label: 'Neuro...', height: 46, active: false },
    { label: 'Mental...', height: 80, active: true },
    { label: 'Diab...', height: 38, active: false },
    { label: 'Strok...', height: 58, active: false },
    { label: 'Pedi...', height: 44, active: false },
  ]

  const escalations = [
    {
      patient: 'Arthur Pendragon',
      severity: 'CRITICAL L3',
      severityClass: 'bg-amber-100/90 text-amber-800 border-amber-300 font-extrabold',
      trigger: 'SpO2 Drop Below 90%',
      clinic: 'London Heart Hub',
      status: 'Triage Initiated',
      statusClass: 'text-slate-900 font-bold'
    },
    {
      patient: 'Beatrix Kiddo',
      severity: 'WARNING L2',
      severityClass: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
      trigger: 'Missed insulin dosage',
      clinic: 'North Diabetes Hub',
      status: 'Nurse Assigned',
      statusClass: 'text-slate-900 font-bold'
    },
    {
      patient: 'Fiona Gallagher',
      severity: 'WARNING L1',
      severityClass: 'bg-amber-50/70 text-amber-700 border-amber-200 font-semibold',
      trigger: 'PHQ-9 Score Elevation',
      clinic: 'Mental Health Hub',
      status: 'In Progress',
      statusClass: 'text-slate-700 font-medium'
    },
  ]

  return (
    <div className="space-y-5">
      {/* System Status Banner (from Figma screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-2 px-1 text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-extrabold text-slate-800 tracking-wider uppercase text-[11px]">
            SYSTEM STATUS: NORMAL OPERATION
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px] mt-1 sm:mt-0">
          Live Feed: {liveTime}
        </div>
      </div>

      {/* Row 1 KPI Cards (6 columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpisRow1.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              {item.label}
            </div>
            <div>
              <div className="text-2xl sm:text-[26px] font-extrabold text-[#08231A] tracking-tight leading-none mb-1.5">
                {item.value}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {item.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 KPI Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpisRow2.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-5 border shadow-2xs transition-all flex flex-col justify-between ${
              item.highlight
                ? 'bg-[#FEFDF7] border-amber-300/80 ring-1 ring-amber-200/50'
                : 'bg-white border-slate-200/80 hover:border-emerald-300'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              {item.label}
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#08231A] tracking-tight leading-none mb-1.5">
                {item.value}
              </div>
              <div className={`text-xs font-medium ${item.highlight ? 'text-amber-800' : 'text-slate-400'}`}>
                {item.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: 3 Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Panel 1: Clinic Performance & Caseload */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-4">
              Clinic Performance & Caseload
            </h3>
          </div>

          {/* Bar Chart */}
          <div className="pt-2 pb-1">
            <div className="h-36 flex items-end justify-between gap-3 px-2 border-b border-slate-100">
              {clinicBars.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div
                    style={{ height: `${bar.height}%` }}
                    className={`w-full max-w-[28px] rounded-t-sm transition-all duration-300 ${
                      bar.active
                        ? 'bg-[#00D084] shadow-sm'
                        : 'bg-[#144837] hover:bg-[#1E6B52]'
                    }`}
                  />
                  <span className="text-[10px] font-semibold text-slate-500 truncate w-full text-center">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Patient Engagement Trends */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-2">
              Patient Engagement Trends
            </h3>
          </div>

          {/* Line Chart SVG */}
          <div className="py-2 flex-1 flex items-center justify-center">
            <svg viewBox="0 0 320 120" className="w-full h-32 overflow-visible">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <polygon
                points="10,80 40,65 75,72 110,50 145,60 180,35 215,40 250,22 285,28 310,12 310,110 10,110"
                fill="url(#trendGradient)"
              />
              {/* Smooth Trend line */}
              <polyline
                fill="none"
                stroke="#1B6D53"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,80 40,65 75,72 110,50 145,60 180,35 215,40 250,22 285,28 310,12"
              />
              {/* Trend Peak Point */}
              <circle cx="310" cy="12" r="3.5" fill="#1B6D53" />
            </svg>
          </div>
        </div>

        {/* Panel 3: Workforce Live Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-4">
              Workforce Live Status
            </h3>
          </div>

          <div className="space-y-3.5 my-auto">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-700">Online Doctors</span>
              </div>
              <span className="font-extrabold text-[#08231A]">42</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-700">Active Nurses</span>
              </div>
              <span className="font-extrabold text-[#08231A]">28</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="font-medium text-slate-700">Coordinators</span>
              </div>
              <span className="font-extrabold text-[#08231A]">15</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium text-slate-700">Active AI Agents</span>
              </div>
              <span className="font-extrabold text-[#08231A]">8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Escalations (Left) & AI Auto-Triage Auditing (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Escalations & Emergency Flags (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-4">
            Recent Escalations & Emergency Flags
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">
                  <th className="pb-2.5 font-bold">PATIENT</th>
                  <th className="pb-2.5 font-bold">SEVERITY</th>
                  <th className="pb-2.5 font-bold">TRIGGER EVENT</th>
                  <th className="pb-2.5 font-bold">ASSIGNED CLINIC</th>
                  <th className="pb-2.5 font-bold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {escalations.map((esc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 font-bold text-slate-900 pr-3">
                      {esc.patient}
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${esc.severityClass}`}>
                        {esc.severity}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700 pr-3 font-medium">
                      {esc.trigger}
                    </td>
                    <td className="py-3 text-slate-500 pr-3">
                      {esc.clinic}
                    </td>
                    <td className={`py-3 ${esc.statusClass}`}>
                      {esc.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Auto-Triage Auditing (1 column) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-4">
              AI Auto-Triage Auditing
            </h3>

            {/* Score & Icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-lg">
                🛡️
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#08231A] leading-none">
                  94.2%
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Average Clinician Approval Rate
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Our clinical workforce has reviewed and approved 1,175 AI-recommended triage routes this week. Only 5.8% required minor overrides.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-[10px] font-semibold text-emerald-950">
              Current Policy Version: v2.4 (Stroke, Mental Health, Cardio updated)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
