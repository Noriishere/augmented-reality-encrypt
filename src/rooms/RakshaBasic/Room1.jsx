import React, { useState } from 'react';

/* ============================================================
   KOMPONEN 1: RUANGAN BILIK (Kiri & Kanan)
   ============================================================ */
function InnerRoom({ position, rotation = "0 0 0", isLeftRoom }) {
    const wallColor = "#1a1e24";
    const wallMat = "src: #tex-dc-wall; repeat: 2 4; roughness: 0.9; metalness: 0.3";
    const wallThickness = 0.2;

    const roomWidth = 3.5;
    const roomDepth = 8;
    const roomHeight = 5;

    // Menentukan di sisi mana letak celah pintu masuk (menghadap lorong tengah)
    const doorWallX = isLeftRoom ? (roomWidth / 2) : -(roomWidth / 2);
    const outerWallX = isLeftRoom ? -(roomWidth / 2) : (roomWidth / 2);

    return (
        <a-entity position={position} rotation={rotation}>
            {/* Atap Ruangan */}
            <a-box class="solid" position="0 4.9 0" width={roomWidth} height="0.2" depth={roomDepth} color="#0f172a"></a-box>

            {/* Dinding Depan & Belakang */}
            <a-box class="solid" position={`0 2.5 ${roomDepth / 2}`} width={roomWidth} height={roomHeight} depth={wallThickness} color={wallColor} material={wallMat}></a-box>
            <a-box class="solid" position={`0 2.5 ${-roomDepth / 2}`} width={roomWidth} height={roomHeight} depth={wallThickness} color={wallColor} material={wallMat}></a-box>

            {/* Dinding Sisi Luar Tertutup Rapat */}
            <a-box class="solid" position={`${outerWallX} 2.5 0`} width={wallThickness} height={roomHeight} depth={roomDepth} color={wallColor} material={wallMat}></a-box>

            {/* Dinding Sisi Dalam (Diberi Celah Pintu Masuk di tengah) */}
            <a-box class="solid" position={`${doorWallX} 2.5 -2.5`} width={wallThickness} height={roomHeight} depth="3" color={wallColor} material={wallMat}></a-box>
            <a-box class="solid" position={`${doorWallX} 2.5 2.5`} width={wallThickness} height={roomHeight} depth="3" color={wallColor} material={wallMat}></a-box>
            <a-box class="solid" position={`${doorWallX} 4 0`} width={wallThickness} height="2" depth="2" color={wallColor} material={wallMat}></a-box>

            {/* Garis Neon Bawah */}
            <a-box position="0 0.15 0" width={roomWidth + 0.1} height="0.1" depth={roomDepth + 0.1} color="#0284c7" material="emissive: #0284c7; emissiveIntensity: 0.3" opacity="0.8"></a-box>
        </a-entity>
    );
}

/* ============================================================
   KOMPONEN 2: TERMINAL AUDIO (Petunjuk Sandi)
   ============================================================ */
function AudioTerminal({ position, rotation = "0 0 0" }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <a-entity position={position} rotation={rotation}>
            <a-cylinder class="solid" position="0 0.6 0" radius="0.25" height="1.2" color="#1e293b" material="roughness: 0.8; metalness: 0.5"></a-cylinder>

            <a-box position="0 1.4 0" rotation="-15 0 0" width="1" height="0.7" depth="0.1" color="#0f172a" border="1px solid #38bdf8"></a-box>
            <a-plane position="0 1.4 0.06" rotation="-15 0 0" width="0.9" height="0.6" color="#020617"></a-plane>

            <a-text value="[ AUDIO LOG ]" position="0 1.6 0.08" rotation="-15 0 0" align="center" color="#38bdf8" scale="0.3 0.3 0.3"></a-text>
            <a-text value="Penjelasan Sandi Caesar" position="0 1.45 0.08" rotation="-15 0 0" align="center" color="#94a3b8" scale="0.2 0.2 0.2"></a-text>

            <a-entity position="0 1.25 0.1" rotation="-15 0 0">
                <a-box
                    width="0.5" height="0.18" depth="0.05"
                    color={isPlaying ? "#ef4444" : "#10b981"}
                    className="clickable"
                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                    onClick={() => setIsPlaying(!isPlaying)}
                ></a-box>
                <a-text value={isPlaying ? "MENDENGARKAN..." : "PUTAR AUDIO"} position="0 0 0.03" align="center" color="#ffffff" scale="0.22 0.22 0.22" font="mozillavr"></a-text>
            </a-entity>

            {isPlaying && (
                <a-entity position="0 1.9 0">
                    <a-sphere radius="0.08" color="#10b981" material="emissive: #10b981; emissiveIntensity: 2; transparent: true; opacity: 0.8"
                        animation="property: scale; dir: alternate; dur: 400; to: 1.8 1.8 1.8; loop: true; easing: easeInOutSine"></a-sphere>
                </a-entity>
            )}
        </a-entity>
    );
}

/* ============================================================
   KOMPONEN UTAMA: RUANGAN 1 (RAKSHA BASIC)
   ============================================================ */
export default function Room1({ onInteractTerminal }) {
    const [showPopup, setShowPopup] = useState(true);

    return (
        <a-entity id="raksha-basic-room-1">

            {/* --- PENCAHAYAAN GLOBAL --- */}
            <a-light type="ambient" color="#0f172a" intensity="0.5"></a-light>
            <a-light type="point" color="#38bdf8" intensity="0.6" position="0 4 2" distance="15" decay="2"></a-light>
            <a-light type="point" color="#38bdf8" intensity="0.6" position="0 4 -4" distance="15" decay="2"></a-light>
            <a-light type="point" color="#22c55e" intensity="0.7" position="0 3 -10" distance="10" decay="2"></a-light>

            {/* --- ARSITEKTUR OKTAGON (Dinding Terluar) --- */}
            <a-cylinder position="0 0 0" radius="13" height="0.1" segments-radial="8" color="#020617" material="src: #tex-dc-floor; repeat: 8 8; roughness: 0.6; metalness: 0.2"></a-cylinder>
            <a-cylinder position="0 2.5 0" radius="13" height="5" segments-radial="8" side="back" open-ended="true" color="#1e293b" material="src: #tex-dc-wall; repeat: 10 2; roughness: 0.8"></a-cylinder>
            <a-cylinder position="0 5 0" radius="13" height="0.1" segments-radial="8" color="#0f172a" material="src: #tex-dc-ceiling; repeat: 6 6; roughness: 0.9"></a-cylinder>

            <a-box class="solid" position="0 2.5 -12.5" width="26" height="5" depth="1" visible="false"></a-box> {/* Utara */}
            <a-box class="solid" position="0 2.5 12.5" width="26" height="5" depth="1" visible="false"></a-box>  {/* Selatan */}
            <a-box class="solid" position="-12.5 2.5 0" width="1" height="5" depth="26" visible="false"></a-box> {/* Barat */}
            <a-box class="solid" position="12.5 2.5 0" width="1" height="5" depth="26" visible="false"></a-box>  {/* Timur */}


            {/* ==========================================================
                1. TITIK AWAL: POPUP INSTRUKSI (Di Selatan Lorong)
                ========================================================== */}
            {showPopup && (
                <a-entity id="instruction-popup" position="0 1.6 5">
                    <a-box position="0 0 -0.05" width="4.5" height="2.5" depth="0.05" material="color: #0f172a; roughness: 0.5; opacity: 0.95; transparent: true"></a-box>
                    <a-box position="0 0 -0.02" width="4.6" height="2.6" depth="0.01" material="color: #cbd5e1; opacity: 0.2; transparent: true; wireframe: true"></a-box>

                    <a-text value="PERHATIAN KADET!" position="0 0.8 0" align="center" color="#facc15" scale="0.7 0.7 0.7" font="mozillavr"></a-text>
                    <a-text value="Carilah kode sandi yang tersembunyi di ruangan ini.\nLalu pecahkan (decode) kode tersebut menjadi\nPlain Text agar bisa mengakses Pintu Keluar." position="0 0.3 0" align="center" color="#f8fafc" scale="0.4 0.4 0.4"></a-text>
                    <a-text value="HINT: Dengarkan Audio Log di terminal\nuntuk mengetahui metode dekripsinya." position="0 -0.2 0" align="center" color="#38bdf8" scale="0.4 0.4 0.4"></a-text>

                    <a-entity position="0 -0.8 0">
                        <a-box position="0 0 0" width="2" height="0.4" depth="0.06" color="#0284c7" className="clickable" animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200" animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200" onClick={() => setShowPopup(false)}></a-box>
                        <a-text value="MENGERTI" position="0 0 0.05" align="center" color="#ffffff" scale="0.5 0.5 0.5" font="mozillavr"></a-text>
                    </a-entity>
                </a-entity>
            )}


            {/* ==========================================================
                2. RUANGAN KIRI & TEKS RAHASIA DI DALAMNYA
                ========================================================== */}
            <InnerRoom position="-4.5 0 -1" isLeftRoom={true} />

            {/* Teks Rahasia diletakkan persis di dinding DALAM bagian utara ruangan kiri */}
            {/* Rotation 0 0 0 agar teks menghadap ke arah pemain saat mereka masuk */}
            <a-entity position="-4.5 2 -4.8" rotation="0 0 0">
                <a-plane position="0 0 -0.01" width="3" height="1.5" color="#000000" opacity="0.6"></a-plane>

                <a-text value="CIPHER DETECTED" position="0 0.4 0" align="center" color="#ef4444" scale="0.4 0.4 0.4"></a-text>
                <a-text value="V  B  D  P" position="0 0 0" align="center" color="#f87171" scale="2.5 2.5 2.5" font="mozillavr" material="emissive: #ef4444; emissiveIntensity: 1.5" animation="property: material.emissiveIntensity; dir: alternate; dur: 1200; to: 0.3; loop: true"></a-text>

                <a-text value="_  _  _  _" position="0 -0.4 0" align="center" color="#94a3b8" scale="2.5 2.5 2.5" font="mozillavr"></a-text>
                <a-text value="DECODE TO PROCEED" position="0 -0.8 0" align="center" color="#64748b" scale="0.3 0.3 0.3"></a-text>
            </a-entity>


            {/* ==========================================================
                3. RUANGAN KANAN & TERMINAL AUDIO DI DALAMNYA
                ========================================================== */}
            <InnerRoom position="4.5 0 -1" isLeftRoom={false} />

            {/* Terminal diletakkan di tengah-tengah ruang kanan, diputar -90 agar layarnya menghadap pintu */}
            <AudioTerminal position="4.5 0 -1" rotation="0 -90 0" />


            {/* ==========================================================
                4. GERBANG KELUAR & KEYBOARD (Ujung Utara Lorong Tengah)
                ========================================================== */}
            <a-entity id="exit-gate" position="0 0 -11.5">
                <a-box class="solid" position="0 2 0" width="4.4" height="4" depth="0.4" color="#0f172a" material="roughness: 0.5"></a-box>
                <a-plane position="0 1.5 0.21" width="3.6" height="3" color="#1e293b" material="src: #tex-dc-door; roughness: 0.7"></a-plane>

                <a-box position="0 3.5 0.22" width="3.6" height="0.8" depth="0.05" color="#166534" material="emissive: #14532d; emissiveIntensity: 0.6"></a-box>
                <a-text value="GERBANG KELUAR" position="0 3.6 0.25" align="center" color="#4ade80" scale="0.9 0.9 0.9" font="mozillavr"></a-text>
                <a-text value="STATUS: TERKUNCI (Butuh Dekripsi)" position="0 3.3 0.25" align="center" color="#bbf7d0" scale="0.35 0.35 0.35"></a-text>

                <a-cylinder class="solid" position="0 0.5 1.5" radius="0.3" height="1" color="#1e293b"></a-cylinder>

                <a-entity position="0 1.2 1.5" rotation="-20 0 0">
                    <a-box position="0 0 0" width="1.4" height="0.8" depth="0.1" color="#020617" border="2px solid #38bdf8"></a-box>
                    <a-text value="SISTEM AUTENTIKASI" position="0 0.25 0.06" align="center" color="#38bdf8" scale="0.3 0.3 0.3"></a-text>
                    <a-text value="Masukkan Plain Text" position="0 0.1 0.06" align="center" color="#94a3b8" scale="0.25 0.25 0.25"></a-text>

                    <a-entity position="0 -0.15 0.06">
                        <a-box width="1" height="0.25" depth="0.05" color="#0284c7" className="clickable" animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200" animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200" onClick={onInteractTerminal}></a-box>
                        <a-text value="BUKA KEYBOARD" position="0 0 0.03" align="center" color="#ffffff" scale="0.35 0.35 0.35" font="mozillavr"></a-text>
                    </a-entity>
                </a-entity>
            </a-entity>

        </a-entity>
    );
}