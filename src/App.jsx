import { useState, useEffect, useRef, useCallback } from 'react';
import HUD from './components/HUD';
import VirtualKeyboard from './components/VirtualKeyboard';
import PlayerRig from './components/PlayerRig';
import MainMenu from './rooms/MainMenu';
import RakshaBasicRoom1 from './rooms/RakshaBasic/Room1';

/* ============================================================
   Canvas HUD — close to player, glitch working, clickable
   ============================================================ */
function glitchStr(str, intensity = 0.15) {
  const chars = '!@#$%^&*01';
  return str.split('').map(c =>
    Math.random() < intensity ? chars[Math.floor(Math.random() * chars.length)] : c
  ).join('');
}

function generateIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function useCanvasHUD({ currentRoom, isVRMode }) {
  const canvasRef = useRef(null);
  const textureRef = useRef(null);
  const intervalRef = useRef(null);
  const [texture, setTexture] = useState(null);
  const glitchCycle = useRef(0);
  const ipRef = useRef(generateIP());

  useEffect(() => {
    if (!isVRMode) {
      setTexture(null);
      textureRef.current = null;
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    canvasRef.current = canvas;

    const THREE = window.THREE || AFRAME.THREE;
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    textureRef.current = tex;
    setTexture(tex);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

      // Glitch cycle — lebih subtle
      glitchCycle.current = (glitchCycle.current + 1) % 120; // 120 frame cycle
      const isGlitch = glitchCycle.current >= 115 && glitchCycle.current <= 118; // cuma 4 frame glitch per 4 detik

      // Update IP — jarang
      if (glitchCycle.current === 0) ipRef.current = generateIP();

      // === CLEAR ===
      ctx.clearRect(0, 0, w, h);

      // Scanlines — sangat subtle
      ctx.strokeStyle = 'rgba(0,255,255,0.01)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 12) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Glitch bars — subtle
      if (isGlitch) {
        for (let i = 0; i < 3; i++) {
          const gy = Math.random() * h;
          ctx.fillStyle = `rgba(239,68,68,${0.03 + Math.random() * 0.04})`;
          ctx.fillRect(0, gy, w, 1 + Math.random() * 3);
        }
      }

      const ox = isGlitch ? (Math.random() - 0.5) * 6 : 0;

      // ==============================
      // TOP LEFT
      // ==============================
      const lx = 120, ly = 80;

      // Logo
      ctx.fillStyle = 'rgba(6,182,212,0.12)';
      ctx.fillRect(lx + ox, ly, 120, 120);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.strokeRect(lx + ox, ly, 120, 120);
      ctx.fillStyle = 'rgba(6,182,212,0.35)';
      ctx.fillRect(lx + ox + 30, ly + 30, 60, 60);

      // Title
      ctx.font = 'bold 110px monospace';
      ctx.fillStyle = isGlitch ? '#ef4444' : '#06b6d4';
      ctx.shadowColor = isGlitch ? 'rgba(239,68,68,0.4)' : 'rgba(34,211,238,0.6)';
      ctx.shadowBlur = isGlitch ? 15 : 30;
      ctx.fillText(isGlitch ? glitchStr('RAKHSHDATA', 0.15) : 'RAKHSHDATA', lx + 150 + ox, ly + 90);
      ctx.shadowBlur = 0;

      ctx.font = '30px monospace';
      ctx.fillStyle = '#5a7a8a';
      ctx.fillText('CYBER DEFENSE TRAINING v2.4.1', lx + 150 + ox, ly + 130);

      // Status panel
      const spx = lx + ox, spy = ly + 160;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(spx, spy, 800, 200);
      ctx.strokeStyle = isGlitch ? 'rgba(239,68,68,0.3)' : 'rgba(6,182,212,0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(spx, spy, 800, 200);

      ctx.beginPath();
      ctx.arc(spx + 40, spy + 45, 12, 0, Math.PI * 2);
      ctx.fillStyle = isGlitch ? '#ef4444' : '#10b981';
      ctx.fill();
      ctx.font = '26px monospace';
      ctx.fillStyle = isGlitch ? '#ef4444' : '#10b981';
      ctx.fillText(isGlitch ? glitchStr('SYSTEM ONLINE', 0.4) : 'SYSTEM ONLINE', spx + 65, spy + 53);

      ctx.font = '22px monospace';
      ctx.fillStyle = '#5a7a8a';
      ctx.fillText('ROOM: ', spx + 30, spy + 100);
      ctx.fillStyle = '#22d3ee';
      ctx.fillText(currentRoom || 'LOBBY', spx + 130, spy + 100);

      ctx.fillStyle = '#5a7a8a';
      ctx.fillText('NODE: ', spx + 30, spy + 140);
      ctx.fillStyle = '#06b6d4';
      ctx.fillText(isGlitch ? glitchStr(ipRef.current, 0.5) : ipRef.current, spx + 130, spy + 140);

      ctx.font = '20px monospace';
      ctx.fillStyle = isGlitch ? 'rgba(239,68,68,0.2)' : 'rgba(6,182,212,0.12)';
      ctx.fillText(isGlitch ? glitchStr('01000110110010101001100111100101101001001010', 0.3) : '01000110110010101001100111100101101001001010', spx, spy + 230);

      // ==============================
      // TOP RIGHT
      // ==============================
      const rx = w - 120;

      ctx.font = 'bold 100px monospace';
      ctx.fillStyle = isGlitch ? '#ef4444' : '#06b6d4';
      ctx.shadowColor = isGlitch ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.5)';
      ctx.shadowBlur = 25;
      ctx.textAlign = 'right';
      ctx.fillText(isGlitch ? glitchStr(time, 0.4) : time, rx, ly + 90);
      ctx.shadowBlur = 0;

      ctx.font = '26px monospace';
      ctx.fillStyle = '#5a7a8a';
      ctx.fillText(date, rx, ly + 130);
      ctx.textAlign = 'left';

      const stx = w - 880, sty = ly + 160;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(stx, sty, 760, 230);
      ctx.strokeStyle = isGlitch ? 'rgba(239,68,68,0.3)' : 'rgba(6,182,212,0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(stx, sty, 760, 230);

      ctx.font = '24px monospace';
      ctx.fillStyle = isGlitch ? '#ef4444' : '#5a7a8a';
      ctx.fillText(isGlitch ? glitchStr('SYSTEM STATUS', 0.5) : 'SYSTEM STATUS', stx + 30, sty + 40);

      const cpu = isGlitch ? Math.floor(Math.random() * 100) : 42 + Math.floor(Math.random() * 30);
      ctx.fillStyle = '#5a7a8a';
      ctx.font = '22px monospace';
      ctx.fillText(isGlitch ? 'C@!' : 'CPU', stx + 30, sty + 85);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(stx + 130, sty + 68, 480, 28);
      ctx.fillStyle = isGlitch ? '#ef4444' : '#06b6d4';
      ctx.fillRect(stx + 130, sty + 68, (cpu / 100) * 480, 28);
      ctx.fillText(isGlitch ? 'ERR' : cpu + '%', stx + 640, sty + 90);

      const mem = isGlitch ? Math.floor(Math.random() * 100) : 55 + Math.floor(Math.random() * 20);
      ctx.fillStyle = '#5a7a8a';
      ctx.fillText(isGlitch ? 'M#M' : 'MEM', stx + 30, sty + 135);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(stx + 130, sty + 118, 480, 28);
      ctx.fillStyle = isGlitch ? '#eab308' : '#10b981';
      ctx.fillRect(stx + 130, sty + 118, (mem / 100) * 480, 28);
      ctx.fillText(isGlitch ? 'WARN' : mem + '%', stx + 640, sty + 140);

      ctx.fillStyle = '#5a7a8a';
      ctx.fillText(isGlitch ? 'N!T' : 'NET', stx + 30, sty + 185);
      ctx.fillStyle = isGlitch ? '#ef4444' : '#06b6d4';
      ctx.fillText(isGlitch ? glitchStr('99999', 0.6) : '142 pkts/s', stx + 130, sty + 185);

      // ==============================
      // BOTTOM CENTER — Terminal button
      // ==============================
      const bx = w / 2 - 380, by = h - 200;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(bx, by, 760, 100);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, 760, 100);

      ctx.font = 'bold 40px monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.textAlign = 'center';
      ctx.fillText('[ AKSES TERMINAL ]', w / 2, by + 62);
      ctx.textAlign = 'left';

      // Bottom info
      ctx.font = '20px monospace';
      ctx.fillStyle = 'rgba(100,116,139,0.4)';
      ctx.fillText('ENCRYPTION: AES-256-GCM | PROTOCOL: TLS 1.3', 120, h - 60);
      ctx.textAlign = 'right';
      ctx.fillText('SESSION: IDXJAXN9', rx, h - 60);
      ctx.textAlign = 'left';

      // Corners
      const ca = 100, co = 60;
      ctx.strokeStyle = 'rgba(6,182,212,0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(co, co + ca); ctx.lineTo(co, co); ctx.lineTo(co + ca, co); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - co - ca, co); ctx.lineTo(w - co, co); ctx.lineTo(w - co, co + ca); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(co, h - co - ca); ctx.lineTo(co, h - co); ctx.lineTo(co + ca, h - co); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - co - ca, h - co); ctx.lineTo(w - co, h - co); ctx.lineTo(w - co, h - co - ca); ctx.stroke();

      // Side lines
      ctx.strokeStyle = 'rgba(6,182,212,0.15)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(co + 3, h / 2 - 250); ctx.lineTo(co + 3, h / 2 + 250); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - co - 3, h / 2 - 250); ctx.lineTo(w - co - 3, h / 2 + 250); ctx.stroke();

      // MUST update texture
      tex.needsUpdate = true;
    };

    draw();
    intervalRef.current = setInterval(draw, 150);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      tex.dispose();
      textureRef.current = null;
    };
  }, [isVRMode, currentRoom]);

  return texture;
}

function App() {
  const [currentRoom, setCurrentRoom] = useState('LOBBY');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [pin, setPin] = useState('');
  const [isVRMode, setIsVRMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sceneRef = useRef(null);
  const vrHudTexture = useCanvasHUD({ currentRoom, isVRMode });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelectRoom = (roomName) => {
    setIsTransitioning(true); // 1. Lingkaran hitam membesar menutupi layar

    // 2. Tunggu 800ms sampai layar full hitam, lalu ganti ruangan
    setTimeout(() => {
      setCurrentRoom(roomName);

      // --- 3. LOGIKA RESET POSISI (TELEPORTASI) ---
      const playerRig = document.getElementById('rig');
      if (playerRig) {
        if (roomName === 'Raksha Basic') {
          // Pindahkan pemain ke titik awal Room 1 (Selatan, dekat papan instruksi)
          playerRig.setAttribute('position', '0 0 4.5');
        } else if (roomName === 'LOBBY') {
          // Pindahkan pemain kembali ke tengah jika kembali ke Lobi
          playerRig.setAttribute('position', '0 0 0');
        }
      }
      // --------------------------------------------

      // 4. Tunggu sebentar agar ruangan baru ke-render, lalu buka lingkaran hitamnya
      setTimeout(() => {
        setIsTransitioning(false);
        sceneRef.current?.emit('refresh-solids'); // <-- tambahin ini
      }, 100);
    }, 800);
  };

  useEffect(() => {
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const handleEnterVR = () => setIsVRMode(true);
    const handleExitVR = () => setIsVRMode(false);
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

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
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleVirtualKeyPress = (key) => {
    if (key === 'CLR') setPin('');
    else if (key === 'ENT') { alert(`PIN: ${pin}`); setPin(''); }
    else if (pin.length < 4) setPin(prev => prev + key);
  };

  const handleVRTerminalClick = useCallback(() => {
    setShowKeyboard(prev => !prev);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {!isVRMode && (
        <HUD
          currentRoom={currentRoom}
          isKeyboardOpen={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullScreen}
        />
      )}

      <a-scene ref={sceneRef} embedded style={{ width: '100%', height: '100%' }}>
        <a-assets timeout="15000">
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

        {currentRoom === 'LOBBY' && (
          <MainMenu onSelectRoom={handleSelectRoom} />
        )}

        {currentRoom === 'Raksha Basic' && (
          <RakshaBasicRoom1 onInteractTerminal={handleVRTerminalClick} />
        )}

        {currentRoom !== 'LOBBY' && (
          <a-sky color="#0a0e14"></a-sky>
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
          vrHudTexture={vrHudTexture}
          onVRTerminalClick={handleVRTerminalClick}
          currentInput={pin}
          handleVirtualKeyPress={handleVirtualKeyPress}

          // Tambahkan baris ini:
          isTransitioning={isTransitioning}
        />
      </a-scene>
    </div>
  );
}

export default App;
