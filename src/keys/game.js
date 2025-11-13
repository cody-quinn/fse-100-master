const COLOR_SET = ["#ff1744", "#00e5ff", "#00e676", "#ffd600", "#d500f9", "#ff8a00"];

const area = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const timerEl = document.getElementById("timer");
const accEl = document.getElementById("accuracy");

const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");

const hud = document.getElementById("hud");
const gameContainer = document.getElementById("game-container");

const cueBubble = document.getElementById("cue-bubble");

const restartBtn = document.getElementById("restart");
const endScreen = document.getElementById("end-screen");
const finalScoreEl = document.getElementById("final-score");
const finalLevelsEl = document.getElementById("final-levels");
const finalAccEl = document.getElementById("final-acc");
const finalTimeEl = document.getElementById("final-time");
const playAgainBtn = document.getElementById("play-again");

let level = 1;
let score = 0;
let completed = 0;
const totalLevels = 10;
const keyholesContainer = document.getElementById("keyholes");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const restartButton = document.getElementById("restart");
const backButton = document.getElementById("back");
const key = document.getElementById("key");

let rafId = null;
let timerId = null;
let cueTimer = null;

const keys = [];
const locks = [];

function cfg(lv){
  return {
    pairs: Math.min(2 + lv, 6),
    lockSpeed: 0.4 + (lv-1)*0.25,
    keyDrift: (lv>=3) ? (0.15 + (lv-3)*0.08) : 0,
    time: Math.max(16, 34 - lv*2),
    iconSize: Math.max(40, 56 - lv*2)
  };
}

function rnd(min,max){ return Math.random()*(max-min)+min; }
function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }

function speak(text){
  const msg = new SpeechSynthesisUtterance(text);
  msg.pitch = 1.0;
  msg.rate = 0.9;
  msg.volume = 1;
  const voices = speechSynthesis.getVoices();
  const soft = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("woman"));
  if(soft) msg.voice = soft;
  speechSynthesis.speak(msg);
}

function showCue(text){
  cueBubble.textContent = text;
  cueBubble.classList.remove("hidden");
  speak(text);
  clearTimeout(cueTimer);
  cueTimer = setTimeout(()=>cueBubble.classList.add("hidden"), 3500);
}

function generateCue(color){
  const mode = Math.floor(Math.random()*3);
  if(mode === 0) return { type:"color", text:`Match the ${colorName(color)} lock`, color };
  if(mode === 1){
    const a = Math.floor(Math.random()*4)+1;
    const b = Math.floor(Math.random()*3);
    const ans = a - b;
    return { type:"math", answer: ans, text:`Solve: ${a} minus ${b}` };
  }
  return { type:"shape", text:`Find the key that matches this color`, color };
}

function colorName(hex){
  if(hex === "#ff1744") return "red";
  if(hex === "#00e5ff") return "blue";
  if(hex === "#00e676") return "green";
  if(hex === "#ffd600") return "yellow";
  if(hex === "#d500f9") return "purple";
  if(hex === "#ff8a00") return "orange";
  return "the color";
}

function buildLevel(lv){
  clearLevel();
  const c = cfg(lv);
  targetPairs = c.pairs;
  timeLeft = c.time;
  timerEl.textContent = timeLeft;
  levelEl.textContent = lv;
  completedInLevel = 0;

  const colors = [...COLOR_SET].sort(()=>Math.random()-0.5).slice(0, c.pairs);
  const cue = generateCue(colors[Math.floor(Math.random()*colors.length)]);
  showCue(cue.text);

  locks.length = 0;
  keys.length = 0;

  colors.forEach(col=>{
    const el = document.createElement("div");
    el.className = "lock";
    el.textContent = "🔒";
    el.style.color = col;
    el.style.fontSize = c.iconSize+"px";
    area.appendChild(el);

    locks.push({
      el,
      color: col,
      unlocked: false,
      x: rnd(20, area.clientWidth-80),
      y: rnd(20, area.clientHeight-110),
      vx: (Math.random()<0.5?-1:1)*c.lockSpeed,
      vy: (Math.random()<0.5?-1:1)*c.lockSpeed
    });
  });

  colors.forEach(col=>{
    const el = document.createElement("div");
    el.className = "key";
    el.textContent = "🔑";
    el.style.color = col;
    el.style.fontSize = c.iconSize+"px";
    area.appendChild(el);

    keys.push({
      el,
      color: col,
      collected: false,
      dragging: false,
      x: rnd(20, area.clientWidth-80),
      y: rnd(20, area.clientHeight-110),
      vx: (Math.random()<0.5?-1:1)*c.keyDrift,
      vy: (Math.random()<0.5?-1:1)*c.keyDrift,
      dragDX:0,
      dragDY:0
    });

    el.addEventListener("pointerdown", e=>{
      const k = keys.find(k=>k.el===el);
      if(!k || k.collected) return;
      k.dragging = true;
      el.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      k.dragDX = e.clientX - rect.left;
      k.dragDY = e.clientY - rect.top;
    });

    el.addEventListener("pointermove", e=>{
      const k = keys.find(k=>k.el===el);
      if(!k || !k.dragging || k.collected) return;
      const bounds = area.getBoundingClientRect();
      let nx = e.clientX - bounds.left - k.dragDX;
      let ny = e.clientY - bounds.top - k.dragDY;
      nx = clamp(nx,0,area.clientWidth - el.offsetWidth);
      ny = clamp(ny,0,area.clientHeight - el.offsetHeight);
      k.x = nx; k.y = ny;
      el.style.left = nx+"px";
      el.style.top = ny+"px";
      checkCollisionsWhileDragging(k, cue);
    });

    el.addEventListener("pointerup", e=>{
      const k = keys.find(k=>k.el===el);
      if(!k || !k.dragging) return;
      k.dragging = false;
      el.releasePointerCapture(e.pointerId);
      const L = overlappingLock(k);
      if(L && !L.unlocked){
        if(isCorrectMatch(k, L, cue)){
          handleCorrect(k, L);
        } else {
          handleWrongTouch(L);
        }
      }
    });
  });

  startTimer();
  loop(cue);
}

function clearLevel(){
  cancelAnimationFrame(rafId);
  clearInterval(timerId);
  area.innerHTML = "";
}

function overlappingLock(keyObj){
  const kb = keyObj.el.getBoundingClientRect();
  for(const L of locks){
    if(L.unlocked) continue;
    const lb = L.el.getBoundingClientRect();
    const overlap = !(kb.right < lb.left || kb.left > lb.right || kb.bottom < lb.top || kb.top > lb.bottom);
    if(overlap) return L;
  }
  return null;
}

function isCorrectMatch(keyObj, lockObj, cue) {
  // Always allow correct color-to-lock match
  if (keyObj.color === lockObj.color) return true;

  // Cue rules add extra correctness, but do not block correct matches
  if (cue.type === "color") return keyObj.color === cue.color;

  if (cue.type === "math") {
    const ansColor = getColorByIndex(cue.answer);
    return keyObj.color === ansColor;
  }

  if (cue.type === "shape") return keyObj.color === lockObj.color;

  return false;
}

  return keyObj.color === lockObj.color;
}

function getColorByIndex(i){
  return COLOR_SET[i % COLOR_SET.length];
}

function handleWrongTouch(lock){
  lock.el.classList.remove("hit");
  void lock.el.offsetWidth;
  lock.el.classList.add("hit");
  wrongTouches++;
  score = Math.max(0, score - 5);
  scoreEl.textContent = score;
}

function handleCorrect(keyObj, lockObj){
  lockObj.unlocked = true;
  lockObj.el.textContent = "✅";
  lockObj.el.classList.add("correct-pop");
  keyObj.collected = true;
  keyObj.el.style.opacity = .2;
  correctDrops++;
  score += 40 + Math.round(timeLeft*0.8) + level*2;
  scoreEl.textContent = score;

  completedInLevel++;
  if(completedInLevel >= targetPairs){
    saveTreeUnlock(level);
    if(level < 10){
      level++;
      setTimeout(()=>buildLevel(level), 900);
    } else {
      endSession();
    }
  }
}

function checkCollisionsWhileDragging(keyObj, cue){
  const L = overlappingLock(keyObj);
  if(L && !L.unlocked && !isCorrectMatch(keyObj, L, cue)){
    L.el.classList.remove("hit");
    void L.el.offsetWidth;
    L.el.classList.add("hit");
  }
}

function startTimer(){
  timerId = setInterval(()=>{
    timeLeft--;
    totalTime++;
    timerEl.textContent = timeLeft;
    if(timeLeft<=0){
      endSession();
    }
  },1000);
}

function loop(cue){
  const c = cfg(level);

  locks.forEach(L=>{
    if(L.unlocked) return;
    L.x += L.vx;
    L.y += L.vy;
    const maxX = area.clientWidth - L.el.offsetWidth;
    const maxY = area.clientHeight - L.el.offsetHeight;
    if(L.x<=0 || L.x>=maxX) L.vx*=-1;
    if(L.y<=0 || L.y>=maxY) L.vy*=-1;
    L.x = clamp(L.x,0,maxX);
    L.y = clamp(L.y,0,maxY);
    L.el.style.left = L.x+"px";
    L.el.style.top = L.y+"px";
  });

  keys.forEach(K=>{
    if(K.collected || K.dragging) return;
    if(c.keyDrift>0){
      K.x += K.vx;
      K.y += K.vy;
      const maxX = area.clientWidth - K.el.offsetWidth;
      const maxY = area.clientHeight - K.el.offsetHeight;
      if(K.x<=0 || K.x>=maxX) K.vx*=-1;
      if(K.y<=0 || K.y>=maxY) K.vy*=-1;
      K.x = clamp(K.x,0,maxX);
      K.y = clamp(K.y,0,maxY);
      K.el.style.left = K.x+"px";
      K.el.style.top = K.y+"px";
    }
  });

  const attempts = correctDrops + wrongTouches;
  const acc = attempts ? Math.round((correctDrops/attempts)*100) : 100;
  accEl.textContent = acc+"%";

  rafId = requestAnimationFrame(()=>loop(cue));
}

function endSession(){
  clearInterval(timerId);
  cancelAnimationFrame(rafId);

  const attempts = correctDrops + wrongTouches;
  const acc = attempts ? Math.round((correctDrops/attempts)*100) : 100;

  finalScoreEl.textContent = score;
  finalLevelsEl.textContent = level;
  finalAccEl.textContent = acc+"%";
  finalTimeEl.textContent = totalTime;

  saveSession({
    when: new Date().toISOString(),
    score,
    levelsCompleted: level,
    accuracy: acc,
    timeSec: totalTime,
    correct: correctDrops,
    wrong: wrongTouches
  });

  endScreen.classList.remove("hidden");
}

function saveTreeUnlock(level){
  const key = "forest_tree_lit_branches";
  const arr = JSON.parse(localStorage.getItem(key) || "[]");
  if(!arr.includes(level)) arr.push(level);
  localStorage.setItem(key, JSON.stringify(arr));
}

function saveSession(entry){
  const KEY="stroke_therapy_sessions_v1";
  const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
  arr.push(entry);
  localStorage.setItem(KEY, JSON.stringify(arr));
}

function hardReset(){
  endScreen.classList.add("hidden");
  score = 0;
  level = 1;
  totalTime = 0;
  correctDrops = 0;
  wrongTouches = 0;
  scoreEl.textContent = score;
  buildLevel(level);
}

startBtn.addEventListener("click", ()=>{
  startScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  gameContainer.classList.remove("hidden");
  hardReset();
});

backButton.addEventListener("click", () => {
    window.location = "/";
})

setupLevel();
