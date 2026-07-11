import React, { useState, useEffect } from 'react';

// === Helper: Estimasi waktu bobol berbasis panjang & jenis karakter sandi ===
function estimateCrack(length, typesSet) {
    if (length === 0 || typesSet.size === 0) {
        return { label: "-", tier: "kosong", pass: false };
    }

    let charset = 0;
    if (typesSet.has('lower')) charset += 26;
    if (typesSet.has('upper')) charset += 26;
    if (typesSet.has('number')) charset += 10;
    if (typesSet.has('symbol')) charset += 32;

    const log10Combos = length * Math.log10(charset);
    const guessPerSecond = 1e10; // asumsi super-komputer peretas
    const log10Seconds = log10Combos - Math.log10(guessPerSecond);

    let label, tier;
    if (log10Seconds < 0) {
        label = "< 1 DETIK"; tier = "sangat lemah";
    } else if (log10Seconds < Math.log10(60)) {
        label = `${Math.max(1, Math.round(10 ** log10Seconds))} DETIK`; tier = "sangat lemah";
    } else if (log10Seconds < Math.log10(3600)) {
        label = `${Math.round((10 ** log10Seconds) / 60)} MENIT`; tier = "lemah";
    } else if (log10Seconds < Math.log10(86400)) {
        label = `${Math.round((10 ** log10Seconds) / 3600)} JAM`; tier = "lemah";
    } else if (log10Seconds < Math.log10(31536000)) {
        label = `${Math.round((10 ** log10Seconds) / 86400)} HARI`; tier = "sedang";
    } else if (log10Seconds < Math.log10(31536000 * 100)) {
        label = `${Math.round((10 ** log10Seconds) / 31536000)} TAHUN`; tier = "sedang";
    } else if (log10Seconds < Math.log10(31536000 * 1e6)) {
        label = `${(10 ** (log10Seconds - Math.log10(31536000))).toExponential(1)} TAHUN`; tier = "kuat";
    } else {
        label = `10^${Math.round(log10Seconds - Math.log10(31536000))} TAHUN`; tier = "sangat kuat";
    }

    // Lolos jika estimasi >= ~100 tahun
    const pass = log10Seconds >= Math.log10(31536000 * 100);
    return { label, tier, pass };
}

function randomChar(type) {
    const pools = {
        lower: "abcdefghijklmnopqrstuvwxyz",
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        number: "0123456789",
        symbol: "!@#$%^&*_-+="
    };
    const pool = pools[type];
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function RakshaExpertRoom1({ onInteractTerminal }) {
    // 0 = Intro, 1 = Puzzle Pencocokan Kunci, 2 = Racik Sandi, 3 = Refleksi (Selesai)
    const [stage, setStage] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isError, setIsError] = useState(false);

    // --- State Tahap 1: Puzzle Pencocokan ---
    const [selectedKey, setSelectedKey] = useState(null); // 'public' | 'private'
    const [matchedPublic, setMatchedPublic] = useState(false);
    const [matchedPrivate, setMatchedPrivate] = useState(false);

    // --- State Tahap 2: Racik Sandi ---
    const [pwParts, setPwParts] = useState([]); // [{char, type}]

    const handleAnswer = (correct, nextStage, errorMessage) => {
        if (correct) {
            setIsError(false);
            setFeedback("TINDAKAN BERHASIL! Memproses tahap selanjutnya...");
            setTimeout(() => {
                setFeedback("");
                setStage(nextStage);
            }, 2000);
        } else {
            setIsError(true);
            setFeedback(errorMessage);
            setTimeout(() => setFeedback(""), 3500);
        }
    };

    // Cek otomatis saat kedua pasangan kunci sudah benar
    useEffect(() => {
        if (matchedPublic && matchedPrivate) {
            setIsError(false);
            setFeedback("KEDUA KUNCI BERHASIL DIPASANGKAN! Data siap dikirim aman...");
            const t = setTimeout(() => {
                setFeedback("");
                setMatchedPublic(false);
                setMatchedPrivate(false);
                setSelectedKey(null);
                setStage(2);
            }, 2000);
            return () => clearTimeout(t);
        }
    }, [matchedPublic, matchedPrivate]);

    const selectKey = (key) => {
        if (feedback) return;
        setSelectedKey(key);
    };

    const selectDestination = (dest) => {
        if (feedback || !selectedKey) return;
        const correct =
            (selectedKey === 'public' && dest === 'kirim') ||
            (selectedKey === 'private' && dest === 'simpan');

        if (correct) {
            if (dest === 'kirim') setMatchedPublic(true);
            else setMatchedPrivate(true);
            setSelectedKey(null);
        } else {
            const msg = selectedKey === 'public'
                ? "[ SALAH ]\nKunci Publik dibuat untuk DIBAGIKAN, bukan disimpan sendiri. Kunci Publik dipakai Markas untuk MENGUNCI data sebelum dikirim kembali padamu."
                : "[ BAHAYA ]\nKunci Privat TIDAK BOLEH kamu kirim ke Markas! Jika dibagikan lewat Wi-Fi publik, peretas bisa mencurinya dan membuka semua datamu.";
            handleAnswer(false, 1, msg);
            setSelectedKey(null);
        }
    };

    // --- Logika Racik Sandi ---
    const typesUsed = new Set(pwParts.map(p => p.type));
    const crackInfo = estimateCrack(pwParts.length, typesUsed);

    const addChar = (type) => {
        if (feedback || pwParts.length >= 14) return;
        setPwParts(prev => [...prev, { char: randomChar(type), type }]);
    };

    const removeChar = () => {
        if (feedback) return;
        setPwParts(prev => prev.slice(0, -1));
    };

    const lockPassword = () => {
        if (feedback) return;
        if (crackInfo.pass) {
            handleAnswer(true, 3, "");
            setPwParts([]);
        } else {
            const missing = [];
            if (!typesUsed.has('upper')) missing.push("huruf BESAR");
            if (!typesUsed.has('lower')) missing.push("huruf kecil");
            if (!typesUsed.has('number')) missing.push("angka");
            if (!typesUsed.has('symbol')) missing.push("simbol");
            const lengthNote = pwParts.length < 8 ? " Sandi juga masih terlalu pendek." : "";
            const missingNote = missing.length > 0
                ? ` Tambahkan: ${missing.join(", ")}.`
                : "";
            handleAnswer(false, 2, `[ TERBOBOL ]\nEstimasi peretas hanya butuh ${crackInfo.label} untuk membobol sandi ini!${lengthNote}${missingNote}`);
            setPwParts([]);
        }
    };

    const passwordDisplay = pwParts.map(p => p.char).join("") || "________";

    return (
        <a-entity id="raksha-expert-room-1">
            {/* === PENCAHAYAAN EXPERT (Gelap & Futuristik) === */}
            <a-light type="ambient" color="#1e1b4b" intensity="0.4"></a-light>
            <a-light type="point" color="#4f46e5" intensity="0.6" position="0 4 0" distance="15"></a-light>
            <a-light type="point" color="#e11d48" intensity="0.4" position="0 2 -6" distance="10"></a-light>

            {/* === LINGKUNGAN RUANGAN === */}
            <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20"
                color="#020617" material="roughness: 0.2; metalness: 0.8"></a-plane>
            <a-cylinder position="0 2.5 0" radius="10" height="5" side="back"
                color="#0f172a" material="roughness: 0.7"></a-cylinder>

            {/* === TERMINAL UTAMA (Tengah Ruangan) === */}
            <a-entity position="0 0 -4">
                <a-box class="solid" position="0 0.8 0" width="3" height="0.1" depth="1" color="#1e293b"></a-box>
                <a-cylinder class="solid" position="0 0.4 0" radius="0.4" height="0.8" color="#020617"></a-cylinder>

                <a-entity position="0 2 0" rotation="-10 0 0">
                    <a-plane width="4" height="2.2" color={isError ? "#450a0a" : "#0f172a"} opacity="0.95"
                        material="transparent: true"></a-plane>
                    <a-plane position="0 0 -0.01" width="4.1" height="2.3" color={isError ? "#dc2626" : "#4f46e5"} opacity="0.5"
                        material="transparent: true; wireframe: true"></a-plane>

                    {feedback && (
                        <a-text value={feedback} position="0 0 0.05" align="center" width="3.5"
                            color={isError ? "#f87171" : "#4ade80"} wrap-count="40"></a-text>
                    )}

                    {/* --- TAHAP 0: INTRO --- */}
                    {stage === 0 && !feedback && (
                        <a-entity>
                            <a-text value="[ KONEKSI: PUBLIC WI-FI ]" position="0 0.7 0.02" align="center" color="#eab308" scale="0.5 0.5 0.5"></a-text>
                            <a-text value="Markas akan mengirim Data Inti melalui jaringan publik ini.\nSistem mendeteksi adanya peretas (Hacker) anonim yang mencoba menyadap (sniffing) transmisimu!"
                                position="0 0.2 0.02" align="center" width="3.5" color="#f8fafc" wrap-count="45"></a-text>
                            <a-entity position="0 -0.6 0.02">
                                <a-box width="1.5" height="0.4" depth="0.05" color="#4f46e5" class="clickable"
                                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                                    onClick={() => setStage(1)}></a-box>
                                <a-text value="MULAI PENGAMANAN" position="0 0 0.03" align="center" color="#ffffff" scale="0.4 0.4 0.4"></a-text>
                            </a-entity>
                        </a-entity>
                    )}

                    {/* --- TAHAP 1: PUZZLE PENCOCOKAN KUNCI --- */}
                    {stage === 1 && !feedback && (
                        <a-entity>
                            <a-text value="TAHAP 1: PASANGKAN KUNCI DENGAN FUNGSINYA" position="0 0.9 0.02" align="center" color="#38bdf8" scale="0.32 0.32 0.32"></a-text>
                            <a-text value="Klik salah satu KUNCI, lalu klik FUNGSI yang tepat untuknya."
                                position="0 0.6 0.02" align="center" width="3.5" color="#f8fafc" wrap-count="55" scale="0.8 0.8 0.8"></a-text>

                            {/* Kolom Kiri: Kunci */}
                            <a-entity position="-1.3 0.05 0.02">
                                <a-box width="1.3" height="0.35" depth="0.05"
                                    color={matchedPublic ? "#166534" : selectedKey === 'public' ? "#0ea5e9" : "#0369a1"}
                                    class="clickable" onClick={() => !matchedPublic && selectKey('public')}></a-box>
                                <a-text value={matchedPublic ? "KUNCI PUBLIK ✓" : "KUNCI PUBLIK"} position="0 0 0.03" align="center" color="#ffffff" scale="0.3 0.3 0.3"></a-text>
                            </a-entity>
                            <a-entity position="-1.3 -0.4 0.02">
                                <a-box width="1.3" height="0.35" depth="0.05"
                                    color={matchedPrivate ? "#166534" : selectedKey === 'private' ? "#f43f5e" : "#be123c"}
                                    class="clickable" onClick={() => !matchedPrivate && selectKey('private')}></a-box>
                                <a-text value={matchedPrivate ? "KUNCI PRIVAT ✓" : "KUNCI PRIVAT"} position="0 0 0.03" align="center" color="#ffffff" scale="0.3 0.3 0.3"></a-text>
                            </a-entity>

                            {/* Kolom Kanan: Fungsi */}
                            <a-entity position="1.3 0.05 0.02">
                                <a-box width="1.5" height="0.35" depth="0.05" color="#475569"
                                    class="clickable" onClick={() => selectDestination('kirim')}></a-box>
                                <a-text value="BAGIKAN KE MARKAS" position="0 0 0.03" align="center" color="#ffffff" scale="0.28 0.28 0.28"></a-text>
                            </a-entity>
                            <a-entity position="1.3 -0.4 0.02">
                                <a-box width="1.5" height="0.35" depth="0.05" color="#475569"
                                    class="clickable" onClick={() => selectDestination('simpan')}></a-box>
                                <a-text value="SIMPAN RAHASIA" position="0 0 0.03" align="center" color="#ffffff" scale="0.28 0.28 0.28"></a-text>
                            </a-entity>

                            {selectedKey && (
                                <a-text value={`Terpilih: ${selectedKey === 'public' ? 'KUNCI PUBLIK' : 'KUNCI PRIVAT'} — klik fungsinya di kanan`}
                                    position="0 -0.85 0.02" align="center" color="#facc15" scale="0.3 0.3 0.3"></a-text>
                            )}
                        </a-entity>
                    )}

                    {/* --- TAHAP 2: RACIK SANDI --- */}
                    {stage === 2 && !feedback && (
                        <a-entity>
                            <a-text value="TAHAP 2: RACIK SANDI ANTI BRUTE-FORCE" position="0 0.95 0.02" align="center" color="#ef4444" scale="0.3 0.3 0.3"></a-text>
                            <a-text value={`SANDI: ${passwordDisplay}`} position="0 0.65 0.02" align="center" color="#fbbf24" scale="0.4 0.4 0.4" wrap-count="30"></a-text>
                            <a-text value={`Estimasi waktu bobol: ${crackInfo.label}`}
                                position="0 0.4 0.02" align="center"
                                color={crackInfo.pass ? "#4ade80" : "#f87171"} scale="0.32 0.32 0.32"></a-text>

                            {/* Tombol kategori karakter */}
                            <a-entity position="-1.35 0 0.02">
                                <a-box width="1.1" height="0.3" depth="0.05" color="#0369a1" class="clickable" onClick={() => addChar('lower')}></a-box>
                                <a-text value="a-z" position="0 0 0.03" align="center" color="#ffffff" scale="0.3 0.3 0.3"></a-text>
                            </a-entity>
                            <a-entity position="-0.45 0 0.02">
                                <a-box width="1.1" height="0.3" depth="0.05" color="#0891b2" class="clickable" onClick={() => addChar('upper')}></a-box>
                                <a-text value="A-Z" position="0 0 0.03" align="center" color="#ffffff" scale="0.3 0.3 0.3"></a-text>
                            </a-entity>
                            <a-entity position="0.45 0 0.02">
                                <a-box width="1.1" height="0.3" depth="0.05" color="#7c3aed" class="clickable" onClick={() => addChar('number')}></a-box>
                                <a-text value="0-9" position="0 0 0.03" align="center" color="#ffffff" scale="0.3 0.3 0.3"></a-text>
                            </a-entity>
                            <a-entity position="1.35 0 0.02">
                                <a-box width="1.1" height="0.3" depth="0.05" color="#be185d" class="clickable" onClick={() => addChar('symbol')}></a-box>
                                <a-text value="!@#" position="0 0 0.03" align="center" color="#ffffff" scale="0.3 0.3 0.3"></a-text>
                            </a-entity>

                            {/* Hapus & Kunci */}
                            <a-entity position="-0.85 -0.45 0.02">
                                <a-box width="1.4" height="0.3" depth="0.05" color="#475569" class="clickable" onClick={removeChar}></a-box>
                                <a-text value="HAPUS KARAKTER" position="0 0 0.03" align="center" color="#ffffff" scale="0.26 0.26 0.26"></a-text>
                            </a-entity>
                            <a-entity position="0.85 -0.45 0.02">
                                <a-box width="1.4" height="0.3" depth="0.05" color="#047857" class="clickable" onClick={lockPassword}></a-box>
                                <a-text value="KUNCI SANDI" position="0 0 0.03" align="center" color="#ffffff" scale="0.28 0.28 0.28"></a-text>
                            </a-entity>

                            <a-text value="Semakin banyak jenis karakter + panjang sandi = semakin lama waktu bobol"
                                position="0 -0.8 0.02" align="center" color="#94a3b8" width="3.5" scale="0.5 0.5 0.5" wrap-count="55"></a-text>
                        </a-entity>
                    )}

                    {/* --- TAHAP 3: REFLEKSI (CLEAR) --- */}
                    {stage === 3 && !feedback && (
                        <a-entity>
                            <a-text value="[ LOG REFLEKSI KADET ]" position="0 0.8 0.02" align="center" color="#4ade80" scale="0.5 0.5 0.5"></a-text>
                            <a-text value="1. Bencana Wi-Fi Publik: Di jaringan terbuka, siapapun bisa menyadap data.\n2. Kunci Asimetris: 'Kunci Publik' dibagikan bebas agar orang bisa mengunci pesan untukmu. Tapi hanya 'Kunci Privat' di tanganmu yang bisa membukanya.\n3. Brute-Force: Peretas menggunakan mesin penebak sandi. Kombinasi simbol, angka, & huruf besar-kecil akan membuat mesin butuh ribuan tahun untuk menebaknya."
                                position="0 0.1 0.02" align="left" width="3.6" color="#94a3b8" wrap-count="50"></a-text>

                            <a-entity position="0 -0.7 0.02">
                                <a-box width="2" height="0.4" depth="0.05" color="#16a34a" class="clickable"
                                    animation__hover="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; dur: 200"
                                    animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
                                    onClick={onInteractTerminal}></a-box>
                                <a-text value="BUKA GERBANG KELUAR" position="0 0 0.03" align="center" color="#ffffff" scale="0.4 0.4 0.4"></a-text>
                            </a-entity>
                        </a-entity>
                    )}
                </a-entity>
            </a-entity>

            {/* Gerbang Keluar (Terkunci sampai Tahap 3) */}
            <a-entity position="0 0 -9">
                <a-box class="solid" position="0 2 0" width="4" height="4" depth="0.2" color="#1e293b"></a-box>
                <a-plane position="0 1.5 0.11" width="3.6" height="3" color="#334155"></a-plane>
                <a-text value={stage === 3 ? "AKSES DIIZINKAN" : "AKSES TERKUNCI"} position="0 3.3 0.12" align="center"
                    color={stage === 3 ? "#4ade80" : "#ef4444"} scale="0.6 0.6 0.6"></a-text>
            </a-entity>
        </a-entity>
    );
}