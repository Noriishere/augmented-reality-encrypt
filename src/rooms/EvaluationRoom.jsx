import React, { useEffect } from 'react';

export default function EvaluationRoom({ mistakes, onBackToLobby, roomName }) {
    const isPerfect = mistakes === 0;

    useEffect(() => {
        // Posisikan pemain tepat di depan layar hologram
        const rig = document.getElementById('rig');
        if (rig) {
            rig.setAttribute('position', '0 0 4');
            rig.setAttribute('rotation', '0 0 0');
            const camera = rig.querySelector('a-camera');
            if (camera && camera.components['look-controls']) {
                camera.components['look-controls'].yawObject.rotation.y = 0;
                camera.components['look-controls'].pitchObject.rotation.x = 0;
            }
        }
    }, []);

    return (
        <a-entity id="evaluation-room">
            {/* Lingkungan gelap agar fokus ke hologram */}
            <a-sky color="#020617"></a-sky>
            <a-light type="ambient" color="#1e293b" intensity="0.5"></a-light>
            <a-light type="point" color={isPerfect ? "#10b981" : "#eab308"} intensity="0.8" position="0 2 0"></a-light>

            {/* HOLOGRAM EVALUASI */}
            <a-entity position="0 1.6 0">
                <a-plane position="0 0 -3" width="5.5" height="3.5" color="#0f172a" material="opacity: 0.95">
                    {/* Border Hologram */}
                    <a-box position="0 0 -0.01" width="5.6" height="3.6" depth="0.01" color={isPerfect ? "#10b981" : "#f59e0b"}></a-box>

                    <a-text value="[ LAPORAN EVALUASI KADET ]" position="0 1.3 0.02" align="center" color={isPerfect ? "#34d399" : "#fbbf24"} scale="0.8 0.8 0.8" font="mozillavr"></a-text>
                    <a-text value={`SIMULASI: ${roomName}`} position="0 0.9 0.02" align="center" color="#94a3b8" scale="0.4 0.4 0.4" font="mozillavr"></a-text>

                    {isPerfect ? (
                        <a-text 
                            value="NILAI: SEMPURNA!\n\nKamu berhasil mengamankan sistem tanpa satu pun celah kesalahan. Menjaga kerahasiaan sandi dan tidak gegabah mengklik tautan adalah kunci utama pertahanan siber di dunia nyata. Pertahankan kerja bagusmu!" 
                            position="0 0.1 0.02" align="center" color="#e2e8f0" scale="0.4 0.4 0.4" width="4.8" wrap-count="45" font="mozillavr">
                        </a-text>
                    ) : (
                        <a-text 
                            value={`TERDETEKSI: ${mistakes} KESALAHAN\n\nKamu berhasil selamat, namun sistem mencatat ada kecerobohan operasional (seperti salah memasukkan sandi atau sempat mengklik tautan Phishing).\n\nDi dunia nyata, peretas memanfaatkan kesalahan kecil ini untuk membobol datamu. Evaluasi tindakanmu dan tingkatkan kewaspadaan!`} 
                            position="0 0.1 0.02" align="center" color="#e2e8f0" scale="0.4 0.4 0.4" width="4.8" wrap-count="48" font="mozillavr">
                        </a-text>
                    )}

                    {/* Tombol Selesai */}
                    <a-entity position="0 -1.1 0.02">
                        <a-box width="2.5" height="0.4" depth="0.05" color={isPerfect ? "#059669" : "#d97706"} className="clickable"
                            animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                            animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                            onClick={onBackToLobby}></a-box>
                        <a-text value="KEMBALI KE LOBBY" position="0 0 0.03" align="center" color="#ffffff" scale="0.4 0.4 0.4" font="mozillavr"></a-text>
                    </a-entity>
                </a-plane>
            </a-entity>
        </a-entity>
    );
}