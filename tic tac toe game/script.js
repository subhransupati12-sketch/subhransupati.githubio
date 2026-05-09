const cells = Array.from(document.querySelectorAll(".cell"));
const statusText = document.querySelector("#status");
const newRoundButton = document.querySelector("#newRound");
const resetGameButton = document.querySelector("#resetGame");
const xScoreText = document.querySelector("#xScore");
const oScoreText = document.querySelector("#oScore");
const drawScoreText = document.querySelector("#drawScore");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let roundActive = true;
let scores = {
  X: 0,
  O: 0,
  draws: 0,
};

function updateStatus(message) {
  statusText.textContent = message;
}

function updateScores() {
  xScoreText.textContent = scores.X;
  oScoreText.textContent = scores.O;
  drawScoreText.textContent = scores.draws;
}

function getWinningLine() {
  return winningLines.find((line) => {
    const [a, b, c] = line;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function setBoardDisabled(disabled) {
  cells.forEach((cell) => {
    cell.disabled = disabled || Boolean(board[Number(cell.dataset.index)]);
  });
}

function renderBoard() {
  cells.forEach((cell, index) => {
    const value = board[index];
    cell.textContent = value;
    cell.classList.toggle("x", value === "X");
    cell.classList.toggle("o", value === "O");
    cell.setAttribute("aria-label", value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`);
  });
}

function finishRound(winningLine) {
  roundActive = false;

  if (winningLine) {
    winningLine.forEach((index) => cells[index].classList.add("win"));
    scores[currentPlayer] += 1;
    updateStatus(`Player ${currentPlayer} wins!`);
  } else {
    scores.draws += 1;
    updateStatus("It's a draw!");
  }

  updateScores();
  setBoardDisabled(true);
}

function handleCellClick(event) {
  const index = Number(event.currentTarget.dataset.index);

  if (!roundActive || board[index]) {
    return;
  }

  board[index] = currentPlayer;
  renderBoard();

  const winningLine = getWinningLine();
  const boardFull = board.every(Boolean);

  if (winningLine || boardFull) {
    finishRound(winningLine);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus(`Player ${currentPlayer}'s turn`);
  setBoardDisabled(false);
}

function startNewRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  roundActive = true;
  cells.forEach((cell) => cell.classList.remove("win"));
  renderBoard();
  updateStatus("Player X's turn");
  setBoardDisabled(false);
}

function resetGame() {
  scores = {
    X: 0,
    O: 0,
    draws: 0,
  };
  updateScores();
  startNewRound();
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

newRoundButton.addEventListener("click", startNewRound);
resetGameButton.addEventListener("click", resetGame);

renderBoard();
updateScores();
setBoardDisabled(false);
