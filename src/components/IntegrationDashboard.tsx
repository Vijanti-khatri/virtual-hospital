import { useState } from 'react'
import { HOURLY_THROUGHPUT } from '../data/mockData'
import { IconPause, IconPlay, IconEdit, IconTrash, IconClose } from './icons'

interface IntegrationDashboardProps {
  onToast?: (msg: string) => void
}

export interface WebhookItem {
  id: string
  url: string
  events: string[]
  status: 'Active' | 'Paused' | 'Failed'
  successRate: string
  lastTriggered: string
}

export interface DeliveryLogItem {
  id: string
  event: string
  statusCode: string
  statusCodeType: 'success' | 'created' | 'warning' | 'error'
  targetEndpoint: string
  deliveryTime: string
  retryCount: string
  retryFailed?: boolean
}

const INITIAL_WEBHOOKS: WebhookItem[] = [
  {
    id: 'wh-1',
    url: 'https://api.carenetworks.org/v1/webhooks/presence',
    events: ['patient.admit', 'patient.discharge'],
    status: 'Active',
    successRate: '99.8%',
    lastTriggered: '2 mins ago'
  },
  {
    id: 'wh-2',
    url: 'https://ehr-gateway.stjude.local/receiver/ingress',
    events: ['clinical.vital_signs'],
    status: 'Active',
    successRate: '98.4%',
    lastTriggered: '12 mins ago'
  },
  {
    id: 'wh-3',
    url: 'https://billing.medpresence.com/hooks/stripe',
    events: ['invoice.paid', 'payment.failed'],
    status: 'Paused',
    successRate: '100.0%',
    lastTriggered: '1 hour ago'
  },
  {
    id: 'wh-4',
    url: 'https://internal-telemetry.medpresence.io/ingest',
    events: ['wearable.heart_rate', 'wearable.sleep'],
    status: 'Failed',
    successRate: '82.1%',
    lastTriggered: '14 mins ago'
  }
]

const INITIAL_DELIVERY_LOGS: DeliveryLogItem[] = [
  {
    id: 'log-1',
    event: 'patient.admit',
    statusCode: '200 OK',
    statusCodeType: 'success',
    targetEndpoint: 'https://api.carenetworks.org/v1/webhooks/presence',
    deliveryTime: 'Jan 26, 2026, 14:32:10',
    retryCount: '0'
  },
  {
    id: 'log-2',
    event: 'clinical.vital_signs',
    statusCode: '201 Created',
    statusCodeType: 'created',
    targetEndpoint: 'https://ehr-gateway.stjude.local/receiver/ingress',
    deliveryTime: 'Jan 26, 2026, 14:30:15',
    retryCount: '0'
  },
  {
    id: 'log-3',
    event: 'wearable.heart_rate',
    statusCode: '504 Timeout',
    statusCodeType: 'warning',
    targetEndpoint: 'https://internal-telemetry.medpresence.io/ingest',
    deliveryTime: 'Jan 26, 2026, 14:28:02',
    retryCount: '3 (Failed)',
    retryFailed: true
  },
  {
    id: 'log-4',
    event: 'patient.discharge',
    statusCode: '200 OK',
    statusCodeType: 'success',
    targetEndpoint: 'https://api.carenetworks.org/v1/webhooks/presence',
    deliveryTime: 'Jan 26, 2026, 14:25:40',
    retryCount: '0'
  },
  {
    id: 'log-5',
    event: 'clinical.vital_signs',
    statusCode: '400 Bad Req',
    statusCodeType: 'warning',
    targetEndpoint: 'https://ehr-gateway.stjude.local/receiver/ingress',
    deliveryTime: 'Jan 26, 2026, 14:21:12',
    retryCount: '1'
  }
]

const CATEGORIES_12 = [
  { name: 'Patient Identity', count: 4 },
  { name: 'Authentication', count: 3 },
  { name: 'Payments', count: 2 },
  { name: 'Video Consultation', count: 5 },
  { name: 'Messaging', count: 6 },
  { name: 'Health Data', count: 8 },
  { name: 'Wearables', count: 4 },
  { name: 'Lab Systems', count: 5 },
  { name: 'Pharmacy', count: 3 },
  { name: 'Referrals', count: 2 },
  { name: 'Analytics', count: 3 },
  { name: 'Cloud', count: 2 }
]

const INTEGRATION_FEED = [
  {
    time: '14:32',
    tag: 'PATIENT',
    tagClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    text: 'Epic FHIR patient sync successfully completed for 124 records.'
  },
  {
    time: '14:28',
    tag: 'AUTH',
    tagClass: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    text: 'Auth0 OAuth security token successfully rotated for NHS Spine.'
  },
  {
    time: '14:15',
    tag: 'WEARABLE',
    tagClass: 'bg-amber-100 text-amber-800 border-amber-300',
    text: 'Fitbit sync warning: Connection timeout on Gateway #04 retry.'
  },
  {
    time: '13:58',
    tag: 'PAYMENTS',
    tagClass: 'bg-amber-50 text-amber-700 border-amber-200',
    text: 'Stripe webhook endpoint failure: an acknowledgment latency exceeded.'
  },
  {
    time: '13:42',
    tag: 'PHARMACY',
    tagClass: 'bg-amber-50 text-amber-700 border-amber-200',
    text: 'Surescripts E-Prescription gateway dispatched token verified.'
  }
]

export function IntegrationDashboard({ onToast = () => {} }: IntegrationDashboardProps) {
  // Navigation view: 'webhooks' (Current Screenshot) | 'services' | 'catalog' | 'config' | 'metrics'
  const [activeSubView, setActiveSubView] = useState<'webhooks' | 'services' | 'catalog' | 'config' | 'metrics'>('webhooks')

  // Webhooks state (Latest Screenshot)
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(INITIAL_WEBHOOKS)
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLogItem[]>(INITIAL_DELIVERY_LOGS)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false)

  // Register Webhook Form State
  const [newUrl, setNewUrl] = useState<string>('https://')
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['patient.admit'])
  const [newSecret] = useState<string>('whsec_live_9a82e7c41df39021b0e4')
  const [sslEnabled, setSslEnabled] = useState<boolean>(true)

  // Search & Filter state for catalog
  const [catalogSearch, setCatalogSearch] = useState<string>('')
  const [catalogCategory, setCatalogCategory] = useState<string>('All')

  // Filter state for services
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('All Categories')
  const [serviceStatusFilter, setServiceStatusFilter] = useState<string>('All Live')

  // Config view state
  const [configEnv, setConfigEnv] = useState<'Production' | 'Staging' | 'Development'>('Production')
  const [masterSwitch, setMasterSwitch] = useState<boolean>(true)
  const [retryBackoff, setRetryBackoff] = useState<boolean>(true)
  const [configTab, setConfigTab] = useState<'Settings' | 'Endpoints' | 'Authentication' | 'Data Mapping' | 'Logs'>('Settings')

  // Webhook action handlers
  const handleToggleWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((wh) => {
        if (wh.id === id) {
          if (wh.status === 'Active') {
            onToast(`Webhook paused: ${wh.url}`)
            return { ...wh, status: 'Paused' }
          } else {
            onToast(`Webhook activated: ${wh.url}`)
            return { ...wh, status: 'Active' }
          }
        }
        return wh
      })
    )
  }

  const handleDeleteWebhook = (id: string) => {
    const target = webhooks.find((w) => w.id === id)
    setWebhooks((prev) => prev.filter((w) => w.id !== id))
    onToast(`Webhook removed: ${target?.url || id}`)
  }

  const handleTestPingWebhook = (wh: WebhookItem) => {
    const now = new Date()
    const timeStr = `Jan 26, 2026, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    const newLog: DeliveryLogItem = {
      id: `log-${Date.now()}`,
      event: wh.events[0] || 'patient.admit',
      statusCode: '200 OK',
      statusCodeType: 'success',
      targetEndpoint: wh.url,
      deliveryTime: timeStr,
      retryCount: '0'
    }
    setDeliveryLogs([newLog, ...deliveryLogs])
    onToast(`✓ Test payload dispatched to ${wh.url} (200 OK - 24ms)`)
  }

  const handleRegisterWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl || newUrl === 'https://') {
      onToast('Please provide a valid HTTPS endpoint URL')
      return
    }
    if (selectedEvents.length === 0) {
      onToast('Select at least one clinical event to subscribe')
      return
    }

    const created: WebhookItem = {
      id: `wh-${Date.now()}`,
      url: newUrl,
      events: selectedEvents,
      status: 'Active',
      successRate: '100.0%',
      lastTriggered: 'Just now'
    }

    setWebhooks([created, ...webhooks])
    setIsRegisterModalOpen(false)
    setNewUrl('https://')
    setSelectedEvents(['patient.admit'])
    onToast(`✓ New webhook registered: ${newUrl}`)
  }

  const toggleEventSelection = (eventName: string) => {
    if (selectedEvents.includes(eventName)) {
      setSelectedEvents(selectedEvents.filter((ev) => ev !== eventName))
    } else {
      setSelectedEvents([...selectedEvents, eventName])
    }
  }

  // Connectors list (Screenshot 1)
  const availableConnectors = [
    {
      id: 'auth0',
      letter: 'A',
      name: 'Auth0 Identity',
      category: 'Identity',
      desc: 'Secure medical staff login, MFA validation, and Single Sign-On implementation.',
      status: 'Operational',
      connected: true
    },
    {
      id: 'stripe',
      letter: 'S',
      name: 'Stripe Healthcare',
      category: 'Payments',
      desc: 'Process co-pays, deductible collection, and clinical billing securely.',
      status: 'Disconnected',
      connected: false
    },
    {
      id: 'twilio',
      letter: 'T',
      name: 'Twilio API',
      category: 'Communication',
      desc: 'Patient SMS reminders, OTP authorizations, and fallback notifications.',
      status: 'Operational',
      connected: true
    },
    {
      id: 'zoom',
      letter: 'Z',
      name: 'Zoom Video',
      category: 'Communication',
      desc: 'High-definition telemedicine consultations and virtual clinical workflows.',
      status: 'Operational',
      connected: true
    },
    {
      id: 'fitbit',
      letter: 'F',
      name: 'Fitbit Web API',
      category: 'Clinical',
      desc: 'Continuous ingestion of patient active heart rate, sleep stages, and telemetry.',
      status: 'Operational',
      connected: true
    },
    {
      id: 'labcorp',
      letter: 'L',
      name: 'LabCorp Diagnostics',
      category: 'Clinical',
      desc: 'Direct diagnostic lab result piping directly into patient care pathway timelines.',
      status: 'Disconnected',
      connected: false
    },
    {
      id: 'surescripts',
      letter: 'S',
      name: 'Surescripts',
      category: 'Clinical',
      desc: 'National e-prescription and medication history routing for pharmacies.',
      status: 'Disconnected',
      connected: false
    },
    {
      id: 'gcp',
      letter: 'G',
      name: 'Google Cloud Healthcare',
      category: 'Infrastructure',
      desc: 'De-identify and export FHIR clinical logs to BigQuery for population analytics.',
      status: 'Disconnected',
      connected: false
    }
  ]

  // Filtered connectors for catalog
  const filteredConnectors = availableConnectors.filter((c) => {
    if (catalogCategory !== 'All' && c.category !== catalogCategory) return false
    if (catalogSearch) {
      const q = catalogSearch.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    }
    return true
  })

  // Services data (Screenshot 2)
  const serviceGroups = [
    {
      group: 'CLINICAL EHR & DATA SYSTEMS',
      count: 4,
      items: [
        {
          name: 'Epic FHIR Gateway',
          category: 'Clinical EHR',
          status: 'CONNECTED',
          statusClass: 'bg-[#DCFCE7] text-[#15803D] border border-emerald-200',
          lastSync: '2 mins ago',
          volume: '420.5k msgs/day',
          isConfigurable: true
        },
        {
          name: 'Apple HealthKit Clinical',
          category: 'Health Data',
          status: 'HEALTHY',
          statusClass: 'bg-[#DCFCE7] text-[#15803D] border border-emerald-200',
          lastSync: '15 mins ago',
          volume: '1.2M records/day',
          isConfigurable: true
        },
        {
          name: 'LabCorp Systems',
          category: 'Lab & Diagnostics',
          status: 'WARNING',
          statusClass: 'bg-[#FEF3C7] text-[#B45309] border border-amber-200',
          lastSync: '3 hours ago',
          volume: '14.2k results/day',
          isConfigurable: true
        },
        {
          name: 'Surescripts E-Prescribe',
          category: 'Pharmacy Services',
          status: 'ERROR',
          statusClass: 'bg-[#FEE2E2] text-[#B91C1C] border border-rose-200',
          lastSync: 'Failed 12 mins ago',
          volume: '0 msgs/day',
          isConfigurable: true
        }
      ]
    },
    {
      group: 'IDENTITY, COMM & PAYMENTS',
      count: 4,
      items: [
        {
          name: 'Auth0 OAuth',
          category: 'Authentication',
          status: 'HEALTHY',
          statusClass: 'bg-[#DCFCE7] text-[#15803D] border border-emerald-200',
          lastSync: '6 mins ago',
          volume: '4.8k auths/day',
          isConfigurable: true
        },
        {
          name: 'Stripe Billing',
          category: 'Payments',
          status: 'HEALTHY',
          statusClass: 'bg-[#DCFCE7] text-[#15803D] border border-emerald-200',
          lastSync: '1 min ago',
          volume: '125.4k requests/day',
          isConfigurable: true
        },
        {
          name: 'Twilio Telehealth SMS',
          category: 'Messaging',
          status: 'HEALTHY',
          statusClass: 'bg-[#DCFCE7] text-[#15803D] border border-emerald-200',
          lastSync: '12 secs ago',
          volume: '92.3k sms/day',
          isConfigurable: true
        },
        {
          name: 'Zoom Healthcare Video',
          category: 'Video Consultation',
          status: 'WARNING',
          statusClass: 'bg-[#FEF3C7] text-[#B45309] border border-amber-200',
          lastSync: '1 hour ago',
          volume: '1.5k hours/day',
          isConfigurable: true
        }
      ]
    },
    {
      group: 'WEARABLES & REMOTE PATIENT MONITORING',
      count: 3,
      items: [
        {
          name: 'Fitbit HeartRate Sync',
          category: 'Wearables',
          status: 'ERROR',
          statusClass: 'bg-[#FEE2E2] text-[#B91C1C] border border-rose-200',
          lastSync: 'Timeout 40 mins ago',
          volume: '0 msgs/day',
          isConfigurable: true
        },
        {
          name: 'AWS Cloud S3 Dump',
          category: 'Cloud Storage',
          status: 'HEALTHY',
          statusClass: 'bg-[#DCFCE7] text-[#15803D] border border-emerald-200',
          lastSync: 'Just now',
          volume: '24.5 GB/day',
          isConfigurable: true
        },
        {
          name: 'Google Analytics Health',
          category: 'Analytics',
          status: 'DISCONNECTED',
          statusClass: 'bg-slate-100 text-slate-600 border border-slate-200',
          lastSync: 'Inactive since Jan 1',
          volume: '0 msgs/day',
          isConfigurable: true
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Switcher between Views */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView('webhooks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubView === 'webhooks'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Registered Webhooks
          </button>
          <button
            onClick={() => setActiveSubView('services')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubView === 'services'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Connections & Services
          </button>
          <button
            onClick={() => setActiveSubView('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubView === 'catalog'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Integration Catalog
          </button>
          <button
            onClick={() => setActiveSubView('config')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubView === 'config'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Epic FHIR Configuration
          </button>
          <button
            onClick={() => setActiveSubView('metrics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubView === 'metrics'
                ? 'bg-[#08231A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Telemetry & Metrics
          </button>
        </div>

        {activeSubView === 'webhooks' && (
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all"
          >
            <span>+</span>
            <span>Register Webhook</span>
          </button>
        )}

        {activeSubView === 'services' && (
          <button
            onClick={() => setActiveSubView('catalog')}
            className="px-3.5 py-1.5 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all"
          >
            + Add Integration
          </button>
        )}
      </div>

      {/* VIEW: REGISTERED WEBHOOKS & DELIVERY LOGS (Exact Match to User's Latest Screenshot) */}
      {activeSubView === 'webhooks' && (
        <div className="space-y-8">
          {/* Section 1: Registered Webhooks */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#08231A] tracking-tight">
                  Registered Webhooks
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Manage secure HTTPS callbacks to clinical software and consumer devices
                </p>
              </div>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all self-start sm:self-auto"
              >
                <span>+</span>
                <span>Register Webhook</span>
              </button>
            </div>

            {/* Table 1: Registered Webhooks */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#EAF2EC] text-[10px] font-bold uppercase tracking-wider text-slate-600 border-b border-emerald-100">
                      <th className="py-3 px-5 font-bold">ENDPOINT URL</th>
                      <th className="py-3 px-4 font-bold">SUBSCRIBED EVENTS</th>
                      <th className="py-3 px-4 font-bold">STATUS</th>
                      <th className="py-3 px-4 font-bold">SUCCESS RATE</th>
                      <th className="py-3 px-4 font-bold">LAST TRIGGERED</th>
                      <th className="py-3 px-5 text-right font-bold tracking-widest text-[9px]">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {webhooks.map((wh) => (
                      <tr key={wh.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* URL */}
                        <td className="py-4 px-5">
                          <div className="font-mono text-xs font-semibold text-slate-800 break-all max-w-sm">
                            {wh.url}
                          </div>
                        </td>

                        {/* Events */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {wh.events.map((ev, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F5E9] text-[#1B5E20] border border-emerald-200/70"
                              >
                                {ev}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {wh.status === 'Active' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          )}
                          {wh.status === 'Paused' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#B45309] border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Paused
                            </span>
                          )}
                          {wh.status === 'Failed' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#B91C1C] border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Failed
                            </span>
                          )}
                        </td>

                        {/* Success Rate */}
                        <td className="py-4 px-4 font-bold text-slate-800">
                          {wh.successRate}
                        </td>

                        {/* Last Triggered */}
                        <td className="py-4 px-4 text-slate-500 font-medium">
                          {wh.lastTriggered}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            {/* Pause / Play / Retry */}
                            <button
                              title={wh.status === 'Active' ? 'Pause Webhook' : 'Resume Webhook'}
                              onClick={() => handleToggleWebhook(wh.id)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                              {wh.status === 'Active' ? (
                                <IconPause className="w-3.5 h-3.5 text-slate-500 hover:text-slate-800" />
                              ) : (
                                <IconPlay className="w-3.5 h-3.5 text-emerald-600 hover:text-emerald-700" />
                              )}
                            </button>

                            {/* Edit */}
                            <button
                              title="Edit Webhook Configuration"
                              onClick={() => onToast(`Editing configuration for ${wh.url}`)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                              <IconEdit className="w-3.5 h-3.5 text-slate-500 hover:text-slate-800" />
                            </button>

                            {/* Delete */}
                            <button
                              title="Delete Webhook"
                              onClick={() => handleDeleteWebhook(wh.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            >
                              <IconTrash className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
                            </button>

                            {/* Instant Ping Test Button */}
                            <button
                              title="Send Test Event"
                              onClick={() => handleTestPingWebhook(wh)}
                              className="ml-1 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-all"
                            >
                              Test Ping
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 2: Recent Delivery Logs */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#08231A] tracking-tight">
                Recent Delivery Logs
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Real-time response audit logs for clinical event payloads transmitted
              </p>
            </div>

            {/* Table 2: Recent Delivery Logs */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#EAF2EC] text-[10px] font-bold uppercase tracking-wider text-slate-600 border-b border-emerald-100">
                      <th className="py-3 px-5 font-bold">EVENT</th>
                      <th className="py-3 px-4 font-bold">STATUS CODE</th>
                      <th className="py-3 px-4 font-bold">TARGET ENDPOINT</th>
                      <th className="py-3 px-4 font-bold">DELIVERY TIME</th>
                      <th className="py-3 px-5 text-right font-bold">RETRY COUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deliveryLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Event Name */}
                        <td className="py-3.5 px-5">
                          <span className="font-bold text-slate-900 text-xs">
                            {log.event}
                          </span>
                        </td>

                        {/* Status Code Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {log.statusCodeType === 'success' && (
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#DCFCE7] text-[#15803D] border border-emerald-200">
                              {log.statusCode}
                            </span>
                          )}
                          {log.statusCodeType === 'created' && (
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#E0F2FE] text-[#0369A1] border border-sky-200">
                              {log.statusCode}
                            </span>
                          )}
                          {log.statusCodeType === 'warning' && (
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#FEF3C7] text-[#B45309] border border-amber-200">
                              {log.statusCode}
                            </span>
                          )}
                          {log.statusCodeType === 'error' && (
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#FEE2E2] text-[#B91C1C] border border-rose-200">
                              {log.statusCode}
                            </span>
                          )}
                        </td>

                        {/* Target Endpoint */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs text-slate-600 break-all">
                            {log.targetEndpoint}
                          </span>
                        </td>

                        {/* Delivery Time */}
                        <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                          {log.deliveryTime}
                        </td>

                        {/* Retry Count */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          {log.retryFailed ? (
                            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
                              {log.retryCount}
                            </span>
                          ) : (
                            <span className="font-semibold text-slate-700 text-xs">
                              {log.retryCount}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SCREENSHOT 2 - Integration Connections & Services */}
      {activeSubView === 'services' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#08231A] tracking-tight">
                Integration Connections & Services
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Manage, configure, and monitor live healthcare gateway pipes
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Category:</span>
                <select
                  value={serviceCategoryFilter}
                  onChange={(e) => setServiceCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Clinical EHR">Clinical EHR</option>
                  <option value="Authentication">Authentication</option>
                  <option value="Wearables">Wearables</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Status:</span>
                <select
                  value={serviceStatusFilter}
                  onChange={(e) => setServiceStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="All Live">All Live</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Warning">Warning</option>
                  <option value="Error">Error</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {serviceGroups.map((group, gIdx) => (
              <div key={gIdx} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="p-3.5 px-5 bg-[#FAFBF9] border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">▾</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#08231A]">
                      {group.group} ({group.count})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Encrypted TLS 1.3
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white">
                        <th className="py-3 px-5 font-bold">SERVICE NAME</th>
                        <th className="py-3 px-4 font-bold">CATEGORY</th>
                        <th className="py-3 px-4 font-bold">STATUS</th>
                        <th className="py-3 px-4 font-bold">LAST SYNC</th>
                        <th className="py-3 px-4 font-bold">DATA VOLUME</th>
                        <th className="py-3 px-5 text-right font-bold">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {group.items.map((svc, sIdx) => (
                        <tr key={sIdx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-2.5 font-bold text-slate-900">
                              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-black shrink-0">
                                {svc.name.charAt(0)}
                              </span>
                              <span>{svc.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {svc.category}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${svc.statusClass}`}>
                              {svc.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-medium">
                            {svc.lastSync}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700 font-medium">
                            {svc.volume}
                          </td>
                          <td className="py-3 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setActiveSubView('config')
                                  onToast(`Opened ${svc.name} configuration`)
                                }}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 shadow-2xs hover:border-slate-300 transition-all"
                              >
                                Configure
                              </button>
                              <button
                                onClick={() => onToast(`Disconnected ${svc.name}`)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 text-[11px] font-bold text-slate-500 shadow-2xs transition-all"
                              >
                                Disconnect
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: SCREENSHOT 1 - Integration Catalog & Marketplace */}
      {activeSubView === 'catalog' && (
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search by service name, category, standard (FHIR, HL7) or keyword..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200/80 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Identity', 'Payments', 'Communication', 'Clinical', 'Analytics', 'Infrastructure'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCatalogCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  catalogCategory === cat
                    ? 'bg-[#08231A] text-white shadow-2xs'
                    : 'bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-3">
              Featured & Recommended Integrations
            </h3>

            <div className="bg-[#07251B] text-white rounded-2xl p-6 border border-emerald-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-extrabold text-2xl text-emerald-400 shrink-0">
                  E
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      Epic Systems FHIR Gateway
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      CERTIFIED CLINICAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Connect natively to any Epic EHR instance using international FHIR Release 4 standard. High fidelity real-time sync for clinical encounters, diagnostics, vitals, and medication administration records.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => {
                    setActiveSubView('config')
                    onToast('Opened Epic Systems FHIR Configuration')
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Configure Sync
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-3">
              Available Integrations & Connectors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredConnectors.map((conn) => (
                <div
                  key={conn.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold text-sm">
                        {conn.letter}
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {conn.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#08231A] mb-1">
                      {conn.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4 line-clamp-3">
                      {conn.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <span className={`w-2 h-2 rounded-full ${conn.connected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{conn.status}</span>
                    </div>

                    {conn.connected ? (
                      <button
                        onClick={() => onToast(`${conn.name} is actively connected`)}
                        className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 shadow-2xs"
                      >
                        Connected
                      </button>
                    ) : (
                      <button
                        onClick={() => onToast(`Initiated connection to ${conn.name}`)}
                        className="px-3.5 py-1 rounded-lg bg-[#08231A] hover:bg-[#0E3A2C] text-white text-[11px] font-bold shadow-2xs active:scale-95 transition-all"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: SCREENSHOT 3 - Epic FHIR Gateway Configuration */}
      {activeSubView === 'config' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-lg">
                E
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#08231A]">
                    Epic FHIR Gateway
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-emerald-200">
                    CONNECTED
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Clinical EHR • Last synchronized: 2 mins ago
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onToast('Sync logs displayed')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs"
              >
                View Sync'd Logs
              </button>
              <button
                onClick={() => onToast('Service disconnect dialogue opened')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 text-xs font-bold text-slate-600 shadow-2xs"
              >
                Disconnect Service
              </button>
            </div>
          </div>

          <div className="border-b border-slate-200/80 flex items-center gap-6 text-xs font-bold text-slate-500">
            {(['Settings', 'Endpoints', 'Authentication', 'Data Mapping', 'Logs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'Endpoints') {
                    setActiveSubView('webhooks')
                  } else {
                    setConfigTab(tab)
                  }
                }}
                className={`pb-2.5 relative transition-colors ${
                  configTab === tab
                    ? 'text-[#08231A] font-extrabold'
                    : 'hover:text-slate-800'
                }`}
              >
                {tab}
                {configTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#08231A] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <h4 className="text-sm font-bold text-[#08231A]">
                Connection Configuration
              </h4>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  API ENDPOINT URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value="https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 focus:outline-none pr-9"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    🔒
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Epic App Orchard base gateway endpoint. OAuth security credentials resolved automatically.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  TARGET ENVIRONMENT
                </label>
                <div className="flex items-center gap-2 max-w-sm">
                  {(['Production', 'Staging', 'Development'] as const).map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => setConfigEnv(env)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        configEnv === env
                          ? 'bg-white border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    RATE LIMIT THRESHOLD
                  </label>
                  <input
                    type="text"
                    defaultValue="5,000 req/min"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    TIMEOUT CONFIGURATION
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="15,000 ms"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono pr-14"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                      15s max
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  AUTOMATIC RETRY POLICY
                </label>
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-medium text-slate-700">Max Retry Attempts</span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      3 retries
                    </span>
                    <span className="text-slate-600">Exponential Backoff</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRetryBackoff(!retryBackoff)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      retryBackoff ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                        retryBackoff ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#08231A]">
                      Gateway Master Switch
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Enable or temporarily suspend clinical data ingestion
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMasterSwitch(!masterSwitch)}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      masterSwitch ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                        masterSwitch ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ACTIVE AND INGESTING LIVE PATIENT TRAFFIC</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                <h5 className="text-xs font-bold text-[#08231A]">
                  Developer Quick Reference
                </h5>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Data Schema</span>
                    <span className="font-mono text-slate-800 font-bold">FHIR R4 JSON</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Sync Interval</span>
                    <span className="text-slate-800 font-semibold">Real-time Webhook</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">HIPAA Compliant</span>
                    <span className="text-emerald-700 font-extrabold">VERIFIED</span>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => onToast('Test packet dispatched. Latency: 14ms (Pass)')}
                    className="w-full py-2 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all"
                  >
                    Test Gateway Connection
                  </button>
                  <button
                    type="button"
                    onClick={() => onToast('✓ Gateway configuration saved')}
                    className="w-full py-2.5 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: System Telemetry & Metrics */}
      {activeSubView === 'metrics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-2 px-1 text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-extrabold text-slate-800 tracking-wider uppercase text-[11px]">
                ALL INTEGRATION GATEWAYS HEALTHY — 99.98% UPTIME (LAST 30 DAYS)
              </span>
            </div>
            <div className="text-slate-400 font-mono text-[11px] mt-1 sm:mt-0">
              Last gateway sync checked 2 mins ago
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">TOTAL INTEGRATIONS</div>
              <div className="text-3xl font-extrabold text-[#08231A]">47</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Across 12 medical categories</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">ACTIVE CONNECTIONS</div>
              <div className="text-3xl font-extrabold text-[#08231A]">42</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Actively piping traffic</div>
            </div>
            <div className="bg-[#FEFDF7] p-5 rounded-2xl border border-amber-300/80 ring-1 ring-amber-200/50 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">WARNINGS</div>
              <div className="text-3xl font-extrabold text-amber-700">3</div>
              <div className="text-xs text-amber-800 font-medium mt-1">Awaiting credential renewal</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">ERRORS</div>
              <div className="text-3xl font-extrabold text-[#08231A]">2</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Connection timeouts detected</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#08231A] tracking-tight mb-3">
              Category Health & Reach
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CATEGORIES_12.map((cat) => (
                <div key={cat.name} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">Active Connections</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-extrabold text-slate-800">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-[#08231A]">Data Throughput & Messaging Load</h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <span className="w-2.5 h-2.5 rounded bg-[#134937]" />
                    <span>Messages processed</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Average: 80,420 messages/hour over the last 24 hours</p>
              </div>
              <div className="pt-8 pb-2">
                <div className="h-44 flex items-end justify-between gap-2 border-b border-slate-200 px-2">
                  {HOURLY_THROUGHPUT.map((item) => (
                    <div key={item.time} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div style={{ height: `${item.val}%` }} className="w-full max-w-[24px] rounded-t-sm bg-[#134937] group-hover:bg-emerald-500 transition-all duration-200" />
                      <span className="text-[10px] font-semibold text-slate-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col">
              <h3 className="text-sm font-bold text-[#08231A] mb-4">Recent Integration Activity Feed</h3>
              <div className="space-y-3.5 my-auto">
                {INTEGRATION_FEED.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="font-mono text-[11px] text-slate-400 pt-0.5 shrink-0">{item.time}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${item.tagClass}`}>{item.tag}</span>
                    <p className="text-slate-700 font-medium text-[11px] leading-relaxed truncate">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER WEBHOOK MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#08231A]">
                  Register Webhook Endpoint
                </h3>
                <p className="text-xs text-slate-500">
                  Configure secure HTTPS callback for clinical events and data pipelines
                </p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterWebhookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  ENDPOINT URL (HTTPS REQUIRED)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://api.yourhospital.org/webhooks/listener"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  SUBSCRIBED CLINICAL EVENTS
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'patient.admit',
                    'patient.discharge',
                    'clinical.vital_signs',
                    'invoice.paid',
                    'payment.failed',
                    'wearable.heart_rate',
                    'wearable.sleep',
                    'appointment.scheduled',
                    'lab.result_available'
                  ].map((ev) => {
                    const isSelected = selectedEvents.includes(ev)
                    return (
                      <button
                        key={ev}
                        type="button"
                        onClick={() => toggleEventSelection(ev)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#E8F5E9] text-[#1B5E20] border-emerald-400 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {ev}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  WEBHOOK SIGNING SECRET
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={newSecret}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onToast('Secret copied to clipboard')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 hover:bg-emerald-50"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Use this shared secret to verify HMAC SHA-256 signatures in the <code>X-MedPresence-Signature</code> header.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">SSL Certificate Verification</div>
                  <div className="text-[10px] text-slate-500">Require valid CA-signed TLS certificate on the receiver</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSslEnabled(!sslEnabled)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    sslEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                      sslEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#08231A] hover:bg-[#0E3A2C] text-white font-bold shadow-md active:scale-95 transition-all"
                >
                  Save & Register Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
