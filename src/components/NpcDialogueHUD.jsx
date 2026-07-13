import React, { useEffect, useState } from 'react';

// ============================================================
// KONSTANTA — atur speed ketik di sini
// ============================================================
const TYPEWRITER_SPEED_MS = 18;

export default function NpcDialogueHUD({ dialogue, onCancel, onConfirm }) {
    const [displayedText, setDisplayedText] = useState('');
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        if (!dialogue) return;
        setDisplayedText('');
        setIsDone(false);
        let i = 0;
        const full = dialogue.text;
        const interval = setInterval(() => {
            i++;
            setDisplayedText(full.slice(0, i));
            if (i >= full.length) {
                setIsDone(true);
                clearInterval(interval);
            }
        }, TYPEWRITER_SPEED_MS);
        return () => clearInterval(interval);
    }, [dialogue]);

    if (!dialogue) return null;

    // Klik teks = skip animasi ketik (kebiasaan pokemon-style)
    const handleSkip = () => {
        if (!isDone) {
            setDisplayedText(dialogue.text);
            setIsDone(true);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={{ ...styles.box, borderColor: dialogue.color }} onClick={handleSkip}>
                <div style={{ ...styles.nameTag, background: dialogue.color }}>
                    {dialogue.name.toUpperCase()}
                </div>
                <p style={styles.text}>{displayedText}</p>
                <div style={styles.buttonRow}>
                    <button
                        style={{ ...styles.btn, background: '#475569' }}
                        onClick={(e) => { e.stopPropagation(); onCancel(); }}
                    >
                        BATAL
                    </button>
                    <button
                        style={{ ...styles.btn, background: '#10b981' }}
                        onClick={(e) => { e.stopPropagation(); onConfirm(); }}
                    >
                        BERI PASSWORD
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(720px, 90vw)',
        zIndex: 40,
        fontFamily: 'monospace',
    },
    box: {
        background: 'rgba(15, 23, 42, 0.95)',
        border: '3px solid',
        borderRadius: '10px',
        padding: '18px 22px 16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        position: 'relative',
        cursor: 'default',
    },
    nameTag: {
        position: 'absolute',
        top: '-16px',
        left: '16px',
        padding: '4px 14px',
        borderRadius: '6px',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '13px',
        letterSpacing: '1px',
    },
    text: {
        color: '#f8fafc',
        fontSize: '15px',
        lineHeight: 1.5,
        margin: '10px 0 16px 0',
        minHeight: '4.5em',
        whiteSpace: 'pre-wrap',
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    btn: {
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontFamily: 'monospace',
    },
};