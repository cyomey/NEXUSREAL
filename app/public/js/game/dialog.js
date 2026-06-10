// ════════════════════════════════════════════════════════════════
// SECTION 4: DIALOGUE ENGINE
// ════════════════════════════════════════════════════════════════
let _typeTimer = null;

G.setChar = (charId, name) => {
  $('spkName').textContent = name;
  PORT.draw(charId);
};

G.typeText = (el, text, cb) => {
  if (_typeTimer) clearInterval(_typeTimer);
  let i = 0; el.textContent = '';
  el.className = charId => charId === 'ruel' ? 'glitch' : '';
  _typeTimer = setInterval(() => {
    el.textContent += text[i++] || '';
    if (i >= text.length) { clearInterval(_typeTimer); _typeTimer = null; if (cb) cb(); }
  }, 20);
};

G.skipTyping = () => {
  if (_typeTimer) { clearInterval(_typeTimer); _typeTimer = null; }
};

// Global click handler — advances dialogue
document.getElementById('sGame').addEventListener('click', e => {
  // If a minigame just closed, ignore the very next scene click to avoid accidental reopens
  if (G._ignoreNextClick) { G._ignoreNextClick = false; return; }
  // Don't fire if clicking a button or choice
  if (e.target.closest('button') || e.target.closest('.ch') || e.target.closest('#hudBar') || e.target.closest('#backBtn')) return;
  G.sceneClick();
});

G.sceneClick = () => {
  if (G.S.typing) {
    // Completa a digitação instantaneamente ao clicar
    G.skipTyping();
    const sc = SCENES[G.S.scene];
    if (sc && sc.lines && sc.lines[G.S.lineIdx]) {
      const l = sc.lines[G.S.lineIdx];
      $('dialTxt').textContent = typeof l.text === 'function' ? l.text() : l.text;
    }
    G.S.typing = false;
    $('advHint').classList.add('blink');
    return;
  }
  G.S.lineIdx++;
  G.renderLine();
};

// ════════════════════════════════════════════════════════════════
// SECTION 5: SCENE SYSTEM
// ════════════════════════════════════════════════════════════════
G.goScene = (sceneId) => {
  if (typeof sceneId === 'function') sceneId = sceneId();
  if (!sceneId) return;
  G.S.scene = sceneId;
  G.S.lineIdx = 0;
  G.S.typing = false;
  G.saveState();

  const sc = SCENES[sceneId];
  if (!sc) { console.warn('Missing scene:', sceneId); return; }

  // Minigame shortcut
  if (sc.mg) { G.openMG(sc.mg); return; }

  // Death shortcut
  if (sc.death) { G.doDeath(sc.death.title, sc.death.body, sc.death.cause); return; }

  // Final shortcut
  if (sc.final) { G.doFinal(sc.final); return; }

  G.showScr('sGame');
  ART.draw(sc.art || 'corridor');
  $('sceneLbl').textContent = sc.label || '';
  G.hideItemCard();

  // Back button
  $('backBtn').style.display = sc.backTo ? 'block' : 'none';
  $('backBtn').textContent = '← ' + (sc.backLabel || 'Voltar');
  if (sc.backTo) G.S.backTarget = sc.backTo;

  if (sc.effect) sc.effect();
  G.renderLine();
};

G.goBack = () => {
  if (G.S.backTarget) G.goScene(G.S.backTarget);
};

G.renderLine = () => {
  const sc = SCENES[G.S.scene];
  if (!sc) return;
  const lines = sc.lines || [];
  const idx = G.S.lineIdx;

  if (idx >= lines.length) { G.showChoicesOrNext(); return; }

  const line = lines[idx];
  const charId = typeof line.char === 'function' ? line.char() : (line.char || 'narrator');
  const name = typeof line.name === 'function' ? line.name() : (line.name || '???');
  const text = typeof line.text === 'function' ? line.text() : (line.text || '');

  G.setChar(charId, name);
  const dt = $('dialTxt');
  dt.className = charId === 'ruel' ? 'glitch' : '';
  $('choicesDiv').style.display = 'none';
  $('advHint').style.display = 'block';
  $('advHint').classList.remove('blink');
  $('advHint').textContent = '▼ clique em qualquer lugar';

  G.typeText(dt, text, () => {
    G.S.typing = false;
    $('advHint').classList.add('blink');
  });
  G.S.typing = true;
  $('dialArea')?.scrollTo(0, 999);
};

G.showChoicesOrNext = () => {
  const sc = SCENES[G.S.scene];
  if (!sc) return;
  $('advHint').classList.remove('blink');
  $('advHint').style.display = 'none';

  if (sc.choices && sc.choices.length) {
    const div = $('choicesDiv');
    div.innerHTML = '';
    div.style.display = 'flex';
    sc.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'ch';
      btn.textContent = ch.text;
      btn.onclick = () => {
        div.style.display = 'none';
        if (ch.fn) ch.fn();
      };
      div.appendChild(btn);
    });
  } else if (sc.next) {
    $('advHint').style.display = 'block';
    $('advHint').textContent = '▼ clique para continuar';
    $('advHint').classList.add('blink');
    // one-time click on whole game area
    const cont = (e) => {
      // If a minigame just closed, ignore this click and remove the one-time listener
      if (G._ignoreNextClick) { $('sGame').removeEventListener('click', cont, true); G._ignoreNextClick = false; return; }
      if (e.target.closest('button') || e.target.closest('#hudBar')) return;
      $('sGame').removeEventListener('click', cont, true);
      $('advHint').classList.remove('blink');
      const nxt = typeof sc.next === 'function' ? sc.next() : sc.next;
      if (nxt) G.goScene(nxt);
    };
    $('sGame').addEventListener('click', cont, true);
  }
};

