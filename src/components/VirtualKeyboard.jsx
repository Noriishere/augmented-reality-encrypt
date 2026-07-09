import React from 'react';

// Sub-komponen untuk tombol huruf biasa
function KeyButton({ char, x, y, onClick }) {
  return (
    <a-entity position={`${x} ${y} 0`}>
      <a-box
        className="clickable"
        onClick={onClick}
        width="0.14" height="0.14" depth="0.02"
        color="#0f172a"
        material="transparent: true; opacity: 0.8"
        animation__hover="property: color; to: #38bdf8; startEvents: mouseenter; dur: 150"
        animation__leave="property: color; to: #0f172a; startEvents: mouseleave; dur: 150"
      >
        <a-text value={char} align="center" position="0 0 0.015" scale="0.5 0.5 0.5" color="#e2e8f0"></a-text>
      </a-box>
    </a-entity>
  );
}

// Sub-komponen untuk tombol aksi (Close, Backspace, Enter)
function ActionButton({ label, val, x, width, color, onClick }) {
  return (
    <a-entity position={`${x} 0 0`}>
      <a-box
        className="clickable"
        onClick={onClick}
        width={width} height="0.14" depth="0.02"
        color={color}
        material="transparent: true; opacity: 0.8"
        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
      >
        <a-text value={label} align="center" position="0 0 0.015" scale="0.4 0.4 0.4" color="#ffffff"></a-text>
      </a-box>
    </a-entity>
  );
}

export default function VirtualKeyboard({ position = "0 0 -1", rotation = "0 0 0", onKeyPress, currentInput, onClose }) {
  // Susunan baris QWERTY
  const row1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const row2 = ['A','S','D','F','G','H','J','K','L'];
  const row3 = ['Z','X','C','V','B','N','M'];

  return (
    <a-entity position={position} rotation={rotation}>
      
      {/* --- PANEL LATAR BELAKANG HOLOGRAM --- */}
      <a-plane position="0 -0.05 -0.05" width="2" height="1.2" color="#020617" opacity="0.6" material="transparent: true;"></a-plane>
      <a-plane position="0 -0.05 -0.06" width="2.05" height="1.25" color="#0284c7" opacity="0.3" material="transparent: true; wireframe: true"></a-plane>

      {/* --- LAYAR OUTPUT --- */}
      <a-plane position="0 0.35 0" width="1.6" height="0.25" color="#0f172a" opacity="0.9">
        <a-text
          value={currentInput.padEnd(4, '_').split('').join(' ')}
          align="center"
          color="#38bdf8"
          scale="1.5 1.5 1.5"
          position="0 0 0.01"
        ></a-text>
      </a-plane>

      {/* --- GRID TOMBOL KEYBOARD --- */}
      {/* Baris 1: Q W E R T Y U I O P */}
      <a-entity position="0 0.1 0">
        {row1.map((key, i) => (
          <KeyButton key={key} char={key} x={-0.72 + i * 0.16} y={0} onClick={() => onKeyPress(key)} />
        ))}
      </a-entity>

      {/* Baris 2: A S D F G H J K L */}
      <a-entity position="0 -0.08 0">
        {row2.map((key, i) => (
          <KeyButton key={key} char={key} x={-0.64 + i * 0.16} y={0} onClick={() => onKeyPress(key)} />
        ))}
      </a-entity>

      {/* Baris 3: Z X C V B N M */}
      <a-entity position="0 -0.26 0">
        {row3.map((key, i) => (
          <KeyButton key={key} char={key} x={-0.48 + i * 0.16} y={0} onClick={() => onKeyPress(key)} />
        ))}
      </a-entity>

      {/* Baris 4 (Aksi): Close, Backspace, Enter */}
      <a-entity position="0 -0.44 0">
        <ActionButton label="CLOSE" val="CLOSE" x="-0.55" width="0.35" color="#475569" onClick={onClose} />
        <ActionButton label="BACKSPACE" val="CLR" x="0" width="0.45" color="#ef4444" onClick={() => onKeyPress('CLR')} />
        <ActionButton label="ENTER" val="ENT" x="0.55" width="0.35" color="#22c55e" onClick={() => onKeyPress('ENT')} />
      </a-entity>

    </a-entity>
  );
}