import { useEffect, useState } from 'react';

// ============================================================
// KONSTANTA — kecil sengaja, ini bakal nempel kamera VR
// ============================================================
const CANVAS_W = 1024;
const CANVAS_H = 384;

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = text.split(' ');
    let line = '';
    let cy = y;
    let lines = 0;
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line, x, cy);
            line = words[n] + ' ';
            cy += lineHeight;
            lines++;
            if (lines >= maxLines - 1) break;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, cy);
}

export function useNpcDialogueVRTexture({ isVRMode, dialogue }) {
    const [texture, setTexture] = useState(null);

    useEffect(() => {
        if (!isVRMode || !dialogue) {
            setTexture(null);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_W;
        canvas.height = CANVAS_H;
        const ctx = canvas.getContext('2d');

        const THREE = window.THREE || AFRAME.THREE;
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Background box
        ctx.fillStyle = 'rgba(15,23,42,0.95)';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = dialogue.color;
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, w - 10, h - 10);

        // Name tag
        ctx.fillStyle = dialogue.color;
        ctx.fillRect(30, 0, 280, 56);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px monospace';
        ctx.fillText(dialogue.name.toUpperCase(), 50, 38);

        // Body text
        ctx.fillStyle = '#f8fafc';
        ctx.font = '26px monospace';
        wrapText(ctx, dialogue.text, 40, 100, w - 80, 34, 5);

        // Tombol BATAL
        ctx.fillStyle = '#475569';
        ctx.fillRect(w - 620, h - 90, 260, 60);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 26px monospace';
        ctx.fillText('BATAL', w - 545, h - 52);

        // Tombol BERI PASSWORD
        ctx.fillStyle = '#10b981';
        ctx.fillRect(w - 340, h - 90, 300, 60);
        ctx.fillStyle = '#fff';
        ctx.fillText('BERI PASSWORD', w - 325, h - 52);

        tex.needsUpdate = true;
        setTexture(tex);

        return () => tex.dispose();
    }, [isVRMode, dialogue]);

    return texture;
}