import { useEffect, useRef, useState } from 'react';

function wrapText(ctx, text, maxWidth) {
  const words = (text || '').split(' ');
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

/**
 * useRoomWelcomeVRTexture — versi VR dari RoomWelcomeHUD.
 * Menghasilkan CanvasTexture yang bisa ditempel ke <a-plane class="clickable">
 * di dalam PlayerRig, sehingga bisa diklik pakai cursor / laser controller
 * untuk dismiss (sama seperti pola onVRTerminalClick yang sudah ada).
 *
 * Sengaja dibuat sebagai canvas/texture terpisah dari HUD status persisten
 * (useCanvasHUD di App.jsx) supaya tidak perlu menyentuh fungsi draw() yang
 * sudah berjalan -- mengurangi risiko merusak HUD VR yang sudah ada.
 */
export function useRoomWelcomeVRTexture({ isVRMode, welcome }) {
  const [texture, setTexture] = useState(null);
  const textureRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isVRMode || !welcome?.visible) {
      setTexture(null);
      textureRef.current = null;
      return;
    }

    const THREE = window.THREE || (typeof AFRAME !== 'undefined' ? AFRAME.THREE : undefined);
    if (!THREE) return;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1180;
    const ctx = canvas.getContext('2d');

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    textureRef.current = tex;
    setTexture(tex);

    let tick = 0;

    const draw = () => {
      tick += 1;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // dim backdrop
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, w, h);

      // card
      const pad = 70;
      ctx.fillStyle = 'rgba(4,10,14,0.92)';
      ctx.fillRect(pad, pad, w - pad * 2, h - pad * 2);
      ctx.strokeStyle = 'rgba(6,182,212,0.7)';
      ctx.lineWidth = 4;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

      // corner ticks
      const ca = 55;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 5;
      [
        [pad, pad, 1, 1],
        [w - pad, pad, -1, 1],
        [pad, h - pad, 1, -1],
        [w - pad, h - pad, -1, -1],
      ].forEach(([x, y, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(x, y + ca * dy);
        ctx.lineTo(x, y);
        ctx.lineTo(x + ca * dx, y);
        ctx.stroke();
      });

      // eyebrow
      ctx.textAlign = 'center';
      ctx.font = '26px monospace';
      ctx.fillStyle = '#5a7a8a';
      ctx.fillText('MISI DIMULAI', w / 2, pad + 70);

      // title
      ctx.font = 'bold 84px monospace';
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = 'rgba(34,211,238,0.6)';
      ctx.shadowBlur = 28;
      ctx.fillText(welcome.title || '', w / 2, pad + 150);
      ctx.shadowBlur = 0;

      if (welcome.subtitle) {
        ctx.font = '30px monospace';
        ctx.fillStyle = '#5a7a8a';
        ctx.fillText(welcome.subtitle, w / 2, pad + 195);
      }

      // divider
      ctx.strokeStyle = 'rgba(6,182,212,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pad + 90, pad + 230);
      ctx.lineTo(w - pad - 90, pad + 230);
      ctx.stroke();

      // case text
      ctx.textAlign = 'left';
      ctx.font = '28px monospace';
      ctx.fillStyle = '#a5d8e6';
      const lines = wrapText(ctx, welcome.caseText, w - pad * 2 - 150);
      lines.slice(0, 8).forEach((line, i) => {
        ctx.fillText(line, pad + 75, pad + 300 + i * 44);
      });

      // pulsing dismiss hint
      const pulse = 0.55 + 0.45 * Math.sin(tick / 4);
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px monospace';
      ctx.fillStyle = `rgba(34,211,238,${pulse})`;
      ctx.fillText('[ TATAP & KLIK UNTUK MULAI ]', w / 2, h - pad - 45);

      tex.needsUpdate = true;
    };

    draw();
    intervalRef.current = setInterval(draw, 150);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      tex.dispose();
      textureRef.current = null;
    };
  }, [isVRMode, welcome?.visible, welcome?.title, welcome?.subtitle, welcome?.caseText]);

  return texture;
}