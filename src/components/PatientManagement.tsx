import { useState, useMemo } from 'react'
import { IconSearch } from './icons'

export interface Patient {
  id: string
  name: string
  mrn: string
  age: number
  condition: string
  status: 'Active' | 'In Care' | 'Pending' | 'Discharged'
  assignedClinic: string
  assignedDoctor: string
  lastActivity: string
}

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Johnathan Doe',
    mrn: 'MP-9524',
    age: 45,
    condition: 'Post-surgery Recovery',
    status: 'Active',
    assignedClinic: 'London Heart & Vascular',
    assignedDoctor: 'Dr. Sarah Chen',
    lastActivity: '2 hours ago'
  },
  {
    id: 'pat-2',
    name: 'Agnes Vance',
    mrn: 'MP-4412',
    age: 67,
    condition: 'Type 2 Diabetes',
    status: 'In Care',
    assignedClinic: 'North Diabetes Hub',
    assignedDoctor: 'Dr. Marcus Vance',
    lastActivity: '4 hours ago'
  },
  {
    id: 'pat-3',
    name: 'William Mercer',
    mrn: 'MP-3962',
    age: 54,
    condition: 'Hypertension Monitoring',
    status: 'Active',
    assignedClinic: 'Cardio Specialist Clinic',
    assignedDoctor: 'Dr. Sarah Chen',
    lastActivity: '1 day ago'
  },
  {
    id: 'pat-4',
    name: 'Beatrix Kiddo',
    mrn: 'MP-3301',
    age: 31,
    condition: 'Neuromuscular Therapy',
    status: 'Pending',
    assignedClinic: 'London Brain Clinic',
    assignedDoctor: 'Dr. Elena Stone',
    lastActivity: '30 mins ago'
  },
  {
    id: 'pat-5',
    name: 'Charles Xavier',
    mrn: 'MP-1011',
    age: 62,
    condition: 'Stroke Rehabilitation',
    status: 'Active',
    assignedClinic: 'Physical Rehab Hub',
    assignedDoctor: 'Dr. Marcus Vance',
    lastActivity: '3 hours ago'
  },
  {
    id: 'pat-6',
    name: 'Diana Prince',
    mrn: 'MP-0077',
    age: 35,
    condition: 'Postpartum Hypertension',
    status: 'In Care',
    assignedClinic: 'London Heart & Vascular',
    assignedDoctor: 'Dr. Sarah Chen',
    lastActivity: '5 hours ago'
  },
  {
    id: 'pat-7',
    name: 'Edward Elric',
    mrn: 'MP-8891',
    age: 24,
    condition: 'Prosthetic Mobility Training',
    status: 'Active',
    assignedClinic: 'Physical Rehab Hub',
    assignedDoctor: 'Dr. Marcus Vance',
    lastActivity: '6 hours ago'
  },
  {
    id: 'pat-8',
    name: 'Fiona Gallagher',
    mrn: 'MP-4451',
    age: 29,
    condition: 'Depressive Disorder',
    status: 'Pending',
    assignedClinic: 'Mental Health Hub',
    assignedDoctor: 'Dr. Claire Redfield',
    lastActivity: '15 mins ago'
  },
  {
    id: 'pat-9',
    name: 'Gregory House',
    mrn: 'MP-0001',
    age: 59,
    condition: 'Chronic Pain Protocol',
    status: 'Discharged',
    assignedClinic: 'Specialist Diagnostics',
    assignedDoctor: 'Dr. Sarah Chen',
    lastActivity: '2 days ago'
  },
  {
    id: 'pat-10',
    name: 'Harley Quinn',
    mrn: 'MP-7781',
    age: 28,
    condition: 'Bipolar Support Scheme',
    status: 'In Care',
    assignedClinic: 'Mental Health Hub',
    assignedDoctor: 'Dr. Claire Redfield',
    lastActivity: '1 hour ago'
  },
  {
    id: 'pat-11',
    name: 'Iris West',
    mrn: 'MP-2081',
    age: 32,
    condition: 'Gestational Diabetes',
    status: 'Active',
    assignedClinic: 'North Diabetes Hub',
    assignedDoctor: 'Dr. Marcus Vance',
    lastActivity: '45 mins ago'
  },
  {
    id: 'pat-12',
    name: 'James Howlett',
    mrn: 'MP-0002',
    age: 41,
    condition: 'Skeletal Trauma Recovery',
    status: 'Discharged',
    assignedClinic: 'Physical Rehab Hub',
    assignedDoctor: 'Dr. Marcus Vance',
    lastActivity: '3 days ago'
  }
]

interface PatientManagementProps {
  globalSearch?: string
  onToast: (msg: string) => void
  onSelectPatient?: (patient: Patient) => void
}

export function PatientManagement({ globalSearch = '', onToast, onSelectPatient }: PatientManagementProps) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'In Care' | 'Pending' | 'Discharged'>('All')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Add Patient Modal State
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [newPatientName, setNewPatientName] = useState<string>('')
  const [newCondition, setNewCondition] = useState<string>('')
  const [newClinic, setNewClinic] = useState<string>('London Heart & Vascular')
  const [newDoctor, setNewDoctor] = useState<string>('Dr. Sarah Chen')
  const [newAge, setNewAge] = useState<number>(40)

  // Selected Patient Details Modal
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  // Filter counts
  const countAll = 2847
  const countActive = 1248
  const countInCare = 1142
  const countPending = 311
  const countDischarged = 146

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => {
      if (globalSearch) {
        const query = globalSearch.toLowerCase()
        const matches =
          pat.name.toLowerCase().includes(query) ||
          pat.mrn.toLowerCase().includes(query) ||
          pat.condition.toLowerCase().includes(query) ||
          pat.assignedClinic.toLowerCase().includes(query) ||
          pat.assignedDoctor.toLowerCase().includes(query)
        if (!matches) return false
      }

      if (statusFilter !== 'All' && pat.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [patients, globalSearch, statusFilter])

  // Toggle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredPatients.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleExport = () => {
    onToast(`✓ Exported ${filteredPatients.length} patient records (CSV/Excel)`)
  }

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPatientName.trim()) return

    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      name: newPatientName,
      mrn: `MP-${Math.floor(1000 + Math.random() * 9000)}`,
      age: newAge || 35,
      condition: newCondition || 'General Consultation',
      status: 'Active',
      assignedClinic: newClinic,
      assignedDoctor: newDoctor,
      lastActivity: 'Just now'
    }

    setPatients([newPat, ...patients])
    setIsAddOpen(false)
    setNewPatientName('')
    setNewCondition('')
    onToast(`✓ Added ${newPat.name} to patient registry!`)
  }

  const getStatusBadge = (status: Patient['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] border border-emerald-200">
            Active
          </span>
        )
      case 'In Care':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-sky-200">
            In Care
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] border border-amber-200">
            Pending
          </span>
        )
      case 'Discharged':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#475569] border border-slate-200">
            Discharged
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Row (from Figma: All Patients, 2,847 Total, Export List, + Add New Patient) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#08231A] tracking-tight">
            All Patients
          </h2>
          <span className="px-3 py-1 rounded-full bg-[#E2EFE7] text-[#0A3827] text-xs font-bold tracking-wide border border-[#CDE3D7]">
            2,847 Total
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all hover:border-slate-400"
          >
            <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export List</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white text-xs font-bold shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
          >
            <span>+ Add New Patient</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Tabs (from Figma screenshot) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'All'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600'
            }`}
          >
            All <span className="opacity-80 font-normal">({countAll})</span>
          </button>
          <button
            onClick={() => setStatusFilter('Active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'Active'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600'
            }`}
          >
            Active <span className="opacity-80 font-normal">({countActive})</span>
          </button>
          <button
            onClick={() => setStatusFilter('In Care')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'In Care'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600'
            }`}
          >
            In Care <span className="opacity-80 font-normal">({countInCare})</span>
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'Pending'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600'
            }`}
          >
            Pending <span className="opacity-80 font-normal">({countPending})</span>
          </button>
          <button
            onClick={() => setStatusFilter('Discharged')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'Discharged'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600'
            }`}
          >
            Discharged <span className="opacity-80 font-normal">({countDischarged})</span>
          </button>
        </div>

        {/* Advanced Filters Button */}
        <button
          onClick={() => onToast('Filter options applied')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-2xs"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="21" y2="21" />
            <line x1="4" x2="20" y1="14" y2="14" />
            <line x1="4" x2="20" y1="7" y2="7" />
            <circle cx="8" cy="7" r="2" />
            <circle cx="16" cy="14" r="2" />
            <circle cx="10" cy="21" r="2" />
          </svg>
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Patients Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FAFBF9] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredPatients.length && filteredPatients.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">MRN</th>
                <th className="py-3 px-3 text-center">Age</th>
                <th className="py-3 px-3">Condition</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Clinic</th>
                <th className="py-3 px-3">Assigned Doctor</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <IconSearch className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold text-slate-600">No patients found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pat) => (
                  <tr
                    key={pat.id}
                    className="hover:bg-emerald-50/20 transition-colors group"
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(pat.id)}
                        onChange={() => toggleSelectOne(pat.id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* Name */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onSelectPatient ? onSelectPatient(pat) : setSelectedPatient(pat)}
                        className="font-bold text-slate-900 hover:text-emerald-700 transition-colors text-left"
                      >
                        {pat.name}
                      </button>
                    </td>

                    {/* MRN */}
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {pat.mrn}
                    </td>

                    {/* Age */}
                    <td className="py-3 px-3 text-center text-slate-700">
                      {pat.age}
                    </td>

                    {/* Condition */}
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {pat.condition}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {getStatusBadge(pat.status)}
                    </td>

                    {/* Assigned Clinic */}
                    <td className="py-3 px-3 text-slate-600">
                      {pat.assignedClinic}
                    </td>

                    {/* Assigned Doctor */}
                    <td className="py-3 px-3 text-slate-800 font-medium">
                      {pat.assignedDoctor}
                    </td>

                    {/* Actions Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectPatient ? onSelectPatient(pat) : setSelectedPatient(pat)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 hover:text-emerald-700 transition-colors shadow-2xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium bg-[#FAFBF9]">
          <div>
            Showing <span className="font-bold text-slate-700">12</span> of{' '}
            <span className="font-bold text-slate-700">2,847</span> patients
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                currentPage === 1
                  ? 'bg-[#08231A] text-white shadow-2xs'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                currentPage === 2
                  ? 'bg-[#08231A] text-white shadow-2xs'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                currentPage === 3
                  ? 'bg-[#08231A] text-white shadow-2xs'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(238)}
              className={`px-2 h-7 rounded-lg font-bold text-xs transition-colors ${
                currentPage === 238
                  ? 'bg-[#08231A] text-white shadow-2xs'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              238
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(238, p + 1))}
              disabled={currentPage === 238}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail / Manage Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#08231A] p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {selectedPatient.mrn} • Outpatient Portal
                </span>
                <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Status</div>
                  <div className="mt-1">{getStatusBadge(selectedPatient.status)}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Patient Age</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">{selectedPatient.age} years</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Primary Clinical Diagnosis:</span>
                  <span className="text-slate-700">{selectedPatient.condition}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Assigned Facility & Physician:</span>
                  <span className="text-slate-700">{selectedPatient.assignedClinic} — {selectedPatient.assignedDoctor}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Last Portal Activity:</span>
                  <span className="text-slate-500">{selectedPatient.lastActivity}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onToast(`✓ Care plan updated for ${selectedPatient.name}`)
                    setSelectedPatient(null)
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#08231A] hover:bg-[#0E3A2C] text-white shadow-md transition-all active:scale-95"
                >
                  Open Virtual Ward Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Patient Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#08231A] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add New Patient</h3>
                <p className="text-xs text-emerald-400">Register new outpatient to MedPresence Ward</p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan Doe"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newAge}
                    onChange={(e) => setNewAge(parseInt(e.target.value) || 30)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Clinic</label>
                  <select
                    value={newClinic}
                    onChange={(e) => setNewClinic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="London Heart & Vascular">London Heart & Vascular</option>
                    <option value="North Diabetes Hub">North Diabetes Hub</option>
                    <option value="Cardio Specialist Clinic">Cardio Specialist Clinic</option>
                    <option value="Physical Rehab Hub">Physical Rehab Hub</option>
                    <option value="Mental Health Hub">Mental Health Hub</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Condition / Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension Monitoring"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attending Physician</label>
                <select
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
                  <option value="Dr. Marcus Vance">Dr. Marcus Vance</option>
                  <option value="Dr. Elena Stone">Dr. Elena Stone</option>
                  <option value="Dr. Claire Redfield">Dr. Claire Redfield</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#08231A] hover:bg-[#0E3A2C] text-white shadow-md transition-all active:scale-95"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
