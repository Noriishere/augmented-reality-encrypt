export default function PlayerRig({ isKeyboardOpen, onToggleKeyboard }) {
  return (
    <a-entity id="rig" position="0 0 0">
      
      {/* KAMERA UTAMA */}
      <a-camera 
        position="0 1.6 0" 
        look-controls="pointerLockEnabled: false"
        wasd-controls="enabled: false"
      >
        {/* Kursor Reticle */}
        <a-cursor 
          raycaster="objects: .clickable" 
          color="#22d3ee"
          animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.2 0.2 0.2; to: 1 1 1"
          animation__mouseenter="property: scale; startEvents: mouseenter; easing: easeOutCubic; dur: 200; to: 1.5 1.5 1.5"
          animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeOutCubic; dur: 200; to: 1 1 1"
        ></a-cursor>

        {/* --- TOMBOL HOLOGRAM 3D UNTUK MODE VR --- */}
        {/* Posisinya diatur (Y: -0.5, Z: -1) agar berada di bawah pandangan mata dan tidak menghalangi ruangan */}
        <a-box
          className="clickable"
          position="0 -0.5 -1" 
          width="0.6" 
          height="0.15" 
          depth="0.05"
          color={isKeyboardOpen ? "#7f1d1d" : "#0f766e"} // Merah gelap jika terbuka, Cyan gelap jika tertutup
          onClick={onToggleKeyboard}
          animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 150"
          animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150"
        >
          {/* Teks di atas tombol 3D */}
          <a-text 
            value={isKeyboardOpen ? "TUTUP KEYBOARD [X]" : "AKSES KEYBOARD [^]"} 
            align="center" 
            position="0 0 0.03" 
            scale="0.4 0.4 0.4" 
            color="#ffffff"
          ></a-text>
        </a-box>
      </a-camera>

      {/* VR LASER CONTROLS */}
      <a-entity 
        laser-controls="hand: left" 
        raycaster="objects: .clickable; far: 20"
        line="color: #22d3ee; opacity: 0.6"
      ></a-entity>
      
      <a-entity 
        laser-controls="hand: right" 
        raycaster="objects: .clickable; far: 20"
        line="color: #22d3ee; opacity: 0.6"
      ></a-entity>
      
    </a-entity>
  );
}