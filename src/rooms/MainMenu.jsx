import React, { useState, useRef, useEffect } from 'react';
/* ============================================================
   Komponen Server Rack — dari box + texture dc_rack_face.png
   ============================================================ */
function ServerRack({ position, rotation = "0 0 0" }) {
    return (
        <a-entity position={position} rotation={rotation}>
            {/* Cukup tambahkan className="solid" pada boks utamanya */}
            <a-box class="solid" position="0 1.4 0" width="0.9" height="2.8" depth="0.65"
                color="#1a1e24" material="roughness: 0.3; metalness: 0.7"></a-box>
            {/* Front panel texture */}
            <a-plane position="0 1.4 0.33" width="0.8" height="2.7"
                material="src: #tex-dc-rack-hd; roughness: 0.4; metalness: 0.3"></a-plane>
            {/* Samping kiri */}
            <a-plane position="-0.46 1.4 0" rotation="0 -90 0" width="0.65" height="2.7"
                color="#1a1e24" material="roughness: 0.4; metalness: 0.6"></a-plane>
            {/* Samping kanan */}
            <a-plane position="0.46 1.4 0" rotation="0 90 0" width="0.65" height="2.7"
                color="#1a1e24" material="roughness: 0.4; metalness: 0.6"></a-plane>
            {/* Atas */}
            <a-plane position="0 2.81 0" rotation="-90 0 0" width="0.9" height="0.65"
                color="#22262c" material="roughness: 0.4; metalness: 0.5"></a-plane>
        </a-entity>
    );
}

/* ============================================================
   Komponen Keypad Panel
   ============================================================ */
function KeypadPanel({ position, rotation = "0 0 0", onClick }) {
    return (
        <a-entity position={position} rotation={rotation}>
            <a-box position="0 0 0" width="0.3" height="0.4" depth="0.08"
                color="#2a2e38" material="roughness: 0.4; metalness: 0.5"></a-box>
            <a-plane position="0 0 0.05" width="0.27" height="0.37"
                material="src: #tex-dc-keypad; roughness: 0.4; metalness: 0.3"></a-plane>
            <a-sphere position="0 -0.12 0.06" radius="0.018"
                material="color: #00ff44; emissive: #00ff44; emissiveIntensity: 3"></a-sphere>
            <a-box position="0 0 0.12" width="0.5" height="0.5" depth="0.4"
                material="opacity: 0; transparent: true"
                className="clickable"
                animation__hover="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; dur: 200"
                animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                onClick={onClick}
            ></a-box>
        </a-entity>
    );
}

function InfoBoard({ position, rotation = "0 0 0", isPlaying, videoSrc = "#vid-tutorial-kadet", onVideoEnded }) {
    const legend = [
        { color: "#22c55e", glow: "#0a5c28", label: "HIJAU", desc: "BASIC — Tingkat SD" },
        { color: "#eab308", glow: "#713f12", label: "KUNING", desc: "BEGINNER — Tingkat SMP" },
        { color: "#ef4444", glow: "#7f1d1d", label: "MERAH", desc: "EXPERT — Tingkat SMK" },
    ];

    const videoEntityRef = useRef(null);
    const [needsManualPlay, setNeedsManualPlay] = useState(false);

    const getVideoEl = () => videoEntityRef.current?.components?.material?.material?.map?.image;

    useEffect(() => {
        if (!isPlaying) {
            setNeedsManualPlay(false);
            return;
        }

        const el = videoEntityRef.current;
        if (!el) return;

        const attachEndedListener = () => {
            const videoEl = getVideoEl();
            if (videoEl) {
                videoEl.currentTime = 0;
                videoEl.play().catch(() => setNeedsManualPlay(true));
                videoEl.addEventListener('ended', () => {
                    if (onVideoEnded) onVideoEnded();
                }, { once: true });
            }
        };

        if (el.hasLoaded) {
            attachEndedListener();
        } else {
            el.addEventListener('loaded', attachEndedListener, { once: true });
        }
    }, [isPlaying]);

    const handleManualPlay = () => {
        const videoEl = getVideoEl();
        if (videoEl) {
            videoEl.play().then(() => setNeedsManualPlay(false)).catch(() => { });
        }
    };

    return (
        <a-entity position={position} rotation={rotation}>
            {/* Frame luar (mounting ke dinding) — tetap sama, jadi bezel monitor */}
            <a-box class="solid" position="0 1.5 -0.05" width="4.6" height="3.1" depth="0.08"
                color="#1e293b" material="roughness: 0.5; metalness: 0.5"></a-box>

            <a-box position="0 1.5 0.005" width="4.4" height="2.9" depth="0.01"
                material={`color: #38bdf8; emissive: #38bdf8; emissiveIntensity: ${isPlaying ? 1 : 0.6}; opacity: 0.85; transparent: true`}></a-box>

            <a-box position="0 1.5 0.02" width="4.2" height="2.7" depth="0.02"
                material="color: #0a0f1a; roughness: 0.4; opacity: 0.97; transparent: true"></a-box>

            {/* Corner ticks — tetap tampil di kedua mode */}
            {[[-2, 1.25, 1, 1], [2, 1.25, -1, 1], [-2, -1.25, 1, -1], [2, -1.25, -1, -1]].map(([x, y, dx, dy], i) => (
                <a-entity key={`tick-${i}`} position={`${x} ${1.5 + y} 0.03`}>
                    <a-box position={`${dx * 0.09} 0 0`} width="0.18" height="0.02" depth="0.005"
                        material="color: #22d3ee; emissive: #22d3ee; emissiveIntensity: 1"></a-box>
                    <a-box position={`0 ${dy * 0.09} 0`} width="0.02" height="0.18" depth="0.005"
                        material="color: #22d3ee; emissive: #22d3ee; emissiveIntensity: 1"></a-box>
                </a-entity>
            ))}

            {/* Status indicator — merah pulse pas playing, cyan pas idle */}
            <a-sphere position="1.95 1.25 0.05" radius="0.02"
                material={isPlaying
                    ? "color: #ef4444; emissive: #ef4444; emissiveIntensity: 3"
                    : "color: #22d3ee; emissive: #22d3ee; emissiveIntensity: 3"}
                animation={isPlaying ? "property: material.emissiveIntensity; from: 1; to: 4; dir: alternate; loop: true; dur: 500" : ""}
            ></a-sphere>

            {!isPlaying && (
                <a-entity>
                    <a-text value="LOG SISTEM // AKSES KADET" position="0 2.68 0.04" align="center"
                        color="#5a7a8a" scale="0.28 0.28 0.28" font="mozillavr"></a-text>

                    <a-text value="PETUNJUK KADET" position="0 2.4 0.035" align="center"
                        color="#0e7490" scale="0.82 0.82 0.82" font="mozillavr"></a-text>
                    <a-text value="PETUNJUK KADET" position="0 2.4 0.04" align="center"
                        color="#38bdf8" scale="0.8 0.8 0.8" font="mozillavr"></a-text>

                    <a-box position="0 2.15 0.03" width="3.6" height="0.015" depth="0.005"
                        material="color: #38bdf8; emissive: #38bdf8; emissiveIntensity: 1"></a-box>

                    <a-text value="Pilih pintu sesuai tingkat kesulitanmu:" position="0 1.9 0.03" align="center"
                        color="#a5d8e6" scale="0.38 0.38 0.38" font="mozillavr"></a-text>

                    {legend.map((item, i) => (
                        <a-entity key={`legend-${i}`} position={`0 ${1.55 - i * 0.42} 0.03`}>
                            <a-plane position="-1.7 0 0" width="0.22" height="0.22"
                                material={`color: ${item.color}; emissive: ${item.glow}; emissiveIntensity: 1.2`}></a-plane>
                            <a-text value={item.label} position="-1.3 0 0.01" align="left"
                                color={item.color} scale="0.4 0.4 0.4" font="mozillavr"></a-text>
                            <a-text value={item.desc} position="-0.55 0 0.01" align="left"
                                color="#cbd5e1" scale="0.34 0.34 0.34" font="mozillavr"></a-text>
                        </a-entity>
                    ))}

                    <a-box position="0 -0.1 0.03" width="3.6" height="0.015" depth="0.005"
                        material="color: #38bdf8; emissive: #38bdf8; emissiveIntensity: 0.5"></a-box>

                    <a-text value="Sentuh KEYPAD di samping pintu → selesaikan misi keamanan data!"
                        position="0 -0.35 0.03" align="center" color="#94a3b8" scale="0.3 0.3 0.3"
                        width="3.8" font="mozillavr"></a-text>
                </a-entity>
            )}

            {isPlaying && (
                <a-entity>
                    <a-text value="TRANSMISI VIDEO // MISI 01" position="0 2.68 0.04" align="center"
                        color="#5a7a8a" scale="0.26 0.26 0.26" font="mozillavr"></a-text>

                    <a-video ref={videoEntityRef} src={videoSrc}
                        position="0 1.42 0.03" width="4" height="2.25"></a-video>

                    {needsManualPlay && (
                        <a-box position="0 1.42 0.06" width="4" height="2.25" depth="0.01"
                            material="color: #000000; opacity: 0.55; transparent: true"
                            className="clickable"
                            onClick={handleManualPlay}
                        >
                            <a-text value="TAP UNTUK PUTAR VIDEO" position="0 0 0.02" align="center"
                                color="#38bdf8" scale="0.35 0.35 0.35" font="mozillavr"></a-text>
                        </a-box>
                    )}
                </a-entity>
            )}
        </a-entity>
    );
}

function WelcomeGuidePopup({ position = "0 1.6 -2.5", onDismiss }) {
    const corners = [
        [-2.05, 1.35, 1, 1],
        [2.05, 1.35, -1, 1],
        [-2.05, -1.35, 1, -1],
        [2.05, -1.35, -1, -1],
    ];

    return (
        <a-entity id="guide-popup" position={position}>
            {/* Card belakang */}
            <a-box position="0 0 -0.06" width="4.2" height="2.8" depth="0.02"
                material="color: #0a0f1a; roughness: 0.5; opacity: 0.96; transparent: true"></a-box>
            {/* Border glow */}
            <a-box position="0 0 -0.04" width="4.3" height="2.9" depth="0.01"
                material="color: #38bdf8; emissive: #38bdf8; emissiveIntensity: 0.7; opacity: 0.8; transparent: true"></a-box>

            {/* Corner ticks — pattern sama kayak InfoBoard */}
            {corners.map(([x, y, dx, dy], i) => (
                <a-entity key={`gp-tick-${i}`} position={`${x} ${y} -0.02`}>
                    <a-box position={`${dx * 0.09} 0 0`} width="0.18" height="0.02" depth="0.005"
                        material="color: #22d3ee; emissive: #22d3ee; emissiveIntensity: 1"></a-box>
                    <a-box position={`0 ${dy * 0.09} 0`} width="0.02" height="0.18" depth="0.005"
                        material="color: #22d3ee; emissive: #22d3ee; emissiveIntensity: 1"></a-box>
                </a-entity>
            ))}

            {/* Status indicator */}
            <a-sphere position="1.95 1.3 -0.01" radius="0.025"
                material="color: #22d3ee; emissive: #22d3ee; emissiveIntensity: 3"></a-sphere>

            {/* Eyebrow */}
            <a-text value="SISTEM AKSES // ORIENTASI KADET" position="0 1.2 0" align="center"
                color="#5a7a8a" scale="0.28 0.28 0.28" font="mozillavr"></a-text>

            {/* Title dual-layer glow */}
            <a-text value="RAKSHADATA" position="0 1 -0.005" align="center"
                color="#0e7490" scale="1.02 1.02 1.02" font="mozillavr"></a-text>
            <a-text value="RAKSHADATA" position="0 1 0" align="center"
                color="#38bdf8" scale="1 1 1" font="mozillavr"></a-text>

            <a-text value="Virtual Escape Room Edukasi Siber" position="0 0.72 0" align="center"
                color="#94a3b8" scale="0.4 0.4 0.4" font="mozillavr"></a-text>

            {/* Divider */}
            <a-box position="0 0.5 0" width="3.5" height="0.015" depth="0.005"
                material="color: #38bdf8; emissive: #38bdf8; emissiveIntensity: 1"></a-box>

            <a-text value="Kamu adalah KADET keamanan siber" position="0 0.2 0" align="center"
                color="#e2e8f0" scale="0.42 0.42 0.42" font="mozillavr"></a-text>
            <a-text value="yang bertugas melindungi data" position="0 0 0" align="center"
                color="#e2e8f0" scale="0.42 0.42 0.42" font="mozillavr"></a-text>
            <a-text value="di data center ini." position="0 -0.2 0" align="center"
                color="#e2e8f0" scale="0.42 0.42 0.42" font="mozillavr"></a-text>

            <a-text value="Pilih pintu berdasarkan tingkat" position="0 -0.55 0" align="center"
                color="#94a3b8" scale="0.38 0.38 0.38" font="mozillavr"></a-text>
            <a-text value="kesulitan, lalu sentuh KEYPAD" position="0 -0.75 0" align="center"
                color="#94a3b8" scale="0.38 0.38 0.38" font="mozillavr"></a-text>
            <a-text value="di samping pintu untuk masuk!" position="0 -0.95 0" align="center"
                color="#94a3b8" scale="0.38 0.38 0.38" font="mozillavr"></a-text>

            {/* Tombol MENGERTI — logic dismiss tetap sama */}
            <a-entity position="0 -1.35 0">
                <a-box position="0 0 0" width="2.2" height="0.55" depth="0.06"
                    material="color: #0284c7; roughness: 0.4; metalness: 0.3; emissive: #0369a1; emissiveIntensity: 0.6"
                    className="clickable"
                    animation__hover="property: material.emissiveIntensity; from: 0.6; to: 1.8; startEvents: mouseenter; dur: 200"
                    animation__leave="property: material.emissiveIntensity; from: 1.8; to: 0.6; startEvents: mouseleave; dur: 200"
                    onClick={onDismiss}
                ></a-box>
                <a-text value="MENGERTI" position="0 0 0.05" align="center"
                    color="#ffffff" scale="0.55 0.55 0.55" font="mozillavr"></a-text>
            </a-entity>
        </a-entity>
    );
}

export default function MainMenu({ onSelectRoom }) {
    const [showGuide, setShowGuide] = useState(true);
    const [videoPlaying, setVideoPlaying] = useState(false);

    const handleGuideDismiss = () => {
        setShowGuide(false);
        setVideoPlaying(true);
    };
    return (
        <a-entity id="hub-world-server-room">

            {/* ========== LIGHTING ========== */}
            <a-light type="ambient" color="#e8ecf4" intensity="0.45"></a-light>
            <a-light type="point" color="#f0f4ff" intensity="0.8" position="0 4.5 0" castShadow="true" distance="18" decay="2"></a-light>
            <a-light type="point" color="#e0e8f5" intensity="0.35" position="-4 4.5 -4" distance="10" decay="2"></a-light>
            <a-light type="point" color="#e0e8f5" intensity="0.35" position="4 4.5 4" distance="10" decay="2"></a-light>
            <a-light type="point" color="#e0e8f5" intensity="0.35" position="-4 4.5 4" distance="10" decay="2"></a-light>
            <a-light type="point" color="#e0e8f5" intensity="0.35" position="4 4.5 -4" distance="10" decay="2"></a-light>

            {/* ========== LANTAI ========== */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="16" height="16"
                material="src: #tex-dc-floor; repeat: 4 4; roughness: 0.6; metalness: 0.1"></a-plane>

            {/* ========== NAVMESH — area yang boleh diinjak player ========== */}
            <a-plane position="0 0.01 0" rotation="-90 0 0" width="14" height="14"
                nav-mesh visible="false"></a-plane>

            {/* ========== LANGIT-LANGIT ========== */}
            <a-plane position="0 5.1 0" rotation="90 0 0" width="18" height="18"
                material="src: #tex-dc-ceiling; repeat: 5 5; roughness: 0.8; side: double"></a-plane>

            {/* ========== DINDING ========== */}
            <a-plane class="solid" position="0 2.5 -7.5" width="16" height="5" material="src: #tex-dc-wall; repeat: 4 1; roughness: 0.8"></a-plane>
            <a-plane class="solid" position="0 2.5 7.5" rotation="0 180 0" width="16" height="5" material="src: #tex-dc-wall; repeat: 4 1; roughness: 0.8"></a-plane>
            <a-plane class="solid" position="-7.5 2.5 0" rotation="0 90 0" width="16" height="5" material="src: #tex-dc-wall; repeat: 4 1; roughness: 0.8"></a-plane>
            <a-plane class="solid" position="7.5 2.5 0" rotation="0 -90 0" width="16" height="5" material="src: #tex-dc-wall; repeat: 4 1; roughness: 0.8"></a-plane>

            {/* Baseboard */}
            <a-box position="0 0.1 -7.4" width="15.6" height="0.2" depth="0.12" color="#475569" material="roughness: 0.5; metalness: 0.4"></a-box>
            <a-box position="0 0.1 7.4" width="15.6" height="0.2" depth="0.12" color="#475569" material="roughness: 0.5; metalness: 0.4"></a-box>
            <a-box position="-7.4 0.1 0" width="0.12" height="0.2" depth="15.6" color="#475569" material="roughness: 0.5; metalness: 0.4"></a-box>
            <a-box position="7.4 0.1 0" width="0.12" height="0.2" depth="15.6" color="#475569" material="roughness: 0.5; metalness: 0.4"></a-box>

            {/* ========== PILAR SUDUT ========== */}
            {[[-7.3, -7.3], [7.3, -7.3], [-7.3, 7.3], [7.3, 7.3]].map(([x, z], i) => (
                <a-box key={`p-${i}`} position={`${x} 2.5 ${z}`} width="0.6" height="5" depth="0.6"
                    color="#64748b" class="solid" material="roughness: 0.5; metalness: 0.4"></a-box>
            ))}

            {/* ========== AC CENTRAL ========== */}
            {[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([x, z], i) => (
                <a-entity key={`ac-${i}`} position={`${x} 4.6 ${z}`}>
                    <a-box position="0 0 0" width="1.8" height="0.2" depth="1.8"
                        color="#d0d4dc" material="roughness: 0.4; metalness: 0.4"></a-box>
                    <a-plane position="0 -0.11 0" rotation="90 0 0" width="1.7" height="1.7"
                        material="src: #tex-dc-hvac; roughness: 0.5; metalness: 0.3"></a-plane>
                    <a-plane position="0 0 0.91" width="1.75" height="0.18"
                        material="src: #tex-dc-hvac; roughness: 0.5; metalness: 0.3"></a-plane>
                    <a-plane position="0 0 -0.91" rotation="0 180 0" width="1.75" height="0.18"
                        material="src: #tex-dc-hvac; roughness: 0.5; metalness: 0.3"></a-plane>
                    <a-plane position="-0.91 0 0" rotation="0 90 0" width="1.75" height="0.18"
                        material="src: #tex-dc-hvac; roughness: 0.5; metalness: 0.3"></a-plane>
                    <a-plane position="0.91 0 0" rotation="0 -90 0" width="1.75" height="0.18"
                        material="src: #tex-dc-hvac; roughness: 0.5; metalness: 0.3"></a-plane>
                    <a-sphere position="0.6 0.11 0.6" radius="0.025"
                        material="color: #00ff00; emissive: #00ff00; emissiveIntensity: 3"></a-sphere>
                </a-entity>
            ))}

            {/* --- POJOK BARAT LAUT --- */}
            <ServerRack position="-5.5 0 -5.5" rotation="0 45 0" />
            <ServerRack position="-4 0 -5.5" rotation="0 45 0" />
            <ServerRack position="-5.5 0 -4" rotation="0 45 0" />

            {/* --- POJOK TIMUR LAUT --- */}
            <ServerRack position="5.5 0 -5.5" rotation="0 -45 0" />
            <ServerRack position="4 0 -5.5" rotation="0 -45 0" />
            <ServerRack position="5.5 0 -4" rotation="0 -45 0" />

            {/* --- POJOK BARAT DAYA --- */}
            <ServerRack position="-5.5 0 5.5" rotation="0 135 0" />
            <ServerRack position="-4 0 5.5" rotation="0 135 0" />
            <ServerRack position="-5.5 0 4" rotation="0 135 0" />

            {/* --- POJOK TIMUR DAYA --- */}
            <ServerRack position="5.5 0 5.5" rotation="0 -135 0" />
            <ServerRack position="4 0 5.5" rotation="0 -135 0" />
            <ServerRack position="5.5 0 4" rotation="0 -135 0" />


            {/* ================================================================
                PINTU & KEYPAD
                ================================================================ */}

            {/* ========== PINTU BARAT (Kiri) - RAKSHA BASIC ========== */}
            <a-entity id="area-sd" position="-7.3 0 0" rotation="0 90 0">
                {/* Kusen pintu */}
                <a-box class="solid" position="0 1.5 0" width="2.4" height="3.4" depth="0.15" color="#334155" material="roughness: 0.4; metalness: 0.5"></a-box>
                {/* Pintu sliding texture */}
                <a-plane position="0 1.5 0.09" width="2.1" height="3.1"
                    material="src: #tex-dc-door; roughness: 0.5; metalness: 0.4"></a-plane>
                {/* Signage hijau */}
                <a-box position="0 3.5 0.1" width="3" height="0.65" depth="0.1" color="#16a34a" material="emissive: #0a5c28; emissiveIntensity: 0.3"></a-box>
                <a-text value="RAKSHA BASIC" position="0 3.55 0.17" align="center" color="#ffffff" scale="0.85 0.85 0.85"></a-text>
                <a-text value="Elementary Level" position="0 3.3 0.17" align="center" color="#bbf7d0" scale="0.35 0.35 0.35"></a-text>
            </a-entity>
            <KeypadPanel position="-7.4 1.5 1.5" rotation="0 90 0" onClick={() => onSelectRoom('Raksha Basic')} />
            {/* Server putih samping keypad kiri */}
            <a-box class="solid" position="-6.8 1 -2.2" width="0.7" height="1.8" depth="1" color="#e8ecf0" material="roughness: 0.4; metalness: 0.3"></a-box>
            <a-plane position="-6.44 1 -2.2" rotation="0 90 0" width="0.95" height="1.7"
                material="src: #tex-dc-server; roughness: 0.4; metalness: 0.2"></a-plane>

            {/* ========== PINTU SELATAN (Depan) - RAKSHA BEGINNER ========== */}
            <a-entity id="area-smp" position="0 0 7.3" rotation="0 180 0">
                <a-box class="solid" position="0 1.5 0" width="2.4" height="3.4" depth="0.15" color="#334155" material="roughness: 0.4; metalness: 0.5"></a-box>
                <a-plane position="0 1.5 0.09" width="2.1" height="3.1"
                    material="src: #tex-dc-door; roughness: 0.5; metalness: 0.4"></a-plane>
                <a-box position="0 3.5 0.1" width="3.5" height="0.65" depth="0.1" color="#ca8a04" material="emissive: #713f12; emissiveIntensity: 0.3"></a-box>
                <a-text value="RAKSHA BEGINNER" position="0 3.55 0.17" align="center" color="#ffffff" scale="0.8 0.8 0.8"></a-text>
                <a-text value="Intermediate Level" position="0 3.3 0.17" align="center" color="#fef08a" scale="0.35 0.35 0.35"></a-text>
            </a-entity>
            <KeypadPanel position="1.5 1.5 7.2" rotation="0 180 0" onClick={() => onSelectRoom('Raksha Beginner')} />
            {/* Server putih samping keypad depan */}
            <a-box class="solid" position="-2.2 1 6.8" width="1" height="1.8" depth="0.7" color="#e8ecf0" material="roughness: 0.4; metalness: 0.3"></a-box>
            <a-plane position="-2.2 1 6.44" rotation="0 180 0" width="0.95" height="1.7"
                material="src: #tex-dc-server; roughness: 0.4; metalness: 0.2"></a-plane>

            {/* ========== PINTU TIMUR (Kanan) - RAKSHA EXPERT ========== */}
            <a-entity id="area-smk" position="7.3 0 0" rotation="0 -90 0">
                <a-box class="solid" position="0 1.5 0" width="2.4" height="3.4" depth="0.15" color="#334155" material="roughness: 0.4; metalness: 0.5"></a-box>
                <a-plane position="0 1.5 0.09" width="2.1" height="3.1"
                    material="src: #tex-dc-door; roughness: 0.5; metalness: 0.4"></a-plane>
                <a-box position="0 3.5 0.1" width="3.2" height="0.65" depth="0.1" color="#dc2626" material="emissive: #7f1d1d; emissiveIntensity: 0.3"></a-box>
                <a-text value="RAKSHA EXPERT" position="0 3.55 0.17" align="center" color="#ffffff" scale="0.8 0.8 0.8"></a-text>
                <a-text value="Advanced Level" position="0 3.3 0.17" align="center" color="#fef08a" scale="0.6 0.6 0.6"></a-text>
            </a-entity>
            <KeypadPanel position="7.2 1.5 -1.5" rotation="0 -90 0" onClick={() => onSelectRoom('Raksha Expert')} />
            {/* Server putih samping keypad kanan */}
            <a-box class="solid" position="6.8 1 2.2" width="0.7" height="1.8" depth="1" color="#e8ecf0" material="roughness: 0.4; metalness: 0.3"></a-box>
            <a-plane position="6.44 1 2.2" rotation="0 -90 0" width="0.95" height="1.7"
                material="src: #tex-dc-server; roughness: 0.4; metalness: 0.2"></a-plane>

            <a-entity id="area-tutorial" position="0 0 -7.3" rotation="0 0 0">
                <InfoBoard
                    position="0 0 0"
                    isPlaying={videoPlaying}
                    onVideoEnded={() => setVideoPlaying(false)}
                />
            </a-entity>

            {showGuide && (
                <WelcomeGuidePopup position="0 1.6 -2.5" onDismiss={handleGuideDismiss} />
            )}

        </a-entity>
    );
}
