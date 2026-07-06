import { useState, useEffect, useRef } from 'react';
import HUD from './components/HUD';
import VirtualKeyboard from './components/VirtualKeyboard';
import PlayerRig from './components/PlayerRig';

// Import Ruangan
import MainMenu from './rooms/MainMenu';
// import RakshaBasic from './rooms/RakshaBasic';
// import RakshaBeginner from './rooms/RakshaBeginner';
// import RakshaExpert from './rooms/RakshaExpert';

function App() {
  const [currentRoom, setCurrentRoom] = useState('LOBBY');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [pin, setPin] = useState('');
  
  // State baru untuk mendeteksi apakah user sedang di mode VR
  const [isVRMode, setIsVRMode] = useState(false);
  
  // Referensi untuk tag <a-scene>
  const sceneRef = useRef(null);

  // Efek untuk memantau kapan user masuk atau keluar dari mode VR
  useEffect(() => {
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const handleEnterVR = () => setIsVRMode(true);
    const handleExitVR = () => setIsVRMode(false);

    sceneEl.addEventListener('enter-vr', handleEnterVR);
    sceneEl.addEventListener('exit-vr', handleExitVR);

    // Cleanup listener saat komponen dilepas
    return () => {
      sceneEl.removeEventListener('enter-vr', handleEnterVR);
      sceneEl.removeEventListener('exit-vr', handleExitVR);
    };
  }, []);

  const handleVirtualKeyPress = (key) => {
    if (key === 'CLR') {
      setPin(''); 
    } else if (key === 'ENT') {
      alert(`Mencoba mendekripsi dengan sandi: ${pin}`);
      setPin('');
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + key);
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
      
      {/* Tambahkan ref={sceneRef} ke a-scene */}
      <a-scene ref={sceneRef} embedded style={{ width: '100%', height: '100%' }}>

        <a-assets timeout="10000">
          <audio id="bgm-javanese-cyber" src="/assets/gamelan-synth.mp3" preload="auto" loop="true"></audio>
          <img id="tex-wall" src="/assets/wall.png" crossOrigin="anonymous" />
          <img id="tex-floor" src="/assets/floor.png" crossOrigin="anonymous" />
          <img id="tex-door" src="/assets/door.png" crossOrigin="anonymous" />
          <img id="tex-ceiling" src="/assets/ceiling.png" crossOrigin="anonymous" />
        </a-assets>

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

        {currentRoom !== 'LOBBY' && (
          <a-sky color="#050b14"></a-sky>
        )}

        {showKeyboard && (
          <VirtualKeyboard
            position="0 1 -2"
            rotation="-15 0 0"
            currentInput={pin}
            onKeyPress={handleVirtualKeyPress}
          />
        )}

        {/* Kirim isVRMode ke PlayerRig */}
        <PlayerRig
          isKeyboardOpen={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
          isVRMode={isVRMode}
        />

      </a-scene>
    </div>
  );
}

export default App;