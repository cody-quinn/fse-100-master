const FLASH_DURATION = 500;
const FLASH_INTERVAL = 200;

const FEEDBACK_FLASH_DURATION = 150;

const gridElement = document.getElementById("simon-grid");

const roundElement = document.getElementById("simon-round");
const statusElement = document.getElementById("simon-status");

/** @type {HTMLButtonElement[]} */
const blocks = Array.from(document.querySelectorAll("#simon-grid > button"));

/** @type {HTMLButtonElement} */
const startButton = document.getElementById("start-button");

/** @type {HTMLButtonElement} */
const exitButton = document.getElementById("exit-button");

/** @type {HTMLButtonElement} */
const leaderboardButton = document.getElementById("leaderboard-button");

let started = false;
let acceptingInput = false;

let pattern = [];
let patternLength = 3;

let patternPosition = 0;

function playGame(ev) {
  if (started) {
    return;
  }

  startButton.disabled = true;
  started = true;

  pattern = [];
  patternLength = 3;

  playRound();
}

function playRound() {
  for (let i = pattern.length; i < patternLength; i++) {
    const block = blocks[Math.floor(Math.random() * blocks.length)];
    pattern.push(block);
  }

  let i = 0;
  const interval = setInterval(() => {
    const block = pattern[i++];
    block.className = "simon-flash";
    setTimeout(() => (block.className = ""), FLASH_DURATION);

    if (i === pattern.length) {
      setTimeout(() => (acceptingInput = true), FLASH_DURATION);
      clearInterval(interval);
    }
  }, FLASH_DURATION + FLASH_INTERVAL);
}

/**
 * @param ev {MouseEvent & {target: HTMLButtonElement}}
 */
function blockClicked(ev) {
  const block = ev.target;
  if (!acceptingInput) return;

  console.log(`Clicked (${patternPosition}): ${ev.target}`);
  if (pattern[patternPosition++] === block) {
    // The block clicked and the next block in the pattern match. The correct one was pressed
    block.className = "simon-flash-correct";
    setTimeout(() => (block.className = ""), FEEDBACK_FLASH_DURATION);
  } else {
    // The wrong block was clicked. Game should reset and a game lost screen should appear
    //
  }

  if (patternPosition == patternLength) {
    //
  }
}

function resetGame() {
  started = false;
  startButton.disabled = false;
}

// Add event handlers
blocks.forEach((item) => (item.onclick = blockClicked));
startButton.onclick = playGame;

exitButton.onclick = () => {
  window.location = "/";
};
