import React, { useEffect } from 'react';
import { getRoomEvaluation } from '../data/roomEvaluations';

// roomKey WAJIB diisi dari pemanggil, contoh: 'basic-room1', 'basic-room2', 'expert-room1'
export default function EvaluationRoom({ mistakes, onBackToLobby, roomKey }) {
    const isPerfect = mistakes === 0;
    const evalData = getRoomEvaluation(roomKey);

    useEffect(() => {
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

    const statusMessage = isPerfect
        ? evalData.perfectMessage
        : evalData.imperfectMessage(mistakes);

    return (
        <a-entity id="evaluation-room">
            <a-sky color="#020617"></a-sky>
            <a-light type="ambient" color="#1e293b" intensity="0.5"></a-light>
            <a-light type="point" color={isPerfect ? "#10b981" : "#eab308"} intensity="0.8" position="0 2 0"></a-light>

            {/* ===== PANEL 1 — STATUS EVALUASI (berbasis kesalahan) ===== */}
            <a-entity position="0 2.1 0">
                <a-plane position="0 0 -3" width="5.5" height="2.9" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="5.6" height="3" depth="0.01"
                        color={isPerfect ? "#10b981" : "#f59e0b"}></a-box>

                    <a-text value="[ LAPORAN EVALUASI KADET ]" position="0 1.1 0.02" align="center"
                        color={isPerfect ? "#34d399" : "#fbbf24"} scale="0.65 0.65 0.65" font="mozillavr"></a-text>
                    <a-text value={evalData.roomLabel} position="0 0.78 0.02" align="center"
                        color="#94a3b8" scale="0.28 0.28 0.28" font="mozillavr" width="5" wrap-count="50"></a-text>

                    <a-text value={isPerfect ? "STATUS: SEMPURNA" : `STATUS: SELESAI — ${mistakes} KESALAHAN`}
                        position="0 0.42 0.02" align="center"
                        color={isPerfect ? "#34d399" : "#fbbf24"} scale="0.34 0.34 0.34" font="mozillavr"></a-text>

                    <a-text value={statusMessage} position="0 -0.3 0.02" align="center"
                        color="#e2e8f0" scale="0.34 0.34 0.34" width="4.8" wrap-count="48" font="mozillavr"></a-text>
                </a-plane>
            </a-entity>

            {/* ===== PANEL 2 — APA YANG SUDAH KAMU PELAJARI ===== */}
            <a-entity position="0 -0.6 0">
                <a-plane position="0 0 -3" width="5.5" height="2.7" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="5.6" height="2.8" depth="0.01" color="#0ea5e9"></a-box>

                    <a-text value="[ APA YANG SUDAH KAMU PELAJARI ]" position="0 1.05 0.02" align="center"
                        color="#38bdf8" scale="0.38 0.38 0.38" font="mozillavr"></a-text>
                    <a-text value={evalData.topic} position="0 0.78 0.02" align="center"
                        color="#94a3b8" scale="0.26 0.26 0.26" font="mozillavr"></a-text>

                    <a-text value={evalData.objective} position="0 0.5 0.02" align="center"
                        color="#f1f5f9" scale="0.27 0.27 0.27" width="4.8" wrap-count="52" font="mozillavr"></a-text>

                    {evalData.lessons.map((lesson, i) => (
                        <a-text key={i} value={`• ${lesson}`}
                            position={`-2.55 ${0.05 - i * 0.4} 0.02`}
                            align="left" color="#cbd5e1" scale="0.23 0.23 0.23"
                            width="4.6" wrap-count="60" font="mozillavr"></a-text>
                    ))}
                </a-plane>
            </a-entity>

            {/* Tombol kembali */}
            <a-entity position="0 -2.6 -3">
                <a-box width="2.5" height="0.4" depth="0.05" color={isPerfect ? "#059669" : "#d97706"} className="clickable"
                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                    onClick={onBackToLobby}></a-box>
                <a-text value="KEMBALI KE LOBBY" position="0 0 0.03" align="center" color="#ffffff" scale="0.4 0.4 0.4" font="mozillavr"></a-text>
            </a-entity>
        </a-entity>
    );
}