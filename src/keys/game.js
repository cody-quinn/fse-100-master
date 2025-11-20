let level = 1;
let score = 0;
let time = 0;
let correct = 0;
let total = 0;

let timerInterval;
let keys = [];
let locks = [];

const neonColors = ["neon-pink", "neon-blue", "neon-green", "neon-yellow"];
const gameArea = document.getElementById("game-area");

/* UPDATE TEXT */
function updateStats() {
    document.getElementById("level").textContent = `Level: ${level}`;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("time").textContent = `Time: ${time}s`;
    const accuracy = total === 0 ? 100 : Math.round((correct / total) * 100);
    document.getElementById("accuracy").textContent = `Accuracy: ${accuracy}%`;
}

/* TIMER */
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time++;
        updateStats();
    }, 1000);
}

/* CLEAR */
function clearGameArea() {
    keys = [];
    locks = [];
    gameArea.innerHTML = "";
}

/* RANDOM PIXEL POSITION INSIDE GAME-AREA */
function randomPixelPos() {
    const area = gameArea.getBoundingClientRect();
    return {
        x: Math.random() * (area.width - 100),
        y: Math.random() * (area.height - 100)
    };
}

/* SMOOTH DRIFTING MOTION */
function smoothDrift(el) {
    let speed = 0.4 + Math.random() * 0.4;
    let angle = Math.random() * Math.PI * 2;

    function move() {
        const area = gameArea.getBoundingClientRect();
        const rect = el.getBoundingClientRect();

        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;

        let newX = rect.left - area.left + dx;
        let newY = rect.top - area.top + dy;

        const size = 65; // element size

        if (newX < 0 || newX > area.width - size) {
            angle = Math.PI - angle;
        }
        if (newY < 0 || newY > area.height - size) {
            angle = -angle;
        }

        el.style.left = Math.max(0, Math.min(newX, area.width - size)) + "px";
        el.style.top = Math.max(0, Math.min(newY, area.height - size)) + "px";

        requestAnimationFrame(move);
    }

    move();
}

/* SPAWN OBJECTS */
function spawnObjects() {
    const numPairs = Math.min(3 + level, 6);

    for (let i = 0; i < numPairs; i++) {
        let colorClass = neonColors[i % neonColors.length];

        const key = document.createElement("div");
        key.classList.add("key", colorClass);
        key.textContent = "🗝️";

        const lock = document.createElement("div");
        lock.classList.add("lock", colorClass);
        lock.textContent = "🔒";

        const kp = randomPixelPos();
        const lp = randomPixelPos();

        key.style.left = kp.x + "px";
        key.style.top = kp.y + "px";

        lock.style.left = lp.x + "px";
        lock.style.top = lp.y + "px";

        gameArea.appendChild(key);
        gameArea.appendChild(lock);

        keys.push(key);
        locks.push(lock);

        enableDrag(key);
        smoothDrift(lock);
    }
}

/* DRAGGING */
function enableDrag(key) {
    let offsetX, offsetY;

    key.onmousedown = (e) => {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        key.style.cursor = "grabbing";

        document.onmousemove = (move) => {
            const area = gameArea.getBoundingClientRect();
            let newX = move.pageX - area.left - offsetX;
            let newY = move.pageY - area.top - offsetY;

            newX = Math.max(0, Math.min(newX, area.width - 65));
            newY = Math.max(0, Math.min(newY, area.height - 65));

            key.style.left = newX + "px";
            key.style.top = newY + "px";

            checkMatch(key);
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            key.style.cursor = "grab";
        };
    };
}

/* MATCHING */
function checkMatch(key) {
    locks.forEach(lock => {
        const kRect = key.getBoundingClientRect();
        const lRect = lock.getBoundingClientRect();

        const overlapping = !(
            kRect.right < lRect.left ||
            kRect.left > lRect.right ||
            kRect.bottom < lRect.top ||
            kRect.top > lRect.bottom
        );

        if (overlapping) {
            total++;

            if (key.classList[1] === lock.classList[1]) {
                correct++;
                score += 10;

                key.classList.add("sparkle");
                lock.classList.add("sparkle");

                setTimeout(() => {
                    key.remove();
                    lock.remove();
                }, 300);

                keys = keys.filter(k => k !== key);
                locks = locks.filter(l => l !== lock);

                if (keys.length === 0) {
                    level++;
                    setTimeout(startGame, 500);
                }
            } else {
                score -= 2;
            }

            updateStats();
        }
    });
}

/* START GAME */
function startGame() {
    clearGameArea();
    updateStats();
    startTimer();
    spawnObjects();
}

document.getElementById("restart").onclick = () => {
    level = 1;
    score = 0;
    time = 0;
    correct = 0;
    total = 0;
    startGame();
};

startGame();
