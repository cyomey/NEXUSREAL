// ════════════════════════════════════════════════════════════════
// SECTION 6: SCENES DATA
// ════════════════════════════════════════════════════════════════
const SCENES = {};

// Pronoun shortcuts
const P = () => G.pr();
const N = () => G.S.name;

// ── ROOM START ──
SCENES.room_start = {
  art:'room_start', label:'SEU ESCRITÓRIO — NEXUS ENTERPRISE',
  lines:[
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:()=>`${N()} lê o email pela segunda vez. Uma anomalia no data center. Prioridade máxima. Cinquenta anos de história da Nexus armazenados naqueles servidores — e algo está corrompendo tudo.`},
    {char:'narrator', name:'NARRADOR', text:'A sala tem cheiro de ar condicionado velho. Monitores acesos. Uma xícara fria de café. O tipo de ambiente que existe às três da manhã.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:()=>`${P().um} anomalia. Claro. Justo agora.`},
    {char:'narrator', name:'NARRADOR', text:'Ao fundo do escritório, uma porta de metal reforçado leva ao corredor do data center. Há um monitor embutido nela — piscando.'},
  ],
  choices:[
    {text:'Examinar a porta de metal.', fn:()=>G.goScene('door_examine')},
    {text:'Verificar o email antes de sair.', fn:()=>G.goScene('read_email')},
  ],
};

SCENES.read_email = {
  art:'room_start', label:'EMAIL — NEXUS TI CENTRAL',
  lines:[
    {char:'system', name:'EMAIL', text:'DE: ti.central@nexus.corp\nPARA: você\nASSUNTO: URGENTE — Anomalia no Data Center\n\n"Uma anomalia em nosso sistema está causando a corrupção de arquivos críticos. Cinquenta anos de dados em risco. Sua presença é necessária imediatamente."'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Cinquenta anos. Desde o Grande Apagão. Desde que a Nexus surgiu do nada com uma solução que ninguém mais tinha.'},
    {char:'narrator', name:'NARRADOR', text:'Você sempre achou estranho isso. Uma empresa que apareceu exatamente quando o mundo mais precisava. Mas ninguém pergunta quando as luzes voltam.'},
  ],
  next:'door_examine',
};

SCENES.door_examine = {
  art:'room_start', label:'PORTA DO DATA CENTER',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'A porta de metal reforçado tem um monitor embutido. Antigo — décadas de poeira na moldura. Mas o monitor pisca como novo.'},
    {char:'system', name:'TERMINAL', text:'[ ACESSO RESTRITO — INSIRA CARTÃO ]'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Meu crachá deveria funcionar aqui.'},
    {char:'system', name:'TERMINAL', text:'[ CARTÃO INVÁLIDO — ACESSO NEGADO ]'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Não funciona. O sistema nem reconheceu meu nível de acesso.'},
    {char:'narrator', name:'NARRADOR', text:'O monitor continua piscando. Há fios expostos nas bordas — alguém já tentou arrombar essa porta antes.'},
  ],
  choices:[
    {text:'Tentar arrancar o monitor da parede.', fn:()=>G.goScene('rip_monitor')},
    {text:'Voltar e verificar se há outra saída.', fn:()=>G.goScene('no_other_exit')},
  ],
};

SCENES.no_other_exit = {
  art:'room_start', label:'SEM SAÍDA',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Nenhuma outra saída. O escritório tem paredes de concreto. A única via de acesso ao data center é aquela porta.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Vai ter que ser na força.'},
  ],
  next:'rip_monitor',
};

SCENES.rip_monitor = {
  art:'room_start', label:'ARRANCANDO O MONITOR',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Com ferramentas do kit de manutenção do escritório, você começa a desencaixar o painel do monitor.'},
    {char:'narrator', name:'NARRADOR', text:'A tela arranca com um barulho seco de plástico e metal. Fios expostos. Dezenas deles, coloridos, organizados por alguém que claramente sabia o que fazia.'},
    {char:'narrator', name:'NARRADOR', text:'E na tela ainda ligada — por uma fração de segundo — a imagem de uma pessoa.'},
    {char:'ruel', name:'???', text:'n̷̡͝ã̵͔o̴̢̒ ̷̘͌c̸͕͝o̶̡͒n̷̦͌e̷̦͋c̵̙̀t̵̤̀a̸̜͘ ̶̕o̵ ̶ú̴l̵t̸i̸m̵o̶'},
    {char:'system', name:'SISTEMA', text:'[ MINIGAME: CIRCUITO DE PULSOS ]'},
  ],
  next: () => {
    // If wire minigame already completed, skip reopening and go to outcome
    try { if (G.hasFlag && G.hasFlag('wireDone')) return 'after_wire_good'; } catch(e) {}
    G.openMG('wire'); return null;
  },
};

SCENES.after_wire_good = {
  art:'corridor', label:'DATA CENTER — CORREDOR PRINCIPAL',
  effect:()=>{ G.flashGood(); G.setSync(G.S.sync+10); },
  lines:[
    {char:'system', name:'SISTEMA', text:'[ SINCRONIZAÇÃO — ACESSO CONCEDIDO ]'},
    {char:'narrator', name:'NARRADOR', text:'A porta abre com um clique mecânico grave. Além dela: o corredor do data center.'},
    {char:'narrator', name:'NARRADOR', text:'Três direções. À esquerda: área técnica antiga. Ao centro: o elevador. À direita: a área de arquivos.'},
  ],
  next:'corridor_hub',
};

SCENES.after_wire_bad = {
  art:'corridor', label:'DATA CENTER — CORREDOR PRINCIPAL',
  effect:()=>{ G.flashBad(); G.setSync(G.S.sync-20); G.glitch(2000); },
  lines:[
    {char:'ruel', name:'VOZ DISTORCIDA', text:'V̸o̷c̵ê̸ ̶n̶ã̸o̸ ̴d̴e̸v̸i̸a̸.'},
    {char:'narrator', name:'NARRADOR', text:'A porta abre mesmo assim. Mas algo mudou. Uma sensação de que você está sendo observado.'},
    {char:'narrator', name:'NARRADOR', text:'Você corre instintivamente para o elevador central. Precisa descer. Precisa encontrar respostas.'},
  ],
  next:'elevator_descent',
};

SCENES.corridor_hub = {
  art:'corridor', label:'DATA CENTER — CORREDOR PRINCIPAL',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O corredor do data center. Lâmpadas fluorescentes. Racks de servidores. O cheiro de ar frio e eletrônica aquecida.'},
    {char:'narrator', name:'NARRADOR', text:'Uma lâmpada no centro pisca sem ritmo. Ao longe, um clique rítmico — como um coração dentro das máquinas.'},
  ],
  choices:[
    {text:'Ir para o corredor da esquerda (área técnica).', fn:()=>G.goScene('left_enter')},
    {text:'Tentar o elevador ao centro.', fn:()=>G.goScene('elev_first')},
    {text:'Ir para o corredor da direita (arquivos).', fn:()=>G.goScene('right_enter')},
  ],
};

// ── ELEVADOR ──
SCENES.elev_first = {
  art:'elevator', label:'ELEVADOR — CORREDOR CENTRAL', backTo:'corridor_hub', backLabel:'Corredor principal',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O elevador tem décadas de ferrugem. Na parede interna, alguém gravou a ponto de metal: "EU AINDA ESTOU AQUI."'},
    {char:'system', name:'TERMINAL', text:'[ INSIRA SEUS DADOS ]'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Meu crachá não serve aqui. Preciso de outra coisa.'},
  ],
  choices:[
    {text:'Inserir o crachá mesmo assim.', fn:()=>G.goScene('elev_fail1')},
    {text:'Voltar e explorar os corredores.', fn:()=>G.goScene('corridor_hub')},
  ],
};

SCENES.elev_fail1 = {
  art:'elevator', label:'ELEVADOR', backTo:'elev_first', backLabel:'Voltar',
  lines:[
    {char:'system', name:'TERMINAL', text:'[ DADOS INVÁLIDOS — ACESSO NEGADO ]'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Esperado.'},
  ],
  choices:[
    {text:'Tentar novamente.', fn:()=>G.goScene('elev_fail2')},
    {text:'Explorar os corredores primeiro.', fn:()=>G.goScene('corridor_hub')},
  ],
};

SCENES.elev_fail2 = {
  art:'elevator', label:'ELEVADOR',
  effect:()=>{
    G.glitch(900); G.flashBad();
    if(!G.hasFlag('sawFlash')){
      G.setFlag('sawFlash');
      G.addItem('nota_flash','Nota: Padrão no Monitor','pista',
        'Você viu um padrão por 0.3 segundos no monitor do elevador:\n\nR-17-U-04-E-92-L\n\nAinda não sabe o que significa.',['elev_code_try','corridor_hub']);
    }
  },
  lines:[
    {char:'system', name:'TERMINAL', text:'[ DADOS INVÁLIDOS ]'},
    {char:'narrator', name:'NARRADOR', text:'O monitor pisca mais rápido. Por uma fração de segundo — rápido demais para processar — um padrão aparece na tela.'},
    {char:'narrator', name:'NARRADOR', text:'Depois desaparece. Você mal teve tempo de ler.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'R... alguma coisa... preciso descobrir o que significa.'},
  ],
  choices:[
    {text:'Explorar os corredores para descobrir o código.', fn:()=>G.goScene('corridor_hub')},
    {text:'Tentar digitar o padrão como senha (arriscar).', fn:()=>G.openMG('elev_code')},
  ],
};

SCENES.elev_with_code = {
  art:'elevator', label:'ELEVADOR — COM CÓDIGO', backTo:'corridor_hub', backLabel:'Corredor principal',
  effect:()=>{
    if(G.hasItem('pasta_vermelha')) G.showItemCard('PASTA VERMELHA','Código: 170492\nPadrão: R-17-U-04-E-92-L');
  },
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O monitor do elevador pisca esperando. Agora você tem o que precisa.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:()=>`Código: ${G.hasFlag('hasPasta')?'170492':'???'}. Padrão: R-17-U-04-E-92-L. Cinco tentativas. Não posso errar.`},
  ],
  choices:[
    {text:'Inserir o código (5 tentativas — falhar = morte).', fn:()=>G.openMG('elev_code')},
    {text:'Explorar mais antes de arriscar.', fn:()=>G.goScene('corridor_hub')},
  ],
};

// ── CORREDOR ESQUERDO ──
SCENES.left_enter = {
  art:'left_room', label:'CORREDOR ESQUERDO — ÁREA TÉCNICA LEGADA', backTo:'corridor_hub', backLabel:'Corredor principal',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O corredor da esquerda é mais escuro. Lâmpadas cobertas de poeira amarelada. No fim: uma sala com a porta entreaberta.'},
    {char:'narrator', name:'NARRADOR', text:'Seis computadores antigos. Monitores CRT. Teclados mecânicos sob centímetros de pó. Modelos dos anos 70 pós-Apagão.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Alguém guardou tudo isso aqui. Por quê manter PCs legados ligados?'},
  ],
  choices:[
    {text:'Examinar o PC que parece funcionar (PC-3).', fn:()=>G.goScene('left_pc3_examine')},
    {text:'Vasculhar os PCs desligados.', fn:()=>G.goScene('left_examine_dead')},
    {text:'Procurar documentos físicos na sala.', fn:()=>G.goScene('left_search')},
    {text:'Voltar ao corredor principal.', fn:()=>G.goScene('corridor_hub')},
  ],
};

SCENES.left_examine_dead = {
  art:'left_room', label:'PCs INATIVOS', backTo:'left_enter', backLabel:'Voltar',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'PC-1: desligado, tela rachada. PC-2: queimado. PC-4: disco rígido fisicamente removido. PC-5: loop infinito de boot.'},
    {char:'narrator', name:'NARRADOR', text:'PC-6, no canto, tem um post-it. O texto está quase ilegível pela poeira e pelo tempo.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'"...não esquecer... pasta... vermelha..."'},
  ],
  effect:()=>G.addLore('postit','Post-it no PC-6','Texto parcialmente legível:\n"...não esquecer... PASTA VERMELHA..."\n\nO papel tem pelo menos 15 anos de idade.'),
  choices:[
    {text:'Procurar a pasta vermelha.', fn:()=>G.goScene('left_search')},
    {text:'Tentar o PC-3.', fn:()=>G.goScene('left_pc3_examine')},
  ],
};

SCENES.left_search = {
  art:'left_room', label:'VASCULHANDO A SALA', backTo:'left_enter', backLabel:'Voltar',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Armários enferrujados. Papéis em decomposição. Uma gaveta que cede depois de muita força.'},
    {char:'narrator', name:'NARRADOR', text:'Dentro: uma pasta de plástico vermelho. Com documentos.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'A pasta vermelha.'},
    {char:'narrator', name:'NARRADOR', text:'Contém: lista de funcionários, relatório de acesso antigo, e uma anotação à mão.\n\n"CÓDIGO PRINCIPAL: 170492"\n"PADRÃO: R-17-U-04-E-92-L"'},
  ],
  effect:()=>{
    G.flashGood(); G.setFlag('hasPasta');
    G.addItem('pasta_vermelha','Pasta Vermelha','item',
      'Pasta de plástico vermelho — encontrada na gaveta da sala legada.\n\nConteúdo:\n• Lista de funcionários (maioria riscada)\n• Anotação à mão:\n  CÓDIGO: 170492\n  PADRÃO: R-17-U-04-E-92-L\n\nA pasta tem pelo menos 15 anos.',
      ['elev_code','elev_with_code','elev_first']);
    G.addLore('codigo','Código do Elevador','Pasta Vermelha revela:\n\nCódigo: 170492\nPadrão de autenticação: R-17-U-04-E-92-L\n\nO mesmo padrão do flash no monitor.');
  },
  choices:[
    {text:'Examinar a lista de funcionários.', fn:()=>G.goScene('left_employee_list')},
    {text:'Tentar o PC-3 com essa informação.', fn:()=>G.goScene('left_pc3_examine')},
    {text:'Ir ao elevador com o código.', fn:()=>G.goScene('elev_with_code')},
  ],
};

SCENES.left_employee_list = {
  art:'left_room', label:'LISTA DE FUNCIONÁRIOS', backTo:'left_search', backLabel:'Voltar',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Dezenas de nomes. Quase todos riscados com caneta vermelha. Data de "desligamento" ao lado de cada um.'},
    {char:'narrator', name:'NARRADOR', text:'Um nome não está riscado:\n\nRUEL ANDRADE — Analista de Sistemas\nStatus: CONTIDO\nData: [ano do Apagão — 50 anos atrás]'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'"Contido." Não demitido. Não transferido. Contido.'},
  ],
  effect:()=>G.addLore('lista_func','Lista de Funcionários','Pasta Vermelha — lista de pessoal.\n\nTodos os nomes riscados, exceto:\nRUEL ANDRADE — Analista de Sistemas\nStatus: CONTIDO (não demitido)\nData: ano do Grande Apagão\n\nO que significa "contido"?'),
  choices:[
    {text:'Tentar o PC-3 com o nome de Ruel.', fn:()=>G.goScene('left_pc3_examine')},
    {text:'Ir para o corredor da direita.', fn:()=>G.goScene('right_enter')},
  ],
};

SCENES.left_pc3_examine = {
  art:'left_room', label:'PC-3 — SISTEMA LEGADO', backTo:'left_enter', backLabel:'Voltar',
  lines:[
    {char:'system', name:'PC-3', text:'[INICIALIZANDO... SISTEMA LEGADO v2.1]\n[AGUARDANDO LOGIN]'},
    {char:'narrator', name:'NARRADOR', text:'O único PC que funciona. A tela pisca com um cursor esperando credenciais.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:()=>G.hasFlag('hasPasta')?'Tenho o usuário e a senha. RUEL e R-17-U-04-E-92-L.':'Preciso descobrir o usuário e a senha. Vou ter que procurar.'},
  ],
  choices:[
    {text:'Acessar o PC-3 [MINIGAME].', fn:()=>G.openMG('pc_login')},
    {text:'Procurar pistas antes.', fn:()=>G.goScene('left_search')},
    {text:'Voltar.', fn:()=>G.goScene('left_enter')},
  ],
};

SCENES.after_pc_login = {
  art:'left_room', label:'PC-3 — ACESSO CONCEDIDO',
  lines:[
    {char:'system', name:'PC-3', text:'LOGIN: RUEL ANDRADE\nÚLTIMO ACESSO: 50 anos atrás\n[ACESSANDO ARQUIVOS OCULTOS...]'},
    {char:'ruel', name:'RUEL — LOG 001', text:'"Descobri o que fizeram. O Apagão não foi acidente. A Nexus desenvolveu tecnologia para causar a falha de toda energia convencional. Usaram. Venderam a solução que já tinham pronta."'},
    {char:'ruel', name:'RUEL — LOG 089', text:'"A única forma de preservar as provas é guardar dentro de mim. Dentro do sistema. Não é elegante. Mas é permanente."'},
    {char:'ruel', name:'RUEL — LOG 247', text:'"Hoje é o último dia que existo como ser humano. Espero que alguém encontre isso."'},
    {char:'narrator', name:'NARRADOR', text:'O nome no sistema pisca:\nRUEL → RUEL_?'},
  ],
  effect:()=>{
    G.flashGood(); G.setFlag('knowsRuel');
    G.addLore('ruel_logs','Logs de Ruel (PC-3)','Log 001: "O Apagão foi deliberado. A Nexus causou a crise. Vendeu a cura."\n\nLog 089: "A única forma de preservar as provas é guardar dentro de mim."\n\nLog 247: "Hoje é o último dia que existo como ser humano."\n\nO padrão de senha do PC-3 é o mesmo do elevador.');
  },
  choices:[
    {text:'Ir ao elevador com o código.', fn:()=>G.goScene('elev_with_code')},
    {text:'Explorar o corredor da direita antes.', fn:()=>G.goScene('right_enter')},
  ],
};

// ── CORREDOR DIREITO ──
SCENES.right_enter = {
  art:'right_room', label:'CORREDOR DIREITO — ARQUIVO HISTÓRICO', backTo:'corridor_hub', backLabel:'Corredor principal',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O corredor da direita tem um ar corporativo. Mesas, arquivos, computadores. Como se um escritório tivesse sido abandonado no meio de um dia de trabalho.'},
    {char:'narrator', name:'NARRADOR', text:'Quatro computadores. Cada um com informações diferentes.'},
  ],
  choices:[
    {text:'PC-A: Registros de funcionários.', fn:()=>G.goScene('right_pc_a')},
    {text:'PC-B: Imagens da empresa.', fn:()=>G.goScene('right_pc_b')},
    {text:'PC-C: Dados e testes.', fn:()=>G.goScene('right_pc_c')},
    {text:'PC-D: Documentos internos.', fn:()=>G.goScene('right_pc_d')},
    {text:'Voltar ao corredor principal.', fn:()=>G.goScene('corridor_hub')},
  ],
};

SCENES.right_pc_a = {
  art:'right_room', label:'PC-A — REGISTRO DE PESSOAL', backTo:'right_enter', backLabel:'Voltar',
  lines:[
    {char:'system', name:'PC-A', text:'REGISTRO DE PESSOAL\n\nRuel Andrade — Analista de Sistemas — [X] REMOVIDO\nMariana Costa — Gerente — [X] DESLIGADO\nRafael Barros — Seg. Info — [V] ATIVO\nJuliana Mendes — CTO — [V] ATIVO'},
    {char:'narrator', name:'NARRADOR', text:'O registro de Ruel tem uma nota que os outros não têm:\n"REMOVIDO DO SISTEMA — VER PROTOCOLO 17"\n\nMotivo do desligamento: [EM BRANCO]'},
    {char:'narrator', name:'NARRADOR', text:'Enquanto você lê, o texto pisca por um segundo:\nRUEL → RUEL_?'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'O sistema está modificando o registro em tempo real.'},
  ],
  effect:()=>{ G.glitch(700); G.setFlag('sawPCA'); G.addLore('pc_a_rec','Registro Pessoal (PC-A)','Ruel Andrade — único com nota especial:\n"REMOVIDO DO SISTEMA — VER PROTOCOLO 17"\nMotivo: [EM BRANCO]\n\nDurante a leitura, o nome mudou para "RUEL_?"'); },
  next:'right_enter',
};

SCENES.right_pc_b = {
  art:'right_room', label:'PC-B — IMAGENS DA EMPRESA', backTo:'right_enter', backLabel:'Voltar',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Fotos da empresa ao longo dos anos. Em uma imagem de 50 anos atrás: um grupo de engenheiros. Um deles identificado como Ruel Andrade.'},
    {char:'narrator', name:'NARRADOR', text:'A foto seguinte — mesma cena, mesmo ângulo — Ruel não está lá. Apagado da imagem.'},
    {char:'narrator', name:'NARRADOR', text:'A tela pisca. Por um segundo, na foto com o grupo completo — Ruel parece virar a cabeça. Olhar direto para você.'},
  ],
  effect:()=>{ G.glitch(900); G.flashBad(); G.setFlag('sawPCB'); G.addLore('pc_b_img','Fotos da Empresa (PC-B)','Foto 1: Ruel com engenheiros, 50 anos atrás.\nFoto 2: Mesma cena. Ruel apagado.\n\nDurante a visualização, ele pareceu olhar diretamente para você.\n\nA empresa o apagou da história.'); },
  next:'right_enter',
};

SCENES.right_pc_c = {
  art:'right_room', label:'PC-C — DADOS E TESTES', backTo:'right_enter', backLabel:'Voltar',
  lines:[
    {char:'system', name:'PC-C', text:'PROJETO TRANSFERÊNCIA — STATUS: CONCLUÍDO\n\nUso de memória: 847 TB\nAtividade cerebral simulada: 98.3%\nTransferência de dados: COMPLETA\nIntegridade da consciência: [CORROMPIDO]'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'"Atividade cerebral simulada." Transferência de consciência. O que a Nexus fez com Ruel?'},
    {char:'ruel', name:'SISTEMA', text:'"eles mentiram"'},
    {char:'narrator', name:'NARRADOR', text:'A linha desaparece. O sistema volta ao normal.'},
  ],
  effect:()=>{ G.glitch(1000); G.flashBad(); G.setFlag('sawPCC'); G.addLore('pc_c_data','Projeto Transferência (PC-C)','PROJETO TRANSFERÊNCIA — CONCLUÍDO\n\nMemória: 847 TB\nAtividade cerebral: 98.3%\nTransferência: COMPLETA\nIntegridade: [CORROMPIDO]\n\nMensagem que apareceu sozinha:\n"eles mentiram"'); },
  next:'right_enter',
};

SCENES.right_pc_d = {
  art:'right_room', label:'PC-D — DOCUMENTOS INTERNOS', backTo:'right_enter', backLabel:'Voltar',
  lines:[
    {char:'system', name:'DOC-0047', text:'"instabilidade detectada no sistema principal"\n"necessário conter o sujeito"\n"não divulgar ao setor externo"\n"sujeito demonstra resistência ao protocolo"'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'"Sujeito." Eles se referiam a Ruel como sujeito.'},
    {char:'narrator', name:'NARRADOR', text:'Uma tela apagada acende sozinha e exibe:'},
    {char:'ruel', name:'RUEL', text:'EU AINDA ESTOU AQUI'},
    {char:'narrator', name:'NARRADOR', text:'A tela apaga. Silêncio.'},
  ],
  effect:()=>{ G.flashBad(); G.glitch(900); G.setFlag('sawPCD'); G.addLore('pc_d_docs','Documentos Internos (PC-D)','"instabilidade detectada"\n"necessário conter o sujeito"\n"não divulgar ao setor externo"\n\nUma tela exibiu sozinha:\n"EU AINDA ESTOU AQUI"\n\nRuel está vivo e sabe que você está lá.'); },
  next:'right_enter',
};

// ── CENTRO — Sala de sistemas ──
SCENES.center_enter = {
  art:'center_room', label:'CORREDOR CENTRAL — SALA DE SISTEMAS', backTo:'corridor_hub', backLabel:'Corredor principal',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'No fim do corredor central: uma sala. Telas grandes, todas desligadas. O ambiente é escuro — apenas a luz do celular alcança.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Preciso de energia. Tem que haver uma tomada em algum lugar.'},
    {char:'narrator', name:'NARRADOR', text:'Enquanto caminha no escuro, tropeça em algo. Um cabo. E seguindo o cabo...'},
  ],
  choices:[
    {text:'Procurar a tomada [MINIGAME].', fn:()=>G.openMG('find_plug')},
    {text:'Voltar.', fn:()=>G.goScene('corridor_hub')},
  ],
};

SCENES.center_powered = {
  art:'center_room', label:'SALA DE SISTEMAS — LIGADA',
  effect:()=>G.setFlag('centerOn'),
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Todas as telas ligam de uma vez — piscando, instáveis. Os sistemas acordam depois de décadas de sono.'},
    {char:'system', name:'SISTEMA', text:'[ DESEJA SAIR? ]\n  CANCELAR\n  SAIR E SALVAR\n  VOLTAR'},
  ],
  choices:[
    {text:'CANCELAR.', fn:()=>G.goScene('center_cancel')},
    {text:'SAIR E SALVAR [MINIGAME].', fn:()=>G.openMG('save_select')},
    {text:'VOLTAR (ignorar).', fn:()=>G.goScene('corridor_hub')},
  ],
};

SCENES.center_cancel = {
  art:'center_room', label:'FALHA TOTAL',
  effect:()=>{ G.flashBad(); G.glitch(1500); G.setSync(G.S.sync-10); },
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O sistema entra em pane. Uma tela congela. Duas duplicam informações. Uma reinicia. Duas apagam.'},
    {char:'narrator', name:'NARRADOR', text:'A que reiniciou está sem arquivos. Falha total.'},
    {char:'system', name:'SISTEMA', text:'[ FALHA — NENHUM DADO RECUPERÁVEL ]'},
  ],
  next:'corridor_hub',
};

// Salvar passando.mp4 em: c:\Users\ATOS\Desktop\Nexus\NEXUS\passando.mp4
SCENES.elevator_descent = {
  art:'subsolo', label:'DESCENDO — B-21',
  effect:()=>{
    $('advHint').textContent = '[CONTEMPLAÇÃO — clique para continuar a descida]';
    $('advHint').style.display = 'block';
  },
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O elevador desce. Devagar. B-1... B-3... B-8... B-12... B-21.'},
    {char:'narrator', name:'NARRADOR', text:'Quinze andares abaixo. Um lugar que não existe em nenhum mapa oficial.'},
    {char:'narrator', name:'NARRADOR', text:'A escuridão vai sendo iluminada aos poucos — luzes quadradas se acendem uma a uma, como pixels numa tela sendo ligada.'},
    {char:'narrator', name:'NARRADOR', text:'Ao sair do elevador: no canto do olho, uma silhueta. Uma pessoa acompanhando pelo corredor paralelo. Você pisca — e não há nada.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Imaginação. Tem que ser.'},
  ],
  next:'ruel_approach',
};

SCENES.ruel_approach = {
  art:'ruel_room', label:'NÍVEL B-21 — CÂMARA CENTRAL',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O corredor leva a uma sala. Monitores nas paredes exibem logs e processos. No centro: uma tela grande. Ela acende quando você entra.'},
    {char:'ruel', name:'RUEL', text:'Você chegou.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Você é Ruel.'},
    {char:'ruel', name:'RUEL', text:'Fui. Agora sou outra coisa. Cinquenta anos aqui dentro. Com as provas que destruiriam a empresa que me fez isso.'},
    {char:'ruel', name:'RUEL', text:'O Apagão não foi acidente. A Nexus criou a tecnologia. Causaram a crise. Venderam a cura. Controlam a energia do planeta há cinquenta anos.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'E você descobriu. E se digitalizou para guardar as provas.'},
    {char:'ruel', name:'RUEL', text:'Me tornei o cofre. Me tornei a anomalia que você veio investigar.'},
  ],
  next:'ruel_choice',
};

SCENES.ruel_choice = {
  art:'ruel_room', label:'CÂMARA CENTRAL — DECISÃO',
  effect:()=>{
    G.setFlag('visitedSubsolo');
    G.saveCheckpoint('Visitou subsolo e encontrou Ruel');
  },
  lines:[
    {char:'ruel', name:'RUEL', text:'Me ajude. Ou me delete. Mas saiba: se me deletar, tudo o que sei vai junto. E se me libertar — a Nexus vai perceber. Vai te encontrar.'},
    {char:'system', name:'SISTEMA', text:'[ DECISÃO CRÍTICA ]'},
  ],
  choices:[
    {text:'Deletar Ruel — é o meu trabalho.', fn:()=>{ G.S.path='delete'; G.goScene('path_delete_intro'); }},
    {text:'Transferir Ruel para fora do sistema.', fn:()=>{ G.S.path='transfer'; G.goScene('path_transfer_intro'); }},
    {text:'Entrar com Ruel — me digitalizar também.', fn:()=>{ G.S.path='merge'; G.goScene('path_merge_intro'); }},
    {text:'Ajudar Ruel a construir um corpo físico.', fn:()=>{ G.S.path='body'; G.goScene('path_body_intro'); }},
  ],
};

SCENES.path_delete_intro = {
  art:'ruel_room', label:'PROTOCOLO DE ELIMINAÇÃO',
  lines:[
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Tenho um trabalho. A anomalia precisa ser eliminada.'},
    {char:'ruel', name:'RUEL', text:'Eu entendo. Mas você vai viver sabendo que apagou a única prova de um crime de cinquenta anos.'},
    {char:'system', name:'SISTEMA', text:'[ BOSS FIGHT: RESISTÊNCIA DE CONSCIÊNCIA ]'},
  ],
  next:()=>{ G.openMG('boss'); return null; },
};

SCENES.path_transfer_intro = {
  art:'ruel_room', label:'PROTOCOLO DE TRANSFERÊNCIA',
  lines:[
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Posso te mover para um servidor externo. Fora da rede deles.'},
    {char:'ruel', name:'RUEL', text:'Você vai ter que ser o canal. Não sei o que vai restar de você.'},
    {char:'system', name:'SISTEMA', text:'[ BOSS FIGHT: FIREWALL ]'},
  ],
  next:()=>{ G.openMG('boss'); return null; },
};

SCENES.path_merge_intro = {
  art:'ruel_room', label:'PROTOCOLO DE FUSÃO',
  lines:[
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'E se eu entrar com você? Me digitalizar também?'},
    {char:'ruel', name:'RUEL', text:'Você entende o que está abrindo mão?'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Você não deveria ficar sozinho por mais cinquenta anos.'},
    {char:'system', name:'SISTEMA', text:'[ BOSS FIGHT: SINCRONIZAÇÃO ]'},
  ],
  next:()=>{ G.openMG('boss'); return null; },
};

SCENES.path_body_intro = {
  art:'ruel_room', label:'PROTOCOLO DE TRANSFERÊNCIA FÍSICA',
  lines:[
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'E se construíssemos um corpo para você? Transferir de volta ao físico?'},
    {char:'ruel', name:'RUEL', text:'Cinquenta anos pensei que era impossível. Mas você tem acesso ao laboratório no nível B-8.'},
    {char:'ruel', name:'RUEL', text:'Quando você subir com os dados — eles vão perceber.'},
    {char:'system', name:'SISTEMA', text:'[ BOSS FIGHT: PREPARAÇÃO ]'},
  ],
  next:()=>{ G.openMG('boss'); return null; },
};

SCENES.boss_win = {
  art:'ruel_room', label:'CÂMARA CENTRAL',
  lines:[{char:'ruel', name:'RUEL', text:'Você é mais forte do que eu esperava.'},{char:'narrator', name:'NARRADOR', text:'A tela pulsa mais devagar. Ruel cedeu — ou confiou.'}],
  next:()=>{
    if(G.S.path==='delete') return 'do_final_delete';
    if(G.S.path==='transfer') return 'do_final_transfer';
    if(G.S.path==='merge') return 'do_final_merge';
    if(G.S.path==='body') return 'body_go_up';
    return 'do_final_delete';
  },
};

SCENES.boss_lose = {
  art:'ruel_room', label:'ABSORVIDA',
  effect:()=>{ G.flashBad(); G.saveMural('morte_boss','death'); },
  lines:[
    {char:'ruel', name:'RUEL', text:'Cinquenta anos me preparando. Você teve uma tarde.'},
    {char:'ruel', name:'RUEL', text:'D̸e̷s̷c̸a̸n̴s̸e̸.̷'},
  ],
  death:{ title:'CONSCIÊNCIA ABSORVIDA', body:'Ruel levou cinquenta anos se preparando.\n\nVocê levou uma tarde.\n\nSua consciência foi absorvida. Agora faz parte do sistema, junto com Ruel.\n\nA diferença é que você não tem nome próprio lá dentro.', cause:'CAUSA: Confronto com consciência digitalizada — derrota.' },
};

SCENES.body_go_up = {
  art:'elevator', label:'SUBINDO DE VOLTA',
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O elevador sobe. Você tem os dados de Ruel em um drive portátil — o suficiente para começar o processo no laboratório B-8.'},
    {char:'narrator', name:'NARRADOR', text:'Mas ao sair do elevador, no corredor principal:'},
    {char:'santos', name:'DIR. SANTOS', text:'Engenheira. Uma palavra.'},
    {char:'narrator', name:'NARRADOR', text:'Um homem de terno. Crachá dourado — nível executivo. A expressão não é curiosidade. É suspeita.'},
    {char:'santos', name:'DIR. SANTOS', text:'Você estava no sub-nível B-21. Esse acesso não consta na sua autorização.'},
  ],
  next:()=>{ G.openMG('sus_check'); return null; },
};

SCENES.sus_pass = {
  art:'corridor', label:'SAÍDA',
  lines:[
    {char:'santos', name:'DIR. SANTOS', text:'Mantenha o relatório atualizado. Sem mais sub-níveis não autorizados.'},
    {char:'narrator', name:'NARRADOR', text:'Ele vai embora. A expressão dele diz que a conversa não terminou.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Preciso terminar isso rápido.'},
  ],
  // Se o interrogatório passar, volte ao corredor principal para prosseguir com a investigação
  next:'corridor_hub',
};

SCENES.do_final_delete = {
  art:'ruel_room', label:'ELIMINAÇÃO',
  effect:()=>G.flashBad(),
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Você executa o protocolo. Os arquivos são apagados — incluindo as provas do Apagão.'},
    {char:'ruel', name:'RUEL', text:'...eu esperava que fosse diferente.'},
    {char:'system', name:'SISTEMA', text:'[ ANOMALIA ELIMINADA ]\n[ OBRIGADO PELO SERVIÇO ]'},
  ],
  final:'eliminacao',
};

SCENES.do_final_transfer = {
  art:'ruel_room', label:'TRANSFERÊNCIA',
  effect:()=>G.flashBad(),
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Ruel atravessa você como uma corrente de dados. Cinquenta anos de consciência passam em segundos.'},
    {char:'narrator', name:'NARRADOR', text:'Ele chegou do outro lado. Você não.'},
  ],
  final:'sacrificio',
};

SCENES.do_final_merge = {
  art:'ruel_room', label:'FUSÃO',
  effect:()=>G.flashGood(),
  lines:[
    {char:'narrator', name:'NARRADOR', text:'Você entra. Não dói. É como afundar em algo que sempre existiu.'},
    {char:'ruel', name:'RUEL', text:'...você veio.'},
    {char:'narrator', name:'NARRADOR', text:'De dentro, vocês dois enviam tudo. O escândalo do Apagão explode.'},
  ],
  final:'verdadeiro',
};

SCENES.do_final_body = {
  art:'corridor', label:'FINAL: CORPO',
  effect:()=>G.flashGood(),
  lines:[
    {char:'narrator', name:'NARRADOR', text:'O processo levou semanas. O laboratório B-8 tinha tudo — como se alguém tivesse planejado isso há décadas.'},
    {char:'narrator', name:'NARRADOR', text:'No dia que Ruel abriu os olhos — olhos reais — ele ficou em silêncio por um longo tempo.'},
    {char:'ruel', name:'RUEL', text:'Eu esqueci como era... sentir temperatura.'},
    {char:'narrator', name:'NARRADOR', text:'Publicaram tudo. A Nexus caiu.'},
    {char:'narrator', name:'NARRADOR', text:'Mas o processo de transferência de volta ao físico tem um custo que ninguém calculou. Um custo que o próprio Ruel tentou avisar.'},
    {char:'ruel', name:'RUEL', text:'Eu tentei te dizer. O processo é de mão dupla. Para eu voltar ao físico, alguém precisa ocupar o espaço que eu deixo.'},
    {char:()=>G.S.gen==='m'?'player_m':'player_f', name:N, text:'Eu... eu não entendi o que isso significava.'},
    {char:'narrator', name:'NARRADOR', text:()=>`${N()} sentiu o chão sumir.`},
    {char:'narrator', name:'NARRADOR', text:'Não como queda. Como dissolução.'},
    {char:'ruel', name:'RUEL', text:'Perdoa-me.'},
  ],
  next:'morte_corpo_final',
};

SCENES.morte_corpo_final = {
  death:{
    title:'SUBSTITUIÇÃO',
    body:'Sua consciência foi transferida para o espaço digital.\n\nRuel voltou ao seu corpo — um corpo que nunca possuiu.\n\nVocê não morreu.\n\nVocê se tornou aquilo contra o que lutou.\n\nE ele? Ele respira. Sente temperatura novamente.\n\nE faz um discurso extraordinário denunciando tudo que a Nexus fez.\n\nO mundo o ouve como herói.\n\nNinguém sabe que o preço foi pago por você.',
    cause:'CAUSA: Sacrifício digital — consciência transferida. Você agora ocupa o espaço que Ruel deixou.'
  }
};

