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
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const sceneRef = useRef(null);

  useEffect(() => {
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const handleEnterVR = () => setIsVRMode(true);
    const handleExitVR = () => setIsVRMode(false);
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
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullScreen}
      />
      
      <a-scene ref={sceneRef} embedded style={{ width: '100%', height: '100%' }}>

        {/* === ASET DATA CENTER === */}
        <a-assets timeout="15000">
          {/* Tekstur Data Center */}
          <img id="tex-dc-floor" src="/assets/dc_floor.png" crossOrigin="anonymous" />
          <img id="tex-dc-wall" src="/assets/dc_wall.png" crossOrigin="anonymous" />
          <img id="tex-dc-ceiling" src="/assets/dc_ceiling.png" crossOrigin="anonymous" />
          <img id="tex-dc-rack" src="/assets/dc_rack_face.png" crossOrigin="anonymous" />
          <img id="tex-dc-rack-hd" src="/assets/dc_rack_face_hd.png" crossOrigin="anonymous" />
          <img id="tex-dc-panel" src="/assets/dc_access_panel.png" crossOrigin="anonymous" />
          <img id="tex-dc-door" src="/assets/dc_door_industrial_hd.png" crossOrigin="anonymous" />
          <img id="tex-dc-server" src="/assets/dc_server_panel_hd.png" crossOrigin="anonymous" />
          <img id="tex-dc-keypad" src="/assets/dc_keypad_panel_hd.png" crossOrigin="anonymous" />
          <img id="tex-dc-hvac" src="/assets/dc_hvac.png" crossOrigin="anonymous" />


        </a-assets>

        {/* === STATE ROUTER === */}
        {currentRoom === 'LOBBY' && (
          <MainMenu onSelectRoom={(roomName) => setCurrentRoom(roomName)} />
        )}

        {currentRoom !== 'LOBBY' && (
          <a-sky color="#0a0e14"></a-sky>
        )}

        {/* === VIRTUAL KEYBOARD === */}
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
