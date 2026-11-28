// Lecture/écriture sécurisées du localStorage (JSON corrompu, mode privé, quota plein...)
export const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
};

export const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Sauvegarde impossible pour', key, e);
  }
};
