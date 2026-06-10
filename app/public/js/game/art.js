// ════════════════════════════════════════════════════════════════
// SECTION 2: PORTRAIT RENDERER
// ════════════════════════════════════════════════════════════════
const PORT = {
  draw(id) {
    const cv = $('portCV');
    if (!cv) return;
    cv.width = cv.parentElement.offsetWidth || 88;
    cv.height = 100;
    const ctx = cv.getContext('2d');
    (PORT[id] || PORT.system)(ctx, cv.width, cv.height);
  },
  _bg(ctx, W, H, col='#050e08') { ctx.fillStyle=col; ctx.fillRect(0,0,W,H); },
  player_f(ctx, W, H) {
    PORT._bg(ctx,W,H); const cx=W/2;
    ctx.fillStyle='#1a3a22'; ctx.fillRect(cx-24,50,48,50);
    ctx.fillStyle='#1e3e26'; ctx.fillRect(cx-20,18,40,36);
    ctx.fillStyle='#0a0e0a'; ctx.fillRect(cx-22,13,44,12); ctx.fillRect(cx-24,18,6,18); ctx.fillRect(cx+18,18,6,16);
    ctx.fillStyle='#4a9a58'; ctx.fillRect(cx-14,28,10,6); ctx.fillRect(cx+4,28,10,6);
    ctx.fillStyle='#000'; ctx.fillRect(cx-12,30,6,3); ctx.fillRect(cx+6,30,6,3);
    ctx.fillStyle='#152a1a'; ctx.fillRect(cx-10,44,20,3);
    ctx.fillStyle='#1a4a28'; ctx.fillRect(cx-14,60,28,14);
    ctx.fillStyle='#4a9a58'; ctx.font='5px monospace'; ctx.textAlign='center'; ctx.fillText('NEXUS',cx,70);
  },
  player_m(ctx, W, H) {
    PORT._bg(ctx,W,H); const cx=W/2;
    ctx.fillStyle='#1a3a22'; ctx.fillRect(cx-26,52,52,48);
    ctx.fillStyle='#1e3e26'; ctx.fillRect(cx-21,16,42,38);
    ctx.fillStyle='#080c08'; ctx.fillRect(cx-23,12,46,9); ctx.fillRect(cx-25,16,5,14); ctx.fillRect(cx+20,16,5,12);
    ctx.fillStyle='#4a9a58'; ctx.fillRect(cx-15,28,11,6); ctx.fillRect(cx+4,28,11,6);
    ctx.fillStyle='#000'; ctx.fillRect(cx-13,30,7,3); ctx.fillRect(cx+6,30,7,3);
    ctx.fillStyle='#152a1a'; ctx.fillRect(cx-11,46,22,3);
    ctx.fillStyle='#1a4a28'; ctx.fillRect(cx-15,62,30,14);
    ctx.fillStyle='#4a9a58'; ctx.font='5px monospace'; ctx.textAlign='center'; ctx.fillText('NEXUS',cx,72);
  },
  ruel(ctx, W, H) {
    PORT._bg(ctx,W,H,'#030608');
    for(let i=0;i<10;i++) {
      ctx.fillStyle=`rgba(${40+i*8},${120+i*4},${50+i*8},0.12)`;
      ctx.fillRect(Math.random()*W, Math.random()*H, Math.random()*25+8, 2);
    }
    ctx.fillStyle='#122018'; ctx.fillRect(18,22,W-36,34);
    ctx.fillStyle='#0c1610'; ctx.fillRect(22,14,W-44,18);
    ctx.fillStyle='#3a8a48'; ctx.fillRect(26,18,9,6); ctx.fillRect(W-35,18,9,6);
    ctx.fillStyle='#7add90'; ctx.fillRect(28,20,5,2); ctx.fillRect(W-33,20,5,2);
    ctx.fillStyle='rgba(80,200,100,.5)'; ctx.fillRect(0,25,W,1); ctx.fillRect(0,38,W,1);
    ctx.fillStyle='rgba(255,0,0,.25)'; ctx.fillRect(0,32,W,1);
    ctx.fillStyle='#62a870'; ctx.font='5px monospace'; ctx.textAlign='center'; ctx.fillText('RUEL_?',W/2,85);
  },
  santos(ctx, W, H) {
    PORT._bg(ctx,W,H,'#080c08');
    ctx.fillStyle='#101a10'; ctx.fillRect(8,50,W-16,50);
    ctx.fillStyle='#1a2a1a'; ctx.fillRect(W/2-6,50,12,30);
    ctx.fillStyle='#1e361e'; ctx.fillRect(18,15,W-36,38);
    ctx.fillStyle='#3a5a3a'; ctx.fillRect(16,11,W-32,8); ctx.fillRect(14,15,5,14); ctx.fillRect(W-19,15,5,12);
    ctx.fillStyle='#2a6a38'; ctx.fillRect(22,28,10,7); ctx.fillRect(W-32,28,10,7);
    ctx.fillStyle='#050805'; ctx.fillRect(25,31,6,4); ctx.fillRect(W-31,31,6,4);
    ctx.fillStyle='#101a10'; ctx.fillRect(W/2-11,46,22,3);
    ctx.fillStyle='#3a2a08'; ctx.fillRect(W-30,58,24,13);
    ctx.fillStyle='#c89050'; ctx.font='4px monospace'; ctx.textAlign='center'; ctx.fillText('DIR.',W-18,66); ctx.fillText('SANTOS',W-18,72);
  },
  system(ctx, W, H) {
    PORT._bg(ctx,W,H,'#040a06');
    ctx.fillStyle='#08120a'; ctx.fillRect(8,12,W-16,68);
    ctx.strokeStyle='#1a4a22'; ctx.lineWidth=1; ctx.strokeRect(8,12,W-16,68);
    ctx.fillStyle='#020806'; ctx.fillRect(12,16,W-24,60);
    ctx.fillStyle='#2a6a38'; ctx.fillRect(16,20,5,9);
    for(let i=0;i<5;i++){ctx.fillStyle=`rgba(40,140,60,${.25+i*.08})`; ctx.fillRect(24,20+i*10,Math.random()*28+12,2);}
    ctx.fillStyle='#2a6a38'; ctx.font='5px monospace'; ctx.textAlign='center'; ctx.fillText('SISTEMA',W/2,86);
  },
  narrator(ctx, W, H) {
    PORT._bg(ctx,W,H,'#040806');
    ctx.fillStyle='#0a1810'; ctx.beginPath(); ctx.ellipse(W/2,H/2,32,20,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#142a18'; ctx.beginPath(); ctx.arc(W/2,H/2,22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1e4428'; ctx.beginPath(); ctx.arc(W/2,H/2,12,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3a8a48'; ctx.beginPath(); ctx.arc(W/2,H/2,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(W/2,H/2,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#2a6a38'; ctx.font='5px monospace'; ctx.textAlign='center'; ctx.fillText('NARRADOR',W/2,90);
  },
};

// ════════════════════════════════════════════════════════════════
// SECTION 3: SCENE ARTIST
// ════════════════════════════════════════════════════════════════
const ART = {
  draw(id) {
    const cv = $('sceneCV');
    if (!cv) return;
    cv.width = cv.parentElement.offsetWidth || 800;
    cv.height = cv.parentElement.offsetHeight || 300;
    (ART[id] || ART.corridor)(cv.getContext('2d'), cv.width, cv.height);
  },
  _grid(ctx, W, H) {
    ctx.strokeStyle='rgba(40,100,50,.03)'; ctx.lineWidth=1;
    for(let x=0;x<W;x+=8){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=8){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  },
  room_start(ctx, W, H) {
    ctx.fillStyle='#06080a'; ctx.fillRect(0,0,W,H);
    // floor
    ctx.fillStyle='#080c0a'; ctx.fillRect(0,H*.62,W,H*.38);
    // ceiling
    ctx.fillStyle='#050708'; ctx.fillRect(0,0,W,H*.14);
    // walls — concrete texture
    for(let x=0;x<W;x+=6){
      const v=Math.sin(x*.04)*2;
      ctx.fillStyle=`rgba(12,${18+v},14,0.9)`;
      ctx.fillRect(x,H*.14,6,H*.48);
    }
    // desk with computer
    ctx.fillStyle='#0e1a12'; ctx.fillRect(W*.1,H*.52,W*.35,H*.12);
    ctx.fillStyle='#060e08'; ctx.fillRect(W*.14,H*.3,W*.22,H*.22);
    ctx.strokeStyle='rgba(30,80,40,.5)'; ctx.lineWidth=1; ctx.strokeRect(W*.14,H*.3,W*.22,H*.22);
    ctx.fillStyle='rgba(0,40,10,.3)'; ctx.fillRect(W*.15,H*.31,W*.2,H*.2);
    // blinking screen
    if(Math.floor(Date.now()/600)%2) { ctx.fillStyle='rgba(40,130,60,.4)'; ctx.fillRect(W*.16,H*.32,4,8); }
    // door at far right — reinforced metal
    const dw=W*.14, dx=W*.82, dy=H*.18, dh=H*.62;
    ctx.fillStyle='#080e0c'; ctx.fillRect(dx,dy,dw,dh);
    ctx.strokeStyle='rgba(30,70,40,.6)'; ctx.lineWidth=2; ctx.strokeRect(dx,dy,dw,dh);
    [[dx+5,dy+5],[dx+dw-5,dy+5],[dx+5,dy+dh-5],[dx+dw-5,dy+dh-5]].forEach(([bx,by])=>{
      ctx.fillStyle='rgba(50,30,10,.8)'; ctx.fillRect(bx-3,by-3,6,6);
    });
    // monitor on door
    ctx.fillStyle='#020606'; ctx.fillRect(dx+dw*.12,dy+dh*.28,dw*.76,dh*.22);
    ctx.strokeStyle='rgba(20,60,30,.8)'; ctx.lineWidth=1; ctx.strokeRect(dx+dw*.12,dy+dh*.28,dw*.76,dh*.22);
    ctx.fillStyle='rgba(0,50,20,.5)'; ctx.fillRect(dx+dw*.14,dy+dh*.3,dw*.72,dh*.18);
    // fluorescent ceiling light
    ctx.fillStyle='rgba(100,180,110,.55)'; ctx.fillRect(W*.25,0,W*.5,3);
    ctx.fillStyle='rgba(80,160,90,.06)'; ctx.fillRect(W*.1,0,W*.8,H*.45);
    // floor tiles subtle
    for(let tx=0;tx<W;tx+=W/8) { ctx.fillStyle='rgba(15,30,18,.6)'; ctx.fillRect(tx,H*.62,1,H*.38); }
  },
  corridor(ctx, W, H) {
    ctx.fillStyle='#060a08'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#070c0a'; ctx.fillRect(0,H*.64,W,H*.36);
    ctx.fillStyle='#050708'; ctx.fillRect(0,0,W,H*.13);
    for(let x=0;x<W;x+=5){
      const v=Math.sin(x*.035)*.04;
      ctx.fillStyle=`rgba(10,${18+v*30},12,0.85)`;
      ctx.fillRect(x,H*.13,5,H*.51);
    }
    // ceiling pipes
    ctx.fillStyle='#161e14'; ctx.fillRect(0,6,W,9); ctx.fillRect(0,19,W,5);
    ctx.fillStyle='#0b130a'; ctx.fillRect(0,8,W,4);
    // lamps
    [.12,.32,.52,.72,.9].forEach((p,i)=>{
      const x=W*p, flicker=i===2&&Math.random()>.6;
      ctx.fillStyle=flicker?'#050708':'rgba(110,190,120,.6)';
      ctx.fillRect(x-18,H*.13,36,3);
      if(!flicker){ctx.fillStyle='rgba(90,170,100,.06)';ctx.fillRect(x-45,H*.13,90,H*.35);}
    });
    // doors on sides
    const mkDoor=(dx,dw,col)=>{
      ctx.fillStyle='#07100a'; ctx.fillRect(dx,H*.22,dw,H*.42);
      ctx.strokeStyle=col; ctx.lineWidth=1; ctx.strokeRect(dx,H*.22,dw,H*.42);
      // warning stripes
      for(let s=0;s<6;s++){
        ctx.fillStyle=s%2===0?'rgba(140,100,0,.45)':'rgba(0,0,0,.45)';
        ctx.fillRect(dx+s*dw/6,H*.22,dw/6,H*.42);
      }
    };
    mkDoor(W*.02,W*.12,'rgba(25,70,35,.6)');
    mkDoor(W*.86,W*.12,'rgba(25,70,35,.6)');
    // floor
    for(let tx=0;tx<W;tx+=W/10){ctx.fillStyle='rgba(14,28,16,.6)';ctx.fillRect(tx,H*.64,1,H*.36);}
  },
  left_room(ctx, W, H) {
    ctx.fillStyle='#040809'; ctx.fillRect(0,0,W,H);
    // dim overhead
    ctx.fillStyle='rgba(80,140,90,.04)'; ctx.fillRect(W*.3,0,W*.4,H*.5);
    for(let i=0;i<6;i++){
      const x=W*(i*.16+.03), cw=W*.13, ch=H*.28, cy=H*.52;
      ctx.fillStyle='#070f0d'; ctx.fillRect(x,cy,cw,ch);
      ctx.strokeStyle=i===2||i===4?'rgba(20,100,40,.5)':'rgba(60,20,20,.3)';
      ctx.lineWidth=1; ctx.strokeRect(x,cy,cw,ch);
      if(i===2){ctx.fillStyle='rgba(0,60,20,.35)';ctx.fillRect(x+2,cy+2,cw-4,ch*.6);ctx.fillStyle='rgba(0,180,40,.65)';ctx.fillRect(x+4,cy+4,4,8);}
      if(i===4){ctx.fillStyle='rgba(0,50,15,.25)';ctx.fillRect(x+2,cy+2,cw-4,ch*.6);}
    }
    // dust
    ctx.fillStyle='rgba(80,120,70,.06)';
    for(let i=0;i<18;i++) ctx.fillRect(Math.random()*W,Math.random()*H,2,2);
    // low light
    ctx.fillStyle='rgba(50,100,60,.05)'; ctx.fillRect(0,0,W,H*.6);
  },
  right_room(ctx, W, H) {
    ctx.fillStyle='#050809'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(18,30,22,.85)'; ctx.fillRect(0,H*.6,W*.45,H*.16); ctx.fillRect(W*.55,H*.6,W*.45,H*.16);
    [W*.06,W*.62].forEach(mx=>{
      ctx.fillStyle='#020608'; ctx.fillRect(mx,H*.33,W*.24,H*.24);
      ctx.strokeStyle='rgba(25,80,38,.4)'; ctx.lineWidth=1; ctx.strokeRect(mx,H*.33,W*.24,H*.24);
      ctx.fillStyle='rgba(0,50,18,.25)'; ctx.fillRect(mx+2,H*.33+2,W*.24-4,H*.24-4);
    });
    ctx.fillStyle='rgba(28,42,32,.85)'; ctx.fillRect(W*.83,H*.16,W*.15,H*.62);
    ctx.strokeStyle='rgba(40,70,45,.5)'; ctx.lineWidth=1; ctx.strokeRect(W*.83,H*.16,W*.15,H*.62);
    for(let d=0;d<4;d++) ctx.strokeRect(W*.835+2,H*.18+d*H*.14,W*.14,H*.13);
    for(let i=0;i<6;i++){ctx.fillStyle='rgba(100,110,80,.07)';ctx.fillRect(Math.random()*W*.7,H*.62+Math.random()*H*.2,Math.random()*55+15,Math.random()*25+8);}
  },
  center_room(ctx, W, H) {
    ctx.fillStyle='#040709'; ctx.fillRect(0,0,W,H);
    for(let i=0;i<5;i++){
      const x=W*(i*.18+.04), sw=W*.15, sh=H*.4;
      ctx.fillStyle='#020508'; ctx.fillRect(x,H*.08,sw,sh);
      ctx.strokeStyle='rgba(16,55,28,.55)'; ctx.lineWidth=1; ctx.strokeRect(x,H*.08,sw,sh);
      if(i===2){ctx.fillStyle='rgba(0,70,20,.3)';ctx.fillRect(x+2,H*.08+2,sw-4,sh-4);}
    }
    // cable/plug area bottom right
    ctx.fillStyle='#070f0c'; ctx.fillRect(W*.78,H*.68,W*.2,H*.28);
    ctx.strokeStyle='rgba(25,80,40,.5)'; ctx.lineWidth=1; ctx.strokeRect(W*.78,H*.68,W*.2,H*.28);
    ctx.strokeStyle='rgba(30,70,35,.6)'; ctx.lineWidth=3;
    for(let c=0;c<5;c++){ctx.beginPath();ctx.moveTo(W*.78,H*.73+c*8);ctx.lineTo(W,H*.78+c*4);ctx.stroke();}
  },
  elevator(ctx, W, H) {
    ctx.fillStyle='#050a0d'; ctx.fillRect(0,0,W,H);
    const ex=W*.34,ew=W*.32,eh=H*.76,ey=H*.1;
    ctx.fillStyle='#060e16'; ctx.fillRect(ex,ey,ew,eh);
    ctx.strokeStyle='rgba(25,65,90,.5)'; ctx.lineWidth=2; ctx.strokeRect(ex,ey,ew,eh);
    [[ex+5,ey+5],[ex+ew-5,ey+5],[ex+5,ey+eh-5],[ex+ew-5,ey+eh-5]].forEach(([bx,by])=>{
      ctx.fillStyle='rgba(60,40,15,.8)'; ctx.fillRect(bx-3,by-3,6,6);
      ctx.strokeStyle='rgba(25,60,80,.4)'; ctx.lineWidth=1; ctx.strokeRect(bx-3,by-3,6,6);
    });
    const px=ex+ew*.63, pw=ew*.28, ppy=ey+eh*.28, ph=eh*.38;
    ctx.fillStyle='#040810'; ctx.fillRect(px,ppy,pw,ph);
    ctx.strokeStyle='rgba(0,130,180,.35)'; ctx.lineWidth=1; ctx.strokeRect(px,ppy,pw,ph);
    ['B1','B3','B8','B12','B21'].forEach((t,i)=>{
      ctx.fillStyle=t==='B21'?'rgba(200,30,30,.85)':'rgba(0,180,210,.45)';
      ctx.font=`${Math.round(ph*.1)}px monospace`; ctx.textAlign='center';
      ctx.fillText(t,px+pw/2,ppy+ph*.14+i*ph*.18);
    });
    ctx.fillStyle='rgba(130,155,130,.2)'; ctx.font=`${Math.round(eh*.055)}px monospace`;
    ctx.textAlign='left'; ctx.fillText('EU AINDA ESTOU AQUI',ex+6,ey+eh*.89);
  },
  subsolo(ctx, W, H) {
    ctx.fillStyle='#020305'; ctx.fillRect(0,0,W,H);
    const t = Date.now()/3000;
    for(let i=0;i<18;i++){
      const prog=Math.min(1,Math.max(0,(t-i*.11)));
      if(prog<=0) continue;
      const x=(i%6)*(W/6)+W*.04, y=Math.floor(i/6)*(H*.28)+H*.08;
      ctx.fillStyle=`rgba(70,150,90,${prog*.11})`; ctx.fillRect(x,y,W*.11,H*.22);
      ctx.strokeStyle=`rgba(70,150,90,${prog*.38})`; ctx.lineWidth=1; ctx.strokeRect(x,y,W*.11,H*.22);
    }
    // silhouette
    if(Math.random()>.72){
      ctx.fillStyle='rgba(70,190,90,.07)';
      const sx=W*.73;
      ctx.fillRect(sx,H*.15,W*.055,H*.54);
      ctx.beginPath(); ctx.arc(sx+W*.027,H*.12,W*.035,0,Math.PI*2); ctx.fill();
    }
  },
  ruel_room(ctx, W, H) {
    ctx.fillStyle='#020208'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#030510'; ctx.fillRect(W*.1,H*.04,W*.8,H*.54);
    ctx.strokeStyle='rgba(160,0,160,.38)'; ctx.lineWidth=3; ctx.strokeRect(W*.1,H*.04,W*.8,H*.54);
    for(let y=H*.04;y<H*.58;y+=4){ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(W*.1,y,W*.8,2);}
    [W*.02,W*.85].forEach(mx=>{ctx.fillStyle='#030510';ctx.fillRect(mx,H*.6,W*.11,H*.28);ctx.strokeStyle='rgba(25,90,40,.35)';ctx.lineWidth=1;ctx.strokeRect(mx,H*.6,W*.11,H*.28);});
    ctx.fillStyle='rgba(160,0,160,.05)'; ctx.beginPath(); ctx.arc(W*.5,H*.3,W*.055,0,Math.PI*2); ctx.fill();
  },
};

