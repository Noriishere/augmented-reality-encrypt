import React, { useState, useEffect, useRef } from 'react';

const PEDESTAL_POS = {
    public: "-3 1.1 -1",
    private: "3 1.1 -1",
};

const FX_TARGET = {
    sent: "3 0.6 -3",
    stolen: "5 0.4 -7",
};

const PILLAR_RADIUS = 4.5;

const PILLAR_POS = {
    ne: `${PILLAR_RADIUS} 0 -${PILLAR_RADIUS}`,
    se: `${PILLAR_RADIUS} 0 ${PILLAR_RADIUS}`,
    sw: `-${PILLAR_RADIUS} 0 ${PILLAR_RADIUS}`,
    nw: `-${PILLAR_RADIUS} 0 -${PILLAR_RADIUS}`,
};

const PILLAR_LABEL = {
    ne: "PROTOKOL HURUF BESAR",
    sw: "PROTOKOL HURUF KECIL",
    se: "PROTOKOL NUMERIK",
    nw: "PROTOKOL SIMBOL",
};

const PILLAR_RUNE = {
    ne: "A",
    sw: "a",
    se: "0-9",
    nw: "@#$",
};

const PILLAR_ACCENT = {
    ne: "#38bdf8",
    sw: "#a78bfa",
    se: "#f59e0b",
    nw: "#f472b6",
};

const GRID_EDGES = [
    { key: "ne-se", a: "ne", b: "se", pos: `${PILLAR_RADIUS} 0.02 0`, w: 0.15, h: PILLAR_RADIUS * 2 },
    { key: "se-sw", a: "se", b: "sw", pos: `0 0.02 ${PILLAR_RADIUS}`, w: PILLAR_RADIUS * 2, h: 0.15 },
    { key: "sw-nw", a: "sw", b: "nw", pos: `-${PILLAR_RADIUS} 0.02 0`, w: 0.15, h: PILLAR_RADIUS * 2 },
    { key: "nw-ne", a: "nw", b: "ne", pos: `0 0.02 -${PILLAR_RADIUS}`, w: PILLAR_RADIUS * 2, h: 0.15 },
];

const CRACK_ESTIMATE = ["5 DETIK", "3 MENIT", "14 JAM", "2 TAHUN", "1.4 x 10^9 TAHUN"];

const KEY_SCALE = "0.002 0.002 0.002";
const KEY_SCALE_HOVER = "0.0023 0.0023 0.0023";

const CERT_FINGERPRINT = {
    real: "4F:2A:9D:88:1C:E3",
    fake: "4F:2A:9D:88:1C:F3",
};

function ExpertRoomWalls({ radius = 10, sides = 9, debug = false }) {
    const SIDE = 2.2 * radius * Math.sin(Math.PI / sides);

    const walls = Array.from({ length: sides }, (_, i) => {
        const angleDeg = i * (360 / sides);
        const angleRad = angleDeg * Math.PI / 180;
        return {
            x: radius * Math.sin(angleRad),
            z: radius * Math.cos(angleRad),
            rotY: angleDeg,
        };
    });

    return (
        <>
            {walls.map((wall, i) => (
                <React.Fragment key={`expert-oct-${i}`}>
                    <a-box
                        class="solid"
                        position={`${wall.x} 2.5 ${wall.z}`}
                        rotation={`0 ${wall.rotY} 0`}
                        width={SIDE - 0.20}
                        height="5"
                        depth="0.1"
                        visible="false"
                    />
                    {debug && (
                        <a-box
                            position={`${wall.x} 2.5 ${wall.z}`}
                            rotation={`0 ${wall.rotY} 0`}
                            width={SIDE - 0.15}
                            height="5"
                            depth="0.1"
                            material="wireframe: true; color: red;"
                        />
                    )}
                </React.Fragment>
            ))}
        </>
    );
}

function ExitLocker({ position, rotation, isOpen, onActivate }) {
    const hingeRef = useRef(null);

    useEffect(() => {
        const hinge = hingeRef.current;
        if (!hinge) return;
        hinge.emit(isOpen ? 'door-open' : 'door-close');
    }, [isOpen]);

    return (
        <a-entity position={position} rotation={rotation}>
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
                    material="src: #tex-locker-front; roughness: 0.5; metalness: 0.4"
                    animation__hover="property: scale; to: 1.02 1.02 1.02; startEvents: mouseenter; dur: 150"
                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
                    onClick={isOpen ? undefined : onActivate}
                ></a-box>
                <a-box position="0.68 0 0.03" width="0.04" height="0.15" depth="0.04"
                    color="#4b5563" material="roughness: 0.3; metalness: 0.7"></a-box>
            </a-entity>

            <a-sphere position="0.3 2.4 0.13" radius="0.02"
                material={`color: ${isOpen ? "#00ff00" : "#ff4444"}; emissive: ${isOpen ? "#00ff00" : "#ff4444"}; emissiveIntensity: 2`}></a-sphere>

            <a-text value={isOpen ? "AKSES DIBUKA" : "TEKAN UNTUK MEMBUKA GERBANG"} position="0 2.7 0" align="center"
                color={isOpen ? "#4ade80" : "#facc15"} scale="0.3 0.3 0.3" width="2.5"></a-text>
        </a-entity>
    );
}

export default function RakshaExpertRoom1({ onEnterCorridor }) {
    const [stage, setStage] = useState('intro');
    const [feedback, setFeedback] = useState("");
    const [isError, setIsError] = useState(false);

    const [handshakeFx, setHandshakeFx] = useState(null);

    const [certSides, setCertSides] = useState({ left: 'real', right: 'fake' });
    const [certFx, setCertFx] = useState(null);

    const [pillars, setPillars] = useState({ ne: false, se: false, sw: false, nw: false });
    const activeCount = Object.values(pillars).filter(Boolean).length;
    const crackLabel = CRACK_ESTIMATE[activeCount];
    const allActive = activeCount === 4;

    const [lockerOpen, setLockerOpen] = useState(false);
    const [exitUnlocked, setExitUnlocked] = useState(false);

    const alarmActive = stage !== 'reflection' && stage !== 'corridor';

    useEffect(() => {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl && sceneEl.emit) {
            sceneEl.emit('refresh-solids');
        }
    }, [stage]);

    useEffect(() => {
        if (stage === 'verify') {
            const realOnLeft = Math.random() < 0.5;
            setCertSides(realOnLeft ? { left: 'real', right: 'fake' } : { left: 'fake', right: 'real' });
        }
    }, [stage]);

    const handleAnswer = (correct, nextStage, errorMessage) => {
        if (correct) {
            setIsError(false);
            setFeedback("TINDAKAN BERHASIL! Memproses tahap selanjutnya...");
            setTimeout(() => {
                setFeedback("");
                setStage(nextStage);
            }, 2000);
        } else {
            setIsError(true);
            setFeedback(errorMessage);
            setTimeout(() => setFeedback(""), 3500);
        }
    };

    const pickPedestal = (type) => {
        if (feedback || handshakeFx) return;

        if (type === 'public') {
            setHandshakeFx('sent');
            setTimeout(() => setHandshakeFx(null), 1800);
            handleAnswer(true, 'verify', "");
        } else {
            setHandshakeFx('stolen');
            setTimeout(() => setHandshakeFx(null), 1800);
            handleAnswer(
                false,
                'handshake',
                "[ FATAL ERROR ]\nKunci Privatmu dicuri Peretas! Kunci Privat TIDAK BOLEH pernah meninggalkan perangkatmu — hanya Kunci Publik yang boleh dikirim ke Markas."
            );
        }
    };

    const pickCertificate = (side) => {
        if (feedback || certFx) return;
        const type = certSides[side];

        if (type === 'real') {
            setCertFx('accepted');
            setTimeout(() => setCertFx(null), 1800);
            handleAnswer(true, 'firewall', "");
        } else {
            setCertFx('compromised');
            setTimeout(() => setCertFx(null), 1800);
            handleAnswer(
                false,
                'verify',
                "[ PERINGATAN MITM ]\nFingerprint TIDAK COCOK dengan yang dikirim Markas lewat kanal aman terpisah! Kamu hampir mempercayai kunci palsu dari Peretas. Selalu cocokkan fingerprint SEBELUM percaya pada sebuah kunci publik."
            );
        }
    };

    const activatePillar = (dir) => {
        if (feedback || pillars[dir]) return;
        setPillars(prev => ({ ...prev, [dir]: true }));
    };

    const triggerLockdown = () => {
        if (feedback || !allActive) return;
        handleAnswer(true, 'reflection', "");
    };

    const enterCorridor = () => {
        setStage('corridor');
    };

    const activateExitLocker = () => {
        if (lockerOpen) return;
        setLockerOpen(true);
        setTimeout(() => {
            setExitUnlocked(true);
            setTimeout(() => {
                onInteractTerminal();
            }, 900);
        }, 500);
    };

    return (
        <a-entity id="raksha-expert-room-1">
            {alarmActive ? (
                <>
                    <a-light type="ambient" color="#1e1b4b" intensity="0.3"></a-light>
                    <a-light type="point" color="#dc2626" position="0 4 0" distance="15"
                        animation__blink="property: intensity; from: 0.15; to: 0.9; dur: 550; loop: true; dir: alternate"></a-light>
                    <a-light type="point" color="#4f46e5" intensity="0.3" position="0 2 -6" distance="10"></a-light>
                </>
            ) : (
                <>
                    <a-light type="ambient" color="#0c4a6e" intensity="0.6"></a-light>
                    <a-light type="point" color="#38bdf8" intensity="0.7" position="0 4 0" distance="15"></a-light>
                </>
            )}

            <a-plane position="0 0.01 0" rotation="-90 0 0" width="20" height="30"
                color="#020617" material="roughness: 0.2; metalness: 0.8"></a-plane>
            <a-cylinder position="0 2.5 0" radius="11" height="5" side="back"
                color="#0f172a" material="roughness: 0.7"></a-cylinder>

            <ExpertRoomWalls radius={10} sides={8} />

            {stage === 'intro' && (
                <>
                    <a-text value="[ CEGATAN HACKER TERDETEKSI ]" position="-6 3 -6" rotation="0 40 0"
                        color="#ef4444" scale="1.2 1.2 1.2" align="center"
                        animation="property: opacity; from: 1; to: 0.25; dur: 450; loop: true; dir: alternate"></a-text>
                    <a-text value="[ JALUR KOMUNIKASI TIDAK AMAN ]" position="6 3 -6" rotation="0 -40 0"
                        color="#ef4444" scale="1.2 1.2 1.2" align="center"
                        animation="property: opacity; from: 1; to: 0.25; dur: 450; loop: true; dir: alternate"></a-text>
                </>
            )}

            <a-entity position="0 0 -4">
                <a-box class="solid" position="0 0.8 0" width="3" height="0.1" depth="1" color="#1e293b"></a-box>
                <a-cylinder class="solid" position="0 0.4 0" radius="0.4" height="0.8" color="#020617"></a-cylinder>

                <a-entity position="0 2 0" rotation="-10 0 0">
                    <a-plane width="4" height="2.2" color={isError ? "#450a0a" : "#0f172a"} opacity="0.95"
                        material="transparent: true"></a-plane>
                    <a-plane position="0 0 -0.01" width="4.1" height="2.3" color={isError ? "#dc2626" : "#4f46e5"} opacity="0.5"
                        material="transparent: true; wireframe: true"></a-plane>

                    {feedback && (
                        <a-text value={feedback} position="0 0 0.05" align="center" width="3.5"
                            color={isError ? "#f87171" : "#4ade80"} wrap-count="40"></a-text>
                    )}

                    {stage === 'intro' && !feedback && (
                        <a-entity>
                            <a-text value="[ PROTOKOL PERTAHANAN AKTIF ]" position="0 0.7 0.02" align="center" color="#ef4444" scale="0.5 0.5 0.5"></a-text>
                            <a-text value="Markas Pusat akan mengirim kunci enkripsi lewat jalur yang sedang disadap Peretas. Amankan pertukaran kunci, verifikasi keasliannya, lalu tahan serangan Brute-Force!"
                                position="0 0.2 0.02" align="center" width="3.5" color="#f8fafc" wrap-count="45"></a-text>
                            <a-entity position="0 -0.6 0.02">
                                <a-box width="1.8" height="0.4" depth="0.05" color="#dc2626" class="clickable"
                                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                                    onClick={() => setStage('handshake')}></a-box>
                                <a-text value="MULAI PERTAHANAN" position="0 0 0.03" align="center" color="#ffffff" scale="0.4 0.4 0.4"></a-text>
                            </a-entity>
                        </a-entity>
                    )}

                    {stage === 'handshake' && !feedback && (
                        <a-entity>
                            <a-text value="TAHAP 1: SERAH TERIMA KUNCI" position="0 0.75 0.02" align="center" color="#38bdf8" scale="0.38 0.38 0.38"></a-text>
                            <a-text value="Lihat ke kiri dan kanan. Kirim kunci yang BOLEH dibagikan ke Markas — jangan sampai salah pilih."
                                position="0 0.35 0.02" align="center" width="3.5" color="#f8fafc" wrap-count="50"></a-text>
                        </a-entity>
                    )}

                    {stage === 'verify' && !feedback && (
                        <a-entity>
                            <a-text value="TAHAP 2: VERIFIKASI SERTIFIKAT" position="0 0.75 0.02" align="center" color="#38bdf8" scale="0.38 0.38 0.38"></a-text>
                            <a-text value={`Fingerprint ASLI dari Markas (dikirim lewat kanal aman terpisah):\n${CERT_FINGERPRINT.real}`}
                                position="0 0.3 0.02" align="center" width="3.5" color="#4ade80" wrap-count="48" scale="0.9 0.9 0.9"></a-text>
                            <a-text value="Dua kunci publik masuk lewat jaringan utama. Cocokkan fingerprint di kedua pedestal SEBELUM memilih. Salah pilih = kunci jatuh ke tangan Peretas (MITM)."
                                position="0 -0.2 0.02" align="center" width="3.5" color="#f8fafc" wrap-count="55"></a-text>
                        </a-entity>
                    )}

                    {stage === 'firewall' && !feedback && (
                        <a-entity>
                            <a-text value="TAHAP 3: FIREWALL GRID — AKTIFKAN 4 PILAR DI PENJURU RUANGAN" position="0 0.70 0.02" align="center" color="#38bdf8" scale="0.80 0.80 0.80" wrap-count="62"></a-text>
                            <a-text value={`ESTIMASI JEBOL: ${crackLabel}`} position="0 0.4 0.02" align="center"
                                color={allActive ? "#4ade80" : "#f87171"} scale="0.42 0.42 0.42"></a-text>
                            <a-text value={`Pilar aktif: ${activeCount}/4`} position="0 0.05 0.02" align="center"
                                color="#94a3b8" scale="0.80 0.80 0.80"></a-text>
                            <a-entity position={`${PILLAR_RADIUS + 2.1} -3 ${PILLAR_RADIUS + 1.5}`} rotation="0 10 0">
                                <a-gltf-model
                                    src="#model-hacker"
                                    scale="0.003 0.003 0.003"
                                    position="0 0 0"
                                    animation__breathe="property: position; to: 0 0.08 0; dir: alternate; loop: true; dur: 2200; easing: easeInOutSine"
                                ></a-gltf-model>

                                <a-light type="point" color="#dc2626" intensity="0.6" distance="3" position="0 1.5 0.5"
                                    animation__flicker="property: intensity; from: 0.3; to: 0.8; dur: 300; loop: true; dir: alternate"></a-light>

                                <a-sphere position="0.08 1.65 0.35" radius="0.02" color="#ef4444"
                                    material="emissive: #ef4444; emissiveIntensity: 3"></a-sphere>
                                <a-sphere position="-0.08 1.65 0.35" radius="0.02" color="#ef4444"
                                    material="emissive: #ef4444; emissiveIntensity: 3"></a-sphere>

                                <a-text value="[ PERETAS TERDETEKSI ]" position="0 2.3 0" align="center"
                                    color="#ef4444" scale="0.5 0.5 0.5"
                                    animation="property: opacity; from: 1; to: 0.2; dur: 500; loop: true; dir: alternate"></a-text>
                            </a-entity>
                            {allActive ? (
                                <a-entity position="0 -0.5 0.02">
                                    <a-box width="2" height="0.4" depth="0.05" color="#16a34a" class="clickable"
                                        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                                        onClick={triggerLockdown}></a-box>
                                    <a-text value="LOCKDOWN" position="0 0 0.03" align="center" color="#ffffff" scale="0.4 0.4 0.4"></a-text>
                                </a-entity>
                            ) : (
                                <a-text value="Berbalik dan klik tiap pilar sirkuit di empat penjuru ruangan untuk menyalakannya."
                                    position="0 -0.5 0.02" align="center" color="#facc15" width="3.5" scale="0.80 0.80 0.80" wrap-count="55"></a-text>
                            )}
                        </a-entity>
                    )}

                    {stage === 'reflection' && !feedback && (
                        <a-entity>
                            <a-text value="[ LOG REFLEKSI KADET ]" position="0 0.8 0.02" align="center" color="#4ade80" scale="0.5 0.5 0.5"></a-text>
                            <a-text value="1. Bencana Wi-Fi Publik: Di jaringan terbuka, siapapun bisa menyadap data.\n2. Kunci Asimetris: 'Kunci Publik' dibagikan bebas agar orang bisa mengunci pesan untukmu. Tapi hanya 'Kunci Privat' di tanganmu yang bisa membukanya.\n3. Man-in-the-Middle: Sebelum percaya pada kunci publik siapapun, cocokkan dulu fingerprint-nya lewat kanal terpisah — jangan langsung percaya begitu saja.\n4. Brute-Force: Peretas memakai mesin penebak sandi. Kombinasi simbol, angka, & huruf besar-kecil membuat mesin butuh miliaran tahun untuk menebaknya."
                                position="-1.7 0.1 0.02" align="left" width="3.6" color="#94a3b8" wrap-count="50"></a-text>

                            <a-entity position="0 -0.7 0.02">
                                <a-box width="2" height="0.4" depth="0.05" color="#16a34a" class="clickable"
                                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                                    onClick={onEnterCorridor}></a-box>
                                <a-text value="BUKA GERBANG KELUAR" position="0 0 0.03" align="center" color="#ffffff" scale="0.4 0.4 0.4"></a-text>
                            </a-entity>
                        </a-entity>
                    )}

                    {stage === 'corridor' && !feedback && (
                        <a-entity>
                            <a-text value="GERBANG TERBUKA" position="0 0.4 0.02" align="center" color="#4ade80" scale="0.5 0.5 0.5"></a-text>
                            <a-text value="Lanjutkan ke lorong keluar di belakangmu." position="0 0 0.02" align="center" width="3.5" color="#f8fafc" wrap-count="50"></a-text>
                        </a-entity>
                    )}
                </a-entity>
            </a-entity>

            {stage === 'handshake' && (
                <>
                    <a-entity position={PEDESTAL_POS.public}>
                        <a-cylinder class="solid" radius="0.35" height="1.1" position="0 -0.55 0" color="#0c4a6e"></a-cylinder>
                        {!handshakeFx && (
                            <a-gltf-model class="clickable" src="#model-key-pub" scale={KEY_SCALE} position="0 0.6 0"
                                onClick={() => pickPedestal('public')}
                                animation__hover={`property: scale; to: ${KEY_SCALE_HOVER}; startEvents: mouseenter; dur: 200`}
                                animation__leave={`property: scale; to: ${KEY_SCALE}; startEvents: mouseleave; dur: 200`}
                                animation__float="property: position; to: 0 0.7 0; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine">
                            </a-gltf-model>
                        )}
                        <a-text value="[ KUNCI PUBLIK ]" position="0 0.1 0" align="center" color="#38bdf8" scale="0.4 0.4 0.4"></a-text>
                    </a-entity>

                    <a-entity position={PEDESTAL_POS.private}>
                        <a-cylinder class="solid" radius="0.35" height="1.1" position="0 -0.55 0" color="#7f1d1d"></a-cylinder>
                        {!handshakeFx && (
                            <a-gltf-model class="clickable" src="#model-key-pub" scale={KEY_SCALE} position="0 0.6 0"
                                onClick={() => pickPedestal('private')}
                                animation__hover={`property: scale; to: ${KEY_SCALE_HOVER}; startEvents: mouseenter; dur: 200`}
                                animation__leave={`property: scale; to: ${KEY_SCALE}; startEvents: mouseleave; dur: 200`}
                                animation__float="property: position; to: 0 0.7 0; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine">
                            </a-gltf-model>
                        )}
                        <a-text value="[ KUNCI PRIVAT - RAHASIA ]" position="0 0.1 0" align="center" color="#f43f5e" scale="0.35 0.35 0.35"></a-text>
                    </a-entity>

                    {handshakeFx === 'sent' && (
                        <a-entity position={PEDESTAL_POS.public}>
                            <a-gltf-model src="#model-key-pub" position="0 0.6 0" scale={KEY_SCALE}
                                animation={`property: position; to: ${FX_TARGET.sent}; dur: 1500; easing: easeInQuad`}
                                animation__fade="property: scale; to: 0.0001 0.0001 0.0001; dur: 1500; easing: easeInQuad"></a-gltf-model>
                        </a-entity>
                    )}

                    {handshakeFx === 'stolen' && (
                        <a-entity position={PEDESTAL_POS.private}>
                            <a-gltf-model src="#model-key-pub" position="0 0.6 0" scale={KEY_SCALE}
                                animation={`property: position; to: ${FX_TARGET.stolen}; dur: 1200; easing: easeInQuad`}
                                animation__fade="property: scale; to: 0.0001 0.0001 0.0001; dur: 1200; easing: easeInQuad"></a-gltf-model>
                        </a-entity>
                    )}
                </>
            )}

            {stage === 'verify' && (
                <>
                    {['left', 'right'].map((side) => {
                        const pos = side === 'left' ? PEDESTAL_POS.public : PEDESTAL_POS.private;
                        const type = certSides[side];
                        const fingerprint = CERT_FINGERPRINT[type];
                        return (
                            <a-entity key={side} position={pos}>
                                <a-cylinder class="solid" radius="0.35" height="1.1" position="0 -0.55 0" color="#1e3a5f"></a-cylinder>
                                {!certFx && (
                                    <a-gltf-model class="clickable" src="#model-key-pub" scale={KEY_SCALE} position="0 0.6 0"
                                        onClick={() => pickCertificate(side)}
                                        animation__hover={`property: scale; to: ${KEY_SCALE_HOVER}; startEvents: mouseenter; dur: 200`}
                                        animation__leave={`property: scale; to: ${KEY_SCALE}; startEvents: mouseleave; dur: 200`}
                                        animation__float="property: position; to: 0 0.7 0; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine">
                                    </a-gltf-model>
                                )}
                                <a-text value={`FINGERPRINT:\n${fingerprint}`} position="0 0.1 0" align="center" color="#facc15" scale="0.26 0.26 0.26"></a-text>
                            </a-entity>
                        );
                    })}

                    {certFx === 'accepted' && (
                        <a-entity position={certSides.left === 'real' ? PEDESTAL_POS.public : PEDESTAL_POS.private}>
                            <a-gltf-model src="#model-key-pub" position="0 0.6 0" scale={KEY_SCALE}
                                animation={`property: position; to: ${FX_TARGET.sent}; dur: 1500; easing: easeInQuad`}
                                animation__fade="property: scale; to: 0.0001 0.0001 0.0001; dur: 1500; easing: easeInQuad"></a-gltf-model>
                        </a-entity>
                    )}

                    {certFx === 'compromised' && (
                        <a-entity position={certSides.left === 'fake' ? PEDESTAL_POS.public : PEDESTAL_POS.private}>
                            <a-gltf-model src="#model-key-pub" position="0 0.6 0" scale={KEY_SCALE}
                                animation={`property: position; to: ${FX_TARGET.stolen}; dur: 1200; easing: easeInQuad`}
                                animation__fade="property: scale; to: 0.0001 0.0001 0.0001; dur: 1200; easing: easeInQuad"></a-gltf-model>

                            <a-entity position="1.5 0 -2" rotation="0 200 0">
                                <a-gltf-model src="#model-hacker" scale="0.0028 0.0028 0.0028"
                                    animation__breathe="property: position; to: 0 0.08 0; dir: alternate; loop: true; dur: 1800; easing: easeInOutSine">
                                </a-gltf-model>
                                <a-text value="[ MITM BERHASIL! ]" position="0 2.1 0" align="center" color="#ef4444" scale="0.5 0.5 0.5"
                                    animation="property: opacity; from: 1; to: 0.2; dur: 400; loop: true; dir: alternate"></a-text>
                            </a-entity>
                        </a-entity>
                    )}
                </>
            )}

            {stage === 'firewall' && (
                <>
                    {GRID_EDGES.map(edge => {
                        const edgeActive = pillars[edge.a] && pillars[edge.b];
                        return (
                            <a-plane key={edge.key} position={edge.pos} rotation="-90 0 0"
                                width={edge.w} height={edge.h}
                                color={edgeActive ? "#4ade80" : "#1e293b"}
                                opacity={edgeActive ? 0.7 : 0.25}
                                material="transparent: true; shader: flat; side: double"
                                animation__pulse={edgeActive ? "property: opacity; from: 0.4; to: 0.85; dur: 700; loop: true; dir: alternate" : ""}>
                            </a-plane>
                        );
                    })}

                    {Object.entries(PILLAR_POS).map(([dir, pos]) => {
                        const active = pillars[dir];
                        const accent = active ? "#4ade80" : PILLAR_ACCENT[dir];
                        return (
                            <a-entity key={dir} position={pos}>
                                <a-cylinder class="solid" radius="0.3" height="1.4" position="0 0.7 0"
                                    color="#1e293b" material="metalness: 0.6; roughness: 0.4"></a-cylinder>

                                <a-torus radius="0.42" radius-tubular="0.035" position="0 1.4 0" rotation="90 0 0"
                                    color={accent}
                                    animation__spin="property: rotation; to: 90 360 0; loop: true; dur: 7000; easing: linear">
                                </a-torus>

                                <a-box class="clickable" width="0.4" height="0.4" depth="0.4" position="0 1.55 0"
                                    color={active ? "#16a34a" : "#475569"}
                                    onClick={() => activatePillar(dir)}
                                    animation__hover="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; dur: 200"
                                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200">
                                </a-box>

                                {active && (
                                    <a-light type="point" color="#4ade80" intensity="0.8" distance="4" position="0 1.7 0"></a-light>
                                )}

                                <a-text value={PILLAR_LABEL[dir] + (active ? " ✓" : "")} position="0 1.95 0" align="center"
                                    color={active ? "#4ade80" : "#f8fafc"} scale="0.32 0.32 0.32" width="3"></a-text>

                                <a-text value={PILLAR_RUNE[dir]} position="0 2.45 0" align="center"
                                    color={accent} scale="0.9 0.9 0.9"
                                    animation__float="property: position; to: 0 2.6 0; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine">
                                </a-text>

                                {active && (
                                    <a-cylinder radius="0.05" height="3" position="0 3.4 0" color="#4ade80"
                                        opacity="0.6" material="transparent: true; shader: flat"
                                        animation__pulse="property: opacity; from: 0.3; to: 0.75; dur: 500; loop: true; dir: alternate">
                                    </a-cylinder>
                                )}
                            </a-entity>
                        );
                    })}

                    {allActive && (
                        <a-sphere position="0 2 -4" radius="4.2" color="#4ade80" opacity="0.12"
                            material="transparent: true; wireframe: true; side: double"
                            animation__pulse="property: opacity; from: 0.08; to: 0.28; dur: 1200; loop: true; dir: alternate"
                            animation__grow="property: scale; from: 0.85 0.85 0.85; to: 1 1 1; dur: 900; easing: easeOutElastic">
                        </a-sphere>
                    )}
                </>
            )}

            {stage === 'firewall' && !allActive && (
                <a-cylinder position="0 2.5 -4" radius={String(3 - activeCount * 0.05)} height="5"
                    color="#ef4444" opacity="0.5" material="transparent: true; shader: flat"
                    animation="property: opacity; from: 0.25; to: 0.6; dur: 350; loop: true; dir: alternate"></a-cylinder>
            )}

            <a-entity position="0 0 -9">
                <a-box class={stage === 'corridor' ? "" : "solid"} position="0 2 0" width="15" height="9" depth="0.2" color="#1e293b"></a-box>
                <a-plane position="0 1.5 0.11" width="3.6" height="3" color="#334155" visible={stage !== 'corridor'}></a-plane>
                <a-text value={stage === 'corridor' ? "GERBANG TERBUKA" : (stage === 'reflection' ? "AKSES DIIZINKAN" : "AKSES TERKUNCI")} position="0 3.3 0.12" align="center"
                    color={stage === 'corridor' || stage === 'reflection' ? "#4ade80" : "#ef4444"} scale="0.6 0.6 0.6"></a-text>
            </a-entity>

            {stage === 'corridor' && (
                <a-entity id="expert-exit-corridor">
                    <a-light type="ambient" color="#b0b8c4" intensity="0.35"></a-light>
                    <a-light type="point" color="#e0e4ec" intensity="0.5" position="0 4.5 -14" distance="14" decay="2"></a-light>
                    <a-light type="point" color="#4ade80" intensity="0.4" position="0 4.5 -22" distance="12" decay="2"></a-light>

                    <a-plane position="0 0.01 -17" rotation="-90 0 0" width="5" height="18"
                        material="src: #tex-office-floor; repeat: 2 6; roughness: 0.6"></a-plane>
                    <a-box class="solid" position="-2.5 2.5 -17" width="0.2" height="5" depth="18"
                        material="src: #tex-office-wall-inner-hd; repeat: 6 2; roughness: 0.75"></a-box>
                    <a-box class="solid" position="2.5 2.5 -17" width="0.2" height="5" depth="18"
                        material="src: #tex-office-wall-inner-hd; repeat: 6 2; roughness: 0.75"></a-box>
                    <a-box class="solid" position="0 4.9 -17" width="5" height="0.2" depth="18"
                        material="src: #tex-office-ceiling; repeat: 2 6; roughness: 0.9"></a-box>

                    <ExitLocker
                        position="-2.2 0 -18"
                        rotation="0 90 0"
                        isOpen={lockerOpen}
                        onActivate={activateExitLocker}
                    />

                    <a-entity position="0 0 -25">
                        <a-box class="solid" position="0 2 0" width="5" height="4" depth="0.3" color="#1e293b"></a-box>
                        <a-plane position="0 1.5 0.16" width="4.2" height="3.2"
                            material="src: #tex-office-roller; roughness: 0.5"></a-plane>
                        <a-text value={exitUnlocked ? "AKSES DIIZINKAN" : "MENUNGGU AKTIVASI"} position="0 3.55 0.2" align="center"
                            color={exitUnlocked ? "#4ade80" : "#f87171"} scale="0.5 0.5 0.5" wrap-count="30"></a-text>
                    </a-entity>
                </a-entity>
            )}
        </a-entity>
    );
}