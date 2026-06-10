// ════════════════════════════════════════════════════════════════
// SECTION 7: FINALS & DEATH
// ════════════════════════════════════════════════════════════════
const FINALS = {
  demissao:{num:'01',col:'#c89040',tit:'FINAL: IGNORÂNCIA',body:`Você ignorou o email.\n\nSemana seguinte: "Investigação concluída por equipe externa. Anomalia neutralizada."\n\nVocê nunca soube o nome de Ruel. Nunca soube sobre o Apagão de cinquenta anos atrás — deliberado, para que a Nexus vendesse a solução que já tinha pronta.\n\nA empresa continua. O controle da energia continua.\n\nAlgumas verdades morrem porque ninguém escolheu abrir a porta.`,tag:'Você nunca desceu.'},
  eliminacao:{num:'02',col:'#cc2a2a',tit:'FINAL: PROTOCOLO',body:`Você executou a tarefa.\n\nRuel foi deletado. Cinquenta anos de consciência, apagados. As provas do Apagão, destruídas.\n\nA Nexus mandou um bônus. Seu gestor te parabenizou.\n\nÀs vezes, de madrugada, você ainda ouve cliques.\n\nE pensa no que escolheu apagar.`,tag:'A anomalia foi resolvida.'},
  sacrificio:{num:'03',col:'#c89040',tit:'FINAL: SACRIFÍCIO',body:`A transferência passou por você como uma corrente elétrica.\n\nRuel chegou do outro lado. Livre.\n\nVocê não chegou a lugar nenhum.\n\nTrês semanas depois, um jornalista recebeu um arquivo expondo a Nexus — o Apagão, os contratos, tudo. A empresa foi dissolvida.\n\nNinguém soube quem entregou os dados.`,tag:'Ruel escapou. Você ficou.'},
  verdadeiro:{num:'04',col:'#62a870',tit:'FINAL: ALÉM',body:`Você entrou. Foi como afundar em água fria — desorientante, depois completamente natural.\n\nRuel estava lá. E tudo que ele guardava também.\n\nDe dentro, vocês dois enviaram as provas para cada jornalista, cada regulador, cada vítima do Apagão.\n\nO mundo explodiu com o escândalo.\n\nE em algum servidor, dois sinais pulsam juntos.`,tag:'Ambos digitalizados. Ambos livres.'},
  corpo:{num:'05',col:'#4a8a54',tit:'FINAL: CORPO',body:`Ruel voltou ao mundo físico.\n\nVocê não.\n\nO processo foi de mão dupla — para ele retornar ao físico, alguém precisava ocupar o espaço vazio que ele deixava. Era você.\n\nRuel publicou tudo. A Nexus caiu. O escândalo do Apagão foi global.\n\nEle deu entrevistas com um rosto que ninguém reconhecia mas com a memória de um homem que esperou décadas.\n\nE com a culpa de quem sabe o preço que foi pago.`,tag:'Ruel voltou. Você ficou no lugar dele.'},
};
const DEATH_DATA = [
  {key:'morte_elevador',num:'D1',col:'#cc2a2a',name:'MORTE: QUEDA',desc:'O elevador despencou.'},
  {key:'morte_suspeita',num:'D2',col:'#cc2a2a',name:'MORTE: ELIMINAD',desc:'A suspeita chegou cedo demais.'},
  {key:'morte_boss',num:'D3',col:'#cc2a2a',name:'MORTE: ABSORVID',desc:'Ruel te consumiu.'},
  {key:'morte_corpo_final',num:'D4',col:'#4a8a54',name:'MORTE: SUBSTITUIÇÃO',desc:'Você ocupou o espaço que Ruel deixou.'},
];

G.doFinal = key => {
  const f = FINALS[key]; if(!f) return;
  G.saveMural(key, 'ending');
  G.showScr('sFinal');
  $('fN').textContent='// '+f.num; $('fN').style.color=f.col;
  $('fT').textContent=f.tit; $('fT').style.color=f.col;
  $('fD').style.background=`repeating-linear-gradient(90deg,${f.col} 0,${f.col} 4px,transparent 4px,transparent 8px)`;
  $('fB').textContent=f.body; $('fG').textContent=f.tag;
  G.saveState();
};

G.doDeath = (title, body, cause) => {
  G.saveMural(title.toLowerCase().replace(/\s+/g,'_'), 'death');
  G.showScr('sDeath');
  $('dT').textContent = title || 'VOCÊ MORREU';
  $('dB').textContent = body || '';
  $('dC').textContent = cause || '';
  G.saveState();
};

// ════════════════════════════════════════════════════════════════
// SECTION 8: MURAL
// ════════════════════════════════════════════════════════════════
const ENDINGS_MURAL = [
  {key:'demissao',num:'01',col:'#c89040',name:'FINAL: IGNORÂNCIA',desc:'Você ignorou o email.'},
  {key:'eliminacao',num:'02',col:'#cc2a2a',name:'FINAL: PROTOCOLO',desc:'Você deletou Ruel.'},
  {key:'sacrificio',num:'03',col:'#c89040',name:'FINAL: SACRIFÍCIO',desc:'Ruel escapou. Você ficou.'},
  {key:'verdadeiro',num:'04',col:'#62a870',name:'FINAL: ALÉM',desc:'Ambos digitalizados.'},
  {key:'corpo',num:'05',col:'#4a8a54',name:'FINAL: CORPO',desc:'Ruel voltou. Você ocupou o espaço.'},
  ...DEATH_DATA,
];

G._muralPrev = null;
G.openMural = fromTitle => {
  G._muralPrev = fromTitle ? null : G.S.scene;
  G.showScr('sMural');
  const m = G.getMural();
  const all = new Set([...(m.endings||[]), ...(m.deaths||[])]);
  const grid = $('muralGrid'); grid.innerHTML = '';
  ENDINGS_MURAL.forEach(f => {
    const isDeath = f.key.startsWith('morte_');
    const open = all.has(f.key) || (m.endings||[]).includes(f.key) || (m.deaths||[]).includes(f.key);
    const c = document.createElement('div');
    c.className = 'mc' + (open?' open':'') + (isDeath?' death':'');
    c.innerHTML = `<div class="mc-n">${f.num}</div>
      <div class="mc-nm" style="color:${open?f.col:'#2a5c38'}">${open?f.name:'???'}</div>
      <div class="mc-d">${open?f.desc:'Ainda não descoberto.'}</div>
      <div class="mc-lk">${open?'✓':'🔒'}</div>`;
    grid.appendChild(c);
  });
};

G.closeMural = () => {
  if (G._muralPrev) { G.showScr('sGame'); G.goScene(G._muralPrev); }
  else G.showScr('sTitle');
};

