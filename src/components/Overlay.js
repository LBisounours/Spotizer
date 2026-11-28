import React, { useEffect, useState } from 'react';
import { loadJSON } from '../utils_storage';
import { formatClock } from '../utils';

// Overlay « Now Playing » pour OBS : ouvrir l'application avec ?overlay=1
// Reçoit les infos de la fenêtre principale via BroadcastChannel (temps réel) et localStorage (état initial).
const Overlay = () => {
  const [np, setNp] = useState(() => loadJSON('spotizer-now-playing', null));
  const [time, setTime] = useState({ currentTime: 0, duration: np?.duration || 0 });

  useEffect(() => {
    document.title = 'Spotizer — Overlay';
    document.body.style.background = 'transparent';
    document.documentElement.style.background = 'transparent';

    let channel = null;
    try {
      channel = new BroadcastChannel('spotizer-np');
      channel.onmessage = (e) => {
        if (e.data?.type === 'np') {
          setNp(e.data.payload);
          setTime({ currentTime: e.data.payload?.currentTime || 0, duration: e.data.payload?.duration || 0 });
        } else if (e.data?.type === 'time') {
          setTime({ currentTime: e.data.currentTime, duration: e.data.duration });
        }
      };
    } catch (err) { /* BroadcastChannel indisponible */ }

    const onStorage = (e) => {
      if (e.key === 'spotizer-now-playing') setNp(loadJSON('spotizer-now-playing', null));
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      if (channel) channel.close();
    };
  }, []);

  const visible = !!np && np.isPlaying;
  const pct = time.duration ? Math.min(100, (time.currentTime / time.duration) * 100) : 0;

  return (
    <div className={`overlay-root ${visible ? 'show' : ''}`}>
      <style>{`
        html, body, #root { background: transparent !important; margin: 0; overflow: hidden; }
        .overlay-root { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
        .overlay-card {
          display: inline-flex; align-items: center; gap: 16px; max-width: 520px;
          padding: 14px 20px 14px 14px; border-radius: 18px; color: #fff;
          background: linear-gradient(135deg, rgba(87,18,73,.92), rgba(153,23,240,.92));
          box-shadow: 0 10px 30px rgba(0,0,0,.45);
          transform: translateX(-120%); opacity: 0;
          transition: transform .6s cubic-bezier(.2,.9,.2,1), opacity .6s ease;
        }
        .overlay-root.show .overlay-card { transform: translateX(0); opacity: 1; }
        .overlay-card img { width: 76px; height: 76px; border-radius: 12px; object-fit: cover; flex: none; }
        .overlay-info { min-width: 0; }
        .overlay-label { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; opacity: .75; }
        .overlay-title { font-size: 22px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 380px; }
        .overlay-artist { font-size: 15px; opacity: .85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 380px; }
        .overlay-bar { margin-top: 8px; height: 5px; border-radius: 3px; background: rgba(255,255,255,.25); overflow: hidden; }
        .overlay-bar > div { height: 100%; background: #fff; border-radius: 3px; transition: width .4s linear; }
        .overlay-time { margin-top: 4px; font-size: 11px; opacity: .7; display: flex; justify-content: space-between; }
      `}</style>
      {np && (
        <div className="overlay-card">
          <img src={np.cover} alt="" />
          <div className="overlay-info">
            <div className="overlay-label">🎵 En lecture</div>
            <div className="overlay-title">{np.title}</div>
            <div className="overlay-artist">{np.artist}</div>
            <div className="overlay-bar"><div style={{ width: `${pct}%` }} /></div>
            <div className="overlay-time"><span>{formatClock(time.currentTime)}</span><span>{formatClock(time.duration)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overlay;
