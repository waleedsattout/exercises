const images = {
  K: "wK", // white king
  Q: "wQ", // white queen
  R: "wR", // white rook
  B: "wB", // white bishop
  N: "wN", // white knight
  P: "wP", // white pawn
  k: "bK", // black king
  q: "bQ", // black queen
  r: "bR", // black rook
  b: "bB", // black bishop
  n: "bN", // black knight
  p: "bP", // black pawn
};

const squareNames = [
  "a8",
  "b8",
  "c8",
  "d8",
  "e8",
  "f8",
  "g8",
  "h8",
  "a7",
  "b7",
  "c7",
  "d7",
  "e7",
  "f7",
  "g7",
  "h7",
  "a6",
  "b6",
  "c6",
  "d6",
  "e6",
  "f6",
  "g6",
  "h6",
  "a5",
  "b5",
  "c5",
  "d5",
  "e5",
  "f5",
  "g5",
  "h5",
  "a4",
  "b4",
  "c4",
  "d4",
  "e4",
  "f4",
  "g4",
  "h4",
  "a3",
  "b3",
  "c3",
  "d3",
  "e3",
  "f3",
  "g3",
  "h3",
  "a2",
  "b2",
  "c2",
  "d2",
  "e2",
  "f2",
  "g2",
  "h2",
  "a1",
  "b1",
  "c1",
  "d1",
  "e1",
  "f1",
  "g1",
  "h1",
];

const order = [
  56, 57, 58, 59, 60, 61, 62, 63, 48, 49, 50, 51, 52, 53, 54, 55, 40, 41, 42,
  43, 44, 45, 46, 47, 32, 33, 34, 35, 36, 37, 38, 39, 24, 25, 26, 27, 28, 29,
  30, 31, 16, 17, 18, 19, 20, 21, 22, 23, 08, 09, 10, 11, 12, 13, 14, 15, 00,
  01, 02, 03, 04, 05, 06, 07,
];

const startTime = new Date();
const timeLimit = 60;

const transparentImage =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const board = document.getElementById("board");

var IsSelected = false;
var clickedPiece = "";
var movement = "";
var currentPiece = "";
var blackMovedpices = [];
var legalMoves = "";
var algorithm = "alpha_betaMinMaxL";

function getImg(name, id) {
  fetch(`/static/chesspieces/${name}.png`)
    .then((res) => res.blob())
    .then((blob) => {
      var img = URL.createObjectURL(blob);
      document.getElementById(id).querySelector("img").src = img;
    });
}

/**
 *
 * @param {string} square square uci like e2e4 from to.
 * @returns {object} the response from the movement.
 */
async function sendMove(square = "e2e4", promotion = "") {
  var data = new FormData();
  data.append("user_move", square);
  data.append("promotion", promotion);
  data.append("algorithm", algorithm);

  try {
    const res = await fetch("/move", {
      method: "POST",
      body: data,
    });
    const d = await res.json();
    return d;
  } catch (error) {
    console.error(error);
  }
}

async function makeMove(element) {
  resetColors();
  if (!IsSelected) {
    if (
      element.parentElement.getAttribute("color") != "white" &&
      element.getAttribute("color") != "white"
    )
      return;
    if (!element.hasAttribute("piecename")) return;

    currentPiece = element;
    IsSelected = true;

    movement = "";
    movement += element.getAttribute("name");
    element.setAttribute("show", "");

    if (blackMovedpices[0])
      blackMovedpices[0].parentElement.classList.remove("moved");
    if (blackMovedpices[1])
      blackMovedpices[1].parentElement.classList.remove("moved");
    blackMovedpices[0] = "";
    blackMovedpices[1] = "";
    let moves = await getLegalMoves(element);
    colorizationSquares(moves, "");
  } else {
    currentPiece.removeAttribute("show");
    IsSelected = false;
    if (currentPiece == element) {
      currentPiece = "";
      return;
    }

    let result = legalMoves.find(
      (m) => m.to_square == element.getAttribute("order")
    );
    if (!result) {
      currentPiece = "";
      return;
    }
    let piecename = currentPiece.getAttribute("piecename");
    let name = currentPiece.getAttribute("name");
    let promotion = "";
    if (piecename == "p" && name[1] == 7) {
      promotion = prompt(
        "You are about to promote a pawn, choose a piece to promote to: (Q, R, B, or N)"
      );
      while (!["q", "r", "b", "n"].includes(promotion.toLowerCase())) {
        promotion = prompt(
          "You are about to promote a pawn, choose a piece to promote to: (Q, R, B, or N)"
        );
      }
    }

    let temp = currentPiece;
    currentPiece = "";
    movement += element.getAttribute("name");
    let res = await sendMove(movement, promotion);
    if (res.status == "ok" && res.move) {
      temp.removeAttribute("piecename");
      temp.removeAttribute("color");

      let img1 = document.querySelector(
        `[name=${movement.substring(0, 2)}] img`
      );
      let img2 = document.querySelector(
        `[name=${movement.substring(2, 4)}] img`
      );

      [img1.src, img2.src] = [img2.src, img1.src];
      img1.removeAttribute("src");

      movement = "";
      img1 = document.querySelector(`[order="${res.move.from_square}"] img`);
      img2 = document.querySelector(`[order="${res.move.to_square}"] img`);
      [img1.src, img2.src] = [img2.src, img1.src];
      img1.removeAttribute("src");

      blackMovedpices[0] = img2;
      blackMovedpices[1] = img1;

      blackMovedpices[0].parentElement.classList.add("moved");
      blackMovedpices[1].parentElement.classList.add("moved");

      element.setAttribute("color", "white");
      element.setAttribute("piecename", piecename);
      document.getElementById("score").innerText = res.score;
      if (promotion != "") document.location.reload();
    } else if (res.status == "bad") {
      console.error(res.message);
    } else if (res.status == "ok") alert("game over");
  }
}

async function getLegalMoves(element) {
  try {
    var data = new FormData();
    data.append("square", element.getAttribute("name"));

    const res = await fetch("/legal_move", {
      method: "POST",
      body: data,
    });
    const moves = await res.json();
    let returnMoves = [];

    moves.find((e) => {
      if (element.getAttribute("order") == e.from_square) {
        returnMoves.push(e);
      }
    });

    legalMoves = moves;
    return returnMoves;
  } catch (error) {
    console.error(error);
  }
}

async function getBestMove() {
  try {
    const res = await fetch("/best");
    const d = await res.text();
    move = {
      from: d.substring(0, 2),
      to: d.substring(2),
    };
    return move;
  } catch (error) {
    console.error(error);
  }
}

async function hint() {
  let best = await getBestMove();
  colorizationSquares(best, "hint");
}

function colorizationSquares(squares, colorType = "hint") {
  if (colorType != "hint") {
    squares.forEach((e) => {
      document.querySelector(`[order="${e.to_square}"]`).classList.add("moves");
    });
  } else if (colorType == "hint") {
    document.querySelector(`[name="${squares.to}"]`).classList.add("moves");
    document.querySelector(`[name="${squares.to}"]`).classList.add("hint");
    document.querySelector(`[name="${squares.from}"]`).classList.add("moved");
    document.querySelector(`[name="${squares.from}"]`).classList.add("hint");
  }
}

function resetColors() {
  document.querySelectorAll(".moves").forEach((e) => {
    e.classList.remove("moves");
    if (e.classList.contains("hint")) e.classList.remove("hint");
  });
  document.querySelector(".moved")?.classList.remove("moved");
}

async function settings(e) {
  var data = new FormData();
  data.append("algorithm", e.elements.algorithm.value);
  data.append("k", e.elements.k.value);
  data.append("level", e.elements.level.value);
  try {
    const res = await fetch("/settings", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    alert(result.message, result.status != "ok" ? "error" : "");
    return;
  } catch (error) {
    console.error(error);
  }
}

async function undo() {
  try {
    const res = await fetch("/undo");
    const result = await res.json();
    alert(result.message, result.status != "ok" ? "error" : "");
    return;
  } catch (error) {
    console.error(error);
  }
}

async function reset() {
  try {
    const res = await fetch("/reset");
    const result = await res.json();
    if (result.status == "ok") document.location.reload();
    else alert(result.message, result.status != "ok" ? "error" : "");
    return;
  } catch (error) {
    console.error(error);
  }
}

function updateTimer(refreshIntervalId) {
  const timeLeft = timeLimit - (new Date() - startTime) / 1000;
  document.getElementById("timer").innerHTML = Math.round(timeLeft);

  if (timeLeft <= 0) {
    alert("Time's up!");
    clearInterval(refreshIntervalId);
  }
}

function alert(message, type = "") {
  div = document.createElement("div");
  div.innerText = message;
  div.classList.add("message");
  div.classList.add(type == "" ? "success" : type);
  document.body.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 2000);
}

window.onload = () => {
  let preBuildChessBord = document
    .getElementById("hidden")
    .innerHTML.split("\n");

  let optimizedChessBord = [];
  let swipBlackAndWhiteBorad = true;

  for (i in preBuildChessBord)
    optimizedChessBord.push(preBuildChessBord[i].split(" "));

  optimizedChessBord = optimizedChessBord.flat().join("").split("");

  for (i = 0; i < optimizedChessBord.length; i++) {
    if (i % 8 == 0) {
      span = document.createElement("span");
      span.innerHTML = 8 - i / 8;
      document.getElementById("board").appendChild(span);
      swipBlackAndWhiteBorad = !swipBlackAndWhiteBorad;
    }
    let div = document.createElement("div");
    div.classList.add((i + swipBlackAndWhiteBorad) % 2 == 0 ? "light" : "dark");
    div.classList.add("square");
    div.id = 63 - i;
    div.setAttribute("name", squareNames[i]);
    div.setAttribute("order", order[i]);
    div.setAttribute("onclick", "makeMove(this)");

    img = document.createElement("img");
    if (optimizedChessBord[i] != ".") {
      div.setAttribute(
        "color",
        optimizedChessBord[i] == optimizedChessBord[i].toUpperCase()
          ? "white"
          : "black"
      );
      div.setAttribute("pieceName", optimizedChessBord[i].toLowerCase());
      window.www = optimizedChessBord;
      getImg(images[optimizedChessBord[i]], div.id);
    }
    div.appendChild(img);
    document.getElementById("board").appendChild(div);
  }
  document.getElementById(
    "board"
  ).innerHTML += `<div class="v-guide"><span></span></div><div class="v-guide"><span>a</span></div>
  <div class="v-guide"><span>b</span></div><div class="v-guide"><span>c</span></div>
  <div class="v-guide"><span>d</span></div><div class="v-guide"><span>e</span></div>
  <div class="v-guide"><span>f</span></div><div class="v-guide"><span>g</span></div><div class="v-guide"><span>h</span></div>`;
  refreshIntervalId = setInterval(() => updateTimer(refreshIntervalId), 1000);
};
