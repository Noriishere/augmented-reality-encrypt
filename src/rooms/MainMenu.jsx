import React from 'react';

export default function MainMenu({ onSelectRoom }) {
  return (
    <a-entity id="raksha-haven">
      
      {/* --- BGM --- */}
      <a-sound src="#bgm-javanese-cyber" autoplay="true" loop="true" volume="0.4" position="0 2 -3"></a-sound>

      {/* --- KONSTRUKSI RUANGAN (15x15 meter, Tinggi 5 meter) --- */}
      
      {/* 1. Lantai */}
      <a-plane 
        src="#tex-floor" 
        position="0 0 0" 
        rotation="-90 0 0" 
        width="15" height="15" 
        repeat="4 4" 
        roughness="0.2" // Memberikan efek sedikit memantulkan cahaya
      ></a-plane>

      {/* 2. Langit-langit (Atap) */}
      <a-plane 
        src="#tex-floor" 
        position="0 5 0" 
        rotation="90 0 0" 
        width="15" height="15" 
        repeat="4 4"
      ></a-plane>

      {/* 3. Dinding Depan (Utara) */}
      <a-plane src="#tex-wall" position="0 2.5 -7.5" width="15" height="5" repeat="4 2"></a-plane>
      
      {/* 4. Dinding Belakang (Selatan) */}
      <a-plane src="#tex-wall" position="0 2.5 7.5" rotation="0 180 0" width="15" height="5" repeat="4 2"></a-plane>
      
      {/* 5. Dinding Kanan (Timur) */}
      <a-plane src="#tex-wall" position="7.5 2.5 0" rotation="0 -90 0" width="15" height="5" repeat="4 2"></a-plane>
      
      {/* 6. Dinding Kiri (Barat) */}
      <a-plane src="#tex-wall" position="-7.5 2.5 0" rotation="0 90 0" width="15" height="5" repeat="4 2"></a-plane>


      {/* --- ELEMEN LOBBY & GERBANG --- */}
      
      <a-text value="THE RAKSHA HAVEN" position="0 4 -7.4" align="center" color="#fbbf24" scale="1.5 1.5 1.5"></a-text>
      <a-text value="Pilih Gerbang Dimensi Pembelajaran" position="0 3.5 -7.4" align="center" color="#6ee7b7" scale="0.6 0.6 0.6"></a-text>

      {/* Gerbang 1: Raksha Basic */}
      <a-entity position="-3 1.2 -7.4" rotation="0 0 0">
        <a-image 
          className="clickable"
          src="#tex-door" 
          width="1.8" height="2.8"
          animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
          animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
          onClick={() => onSelectRoom('Raksha Basic')}
        ></a-image>
        <a-text value="Raksha Basic\n(SD)" align="center" position="0 1.6 0.1" color="#fff" scale="0.8 0.8 0.8"></a-text>
      </a-entity>

      {/* Gerbang 2: Raksha Beginner */}
      <a-entity position="0 1.2 -7.4">
        <a-image 
          className="clickable"
          src="#tex-door" 
          width="1.8" height="2.8"
          animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
          animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
          onClick={() => onSelectRoom('Raksha Beginner')}
        ></a-image>
        <a-text value="Raksha Beginner\n(SMP)" align="center" position="0 1.6 0.1" color="#fff" scale="0.8 0.8 0.8"></a-text>
      </a-entity>

      {/* Gerbang 3: Raksha Expert */}
      <a-entity position="3 1.2 -7.4">
        <a-image 
          className="clickable"
          src="#tex-door" 
          width="1.8" height="2.8"
          animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
          animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
          onClick={() => onSelectRoom('Raksha Expert')}
        ></a-image>
        <a-text value="Raksha Expert\n(SMK)" align="center" position="0 1.6 0.1" color="#fff" scale="0.8 0.8 0.8"></a-text>
      </a-entity>

    </a-entity>
  );
}