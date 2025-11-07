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

function setupLevel() {
    keyholesContainer.innerHTML = "";
    completed = 0;

    const numLocks = Math.min(level + 1, 10);
    for (let i = 0; i < numLocks; i++) {
        const lock = document.createElement("div");
        lock.textContent = "🔒";
        lock.classList.add("keyhole");

        // make some locks move at higher levels
        if (level > 2 && Math.random() < level * 0.1) {
            lock.classList.add("moving");
        }

        // randomize slight position to make the layout less static
        lock.style.marginTop = `${Math.random() * 20 - 10}px`;
        lock.style.marginLeft = `${Math.random() * 10 - 5}px`;

        keyholesContainer.appendChild(lock);
    }

    makeKeyDraggable();
    animateLocks();
}

function makeKeyDraggable() {
    const keyholes = document.querySelectorAll(".keyhole");

    keyholes.forEach((hole) => {
        hole.addEventListener("dragover", (e) => e.preventDefault());
        hole.addEventListener("drop", (e) => {
            e.preventDefault();
            if (hole.textContent === "🔒") {
                hole.textContent = "✅";
                hole.style.transform = "scale(1.3)";
                setTimeout(() => (hole.style.transform = "scale(1)"), 300);
                score += 10;
                completed++;
                scoreDisplay.textContent = score;
                checkLevelComplete();
            }
        });
    });

    key.addEventListener("dragstart", () => (key.style.opacity = "0.5"));
    key.addEventListener("dragend", () => (key.style.opacity = "1"));
}

function checkLevelComplete() {
    const keyholes = document.querySelectorAll(".keyhole");
    if (completed === keyholes.length) {
        if (level < totalLevels) {
            level++;
            levelDisplay.textContent = level;
            setTimeout(setupLevel, 1000);
        } else {
            alert(`🎉 You completed all ${totalLevels} levels!\nFinal Score: ${score}`);
        }
    }
}

function animateLocks() {
    // gradually move keyholes side to side at higher levels
    const locks = document.querySelectorAll(".keyhole");
    locks.forEach((lock, index) => {
        if (level >= 5) {
            const range = level * 2;
            const speed = 1 + Math.random() * 0.5;
            setInterval(() => {
                const offset = Math.sin(Date.now() / (500 / speed) + index) * range;
                lock.style.transform = `translateX(${offset}px)`;
            }, 50);
        }
    });
}

restartButton.addEventListener("click", () => {
    level = 1;
    score = 0;
    completed = 0;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    setupLevel();
});

backButton.addEventListener("click", () => {
    window.location = "/";
})

setupLevel();
