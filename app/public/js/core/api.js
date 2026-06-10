G.api = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.erro || 'Falha na API NEXUS.');
  }
  return data;
};

G.syncStart = async () => {
  if (!G.S?.name) return;

  const body = new URLSearchParams({
    nome: G.S.name,
    genero: G.S.gen || 'f',
  });

  const data = await G.api('/jogador/iniciar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  });

  if (data.jogador?.id) {
    G.S.playerId = data.jogador.id;
    G.saveState(false);
  }

  return data.jogador;
};

G.syncProgress = async () => {
  if (!G.S?.playerId || !G.S.scene) return;

  try {
    await G.api('/jogador/progresso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: G.S.playerId,
        cena: G.S.scene,
        sync: G.S.sync || 0,
        suspeita: G.S.sus || 0,
        frags: G.S.frags || 0,
        path: G.S.path || '',
        flags: G.S.flags || {},
        inventario: G.S.inv || [],
        lore: G.S.lore || [],
      }),
    });
  } catch (e) {
    console.warn('API progresso indisponível:', e.message);
  }
};

G.syncMural = async (key, type = 'ending') => {
  if (!G.S?.playerId) return;

  try {
    await G.api('/jogador/final', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: G.S.playerId,
        chave: key,
        tipo: type,
      }),
    });
  } catch (e) {
    console.warn('API mural indisponível:', e.message);
  }
};
