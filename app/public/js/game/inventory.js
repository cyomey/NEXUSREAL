// ════════════════════════════════════════════════════════════════
// SECTION 9: INVENTORY
// ════════════════════════════════════════════════════════════════
G._invTab = 'items';
G._selItem = null;

G.openInv = (tab='items') => {
  G._invTab = tab; G._selItem = null;
  $('invOv').classList.add('on');
  G.switchTab(tab);
};
G.closeInv = () => { $('invOv').classList.remove('on'); G.hideItemCard(); };
G.switchTab = tab => {
  G._invTab = tab;
  $('it-items').classList.toggle('on', tab==='items');
  $('it-lore').classList.toggle('on', tab==='lore');
  G.renderInvList();
  $('invDT').textContent = 'Selecione um item';
  $('invDB').textContent = '';
  $('invUse').style.display = 'none';
};

G.renderInvList = () => {
  const list = $('invList'); list.innerHTML = '';
  const items = G._invTab === 'items' ? G.S.inv : G.S.lore;
  if (!items.length) { list.innerHTML='<div class="inv-empty">Vazio.</div>'; return; }
  items.forEach(item => {
    const d = document.createElement('div'); d.className = 'ii';
    d.innerHTML = `${item.name||item.title}<span class="cat">${item.cat||'doc'}</span>`;
    d.onclick = () => {
      document.querySelectorAll('.ii').forEach(el=>el.classList.remove('sel'));
      d.classList.add('sel');
      G._selItem = item;
      $('invDT').textContent = item.name || item.title;
      $('invDB').textContent = item.desc || item.body || '';
      const usable = G._invTab==='items' && item.usableIn?.length;
      $('invUse').style.display = usable ? 'block' : 'none';
    };
    list.appendChild(d);
  });
};

G.useItem = () => {
  if (!G._selItem) return;
  const item = G._selItem;
  G.closeInv();
  // Show item card on scene
  G.showItemCard(item.name, item.desc);
  // Context-specific use
  if (item.id === 'pasta_vermelha') {
    G.notify('Pasta Vermelha exibida — código: 170492', 'item');
    G.showItemCardGame('PASTA VERMELHA', 'Código: 170492\nPadrão: R-17-U-04-E-92-L');
    if (G.S.scene === 'elev_with_code' || G.S.scene === 'elev_first') {
      G.openMG('elev_code');
    }
  } else {
    G.showItemCardGame(item.name, item.desc);
  }
};

