import { useState } from 'react'

function App() {
  const [pin, setPin] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleCekSandi = () => {
    if (pin === '1234') {
      setIsUnlocked(true)
    } else {
      alert('Sandi salah! Data tetap terenkripsi.')
      setPin('')
    }
  }

  // Fungsi untuk menangani saat brankas di-klik/ditembak oleh VR Controller
  const handleBrankasClick = () => {
    if (!isUnlocked) {
      alert('Brankas masih terkunci! Masukkan PIN di panel UI terlebih dahulu.');
    } else {
      alert('Isi data rahasia berhasil diakses!');
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* --- LAPISAN UI 2D (React + Tailwind) --- */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-md bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl text-center border border-gray-200">
        {/* ... (Isi UI sama seperti sebelumnya) ... */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Vaultify Edu-VR</h1>
        <p className="text-sm text-slate-600 mb-5">
          Simulasi Keamanan Data: Masukkan PIN rahasia untuk mendekripsi dan membuka brankas.
        </p>

        {!isUnlocked ? (
          <div className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Masukkan 4 digit PIN"
              className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-center text-xl tracking-widest font-mono"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
            />
            <button
              onClick={handleCekSandi}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md active:scale-95"
            >
              Dekripsi Data
            </button>
          </div>
        ) : (
          <div className="p-4 bg-green-100 text-green-700 rounded-lg font-bold border border-green-300 text-lg">
            Akses Diberikan. Data Terbaca!
          </div>
        )}
      </div>

      {/* --- LAPISAN 3D WEBXR (A-Frame) --- */}
      <a-scene embedded style={{ width: '100%', height: '100%' }}>
        <a-sky color={isUnlocked ? "#87CEEB" : "#0f172a"}></a-sky>
        <a-light type="ambient" color={isUnlocked ? "#fff" : "#555"}></a-light>
        <a-light type="directional" position="2 4 -3" intensity="0.6"></a-light>

        {/* Tambahkan class "clickable" agar raycaster (laser) tahu objek ini bisa diinteraksi.
          onClick bawaan React bisa menangkap event click dari A-Frame berkat Cursor/Laser.
        */}
        <a-box
          className="clickable"
          onClick={handleBrankasClick}
          position="0 1 -4"
          color={isUnlocked ? "#4ade80" : "#ef4444"}
          depth="1.5" height="1.5" width="1.5"
          wireframe={!isUnlocked}
          animation={
            isUnlocked
              ? "property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear"
              : "property: rotation; to: 0 10 0; dir: alternate; loop: true; dur: 2000"
          }
        ></a-box>

        <a-text
          value={isUnlocked ? "DATA AMAN\n(DECRYPTED)" : "TERKUNCI\n(ENCRYPTED)"}
          position="0 2.5 -4" align="center"
          color={isUnlocked ? "#15803d" : "#ef4444"} scale="1.5 1.5 1.5"
        ></a-text>

        <a-plane position="0 0 -4" rotation="-90 0 0" width="20" height="20" color={isUnlocked ? "#e2e8f0" : "#1e293b"}></a-plane>

        {/* --- PLAYER RIG & CONTROLLERS --- */}
        <a-entity id="rig" position="0 0 0">
          <a-camera position="0 1.6 0">
            {/* 1. Cursor untuk PC/Mobile (titik putih di tengah layar) */}
            <a-cursor 
              raycaster="objects: .clickable" 
              color="#FF0000"
              animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
            ></a-cursor>
          </a-camera>

          {/* 2. Laser Controllers untuk VR Headset (Kiri & Kanan) */}
          <a-entity 
            laser-controls="hand: left" 
            raycaster="objects: .clickable; far: 20"
          ></a-entity>
          <a-entity 
            laser-controls="hand: right" 
            raycaster="objects: .clickable; far: 20"
          ></a-entity>
        </a-entity>

      </a-scene>
    </div>
  )
}

export default App