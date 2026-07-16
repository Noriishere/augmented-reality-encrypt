import { useRef, useEffect, useCallback } from 'react';
import '../assets/css/MobileTouchControls.css';

const PITCH_LIMIT_DEG = 89;
const LOOK_SENSITIVITY = 0.25;
const JOY_MAX_RADIUS = 45;

export default function MobileTouchControls({ isVRMode, disabled }) {
    const joystickTouchId = useRef(null);
    const lookTouchId = useRef(null);
    const joystickBaseRef = useRef(null);
    const joystickKnobRef = useRef(null);
    const cameraElRef = useRef(null);
    const cursorElRef = useRef(null);
    const interactBtnRef = useRef(null);
    const targetElRef = useRef(null);
    const lookLast = useRef({ x: 0, y: 0 });

    useEffect(() => {
        let raf, attempts = 0;
        const tryFind = () => {
            const cam = document.querySelector('a-camera');
            const cursor = document.querySelector('a-cursor');
            if (cam) cameraElRef.current = cam;
            if (cursor) cursorElRef.current = cursor;
            if ((!cam || !cursor) && ++attempts < 60) raf = requestAnimationFrame(tryFind);
        };
        tryFind();
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        if (isVRMode) return;
        let raf;
        const poll = () => {
            const raycaster = cursorElRef.current?.components?.raycaster;
            const target = raycaster?.intersectedEls?.[0] || null;
            targetElRef.current = target;
            if (interactBtnRef.current) {
                interactBtnRef.current.classList.toggle('is-active', !!target && !disabled);
            }
            raf = requestAnimationFrame(poll);
        };
        raf = requestAnimationFrame(poll);
        return () => cancelAnimationFrame(raf);
    }, [isVRMode, disabled]);

    const getLook = useCallback(
        () => cameraElRef.current?.components?.['look-controls'] || null,
        []
    );

    const handleJoyStart = (e) => {
        if (disabled || joystickTouchId.current !== null) return;
        const t = e.changedTouches[0];
        joystickTouchId.current = t.identifier;
        const base = joystickBaseRef.current;
        if (base) {
            base.style.left = `${t.clientX}px`;
            base.style.top = `${t.clientY}px`;
            base.style.opacity = '1';
        }
        updateJoystick(t.clientX, t.clientY);
    };

    const updateJoystick = (x, y) => {
        const base = joystickBaseRef.current;
        const knob = joystickKnobRef.current;
        if (!base || !knob) return;

        const rect = base.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.min(Math.hypot(dx, dy), JOY_MAX_RADIUS);
        const angle = Math.atan2(dy, dx);
        const kx = Math.cos(angle) * dist;
        const ky = Math.sin(angle) * dist;
        knob.style.transform = `translate(${kx}px, ${ky}px)`;

        cameraElRef.current?.dispatchEvent(
            new CustomEvent('thumbstickmoved', {
                detail: { x: kx / JOY_MAX_RADIUS, y: ky / JOY_MAX_RADIUS },
            })
        );
    };

    const handleJoyMove = (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier === joystickTouchId.current) updateJoystick(t.clientX, t.clientY);
        }
    };

    const endJoystick = (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier !== joystickTouchId.current) continue;
            joystickTouchId.current = null;
            if (joystickKnobRef.current) joystickKnobRef.current.style.transform = 'translate(0px, 0px)';
            if (joystickBaseRef.current) joystickBaseRef.current.style.opacity = '0';
            cameraElRef.current?.dispatchEvent(
                new CustomEvent('thumbstickmoved', { detail: { x: 0, y: 0 } })
            );
        }
    };

    const handleLookStart = (e) => {
        if (disabled || lookTouchId.current !== null) return;
        const t = e.changedTouches[0];
        lookTouchId.current = t.identifier;
        lookLast.current = { x: t.clientX, y: t.clientY };
    };

    const handleLookMove = (e) => {
        const look = getLook();
        if (!look) return;

        for (const t of e.changedTouches) {
            if (t.identifier !== lookTouchId.current) continue;

            const dx = t.clientX - lookLast.current.x;
            const dy = t.clientY - lookLast.current.y;
            lookLast.current = { x: t.clientX, y: t.clientY };

            look.yawObject.rotation.y -= dx * LOOK_SENSITIVITY * (Math.PI / 180);

            const limit = PITCH_LIMIT_DEG * (Math.PI / 180);
            const nextPitch = look.pitchObject.rotation.x - dy * LOOK_SENSITIVITY * (Math.PI / 180);
            look.pitchObject.rotation.x = Math.max(-limit, Math.min(limit, nextPitch));
        }
    };

    const endLook = (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier === lookTouchId.current) lookTouchId.current = null;
        }
    };

    const handleInteract = () => {
        if (disabled) return;
        const target = targetElRef.current;
        if (target) target.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    };

    if (isVRMode) return null;

    return (
        <div className="mobile-touch-controls" aria-hidden="true">
            <div
                className="touch-zone touch-zone--joystick"
                onTouchStart={handleJoyStart}
                onTouchMove={handleJoyMove}
                onTouchEnd={endJoystick}
                onTouchCancel={endJoystick}
            >
                <div ref={joystickBaseRef} className="joystick-base">
                    <div ref={joystickKnobRef} className="joystick-knob" />
                </div>
            </div>

            <div
                className="touch-zone touch-zone--look"
                onTouchStart={handleLookStart}
                onTouchMove={handleLookMove}
                onTouchEnd={endLook}
                onTouchCancel={endLook}
            />

            <button
                ref={interactBtnRef}
                type="button"
                className={`interact-button${disabled ? ' is-disabled' : ''}`}
                onTouchStart={(e) => { e.stopPropagation(); handleInteract(); }}
                onClick={handleInteract}
            >
                INTERAKSI
            </button>
        </div>
    );
}