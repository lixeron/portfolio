import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { 
  ArrowRight, 
  X, 
  Mail, 
  Phone, 
  ArrowLeft, 
  ExternalLink, 
  Award, 
  BookOpen, 
  Terminal as TermIcon,
  Sun,
  Moon
} from "lucide-react";

const Github = ({ size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ flexShrink: 0 }}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ flexShrink: 0 }}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PROJECTS = {
  general: [
    {
      id: "project-specter",
      title: "Project Specter",
      tagline: "Open-Core Adversary Simulation",
      desc: "AI-powered phishing and adversary simulator dashboard. Parses credentials, hosts QR codes, and tracks real-time training results.",
      longDesc: "Project Specter is an adversary simulation framework built to train enterprise staff. Built with FastAPI on the backend and React on the frontend, it automates the creation of authentic training email campaigns, generates QR code-based pretexting landing pages, captures mock credentials, and displays visual user reporting metrics.",
      tech: ["Python", "FastAPI", "React", "Docker", "SQLAlchemy", "TailwindCSS"],
      role: "Full-Stack Lead Architect",
      year: "2025-2026",
      link: "https://github.com/lixeron/Project_Specter",
      video: "/previews/specter.mp4",
      color: "var(--ember-color)",
      status: "done"
    },
    {
      id: "traffic-drone",
      title: "Traffic Drone Detection",
      tagline: "YOLOv8 Real-Time OpenCV Tracker",
      desc: "Integrates DJI Tello hardware with Python and YOLOv8 for vehicle tracking and diagnostic GUI dashboard analytics.",
      longDesc: "Programmed a DJI Tello quadcopter flight controller using Python and the official DJI Tello SDK. Captured live video feeds, processed them frame-by-frame with OpenCV, and ran real-time object detection using YOLOv8. Designed a custom desktop diagnostic interface displaying airspeed, coordinate targets, system warnings, and vehicle classification graphs.",
      tech: ["Python", "YOLOv8", "DJI SDK", "OpenCV", "Tkinter"],
      role: "Solo Systems Developer",
      year: "2024",
      link: "https://github.com/SoleP12/Stark-Industries-CS-420",
      video: "/previews/drone.mp4",
      color: "var(--ember-color)",
      status: "done"
    },
    {
      id: "trackly",
      title: "Trackly",
      tagline: "Railroad Crossing Monitor",
      desc: "Live railroad crossing tracker. Visualizes crossing blockages and ingests FRA historical grade reports using Socrata API.",
      longDesc: "Trackly is a civic software project tracking railroad crossing blocks in Birmingham. Ingests grade crossing inventory data and incident reports from the Federal Railroad Administration (FRA) via Socrata transportation APIs. Features a React mapping interface showing real-time crossing statuses and crowdsourced congestion reports, backed by a FastAPI PostgreSQL database.",
      tech: ["FastAPI", "React", "Docker", "PostgreSQL", "Socrata API"],
      role: "Core Creator",
      year: "2025",
      link: "https://github.com/lixeron/trackly",
      video: null,
      color: "var(--brass-color)",
      status: "wip"
    },
    {
      id: "prism",
      title: "Prism",
      tagline: "AI Creator Repurposing Engine",
      desc: "AI-driven content repurposing compiler. Ingests video links, runs transcription filters, and produces social posts.",
      longDesc: "Prism is an AI tool for creators. Built with a FastAPI python core and a React frontend, users paste a YouTube link, which runs yt-dlp transcription extractors and feeds content into Gemini 2.5 Flash models to generate platform-specific posts (Twitter threads, LinkedIn articles, newsletters) with user-configurable style modifiers.",
      tech: ["Gemini 2.5", "FastAPI", "React", "Supabase", "yt-dlp"],
      role: "Lead Integrator",
      year: "2026",
      link: "https://github.com/lixeron/prism",
      video: null,
      color: "var(--brass-color)",
      status: "done"
    },
    {
      id: "vealthy",
      title: "Vealthy",
      tagline: "Voice-First On-Device Chef",
      desc: "Android cooking assistant in Kotlin. Uses offline on-device speech-to-text to map kitchen ingredients to instant recipes.",
      longDesc: "Vealthy is a native Android cooking application built with Jetpack Compose. Designed for hands-free cooking: users open the app and state available kitchen ingredients. A native, on-device Android SpeechRecognizer listens and transcribes the ingredients offline. It filters local databases to match recipes, with dark mode state hoisting and a custom waterdrop screen transition.",
      tech: ["Kotlin", "Android SDK", "Jetpack Compose", "SpeechToText"],
      role: "Solo Android Creator",
      year: "2025-2026",
      link: "https://github.com/astoylo/vealthy",
      video: null,
      color: "var(--brass-color)",
      status: "wip"
    }
  ],
  games: [
    {
      id: "dead-route",
      title: "Dead Route",
      tagline: "Hexagonal Procedural Zombie Roguelite",
      desc: "A tactical roguelite survival simulator built in C# and Unity. Navigate scarcity, customize weapon loadouts, and escape procedural threat AI.",
      longDesc: "Dead Route is a procedural roguelite survival simulator. It features dynamic hexagonal map generation, complex resource scarcity loops, and a custom pathfinding engine for infected AI that tracks player sound and visual cues. Developed originally in Python as a core CLI project, it was ported into Unity with complete particle systems, detailed UI inventory HUDs, and modular weapon attachments.",
      tech: ["C#", "Unity", "WebGL", "Pathfinding AI", "Procedural Generation"],
      role: "Solo Game Developer",
      year: "2024",
      link: "https://github.com/lixeron/Dead_Route",
      video: "/previews/dead_route.mp4",
      color: "var(--ember-color)",
      status: "done"
    },
    {
      id: "aevum",
      title: "Aevum",
      tagline: "Legacy Dynastic Life Sim",
      desc: "A roguelite life simulator built in React Native. A life is a run. Death is succession. The dynasty is the save file.",
      longDesc: "Aevum is a dynastic life simulator built in React Native. It blends RPG statistics with interactive choice systems. Each run follows a character from birth to retirement or untimely death, tracking consequences, health risks, and dynamic events. It features theme switching (Light, Warm Sage, Starry Dark), local storage save states, and sound effects.",
      tech: ["React Native", "Expo", "TypeScript", "Local Storage", "Sound FX"],
      role: "Lead Systems Architect // Solo Creator",
      year: "2025-2026",
      link: "https://github.com/lixeron",
      video: "/previews/aevum.mp4",
      color: "var(--brass-color)",
      status: "wip"
    }
  ],
  it: [
    {
      id: "azure-soc",
      title: "Azure Cloud SOC Lab",
      tagline: "SIEM & Honeypot Monitoring Hub",
      desc: "Cloud SOC monitoring lab. Ingested live Windows Event logs into Microsoft Sentinel and parsed global RDP brute-force geolocation maps.",
      longDesc: "Built an Azure Cloud Security Operations Center (SOC) lab. Configured a vulnerable Windows VM as a honeypot, exposing RDP ports to the public internet. Used PowerShell to parse Event Viewer authentication logs, query IP geolocation APIs, and log coordinate files. Configured Log Analytics Workspaces and Microsoft Sentinel to ingest reports, query logs with KQL, and generate real-time attack threat maps.",
      tech: ["Microsoft Sentinel", "KQL", "Azure Log Analytics", "PowerShell", "VM Honeypot"],
      role: "Security Administrator",
      year: "2025",
      link: "https://github.com/lixeron/Honeypot-SOC-Azure-Lab",
      video: null,
      color: "var(--ember-color)",
      status: "wip"
    },
    {
      id: "wireshark-ctf",
      title: "Wireshark CTF Challenge",
      tagline: "ICMP Packet Fragment Decoder",
      desc: "A networking CTF puzzle which hides segmented secret payloads in ICMP echo streams mixed with synthetic network traffic.",
      longDesc: "Created a beginner-friendly Wireshark Capture The Flag challenge. Developed a Python generator script that breaks a secret flag into hex segments, injects them into ICMP echo request packets, and floods a PCAP capture with HTTP, DNS, and noise traffic. Players must write tshark filters, extract payload streams, reverse hex ordering, and decode Base64 layers to solve the flag.",
      tech: ["Python", "Wireshark", "Tshark", "Networking", "Base64 Decoding"],
      role: "Challenge Creator",
      year: "2024",
      link: "https://github.com/lixeron/Wireshark-CTF-Beginner-Challenge",
      video: "/previews/wireshark.mp4",
      color: "var(--brass-color)",
      status: "done"
    }
  ],
  shopify: [
    {
      id: "anvil",
      title: "Anvil - Product Options",
      tagline: "3D Product Customizer Core",
      desc: "Shopify product customizer engine. Enables infinite merchant configurations, nested logic rules, and real-time WebGL visualizers.",
      longDesc: "Anvil is a high-performance product customizer engine for Shopify merchants. It supports infinitely nested conditional rules, allowing complex merchant customization trees (e.g. selecting options A reveals options B & C, affecting pricing). Features a custom WebGL editor using React Three Fiber, allowing buyers to customize product colors and engravings and see changes on a 3D model in real-time.",
      tech: ["TypeScript", "React Three Fiber", "WebGL", "Shopify API", "Three.js"],
      role: "Lead Architect // Solo Creator",
      year: "2025-2026",
      link: "https://github.com/lixeron",
      liveLink: "https://anvilextension.netlify.app/",
      appLink: "https://apps.shopify.com/anvil-1?locale=zh-TW",
      video: "/previews/anvil.mp4",
      color: "var(--brass-color)",
      status: "done"
    }
  ]
};

const EXPERIENCE = [
  {
    role: "Desktop Support – Student Assistant",
    company: "UAB IT",
    date: "Dec 2025 – Present",
    points: [
      "Image Windows/macOS machines, manage data migration, backups, and full system updates",
      "Harden systems via BIOS/UEFI, stage workstations for AD integration, observe PKI workflows",
      "Resolve tickets in ServiceNow, assign static IPs, deploy applications via Software Center"
    ]
  },
  {
    role: "ARLA Intern",
    company: "UAB – UABTeach",
    date: "Jan 2024 – May 2025",
    points: [
      "Tutored students in mathematics and CS concepts",
      "Assisted with classroom technology and troubleshooting",
      "Developed documentation habits for reporting student progress"
    ]
  }
];

export default function Portfolio({ activeTab, onTabChange, onBackToTerminal, theme, onToggleTheme }) {
  const [activeCategory, setActiveCategory] = useState("general");
  const [selectedProject, setSelectedProject] = useState(null);
  
  const modalOverlayRef = useRef(null);
  const modalCardRef = useRef(null);
  const lenisRef = useRef(null);

  // Initialize Lenis scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [activeTab]);

  // Handle modal body-scroll lock and Lenis toggling
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (lenisRef.current) {
        lenisRef.current.stop();
      }

      gsap.fromTo(modalOverlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(modalCardRef.current,
        { scale: 0.9, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.15)", delay: 0.05 }
      );
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (lenisRef.current) {
        lenisRef.current.start();
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedProject]);

  const handleCloseModal = () => {
    gsap.to(modalCardRef.current, {
      scale: 0.92,
      y: 20,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in"
    });
    gsap.to(modalOverlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setSelectedProject(null);
      }
    });
  };

  const handleTabTransition = (tabName) => {
    if (tabName === activeTab) return;
    
    gsap.to(".view-content", {
      opacity: 0,
      y: 12,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        onTabChange(tabName);
        window.scrollTo(0, 0);
        setTimeout(() => {
          gsap.to(".view-content", {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out"
          });
        }, 50);
      }
    });
  };

  const handleCategoryTransition = (catName) => {
    if (catName === activeCategory) return;
    
    gsap.to(".project-grid", {
      opacity: 0,
      scale: 0.98,
      duration: 0.2,
      onComplete: () => {
        setActiveCategory(catName);
        gsap.to(".project-grid", {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out"
        });
      }
    });
  };

  // Video hover preview helper
  const ProjectPreview = ({ project }) => {
    const [hovered, setHovered] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
      if (project.video && videoRef.current) {
        if (hovered) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
    }, [hovered, project.video]);

    if (project.video) {
      return (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: "100%",
            height: "180px",
            overflow: "hidden",
            position: "relative",
            borderBottom: "1px solid var(--line-color)",
            backgroundColor: "var(--card-alt-color)",
          }}
        >
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(44,41,29,0.3) 0%, transparent 50%)",
            pointerEvents: "none",
          }} />
          {!hovered && (
            <div style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              backgroundColor: "rgba(44, 41, 29, 0.6)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              pointerEvents: "none",
            }}>
              HOVER TO PLAY
            </div>
          )}
        </div>
      );
    }

    return (
      <div 
        style={{
          width: "100%",
          height: "180px",
          backgroundColor: "var(--card-alt-color)",
          borderBottom: "1px solid var(--line-color)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(124,143,109,0.03) 10px, rgba(124,143,109,0.03) 20px)`,
        }} />
        <TermIcon size={32} style={{ color: "var(--sub-color)", marginBottom: "8px", opacity: 0.6 }} />
        <span style={{ 
          fontFamily: "'JetBrains Mono', monospace", 
          fontSize: "10px", 
          color: "var(--sub-color)", 
          opacity: 0.8 
        }}>
          no preview clip
        </span>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      color: "var(--ink-color)",
      fontFamily: "'Outfit', sans-serif",
      position: "relative",
      zIndex: 2,
      paddingBottom: "80px",
    }}>
      <style>{`
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          transition: padding 0.3s ease;
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-links {
          display: flex;
          gap: 24px;
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .experience-timeline {
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: relative;
          padding-left: 32px;
          border-left: 2px solid var(--line-color);
          max-width: 800px;
          margin: 0 auto;
        }
        .experience-card {
          background-color: var(--card-color);
          border: 1px solid var(--line-color);
          border-radius: 8px;
          padding: 28px;
        }
        .experience-marker {
          position: absolute;
          left: -42px;
          top: 6px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: var(--bg-color);
          border: 3px solid var(--brass-color);
        }
        .view-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 24px 0 24px;
        }

        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column !important;
            padding: 12px 16px !important;
            gap: 12px !important;
          }
          .nav-left {
            width: 100%;
            justify-content: space-between !important;
          }
          .nav-right {
            width: 100%;
            justify-content: space-between !important;
            gap: 12px !important;
            border-top: 1px solid var(--line-color);
            padding-top: 10px;
          }
          .nav-links {
            flex: 1;
            justify-content: space-around !important;
            gap: 8px !important;
          }
          .nav-links button {
            font-size: 14px !important;
            padding: 2px 0 !important;
          }
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .experience-timeline {
            padding-left: 24px !important;
            gap: 24px !important;
          }
          .experience-card {
            padding: 18px !important;
          }
          .experience-marker {
            left: -32px !important;
            width: 14px !important;
            height: 14px !important;
            border-width: 2px !important;
          }
          .view-content {
            padding: 160px 16px 0 16px !important;
          }
        }
      `}</style>
      
      {/* Top Navigation Header - Translucent theme background */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "var(--header-bg)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line-color)",
        transition: "background-color 0.3s ease",
      }}>
        <div className="nav-container">
          {/* Logo / Title & Console back button positioned correctly: button on LEFT */}
          <div className="nav-left">
            <button 
              onClick={onBackToTerminal}
              style={{
                background: "transparent",
                border: "1px solid var(--sub-color)",
                color: "var(--sub-color)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                padding: "3px 10px",
                borderRadius: "20px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.target.style.color = "var(--brass-color)";
                e.target.style.borderColor = "var(--brass-color)";
              }}
              onMouseLeave={e => {
                e.target.style.color = "var(--sub-color)";
                e.target.style.borderColor = "var(--sub-color)";
              }}
            >
              <ArrowLeft size={10} /> terminal
            </button>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "var(--ink-color)",
            }}>
              Ethan Tran Portfolio
            </span>
          </div>

          {/* Navigation Links & Theme Toggle */}
          <div className="nav-right">
            <nav className="nav-links">
              {[
                { id: "projects", label: "Projects" },
                { id: "about", label: "About" },
                { id: "experience", label: "Experience" },
                { id: "contact", label: "Contact" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabTransition(tab.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "16px",
                    fontWeight: activeTab === tab.id ? 700 : 400,
                    fontStyle: activeTab === tab.id ? "italic" : "normal",
                    color: activeTab === tab.id ? "var(--brass-color)" : "var(--sub-color)",
                    cursor: "pointer",
                    position: "relative",
                    padding: "4px 0",
                    transition: "color 0.2s",
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      backgroundColor: "var(--brass-color)",
                    }} />
                  )}
                </button>
              ))}
            </nav>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              style={{
                background: "transparent",
                border: "1px solid var(--line-color)",
                color: "var(--sub-color)",
                padding: "6px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = "var(--brass-color)";
                e.target.style.color = "var(--brass-color)";
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = "var(--line-color)";
                e.target.style.color = "var(--sub-color)";
              }}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Layout Container */}
      <main className="view-content">
        
        {/* ======================================================== */}
        {/* PROJECTS TAB VIEW */}
        {/* ======================================================== */}
        {activeTab === "projects" && (
          <div>
            <div style={{ marginBottom: "40px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "var(--brass-color)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px"
              }}>
                [portfolio.sh // projects]
              </span>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                color: "var(--ink-color)",
              }}>
                Built Systems &amp; Playgrounds
              </h1>
            </div>

            {/* Category Sub-Navigation: General -> Games -> IT -> Shopify */}
            <div style={{
              display: "flex",
              gap: "12px",
              borderBottom: "1px solid var(--line-color)",
              paddingBottom: "16px",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}>
              {[
                { id: "general", label: "General" },
                { id: "games", label: "Games" },
                { id: "it", label: "IT" },
                { id: "shopify", label: "Shopify" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryTransition(cat.id)}
                  style={{
                    background: activeCategory === cat.id ? "var(--brass-color)" : "transparent",
                    color: activeCategory === cat.id ? "var(--bg-color)" : "var(--sub-color)",
                    border: activeCategory === cat.id ? "1px solid transparent" : "1px solid var(--line-color)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    padding: "6px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    if (activeCategory !== cat.id) {
                      e.target.style.color = "var(--ink-color)";
                      e.target.style.borderColor = "var(--sub-color)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeCategory !== cat.id) {
                      e.target.style.color = "var(--sub-color)";
                      e.target.style.borderColor = "var(--line-color)";
                    }
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="project-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}>
              {PROJECTS[activeCategory]?.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    backgroundColor: "var(--card-color)",
                    border: "1px solid var(--line-color)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 0.3s ease, border-color 0.3s",
                    height: "100%",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = project.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--line-color)";
                  }}
                >
                  <ProjectPreview project={project} />

                  <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      marginBottom: "12px" 
                    }}>
                      <span style={{ 
                        fontFamily: "'JetBrains Mono', monospace", 
                        fontSize: "11px", 
                        color: "var(--sub-color)" 
                      }}>
                        {project.year}
                      </span>
                      {project.status === "done" ? (
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#3E4E35",
                          border: "1px solid #3E4E3550",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}>
                          ✔
                        </span>
                      ) : (
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#B58A2E",
                          border: "1px solid #B58A2E50",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}>
                          ...
                        </span>
                      )}
                    </div>

                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "22px",
                      fontWeight: 700,
                      marginBottom: "6px",
                      color: "var(--ink-color)",
                    }}>
                      {project.title}
                    </h3>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontSize: "13px",
                      color: "var(--brass-color)",
                      marginBottom: "12px",
                    }}>
                      {project.tagline}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      color: "var(--sub-color)",
                      marginBottom: "20px",
                      flex: 1,
                    }}>
                      {project.desc}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", borderTop: "1px solid var(--line-color)", paddingTop: "16px" }}>
                      {project.tech.slice(0, 3).map((t, idx) => (
                        <span key={idx} style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "10px",
                          backgroundColor: "var(--card-alt-color)",
                          color: "var(--sub-color)",
                          padding: "2px 8px",
                          borderRadius: "4px"
                        }}>
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "10px",
                          color: "var(--sub-color)",
                          padding: "2px 4px",
                          opacity: 0.7
                        }}>
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABOUT TAB VIEW */}
        {/* ======================================================== */}
        {activeTab === "about" && (
          <div>
            <div style={{ marginBottom: "48px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "var(--brass-color)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px"
              }}>
                [portfolio.sh // about]
              </span>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                color: "var(--ink-color)",
              }}>
                The Developer Profile
              </h1>
            </div>

            <div className="about-grid">
              {/* Left Column: Bio */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <p style={{
                  fontSize: "18px",
                  lineHeight: "1.6",
                  color: "var(--ink-color)",
                  fontFamily: "'Playfair Display', serif",
                }}>
                  I'm a Computer Science Senior at the University of Alabama at Birmingham (UAB), passionate about IT support workflows, software development, and scripting automated solutions.
                </p>
                <p style={{
                  fontSize: "15px",
                  lineHeight: "1.7",
                  color: "var(--sub-color)",
                }}>
                  My approach is grounded in building stable, clean structures. I love Linux environments, command line ricing, and tweaking systems to operate exactly to my preferences.
                </p>
                <p style={{
                  fontSize: "15px",
                  lineHeight: "1.7",
                  color: "var(--sub-color)",
                }}>
                  I'm always looking to expand my engineering scope, whether it's setting up local networks, building interactive web apps, or managing databases.
                </p>
              </div>

              {/* Right Column: Education & Engagement */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Academic Card */}
                <div style={{
                  backgroundColor: "var(--card-color)",
                  border: "1px solid var(--line-color)",
                  borderRadius: "8px",
                  padding: "32px",
                  borderLeft: "4px solid var(--brass-color)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", color: "var(--brass-color)" }}>
                    <BookOpen size={20} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600 }}>ACADEMIC PROFILE</span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    marginBottom: "4px"
                  }}>
                    University of Alabama at Birmingham
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--sub-color)", marginBottom: "16px" }}>
                    B.A. Computer Science · Minor: Social Psychology &amp; Info Systems
                  </p>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      backgroundColor: "var(--brass-soft)",
                      color: "var(--brass-color)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}>
                      Grad: Dec 2026
                    </span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      backgroundColor: "var(--ember-soft)",
                      color: "var(--ember-color)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}>
                      Honors College
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid var(--line-color)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <Award size={16} style={{ color: "var(--brass-color)", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "13px", color: "var(--sub-color)" }}>
                        <strong>Accelerated M.S. Cybersecurity Track</strong>: Taking advanced master's level modules early to bridge software development with offensive/defensive operations.
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <Award size={16} style={{ color: "var(--brass-color)", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "13px", color: "var(--sub-color)" }}>
                        <strong>Tri-Alpha Honor Society</strong>: Academic excellence recognition.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Core Skills Summary */}
                <div style={{
                  backgroundColor: "var(--card-color)",
                  border: "1px solid var(--line-color)",
                  borderRadius: "8px",
                  padding: "32px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", color: "var(--sub-color)" }}>
                    <TermIcon size={16} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600 }}>CORE SYSTEMS &amp; TECH</span>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "var(--brass-color)", display: "block", marginBottom: "4px" }}>LANGUAGES</span>
                      <span style={{ fontSize: "14px", color: "var(--sub-color)" }}>Python, Bash, SQL, JavaScript/React, Kotlin, C#</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "var(--brass-color)", display: "block", marginBottom: "4px" }}>INFRASTRUCTURE &amp; IT</span>
                      <span style={{ fontSize: "14px", color: "var(--sub-color)" }}>Linux (Fedora/Ubuntu), Active Directory, Windows Software Center, Networking, ServiceNow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EXPERIENCE TAB VIEW */}
        {/* ======================================================== */}
        {activeTab === "experience" && (
          <div>
            <div style={{ marginBottom: "48px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "var(--brass-color)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px"
              }}>
                [portfolio.sh // experience]
              </span>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                color: "var(--ink-color)",
              }}>
                Timeline of Operations
              </h1>
            </div>

            <div className="experience-timeline">
              {EXPERIENCE.map((exp, idx) => (
                <div key={idx} style={{ position: "relative", marginBottom: "16px" }}>
                  <div className="experience-marker" />

                  <div className="experience-card">
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "16px"
                    }}>
                      <div>
                        <h3 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "20px",
                          fontWeight: 700,
                        }}>
                          {exp.role}
                        </h3>
                        <span style={{
                          fontSize: "14px",
                          color: "var(--brass-color)",
                          fontFamily: "'Playfair Display', serif",
                          fontStyle: "italic",
                          fontWeight: 600,
                        }}>
                          {exp.company}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        backgroundColor: "var(--card-alt-color)",
                        color: "var(--sub-color)",
                        padding: "4px 12px",
                        borderRadius: "4px"
                      }}>
                        {exp.date}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {exp.points.map((pt, ptIdx) => (
                        <p key={ptIdx} style={{
                          fontSize: "14px",
                          lineHeight: "1.6",
                          color: "var(--sub-color)",
                          paddingLeft: "16px",
                          position: "relative"
                        }}>
                          <span style={{
                            position: "absolute",
                            left: 0,
                            color: "var(--brass-color)",
                            fontWeight: 700
                          }}>
                            ›
                          </span>
                          {pt}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CONTACT TAB VIEW */}
        {/* ======================================================== */}
        {activeTab === "contact" && (
          <div>
            <div style={{ marginBottom: "48px", textAlign: "center" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "var(--brass-color)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px"
              }}>
                [portfolio.sh // contact]
              </span>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                color: "var(--ink-color)",
              }}>
                Establish Connection
              </h1>
              <p style={{
                fontSize: "16px",
                color: "var(--sub-color)",
                marginTop: "12px",
                maxWidth: "500px",
                margin: "12px auto 0 auto"
              }}>
                Open to any opportunities.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}>
              {/* Email Card */}
              <a 
                href="mailto:etran0155@gmail.com" 
                style={{
                  textDecoration: "none",
                  color: "var(--ink-color)",
                  backgroundColor: "var(--card-color)",
                  border: "1px solid var(--line-color)",
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--brass-color)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--line-color)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--brass-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brass-color)",
                  marginBottom: "20px"
                }}>
                  <Mail size={20} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Email</h3>
                <span style={{ fontSize: "14px", color: "var(--sub-color)" }}>etran0155@gmail.com</span>
              </a>

              {/* LinkedIn Card */}
              <a 
                href="https://www.linkedin.com/in/ethan-tran-774805255/" 
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  color: "var(--ink-color)",
                  backgroundColor: "var(--card-color)",
                  border: "1px solid var(--line-color)",
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--brass-color)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--line-color)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--brass-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brass-color)",
                  marginBottom: "20px"
                }}>
                  <Linkedin size={20} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>LinkedIn</h3>
                <span style={{ fontSize: "14px", color: "var(--sub-color)" }}>linkedin.com/in/ethan-tran</span>
              </a>

              {/* GitHub Card */}
              <a 
                href="https://github.com/lixeron" 
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  color: "var(--ink-color)",
                  backgroundColor: "var(--card-color)",
                  border: "1px solid var(--line-color)",
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--brass-color)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--line-color)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--brass-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brass-color)",
                  marginBottom: "20px"
                }}>
                  <Github size={20} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>GitHub</h3>
                <span style={{ fontSize: "14px", color: "var(--sub-color)" }}>github.com/lixeron</span>
              </a>

              {/* Phone Card */}
              <a 
                href="tel:334-589-0824" 
                style={{
                  textDecoration: "none",
                  color: "var(--ink-color)",
                  backgroundColor: "var(--card-color)",
                  border: "1px solid var(--line-color)",
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--brass-color)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--line-color)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--brass-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brass-color)",
                  marginBottom: "20px"
                }}>
                  <Phone size={20} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Call / SMS</h3>
                <span style={{ fontSize: "14px", color: "var(--sub-color)" }}>334-589-0824</span>
              </a>
            </div>
          </div>
        )}

      </main>

      {/* Footer detailing */}
      <footer style={{
        textAlign: "center",
        padding: "40px 24px 0 24px",
        borderTop: "1px solid var(--line-color)",
        maxWidth: "1200px",
        margin: "60px auto 0 auto",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        color: "var(--sub-color)",
        opacity: 0.8
      }}>
        built with warm sage · tea · and too many late terminal ricing commits © 2026
      </footer>

      {/* ======================================================== */}
      {/* FULLSCREEN PROJECT OVERLAY MODAL */}
      {/* ======================================================== */}
      {selectedProject && (
        <div 
          ref={modalOverlayRef}
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(28, 31, 21, 0.55)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 99999,
          }}
          onClick={handleCloseModal}
        >
          <div 
            ref={modalCardRef}
            className="modal-card"
            data-lenis-prevent
            style={{
              backgroundColor: "var(--card-color)",
              border: "1px solid var(--line-color)",
              borderRadius: "12px",
              maxWidth: "760px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Media Frame */}
            {selectedProject.video ? (
              <div style={{ width: "100%", height: "300px", backgroundColor: "#000", position: "relative" }}>
                <video
                  src={selectedProject.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={handleCloseModal}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--bg-color)",
                    border: "none",
                    color: "var(--ink-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div style={{ 
                width: "100%", 
                height: "180px", 
                backgroundColor: "var(--card-alt-color)", 
                borderBottom: "1px solid var(--line-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                <TermIcon size={48} style={{ color: "var(--sub-color)", opacity: 0.5 }} />
                <button
                  onClick={handleCloseModal}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--bg-color)",
                    border: `1px solid var(--line-color)`,
                    color: "var(--ink-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Modal Details */}
            <div style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <span style={{ 
                    fontFamily: "'JetBrains Mono', monospace", 
                    fontSize: "11px", 
                    color: "var(--sub-color)" 
                  }}>
                    {selectedProject.year} // {selectedProject.role}
                  </span>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "32px",
                    fontWeight: 800,
                    letterSpacing: "-1px",
                    marginTop: "4px"
                  }}>
                    {selectedProject.title}
                  </h2>
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                  {selectedProject.link && (
                    <a 
                      href={selectedProject.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "var(--brass-color)",
                        color: "var(--bg-color)",
                        padding: "8px 18px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                    >
                      REPOSITORY <ExternalLink size={12} />
                    </a>
                  )}

                  {selectedProject.liveLink && (
                    <a 
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "var(--brass-color)",
                        color: "var(--bg-color)",
                        padding: "8px 18px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                    >
                      LIVE DEMO <ExternalLink size={12} />
                    </a>
                  )}

                  {selectedProject.appLink && (
                    <a 
                      href={selectedProject.appLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "var(--brass-color)",
                        color: "var(--bg-color)",
                        padding: "8px 18px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                    >
                      SHOPIFY STORE <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "15px",
                color: "var(--brass-color)",
                marginBottom: "16px",
                fontWeight: 600,
              }}>
                {selectedProject.tagline}
              </p>

              <div style={{ borderTop: "1px solid var(--line-color)", paddingTop: "16px" }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Project Details</h4>
                <p style={{
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "var(--sub-color)",
                  marginBottom: "24px"
                }}>
                  {selectedProject.longDesc}
                </p>
              </div>

              <div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>Compiled Stack</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedProject.tech.map((t, idx) => (
                    <span key={idx} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      backgroundColor: "var(--card-alt-color)",
                      color: "var(--sub-color)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      border: "1px solid var(--line-color)"
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
