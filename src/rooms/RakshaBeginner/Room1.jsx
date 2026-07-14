import React, { useState, useEffect } from 'react';

const openKeyboardInFront = (context) => {
    if (!window.AFRAME || !window.AFRAME.THREE) return;
    const THREE = window.AFRAME.THREE;
    const camEl = document.querySelector('a-camera');

    if (camEl && camEl.object3D) {
        const camObj = camEl.object3D;
        const pos = new THREE.Vector3();
        camObj.getWorldPosition(pos);

        const dir = new THREE.Vector3(0, 0, -1);
        dir.applyQuaternion(camObj.getWorldQuaternion(new THREE.Quaternion()));

        const targetPos = pos.clone().add(dir.multiplyScalar(1.2));
        targetPos.y -= 0.3;

        const rotY = Math.atan2(dir.x, dir.z) * (180 / Math.PI);

        window.dispatchEvent(new CustomEvent('open-keyboard', {
            detail: {
                context,
                position: `${targetPos.x.toFixed(2)} ${targetPos.y.toFixed(2)} ${targetPos.z.toFixed(2)}`,
                rotation: `-15 90 0`
            }
        }));
    }
};

const FeedbackFlash = ({ type, position, rotation = "0 0 0", text }) => {
    const isWrong = type === 'wrong';
    const color = isWrong ? '#ef4444' : '#10b981';
    return (
        <a-entity position={position} rotation={rotation}>
            <a-plane
                width="0.85" height="0.4" color={color}
                material="opacity: 0.95; transparent: true"
                animation__pop="property: scale; from: 0.4 0.4 0.4; to: 1 1 1; dur: 220; easing: easeOutBack"
                animation__fade="property: material.opacity; from: 0.95; to: 0; dur: 500; delay: 1100; easing: easeInQuad"
            >
                <a-text value={text} align="center" color="#ffffff" scale="0.26 0.26 0.26" position="0 0 0.01"></a-text>
            </a-plane>
        </a-entity>
    );
};

const InfoTerminal = ({ position, rotation = "0 0 0", title = "[ INFO ]", hintText, onInteract }) => (
    <a-entity position={position} rotation={rotation}>
        <a-cylinder className="solid" position="0 0.5 -0.1" radius="0.18" height="0.8" color="#1e293b"></a-cylinder>
        <a-entity position="0 1.2 0" rotation="-15 0 0">
            <a-box width="1.1" height="0.75" depth="0.12" color="#0f172a"></a-box>
            <a-plane position="0 0 0.07" width="1" height="0.65" color="#020617"></a-plane>
            <a-text value={title} position="0 0.22 0.08" align="center" color="#38bdf8" scale="0.32 0.32 0.32"></a-text>
            <a-text value={hintText} position="0 0.05 0.08" align="center" color="#94a3b8" scale="0.22 0.22 0.22"></a-text>
        </a-entity>
    </a-entity>
);

const InfoTerminal1 = ({ position, rotation = "0 0 0", title = "[ INFO ]", hintText, onInteract }) => (
    <a-entity position={position} rotation={rotation}>
        <a-cylinder className="solid" position="0 0.5 -0.1" radius="0.18" height="0.8" color="#1e293b"></a-cylinder>
        <a-entity position="0 1.2 0" rotation="-15 0 0">
            <a-box width="1.1" height="0.75" depth="0.12" color="#0f172a"></a-box>
            <a-plane position="0 0 0.07" width="1" height="0.65" color="#020617"></a-plane>
            <a-text value={title} position="0 0.22 0.08" align="center" color="#38bdf8" scale="0.32 0.32 0.32"></a-text>
            <a-text value={hintText} position="0 0.05 0.08" align="center" color="#94a3b8" scale="0.22 0.22 0.22"></a-text>
            <a-entity position="0 -0.18 0.08">
                <a-box width="0.55" height="0.2" depth="0.06" color="#10b981" className="clickable" onClick={onInteract}
                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"></a-box>
                <a-text value="BACA INFO" position="0 0 0.04" align="center" color="#ffffff" scale="0.24 0.24 0.24"></a-text>
            </a-entity>
        </a-entity>
    </a-entity>
);

const DesktopPC = ({ isInteractable, isUnlocked, onInteract, feedback }) => {
    const indicatorColor = feedback?.type === 'wrong'
        ? '#ef4444'
        : (isInteractable ? "#10b981" : "#ef4444");
    const screenColor = isInteractable && !isUnlocked ? "#0f172a" : "#0f172a";

    return (
        <a-entity>
            <a-cylinder position="0 0.85 -0.1" radius="0.02" height="0.15" color="#334155" />
            <a-box position="0 0.78 -0.1" width="0.2" height="0.02" depth="0.15" color="#1e293b" />
            <a-box
                key={feedback?.type === 'wrong' ? `pc-shake-${feedback.id}` : 'pc-idle'}
                position="0 1.05 -0.1" width="0.7" height="0.45" depth="0.05" color="#1a1e24"
                animation__shake={feedback?.type === 'wrong' ? "property: rotation; from: -2 0 0; to: 2 0 0; dur: 70; dir: alternate; loop: 6; easing: easeInOutSine" : undefined}
            >

                <a-plane position="0 0 0.026" width="0.66" height="0.41" color={screenColor} material={!isInteractable ? "src: #tex-dc-monitor" : ""}></a-plane>

                {isInteractable && !isUnlocked && (
                    <a-text value="SYSTEM LOCKED\n(Akses PIN)" align="center" color="#ef4444" scale="0.3 0.3 0.3" position="0 0 0.027"></a-text>
                )}

                {isInteractable && isUnlocked && (
                    <a-plane position="0 0 0.027" width="0.66" height="0.41" color="#0f172a" material="opacity: 0.95">
                        <a-text value="KODE BRANKAS:\nPETI" align="center" color="#10b981" scale="0.28 0.28 0.28"></a-text>
                    </a-plane>
                )}

                <a-sphere
                    key={feedback?.type === 'wrong' ? `pc-ind-${feedback.id}` : 'pc-ind-idle'}
                    position="0 -0.18 0.026" radius="0.012" color={indicatorColor}
                    material={`emissive: ${indicatorColor}; emissiveIntensity: 2`}
                    animation__blink={feedback?.type === 'wrong' ? "property: material.emissiveIntensity; from: 0.2; to: 2; dur: 120; dir: alternate; loop: 8" : undefined}
                ></a-sphere>

                {isInteractable && !isUnlocked && (
                    <a-plane position="0 0 0.028" width="0.66" height="0.41" material="opacity: 0; transparent: true" className="clickable" onClick={onInteract}></a-plane>
                )}

                {feedback && (
                    <FeedbackFlash
                        key={feedback.id}
                        type={feedback.type}
                        position="0 0.4 0.05"
                        text={feedback.type === 'wrong' ? 'AKSES DITOLAK' : 'AKSES DITERIMA'}
                    />
                )}
            </a-box>
            <a-box position="0 0.82 0.15" width="0.45" height="0.02" depth="0.15" material="src: #tex-dc-keyboard; roughness: 0.5"></a-box>
            <a-box position="0.3 0.82 0.15" width="0.08" height="0.02" depth="0.12" material="src: #tex-dc-mouse; roughness: 0.4"></a-box>
        </a-entity>
    );
};

const ComputerRow = ({ x, z, rot = 0, lockedIndex = -1, isPcUnlocked, onInteractPc, pcFeedback }) => {
    return (
        <a-entity position={`${x} 0 ${z}`} rotation={`0 ${rot} 0`}>
            {/* Meja Utama (Panjang Dikurangi Biar Pas 4 PC) */}
            <a-box className="solid" position="0 0.78 0" width="7" height="0.06" depth="1.8" material="src: #tex-dc-desk; repeat: 4 1; roughness: 0.5"></a-box>
            <a-box className="solid" position="0 1.05 0" width="7" height="0.5" depth="0.05" color="#334155"></a-box>
            <a-box className="solid" position="-3 0.37 0" width="0.1" height="0.75" depth="1.6" color="#505862"></a-box>
            <a-box className="solid" position="0 0.37 0" width="0.1" height="0.75" depth="1.6" color="#505862"></a-box>
            <a-box className="solid" position="3 0.37 0" width="0.1" height="0.75" depth="1.6" color="#505862"></a-box>

            {/* 4 PC Depan */}
            {Array.from({ length: 4 }).map((_, i) => (
                <a-entity key={`front-${i}`} position={`${(i - 1.5) * 1.6} 0 0.4`}>
                    <DesktopPC
                        isInteractable={lockedIndex === i}
                        isUnlocked={isPcUnlocked}
                        onInteract={onInteractPc}
                        feedback={lockedIndex === i ? pcFeedback : null}
                    />
                </a-entity>
            ))}

            {/* 4 PC Belakang */}
            {Array.from({ length: 4 }).map((_, i) => (
                <a-entity key={`back-${i}`} position={`${(i - 1.5) * 1.6} 0 -0.4`} rotation="0 180 0">
                    <DesktopPC isInteractable={false} isUnlocked={false} />
                </a-entity>
            ))}
        </a-entity>
    );
};


/* ============================================================
   MAIN: RAKSHA BEGINNER ROOM 1
   ============================================================ */
export default function Room1() {
    const [pcUnlocked, setPcUnlocked] = useState(false);
    const [safeUnlocked, setSafeUnlocked] = useState(false);
    const [doorUnlocked, setDoorUnlocked] = useState(false);

    const [tvStatus, setTvStatus] = useState('standby');
    const [systemUiMode, setSystemUiMode] = useState('hidden');

    // Feedback visual salah/benar untuk tiap titik interaksi password
    const [pcFeedback, setPcFeedback] = useState(null);     // { type: 'wrong' | 'correct', id }
    const [safeFeedback, setSafeFeedback] = useState(null);
    const [doorFeedback, setDoorFeedback] = useState(null);

    // Helper: tampilkan feedback sesaat lalu otomatis hilang
    const triggerFeedback = (setter, type, duration = 1600) => {
        const id = Date.now() + Math.random();
        setter({ type, id });
        setTimeout(() => {
            setter((curr) => (curr && curr.id === id ? null : curr));
        }, duration);
    };

    // Listeners Event dari App.jsx
    useEffect(() => {
        const handlePcSuccess = () => {
            setPcUnlocked(true);
            triggerFeedback(setPcFeedback, 'correct');
        };
        const handleSafeSuccess = () => {
            setSafeUnlocked(true);
            triggerFeedback(setSafeFeedback, 'correct');
        };
        const handleDoorSuccess = () => {
            setDoorUnlocked(true);
            triggerFeedback(setDoorFeedback, 'correct');
        };

        // BARU: sandi salah di masing-masing titik interaksi
        const handlePcFail = () => triggerFeedback(setPcFeedback, 'wrong');
        const handleSafeFail = () => triggerFeedback(setSafeFeedback, 'wrong');
        const handleDoorFail = () => triggerFeedback(setDoorFeedback, 'wrong');
        const handleSystemFail = () => {
            setSystemUiMode('wrong');
            setTimeout(() => {
                setSystemUiMode((curr) => (curr === 'wrong' ? 'real' : curr));
            }, 1800);
        };

        // EVENT: Sukses masuk sistem (Menang!)
        const handleSystemSuccess = () => {
            setSystemUiMode('success');
            setTvStatus('secured');
        };

        // EVENT: Kena Hack Phishing
        const handlePhishingHacked = () => {
            setSystemUiMode('hidden');
            setTvStatus('hacked');

            // Hukuman: Reset dalam 4 detik
            setTimeout(() => {
                setDoorUnlocked(false);
                setTvStatus('standby');

                // Teleportasi Player ke Titik Awal
                const rig = document.getElementById('rig');
                if (rig) {
                    rig.object3D.position.set(4, 0, 0);
                    const camera = rig.querySelector('a-camera');
                    if (camera && camera.components["look-controls"]) {
                        camera.components["look-controls"].yawObject.rotation.y = Math.PI / 2;
                        camera.components["look-controls"].pitchObject.rotation.x = 0;
                    }
                }
            }, 4000);
        };

        window.addEventListener('beginner-pc-success', handlePcSuccess);
        window.addEventListener('beginner-safe-success', handleSafeSuccess);
        window.addEventListener('beginner-door-success', handleDoorSuccess);
        window.addEventListener('beginner-system-success', handleSystemSuccess);
        window.addEventListener('beginner-phishing-hacked', handlePhishingHacked);

        // BARU: registrasi event sandi salah
        window.addEventListener('beginner-pc-fail', handlePcFail);
        window.addEventListener('beginner-safe-fail', handleSafeFail);
        window.addEventListener('beginner-door-fail', handleDoorFail);
        window.addEventListener('beginner-system-fail', handleSystemFail);

        return () => {
            window.removeEventListener('beginner-pc-success', handlePcSuccess);
            window.removeEventListener('beginner-safe-success', handleSafeSuccess);
            window.removeEventListener('beginner-door-success', handleDoorSuccess);
            window.removeEventListener('beginner-system-success', handleSystemSuccess);
            window.removeEventListener('beginner-phishing-hacked', handlePhishingHacked);

            window.removeEventListener('beginner-pc-fail', handlePcFail);
            window.removeEventListener('beginner-safe-fail', handleSafeFail);
            window.removeEventListener('beginner-door-fail', handleDoorFail);
            window.removeEventListener('beginner-system-fail', handleSystemFail);
        };
    }, []);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            document.querySelector('a-scene')?.emit('refresh-solids');
        });
        return () => cancelAnimationFrame(raf);
    }, [doorUnlocked, safeUnlocked, pcUnlocked, systemUiMode]);

    const wallMat = "src: #tex-office-wall-inner-hd; repeat: 3 1; roughness: 0.75; metalness: 0.1";
    const floorMat = "src: #tex-office-floor; repeat: 6 6; roughness: 0.6; metalness: 0.1";
    const ceilingMat = "src: #tex-office-wall-inner-hd; repeat: 6 6; roughness: 0.9";

    return (
        <a-entity id="raksha-beginner-cross">
            <a-light type="ambient" color="#e8ecf4" intensity="0.4"></a-light>
            <a-light type="point" color="#f0f4ff" intensity="0.6" position="0 5 0"></a-light>

            {/* ================= 1. RUANG TENGAH (0, 0) ================= */}
            <a-box className="solid" position="0 4.9 0" width="15" height="0.2" depth="15" material={ceilingMat}></a-box>
            <a-box position="0 0.05 0" width="15" height="0.1" depth="15" material={floorMat}></a-box>
            <a-box position="4 0.1 0" width="1" height="0.05" depth="2" color="#22c55e"></a-box>
            <a-box className="solid" position="7.5 2.5 0" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>

            {/* Terminal Info 1 */}
            <InfoTerminal1
                position="2 0 2"
                rotation="0 45 0"
                title="[ TUGAS BARU ]"
                hintText="Masuklah ke Ruang Komputer (Atas).\nCari PC dengan Lampu Indikator HIJAU.\nLogin dengan sandi default 'AWAL'."
                onInteract={() => { }}
            />

            {/* ================= 2. RUANG ATAS (0, -15) - PC LAB ================= */}
            <a-box className="solid" position="0 4.9 -15" width="15" height="0.2" depth="15" material={ceilingMat}></a-box>
            <a-box position="0 0.05 -15" width="15" height="0.1" depth="15" material={floorMat}></a-box>
            <a-box className="solid" position="0 2.5 -22.5" width="15" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-7.5 2.5 -15" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="7.5 2.5 -15" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-4.5 2.5 -7.5" width="6" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="4.5 2.5 -7.5" width="6" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>

            {/* Meja Kiri & Kanan (Rotasi 90 Derajat agar membentang di sumbu Z) */}
            <ComputerRow x={-2.5} z={-15} rot={90} lockedIndex={1} isPcUnlocked={pcUnlocked} onInteractPc={() => openKeyboardInFront('beginner-pc')} pcFeedback={pcFeedback} />
            <ComputerRow x={2.5} z={-15} rot={90} />

            {/* Terminal Info 2 */}
            <InfoTerminal
                position="6 0 -13"
                rotation="0 -45 0"
                title="[ LOG ADMIN ]"
                hintText="Server utama sedang error.\nUntuk membuka pintu roller merah,\nambil sandi yang tersimpan di dalam brankas."
                onInteract={() => { }}
            />

            {/* ================= 3. RUANG BAWAH (0, 15) - BRANKAS ================= */}
            <a-box className="solid" position="0 4.9 15" width="15" height="0.2" depth="15" material={ceilingMat}></a-box>
            <a-box position="0 0.05 15" width="15" height="0.1" depth="15" material={floorMat}></a-box>
            <a-box className="solid" position="0 2.5 22.5" width="15" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-7.5 2.5 15" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="7.5 2.5 15" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-4.5 2.5 7.5" width="6" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="4.5 2.5 7.5" width="6" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>

            {/* Tambahan Meja PC Dummy di Ruang Brankas */}
            <a-entity position="-5 0 20" rotation="0 180 0">
                <a-box className="solid" position="0 0.78 0" width="2" height="0.06" depth="1" material="src: #tex-dc-desk; roughness: 0.5"></a-box>
                <a-box className="solid" position="0 0.37 0" width="0.1" height="0.75" depth="0.8" color="#505862"></a-box>
                <DesktopPC isInteractable={false} isUnlocked={false} />
            </a-entity>

            {/* Terminal Info 3 */}
            <InfoTerminal
                position="2 0 13"
                title="[ PERHATIAN ]"
                hintText="Brankas penyimpanan rahasia\nhanya bisa dibuka menggunakan PIN 4 digit\nyang didapat dari PC Lab."
                onInteract={() => { }}
            />

            <a-entity
                key={safeFeedback?.type === 'wrong' ? `safe-shake-${safeFeedback.id}` : 'safe-idle'}
                position="-6.80 1 9.40" rotation="0 90 0"
                animation__shake={safeFeedback?.type === 'wrong' ? "property: position; from: -6.80 1 9.40; to: -6.74 1 9.40; dur: 60; dir: alternate; loop: 6; easing: easeInOutSine" : undefined}
            >
                <a-box position="0 0 -0.6" width="1.2" height="1.2" depth="0.1" color="#1e293b"></a-box>
                <a-box position="-0.55 0 -0.3" width="0.1" height="1.2" depth="0.6" color="#1e293b"></a-box>
                <a-box position="0.55 0 -0.3" width="0.1" height="1.2" depth="0.6" color="#1e293b"></a-box>
                <a-box position="0 0.55 -0.3" width="1.2" height="0.1" depth="0.6" color="#1e293b"></a-box>
                <a-box position="0 -0.55 -0.3" width="1.2" height="0.1" depth="0.6" color="#1e293b"></a-box>

                {safeUnlocked && (
                    <a-plane position="0 -0.49 -0.3" rotation="-90 0 0" width="0.6" height="0.4" color="#ffffff" className="clickable"
                        animation__hover="property: scale; to: 1.1 1.1 1.1; startEvents: mouseenter; dur: 200"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200">
                        <a-text value="Sandi Pintu:\n'BUKA'\n\nSandi Sistem:\n'AMAN'" align="center" color="#000000" position="0 0 0.01" scale="0.35 0.35 0.35" rotation="0 0 0"></a-text>
                    </a-plane>
                )}

                <a-entity position="0.6 0 -0.05" animation={safeUnlocked ? "property: rotation; to: 0 110 0; dur: 1500; easing: easeInOutQuad" : undefined}>
                    <a-box className={safeUnlocked ? "" : "solid"} position="-0.6 0 0" width="1.2" height="1.2" depth="0.1" color="#0f172a">
                        <a-plane position="0 0 0.06" width="0.8" height="0.8" material="src: #tex-dc-panel" className="clickable"
                            onClick={() => { if (!safeUnlocked) openKeyboardInFront('beginner-safe'); }}></a-plane>
                        <a-sphere
                            key={safeFeedback?.type === 'wrong' ? `safe-ind-${safeFeedback.id}` : 'safe-ind-idle'}
                            position="0 0.25 0.07" radius="0.04" color={safeFeedback?.type === 'wrong' ? "#ef4444" : (safeUnlocked ? "#10b981" : "#ef4444")}
                            material={safeUnlocked ? "emissive: #10b981" : (safeFeedback?.type === 'wrong' ? "emissive: #ef4444" : "")}
                            animation__blink={safeFeedback?.type === 'wrong' ? "property: material.emissiveIntensity; from: 0.2; to: 2; dur: 120; dir: alternate; loop: 8" : undefined}
                        ></a-sphere>
                    </a-box>
                </a-entity>

                {safeFeedback && (
                    <FeedbackFlash
                        key={safeFeedback.id}
                        type={safeFeedback.type}
                        position="0 0.9 -0.3"
                        text={safeFeedback.type === 'wrong' ? 'SANDI SALAH' : 'BRANKAS TERBUKA'}
                    />
                )}
            </a-entity>

            {/* ================= 4. RUANG KIRI / SISTEM (-15, 0) ================= */}
            <a-box className="solid" position="-15 4.9 0" width="15" height="0.2" depth="15" material={ceilingMat}></a-box>
            <a-box position="-15 0.05 0" width="15" height="0.1" depth="15" material={floorMat}></a-box>
            <a-box className="solid" position="-15 2.5 -7.5" width="15" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-15 2.5 7.5" width="15" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-22.5 2.5 0" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-7.5 2.5 -4.75" width="0.25" height="5" depth="5.5" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-7.5 2.5 4.75" width="0.25" height="5" depth="5.5" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-7.5 4 0" width="0.25" height="2" depth="4" color="#c8cdd5" material={wallMat}></a-box>

            <a-entity position="-7.5 1.5 0" animation={doorUnlocked ? "property: position; to: -7.5 4.5 0; dur: 2000; easing: easeInOutQuad" : undefined}>
                <a-box className="solid" width="0.2" height="3" depth="4" material="src: #tex-office-roller"></a-box>
            </a-entity>
            <a-entity
                key={doorFeedback?.type === 'wrong' ? `door-shake-${doorFeedback.id}` : 'door-idle'}
                position="-7.3 1.5 2.5" rotation="0 90 0"
                animation__shake={doorFeedback?.type === 'wrong' ? "property: position; from: -7.3 1.5 2.5; to: -7.25 1.5 2.5; dur: 60; dir: alternate; loop: 6; easing: easeInOutSine" : undefined}
            >
                <a-box className="solid clickable" width="0.6" height="0.8" depth="0.05" material="src: #tex-dc-keypad"
                    onClick={() => { if (!doorUnlocked) openKeyboardInFront('beginner-door'); }}></a-box>
                <a-sphere
                    key={doorFeedback?.type === 'wrong' ? `door-ind-${doorFeedback.id}` : 'door-ind-idle'}
                    position="0 0.45 0.03" radius="0.03" color={doorFeedback?.type === 'wrong' ? "#ef4444" : (doorUnlocked ? "#10b981" : "#ef4444")}
                    material={doorUnlocked ? "emissive: #10b981" : (doorFeedback?.type === 'wrong' ? "emissive: #ef4444" : "")}
                    animation__blink={doorFeedback?.type === 'wrong' ? "property: material.emissiveIntensity; from: 0.2; to: 2; dur: 120; dir: alternate; loop: 8" : undefined}
                ></a-sphere>

                {doorFeedback && (
                    <FeedbackFlash
                        key={doorFeedback.id}
                        type={doorFeedback.type}
                        position="0 0.95 0.05"
                        text={doorFeedback.type === 'wrong' ? 'AKSES DITOLAK' : 'PINTU TERBUKA'}
                    />
                )}
            </a-entity>

            {/* Terminal Info 4 (Di Ruang Sistem) */}
            <InfoTerminal
                position="-12 0 5"
                rotation="0 -90 0"
                title="[ SYSTEM WARNING ]"
                hintText="HATI-HATI PHISHING!\nJangan masukkan sandi di form yang mencurigakan.\nPastikan nama terminal tidak typo!"
                onInteract={() => { }}
            />

            {/* PC SISTEM */}
            <a-entity position="-19 0 0" rotation="0 90 0">
                <a-box className="solid" position="0 0.78 0" width="1.4" height="0.06" depth="0.8" material="src: #tex-dc-desk; roughness: 0.5"></a-box>
                <a-box className="solid" position="-0.6 0.37 0" width="0.08" height="0.75" depth="0.6" color="#505862"></a-box>
                <a-box className="solid" position="0.6 0.37 0" width="0.08" height="0.75" depth="0.6" color="#505862"></a-box>

                <a-entity position="0 0 -0.15">
                    <a-cylinder position="0 0.85 -0.1" radius="0.02" height="0.15" color="#334155" />
                    <a-box position="0 0.78 -0.1" width="0.2" height="0.02" depth="0.15" color="#1e293b" />
                    <a-box position="0 1.05 -0.1" width="0.7" height="0.45" depth="0.05" color="#1a1e24">
                        <a-plane position="0 0 0.026" width="0.66" height="0.41" material="src: #tex-dc-monitor"></a-plane>
                        <a-sphere position="0 -0.18 0.026" radius="0.012" color="#10b981" material="emissive: #10b981; emissiveIntensity: 2"></a-sphere>

                        {/* Hitbox Trigger Phishing */}
                        {doorUnlocked && tvStatus === 'standby' && (
                            <a-plane position="0 0 0.028" width="0.66" height="0.41" material="opacity: 0; transparent: true" className="clickable" onClick={() => setSystemUiMode('phishing')}></a-plane>
                        )}
                    </a-box>
                    <a-box position="0 0.82 0.15" width="0.45" height="0.02" depth="0.15" material="src: #tex-dc-keyboard; roughness: 0.5"></a-box>
                    <a-box position="0.3 0.82 0.15" width="0.08" height="0.02" depth="0.12" material="src: #tex-dc-mouse; roughness: 0.4"></a-box>
                </a-entity>
            </a-entity>

            {/* === 1. HOLOGRAM PHISHING (DIBIKIN LEBIH RAPI & BERBORDER) === */}
            {systemUiMode === 'phishing' && (
                <a-plane position="-19 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#ef4444"></a-box> {/* Border Merah */}

                    <a-text value="[ TERM1NAL UTAMA ]" align="center" color="#ef4444" position="0 0.6 0.02" scale="0.6 0.6 0.6"></a-text>
                    <a-text value="Sistem mendeteksi aktivitas login yang tidak wajar.\nSesi Anda telah kedaluwarsa untuk alasan keamanan.\n\nSilakan verifikasi Sandi Akses Anda kembali:" align="center" color="#e2e8f0" position="0 0.1 0.02" scale="0.35 0.35 0.35"></a-text>

                    {/* Tombol Jebakan Hack */}
                    <a-box position="0 -0.4 0.02" width="2" height="0.3" depth="0.02" color="#0284c7" className="clickable" onClick={() => {
                        openKeyboardInFront('beginner-phishing');
                    }}></a-box>
                    <a-text value="VERIFIKASI OTORISASI" position="0 -0.4 0.04" align="center" color="#fff" scale="0.35 0.35 0.35"></a-text>

                    {/* Tombol Silang (Lolos) */}
                    <a-entity position="1.4 0.7 0.02">
                        <a-box width="0.25" height="0.25" depth="0.01" color="#ef4444" className="clickable" onClick={() => setSystemUiMode('real')}></a-box>
                        <a-text value="X" align="center" color="#fff" scale="0.4 0.4 0.4"></a-text>
                    </a-entity>
                </a-plane>
            )}

            {/* === 2. HOLOGRAM SISTEM ASLI === */}
            {systemUiMode === 'real' && (
                <a-plane position="-19 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#10b981"></a-box> {/* Border Hijau */}

                    <a-text value="[ TERMINAL UTAMA ]" align="center" color="#34d399" position="0 0.6 0.02" scale="0.6 0.6 0.6"></a-text>
                    <a-text value="Koneksi Aman Terenkripsi.\nSilakan masukkan Sandi Akses Sistem Asli:" align="center" color="#94a3b8" position="0 0.1 0.02" scale="0.35 0.35 0.35"></a-text>

                    {/* Tombol Buka Keyboard Aman */}
                    <a-box position="0 -0.4 0.02" width="2" height="0.3" depth="0.02" color="#10b981" className="clickable" onClick={() => {
                        setSystemUiMode('hidden');
                        openKeyboardInFront('beginner-system');
                    }}></a-box>
                    <a-text value="LOGIN SISTEM" position="0 -0.4 0.04" align="center" color="#fff" scale="0.35 0.35 0.35"></a-text>
                </a-plane>
            )}

            {/* === 3. HOLOGRAM SANDI SALAH (BARU) === */}
            {systemUiMode === 'wrong' && (
                <a-plane
                    key={`system-wrong-flash`}
                    position="-19 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95"
                    animation__shake="property: rotation; from: 90 -1.5 0; to: 90 1.5 0; dur: 70; dir: alternate; loop: 6; easing: easeInOutSine"
                >
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#ef4444"></a-box>
                    <a-text value="AKSES DITOLAK"
                        align="center" color="#ef4444" position="0 0.35 0.02" scale="0.4 0.4 0.4"
                        animation__pop="property: scale; from: 0.15 0.15 0.15; to: 0.7 0.7 0.7; dur: 250; easing: easeOutBack"
                    ></a-text>
                    <a-text value="Sandi salah.\nForm login akan dimuat ulang..." align="center" color="#fca5a5" position="0 -0.05 0.02" scale="0.32 0.32 0.32"></a-text>
                </a-plane>
            )}

            {/* === 4. HOLOGRAM BERHASIL (KEMBALI KE LOBBY) === */}
            {systemUiMode === 'success' && (
                <a-plane position="-19 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#f59e0b"></a-box>
                    <a-text value="MISI SELESAI" align="center" color="#facc15" position="0 0.4 0.02" scale="0.8 0.8 0.8"></a-text>
                    <a-text value="Anda berhasil mengamankan sistem\ndan menghindari serangan Phishing." align="center" color="#e2e8f0" position="0 0 0.02" scale="0.35 0.35 0.35"></a-text>

                    <a-box position="0 -0.4 0.02" width="2.5" height="0.3" depth="0.02" color="#f59e0b" className="clickable" onClick={() => {
                        window.location.reload(); // Reload web untuk balik ke Lobby
                    }}></a-box>
                    <a-text value="KEMBALI KE LOBBY" position="0 -0.4 0.04" align="center" color="#000" scale="0.35 0.35 0.35"></a-text>
                </a-plane>
            )}

            {/* TV Indikator Background */}
            <a-plane position="-22.3 2.5 0" rotation="0 90 0" width="8" height="4" color={tvStatus === 'secured' ? '#14532d' : (tvStatus === 'hacked' ? '#7f1d1d' : '#020617')}>
                {tvStatus === 'standby' && <a-text value="SISTEM TERKUNCI\n(Masukkan Otorisasi di PC)" align="center" color="#ef4444" scale="2 2 2"></a-text>}
                {tvStatus === 'hacked' && <a-text value="SYSTEM COMPROMISED\n(MERESTART SIMULASI...)" align="center" color="#fca5a5" scale="2 2 2"></a-text>}
                {tvStatus === 'secured' && <a-text value="SYSTEM SECURED\n(Misi Selesai!)" align="center" color="#10b981" scale="2 2 2"></a-text>}
            </a-plane>
        </a-entity>
    );
}