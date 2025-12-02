/**
 * SMART NETWORKING QUEST v4.1
 * Updated: Real Questions DB (IPv4, IPv6, Classes, Static/Dynamic)
 */

// --- AUDIO SYSTEM (RELIABLE) ---
const AudioCtrl = {
  ctx: null,
  sounds: {},
  currentBGM: null,
  muted: false,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.preload();
  },

  preload() {
    // URL Aset Audio
    this.load('bgm_menu', 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-chill-medium-version-159456.mp3', true);
    this.load('bgm_game', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=grand-dark-orchestral-1-127976.mp3', true);
    this.load('jump', 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    this.load('coin', 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    this.load('win', 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    this.load('hit', 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3');
  },

  load(name, url, loop = false) {
    const audio = new Audio(url);
    audio.loop = loop;
    audio.volume = name.includes('bgm') ? 0.3 : 0.6;
    this.sounds[name] = audio;
  },

  play(name) {
    if (this.muted || !this.sounds[name]) return;

    if (name.includes('bgm')) {
      if (this.currentBGM && this.currentBGM !== this.sounds[name]) {
        this.currentBGM.pause();
        this.currentBGM.currentTime = 0;
      }
      this.currentBGM = this.sounds[name];
      this.sounds[name].play().catch(e => {});
    } else {
      const clone = this.sounds[name].cloneNode();
      clone.volume = this.sounds[name].volume;
      clone.play().catch(e => {});
    }
  },

  stopBGM() {
    if (this.currentBGM) {
      this.currentBGM.pause();
      this.currentBGM.currentTime = 0;
      this.currentBGM = null;
    }
  }
};

// --- DATA SOAL (50 Soal Real - Level 1 s.d 10) ---
const QUESTIONS_DB = [
  // LEVEL 1: Dasar IP & IPv4
  [
    {q: "Apa kepanjangan dari IP?", a: ["Internet Protocol", "Internal Port"], c: 0},
    {q: "Berapa panjang bit IPv4?", a: ["32 bit", "64 bit"], c: 0},
    {q: "IPv4 terdiri dari berapa oktet?", a: ["4 Oktet", "6 Oktet"], c: 0},
    {q: "Apa fungsi utama IP Address?", a: ["Alamat Identitas Perangkat", "Penguat Sinyal WiFi"], c: 0},
    {q: "Mana format IPv4 yang benar?", a: ["192.168.1.1", "999.999.999.999"], c: 0}
  ],
  // LEVEL 2: IPv6 Dasar
  [
    {q: "Berapa panjang bit IPv6?", a: ["128 bit", "32 bit"], c: 0},
    {q: "Format penulisan IPv6 adalah?", a: ["Hexadecimal", "Desimal"], c: 0},
    {q: "Kenapa dunia beralih ke IPv6?", a: ["IPv4 sudah habis", "IPv6 lebih pendek"], c: 0},
    {q: "Pemisah antar bagian IPv6 adalah?", a: ["Titik dua (:)", "Titik (.)"], c: 0},
    {q: "Contoh awalan IPv6?", a: ["2001:0db8::", "192.168::"], c: 0}
  ],
  // LEVEL 3: IP Statis vs Dinamis (Pengertian)
  [
    {q: "Apa itu IP Statis?", a: ["IP yang dikonfigurasi manual", "IP yang berubah otomatis"], c: 0},
    {q: "Apa itu IP Dinamis?", a: ["IP yang diberikan otomatis", "IP yang disetting manual"], c: 0},
    {q: "Siapa yang memberikan IP Dinamis?", a: ["DHCP Server", "Web Server"], c: 0},
    {q: "IP Statis biasanya dipakai untuk?", a: ["Server & Printer", "HP Tamu"], c: 0},
    {q: "IP Dinamis biasanya dipakai untuk?", a: ["Klien/User WiFi", "Server Database"], c: 0}
  ],
  // LEVEL 4: Manfaat & Konfigurasi
  [
    {q: "Keuntungan IP Dinamis?", a: ["Mudah dikelola otomatis", "IP tidak pernah ganti"], c: 0},
    {q: "Keuntungan IP Statis?", a: ["Alamat tetap/mudah dicari", "Gratis selamanya"], c: 0},
    {q: "Apa kepanjangan DHCP?", a: ["Dynamic Host Config Protocol", "Domain Host Control Protocol"], c: 0},
    {q: "Risiko penggunaan IP Statis?", a: ["Bisa terjadi konflik IP", "Internet jadi lambat"], c: 0},
    {q: "Jika DHCP mati, klien mendapat?", a: ["Tidak dapat IP/APIPA", "IP Statis otomatis"], c: 0}
  ],
  // LEVEL 5: IP Public vs Private
  [
    {q: "Apa fungsi IP Public?", a: ["Akses internet global", "Hanya untuk LAN"], c: 0},
    {q: "Apa fungsi IP Private?", a: ["Jaringan Lokal (LAN)", "Akses Website"], c: 0},
    {q: "Bisakah IP Private akses internet langsung?", a: ["Butuh NAT", "Bisa langsung"], c: 0},
    {q: "IP 192.168.1.1 termasuk jenis?", a: ["IP Private", "IP Public"], c: 0},
    {q: "Siapa yang memberi IP Public?", a: ["ISP (Provider)", "Admin Kantor"], c: 0}
  ],
  // LEVEL 6: Kelas IP Address (A)
  [
    {q: "Range oktet pertama Kelas A?", a: ["1 - 126", "128 - 191"], c: 0},
    {q: "Subnet Mask default Kelas A?", a: ["255.0.0.0", "255.255.255.0"], c: 0},
    {q: "Kelas A digunakan untuk?", a: ["Jaringan skala besar", "Jaringan rumahan"], c: 0},
    {q: "Berapa jumlah host di Kelas A?", a: ["16 Juta lebih", "254 host"], c: 0},
    {q: "IP 10.10.10.1 termasuk kelas?", a: ["Kelas A", "Kelas C"], c: 0}
  ],
  // LEVEL 7: Kelas IP Address (B & C)
  [
    {q: "Range oktet pertama Kelas C?", a: ["192 - 223", "128 - 191"], c: 0},
    {q: "Subnet Mask default Kelas C?", a: ["255.255.255.0", "255.255.0.0"], c: 0},
    {q: "Range oktet pertama Kelas B?", a: ["128 - 191", "1 - 126"], c: 0},
    {q: "Kelas C biasa untuk?", a: ["LAN Kecil/Rumahan", "ISP Besar"], c: 0},
    {q: "IP 172.16.0.1 termasuk kelas?", a: ["Kelas B", "Kelas A"], c: 0}
  ],
  // LEVEL 8: Broadcast & Multicast
  [
    {q: "Apa itu Unicast?", a: ["Komunikasi 1 ke 1", "Komunikasi 1 ke Semua"], c: 0},
    {q: "Apa itu Broadcast?", a: ["Komunikasi 1 ke Semua", "Komunikasi 1 ke Grup"], c: 0},
    {q: "Apa itu Multicast?", a: ["Komunikasi 1 ke Grup", "Komunikasi 1 ke Semua"], c: 0},
    {q: "IP Broadcast biasanya ada di?", a: ["Alamat terakhir subnet", "Alamat pertama subnet"], c: 0},
    {q: "Kelas IP untuk Multicast?", a: ["Kelas D", "Kelas C"], c: 0}
  ],
  // LEVEL 9: Network ID & Host ID
  [
    {q: "Dalam 192.168.1.1/24, Net ID-nya?", a: ["192.168.1.0", "192.168.1.1"], c: 0},
    {q: "Dalam 192.168.1.5/24, Host ID-nya?", a: ["5", "192.168.1"], c: 0},
    {q: "IP 127.0.0.1 disebut IP?", a: ["Loopback", "Broadcast"], c: 0},
    {q: "Fungsi Loopback Address?", a: ["Tes koneksi ke diri sendiri", "Akses internet"], c: 0},
    {q: "Berapa bit Host ID di Kelas C?", a: ["8 bit", "24 bit"], c: 0}
  ],
  // LEVEL 10: Review & Campuran
  [
    {q: "IP APIPA dimulai dengan?", a: ["169.254.x.x", "192.168.x.x"], c: 0},
    {q: "Apa fungsi NAT?", a: ["Ubah IP Private ke Public", "Ubah IP ke MAC"], c: 0},
    {q: "IP 8.8.8.8 adalah contoh?", a: ["IP Public", "IP Private"], c: 0},
    {q: "Subnet 255.255.0.0 artinya?", a: ["Prefix /16", "Prefix /24"], c: 0},
    {q: "Agar IP Private bisa internet, butuh?", a: ["Router & NAT", "Switch & Hub"], c: 0}
  ]
];

// --- GAME STATE ---
let gameState = {
  playerName: "", level: 1, score: 0, coins: 0, lives: 3,
  active: false, paused: false
};

let player = { x: 50, y: 200, w: 40, h: 40, vx: 0, vy: 0, speed: 5, jumpPwr: 13, grav: 0.6, grounded: false, jumps: 0 };
let objs = { plats: [], coins: [], enemies: [], qboxes: [] };
let keys = { l: false, r: false };
let loopId = null;

// --- INIT ---
window.onload = () => {
  const saved = localStorage.getItem('snq_v4_data');
  if (saved) {
    const d = JSON.parse(saved);
    gameState.playerName = d.name;
    gameState.score = d.score;
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('mainWrapper').style.display = 'block';
    showScreen('mainMenu');
    updateUI();
  }
};

function submitName() {
  const val = document.getElementById('playerNameInput').value.trim();
  if (!val) return alert("Nama agen diperlukan!");
  
  gameState.playerName = val;
  saveData();
  
  AudioCtrl.init();
  AudioCtrl.play('bgm_menu');
  
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('mainWrapper').style.display = 'block';
  showScreen('mainMenu');
  updateUI();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  
  if (id === 'mainMenu') AudioCtrl.play('bgm_menu');
  if (id === 'leaderboardScreen') renderLeaderboard();
  if (id === 'rewardsScreen') renderRewards();
}

// --- GAME ENGINE ---
function startGame() {
  AudioCtrl.play('bgm_game');
  gameState.active = true;
  gameState.paused = false;
  gameState.lives = 3;
  gameState.level = 1;
  
  startLevel(gameState.level);
  showScreen('gameplayScreen');
  
  if (loopId) cancelAnimationFrame(loopId);
  gameLoop();
}

function startLevel(lvl) {
  player.x = 50; player.y = 200; player.vx = 0; player.vy = 0;
  generateLevel(lvl);
  updateHUD();
}

function generateLevel(lvl) {
  const layer = document.getElementById('worldLayer');
  layer.innerHTML = '<div id="player" class="player"></div>';
  
  objs = { plats: [], coins: [], enemies: [], qboxes: [] };
  
  // Tanah
  createObj('plat', 0, 0, 10000, 50);
  
  // Procedural
  let cx = 300;
  const len = 1500 + (lvl * 300);
  
  while (cx < len) {
    const cy = 100 + Math.random() * 150;
    const cw = 150;
    createObj('plat', cx, cy, cw, 20);
    createObj('coin', cx + 50, cy + 50);
    
    // Enemy chance
    if (Math.random() < 0.4) createObj('enemy', cx + 20, cy + 20);
    
    // Question chance
    if (objs.qboxes.length < 5 && Math.random() > 0.4) {
      createObj('qbox', cx + 70, cy + 80, objs.qboxes.length);
    }
    
    cx += 220;
  }
  
  // Force 5 questions
  while (objs.qboxes.length < 5) {
    createObj('plat', cx, 100, 150, 20);
    createObj('qbox', cx + 70, 150, objs.qboxes.length);
    cx += 220;
  }
  
  // Finish
  const fin = document.createElement('div');
  fin.innerHTML = '🏁';
  fin.style.cssText = `position:absolute; left:${cx}px; bottom:50px; font-size:50px`;
  fin.id = 'finishLine';
  layer.appendChild(fin);
}

function createObj(type, x, y, w, h) {
  const el = document.createElement('div');
  el.className = type === 'plat' ? 'platform' : type === 'qbox' ? 'question-box' : type;
  el.style.left = x + 'px'; el.style.bottom = y + 'px';
  
  if (type === 'plat') { el.style.width = w+'px'; el.style.height = h+'px'; objs.plats.push({x,y,w,h}); }
  else if (type === 'coin') { document.getElementById('worldLayer').appendChild(el); objs.coins.push({el, x, y, active:true}); return; }
  else if (type === 'enemy') { document.getElementById('worldLayer').appendChild(el); objs.enemies.push({el, x, y, start:x, dir:1}); return; }
  else if (type === 'qbox') { el.innerHTML = '?'; objs.qboxes.push({el, x, y, idx:w, solved:false}); }
  
  document.getElementById('worldLayer').appendChild(el);
}

// --- LOOP ---
function gameLoop() {
  if (!gameState.active) return;
  if (gameState.paused) { loopId = requestAnimationFrame(gameLoop); return; }

  // Physics
  if (keys.r) player.vx = player.speed;
  else if (keys.l) player.vx = -player.speed;
  else player.vx = 0;
  
  player.x += player.vx;
  player.vy -= player.grav;
  player.y += player.vy;
  
  // Collision Plat
  player.grounded = false;
  objs.plats.forEach(p => {
    if (player.x + player.w > p.x && player.x < p.x + p.w) {
      if (player.y <= p.y + p.h && player.y + 20 >= p.y + p.h && player.vy <= 0) {
        player.grounded = true; player.y = p.y + p.h; player.vy = 0; player.jumps = 0;
      }
    }
  });
  
  if (player.y < -100) die();
  
  // Update Entities
  updateGameObjects();
  
  // Render
  const el = document.getElementById('player');
  if (el) {
    el.style.left = player.x + 'px'; el.style.bottom = player.y + 'px';
    el.style.transform = keys.l ? 'scaleX(-1)' : 'scaleX(1)';
    
    const cam = Math.max(0, player.x - 150);
    document.getElementById('worldLayer').style.transform = `translateX(-${cam}px)`;
    document.getElementById('worldBg').style.backgroundPositionX = `-${cam*0.5}px`;
    
    const fin = document.getElementById('finishLine');
    if (fin && player.x >= parseInt(fin.style.left)) levelComplete();
  }
  
  loopId = requestAnimationFrame(gameLoop);
}

function updateGameObjects() {
  objs.enemies.forEach(e => {
    e.x += 2 * e.dir;
    if (Math.abs(e.x - e.start) > 100) e.dir *= -1;
    e.el.style.left = e.x + 'px';
    if (rectColl(player, {x:e.x, y:e.y, w:40, h:40})) die();
  });
  
  objs.coins.forEach(c => {
    if (c.active && rectColl(player, {x:c.x, y:c.y, w:30, h:30})) {
      c.active = false; c.el.style.display = 'none';
      gameState.score += 10; gameState.coins++;
      AudioCtrl.play('coin');
      updateHUD();
    }
  });
  
  objs.qboxes.forEach(q => {
    if (!q.solved && rectColl(player, {x:q.x, y:q.y, w:40, h:40})) openQuestion(q);
  });
}

function rectColl(a, b) {
  return (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y);
}

function jump() {
  if (player.jumps < 2) {
    player.vy = player.jumpPwr;
    player.jumps++;
    player.grounded = false;
    AudioCtrl.play('jump');
  }
}

// --- CONTROLS ---
window.onkeydown = e => {
  if (e.key === 'ArrowRight') keys.r = true;
  if (e.key === 'ArrowLeft') keys.l = true;
  if (e.key === ' ' || e.key === 'ArrowUp') jump();
};
window.onkeyup = e => {
  if (e.key === 'ArrowRight') keys.r = false;
  if (e.key === 'ArrowLeft') keys.l = false;
};

// Touch Controls
document.getElementById('btnLeft').ontouchstart = (e) => { e.preventDefault(); keys.l = true; };
document.getElementById('btnLeft').ontouchend = (e) => { e.preventDefault(); keys.l = false; };
document.getElementById('btnRight').ontouchstart = (e) => { e.preventDefault(); keys.r = true; };
document.getElementById('btnRight').ontouchend = (e) => { e.preventDefault(); keys.r = false; };
document.getElementById('btnJump').ontouchstart = (e) => { e.preventDefault(); jump(); };

// --- LOGIC ---
function die() {
  gameState.lives--;
  AudioCtrl.play('hit');
  updateHUD();
  if (gameState.lives <= 0) {
    gameState.active = false;
    document.getElementById('gameOverModal').style.display = 'flex';
  } else {
    player.x = 50; player.y = 200; player.vy = 0;
  }
}

function openQuestion(q) {
  gameState.paused = true;
  const set = QUESTIONS_DB[(gameState.level-1) % 10]; // Loop level 1-10
  const d = set[q.idx % 5];
  
  document.getElementById('questionText').innerText = d.q;
  const g = document.getElementById('answersGrid'); g.innerHTML = '';
  document.getElementById('feedbackBox').innerText = '';
  
  d.a.forEach((ans, i) => {
    const b = document.createElement('button');
    b.className = 'ans-btn'; b.innerText = ans;
    b.onclick = () => {
      if (i === d.c) {
        AudioCtrl.play('win');
        gameState.score += 100;
        q.solved = true; q.el.style.background = '#27ae60'; q.el.innerText = '✓';
        document.getElementById('questionModal').style.display = 'none';
        gameState.paused = false;
        player.x += 30;
        updateHUD();
      } else {
        AudioCtrl.play('hit');
        b.className = 'ans-btn wrong';
        document.getElementById('feedbackBox').innerText = 'Salah!';
      }
    };
    g.appendChild(b);
  });
  document.getElementById('questionModal').style.display = 'flex';
}

function levelComplete() {
  gameState.active = false;
  AudioCtrl.play('win');
  document.getElementById('levelEndScore').innerText = gameState.score;
  document.getElementById('levelCompleteModal').style.display = 'flex';
  saveData();
}

function nextLevel() {
  document.getElementById('levelCompleteModal').style.display = 'none';
  gameState.level++;
  startLevel(gameState.level);
  gameState.active = true;
  if(loopId) cancelAnimationFrame(loopId);
  gameLoop();
}

function restartLevel() {
  document.getElementById('gameOverModal').style.display = 'none';
  gameState.lives = 3;
  gameState.active = true;
  startLevel(gameState.level);
  if(loopId) cancelAnimationFrame(loopId);
  gameLoop();
}

function togglePause() {
  if(!gameState.active) return;
  gameState.paused = !gameState.paused;
  document.getElementById('pauseModal').style.display = gameState.paused ? 'flex' : 'none';
}

function exitToMenu() {
  gameState.active = false;
  if(loopId) cancelAnimationFrame(loopId);
  document.getElementById('pauseModal').style.display = 'none';
  document.getElementById('gameOverModal').style.display = 'none';
  showScreen('mainMenu');
  saveData();
}

function updateHUD() {
  document.getElementById('hudScore').innerText = gameState.score;
  document.getElementById('hudLevel').innerText = gameState.level;
  document.getElementById('hudCoins').innerText = gameState.coins;
  document.getElementById('hudLives').innerText = gameState.lives;
}
function updateUI() {
  document.getElementById('displayPlayerName').innerText = gameState.playerName;
  document.getElementById('profileScore').innerText = gameState.score;
  document.getElementById('profileLevel').innerText = gameState.level;
  document.getElementById('profileCoins').innerText = gameState.coins;
}
function saveData() { localStorage.setItem('snq_v4_data', JSON.stringify({name:gameState.playerName, score:gameState.score})); }
function resetData() { localStorage.removeItem('snq_v4_data'); location.reload(); }

function renderRewards() {
  const l = document.getElementById('rewardsList'); l.innerHTML = '';
  ['Pemula', 'Ahli', 'Master'].forEach((r,i) => {
    const un = gameState.score > (i+1)*500;
    l.innerHTML += `<div class="list-item" style="color:${un?'gold':'#555'}"><span>🏆 ${r}</span><span>${un?'Terbuka':'Kunci'}</span></div>`;
  });
}
function renderLeaderboard() {
  const l = document.getElementById('leaderboardList'); l.innerHTML = '';
  l.innerHTML += `<div class="list-item"><span>#1 ${gameState.playerName}</span><span>${gameState.score}</span></div>`;
}