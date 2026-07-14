import { useState, useEffect, useRef, useCallback } from 'react';
import HUD from './components/HUD';
import VirtualKeyboard from './components/VirtualKeyboard';
import PlayerRig from './components/PlayerRig';
import MainMenu from './rooms/MainMenu';
import RakshaBasicRoom1 from './rooms/RakshaBasic/Room1';
import RakshaBasicCorridor from './rooms/RakshaBasic/Corridor';
import RakshaBasicRoom2 from './rooms/RakshaBasic/Room2';
import RakshaExpertRoom1 from './rooms/RakshaExpert/Room1';
import RakshaBeginnerRoom from './rooms/RakshaBeginner/Room1';
import LoadingScreen from './components/LoadingScreen';
import RoomWelcomeHUD from './components/RoomWelcomeHUD';
import { resolveRoomIntro } from './components/roomIntros';
import LandingPage from './components/LandingPage';
import RakshaExpertCorridor from './rooms/RakshaExpert/Corridor';

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
  const [hasPaper, setHasPaper] = useState(false);
  const sceneRef = useRef(null);
  const vrHudTexture = useCanvasHUD({ currentRoom, isVRMode });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [roomStage, setRoomStage] = useState('room1');
  const [roomWelcome, setRoomWelcome] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const dismissWelcome = () => setRoomWelcome(null);

  // MENGGUNAKAN SATU STATE UNTUK SEMUA KONFIGURASI KEYBOARD
  const [keyboardConfig, setKeyboardConfig] = useState({
    context: '',
    position: '0 1.4 -10.8',
    rotation: '-10 0 0'
  });

  const handleSelectRoom = (roomName) => {
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentRoom(roomName);

      const playerRig = document.getElementById('rig');
      const camera = playerRig?.querySelector("a-camera");
      if (playerRig) {
        if (roomName === 'Raksha Basic') {
          setRoomStage('room1');
          playerRig.object3D.position.set(0, 0, 11);

          if (camera) {
            const look = camera.components["look-controls"];
            camera.object3D.rotation.set(0, 0, 0);
            if (look) {
              look.yawObject.rotation.y = 0;
              look.pitchObject.rotation.x = 0;
            }
          }
          playerRig.object3D.rotation.set(0, 0, 0);
        } else if (roomName === 'LOBBY') {
          playerRig.object3D.position.set(0, 0, 0);
          if (camera) {
            const look = camera.components["look-controls"];
            camera.object3D.rotation.set(0, 0, 0);
            if (look) {
              look.yawObject.rotation.y = 0;
              look.pitchObject.rotation.x = 0;
            }
          }

        } else if (roomName === 'Raksha Expert') {
          setRoomStage('room1');

          playerRig.object3D.position.set(0, 0, 4);
          playerRig.object3D.rotation.set(0, 0, 0);

          const cameraEl = playerRig.querySelector('a-camera');
          if (cameraEl) {
            if (cameraEl.components['free-move']) {
              cameraEl.components['free-move'].velocity = { x: 0, z: 0 };
            }

            cameraEl.object3D.rotation.set(0, 0, 0);
            const look = cameraEl.components["look-controls"];
            if (look) {
              look.yawObject.rotation.y = 0;
              look.pitchObject.rotation.x = 0;
            }
          }
        } else if (roomName === 'Raksha Beginner') {
          playerRig.object3D.position.set(3.50, 0, 3.50);
          if (camera) {
            const look = camera.components["look-controls"];
            camera.object3D.rotation.set(0, 0, 0);
            if (look) {
              look.yawObject.rotation.y = 0;
              look.pitchObject.rotation.x = 0;
            }
          }
        }
      }
      setTimeout(() => {
        setIsTransitioning(false);
        sceneRef.current?.emit('refresh-solids');
      }, 100);
    }, 800);
  };


  useEffect(() => {
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const handleEnterVR = () => {
      setIsVRMode(true);
      setRoomWelcome(null);
    };
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

  useEffect(() => {
    if (isTransitioning) return;
    if (currentRoom === 'LOBBY') { setRoomWelcome(null); return; }

    const sceneIsVR = sceneRef.current?.is?.('vr-mode');
    if (isVRMode || sceneIsVR) return;

    const intro = resolveRoomIntro(currentRoom, roomStage);
    if (intro) setRoomWelcome({ ...intro, visible: true });
  }, [currentRoom, roomStage, isTransitioning]);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const ROOM_ANSWERS = {
    'room1-exit': 'OUWI',
    'room2-enter': 'OUWO',
    'room2-self-exit': 'OUWI',
    'beginner-pc': 'AWAL',
    'beginner-safe': 'PETI',
    'beginner-door': 'BUKA',
    'beginner-system': 'AMAN'
  };

  const handleVirtualKeyPress = (key) => {
    if (key === 'CLR') {
      setPin('');
      return;
    }
    if (key === 'ENT') {
      const answer = ROOM_ANSWERS[keyboardConfig.context];
      if (answer && pin.toUpperCase() === answer) {
        setShowKeyboard(false);
        setPin('');

        if (keyboardConfig.context === 'room1-exit') {
          goToCorridor();
        } else if (keyboardConfig.context === 'room2-enter') {
          goToRoom2();
        } else if (keyboardConfig.context === 'room2-self-exit') {
          // <-- Tambahkan blok if ini
          // Memancarkan sinyal ke Room 2 untuk memunculkan pop-up kemenangan rahasia
          window.dispatchEvent(new CustomEvent('room2-self-exit-success'));
        }
      } else {
        alert('PIN salah! Coba lagi.');
        setPin('');
      }
      return;
    }
    if (pin.length < 6) setPin(prev => prev + key);
  };

  const handleVRTerminalClick = useCallback(() => {
    setShowKeyboard(prev => !prev);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail && e.detail.context) {
        setKeyboardConfig({
          context: e.detail.context,
          position: e.detail.position || '0 1.4 -10.8',
          rotation: e.detail.rotation || '-10 0 0'
        });
        setShowKeyboard(true);
      }
    };
    window.addEventListener('open-keyboard', handler);
    return () => window.removeEventListener('open-keyboard', handler);
  }, []);

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }
  const goToRoom2 = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setRoomStage('room2');
      const playerRig = document.getElementById('rig');
      if (playerRig) {
        playerRig.object3D.position.set(0, 0, 0);
        playerRig.object3D.rotation.set(0, 0, 0);
      }
      setTimeout(() => {
        setIsTransitioning(false);
        document.querySelector('a-scene')?.emit('refresh-solids');
      }, 100);
    }, 800);
  };
  const goToExpertCorridor = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setRoomStage('corridor');
      const playerRig = document.getElementById('rig');
      if (playerRig) {
        playerRig.object3D.position.set(0, 0, 0);
        playerRig.object3D.rotation.set(0, 0, 0);
        const camera = playerRig.querySelector('a-camera');
        if (camera) {
          camera.object3D.rotation.set(0, 0, 0);
          const look = camera.components['look-controls'];
          if (look) {
            look.yawObject.rotation.y = 0;
            look.pitchObject.rotation.x = 0;
          }
        }
      }
      setTimeout(() => {
        setIsTransitioning(false);
        sceneRef.current?.emit('refresh-solids');
      }, 100);
    }, 800);
  };
  const goToCorridor = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setRoomStage('corridor');

      const playerRig = document.getElementById('rig');
      if (playerRig) {
        playerRig.object3D.position.set(0, 0, -14);
        playerRig.object3D.rotation.set(0, 0, 0);
        const camera = playerRig.querySelector("a-camera");
        if (camera) {
          camera.object3D.rotation.set(0, 0, 0);
          const look = camera.components["look-controls"];
          if (look) {
            look.yawObject.rotation.y = 0;
            look.pitchObject.rotation.x = 0;
          }
        }
      }

      setTimeout(() => {
        setIsTransitioning(false);
        sceneRef.current?.emit('refresh-solids');
      }, 100);
    }, 800);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {isAppLoading && (
        <LoadingScreen
          sceneRef={sceneRef}
          assetTimeout={15000}
          onComplete={() => setIsAppLoading(false)}
        />
      )}
      {!isVRMode && (
        <HUD
          currentRoom={currentRoom}
          isKeyboardOpen={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullScreen}
        />
      )}
      {!isVRMode && roomWelcome?.visible && (
        <RoomWelcomeHUD
          title={roomWelcome.title}
          subtitle={roomWelcome.subtitle}
          caseText={roomWelcome.caseText}
          onStart={dismissWelcome}
        />
      )}

      <a-scene ref={sceneRef} embedded style={{ width: '100%', height: '100%' }}>
        <a-assets timeout="15000">
          <a-asset-item id="model-hacker" src="/assets/hooded_hacker.glb"></a-asset-item>
          <a-asset-item id="model-key-pub" src="/assets/key_card.glb"></a-asset-item>
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
          <img id="tex-dc-monitor" src="/assets/dc_computer_monitor.png" crossOrigin="anonymous" />
          <img id="tex-dc-desk" src="/assets/dc_desk.png" crossOrigin="anonymous" />
          <img id="tex-dc-chair" src="/assets/dc_chair.png" crossOrigin="anonymous" />
          <img id="tex-dc-keyboard" src="/assets/dc_keyboard.png" crossOrigin="anonymous" />
          <img id="tex-dc-mouse" src="/assets/dc_mouse.png" crossOrigin="anonymous" />
          <img id="tex-office-floor" src="/assets/office_floor.png" crossOrigin="anonymous" />
          <img id="tex-office-wall" src="/assets/office_wall.png" crossOrigin="anonymous" />
          <img id="tex-office-ceiling" src="/assets/office_ceiling.png" crossOrigin="anonymous" />
          <img id="tex-office-door" src="/assets/office_door.png" crossOrigin="anonymous" />
          <img id="tex-office-wall-v2" src="/assets/office_wall_v2.png" crossOrigin="anonymous" />
          <img id="tex-office-door-v2" src="/assets/office_door_v2.png" crossOrigin="anonymous" />
          <img id="tex-office-roller" src="/assets/office_roller_door.png" crossOrigin="anonymous" />
          <img id="tex-office-wall-outer" src="/assets/office_wall_outer.png" crossOrigin="anonymous" />
          <img id="tex-office-wall-inner" src="/assets/office_wall_inner.png" crossOrigin="anonymous" />
          <img id="tex-office-wall-outer-hd" src="/assets/office_wall_outer_hd.png" crossOrigin="anonymous" />
          <img id="tex-office-wall-inner-hd" src="/assets/office_wall_inner_hd.png" crossOrigin="anonymous" />
          <img id="tex-locker-front" src="/assets/locker_front.png" crossOrigin="anonymous" />
          <img id="tex-locker-open" src="/assets/locker_open.png" crossOrigin="anonymous" />
          <img id="tex-paper-note" src="/assets/paper_note.png" crossOrigin="anonymous" />
          <img id="tex-monitor-v" src="/assets/monitor_cipher_V.png" crossOrigin="anonymous" />
          <img id="tex-monitor-b" src="/assets/monitor_cipher_B.png" crossOrigin="anonymous" />
          <img id="tex-monitor-d" src="/assets/monitor_cipher_D.png" crossOrigin="anonymous" />
          <img id="tex-monitor-p" src="/assets/monitor_cipher_P.png" crossOrigin="anonymous" />
          <img id="npc-teman" src="/assets/npc_teman_online.png" crossOrigin="anonymous" />
          <img id="npc-sahabat" src="/assets/npc_sahabat.png" crossOrigin="anonymous" />
          <img id="npc-admin" src="/assets/npc_admin_palsu.png" crossOrigin="anonymous" />
          <img id="npc-ortu" src="/assets/npc_orang_tua.png" crossOrigin="anonymous" />
          <img id="tex-npc-silhouette" src="/assets/npc_silhouette.png" crossOrigin="anonymous" />
          <img id="tex-dialog-bg" src="/assets/dialog_bg.png" crossOrigin="anonymous" />
        </a-assets>

        {currentRoom === 'LOBBY' && (
          <MainMenu onSelectRoom={handleSelectRoom} />
        )}

        {currentRoom === 'Raksha Basic' && roomStage === 'room1' && (
          <RakshaBasicRoom1
            onInteractTerminal={() => {
              setKeyboardConfig({ context: 'room1-exit', position: '0 1.4 -10.8', rotation: '-10 0 0' });
              setShowKeyboard(true);
            }}
          />
        )}

        {currentRoom === 'Raksha Basic' && roomStage === 'corridor' && (
          <RakshaBasicCorridor
            hasPaper={hasPaper}
            onPickPaper={() => setHasPaper(true)}
            onDropPaper={() => setHasPaper(false)}
            onBackToRoom1={() => {
              setRoomStage('room1');
              const playerRig = document.getElementById('rig');
              if (playerRig) {
                playerRig.object3D.position.set(0, 0, 4.5);
                playerRig.object3D.rotation.set(0, 0, 0);
              }
            }}
            onEnterRoom2={() => {
              setKeyboardConfig({ context: 'room2-enter', position: '0 1.4 -40.5', rotation: '-10 0 0' });
              setShowKeyboard(true);
            }}
          />
        )}

        {currentRoom === 'Raksha Basic' && roomStage === 'room2' && (
          <RakshaBasicRoom2
            hasPaper={hasPaper}
            onBackToCorridor={() => {
              setRoomStage('corridor');
              const playerRig = document.getElementById('rig');
              if (playerRig) {
                playerRig.object3D.position.set(0, 0, -15);
                playerRig.object3D.rotation.set(0, 0, 0);
              }
            }}
            onBackToMainMenu={() => {
              setCurrentRoom('LOBBY');
              setRoomStage('room1');
              setHasPaper(false); // reset saat kembali ke menu, biar main ulang bersih
              const playerRig = document.getElementById('rig');
              if (playerRig) {
                playerRig.object3D.position.set(0, 0, 0);
                playerRig.object3D.rotation.set(0, 0, 0);
              }
            }}
          />
        )}

        {currentRoom !== 'LOBBY' && (
          <a-sky color="#0a0e14"></a-sky>
        )}
        {currentRoom === 'Raksha Expert' && roomStage === 'room1' && (
          <RakshaExpertRoom1
            onEnterCorridor={goToExpertCorridor}
          />
        )}

        {currentRoom === 'Raksha Expert' && roomStage === 'corridor' && (
          <RakshaExpertCorridor
            onExitToLobby={() => {
              setCurrentRoom('LOBBY');
              setRoomStage('room1');

              const playerRig = document.getElementById('rig');
              if (playerRig) {
                playerRig.object3D.position.set(0, 0, 0);
                playerRig.object3D.rotation.set(0, 0, 0);
              }
            }}
          />
        )}
        {currentRoom !== 'LOBBY' && (
          <a-sky color="#0a0e14"></a-sky>
        )}

        {currentRoom === 'Raksha Beginner' && roomStage === 'room1' && (
          <RakshaBeginnerRoom
            onInteractTerminal={() => {
              setCurrentRoom('LOBBY');
              setRoomStage('room1');

              const playerRig = document.getElementById('rig');
              if (playerRig) {
                playerRig.object3D.position.set(0, 0, 0);
                playerRig.object3D.rotation.set(0, 0, 0);
              }
            }}
          />
        )}


        {showKeyboard && (
          <VirtualKeyboard
            position={keyboardConfig.position}
            rotation={keyboardConfig.rotation}
            currentInput={pin}
            onKeyPress={handleVirtualKeyPress}
            onClose={() => setShowKeyboard(false)}
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
          isTransitioning={isTransitioning}
          isWelcomeOpen={!!roomWelcome?.visible}
        />
      </a-scene>
    </div>
  );
}

export default App;