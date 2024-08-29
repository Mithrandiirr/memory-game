import { HEART_PATH, SVG_ATTRIBUTES, TILES_PER_ROW } from "./constants.js";

export default class Board {
  #cells;
  #hearts;
  #level;
  #grid;

  constructor(hearts) {
    this.#hearts = hearts;
    this.#cells = Array(9).fill(false);
    this.setAttributeCells();
    this.addClickEventHandlers();
    this.setCoundownTimer();
    this.setHearts();
    this.#level = 1;
    this.#grid = 3;
  }

  getRandomCellIndex() {
    const arr = Array(9).fill(false);
    const indexes = new Set();
    while (indexes.size < 3) {
      const randomIndex = Math.floor(Math.random() * 9);
      indexes.add(randomIndex);
    }
    for (const index of indexes) {
      arr[index] = true;
    }
    return arr;
  }

  setAttributeCells() {
    const gridItems = document.querySelectorAll(".grid-item");
    this.#cells = this.getRandomCellIndex();
    this.#cells.forEach((cell, index) => {
      if (cell) {
        const gridItem = gridItems[index];
        gridItem.setAttribute("data-memory", "true");

        setTimeout(() => {
          gridItem.removeAttribute("data-memory");
        }, 400);
      }
    });
  }

  unsetAttributeCells() {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((gridItem) => {
      gridItem.removeAttribute("data-memory");
    });
  }

  get cells() {
    return this.#cells;
  }

  get hearts() {
    return this.#hearts;
  }

  addClickEventHandlers() {
    // A variable that stores the number of correct tiles clicked
    let correctTiles = 0;

    // A variable that stores the number of tiles clicked
    let clickedTiles = 0;

    const gridItems = document.querySelectorAll(".grid-item");

    gridItems.forEach((button, index) => {
      button.addEventListener("click", () => {
        clickedTiles++;

        if (clickedTiles <= 3) {
          if (this.#cells[index]) {
            this.revealTile(button, true);
            // Increment the correct tiles count
            correctTiles++;
          } else {
            this.revealTile(button, false);
          }
        } else {
          return;
        }
        // Check if the user has won or lost the game
        this.checkGameStatus(correctTiles, clickedTiles);
      });
    });
  }

  revealTile(button, isCorrect) {
    // If the tile is correct
    if (isCorrect) {
      // Set the background color to green
      button.setAttribute("data-memory", true);
    } else {
      // Set the background color to red
      button.setAttribute("data-memory", false);
    }
  }

  checkGameStatus(correctTiles, clickedTiles) {
    // If the correct tiles count is equal to the tiles per row
    if (correctTiles === TILES_PER_ROW) {
      // Display the win message
      console.log("You win!");
      // Reset the game
      this.resetGame();
    } else if (clickedTiles === TILES_PER_ROW && correctTiles < TILES_PER_ROW) {
      // Decrement the hearts count
      // Display the lose message
      this.handleLost();
    }
  }

  resetGame() {
    // Reset the attributes of the grid items after 1s
    setTimeout(() => {
      this.unsetAttributeCells();
    }, 400);
  }

  revealCorrectTiles() {
    const gridItems = document.querySelectorAll(".grid-item");
    this.#cells.map((cell, index) => {
      if (cell) {
        const gridItem = gridItems[index];
        gridItem.setAttribute("data-memory", "true");

        setTimeout(() => {
          gridItem.removeAttribute("data-memory");
        }, 400);
      }
    });
  }

  handleLost() {
    this.#hearts--;
    this.setHearts();

    this.revealCorrectTiles();

    this.#cells.fill(false);

    this.resetGame();
  }

  setCoundownTimer() {
    let countdownTime = 4;

    // Set the initial width of the countdown div to 100%
    const countdownElement = document.querySelector(".countdown");
    console.log(countdownElement);
    const containerWidth = countdownElement.parentElement.clientWidth; // Get the width of the countdown container

    // Calculate the width decrease per second
    const widthDecrease = containerWidth / countdownTime;
    const countdown = setInterval(() => {
      // Decrease the countdown time by 1 second
      countdownTime--;

      // Calculate the new width of the countdown div
      const newWidth = countdownElement.clientWidth - widthDecrease;
      countdownElement.style.width = newWidth + "px";
      console.log(countdownTime);
      // If the countdown reaches zero, display a message
      if (countdownTime === 0) {
        clearInterval(countdown);
        countdownElement.style.width = "0"; // Set width to 0 when countdown is over
        this.handleLost();
      }
    }, 1000);
  }

  removeChildWithFlicker(child) {
    const flickerDuration = 100; // Duration of each flicker in milliseconds
    const flickerCount = 4; // Number of flickers

    let flickerInterval = setInterval(() => {
      child.style.opacity = child.style.opacity === "0" ? "1" : "0"; // Toggle opacity
    }, flickerDuration);

    setTimeout(() => {
      clearInterval(flickerInterval);
      child.remove();
    }, flickerDuration * flickerCount);
  }

  setHearts() {
    // Get the hearts container
    const heartsContainer = document.querySelector(".hearts");

    // Remove all the existing children of the hearts container
    const existingChildren = Array.from(heartsContainer.children);
    existingChildren.forEach((child) => {
      this.removeChildWithFlicker(child);
    });

    // Loop through the number of hearts
    for (let i = 0; i < this.#hearts; i++) {
      // Create and append an SVG element with the heart path
      this.createAndAppendSvg(heartsContainer, HEART_PATH);
    }
  }

  // A helper function that creates and appends an SVG element with a given path
  createAndAppendSvg(container, path) {
    // Create a new SVG element
    let svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    // Set the attributes of the SVG element from the constant
    for (let key in SVG_ATTRIBUTES) {
      svgElement.setAttribute(key, SVG_ATTRIBUTES[key]);
    }

    // Create the path element
    let pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    // Set the attributes of the path element
    pathElement.setAttribute("d", path);
    pathElement.setAttribute("fill-rule", "nonzero");

    // Append the path element to the SVG element
    svgElement.appendChild(pathElement);

    // Append the SVG element to the container
    container.appendChild(svgElement);
  }
}
