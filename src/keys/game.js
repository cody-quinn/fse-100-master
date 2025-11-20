let level = 1;
let score = 0;
let time = 0;
let correct = 0;
let total = 0;

let timerInterval;
let keys = [];
let locks = [];

const gameArea = document.getElementById("game-area");

/* UI Update */
function updateStats() {
    document.getElementById("level").textContent = `Level: ${level}`;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("time").textContent = `Time: ${time}s`;
    const accuracy =
        total === 0 ? 100 : Math.round((correct / total) * 100);
    document.getElementById("accuracy").textContent = `Accuracy: ${accuracy}%`;
}

/* Timer */
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time++;
        updateStats();
    }, 1000);
}

/* Clear */
function clearGameArea() {
    keys = [];
    locks = [];
    gameArea.innerHTML = "";
}

/* Random spawn */
function randomPos() {
    return {
        x: Math.random() * 80 + 5,
        y: Math.random() * 70 + 10
    };
}

/* Color filter map */
const filters = {
    red: "hue-rotate(0deg)",
    blue: "hue-rotate(200deg)",
    green: "hue-rotate(120deg)",
    yellow: "hue-rotate(60deg)",
    purple: "hue-rotate(280deg)",
    orange: "hue-rotate(30deg)",
    pink: "hue-rotate(320deg)",
    cyan: "hue-rotate(160deg)"
};

/* Spawn objects */
/* Spawn objects */
function spawnObjects() {
    const numPairs = Math.min(3 + level, 8);
    const colorList = ["red","blue","green","yellow","purple","orange","pink","cyan"];

    for (let i = 0; i < numPairs; i++) {
        const color = colorList[i];

        const key = document.createElement("div");
        key.classList.add("key");
        key.dataset.color = color;
        key.innerHTML = "🔑";

        const lock = document.createElement("div");
        lock.classList.add("lock", "drift");
        lock.dataset.color = color;
        lock.innerHTML = "🔒";

        /* Color filters */
        const filters = {
            red: "hue-rotate(0deg)",
            blue: "hue-rotate(200deg)",
            green: "hue-rotate(120deg)",
            yellow: "hue-rotate(60deg)",
            purple: "hue-rotate(280deg)",
            orange: "hue-rotate(30deg)",
            pink: "hue-rotate(320deg)",
            cyan: "hue-rotate(160deg)"
        };

        key.style.filter = filters[color];
        lock.style.filter = filters[color];

        const kp = randomPos();
        const lp = randomPos();

        key.style.left = kp.x + "vw";
        key.style.top = kp.y + "vh";

        lock.style.left = lp.x + "vw";
        lock.style.top = lp.y + "vh";

        gameArea.appendChild(key);
        gameArea.appendChild(lock);

        keys.push(key);
        locks.push(lock);

        enableDrag(key);
    }
}


/* Drag */
function enableDrag(key) {
    let offsetX, offsetY;

    key.onmousedown = (e) => {
        offsetX = e.offsetX;
        offsetY = e.offsetY;

        document.onmousemove = (move) => {
            key.style.left = move.pageX - offsetX + "px";
            key.style.top  = move.pageY - offsetY + "px";
            checkMatch(key);
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

/* Collision + match logic */
function checkMatch(key) {
    locks.forEach(lock => {
        const kRect = key.getBoundingClientRect();
        const lRect = lock.getBoundingClientRect();

        const overlap = !(
            kRect.right < lRect.left ||
            kRect.left > lRect.right ||
            kRect.bottom < lRect.top ||
            kRect.top > lRect.bottom
        );

        if (overlap) {
            total++;

            if (key.dataset.color === lock.dataset.color) {
                correct++;
                score += 10;

                key.classList.add("match");
                lock.classList.add("match");

                setTimeout(() => {
                    key.remove();
                    lock.remove();
                }, 250);

                keys = keys.filter(k => k !== key);
                locks = locks.filter(l => l !== lock);

                if (keys.length === 0) nextLevel();
            }

            updateStats();
        }
    });
}

/* Level progression */
function nextLevel() {
    level++;
    clearGameArea();
    spawnObjects();
}

/* Restart */
document.getElementById("restart").onclick = () => {
    level = 1;
    score = 0;
    time = 0;
    correct = 0;
    total = 0;

    clearGameArea();
    spawnObjects();
    startTimer();
    updateStats();
};

/* Start */
spawnObjects();
startTimer();
updateStats();
