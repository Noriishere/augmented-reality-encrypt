import React, { useState } from 'react';

/* ============================================================
   A-FRAME CUSTOM COMPONENT: FOLLOW CAMERA
   ============================================================ */
// Menempelkan objek langsung ke kamera, dan membersihkannya saat di-drop
if (typeof AFRAME !== 'undefined' && !AFRAME.components['follow-camera']) {
    AFRAME.registerComponent('follow-camera', {
        init: function () {
            this.camera = document.querySelector('a-camera');
            if (this.camera) {
                this.camera.object3D.add(this.el.object3D);
            }
        },
        remove: function () {
            if (this.camera) {
                this.camera.object3D.remove(this.el.object3D);
            }
        }
    });
}

/* ============================================================
   LOCKER COMPONENT
   ============================================================ */
function Locker({ position, rotation = "0 0 0", hasPaper = false, onPaperPickup }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <a-entity position={position} rotation={rotation}>
            {/* Brankas — box utama */}
            <a-box class="solid" position="0 1.2 0" width="0.8" height="2.4" depth="0.6"
                color="#6b7280" material="roughness: 0.5; metalness: 0.6"></a-box>
            
            {/* Pintu brankas */}
            <a-plane position="0 1.2 0.31" width="0.75" height="2.3"
                material={`src: ${isOpen ? "#tex-locker-open" : "#tex-locker-front"}; roughness: 0.5; metalness: 0.4`}></a-plane>
            
            {/* Handle */}
            <a-box position="0.25 1.2 0.33" width="0.04" height="0.15" depth="0.04"
                color="#4b5563" material="roughness: 0.3; metalness: 0.7"></a-box>

            {/* AREA KLIK BUKA PINTU (Saat Tertutup) */}
            {!isOpen && (
                <a-box className="clickable" position="0 1.2 0.35" width="0.7" height="2.3" depth="0.3"
                    material="opacity: 0; transparent: true"
                    onClick={(e) => {
                        e.stopPropagation(); 
                        setIsOpen(true);
                        // Langsung munculkan pop-up saat pintu dibuka (jika ada kertas)
                        if (hasPaper && onPaperPickup) {
                            onPaperPickup();
                        }
                    }}></a-box>
            )}

            {/* AREA KLIK TUTUP PINTU (Saat Terbuka, digeser ke pinggir agar kertas bisa diklik) */}
            {isOpen && (
                <a-box className="clickable" position="-0.3 1.2 0.35" width="0.15" height="2.3" depth="0.3"
                    material="opacity: 0; transparent: true"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}></a-box>
            )}

            {/* Kertas fisik di dalam brankas (Bisa diklik lagi jika pop-up tak sengaja tertutup) */}
            {isOpen && hasPaper && (
                <a-entity position="0 0.8 0.1">
                    <a-plane width="0.3" height="0.4" rotation="0 0 5"
                        material="src: #tex-paper-note; roughness: 0.8; side: double"></a-plane>
                    <a-box className="clickable" position="0 0 0.05" width="0.4" height="0.5" depth="0.2"
                        material="opacity: 0; transparent: true"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onPaperPickup) onPaperPickup();
                        }}></a-box>
                </a-entity>
            )}
            
            {/* Status indicator */}
            <a-sphere position="0.3 2.3 0.32" radius="0.02"
                material={`color: ${isOpen ? "#00ff00" : "#ff4444"}; emissive: ${isOpen ? "#00ff00" : "#ff4444"}; emissiveIntensity: 2`}></a-sphere>
        </a-entity>
    );
}

/* ============================================================
   HELD PAPER — Kertas Dipegang di Tangan Kiri
   ============================================================ */
function HeldPaper({ onDrop }) {
    return (
        <a-entity follow-camera position="-0.4 -0.3 -0.5" rotation="-15 20 0">
            <a-plane width="0.3" height="0.4"
                material="src: #tex-paper-note; roughness: 0.8; side: double"></a-plane>
            
            <a-text value="RAHASIA:" position="0 0.12 0.01" align="center" color="#333" scale="0.08 0.08 0.08" font="mozillavr"></a-text>
            <a-text value="Kode: ouwo" position="0 0.02 0.01" align="center" color="#c00" scale="0.1 0.1 0.1" font="mozillavr"></a-text>
            <a-text value="untuk Room 2" position="0 -0.06 0.01" align="center" color="#333" scale="0.06 0.06 0.06" font="mozillavr"></a-text>
            
            {/* Hitbox untuk membuang (Drop) kertas */}
            <a-box className="clickable" position="0 0 0.02" width="0.35" height="0.45" depth="0.05"
                material="opacity: 0; transparent: true"
                onClick={(e) => {
                    e.stopPropagation();
                    onDrop();
                }}></a-box>
        </a-entity>
    );
}

/* ============================================================
   CORRIDOR
   ============================================================ */
export default function Corridor({ onBackToRoom1, onEnterRoom2 }) {
    const [showPaperPopup, setShowPaperPopup] = useState(false);
    const [isHoldingPaper, setIsHoldingPaper] = useState(false); // State penyimpan status tangan

    const handlePaperTake = () => {
        setShowPaperPopup(false); // Tutup pop-up
        setIsHoldingPaper(true);  // Kertas pindah ke tangan kiri
    };

    const handlePaperDrop = () => {
        setIsHoldingPaper(false); // Kertas dibuang dari tangan
    };

    return (
        <a-entity id="raksha-basic-corridor">
            {/* Pencahayaan */}
            <a-light type="ambient" color="#b0b8c4" intensity="0.35"></a-light>
            <a-light type="point" color="#e0e4ec" intensity="0.5" position="0 4.5 -22" distance="20" decay="2"></a-light>
            <a-light type="point" color="#e0e4ec" intensity="0.35" position="0 4.5 -35" distance="18" decay="2"></a-light>

            {/* Lantai */}
            <a-plane position="0 0 -28" rotation="-90 0 0" width="5" height="32"
                material="src: #tex-office-floor; repeat: 2 10; roughness: 0.6"></a-plane>

            {/* Dinding kiri & kanan */}
            <a-box class="solid" position="-2.5 2.5 -28" width="0.2" height="5" depth="32"
                material="src: #tex-office-wall-inner-hd; repeat: 10 2; roughness: 0.75"></a-box>
            <a-box class="solid" position="2.5 2.5 -28" width="0.2" height="5" depth="32"
                material="src: #tex-office-wall-inner-hd; repeat: 10 2; roughness: 0.75"></a-box>

            {/* Langit-langit */}
            <a-box class="solid" position="0 4.9 -28" width="5" height="0.2" depth="32"
                material="src: #tex-office-ceiling; repeat: 2 10; roughness: 0.9"></a-box>

            {/* ========== 4 BRANKAS di dinding kiri ========== */}
            <Locker position="-2.2 0 -18" rotation="0 90 0" hasPaper={false} />
            <Locker position="-2.2 0 -22" rotation="0 90 0" hasPaper={true} 
                onPaperPickup={() => {
                    // Hanya munculkan pop-up kalau tangan sedang tidak memegang kertas
                    if (!isHoldingPaper) setShowPaperPopup(true);
                }} 
            />
            <Locker position="-2.2 0 -26" rotation="0 90 0" hasPaper={false} />
            <Locker position="-2.2 0 -30" rotation="0 90 0" hasPaper={false} />

            {/* ========== PAPER POPUP (Panel Baca Statis) ========== */}
            {showPaperPopup && (
                <a-entity position="-1.2 1.4 -22" rotation="0 90 0" scale="0.8 0.8 0.8">
                    <a-box position="0 0 -0.05" width="2" height="2.5" depth="0.05"
                        material="color: #0f172a; opacity: 0.95; transparent: true"></a-box>
                    <a-plane position="0 0.2 0" width="1.5" height="2"
                        material="src: #tex-paper-note; roughness: 0.8; side: double"></a-plane>
                    
                    <a-text value="RAHASIA:" position="0 0.7 0.01" align="center" color="#333" scale="0.15 0.15 0.15" font="mozillavr"></a-text>
                    <a-text value="Kode: ouwo" position="0 0.4 0.01" align="center" color="#c00" scale="0.15 0.15 0.15" font="mozillavr"></a-text>
                    <a-text value="untuk Room 2" position="0 0.2 0.01" align="center" color="#333" scale="0.1 0.1 0.1" font="mozillavr"></a-text>
                    
                    {/* TOMBOL AMBIL KERTAS */}
                    <a-entity position="0 -0.45 0">
                        <a-box width="1" height="0.3" depth="0.05" color="#16a34a"
                            className="clickable"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePaperTake();
                            }}></a-box>
                        <a-text value="AMBIL" position="0 0 0.03" align="center" color="#ffffff" scale="0.25 0.25 0.25"></a-text>
                    </a-entity>

                    {/* TOMBOL TUTUP POP-UP */}
                    <a-entity position="0 -0.85 0">
                        <a-box width="1" height="0.3" depth="0.05" color="#475569"
                            className="clickable"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPaperPopup(false);
                            }}></a-box>
                        <a-text value="TUTUP" position="0 0 0.03" align="center" color="#ffffff" scale="0.25 0.25 0.25"></a-text>
                    </a-entity>
                </a-entity>
            )}

            {/* ========== HELD PAPER (Kertas di Tangan) ========== */}
            {isHoldingPaper && <HeldPaper onDrop={handlePaperDrop} />}

            {/* ========== PINTU KEMBALI KE ROOM 1 (z=-13) ========== */}
            <a-entity id="door-back-room1" position="0 0 -13">
                <a-box class="solid" position="0 2 0" width="5" height="4" depth="0.3" color="#e8ecf0" material="roughness: 0.5"></a-box>
                <a-plane position="0 1.5 0.16" width="4.2" height="3.2"
                    material="src: #tex-office-roller; roughness: 0.5"></a-plane>
                <a-box position="0 3.5 0.17" width="4.2" height="0.7" depth="0.05" color="#166534"
                    material="emissive: #14532d; emissiveIntensity: 0.5"></a-box>
                <a-text value="ROOM 1" position="0 3.55 0.2" align="center" color="#4ade80" scale="0.9 0.9 0.9" font="mozillavr"></a-text>
                <a-text value="Kembali ke Lobby" position="0 3.3 0.2" align="center" color="#bbf7d0" scale="0.3 0.3 0.3"></a-text>
                <a-box className="clickable" position="0 1.5 0.2" width="4.2" height="3.2" depth="0.5"
                    material="opacity: 0; transparent: true"
                    onClick={onBackToRoom1}></a-box>
            </a-entity>

            {/* ========== PINTU ROOM 2 (z=-43, dengan keypad) ========== */}
            <a-entity id="exit-gate" position="0 0 -43">
                <a-box class="solid" position="0 2 0" width="4.8" height="4" depth="0.4" color="#e8ecf0" material="roughness: 0.5"></a-box>
                <a-plane position="0 1.5 0.21" width="4" height="3.2"
                    material="src: #tex-office-roller; roughness: 0.5"></a-plane>
                <a-box position="0 3.5 0.22" width="4" height="0.8" depth="0.05" color="#166534"
                    material="emissive: #14532d; emissiveIntensity: 0.6"></a-box>
                <a-text value="GERBANG ROOM 2" position="0 3.6 0.25" align="center" color="#4ade80" scale="1 1 1" font="mozillavr"></a-text>
                <a-text value="STATUS: TERKUNCI (Butuh Kode)" position="0 3.3 0.25" align="center" color="#bbf7d0" scale="0.35 0.35 0.35"></a-text>

                {/* Keypad stand */}
                <a-cylinder class="solid" position="0 0.5 1.7" radius="0.18" height="1.2" color="#1e293b"></a-cylinder>

                {/* Keypad panel */}
                <a-entity position="0 1.2 1.8" rotation="-20 0 0">
                    <a-box width="1.5" height="0.9" depth="0.12" color="#020617"></a-box>
                    <a-text value="SISTEM AUTENTIKASI" position="0 0.30 0.07" align="center" color="#38bdf8" scale="0.32 0.32 0.32"></a-text>
                    <a-text value="Masukkan Kode" position="0 0.16 0.07" align="center" color="#94a3b8" scale="0.27 0.27 0.27"></a-text>
                    <a-text value="Hint: Kode dari kertas di brankas" position="0 0.04 0.07" align="center" color="#facc15" scale="0.18 0.18 0.18"></a-text>
                    <a-entity position="0 -0.18 0.07">
                        
                        {/* PERBAIKAN DI SINI: Hapus window.dispatchEvent dan ganti dengan onClick={onEnterRoom2} */}
                        <a-box width="1.1" height="0.28" depth="0.06" color="#0284c7" className="clickable"
                            animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                            animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                            onClick={onEnterRoom2}></a-box>
                            
                        <a-text value="BUKA KEYBOARD" position="0 0 0.04" align="center" color="#ffffff" scale="0.38 0.38 0.38" font="mozillavr"></a-text>
                    </a-entity>
                </a-entity>
            </a-entity>

            {/* Penutup */}
            <a-box class="solid" position="0 2.5 -13" width="5" height="5" depth="0.2"
                material="src: #tex-office-wall-inner-hd; repeat: 2 2; roughness: 0.75"></a-box>
            <a-box class="solid" position="0 2.5 -43" width="5" height="5" depth="0.2"
                material="src: #tex-office-wall-inner-hd; repeat: 2 2; roughness: 0.75"></a-box>
        </a-entity>
    );
}