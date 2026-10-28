// ============================================
// MORRO DA LIVE - Jogo Mobile Three.js
// ============================================

let scene, camera, renderer, clock;
let player, playerTeam;
let npcs = [];
let buildings = [];
let flags = [];
let stageScreen;
let isDancing = false;
let isWaving = false;
let moveDir = { x: 0, z: 0 };
let keys = {};
let selectedTeam = null;
let scorePalmeiras = 638;
let scoreFlamengo = 2235;
let playerCount = 169;

// Joystick
let joystickActive = false;
let joystickOrigin = { x: 0, y: 0 };
let joystickCurrent = { x: 0, y: 0 };

// ============== INIT ==============
function init() {
  setupStartScreen();
  clock = new THREE.Clock();
}

function setupStartScreen() {
  const grid = document.getElementById('teams-grid');
  TEAMS.forEach(team => {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.dataset.id = team.id;
    card.innerHTML = `
      <div class="shield" style="background: linear-gradient(135deg, ${team.primary}, ${team.secondary});">
        ${team.initials}
      </div>
      <div class="name">${team.name}</div>
    `;
    card.addEventListener('click', () => selectTeam(team, card));
    grid.appendChild(card);
  });

  document.getElementById('btn-start').addEventListener('click', startGame);
}

function selectTeam(team, cardEl) {
  selectedTeam = team;
  document.querySelectorAll('.team-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  document.getElementById('btn-start').disabled = false;
}

function startGame() {
  if (!selectedTeam) return;
  playerTeam = selectedTeam;

  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('controls').classList.remove('hidden');
  document.getElementById('chat').classList.remove('hidden');

  // Atualiza scoreboard com time escolhido
  if (playerTeam.id === 'palmeiras') {
    document.getElementById('score-left').style.opacity = '1';
  } else if (playerTeam.id === 'flamengo') {
    document.getElementById('score-right').style.opacity = '1';
  }

  initThree();
  createWorld();
  createPlayer();
  createNPCs(45);
  createStage();
  setupControls();
  startChatLoop();
  startScoreLoop();
  animate();
}

// ============== THREE.JS SETUP ==============
function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a2a3a);
  scene.fog = new THREE.Fog(0x1a2a3a, 40, 120);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 8, 18);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  // Luzes
  const ambient = new THREE.AmbientLight(0x404060, 0.6);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff0dd, 0.9);
  sun.position.set(20, 40, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 1024;
  sun.shadow.mapSize.height = 1024;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 100;
  sun.shadow.camera.left = -40;
  sun.shadow.camera.right = 40;
  sun.shadow.camera.top = 40;
  sun.shadow.camera.bottom = -40;
  scene.add(sun);

  // Luzes de festa (neon)
  const neon1 = new THREE.PointLight(0xff00aa, 1.5, 30);
  neon1.position.set(0, 6, -15);
  scene.add(neon1);

  const neon2 = new THREE.PointLight(0x00ff88, 1.2, 25);
  neon2.position.set(-12, 5, 5);
  scene.add(neon2);

  const neon3 = new THREE.PointLight(0x00aaff, 1.2, 25);
  neon3.position.set(12, 5, 5);
  scene.add(neon3);

  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============== MUNDO (FAVELA) ==============
function createWorld() {
  // Chão
  const groundGeo = new THREE.PlaneGeometry(120, 120);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Rua principal
  const roadGeo = new THREE.PlaneGeometry(14, 80);
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.01;
  road.position.z = -10;
  scene.add(road);

  // Faixas da rua
  for (let i = -30; i < 30; i += 6) {
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(0.3, 3),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.02, i);
    scene.add(line);
  }

  // Casas coloridas (favela)
  const colors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf1c40f, 0x9b59b6, 0xe67e22, 0x1abc9c, 0xff6b6b, 0x4ecdc4];
  for (let side = -1; side <= 1; side += 2) {
    for (let z = -35; z < 30; z += 5 + Math.random() * 3) {
      const h = 3 + Math.random() * 6;
      const w = 3 + Math.random() * 2;
      const d = 3 + Math.random() * 2;
      const color = colors[Math.floor(Math.random() * colors.length)];

      const house = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
      );
      house.position.set(side * (10 + Math.random() * 8), h / 2, z);
      house.castShadow = true;
      house.receiveShadow = true;
      scene.add(house);
      buildings.push(house);

      // Telhado
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.3, 0.4, d + 0.3),
        new THREE.MeshStandardMaterial({ color: 0x555555 })
      );
      roof.position.set(house.position.x, h + 0.2, house.position.z);
      scene.add(roof);

      // Janelas
      if (Math.random() > 0.4) {
        const win = new THREE.Mesh(
          new THREE.PlaneGeometry(0.8, 1),
          new THREE.MeshBasicMaterial({ color: 0xffee88 })
        );
        win.position.set(house.position.x + side * (w / 2 + 0.01), 2 + Math.random() * (h - 3), house.position.z);
        win.rotation.y = side * Math.PI / 2;
        scene.add(win);
      }
    }
  }

  // Postes de luz
  for (let z = -30; z < 25; z += 12) {
    [-6, 6].forEach(x => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 5, 6),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      pole.position.set(x, 2.5, z);
      scene.add(pole);

      const light = new THREE.PointLight(0xffaa66, 0.6, 12);
      light.position.set(x, 5, z);
      scene.add(light);
    });
  }
}

// ============== STAGE ==============
function createStage() {
  // Palco
  const stageBase = new THREE.Mesh(
    new THREE.BoxGeometry(18, 1.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  stageBase.position.set(0, 0.6, -22);
  stageBase.castShadow = true;
  scene.add(stageBase);

  // Tela grande
  const screenGeo = new THREE.PlaneGeometry(14, 7);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  stageScreen = new THREE.Mesh(screenGeo, screenMat);
  stageScreen.position.set(0, 5.5, -25.5);
  scene.add(stageScreen);

  // Moldura da tela
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(15, 8, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  frame.position.set(0, 5.5, -25.6);
  scene.add(frame);

  // Luzes do palco
  const colors = [0xff00aa, 0x00ff88, 0x00aaff, 0xffcc00];
  for (let i = 0; i < 6; i++) {
    const light = new THREE.PointLight(colors[i % 4], 2, 20);
    light.position.set(-6 + i * 2.5, 9, -20);
    scene.add(light);

    // Spot visual
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 4, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: colors[i % 4], transparent: true, opacity: 0.15, side: THREE.DoubleSide })
    );
    beam.position.set(-6 + i * 2.5, 7, -21);
    beam.rotation.x = Math.PI;
    scene.add(beam);
  }

  // MC no palco (avatar especial)
  const mc = createAvatar(0xffd700, 0x111111, true);
  mc.position.set(0, 1.2, -20);
  mc.scale.set(1.3, 1.3, 1.3);
  scene.add(mc);
  npcs.push({ mesh: mc, dancePhase: 0, isMC: true });
}

// ============== AVATAR BLOCKY ==============
function createAvatar(shirtColor, pantsColor, isMC = false) {
  const group = new THREE.Group();

  // Cabeça
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  );
  head.position.y = 1.85;
  head.castShadow = true;
  group.add(head);

  // Cabelo / boné
  const hair = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.25, 0.75),
    new THREE.MeshStandardMaterial({ color: isMC ? 0x111111 : 0x222222 })
  );
  hair.position.y = 2.2;
  group.add(hair);

  // Corpo
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.9, 0.45),
    new THREE.MeshStandardMaterial({ color: shirtColor })
  );
  body.position.y = 1.2;
  body.castShadow = true;
  group.add(body);

  // Braços
  const armMat = new THREE.MeshStandardMaterial({ color: shirtColor });
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.8, 0.28), armMat);
  leftArm.position.set(-0.55, 1.2, 0);
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.8, 0.28), armMat);
  rightArm.position.set(0.55, 1.2, 0);
  rightArm.castShadow = true;
  group.add(rightArm);

  // Pernas
  const legMat = new THREE.MeshStandardMaterial({ color: pantsColor });
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.8, 0.32), legMat);
  leftLeg.position.set(-0.22, 0.4, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.8, 0.32), legMat);
  rightLeg.position.set(0.22, 0.4, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // Guardar referências para animação
  group.userData = { leftArm, rightArm, leftLeg, rightLeg, head, body };

  return group;
}

function createPlayer() {
  player = createAvatar(playerTeam.primary, 0x222222);
  player.position.set(0, 0, 8);
  scene.add(player);

  // Flag do time do player
  const flag = createFlag(playerTeam);
  flag.position.set(0.6, 1.8, 0);
  player.add(flag);
  flags.push({ mesh: flag, owner: player });
}

function createFlag(team) {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.8, 6),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  pole.position.y = 0.9;
  group.add(pole);

  const cloth = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.6),
    new THREE.MeshStandardMaterial({
      color: team.primary,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    })
  );
  cloth.position.set(0.45, 1.4, 0);
  group.add(cloth);

  group.userData = { cloth };
  return group;
}

// ============== NPCs ==============
function createNPCs(count) {
  for (let i = 0; i < count; i++) {
    const team = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    const npc = createAvatar(team.primary, 0x1a1a1a);
    
    // Posição aleatória na área da festa
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 18;
    npc.position.set(
      Math.cos(angle) * radius * 0.7,
      0,
      Math.sin(angle) * radius - 5
    );
    
    // Rotação inicial
    npc.rotation.y = Math.random() * Math.PI * 2;
    
    scene.add(npc);

    // Flag ocasional
    if (Math.random() > 0.55) {
      const flag = createFlag(team);
      flag.position.set(0.5, 1.7, 0);
      npc.add(flag);
      flags.push({ mesh: flag, owner: npc });
    }

    npcs.push({
      mesh: npc,
      dancePhase: Math.random() * Math.PI * 2,
      danceSpeed: 0.08 + Math.random() * 0.1,
      walkTarget: null,
      team
    });
  }
}

// ============== CONTROLES ==============
function setupControls() {
  // Teclado (desktop)
  window.addEventListener('keydown', e => { keys[e.code] = true; });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  // Joystick
  const zone = document.getElementById('joystick-zone');
  const knob = document.getElementById('joystick-knob');
  const base = document.getElementById('joystick-base');

  const maxDist = 35;

  function handleStart(e) {
    e.preventDefault();
    joystickActive = true;
    const touch = e.touches ? e.touches[0] : e;
    const rect = base.getBoundingClientRect();
    joystickOrigin.x = rect.left + rect.width / 2;
    joystickOrigin.y = rect.top + rect.height / 2;
  }

  function handleMove(e) {
    if (!joystickActive) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    let dx = touch.clientX - joystickOrigin.x;
    let dy = touch.clientY - joystickOrigin.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    moveDir.x = dx / maxDist;
    moveDir.z = dy / maxDist;
  }

  function handleEnd(e) {
    joystickActive = false;
    knob.style.transform = 'translate(0, 0)';
    moveDir.x = 0;
    moveDir.z = 0;
  }

  zone.addEventListener('touchstart', handleStart, { passive: false });
  zone.addEventListener('touchmove', handleMove, { passive: false });
  zone.addEventListener('touchend', handleEnd);
  zone.addEventListener('mousedown', handleStart);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  // Botões de ação
  document.getElementById('btn-dance').addEventListener('click', () => {
    isDancing = !isDancing;
    document.getElementById('btn-dance').style.background = isDancing ? 'rgba(255,0,170,0.5)' : 'rgba(0,0,0,0.65)';
  });

  document.getElementById('btn-flag').addEventListener('click', () => {
    isWaving = !isWaving;
    document.getElementById('btn-flag').style.background = isWaving ? 'rgba(255,204,0,0.5)' : 'rgba(0,0,0,0.65)';
  });

  document.getElementById('btn-emote').addEventListener('click', () => {
    // Emote rápido
    isDancing = true;
    setTimeout(() => { isDancing = false; }, 2000);
  });
}

// ============== UPDATE ==============
function updatePlayer(dt) {
  // Teclado
  let dx = 0, dz = 0;
  if (keys['KeyW'] || keys['ArrowUp']) dz -= 1;
  if (keys['KeyS'] || keys['ArrowDown']) dz += 1;
  if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

  // Joystick tem prioridade
  if (Math.abs(moveDir.x) > 0.1 || Math.abs(moveDir.z) > 0.1) {
    dx = moveDir.x;
    dz = moveDir.z;
  }

  const speed = isDancing ? 2.5 : 6;
  if (dx !== 0 || dz !== 0) {
    const len = Math.sqrt(dx * dx + dz * dz);
    dx /= len;
    dz /= len;
    player.position.x += dx * speed * dt;
    player.position.z += dz * speed * dt;
    player.rotation.y = Math.atan2(dx, dz);

    // Limites
    player.position.x = Math.max(-25, Math.min(25, player.position.x));
    player.position.z = Math.max(-30, Math.min(25, player.position.z));
  }

  // Animação
  animateAvatar(player, dt, isDancing || (dx !== 0 || dz !== 0), isWaving);
}

function animateAvatar(avatar, dt, moving, waving = false) {
  const ud = avatar.userData;
  if (!ud) return;

  const t = clock.elapsedTime;

  if (moving || isDancing) {
    const speed = isDancing ? 12 : 8;
    ud.leftArm.rotation.x = Math.sin(t * speed) * 0.8;
    ud.rightArm.rotation.x = Math.sin(t * speed + Math.PI) * 0.8;
    ud.leftLeg.rotation.x = Math.sin(t * speed + Math.PI) * 0.6;
    ud.rightLeg.rotation.x = Math.sin(t * speed) * 0.6;
    ud.body.position.y = 1.2 + Math.abs(Math.sin(t * speed * 2)) * 0.08;
  } else {
    ud.leftArm.rotation.x *= 0.9;
    ud.rightArm.rotation.x *= 0.9;
    ud.leftLeg.rotation.x *= 0.9;
    ud.rightLeg.rotation.x *= 0.9;
  }

  if (waving) {
    ud.rightArm.rotation.z = -1.2 + Math.sin(t * 10) * 0.4;
  }
}

function updateNPCs(dt) {
  npcs.forEach(npc => {
    npc.dancePhase += npc.danceSpeed;
    const moving = Math.sin(npc.dancePhase) > 0.3;
    animateAvatar(npc.mesh, dt, true, false);

    // Movimento leve aleatório
    if (Math.random() < 0.008) {
      npc.mesh.rotation.y += (Math.random() - 0.5) * 1.5;
    }
    if (Math.random() < 0.02) {
      const dir = new THREE.Vector3(
        Math.sin(npc.mesh.rotation.y),
        0,
        Math.cos(npc.mesh.rotation.y)
      );
      npc.mesh.position.add(dir.multiplyScalar(0.04));
    }

    // Bounce
    npc.mesh.position.y = Math.abs(Math.sin(npc.dancePhase * 2)) * 0.1;
  });
}

function updateFlags(dt) {
  flags.forEach(f => {
    if (f.mesh.userData.cloth) {
      f.mesh.userData.cloth.rotation.y = Math.sin(clock.elapsedTime * 4 + f.mesh.id) * 0.3;
    }
  });
}

function updateCamera(dt) {
  const targetX = player.position.x;
  const targetZ = player.position.z + 14;
  const targetY = 9;

  camera.position.x += (targetX - camera.position.x) * 3 * dt;
  camera.position.z += (targetZ - camera.position.z) * 3 * dt;
  camera.position.y += (targetY - camera.position.y) * 2 * dt;

  camera.lookAt(player.position.x, player.position.y + 1.5, player.position.z);
}

// ============== LOOPS DE ATMOSFERA ==============
function startChatLoop() {
  const container = document.getElementById('chat-messages');
  setInterval(() => {
    const msg = FAKE_CHAT[Math.floor(Math.random() * FAKE_CHAT.length)];
    const el = document.createElement('div');
    el.className = 'chat-msg';
    el.innerHTML = `<span class="user" style="color:${msg.color}">${msg.user}</span> ${msg.text}`;
    container.appendChild(el);
    if (container.children.length > 6) {
      container.removeChild(container.firstChild);
    }
  }, 2200 + Math.random() * 1800);
}

function startScoreLoop() {
  setInterval(() => {
    // Scores sobem aleatoriamente
    if (Math.random() > 0.4) {
      scorePalmeiras += Math.floor(Math.random() * 8) + 1;
      document.getElementById('score-palmeiras').textContent = scorePalmeiras.toLocaleString('pt-BR');
    }
    if (Math.random() > 0.3) {
      scoreFlamengo += Math.floor(Math.random() * 12) + 2;
      document.getElementById('score-flamengo').textContent = scoreFlamengo.toLocaleString('pt-BR');
    }
    // Players count
    playerCount = 150 + Math.floor(Math.random() * 80);
    document.getElementById('players-count').textContent = `${playerCount} no morro`;
  }, 3500);
}

// ============== ANIMATE ==============
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  updatePlayer(dt);
  updateNPCs(dt);
  updateFlags(dt);
  updateCamera(dt);

  // Pulsar luzes do stage
  const t = clock.elapsedTime;
  scene.children.forEach(c => {
    if (c.isPointLight && c.intensity > 1) {
      c.intensity = 1.5 + Math.sin(t * 3 + c.position.x) * 0.8;
    }
  });

  renderer.render(scene, camera);
}

// Start
init();
