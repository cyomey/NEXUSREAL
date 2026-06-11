
// ── Screen management ──
G.showScr = id => {
  document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
  $(id).classList.add('on');
};

// ── Flash effects ──
G.flash = (color, dur=450) => {
  const el = $('flashEl');
  el.style.background = color;
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, dur);
};
G.flashGood = () => G.flash('rgba(60,180,80,.14)', 400);
G.flashBad = () => {
  G.flash('rgba(200,30,30,.2)', 500);
  const el = $('flashEl');
  let x = 0;
  const shake = setInterval(() => {
    el.style.transform = `translateX(${['-3px','4px','-2px','0'][x%4]})`;
    if(++x >= 4) { clearInterval(shake); el.style.transform = ''; }
  }, 60);
};
G.glitch = (dur=400) => G.flash('rgba(200,30,30,.12)', dur);

// ── HUD ──
G.updateHUD = () => {
  const s = Math.max(0, Math.min(100, G.S.sync));
  $('hSB').style.width = s + '%';
  $('hSB').style.background = s>50?'#3a8a48':s>25?'#8a7020':'#8a2020';
  $('hSV').textContent = s + '%';
  const su = Math.max(0, Math.min(100, G.S.sus));
  $('hSuB').style.width = su + '%';
  $('hSuV').textContent = su + '%';
  $('hFrag').textContent = G.S.frags;
};
G.setSync = v => { G.S.sync = Math.max(0, Math.min(100, v)); G.updateHUD(); };
G.setSus = v => { G.S.sus = Math.max(0, Math.min(100, v)); G.updateHUD(); };

// ── Notifications ──
G.notify = (msg, type='lore') => {
  const box = $('notifBox');
  const el = document.createElement('div');
  el.className = 'notif ' + type;
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(), 350); }, 3200);
};

// ── Items & Lore ──
G.addItem = (id, name, cat, desc, usableIn=[]) => {
  if (G.S.inv.find(i => i.id===id)) return;
  G.S.inv.push({id, name, cat, desc, usableIn});
  G.notify('+ ITEM: ' + name, 'item');
  G.saveState();
};
G.addLore = (id, title, body) => {
  if (G.S.lore.find(l => l.id===id)) return;
  G.S.lore.push({id, title, body});
  G.S.frags++;
  G.updateHUD();
  G.notify('◈ LORE: ' + title, 'lore');
  G.flashGood();
  G.saveState();
};
G.hasItem = id => !!G.S.inv.find(i => i.id===id);
G.hasFlag = f => !!G.S.flags[f];
G.setFlag = f => { G.S.flags[f] = true; G.saveState(); };

// ── Contextual item card on scene ──
G.showItemCard = (title, body) => {
  $('icTitle').textContent = title;
  $('icBody').textContent = body;
  $('itemCard').style.display = 'block';
};
G.hideItemCard = () => { $('itemCard').style.display = 'none'; };

G.showItemCardGame = (title, body) => {
  const card = $('itemCardGame');
  if (!card) return;
  card.innerHTML = `<div style="color:#7abf84;font-weight:bold;margin-bottom:.3rem;font-size:.6rem;letter-spacing:.08em">${title}</div><div style="color:#3a6a44;font-size:.52rem;white-space:pre-wrap;line-height:1.4">${body}</div>`;
  card.classList.add('on');
};

G.hideItemCardGame = () => {
  const card = $('itemCardGame');
  if (card) card.classList.remove('on');
};

// ── Clock ──
G.startClock = () => {
  clearInterval(G._clk);
  G._clk = setInterval(() => {
    const n = new Date();
    $('camTm').textContent = n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0');
  }, 1000);
};

// ── Game entry points ──
G.startGame = async () => {
  const n = $('tName').value.trim();
  if (!n) { $('tName').style.borderColor='#cc2a2a'; $('tName').focus(); return; }
  const gen = document.querySelector('input[name="gen"]:checked')?.value || 'f';
  G.initState(n, gen);

  try {
    await G.syncStart();
  } catch (e) {
    alert('Nao foi possivel iniciar: a API/camadas do sistema nao responderam.\n\n' + e.message);
    return;
  }

  G.showScr('sGame');
  G.updateHUD();
  G.startClock();
  G.goScene('room_start');
};

G.tryResume = () => {
  const slots = G.getSaveSlots();
  const hasSaves = Object.values(slots).some(s => s.name);
  if (hasSaves) {
    $('resumeOv').classList.add('on');
    const cont = $('resumeContainer');
    cont.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
      const s = slots[i] || {};
      if (s.name) {
        const el = document.createElement('div');
        el.className = 'slotCard';
        el.innerHTML = `
          <div style="font-size:.72rem;color:#7abf84;margin-bottom:.3rem">SLOT ${i}</div>
          <div style="font-size:.56rem;color:#3a6a44;margin-bottom:.5rem">
            Nome: ${s.name}<br>Cena: ${s.scene || 'N/A'}<br>Tempo: ${s.timestamp || 'N/A'}
          </div>
          <button class="pb sm g" onclick="G.resumeFromSlot(${i})">[ RETOMAR ]</button>
        `;
        cont.appendChild(el);
      }
    }
  } else {
    alert('Nenhuma sessão encontrada.');
  }
};

G.resumeFromSlot = (slot) => {
  if (G.loadFromSlot(slot)) {
    G.showScr('sGame');
    G.updateHUD();
    G.startClock();
    
    // Preparar cena sem resetar lineIdx
    const sc = SCENES[G.S.scene];
    if (sc) {
      if (sc.mg) { G.openMG(sc.mg); }
      else if (sc.death) { G.doDeath(sc.death.title, sc.death.body, sc.death.cause, sc.death.key); }
      else if (sc.final) { G.doFinal(sc.final); }
      else {
        G.showScr('sGame');
        ART.draw(sc.art || 'corridor');
        PORT.draw();
        G.renderLine(); // Renderiza a linha no índice salvo
      }
    }
    
    $('resumeOv').classList.remove('on');
  } else {
    alert('Erro ao carregar save.');
  }
};

G.closeResumeSlots = () => {
  $('resumeOv').classList.remove('on');
};

G.restart = () => {
  try { localStorage.removeItem(SAVE_KEY); sessionStorage.removeItem(SAVE_KEY); } catch(e) {}
  location.reload();
};

G.returnToMenu = () => {
  G.showScr('sTitle');
  G.S = null;
  $('tName').value = '';
};

G.saveCheckpoint = (label) => {
  G.saveState();
  console.log('[CHECKPOINT] ' + label);
};

G.openSaveSlots = () => {
  $('saveOv').classList.add('on');
  const slots = G.getSaveSlots();
  const cont = $('slotsContainer');
  cont.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const s = slots[i] || {};
    const el = document.createElement('div');
    el.className = 'slotCard';
    const hasData = s.name ? 'true' : '';
    el.style.opacity = hasData ? '1' : '0.6';
    el.innerHTML = `
      <div style="font-size:.72rem;color:#7abf84;margin-bottom:.3rem">SLOT ${i}</div>
      <div style="font-size:.56rem;color:#3a6a44;margin-bottom:.5rem">
        ${s.name ? `Nome: ${s.name}<br>Cena: ${s.scene || 'N/A'}<br>Tempo: ${s.timestamp || 'N/A'}` : '[VAZIO]'}
      </div>
      <button class="pb sm" onclick="G.saveToSlot(${i})">[ SALVAR ]</button>
    `;
    cont.appendChild(el);
  }
};

G.closeSaveSlots = () => {
  $('saveOv').classList.remove('on');
};

G.openLoadSlots = () => {
  $('loadOv').classList.add('on');
  const slots = G.getSaveSlots();
  const cont = $('loadsContainer');
  cont.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const s = slots[i] || {};
    if (s.name) {
      const el = document.createElement('div');
      el.className = 'slotCard';
      el.innerHTML = `
        <div style="font-size:.72rem;color:#7abf84;margin-bottom:.3rem">SLOT ${i}</div>
        <div style="font-size:.56rem;color:#3a6a44;margin-bottom:.5rem">
          Nome: ${s.name}<br>Cena: ${s.scene || 'N/A'}<br>Tempo: ${s.timestamp || 'N/A'}
        </div>
        <button class="pb sm g" onclick="G.loadAndResume(${i})">[ CARREGAR ]</button>
      `;
      cont.appendChild(el);
    }
  }
};

G.loadAndResume = (slot) => {
  if (G.loadFromSlot(slot)) {
    G.showScr('sGame');
    G.updateHUD();
    G.startClock();
    const sc = SCENES[G.S.scene];
    if (sc) {
      if (sc.mg) { G.openMG(sc.mg); }
      else if (sc.death) { G.doDeath(sc.death.title, sc.death.body, sc.death.cause, sc.death.key); }
      else if (sc.final) { G.doFinal(sc.final); }
      else {
        ART.draw(sc.art || 'corridor');
        PORT.draw();
        G.renderLine();
      }
    }
    $('loadOv').classList.remove('on');
  }
};

G.closeLoadSlots = () => {
  $('loadOv').classList.remove('on');
};

// ── Pronoun helpers ──
G.pr = () => ({ f:{o:'a',um:'uma',ele:'ela'}, m:{o:'o',um:'um',ele:'ele'}, n:{o:'o(a)',um:'um(a)',ele:'ele/ela'} }[G.S.gen]);
