// ════════════════════════════════════════════════════════════════
// SECTION 10: MINIGAMES
// ════════════════════════════════════════════════════════════════
G.openMG = id => {
  // Prevent reopening certain minigames if already completed
  if (id === 'wire' && G.hasFlag && G.hasFlag('wireDone')) {
    G.notify('Painel de reparo já foi concluído.', 'lore');
    return;
  }
  G._curMG = id;
  const MG = MINIGAMES[id];
  if (!MG) return;
  $('mgHT').textContent = MG.title;
  $('mgEsc').style.display = MG.closable === false ? 'none' : 'block';
  $('mgBD').innerHTML = '';
  $('mgOv').classList.add('on');
  MG.build($('mgBD'));
  // Prevent clicks on minigame buttons from bubbling to the global scene click handler
  setTimeout(()=>{
    const mgbd = $('mgBD');
    if(!mgbd) return;
    mgbd.querySelectorAll('button, .pb, .ts, .ek').forEach(b => {
      b.addEventListener('click', ev => { ev.stopPropagation(); }, {capture:false});
    });
  }, 0);
};

G.closeMG = () => {
  // prevent the immediate next global click from advancing scenes
  G._ignoreNextClick = true;
  $('mgOv').classList.remove('on');
  if (MINIGAMES[G._curMG]?.onClose) MINIGAMES[G._curMG].onClose();
};

const MINIGAMES = {};

// ── WIRE ──
MINIGAMES.wire = {
  title:'PAINEL DE REPARO',
  closable: true,
  WIRES:[
    {id:'A',lbl:'FIO AMARELO',col:'#c89050',spd:.55,name:'Medo'},
    {id:'B',lbl:'FIO VERMELHO',col:'#cc2a2a',spd:3.0,name:'Corrida'},
    {id:'C',lbl:'FIO AZUL',col:'#2a60cc',spd:.28,name:'Queda'},
    {id:'D',lbl:'FIO VERDE',col:'#2acc60',spd:1.3,name:'Fuga'},
    {id:'E',lbl:'FIO BRANCO',col:'#8a9a8a',spd:.85,name:'Silêncio'},
  ],
  CORRECT:['A','B','C','D'],
  state:{},
  build(el){
    const s=this.state={connected:[],selected:null,done:false,errors:0,lastDid:false,video:false};
    el.innerHTML=`
      <div style="background:#0d1a12;border-bottom:1px solid #1a3a22;padding:.5rem;text-align:center;font-size:.64rem;letter-spacing:.08em;color:#62a870">[PAINEL DE REPARO] — CONECTE OS FIOS NA ORDEM CORRETA</div>
      <div id="wireRow" class="wa" style="display:flex;flex-direction:column;gap:.35rem;max-width:480px;margin:.6rem auto"></div>
      <div style="font-size:.62rem;color:#3a6a44;text-align:center;letter-spacing:.1em;padding:.3rem;background:#06100a">CLIQUE NO FIO E DEPOIS NO TERMINAL desejado</div>
      <div class="trow" id="tRow" style="display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;padding:.5rem;background:#05080a;border-top:1px solid #111e14"></div>
      <div class="lw-w" id="lwW" style="background:#0a1510;border-top:2px solid #cc2a2a;color:#cc2a2a;font-size:.64rem;padding:.6rem;text-align:center;display:none">⚠ ÚLTIMO FIO DETECTADO — Consequências desconhecidas</div>
      <div id="lwBtns" style="display:none;gap:.45rem;justify-content:center;flex-wrap:wrap;padding:.5rem;background:#060a08"></div>
      <div class="mg-st" id="wSt" style="text-align:center;padding:.5rem;color:#3a6a44;font-size:.62rem">Sequência esperada: MEDO → CORRIDA → QUEDA → FUGA</div>
            <canvas id="wirePanel" width="500" height="200" style="border:2px solid #2a5c38;background:#050809;display:block;margin:.2rem auto;border-radius:3px"></canvas>

      <div class="mg-res" id="wRes">
        <div class="mg-rl" id="wRL"></div>
        <div class="mg-rm" id="wRM"></div>
        <button class="pb sm" onclick="MINIGAMES.wire.finish()">[ CONTINUAR ]</button>
      </div>`;
    const wireRow = $('wireRow');
    const tr=$('tRow');
    // create clickable wire elements (left side) so user can select wires by clicking
    this.WIRES.forEach(w => {
      const wr = document.createElement('div'); wr.className = 'wr'; wr.id = 'wt-' + w.id;
      wr.style.cssText = 'display:flex;align-items:center;gap:.45rem;margin-bottom:.28rem;cursor:pointer';
      const wl = document.createElement('div'); wl.className = 'wl'; wl.style.width = '120px'; wl.textContent = w.lbl; wl.style.color = w.col;
      const wt = document.createElement('div'); wt.className = 'wt'; wt.style.width = '140px'; wt.style.position='relative'; wt.style.border = '1px solid rgba(26,58,34,0.4)'; wt.style.borderRadius='4px'; wt.style.padding='4px'; wt.style.background='rgba(10,16,12,0.3)'; wt.style.color = w.col;
      const wd = document.createElement('div'); wd.className = 'wd'; wd.style.width='7px'; wd.style.height='15px'; wd.style.position='absolute'; wd.style.top='1.5px'; wd.style.animation='wd 1s steps(16) infinite';
      wt.appendChild(wd);
      const wn = document.createElement('div'); wn.className = 'wn'; wn.textContent = w.id; wn.style.width='30px'; wn.style.textAlign='right'; wn.style.color = w.col;
      wt.addEventListener('click', (ev) => { ev.stopPropagation(); this.sel(w.id); });
      wr.appendChild(wl); wr.appendChild(wt); wr.appendChild(wn);
      wireRow.appendChild(wr);
    });
    for(let i=0;i<4;i++){
      const sl=document.createElement('div'); sl.className='ts'; sl.id='ts'+i;
      sl.style.cssText='border:3px solid #1a3a22;border-radius:3px;min-width:70px;line-height:2;font-size:.8rem;font-weight:bold;transition:.15s;cursor:pointer';
      sl.textContent=(i+1)+''; sl.onclick=()=>this.connectSlot(i); tr.appendChild(sl);
    }
    this.drawPanel();
  },
  drawPanel(){
    const cv = $('wirePanel');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    
    // Clear
    ctx.fillStyle = '#050809';
    ctx.fillRect(0,0,W,H);
    
    // Position constants
    const wireX = 50;      // x coordinate for wire endpoints
    const terminalX = W - 50;  // x coordinate for terminal dots
    const startY = 50;     // starting Y
    const spacing = 30;    // spacing between each
    
    // Headers
    ctx.fillStyle = '#3a6a44';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('FIOS', 10, 22);
    ctx.fillText('TERMINAIS', W-100, 22);
    
    // Draw wire stubs on LEFT
    this.WIRES.forEach((w, i) => {
      const y = startY + i * spacing;
      // Wire color stub
      ctx.strokeStyle = w.col;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(wireX - 20, y);
      ctx.lineTo(wireX, y);
      ctx.stroke();
      // Wire label
      ctx.fillStyle = w.col;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(w.name.slice(0,3).toUpperCase(), wireX - 25, y + 4);
      ctx.textAlign = 'left';
    });
    
    // Draw terminal dots on RIGHT
    for(let i = 0; i < 4; i++){
      const y = startY + i * spacing;
      ctx.fillStyle = '#2a5c38';
      ctx.beginPath();
      ctx.arc(terminalX, y, 8, 0, Math.PI*2);
      ctx.fill();
      // Terminal number
      ctx.fillStyle = '#62a870';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText((i+1), terminalX, y + 5);
      ctx.textAlign = 'left';
    }
    
    // Draw connection LINES for connected wires
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4,4]);
    this.state.connected.forEach((wid, idx) => {
      const w = this.WIRES.find(x => x.id === wid);
      const wireIdx = this.WIRES.indexOf(w);
      const y1 = startY + wireIdx * spacing;
      const y2 = startY + idx * spacing;
      
      ctx.strokeStyle = w.col;
      ctx.beginPath();
      ctx.moveTo(wireX, y1);
      // Quadratic curve to terminal
      ctx.quadraticCurveTo(W/2, (y1+y2)/2, terminalX, y2);
      ctx.stroke();
      
      // Draw ending circle on terminal
      ctx.fillStyle = w.col;
      ctx.beginPath();
      ctx.arc(terminalX, y2, 5, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.setLineDash([]);
  },
  sel(id){
    const s=this.state; if(s.done||s.connected.includes(id)) return;
    if(id==='E'){$('lwW').style.display='block';$('lwBtns').style.display='flex';
      $('lwBtns').innerHTML=`<button class="pb sm r" onclick="MINIGAMES.wire.doLast(true)">Conectar mesmo assim</button><button class="pb sm" onclick="MINIGAMES.wire.doLast(false)">Não conectar</button>`;
      $('wSt').innerHTML='<span style="color:#c89040">⚠ Você selecionou o FIOLIMO — Esse não deveria ser conectado...</span>'; return;}
    s.selected=id;
    // update DOM selection visuals
    this.WIRES.forEach(w=>{const container=$('wt-'+w.id); if(container){const wtEl=container.querySelector('.wt'); if(w.id===id){wtEl.classList.add('sel'); wtEl.style.outline=`2px solid ${w.col}`;} else {wtEl.classList.remove('sel'); wtEl.style.outline='';}}});
    const w = this.WIRES.find(x => x.id === id);
    $('wSt').innerHTML=`<span style="color:${w.col}">Selecionado: ${w.lbl} (${w.name})</span> — clique num terminal para conectar.`;
    this.drawPanel();
  },
  connectSlot(idx){
    const s=this.state; if(!s.selected||s.done) return;
    if(s.connected.length!==idx){$('wSt').innerHTML=`<span style="color:#cc2a2a">Conecte na ordem. Terminal ${s.connected.length+1}.</span>`;return;}
    const wid=s.selected, ok=wid===this.CORRECT[idx];
    const sl=$('ts'+idx), w=this.WIRES.find(w=>w.id===wid);
    sl.className='ts '+(ok?'ok':'bad'); sl.textContent=w.name.slice(0,3).toUpperCase();
    if(!ok){s.errors++;G.setSync(G.S.sync-12);G.flashBad();G.glitch(700);
      this.WIRES.forEach(w=>{const el=$('wt-'+w.id);if(el){const d=el.querySelector('.wd');if(d)d.style.animationDuration=Math.max(.1,(1/w.spd)/(1+s.errors*.5))+'s';}});
      $('wSt').innerHTML=`<span style="color:#cc2a2a">✕ Ordem incorreta — padrões distorcidos.</span>`;
    } else {G.flashGood();$('wSt').innerHTML=`<span style="color:#62a870">✓ ${w.lbl} conectado.</span>`;}
    s.connected.push(wid); s.selected=null;
    this.WIRES.forEach(w=>{const el=$('wt-'+w.id);if(el)el.classList.remove('sel');});
    this.drawPanel();
    if(s.connected.length===4){$('lwW').style.display='block';$('lwBtns').style.display='flex';
      $('lwBtns').innerHTML=`<button class="pb sm r" onclick="MINIGAMES.wire.doLast(true)">Conectar último fio (RISCO)</button><button class="pb sm" onclick="MINIGAMES.wire.doLast(false)">Não conectar</button>`;}
  },
  doLast(connect){
    $('lwW').style.display='none';
    $('lwBtns').style.display='none';
    this.state.done=true;
    this.state.lastDid=connect;
    const rl=$('wRL'),rm=$('wRM'),res=$('wRes');
    if(connect){
      rl.className='mg-rl lose';
      rl.textContent='SOBRECARGA DETECTADA';
      rm.innerHTML='Você conectou o último fio.<br>A consciência invadiu o terminal.<br>Algo assume o controle...';
      G.glitch(2000);
      G.flashBad();
      G.S.flags.connectedLast=true;
      this.state.video = true;
      // Mostrar video do acontecido
      this.showVideoEffect(() => res.classList.add('on'));
    } else {
      rl.className='mg-rl win';
      rl.textContent='SINCRONIZAÇÃO ESTÁVEL';
      rm.innerHTML='Você respeitou o aviso.<br>A porta abre devagar.<br>O corredor à frente aguarda...';
      G.flashGood();
      this.drawPanel();
      res.classList.add('on');
    }
  },
  showVideoEffect(callback){
    const effect = document.createElement('div');
    effect.id = 'wireVideoEffect';
    effect.style.cssText = 'position:fixed;inset:0;z-index:6000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.95)';
    const video = document.createElement('video');
    video.src = 'passando.mp4';
    video.style.cssText = 'max-width:90vw;max-height:90vh;border:2px solid #62a870;box-shadow:0 0 20px rgba(98,168,112,.5)';
    video.autoplay = true;
    video.onended = () => {
      effect.remove();
      if (callback) callback();
    };
    effect.appendChild(video);
    document.body.appendChild(effect);
  },
  finish(){
    // Remove video effect if still present
    const videoEffect = $('wireVideoEffect');
    if (videoEffect) videoEffect.remove();
    // Close minigame and advance scene
    // mark as completed to avoid reopening
    if (G.setFlag) G.setFlag('wireDone');
    G._ignoreNextClick = true;
    $('mgOv').classList.remove('on');
    G.goScene(this.state.lastDid?'after_wire_bad':'after_wire_good');
  },
};

// ── ELEVATOR CODE ──
MINIGAMES.elev_code = {
  title:'TERMINAL DO ELEVADOR',
  closable: false,
  CODE:'170492',
  state:{},
  build(el){
    const hasPasta=G.hasItem('pasta_vermelha');
    const s=this.state={input:'',attempts:0,MAX:5};
    el.innerHTML=`
      <div class="mg-inst">${hasPasta?'<span style="color:#62a870">Pasta Vermelha: código 170492</span>':'Você precisa do código. Explore os corredores.'}<br><span style="color:#cc2a2a">5 tentativas. Falhar = o elevador despenca.</span></div>
      ${hasPasta?'<div style="background:#06100a;border:1px solid #2a5c38;padding:.4rem .7rem;font-size:.58rem;color:#62a870;letter-spacing:.06em">[PASTA VERMELHA]:<br>CÓDIGO: 170492<br>PADRÃO: R-17-U-04-E-92-L<br><br><span style="color:#c89040">Destino: B-21</span></div>':''}
      <div class="edsp" id="edD">_ _ _ _ _ _</div>
      <div class="epad" id="edP"></div>
      <div class="mg-st" id="edS">Tentativas: <b>${s.MAX}</b></div>
      <div class="mg-res" id="edR">
        <div class="mg-rl" id="edRL"></div>
        <div class="mg-rm" id="edRM"></div>
        <button class="pb sm" id="edCont" onclick="MINIGAMES.elev_code.finish()">[ CONTINUAR ]</button>
      </div>
      <div style="text-align:center;margin-top:.5rem"><button class="pb sm" onclick="G.closeMG();G.goScene('corridor_hub')">← Voltar (desistir)</button></div>`;
    const pad=$('edP');
    [1,2,3,4,5,6,7,8,9,'C',0,'OK'].forEach(k=>{
      const b=document.createElement('button');b.className='ek';b.textContent=k;
      b.onclick=()=>this.press(k);pad.appendChild(b);
    });
  },
  press(k){
    const s=this.state;
    if(k==='C'){s.input='';this.upd();return;}
    if(k==='OK' || k==='✓'){this.submit();return;}
    if(s.input.length>=6) return;
    s.input+=k;this.upd();
  },
  upd(){$('edD').textContent=this.state.input.padEnd(6,'_').split('').join(' ');},
  submit(){
    const s=this.state;
    if(s.input.length<6){$('edS').innerHTML='<span style="color:#cc2a2a">Código incompleto.</span>';return;}
    s.attempts++;const rem=s.MAX-s.attempts;
    if(s.input===this.CODE){
      G.setFlag('elevUnlocked');G.saveState?.();G.flashGood();
      $('edD').style.borderColor='#3a8a48';$('edD').style.color='#62a870';
      $('edR').classList.add('on');$('edRL').className='mg-rl win';$('edRL').textContent='ACESSO CONCEDIDO';
      $('edRM').innerHTML='<div>O elevador destrava. Escolha o andar:</div>';
      const btns = document.createElement('div');
      btns.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem;margin-top:1rem';
      ['B-1','B-3','B-8','B-12','B-21','EMERGÊNCIA'].forEach(fl=>{
        const btn = document.createElement('button');
        btn.className = 'pb sm';
        btn.textContent = fl;
        if(fl==='EMERGÊNCIA') btn.style.cssText = 'grid-column:1/-1;background:#8a2020';
        btn.onclick = () => this.selectFloor(fl);
        btns.appendChild(btn);
      });
      $('edRM').appendChild(btns);
    } else {
      G.glitch(700);G.flashBad();G.setSync(G.S.sync-10);
      if(rem<=0){
        $('edR').classList.add('on');$('edRL').className='mg-rl lose';$('edRL').textContent='FALHA CRÍTICA';
        $('edRM').textContent='O elevador falha. O chão some.';
        $('edCont').onclick=()=>{
          G.doDeath('QUEDA','O sistema bloqueou após cinco tentativas.\n\nO elevador não tinha failsafes — décadas de desgaste.\n\nA queda durou seis segundos.\n\nRelatório da empresa: "falha técnica durante manutenção não autorizada".','CAUSA: Código incorreto — 5 falhas consecutivas.','morte_elevador');
        };
      } else {
        s.input='';this.upd();
        $('edS').innerHTML=`<span style="color:#cc2a2a">Incorreto.</span> Tentativas restantes: <b>${rem}</b>`;
      }
    }
  },
  selectFloor(floor){
    if(floor==='B-21'){
      G.flashGood();
      $('edRM').innerHTML = '<div style="color:#62a870">Descendo para B-21...</div>';
      setTimeout(()=>this.finish(),1000);
    } else if(floor==='EMERGÊNCIA'){
      G.closeMG();
      G.goScene('corridor_hub');
    } else {
      G.notify('Não é pra onde eu devo ir.','item');
      G.flashBad();
    }
  },
  finish(){G._ignoreNextClick=true;$('mgOv').classList.remove('on');G.goScene('elevator_descent');},
};
MINIGAMES.elev_code_try = MINIGAMES.elev_code;

// ── PC LOGIN ──
MINIGAMES.pc_login = {
  title:'SISTEMA LEGADO — PC-3',
  closable: true,
  USER:'RUEL', PASS:'R-17-U-04-E-92-L',
  state:{},
  build(el){
    const s=this.state={att:0,MAX:7};
    const hP=G.hasItem('pasta_vermelha'), hF=G.hasFlag('sawFlash');
    el.innerHTML=`
      <div class="mg-inst">Credenciais corretas para acessar o PC-3.<br><span style="color:#cc2a2a">7 tentativas — depois bloqueia.</span></div>
      ${hP?'<div style="background:#06100a;border:1px solid #2a5c38;padding:.4rem .7rem;font-size:.58rem;color:#62a870">[PASTA VERMELHA]:<br>Usuário: RUEL<br>Senha: R-17-U-04-E-92-L</div>':hF?'<div style="font-size:.52rem;color:#c89040;border:1px solid #5a4010;padding:.35rem .6rem">[DICA] Flash do monitor: R-17-U-04-E-92-L (possível senha)</div>':'<div style="font-size:.52rem;color:#3a6a44;padding:.35rem .6rem">Procure pistas nos PCs e documentos da sala.</div>'}
      <button class="pb sm" style="margin-bottom:.3rem" onclick="MINIGAMES.pc_login.showHints()">[EXAMINAR] Outros PCs</button>
      <div class="pcterm" id="pcT"></div>
      <div class="pc-ir">
        <span class="pc-pr">LOGIN&gt;</span>
        <input class="pc-in" id="pcU" placeholder="usuário..." spellcheck="false" autocomplete="off">
      </div>
      <div class="pc-ir">
        <span class="pc-pr">SENHA&gt;</span>
        <input class="pc-in" id="pcPa" type="password" placeholder="senha..." spellcheck="false" autocomplete="off">
      </div>
      <button class="pb sm g" style="margin-top:.3rem" onclick="MINIGAMES.pc_login.submit()">[ ENTRAR ]</button>
      <div class="mg-st" id="pcS">Tentativas: <b>${s.MAX}</b></div>
      <div class="mg-res" id="pcR">
        <div class="mg-rl" id="pcRL"></div>
        <div class="mg-rm" id="pcRM"></div>
        <button class="pb sm" onclick="MINIGAMES.pc_login.finish()">[ CONTINUAR ]</button>
      </div>`;
    this.term=$('pcT');
    this.log('NEXUS LEGACY SYSTEM v2.1');
    this.log('Último acesso: [DATA CORROMPIDA]');
    this.log('Falhas registradas: 12');
    $('pcPa').addEventListener('keydown',e=>{if(e.key==='Enter')this.submit();});
  },
  log(t,col='#00cc00'){const p=document.createElement('p');p.style.color=col;p.textContent=t;this.term.appendChild(p);this.term.scrollTop=9999;},
  showHints(){
    this.log('--- Examinando outros PCs ---','#336633');
    this.log('PC-1: desligado, tela rachada.','#336633');
    this.log('PC-2: queimado internamente.','#336633');
    this.log('PC-4: disco rígido REMOVIDO.','#336633');
    this.log('PC-5: loop infinito.','#336633');
    this.log('PC-6: post-it → "não esquecer PASTA VERMELHA"','#8a6600');
    this.log('Log de acesso: último login = RUEL, falhas = 12','#8a6600');
    if(G.hasItem('pasta_vermelha')){this.log('PASTA VERMELHA encontrada: usuário RUEL, senha R-17-U-04-E-92-L','#3a8a48');}
    else{this.log('[DICA] Procure a pasta vermelha na gaveta do fundo.','#5a4010');}
  },
  submit(){
    const u=$('pcU').value.trim().toUpperCase(), p=$('pcPa').value.trim();
    const s=this.state; s.att++; const rem=s.MAX-s.att;
    this.log(`> ${u} / ${'*'.repeat(p.length)}`,'#4a9a4a');
    if(u===this.USER&&p===this.PASS){
      this.log('LOGIN AUTORIZADO','#00cc00');
      this.log('USUÁRIO: RUEL → RUEL_?','#aa00aa');
      G.flashGood();G.setFlag('pcLoggedIn');
      $('pcR').classList.add('on');$('pcRL').className='mg-rl win';$('pcRL').textContent='ACESSO CONCEDIDO';
      $('pcRM').textContent='Arquivos de Ruel desbloqueados. O padrão de senha é o mesmo do elevador.';
    } else {
      G.glitch(500);G.flashBad();
      this.log('ACESSO NEGADO','#cc0000');
      if(u!==this.USER)this.log('Usuário não encontrado.','#8a3030');
      else this.log('Senha incorreta.','#8a3030');
      if(rem<=0)$('pcS').innerHTML='<span style="color:#cc2a2a">BLOQUEADO PERMANENTEMENTE.</span>';
      else $('pcS').innerHTML=`Tentativas restantes: <b>${rem}</b>`;
    }
  },
  finish(){G._ignoreNextClick=true;$('mgOv').classList.remove('on');G.goScene('after_pc_login');},
};

// ── FIND PLUG ──
MINIGAMES.find_plug = {
  title:'ENCONTRE A TOMADA',
  closable: true,
  ANSWER: 14,
  build(el){
    let found=false;
    const ICONS=['[AGUA]','[PORCA]','[CAIXA]','[LUVA]','[LANTERNA]','[CLIPE]','[LIXO]','[CHAVE]','[CAIXA]','[KIT]','[TOMADA]','[TIJOLO]','[FITA]','[BATERIA]','[TOMADA]','[PARAF]','[CAIXA]','[LUVA]','[PORCA]','[AGUA]','[MARTELO]','[LANTERNA]','[CLIPE]','[TIJOLO]'];
    el.innerHTML=`<div class="mg-inst">Escuro total — use o celular para iluminar.<br>Clique nas células para investigar. Encontre a tomada.</div>
      <div class="pgrid" id="pgrid"></div>
      <div class="mg-st" id="pgSt">Procurando...</div>
      <div class="mg-res" id="pgRes">
        <div class="mg-rl win">TOMADA ENCONTRADA!</div>
        <div class="mg-rm">Você conecta o cabo. As telas ligam.</div>
        <button class="pb sm" onclick="MINIGAMES.find_plug.finish()">[ CONTINUAR ]</button>
      </div>`;
    const grid=$('pgrid'), ans=this.ANSWER;
    for(let i=0;i<24;i++){
      const c=document.createElement('div'); c.className='pc'; c.textContent='?';
      c.onclick=()=>{
        if(found) return;
        c.textContent=ICONS[i]||'?';
        if(i===ans){found=true;c.className='pc found';$('pgRes').classList.add('on');G.flashGood();$('pgSt').textContent='';}
        else{c.className='pc no';setTimeout(()=>{c.className='pc';c.textContent='?';},1100);}
      };
      grid.appendChild(c);
    }
  },
  finish(){G._ignoreNextClick=true;$('mgOv').classList.remove('on');G.goScene('center_powered');},
};

// ── SAVE SELECT ──
MINIGAMES.save_select = {
  title:'SELECIONAR DADOS — SALVAR E SAIR',
  closable: false,
  state:{},
  build(el){
    const s=this.state={sel:[],phase:'select'};
    const OPTS=[
      {id:'logs',ic:'📋',nm:'Logs do Sistema',dc:'Erros técnicos — parece normal.',av:true},
      {id:'corrupted',ic:'⚠️',nm:'Arquivos Corrompidos',dc:'Fragmentos — mostra imagens de Ruel.',av:true},
      {id:'backup',ic:'💾',nm:'Backup Antigo',dc:'Versão antes da anomalia.',av:true},
      {id:'hidden',ic:'🔒',nm:'Diretório Oculto',dc:'Contato direto com Ruel.',av:G.hasFlag('pcLoggedIn')},
    ];
    el.innerHTML=`<div class="mg-inst">Selecione o que salvar. Escolhas afetam o que você descobre.</div>
      <div class="svopts" id="svOpts"></div>
      <div class="mg-st" id="svSt">Selecione arquivos e confirme.</div>
      <button class="pb sm y" id="svBtn" style="display:none" onclick="MINIGAMES.save_select.startSave()">[ INICIAR SALVAMENTO ]</button>
      <div id="svPrArea" style="display:none;flex-direction:column;align-items:center;gap:.3rem">
        <div class="pbar"><div class="pbtr"><div class="pbf" id="svPr" style="width:0%"></div></div><div class="pblb" id="svPrLb">0%</div></div>
      </div>
      <div class="mg-res" id="svRes">
        <div class="mg-rl" id="svRL"></div>
        <div class="mg-rm" id="svRM"></div>
        <button class="pb sm" onclick="MINIGAMES.save_select.finish()">[ CONTINUAR ]</button>
      </div>`;
    const opts=$('svOpts');
    OPTS.forEach(o=>{
      const d=document.createElement('div');
      d.className='svopt'+(o.av?'':' locked');
      d.innerHTML=`<div class="svopt-ic">${o.ic}</div><div><div class="svopt-nm">${o.nm}</div><div class="svopt-dc">${o.av?o.dc:'[BLOQUEADO]'}</div></div>`;
      if(o.av) d.onclick=()=>{
        const i=s.sel.indexOf(o.id);
        if(i>=0){s.sel.splice(i,1);d.classList.remove('sel');}else{s.sel.push(o.id);d.classList.add('sel');}
        $('svBtn').style.display=s.sel.length?'block':'none';
      };
      opts.appendChild(d);
    });
  },
  startSave(){
    $('svPrArea').style.display='flex';$('svBtn').style.display='none';
    $('svOpts').style.opacity='.4';$('svOpts').style.pointerEvents='none';
    let p=0;
    const stalls=[28,55,72];
    const run=()=>{
      const int=setInterval(()=>{
        p+=Math.random()*3+1;
        const stall=stalls.find(s=>Math.abs(p-s)<4);
        if(stall&&p<99){
          clearInterval(int);p=stall;
          $('svPr').style.width=p+'%';$('svPrLb').textContent=Math.round(p)+'%';
          setTimeout(run,1500+Math.random()*1000);return;
        }
        $('svPr').style.width=Math.min(100,p)+'%';$('svPrLb').textContent=Math.round(Math.min(100,p))+'%';
        if(p>=100){clearInterval(int);this.endSave();}
      },80);
    };run();
  },
  endSave(){
    const s=this.state.sel;
    const hasHidden=s.includes('hidden');
    if(hasHidden){$('svRL').className='mg-rl win';$('svRL').textContent='SALVAMENTO COMPLETO';
      $('svRM').textContent='Diretório oculto salvo. Contato com Ruel estabelecido.';G.setFlag('savedHidden');G.flashGood();
      G.addLore('hidden_dir','Diretório Oculto','Encontrado durante salvamento.\n\nMensagem enterrada em múltiplas camadas:\n"Se você lê isso, a janela está aberta. Vá ao nível B-21."');
    } else if(s.length>=2){$('svRL').className='mg-rl win';$('svRL').textContent='SALVAMENTO PARCIAL';
      $('svRM').textContent=s.length+' arquivo(s) salvos. Informações incompletas mas úteis.';G.flashGood();
    } else{$('svRL').className='mg-rl lose';$('svRL').textContent='SALVAMENTO FALHO';
      $('svRM').textContent='Apenas um arquivo. Sistema muito instável.';G.flashBad();G.setSync(G.S.sync-10);}
    if(s.includes('corrupted'))G.addLore('corr_files','Arquivos Corrompidos','Imagens fragmentadas — um rosto, a maioria ilegível.\nPlanta de um andar que não existe nos mapas.');
    if(s.includes('logs'))G.addLore('sys_logs','Logs do Sistema','"processo_não_identificado: 847TB"\n"atividade neural anômala: detectada"\n\nO sistema sabia. Nunca reportou.');
    $('svRes').classList.add('on');
  },
  finish(){G._ignoreNextClick=true;$('mgOv').classList.remove('on');G.goScene('corridor_hub');},
};

// ── BOSS FIGHT ──
MINIGAMES.boss = {
  title:'',
  closable: false,
  ACTIONS:[
    {key:'a',name:'ANALISAR',desc:'+50% próximo ataque',col:'#c89040'},
    {key:'d',name:'DESCONECTAR',desc:'25–45 dano',col:'#62a870'},
    {key:'f',name:'FRAGMENTAR',desc:'35–60 dano / você toma 15',col:'#cc2a2a'},
    {key:'h',name:'SINCRONIZAR',desc:'+20 HP + escudo',col:'#3a8a48'},
  ],
  RUEL:[
    {name:'MEMÓRIA INVASIVA',d:[15,30],msg:'Ruel invade sua mente com 50 anos de solidão.'},
    {name:'CORRUPÇÃO',d:[20,35],msg:'Seus processos foram corrompidos.'},
    {name:'LOOP',d:[10,20],msg:'Você fica presa num loop de memória.'},
    {name:'PULSO DIGITAL',d:[25,40],msg:'Um pulso de energia pura.'},
  ],
  state:{},
  _dmgNums:[], // floating damage numbers
  _shake:0,    // frames of screen shake remaining
  _bgImg:null,
  _bgLoaded:false,
  build(el){
    const titles={delete:'RESISTÊNCIA DE CONSCIÊNCIA',transfer:'FIREWALL',merge:'SINCRONIZAÇÃO TOTAL',body:'PREPARAÇÃO'};
    $('mgHT').textContent = titles[G.S.path]||'CONFRONTO';
    const s=this.state={php:100,rhp:150,turn:'player',done:false,analyzed:false,shielded:false};
    this._dmgNums=[];this._shake=0;
    el.innerHTML=`
      <div style="position:relative;width:min(580px,96vw);margin:0 auto">
        <!-- HUD de HP sobre a imagem -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:.3rem .5rem;background:#06100a;border:1px solid #1a3a22;border-bottom:none">
          <div style="flex:1;margin-right:.6rem">
            <div style="font-size:.56rem;color:#62a870;letter-spacing:.12em;margin-bottom:.18rem">VOCÊ</div>
            <div style="height:8px;background:#06100a;border:1px solid #1a3a22;border-radius:2px;overflow:hidden"><div id="bPH" style="height:100%;width:100%;background:linear-gradient(90deg,#2a7a38,#62a870);transition:width .3s steps(10)"></div></div>
            <div id="bPHV" style="font-size:.52rem;color:#3a6a44;text-align:left;margin-top:.1rem">100/100</div>
          </div>
          <div style="flex:1;margin-left:.6rem;text-align:right">
            <div style="font-size:.56rem;color:#cc2a2a;letter-spacing:.12em;margin-bottom:.18rem">RUEL</div>
            <div style="height:8px;background:#06100a;border:1px solid #6a1515;border-radius:2px;overflow:hidden"><div id="bRH" style="height:100%;width:100%;background:linear-gradient(90deg,#8a1515,#cc2a2a);transition:width .3s steps(10);float:right"></div></div>
            <div id="bRHV" style="font-size:.52rem;color:#6a1515;text-align:right;margin-top:.1rem">150/150</div>
          </div>
        </div>
        <!-- Canvas principal com imagem de fundo -->
        <div style="position:relative;overflow:hidden;border:1px solid #1a3a22">
          <canvas id="bossCV" style="display:block;width:100%;image-rendering:pixelated"></canvas>
        </div>
        <!-- Turno & ações -->
        <div style="background:#060e0a;border:1px solid #1a3a22;border-top:none;padding:.4rem .5rem">
          <div id="bTurnLbl" style="font-size:.58rem;color:#3a6a44;letter-spacing:.1em;text-align:center;margin-bottom:.3rem">SUA VEZ — escolha uma ação:</div>
          <div class="bacts" id="bActs" style="display:flex;gap:.3rem;flex-wrap:wrap;justify-content:center"></div>
        </div>
        <!-- Log de batalha -->
        <div class="blog" id="bLog" style="background:#050809;border:1px solid #0d1e12;border-top:none;font-size:.68rem;padding:.35rem .55rem;height:64px;overflow-y:auto;line-height:1.7"></div>
      </div>
      <div class="mg-res" id="bRes" style="margin-top:.5rem">
        <div class="mg-rl" id="bRL"></div>
        <div class="mg-rm" id="bRM"></div>
        <button class="pb sm" onclick="MINIGAMES.boss.finish()">[ CONTINUAR ]</button>
      </div>`;
    // Configurar canvas responsivo
    const cv=$('bossCV');
    cv.width=580;cv.height=240;
    // Carregar boss-bg.png sem suprimir erros (usuário foi orientado a salvar o arquivo)
    this._bgLoaded=false;
    const img=new Image();
    img.onload=()=>{this._bgImg=img;this._bgLoaded=true;};
    img.onerror=()=>{this._bgImg=null;this._bgLoaded=false;};
    img.src='boss-bg.png';
    this._bgImg=img;
    this.renderActs();
    this.anim();
    this.log('O confronto começa. 50 anos de consciência digital contra você.','bln');
  },
  log(msg,cls='bln'){const log=$('bLog');if(!log)return;const p=document.createElement('p');p.className=cls;p.textContent=msg;log.appendChild(p);log.scrollTop=9999;},
  upd(){
    const s=this.state;
    const pp=Math.max(0,s.php);
    const rp=Math.max(0,s.rhp);
    $('bPH').style.width=pp+'%';
    $('bRH').style.width=(rp/150*100)+'%';
    $('bPHV').textContent=Math.round(pp)+'/100';
    $('bRHV').textContent=Math.round(rp)+'/150';
  },
  // Spawna número de dano flutuante no canvas
  spawnDmg(val,isPlayer){
    const cv=$('bossCV');if(!cv)return;
    const x=isPlayer?(cv.width*.18+Math.random()*60):(cv.width*.62+Math.random()*80);
    const y=isPlayer?(cv.height*.55):(cv.height*.35);
    this._dmgNums.push({x,y,vy:-1.8,alpha:1,val:'-'+val,col:isPlayer?'#cc2a2a':'#62a870',size:isPlayer?22:20});
  },
  spawnHeal(val){
    const cv=$('bossCV');if(!cv)return;
    this._dmgNums.push({x:cv.width*.18+Math.random()*60,y:cv.height*.55,vy:-1.8,alpha:1,val:'+'+val,col:'#62a870',size:20});
  },
  renderActs(){
    const area=$('bActs');if(!area)return;area.innerHTML='';
    const s=this.state;
    if(s.turn!=='player'||s.done){
      $('bTurnLbl').textContent=s.done?'':'\u23F3 VEZ DE RUEL — aguarde...';
      $('bTurnLbl').style.color=s.done?'#3a6a44':'#cc2a2a';
      return;
    }
    $('bTurnLbl').textContent='SUA VEZ — escolha uma ação:';
    $('bTurnLbl').style.color='#62a870';
    this.ACTIONS.forEach(a=>{
      const b=document.createElement('button');b.className='pb sm';
      b.style.cssText=`border-color:${a.col};color:${a.col};min-width:110px`;
      b.innerHTML=`${a.name}<br><span style="font-size:.52rem;opacity:.7;color:${a.col}">${a.desc}</span>`;
      b.onclick=()=>this.act(a);
      area.appendChild(b);
    });
  },
  act(a){
    const s=this.state;if(s.turn!=='player'||s.done)return;
    s.turn='ruel';this.renderActs();
    if(a.key==='a'){
      s.analyzed=true;
      this.log('Você analisa os padrões de Ruel. Próximo ataque +50%.','blp');
      G.flashGood();
      this._shake=4;
    } else if(a.key==='d'){
      let d=25+Math.floor(Math.random()*21);if(s.analyzed){d=Math.floor(d*1.5);s.analyzed=false;}
      s.rhp-=d;this.log(`DESCONECTAR: ${d} de dano a Ruel.`,'blp');
      G.flashGood();this._shake=6;this.spawnDmg(d,false);
    } else if(a.key==='f'){
      let d=35+Math.floor(Math.random()*26);if(s.analyzed){d=Math.floor(d*1.5);s.analyzed=false;}
      s.rhp-=d;s.php-=15;
      this.log(`FRAGMENTAR: ${d} dano a Ruel / -15 você.`,'blp');
      G.flashBad();this._shake=10;this.spawnDmg(d,false);this.spawnDmg(15,true);
    } else if(a.key==='h'){
      s.php=Math.min(100,s.php+20);s.shielded=true;
      this.log('SINCRONIZAR: +20 HP. Escudo ativo.','blp');
      G.flashGood();this.spawnHeal(20);
    }
    this.upd();
    if(s.rhp<=0){this.end(true);return;}
    setTimeout(()=>this.ruelTurn(),1100);
  },
  ruelTurn(){
    const s=this.state;
    const atk=this.RUEL[Math.floor(Math.random()*this.RUEL.length)];
    let d=atk.d[0]+Math.floor(Math.random()*(atk.d[1]-atk.d[0]+1));
    if(s.shielded){d=Math.floor(d*.45);s.shielded=false;this.log('Escudo absorveu parte do dano!','blp');}
    s.php-=d;
    this.log(`${atk.name}: ${atk.msg} (${d} de dano)`,'ble');
    G.glitch(500);G.flashBad();this._shake=12;this.spawnDmg(d,true);
    this.upd();
    if(s.php<=0){this.end(false);return;}
    s.turn='player';this.renderActs();
  },
  end(win){
    this.state.done=true;this.renderActs();
    $('bRL').className='mg-rl '+(win?'win':'lose');
    $('bRL').textContent=win?'RUEL CEDEU':'ABSORVIDA';
    $('bRM').textContent=win?'Você superou cinquenta anos de resistência digital.':'A consciência de Ruel foi mais forte.';
    $('bRes').classList.add('on');G.S.flags.bossWin=win;
  },
  finish(){cancelAnimationFrame(this._af);G._ignoreNextClick=true;$('mgOv').classList.remove('on');G.goScene(G.S.flags.bossWin?'boss_win':'boss_lose');},
  anim(){
    const cv=$('bossCV');if(!cv)return;
    const ctx=cv.getContext('2d');const W=cv.width,H=cv.height;
    const draw=()=>{
      this._af=requestAnimationFrame(draw);
      const t=Date.now()/1000,s=this.state;
      // Screen shake
      ctx.save();
      if(this._shake>0){
        const sx=(Math.random()-.5)*this._shake*1.2;
        const sy=(Math.random()-.5)*this._shake*.7;
        ctx.translate(sx,sy);
        this._shake--;
      }
      // Background
      if(this._bgImg&&this._bgImg.complete&&this._bgImg.naturalWidth>0){
        ctx.drawImage(this._bgImg,0,0,W,H);
        // Overlay escuro para legibilidade
        ctx.fillStyle='rgba(0,0,0,.38)';ctx.fillRect(0,0,W,H);
      } else {
        // Fallback canvas atmosférico
        ctx.fillStyle='#020308';ctx.fillRect(0,0,W,H);
        // tubos de fundo
        for(let i=0;i<8;i++){
          ctx.strokeStyle=`rgba(30,60,40,${.15+i*.04})`;ctx.lineWidth=8+i*4;
          ctx.beginPath();ctx.moveTo(i*W/8,0);ctx.quadraticCurveTo(i*W/8+40,H/2,i*W/8+20,H);ctx.stroke();
        }
        // glow central
        const grad=ctx.createRadialGradient(W/2,H*.4,0,W/2,H*.4,W*.35);
        grad.addColorStop(0,'rgba(80,0,80,.3)');grad.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
        // silhueta Ruel
        ctx.fillStyle='rgba(120,0,120,.18)';
        ctx.fillRect(W*.42,H*.08,W*.16,H*.72);
        ctx.beginPath();ctx.arc(W*.5,H*.06,W*.065,0,Math.PI*2);ctx.fill();
      }
      // Scanlines CRT
      for(let y=0;y<H;y+=3){ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,y,W,1);}
      // Aura Ruel pulsante (lado direito)
      const rp=s.rhp/150,rPulse=Math.sin(t*3)*.5+.5;
      ctx.fillStyle=`rgba(180,20,20,${rPulse*.12*rp})`;
      ctx.beginPath();ctx.arc(W*.72,H*.38,W*.18,0,Math.PI*2);ctx.fill();
      // Aura player (lado esquerdo) pulsante
      const pp=s.php/100,pPulse=Math.sin(t*2+1)*.5+.5;
      ctx.strokeStyle=`rgba(60,180,80,${pPulse*.55*pp})`;ctx.lineWidth=2;ctx.beginPath();
      for(let x=0;x<W*.38;x++)ctx.lineTo(x,H*.72+Math.sin(x*.06+t*2.5)*(12*pp));
      ctx.stroke();
      // Overlay turno de Ruel
      if(s.turn==='ruel'&&!s.done){
        ctx.fillStyle='rgba(180,20,20,.07)';ctx.fillRect(0,0,W,H);
        ctx.fillStyle=`rgba(180,20,20,${Math.sin(t*6)*.15+.1})`;ctx.fillRect(0,0,W,H);
      }
      // Escudo visual
      if(s.shielded){
        ctx.strokeStyle=`rgba(60,180,180,${Math.sin(t*5)*.4+.5})`;ctx.lineWidth=3;
        ctx.beginPath();ctx.arc(W*.18,H*.5,44,0,Math.PI*2);ctx.stroke();
      }
      // Analisado visual
      if(s.analyzed){
        ctx.strokeStyle=`rgba(200,140,40,${Math.sin(t*8)*.4+.5})`;ctx.lineWidth=2;
        ctx.strokeRect(W*.58,H*.1,W*.28,H*.55);
        ctx.fillStyle=`rgba(200,140,40,.12)`;ctx.fillRect(W*.58,H*.1,W*.28,H*.55);
      }
      // Números de dano flutuantes
      this._dmgNums=this._dmgNums.filter(n=>{
        ctx.globalAlpha=n.alpha;
        ctx.font=`bold ${n.size}px 'Courier New', monospace`;
        ctx.fillStyle=n.col;
        ctx.textAlign='center';
        ctx.shadowColor=n.col;ctx.shadowBlur=8;
        ctx.fillText(n.val,n.x,n.y);
        ctx.shadowBlur=0;ctx.globalAlpha=1;
        n.y+=n.vy;n.alpha-=.025;
        return n.alpha>0;
      });
      ctx.restore();
    };draw();
  },
};

// ── SUS CHECK ──
MINIGAMES.sus_check = {
  title:'INTERROGATÓRIO — DIR. SANTOS',
  closable: false,
  Qs:[
    {q:'Por que você estava no sub-nível B-21?',opts:[
      {t:'Investigação de anomalia — protocolo padrão.',g:true,v:-10},
      {t:'Me perdi durante o trabalho de rotina.',g:false,v:+18},
      {t:'Achei que havia uma falha nos sistemas.',g:true,v:-6},
      {t:'Não respondo sem representação jurídica.',g:false,v:+30},
    ]},
    {q:'Como obteve o código de acesso?',opts:[
      {t:'Encontrei nos logs de manutenção.',g:true,v:-10},
      {t:'Não sei de onde o código veio.',g:false,v:+22},
      {t:'Estava no backup — verifiquei antes.',g:true,v:-8},
      {t:'Um técnico me passou.',g:false,v:+16},
    ]},
    {q:'O que você encontrou lá embaixo?',opts:[
      {t:'Equipamentos antigos. Dados corrompidos.',g:true,v:-6},
      {t:'Nada relevante. Servidores inativos.',g:false,v:+12},
      {t:'A fonte da anomalia — servidores sobrecarregados.',g:true,v:-12},
      {t:'Não tenho clareza do que vi.',g:false,v:+8},
    ]},
    {q:'Está documentado no seu relatório?',opts:[
      {t:'Estou preparando o relatório agora.',g:true,v:-5},
      {t:'Vim te atualizar primeiro.',g:true,v:-8},
      {t:'Não achei necessário ainda.',g:false,v:+22},
      {t:'Qual relatório?',g:false,v:+35},
    ]},
  ],
  state:{},
  build(el){
    const s=this.state={sus:G.S.sus,round:0};
    el.innerHTML=`
      <div class="sus-npc">
        <canvas id="susPort" width="88" height="108" class="sus-pb"></canvas>
        <div class="sus-sp" id="susSp">...</div>
      </div>
      <div class="sus-mt">
        <span class="sus-ml">SUSPEITA</span>
        <div class="sus-mtr"><div class="sus-mf" id="susMF" style="width:${s.sus}%"></div></div>
        <span class="sus-mv" id="susMV">${Math.round(s.sus)}%</span>
      </div>
      <div class="sus-opts" id="susOpts"></div>
      <div class="mg-st" id="susSt">Pergunta 1 de ${this.Qs.length}</div>
      <div class="mg-res" id="susRes">
        <div class="mg-rl" id="susRL"></div>
        <div class="mg-rm" id="susRM"></div>
        <button class="pb sm" onclick="MINIGAMES.sus_check.finish()">[ CONTINUAR ]</button>
      </div>`;
    // desenhar o retrato no canvas passando o contexto 2D
    const susCv = $('susPort'); if (susCv && susCv.getContext) PORT.santos(susCv.getContext('2d'), susCv.width, susCv.height);
    this.showQ();
  },
  showQ(){
    const s=this.state;
    if(s.round>=this.Qs.length){this.end();return;}
    const q=this.Qs[s.round];
    $('susSp').textContent=q.q;
    const opts=$('susOpts');opts.innerHTML='';
    q.opts.forEach(o=>{
      const b=document.createElement('button');b.className='ch';b.textContent=o.t;
      b.onclick=()=>{
        s.sus=Math.max(0,Math.min(100,s.sus+o.v));
        G.setSus(s.sus);$('susMF').style.width=s.sus+'%';$('susMV').textContent=Math.round(s.sus)+'%';
        if(o.g)G.flashGood();else{G.flashBad();G.glitch(400);}
        if(s.sus>=100){this.end(true);return;}
        s.round++;$('susSt').textContent=`Pergunta ${Math.min(s.round+1,this.Qs.length)} de ${this.Qs.length}`;
        setTimeout(()=>this.showQ(),380);
      };
      opts.appendChild(b);
    });
  },
  end(forced=false){
    $('susOpts').innerHTML='';
    const fail=forced||this.state.sus>=80;
    $('susRL').className='mg-rl '+(fail?'lose':'win');
    $('susRL').textContent=fail?'SUSPEITA CONFIRMADA':'CONVENCIDO';
    $('susRM').textContent=fail?'O Diretor Santos chamou segurança.':'Por enquanto. A suspeita permanece.';
    $('susRes').classList.add('on');G.S.flags.susFail=fail;
  },
  finish(){
    $('mgOv').classList.remove('on');
    if(G.S.flags.susFail){
      G.doDeath('ELIMINADA','O Diretor Santos não ficou convencido.\n\nA Nexus existe há 50 anos. Sabe como lidar com pessoas que sabem demais.\n\nVocê foi escoltada para uma sala sem janelas.\n\nRelatório oficial: "Funcionária desaparecida durante investigação técnica."','CAUSA: Suspeita confirmada. Protocolo de contenção ativado.','morte_suspeita');
    } else G.goScene('sus_pass');
  },
};

