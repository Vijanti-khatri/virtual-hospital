import { useState, type FormEvent } from 'react'
import type { Doctor } from '../data/mockData'
import { IconClose } from './icons'

interface AddDoctorModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (newDoc: Doctor) => void
}

export function AddDoctorModal({ isOpen, onClose, onAdd }: AddDoctorModalProps) {
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('Cardiology')
  const [clinic, setClinic] = useState('London Heart')
  const [licenseNo, setLicenseNo] = useState('')
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      specialty,
      licenseNo: licenseNo || `LIC-${Math.floor(10000 + Math.random() * 90000)}-K`,
      status: 'Online',
      activePatients: 0,
      todayAppts: 0,
      rating: 5.0,
      ratingTrend: 'New',
      clinic,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@medpresence.clinic`,
      phone: '+44 20 7946 0000',
      room: room || 'Suite 101',
      shift: '08:00 - 17:00',
      bio: `Consultant in ${specialty} at ${clinic} facility.`
    }

    onAdd(newDoc)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#08231A] p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Add Clinical Doctor</h3>
            <p className="text-xs text-emerald-400">MedPresence Clinical Roster Onboarding</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Alexander Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialty</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Diabetes & Endo">Diabetes & Endo</option>
                <option value="Stroke Rehab">Stroke Rehab</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Clinic</label>
              <select
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="London Heart">London Heart</option>
                <option value="Mayfair Clinic">Mayfair Clinic</option>
                <option value="Cambridge Health">Cambridge Health</option>
                <option value="Oxford Neuro">Oxford Neuro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">License No</label>
              <input
                type="text"
                placeholder="LIC-89410-X"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Room / Suite</label>
              <input
                type="text"
                placeholder="Suite 302"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
            <input
              type="email"
              placeholder="doctor@medpresence.clinic"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#08231A] hover:bg-[#0E3A2C] text-white shadow-md transition-all active:scale-95"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
