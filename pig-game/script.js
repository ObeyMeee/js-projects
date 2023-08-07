'use strict';

const diceImg = document.querySelector(".dice");
const btnHold = document.querySelector(".btn--hold");
const btnNewGame = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");


let scores;
let currentPlayer;
let currentScore;

const init = function () {
    scores = [0, 0];
    currentPlayer = 0;
    currentScore = 0;
    diceImg.classList.add("hidden");
    document.querySelector("#score--0").textContent = 0;
    document.querySelector("#score--1").textContent = 0;
    document.querySelector("#current--0").textContent = 0;
    document.querySelector("#current--1").textContent = 0;

    disableButtons(false);
    const player0 = document.querySelector(".player--0");
    const player1 = document.querySelector(".player--1");
    player0.classList.add("player--active");
    player1.classList.remove("player--active");
    player0.classList.remove("player--winner");
    player1.classList.remove("player--winner");
    diceImg.classList.add("hidden");
}

function disableButtons(disabled) {
    btnRoll.disabled = disabled;
    btnHold.disabled = disabled;
}

function switchPlayer() {
    document.querySelector(`#current--${currentPlayer}`).textContent = 0;
    document.querySelector(`.player--${currentPlayer}`).classList.remove("player--active");
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    document.querySelector(`.player--${currentPlayer}`).classList.add("player--active");
    currentScore = 0;
}

init();
btnRoll.addEventListener("click", function () {
    const dice = Math.ceil(Math.random() * 6);
    diceImg.src = `images/dice-${dice}.png`;
    diceImg.classList.remove("hidden");
    if (dice === 1) {
        switchPlayer();
    } else {
        currentScore += dice;
        document.querySelector(`#current--${currentPlayer}`).textContent = currentScore;
    }
});

btnHold.addEventListener("click", function () {
    scores[currentPlayer] += currentScore;
    const currentPlayerScores = scores[currentPlayer];
    document.querySelector(`#score--${currentPlayer}`).textContent = currentPlayerScores;
    if (currentPlayerScores >= 100) {
        document.querySelector(`.player--active`).classList.add("player--winner");
        disableButtons(true);
        diceImg.classList.remove("hidden");
    } else {
        switchPlayer();
    }
});
btnNewGame.addEventListener("click", init);