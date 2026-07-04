import { useState } from 'react'

function App() {
  // State untuk melacak pemain sedang di ruangan/level berapa
  const [room, setRoom] = useState(1)
  
  // State untuk data game
  const [pin, setPin] = useState('')

  // Fungsi transisi ruangan
  const nextRoom = () => {
    setRoom((prev) => prev + 1)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* --- HUD / UI 2D React --- */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-3xl font-black text-cyan-400">CYBER-CRYPT</h1>
        <p className="text-white bg-black/50 px-3 py-1 mt-2 rounded">
          {room === 1 && "Level 1: Kunci Akses Utama"}
          {room === 2 && "Level 2: Deteksi Anomali (Phishing)"}
          {room === 3 && "Level 3: Penguncian Asimetris"}
        </p>
      </div>

      {/* --- LAPISAN 3D A-FRAME --- */}
      <a-scene embedded style={{ width: '100%', height: '100%' }}>
        
        {/* Render isi ruangan berdasarkan state 'room' */}
        {room === 1 && (
          <a-entity id="ruangan-1">
            <a-sky color="#050b14"></a-sky>
            {/* ... Masukkan Core Data & Keyboard di sini ... */}
            <a-box className="clickable" position="0 1 -3" color="blue" onClick={nextRoom}></a-box>
          </a-entity>
        )}

        {room === 2 && (
          <a-entity id="ruangan-2">
            {/* Suasana berubah dramatis jadi merah! */}
            <a-sky color="#450a0a"></a-sky> 
            <a-light type="ambient" color="#ef4444"></a-light>
            {/* ... Masukkan Jebakan Phishing Hologram di sini ... */}
            <a-box className="clickable" position="2 1 -3" color="red" onClick={nextRoom}></a-box>
          </a-entity>
        )}

        {room === 3 && (
          <a-entity id="ruangan-3">
            {/* Suasana tenang, hijau futuristik */}
            <a-sky color="#022c22"></a-sky>
            {/* ... Masukkan simulasi Kunci Privat di sini ... */}
          </a-entity>
        )}

        {/* --- PLAYER RIG (Tetap ada di semua ruangan) --- */}
        <a-entity id="rig" position="0 0 0">
          <a-camera position="0 1.6 0">
            <a-cursor raycaster="objects: .clickable" color="#22d3ee"></a-cursor>
          </a-camera>
          <a-entity laser-controls="hand: left" raycaster="objects: .clickable; far: 20"></a-entity>
          <a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 20"></a-entity>
        </a-entity>

      </a-scene>
    </div>
  )
}

export default App