import { useState, useMemo } from 'react'
import type { Doctor } from '../data/mockData'
import { IconCalendar, IconPlus, IconArrowRight, IconSearch } from './icons'

interface DoctorManagementProps {
  doctors: Doctor[]
  onViewDoctor: (doctor: Doctor) => void
  onAssignPatients: (doctor: Doctor) => void
  onAddDoctor: () => void
  onOpenDutyRoster: () => void
  globalSearch: string
}

export function DoctorManagement({
  doctors,
  onViewDoctor,
  onAssignPatients,
  onAddDoctor,
  onOpenDutyRoster,
  globalSearch
}: DoctorManagementProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Pending Verification'>('All')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All')
  const [selectedClinic, setSelectedClinic] = useState<string>('London Heart')
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Extract distinct specialties & clinics
  const specialties = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Mental Health', 'Diabetes & Endo', 'Stroke Rehab', 'Diagnostics', 'Endocrinology']
  const clinics = ['All Clinics', 'London Heart', 'Mayfair Clinic', 'Cambridge Health', 'Oxford Neuro']

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Global search
      if (globalSearch) {
        const query = globalSearch.toLowerCase()
        const matchesQuery =
          doc.name.toLowerCase().includes(query) ||
          doc.specialty.toLowerCase().includes(query) ||
          doc.licenseNo.toLowerCase().includes(query) ||
          doc.clinic.toLowerCase().includes(query)
        if (!matchesQuery) return false
      }

      // Status Filter
      if (statusFilter === 'Active' && doc.status !== 'Online') return false
      if (statusFilter === 'On Leave' && doc.status !== 'On Leave') return false
      if (statusFilter === 'Pending Verification' && doc.status !== 'Pending Verification') return false

      // Specialty Filter
      if (selectedSpecialty !== 'All' && doc.specialty !== selectedSpecialty) return false

      // Clinic Filter
      if (selectedClinic !== 'All Clinics' && doc.clinic !== selectedClinic) return false

      return true
    })
  }, [doctors, globalSearch, statusFilter, selectedSpecialty, selectedClinic])

  // Count helper
  const activeCount = doctors.filter((d) => d.status === 'Online').length
  const leaveCount = doctors.filter((d) => d.status === 'On Leave').length
  const pendingCount = doctors.filter((d) => d.status === 'Pending Verification').length

  const getStatusBadge = (status: Doctor['status']) => {
    switch (status) {
      case 'Online':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        )
      case 'On Leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            On Leave
          </span>
        )
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Offline
          </span>
        )
      case 'Pending Verification':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Pending Verification
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Section: Title, Stats Badge & Main Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#08231A] tracking-tight">
            Doctor Management
          </h2>
          <span className="px-3 py-1 rounded-full bg-[#E3F0E9] text-[#0A3827] text-xs font-bold tracking-wide border border-[#CDE3D7]">
            156 Total Doctors
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenDutyRoster}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-all hover:border-slate-400"
          >
            <IconCalendar className="w-4 h-4 text-slate-500" />
            <span>Duty Roster</span>
          </button>

          <button
            onClick={onAddDoctor}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white text-sm font-semibold shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
          >
            <IconPlus className="w-4 h-4 text-emerald-400" />
            <span>+ Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Segmented Pills & Dropdown Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'All'
                ? 'bg-[#08231A] text-white shadow-sm'
                : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            All Doctors
          </button>
          <button
            onClick={() => setStatusFilter('Active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'Active'
                ? 'bg-[#08231A] text-white shadow-sm'
                : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('On Leave')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'On Leave'
                ? 'bg-[#08231A] text-white shadow-sm'
                : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            On Leave ({leaveCount})
          </button>
          <button
            onClick={() => setStatusFilter('Pending Verification')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'Pending Verification'
                ? 'bg-[#08231A] text-white shadow-sm'
                : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            Pending Verification ({pendingCount})
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Specialty:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Clinic:</span>
            <select
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
              {clinics.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Doctors Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Doctor Name</th>
                <th className="py-3.5 px-4">Specialty</th>
                <th className="py-3.5 px-4">License No</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Active Patients</th>
                <th className="py-3.5 px-4 text-center">Today's Appt</th>
                <th className="py-3.5 px-4">Rating / Trend</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <IconSearch className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold text-slate-600">No doctors match your criteria</p>
                    <p className="text-xs text-slate-400">Try adjusting your search terms or filters</p>
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-emerald-50/30 transition-colors group"
                  >
                    {/* Doctor Name & Avatar */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div
                            onClick={() => onViewDoctor(doc)}
                            className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
                          >
                            {doc.name}
                          </div>
                          <div className="text-xs text-slate-400 font-normal">
                            {doc.clinic} • {doc.room}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs sm:text-sm">
                      {doc.specialty}
                    </td>

                    {/* License No */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                      {doc.licenseNo}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(doc.status)}
                    </td>

                    {/* Active Patients */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {doc.activePatients}
                    </td>

                    {/* Today's Appt */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block font-semibold px-2 py-0.5 rounded ${
                        doc.todayAppts > 0 ? 'bg-slate-100 text-slate-800 text-xs' : 'text-slate-400 text-xs'
                      }`}>
                        {doc.todayAppts}
                      </span>
                    </td>

                    {/* Rating / Trend */}
                    <td className="py-3.5 px-4">
                      {doc.rating > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500 text-xs">★</span>
                          <span className="font-bold text-slate-800 text-xs">{doc.rating}</span>
                          {doc.ratingTrend && (
                            <span className={`text-[10px] font-semibold px-1 rounded ${
                              doc.ratingTrend.startsWith('+')
                                ? 'text-emerald-700 bg-emerald-50'
                                : doc.ratingTrend.startsWith('-')
                                ? 'text-rose-700 bg-rose-50'
                                : 'text-slate-500 bg-slate-50'
                            }`}>
                              {doc.ratingTrend}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Under Review</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => onAssignPatients(doc)}
                          className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          Assign Patients
                        </button>
                        <button
                          onClick={() => onViewDoctor(doc)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <span>View Profile</span>
                          <IconArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium bg-slate-50/50">
          <div>
            Showing <span className="font-bold text-slate-700">{filteredDoctors.length}</span> of{' '}
            <span className="font-bold text-slate-700">156</span> clinical doctors
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                  currentPage === page
                    ? 'bg-[#08231A] text-white shadow-sm'
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              disabled={currentPage === 3}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
