const levels = [
  { level: 1, name: 'Easy', pairs: ['🍎','🍌','🍇','🍓'], bg: '#1abc9c' },
  { level: 2, name: 'Medium', pairs: ['🍎','🍌','🍇','🍓','🍉','🍒'], bg: '#3498db' },
  { level: 3, name: 'Hard', pairs: ['🍎','🍌','🍇','🍓','🍉','🍒','🥝','🥭'], bg: '#9b59b6' },
  { level: 4, name: 'Expert', pairs: ['🍎','🍌','🍇','🍓','🍉','🍒','🥝','🥭','🥥','🥑'], bg: '#e67e22' },
  { level: 5, name: 'Master', pairs: ['🍎','🍌','🍇','🍓','🍉','🍒','🥝','🥭','🥥','🥑','🍍','🥕'], bg: '#e74c3c' },
  { level: 6, name: 'Legend', pairs: ['🍎','🍌','🍇','🍓','🍉','🍒','🥝','🥭','🥥','🥑','🍍','🥕','🥔','🌽'], bg: '#2c3e50' }
];

let currentLevel = 0;
let cardsArray = [];
let firstCard = null;
let secondCard = null;
let moves = 0;
let timer = 0;
let timerInterval = null;

const movesDisplay = document.getElementById('moves');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const gameContainer = document.getElementById('game');

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  clearInterval(timerInterval);
  timer = 0;
  timerDisplay.innerText = `Time: ${timer}s`;
  document.body.style.background = levels[currentLevel].bg;

  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.innerText = `Time: ${timer}s`;
  }, 1000);

  gameContainer.innerHTML = '';
  cardsArray = [...levels[currentLevel].pairs, ...levels[currentLevel].pairs];
  cardsArray = shuffle(cardsArray);

  let gridColumns = Math.ceil(Math.sqrt(cardsArray.length));
  gameContainer.style.gridTemplateColumns = `repeat(${gridColumns}, 100px)`;

  cardsArray.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.innerText = '';
    card.addEventListener('click', flipCard);
    gameContainer.appendChild(card);
  });

  firstCard = null;
  secondCard = null;
  moves = 0;
  movesDisplay.innerText = `Moves: ${moves}`;
  levelDisplay.innerText = `Level: ${levels[currentLevel].level} (${levels[currentLevel].name})`;
}

function flipCard() {
  if(this.classList.contains('flipped') || this.classList.contains('matched')) return;

  this.classList.add('flipped');
  this.innerText = this.dataset.symbol;

  if(!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    moves++;
    movesDisplay.innerText = `Moves: ${moves}`;
    if(firstCard.dataset.symbol === secondCard.dataset.symbol) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      resetCards();
      checkWin();
    } else {
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerText = '';
        secondCard.innerText = '';
        resetCards();
      }, 1000);
    }
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
}

function checkWin() {
  const allMatched = document.querySelectorAll('.card.matched').length;
  if(allMatched === cardsArray.length) {
    clearInterval(timerInterval);
    if(currentLevel < levels.length - 1) {
      setTimeout(() => {
        alert(`🎉 Level ${levels[currentLevel].level} (${levels[currentLevel].name}) completed in ${moves} moves and ${timer}s! Next level!`);
        currentLevel++;
        createBoard();
      }, 300);
    } else {
      setTimeout(() => {
        alert(`🏆 Congratulations! You completed all levels! Total moves: ${moves}, Time: ${timer}s!`);
        currentLevel = 0;
        createBoard();
      }, 300);
    }
  }
}

document.getElementById('restart').addEventListener('click', () => {
  createBoard();
});

createBoard();
