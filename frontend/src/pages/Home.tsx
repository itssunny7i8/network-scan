import { motion } from 'framer-motion';
import { Shield, Terminal, BookOpen, Cpu, ChevronRight } from 'lucide-react';

interface HomeProps {
  setCurrentPage: (page: string) => void;
}

export default function Home({ setCurrentPage }: HomeProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const features = [
    {
      icon: <Terminal className="h-6 w-6 text-emerald-400" />,
      title: "Scanner Simulation",
      description: "Trigger five distinct scan modes (Quick, Service, OS, Aggressive, UDP) and watch raw console logs generate in real-time."
    },
    {
      icon: <Cpu className="h-6 w-6 text-cyan-400" />,
      title: "Interactive Reports",
      description: "Drill down into host status, open ports, running services, and versions using elegant cards, tables, and visualization grids."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-400" />,
      title: "Guides",
      description: "Examine visual flowcharts and guides detailing packet handshakes, port state logic, and service detection techniques."
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-500" />,
      title: "Ethical Safeguards",
      description: "Constructed with strict inputs, sandboxed targets, and instructional popups teaching the code-level requirements of ethical hacking."
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden">
      {/* Background Decorative Radars and Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <motion.div 
        className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Banner: Lab Environment */}
        <motion.div 
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Ready
          </div>
        </motion.div>

        {/* Hero Copy */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Network Scanner
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-400 font-light mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Network Scanner is a modern web application designed to discover network hosts, identify running services, analyze open ports, and present scan results through a clean and intuitive interface.
          </motion.p>

          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <button
              onClick={() => setCurrentPage('scanner')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-medium shadow-lg shadow-emerald-500/15 hover:shadow-emerald-400/20 transition-all duration-300 transform hover:-translate-y-0.5 group"
            >
              Start Scan
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Animated Cyber Radar Simulation */}
        <motion.div 
          className="w-full max-w-2xl mx-auto mb-20 relative glass-panel rounded-2xl p-8 border border-white/5 shadow-glow-emerald/5 flex flex-col items-center justify-center overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0E17]/80 pointer-events-none" />
          <div className="w-48 h-48 rounded-full border border-emerald-500/20 flex items-center justify-center relative animate-[spin_20s_linear_infinite] mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent rounded-full" />
            <div className="w-36 h-36 rounded-full border border-emerald-500/15 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-emerald-500/10 flex items-center justify-center">
                <Shield className="h-10 w-10 text-emerald-500/45 animate-pulse" />
              </div>
            </div>
            {/* Blips */}
            <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-emerald-400 shadow-glow-emerald" />
            <div className="absolute bottom-12 right-6 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan animate-ping" />
            <div className="absolute bottom-12 right-6 w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>

          <div className="text-center">
            <h3 className="text-sm font-mono text-emerald-400 mb-1 flex items-center gap-1.5 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              GATEWAY READY
            </h3>
            <p className="text-xs text-gray-500 font-mono">127.0.0.1 // LAN GATEWAY // LOCAL TEST</p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              className="glass-panel glass-panel-hover p-6 rounded-xl border border-white/5 transition-all duration-300 flex flex-col justify-between"
              variants={itemVariants}
            >
              <div>
                <div className="p-3 bg-white/5 rounded-lg w-fit mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lab Rules and Disclaimer Accordion/Notice */}
        <motion.div 
          className="mt-16 p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 glass-panel"
          variants={itemVariants}
        >
          <div className="flex gap-4">
            <div className="p-2.5 bg-amber-500/10 rounded-lg h-fit text-amber-500">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-amber-200 mb-1">Ethical Framework & Scope Reminder</h4>
              <p className="text-sm text-amber-400/80 leading-relaxed font-light">
                This application is intended for authorized testing on localhost and private networks. Do not target external internet infrastructure without explicit written permission. Practice and test scan procedures inside localhost, private virtualization hosts, or container networks.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
