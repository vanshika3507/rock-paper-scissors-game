const choices = document.querySelectorAll(".choice");
const userScoreEl = document.getElementById("user-score");
const compScoreEl = document.getElementById("comp-score");
const statusText = document.getElementById("status-text");
const resultMsg = document.getElementById("result-msg");
const restartBtn = document.getElementById("restart-btn");
const themeToggle = document.getElementById("theme-toggle");
const highScoreEl = document.getElementById("high-score");

let userScore = 0;
let compScore = 0;
let round = 1;
let maxRounds = 3;
let inTieBreaker = false;

// === BEST SCORE ===
let bestScore = localStorage.getItem("bestScore")
  ? parseInt(localStorage.getItem("bestScore"))
  : 0;
highScoreEl.textContent = bestScore;

// === COMPUTER CHOICE ===
const options = ["rock", "paper", "scissors"];
function getComputerChoice() {
  return options[Math.floor(Math.random() * 3)];
}

// === MAIN GAME LOGIC ===
function playRound(userChoice) {
  if (round > maxRounds) return;

  const compChoice = getComputerChoice();

  if (userChoice === compChoice) {
    resultMsg.textContent = `🤝 It's a tie! Both chose ${userChoice.toUpperCase()}`;
    resultMsg.style.color = "orange";
  } else if (
    (userChoice === "rock" && compChoice === "scissors") ||
    (userChoice === "paper" && compChoice === "rock") ||
    (userChoice === "scissors" && compChoice === "paper")
  ) {
    userScore++;
    userScoreEl.textContent = userScore;
    resultMsg.textContent = `🔥 You win! ${userChoice.toUpperCase()} beats ${compChoice.toUpperCase()}!`;
    resultMsg.style.color = "#00a550";
  } else {
    compScore++;
    compScoreEl.textContent = compScore;
    resultMsg.textContent = `💀 You lose! ${compChoice.toUpperCase()} beats ${userChoice.toUpperCase()}!`;
    resultMsg.style.color = "#e63946";
  }

  // ✅ If 3 rounds completed
  if (round === 3 && !inTieBreaker) {
    if (userScore === compScore) {
      // activate tie breaker
      inTieBreaker = true;
      maxRounds = 4;
      statusText.textContent = "⚡ Tie Breaker Round!";
      resultMsg.textContent = "It's a draw! Let's settle this once and for all!";
      resultMsg.style.color = "#ffb703";
      round++; // move to round 4 (tie-breaker)
    } else {
      declareWinner();
      return;
    }
  } 
  // ✅ If we’re in tie-breaker round
  else if (inTieBreaker && round === 4) {
    declareWinner();
    return;
  } 
  else {
    round++;
    statusText.textContent = `⚔️ Round ${round} – Make Your Move`;
  }
}

// === DECLARE WINNER ===
function declareWinner() {
  let finalMsg = "";
  if (userScore > compScore) {
    finalMsg = `🏆 You won the match ${userScore} - ${compScore}!`;
    resultMsg.style.color = "#00ff7f";
  } else if (compScore > userScore) {
    finalMsg = `😔 You lost the match ${userScore} - ${compScore}.`;
    resultMsg.style.color = "#ff4d4d";
  } else {
    finalMsg = `🤝 Match Drawn!`;
    resultMsg.style.color = "#ffb703";
  }

  resultMsg.textContent = finalMsg;
  statusText.textContent = "🎯 Match Over";

  if (userScore > bestScore) {
    bestScore = userScore;
    localStorage.setItem("bestScore", bestScore);
    highScoreEl.textContent = bestScore;
  }

  choices.forEach(choice => (choice.style.pointerEvents = "none"));
  restartBtn.style.display = "inline-block";
}

// === EVENT LISTENERS ===
choices.forEach(choice => {
  choice.addEventListener("click", () => {
    playRound(choice.id);
  });
});

restartBtn.addEventListener("click", () => {
  userScore = 0;
  compScore = 0;
  round = 1;
  maxRounds = 3;
  inTieBreaker = false;
  userScoreEl.textContent = "0";
  compScoreEl.textContent = "0";
  resultMsg.textContent = "Let’s begin...";
  resultMsg.style.color = "";
  statusText.textContent = "⚔️ Round 1 – Make Your Move";
  restartBtn.style.display = "none";
  choices.forEach(choice => (choice.style.pointerEvents = "auto"));
});

// === THEME TOGGLE ===
themeToggle.addEventListener("click", () => {
  const body = document.body;
  body.classList.toggle("dark");
  body.classList.toggle("light");
  themeToggle.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
  localStorage.setItem("theme", body.className);
});

// === LOAD SAVED THEME ===
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.className = savedTheme;
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }
});
