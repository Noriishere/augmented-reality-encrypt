import React, { useState, useEffect } from 'react';

/* ============================================================
   KOMPONEN: INFO TERMINAL 
   ============================================================ */
const InfoTerminal = ({ position, rotation = "0 0 0", title = "[ INFO ]", defaultText, clickedText, hasButton = false, isClicked = false, onInteract }) => {
    const displayText = (hasButton && isClicked) ? clickedText : defaultText;

    return (
        <a-entity position={position} rotation={rotation}>
            <a-cylinder className="solid" position="0 0.5 0" radius="0.18" height="0.8" color="#1e293b"></a-cylinder>
            <a-entity position="0 1.2 0" rotation="-15 0 0">
                <a-box width="1.1" height="0.75" depth="0.12" color="#0f172a"></a-box>
                <a-plane position="0 0 0.07" width="1" height="0.65" color="#020617"></a-plane>
                <a-text value={title} position="0 0.22 0.08" align="center" color="#38bdf8" scale="0.32 0.32 0.32"></a-text>
                
                <a-text value={displayText} position="0 0.02 0.08" align="center" color="#94a3b8" scale="0.18 0.18 0.18"></a-text>
                
                {hasButton && !isClicked && (
                    <a-entity position="0 -0.2 0.08">
                        <a-box width="0.55" height="0.18" depth="0.06" color="#10b981" className="clickable" onClick={onInteract}
                            animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                            animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"></a-box>
                        <a-text value="BACA INFO" position="0 0 0.04" align="center" color="#ffffff" scale="0.22 0.22 0.22"></a-text>
                    </a-entity>
                )}
            </a-entity>
        </a-entity>
    )
};

/* ============================================================
   KOMPONEN: PC SATUAN & BARIS MEJA 
   ============================================================ */
const DesktopPC = ({ isInteractable, isUnlocked, onInteract }) => {
    const indicatorColor = isInteractable ? (isUnlocked ? "#10b981" : "#10b981") : "#ef4444";

    return (
        <a-entity>
            <a-cylinder position="0 0.85 -0.1" radius="0.02" height="0.15" color="#334155" />
            <a-box position="0 0.78 -0.1" width="0.2" height="0.02" depth="0.15" color="#1e293b" />
            <a-box position="0 1.05 -0.1" width="0.7" height="0.45" depth="0.05" color="#1a1e24">
                
                <a-plane position="0 0 0.026" width="0.66" height="0.41" color="#ffffff" material="src: #tex-dc-monitor"></a-plane>
                
                {isInteractable && !isUnlocked && (
                    <a-plane position="0 0 0.027" width="0.66" height="0.41" color="#0f172a" material="opacity: 0.95">
                        <a-text value="SYSTEM LOCKED\n(Akses PIN)" align="center" color="#ef4444" scale="0.3 0.3 0.3"></a-text>
                    </a-plane>
                )}

                {isInteractable && isUnlocked && (
                    <a-plane position="0 0 0.027" width="0.66" height="0.41" color="#0f172a" material="opacity: 0.95">
                        <a-text value="KODE BRANKAS:\nAPKH" align="center" color="#10b981" scale="0.28 0.28 0.28"></a-text>
                    </a-plane>
                )}

                <a-sphere position="0 -0.18 0.026" radius="0.012" color={indicatorColor} material={`emissive: ${indicatorColor}; emissiveIntensity: 2`}></a-sphere>
                
                {isInteractable && !isUnlocked && (
                    <a-plane position="0 0 0.028" width="0.66" height="0.41" material="opacity: 0; transparent: true" className="clickable" onClick={onInteract}></a-plane>
                )}
            </a-box>
            <a-box position="0 0.82 0.15" width="0.45" height="0.02" depth="0.15" material="src: #tex-dc-keyboard; roughness: 0.5"></a-box>
            <a-box position="0.3 0.82 0.15" width="0.08" height="0.02" depth="0.12" material="src: #tex-dc-mouse; roughness: 0.4"></a-box>
        </a-entity>
    );
};

const ComputerRow = ({ x, z, rot = 0, lockedIndex = -1, isPcUnlocked, onInteractPc }) => {
    return (
        <a-entity position={`${x} 0 ${z}`} rotation={`0 ${rot} 0`}>
            <a-box className="solid" position="0 0.78 0" width="7" height="0.06" depth="1.8" material="src: #tex-dc-desk; repeat: 4 1; roughness: 0.5"></a-box>
            <a-box className="solid" position="0 1.05 0" width="7" height="0.5" depth="0.05" color="#334155"></a-box>
            <a-box className="solid" position="-3 0.37 0" width="0.1" height="0.75" depth="1.6" color="#505862"></a-box>
            <a-box className="solid" position="0 0.37 0" width="0.1" height="0.75" depth="1.6" color="#505862"></a-box>
            <a-box className="solid" position="3 0.37 0" width="0.1" height="0.75" depth="1.6" color="#505862"></a-box>

            {Array.from({ length: 4 }).map((_, i) => (
                <a-entity key={`front-${i}`} position={`${(i - 1.5) * 1.6} 0 0.4`}>
                    <DesktopPC isInteractable={lockedIndex === i} isUnlocked={isPcUnlocked} onInteract={onInteractPc} />
                </a-entity>
            ))}

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
    
    const [middleInfoRead, setMiddleInfoRead] = useState(false); 
    const [systemUiMode, setSystemUiMode] = useState('hidden'); 

    useEffect(() => {
        const handlePcSuccess = () => setPcUnlocked(true);
        const handleSafeSuccess = () => setSafeUnlocked(true);
        const handleDoorSuccess = () => setDoorUnlocked(true);
        
        const handleSystemSuccess = () => {
            setSystemUiMode('success');
            setTvStatus('secured');
        };

        const handlePhishingHacked = () => {
            setSystemUiMode('hidden');
            setTvStatus('hacked');
            
            setTimeout(() => {
                setDoorUnlocked(false);
                setTvStatus('standby');
                
                const rig = document.getElementById('rig');
                if (rig) {
                    rig.object3D.position.set(4, 0, 0);
                    const camera = rig.querySelector('a-camera');
                    if(camera && camera.components["look-controls"]) {
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

        return () => {
            window.removeEventListener('beginner-pc-success', handlePcSuccess);
            window.removeEventListener('beginner-safe-success', handleSafeSuccess);
            window.removeEventListener('beginner-door-success', handleDoorSuccess);
            window.removeEventListener('beginner-system-success', handleSystemSuccess);
            window.removeEventListener('beginner-phishing-hacked', handlePhishingHacked);
        };
    }, []);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            document.querySelector('a-scene')?.emit('refresh-solids');
        });
        return () => cancelAnimationFrame(raf);
    }, [doorUnlocked, safeUnlocked, pcUnlocked, systemUiMode, middleInfoRead]); 

    const openKeyboard = (context, position, rotation) => {
        window.dispatchEvent(new CustomEvent('open-keyboard', {
            detail: { context, position, rotation }
        }));
    };

    const wallMat = "src: #tex-office-wall-inner-hd; repeat: 3 1; roughness: 0.75; metalness: 0.1";
    const floorMat = "src: #tex-office-floor; repeat: 6 6; roughness: 0.6; metalness: 0.1";
    const ceilingMat = "src: #tex-office-wall-inner-hd; repeat: 6 6; roughness: 0.9"; 

    return (
        <a-entity id="raksha-beginner-cross">
            <a-light type="ambient" color="#b0b8c4" intensity="0.15"></a-light>
            <a-light type="point" color="#e0e7ff" intensity="0.25" position="0 4.5 0" distance="15"></a-light>
            <a-light type="point" color="#e0e7ff" intensity="0.25" position="0 4.5 -15" distance="15"></a-light>
            <a-light type="point" color="#e0e7ff" intensity="0.25" position="0 4.5 15" distance="15"></a-light>
            <a-light type="point" color="#e0e7ff" intensity="0.25" position="-15 4.5 0" distance="15"></a-light>

            {/* ================= 1. RUANG TENGAH (0, 0) ================= */}
            <a-box className="solid" position="0 4.9 0" width="15" height="0.2" depth="15" material={ceilingMat}></a-box>
            <a-box position="0 0.05 0" width="15" height="0.1" depth="15" material={floorMat}></a-box>
            <a-box position="4 0.1 0" width="1" height="0.05" depth="2" color="#22c55e"></a-box>
            <a-box className="solid" position="7.5 2.5 0" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            
            <InfoTerminal 
                position="2 0 2" 
                rotation="0 90 0"
                title="[ SYSTEM ALERT ]" 
                defaultText="Sistem mendeteksi anomali.\nSilakan tekan tombol di bawah\nuntuk membaca detail log keamanan." 
                clickedText="Peringatan! Ada penyusup yang\nsudah masuk ke dalam sini.\nSegera amankan sistem dan\nhati-hati terhadap hal-hal\nyang mencurigakan\ncari sandi berangkas untuk menemukan kode\npintu dan akses sistem"
                hasButton={true}
                isClicked={middleInfoRead}
                onInteract={() => setMiddleInfoRead(true)} 
            />

            {/* ================= 2. RUANG ATAS (0, -15) - PC LAB ================= */}
            <a-box className="solid" position="0 4.9 -15" width="15" height="0.2" depth="15" material={ceilingMat}></a-box>
            <a-box position="0 0.05 -15" width="15" height="0.1" depth="15" material={floorMat}></a-box>
            <a-box className="solid" position="0 2.5 -22.5" width="15" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-7.5 2.5 -15" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="7.5 2.5 -15" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-4.5 2.5 -7.5" width="6" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="4.5 2.5 -7.5" width="6" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>

            <ComputerRow x={-2.5} z={-15} rot={90} lockedIndex={1} isPcUnlocked={pcUnlocked} onInteractPc={() => openKeyboard('beginner-pc', '-1.5 1.4 -14.2', '-10 90 0')} />
            <ComputerRow x={2.5} z={-15} rot={90} />
            
            <InfoTerminal 
                position="1.60 0 -9.40" 
                rotation="0 -45 0"
                title="[ INFO ]" 
                defaultText="Server utama sedang error.\nUntuk membuka pintu roller merah,\nambil sandi yang tersimpan di dalam brankas\ncari pc yang berbeda dan dengan kata kunci DONI\nclue nya 3 langkah kedepan" 
                hasButton={false}
            />

            {/* ================= 3. RUANG BAWAH (0, 15) - BRANKAS ================= */}
            <a-box className="solid" position="0 4.9 15" width="15" height="0.2" depth="15" material={ceilingMat}></a-box>
            <a-box position="0 0.05 15" width="15" height="0.1" depth="15" material={floorMat}></a-box>
            <a-box className="solid" position="0 2.5 22.5" width="15" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-7.5 2.5 15" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="7.5 2.5 15" width="0.25" height="5" depth="15" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="-4.5 2.5 7.5" width="6" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>
            <a-box className="solid" position="4.5 2.5 7.5" width="6" height="5" depth="0.25" color="#c8cdd5" material={wallMat}></a-box>

            <ComputerRow x={-2.5} z={15} rot={90} />
            <ComputerRow x={2.5} z={15} rot={90} />

            <InfoTerminal 
                position="-1 0 9.80"
                rotation="0 120 0" 
                title="[ PERHATIAN ]" 
                defaultText="Brankas penyimpanan rahasia\nhanya bisa dibuka menggunakan PIN 4 digit\nyang didapat dari PC Lab\ncari pc yang berbeda untuk sandi berangkas." 
                hasButton={false}
            />

            {/* BRANKAS */}
            <a-entity className="solid" position="-6.5 1.2 10.5" rotation="0 90 0">
                <a-box position="0 0 -0.6" width="1.2" height="1.2" depth="0.1" color="#1e293b"></a-box>
                <a-box position="-0.55 0 -0.3" width="0.1" height="1.2" depth="0.6" color="#1e293b"></a-box>
                <a-box position="0.55 0 -0.3" width="0.1" height="1.2" depth="0.6" color="#1e293b"></a-box>
                <a-box position="0 0.55 -0.3" width="1.2" height="0.1" depth="0.6" color="#1e293b"></a-box>
                <a-box position="0 -0.55 -0.3" width="1.2" height="0.1" depth="0.6" color="#1e293b"></a-box>

                {safeUnlocked && (
                    <a-plane position="0 -0.49 -0.3" rotation="-90 0 0" width="0.6" height="0.4" color="#ffffff" className="clickable" 
                        animation__hover="property: scale; to: 1.1 1.1 1.1; startEvents: mouseenter; dur: 200"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200">
                        <a-text value="Sandi Pintu:\n'YAHU'\n\nSandi Sistem:\n'CLIR'" align="center" color="#000000" position="0 0 0.01" scale="0.35 0.35 0.35" rotation="0 0 0"></a-text>
                    </a-plane>
                )}

                {/* KEYBOARD POSISI STATIS DEPAN BRANKAS */}
                <a-entity position="0.6 0 -0.05" animation={safeUnlocked ? "property: rotation; to: 0 110 0; dur: 1500; easing: easeInOutQuad" : undefined}>
                    <a-box className={safeUnlocked ? "" : "solid"} position="-0.6 0 0" width="1.2" height="1.2" depth="0.1" color="#0f172a">
                        <a-plane position="0 0 0.06" width="0.8" height="0.8" material="src: #tex-dc-panel" className="clickable" 
                            onClick={() => { if(!safeUnlocked) openKeyboard('beginner-safe', '-6.15 1.4 10.5', '-10 90 0'); }}></a-plane>
                        <a-sphere position="0 0.25 0.07" radius="0.04" color={safeUnlocked ? "#10b981" : "#ef4444"} material={safeUnlocked ? "emissive: #10b981" : ""}></a-sphere>
                    </a-box>
                </a-entity>
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

            <a-entity position="-7.3 1.5 2.5" rotation="0 90 0">
                <a-box className="solid clickable" width="0.6" height="0.8" depth="0.05" material="src: #tex-dc-keypad" 
                    onClick={() => { if(!doorUnlocked) openKeyboard('beginner-door', '-6.5 1.4 2.5', '-10 90 0'); }}></a-box>
                <a-sphere position="0 0.45 0.03" radius="0.03" color={doorUnlocked ? "#10b981" : "#ef4444"} material={doorUnlocked ? "emissive: #10b981" : ""}></a-sphere>
            </a-entity>

            <InfoTerminal 
                position="-12 0 5" 
                rotation="0 120 0"
                title="[ SYSTEM WARNING ]" 
                defaultText="HATI-HATI!!!\nJangan masukkan sandi di form yang mencurigakan." 
                hasButton={false}
            />

            <a-entity position="-19 0 0" rotation="0 90 0">
                <a-box className="solid" position="0 0.78 0" width="1.4" height="0.06" depth="0.8" material="src: #tex-dc-desk; roughness: 0.5"></a-box>
                <a-box className="solid" position="-0.6 0.37 0" width="0.08" height="0.75" depth="0.6" color="#505862"></a-box>
                <a-box className="solid" position="0.6 0.37 0" width="0.08" height="0.75" depth="0.6" color="#505862"></a-box>
                
                <a-entity position="0 0 -0.15">
                    <a-cylinder position="0 0.85 -0.1" radius="0.02" height="0.15" color="#334155" />
                    <a-box position="0 0.78 -0.1" width="0.2" height="0.02" depth="0.15" color="#1e293b" />
                    <a-box position="0 1.05 -0.1" width="0.7" height="0.45" depth="0.05" color="#1a1e24">
                        <a-plane position="0 0 0.026" width="0.66" height="0.41" color="#ffffff" material="src: #tex-dc-monitor"></a-plane>
                        <a-sphere position="0 -0.18 0.026" radius="0.012" color="#10b981" material="emissive: #10b981; emissiveIntensity: 2"></a-sphere>
                        
                        {doorUnlocked && tvStatus === 'standby' && (
                             <a-plane position="0 0 0.028" width="0.66" height="0.41" material="opacity: 0; transparent: true" className="clickable" onClick={() => setSystemUiMode('phishing1')}></a-plane>
                        )}
                    </a-box>
                    <a-box position="0 0.82 0.15" width="0.45" height="0.02" depth="0.15" material="src: #tex-dc-keyboard; roughness: 0.5"></a-box>
                    <a-box position="0.3 0.82 0.15" width="0.08" height="0.02" depth="0.12" material="src: #tex-dc-mouse; roughness: 0.4"></a-box>
                </a-entity>
            </a-entity>

            {/* === 1. HOLOGRAM PHISHING 1 === */}
            {systemUiMode === 'phishing1' && (
                <a-plane position="-18 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#ef4444"></a-box> 
                    <a-text value="[ TERM1NAL UTAMA ]" align="center" color="#ef4444" position="0 0.6 0.02" scale="0.6 0.6 0.6"></a-text>
                    <a-text value="Sistem mendeteksi aktivitas login yang tidak wajar.\nSesi Anda telah kedaluwarsa untuk alasan keamanan.\n\nSilakan verifikasi Sandi Akses Anda kembali:" align="center" color="#e2e8f0" position="0 0.1 0.02" scale="0.35 0.35 0.35"></a-text>
                    <a-box position="0 -0.4 0.02" width="2" height="0.3" depth="0.02" color="#0284c7" className="clickable" onClick={() => {
                        openKeyboard('beginner-phishing', '-18 1.4 0', '-10 90 0');
                    }}></a-box>
                    <a-text value="VERIFIKASI OTORISASI" position="0 -0.4 0.04" align="center" color="#fff" scale="0.35 0.35 0.35"></a-text>
                    <a-entity position="1.4 0.7 0.02">
                        <a-box width="0.25" height="0.25" depth="0.01" color="#ef4444" className="clickable" onClick={() => setSystemUiMode('phishing2')}></a-box>
                        <a-text value="X" align="center" color="#fff" scale="0.4 0.4 0.4"></a-text>
                    </a-entity>
                </a-plane>
            )}

            {/* === 2. HOLOGRAM PHISHING 2 === */}
            {systemUiMode === 'phishing2' && (
                <a-plane position="-18 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#ef4444"></a-box> 
                    <a-text value="[ WlNDOWS DEFENDER ]" align="center" color="#ef4444" position="0 0.6 0.02" scale="0.6 0.6 0.6"></a-text>
                    <a-text value="PC Anda terinfeksi 5 Virus (Trojan.Ransomware)!\nData sistem akan dihapus dalam 5 menit jika tidak diatasi.\n\nMasukkan sandi untuk membersihkan virus:" align="center" color="#e2e8f0" position="0 0.1 0.02" scale="0.35 0.35 0.35"></a-text>
                    <a-box position="0 -0.4 0.02" width="2" height="0.3" depth="0.02" color="#0284c7" className="clickable" onClick={() => {
                        openKeyboard('beginner-phishing', '-18 1.4 0', '-10 90 0');
                    }}></a-box>
                    <a-text value="BERSIHKAN VIRUS" position="0 -0.4 0.04" align="center" color="#fff" scale="0.35 0.35 0.35"></a-text>
                    <a-entity position="1.4 0.7 0.02">
                        <a-box width="0.25" height="0.25" depth="0.01" color="#ef4444" className="clickable" onClick={() => setSystemUiMode('phishing3')}></a-box>
                        <a-text value="X" align="center" color="#fff" scale="0.4 0.4 0.4"></a-text>
                    </a-entity>
                </a-plane>
            )}

            {/* === 3. HOLOGRAM PHISHING 3 === */}
            {systemUiMode === 'phishing3' && (
                <a-plane position="-18 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#ef4444"></a-box> 
                    <a-text value="[ SELAMAT! ]" align="center" color="#facc15" position="0 0.6 0.02" scale="0.6 0.6 0.6"></a-text>
                    <a-text value="Anda adalah pengunjung ke-1.000.000 hari ini!\nAnda memenangkan hadiah akses Admin VIP gratis.\n\nKlaim hadiah dengan memasukkan sandi:" align="center" color="#e2e8f0" position="0 0.1 0.02" scale="0.35 0.35 0.35"></a-text>
                    <a-box position="0 -0.4 0.02" width="2" height="0.3" depth="0.02" color="#0284c7" className="clickable" onClick={() => {
                        openKeyboard('beginner-phishing', '-18 1.4 0', '-10 90 0');
                    }}></a-box>
                    <a-text value="KLAIM HADIAH VIP" position="0 -0.4 0.04" align="center" color="#fff" scale="0.35 0.35 0.35"></a-text>
                    <a-entity position="1.4 0.7 0.02">
                        <a-box width="0.25" height="0.25" depth="0.01" color="#ef4444" className="clickable" onClick={() => setSystemUiMode('phishing4')}></a-box>
                        <a-text value="X" align="center" color="#fff" scale="0.4 0.4 0.4"></a-text>
                    </a-entity>
                </a-plane>
            )}

            {/* === 4. HOLOGRAM PHISHING 4 === */}
            {systemUiMode === 'phishing4' && (
                <a-plane position="-18 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#ef4444"></a-box> 
                    <a-text value="[ UPDATE REQU1RED ]" align="center" color="#ef4444" position="0 0.6 0.02" scale="0.6 0.6 0.6"></a-text>
                    <a-text value="Sistem keamanan Anda versi lama dan rentan diretas!\nPembaruan darurat sangat diperlukan untuk mengakses sistem.\n\nOtorisasi update dengan sandi Anda:" align="center" color="#e2e8f0" position="0 0.1 0.02" scale="0.35 0.35 0.35"></a-text>
                    <a-box position="0 -0.4 0.02" width="2" height="0.3" depth="0.02" color="#0284c7" className="clickable" onClick={() => {
                        openKeyboard('beginner-phishing', '-18 1.4 0', '-10 90 0');
                    }}></a-box>
                    <a-text value="UPDATE SISTEM SEKARANG" position="0 -0.4 0.04" align="center" color="#fff" scale="0.3 0.3 0.3"></a-text>
                    <a-entity position="1.4 0.7 0.02">
                        <a-box width="0.25" height="0.25" depth="0.01" color="#ef4444" className="clickable" onClick={() => setSystemUiMode('real')}></a-box>
                        <a-text value="X" align="center" color="#fff" scale="0.4 0.4 0.4"></a-text>
                    </a-entity>
                </a-plane>
            )}

            {/* === 5. HOLOGRAM SISTEM ASLI === */}
            {systemUiMode === 'real' && (
                <a-plane position="-19 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#10b981"></a-box> 
                    <a-text value="[ TERMINAL UTAMA ]" align="center" color="#34d399" position="0 0.6 0.02" scale="0.6 0.6 0.6"></a-text>
                    <a-text value="Koneksi Aman Terenkripsi.\nSilakan masukkan Sandi Akses Sistem Asli:" align="center" color="#94a3b8" position="0 0.1 0.02" scale="0.35 0.35 0.35"></a-text>
                    <a-box position="0 -0.4 0.02" width="2" height="0.3" depth="0.02" color="#10b981" className="clickable" onClick={() => {
                        setSystemUiMode('hidden');
                        openKeyboard('beginner-system', '-18 1.4 0', '-10 90 0');
                    }}></a-box>
                    <a-text value="LOGIN SISTEM" position="0 -0.4 0.04" align="center" color="#fff" scale="0.35 0.35 0.35"></a-text>
                </a-plane>
            )}

            {/* HOLOGRAM BERHASIL */}
            {systemUiMode === 'success' && (
                <a-plane position="-19 1.4 0" rotation="0 90 0" width="3.2" height="1.8" color="#0f172a" material="opacity: 0.95">
                    <a-box position="0 0 -0.01" width="3.25" height="1.85" depth="0.01" color="#f59e0b"></a-box>
                    <a-text value="MISI SELESAI" align="center" color="#facc15" position="0 0.4 0.02" scale="0.8 0.8 0.8"></a-text>
                    <a-text value="Anda berhasil mengamankan sistem\ndan menghindari serangan Phishing." align="center" color="#e2e8f0" position="0 0 0.02" scale="0.35 0.35 0.35"></a-text>
                    <a-box position="0 -0.4 0.02" width="2.5" height="0.3" depth="0.02" color="#f59e0b" className="clickable" onClick={() => {
                        window.location.reload(); 
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