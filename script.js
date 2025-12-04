/**
 * SMART NETWORKING QUEST v7.0
 * Features: Level Select, Star System, No-Repeat on Fail, Level Progression Fix.
 */

// --- AUDIO SYSTEM ---
const AudioCtrl = {
  ctx: null, sounds: {}, currentBGM: null, muted: false, initialized: false,
  init() {
    if(this.initialized) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC(); this.initialized = true;
      if(this.ctx.state === 'suspended') this.ctx.resume();
      this.preload();
    } catch(e){}
  },
  preload() {
    this.load('bgm_menu', 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-chill-medium-version-159456.mp3', true);
    this.load('bgm_game', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=grand-dark-orchestral-1-127976.mp3', true);
    this.load('jump', 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    this.load('coin', 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    this.load('win', 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    this.load('hit', 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3'); 
    this.load('enemy_die', 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
  },
  load(n,u,l=false) { const a=new Audio(); a.src=u; a.loop=l; a.volume=n.includes('bgm')?0.3:0.6; a.load(); this.sounds[n]=a; },
  play(n) {
    if(this.muted || !this.sounds[n]) return;
    if(this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if(n.includes('bgm')) {
      if(this.currentBGM && this.currentBGM !== this.sounds[n]) { this.currentBGM.pause(); this.currentBGM.currentTime=0; }
      if(this.currentBGM===this.sounds[n] && !this.sounds[n].paused) return;
      this.currentBGM=this.sounds[n]; this.sounds[n].play().catch(()=>{});
    } else { const c=this.sounds[n].cloneNode(); c.volume=this.sounds[n].volume; c.play().catch(()=>{}); }
  },
  stopBGM() { if(this.currentBGM) { this.currentBGM.pause(); this.currentBGM=null; } }
};

// --- DATABASE SOAL LEVEL ---
const QUESTIONS_DB = [
  // LVL 1
  [{q: "IP Address v4 terdiri dari berapa bit?", a: ["32 bit", "64 bit", "128 bit", "16 bit", "8 bit"], c: 0},
   {q: "Contoh penulisan IPv4 yang benar?", a: ["192.168.1.1", "192.168.1", "192:168:1:1", "999.999.0.1", "192-168-1-1"], c: 0},
   {q: "Apa kepanjangan IP?", a: ["Internet Protocol", "Internal Port", "Inter Point", "Intranet Protocol", "Intel Process"], c: 0},
   {q: "Berapa oktet dalam IPv4?", a: ["4 Oktet", "8 Oktet", "6 Oktet", "2 Oktet", "12 Oktet"], c: 0},
   {q: "Fungsi utama IP Address?", a: ["Identitas Perangkat", "Kecepatan Internet", "Memori RAM", "Resolusi Layar", "Pendingin CPU"], c: 0}],
  // LVL 2
  [{q: "Berapa panjang bit IPv6?", a: ["128 bit", "32 bit", "64 bit", "256 bit", "1024 bit"], c: 0},
   {q: "Format IPv6 menggunakan bilangan?", a: ["Hexadecimal", "Desimal", "Biner", "Oktal", "Teks"], c: 0},
   {q: "Pemisah antar blok IPv6 adalah?", a: ["Titik Dua (:)", "Titik (.)", "Koma (,)", "Strip (-)", "Spasi"], c: 0},
   {q: "Contoh IPv6 yang valid?", a: ["2001:0db8::1", "192.168.1.1", "fe80.1.1.1", "G H I J", "127.0.0.1"], c: 0},
   {q: "Kenapa dunia mulai beralih ke IPv6?", a: ["IPv4 Menipis", "IPv6 Lebih Pendek", "Lebih Murah", "Buatan Lokal", "Hanya Tren"], c: 0}],
   // LVL 3
  [{q: "IP Statis artinya?", a: ["Tetap / Manual", "Berubah-ubah", "Otomatis", "Acak", "Sementara"], c: 0},
   {q: "IP Dinamis didapat dari?", a: ["DHCP Server", "Web Server", "Database", "Monitor", "Keyboard"], c: 0},
   {q: "Perangkat yang WAJIB pakai IP Statis?", a: ["Server", "HP Tamu", "Laptop Cafe", "Tablet Anak", "Smartwatch"], c: 0},
   {q: "Apa kepanjangan DHCP?", a: ["Dynamic Host Config Protocol", "Dynamic Host Control Panel", "Domain Host Center", "Data High Control", "Dual Host Connection"], c: 0},
   {q: "Kelebihan utama DHCP?", a: ["Konfigurasi Otomatis", "IP Tidak Pernah Ganti", "Lebih Mahal", "Lebih Lambat", "Manual"], c: 0}],
   // LVL 4
  [{q: "Range IP Private Kelas C?", a: ["192.168.x.x", "10.x.x.x", "172.16.x.x", "8.8.8.8", "1.1.1.1"], c: 0},
   {q: "IP Public digunakan untuk?", a: ["Akses Internet Global", "Hanya LAN", "Printer Lokal", "Bluetooth", "Offline"], c: 0},
   {q: "Teknologi pengubah IP Private ke Public?", a: ["NAT", "DNS", "DHCP", "VPN", "VLAN"], c: 0},
   {q: "Contoh IP Private?", a: ["10.0.0.1", "8.8.4.4", "1.1.1.1", "202.134.0.1", "150.10.10.10"], c: 0},
   {q: "Siapa penyedia IP Public?", a: ["ISP (Provider)", "Toko Komputer", "PLN", "Pemerintah Desa", "Sendiri"], c: 0}],
   // LVL 5
  [{q: "Range oktet pertama Kelas A?", a: ["1 - 126", "128 - 191", "192 - 223", "224 - 239", "240 - 255"], c: 0},
   {q: "Range oktet pertama Kelas B?", a: ["128 - 191", "1 - 126", "192 - 223", "0 - 100", "200 - 250"], c: 0},
   {q: "Range oktet pertama Kelas C?", a: ["192 - 223", "1 - 126", "128 - 191", "100 - 200", "224 - 239"], c: 0},
   {q: "Subnet Mask default Kelas C?", a: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.255", "0.0.0.0"], c: 0},
   {q: "IP Multicast ada di kelas?", a: ["Kelas D", "Kelas A", "Kelas B", "Kelas C", "Kelas E"], c: 0}],
   // LVL 6
   [{q: "Subnet Mask default Kelas B?", a: ["255.255.0.0", "255.0.0.0", "255.255.255.0", "255.255.255.255", "0.0.0.0"], c: 0},
    {q: "Jumlah host maksimal Kelas C?", a: ["254", "65.534", "16 Juta", "100", "10"], c: 0},
    {q: "IP 172.16.10.1 termasuk kelas?", a: ["Kelas B", "Kelas A", "Kelas C", "Kelas D", "Kelas E"], c: 0},
    {q: "IP 192.168.100.1 termasuk kelas?", a: ["Kelas C", "Kelas A", "Kelas B", "Kelas D", "Kelas E"], c: 0},
    {q: "Kelas untuk jaringan skala sangat besar?", a: ["Kelas A", "Kelas B", "Kelas C", "Kelas D", "Kelas E"], c: 0}],
   // LVL 7
   [{q: "Komunikasi 'Satu ke Semua' disebut?", a: ["Broadcast", "Unicast", "Multicast", "Anycast", "Telecast"], c: 0},
    {q: "Komunikasi 'Satu ke Grup Tertentu' disebut?", a: ["Multicast", "Broadcast", "Unicast", "Anycast", "Simulcast"], c: 0},
    {q: "Komunikasi 'Satu ke Satu' disebut?", a: ["Unicast", "Broadcast", "Multicast", "Omnicast", "Duocast"], c: 0},
    {q: "Alamat Broadcast dari 192.168.1.0/24?", a: ["192.168.1.255", "192.168.1.0", "192.168.1.1", "192.168.1.254", "255.255.255.255"], c: 0},
    {q: "Contoh penggunaan Multicast?", a: ["Streaming Video Conference", "Web Browsing", "Email", "File Transfer", "Ping"], c: 0}],
   // LVL 8
   [{q: "Dalam 192.168.1.5/24, Net ID adalah?", a: ["192.168.1.0", "192.168.1.5", "5", "192.168", "1.5"], c: 0},
    {q: "Dalam 192.168.1.5/24, Host ID adalah?", a: ["5", "192.168.1", "192", "168", "1"], c: 0},
    {q: "Berapa bit Host ID pada Kelas C?", a: ["8 bit", "16 bit", "24 bit", "32 bit", "4 bit"], c: 0},
    {q: "Berapa bit Network ID pada Kelas A?", a: ["8 bit", "16 bit", "24 bit", "32 bit", "4 bit"], c: 0},
    {q: "Fungsi Subnet Mask?", a: ["Membedakan Net ID & Host ID", "Menyembunyikan IP", "Mengganti IP", "Mempercepat Koneksi", "Enkripsi Data"], c: 0}],
   // LVL 9
   [{q: "IP Loopback IPv4 adalah?", a: ["127.0.0.1", "192.168.1.1", "10.0.0.1", "0.0.0.0", "255.255.255.255"], c: 0},
    {q: "Fungsi utama Loopback Address?", a: ["Tes koneksi ke diri sendiri", "Hack orang lain", "Akses Internet", "Mematikan PC", "Reset Router"], c: 0},
    {q: "IP 0.0.0.0 biasanya berarti?", a: ["Default Route / Semua Jaringan", "IP Google", "IP Rusak", "IP Loopback", "IP Broadcast"], c: 0},
    {q: "IP APIPA (Automatic Private IP) diawali?", a: ["169.254", "192.168", "10.10", "172.16", "127.0"], c: 0},
    {q: "localhost sama dengan IP?", a: ["127.0.0.1", "192.168.1.1", "8.8.8.8", "1.1.1.1", "10.0.0.1"], c: 0}],
   // LVL 10
   [{q: "Protokol untuk mengubah Domain ke IP?", a: ["DNS", "DHCP", "NAT", "ARP", "HTTP"], c: 0},
    {q: "Protokol untuk mengubah IP ke MAC?", a: ["ARP", "RARP", "DNS", "NAT", "TCP"], c: 0},
    {q: "Layer OSI pengurutan paket data?", a: ["Network", "Physical", "Data Link", "Transport", "Session"], c: 3},
    {q: "Kabel UTP menggunakan konektor?", a: ["RJ-45", "RJ-11", "USB", "HDMI", "VGA"], c: 0},
    {q: "Perangkat penghubung beda network?", a: ["Router", "Switch", "Hub", "Repeater", "Bridge"], c: 0}]
];

// --- SOAL MUSUH (50 SOAL) ---
const ENEMY_QUESTIONS = [
  {q: "Otak dari sebuah komputer adalah?", a: ["CPU", "RAM", "Hardisk", "Mouse", "Monitor"], c: 0},
  {q: "Kepanjangan dari RAM?", a: ["Random Access Memory", "Read Access Memory", "Run All Memory", "Real Access Module", "Random Active Mode"], c: 0},
  {q: "Sistem bilangan biner terdiri dari?", a: ["0 dan 1", "1 dan 2", "0 sampai 9", "A sampai Z", "Hitam dan Putih"], c: 0},
  {q: "Port standar untuk HTTP?", a: ["80", "443", "21", "22", "8080"], c: 0},
  {q: "Port standar untuk HTTPS?", a: ["443", "80", "25", "110", "53"], c: 0},
  {q: "WWW singkatan dari?", a: ["World Wide Web", "World Web Wide", "Web Wide World", "Wide World Web", "World Wireless Web"], c: 0},
  {q: "Pendiri Microsoft adalah?", a: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Elon Musk", "Jeff Bezos"], c: 0},
  {q: "Pendiri Apple adalah?", a: ["Steve Jobs", "Bill Gates", "Larry Page", "Linus Torvalds", "Tim Cook"], c: 0},
  {q: "Perangkat Input contohnya?", a: ["Keyboard", "Monitor", "Speaker", "Printer", "Proyektor"], c: 0},
  {q: "Perangkat Output contohnya?", a: ["Monitor", "Mouse", "Scanner", "Microphone", "Webcam"], c: 0},
  {q: "Sistem Operasi untuk HP Android dibuat oleh?", a: ["Google", "Apple", "Samsung", "Nokia", "Microsoft"], c: 0},
  {q: "Shortcut untuk Salin (Copy)?", a: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z", "Ctrl + P"], c: 0},
  {q: "Shortcut untuk Tempel (Paste)?", a: ["Ctrl + V", "Ctrl + C", "Ctrl + P", "Ctrl + S", "Ctrl + A"], c: 0},
  {q: "Shortcut untuk Potong (Cut)?", a: ["Ctrl + X", "Ctrl + C", "Ctrl + Z", "Ctrl + Y", "Ctrl + B"], c: 0},
  {q: "Shortcut untuk Undo?", a: ["Ctrl + Z", "Ctrl + Y", "Ctrl + U", "Ctrl + I", "Ctrl + D"], c: 0},
  {q: "Satuan penyimpanan terbesar di daftar ini?", a: ["Terabyte", "Gigabyte", "Megabyte", "Kilobyte", "Byte"], c: 0},
  {q: "Satuan data terkecil adalah?", a: ["Bit", "Byte", "Pixel", "Hz", "Volt"], c: 0},
  {q: "1 Byte terdiri dari berapa Bit?", a: ["8 Bit", "4 Bit", "16 Bit", "32 Bit", "10 Bit"], c: 0},
  {q: "Kepanjangan WiFi?", a: ["Wireless Fidelity", "Wireless Finder", "Wide Frequency", "Wire Fire", "Wireless Field"], c: 0},
  {q: "Jaringan area lokal disebut?", a: ["LAN", "WAN", "MAN", "PAN", "SAN"], c: 0},
  {q: "Jaringan area luas (antar negara) disebut?", a: ["WAN", "LAN", "MAN", "PAN", "CAN"], c: 0},
  {q: "Kepanjangan USB?", a: ["Universal Serial Bus", "United Serial Bus", "Universal System Bus", "Unique Serial Bus", "Unit Serial Bus"], c: 0},
  {q: "Format file dokumen portabel?", a: ["PDF", "DOC", "TXT", "PPT", "XLS"], c: 0},
  {q: "Format file gambar?", a: ["JPG", "MP3", "MP4", "EXE", "ZIP"], c: 0},
  {q: "Format file suara/audio?", a: ["MP3", "JPG", "PNG", "AVI", "HTML"], c: 0},
  {q: "Bahasa markup untuk membuat web?", a: ["HTML", "Python", "C++", "Java", "SQL"], c: 0},
  {q: "CSS digunakan untuk?", a: ["Desain/Style Web", "Logika Web", "Database", "Server", "Hardware"], c: 0},
  {q: "Otak pemrosesan grafis?", a: ["GPU", "CPU", "PSU", "SSD", "HDD"], c: 0},
  {q: "Media penyimpanan tipe piringan putar?", a: ["Harddisk (HDD)", "SSD", "Flashdisk", "RAM", "DVD"], c: 0},
  {q: "Media penyimpanan tipe chip (cepat)?", a: ["SSD", "HDD", "CD", "Floppy", "Tape"], c: 0},
  {q: "Papan sirkuit utama komputer?", a: ["Motherboard", "Keyboard", "Breadboard", "Clipboard", "Cardboard"], c: 0},
  {q: "Software pengolah kata buatan Microsoft?", a: ["Word", "Excel", "PowerPoint", "Access", "Outlook"], c: 0},
  {q: "Software pengolah angka/tabel?", a: ["Excel", "Word", "Paint", "Notepad", "Chrome"], c: 0},
  {q: "Tombol refresh halaman web?", a: ["F5", "F4", "F1", "F12", "Esc"], c: 0},
  {q: "Tombol untuk menutup jendela program?", a: ["Alt + F4", "Ctrl + C", "Shift + Del", "Alt + Tab", "Win + D"], c: 0},
  {q: "Apa itu Cloud Storage?", a: ["Penyimpanan Online", "Awan Hujan", "Hardisk Rusak", "Sinyal Wifi", "Anti Virus"], c: 0},
  {q: "IoT singkatan dari?", a: ["Internet of Things", "Input of Tools", "Internet of Technology", "Internal of Things", "Index of Text"], c: 0},
  {q: "AI singkatan dari?", a: ["Artificial Intelligence", "Apple Inc", "Anti Interface", "Auto Install", "All Internet"], c: 0},
  {q: "Fungsi Firewall?", a: ["Keamanan Jaringan", "Mempercepat Download", "Mendinginkan CPU", "Memutar Musik", "Mencetak Dokumen"], c: 0},
  {q: "Contoh Web Browser?", a: ["Chrome", "Google", "Facebook", "Windows", "Intel"], c: 0},
  {q: "Sistem operasi open source berlambang pinguin?", a: ["Linux", "Windows", "MacOS", "Android", "iOS"], c: 0},
  {q: "Kabel jaringan standar saat ini?", a: ["UTP / LAN", "HDMI", "VGA", "RCA", "Power"], c: 0},
  {q: "Alat penyedia daya listrik cadangan?", a: ["UPS", "PSU", "USB", "GPS", "CPU"], c: 0},
  {q: "Tombol untuk Fullscreen?", a: ["F11", "F1", "Esc", "Enter", "Space"], c: 0},
  {q: "Aplikasi sosial media berbagi foto?", a: ["Instagram", "Excel", "Spotify", "Netflix", "Gojek"], c: 0},
  {q: "Mesin pencari paling populer?", a: ["Google", "Word", "Winamp", "Paint", "Calculator"], c: 0},
  {q: "Istilah 'Bug' dalam komputer artinya?", a: ["Kesalahan Program", "Serangga Asli", "Virus", "Hardware Rusak", "Fitur Baru"], c: 0},
  {q: "Download artinya?", a: ["Mengambil data dari internet", "Mengirim data ke internet", "Menghapus data", "Mencetak data", "Mengunci data"], c: 0},
  {q: "Upload artinya?", a: ["Mengirim data ke internet", "Mengambil data dari internet", "Menyimpan di flashdisk", "Mematikan internet", "Bermain game"], c: 0},
  {q: "Siapa pendiri Facebook?", a: ["Mark Zuckerberg", "Bill Gates", "Elon Musk", "Jack Ma", "Nadiem Makarim"], c: 0}
];

// --- GAME STATE & VARIABLES ---
let gameState = {
  playerName: "",
  maxLevel: 1, // Level tertinggi yang terbuka
  levelStars: {}, // Menyimpan bintang per level {1: 3, 2: 2, ...}
  level: 1, 
  score: 0, 
  coins: 0, 
  lives: 3, 
  active: false, 
  paused: false
};

let player = { x: 50, y: 200, w: 40, h: 40, vx: 0, vy: 0, speed: 5, jumpPwr: 13, grav: 0.6, grounded: false, jumps: 0 };
let objs = { plats: [], coins: [], enemies: [], qboxes: [] };
let keys = { l: false, r: false };
let loopId = null;
let currentLevelCorrectAnswers = 0; // Track jawaban benar per level

// --- INIT ---
window.onload = () => {
  const s = localStorage.getItem('snq_v7_data');
  if(s) {
    const d=JSON.parse(s); 
    gameState.playerName = d.name; 
    gameState.score = d.score || 0;
    gameState.maxLevel = d.maxLevel || 1;
    gameState.levelStars = d.levelStars || {};
    
    document.getElementById('welcomeScreen').style.display='none';
    document.getElementById('mainWrapper').style.display='block';
    showScreen('mainMenu'); 
    updateUI();
  }
};

function submitName() {
  const v=document.getElementById('playerNameInput').value.trim();
  if(!v) return alert("Nama wajib!");
  gameState.playerName=v; 
  saveData(); 
  AudioCtrl.init(); 
  AudioCtrl.play('bgm_menu');
  
  document.getElementById('welcomeScreen').style.display='none';
  document.getElementById('mainWrapper').style.display='block';
  showScreen('mainMenu'); 
  updateUI();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='mainMenu') AudioCtrl.play('bgm_menu');
  if(id==='leaderboardScreen') renderLeaderboard();
  if(id==='rewardsScreen') renderRewards();
}

// --- LEVEL SELECT SYSTEM ---
function showLevelSelect() {
  const grid = document.getElementById('levelGrid');
  grid.innerHTML = '';
  
  for(let i=1; i<=10; i++) {
    const isLocked = i > gameState.maxLevel;
    const stars = gameState.levelStars[i] || 0;
    let starStr = '';
    for(let s=0; s<3; s++) starStr += (s < stars) ? '⭐' : '<span class="star-off">⭐</span>';
    
    const btn = document.createElement('div');
    btn.className = `lvl-btn ${isLocked ? 'locked' : ''}`;
    btn.innerHTML = `<span>${i}</span><div class="lvl-stars">${starStr}</div>`;
    
    if(!isLocked) {
      btn.onclick = () => {
        gameState.level = i;
        startGame();
      };
    }
    grid.appendChild(btn);
  }
  showScreen('levelSelectScreen');
}

// --- GAMEPLAY ENGINE ---
function startGame() {
  AudioCtrl.play('bgm_game');
  gameState.active=true; 
  gameState.paused=false; 
  gameState.lives=3;
  // Level sudah di-set dari tombol start menu (level 1) atau level select
  if(!gameState.level) gameState.level = 1;
  
  startLevel(gameState.level); 
  showScreen('gameplayScreen');
  if(loopId) cancelAnimationFrame(loopId); 
  gameLoop();
}

function startLevel(lvl) {
  player.x=50; player.y=200; player.vx=0; player.vy=0;
  currentLevelCorrectAnswers = 0; // Reset counter benar
  generateLevel(lvl); 
  updateHUD();
}

function generateLevel(lvl) {
  const layer = document.getElementById('worldLayer');
  layer.innerHTML = '<div id="player" class="player"></div><div id="finishLine" style="display:none">🏁</div>';
  
  const fin = document.getElementById('finishLine');
  fin.style.cssText = `position:absolute; bottom:50px; font-size:50px; display:none; z-index:4;`;

  objs = { plats: [], coins: [], enemies: [], qboxes: [] };
  
  // TANAH
  createObj('plat', 0, 0, 20000, 50); 

  // PROCEDURAL
  let cx = 300;
  const len = 2000 + (lvl * 400);
  let qCount = 0;
  
  while (cx < len) {
    const cy = 100 + Math.random() * 150;
    const cw = 150;
    createObj('plat', cx, cy, cw, 20);
    createObj('coin', cx + 50, cy + 50);

    if (Math.random() < 0.3) createObj('enemy', cx + 50, 50, 200);
    if (Math.random() < 0.4) createObj('enemy', cx + 20, cy + 20, cw);

    if (qCount < 5 && Math.random() > 0.4) {
      createObj('qbox', cx + 70, cy + 80, qCount);
      qCount++;
    }
    cx += 250;
  }

  while(qCount < 5) {
    createObj('plat', cx, 100, 150, 20);
    createObj('qbox', cx + 70, 150, qCount);
    qCount++;
    cx += 250;
  }

  fin.style.left = (cx + 200) + 'px';
  fin.style.display = 'none'; 
}

function createObj(type, x, y, param) {
  const el = document.createElement('div');
  el.className = type==='plat'?'platform':type==='qbox'?'question-box':type;
  el.style.left=x+'px'; el.style.bottom=y+'px';

  if(type==='plat') { 
    el.style.width=param+'px'; 
    let h = 20; if(y===0) { h=50; el.style.height='50px'; } else { el.style.height='20px'; }
    objs.plats.push({x,y,w:param,h:h}); document.getElementById('worldLayer').appendChild(el);
  }
  else if(type==='coin') { document.getElementById('worldLayer').appendChild(el); objs.coins.push({el,x,y,active:true}); }
  else if(type==='enemy') { 
    document.getElementById('worldLayer').appendChild(el); 
    objs.enemies.push({el, x, y, start:x, minX:x, maxX:x+param-40, dir:1, active:true}); 
  }
  else if(type==='qbox') { 
    el.innerHTML='?'; document.getElementById('worldLayer').appendChild(el); 
    objs.qboxes.push({el,x,y,idx:param,solved:false}); 
  }
}

// --- PHYSICS ---
function gameLoop() {
  if(!gameState.active) return;
  if(gameState.paused) { loopId=requestAnimationFrame(gameLoop); return; }

  if(keys.r) player.vx = player.speed;
  else if(keys.l) player.vx = -player.speed;
  else player.vx = 0;
  player.x += player.vx;

  player.vy -= player.grav;
  player.y += player.vy;

  player.grounded = false;
  objs.plats.forEach(p => {
    if(player.x + player.w > p.x && player.x < p.x + p.w) {
      if(player.y <= p.y + p.h && player.y + 20 >= p.y + p.h && player.vy <= 0) {
        player.grounded = true; player.y = p.y + p.h; player.vy = 0; player.jumps = 0;
      }
      else if(player.y + player.h >= p.y && player.y + player.h <= p.y + 15 && player.vy > 0) {
        player.vy = -1; player.y = p.y - player.h - 1;
      }
    }
  });

  if(player.y < -100) die();
  updateEntities();
  
  const el = document.getElementById('player');
  if(el) {
    el.style.left=player.x+'px'; el.style.bottom=player.y+'px';
    el.style.transform = keys.l ? 'scaleX(-1)' : 'scaleX(1)';
    const cam = Math.max(0, player.x - 200);
    document.getElementById('worldLayer').style.transform = `translateX(-${cam}px)`;
    document.getElementById('worldBg').style.backgroundPositionX = `-${cam*0.5}px`;
    const fin = document.getElementById('finishLine');
    if(fin.style.display !== 'none' && player.x >= parseInt(fin.style.left)) levelComplete();
  }
  loopId=requestAnimationFrame(gameLoop);
}

function updateEntities() {
  objs.enemies.forEach(e => {
    if(!e.active) return;
    e.x += 2 * e.dir;
    if(e.x >= e.maxX) e.dir = -1;
    if(e.x <= e.minX) e.dir = 1;
    e.el.style.left = e.x + 'px';
    e.el.style.transform = e.dir===1 ? 'scaleX(1)' : 'scaleX(-1)';
    if(rectColl(player, {x:e.x, y:e.y, w:40, h:40})) openEnemyQuestion(e);
  });
  objs.coins.forEach(c => {
    if(c.active && rectColl(player, {x:c.x, y:c.y, w:30, h:30})) {
      c.active=false; c.el.style.display='none';
      gameState.score+=10; gameState.coins++; AudioCtrl.play('coin'); updateHUD();
    }
  });
  objs.qboxes.forEach(q => {
    if(!q.solved && rectColl(player, {x:q.x, y:q.y, w:40, h:40})) openQuestion(q);
  });
}

function rectColl(a, b) { return (a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y); }
function jump() { if(player.jumps < 2) { player.vy=player.jumpPwr; player.jumps++; player.grounded=false; AudioCtrl.play('jump'); } }

window.onkeydown = e => {
  const k = e.key.toLowerCase();
  if(k==='arrowright'||k==='d') keys.r=true;
  if(k==='arrowleft'||k==='a') keys.l=true;
  if((k===' '||k==='arrowup'||k==='w')) jump();
};
window.onkeyup = e => {
  const k = e.key.toLowerCase();
  if(k==='arrowright'||k==='d') keys.r=false;
  if(k==='arrowleft'||k==='a') keys.l=false;
};

// --- LOGIC PERTANYAAN (UPDATE NO REPEAT) ---
function openQuestion(qObj) {
  gameState.paused = true;
  setupModal("SOAL PENGETAHUAN", false);
  const set = QUESTIONS_DB[(gameState.level-1)%QUESTIONS_DB.length];
  const d = set[qObj.idx % set.length];
  
  renderQuestion(d.q, d.a, d.c, () => {
    // BENAR
    AudioCtrl.play('win'); gameState.score+=100;
    qObj.solved=true; 
    qObj.el.style.background='#27ae60'; 
    qObj.el.innerText='✓';
    currentLevelCorrectAnswers++; // Tambah counter benar
    closeModal(); checkAllSolved();
  }, () => {
    // SALAH (Tidak boleh ulang, tandai merah)
    AudioCtrl.play('hit'); 
    qObj.solved=true; 
    qObj.el.style.background='#c0392b'; 
    qObj.el.innerText='X';
    closeModal(); checkAllSolved();
  });
}

function openEnemyQuestion(enemyObj) {
  gameState.paused = true;
  setupModal("⚠️ SOAL MUSUH ⚠️", true);
  const d = ENEMY_QUESTIONS[Math.floor(Math.random()*ENEMY_QUESTIONS.length)];
  
  renderQuestion(d.q, d.a, d.c, () => {
    AudioCtrl.play('enemy_die'); gameState.score += 200;
    enemyObj.active = false; enemyObj.el.style.display = 'none'; 
    closeModal();
  }, () => {
    AudioCtrl.play('hit'); 
    gameState.lives--; updateHUD();
    player.x -= 100; player.y += 20;
    closeModal();
    if(gameState.lives <= 0) die();
  });
}

function setupModal(title, isEnemy) {
  const card = document.getElementById('qCardStyle');
  const head = document.getElementById('qHeader');
  if(isEnemy) { card.classList.add('enemy-mode'); head.innerText = title; }
  else { card.classList.remove('enemy-mode'); head.innerText = title; }
  document.getElementById('questionModal').style.display = 'flex';
}

function renderQuestion(txt, answers, correctIdx, onCorrect, onWrong) {
  document.getElementById('questionText').innerText = txt;
  const g = document.getElementById('answersGrid'); g.innerHTML = '';
  document.getElementById('feedbackBox').innerText = '';
  
  const correctAnswerText = answers[correctIdx];
  let shuffledAnswers = [...answers];
  for (let i = shuffledAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
  }
  
  shuffledAnswers.forEach((ans) => {
    const b = document.createElement('button');
    b.className = 'ans-btn'; b.innerText = ans;
    b.onclick = () => {
      if(ans === correctAnswerText) onCorrect();
      else { b.className = 'ans-btn wrong'; onWrong(); }
    };
    g.appendChild(b);
  });
}

function closeModal() {
  document.getElementById('questionModal').style.display = 'none';
  gameState.paused = false;
  player.x += 20; // Dorong dikit biar ga nyangkut
  updateHUD();
}

function checkAllSolved() {
  const remain = objs.qboxes.filter(q => !q.solved).length;
  updateHUD();
  if(remain === 0) {
    const fin = document.getElementById('finishLine');
    fin.style.display = 'block'; 
  }
}

function die() {
  gameState.lives--; AudioCtrl.play('hit'); updateHUD();
  if(gameState.lives <= 0) {
    gameState.active=false; document.getElementById('gameOverModal').style.display='flex';
  } else { player.x=50; player.y=200; player.vy=0; }
}

// --- LEVEL COMPLETE LOGIC (BINTANG & LEVEL FIX) ---
function levelComplete() {
  gameState.active = false;
  AudioCtrl.play('win');
  
  // Hitung Bintang
  let stars = 1;
  if(currentLevelCorrectAnswers === 5) stars = 3;
  else if(currentLevelCorrectAnswers === 4) stars = 2;
  
  // Simpan Bintang Tertinggi
  const currentBest = gameState.levelStars[gameState.level] || 0;
  if(stars > currentBest) gameState.levelStars[gameState.level] = stars;
  
  // Tampilkan Bintang UI
  const starContainer = document.getElementById('starDisplay');
  let starHTML = '';
  for(let i=0; i<3; i++) {
    starHTML += (i < stars) ? '⭐' : '<span style="opacity:0.3; filter:grayscale(1)">⭐</span>';
  }
  starContainer.innerHTML = starHTML;

  // Unlock Next Level
  if(gameState.level >= gameState.maxLevel) {
    gameState.maxLevel = gameState.level + 1;
  }

  document.getElementById('levelCorrectCount').innerText = currentLevelCorrectAnswers;
  document.getElementById('levelEndScore').innerText = gameState.score;
  document.getElementById('levelCompleteModal').style.display = 'flex';
  saveData();
}

// BUG FIX: Angka level di HUD sekarang update otomatis
function nextLevel() {
  document.getElementById('levelCompleteModal').style.display = 'none';
  gameState.level++; // Increment Level
  
  // Loop kembali ke 1 jika > 10 (Opsional, atau tamat)
  if(gameState.level > 10) gameState.level = 10; 
  
  startLevel(gameState.level);
  gameState.active = true;
  if(loopId) cancelAnimationFrame(loopId);
  gameLoop();
}

function restartLevel() {
  document.getElementById('gameOverModal').style.display='none';
  startLevel(gameState.level); // Restart level yang sama
  gameState.lives = 3;
  gameState.active = true;
  if(loopId) cancelAnimationFrame(loopId);
  gameLoop();
}

function togglePause() { if(!gameState.active)return; gameState.paused=!gameState.paused; document.getElementById('pauseModal').style.display=gameState.paused?'flex':'none'; }
function exitToMenu() { gameState.active=false; if(loopId)cancelAnimationFrame(loopId); document.getElementById('pauseModal').style.display='none'; document.getElementById('gameOverModal').style.display='none'; document.getElementById('levelCompleteModal').style.display='none'; showScreen('mainMenu'); saveData(); }

function updateHUD() {
  document.getElementById('hudScore').innerText=gameState.score;
  document.getElementById('hudLevel').innerText=gameState.level; // Updated Logic
  document.getElementById('hudCoins').innerText=gameState.coins;
  document.getElementById('hudLives').innerText=gameState.lives;
  
  const solved = objs.qboxes.filter(q => q.solved).length;
  // Menampilkan berapa yang benar dari yang sudah dijawab (opsional)
  document.getElementById('hudCorrect').innerText = currentLevelCorrectAnswers;
}

function updateUI() {
  document.getElementById('displayPlayerName').innerText=gameState.playerName;
  document.getElementById('profileScore').innerText=gameState.score;
  document.getElementById('profileLevel').innerText=gameState.maxLevel; // Show Max Level Unlocked
  document.getElementById('profileCoins').innerText=gameState.coins;
}

function saveData() { 
  localStorage.setItem('snq_v7_data', JSON.stringify({
    name: gameState.playerName, 
    score: gameState.score,
    maxLevel: gameState.maxLevel,
    levelStars: gameState.levelStars
  })); 
}

function resetData() { localStorage.removeItem('snq_v7_data'); location.reload(); }

function renderRewards() {
  const l=document.getElementById('rewardsList'); l.innerHTML='';
  ['Pemula','Ahli','Master'].forEach((r,i)=>{ const u=gameState.score>(i+1)*500; l.innerHTML+=`<div class="list-item" style="color:${u?'gold':'#555'}"><span>🏆 ${r}</span><span>${u?'Terbuka':'Kunci'}</span></div>`; });
}
function renderLeaderboard() {
  const l=document.getElementById('leaderboardList'); l.innerHTML=`<div class="list-item"><span>#1 ${gameState.playerName}</span><span>${gameState.score}</span></div>`;
}
