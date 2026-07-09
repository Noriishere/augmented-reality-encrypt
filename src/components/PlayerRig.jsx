import { useEffect, useRef } from 'react';

// Free movement dengan collision detection yang lebih robust
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
            this.solidCache = []; // cache elemen solid, di-refresh berkala
            this.frameCount = 0;

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
            this.rig = document.getElementById('rig') || this.el;

            // Refresh daftar solid setelah scene selesai load,
            // supaya nggak query di saat mesh belum ke-attach
            this.el.sceneEl.addEventListener('loaded', () => this.refreshSolids());
            // fallback kalau scene sudah loaded duluan
            if (this.el.sceneEl.hasLoaded) this.refreshSolids();
        },
        refreshSolids: function () {
            const nodes = document.querySelectorAll('.solid');
            console.log('[free-move] solid elements found:', nodes.length);
            this.solidCache = Array.from(nodes).filter(el => {
                if (!el.object3D) {
                    console.warn('[free-move] elemen solid tanpa object3D:', el);
                    return false;
                }
                return true;
            });
        },
        remove: function () {
            window.removeEventListener('keydown', this.onKeyDown);
            window.removeEventListener('keyup', this.onKeyUp);
        },
        tick: function () {
            if (!this.data.enabled) return;

            // Refresh cache tiap ~2 detik (jaga-jaga kalau ada room berganti / elemen baru muncul)
            this.frameCount++;
            if (this.frameCount % 180 === 0) this.refreshSolids();

            const s = this.data.speed;
            let mx = 0, mz = 0;

            if (this.keys['KeyW'] || this.keys['ArrowUp']) mz = -s;
            if (this.keys['KeyS'] || this.keys['ArrowDown']) mz = s;
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) mx = -s;
            if (this.keys['KeyD'] || this.keys['ArrowRight']) mx = s;

            if (Math.abs(this.axisX) > 0.01 || Math.abs(this.axisZ) > 0.01) {
                mx = this.axisX * s;
                mz = this.axisZ * s;
            }

            const rotY = this.el.object3D.rotation.y;
            const moveX = mx * Math.cos(rotY) + mz * Math.sin(rotY);
            const moveZ = mz * Math.cos(rotY) - mx * Math.sin(rotY);

            this.velocity.x += (moveX - this.velocity.x) * 0.3;
            this.velocity.z += (moveZ - this.velocity.z) * 0.3;

            // =======================================================
            // SISTEM TABRAKAN
            // =======================================================
            const pos = this.rig.object3D.position;

            // Pastikan matrix world ter-update dulu sebelum bikin Box3
            // (jaga-jaga kalau tick berjalan sebelum render loop update matrix)
            this.rig.object3D.updateMatrixWorld(true);

            const PADDING = 0.05; // epsilon supaya nggak "lolos" antar-frame
            const playerBoxX = new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(pos.x + this.velocity.x, 1, pos.z),
                new THREE.Vector3(0.5 + PADDING, 2, 0.5 + PADDING)
            );
            const playerBoxZ = new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(pos.x, 1, pos.z + this.velocity.z),
                new THREE.Vector3(0.5 + PADDING, 2, 0.5 + PADDING)
            );

            let collideX = false;
            let collideZ = false;

            for (let i = 0; i < this.solidCache.length; i++) {
                const el = this.solidCache[i];
                if (!el.object3D) continue;

                el.object3D.updateMatrixWorld(true);
                const solidBox = new THREE.Box3().setFromObject(el.object3D);

                // skip box yang kosong/invalid (mesh belum siap)
                if (solidBox.isEmpty()) continue;

                if (playerBoxX.intersectsBox(solidBox)) collideX = true;
                if (playerBoxZ.intersectsBox(solidBox)) collideZ = true;
            }

            if (collideX) this.velocity.x = 0;
            if (collideZ) this.velocity.z = 0;
            // =======================================================

            pos.x += this.velocity.x;
            pos.z += this.velocity.z;

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