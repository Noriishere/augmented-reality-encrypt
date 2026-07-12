import { useEffect, useState } from 'react';

function glitchStr(text, intensity = 0.15) {
  const chars = '!@#$%^&*01';
  return text
    .split('')
    .map((c) => (Math.random() < intensity ? chars[Math.floor(Math.random() * chars.length)] : c))
    .join('');
}

/**
 * RoomWelcomeHUD — kartu "welcome + kasus" untuk desktop/mobile.
 * Muncul begitu roomWelcome di App.jsx bernilai visible=true.
 * Dismiss lewat tombol MULAI atau tombol Enter/Space (desktop).
 */
export default function RoomWelcomeHUD({ title, subtitle, caseText, onStart }) {
  const [glitch, setGlitch] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.75) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 120);
      }
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onStart?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart]);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4 font-mono"
      style={{
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(3px)',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 350ms ease-out',
      }}
    >
      <div
        className="relative w-full max-w-lg bg-black/80 border border-cyan-500/50"
        style={{
          transform: mounted ? 'scale(1)' : 'scale(0.96)',
          transition: 'transform 350ms ease-out',
          boxShadow: '0 0 40px rgba(6,182,212,0.15)',
        }}
      >
        {/* corner ticks */}
        <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

        <div className="px-6 py-8 md:px-10 md:py-10">
          <div className="text-center mb-6">
            <div className="text-[10px] tracking-[0.3em] text-cyan-600 mb-2">MISI DIMULAI</div>
            <h2
              className="text-2xl md:text-4xl font-black text-cyan-400 tracking-[0.15em]"
              style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}
            >
              {glitch ? glitchStr(title, 0.25) : title}
            </h2>
            {subtitle && (
              <div className="text-[11px] md:text-xs text-cyan-600 tracking-[0.2em] mt-2">{subtitle}</div>
            )}
          </div>

          <div className="w-full h-px bg-cyan-800/40 mb-6" />

          <p className="text-sm md:text-[15px] text-cyan-200/90 leading-relaxed mb-8">
            {caseText}
          </p>

          <button
            onClick={onStart}
            className="w-full py-3 bg-cyan-950/40 border border-cyan-500 text-cyan-300 tracking-[0.25em] text-sm font-bold hover:bg-cyan-500 hover:text-black transition-all active:scale-[0.98]"
          >
            [ MULAI ]
          </button>
          <div className="text-center text-[9px] text-cyan-700 mt-3 tracking-widest hidden md:block">
            atau tekan ENTER
          </div>
        </div>
      </div>
    </div>
  );
}