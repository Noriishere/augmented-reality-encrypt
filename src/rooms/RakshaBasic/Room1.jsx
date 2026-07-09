import React, { useState } from 'react';

/* ============================================================
   1. KOMPONEN SERVER RACK (Penyekat Lorong Tengah)
   ============================================================ */
function ServerRack({ position, rotation = "0 0 0" }) {
    return (
        <a-entity position={position} rotation={rotation}>
            <a-box class="solid" position="0 1.4 0" width="0.9" height="2.8" depth="0.65"
                color="#1a1e24" material="roughness: 0.3; metalness: 0.7"></a-box>
            <a-plane position="0 1.4 0.33" width="0.8" height="2.7"
                material="src: #tex-dc-server; roughness: 0.4; metalness: 0.3"></a-plane>
            <a-plane position="-0.46 1.4 0" rotation="0 -90 0" width="0.65" height="2.7"
                color="#1a1e24" material="roughness: 0.4; metalness: 0.6"></a-plane>
            <a-plane position="0.46 1.4 0" rotation="0 90 0" width="0.65" height="2.7"
                color="#1a1e24" material="roughness: 0.4; metalness: 0.6"></a-plane>
            <a-plane position="0 2.81 0" rotation="-90 0 0" width="0.9" height="0.65"
                color="#22262c" material="roughness: 0.4; metalness: 0.5"></a-plane>
            {/* Lampu indikator server aktif */}
            <a-sphere position="0.3 2.5 0.35" radius="0.02"
                material="color: #00ff44; emissive: #00ff44; emissiveIntensity: 2"></a-sphere>
        </a-entity>
    );
}

/* ============================================================
   2. KOMPONEN DINDING OKTAGON (Segi Delapan)
   ============================================================ */
function OctagonWall({ position, rotation, width = "6.8", height = "5" }) {
    return (
        <a-entity position={position} rotation={rotation}>
            {/* Dinding Utama */}
            <a-plane class="solid" position="0 2.5 0" width={width} height={height}
                material="src: #tex-dc-wall; repeat: 2 1; roughness: 0.8"></a-plane>
            {/* Baseboard Bawah */}
            <a-box position="0 0.1 0.05" width={width} height="0.2" depth="0.1"
                color="#334155" material="roughness: 0.5; metalness: 0.4"></a-box>
            {/* Trim Atas */}
            <a-box position="0 4.9 0.05" width={width} height="0.2" depth="0.1"
                color="#1e293b" material="roughness: 0.5; metalness: 0.4"></a-box>
        </a-entity>
    );
}

/* ============================================================
   3. KOMPONEN KEYBOARD VIRTUAL 3D (Untuk Input Password)
   ============================================================ */
function VirtualKeyboard3D({ position, rotation = "0 0 0", onKeyPress, onDelete, onSubmit }) {
    const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

    const renderKey = (char, x, y, width = 0.22, color = "#334155", onClickHandler) => (
        <a-entity key={char} position={`${x} ${y} 0`}>
            <a-box
                className="clickable"
                position="0 0 0" width={width} height="0.22" depth="0.04"
                color={color}
                material="roughness: 0.3; metalness: 0.5"
                animation__hover="property: position; to: 0 0 -0.02; startEvents: mouseenter; dur: 100"
                animation__leave="property: position; to: 0 0 0; startEvents: mouseleave; dur: 100"
                onClick={() => onClickHandler(char)}
            >
                <a-text value={char} align="center" position="0 0 0.03" scale="0.4 0.4 0.4" color="#ffffff" font="mozillavr"></a-text>
            </a-box>
        </a-entity>
    );

    return (
        <a-entity position={position} rotation={rotation}>
            {/* Casing Keyboard */}
            <a-box position="0 0 -0.05" width="3.2" height="1.4" depth="0.08"
                color="#0f172a" material="roughness: 0.4; metalness: 0.6"></a-box>
            <a-plane position="0 0 -0.009" width="3.1" height="1.3" color="#1e293b"></a-plane>

            {/* Baris 1: QWERTY */}
            {row1.map((char, index) => renderKey(char, -1.17 + (index * 0.26), 0.35, 0.22, "#334155", onKeyPress))}

            {/* Baris 2: ASDF */}
            {row2.map((char, index) => renderKey(char, -1.04 + (index * 0.26), 0.08, 0.22, "#334155", onKeyPress))}

            {/* Baris 3: ZXCV */}
            {row3.map((char, index) => renderKey(char, -0.78 + (index * 0.26), -0.19, 0.22, "#334155", onKeyPress))}

            {/* Tombol Spesial: BACKSPACE & ENTER */}
            {renderKey("CLR", -1.2, -0.19, 0.35, "#b91c1c", onDelete)}
            {renderKey("ENTER", 1.15, -0.19, 0.45, "#15803d", onSubmit)}
        </a-entity>
    );
}

/* ============================================================
   4. RUANGAN UTAMA: RAKSHA BASIC ROOM 1
   ============================================================ */
export default function RakshaBasicRoom1({ onCompleteRoom }) {
    // State UI & Game Logic
    const [showGuide, setShowGuide] = useState(true);
    const [inputCode, setInputCode] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [statusMsg, setStatusMsg] = useState("STATUS: MENUNGGU INPUT SANDI...");
    const [statusColor, setStatusColor] = useState("#38bdf8");
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    // Handler Keyboard
    const handleKeyPress = (char) => {
        if (inputCode.length < 4 && !isUnlocked) {
            setInputCode((prev) => prev + char);
            setStatusMsg("STATUS: MENGETIK...");
            setStatusColor("#facc15");
        }
    };

    const handleDelete = () => {
        if (!isUnlocked) {
            setInputCode("");
            setStatusMsg("STATUS: INPUT DIHAPUS");
            setStatusColor("#94a3b8");
        }
    };

    const handleSubmit = () => {
        if (isUnlocked) return;
        
        // Logika Caesar Cipher: VBDP -> Mundur 7 huruf -> OUWI
        if (inputCode === "OUWI") {
            setIsUnlocked(true);
            setStatusMsg("AKSES DITERIMA! GERBANG TERBUKA.");
            setStatusColor("#4ade80");
        } else {
            setStatusMsg("KODE SALAH! TARIK MUNDUR 7 HURUF DARI 'VBDP'");
            setStatusColor("#f87171");
            setTimeout(() => {
                setInputCode("");
                setStatusMsg("STATUS: COBA LAGI...");
                setStatusColor("#38bdf8");
            }, 2500);
        }
    };

    // Handler Suara Penjelasan
    const toggleAudioExplanation = () => {
        const audioEl = document.getElementById("voice-explanation-audio");
        if (audioEl) {
            if (isPlayingAudio) {
                audioEl.pause();
                audioEl.currentTime = 0;
                setIsPlayingAudio(false);
            } else {
                audioEl.play();
                setIsPlayingAudio(true);
            }
        } else {
            alert("Memutar narasi suara: 'Gunakan metode Caesar Cipher dengan menarik mundur 7 langkah pada abjad untuk memecahkan kode rahasia.'");
        }
    };

    return (
        <a-entity id="raksha-basic-room-1">

            {/* ========== AUDIO ASSETS ========== */}
            <a-assets>
                {/* Siapkan file suara penjelasan di public/assets/voice-caesar.mp3 */}
                <audio id="voice-explanation-audio" src="/assets/voice-caesar.mp3" preload="auto"></audio>
            </a-assets>

            {/* ========== LIGHTING ========== */}
            <a-light type="ambient" color="#cbd5e1" intensity="0.4"></a-light>
            <a-light type="point" color="#38bdf8" intensity="0.9" position="0 4.5 0" distance="15" decay="2"></a-light>
            <a-light type="point" color="#4ade80" intensity="0.5" position="-5 3 0" distance="8" decay="2"></a-light> {/* Lampu area lorong kiri */}
            <a-light type="point" color="#f87171" intensity="0.5" position="0 3 -6" distance="8" decay="2"></a-light> {/* Lampu area gerbang */}

            {/* ========== LANTAI & LANGIT-LANGIT ========== */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="16" height="16"
                material="src: #tex-dc-floor; repeat: 4 4; roughness: 0.6; metalness: 0.2"></a-plane>
            <a-plane position="0 5 0" rotation="90 0 0" width="16" height="16"
                material="src: #tex-dc-ceiling; repeat: 4 4; roughness: 0.8; side: double"></a-plane>

            {/* ================================================================
                STRUKTUR DINDING OKTAGON (8 Sisi — Radius ~7.5 meter)
                ================================================================ */}
            <OctagonWall position="0 0 -7.5" rotation="0 0 0" />          {/* Utara (Gerbang Keluar) */}
            <OctagonWall position="5.3 0 -5.3" rotation="0 -45 0" />      {/* Timur Laut */}
            <OctagonWall position="7.5 0 0" rotation="0 -90 0" />         {/* Timur */}
            <OctagonWall position="5.3 0 5.3" rotation="0 -135 0" />      {/* Tenggara */}
            <OctagonWall position="0 0 7.5" rotation="0 180 0" />         {/* Selatan (Tempat Spawn) */}
            <OctagonWall position="-5.3 0 5.3" rotation="0 135 0" />      {/* Barat Daya */}
            <OctagonWall position="-7.5 0 0" rotation="0 90 0" />         {/* Barat (Sayap Kiri) */}
            <OctagonWall position="-5.3 0 -5.3" rotation="0 45 0" />      {/* Barat Laut */}

            {/* ================================================================
                PENYEKAT RUANGAN / LORONG TENGAH (Sesuai Sketsa Tampak Atas)
                Membagi ruangan menjadi lorong tengah dan sayap kiri/kanan
                ================================================================ */}
            {/* Blok Server Kiri */}
            <ServerRack position="-2.5 0 -2" />
            <ServerRack position="-2.5 0 0" />
            <ServerRack position="-2.5 0 2" />
            
            {/* Blok Server Kanan */}
            <ServerRack position="2.5 0 -2" />
            <ServerRack position="2.5 0 0" />
            <ServerRack position="2.5 0 2" />

            {/* ================================================================
                AREA SAYAP KIRI: PAPAN CIPHERTEXT & TOMBOL SUARA
                ================================================================ */}
            <a-entity id="cipher-clue-area" position="-7.4 2 0" rotation="0 90 0">
                {/* Panel Background Hologram */}
                <a-plane width="4.5" height="2.5" color="#0f172a" opacity="0.9" border="2px solid #38bdf8"></a-plane>
                <a-plane position="0 0 -0.01" width="4.7" height="2.7" color="#0284c7" opacity="0.4"></a-plane>

                {/* Judul & Petunjuk */}
                <a-text value="[ TERMINAL ENKRIPSI DATA ]" position="0 0.9 0.05" align="center" color="#38bdf8" scale="0.6 0.6 0.6" font="mozillavr"></a-text>
                <a-text value="Teks berpotensi terenkripsi dengan Metode Caesar." position="0 0.5 0.05" align="center" color="#94a3b8" scale="0.38 0.38 0.38"></a-text>

                {/* CIPHERTEXT YANG HARUS DI-DECODE: VBDP */}
                <a-box position="0 0 0.05" width="3" height="0.7" depth="0.05" color="#1e293b">
                    <a-text value="V  B  D  P" align="center" position="0 0 0.03" color="#facc15" scale="1.2 1.2 1.2" font="mozillavr"></a-text>
                </a-box>

                <a-text value="Hint: Tarik mundur 7 langkah ke masa lalu untuk melihat kebenaran." position="0 -0.55 0.05" align="center" color="#4ade80" scale="0.38 0.38 0.38"></a-text>

                {/* Tombol Putar Suara Penjelasan */}
                <a-entity position="0 -0.95 0.05">
                    <a-box 
                        className="clickable"
                        width="2.6" height="0.4" depth="0.06"
                        color={isPlayingAudio ? "#15803d" : "#0284c7"}
                        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                        onClick={toggleAudioExplanation}
                    ></a-box>
                    <a-text 
                        value={isPlayingAudio ? "[] MEMUTAR SUARA PENJELASAN..." : "[>] PUTAR SUARA PENJELASAN"} 
                        align="center" position="0 0 0.04" color="#ffffff" scale="0.4 0.4 0.4" font="mozillavr"
                    ></a-text>
                </a-entity>
            </a-entity>

            {/* ================================================================
                AREA UTARA: GERBANG KELUAR & TERMINAL VIRTUAL KEYBOARD
                ================================================================ */}
            
            {/* 1. Pintu Gerbang Keluar */}
            <a-entity id="exit-gate" position="0 0 -7.4">
                <a-box class="solid" position="0 2 0" width="3.2" height="4" depth="0.2" color="#1e293b"></a-box>
                {/* Daun Pintu (Berubah warna jika terbuka) */}
                <a-plane position="0 2 0.11" width="2.8" height="3.8" 
                    color={isUnlocked ? "#15803d" : "#334155"}
                    material="roughness: 0.4; metalness: 0.6">
                </a-plane>
                <a-text 
                    value={isUnlocked ? "GERBANG TERBUKA\nAKSES DITERIMA" : "TERKUNCI\nBUTUH PLAIN TEXT"} 
                    position="0 2.5 0.15" align="center" 
                    color={isUnlocked ? "#ffffff" : "#f87171"} 
                    scale="0.7 0.7 0.7" font="mozillavr">
                </a-text>

                {/* Tombol Lanjut ke Room 2 (Hanya aktif jika sudah Unlock) */}
                {isUnlocked && (
                    <a-entity position="0 1.2 0.2">
                        <a-box 
                            className="clickable"
                            width="2.2" height="0.6" depth="0.1" color="#22c55e"
                            animation__pulse="property: scale; to: 1.08 1.08 1.08; dir: alternate; loop: true; dur: 800"
                            onClick={() => onCompleteRoom && onCompleteRoom('Raksha Basic Room 2')}
                        ></a-box>
                        <a-text value="MASUK KE ROOM 2 >>" align="center" position="0 0 0.06" color="#ffffff" scale="0.5 0.5 0.5" font="mozillavr"></a-text>
                    </a-entity>
                )}
            </a-entity>

            {/* 2. Meja Terminal & Keyboard 3D di Depan Gerbang */}
            <a-entity id="terminal-station" position="0 1 -5.2" rotation="0 0 0">
                {/* Meja Konsol Miring */}
                <a-box class="solid" position="0 -0.4 0" width="3.6" height="0.8" depth="1.2" color="#1e293b"></a-box>
                
                {/* Layar Monitor Terminal */}
                <a-entity position="0 0.8 -0.4" rotation="-15 0 0">
                    <a-plane width="3.4" height="1.2" color="#000000" border="2px solid #38bdf8"></a-plane>
                    
                    {/* Teks Status */}
                    <a-text value={statusMsg} position="0 0.35 0.02" align="center" color={statusColor} scale="0.38 0.38 0.38" font="mozillavr"></a-text>
                    
                    {/* Display Input Password */}
                    <a-box position="0 -0.1 0.02" width="2.2" height="0.5" depth="0.02" color="#0f172a">
                        <a-text 
                            value={inputCode || "_ _ _ _"} 
                            align="center" position="0 0 0.02" 
                            color="#38bdf8" scale="0.9 0.9 0.9" font="mozillavr">
                        </a-text>
                    </a-box>
                </a-entity>

                {/* Keyboard 3D Miring di Atas Meja */}
                <VirtualKeyboard3D 
                    position="0 0 0.2" 
                    rotation="-30 0 0" 
                    onKeyPress={handleKeyPress}
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                />
            </a-entity>

            {/* ================================================================
                POP-UP PANDUAN AWAL (PERHATIAN) — Sesuai Sketsa Tengah Atas
                ================================================================ */}
            {showGuide && (
                <a-entity id="guide-popup-room1" position="0 1.6 3" rotation="0 180 0">
                    {/* Backdrop Hitam Transparan */}
                    <a-box position="0 0 -0.06" width="4.6" height="3" depth="0.02"
                        material="color: #0f172a; roughness: 0.5; opacity: 0.95; transparent: true"></a-box>
                    <a-box position="0 0 -0.04" width="4.7" height="3.1" depth="0.01"
                        material="color: #38bdf8; emissive: #38bdf8; emissiveIntensity: 0.7; opacity: 0.8; transparent: true"></a-box>

                    {/* Judul Peringatan */}
                    <a-box position="0 1.1 0" width="2" height="0.4" depth="0.02" color="#0284c7"></a-box>
                    <a-text value="PERHATIAN" position="0 1.1 0.03" align="center" color="#ffffff" scale="0.6 0.6 0.6" font="mozillavr"></a-text>

                    {/* Isi Instruksi (Sesuai Teks Sketsa) */}
                    <a-text 
                        value="Carilah kode di tempat ini lalu pecahkan kode menjadi sebuah\nPlain Text agar bisa mengakses pintu keluar.\n\nHint: Teks cipher merupakan teks biasa (Plain Text) yang di\nkonversi menjadi teks berpola (Cipher text). Pada Level ini\nTeks Cipher diperoleh menggunakan Metode Caesar.\n\n(Tarik mundur 7 langkah pada abjad untuk memecahkan kodenya)" 
                        position="0 0.2 0" align="center" color="#e2e8f0" scale="0.4 0.4 0.4" line-height="60">
                    </a-text>

                    {/* Tombol Mengerti */}
                    <a-entity position="0 -1.1 0">
                        <a-box position="0 0 0" width="2" height="0.5" depth="0.06"
                            material="color: #0284c7; roughness: 0.4; emissive: #0369a1; emissiveIntensity: 0.6"
                            className="clickable"
                            animation__hover="property: material.emissiveIntensity; from: 0.6; to: 1.8; startEvents: mouseenter; dur: 200"
                            animation__leave="property: material.emissiveIntensity; from: 1.8; to: 0.6; startEvents: mouseleave; dur: 200"
                            onClick={() => {
                                setShowGuide(false);
                                // Opsional: Langsung putar suara saat pop-up ditutup
                                toggleAudioExplanation();
                            }}
                        ></a-box>
                        <a-text value="MENGERTI" position="0 0 0.05" align="center" color="#ffffff" scale="0.55 0.55 0.55" font="mozillavr"></a-text>
                    </a-entity>
                </a-entity>
            )}

        </a-entity>
    );
}