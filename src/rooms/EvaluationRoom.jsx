import React, { useEffect } from 'react';
import { getRoomEvaluation } from '../rooms/roomEvaluations';

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

        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.emit('refresh-solids');
        }
    }, []);

    const statusMessage = isPerfect
        ? evalData.perfectMessage
        : evalData.imperfectMessage(mistakes);

    const accent = isPerfect ? "#10b981" : "#f59e0b";

    const TVFrame = ({ position, width, height, children }) => (
        <a-entity position={position}>
            <a-box position="0 0 -0.05" width={width + 0.2} height={height + 0.2} depth="0.08"
                color="#1e293b" material="roughness: 0.5; metalness: 0.5"></a-box>

            <a-box position="0 0 0.005" width={width + 0.05} height={height + 0.05} depth="0.01"
                material={`color: ${accent}; emissive: ${accent}; emissiveIntensity: 1; opacity: 0.85; transparent: true`}></a-box>

            <a-box position="0 0 0.02" width={width} height={height} depth="0.02"
                material="color: #0a0f1a; roughness: 0.4; opacity: 0.97; transparent: true"></a-box>

            {[[-1, 1, 1, 1], [1, 1, -1, 1], [-1, -1, 1, -1], [1, -1, -1, -1]].map(([sx, sy, dx, dy], i) => (
                <a-entity key={`tick-${i}`} position={`${sx * (width / 2 - 0.25)} ${sy * (height / 2 - 0.25)} 0.03`}>
                    <a-box position={`${dx * 0.09} 0 0`} width="0.18" height="0.02" depth="0.005"
                        material="color: #22d3ee; emissive: #22d3ee; emissiveIntensity: 1"></a-box>
                    <a-box position={`0 ${dy * 0.09} 0`} width="0.02" height="0.18" depth="0.005"
                        material="color: #22d3ee; emissive: #22d3ee; emissiveIntensity: 1"></a-box>
                </a-entity>
            ))}

            <a-sphere position={`${width / 2 - 0.15} ${height / 2 - 0.15} 0.05`} radius="0.025"
                material={`color: ${accent}; emissive: ${accent}; emissiveIntensity: 3`}
                animation="property: material.emissiveIntensity; from: 1; to: 4; dir: alternate; loop: true; dur: 600">
            </a-sphere>

            {children}
        </a-entity>
    );

    return (
        <a-entity id="evaluation-room">
            <a-sky color="#020617"></a-sky>
            <a-light type="ambient" color="#1e293b" intensity="0.55"></a-light>
            <a-light type="point" color={accent} intensity="0.9" position="0 3 -4"></a-light>
            <a-light type="point" color="#0ea5e9" intensity="0.35" position="0 2 2"></a-light>

            <a-plane position="0 0 0" rotation="-90 0 0" width="11" height="10"
                material="color: #0b1220; roughness: 0.85; metalness: 0.15"></a-plane>

            <a-plane position="0 2.5 -5" width="11" height="5" className="solid"
                material="color: #0f172a; roughness: 0.9"></a-plane>

            <a-plane position="0 2.5 5" rotation="0 180 0" width="11" height="5" className="solid"
                material="color: #0f172a; roughness: 0.9"></a-plane>

            <a-plane position="-5.5 2.5 0" rotation="0 90 0" width="10" height="5" className="solid"
                material="color: #0c1524; roughness: 0.9"></a-plane>

            <a-plane position="5.5 2.5 0" rotation="0 -90 0" width="10" height="5" className="solid"
                material="color: #0c1524; roughness: 0.9"></a-plane>

            <a-box position="0 0.015 -5" width="11" height="0.03" depth="0.03"
                material={`color: ${accent}; emissive: ${accent}; emissiveIntensity: 1`}></a-box>

            <TVFrame position="-2.6 2.4 -4.88" width={4.8} height={3.2}>
                <a-text value="LOG SISTEM // LAPORAN EVALUASI" position="0 1.3 0.04" align="center"
                    color="#5a7a8a" scale="0.35 0.35 0.35" font="mozillavr"></a-text>

                <a-text value="[ LAPORAN EVALUASI KADET ]" position="0 1.0 0.035" align="center"
                    color={accent} scale="0.6 0.6 0.6" font="mozillavr"></a-text>

                <a-text value={evalData.roomLabel} position="0 0.6 0.04" align="center"
                    color="#94a3b8" scale="0.3 0.3 0.3" width="4.4" wrap-count="38" font="mozillavr"></a-text>

                <a-box position="0 0.3 0.03" width="4.2" height="0.012" depth="0.005"
                    material={`color: ${accent}; emissive: ${accent}; emissiveIntensity: 1`}></a-box>

                <a-text value={isPerfect ? "STATUS: SEMPURNA" : `STATUS: SELESAI — ${mistakes} KESALAHAN`}
                    position="0 -0.1 0.04" align="center"
                    color={accent} scale="0.4 0.4 0.4" font="mozillavr"></a-text>

                <a-text value={statusMessage} position="0 -0.7 0.04" align="center"
                    color="#e2e8f0" scale="0.32 0.32 0.32" width="4.4" wrap-count="35" font="mozillavr"></a-text>
            </TVFrame>

            <TVFrame position="2.6 2.4 -4.88" width={4.8} height={3.2}>
                <a-text value="[ APA YANG SUDAH KAMU PELAJARI ]" position="0 1.25 0.035" align="center"
                    color="#38bdf8" scale="0.70 0.70 0.70" font="mozillavr"></a-text>

                <a-text value={evalData.topic} position="0 0.95 0.04" align="center"
                    color="#94a3b8" scale="0.70 0.70 0.70" font="mozillavr"></a-text>

                <a-text value={evalData.objective} position="0 0.6 0.04" align="center"
                    color="#f1f5f9" scale="0.60 0.60 0.60" width="4.4" wrap-count="42" font="mozillavr"></a-text>

                {evalData.lessons.map((lesson, i) => (
                    <a-text key={i} value={`• ${lesson}`}
                        position={`-2.1 ${0.1 - i * 0.45} 0.04`}
                        align="left" color="#cbd5e1" scale="0.60 0.60 0.60"
                        width="4.4" wrap-count="45" font="mozillavr"></a-text>
                ))}
            </TVFrame>

            <a-entity position="0 0 1.4">
                <a-box position="0 0.5 0" width="1.4" height="1" depth="0.6"
                    color="#111827" material="roughness: 0.5; metalness: 0.4"></a-box>

                <a-box position="0 1.02 0" width="1.3" height="0.04" depth="0.5"
                    material={`color: ${accent}; emissive: ${accent}; emissiveIntensity: 0.8`}></a-box>

                <a-box position="0 0.75 0.31" width="1.1" height="0.35" depth="0.05"
                    color={isPerfect ? "#059669" : "#d97706"} className="clickable"
                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                    onClick={onBackToLobby}></a-box>

                <a-text value="KEMBALI KE LOBBY" position="0 0.75 0.34" align="center"
                    color="#ffffff" scale="0.35 0.35 0.35" font="mozillavr"></a-text>
            </a-entity>
        </a-entity>
    );
}