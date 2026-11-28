import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOffline } from '../contexts/OfflineContext';
import { useToast } from '../contexts/ToastContext';
import { getBlobUrl } from '../offline';
import { loadJSON, saveJSON } from '../utils_storage';

const ROUNDS = 10;
const CLIP = 12; // secondes d'extrait
const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

// Blind test : un extrait au hasard, 4 choix, score + meilleur score
const BlindTest = ({ musicDatabase, currentTheme, onPausePlayer }) => {
  const off = useOffline();
  const { toast } = useToast();
  const audioRef = useRef(null);
  const [round, setRound] = useState(-1);
  const [questions, setQuestions] = useState([]);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => loadJSON('spotizer-blind-best', 0) || 0);
  const [clipLeft, setClipLeft] = useState(CLIP);
  const [loading, setLoading] = useState(false);

  const pool = useMemo(() => musicDatabase.filter((t) => off.canPlay(t)), [musicDatabase, off]);

  const stop = useCallback(() => { const a = audioRef.current; if (a) { a.pause(); if (a.dataset.blob) URL.revokeObjectURL(a.dataset.blob); a.removeAttribute('src'); } }, []);
  useEffect(() => () => stop(), [stop]);

  const playClip = useCallback(async (track) => {
    stop();
    setLoading(true);
    let src = track.audioUrl;
    let blob = null;
    if (off.isDownloaded(track.id)) { try { blob = await getBlobUrl(track); } catch (e) { blob = null; } if (blob) src = blob; }
    const a = audioRef.current || (audioRef.current = new Audio());
    a.dataset.blob = blob || '';
    a.src = src;
    a.onloadedmetadata = () => {
      const d = a.duration || 60;
      a.currentTime = Math.max(0, Math.random() * Math.max(0, d - CLIP - 5) + 3);
    };
    a.oncanplay = () => { setLoading(false); a.play().catch(() => {}); a.oncanplay = null; };
    a.onerror = () => { setLoading(false); toast('Extrait indisponible, titre suivant', '⚠️'); };
    setClipLeft(CLIP);
  }, [off, stop, toast]);

  useEffect(() => {
    if (round < 0 || round >= questions.length) return undefined;
    playClip(questions[round].answer);
    return undefined;
  }, [round, questions, playClip]);

  useEffect(() => {
    if (round < 0 || picked !== null || loading) return undefined;
    const id = setInterval(() => setClipLeft((n) => {
      if (n <= 1) { const a = audioRef.current; if (a) a.pause(); return 0; }
      return n - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [round, picked, loading]);

  const start = () => {
    if (pool.length < 4) { toast('Pas assez de titres lisibles pour jouer', '⚠️'); return; }
    if (onPausePlayer) onPausePlayer();
    const answers = shuffle(pool).slice(0, Math.min(ROUNDS, pool.length));
    const qs = answers.map((answer) => {
      const wrong = shuffle(pool.filter((t) => t.id !== answer.id && t.title !== answer.title)).slice(0, 3);
      return { answer, choices: shuffle([answer, ...wrong]) };
    });
    setScore(0); setPicked(null); setQuestions(qs); setRound(0);
  };

  const choose = (t) => {
    if (picked !== null) return;
    setPicked(t.id);
    const good = t.id === questions[round].answer.id;
    if (good) setScore((s) => s + 1);
    try { navigator.vibrate && navigator.vibrate(good ? 10 : [30, 40, 30]); } catch (e) { /* ignore */ }
    const a = audioRef.current; if (a) { a.currentTime = Math.max(0, a.currentTime); a.play().catch(() => {}); }
  };

  const next = () => {
    setPicked(null);
    if (round + 1 >= questions.length) {
      stop();
      setRound(questions.length);
      if (score > best) { setBest(score); saveJSON('spotizer-blind-best', score); }
    } else setRound(round + 1);
  };

  const finished = round >= 0 && round >= questions.length && questions.length > 0;
  const q = round >= 0 && round < questions.length ? questions[round] : null;

  return (
    <div className="page-container blind-page">
      <h1 className="page-title">🎯 Blind test</h1>
      <p className="page-subtitle">Devine le titre à partir d'un extrait de {CLIP} secondes • Meilleur score : {best}/{ROUNDS}</p>

      {!q && !finished && (
        <div className="blind-card">
          <p>{pool.length} titres disponibles{!off.online ? ' (hors-ligne : seulement les téléchargés)' : ''}.</p>
          <button className="blind-start" style={{ background: currentTheme.gradient }} onClick={start}>▶️ Commencer ({Math.min(ROUNDS, pool.length)} manches)</button>
        </div>
      )}

      {q && (
        <div className="blind-card">
          <div className="blind-top"><span>Manche {round + 1}/{questions.length}</span><span>Score : {score}</span></div>
          <div className={`blind-disc ${picked === null && !loading ? 'spin' : ''}`}>
            {picked !== null ? <img src={q.answer.cover} alt="" /> : <span>{loading ? '…' : clipLeft}</span>}
          </div>
          <div className="blind-choices">
            {q.choices.map((t) => {
              const state = picked === null ? '' : t.id === q.answer.id ? 'good' : t.id === picked ? 'bad' : 'dim';
              return (
                <button key={t.id} className={`blind-choice ${state}`} onClick={() => choose(t)} disabled={picked !== null}>
                  <strong>{t.title}</strong><small>{t.artist}</small>
                </button>
              );
            })}
          </div>
          {(picked !== null || clipLeft === 0) && (
            <button className="blind-start" style={{ background: currentTheme.gradient }} onClick={() => { if (picked === null) setPicked(-1); else next(); }}>
              {picked === null ? 'Révéler la réponse' : round + 1 >= questions.length ? 'Voir le résultat' : 'Suivant ➜'}
            </button>
          )}
        </div>
      )}

      {finished && (
        <div className="blind-card">
          <h2>{score >= 8 ? '🏆 Impressionnant !' : score >= 5 ? '👏 Pas mal !' : '🎧 Continue d\'écouter !'}</h2>
          <p className="blind-score">{score} / {questions.length}</p>
          <button className="blind-start" style={{ background: currentTheme.gradient }} onClick={start}>🔁 Rejouer</button>
        </div>
      )}
    </div>
  );
};

export default BlindTest;
