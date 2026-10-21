import { useState } from 'react'
import type { Doctor } from '../data/mockData'
import { IconClose } from './icons'

interface AssignPatientModalProps {
  doctor: Doctor | null
  onClose: () => void
  onAssignSuccess: (doctorId: string, count: number) => void
}

export function AssignPatientModal({ doctor, onClose, onAssignSuccess }: AssignPatientModalProps) {
  const [patientCount, setPatientCount] = useState<number>(1)
  const [priority, setPriority] = useState<string>('Standard Routine')

  if (!doctor) return null

  const handleConfirm = () => {
    onAssignSuccess(doctor.id, patientCount)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#08231A] p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Assign Clinical Patients</h3>
            <p className="text-xs text-emerald-400">Target: {doctor.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Current Active Caseload:</span>
            <span className="font-bold text-slate-800">{doctor.activePatients} Patients</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Number of Incoming Triage Patients:
            </label>
            <input
              type="number"
              min="1"
              max="15"
              value={patientCount}
              onChange={(e) => setPatientCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Acuity / Priority Level:
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Urgent Cardiac / Stroke">Urgent Priority (Next 30 min)</option>
              <option value="Specialist Referral">Specialist Referral</option>
              <option value="Standard Routine">Standard Routine Follow-up</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#08231A] hover:bg-[#0E3A2C] text-white shadow-md transition-all active:scale-95"
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
