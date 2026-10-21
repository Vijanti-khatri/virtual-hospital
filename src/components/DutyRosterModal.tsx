import { IconClose } from './icons'

interface DutyRosterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DutyRosterModal({ isOpen, onClose }: DutyRosterModalProps) {
  if (!isOpen) return null

  const roster = [
    { shift: 'Morning (07:00 - 15:00)', doctor: 'Dr. Sarah Jenkins', clinic: 'London Heart', room: 'Suite 402', status: 'Active' },
    { shift: 'Morning (07:30 - 16:30)', doctor: 'Dr. Claire Redfield', clinic: 'London Heart', room: 'Recovery Unit', status: 'Active' },
    { shift: 'Day (09:00 - 18:00)', doctor: 'Dr. Robert Chen', clinic: 'London Heart', room: 'Neuro 210', status: 'Active' },
    { shift: 'Day (10:00 - 19:00)', doctor: 'Dr. Marcus Vance', clinic: 'Cambridge Health', room: 'Tele-512', status: 'Active' },
    { shift: 'Evening (15:00 - 23:00)', doctor: 'Dr. Jonathan Joestar', clinic: 'London Heart', room: 'Cath Lab 2', status: 'Scheduled' },
    { shift: 'Night On-Call (23:00 - 07:00)', doctor: 'Dr. Gregory House', clinic: 'Cambridge Health', room: 'Diagnostic Lab', status: 'On-Call' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#08231A] p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Clinical Duty Roster</h3>
            <p className="text-xs text-emerald-400">Weekly Shift Allocations & Emergency Coverage</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pb-2 border-b border-slate-100">
            <span>Today's Rotation Schedule</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Shift Cycle #41-B
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {roster.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{item.doctor}</div>
                  <div className="text-slate-400 font-medium">{item.shift} • {item.clinic} ({item.room})</div>
                </div>

                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  item.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : item.status === 'Scheduled'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#08231A] hover:bg-[#0E3A2C] text-white shadow-md transition-all"
            >
              Close Roster
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
