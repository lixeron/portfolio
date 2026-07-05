import { useState, useCallback, useEffect } from "react";
import Terminal from "./components/Terminal";
import FluidBackground from "./components/FluidBackground";
import Portfolio from "./components/Portfolio";
import { gsap } from "gsap";

const TRANSITION_COLORS = {
  light: {
    bg: "#ECE7D6",     // Warm Sage Light Paper
    fg: "#2C291D",     // Charcoal Text
    green: "#3E4E35",  // Sage Green
    yellow: "#B5482E", // Clay Red
    blue: "#51626B",   // Blue Slate
    red: "#A33A22",    // Ember Red
    fg4: "#55604B",
  },
  dark: {
    bg: "#1A1D16",     // Forest Dark
    fg: "#ECE7D6",     // Cream text
    green: "#7C8F6D",  // Sage Green
    yellow: "#fabd2f", // Yellow accent
    blue: "#48687A",   // Starry Blue
    red: "#E26345",    // Glowing Terracotta
    fg4: "#98947B",
  }
};

const getInitialTheme = () => {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved === "light" || saved === "dark") return saved;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemDark ? "dark" : "light";
};

/* ── Combined High-Tech Game Boot & CRT Collapse Transition (Theme Synced) ── */
function CRTTransition({ theme, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [booting, setBooting] = useState(true);
  const [phase, setPhase] = useState(0);

  const colors = TRANSITION_COLORS[theme] || TRANSITION_COLORS.light;

  // 1. Ticking up progress with slight jitter / loading logs
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 1;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setBooting(false);
        clearInterval(interval);
      } else {
        setProgress(current);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // 2. Triggers the CRT TV shutdown animation phases once progress hits 100
  useEffect(() => {
    if (!booting) {
      const t = [
        setTimeout(() => setPhase(1), 100), 
        setTimeout(() => setPhase(2), 600), 
        setTimeout(() => setPhase(3), 1200), 
        setTimeout(() => setPhase(4), 1800), 
        setTimeout(() => onComplete(), 2500)
      ];
      return () => t.forEach(clearTimeout);
    }
  }, [booting, onComplete]);

  // Generate scrambled symbol trails for loader text
  const getScrambledText = () => {
    const symbols = "!@#$%^&*()_+{}|:<>?[]/.,";
    let text = "";
    for (let i = 0; i < 3; i++) {
      text += symbols[Math.floor(Math.random() * symbols.length)];
    }
    return text;
  };

  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      zIndex: 9999, 
      background: colors.bg, 
      color: colors.fg,
      overflow: "hidden",
      fontFamily: "'JetBrains Mono', monospace",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      transition: "background-color 0.3s ease, color 0.3s ease"
    }}>
      <style>{`
        @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes flicker{0%,100%{opacity:1}10%{opacity:.85}30%{opacity:.7}50%{opacity:.4}70%{opacity:.3}90%{opacity:.15}}
        @keyframes distort{0%{transform:skewX(0)scaleY(1)}20%{transform:skewX(-4deg)scaleY(1.02)}40%{transform:skewX(6deg)scaleY(.98)}60%{transform:skewX(-10deg)scaleY(1.04)}80%{transform:skewX(2deg)scaleY(.96)}100%{transform:skewX(0)scaleY(0)}}
        @keyframes glitchSlice{0%{clip-path:inset(0 0 95% 0);transform:translateX(0)}25%{clip-path:inset(20% 0 60% 0);transform:translateX(-15px)}50%{clip-path:inset(50% 0 30% 0);transform:translateX(10px)}75%{clip-path:inset(70% 0 10% 0);transform:translateX(-5px)}100%{clip-path:inset(90% 0 0 0);transform:translateX(2px)}}
        @keyframes shrinkToLine{0%{transform:scaleY(1);opacity:1}60%{transform:scaleY(.02);opacity:1}100%{transform:scaleY(0);opacity:0}}
      `}</style>

      {/* CRT Scanline filter */}
      {(!booting || phase >= 1) && phase < 4 && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          background: `repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)`, 
          animation: "scanline .3s linear infinite", 
          pointerEvents: "none",
          zIndex: 20
        }} />
      )}

      {/* ── Boot Ticker (Before 100% completion) ── */}
      {booting && (
        <div style={{ maxWidth: "580px", width: "100%", textAlign: "left", fontSize: "14px", lineHeight: "1.6em" }}>
          <div style={{ color: colors.green, fontWeight: 700, marginBottom: "16px" }}>
            LIXERON(R) BOOT-ROM SYSTEM V4.3
          </div>
          <div style={{ color: colors.fg4, marginBottom: "20px" }}>
            ------------------------------------------------
          </div>
          <div>
            <span style={{ color: colors.blue }}>[  OK  ]</span> Initializing console canvas...
          </div>
          {progress > 20 && (
            <div>
              <span style={{ color: colors.blue }}>[  OK  ]</span> Compiling WebGL fluid textures...
            </div>
          )}
          {progress > 50 && (
            <div>
              <span style={{ color: colors.blue }}>[  OK  ]</span> Restructuring projects database...
            </div>
          )}
          {progress > 78 && (
            <div>
              <span style={{ color: colors.blue }}>[  OK  ]</span> Resolving CS Senior profiles...
            </div>
          )}
          
          <div style={{ marginTop: "28px" }}>
            <span style={{ color: colors.yellow }}>[ LOAD ]</span> Starting portfolio modules...
          </div>
          
          {/* Progress Bar & Percentage Scrambler */}
          <div style={{ marginTop: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ color: colors.green }}>
              [{"█".repeat(Math.floor(progress / 10)) + "░".repeat(10 - Math.floor(progress / 10))}]
            </span>
            <span style={{ width: "80px", color: colors.green }}>
              {progress === 100 ? "100%" : `${progress}% [${getScrambledText()}]`}
            </span>
          </div>
        </div>
      )}

      {/* ── CRT TV Power-down (Starts once progress reaches 100%) ── */}
      {!booting && phase >= 1 && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          background: colors.bg, 
          animation: phase >= 3 ? "flicker .4s ease-in forwards" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            animation: phase >= 2 ? "distort 1s ease-in forwards" : "none" 
          }}>
            {[0, 1, 2].map(idx => (
              <div 
                key={idx} 
                style={{ 
                  position: "absolute", 
                  inset: 0, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "clamp(24px, 4vw, 48px)", 
                  fontWeight: 700, 
                  color: [colors.red, colors.green, colors.blue][idx], 
                  opacity: phase >= 2 ? 0.7 : 0, 
                  animation: phase >= 2 ? `glitchSlice .5s ${idx * 0.1}s ease-in-out infinite alternate` : "none", 
                  mixBlendMode: "screen" 
                }}
              >
                BOOT COMPLETE
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapse line/dot mask */}
      {!booting && phase >= 3 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 15 }}>
          <div style={{ width: "100%", height: "100%", background: colors.bg, animation: "shrinkToLine .8s .2s ease-in forwards" }}>
            <div style={{ 
              position: "absolute", 
              top: "50%", 
              left: "50%", 
              transform: "translate(-50%, -50%)", 
              width: 4, 
              height: 4, 
              background: colors.fg, 
              borderRadius: "50%", 
              boxShadow: `0 0 30px 10px ${colors.fg}40`, 
              opacity: phase >= 4 ? 0 : 1, 
              transition: "opacity 0.5s" 
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [scene, setScene] = useState("terminal"); // "terminal" | "transition" | "portfolio"
  const [theme, setTheme] = useState(getInitialTheme); // Persistent and matches OS preference
  const [portfolioTab, setPortfolioTab] = useState("projects");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme); // Save on toggle
  }, [theme]);

  // Smoothly fade-in portfolio scene using GSAP once mounted
  useEffect(() => {
    if (scene === "portfolio") {
      gsap.fromTo("#portfolio-root-container", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.2, ease: "power2.out", clearProps: "opacity" }
      );
    }
  }, [scene]);

  const handleLaunchPortfolio = useCallback(() => {
    setScene("transition");
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setScene("portfolio");
  }, []);

  const handleBackToTerminal = useCallback(() => {
    setScene("terminal");
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme(t => (t === "light" ? "dark" : "light"));
  }, []);

  const handleTabChange = useCallback((newTab) => {
    setPortfolioTab(newTab);
  }, []);

  return (
    <>
      {/* Riced Linux CLI Terminal with theme sync and visible fluid background */}
      {scene === "terminal" && (
        <div style={{
          backgroundColor: theme === "light" ? "#ECE7D6" : "#1A1D16",
          minHeight: "100vh",
          width: "100vw",
          overflowX: "hidden",
          transition: "background-color 0.3s ease",
          position: "relative"
        }}>
          {/* Faint but visible (0.55 opacity) Navier-Stokes fluid background */}
          <FluidBackground theme={theme} opacity={0.55} />
          <Terminal 
            onLaunchPortfolio={handleLaunchPortfolio} 
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        </div>
      )}

      {/* Combined System Boot & CRT Shutdown Transition */}
      {scene === "transition" && (
        <CRTTransition theme={theme} onComplete={handleTransitionComplete} />
      )}

      {/* Main Portfolio Layout Container */}
      {scene === "portfolio" && (
        <div 
          id="portfolio-root-container"
          style={{
            opacity: 0, // Animate entry using GSAP
            backgroundColor: theme === "light" ? "#ECE7D6" : "#1A1D16",
            minHeight: "100vh",
            width: "100vw",
            overflowX: "hidden"
          }}
        >
          {/* Full opacity Project-LIVE fluid background */}
          <FluidBackground theme={theme} opacity={1.0} />

          {/* Tabbed Portfolio Pages */}
          <Portfolio 
            activeTab={portfolioTab} 
            onTabChange={handleTabChange} 
            onBackToTerminal={handleBackToTerminal}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        </div>
      )}
    </>
  );
}
