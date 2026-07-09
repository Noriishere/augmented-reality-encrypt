import { useEffect, useRef } from 'react';

// Free movement custom component
if (typeof AFRAME !== 'undefined' && !AFRAME.components['free-move']) {
    AFRAME.registerComponent('free-move', {
        schema: {
            speed: { default: 0.1 },
            enabled: { default: true }
        },
        init: function () {
            this.keys = {};
            this.velocity = { x: 0, z: 0 };
            this.axisX = 0;
            this.axisZ = 0;
            this.onKeyDown = (e) => { this.keys[e.code] = true; };
            this.onKeyUp = (e) => { this.keys[e.code] = false; };
            window.addEventListener('keydown', this.onKeyDown);
            window.addEventListener('keyup', this.onKeyUp); 
            this.el.addEventListener('axismove', (e) => {
                const axis = e.detail.axis;
                this.axisX = Math.abs(axis[0]) > 0.1 ? axis[0] : 0;
                this.axisZ = Math.abs(axis[1]) > 0.1 ? axis[1] : 0;
            });
            this.el.addEventListener('thumbstickmoved', (e) => {
                this.axisX = Math.abs(e.detail.x) > 0.1 ? e.detail.x : 0;
                this.axisZ = Math.abs(e.detail.y) > 0.1 ? e.detail.y : 0;
            });
            
            // Mengambil entity tubuh utama (rig) agar tangan VR ikut bergerak
            this.rig = document.getElementById('rig') || this.el;
        },
        remove: function () {
            window.removeEventListener('keydown', this.onKeyDown);
            window.removeEventListener('keyup', this.onKeyUp);
        },
        tick: function () {
            if (!this.data.enabled) return;
            
            const s = this.data.speed;
            let mx = 0, mz = 0;
            
            // Input dari keyboard
            if (this.keys['KeyW'] || this.keys['ArrowUp']) mz = -s;
            if (this.keys['KeyS'] || this.keys['ArrowDown']) mz = s;
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) mx = -s;
            if (this.keys['KeyD'] || this.keys['ArrowRight']) mx = s;
            
            // Input dari controller VR
            if (Math.abs(this.axisX) > 0.01 || Math.abs(this.axisZ) > 0.01) {
                mx = this.axisX * s;
                mz = this.axisZ * s;
            }

            // --- BAGIAN YANG DIPERBAIKI (RELATIVE MOVEMENT) ---
            // 1. Ambil arah rotasi kepala/kamera saat ini
            const rotY = this.el.object3D.rotation.y;

            // 2. Gunakan Sin & Cos untuk menyesuaikan arah jalan dengan arah pandangan
            const moveX = mx * Math.cos(rotY) + mz * Math.sin(rotY);
            const moveZ = mz * Math.cos(rotY) - mx * Math.sin(rotY);

            // 3. Terapkan momentum/kehalusan jalan (velocity)
            this.velocity.x += (moveX - this.velocity.x) * 0.3;
            this.velocity.z += (moveZ - this.velocity.z) * 0.3;

            // 4. Pindahkan posisi RIG (bukan cuma kamera) agar semua ikut jalan
            this.rig.object3D.position.x += this.velocity.x;
            this.rig.object3D.position.z += this.velocity.z;

            // Rem otomatis jika tombol dilepas
            if (mx === 0 && Math.abs(this.axisX) < 0.01) this.velocity.x *= 0.85;
            if (mz === 0 && Math.abs(this.axisZ) < 0.01) this.velocity.z *= 0.85;
        }
    });
}

export default function PlayerRig({ isKeyboardOpen, onToggleKeyboard, isVRMode, vrHudTexture, onVRTerminalClick }) {
    const hudRef = useRef(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        if (hudRef.current && vrHudTexture) {
            const mesh = hudRef.current.getObject3D('mesh');
            if (mesh) { mesh.material.map = vrHudTexture; mesh.material.needsUpdate = true; }
        }
    }, [vrHudTexture]);

    useEffect(() => {
        if (!terminalRef.current || !isVRMode) return;
        const el = terminalRef.current;
        const handleClick = (e) => { e.stopPropagation(); if (onVRTerminalClick) onVRTerminalClick(); };
        el.addEventListener('click', handleClick);
        el.addEventListener('mousedown', handleClick);
        return () => { el.removeEventListener('click', handleClick); el.removeEventListener('mousedown', handleClick); };
    }, [isVRMode, onVRTerminalClick]);

    return (
        <a-entity id="rig" position="0 0 0">
            <a-camera position="0 1.6 0"
                look-controls="pointerLockEnabled: false; touchEnabled: true"
                free-move={`speed: 0.1; enabled: ${!isKeyboardOpen}`}>
                <a-cursor raycaster="objects: .clickable; far: 100" color="#22d3ee"
                    animation__click="property: scale; startEvents: click; from: 0.2 0.2 0.2; to: 1 1 1"
                    animation__mouseenter="property: scale; startEvents: mouseenter; to: 1.5 1.5 1.5"
                    animation__mouseleave="property: scale; startEvents: mouseleave; to: 1 1 1"></a-cursor>
                {isVRMode && (
                    <a-entity position="0 0.15 -0.7">
                        <a-plane ref={hudRef} width="2.2" height="1.1"
                            material="shader: flat; transparent: true; side: double; alphaTest: 0.01"></a-plane>
                        <a-box ref={terminalRef} className="clickable" position="0 -0.38 0.03"
                            width="0.6" height="0.06" depth="0.02"
                            material="color: #06b6d4; opacity: 0.04; transparent: true"
                            onClick={onVRTerminalClick}></a-box>
                    </a-entity>
                )}
            </a-camera>
            <a-entity laser-controls="hand: left" raycaster="objects: .clickable; far: 20"
                line="color: #22d3ee; opacity: 0.6"></a-entity>
            <a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 20"
                line="color: #22d3ee; opacity: 0.6"></a-entity>
        </a-entity>
    );
}