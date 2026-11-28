// Utilitaires partagés

// Normalise un texte : minuscules, sans accents (recherche tolérante)
export const normalize = (s) =>
  (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

// "3:45" -> 225 ; "1:02:35" -> 3755
export const parseDuration = (d) => {
  if (!d) return 0;
  const parts = String(d).split(':').map(Number);
  if (parts.some((n) => Number.isNaN(n))) return 0;
  return parts.reduce((acc, v) => acc * 60 + v, 0);
};

// 8040 -> "2 h 14 min"
export const formatTotal = (seconds) => {
  const totalMin = Math.round((seconds || 0) / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h} h ${String(m).padStart(2, '0')} min` : `${m} min`;
};

export const formatClock = (time) => {
  if (!time || Number.isNaN(time)) return '0:00';
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
};

// "Lomepal ft. Roméo Elvis" -> ["Lomepal", "Roméo Elvis"]
export const splitArtists = (artist) =>
  (artist || '')
    .split(/\s+(?:ft\.?|feat\.?|&)\s+|\s*,\s*/i)
    .map((a) => a.trim())
    .filter(Boolean);

export const primaryArtist = (artist) => splitArtists(artist)[0] || (artist || '').trim();

export const dayKey = (date = new Date()) => date.toISOString().split('T')[0];

export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (err) {
      return false;
    }
  }
};

// Éclaircit (percent > 0) ou assombrit (percent < 0) une couleur hexadécimale
export const shadeColor = (hex, percent) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (255 * percent) / 100)));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Mixes par humeur : chaque humeur regroupe des genres de la bibliothèque
export const MOODS = [
  {
    id: 'chill', name: 'Chill', emoji: '🌙', desc: 'Pour se détendre',
    genres: ['Indie', 'Indie pop', 'Indie Pop', 'Indie Folk', 'Pop Indé', 'Bedroom Pop', 'Folk', 'Folk rock', 'Soul-Pop', 'Alternative Pop']
  },
  {
    id: 'energie', name: 'Énergie', emoji: '⚡', desc: 'Pour se motiver',
    genres: ['Metal', 'Rock', 'Alternative Rock', 'Rock Pop punk', 'Pop Rock', 'Hardtekk', 'Electro', 'Electro Pop', 'Eurodance', 'New wave']
  },
  {
    id: 'melancolie', name: 'Mélancolie', emoji: '🌧️', desc: 'Pour les jours gris',
    genres: ['Emo Rap', 'Alternative', 'Pop Indé', 'Indie', 'Indie pop']
  },
  {
    id: 'soiree', name: 'Soirée', emoji: '🎉', desc: 'Pour faire la fête',
    genres: ['Electro Swing', 'Pop Rap', 'R&B', 'Eurodance', 'Future Funk', 'Remix', 'Rap']
  },
  {
    id: 'anime', name: 'Anime & Jeux', emoji: '🎮', desc: 'Openings, OST et films',
    genres: ['Opening', 'OST', 'Film', 'Jeux', 'Soundtrack', 'J-Pop']
  },
  {
    id: 'scene', name: 'Scène & Humour', emoji: '🎭', desc: 'Théâtre et comédie',
    genres: ['Théâtre', 'Comedy']
  },
  {
    id: 'ia', name: 'Créations IA', emoji: '🤖', desc: 'Les titres générés',
    genres: ['IA']
  }
];

export const moodTracks = (mood, db) => {
  const set = new Set(mood.genres.map(normalize));
  return db.filter((t) => set.has(normalize(t.genre)));
};
