import React, { useState, useRef, useEffect } from 'react';

const LOCKER_Z_POSITIONS = [-5, -9, -13, -17];

function Locker({ position, rotation, hasButton, activated, onActivate }) {
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
                    onClick={toggleDoor}
                ></a-box>
                <a-box position="0.68 0 0.03" width="0.04" height="0.15" depth="0.04"
                    color="#4b5563" material="roughness: 0.3; metalness: 0.7"></a-box>
            </a-entity>

            {isOpen && hasButton && !activated && (
                <a-entity position="0 1.35 -0.05">
                    <a-box className="clickable" width="0.32" height="0.32" depth="0.15" color="#16a34a"
                        animation__hover="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; dur: 200"
                        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                        animation__pulse="property: material.emissiveIntensity; from: 0.5; to: 1.3; dur: 700; loop: true; dir: alternate"
                        material="emissive: #16a34a; emissiveIntensity: 0.8"
                        onClick={(e) => { e.stopPropagation(); onActivate(); }}
                    ></a-box>
                    <a-text value="AKTIFKAN" position="0 -0.32 0" align="center" color="#4ade80" scale="0.25 0.25 0.25"></a-text>
                </a-entity>
            )}

            {isOpen && hasButton && activated && (
                <a-text value="AKTIF" position="0 1.35 -0.05" align="center" color="#4ade80" scale="0.3 0.3 0.3"></a-text>
            )}

            {isOpen && !hasButton && (
                <a-text value="KOSONG" position="0 1.35 -0.05" align="center" color="#64748b" scale="0.25 0.25 0.25"></a-text>
            )}

            <a-sphere position="0.3 2.4 0.13" radius="0.02"
                material={`color: ${isOpen ? "#00ff00" : "#ff4444"}; emissive: ${isOpen ? "#00ff00" : "#ff4444"}; emissiveIntensity: 2`}></a-sphere>
        </a-entity>
    );
}

export default function RakshaExpertCorridor({ onExitToLobby }) {
    const [correctLocker] = useState(() => Math.floor(Math.random() * LOCKER_Z_POSITIONS.length));
    const [activated, setActivated] = useState(false);
    const [exitUnlocked, setExitUnlocked] = useState(false);

    useEffect(() => {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl && sceneEl.emit) {
            sceneEl.emit('refresh-solids');
        }
    }, [exitUnlocked]);

    const handleActivate = () => {
        if (activated) return;
        setActivated(true);
        setTimeout(() => {
            setExitUnlocked(true);
            setTimeout(() => {
                onExitToLobby();
            }, 900);
        }, 500);
    };

    return (
        <a-entity id="raksha-expert-corridor">
            <a-light type="ambient" color="#b0b8c4" intensity="0.35"></a-light>
            <a-light type="point" color="#e0e4ec" intensity="0.5" position="0 4.5 -8" distance="14" decay="2"></a-light>
            <a-light type="point" color="#e0e4ec" intensity="0.4" position="0 4.5 -16" distance="14" decay="2"></a-light>
            <a-light type="point" color="#4ade80" intensity="0.4" position="0 4.5 -21" distance="10" decay="2"></a-light>

            <a-plane position="0 0 -11" rotation="-90 0 0" width="5" height="24"
                material="src: #tex-office-floor; repeat: 2 9; roughness: 0.6"></a-plane>

            <a-box class="solid" position="-2.5 2.5 -11" width="0.2" height="5" depth="24"
                material="src: #tex-office-wall-inner-hd; repeat: 9 2; roughness: 0.75"></a-box>
            <a-box class="solid" position="2.5 2.5 -11" width="0.2" height="5" depth="24"
                material="src: #tex-office-wall-inner-hd; repeat: 9 2; roughness: 0.75"></a-box>

            <a-box class="solid" position="0 4.9 -11" width="5" height="0.2" depth="24"
                material="src: #tex-office-ceiling; repeat: 2 9; roughness: 0.9"></a-box>

            <a-text value="Periksa tiap loker — hanya satu yang berisi tombol aktivasi." position="0 3.2 -2" align="center"
                color="#94a3b8" scale="0.35 0.35 0.35" width="4" wrap-count="42"></a-text>

            {LOCKER_Z_POSITIONS.map((z, i) => (
                <Locker
                    key={i}
                    position={`-2.2 0 ${z}`}
                    rotation="0 90 0"
                    hasButton={i === correctLocker}
                    activated={activated}
                    onActivate={handleActivate}
                />
            ))}

            <a-entity position="0 0 -21">
                <a-box class={exitUnlocked ? "" : "solid"} position="0 2 0" width="5" height="4" depth="0.3" color="#1e293b"></a-box>
                <a-plane position="0 1.5 0.16" width="4.2" height="3.2"
                    material="src: #tex-office-roller; roughness: 0.5"></a-plane>
                <a-text value={exitUnlocked ? "AKSES DIIZINKAN" : "MENUNGGU AKTIVASI"} position="0 3.55 0.2" align="center"
                    color={exitUnlocked ? "#4ade80" : "#f87171"} scale="0.5 0.5 0.5" wrap-count="30"></a-text>
            </a-entity>

            <a-box class="solid" position="0 2.5 -22" width="5" height="5" depth="0.2"
                material="src: #tex-office-wall-inner-hd; repeat: 2 2; roughness: 0.75"></a-box>
        </a-entity>
    );
}