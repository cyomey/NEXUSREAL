G.getSaveSlots = () => {
  try {
    const s = localStorage.getItem(SLOTS_KEY) || sessionStorage.getItem(SLOTS_KEY) || '{"1":{},"2":{},"3":{}}';
    return JSON.parse(s);
  } catch(e) { return {'1':{},'2':{},'3':{}}; }
};

G.saveToSlot = (slot) => {
  if (!G.S) return;
  try {
    const slots = G.getSaveSlots();
    slots[slot] = { ...G.S, timestamp: new Date().toLocaleString() };
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
    sessionStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
    G.notify(`Jogo salvo no SLOT ${slot}`, 'item');
    G.openSaveSlots(); // Recarregar modal com dados atualizados
    return true;
  } catch(e) { console.warn('Slot save failed:', e); return false; }
};

G.loadFromSlot = (slot) => {
  try {
    const slots = G.getSaveSlots();
    if (slots[slot] && Object.keys(slots[slot]).length > 0) {
      G.S = slots[slot];
      return true;
    }
  } catch(e) { console.warn('Slot load failed:', e); }
  return false;
};

G.saveState = (syncApi = true) => {
  try {
    const data = JSON.stringify(G.S);
    localStorage.setItem(SAVE_KEY, data);
    sessionStorage.setItem(SAVE_KEY, data);
    if (syncApi) G.syncProgress();
  } catch(e) { console.warn('Save failed:', e); }
};

G.loadState = () => {
  try {
    const d = localStorage.getItem(SAVE_KEY) || sessionStorage.getItem(SAVE_KEY);
    if (d) { G.S = JSON.parse(d); return true; }
  } catch(e) { console.warn('Load failed:', e); }
  return false;
};

G.saveMural = (key, type='ending') => {
  try {
    const m = JSON.parse(localStorage.getItem(MURAL_KEY) || '{"endings":[],"deaths":[]}');
    if (type === 'ending') { if (!m.endings.includes(key)) m.endings.push(key); }
    else { if (!m.deaths.includes(key)) m.deaths.push(key); }
    localStorage.setItem(MURAL_KEY, JSON.stringify(m));
    sessionStorage.setItem(MURAL_KEY, JSON.stringify(m));
    G.syncMural(key, type);
  } catch(e) {}
};

G.getMural = () => {
  try {
    return JSON.parse(localStorage.getItem(MURAL_KEY) || sessionStorage.getItem(MURAL_KEY) || '{"endings":[],"deaths":[]}');
  } catch(e) { return {endings:[], deaths:[]}; }
};

// ── State ──
G.initState = (name, gen) => {
  G.S = {
    name, gen, sync: 75, sus: 0, frags: 0,
    scene: null, lineIdx: 0, typing: false,
    inv: [], lore: [], flags: {}, path: '',
    bossHP: {p:100, r:150},
    backTarget: null,
  };
};
