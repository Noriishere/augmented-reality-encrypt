import { useState, useEffect, useRef } from 'react';
import HUD from './components/HUD';
import VirtualKeyboard from './components/VirtualKeyboard';
import PlayerRig from './components/PlayerRig';
import MainMenu from './rooms/MainMenu';

function App() {
  const [currentRoom, setCurrentRoom] = useState('LOBBY');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [pin, setPin] = useState('');
  const [isVRMode, setIsVRMode] = useState(false);
  
  // State baru untuk melacak status Fullscreen PC/HP
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const sceneRef = useRef(null);

  // Efek untuk memantau mode VR dan Fullscreen biasa
  useEffect(() => {
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const handleEnterVR = () => setIsVRMode(true);
    const handleExitVR = () => setIsVRMode(false);

    // Memantau jika user menekan ESC untuk keluar dari fullscreen
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    sceneEl.addEventListener('enter-vr', handleEnterVR);
    sceneEl.addEventListener('exit-vr', handleExitVR);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      sceneEl.removeEventListener('enter-vr', handleEnterVR);
      sceneEl.removeEventListener('exit-vr', handleExitVR);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Logika untuk tombol Fullscreen (Hanya berlaku di non-VR)
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Gagal fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

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
        /* Kirim state dan fungsi fullscreen ke HUD */
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullScreen}
      />
      
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