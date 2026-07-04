import { useState } from 'react'

function App() {
  const [pin, setPin] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Fungsi untuk menangani input dari Virtual Keyboard 3D
  const handleKeyPress = (key) => {
    if (isUnlocked) return; // Jika sudah terbuka, keyboard non-aktif

    if (key === 'CLR') {
      setPin('');
    } else if (key === 'ENT') {
      if (pin === '1234') {
        setIsUnlocked(true);
      } else {
        alert('AKSES DITOLAK: Sandi Salah!');
        setPin('');
      }
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + key);
      }
    }
  }

  // Layout grid untuk Virtual Keyboard
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['CLR', '0', 'ENT']
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* --- HUD / UI 2D (Hanya untuk judul & instruksi, tanpa input form) --- */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-lg text-center pointer-events-none">
        <h1 className="text-3xl font-black text-cyan-400 tracking-[0.3em] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          CYBER-CRYPT
        </h1>
        <p className="text-xs text-cyan-200/70 mt-2 font-mono uppercase tracking-widest bg-black/50 inline-block px-3 py-1 rounded">
          [ Misi: Dekripsi Data Pusat ]
        </p>
      </div>

      {/* --- LAPISAN 3D WEBXR (A-Frame) --- */}
      <a-scene embedded style={{ width: '100%', height: '100%' }}>
        
        {/* Latar Belakang Gelap ala Sci-Fi */}
        <a-sky color="#050b14"></a-sky>
        
        {/* Pencahayaan Cyberpunk (Cyan & Hijau) */}
        <a-light type="ambient" color={isUnlocked ? "#a7f3d0" : "#0f172a"}></a-light>
        <a-light type="point" position="0 2 -2" intensity="1.5" color={isUnlocked ? "#10b981" : "#22d3ee"}></a-light>

        {/* --- CORE DATA (Pengganti Brankas) --- */}
        {/* Menggunakan Octahedron agar terlihat lebih futuristik */}
        <a-entity 
          position="0 1.8 -4" 
          animation={
            isUnlocked 
              ? "property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear" 
              : "property: position; to: 0 2 -4; dir: alternate; loop: true; dur: 2000"
          }
        >
          <a-octahedron 
            color={isUnlocked ? "#10b981" : "#0ea5e9"} 
            radius="0.8" 
            wireframe={!isUnlocked} // Bentuk kerangka saat terenkripsi, padat saat terbuka
          ></a-octahedron>
          
          {/* Teks Status melayang di atas Core */}
          <a-text
            value={isUnlocked ? "ACCESS\nGRANTED" : "ENCRYPTED\nDATA"}
            position="0 1.2 0"
            align="center"
            color={isUnlocked ? "#a7f3d0" : "#bae6fd"}
            scale="1.2 1.2 1.2"
          ></a-text>
        </a-entity>


        {/* --- VIRTUAL KEYBOARD PANEL --- */}
        {/* Diletakkan lebih dekat ke pemain dan sedikit dimiringkan ke atas */}
        <a-entity position="0 1 -2" rotation="-20 0 0">
          
          {/* Layar Output PIN Hologram */}
          <a-plane position="0 0.7 0" width="1.2" height="0.3" color="#020617" border="color: #22d3ee; width: 2" opacity="0.8">
            <a-text 
              value={pin.padEnd(4, '_').split('').join(' ')} 
              align="center" 
              color={isUnlocked ? "#10b981" : "#22d3ee"} 
              scale="2.5 2.5 2.5"
              position="0 0 0.01"
            ></a-text>
          </a-plane>

          {/* Render Grid Tombol */}
          <a-entity position="-0.4 0.3 0">
            {keys.map((row, rowIndex) => (
              row.map((key, colIndex) => {
                const isAction = key === 'CLR' || key === 'ENT';
                return (
                  <a-entity 
                    key={key} 
                    position={`${colIndex * 0.4} ${-rowIndex * 0.3} 0`}
                  >
                    {/* Kotak Tombol */}
                    <a-box 
                      className="clickable"
                      onClick={() => handleKeyPress(key)}
                      width="0.3" height="0.2" depth="0.05"
                      color={isAction ? "#1e293b" : "#0f172a"}
                      // Efek Hover (Glow saat disorot laser/kursor)
                      animation__mouseenter="property: color; to: #38bdf8; startEvents: mouseenter; dur: 150"
                      animation__mouseleave={`property: color; to: ${isAction ? "#1e293b" : "#0f172a"}; startEvents: mouseleave; dur: 150`}
                    >
                      {/* Teks Tombol */}
                      <a-text 
                        value={key} 
                        align="center" 
                        position="0 0 0.026" 
                        scale="0.8 0.8 0.8"
                        color="#e2e8f0"
                      ></a-text>
                    </a-box>
                  </a-entity>
                )
              })
            ))}
          </a-entity>
        </a-entity>

        {/* --- PLAYER RIG (Untuk Interaksi VR & Layar Sentuh/Mouse) --- */}
        <a-entity id="rig" position="0 0 0">
          <a-camera position="0 1.6 0">
            {/* Kursor dengan warna Cyberpunk */}
            <a-cursor 
              raycaster="objects: .clickable" 
              color="#22d3ee"
              animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
            ></a-cursor>
          </a-camera>
          
          <a-entity laser-controls="hand: left" raycaster="objects: .clickable; far: 20"></a-entity>
          <a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 20"></a-entity>
        </a-entity>

      </a-scene>
    </div>
  )
}

export default App