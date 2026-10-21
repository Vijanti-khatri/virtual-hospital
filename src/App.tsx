import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { HospitalDashboard } from './components/HospitalDashboard'
import { PatientManagement } from './components/PatientManagement'
import { PatientDetail } from './components/PatientDetail'
import { DoctorManagement } from './components/DoctorManagement'
import { IntegrationDashboard } from './components/IntegrationDashboard'
import { DoctorModal } from './components/DoctorModal'
import { AddDoctorModal } from './components/AddDoctorModal'
import { DutyRosterModal } from './components/DutyRosterModal'
import { AssignPatientModal } from './components/AssignPatientModal'
import { INITIAL_DOCTORS, type Doctor } from './data/mockData'

export function App() {
  const [activeTab, setActiveTab] = useState<string>('integration')
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)
  const [globalSearch, setGlobalSearch] = useState<string>('')
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS)
  const [selectedPatientDetail, setSelectedPatientDetail] = useState<any>(null)

  // Modals state
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null)
  const [assignDoctor, setAssignDoctor] = useState<Doctor | null>(null)
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState<boolean>(false)
  const [isDutyRosterOpen, setIsDutyRosterOpen] = useState<boolean>(false)

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleAddDoctor = (newDoc: Doctor) => {
    setDoctors([newDoc, ...doctors])
    showToast(`✓ ${newDoc.name} successfully added to the roster!`)
  }

  const handleAssignSuccess = (doctorId: string, count: number) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === doctorId
          ? { ...doc, activePatients: doc.activePatients + count, todayAppts: doc.todayAppts + count }
          : doc
      )
    )
    const targetDoc = doctors.find((d) => d.id === doctorId)
    showToast(`✓ Assigned ${count} patient(s) to ${targetDoc?.name || 'Doctor'}`)
  }

  // Dynamic Header Titles
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'integration':
        return {
          title: 'Connected Health & Integration Management',
          subtitle: 'MedPresence Unified Clinical & Third-Party Integration Command Center'
        }
      case 'dashboard':
        return {
          title: 'Hospital Operations',
          subtitle: 'MedPresence Unified Clinical & AI Operations Command Center'
        }
      case 'patients':
        if (selectedPatientDetail) {
          return {
            title: `${selectedPatientDetail.name} • ${selectedPatientDetail.mrn}`,
            subtitle: 'Outpatient Portal & Virtual Ward Clinical Chart'
          }
        }
        return {
          title: 'Patient Management',
          subtitle: 'System Registry of Outpatient Portals and Virtual Wards'
        }
      default:
        return {
          title: 'Doctor Command Console',
          subtitle: 'MedPresence Active Clinical Doctor Directory & Allocation Control'
        }
    }
  }

  const headerInfo = getHeaderInfo()

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#08231A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar (Dark Pine `#072118` from Figma) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          statusBadge={activeTab === 'integration' ? 'GATEWAY ONLINE' : 'ALL CLINICS ONLINE'}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <HospitalDashboard />
          )}

          {activeTab === 'patients' && (
            selectedPatientDetail ? (
              <PatientDetail
                patientData={selectedPatientDetail}
                onBack={() => setSelectedPatientDetail(null)}
                onToast={showToast}
              />
            ) : (
              <PatientManagement
                globalSearch={globalSearch}
                onToast={showToast}
                onSelectPatient={(pat) => setSelectedPatientDetail(pat)}
              />
            )
          )}

          {activeTab === 'doctors' && (
            <DoctorManagement
              doctors={doctors}
              onViewDoctor={(doc) => setViewDoctor(doc)}
              onAssignPatients={(doc) => setAssignDoctor(doc)}
              onAddDoctor={() => setIsAddDoctorOpen(true)}
              onOpenDutyRoster={() => setIsDutyRosterOpen(true)}
              globalSearch={globalSearch}
            />
          )}

          {activeTab === 'integration' && (
            <IntegrationDashboard onToast={showToast} />
          )}

          {/* Quick placeholder views for remaining menu items to keep UX smooth */}
          {activeTab !== 'dashboard' && activeTab !== 'patients' && activeTab !== 'doctors' && activeTab !== 'integration' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center py-16 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                🏥
              </div>
              <h3 className="text-xl font-bold text-[#08231A] capitalize">
                {activeTab.replace('-', ' ')} Module
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                This clinical module is synchronized with the MedPresence Clinical Core.
                You can switch back to the Doctor Command Console or Integrations anytime.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="px-5 py-2.5 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white text-xs font-bold shadow-md transition-all"
                >
                  Return to Doctor Management →
                </button>
                <button
                  onClick={() => setActiveTab('integration')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                >
                  View Integrations Hub
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <DoctorModal
        doctor={viewDoctor}
        onClose={() => setViewDoctor(null)}
        onAssignPatients={(doc) => setAssignDoctor(doc)}
      />

      <AssignPatientModal
        doctor={assignDoctor}
        onClose={() => setAssignDoctor(null)}
        onAssignSuccess={handleAssignSuccess}
      />

      <AddDoctorModal
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        onAdd={handleAddDoctor}
      />

      <DutyRosterModal
        isOpen={isDutyRosterOpen}
        onClose={() => setIsDutyRosterOpen(false)}
      />
    </div>
  )
}

export default App
