"use strict";

function incorrectGuess(message) {
    if (score === 1) {
        setTextContentToSelector("You are lost!", ".message");
        setTextContentToSelector(secretNumber, ".number");
        setBackgroundColorToBody("#7C0B00");
        document.querySelector(".check").disabled = true;
    } else {
        setTextContentToSelector(message, ".message");
    }
    score--;
    setTextContentToSelector(score, ".score");
}

function setTextContentToSelector(content, selector) {
    document.querySelector(selector).textContent = content;
}

function setBackgroundColorToBody(value) {
    document.querySelector("body").style.backgroundColor = value;
}

let secretNumber = Math.ceil(Math.random() * 20);
let highScore = 0;
let score = 10;
setTextContentToSelector(score, ".score");

document.querySelector(".check").addEventListener("click", function () {
    const guess = Number(document.querySelector(".guess").value);

    if (!guess) {
        setTextContentToSelector("No inputted value", ".message");
    } else if (guess === secretNumber) {
        setTextContentToSelector("Correct number!", ".message");
        setTextContentToSelector(secretNumber, ".number");
        setBackgroundColorToBody("#60b347");
        document.querySelector(".check").disabled = true;
        if (score > highScore) {
            highScore = score;
            setTextContentToSelector(highScore, ".highscore");
        }
    } else if (guess !== secretNumber) {
        incorrectGuess(guess < secretNumber ? "Too low" : "Too high");
    }
});

document.querySelector(".again").addEventListener("click", function () {
    secretNumber = Math.ceil(Math.random() * 20);
    score = 10;
    setTextContentToSelector(score, ".score");
    setTextContentToSelector("Start guessing...", ".message");
    setTextContentToSelector("?", ".number");
    setBackgroundColorToBody("#222");
    document.querySelector(".guess").value = '';
    document.querySelector(".check").disabled = false;
})