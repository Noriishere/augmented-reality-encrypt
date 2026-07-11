import React, { useState, useEffect } from 'react';

/* ============================================================
   INNER ROOM — Kantor dengan Komputer berjajar
   ============================================================ */

function InnerRoom({ position, rotation = "0 0 0", isLeftRoom, cipher1 = "#tex-dc-monitor", cipher2 = "#tex-dc-monitor" }) {
    const wallColor = "#c8cdd5";
    const wallMat = "src: #tex-office-wall-inner-hd; repeat: 2 3; roughness: 0.75; metalness: 0.1";
    const wallThickness = 0.25;
    const roomWidth = 6;
    const roomDepth = 10;
    const roomHeight = 5;
    const doorWallX = isLeftRoom ? (roomWidth / 2) : -(roomWidth / 2);
    const outerWallX = isLeftRoom ? -(roomWidth / 2) : (roomWidth / 2);

    // Computer desk component
    const ComputerStation = ({ x, z, rot = 0, screenTex = "#tex-dc-monitor" }) => (
        <a-entity position={`${x} 0 ${z}`} rotation={`0 ${rot} 0`}>
            {/* Meja Utama */}
            <a-box class="solid" position="0 0.78 0" width="1.4" height="0.06" depth="0.8"
                material="src: #tex-dc-desk; roughness: 0.5; metalness: 0.1"></a-box>

            {/* Papan Belakang (Pembatas Meja) */}
            <a-box position="0 0.75 -0.38" width="1.4" height="0.75" depth="0.04"
                material="src: #tex-dc-desk; roughness: 0.5; metalness: 0.1"></a-box>

            {/* Kaki Meja */}
            <a-box position="-0.6 0.37 0" width="0.08" height="0.75" depth="0.6" color="#505862" material="roughness: 0.4; metalness: 0.5"></a-box>
            <a-box position="0.6 0.37 0" width="0.08" height="0.75" depth="0.6" color="#505862" material="roughness: 0.4; metalness: 0.5"></a-box>

            {/* Panel penutup bawah meja (Modesty panel) */}
            <a-box position="0 0.4 -0.35" width="1.3" height="0.35" depth="0.03" color="#334155"></a-box>

            {/* Monitor */}
            <a-box position="0 1.25 -0.15" width="0.8" height="0.5" depth="0.05" color="#1a1e24"
                material="roughness: 0.3; metalness: 0.4"></a-box>
            {/* Screen — plane dengan texture custom */}
            <a-plane position="0 1.25 -0.12" width="0.72" height="0.44"
                material={`src: ${screenTex}; roughness: 0.3; metalness: 0.2`}></a-plane>
            <a-box position="0 0.95 -0.15" width="0.1" height="0.25" depth="0.1" color="#334155" material="roughness: 0.4; metalness: 0.5"></a-box>
            <a-box position="0 0.85 -0.15" width="0.25" height="0.03" depth="0.2" color="#334155"></a-box>

            {/* Keyboard + Mouse */}
            <a-box position="0 0.82 0.12" width="0.45" height="0.02" depth="0.18"
                material="src: #tex-dc-keyboard; roughness: 0.5"></a-box>
            <a-box position="0.3 0.82 0.15" width="0.1" height="0.02" depth="0.15"
                material="src: #tex-dc-mouse; roughness: 0.4"></a-box>

            {/* Kursi */}
            <a-box position="0 0.5 0.75" width="0.55" height="0.08" depth="0.55"
                material="src: #tex-dc-chair; roughness: 0.7"></a-box>
            <a-box position="0 0.8 1.0" width="0.5" height="0.5" depth="0.06" color="#2a2e38"></a-box>
            <a-cylinder position="0 0.25 0.75" radius="0.05" height="0.45" color="#404450" material="roughness: 0.3; metalness: 0.7"></a-cylinder>
        </a-entity>
    );

    return (
        <a-entity position={position} rotation={rotation}>
            {/* Ceiling */}
            <a-box class="solid" position="0 4.9 0" width={roomWidth} height="0.2" depth={roomDepth}
                material="src: #tex-office-ceiling; repeat: 2 4; roughness: 0.9"></a-box>
            {/* Walls */}
            <a-box class="solid" position={`0 2.5 ${roomDepth / 2}`} width={roomWidth} height={roomHeight} depth={wallThickness} color={wallColor} material={wallMat}></a-box>
            <a-box class="solid" position={`0 2.5 ${-roomDepth / 2}`} width={roomWidth} height={roomHeight} depth={wallThickness} color={wallColor} material={wallMat}></a-box>
            <a-box class="solid" position={`${outerWallX} 2.5 0`} width={wallThickness} height={roomHeight} depth={roomDepth} color={wallColor} material={wallMat}></a-box>
            <a-box class="solid" position={`${doorWallX} 2.5 -3`} width={wallThickness} height={roomHeight} depth="4" color={wallColor} material={wallMat}></a-box>
            <a-box class="solid" position={`${doorWallX} 2.5 3`} width={wallThickness} height={roomHeight} depth="4" color={wallColor} material={wallMat}></a-box>
            <a-box class="solid" position={`${doorWallX} 4.2 0`} width={wallThickness} height="1.6" depth="2" color={wallColor} material={wallMat}></a-box>
            {/* Floor */}
            <a-box position="0 0.05 0" width={roomWidth + 0.1} height="0.1" depth={roomDepth + 0.1}
                material="src: #tex-office-floor; repeat: 3 6; roughness: 0.6; metalness: 0.1"></a-box>

            {/* === LAYOUT KANTOR — 2 baris x 3 kolom === */}
            {/* Baris kiri — menghadap tengah (cipher1 + normal + cipher2) */}
            <ComputerStation x={-1.2} z={-3} rot={0} />
            <ComputerStation x={-1.2} z={-0.5} rot={0} screenTex={cipher1} />
            <ComputerStation x={-1.2} z={2} rot={0} />
            <ComputerStation x={-1.2} z={4} rot={0} />

            {/* Baris kanan — menghadap tengah (semua normal) */}
            <ComputerStation x={1.2} z={-3} rot={180} screenTex={cipher2} />
            <ComputerStation x={1.2} z={-0.5} rot={180} />
            <ComputerStation x={1.2} z={2} rot={180} />
            <ComputerStation x={1.2} z={4} rot={180} />

        </a-entity>
    );
}

/* ============================================================
   TERMINAL AUDIO — di luar inner room
   ============================================================ */
function AudioTerminal({ position, rotation = "0 0 0" }) {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <a-entity position={position} rotation={rotation}>
            <a-cylinder class="solid" position="0 0.5 0" radius="0.18" height="1.2" color="#1e293b" material="roughness: 0.8; metalness: 0.5"></a-cylinder>
            <a-box position="0 1.4 0" rotation="-15 0 0" width="1.1" height="0.75" depth="0.12" color="#0f172a"></a-box>
            <a-plane position="0 1.4 0.07" rotation="-15 0 0" width="1" height="0.65" color="#020617"></a-plane>
            <a-text value="[ AUDIO LOG ]" position="0 1.6 0.09" rotation="-15 0 0" align="center" color="#38bdf8" scale="0.32 0.32 0.32"></a-text>
            <a-text value="Penjelasan Sandi Caesar" position="0 1.45 0.09" rotation="-15 0 0" align="center" color="#94a3b8" scale="0.22 0.22 0.22"></a-text>
            <a-entity position="0 1.25 0.12" rotation="-15 0 0">
                <a-box width="0.55" height="0.2" depth="0.06" color={isPlaying ? "#ef4444" : "#10b981"}
                    className="clickable"
                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                    onClick={() => setIsPlaying(!isPlaying)}></a-box>
                <a-text value={isPlaying ? "MENDENGARKAN..." : "PUTAR AUDIO"} position="0 0 0.04" align="center" color="#ffffff" scale="0.24 0.24 0.24" font="mozillavr"></a-text>
            </a-entity>
            {isPlaying && (
                <a-entity position="0 2 0">
                    <a-sphere radius="0.1" color="#10b981"
                        material="emissive: #10b981; emissiveIntensity: 2; transparent: true; opacity: 0.8"
                        animation="property: scale; dir: alternate; dur: 400; to: 1.8 1.8 1.8; loop: true; easing: easeInOutSine"></a-sphere>
                </a-entity>
            )}
        </a-entity>
    );
}

/* ============================================================
   OCTAGON WALLS
   ============================================================ */
function OctagonWalls() {
    const RADIUS = 13;
    const SIDE = 2.2 * RADIUS * Math.sin(Math.PI / 8); // panjang sisi octagon

    const walls = Array.from({ length: 8 }, (_, i) => {
        const angleDeg = i * 45;
        const angleRad = angleDeg * Math.PI / 180;

        return {
            x: RADIUS * Math.sin(angleRad),
            z: RADIUS * Math.cos(angleRad),
            rotY: angleDeg
        };
    });

    return (
        <>
            {walls.map((wall, i) => (
                <React.Fragment key={`oct-${i}`}>
                    {/* Collider */}
                    <a-box
                        class="solid"
                        position={`${wall.x} 2.5 ${wall.z}`}
                        rotation={`0 ${wall.rotY} 0`}
                        width={SIDE - 0.15}
                        height="5"
                        depth="0.1"
                        visible="false"
                    />

                    {/* Debug */}
                    <a-box
                        position={`${wall.x} 2.5 ${wall.z}`}
                        rotation={`0 ${wall.rotY} 0`}
                        width={SIDE - 0.15}
                        height="5"
                        depth="0.1"
                        material="wireframe: true; color: red;"
                    />
                </React.Fragment>
            ))}
        </>
    );
}

/* ============================================================
   MAIN: ROOM1
   ============================================================ */
export default function Room1({ onInteractTerminal }) {
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            document.querySelector('a-scene')?.emit('refresh-solids');
        });
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <a-entity id="raksha-basic-room-1">

            {/* === PENCAHAYAAN === */}
            <a-light type="ambient" color="#e8ecf4" intensity="0.3"></a-light>
            <a-light type="point" color="#f0f4ff" intensity="0.5" position="0 4.5 0" distance="18" decay="2"></a-light>
            <a-light type="point" color="#e0e8f5" intensity="0.3" position="-5 4 -5" distance="15" decay="2"></a-light>
            <a-light type="point" color="#e0e8f5" intensity="0.3" position="5 4 5" distance="15" decay="2"></a-light>
            <a-light type="point" color="#22c55e" intensity="0.3" position="0 3 -12" distance="12" decay="2"></a-light>

            {/* === OCTAGON === */}
            <a-cylinder position="0 0 0" radius="14" height="0.15" segments-radial="8"
                material="src: #tex-office-floor; repeat: 8 8; roughness: 0.6; metalness: 0.1"></a-cylinder>
            <a-cylinder position="0 5 0" radius="14" height="0.15" segments-radial="8"
                material="src: #tex-office-ceiling; repeat: 7 7; roughness: 0.9"></a-cylinder>
            <a-cylinder position="0 2.5 0" radius="14" height="5" segments-radial="8"
                side="back" open-ended="true" material="src: #tex-office-wall-outer-hd; repeat: 8 2; roughness: 0.8"></a-cylinder>
            <a-entity rotation="0 22.5 0">
                <OctagonWalls />
            </a-entity>

            {/* === POPUP === */}
            {showPopup && (
                <a-entity id="instruction-popup" position="0 1.6 8">
                    <a-box position="0 0 -0.05" width="5" height="2.8" depth="0.05"
                        material="color: #0f172a; roughness: 0.5; opacity: 0.95; transparent: true"></a-box>
                    <a-text value="PERHATIAN KADET!" position="0 0.9 0" align="center" color="#facc15" scale="0.8 0.8 0.8" font="mozillavr"></a-text>
                    <a-text value="Carilah kode sandi yang tersembunyi di ruangan ini.\nLalu pecahkan (decode) kode tersebut menjadi\nPlain Text agar bisa mengakses Pintu Keluar." position="0 0.3 0" align="center" color="#f8fafc" scale="0.4 0.4 0.4"></a-text>
                    <a-text value="HINT: Dengarkan Audio Log di terminal\nuntuk mengetahui metode dekripsinya." position="0 -0.3 0" align="center" color="#38bdf8" scale="0.4 0.4 0.4"></a-text>
                    <a-entity position="0 -1 0">
                        <a-box width="2.2" height="0.45" depth="0.06" color="#0284c7" className="clickable"
                            animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                            animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                            onClick={() => setShowPopup(false)}></a-box>
                        <a-text value="MENGERTI" position="0 0 0.05" align="center" color="#ffffff" scale="0.55 0.55 0.55" font="mozillavr"></a-text>
                    </a-entity>
                </a-entity>
            )}

            {/* === INNER ROOM KIRI (cipher V & B) === */}
            <InnerRoom position="-6 0 0" isLeftRoom={true} cipher1="#tex-monitor-v" cipher2="#tex-monitor-b" />

            {/* === INNER ROOM KANAN (cipher D & P) === */}
            <InnerRoom position="6 0 0" isLeftRoom={false} cipher1="#tex-monitor-d" cipher2="#tex-monitor-p" />

            {/* === AUDIO TERMINAL — di luar inner room, di tengah lorong === */}
            <AudioTerminal position="0 0 -3" rotation="0 0 0" />

            {/* === GERBANG KELUAR === */}
            <a-entity id="exit-gate" position="0 0 -13">
                <a-box class="solid" position="0 2 0" width="4.8" height="4" depth="0.4" color="#e8ecf0" material="roughness: 0.5"></a-box>
                <a-plane position="0 1.5 0.21" width="4" height="3.2"
                    material="src: #tex-office-roller; roughness: 0.5"></a-plane>
                <a-box position="0 3.5 0.22" width="4" height="0.8" depth="0.05" color="#166534"
                    material="emissive: #14532d; emissiveIntensity: 0.6"></a-box>
                <a-text value="GERBANG KELUAR" position="0 3.6 0.25" align="center" color="#4ade80" scale="1 1 1" font="mozillavr"></a-text>
                <a-text value="STATUS: TERKUNCI (Butuh Dekripsi)" position="0 3.3 0.25" align="center" color="#bbf7d0" scale="0.35 0.35 0.35"></a-text>
                <a-cylinder class="solid" position="0 0.5 1.7" radius="0.18" height="1.2" color="#1e293b"></a-cylinder>
                <a-entity position="0 1.2 1.8" rotation="-20 0 0">
                    <a-box width="1.5" height="0.9" depth="0.12" color="#020617"></a-box>
                    <a-text value="SISTEM AUTENTIKASI" position="0 0.30 0.07" align="center" color="#38bdf8" scale="0.32 0.32 0.32"></a-text>
                    <a-text value="Masukkan Plain Text" position="0 0.16 0.07" align="center" color="#94a3b8" scale="0.27 0.27 0.27"></a-text>
                    <a-text value="Hint: Tujuh langkah ke masa lalu akan menuntunmu pada makna yang sebenarnya." position="0 0.04 0.07" align="center" color="#facc15" scale="0.18 0.18 0.18"></a-text>
                    <a-entity position="0 -0.18 0.07">
                        <a-box width="1.1" height="0.28" depth="0.06" color="#0284c7" className="clickable"
                            animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                            animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                            onClick={onInteractTerminal}></a-box>
                        <a-text value="BUKA KEYBOARD" position="0 0 0.04" align="center" color="#ffffff" scale="0.38 0.38 0.38" font="mozillavr"></a-text>
                    </a-entity>
                </a-entity>
            </a-entity>
        </a-entity>
    );
}