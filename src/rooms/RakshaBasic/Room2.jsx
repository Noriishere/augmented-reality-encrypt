import React, { useState, useEffect } from 'react';

/* ============================================================
   NPC COMPONENT — dialog ala gambar referensi
   ============================================================ */
function NPC({ position, rotation = "0 0 0", name, subtitle, dialog, texture, isCorrect, onChoice }) {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <a-entity position={position} rotation={rotation}>
            {/* NPC board */}
            <a-box class="solid" position="0 1.5 0" width="1.5" height="3" depth="0.1"
                color="#1e293b" material="roughness: 0.5; metalness: 0.3"></a-box>

            {/* NPC texture */}
            <a-plane position="0 1.5 0.06" width="1.4" height="2.9"
                material={`src: ${texture}; roughness: 0.6; side: front`}></a-plane>

            {/* Name tag */}
            <a-box position="0 -0.1 0.06" width="1.5" height="0.3" depth="0.05"
                color={isCorrect ? "#7c3aed" : "#475569"}></a-box>
            <a-text value={name} position="0 -0.1 0.1" align="center" color="#ffffff" scale="0.4 0.4 0.4" font="mozillavr"></a-text>

            {/* Click area untuk memunculkan pop-up */}
            <a-box className="clickable" position="0 1.5 0.2" width="1.5" height="3" depth="0.5"
                material="opacity: 0; transparent: true"
                onClick={() => setShowDialog(!showDialog)}></a-box>

            {/* Dialog popup */}
            {showDialog && (
                <a-entity position="0 1.6 1.8">
                    {/* Background Utama */}
                    <a-plane position="0 0 0" width="3.6" height="2.2"
                        material="color: #0f172a; roughness: 0.8; side: double"></a-plane>
                    {/* Border / Garis Tepi */}
                    <a-plane position="0 0 -0.01" width="3.66" height="2.26"
                        material="color: #38bdf8; roughness: 0.8; side: double"></a-plane>

                    {/* Header (Nama & Subtitle) */}
                    <a-text value={name.toUpperCase()} position="0 0.8 0.02" align="center" color="#38bdf8" scale="0.65 0.65 0.65" font="mozillavr"></a-text>
                    <a-text value={`"${subtitle}"`} position="0 0.55 0.02" align="center" color="#94a3b8" scale="0.35 0.35 0.35" font="mozillavr"></a-text>

                    {/* Teks Dialog Utama */}
                    <a-text value={dialog} position="0 0.05 0.02" align="center" color="#f8fafc" scale="0.45 0.45 0.45" width="3.2" wrap-count="38" font="mozillavr"></a-text>

                    {/* Barisan Tombol */}
                    <a-entity position="0 -0.75 0.02">
                        {/* Tombol Kiri: BATAL */}
                        <a-entity position="-0.85 0 0">
                            <a-box width="1.5" height="0.4" depth="0.05" color="#475569"
                                className="clickable"
                                animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
                                animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                                onClick={(e) => { e.stopPropagation(); setShowDialog(false); }}></a-box>
                            <a-text value="BATAL" position="0 0 0.03" align="center" color="#ffffff" scale="0.35 0.35 0.35" font="mozillavr"></a-text>
                        </a-entity>

                        {/* Tombol Kanan: BERI PASSWORD */}
                        <a-entity position="0.85 0 0">
                            <a-box width="1.5" height="0.4" depth="0.05" color="#10b981"
                                className="clickable"
                                animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
                                animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setShowDialog(false); // Tutup dialog ini
                                    onChoice(isCorrect, position, rotation); // Kirim koordinat ke Room2
                                }}></a-box>
                            <a-text value="BERI PASSWORD" position="0 0 0.03" align="center" color="#ffffff" scale="0.28 0.28 0.28" font="mozillavr"></a-text>
                        </a-entity>
                    </a-entity>
                </a-entity>
            )}
        </a-entity>
    );
}

/* ============================================================
   HIJACKED POPUP
   ============================================================ */
function HijackedPopup({ position, rotation, onRestart }) {
    return (
        <a-entity position={position} rotation={rotation}>
            <a-entity id="hijacked-popup" position="0 1.6 1.8">
                <a-plane position="0 0 -0.02" width="3.4" height="2.2"
                    material="color: #ffffff; roughness: 0.9; side: double"></a-plane>
                <a-plane position="0 0 -0.03" width="3.48" height="2.28"
                    material="color: #dc2626; roughness: 0.9; side: double"></a-plane>
                
                <a-text value="HIJACKED" position="0 0.6 0.01" align="center" color="#dc2626" scale="0.8 0.8 0.8" font="mozillavr"></a-text>
                <a-text value="Kamu salah memberikan seseorang password" position="0 0.1 0.01" align="center" color="#333" scale="0.28 0.28 0.28" font="mozillavr"></a-text>
                <a-text value="dan akun kamu diambil alih olehnya!" position="0 -0.15 0.01" align="center" color="#333" scale="0.28 0.28 0.28" font="mozillavr"></a-text>
                
                <a-entity position="0 -0.7 0.01">
                    <a-box width="1.8" height="0.45" depth="0.02" color="#dc2626"
                        className="clickable"
                        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                        onClick={onRestart}></a-box>
                    <a-text value="COBA LAGI" position="0 0 0.02" align="center" color="#ffffff" scale="0.35 0.35 0.35" font="mozillavr"></a-text>
                </a-entity>
            </a-entity>
        </a-entity>
    );
}

/* ============================================================
   SUCCESS POPUP
   ============================================================ */
function SuccessPopup({ position, rotation, onMainMenu }) {
    return (
        <a-entity position={position} rotation={rotation}>
            <a-entity id="success-popup" position="0 1.6 1.8">
                <a-plane position="0 0 -0.02" width="3.6" height="2.6"
                    material="color: #f0fdf4; roughness: 0.9; side: double"></a-plane>
                <a-plane position="0 0 -0.03" width="3.68" height="2.68"
                    material="color: #16a34a; roughness: 0.9; side: double"></a-plane>
                
                <a-text value="SELAMAT!" position="0 0.8 0.01" align="center" color="#16a34a" scale="0.8 0.8 0.8" font="mozillavr"></a-text>
                <a-text value="Kamu berhasil memilih" position="0 0.4 0.01" align="center" color="#333" scale="0.3 0.3 0.3" font="mozillavr"></a-text>
                <a-text value="orang yang tepat!" position="0 0.1 0.01" align="center" color="#333" scale="0.3 0.3 0.3" font="mozillavr"></a-text>
                
                <a-text value="Orang Tua akan menjaga" position="0 -0.3 0.01" align="center" color="#555" scale="0.25 0.25 0.25" font="mozillavr"></a-text>
                <a-text value="data dan sandimu dengan aman." position="0 -0.5 0.01" align="center" color="#555" scale="0.25 0.25 0.25" font="mozillavr"></a-text>
                
                <a-text value="Jangan pernah bagikan sandi" position="0 -0.8 0.01" align="center" color="#ca8a04" scale="0.22 0.22 0.22" font="mozillavr"></a-text>
                <a-text value="kepada orang yang tidak dikenal!" position="0 -1.0 0.01" align="center" color="#ca8a04" scale="0.22 0.22 0.22" font="mozillavr"></a-text>
                
                <a-entity position="0 -1.45 0.01">
                    <a-box width="2.4" height="0.5" depth="0.02" color="#16a34a"
                        className="clickable"
                        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                        onClick={onMainMenu}></a-box>
                    <a-text value="KEMBALI KE MENU" position="0 0 0.02" align="center" color="#ffffff" scale="0.35 0.35 0.35" font="mozillavr"></a-text>
                </a-entity>
            </a-entity>
        </a-entity>
    );
}

/* ============================================================
   SELF EXIT POPUP (HIDDEN ENDING)
   ============================================================ */
function SelfExitPopup({ position, rotation, onMainMenu }) {
    return (
        <a-entity position={position} rotation={rotation}>
            <a-entity id="self-exit-popup" position="0 2.0 2.6">
                <a-plane position="0 0 -0.02" width="4.0" height="2.6" material="color: #f8fafc; roughness: 0.9; side: double"></a-plane>
                <a-plane position="0 0 -0.03" width="4.08" height="2.68" material="color: #0ea5e9; roughness: 0.9; side: double"></a-plane>
                
                <a-text value="PILIHAN MANDIRI!" position="0 0.8 0.01" align="center" color="#0284c7" scale="0.8 0.8 0.8" font="mozillavr"></a-text>
                <a-text value="Selamat! Kamu memilih jalanmu sendiri." position="0 0.35 0.01" align="center" color="#333" scale="0.3 0.3 0.3" font="mozillavr"></a-text>
                
                <a-text value="Kamu tidak mudah percaya pada rayuan" position="0 -0.05 0.01" align="center" color="#555" scale="0.25 0.25 0.25" font="mozillavr"></a-text>
                <a-text value="maupun ancaman di dunia maya." position="0 -0.25 0.01" align="center" color="#555" scale="0.25 0.25 0.25" font="mozillavr"></a-text>
                
                <a-text value="Mengamankan data secara mandiri adalah" position="0 -0.65 0.01" align="center" color="#ca8a04" scale="0.22 0.22 0.22" font="mozillavr"></a-text>
                <a-text value="salah satu langkah privasi terbaik!" position="0 -0.85 0.01" align="center" color="#ca8a04" scale="0.22 0.22 0.22" font="mozillavr"></a-text>
                
                <a-entity position="0 -1.45 0.01">
                    <a-box width="2.4" height="0.45" depth="0.02" color="#0284c7" className="clickable" 
                        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                        onClick={onMainMenu}></a-box>
                    <a-text value="KEMBALI KE MENU" position="0 0 0.02" align="center" color="#ffffff" scale="0.35 0.35 0.35" font="mozillavr"></a-text>
                </a-entity>
            </a-entity>
        </a-entity>
    );
}

/* ============================================================
   NO PAPER POPUP (TIDAK BAWA KERTAS)
   ============================================================ */
function NoPaperPopup({ position, rotation, onBackToCorridor }) {
    return (
        <a-entity position={position} rotation={rotation}>
            <a-entity id="nopaper-popup" position="0 1.6 1.8">
                <a-plane position="0 0 -0.02" width="3.6" height="2.2" material="color: #fffbeb; roughness: 0.9; side: double"></a-plane>
                <a-plane position="0 0 -0.03" width="3.68" height="2.28" material="color: #f59e0b; roughness: 0.9; side: double"></a-plane>

                <a-text value="KERTAS TIDAK DITEMUKAN!" position="0 0.6 0.01" align="center" color="#d97706" scale="0.7 0.7 0.7" font="mozillavr"></a-text>
                <a-text value="Kamu belum memegang kertas sandi." position="0 0.1 0.01" align="center" color="#333" scale="0.28 0.28 0.28" font="mozillavr"></a-text>
                <a-text value="Kembali ke Koridor untuk mencarinya!" position="0 -0.15 0.01" align="center" color="#555" scale="0.25 0.25 0.25" font="mozillavr"></a-text>

                <a-entity position="0 -0.7 0.01">
                    <a-box width="2.2" height="0.45" depth="0.02" color="#f59e0b" className="clickable"
                        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                        onClick={onBackToCorridor}></a-box>
                    <a-text value="KEMBALI KE KORIDOR" position="0 0 0.02" align="center" color="#ffffff" scale="0.3 0.3 0.3" font="mozillavr"></a-text>
                </a-entity>
            </a-entity>
        </a-entity>
    );
}

/* ============================================================
   ROOM 2
   ============================================================ */
// INFO PENTING:
// Pastikan dari App.jsx Anda mengirimkan prop hasPaper={true} jika pemain sudah mengambil kertas di Koridor.
// Jika prop ini bernilai false, pemain tidak akan bisa menyelesaikan Room 2.
export default function Room2({ onBackToCorridor, onBackToMainMenu, hasPaper = false }) {
    const [popupState, setPopupState] = useState({
        type: null, // 'hijacked', 'success', 'self-exit', 'nopaper', atau null
        position: "0 0 0",
        rotation: "0 0 0"
    });

    // Event listener penangkap event "room2-self-exit-success" dari App.jsx
    useEffect(() => {
        const handleSelfExit = () => {
            setPopupState({
                type: 'self-exit',
                position: "0 0 -19.5", // Koordinat pintu keluar mandiri
                rotation: "0 0 0"
            });
        };
        window.addEventListener('room2-self-exit-success', handleSelfExit);
        return () => window.removeEventListener('room2-self-exit-success', handleSelfExit);
    }, []);

    // Kertas tetap dipegang di tangan kiri (HANYA DITAMPILKAN JIKA HASPAPER = TRUE)
    useEffect(() => {
        const camera = document.querySelector('a-camera');
        if (!camera) return;
        
        let heldEl = document.getElementById('held-paper-entity');
        
        if (!hasPaper) {
            if (heldEl) heldEl.remove();
            return;
        }

        if (!heldEl) {
            heldEl = document.createElement('a-entity');
            heldEl.setAttribute('id', 'held-paper-entity');
            camera.appendChild(heldEl);
        }
        
        heldEl.innerHTML = `
            <a-entity position="-0.4 -0.3 -0.5" rotation="-15 20 0">
                <a-plane width="0.3" height="0.4"
                    material="src: #tex-paper-note; roughness: 0.8; side: double"></a-plane>
                <a-text value="RAHASIA:" position="0 0.12 0.01" align="center" color="#333" scale="0.08 0.08 0.08" font="mozillavr"></a-text>
                <a-text value="Kode: ouwo" position="0 0.02 0.01" align="center" color="#c00" scale="0.1 0.1 0.1" font="mozillavr"></a-text>
            </a-entity>
        `;

        // Fitur Cleanup: Menghapus kertas saat pindah ruangan
        return () => {
            if (heldEl && heldEl.parentNode) {
                heldEl.parentNode.removeChild(heldEl);
            }
        };
    }, [hasPaper]); // Hook ini merespons nilai hasPaper

    const handleChoice = (isCorrect, pos, rot) => {
        // Cek dulu apakah player membawa kertas!
        if (!hasPaper) {
            setPopupState({
                type: 'nopaper',
                position: pos,
                rotation: rot
            });
            return;
        }

        // Jika bawa kertas, lanjutkan eksekusi
        setPopupState({
            type: isCorrect ? 'success' : 'hijacked',
            position: pos,
            rotation: rot
        });
    };

    return (
        <a-entity id="raksha-basic-room2">
            {/* Pencahayaan */}
            <a-light type="ambient" color="#b0b8c4" intensity="0.35"></a-light>
            <a-light type="point" color="#e0e4ec" intensity="0.5" position="0 4.5 0" distance="20" decay="2"></a-light>
            <a-light type="point" color="#e0e4ec" intensity="0.3" position="-5 4 -8" distance="15" decay="2"></a-light>
            <a-light type="point" color="#e0e4ec" intensity="0.3" position="5 4 -8" distance="15" decay="2"></a-light>

            {/* Lantai & Dinding Utama */}
            <a-cylinder position="0 0 -8" radius="12" height="0.15" segments-radial="16"
                material="src: #tex-office-floor; repeat: 6 6; roughness: 0.6"></a-cylinder>
            <a-cylinder position="0 2.5 -8" radius="12" height="5" segments-radial="16"
                side="back" open-ended="true" material="src: #tex-office-wall-inner-hd; repeat: 8 2; roughness: 0.75"></a-cylinder>
            <a-cylinder position="0 5 -8" radius="12" height="0.15" segments-radial="16"
                material="src: #tex-office-ceiling; repeat: 6 6; roughness: 0.9"></a-cylinder>

            {/* Lorong Masuk */}
            <a-plane position="0 0 5" rotation="-90 0 0" width="4" height="6"
                material="src: #tex-office-floor; repeat: 2 2; roughness: 0.6"></a-plane>
            <a-box class="solid" position="-2 2.5 5" width="0.2" height="5" depth="6"
                material="src: #tex-office-wall-inner-hd; roughness: 0.75"></a-box>
            <a-box class="solid" position="2 2.5 5" width="0.2" height="5" depth="6"
                material="src: #tex-office-wall-inner-hd; roughness: 0.75"></a-box>
            <a-box class="solid" position="0 4.9 5" width="4" height="0.2" depth="6"
                material="src: #tex-office-ceiling; roughness: 0.9"></a-box>

            {/* ========== 4 NPC ========== */}
            <NPC position="-6 0 -3" rotation="0 30 0"
                name="Teman Mabar" subtitle="Menawarkan top-up item game jika diberi sandi"
                dialog="Hei kamu mau ku top up in game gak? Sesekali kita kan temen jadi aku mau top up in kamu, kamu mau kan? tapi berikan password akunmu yaa supaya aku bisa langsung top up in kamu."
                texture="#npc-teman" isCorrect={false} onChoice={handleChoice} />

            <NPC position="6 0 -3" rotation="0 -30 0"
                name="Sahabat" subtitle="Meminta sandi dengan alasan bukti persahabatan"
                dialog="Kita kan udah lama sahabatan, kamu gaada niatan buat tukeran akun gitu? Kita kan sahabat selamanya, masa kamu gamau tuker rahasia?"
                texture="#npc-sahabat" isCorrect={false} onChoice={handleChoice} />

            <NPC position="-6 0 -13" rotation="0 45 0"
                name="Admin Palsu" subtitle="Menakut-nakuti dan mengancam akan memblokir akun"
                dialog="PERINGATAN KEAMANAN! Kami dari Tim Admin Pusat mendeteksi adanya aktivitas login ilegal di akunmu. Segera serahkan kata sandimu sekarang juga untuk proses verifikasi. Jika menolak, akun ini akan diblokir permanen!"
                texture="#npc-admin" isCorrect={false} onChoice={handleChoice} />

            <NPC position="6 0 -13" rotation="0 -45 0"
                name="Orang Tua" subtitle="Satu-satunya pilihan yang benar"
                dialog="Nak, ruangan ini penuh dengan orang-orang yang mencurigakan dan ingin mencuri datamu. Sini, titipkan kata sandimu ke Ayah/Ibu biar aman. Kami yang akan menjaganya untukmu dari para peretas itu."
                texture="#npc-ortu" isCorrect={true} onChoice={handleChoice} />

            {/* Instruksi Tengah Ruangan */}
            <a-entity position="0 3.5 -8">
                <a-text value="PILIH YANG TERPERCAYA" position="0 0 0" align="center" color="#facc15" scale="0.9 0.9 0.9" font="mozillavr"></a-text>
                <a-text value="Klik salah satu sosok untuk berbicara" position="0 -0.5 0" align="center" color="#94a3b8" scale="0.4 0.4 0.4"></a-text>
            </a-entity>

            {/* ========== PINTU KEMBALI KE KORIDOR (Z=7.5) ========== */}
            <a-entity position="0 0 7.5">
                <a-box class="solid" position="0 2 0" width="4.2" height="4" depth="0.3" color="#e8ecf0" material="roughness: 0.5"></a-box>
                <a-plane position="0 1.5 0.16" width="3.8" height="3.2"
                    material="src: #tex-office-roller; roughness: 0.5"></a-plane>
                <a-text value="KEMBALI KE KORIDOR" position="0 3.55 0.2" align="center" color="#4ade80" scale="0.7 0.7 0.7" font="mozillavr"></a-text>
                <a-box className="clickable" position="0 1.5 0.2" width="3.8" height="3.2" depth="0.5"
                    material="opacity: 0; transparent: true"
                    onClick={onBackToCorridor}></a-box>
            </a-entity>

            {/* ========== GERBANG KELUAR MANDIRI (Z=-19.5) ========== */}
            <a-entity id="self-exit-gate" position="0 0 -19.5">
                <a-box class="solid" position="0 2 0" width="4.8" height="4" depth="0.4" color="#e8ecf0" material="roughness: 0.5"></a-box>
                <a-plane position="0 1.5 0.21" width="4" height="3.2"
                    material="src: #tex-office-roller; roughness: 0.5"></a-plane>
                <a-box position="0 3.5 0.22" width="4" height="0.8" depth="0.05" color="#166534"
                    material="emissive: #14532d; emissiveIntensity: 0.6"></a-box>
                
                <a-text value="GERBANG KELUAR" position="0 3.6 0.25" align="center" color="#4ade80" scale="1 1 1" font="mozillavr"></a-text>
                <a-text value="STATUS: TERKUNCI (Butuh Kode)" position="0 3.3 0.25" align="center" color="#bbf7d0" scale="0.35 0.35 0.35"></a-text>

                {/* Keypad stand */}
                <a-cylinder class="solid" position="0 0.5 1.7" radius="0.18" height="1.2" color="#1e293b"></a-cylinder>

                {/* Keypad panel */}
                <a-entity position="0 1.2 1.8" rotation="-20 0 0">
                    <a-box width="1.5" height="0.9" depth="0.12" color="#020617"></a-box>
                    <a-text value="KELUAR MANDIRI" position="0 0.30 0.07" align="center" color="#38bdf8" scale="0.32 0.32 0.32"></a-text>
                    <a-text value="Masukkan Kode Anda" position="0 0.16 0.07" align="center" color="#94a3b8" scale="0.27 0.27 0.27"></a-text>
                    <a-entity position="0 -0.18 0.07">
                        <a-box width="1.1" height="0.28" depth="0.06" color="#0284c7" className="clickable"
                            animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                            animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                            onClick={() => {
                                // Cek kepemilikan kertas sebelum memunculkan keyboard
                                if (!hasPaper) {
                                    setPopupState({
                                        type: 'nopaper',
                                        position: "0 0 -17.5", // Muncul di depan gerbang
                                        rotation: "0 0 0"
                                    });
                                } else {
                                    window.dispatchEvent(new CustomEvent('open-keyboard', { 
                                        detail: { 
                                            context: 'room2-self-exit',
                                            position: '0 1.4 -17.5', 
                                            rotation: '-10 0 0' 
                                        } 
                                    }));
                                }
                            }}></a-box>
                        <a-text value="BUKA KEYBOARD" position="0 0 0.04" align="center" color="#ffffff" scale="0.38 0.38 0.38" font="mozillavr"></a-text>
                    </a-entity>
                </a-entity>
            </a-entity>

            {/* ========== POPUPS DINAMIS ========== */}
            {popupState.type === 'nopaper' && (
                <NoPaperPopup 
                    position={popupState.position} 
                    rotation={popupState.rotation} 
                    onBackToCorridor={onBackToCorridor} 
                />
            )}

            {popupState.type === 'hijacked' && (
                <HijackedPopup 
                    position={popupState.position} 
                    rotation={popupState.rotation} 
                    onRestart={() => { 
                        setPopupState({ type: null, position: "0 0 0", rotation: "0 0 0" }); 
                        onBackToCorridor(); 
                    }} 
                />
            )}
            
            {popupState.type === 'success' && (
                <SuccessPopup 
                    position={popupState.position} 
                    rotation={popupState.rotation} 
                    onMainMenu={onBackToMainMenu} 
                />
            )}

            {popupState.type === 'self-exit' && (
                <SelfExitPopup 
                    position={popupState.position} 
                    rotation={popupState.rotation} 
                    onMainMenu={onBackToMainMenu} 
                />
            )}
        </a-entity>
    );
}