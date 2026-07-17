import React, { useEffect, useRef, useState } from "react";
import VirtualKeyboard from './VirtualKeyboard';

if (typeof AFRAME !== 'undefined' && !AFRAME.components['wire-box']) {
  AFRAME.registerComponent('wire-box', {
    schema: {
      width: { default: 1 },
      height: { default: 1 },
      depth: { default: 1 },
      color: { default: '#ff0000' }
    },
    init: function () {
      const { width, height, depth, color } = this.data;
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ color });
      const lineSegments = new THREE.LineSegments(edges, material);
      this.el.setObject3D('mesh', lineSegments);
    },
    remove: function () {
      this.el.removeObject3D('mesh');
    }
  });
}

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
      this.solidCache = [];
      this.frameCount = 0;

      this.onKeyDown = (e) => { this.keys[e.code] = true; };
      this.onKeyUp = (e) => { this.keys[e.code] = false; };
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);

      this.onAxisMove = (e) => {
        const axis = e.detail.axis;
        this.axisX = Math.abs(axis[0]) > 0.1 ? axis[0] : 0;
        this.axisZ = Math.abs(axis[1]) > 0.1 ? axis[1] : 0;
      };
      this.onThumbstickMoved = (e) => {
        this.axisX = Math.abs(e.detail.x) > 0.1 ? e.detail.x : 0;
        this.axisZ = Math.abs(e.detail.y) > 0.1 ? e.detail.y : 0;
      };

      this.el.addEventListener('axismove', this.onAxisMove);
      this.el.addEventListener('thumbstickmoved', this.onThumbstickMoved);

      this.rig = document.getElementById('rig') || this.el;

      this.controllerEls = Array.from(this.rig.querySelectorAll('[laser-controls]'));
      this.controllerEls.forEach((el) => {
        el.addEventListener('axismove', this.onAxisMove);
        el.addEventListener('thumbstickmoved', this.onThumbstickMoved);
      });

      this.el.sceneEl.addEventListener('loaded', () => this.refreshSolids());
      this.el.sceneEl.addEventListener('refresh-solids', () => {
        this.refreshSolids();
        console.log('[free-move] refreshed! total solid:', this.solidCache.length);
      });
      if (this.el.sceneEl.hasLoaded) this.refreshSolids();
    },
    refreshSolids: function () {
      const nodes = document.querySelectorAll('.solid');
      this.solidCache = Array.from(nodes).filter(el => el.object3D && el.isConnected);
    },
    remove: function () {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
      this.el.removeEventListener('axismove', this.onAxisMove);
      this.el.removeEventListener('thumbstickmoved', this.onThumbstickMoved);
      this.controllerEls.forEach((el) => {
        el.removeEventListener('axismove', this.onAxisMove);
        el.removeEventListener('thumbstickmoved', this.onThumbstickMoved);
      });
    },
    tick: function () {
      if (!this.data.enabled) return;

      this.frameCount++;
      if (this.frameCount % 180 === 0) this.refreshSolids();

      const s = this.data.speed;
      let mx = 0, mz = 0;

      let kx = 0, kz = 0;
      if (this.keys['KeyW'] || this.keys['ArrowUp']) kz -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) kz += 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) kx -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) kx += 1;

      if (kx !== 0 || kz !== 0) {
        const len = Math.sqrt(kx * kx + kz * kz);
        mx = (kx / len) * s;
        mz = (kz / len) * s;
      } else if (Math.abs(this.axisX) > 0.01 || Math.abs(this.axisZ) > 0.01) {
        mx = this.axisX * s;
        mz = this.axisZ * s;
      }

      const rotY = this.el.object3D.rotation.y;
      const moveX = mx * Math.cos(rotY) + mz * Math.sin(rotY);
      const moveZ = mz * Math.cos(rotY) - mx * Math.sin(rotY);

      this.velocity.x += (moveX - this.velocity.x) * 0.3;
      this.velocity.z += (moveZ - this.velocity.z) * 0.3;

      const pos = this.rig.object3D.position;
      this.rig.object3D.updateMatrixWorld(true);

      const PLAYER_RADIUS = 0.35;

      const hitsWall = (el, worldX, worldY, worldZ) => {
        if (!el.object3D) return false;
        el.object3D.updateMatrixWorld(true);

        const mesh = el.getObject3D('mesh');
        if (!mesh || !mesh.geometry || !mesh.geometry.parameters) return false;
        const { width = 1, height = 1, depth = 1 } = mesh.geometry.parameters;
        const halfX = width / 2, halfY = height / 2, halfZ = depth / 2;

        const invMatrix = new THREE.Matrix4().copy(el.object3D.matrixWorld).invert();
        const localPoint = new THREE.Vector3(worldX, worldY, worldZ).applyMatrix4(invMatrix);

        const clampedX = Math.max(-halfX, Math.min(halfX, localPoint.x));
        const clampedY = Math.max(-halfY, Math.min(halfY, localPoint.y));
        const clampedZ = Math.max(-halfZ, Math.min(halfZ, localPoint.z));

        const dx = localPoint.x - clampedX;
        const dy = localPoint.y - clampedY;
        const dz = localPoint.z - clampedZ;
        const distSq = dx * dx + dy * dy + dz * dz;

        return distSq < PLAYER_RADIUS * PLAYER_RADIUS;
      };

      let collideX = false;
      let collideZ = false;

      for (let i = 0; i < this.solidCache.length; i++) {
        const el = this.solidCache[i];
        if (hitsWall(el, pos.x + this.velocity.x, 1, pos.z)) collideX = true;
        if (hitsWall(el, pos.x, 1, pos.z + this.velocity.z)) collideZ = true;
      }

      if (collideX) this.velocity.x = 0;
      if (collideZ) this.velocity.z = 0;

      pos.x += this.velocity.x;
      pos.z += this.velocity.z;

      if (mx === 0) this.velocity.x *= 0.85;
      if (mz === 0) this.velocity.z *= 0.85;

      const text = document.getElementById("debug-text");
      if (text) {
        text.setAttribute("value", `XYZ ${pos.x.toFixed(2)} 0 ${pos.z.toFixed(2)}`);
      }
    }
  });
}

export default function PlayerRig({
  isKeyboardOpen,
  onToggleKeyboard,
  isVRMode,
  vrHudTexture,
  onVRTerminalClick,
  currentInput,
  handleVirtualKeyPress,
  isTransitioning,
  isWelcomeOpen
}) {
  const hudRef = useRef(null);
  const terminalRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    let id;

    const update = () => {
      const rig = document.getElementById("rig");

      if (rig) {
        const p = rig.object3D.position;
        const r = rig.object3D.rotation;

        const text = document.getElementById("debug-text");

        if (text) {
          text.setAttribute(
            "value",
            `XYZ : ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p.z.toFixed(2)}
YAW : ${THREE.MathUtils.radToDeg(r.y).toFixed(1)}`
          );
        }
      }

      id = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    if (isTransitioning) {
      circle.emit('do-fade-out');
    } else {
      circle.emit('do-fade-in');
    }
  }, [isTransitioning]);

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
        wasd-controls="enabled: false"
        look-controls="pointerLockEnabled: false; touchEnabled: false"
        free-move={`speed: 0.1; enabled: ${!isKeyboardOpen && !isWelcomeOpen}`}>

        <a-cursor raycaster="objects: .clickable; far: 100" color="#22d3ee"
          animation__click="property: scale; startEvents: click; from: 0.2 0.2 0.2; to: 1 1 1"
          animation__mouseenter="property: scale; startEvents: mouseenter; to: 1.5 1.5 1.5"
          animation__mouseleave="property: scale; startEvents: mouseleave; to: 1 1 1"></a-cursor>
        <a-text
          id="debug-text"
          position="-0.8 0.45 -1"
          color="#00ff00"
          width="2.5"
          value=""
        ></a-text>
        <a-circle
          ref={circleRef}
          position="0 0 -0.05"
          radius="1.5"
          color="#000000"
          material="shader: flat; transparent: true; opacity: 1; side: double"
          scale="0 0 0"
          animation__fadeout="property: scale; to: 2 2 2; dur: 780; easing: easeInOutSine; startEvents: do-fade-out"
          animation__fadein="property: scale; to: 0 0 0; dur: 600; easing: easeInOutSine; startEvents: do-fade-in"
        ></a-circle>
        {isVRMode && (
          <a-entity position="0 0.15 -0.7">
            <a-plane ref={hudRef} width="2.2" height="1.1"
              material="shader: flat; transparent: true; side: double; alphaTest: 0.01"></a-plane>
          </a-entity>
        )}
      </a-camera>

      <a-entity laser-controls="hand: left" raycaster="objects: .clickable; far: 20"
        line="color: #22d367; opacity: 0.6"></a-entity>
      <a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 20"
        line="color: #22d3ee; opacity: 0.6"></a-entity>
    </a-entity>
  );
}