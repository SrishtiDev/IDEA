import { useState, useEffect } from 'react'

interface Developer {
  id: string
  name: string
  avatar: string
  role: string
  match: number
  skills: string[]
  experience: string
  location: string
  rate: string
  availability: string
}

const TALENT_ORBITS: Record<string, Developer[]> = {
  Frontend: [
    { id: 'fe-1', name: 'Sophia Chen', avatar: '👩‍💻', role: 'Staff React Engineer', match: 98, skills: ['TypeScript', 'Next.js', 'Tailwind', 'WebGL'], experience: '7 years', location: 'Vancouver, Canada', rate: '$95/hr', availability: 'Immediate' },
    { id: 'fe-2', name: 'Liam Davies', avatar: '👨‍💻', role: 'UI/UX & Frontend Architect', match: 95, skills: ['Vue.js', 'CSS/PostCSS', 'Figma', 'Vite'], experience: '5 years', location: 'London, UK', rate: '$85/hr', availability: '1 week' },
    { id: 'fe-3', name: 'Aki Tanaka', avatar: '👩‍🎨', role: 'Design Systems Lead', match: 97, skills: ['React', 'Stitches', 'Storybook', 'A11y'], experience: '6 years', location: 'Tokyo, Japan', rate: '$90/hr', availability: '2 weeks' }
  ],
  Backend: [
    { id: 'be-1', name: 'Mateo Silva', avatar: '👨‍💻', role: 'Senior Go & gRPC Specialist', match: 99, skills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL'], experience: '8 years', location: 'São Paulo, Brazil', rate: '$100/hr', availability: 'Immediate' },
    { id: 'be-2', name: 'Emma Watson', avatar: '👩‍💻', role: 'Distributed Systems Lead', match: 96, skills: ['Rust', 'Kafka', 'Docker', 'AWS'], experience: '6 years', location: 'Austin, USA', rate: '$110/hr', availability: '3 weeks' },
    { id: 'be-3', name: 'Arjun Mehta', avatar: '👨‍🚀', role: 'Node.js & GraphQL Architect', match: 94, skills: ['Node.js', 'NestJS', 'GraphQL', 'Redis'], experience: '5 years', location: 'Bangalore, India', rate: '$80/hr', availability: 'Immediate' }
  ],
  'AI / ML': [
    { id: 'ai-1', name: 'Dr. Elena Rostova', avatar: '👩‍🔬', role: 'Lead LLM Alignment Engineer', match: 99, skills: ['Python', 'PyTorch', 'Transformers', 'NLP'], experience: '9 years', location: 'Munich, Germany', rate: '$150/hr', availability: 'Immediate' },
    { id: 'ai-2', name: 'Kofi Mensah', avatar: '👨‍🔬', role: 'Computer Vision Architect', match: 96, skills: ['Python', 'C++', 'OpenCV', 'TensorFlow'], experience: '6 years', location: 'Accra, Ghana', rate: '$120/hr', availability: '2 weeks' },
    { id: 'ai-3', name: 'Clara Dupont', avatar: '👩‍💻', role: 'MLOps & Pipeline Engineer', match: 97, skills: ['Kubeflow', 'MLflow', 'Python', 'GCP'], experience: '5 years', location: 'Paris, France', rate: '$115/hr', availability: '1 week' }
  ],
  Web3: [
    { id: 'w3-1', name: 'Roman Sterling', avatar: '👨‍💻', role: 'Solidity Smart Contract Auditor', match: 97, skills: ['Solidity', 'Hardhat', 'Ethers.js', 'Rust'], experience: '6 years', location: 'Zurich, Switzerland', rate: '$140/hr', availability: 'Immediate' },
    { id: 'w3-2', name: 'Nina Patel', avatar: '👩‍💻', role: 'dApp Core Architect', match: 94, skills: ['React', 'Web3.js', 'IPFS', 'Subgraph'], experience: '4 years', location: 'San Francisco, USA', rate: '$105/hr', availability: '4 weeks' },
    { id: 'w3-3', name: 'Ivan Petrov', avatar: '👨‍🚀', role: 'Cosmos & Go Core Dev', match: 95, skills: ['Go', 'Cosmos SDK', 'Tendermint', 'Rust'], experience: '5 years', location: 'Sofia, Bulgaria', rate: '$110/hr', availability: 'Immediate' }
  ]
}

function App() {
  // Talent Orbit Sandbox States
  const [activeTab, setActiveTab] = useState<string>('Frontend')
  const [selectedDev, setSelectedDev] = useState<Developer>(TALENT_ORBITS['Frontend'][0])

  // Scan Simulator States
  const [scanName, setScanName] = useState('')
  const [scanSkill, setScanSkill] = useState('TypeScript')
  const [scanUrl, setScanUrl] = useState('')
  const [scanStep, setScanStep] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)

  // Cost Calculator States
  const [devCount, setDevCount] = useState(3)
  const [devLevel, setDevLevel] = useState<'Mid' | 'Senior' | 'Lead'>('Senior')

  // FAQ Interactive States
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Effect to automatically select first dev when tab changes
  useEffect(() => {
    setSelectedDev(TALENT_ORBITS[activeTab][0])
  }, [activeTab])

  // Simulated Scanning Engine
  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!scanName) return

    setIsScanning(true)
    setScanResult(null)
    setScanStep(1)

    const steps = [
      'Establishing quantum tunnel to repository...',
      'Parsing AST for advanced design patterns...',
      'Evaluating architectural symmetry & clean code indexes...',
      'Mapping system compliance against 42 enterprise orbits...',
      'Compiling talent matrix...'
    ]

    let current = 1
    const interval = setInterval(() => {
      current++
      if (current <= steps.length) {
        setScanStep(current)
      } else {
        clearInterval(interval)
        setIsScanning(false)
        setScanStep(0)
        
        // Generate simulated dynamic results based on user's inputs
        const score = Math.floor(Math.random() * 8) + 92 // 92 to 99
        setScanResult({
          score,
          archetype: scanSkill === 'Rust' || scanSkill === 'Go' ? 'Concurrent Titan' : 
                     scanSkill === 'AI/PyTorch' ? 'Cognitive Architect' : 'Spatial Interface Wizard',
          primarySkill: scanSkill,
          metrics: {
            symmetry: Math.floor(Math.random() * 5) + 95,
            efficiency: Math.floor(Math.random() * 6) + 93,
            scalability: Math.floor(Math.random() * 5) + 94
          },
          matches: [
            { company: 'Vercel', role: 'Core Framework Dev', match: `${score}%` },
            { company: 'Supabase', role: 'Real-time Engineer', match: `${score - 2}%` },
            { company: 'Linear', role: 'Interface Architect', match: `${score - 1}%` }
          ]
        })
      }
    }, 900)
  }

  // Cost Calculations
  const getSalary = () => {
    if (devLevel === 'Mid') return 95000
    if (devLevel === 'Senior') return 150000
    return 195000
  }

  const calculateTraditionalFee = () => {
    // 22% typical headhunter fee
    return Math.round(getSalary() * devCount * 0.22)
  }

  const calculateOrbitSavings = () => {
    // HireOrbit charges low flat platform fees, saving 85% of standard commission
    return Math.round(calculateTraditionalFee() * 0.85)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-dmsans selection:bg-violet-500 selection:text-white relative">
      
      {/* Visual Ambient Background Orbits */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-200px] left-[10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute top-[-100px] right-[10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[130px] animate-pulse-slow delay-3000"></div>
        
        {/* Orbital grid lines */}
        <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-violet-500/5 animate-orbit-slow z-0">
          <div className="absolute top-4 left-1/2 w-2 h-2 bg-violet-500/30 rounded-full"></div>
        </div>
        <div className="absolute top-[220px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-fuchsia-500/5 animate-orbit-medium z-0">
          <div className="absolute bottom-4 right-1/4 w-1.5 h-1.5 bg-fuchsia-500/40 rounded-full"></div>
        </div>
      </div>

      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-900 bg-slate-950/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20">
              <span className="text-xl font-bold font-syne text-white tracking-wider">H</span>
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 blur opacity-30 hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-2xl font-bold font-syne bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">HireOrbit</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#orbits" className="hover:text-violet-400 transition-colors">Talent Orbits</a>
            <a href="#features" className="hover:text-violet-400 transition-colors">Spatial Matching</a>
            <a href="#calculator" className="hover:text-violet-400 transition-colors">ROI Calculator</a>
            <a href="#scanner" className="hover:text-violet-400 transition-colors">Profile Scanner</a>
            <a href="#faq" className="hover:text-violet-400 transition-colors">Platform FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#orbits" className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors">
              Sign In
            </a>
            <a href="#orbits" className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none">
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full"></span>
              <span className="relative block px-5 py-2.5 rounded-full bg-slate-950 text-sm font-semibold text-white transition-colors group-hover:bg-slate-900/90">
                Launch Search
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 relative z-10 pt-16 md:pt-24 pb-32">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300 tracking-wide mb-8 uppercase animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            Spatial Recruitment Engine v3.12
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-syne tracking-tight leading-[1.08] mb-8 bg-gradient-to-r from-white via-slate-100 to-violet-300 bg-clip-text text-transparent">
            Find Your Talent's <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Perfect Tech Orbit
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 font-dmsans leading-relaxed mb-12 max-w-2xl mx-auto">
            HireOrbit bypasses outdated headhunting by mapping top-tier engineers directly into your technology stack using real-time spatial cognitive matches.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#orbits" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-violet-400 to-fuchsia-400 hover:from-violet-300 hover:to-fuchsia-300 transition-all duration-300 shadow-xl shadow-violet-900/30 hover:shadow-violet-800/40 hover:-translate-y-0.5 text-center">
              Explore Available Orbits
            </a>
            <a href="#scanner" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-100 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 transition-all duration-300 hover:-translate-y-0.5 text-center">
              Scan My Code Profile
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 md:gap-12 flex-wrap text-slate-500 text-sm font-semibold tracking-wider">
            <span>TRUSTED BY OUTLIERS</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="font-syne font-extrabold tracking-tight">▲ VERCEL</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="font-syne font-bold tracking-tight">SUPABASE</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="font-syne font-bold tracking-tight">LINEAR</span>
            </div>
          </div>
        </section>

        {/* Interactive Orbit Sandbox Section */}
        <section id="orbits" className="mb-32 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-syne tracking-tight text-white mb-4">
              Explore Active Talent Spheres
            </h2>
            <p className="text-slate-400 font-dmsans">
              Toggle global engineering vectors to interact with top matching candidates. Hover and click candidates to review depth cards.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center justify-center p-1.5 max-w-md mx-auto mb-12 bg-slate-900/50 border border-slate-800/80 rounded-2xl backdrop-blur-md">
            {Object.keys(TALENT_ORBITS).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold font-syne transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sandbox Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/20 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden">
            
            {/* Visual Orbit Sandbox Screen (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[420px] bg-slate-950/60 rounded-2xl border border-slate-900 p-6 relative overflow-hidden">
              
              {/* Pulsating Orbital Track Backdrops */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[300px] h-[300px] rounded-full border border-violet-500/10 animate-orbit-slow"></div>
                <div className="w-[200px] h-[200px] rounded-full border border-fuchsia-500/10 animate-orbit-medium"></div>
              </div>

              {/* Gravitational Core Anchor */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex flex-col items-center justify-center shadow-2xl shadow-violet-500/30">
                <span className="text-xs uppercase font-bold tracking-widest text-violet-200 font-syne">Hire</span>
                <span className="text-lg font-extrabold font-syne text-white leading-none">Orbit</span>
                <div className="absolute -inset-2 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full opacity-20 blur animate-pulse"></div>
              </div>

              {/* Satellite Candidates */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                {TALENT_ORBITS[activeTab].map((dev, index) => {
                  // Predefined polar coordinates for absolute placement around the core
                  const angles = [0, 120, 240];
                  const angle = angles[index];
                  const radius = 125; // pixels away from center
                  const rad = (angle * Math.PI) / 180;
                  const x = Math.round(Math.cos(rad) * radius);
                  const y = Math.round(Math.sin(rad) * radius);

                  const isSelected = selectedDev.id === dev.id;

                  return (
                    <button
                      key={dev.id}
                      onClick={() => setSelectedDev(dev)}
                      style={{
                        transform: `translate(${x}px, ${y}px)`
                      }}
                      className={`absolute w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-500 border ${
                        isSelected
                          ? 'bg-violet-600 border-violet-400 shadow-xl shadow-violet-500/40 scale-110 z-30'
                          : 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700 scale-100 z-10'
                      }`}
                    >
                      <span className="text-2xl mb-0.5">{dev.avatar}</span>
                      <span className="text-[10px] font-bold font-syne text-white bg-slate-950/80 px-1 py-0.5 rounded-md -mt-1 scale-90">
                        {dev.match}%
                      </span>

                      {/* Small orbital trail pulse if selected */}
                      {isSelected && (
                        <span className="absolute -inset-2 rounded-full border border-violet-400/30 animate-ping"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="absolute bottom-4 left-6 text-slate-500 text-xs flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Interactive Sandbox: Click satellites to view stats
              </div>
            </div>

            {/* Profile Detail Card (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[420px] bg-slate-950/80 rounded-2xl border border-violet-500/10 p-8 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-tr-2xl pointer-events-none"></div>
              
              <div>
                {/* Score and avatar row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl p-2 bg-slate-900 rounded-2xl border border-slate-800/80 shadow-inner">
                      {selectedDev.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-syne text-white tracking-tight leading-tight">
                        {selectedDev.name}
                      </h3>
                      <p className="text-sm font-semibold text-violet-400 mt-1">
                        {selectedDev.role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Matching Gauge */}
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold font-syne text-violet-300">
                      {selectedDev.match}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Orbit Match
                    </span>
                  </div>
                </div>

                {/* Professional stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-900 mb-6 text-sm">
                  <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Experience</span>
                    <span className="text-slate-200 font-semibold">{selectedDev.experience}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Availability</span>
                    <span className="text-slate-200 font-semibold">{selectedDev.availability}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Location</span>
                    <span className="text-slate-200 font-semibold">{selectedDev.location}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Target Rate</span>
                    <span className="text-slate-200 font-semibold font-syne text-violet-300">{selectedDev.rate}</span>
                  </div>
                </div>

                {/* Tag Skills */}
                <div className="mb-8">
                  <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider mb-3">Core Stack Alignment</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedDev.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert(`Opening interview orbit booking with ${selectedDev.name}...`)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-center text-slate-950 bg-violet-400 hover:bg-violet-300 transition-colors text-sm"
                >
                  Book Instant Call
                </button>
                <button 
                  onClick={() => alert(`Full dossier of ${selectedDev.name} loaded.`)}
                  className="py-3 px-5 rounded-xl font-bold text-center text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-sm"
                >
                  View Full Dossier
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Features / Value Proposition */}
        <section id="features" className="mb-32 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-syne tracking-tight text-white mb-4">
              Designed to Break Agency Monopoly
            </h2>
            <p className="text-slate-400 font-dmsans">
              A Direct-to-Developer orbital framework offering speed, verification, and immense cost efficiencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/30 border border-slate-850 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-400 font-bold text-lg group-hover:bg-violet-500/20 transition-all">
                ✦
              </div>
              <h3 className="text-lg font-bold font-syne text-white mb-3">Spatial AI Matching</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rather than searching text strings, our neural graph maps candidate repos, code density, and design patterns directly against your project specs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/30 border border-slate-850 hover:border-fuchsia-500/30 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-6 text-fuchsia-400 font-bold text-lg group-hover:bg-fuchsia-500/20 transition-all">
                ⎔
              </div>
              <h3 className="text-lg font-bold font-syne text-white mb-3">No Commission Surcharges</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Traditional headhunters demand 20-30% of standard annual base pay. We replace outdated hiring fees with flat, premium monthly seat access.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/30 border border-slate-850 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 font-bold text-lg group-hover:bg-indigo-500/20 transition-all">
                ◈
              </div>
              <h3 className="text-lg font-bold font-syne text-white mb-3">Instant Workspace Fit</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Candidates carry fully verified credentials and availability bounds. Direct instant bookings book calendar spots with zero screening lag.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing / Savings ROI Calculator */}
        <section id="calculator" className="mb-32 scroll-mt-28">
          <div className="bg-slate-900/35 border border-slate-850 rounded-3xl p-8 md:p-12 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Copy (lg:col-span-5) */}
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs font-semibold text-fuchsia-300 mb-6">
                  💸 Value Engine
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-syne tracking-tight text-white mb-6">
                  Save Up to 85% on Placement Fees
                </h2>
                <p className="text-slate-400 font-dmsans leading-relaxed mb-6">
                  Recruitment shouldn't hold a massive slice of candidate payroll ransom. Use our direct-matching model to completely unlock massive capital.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span> Verified ROI
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span> Simple Flat Subscriptions
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive widget (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-slate-950/80 border border-slate-850 p-6 md:p-8 rounded-2xl shadow-xl">
                
                {/* Dev Count Slider */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold font-syne text-slate-300">How many engineers to hire?</label>
                    <span className="text-xl font-bold font-syne text-violet-400 bg-violet-400/10 px-3 py-1 rounded-lg">
                      {devCount} Developers
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={devCount}
                    onChange={(e) => setDevCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                    <span>1 Dev</span>
                    <span>10 Devs</span>
                    <span>20 Devs</span>
                  </div>
                </div>

                {/* Experience Level Toggles */}
                <div className="mb-8">
                  <label className="block text-sm font-bold font-syne text-slate-300 mb-4">Desired Skill Grade</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Mid', 'Senior', 'Lead'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDevLevel(level)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold font-syne transition-all ${
                          devLevel === level
                            ? 'bg-slate-900 border-2 border-violet-500 text-violet-300 shadow-md'
                            : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {level} Grade
                        <span className="block text-[10px] font-medium text-slate-500 mt-0.5">
                          {level === 'Mid' ? '$95k/yr avg' : level === 'Senior' ? '$150k/yr avg' : '$195k/yr avg'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Savings and Cost breakdown */}
                <div className="p-5 bg-violet-950/20 border border-violet-500/10 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <span className="block text-xs uppercase font-bold text-slate-500 tracking-wider mb-1">Traditional Recruiter Fee</span>
                    <span className="text-xl font-bold font-syne text-slate-400 line-through">
                      ${calculateTraditionalFee().toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-violet-400 tracking-wider mb-1">HireOrbit Projected Savings</span>
                    <span className="text-3xl font-extrabold font-syne bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                      ${calculateOrbitSavings().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Profile Scanner Simulator */}
        <section id="scanner" className="mb-32 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-syne tracking-tight text-white mb-4">
              AI Talent Orbit Scanner
            </h2>
            <p className="text-slate-400 font-dmsans">
              Are you a developer looking for elite placements? Submit your profile stats to run a simulated ast-compliance review.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-900/20 border border-slate-850 p-8 rounded-3xl backdrop-blur-md relative">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-fuchsia-500/5 to-transparent rounded-tl-3xl pointer-events-none"></div>

            <form onSubmit={handleStartScan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="scan-name" className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Developer Name</label>
                  <input
                    id="scan-name"
                    type="text"
                    required
                    placeholder="e.g. Liam Sterling"
                    value={scanName}
                    onChange={(e) => setScanName(e.target.value)}
                    className="w-full py-3 px-4 bg-slate-950 border border-slate-850 rounded-xl focus:border-violet-500 focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="scan-skill" className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Core Tech Competence</label>
                  <select
                    id="scan-skill"
                    value={scanSkill}
                    onChange={(e) => setScanSkill(e.target.value)}
                    className="w-full py-3 px-4 bg-slate-950 border border-slate-850 rounded-xl focus:border-violet-500 focus:outline-none text-slate-100 transition-colors"
                  >
                    <option value="TypeScript">TypeScript / React</option>
                    <option value="Rust">Rust / Web3</option>
                    <option value="Go">Go / Distributed Systems</option>
                    <option value="AI/PyTorch">AI / PyTorch / Python</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="scan-url" className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">GitHub / Portfolio URL (Optional)</label>
                <input
                  id="scan-url"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={scanUrl}
                  onChange={(e) => setScanUrl(e.target.value)}
                  className="w-full py-3 px-4 bg-slate-950 border border-slate-850 rounded-xl focus:border-violet-500 focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors"
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isScanning}
                  className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl"></span>
                  <span className="relative block px-8 py-3.5 rounded-xl bg-slate-950 text-sm font-semibold text-white transition-colors group-hover:bg-slate-900/90 text-center">
                    {isScanning ? 'Scanning Profile...' : 'Execute Profile Alignment Audit'}
                  </span>
                </button>
              </div>
            </form>

            {/* Scanning progress display */}
            {isScanning && (
              <div className="mt-8 p-6 bg-slate-950/80 border border-violet-500/20 rounded-2xl flex flex-col items-center justify-center space-y-4">
                {/* Spinner */}
                <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin"></div>
                <p className="text-sm font-bold font-syne text-violet-300 animate-pulse text-center">
                  {scanStep === 1 && 'Establishing quantum tunnel to repository...'}
                  {scanStep === 2 && 'Parsing AST for advanced design patterns...'}
                  {scanStep === 3 && 'Evaluating architectural symmetry & clean code indexes...'}
                  {scanStep === 4 && 'Mapping system compliance against 42 enterprise orbits...'}
                  {scanStep === 5 && 'Compiling talent matrix...'}
                </p>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-full transition-all duration-700" 
                    style={{ width: `${(scanStep / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Simulated Scan Result output */}
            {scanResult && (
              <div className="mt-8 p-6 bg-violet-950/10 border border-violet-500/20 rounded-2xl shadow-inner animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4 mb-6 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Audit Archetype</span>
                    <h4 className="text-xl font-bold font-syne text-violet-300">{scanResult.archetype}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Score</span>
                    <span className="text-3xl font-extrabold font-syne text-green-400 bg-green-500/10 px-3 py-1 rounded-xl">
                      {scanResult.score}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Gauge metrics */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center">
                    <span className="block text-slate-500 text-xs font-semibold mb-1">Code Symmetry</span>
                    <span className="text-lg font-bold font-syne text-slate-200">{scanResult.metrics.symmetry}%</span>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center">
                    <span className="block text-slate-500 text-xs font-semibold mb-1">Pattern Efficiency</span>
                    <span className="text-lg font-bold font-syne text-slate-200">{scanResult.metrics.efficiency}%</span>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center">
                    <span className="block text-slate-500 text-xs font-semibold mb-1">System Scalability</span>
                    <span className="text-lg font-bold font-syne text-slate-200">{scanResult.metrics.scalability}%</span>
                  </div>
                </div>

                <div>
                  <span className="block text-slate-500 text-xs uppercase font-bold tracking-wider mb-3">Top Enterprise Matches</span>
                  <div className="space-y-2">
                    {scanResult.matches.map((m: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-900 rounded-xl text-sm font-semibold">
                        <span className="text-slate-300">{m.company}</span>
                        <span className="text-slate-500 font-medium">{m.role}</span>
                        <span className="text-violet-400 font-syne font-bold">{m.match}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-32 scroll-mt-28 max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-syne tracking-tight text-white mb-4">
              Frequently Orbiting Questions
            </h2>
            <p className="text-slate-400 font-dmsans">
              Get answers about spatial recruitment networks, payment channels, and technical audits.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What makes spatial AI matching different from classic resume searching?',
                a: 'Traditional searches rely purely on text matching (keywords), leading to mismatches. Spatial AI constructs high-dimensional mathematical graphs of developers actual contributions, architecture dependencies, complexity factors, and repository symmetry. This predicts precise job fit with over 90% real-world compatibility.'
              },
              {
                q: 'How does the pricing save companies up to 85%?',
                a: 'Headhunters charge massive percentages of a developers first-year salary as a transaction fee (usually 20% to 30%). We charge no hiring fee. Instead, hiring teams subscribe for direct orbital search seats starting at flat, affordable rates. Once you find a match, you hire them directly.'
              },
              {
                q: 'What tech stacks does the HireOrbit platform support?',
                a: 'HireOrbit hosts developers specialized in modern, high-intensity technology sectors, categorized under four primary clusters: Frontend (Next.js, React, Tailwind, Vue, WebGL), Backend (Go, Rust, Node.js, distributed systems), AI/ML (LLM alignment, NLP, Computer Vision, MLOps), and Web3/Smart Contracts.'
              },
              {
                q: 'How are candidates vetted and checked?',
                a: 'Candidates undergo automatic background compiler sanity checks, pull-request verification audits, and continuous peer review integrations. When you see a developer in a talent sphere, their credentials have already been scanned for genuine operational authenticity.'
              }
            ].map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/30 border border-slate-850 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="text-base font-bold font-syne text-slate-100 pr-4">
                      {item.q}
                    </span>
                    <span className={`text-xl text-violet-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                      ＋
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed font-dmsans border-t border-slate-900/80 pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-16 text-slate-500 relative z-10 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-base font-syne">
                  H
                </div>
                <span className="text-xl font-bold font-syne text-white tracking-tight">HireOrbit</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                The next-generation autonomous developer placement graph utilizing spatial AST matches.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4 font-syne">Platform Orbits</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#orbits" className="hover:text-slate-300 transition-colors">Frontend Vectors</a></li>
                <li><a href="#orbits" className="hover:text-slate-300 transition-colors">Backend Nodes</a></li>
                <li><a href="#orbits" className="hover:text-slate-300 transition-colors">AI & ML Horizons</a></li>
                <li><a href="#orbits" className="hover:text-slate-300 transition-colors">Web3 Spheres</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4 font-syne">Company</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#features" className="hover:text-slate-300 transition-colors">Audit Methodology</a></li>
                <li><a href="#calculator" className="hover:text-slate-300 transition-colors">ROI Structure</a></li>
                <li><a href="#scanner" className="hover:text-slate-300 transition-colors">Candidate Alignment</a></li>
                <li><a href="#faq" className="hover:text-slate-300 transition-colors">Help & Docs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4 font-syne">Contact Node</h4>
              <p className="text-xs leading-relaxed mb-4">
                Ready to coordinate your technology stack with elite builders? Connect with our team.
              </p>
              <a href="mailto:support@hireorbit.io" className="text-violet-400 font-semibold hover:underline text-xs block">
                coordinate@hireorbit.io
              </a>
            </div>

          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs gap-4">
            <p>&copy; {new Date().getFullYear()} HireOrbit Systems Inc. All spatial vectors reserved.</p>
            <div className="flex gap-6">
              <a href="#orbits" className="hover:text-slate-300 transition-colors">System Agreement</a>
              <a href="#orbits" className="hover:text-slate-300 transition-colors">Privacy Vectors</a>
              <a href="#orbits" className="hover:text-slate-300 transition-colors">Cookie Orbits</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default App
