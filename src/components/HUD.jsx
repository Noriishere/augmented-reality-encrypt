export default function HUD({ 
  currentRoom, 
  isKeyboardOpen, 
  onToggleKeyboard, 
  isFullscreen, 
  onToggleFullscreen 
}) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 md:p-6">
      
      {/* HEADER: Informasi Level & Status Sistem */}
      <div className="flex justify-between items-start">
        {/* Identitas Proyek */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] tracking-wider">
            RAKSHADATA
          </h1>
          <div className="inline-block bg-slate-900/80 border border-cyan-800 px-3 py-1 mt-2 rounded">
            <p className="text-sm font-mono text-cyan-100 uppercase tracking-widest">
              Ruang: <span className="font-bold text-cyan-300">{currentRoom}</span>
            </p>
          </div>
        </div>
        
        {/* Kontrol Kanan Atas: Fullscreen & Status */}
        <div className="flex flex-col items-end gap-2">
          
          {/* Tombol Fullscreen (Hanya berfungsi jika diklik user) */}
          <button 
            onClick={onToggleFullscreen}
            className="pointer-events-auto bg-slate-900/80 border border-cyan-500 text-cyan-400 hover:bg-slate-800 px-3 py-1.5 rounded text-xs font-bold tracking-widest transition-colors shadow-[0_0_10px_rgba(34,211,238,0.2)]"
          >
            {isFullscreen ? "KECILKAN LAYAR [ ]" : "LAYAR PENUH [ ]"}
          </button>

          {/* Indikator Keamanan (Elemen Kosmetik HUD) */}
          <div className="bg-slate-900/80 border border-cyan-800 px-4 py-2 rounded text-right hidden sm:block pointer-events-auto">
            <p className="text-xs font-mono text-cyan-500 uppercase mb-1">Status Enkripsi</p>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sm font-bold text-emerald-400 tracking-wider">AKTIF</p>
            </div>
          </div>
          
        </div>
      </div>

      {/* FOOTER: Kontrol Utama Pemain */}
      <div className="flex justify-center pb-2 md:pb-8">
        <button
          onClick={onToggleKeyboard}
          className={`pointer-events-auto px-6 py-3 md:px-8 md:py-4 rounded-full font-bold tracking-widest transition-all duration-300 border-2 active:scale-95 ${
            isKeyboardOpen 
              ? "bg-red-900/90 border-red-500 text-red-100 hover:bg-red-800 shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
              : "bg-slate-900/90 border-cyan-500 text-cyan-300 hover:bg-slate-800 hover:text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          }`}
        >
          {isKeyboardOpen ? "TUTUP KEYBOARD [X]" : "AKSES KEYBOARD [↑]"}
        </button>
      </div>
      
    </div>
  );
}