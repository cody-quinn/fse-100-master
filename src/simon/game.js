const FLASH_DURATION = 500;
const FLASH_INTERVAL = 150;

const FEEDBACK_FLASH_DURATION = 150;

const ROUND_INTERVAL = 300;

const FLASH = "simon-flash";
const FLASH_CORRECT = "simon-flash-correct";
const FLASH_INCORRECT = "simon-flash-incorrect";

const gridElement = document.getElementById("simon-grid");

const roundElement = document.getElementById("simon-round");
const statusElement = document.getElementById("simon-status");

/** @type {HTMLButtonElement[]} */
const blocks = Array.from(document.querySelectorAll("#simon-grid > button"));

/** @type {HTMLButtonElement} */
const startButton = document.getElementById("start-button");

/** @type {HTMLButtonElement} */
const exitButton = document.getElementById("exit-button");
exitButton.onclick = () => {
  window.location = "/";
};

/** @type {HTMLButtonElement} */
const leaderboardButton = document.getElementById("leaderboard-button");

class Game {
  constructor() {
    /** @type {"initialized" | "computer" | "player" | "lost"} */
    this.stage = "initialized";
    /** @type {HTMLButtonElement[]} */
    this.pattern = [];
    this.round = 0;

    this.expandPattern(2);
  }

  async beginGame() {
    if (this.stage != "initialized") {
      console.error("Attempted to start already started game");
      return;
    }

    while (this.stage != "lost") {
      // Prepare for next round
      this.round++;
      this.expandPattern();
      this.updateLabels();

      await this.beginRound();
      await sleep(ROUND_INTERVAL);
    }
  }

  async beginRound() {
    this.stage = "computer";
    for (const block of this.pattern) {
      block.classList.add(FLASH);
      await sleep(FLASH_DURATION);
      block.classList.remove(FLASH);
      await sleep(FLASH_INTERVAL);
    }

    this.stage = "player";
    /** @type {Promise<void>[]} */
    let feedbackFlashes = [];
    for (let i = 0; i < this.pattern.length; i++) {
      const expected = this.pattern[i];
      const block = await blockClicked();

      if (expected == block) {
        feedbackFlashes.push(
          (async () => {
            block.classList.add(FLASH_CORRECT);
            await sleep(FEEDBACK_FLASH_DURATION);
            block.classList.remove(FLASH_CORRECT);
          })(),
        );
      } else {
        feedbackFlashes.push(
          (async () => {
            block.classList.add(FLASH_INCORRECT);
            await sleep(FEEDBACK_FLASH_DURATION);
            block.classList.remove(FLASH_INCORRECT);
          })(),
        );

        this.stage = "lost";
        break;
      }
    }

    await Promise.all(feedbackFlashes);
  }

  /**
   * @param {number?} desiredLength
   */
  expandPattern(desiredLength = null) {
    if (desiredLength == null) {
      desiredLength = this.pattern.length + 1;
    }

    const currentLength = this.pattern.length;
    for (let i = currentLength; i < desiredLength; i++) {
      const next = blocks[Math.floor(Math.random() * blocks.length)];
      this.pattern.push(next);
    }
  }

  updateLabels() {
    roundElement.innerText = `Round ${this.round}`;
    statusElement.innerText = "Playing";
  }

  // Singleton related activities

  /** @type {Game?} */
  static instance = null;

  static async startNewGame() {
    if (Game.instance != null && instance.stage != "lost") {
      console.error(
        "Attempted to start a new game when a existing game is already ongoing",
      );
      return;
    }

    Game.instance = new Game();
    startButton.disabled = true;
    await Game.instance.beginGame();
    startButton.disabled = false;
  }
}

/** @returns {Promise<HTMLButtonElement>} */
function blockClicked() {
  return new Promise((resolve) => {
    /** @param ev {MouseEvent & {target: HTMLButtonElement}} */
    function clicked(ev) {
      resolve(ev.target);
    }

    for (const block of blocks) {
      block.onclick = clicked;
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

startButton.onclick = Game.startNewGame;
