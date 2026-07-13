import React, { useEffect } from 'react';

export default function LandingPage({ onStart }) {
  // Listener buat tombol Enter fisik di keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-[#020617] overflow-hidden font-mono">
      {/* Latar Belakang Grid bergaya Cyberpunk/Terminal */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      ></div>
      
      {/* Kotak Konten Utama */}
      <div className="z-10 flex flex-col items-center p-10 bg-black/60 border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md rounded-xl text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-cyan-400 tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse">
          RAKHSHDATA
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-10 tracking-widest">
          CYBER DEFENSE TRAINING SIMULATOR
        </p>
        
        <button 
          onClick={onStart}
          className="px-8 py-4 bg-cyan-950/80 hover:bg-cyan-800 border-2 border-cyan-400 text-cyan-100 text-xl font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.9)] rounded cursor-pointer"
        >
          [ INISIASI SISTEM ]
        </button>

        {/* Hint keyboard */}
        <p className="text-slate-500 text-xs mt-4 tracking-widest animate-pulse">
          TEKAN [ ENTER ] UNTUK MELANJUTKAN
        </p>
      </div>

      {/* Footer/Peringatan Bawah */}
      <div className="absolute bottom-6 text-slate-600 text-sm tracking-widest text-center px-4">
        SYSTEM REQUIREMENTS: WEBXR COMPATIBLE BROWSER | SECURE CONNECTION
      </div>
    </div>
  );
}