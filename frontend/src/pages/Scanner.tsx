import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Play, Loader2, Download, AlertTriangle, 
  Layers, HardDrive, Clock, CheckCircle2, History, Database, Cpu
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { API_BASE_URL } from '../config';

// Typings for scan results
export interface PortResult {
  port: number;
  protocol: string;
  state: string;
  service: string;
  version: string;
}

export interface ScanResult {
  host: string;
  ip: string;
  state: string;
  openPorts: number[];
  services: PortResult[];
  os: string;
  hostname: string;
  latency: string;
  scanTime: string;
  rawConsole: string;
  timestamp?: string;
  scanTypeLabel?: string;
}

interface ScannerProps {
  scanHistory: ScanResult[];
  addScanToHistory: (scan: ScanResult) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'warning') => void;
}

export default function Scanner({ scanHistory, addScanToHistory, showToast }: ScannerProps) {
  const [target, setTarget] = useState('127.0.0.1');
  const [scanType, setScanType] = useState('quick');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);
  
  // Console logging state for typewriter simulation during scan
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Scan type mapping
  const scanTypes = [
    { value: 'quick', label: 'Quick Scan', cmd: '-F', description: 'Scans top 100 ports' },
    { value: 'service', label: 'Service Detection', cmd: '-sV', description: 'Identifies service versions' },
    { value: 'os', label: 'OS Detection', cmd: '-O', description: 'Fingerprints host operating system' },
    { value: 'aggressive', label: 'Aggressive Scan', cmd: '-A', description: 'Full OS, service, traceroute' },
    { value: 'udp', label: 'UDP Scan', cmd: '-sU -F', description: 'Scans major UDP endpoints' }
  ];

  // Auto-scroll console
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Client validation
  const validateTarget = (val: string): boolean => {
    const cleanVal = val.trim();
    if (!cleanVal) {
      showToast('Please specify a target IP or Domain.', 'warning');
      return false;
    }
    const targetRegex = /^[a-zA-Z0-9.-]+$/;
    if (!targetRegex.test(cleanVal)) {
      showToast('Illegal target characters. Special shell markers and spaces are blocked.', 'error');
      return false;
    }
    return true;
  };

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTarget(target)) return;

    setStatus('scanning');
    setErrorMessage('');
    setActiveResult(null);
    setConsoleLogs([]);
    setCurrentProgress(5);

    // Simulated terminal print stream
    const logs = [
      `[+] Initializing educational Nmap scan runner...`,
      `[+] Target parsed: ${target.trim()}`,
      `[+] Scan parameter configuration: nmap ${scanTypes.find(t => t.value === scanType)?.cmd} ${target.trim()}`,
      `[+] Bypassing active firewall shunning for virtual localhost subnet...`,
      `[+] Sending probe packets (ICMP ping & SYN handshake verification)...`,
      `[+] Target host responded. Latency detected under 15ms.`,
      `[+] Beginning port scanning queries (range: 1 - 1000)...`,
      `[+] Analyzing TCP/IP packet replies for banner grabbing...`,
      `[+] Extracting system fingerprint vectors...`,
      `[+] Scan completed. Compiling structured network audit ledger...`
    ];

    // Stream logs slowly
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logs.length) {
        setConsoleLogs(prev => [...prev, logs[logIndex]]);
        setCurrentProgress(Math.min(90, Math.round(((logIndex + 1) / logs.length) * 100)));
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 280);

    try {
      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.trim(), scanType })
      });

      const result = await response.json();
      clearInterval(logInterval);

      if (response.ok && result.success) {
        const fullResult: ScanResult = {
          ...result.data,
          timestamp: new Date().toLocaleTimeString(),
          scanTypeLabel: scanTypes.find(t => t.value === scanType)?.label
        };
        
        setCurrentProgress(100);
        setTimeout(() => {
          setStatus('success');
          setActiveResult(fullResult);
          addScanToHistory(fullResult);
          showToast(`Scan of ${target} completed successfully!`, 'success');
        }, 300);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Server rejected the scan query parameters.');
        showToast(result.error || 'Failed to complete scan.', 'error');
      }
    } catch (err: any) {
      clearInterval(logInterval);
      setStatus('error');
      setErrorMessage('Backend scanner endpoint offline. Please verify Express server is running on Port 5000.');
      showToast('Network error: Could not reach Express backend API.', 'error');
    }
  };

  // Select historical scan
  const loadHistoryItem = (item: ScanResult) => {
    setActiveResult(item);
    setStatus('success');
    setTarget(item.host);
    showToast(`Loaded report for ${item.host} (${item.ip})`, 'success');
  };

  // Export report as PDF
  const handleExportPDF = async () => {
    if (!reportRef.current || !activeResult) return;
    
    showToast('Preparing PDF download document...', 'success');
    const element = reportRef.current;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0A0E17'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`nmap_report_${activeResult.host.replace(/[^\w-]/g, '_')}.pdf`);
      showToast('PDF exported successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to export report to PDF.', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid: Inputs (Left/Top) & History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Main configuration terminal card */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            Educational Recon Engine
          </h2>
          <p className="text-xs text-gray-400 mb-6 font-light">
            Inputs are scrutinized to block command injections. Real-time packets are simulated dynamically in a sandbox.
          </p>

          <form onSubmit={handleStartScan} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5 font-semibold">TARGET IP / DOMAIN</label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 127.0.0.1, localhost"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1626] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:shadow-glow-emerald/10 transition-all"
                  disabled={status === 'scanning'}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5 font-semibold">SCAN TECHNIQUE</label>
                <select
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1626] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:shadow-glow-emerald/10 transition-all appearance-none cursor-pointer"
                  disabled={status === 'scanning'}
                >
                  {scanTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label} ({t.cmd})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
              <span className="text-[11px] text-gray-500 font-mono">
                Active config: <code className="text-emerald-400">nmap {scanTypes.find(t => t.value === scanType)?.cmd} {target || "[target]"}</code>
              </span>
              
              <button
                type="submit"
                disabled={status === 'scanning'}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium text-sm transition-all duration-300 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-glow-emerald/10"
              >
                {status === 'scanning' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scanning target...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    Execute Scan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Scan History sidebar card */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-white/5 flex flex-col">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            Recent Recon Records
          </h3>
          
          <div className="flex-1 min-h-[140px] max-h-[140px] lg:max-h-none overflow-y-auto space-y-2 pr-1">
            {scanHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
                <Database className="h-8 w-8 mb-2 text-gray-600" />
                <p className="text-xs font-light">No records found. Trigger a scan above to build history logs.</p>
              </div>
            ) : (
              scanHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => loadHistoryItem(item)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-transparent hover:border-emerald-500/20 hover:bg-white/10 transition-all flex justify-between items-center group"
                >
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">{item.host}</h4>
                    <p className="text-[10px] text-gray-400 font-mono">{item.scanTypeLabel} • {item.timestamp}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/10">
                    {item.services.length} ports
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Loading state visual console */}
      {status === 'scanning' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 border border-white/5 mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
              Scanning Console Stream
            </h4>
            <span className="text-xs font-mono text-emerald-400">{currentProgress}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden mb-4 border border-white/5">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>

          {/* Terminal Console output */}
          <div className="bg-[#05070B] rounded-xl p-4 border border-white/5 h-44 overflow-y-auto font-mono text-xs text-gray-400 space-y-1.5">
            {consoleLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-gray-600 flex-shrink-0">&gt;</span>
                <span className={index === consoleLogs.length - 1 ? 'text-emerald-400 font-semibold' : ''}>{log}</span>
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        </motion.div>
      )}

      {/* Error state display */}
      {status === 'error' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 glass-panel flex gap-4 items-start mb-8"
        >
          <div className="p-2.5 bg-red-500/10 rounded-lg text-red-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-200 mb-1">Scan Execution Failure</h3>
            <p className="text-sm text-red-400/80 leading-relaxed font-light mb-4">
              {errorMessage}
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-all"
            >
              Reset Form
            </button>
          </div>
        </motion.div>
      )}

      {/* Scan Results Panel */}
      <AnimatePresence>
        {status === 'success' && activeResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* The printable report container */}
            <div ref={reportRef} id="report-content" className="space-y-8 p-1">
              
              {/* Header inside PDF report */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1 uppercase tracking-wider">
                    {activeResult.scanTypeLabel} Simulation Ledger
                  </div>
                  <h3 className="text-2xl font-bold text-white">{activeResult.host}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">Resolved IP: {activeResult.ip} • Host: {activeResult.hostname}</p>
                </div>
                
                <div className="flex gap-3 self-stretch md:self-auto justify-end">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF Report
                  </button>
                </div>
              </div>

              {/* Grid: Host Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-gray-400 mb-2">
                    <span className="text-xs font-medium">Host Status</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-bold text-white uppercase">{activeResult.state}</div>
                  <p className="text-[10px] text-gray-500 font-light mt-1">Status confirmed via response ping.</p>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-gray-400 mb-2">
                    <span className="text-xs font-medium">Latency</span>
                    <Clock className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-lg font-bold text-white">{activeResult.latency}</div>
                  <p className="text-[10px] text-gray-500 font-light mt-1">Network round trip time metrics.</p>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-gray-400 mb-2">
                    <span className="text-xs font-medium">Operating System</span>
                    <Layers className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-white truncate" title={activeResult.os}>{activeResult.os}</div>
                  <p className="text-[10px] text-gray-500 font-light mt-1.5">Resolved via IP stack markers.</p>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-gray-400 mb-2">
                    <span className="text-xs font-medium">Scan Duration</span>
                    <Cpu className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-bold text-white">{activeResult.scanTime}</div>
                  <p className="text-[10px] text-gray-500 font-light mt-1">Simulated execution duration.</p>
                </div>
              </div>

              {/* Dynamic CSS Port Grid Visualization */}
              <div className="glass-panel rounded-2xl p-6 border border-white/5">
                <h4 className="text-sm font-bold text-white mb-1.5">Interactive Network Port Matrix</h4>
                <p className="text-xs text-gray-400 mb-4 font-light">
                  A visual catalog of common ports. Open ports glow in emerald green; closed ports remain dark. Click on any active port to review its configuration.
                </p>

                <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-20 gap-2 p-4 bg-[#0A0E17]/60 border border-white/5 rounded-xl">
                  {Array.from({ length: 40 }).map((_, idx) => {
                    // map visual boxes to common port numbers
                    const customPorts = [
                      21, 22, 23, 25, 53, 80, 110, 139, 443, 445, 1433, 3306, 3389, 5000, 8080, 27017
                    ];
                    const portNumber = customPorts[idx % customPorts.length] + Math.floor(idx / customPorts.length) * 10;
                    const isOpen = activeResult.openPorts.includes(portNumber);
                    
                    return (
                      <div
                        key={idx}
                        className={`aspect-square rounded flex flex-col items-center justify-center text-[9px] font-mono border transition-all ${
                          isOpen 
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold shadow-glow-emerald/10 cursor-pointer hover:bg-emerald-500/20' 
                            : 'bg-white/[0.02] border-white/5 text-gray-600 select-none'
                        }`}
                        title={isOpen ? `Port ${portNumber} is OPEN` : `Port ${portNumber} closed/filtered`}
                      >
                        <span>{portNumber}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Services Table */}
              <div className="glass-panel rounded-2xl p-6 border border-white/5">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-emerald-400" />
                  Discovered Ports & Application Services
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="pb-3 font-semibold">PORT</th>
                        <th className="pb-3 font-semibold">PROTOCOL</th>
                        <th className="pb-3 font-semibold">STATE</th>
                        <th className="pb-3 font-semibold">SERVICE</th>
                        <th className="pb-3 font-semibold">VERSION DETECTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {activeResult.services.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-gray-500">
                            No open ports were discovered during this scan.
                          </td>
                        </tr>
                      ) : (
                        activeResult.services.map((srv, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-all">
                            <td className="py-3.5 text-white font-bold">{srv.port}</td>
                            <td className="py-3.5 text-cyan-400 uppercase">{srv.protocol}</td>
                            <td className="py-3.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/10 font-bold">
                                {srv.state}
                              </span>
                            </td>
                            <td className="py-3.5 text-purple-400 font-semibold">{srv.service}</td>
                            <td className="py-3.5 text-gray-400 font-light italic">{srv.version || 'No Banner Retreived'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raw Console Output Block */}
              <div className="glass-panel rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-cyan-400" />
                    Nmap Terminal Console Log (Raw output)
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeResult.rawConsole);
                      showToast('Console text copied to clipboard!', 'success');
                    }}
                    className="text-[10px] text-gray-500 hover:text-white transition-all font-mono"
                  >
                    [Copy Output]
                  </button>
                </div>
                
                <pre className="p-4 bg-[#05070B] rounded-xl border border-white/5 text-[11px] text-gray-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  {activeResult.rawConsole}
                </pre>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
