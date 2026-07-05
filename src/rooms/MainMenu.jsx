import React from 'react';

export default function MainMenu({ onSelectRoom }) {
  return (
    <a-entity id="raksha-haven">
      
      {/* A-ASSETS DIHAPUS DARI SINI, TAPI SOUND TETAP ADA */}
      <a-sound 
        src="#bgm-javanese-cyber" 
        autoplay="true" 
        loop="true" 
        volume="0.4" 
        position="0 2 -3"
      ></a-sound>

      {/* --- LINGKUNGAN (ENVIRONMENT) --- */}
      <a-sky color="#050308"></a-sky>
      
      {/* Lantai "Pendopo Cyber" - Warna kayu gelap keemasan */}
      <a-plane 
        position="0 0 -4" 
        rotation="-90 0 0" 
        width="15" 
        height="15" 
        color="#1a1105" 
        metalness="0.6"
      ></a-plane>
      
      {/* Garis batas lantai ala ukiran/batik digital (Hologram Kuning Emas) */}
      <a-entity position="0 0.01 -4" rotation="-90 0 0">
         <a-plane width="15" height="15" wireframe="true" color="#d97706"></a-plane>
      </a-entity>

      {/* --- 4. JUDUL LOBBY --- */}
      <a-text 
        value="THE RAKSHA HAVEN" 
        position="0 3.5 -5" 
        align="center" 
        color="#fbbf24" 
        scale="1.5 1.5 1.5"
      ></a-text>
      <a-text 
        value="Pilih Gerbang Dimensi Pembelajaran" 
        position="0 3 -5" 
        align="center" 
        color="#6ee7b7" 
        scale="0.6 0.6 0.6"
      ></a-text>

      {/* --- 5. GERBANG PILIHAN LEVEL (PORTALS) --- */}
      
      {/* Gerbang 1: Raksha Basic (SD) - Tema Hijau Zamrud */}
      <a-box 
        className="clickable"
        position="-3 1.5 -4.5" 
        rotation="0 15 0"
        width="1.2" height="2.2" depth="0.1"
        color="#064e3b"
        opacity="0.8"
        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
        onClick={() => onSelectRoom('Raksha Basic')}
      >
        {/* Bingkai Gerbang (Neon Glow) */}
        <a-box width="1.3" height="2.3" depth="0.05" color="#34d399" wireframe="true" position="0 0 0.02"></a-box>
        <a-text value="Raksha Basic\n(SD)" align="center" position="0 0.2 0.1" color="#fff" scale="0.8 0.8 0.8"></a-text>
      </a-box>

      {/* Gerbang 2: Raksha Beginner (SMP) - Tema Emas/Perunggu */}
      <a-box 
        className="clickable"
        position="0 1.5 -5.5" 
        width="1.2" height="2.2" depth="0.1"
        color="#78350f"
        opacity="0.8"
        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
        onClick={() => onSelectRoom('Raksha Beginner')}
      >
        <a-box width="1.3" height="2.3" depth="0.05" color="#fbbf24" wireframe="true" position="0 0 0.02"></a-box>
        <a-text value="Raksha Beginner\n(SMP)" align="center" position="0 0.2 0.1" color="#fff" scale="0.8 0.8 0.8"></a-text>
      </a-box>

      {/* Gerbang 3: Raksha Expert (SMK) - Tema Merah Delima */}
      <a-box 
        className="clickable"
        position="3 1.5 -4.5" 
        rotation="0 -15 0"
        width="1.2" height="2.2" depth="0.1"
        color="#7f1d1d"
        opacity="0.8"
        animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
        animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
        onClick={() => onSelectRoom('Raksha Expert')}
      >
        <a-box width="1.3" height="2.3" depth="0.05" color="#f87171" wireframe="true" position="0 0 0.02"></a-box>
        <a-text value="Raksha Expert\n(SMK)" align="center" position="0 0.2 0.1" color="#fff" scale="0.8 0.8 0.8"></a-text>
      </a-box>

    </a-entity>
  );
}