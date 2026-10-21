import type { Doctor } from '../data/mockData'
import { IconClose } from './icons'

interface DoctorModalProps {
  doctor: Doctor | null
  onClose: () => void
  onAssignPatients: (doctor: Doctor) => void
}

export function DoctorModal({ doctor, onClose, onAssignPatients }: DoctorModalProps) {
  if (!doctor) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#08231A] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400/50 shadow-md"
            />
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                {doctor.specialty}
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {doctor.name}
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                {doctor.licenseNo} • {doctor.clinic}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Vitals Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Status</div>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">{doctor.status}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Active Patients</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">{doctor.activePatients}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Clinical Rating</div>
              <div className="text-sm font-bold text-amber-600 mt-0.5">
                ★ {doctor.rating > 0 ? doctor.rating : 'N/A'}
              </div>
            </div>
          </div>

          {/* Clinical Details */}
          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900 block mb-1">Clinical Specialization & Bio:</span>
              <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                {doctor.bio}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="font-bold text-slate-700 block">Duty Shift & Room:</span>
                <span className="text-slate-600 font-medium">{doctor.shift} ({doctor.room})</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Contact & Direct Line:</span>
                <span className="text-slate-600 font-medium">{doctor.email}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onAssignPatients(doctor)
                onClose()
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#08231A] hover:bg-[#0E3A2C] text-white shadow-md transition-all active:scale-95"
            >
              Assign Patients Directly
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
