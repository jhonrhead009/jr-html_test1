const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const result = document.getElementById('result');
const card = document.getElementById('card');
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');

// Move the No button away when hovered to encourage 'Yes'
function moveNoButton() {
  const rect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 12;
  const maxX = Math.max(0, rect.width - btnRect.width - padding);
  const maxY = Math.max(0, rect.height - btnRect.height - padding - 40);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  noBtn.style.position = 'relative';
  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';
  noBtn.classList.add('moved');
}

noBtn.addEventListener('mouseenter', moveNoButton);

// If 'No' is clicked, refuse and nudge back — only 'Yes' will succeed
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  noBtn.disabled = true;
  noBtn.textContent = "I won't accept that";
  setTimeout(() => {
    noBtn.disabled = false;
    noBtn.textContent = 'No';
    noBtn.style.left = '0px';
    noBtn.style.top = '0px';
    noBtn.classList.remove('moved');
  }, 1100);
});

yesBtn.addEventListener('click', () => {
  // Show success and little heart/confetti animation
  result.classList.remove('hidden');
  // create simple hearts
  const conf = document.createElement('div');
  conf.className = 'confetti';
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('span');
    s.textContent = '❤';
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (12 + Math.random() * 22) + 'px';
    s.style.animationDelay = (Math.random() * 0.6) + 's';
    conf.appendChild(s);
  }
  card.appendChild(conf);
  setTimeout(() => conf.remove(), 2400);
  // disable buttons after acceptance
  yesBtn.disabled = true;
  noBtn.disabled = true;
});

// Create and show a big bouquet when user accepts
function createBouquet(){
  if (document.querySelector('.bouquet')) return document.querySelector('.bouquet');
  const b = document.createElement('div');
  b.className = 'bouquet';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // flower definitions: emoji, left% (within bouquet), bottom(px), size(px), rotate(deg)
  const flowers = [
    ['💐', 56, 200, 62, -8],
    ['🌹', 28, 200, 76, -18],
    ['🌺', 80, 190, 70, 12],
    ['🌸', 45, 150, 58, -34],
    ['🌷', 68, 170, 64, 6]
  ];

  flowers.forEach(([emoji,leftPct,bottom,size,rot],i)=>{
    const f = document.createElement('div');
    f.className = 'flower';
    f.textContent = emoji;
    f.style.left = leftPct + '%';
    f.style.bottom = bottom + 'px';
    f.style.fontSize = size + 'px';
    f.style.transform = `translateX(-50%) rotate(${rot}deg)`;
    // randomized but staggered animation timing so each flower blooms slightly offset
    const dur = 900 + Math.floor(Math.random()*900);
    const delay = i * 100 + Math.floor(Math.random()*180);
    f.style.animationDuration = dur + 'ms';
    f.style.animationDelay = delay + 'ms';
    wrap.appendChild(f);
  });

  // stems (decorative) and ribbon
  const stems = document.createElement('div');
  stems.className = 'stems';
  wrap.appendChild(stems);

  const ribbon = document.createElement('div');
  ribbon.className = 'ribbon';
  ribbon.textContent = "Be Mine";
  wrap.appendChild(ribbon);

  b.appendChild(wrap);
  document.body.appendChild(b);
  // trigger show after inserted (allow transition)
  requestAnimationFrame(()=> requestAnimationFrame(()=> b.classList.add('show')));
  return b;
}

// enhance Yes click to show bouquet and extra flowers
yesBtn.addEventListener('click', ()=>{
  createBouquet();
  intensifyFlowers(4500);
  // spawn extra large flowers briefly
  for (let i=0;i<6;i++) setTimeout(()=>spawnFlower(document.body,['🌸','🌺','💐'][Math.floor(Math.random()*3)]), i*220);
});

// spawn a falling flower (emoji) from random horizontal position
function spawnFlower(parent=document.body, emoji='🌸'){
  const f = document.createElement('div');
  f.className = 'confetti-flower';
  f.textContent = emoji;
  const size = 14 + Math.random() * 28;
  f.style.fontSize = size + 'px';
  const dur = 4000 + Math.random() * 6000;
  f.style.animationDuration = dur + 'ms';
  if (parent === document.body) {
    const left = Math.random() * 100;
    f.style.left = left + '%';
  } else {
    // when appending inside the card, pick a px offset so it stays visible
    const leftPx = Math.random() * Math.max(40, parent.clientWidth - 24);
    f.style.left = leftPx + 'px';
  }
  parent.appendChild(f);
  f.addEventListener('animationend', () => f.remove());
  return f;
}

// spawn a small sparkle near the card
function spawnSparkle(parent=document.body){
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.width = s.style.height = (4 + Math.random() * 8) + 'px';
  s.style.animationDuration = (1 + Math.random() * 1) + 's';
  if (parent === document.body) {
    const rect = card.getBoundingClientRect();
    const left = rect.left + Math.random() * rect.width;
    const top = rect.top + Math.random() * 40 + 8;
    s.style.left = left + 'px';
    s.style.top = top + 'px';
    document.body.appendChild(s);
  } else {
    // append to card and position relative to card
    const left = Math.random() * Math.max(20, parent.clientWidth - 20);
    const top = 6 + Math.random() * 36;
    s.style.left = left + 'px';
    s.style.top = top + 'px';
    parent.appendChild(s);
  }
  s.addEventListener('animationend', () => s.remove());
}

// continuous gentle background flowers; intensify briefly on yes
let bgInterval = null;
function startBackgroundFlowers(){
  if (bgInterval) return;
  const useCard = window.innerWidth <= 520;
  const parent = useCard ? card : document.body;
  const interval = useCard ? 900 : 700;
  bgInterval = setInterval(() => {
    spawnFlower(parent, ['🌸','🌺','💮'][Math.floor(Math.random()*3)]);
    if (Math.random() > 0.6) spawnSparkle(parent);
  }, interval);
}

function intensifyFlowers(duration=3500){
  const stop = Date.now() + duration;
  const t = setInterval(()=>{
    spawnFlower(document.body, ['🌸','🌺','❀'][Math.floor(Math.random()*3)]);
    spawnSparkle();
    if (Date.now() > stop) clearInterval(t);
  }, 120);
}

// start background effects on load
window.addEventListener('DOMContentLoaded', ()=>{
  startBackgroundFlowers();
  // adapt if the user resizes the screen
  window.addEventListener('resize', ()=>{
    if (bgInterval) { clearInterval(bgInterval); bgInterval = null; }
    startBackgroundFlowers();
  });
});

// intensify when accepted
yesBtn.addEventListener('click', ()=>{
  intensifyFlowers(3000);
});

// accessibility: keyboard support for No button (make it skip when trying to press)
noBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    noBtn.click();
  }
});

// Envelope open/close
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

function showModal(){
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
  // trap simple focus
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
  document.body.style.overflow = 'hidden';
}

function hideModal(){
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

if (envelope) {
  envelope.addEventListener('click', () => {
    // open flap and reveal letter inside envelope
    envelope.classList.add('open');
    letter.classList.remove('hidden');
    // show popup modal after flap animation completes
    setTimeout(()=> showModal(), 420);
  });

  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      envelope.click();
    }
  });
}

if (modalClose) modalClose.addEventListener('click', hideModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', hideModal);
window.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') hideModal();
});
