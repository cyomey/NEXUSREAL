// ════════════════════════════════════════════════════════════════
// SECTION 11: TITLE CANVAS & PARTICLES
// ════════════════════════════════════════════════════════════════
(()=>{
  const cv=$('titleArt');if(!cv)return;
  const ctx=cv.getContext('2d');const W=cv.width,H=cv.height;
  ctx.fillStyle='#050809';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#09130e';ctx.fillRect(8,6,W-16,H-14);
  ctx.strokeStyle='#1a4a22';ctx.lineWidth=1;ctx.strokeRect(8,6,W-16,H-14);
  ctx.fillStyle='#030807';ctx.fillRect(12,10,W-24,H-22);
  for(let y=10;y<H-12;y+=3){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(12,y,W-24,1);}
  ctx.fillStyle='#2a6a38';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('NEXUS ENTERPRISE',W/2,H/2-6);
  ctx.fillStyle='#1a4a22';ctx.font='7px monospace';ctx.fillText('SISTEMA ATIVO v7.3',W/2,H/2+7);
  ctx.fillStyle='#0f2a18';ctx.font='6px monospace';ctx.fillText('ANO 50 PÓS-APAGÃO',W/2,H/2+18);
  [[12,10],[W-18,10],[12,H-16],[W-18,H-16]].forEach(([x,y])=>{ctx.fillStyle='#2a6a38';ctx.fillRect(x,y,5,5);});
  const blink=()=>{ctx.fillStyle=Math.floor(Date.now()/500)%2?'#2a6a38':'#030807';ctx.fillRect(15,13,4,8);requestAnimationFrame(blink);};blink();
})();

(()=>{
  const cv=document.createElement('canvas');
  cv.style.cssText='position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5';
  document.body.appendChild(cv);
  const ctx=cv.getContext('2d');
  const pts=Array.from({length:20},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12,s:Math.floor(Math.random()*2+1)*2}));
  const resize=()=>{cv.width=innerWidth;cv.height=innerHeight};
  window.addEventListener('resize',resize);resize();
  const tick=()=>{ctx.clearRect(0,0,cv.width,cv.height);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=cv.width;if(p.x>cv.width)p.x=0;if(p.y<0)p.y=cv.height;if(p.y>cv.height)p.y=0;ctx.fillStyle='rgba(40,100,50,.1)';ctx.fillRect(Math.round(p.x),Math.round(p.y),p.s,p.s);});requestAnimationFrame(tick);};tick();
})();

// ════════════════════════════════════════════════════════════════
// SECTION 12: INIT.
// ════════════════════════════════════════════════════════════════
$('tName').addEventListener('keydown', e => { if(e.key==='Enter') G.startGame(); });

// Resize handler
window.addEventListener('resize', () => {
  if ($('sGame').classList.contains('on') && G.S?.scene) {
    const sc = SCENES[G.S.scene];
    if (sc) ART.draw(sc.art || 'corridor');
  }
});

// Periodic save
setInterval(() => { if (G.S?.scene) G.saveState(); }, 30000);

// Ruel glitch on portrait
setInterval(() => {
  const sp = $('spkName');
  if (sp && sp.textContent.includes('RUEL')) G.glitch(150);
}, 4500);

// Scene canvas animation for subsolo
setInterval(() => {
  if ($('sGame').classList.contains('on') && G.S?.scene === 'elevator_descent') {
    ART.draw('subsolo');
  }
}, 500);

console.log('%cNEXUS ENTERPRISE v6.0','color:#2a6a38;font-family:monospace;font-size:12px');
console.log('%cCÓD ELEVADOR: 170492 | PC LOGIN: RUEL / R-17-U-04-E-92-L','color:#cc0000;font-family:monospace;font-size:10px');
