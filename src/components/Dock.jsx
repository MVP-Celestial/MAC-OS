import React, { useRef, useEffect } from 'react'
import "./dock.scss"


const MAX_SCALE = 1.5;
const SIGMA = 60;
const LERP = 0.2;
const SHIFT_LERP = 0.15;
const LIFT = 18;
const DISPLACEMENT = 0.5;

const Dock = ({windowsState, setWindowsState}) => {
  const dockRef = useRef(null);   // the icon row (flex container)
  const bgRef = useRef(null);     // the translucent pill, absolutely positioned
  const iconRefs = useRef([]);
  iconRefs.current = [];
  const mouseX = useRef(null);
  const scales = useRef([]);
  const shifts = useRef([]);
  const bg = useRef({ left: 0, width: 0, ready: false });

  const addIconRef = (el) => {
    if (el && !iconRefs.current.includes(el)) iconRefs.current.push(el);
  };

  useEffect(() => {
    const n = iconRefs.current.length;
    scales.current = Array.from({ length: n }, () => ({ current: 1, target: 1 }));
    shifts.current = Array.from({ length: n }, () => ({ current: 0, target: 0 }));

    const dock = dockRef.current;

    const onMove = (e) => {
      const rect = dock.getBoundingClientRect();
      mouseX.current = e.clientX - rect.left;
    };
    const onLeave = () => { mouseX.current = null; };

    dock.addEventListener("mousemove", onMove);
    dock.addEventListener("mouseleave", onLeave);

    let raf;
    const tick = () => {
      const dockRect = dock.getBoundingClientRect();
      const baseWidth = iconRefs.current[0]?.getBoundingClientRect().width || 60;

      // cache the resting-state box exactly once
      if (!bg.current.ready) {
        bg.current.left = 0;
        bg.current.width = dockRect.width;
        bg.current.ready = true;
      }

      const centers = iconRefs.current.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left - dockRect.left + r.width / 2;
      });

      centers.forEach((center, i) => {
        let target = 1;
        if (mouseX.current !== null) {
          const d = mouseX.current - center;
          target = 1 + (MAX_SCALE - 1) * Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
        }
        scales.current[i].target = target;
      });

      const n2 = iconRefs.current.length;
      for (let i = 0; i < n2; i++) {
        let shift = 0;
        for (let j = 0; j < n2; j++) {
          if (j === i) continue;
          const growth = (scales.current[j].target - 1) * baseWidth * 0.5;
          if (growth <= 0) continue;
          shift += j < i ? growth * DISPLACEMENT : -growth * DISPLACEMENT;
        }
        shifts.current[i].target = shift;
      }

      iconRefs.current.forEach((el, i) => {
        const s = scales.current[i];
        const sh = shifts.current[i];
        s.current += (s.target - s.current) * LERP;
        sh.current += (sh.target - sh.current) * SHIFT_LERP;

        const lift = (s.current - 1) * LIFT;
        el.style.transform = `translateX(${sh.current}px) translateY(${-lift}px) scale(${s.current})`;
        el.style.zIndex = Math.round(s.current * 100);
      });

      // --- figure out how far the pill needs to stretch on each side ---
      const first = { scale: scales.current[0], shift: shifts.current[0] };
      const last = { scale: scales.current[n2 - 1], shift: shifts.current[n2 - 1] };

      const extraLeft = Math.max(0, -last === first ? 0 :
        -(first.shift.current) + (first.scale.current - 1) * baseWidth * 0.5);
      const extraRight = Math.max(0,
        last.shift.current + (last.scale.current - 1) * baseWidth * 0.5);

      const targetLeft = -extraLeft;
      const targetWidth = bg.current.width + extraLeft + extraRight;

      // lerp the pill itself so it grows/shrinks smoothly too
      bg.current.curLeft = bg.current.curLeft ?? 0;
      bg.current.curWidth = bg.current.curWidth ?? bg.current.width;
      bg.current.curLeft += (targetLeft - bg.current.curLeft) * SHIFT_LERP;
      bg.current.curWidth += (targetWidth - bg.current.curWidth) * SHIFT_LERP;

      if (bgRef.current) {
        bgRef.current.style.transform = `translateX(${bg.current.curLeft}px)`;
        bgRef.current.style.width = `${bg.current.curWidth}px`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      dock.removeEventListener("mousemove", onMove);
      dock.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="dock-wrapper">
      <div className="dock-bg" ref={bgRef}></div>
      <footer className='dock' ref={dockRef}>
        <div
        onClick={()=>{setWindowsState(state=>({...state, github:true}))}}
        className="icon github" ref={addIconRef}><img src="/doc-icons/github.svg" alt="" /></div>
        <div
        onClick={()=>{setWindowsState(state=>({...state, note:true}))}}
        className="icon note" ref={addIconRef}><img src="/doc-icons/note.svg" alt="" /></div>

        <div
        onClick={()=>{setWindowsState(state=>({...state, resume:true}))}}
         className="icon pdf" ref={addIconRef}><img src="/doc-icons/pdf.svg" alt="" /></div>
        <div
        className="icon calender" ref={addIconRef}><img src="/doc-icons/calender.svg" alt="" /></div>
        <div 
        onClick={()=>{setWindowsState(state=>({...state, spotify:true}))}}
         className="icon spotify" ref={addIconRef}><img src="/doc-icons/spotify.svg" alt="" /></div>

        <div
        onClick={()=>{setWindowsState(state=>({...state, mail:true}))}}
        className="icon mail" ref={addIconRef}><img src="/doc-icons/mail.svg" alt="" /></div>
        <div
        onClick={()=>{setWindowsState(state=>({...state, cli:true}))}}
         className="icon cli" ref={addIconRef}><img src="/doc-icons/cli.svg" alt="" /></div>
      </footer>
    </div>
  )
}

export default Dock