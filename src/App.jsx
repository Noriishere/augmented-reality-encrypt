import { useState } from 'react'

function App() {
  const [pin, setPin] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleCekSandi = () => {
    // Simulasi enkripsi sederhana: PIN yang benar adalah "1234"
    if (pin === '1234') {
      setIsUnlocked(true)
    } else {
      alert('Sandi salah! Data tetap terenkripsi.')
      setPin('')
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* --- LAPISAN UI 2D (React + Tailwind) --- */}
      {/* UI ini mengambang di atas kanvas 3D, jadi tidak akan terpengaruh oleh kamera VR */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-md bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl text-center border border-gray-200">
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
      {/* embedded prop digunakan agar a-scene tidak memaksa fullscreen menutupi UI React */}
      <a-scene embedded style={{ width: '100%', height: '100%' }}>
        
        {/* Latar Belakang (Berubah warna jika brankas terbuka) */}
        <a-sky color={isUnlocked ? "#87CEEB" : "#0f172a"}></a-sky>

        {/* Pencahayaan */}
        <a-light type="ambient" color={isUnlocked ? "#fff" : "#555"}></a-light>
        <a-light type="directional" position="2 4 -3" intensity="0.6"></a-light>

        {/* Objek Utama: Brankas (Warna dan animasi bereaksi terhadap state React) */}
        <a-box
          position="0 1 -4"
          color={isUnlocked ? "#4ade80" : "#ef4444"}
          depth="1.5"
          height="1.5"
          width="1.5"
          wireframe={!isUnlocked} // Efek visual data terenkripsi (belum utuh)
          animation={
            isUnlocked
              ? "property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear"
              : "property: rotation; to: 0 10 0; dir: alternate; loop: true; dur: 2000" // Efek melayang/menunggu
          }
        ></a-box>

        {/* Teks Status 3D melayang di atas brankas */}
        <a-text
          value={isUnlocked ? "DATA AMAN\n(DECRYPTED)" : "TERKUNCI\n(ENCRYPTED)"}
          position="0 2.5 -4"
          align="center"
          color={isUnlocked ? "#15803d" : "#ef4444"}
          scale="1.5 1.5 1.5"
        ></a-text>

        {/* Lantai Virtual */}
        <a-plane
          position="0 0 -4"
          rotation="-90 0 0"
          width="20"
          height="20"
          color={isUnlocked ? "#e2e8f0" : "#1e293b"}
        ></a-plane>

        {/* Kamera Utama */}
        <a-camera position="0 1.6 0"></a-camera>
      </a-scene>

    </div>
  )
}

export default App