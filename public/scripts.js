let BOARD_SIZE = 15; //kentän koko, eli seiniä on 15x15
let board; //kenttä tallennetaan tähän

document.getElementById('start-button').addEventListener('click', startGame);

function startGame() {
    console.log('Game started');
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    board = generateRandomBoard();
    console.log(board);
}

function generateRandomBoard(){
  //luodaan uusi kenttä, jossa on BOARD_SIZE x BOARD_SIZE ruutua
  const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(' '));

  //set walls in edges
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
     if (y === 0 || y === BOARD_SIZE - 1 || x === 0 || x === BOARD_SIZE - 1) {
         newBoard[y][x] = 'W'; //W is wall
     }
    }
   }

  return newBoard;
}

function drawBoard(board) {
    const gameBoard = document.getElementById('game-board');
    // Tämä luo CSS Grid -ruudukon, jossa on BOARD_SIZE saraketta. 
    // Jokainen sarake saa saman leveyden (1fr).
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
}


function getCell(board, x, y) {
    return board[y][x];
}