import React from 'react';

export default function VirtualKeyboard({ position, rotation, onKeyPress, currentInput }) {
  // Layout grid untuk tombol-tombol keyboard
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['CLR', '0', 'ENT']
  ];

  return (
    <a-entity position={position} rotation={rotation}>
      
      {/* --- LAYAR OUTPUT PIN --- */}
      <a-plane 
        position="0 0.7 0" 
        width="1.2" 
        height="0.3" 
        color="#020617" 
        opacity="0.9"
      >
        <a-text 
          // Menampilkan teks yang diketik (maks 4 digit), diisi dengan '_' jika kosong
          value={currentInput.padEnd(4, '_').split('').join(' ')} 
          align="center" 
          color="#22d3ee" 
          scale="2.5 2.5 2.5"
          position="0 0 0.01"
        ></a-text>
      </a-plane>

      {/* --- GRID TOMBOL KEYBOARD --- */}
      <a-entity position="-0.4 0.3 0">
        {keys.map((row, rowIndex) => (
          row.map((key, colIndex) => {
            const isActionKey = key === 'CLR' || key === 'ENT';
            
            return (
              <a-entity 
                key={key} 
                position={`${colIndex * 0.4} ${-rowIndex * 0.3} 0`}
              >
                {/* Kotak Fisik Tombol */}
                <a-box 
                  className="clickable" // Penting agar bisa diklik/ditembak laser
                  onClick={() => onKeyPress(key)}
                  width="0.3" 
                  height="0.2" 
                  depth="0.05"
                  color={isActionKey ? "#1e293b" : "#0f172a"}
                  // Efek visual menyala saat kursor/laser menyorot tombol
                  animation__mouseenter="property: color; to: #38bdf8; startEvents: mouseenter; dur: 150"
                  animation__mouseleave={`property: color; to: ${isActionKey ? "#1e293b" : "#0f172a"}; startEvents: mouseleave; dur: 150`}
                >
                  {/* Teks di atas Tombol */}
                  <a-text 
                    value={key} 
                    align="center" 
                    position="0 0 0.026" 
                    scale="0.8 0.8 0.8"
                    color="#e2e8f0"
                  ></a-text>
                </a-box>
              </a-entity>
            )
          })
        ))}
      </a-entity>
      
    </a-entity>
  );
}