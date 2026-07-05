import { useState } from 'react';
import HUD from './components/HUD';
import VirtualKeyboard from './components/VirtualKeyboard';
import PlayerRig from './components/PlayerRig';

// Import Ruangan
import MainMenu from './rooms/MainMenu';
// import RakshaBasic from './rooms/RakshaBasic';
// import RakshaBeginner from './rooms/RakshaBeginner';
// import RakshaExpert from './rooms/RakshaExpert';

function App() {
  // Nilai awal diubah menjadi 'LOBBY' agar pemain masuk ke Main Menu terlebih dahulu
  const [currentRoom, setCurrentRoom] = useState('LOBBY');

  const [showKeyboard, setShowKeyboard] = useState(false);

  // State untuk menyimpan PIN yang diketik user
  const [pin, setPin] = useState('');

  // Logika penanganan ketikan dari Virtual Keyboard
  const handleVirtualKeyPress = (key) => {
    if (key === 'CLR') {
      setPin(''); // Hapus semua
    } else if (key === 'ENT') {
      alert(`Mencoba mendekripsi dengan sandi: ${pin}`);
      // Nanti logika cek jawaban per-level ditaruh di sini
      setPin('');
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + key); // Tambah angka
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* HUD tetap muncul di semua ruangan */}
      <HUD
        currentRoom={currentRoom}
        isKeyboardOpen={showKeyboard}
        onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
      />
      <a-scene embedded style={{ width: '100%', height: '100%' }}>

        {/* FASE PRELOAD ASET */}
        <a-assets timeout="10000">
          <audio id="bgm-javanese-cyber" src="/assets/gamelan-synth.mp3" preload="auto" loop="true"></audio>
          <img id="tex-wall" src="/assets/wall.png" crossOrigin="anonymous" />
          <img id="tex-floor" src="/assets/floor.png" crossOrigin="anonymous" />
          <img id="tex-door" src="/assets/door.png" crossOrigin="anonymous" />
          <img id="tex-ceiling" src="/assets/ceiling.png" crossOrigin="anonymous" />
        </a-assets>

        {/* PINDAHKAN SOUND KE SINI (Global BGM) */}
        <a-sound
          src="#bgm-javanese-cyber"
          autoplay="true"
          loop="true"
          volume="0.4"
        ></a-sound>
        {/* --- ROUTING RUANGAN --- */}
        {currentRoom === 'LOBBY' && (
          <MainMenu onSelectRoom={(roomName) => setCurrentRoom(roomName)} />
        )}
        {/* --- ROUTING RUANGAN --- */}

        {/* 1. LOBBY UTAMA */}
        {currentRoom === 'LOBBY' && (
          <MainMenu onSelectRoom={(roomName) => setCurrentRoom(roomName)} />
        )}

        {/* 2. RUANGAN LEVEL (Aktifkan saat file-nya sudah dibuat) */}
        {/* {currentRoom === 'Raksha Basic' && <RakshaBasic />} */}
        {/* {currentRoom === 'Raksha Beginner' && <RakshaBeginner />} */}
        {/* {currentRoom === 'Raksha Expert' && <RakshaExpert />} */}

        {/* Placeholder langit untuk ruangan selain Lobby sementara komponen belum dibuat */}
        {currentRoom !== 'LOBBY' && (
          <a-sky color="#050b14"></a-sky>
        )}

        {/* --- KOMPONEN GLOBAL --- */}

        {/* Render Virtual Keyboard jika HUD ditekan */}
        {showKeyboard && (
          <VirtualKeyboard
            position="0 1 -2"
            rotation="-15 0 0"
            currentInput={pin}
            onKeyPress={handleVirtualKeyPress}
          />
        )}

        {/* Player Rig Lengkap (PC, HP & VR) */}
        <PlayerRig
          isKeyboardOpen={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
        />

      </a-scene>
    </div>
  );
}

export default App;