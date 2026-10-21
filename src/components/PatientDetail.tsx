import { useState } from 'react'

interface PatientDetailProps {
  onBack: () => void
  onToast: (msg: string) => void
  patientData?: {
    name: string
    mrn: string
    age: number
    status: string
  }
}

export function PatientDetail({ onBack, onToast, patientData }: PatientDetailProps) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Timeline' | 'Appointments' | 'Referrals' | 'Communications' | 'Audit Trail'>('Overview')

  const patient = {
    name: patientData?.name || 'Maria Santos',
    mrn: patientData?.mrn || 'MED-2847-001',
    age: patientData?.age || 54,
    sex: 'Female',
    dob: 'Oct 12, 1972',
    status: 'Active In-Care',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 382-9402',
    email: 'maria.santos@healthmail.com',
    address: '742 Evergreen Terrace, Sector 4, London',
    languages: 'Spanish, English',
    insuranceProvider: 'Blue Shield Alliance',
    policyNo: 'BSA-9023-112',
    insuranceStatus: 'Active Verification',
    emergencyContact: 'Carlos Santos (Husband)',
    emergencyPhone: '+1 (555) 382-9405'
  }

  const careTeam = [
    {
      role: 'ASSIGNED PHYSICIAN',
      name: 'Dr. Alistair Vance',
      title: 'Endocrinology Specialist',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80'
    },
    {
      role: 'CARE COORDINATOR',
      name: 'Nurse Sarah Jenkins',
      title: 'Chronic Care Manager',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80'
    },
    {
      role: 'LIFESTYLE COACH',
      name: 'Elena Rostova',
      title: 'Nutritional Therapy',
      avatar: 'https://images.unsplash.com/photo-1594824813575-f094eb2df43a?w=100&auto=format&fit=crop&q=80'
    }
  ]

  const tabs: Array<'Overview' | 'Timeline' | 'Appointments' | 'Referrals' | 'Communications' | 'Audit Trail'> = [
    'Overview',
    'Timeline',
    'Appointments',
    'Referrals',
    'Communications',
    'Audit Trail'
  ]

  return (
    <div className="space-y-5">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <button
          onClick={onBack}
          className="hover:text-emerald-800 transition-colors cursor-pointer"
        >
          Patients
        </button>
        <span>›</span>
        <span className="text-slate-700">{patient.name}</span>
        <span>›</span>
        <span className="font-semibold text-emerald-800">{activeTab}</span>
      </div>

      {/* Patient Header Banner (from Figma) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h2 className="text-2xl font-bold text-[#08231A] tracking-tight">
                {patient.name}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-emerald-200">
                {patient.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <div>
                <span className="font-bold text-slate-700">MRN:</span>{' '}
                <span className="font-mono text-slate-600">{patient.mrn}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Age:</span> {patient.age} Years
              </div>
              <div>
                <span className="font-bold text-slate-700">Sex:</span> {patient.sex}
              </div>
              <div>
                <span className="font-bold text-slate-700">DOB:</span> {patient.dob}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast(`✓ Triage plan opened for ${patient.name}`)}
            className="px-4 py-2 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            Triage & Care Plan
          </button>
        </div>
      </div>

      {/* Horizontal Tabs Bar (from Figma) */}
      <div className="border-b border-slate-200/80 flex items-center gap-6 text-xs font-bold text-slate-500">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative transition-colors ${
              activeTab === tab
                ? 'text-[#08231A] font-extrabold'
                : 'hover:text-slate-800'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#08231A] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Timeline' ? (
        /* Patient Journey Timeline (from Figma screenshot) */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#08231A] tracking-tight">
              Patient Journey Timeline
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Chronological log of clinical milestones, care team transitions, and automated system actions.
            </p>
          </div>

          {/* Timeline Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All Events', 'Clinical', 'Administrative', 'AI Actions'].map((filter, idx) => (
              <button
                key={filter}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  idx === 0
                    ? 'bg-[#08231A] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Chronological List with Nodes & Connectors */}
          <div className="pt-2">
            {[
              {
                date: 'Jan 5, 2026',
                title: 'Portal Registration Completed',
                desc: 'Patient self-registered via digital waitlist portal. Insurance card uploaded & baseline validation checked.',
                party: 'Command Portal Auto-Triage'
              },
              {
                date: 'Jan 6, 2026',
                title: 'Clinical Onboarding',
                desc: 'Welcome workflow triggered. Baseline health assessment forms dispatched to patient dashboard.',
                party: 'System Automation'
              },
              {
                date: 'Jan 8, 2026',
                title: 'Initial Assessment Completed',
                desc: 'Maria completed comprehensive lifestyle, symptoms & physical capabilities survey. Identified high glycemic index risk.',
                party: 'Maria Santos'
              },
              {
                date: 'Jan 8, 2026',
                title: 'Automatic Severity Screen / Triage',
                desc: 'AI screening parsed physiological survey values. Flagged for endocrine consult based on daily hyperglycemia trend.',
                party: 'MedPresence AI Engine'
              },
              {
                date: 'Jan 9, 2026',
                title: 'Clinic Assignment',
                desc: 'Assigned to the London Metabolic & Endocrine Virtual Ward based on geographical & clinical priority guidelines.',
                party: 'Nurse Sarah Jenkins'
              },
              {
                date: 'Jan 10, 2026',
                title: 'Doctor Assignment',
                desc: 'Dr. Alistair Vance appointed as chief primary physician. Clinical notes synchronized with Command Console.',
                party: 'Dr. Elizabeth Thorne (COO)'
              },
              {
                date: 'Jan 12, 2026',
                title: 'First Consultation Completed',
                desc: 'Telehealth clinical review conducted. Baseline biomarkers evaluated. Insulin titration plan initiated.',
                party: 'Dr. Alistair Vance'
              },
              {
                date: 'Jan 12, 2026',
                title: 'Active Care Plan Created',
                desc: 'Structured Diabetes & Hypertension chronic management v4.2 activated. Integrated IoT vitals feed approved.',
                party: 'Clinical System Board'
              },
              {
                date: 'Feb 2, 2026',
                title: 'First Virtual Follow-up',
                desc: 'Review of compliance and daily home readings. Satisfactory adaptation to the meal planning tracker.',
                party: 'Nurse Sarah Jenkins'
              }
            ].map((ev, index, arr) => (
              <div key={index} className="flex items-start gap-4 sm:gap-6 relative group pb-7 last:pb-0">
                {/* Left Date Column */}
                <div className="w-24 sm:w-28 text-right shrink-0 pt-0.5">
                  <span className="text-xs font-bold text-slate-800">
                    {ev.date}
                  </span>
                </div>

                {/* Center Node & Line */}
                <div className="relative flex flex-col items-center shrink-0">
                  {/* Concentric Node Circle (from Figma) */}
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-700 bg-white flex items-center justify-center shrink-0 shadow-2xs z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  </div>

                  {/* Vertical connecting line */}
                  {index < arr.length - 1 && (
                    <div className="w-0.5 bg-slate-200 absolute top-6 bottom-0" />
                  )}
                </div>

                {/* Right Event Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="text-sm font-bold text-[#08231A]">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    {ev.desc}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Responsible Party:{' '}
                    <span className="font-bold text-slate-700">{ev.party}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'Overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: Demographics & Personal Info */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-4">
                Demographics & Personal Info
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</div>
                  <div className="font-bold text-slate-800 mt-0.5">{patient.phone}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</div>
                  <div className="font-medium text-slate-700 mt-0.5">{patient.email}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</div>
                  <div className="font-medium text-slate-700 mt-0.5 leading-relaxed">{patient.address}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Language</div>
                  <div className="font-medium text-slate-700 mt-0.5">{patient.languages}</div>
                </div>
              </div>
            </div>

            {/* Insurance Info */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-3">
                Insurance Information
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Provider:</span>
                  <span className="font-bold text-slate-800">{patient.insuranceProvider}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Policy No:</span>
                  <span className="font-mono text-slate-700 font-bold">{patient.policyNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="text-emerald-700 font-bold">{patient.insuranceStatus}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-2">
                Emergency Contact
              </h3>
              <div className="text-xs">
                <div className="font-bold text-slate-800">{patient.emergencyContact}</div>
                <div className="text-slate-500 font-mono mt-0.5">{patient.emergencyPhone}</div>
              </div>
            </div>
          </div>

          {/* Column 2: Assigned Care Team & Care Plan Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-4">
                Assigned Care Team
              </h3>

              <div className="space-y-4">
                {careTeam.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {member.role}
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {member.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Care Plan Summary */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-3">
                Current Care Plan Summary
              </h3>

              <div className="bg-[#EBF7F0] border border-[#CDEBD8] rounded-2xl p-4 space-y-2.5">
                <div className="text-xs font-extrabold uppercase tracking-wide text-[#0A3827]">
                  DIABETES PATHWAY v4.2
                </div>
                <p className="text-xs text-[#08231A] leading-relaxed">
                  Focus: Glycemic optimization & blood pressure stabilization. Daily insulin titration via algorithm review.
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#10B981] text-white font-bold">
                    Compliance: 92%
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-600 font-semibold border border-slate-200">
                    Next Audit: Tomorrow
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Vitals, Risk Score & Care Feed */}
          <div className="space-y-5">
            {/* Vitals & Bio-Telemetry Snapshot */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-3">
                Vitals & Bio-Telemetry Snapshot
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <span className="text-emerald-600 font-bold">⚡</span>
                    <span>Blood Glucose</span>
                  </div>
                  <span className="text-xs font-bold text-[#08231A] font-mono">118 mg/dL</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <span className="text-rose-500 font-bold">♥</span>
                    <span>Blood Pressure</span>
                  </div>
                  <span className="text-xs font-bold text-[#08231A] font-mono">128/82 mmHg</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <span className="text-cyan-500 font-bold">○</span>
                    <span>Pulse Oximetry</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono">98% SpO2</span>
                </div>
              </div>
            </div>

            {/* Real-Time Command Risk Score */}
            <div className="bg-[#FEFDF7] rounded-2xl p-5 border border-amber-300/80 ring-1 ring-amber-200/50 shadow-2xs">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 mb-1">
                Real-Time Command Risk Score
              </div>
              <div className="text-sm font-black text-amber-800 mb-1">
                LOW TO MEDIUM RISK (12%)
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                Elevated systolic pressure on morning reading. 5mg lisinopril increase pending clinical approval.
              </p>
            </div>

            {/* Recent Care Feed */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-3">
                Recent Care Feed
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Blood glucose logged: 124 mg/dL</span>
                    <span className="block text-[10px] text-slate-400">10:30 AM</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Consultation completed with Dr. Vance</span>
                    <span className="block text-[10px] text-slate-400">Yesterday</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Lifestyle quiz completed - High engagement</span>
                    <span className="block text-[10px] text-slate-400">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Placeholder for other tabs */
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
          <div className="text-3xl mb-2">📋</div>
          <h4 className="text-base font-bold text-[#08231A]">{activeTab} Record</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Historical medical telemetry, clinical notes, and encrypted logs for {patient.name}.
          </p>
          <button
            onClick={() => setActiveTab('Overview')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#08231A] text-white text-xs font-bold hover:bg-[#0E3A2C]"
          >
            Back to Overview
          </button>
        </div>
      )}
    </div>
  )
}
