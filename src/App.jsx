import { useState } from 'react';
import HUD from './components/HUD';
import VirtualKeyboard from './components/VirtualKeyboard';
// import PlayerRig from './components/PlayerRig';

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

        {/* --- Kursor/Controller Sementara --- */}
        <a-entity id="rig" position="0 0 0">
          <a-camera position="0 1.6 0" look-controls="pointerLockEnabled: false">
            <a-cursor raycaster="objects: .clickable" color="#22d3ee"></a-cursor>
          </a-camera>
        </a-entity>

      </a-scene>
    </div>
  );
}

export default App;