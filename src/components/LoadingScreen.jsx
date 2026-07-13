import { useState, useEffect, useRef, useMemo } from 'react';

function friendlyName(id) {
  if (!id) return 'UNKNOWN MODULE';
  const prefix = id.startsWith('model-')
    ? 'MESH'
    : id.startsWith('npc-')
    ? 'ENTITY'
    : id.startsWith('tex-')
    ? 'TEXTURE'
    : 'ASSET';
  const isHD = /-hd$/i.test(id);
  const label = id
    .replace(/^(tex|model|npc)-/, '')
    .replace(/-hd$/i, '')
    .replace(/[-_]/g, ' ')
    .trim()
    .toUpperCase();
  return `${prefix}: ${label}${isHD ? ' [HD]' : ''}`;
}

function randHex(len = 2) {
  let s = '';
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s.toUpperCase();
}

export default function LoadingScreen({ sceneRef, assetTimeout = 15000, onComplete }) {
  const [entries, setEntries] = useState([]); // [{ id, name, status: 'pending'|'ok'|'error' }]
  const [total, setTotal] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [errored, setErrored] = useState(false);

  const logRef = useRef(null);
  const finishedRef = useRef(false);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const cleanupFns = [];

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setSceneReady(true);
      setFadeOut(true);
      setTimeout(() => onComplete?.(), 550);
    };

    const attach = () => {
      const sceneEl = sceneRef?.current || document.querySelector('a-scene');
      if (!sceneEl) {
        attempts += 1;
        if (attempts < 200 && !cancelled) requestAnimationFrame(attach);
        return;
      }

      const assetsEl = sceneEl.querySelector('a-assets');
      const items = assetsEl ? Array.from(assetsEl.children) : [];
      setTotal(items.length);

      let count = 0;
      const initial = [];

      const markStatus = (id, status) => {
        if (cancelled) return;
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
      };
      const bump = () => {
        count += 1;
        if (!cancelled) setDoneCount(count);
      };

      items.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const alreadyLoaded =
          tag === 'img'
            ? el.complete && el.naturalWidth !== 0
            : tag === 'audio' || tag === 'video'
            ? el.readyState >= 2
            : !!el.hasLoaded;

        initial.push({ id: el.id, name: friendlyName(el.id), status: alreadyLoaded ? 'ok' : 'pending' });

        if (alreadyLoaded) {
          bump();
          return;
        }

        const onDone = () => { bump(); markStatus(el.id, 'ok'); };
        const onErr = () => { bump(); setErrored(true); markStatus(el.id, 'error'); };

        // Correct event per asset type — this is the part the previous
        // version got wrong for <img> assets.
        const loadEvent = tag === 'img' ? 'load' : tag === 'audio' || tag === 'video' ? 'loadeddata' : 'loaded';

        el.addEventListener(loadEvent, onDone, { once: true });
        el.addEventListener('error', onErr, { once: true });
        cleanupFns.push(() => {
          el.removeEventListener(loadEvent, onDone);
          el.removeEventListener('error', onErr);
        });
      });

      setEntries(initial);
      setDoneCount(count);

      const onSceneLoaded = () => finish();
      if (sceneEl.hasLoaded) {
        finish();
      } else {
        sceneEl.addEventListener('loaded', onSceneLoaded, { once: true });
        cleanupFns.push(() => sceneEl.removeEventListener('loaded', onSceneLoaded));
      }

      // Hard safety net — guarantees this screen can never hang forever,
      // even if a texture 404s without firing a clean error event.
      const safety = setTimeout(finish, assetTimeout + 1500);
      const skipTimer = setTimeout(() => !cancelled && setShowSkip(true), 6000);
      cleanupFns.push(() => {
        clearTimeout(safety);
        clearTimeout(skipTimer);
      });
    };

    attach();

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [entries]);

  const pct = total > 0 ? Math.min(100, Math.round((doneCount / total) * 100)) : sceneReady ? 100 : 0;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center font-mono select-none"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 500ms ease-out',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
      role="status"
      aria-live="polite"
      aria-label="Memuat aset lingkungan VR"
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.025) 2px, rgba(0,255,255,0.025) 4px)',
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-10 h-10" style={{ borderTop: '2px solid rgba(6,182,212,0.6)', borderLeft: '2px solid rgba(6,182,212,0.6)' }} />
      <div className="absolute top-6 right-6 w-10 h-10" style={{ borderTop: '2px solid rgba(6,182,212,0.6)', borderRight: '2px solid rgba(6,182,212,0.6)' }} />
      <div className="absolute bottom-6 left-6 w-10 h-10" style={{ borderBottom: '2px solid rgba(6,182,212,0.6)', borderLeft: '2px solid rgba(6,182,212,0.6)' }} />
      <div className="absolute bottom-6 right-6 w-10 h-10" style={{ borderBottom: '2px solid rgba(6,182,212,0.6)', borderRight: '2px solid rgba(6,182,212,0.6)' }} />

      <div className="relative w-[90%] max-w-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-8 h-8 border border-cyan-500 flex items-center justify-center shrink-0">
            <div className={`w-4 h-4 bg-cyan-500/40 border border-cyan-400 ${reducedMotion ? '' : 'animate-pulse'}`} />
          </div>
          <div className="text-center">
            <h1
              className="text-xl md:text-2xl font-black text-cyan-400 tracking-[0.25em]"
              style={{ textShadow: '0 0 18px rgba(34,211,238,0.5)' }}
            >
              RAKHSHDATA
            </h1>
            <div className="text-[10px] text-cyan-600 tracking-[0.2em]">INITIALIZING SECURE ENVIRONMENT</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2 flex justify-between text-[10px] text-cyan-500/80 tracking-widest">
          <span>{errored ? 'STREAM WARNING' : sceneReady ? 'READY' : 'LOADING ASSET STREAM'}</span>
          <span className="text-cyan-300">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-cyan-950/60 border border-cyan-800/50 overflow-hidden mb-1">
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: errored ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#0891b2,#22d3ee)',
              transition: 'width 300ms ease-out',
              boxShadow: '0 0 10px rgba(34,211,238,0.6)',
            }}
          />
        </div>
        <div className="text-[9px] text-cyan-700 mb-4">
          {doneCount}/{total || '—'} MODULES · NODE {randHex()}:{randHex()}:{randHex()}
        </div>

        {/* Boot log */}
        <div
          ref={logRef}
          className="h-40 overflow-y-auto bg-black/60 border border-cyan-900/60 px-3 py-2 text-[10px] leading-relaxed"
        >
          {entries.length === 0 && <div className="text-cyan-700">SCANNING ASSET MANIFEST...</div>}
          {entries.map((e) => (
            <div key={e.id} className="flex justify-between gap-4">
              <span className={e.status === 'error' ? 'text-red-400' : e.status === 'ok' ? 'text-cyan-500' : 'text-cyan-800'}>
                {e.name}
              </span>
              <span className={e.status === 'error' ? 'text-red-400' : e.status === 'ok' ? 'text-emerald-400' : 'text-cyan-700'}>
                {e.status === 'ok' ? 'OK' : e.status === 'error' ? 'FAIL' : '...'}
              </span>
            </div>
          ))}
        </div>

        {errored && (
          <div className="mt-2 text-[9px] text-amber-400/80">
            Sebagian aset gagal dimuat — melanjutkan dengan yang tersedia.
          </div>
        )}

        {showSkip && !sceneReady && (
          <button
            onClick={() => {
              if (finishedRef.current) return;
              finishedRef.current = true;
              setSceneReady(true);
              setFadeOut(true);
              setTimeout(() => onComplete?.(), 550);
            }}
            className="mt-4 mx-auto block bg-black/60 border border-cyan-700/50 px-4 py-1.5 text-[10px] text-cyan-400 hover:bg-cyan-900/30 tracking-widest transition-all"
          >
            [ LEWATI ]
          </button>
        )}
      </div>
    </div>
  );
}