import { useState } from 'react';
import HUD from './components/HUD';
import VirtualKeyboard from './components/VirtualKeyboard';
import PlayerRig from './components/PlayerRig';

function App() {
  const [currentRoom, setCurrentRoom] = useState('Raksha Basic');
  const [showKeyboard, setShowKeyboard] = useState(false);

  // State untuk menyimpan PIN yang diketik user
  const [pin, setPin] = useState('');

  // Logika penanganan ketikan dari Virtual Keyboard
  const handleVirtualKeyPress = (key) => {
    if (key === 'CLR') {
      setPin(''); // Hapus semua
    } else if (key === 'ENT') {
      alert(`Mencoba mendekripsi dengan sandi: ${pin}`);
      // Nanti logika cek jawaban per-level taruh di sini
      setPin('');
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + key); // Tambah angka
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      <HUD
        currentRoom={currentRoom}
        isKeyboardOpen={showKeyboard}
        onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
      />

      <a-scene embedded style={{ width: '100%', height: '100%' }}>
        <a-sky color="#050b14"></a-sky>

        {/* Render Virtual Keyboard jika HUD ditekan */}
        {showKeyboard && (
          <VirtualKeyboard
            position="0 1 -2"
            rotation="-15 0 0"
            currentInput={pin}
            onKeyPress={handleVirtualKeyPress}
          />
        )}

        {/* --- Player Rig Lengkap (PC, HP & VR) --- */}
        <PlayerRig
          isKeyboardOpen={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
        />

      </a-scene>
    </div>
  );
}

export default App;