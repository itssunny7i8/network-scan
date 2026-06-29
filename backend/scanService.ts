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
}

export interface IScanService {
  executeScan(target: string, scanType: string): Promise<ScanResult>;
}

export class MockScanService implements IScanService {
  // Simple helper to resolve a domain to a mock IP
  private resolveTargetToIp(target: string): string {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipRegex.test(target)) return target;
    if (target === 'localhost') return '127.0.0.1';
    
    // Hash domain name to a simulated IP address
    let hash = 0;
    for (let i = 0; i < target.length; i++) {
      hash = target.charCodeAt(i) + ((hash << 5) - hash);
    }
    const ip = [
      192,
      168,
      Math.abs((hash >> 8) % 254) + 1,
      Math.abs(hash % 254) + 1
    ].join('.');
    return ip;
  }

  // Helper to generate consistent hash-based profiles for custom targets
  private getTargetProfile(target: string, ip: string, scanType: string) {
    const isLocal = ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.');
    
    // Default Profiles
    if (ip === '127.0.0.1') {
      return {
        hostname: 'localhost.localdomain',
        os: 'Linux 5.15.0-generic (Ubuntu)',
        latency: '0.04ms',
        ports: [
          { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu 3ubuntu0.1' },
          { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'nginx 1.18.0' },
          { port: 3000, protocol: 'tcp', state: 'open', service: 'http', version: 'Node.js Express App (Development)' },
          { port: 5000, protocol: 'tcp', state: 'open', service: 'http', version: 'Node.js Express API' },
          { port: 27017, protocol: 'tcp', state: 'open', service: 'mongodb', version: 'MongoDB 6.0.5' }
        ]
      };
    } else if (ip.endsWith('.1')) {
      // Router/Gateway profile
      return {
        hostname: 'gateway.home.lab',
        os: 'Embedded Linux (OpenWrt)',
        latency: '1.82ms',
        ports: [
          { port: 53, protocol: 'tcp', state: 'open', service: 'domain', version: 'dnsmasq 2.86' },
          { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'LuCI OpenWrt WebUI' },
          { port: 443, protocol: 'tcp', state: 'open', service: 'https', version: 'uhttpd' }
        ]
      };
    } else if (ip.startsWith('172.17.') || ip === '10.0.0.5') {
      // Vulnerable sandbox profile
      return {
        hostname: 'vuln-sandbox.target.local',
        os: 'Linux 2.6.x (Metasploitable 2)',
        latency: '8.45ms',
        ports: [
          { port: 21, protocol: 'tcp', state: 'open', service: 'ftp', version: 'vsftpd 2.3.4 (Backdoor vulnerable)' },
          { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 4.7p1 Debian 8ubuntu1' },
          { port: 23, protocol: 'tcp', state: 'open', service: 'telnet', version: 'Linux telnetd' },
          { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'Apache httpd 2.2.8 (PHP 5.2.4)' },
          { port: 139, protocol: 'tcp', state: 'open', service: 'netbios-ssn', version: 'Samba smbd 3.X' },
          { port: 445, protocol: 'tcp', state: 'open', service: 'microsoft-ds', version: 'Samba smbd 3.X' },
          { port: 3306, protocol: 'tcp', state: 'open', service: 'mysql', version: 'MySQL 5.0.51a-3ubuntu5' }
        ]
      };
    } else {
      // Dynamic profile based on target hash
      let code = 0;
      for (let i = 0; i < target.length; i++) {
        code += target.charCodeAt(i);
      }
      
      const osList = [
        'Windows Server 2019 Datacenter',
        'Linux 5.4.0 (Debian/GNU)',
        'BSD/OS 4.x - 5.x',
        'Cisco IOS XE 16.9.1'
      ];
      const selectedOs = osList[code % osList.length];
      const latencyVal = `${(code % 50) + 10}.${(code % 9)}ms`;
      
      // Select port sets based on hash
      const allPossiblePorts = [
        { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 8.4p1 Debian' },
        { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'Apache httpd 2.4.41' },
        { port: 443, protocol: 'tcp', state: 'open', service: 'https', version: 'Apache httpd (SSL)' },
        { port: 8080, protocol: 'tcp', state: 'open', service: 'http-proxy', version: 'Tomcat 9.0.37' },
        { port: 53, protocol: 'udp', state: 'open', service: 'domain', version: 'BIND 9.16.1' }
      ];
      
      const numPorts = (code % 3) + 2; // 2 to 4 ports
      const ports: PortResult[] = [];
      for (let i = 0; i < numPorts; i++) {
        const portItem = allPossiblePorts[(code + i) % allPossiblePorts.length];
        // Ensure no duplicate ports
        if (!ports.find(p => p.port === portItem.port)) {
          ports.push(portItem);
        }
      }
      
      return {
        hostname: `${target.toLowerCase().replace(/[^a-z0-9.-]/g, '')}.node.cyberlab`,
        os: selectedOs,
        latency: latencyVal,
        ports: ports
      };
    }
  }

  // Generates ASCII console output similar to what Nmap outputs
  private generateRawConsole(
    target: string, 
    ip: string, 
    scanType: string, 
    profile: { hostname: string; os: string; latency: string; ports: PortResult[] },
    scanTimeSeconds: string
  ): string {
    const timestamp = new Date().toLocaleString();
    let cmd = `nmap `;
    
    switch (scanType) {
      case 'quick':
        cmd += `-F ${target}`;
        break;
      case 'service':
        cmd += `-sV ${target}`;
        break;
      case 'os':
        cmd += `-O ${target}`;
        break;
      case 'aggressive':
        cmd += `-A ${target}`;
        break;
      case 'udp':
        cmd += `-sU -F ${target}`;
        break;
      default:
        cmd += `${target}`;
    }

    let out = `Starting Nmap 7.92 ( https://nmap.org ) at ${timestamp}\n`;
    out += `Nmap scan report for ${profile.hostname} (${ip})\n`;
    out += `Host is up (latency: ${profile.latency}).\n`;
    
    // Filter ports based on scanType (e.g. UDP scan changes protocol to udp, quick scan limits ports)
    let portsToDisplay = [...profile.ports];
    if (scanType === 'udp') {
      portsToDisplay = portsToDisplay.map(p => ({
        ...p,
        protocol: 'udp',
        version: p.service === 'domain' ? 'BIND 9.16' : 'unknown udp service'
      }));
    } else if (scanType === 'quick') {
      // limit to top 3 ports
      portsToDisplay = portsToDisplay.slice(0, 3);
    }

    out += `Not shown: 995 closed ports\n`;
    out += `PORT      STATE SERVICE  VERSION\n`;
    
    portsToDisplay.forEach(p => {
      const portStr = `${p.port}/${p.protocol}`.padEnd(9, ' ');
      const stateStr = p.state.padEnd(6, ' ');
      const serviceStr = p.service.padEnd(8, ' ');
      const versionStr = (scanType === 'quick' ? '' : p.version);
      out += `${portStr} ${stateStr} ${serviceStr} ${versionStr}\n`;
    });

    if (scanType === 'os' || scanType === 'aggressive') {
      out += `\nDevice type: general purpose\n`;
      out += `Running: Linux 3.X|4.X|5.X\n`;
      out += `OS CPE: cpe:/o:linux:linux_kernel\n`;
      out += `OS details: ${profile.os}\n`;
      out += `Network Distance: 1 hop\n`;
    }

    if (scanType === 'aggressive') {
      out += `\nTRACEROUTE (using port 80/tcp)\n`;
      out += `HOP RTT     ADDRESS\n`;
      out += `1   ${profile.latency} ${ip}\n`;
    }

    out += `\nNmap done: 1 IP address (1 host up) scanned in ${scanTimeSeconds} seconds\n`;
    return out;
  }

  public async executeScan(target: string, scanType: string): Promise<ScanResult> {
    // 1. Resolve target IP and host
    const ip = this.resolveTargetToIp(target);
    
    // 2. Fetch target characteristics
    const profile = this.getTargetProfile(target, ip, scanType);
    
    // 3. Determine simulated duration (latency)
    let delayMs = 1500;
    if (scanType === 'service') delayMs = 2500;
    else if (scanType === 'os') delayMs = 2000;
    else if (scanType === 'aggressive') delayMs = 3500;
    else if (scanType === 'udp') delayMs = 3000;
    
    // Simulate real execution delay
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    const scanTimeSeconds = (delayMs / 1000).toFixed(2);
    const rawConsole = this.generateRawConsole(target, ip, scanType, profile, scanTimeSeconds);
    
    let filteredPorts = [...profile.ports];
    if (scanType === 'quick') {
      filteredPorts = filteredPorts.slice(0, 3);
    }
    if (scanType === 'udp') {
      filteredPorts = filteredPorts.map(p => ({
        ...p,
        protocol: 'udp',
        version: p.service === 'domain' ? 'BIND 9.16' : 'unknown udp service'
      }));
    }

    return {
      host: target,
      ip: ip,
      state: 'up',
      openPorts: filteredPorts.map(p => p.port),
      services: filteredPorts,
      os: (scanType === 'os' || scanType === 'aggressive') ? profile.os : 'Not Scanned (Use OS/Aggressive Scan)',
      hostname: profile.hostname,
      latency: profile.latency,
      scanTime: `${scanTimeSeconds}s`,
      rawConsole: rawConsole
    };
  }
}
