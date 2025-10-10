const gridElement = document.getElementById("simon-grid");

const roundElement = document.getElementById("simon-round");
const statusElement = document.getElementById("simon-status");

/** @type {HTMLButtonElement[]} */
const blocks = Array.from(document.querySelectorAll("#simon-grid > button"));

/** @type {HTMLButtonElement} */
const startButton = document.getElementById("start-button");

let started = false;
let acceptingInput = false;

let pattern = [];
let patternPosition = 0;
let patternLength = 3;

function playGame(ev) {
  if (started) {
    return;
  }

  startButton.disabled = true;
  started = true;
  playRound();
}

function playRound() {
  pattern = [];
  for (let i = 0; i < patternLength; i++) {
    const block = blocks[Math.floor(Math.random() * blocks.length)];
    pattern.push(block);
  }

  let i = 0;
  const interval = setInterval(() => {
    if (i === pattern.length) {
      return clearInterval(interval);
    }

    const block = pattern[i++];
    block.className = "simon-flash";
    setTimeout(() => block.className = "", 500);
  }, 700);
}

/**
 * @param ev {MouseEvent & {target: HTMLButtonElement}}
 */
function blockClicked(ev) {
  const block = ev.target;
  if (!acceptingInput) return;
  if (pattern[patternPosition++] === block) {
    // The block clicked and the next block in the pattern match. The correct one was pressed
  } else {
    // The wrong block was clicked. Game should reset and a game lost screen should appear
  }
}

function resetGame() {
  started = false;
  startButton.disabled = false;
}

// Add event handlers
blocks.forEach(item => item.onclick = blockClicked)
startButton.onclick = playGame;
