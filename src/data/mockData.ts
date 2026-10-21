export interface Doctor {
  id: string
  name: string
  avatar: string
  specialty: string
  licenseNo: string
  status: 'Online' | 'On Leave' | 'Offline' | 'Pending Verification'
  activePatients: number
  todayAppts: number
  rating: number
  ratingTrend?: string
  clinic: string
  email: string
  phone: string
  room: string
  shift: string
  bio: string
}

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Cardiology',
    licenseNo: 'LIC-60325-A',
    status: 'Online',
    activePatients: 42,
    todayAppts: 8,
    rating: 4.9,
    ratingTrend: '+12%',
    clinic: 'London Heart',
    email: 's.jenkins@medpresence.clinic',
    phone: '+44 20 7946 0912',
    room: 'Suite 402 - Wing B',
    shift: '08:00 - 17:00 (Active)',
    bio: 'Senior Consultant Interventional Cardiologist specializing in acute coronary syndromes and advanced hemodynamic monitoring.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Robert Chen',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Neurology',
    licenseNo: 'LIC-74020-B',
    status: 'Online',
    activePatients: 38,
    todayAppts: 6,
    rating: 4.8,
    ratingTrend: '+8%',
    clinic: 'London Heart',
    email: 'r.chen@medpresence.clinic',
    phone: '+44 20 7946 0884',
    room: 'Suite 210 - Neuro Center',
    shift: '09:00 - 18:00 (Active)',
    bio: 'Neuro-critical care specialist with expertise in acute ischemic stroke and neuromuscular disorders.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1594824813575-f094eb2df43a?w=150&auto=format&fit=crop&q=80',
    specialty: 'Pediatrics',
    licenseNo: 'LIC-92019-C',
    status: 'On Leave',
    activePatients: 0,
    todayAppts: 0,
    rating: 4.95,
    ratingTrend: 'Stable',
    clinic: 'Mayfair Clinic',
    email: 'e.rostova@medpresence.clinic',
    phone: '+44 20 7946 0341',
    room: 'Suite 105 - Pediatric Ward',
    shift: 'Annual Clinical Sabbatical',
    bio: 'Pediatric intensivist focused on neonatal resuscitation protocols and infant developmental screenings.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    specialty: 'Mental Health',
    licenseNo: 'LIC-55421-M',
    status: 'Online',
    activePatients: 51,
    todayAppts: 9,
    rating: 4.7,
    ratingTrend: '+5%',
    clinic: 'Cambridge Health',
    email: 'm.vance@medpresence.clinic',
    phone: '+44 20 7946 0772',
    room: 'Suite 512 - Tele-Consult',
    shift: '10:00 - 19:00 (Active)',
    bio: 'Psychiatrist and telemedicine therapist focusing on acute stress management, PTSD, and cognitive wellness.'
  },
  {
    id: 'doc-5',
    name: 'Dr. David Kim',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
    specialty: 'Diabetes & Endo',
    licenseNo: 'LIC-11078-D',
    status: 'Offline',
    activePatients: 29,
    todayAppts: 0,
    rating: 4.6,
    ratingTrend: '-2%',
    clinic: 'Oxford Neuro',
    email: 'd.kim@medpresence.clinic',
    phone: '+44 20 7946 0199',
    room: 'Suite 304 - Metabolic Clinic',
    shift: 'Off-Duty (Resumes Tomorrow 08:00)',
    bio: 'Endocrinology consultant working on continuous glucose telemetry and metabolic disorder management.'
  },
  {
    id: 'doc-6',
    name: 'Dr. Claire Redfield',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Stroke Rehab',
    licenseNo: 'LIC-65381-R',
    status: 'Online',
    activePatients: 33,
    todayAppts: 5,
    rating: 4.9,
    ratingTrend: '+15%',
    clinic: 'London Heart',
    email: 'c.redfield@medpresence.clinic',
    phone: '+44 20 7946 0411',
    room: 'Suite 201 - Recovery Unit',
    shift: '07:30 - 16:30 (Active)',
    bio: 'Neuro-rehabilitation physiatrist directing post-stroke recovery pathways and kinetic mobility therapy.'
  },
  {
    id: 'doc-7',
    name: 'Dr. Jonathan Joestar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Cardiology',
    licenseNo: 'LIC-00101-J',
    status: 'Online',
    activePatients: 45,
    todayAppts: 7,
    rating: 4.85,
    ratingTrend: '+10%',
    clinic: 'London Heart',
    email: 'j.joestar@medpresence.clinic',
    phone: '+44 20 7946 0622',
    room: 'Cath Lab 2 & Suite 408',
    shift: '08:30 - 17:30 (Active)',
    bio: 'Fellow in cardiovascular surgery with focus on transcatheter valve replacement and preventative cardiology.'
  },
  {
    id: 'doc-8',
    name: 'Dr. Lisa Cuddy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Endocrinology',
    licenseNo: 'LIC-89127-C',
    status: 'On Leave',
    activePatients: 0,
    todayAppts: 0,
    rating: 4.9,
    ratingTrend: 'Stable',
    clinic: 'Mayfair Clinic',
    email: 'l.cuddy@medpresence.clinic',
    phone: '+44 20 7946 0553',
    room: 'Suite 310 - Medical Admin',
    shift: 'Conference Duty',
    bio: 'Medical Director and endocrinologist directing clinical audits and hormone replacement clinical protocols.'
  },
  {
    id: 'doc-9',
    name: 'Dr. Gregory House',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    specialty: 'Diagnostics',
    licenseNo: 'LIC-44028-H',
    status: 'Online',
    activePatients: 12,
    todayAppts: 3,
    rating: 5.0,
    ratingTrend: '+30%',
    clinic: 'Cambridge Health',
    email: 'g.house@medpresence.clinic',
    phone: '+44 20 7946 0990',
    room: 'Diagnostic Lab D4',
    shift: 'Flexible Clinical Diagnostic Call',
    bio: 'Head of Diagnostic Medicine specializing in rare pathologies, infectious disease etiology, and nephrology.'
  },
  {
    id: 'doc-10',
    name: 'Dr. Stephen Strange',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Neurology',
    licenseNo: 'LIC-19378-S',
    status: 'Online',
    activePatients: 15,
    todayAppts: 4,
    rating: 4.9,
    ratingTrend: '+18%',
    clinic: 'Oxford Neuro',
    email: 's.strange@medpresence.clinic',
    phone: '+44 20 7946 0833',
    room: 'OR 1 - Neuro Microsurgery',
    shift: '07:00 - 15:00 (Active)',
    bio: 'Consultant neurosurgeon specializing in complex cerebral vascular malformations and stereotactic surgery.'
  },
  {
    id: 'doc-11',
    name: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Mental Health',
    licenseNo: 'LIC-33291-T',
    status: 'Pending Verification',
    activePatients: 0,
    todayAppts: 0,
    rating: 0,
    ratingTrend: 'Awaiting Board',
    clinic: 'London Heart',
    email: 'a.thorne@medpresence.clinic',
    phone: '+44 20 7946 0271',
    room: 'Pending Onboarding',
    shift: 'Credentialing in progress',
    bio: 'Incoming child and adolescent psychologist completing NHS and MedPresence credentialing verification.'
  },
  {
    id: 'doc-12',
    name: 'Dr. Evelyn Miller',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    specialty: 'Pediatrics',
    licenseNo: 'LIC-77110-E',
    status: 'Online',
    activePatients: 36,
    todayAppts: 6,
    rating: 4.75,
    ratingTrend: '+4%',
    clinic: 'Mayfair Clinic',
    email: 'e.miller@medpresence.clinic',
    phone: '+44 20 7946 0495',
    room: 'Suite 108 - Child Health',
    shift: '08:00 - 16:30 (Active)',
    bio: 'General pediatrician and pediatric allergy specialist with an emphasis on asthma management protocols.'
  }
]

export const INTEGRATION_CATEGORIES = [
  { name: 'Patient Identity', count: 4, status: 'healthy', speed: '12ms' },
  { name: 'Authentication', count: 3, status: 'healthy', speed: '9ms' },
  { name: 'Payments', count: 2, status: 'healthy', speed: '24ms' },
  { name: 'Messaging', count: 6, status: 'healthy', speed: '18ms' },
  { name: 'Health Data', count: 8, status: 'healthy', speed: '31ms' },
  { name: 'Wearables', count: 4, status: 'healthy', speed: '44ms' },
  { name: 'Pharmacy', count: 3, status: 'healthy', speed: '16ms' },
  { name: 'Referrals', count: 2, status: 'healthy', speed: '28ms' },
  { name: 'Analytics', count: 3, status: 'healthy', speed: '40ms' }
]

export const HOURLY_THROUGHPUT = [
  { time: '00h', val: 24 },
  { time: '02h', val: 18 },
  { time: '04h', val: 12 },
  { time: '06h', val: 32 },
  { time: '08h', val: 68 },
  { time: '10h', val: 94 },
  { time: '12h', val: 86 },
  { time: '14h', val: 98 },
  { time: '16h', val: 92 },
  { time: '18h', val: 78 },
  { time: '20h', val: 62 },
  { time: '22h', val: 45 },
]

export const RECENT_LOGS = [
  { time: '14:32:10', type: 'PATIENT', text: 'HL7 ADT payload ingested from NHS Spine gateway', status: 'SUCCESS' },
  { time: '14:28:45', type: 'AUTH', text: 'OAuth2 credential rotation completed for Epic Systems', status: 'SUCCESS' },
  { time: '14:25:12', type: 'WEARABLE', text: 'Apple HealthKit batch sync processed (1,240 events)', status: 'SUCCESS' },
  { time: '14:18:03', type: 'PAYMENTS', text: 'Stripe Billing webhook acknowledgement latency 28ms', status: 'SUCCESS' },
  { time: '13:59:22', type: 'PHARMACY', text: 'e-Prescription dispatch token validated by Boots Central', status: 'SUCCESS' },
  { time: '13:45:19', type: 'HEALTH DATA', text: 'DICOM imaging pipeline telemetry verified at 1.2 Gbps', status: 'SUCCESS' },
]
