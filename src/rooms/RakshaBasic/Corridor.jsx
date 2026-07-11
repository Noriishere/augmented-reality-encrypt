import React, { useState, useRef, useEffect } from 'react';

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
function Locker({ position, rotation = "0 0 0", containsPaper = false, playerHasPaper = false, onPaperPickup }) {
    const [isOpen, setIsOpen] = useState(false);
    const hingeRef = useRef(null);

    useEffect(() => {
        const hinge = hingeRef.current;
        if (!hinge) return;
        hinge.emit(isOpen ? 'door-open' : 'door-close');
    }, [isOpen]);

    const toggleDoor = (e) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    // Kertas cuma tampil kalau: locker ini memang berisi kertas, pintunya terbuka,
    // DAN player belum pegang kertasnya (biar gak duplikat kalau dibuka lagi)
    const showPaper = containsPaper && isOpen && !playerHasPaper;

    return (
        <a-entity position={position} rotation={rotation}>
            {/* ===== BADAN LOCKER — TANPA SISI DEPAN ===== */}
            <a-box class="solid" position="0 1.2 -0.2" width="0.8" height="2.4" depth="0.04"
                color="#4b5158" material="src: #tex-locker-open; roughness: 0.6; metalness: 0.5"></a-box>
            <a-box class="solid" position="-0.38 1.2 -0.1" width="0.04" height="2.4" depth="0.44"
                color="#5b6169" material="roughness: 0.5; metalness: 0.6"></a-box>
            <a-box class="solid" position="0.38 1.2 -0.1" width="0.04" height="2.4" depth="0.44"
                color="#5b6169" material="roughness: 0.5; metalness: 0.6"></a-box>
            <a-box class="solid" position="0 2.42 -0.1" width="0.8" height="0.04" depth="0.44"
                color="#5b6169" material="roughness: 0.5; metalness: 0.6"></a-box>
            <a-box class="solid" position="0 -0.01 -0.1" width="0.8" height="0.04" depth="0.44"
                color="#5b6169" material="roughness: 0.5; metalness: 0.6"></a-box>

            {/* ===== PINTU — HINGED ===== */}
            <a-entity
                ref={hingeRef}
                position="-0.38 1.2 0.1"
                rotation="0 0 0"
                animation__open="property: rotation; to: 0 -100 0; dur: 450; easing: easeOutQuad; startEvents: door-open"
                animation__close="property: rotation; to: 0 0 0; dur: 350; easing: easeInQuad; startEvents: door-close"
            >
                <a-box
                    className="clickable"
                    position="0.375 0 0"
                    width="0.75" height="2.3" depth="0.05"
                    material={`src: ${isOpen ? "#tex-locker-front" : "#tex-locker-front"}; roughness: 0.5; metalness: 0.4`}
                    animation__hover="property: scale; to: 1.02 1.02 1.02; startEvents: mouseenter; dur: 150"
                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                    onClick={toggleDoor}
                ></a-box>
                <a-box position="0.68 0 0.03" width="0.04" height="0.15" depth="0.04"
                    color="#4b5563" material="roughness: 0.3; metalness: 0.7"></a-box>
            </a-entity>

            {/* ===== KERTAS + TOMBOL — SEMUA DI DALAM LOCKER, DEKAT KERTAS ===== */}
            {showPaper && (
                <a-entity position="0 2 -0.1">
                    <a-plane width="0.28" height="0.38" rotation="0 0 5"
                        material="src: #tex-paper-note; roughness: 0.8; side: double"
                        className="clickable"
                        animation__hover="property: scale; to: 1.08 1.08 1.08; startEvents: mouseenter; dur: 150"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                        onClick={(e) => { e.stopPropagation(); onPaperPickup(); }}
                    ></a-plane>

                    {/* <a-entity position="0 -0.32 0.02">
                        <a-box width="0.3" height="0.11" depth="0.02" color="#16a34a"
                            className="clickable"
                            animation__hover="property: scale; to: 1.08 1.08 1.08; startEvents: mouseenter; dur: 150"
                            animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                            onClick={(e) => { e.stopPropagation(); onPaperPickup(); }}
                        ></a-box>
                        <a-text value="AMBIL" position="0 0 0.02" align="center" color="#ffffff" scale="0.12 0.12 0.12" font="mozillavr"></a-text>
                    </a-entity>

                    <a-entity position="0 -0.48 0.02">
                        <a-box width="0.3" height="0.11" depth="0.02" color="#475569"
                            className="clickable"
                            animation__hover="property: scale; to: 1.08 1.08 1.08; startEvents: mouseenter; dur: 150"
                            animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        ></a-box>
                        <a-text value="TUTUP" position="0 0 0.02" align="center" color="#ffffff" scale="0.12 0.12 0.12" font="mozillavr"></a-text>
                    </a-entity> */}
                </a-entity>
            )}

            <a-sphere position="0.3 2.4 0.13" radius="0.02"
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

            {/* <a-text value="RAHASIA:" position="0 0.12 0.01" align="center" color="#333" scale="0.08 0.08 0.08" font="mozillavr"></a-text>
            <a-text value="Kode: ouwo" position="0 0.02 0.01" align="center" color="#c00" scale="0.1 0.1 0.1" font="mozillavr"></a-text>
            <a-text value="untuk Room 2" position="0 -0.06 0.01" align="center" color="#333" scale="0.06 0.06 0.06" font="mozillavr"></a-text> */}

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
export default function Corridor({ onBackToRoom1, onEnterRoom2, hasPaper, onPickPaper, onDropPaper }) {
    const [showPaperPopup, setShowPaperPopup] = useState(false);

    const handlePaperTake = () => {
        setShowPaperPopup(false);
        onPickPaper(); // <-- panggil prop, bukan setIsHoldingPaper(true)
    };

    const handlePaperDrop = () => {
        onDropPaper(); // <-- panggil prop, bukan setIsHoldingPaper(false)
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
            <Locker position="-2.2 0 -18" rotation="0 90 0" containsPaper={false} playerHasPaper={hasPaper} />
            <Locker position="-2.2 0 -22" rotation="0 90 0" containsPaper={true} playerHasPaper={hasPaper}
                onPaperPickup={onPickPaper}
            />
            <Locker position="-2.2 0 -26" rotation="0 90 0" containsPaper={false} playerHasPaper={hasPaper} />
            <Locker position="-2.2 0 -30" rotation="0 90 0" containsPaper={false} playerHasPaper={hasPaper} />

            {/* ========== HELD PAPER (Kertas di Tangan) ========== */}
            {hasPaper && <HeldPaper onDrop={handlePaperDrop} />}

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