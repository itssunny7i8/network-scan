import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Terminal, CheckSquare, ShieldCheck, HelpCircle, ArrowRight, Activity } from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState<'what' | 'handshakes' | 'scans' | 'ethics'>('what');

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          About <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Network Reconnaissance</span>
        </h1>
        <p className="text-gray-400 max-w-2xl font-light">
          Master the core fundamentals of network mapping, port scanning states, TCP packet handshakes, and ethical security testing frameworks.
        </p>
      </div>

      {/* Layout Grid: Left Navigation, Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-thin">
          <button
            onClick={() => setActiveTab('what')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'what' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-glow-emerald/5' 
                : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            What is Nmap?
          </button>
          
          <button
            onClick={() => setActiveTab('handshakes')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'handshakes' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-glow-emerald/5' 
                : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Network className="h-4 w-4" />
            TCP Handshakes
          </button>

          <button
            onClick={() => setActiveTab('scans')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'scans' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-glow-emerald/5' 
                : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Scan Mechanisms
          </button>

          <button
            onClick={() => setActiveTab('ethics')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'ethics' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-glow-emerald/5' 
                : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Ethical Scanning
          </button>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl min-h-[450px]"
            >
              
              {/* Tab 1: What is Nmap */}
              {activeTab === 'what' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">What is Nmap?</h2>
                  <p className="text-gray-400 leading-relaxed font-light mb-6">
                    <strong>Nmap</strong> (Network Mapper) is a free and open-source utility for network discovery and security auditing. It was designed by Gordon Lyon (also known by his pseudonym <em>Fyodor Vaskovich</em>) to rapidly scan large networks, although it works fine against single hosts.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Host Discovery
                      </h3>
                      <p className="text-sm text-gray-400 font-light leading-relaxed">
                        Identify active devices (hosts) on a network. Nmap does this by sending ICMP Echo requests, TCP SYN packets to common ports, and ARP requests inside local subnets.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        Port Status Mapping
                      </h3>
                      <p className="text-sm text-gray-400 font-light leading-relaxed">
                        Find out which specific port numbers are open, closed, or filtered. An open port indicates a listening service is active, while a filtered port suggests a firewall is blocking probes.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3">Reconnaissance Phase</h3>
                  <p className="text-gray-400 leading-relaxed font-light">
                    In cybersecurity, reconnaissance is the first phase of penetration testing. Before auditing a target, security analysts must map the network topology, discover operating systems (fingerprinting), and catalog service versions. This data is critical for locating outdated software versions that may contain known CVE vulnerabilities.
                  </p>
                </div>
              )}

              {/* Tab 2: TCP Handshakes Diagram */}
              {activeTab === 'handshakes' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Understanding Packet Handshakes</h2>
                  <p className="text-gray-400 leading-relaxed font-light mb-6">
                    Port scanning works by examining how the target operating system's TCP/IP stack responds to raw packet configurations. Below is a comparison of two fundamental scanning behaviors.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SYN Scan Flow */}
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          TCP SYN Scan (Half-Open)
                        </h3>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
                          Nmap sends a SYN (synchronize) packet. If it gets a SYN-ACK back, the port is open. Nmap immediately sends a RST (reset) to tear down the connection before it completes. This is stealthier since it doesn't open a full session.
                        </p>
                      </div>

                      {/* Visual Flowchart */}
                      <div className="space-y-4 font-mono text-xs bg-[#0A0E17]/60 p-4 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center text-gray-500">
                          <span>Scanner</span>
                          <span>Target Port</span>
                        </div>
                        <div className="flex items-center justify-between text-cyan-400">
                          <span>[SYN]</span>
                          <span className="flex-1 border-t border-dashed border-cyan-500/40 mx-2 relative">
                            <ArrowRight className="h-3 w-3 absolute right-0 -top-[6px] text-cyan-400" />
                          </span>
                          <span>(Initiate)</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-400">
                          <span>(Open Port)</span>
                          <span className="flex-1 border-t border-dashed border-emerald-500/40 mx-2 relative">
                            <ArrowRight className="h-3 w-3 absolute left-0 -top-[6px] rotate-180 text-emerald-400" />
                          </span>
                          <span>[SYN-ACK]</span>
                        </div>
                        <div className="flex items-center justify-between text-amber-500">
                          <span>[RST]</span>
                          <span className="flex-1 border-t border-dashed border-amber-500/40 mx-2 relative">
                            <ArrowRight className="h-3 w-3 absolute right-0 -top-[6px] text-amber-500" />
                          </span>
                          <span>(Close)</span>
                        </div>
                      </div>
                    </div>

                    {/* Connect Scan Flow */}
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          TCP Connect Scan (Full)
                        </h3>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
                          Nmap attempts a full TCP three-way handshake. The operating system completes the connection via the standard network socket API. This is louder and is logged on the target server.
                        </p>
                      </div>

                      {/* Visual Flowchart */}
                      <div className="space-y-4 font-mono text-xs bg-[#0A0E17]/60 p-4 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center text-gray-500">
                          <span>Scanner</span>
                          <span>Target Port</span>
                        </div>
                        <div className="flex items-center justify-between text-cyan-400">
                          <span>[SYN]</span>
                          <span className="flex-1 border-t border-dashed border-cyan-500/40 mx-2 relative">
                            <ArrowRight className="h-3 w-3 absolute right-0 -top-[6px] text-cyan-400" />
                          </span>
                          <span>(Initiate)</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-400">
                          <span>(Open Port)</span>
                          <span className="flex-1 border-t border-dashed border-emerald-500/40 mx-2 relative">
                            <ArrowRight className="h-3 w-3 absolute left-0 -top-[6px] rotate-180 text-emerald-400" />
                          </span>
                          <span>[SYN-ACK]</span>
                        </div>
                        <div className="flex items-center justify-between text-blue-400">
                          <span>[ACK]</span>
                          <span className="flex-1 border-t border-dashed border-blue-500/40 mx-2 relative">
                            <ArrowRight className="h-3 w-3 absolute right-0 -top-[6px] text-blue-400" />
                          </span>
                          <span>(Established)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Scan Mechanisms */}
              {activeTab === 'scans' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Common Nmap Scan Flags</h2>
                  <p className="text-gray-400 leading-relaxed font-light mb-6">
                    Each Nmap scan utilizes specific techniques depending on speed, stealth, and granularity targets.
                  </p>

                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">-F (Quick Scan)</span>
                        <h4 className="text-white font-medium text-sm">Fast Port Scan</h4>
                      </div>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Scans fewer ports than the default (typically scans top 100 ports instead of top 1,000). Speeds up execution considerably.
                      </p>
                    </div>

                    <div className="border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">-sV (Service Scan)</span>
                        <h4 className="text-white font-medium text-sm">Version Detection</h4>
                      </div>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Probes open ports to determine service name and version. Essential for building vulnerability inventories.
                      </p>
                    </div>

                    <div className="border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-xs font-bold">-O (OS Detection)</span>
                        <h4 className="text-white font-medium text-sm">Operating System Fingerprinting</h4>
                      </div>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Triggers TCP/IP fingerprinting queries to identify host OS kernel details.
                      </p>
                    </div>

                    <div className="border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">-A (Aggressive Scan)</span>
                        <h4 className="text-white font-medium text-sm">All-in-one Audit</h4>
                      </div>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Enables OS detection, service version detection, script scanning (NSE), and tracerouting. Very powerful but noisy.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">-sU (UDP Scan)</span>
                        <h4 className="text-white font-medium text-sm">UDP Services Scan</h4>
                      </div>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                        Identifies open UDP services like DNS, DHCP, TFTP, or SNMP. Harder to scan since UDP lacks standard connection replies.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Ethical Scanning Rules */}
              {activeTab === 'ethics' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Ethical Boundaries & Laws</h2>
                  <p className="text-gray-400 leading-relaxed font-light mb-6">
                    Because port scanning maps out the attack surface of a device, unauthorized scanning can be interpreted as hostile reconnaissance or a precursor to an attack.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="mt-0.5 text-emerald-400">
                        <CheckSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">Always Obtain Consent</h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mt-1">
                          Only scan environments you own (e.g. localhost, private VMs) or where you have explicit, written authorization (like a Rules of Engagement pentest document).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="mt-0.5 text-cyan-400">
                        <CheckSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">Beware of Legal Regulations</h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mt-1">
                          In many jurisdictions, scanning networks belonging to ISPs, companies, or universities without permission violates computing bills (e.g., Computer Fraud and Abuse Act in the US, Computer Misuse Act in the UK).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="mt-0.5 text-purple-400">
                        <CheckSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">Configure Scans Wisely</h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mt-1">
                          High-intensity scans can accidentally crash fragile network equipment, legacy OT/IoT hardware, or overload network firewalls.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
