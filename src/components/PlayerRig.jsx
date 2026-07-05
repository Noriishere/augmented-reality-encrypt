export default function PlayerRig() {
  return (
    <a-entity id="rig" position="0 0 0">
      
      {/* KAMERA UTAMA (Mendukung Mouse di PC & Sentuhan di HP) */}
      <a-camera 
        position="0 1.6 0" 
        look-controls="pointerLockEnabled: false"
        wasd-controls="enabled: false"
      >
        {/* Kursor Reticle untuk menarget objek 3D */}
        <a-cursor 
          raycaster="objects: .clickable" 
          color="#22d3ee"
          // Animasi umpan balik visual saat melakukan klik
          animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.2 0.2 0.2; to: 1 1 1"
          animation__mouseenter="property: scale; startEvents: mouseenter; easing: easeOutCubic; dur: 200; to: 1.5 1.5 1.5"
          animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeOutCubic; dur: 200; to: 1 1 1"
        ></a-cursor>
      </a-camera>

      {/* VR LASER CONTROLS (Mendukung Headset seperti Meta Quest) */}
      {/* Hanya akan menembakkan laser ke objek yang memiliki class "clickable" */}
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