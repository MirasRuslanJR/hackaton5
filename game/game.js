const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
if (isMobile) {
  document.body.innerHTML = `
<div style="display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; padding: 20px; font-family: sans-serif;">
  <h2>This game is only avaiable on PC.</h2>
</div>
`;
}

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").style.display = "none";
  }, 2100);
});

const previewLeft = document.getElementById("preview-left");
const previewRight = document.getElementById("preview-right");
const characterOptions = document.querySelectorAll(".character-option");
const startButton = document.getElementById("start-game");
const player1Img = document.getElementById("player1");
const player2Img = document.getElementById("player2");
const selectMenu = document.getElementById("character-select");
const battleMenu = document.getElementById("battle");
const modal = document.getElementById("result-modal");
const text = document.getElementById("winner-text");

let selected = { 1: null, 2: null };
let player1HP = 100,
  player2HP = 100;
let player1Pos = 100,
  player2Pos = 700;
let player1Blocking = false,
  player2Blocking = false;
let lastAttackTime = 0;

function updateHPBars() {
  document.getElementById("hp1").style.width = player1HP + "%";
  document.getElementById("hp2").style.width = player2HP + "%";
}

function distance() {
  return Math.abs(player1Pos - player2Pos);
}

function attack(target, damage, isBlocking) {
  if (target === "DC") {
    if (isBlocking) damage /= 2;
    player2HP = Math.max(0, player2HP - damage);
  } else {
    if (isBlocking) damage /= 2;
    player1HP = Math.max(0, player1HP - damage);
  }
  updateHPBars();
  checkWinner();
}

function checkWinner() {
  if (player1HP <= 0 || player2HP <= 0) {
    modal.style.display = "flex";
    if (player1HP <= 0 && player2HP <= 0) {
      text.textContent = "Ничья!";
    } else if (player1HP <= 0) {
      text.textContent = "DC побеждает!";
    } else {
      text.textContent = "Marvel побеждает!";
    }
  }
}

function restartGame() {
  modal.style.display = "none";
  battleMenu.classList.add("hidden");
  selectMenu.classList.remove("hidden");
  startButton.disabled = true;
  player1HP = 100;
  player2HP = 100;
  player1Pos = 100;
  player2Pos = 700;
  updateHPBars();
  player1Img.style.left = player1Pos + "px";
  player2Img.style.left = player2Pos + "px";
  document
    .querySelectorAll(".character-option")
    .forEach((el) => el.classList.remove("selected"));
  selected = { 1: null, 2: null };
  previewLeft.innerHTML = "";
  previewRight.innerHTML = "";
  previewLeft.className = "character-preview left";
  previewRight.className = "character-preview right";
}

characterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const player = option.dataset.player;
    const imgSrc = option.dataset.img;

    selected[player] = imgSrc;

    characterOptions.forEach((o) => {
      if (o.dataset.player === player) o.classList.remove("selected");
    });
    option.classList.add("selected");
    const img = document.createElement("img");
    img.src = imgSrc;

    if (player === "1") {
      previewLeft.innerHTML = "";
      previewLeft.className = "character-preview left";
      previewLeft.appendChild(img);
      setTimeout(() => previewLeft.classList.add("show"), 50);
    } else {
      previewRight.innerHTML = "";
      previewRight.className = "character-preview right";
      previewRight.appendChild(img);
      setTimeout(() => previewRight.classList.add("show"), 50);
    }

    if (selected[1] && selected[2]) startButton.disabled = false;
  });
});

startButton.addEventListener("click", () => {
  selectMenu.classList.add("hidden");
  battleMenu.classList.remove("hidden");
  player1Img.src = selected[1];
  player2Img.src = selected[2];
});

document.addEventListener("keydown", (e) => {
  const now = Date.now();
  const canAttack = () => now - lastAttackTime > 1000;

  switch (e.key.toLowerCase()) {
    case "a":
      player1Pos = Math.max(0, player1Pos - 20);
      player1Img.style.left = player1Pos + "px";
      break;
    case "d":
      player1Pos = Math.min(780, player1Pos + 20);
      player1Img.style.left = player1Pos + "px";
      break;
    case "j":
      player2Pos = Math.max(0, player2Pos - 20);
      player2Img.style.left = player2Pos + "px";
      break;
    case "l":
      player2Pos = Math.min(780, player2Pos + 20);
      player2Img.style.left = player2Pos + "px";
      break;
    case "s":
      if (distance() < 160 && canAttack()) {
        attack("DC", 20, player2Blocking);
        lastAttackTime = now;
      }
      break;
    case "k":
      if (distance() < 160 && canAttack()) {
        attack("Marvel", 20, player1Blocking);
        lastAttackTime = now;
      }
      break;
    case "w":
      player1Blocking = true;
      setTimeout(() => (player1Blocking = false), 2000);
      break;
    case "i":
      player2Blocking = true;
      setTimeout(() => (player2Blocking = false), 2000);
      break;
  }
});