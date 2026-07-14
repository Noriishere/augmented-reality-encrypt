import { useState, useEffect } from 'react';

function generateBinary(length = 8) {
    return Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('');
}

function generateIP() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function glitchStr(text, intensity = 0.1) {
    const chars = '!@#$%^&*01';
    return text.split('').map(c =>
        Math.random() < intensity ? chars[Math.floor(Math.random() * chars.length)] : c
    ).join('');
}

export default function HUD({
    currentRoom,
    isKeyboardOpen,
    onToggleKeyboard,
    isFullscreen,
    onToggleFullscreen
}) {
    const [time, setTime] = useState('');
    const [binaryStream, setBinaryStream] = useState('');
    const [cpuUsage, setCpuUsage] = useState(42);
    const [memUsage, setMemUsage] = useState(67);
    const [netPackets, setNetPackets] = useState(0);
    const [glitch, setGlitch] = useState(false);
    const [statsGlitch, setStatsGlitch] = useState(false);
    const [gx, setGx] = useState(0);

    useEffect(() => {
        const t1 = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false }));
            setBinaryStream(generateBinary(40));
            setCpuUsage(Math.floor(Math.random() * 30) + 35);
            setMemUsage(Math.floor(Math.random() * 20) + 55);
            setNetPackets(p => p + Math.floor(Math.random() * 50) + 10);
        }, 1000);

        const t2 = setInterval(() => {
            if (Math.random() > 0.7) {
                setGlitch(true);
                setGx((Math.random() - 0.5) * 6);
                setTimeout(() => { setGlitch(false); setGx(0); }, 100);
            }
        }, 2500);

        const t3 = setInterval(() => {
            if (Math.random() > 0.3) {
                setStatsGlitch(true);
                setTimeout(() => setStatsGlitch(false), 80 + Math.random() * 120);
            }
        }, 400);

        return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
    }, []);

    const sx = statsGlitch ? { transform: `translateX(${(Math.random()-0.5)*4}px) skewX(${(Math.random()-0.5)*2}deg)` } : {};
    const dateStr = new Date().toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'short', day:'numeric' }).toUpperCase();
    const sessionStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    const latencyStr = String(Math.floor(Math.random()*20+5));

    return (
        <div className="absolute inset-0 pointer-events-none z-10"
             style={{ transform: `translateX(${gx}px)`, transition: glitch ? 'none' : 'transform 0.1s' }}>

            {/* Scanlines */}
            <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.02) 2px, rgba(0,255,255,0.02) 4px)' }}></div>

            {/* Glitch bars */}
            {glitch && <>
                <div className="absolute left-0 right-0 h-px bg-cyan-400/40" style={{ top: `${20+Math.random()*60}%` }}></div>
                <div className="absolute left-0 right-0 h-[2px] bg-red-500/20" style={{ top: `${30+Math.random()*40}%` }}></div>
            </>}

            {/* Corners */}
            <div className="absolute top-0 left-0 w-32 h-32">
                <div className="absolute top-4 left-4 w-16 h-px bg-cyan-500/60"></div>
                <div className="absolute top-4 left-4 w-px h-16 bg-cyan-500/60"></div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32">
                <div className="absolute top-4 right-4 w-16 h-px bg-cyan-500/60"></div>
                <div className="absolute top-4 right-4 w-px h-16 bg-cyan-500/60"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-32 h-32">
                <div className="absolute bottom-4 left-4 w-16 h-px bg-cyan-500/60"></div>
                <div className="absolute bottom-4 left-4 w-px h-16 bg-cyan-500/60"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
                <div className="absolute bottom-4 right-4 w-16 h-px bg-cyan-500/60"></div>
                <div className="absolute bottom-4 right-4 w-px h-16 bg-cyan-500/60"></div>
            </div>

            {/* Header */}
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start">
                    {/* Left */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 border border-cyan-500 flex items-center justify-center">
                                <div className="w-4 h-4 bg-cyan-500/30 border border-cyan-400"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-cyan-400 tracking-[0.3em] font-mono"
                                    style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>
                                    {statsGlitch ? glitchStr('RAKSHADATA', 0.3) : 'RAKSHADATA'}
                                </h1>
                                <div className="text-[10px] text-cyan-600 font-mono tracking-[0.2em]">CYBER DEFENSE TRAINING v2.4.1</div>
                            </div>
                        </div>
                        <div className="bg-black/60 border border-cyan-800/50 px-3 py-2 mt-3 max-w-[280px]">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${statsGlitch ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></span>
                                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                                    {statsGlitch ? glitchStr('SYSTEM ONLINE', 0.4) : 'System Online'}
                                </span>
                            </div>
                            <div className="text-[10px] font-mono text-cyan-500/70">ROOM: <span className="text-cyan-300">{currentRoom}</span></div>
                            <div className="text-[10px] font-mono text-cyan-500/70">NODE: <span className="text-cyan-400">{statsGlitch ? glitchStr(generateIP(), 0.5) : generateIP()}</span></div>
                        </div>
                    </div>

                    {/* Right - Stats */}
                    <div className="hidden sm:block" style={sx}>
                        <div className="text-right mb-2">
                            <div className="text-xl md:text-2xl font-mono text-cyan-400 tracking-widest" style={{ textShadow: '0 0 10px rgba(34,211,238,0.4)' }}>
                                {statsGlitch ? glitchStr(time, 0.4) : time}
                            </div>
                            <div className="text-[10px] font-mono text-cyan-600 tracking-wider">{dateStr}</div>
                        </div>

                        <div className="bg-black/60 border border-cyan-800/50 px-3 py-2 text-right" style={statsGlitch ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}>
                            <div className={`text-[10px] font-mono mb-1 ${statsGlitch ? 'text-red-500' : 'text-cyan-500/70'}`}>
                                {statsGlitch ? glitchStr('SYSTEM STATUS', 0.5) : 'SYSTEM STATUS'}
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-mono text-cyan-500 w-8 text-right">{statsGlitch ? 'C@!' : 'CPU'}</span>
                                <div className="w-20 h-1.5 bg-cyan-900/50 border border-cyan-800/30 overflow-hidden">
                                    <div className="h-full" style={{ width: `${statsGlitch ? Math.random()*100 : cpuUsage}%`, backgroundColor: statsGlitch ? '#ef4444' : '#06b6d4', transition: 'all 0.5s' }}></div>
                                </div>
                                <span className={`text-[9px] font-mono w-8 ${statsGlitch ? 'text-red-400' : 'text-cyan-400'}`}>{statsGlitch ? 'ERR' : cpuUsage+'%'}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-mono text-cyan-500 w-8 text-right">{statsGlitch ? 'M#M' : 'MEM'}</span>
                                <div className="w-20 h-1.5 bg-cyan-900/50 border border-cyan-800/30 overflow-hidden">
                                    <div className="h-full" style={{ width: `${statsGlitch ? Math.random()*100 : memUsage}%`, backgroundColor: statsGlitch ? '#eab308' : '#10b981', transition: 'all 0.5s' }}></div>
                                </div>
                                <span className={`text-[9px] font-mono w-8 ${statsGlitch ? 'text-yellow-400' : 'text-emerald-400'}`}>{statsGlitch ? 'WARN' : memUsage+'%'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono text-cyan-500 w-8 text-right">{statsGlitch ? 'N!T' : 'NET'}</span>
                                <span className={`text-[9px] font-mono ${statsGlitch ? 'text-red-400' : 'text-cyan-400'}`}>
                                    {statsGlitch ? glitchStr('99999', 0.6) : netPackets.toLocaleString()+' pkts/s'}
                                </span>
                            </div>
                        </div>

                        <button onClick={onToggleFullscreen}
                            className="pointer-events-auto mt-2 w-full bg-black/60 border border-cyan-700/50 px-3 py-1.5 text-[10px] font-mono text-cyan-400 hover:bg-cyan-900/30 transition-all tracking-widest">
                            {isFullscreen ? '[ EXIT FULLSCREEN ]' : '[ ENTER FULLSCREEN ]'}
                        </button>
                    </div>
                </div>

                {/* Binary */}
                <div className="mt-3 overflow-hidden opacity-30">
                    <p className="text-[8px] font-mono text-cyan-600 tracking-[0.15em] whitespace-nowrap">
                        {statsGlitch ? glitchStr(binaryStream, 0.3) : binaryStream}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="flex justify-between items-center mt-4 opacity-50">
                    <div className="text-[8px] font-mono text-cyan-600">ENCRYPTION: AES-256-GCM | PROTOCOL: TLS 1.3</div>
                    <div className="text-[8px] font-mono text-cyan-600">SESSION: {sessionStr}</div>
                    <div className="text-[8px] font-mono text-cyan-600 hidden sm:block">LATENCY: {latencyStr}ms</div>
                </div>
            </div>
        </div>
    );
}
