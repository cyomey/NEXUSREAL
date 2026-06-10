    <div id="crt"></div>
    <div id="flashEl"></div>
    <div id="notifBox"></div>

    <!-- TITLE -->
    <div class="scr on" id="sTitle">
      <canvas id="titleArt" width="260" height="84"></canvas>
      <div class="t-corp">NEXUS ENTERPRISE // SISTEMA INTERNO — ANO 50
        PÓS-APAGÃO</div>
      <div class="t-logo">A ANOMALIA DA<br>NEXUS ENTERPRISE</div>
      <div class="t-sub">VISUAL NOVEL INTERATIVA</div>
      <div class="t-div"></div>
      <div class="t-lbl">NOME DO AGENTE</div>
      <input class="t-inp" id="tName" type="text" placeholder="SEU NOME"
        maxlength="16" autocomplete="off" spellcheck="false">
      <div class="t-lbl" style="margin-top:.45rem">GÊNERO</div>
      <div style="display:flex;gap:.7rem;justify-content:center;margin:.3rem 0">
        <label class="grad"><input type="radio" name="gen" value="f" checked>
          Feminino</label>
        <label class="grad"><input type="radio" name="gen" value="m">
          Masculino</label>
        <label class="grad"><input type="radio" name="gen" value="n">
          Neutro</label>
      </div>
      <button class="pb" onclick="G.startGame()" style="margin-top:.7rem">[
        INICIAR INVESTIGAÇÃO ]</button>
      <button class="pb sm" onclick="G.tryResume()" style="margin-top:.35rem">[
        RETOMAR SESSÃO ]</button>
      <button class="pb sm" onclick="G.openMural(true)"
        style="margin-top:.2rem">[ MURAL DE FINAIS ]</button>
      <div class="t-warn">AVISO: HORROR PSICOLÓGICO — INSPIRADO EM I HAVE NO
        MOUTH
        AND I MUST SCREAM<br>O GRANDE APAGÃO OCORREU HÁ 50 ANOS</div>
    </div>

    <!-- GAME -->
    <div class="scr" id="sGame">
      <div id="sceneArea">
        <canvas id="sceneCV"></canvas>
        <div id="sceneLbl"></div>
        <div id="camTm"></div>
        <div id="itemCard"><div class="ic-title" id="icTitle"></div><div
            id="icBody"></div></div>
        <div id="itemCardGame"></div>
      </div>
      <div id="uiBot">
        <div id="dialRow">
          <div id="portWrap">
            <canvas id="portCV" width="88" height="100"></canvas>
            <div id="spkName">—</div>
          </div>
          <div id="txtArea">
            <div id="dialTxt"></div>
            <div id="advHint">... clique em qualquer lugar</div>
          </div>
        </div>
        <div id="choicesDiv"></div>
        <button id="backBtn" onclick="G.goBack()"></button>
        <div id="hudBar">
          <div class="hc">SYNC <b id="hSV">75%</b><span class="hb"><span
                class="hbf" id="hSB"
                style="width:75%;background:#3a8a48"></span></span></div>
          <div class="hsep"></div>
          <div class="hc" style="color:#8a2020">SUSPEITA <b id="hSuV"
              style="color:#cc2a2a">0%</b><span class="hb"><span class="hbf"
                id="hSuB"
                style="width:0%;background:#cc2a2a"></span></span></div>
          <div class="hsep"></div>
          <div class="hc">FRAG <b id="hFrag" style="color:#c89040">0</b></div>
          <div class="sp"></div>
          <button class="hbtn" onclick="G.openInv('items')">ITENS</button>
          <button class="hbtn" onclick="G.openInv('lore')">LORE</button>
          <button class="hbtn" onclick="G.openMural(false)">FINAIS</button>
          <button class="hbtn y" style="margin-left:.3rem"
            onclick="G.openSaveSlots()">SALVAR</button>
          <button class="hbtn g" onclick="G.openLoadSlots()">CARREGAR</button>
          <button class="hbtn r"
            onclick="if(confirm('Sair para menu?')) G.returnToMenu()">MENU</button>
        </div>
      </div>
    </div>

    <!-- DEATH -->
    <div class="scr" id="sDeath">
      <div class="d-sk">[MORTE]</div>
      <div class="d-t" id="dT">VOCÊ MORREU</div>
      <div class="d-dv"></div>
      <div class="d-b" id="dB"></div>
      <div class="d-c" id="dC"></div>
      <button class="pb r" onclick="G.restart()">[ REINICIAR ]</button>
      <button class="pb sm" style="margin-top:.35rem"
        onclick="G.openMural(true)">[ VER MURAL ]</button>
    </div>

    <!-- FINAL -->
    <div class="scr" id="sFinal">
      <div class="f-eye">NEXUS ENTERPRISE // REGISTRO DE OCORRÊNCIA</div>
      <div class="f-num" id="fN"></div>
      <div class="f-tit" id="fT"></div>
      <div class="f-dv" id="fD"></div>
      <div class="f-b" id="fB"></div>
      <div class="f-tg" id="fG"></div>
      <button class="pb sm" onclick="G.openMural(true)">[ MURAL DE FINAIS
        ]</button>
      <button class="pb sm" style="margin-top:.35rem" onclick="G.restart()">[
        REINICIAR ]</button>
    </div>

    <!-- MURAL -->
    <div class="scr" id="sMural">
      <div class="mural-t">== MURAL DE FINAIS ==</div>
      <div class="mg" id="muralGrid"></div>
      <div style="text-align:center;margin-top:.9rem"><button class="pb sm"
          onclick="G.closeMural()">[ VOLTAR ]</button></div>
    </div>

    <!-- INVENTORY -->
    <div id="invOv">
      <div id="invBox">
        <div class="inv-hd"><div class="inv-ht">INVENTÁRIO</div><button
            class="pb sm" onclick="G.closeInv()">[ FECHAR ]</button></div>
        <div class="inv-tabs">
          <div class="itab on" id="it-items"
            onclick="G.switchTab('items')">ITENS</div>
          <div class="itab" id="it-lore" onclick="G.switchTab('lore')">LORE /
            DOCS</div>
        </div>
        <div class="inv-body">
          <div class="inv-list" id="invList"></div>
          <div class="inv-det"><div class="inv-dt" id="invDT">Selecione um
              item</div><div class="inv-db" id="invDB"></div><div
              class="inv-use" id="invUse"><button class="pb sm y"
                onclick="G.useItem()">[ USAR AQUI ]</button></div></div>
        </div>
      </div>
    </div>

    <!-- SAVE SLOTS -->
    <div id="saveOv">
      <div id="saveBox">
        <div class="inv-hd"><div class="inv-ht">SALVAR PROGRESSO</div><button
            class="pb sm" onclick="G.closeSaveSlots()">[ FECHAR ]</button></div>
        <div id="slotsContainer"></div>
      </div>
    </div>

    <!-- RESUME SLOTS -->
    <div id="resumeOv">
      <div id="resumeBox">
        <div class="inv-hd"><div class="inv-ht">RETOMAR JOGO</div><button
            class="pb sm" onclick="G.closeResumeSlots()">[ FECHAR
            ]</button></div>
        <div id="resumeContainer"></div>
      </div>
    </div>

    <!-- LOAD SLOTS -->
    <div id="loadOv">
      <div id="loadBox">
        <div class="inv-hd"><div class="inv-ht">CARREGAR PROGRESSO</div><button
            class="pb sm" onclick="G.closeLoadSlots()">[ FECHAR ]</button></div>
        <div id="loadsContainer"></div>
      </div>
    </div>

    <!-- MINIGAME -->
    <div id="mgOv">
      <div id="mgBox">
        <div class="mg-hd"><div class="mg-ht" id="mgHT">MINIGAME</div><div
            class="mg-esc" id="mgEsc" onclick="G.closeMG()">[ ESC — SAIR
            ]</div></div>
        <div class="mg-bd" id="mgBD"></div>
      </div>
    </div>

