import React from 'react';

export default function Corridor() {
    return (
        <a-entity id="raksha-basic-corridor">
            <a-light type="ambient" color="#e8ecf4" intensity="0.4"></a-light>
            <a-light type="point" color="#f0f4ff" intensity="0.6" position="0 4 -14" distance="15" decay="2"></a-light>

            {/* Lantai lorong */}
            <a-plane position="0 0 -20" rotation="-90 0 0" width="5" height="14"
                material="src: #tex-office-floor; repeat: 2 5; roughness: 0.6"></a-plane>

            {/* Dinding kiri-kanan */}
            <a-box class="solid" position="-2.5 2.5 -20" width="0.2" height="5" depth="14"
                material="src: #tex-office-wall-inner-hd; roughness: 0.75"></a-box>
            <a-box class="solid" position="2.5 2.5 -20" width="0.2" height="5" depth="14"
                material="src: #tex-office-wall-inner-hd; roughness: 0.75"></a-box>

            {/* Langit-langit */}
            <a-box class="solid" position="0 4.9 -20" width="5" height="0.2" depth="14"
                material="src: #tex-office-ceiling; repeat: 2 5; roughness: 0.9"></a-box>

            <a-text value="MENUJU ROOM 2" position="0 3 -25" align="center" color="#4ade80" scale="1 1 1" font="mozillavr"></a-text>
            <a-text value="(Konten sedang dibangun)" position="0 2.6 -25" align="center" color="#94a3b8" scale="0.4 0.4 0.4"></a-text>

            {/* Dinding penutup ujung lorong — placeholder, ganti dengan pintu Room 2 nanti */}
            <a-box class="solid" position="0 2.5 -27" width="5" height="5" depth="0.2" color="#334155"></a-box>
        </a-entity>
    );
}