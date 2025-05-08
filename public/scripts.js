let BOARD_SIZE = 15; //kentän koko, eli seiniä on 15x15
let board; //kenttä tallennetaan tähän
const cellSize = calculateCellSize();

let pelaaja;
let playerX;
let playerY;

let ghosts = []; 

let ghostInterval; // Interval for moving ghosts

document.getElementById('start-button').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
      pelaaja.move(0, -1); // Liikuta ylös
      break;
      case 'ArrowDown':
      pelaaja.move(0, 1); // Liikuta alas
      break;
      case 'ArrowLeft':
      pelaaja.move(-1, 0); // Liikuta vasemmalle
     break;
      case 'ArrowRight':
      pelaaja.move(1, 0); // Liikuta oikealle
      break;
      case 'w':
        shootAt(pelaaja.x, pelaaja.y - 1);
      break;
      case 's':
        shootAt(pelaaja.x, pelaaja.y + 1);
      break;
      case 'a':
        shootAt(pelaaja.x - 1, pelaaja.y);
      break;
      case 'd':
        shootAt(pelaaja.x + 1, pelaaja.y);
      break;

      }

     event.preventDefault(); // Prevent default scrolling behaviour
     });

function startGame() {
    console.log('Game started');
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    board = generateRandomBoard();

    ghostInterval = setInterval(function() {
        //ghosts[0].moveGhostTowardsPlayer(pelaaja, board);
        moveGhosts();
    }, 1000);

    console.log(board);
    drawBoard(board);
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

   generateObstacles(newBoard);
   
   
   [playerX, playerY] = randomEmptyPosition(newBoard);

   pelaaja = new Player(playerX, playerY);

   newBoard[pelaaja.y][pelaaja.x] = 'P'; //P is player

   for(let i = 0; i < 5; i++){
      const[x,y] = randomEmptyPosition(newBoard);
      newBoard[y][x] = 'G';
      ghosts.push(new Ghost(x,y));
   }
 

   return newBoard;
}

function drawBoard(board) {
    const gameBoard = document.getElementById('game-board');

    gameBoard.innerHTML = '';

    // Tämä luo CSS Grid -ruudukon, jossa on BOARD_SIZE saraketta. 
    // Jokainen sarake saa saman leveyden (1fr).
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    // Luodaan jokainen ruutu
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize +"px";
            cell.style.height = cellSize +"px";
            if (getCell(board, x, y) === 'W') {
                cell.classList.add('wall'); // 'W' on seinä
            }
            else if (getCell(board, x, y) === 'P') {
                cell.classList.add('player'); // 'W' on seinä
            }
            else if (getCell(board,x,y) === 'G'){
                cell.classList.add('monster');
            }
            else if (getCell(board,x,y) === 'B'){
                cell.classList.add('bullet');
                setTimeout(() => {
                    setCell(board, x, y, ' ')
                    drawBoard(board);
                }, 500); // Ammus näkyy 500 ms
            }

            gameBoard.appendChild(cell);
        }
        
    }
}


function getCell(board, x, y) {
    return board[y][x];
}

function setCell(board, x, y, value) {
    board[y][x] = value;
}

function calculateCellSize() {
    // Otetaan talteen pienempi luku ikkunan leveydestä ja korkeudesta
    const screenSize = Math.min(window.innerWidth, window.innerHeight);
    // Tehdään pelilaudasta hieman tätä pienempi, jotta jää pienet reunat
    const gameBoardSize = 0.95 * screenSize;
    // Laudan koko jaetaan ruutujen määrällä, jolloin saadaan yhden ruudun koko
    return gameBoardSize / BOARD_SIZE;
}

function generateObstacles(board){

    const obstacles =[
     [[0,0],[0,1],[1,0],[1,1]],//Neliö
     [[0,0],[0,1],[0,2],[0,3]],//I
     [[0,0],[1,0],[2,0],[1,1]]//T
    ];

    const positions =[
        {startX: 2, startY: 2},
        {startX: 8, startY: 2},
        {startX: 4, startY: 8},
        {startX: 8, startY: 8},
        {startX: 2, startY: 11},
        {startX: 8, startY: 11},
        {startX: 12, startY: 4},
        {startX: 12, startY: 8},
        {startX: 12, startY: 11},
        {startX: 5, startY: 5}
        
    ]

    positions.forEach(pos=>{
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
        placeObstacle(board,randomObstacle,pos.startX,pos.startY);
    })
}

function placeObstacle(board,obstacle,startX, startY){
    for(coordinatePair of obstacle){
        [x,y] = coordinatePair;
        board[startY + y][startX + x] = 'W';
    }
}

// Returns a random integer between min and max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomEmptyPosition(board) {
    x = randomInt(1, BOARD_SIZE - 2);
    y = randomInt(1, BOARD_SIZE - 2);
    if (getCell(board, x, y) === ' ') {
        return [x, y];
    } else {
        return randomEmptyPosition(board);
    }
}

function shootAt(x,y){
    // Tarkistetaan, että ammus ei mene seinään
    if (getCell(board, x, y) === 'W') {
        return;
    }

    const ghostIndex = ghosts.findIndex(ghost => ghost.x === x && ghost.y === y);

    if(ghostIndex !== -1){
        ghosts.splice(ghostIndex,1);
    }

    setCell(board, x, y, 'B'); // Asetetaan ammus
    drawBoard(board); 

    if(ghosts.length === 0){
        alert('Kummitukset voitettu!');
    }
}



class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    move(dx, dy){

        const currentX = this.x;
        const currentY = this.y;
        

       // Laske uusi sijainti
       // const newX = currentX + deltaX;
       const newY = currentY + dy;
       const newX = currentX + dx;


    if(board[newY][newX] === ' '){
        // Päivitä pelaajan sijainti
        this.x = newX;
        this.y = newY;

        // Päivitä pelikenttä
        board[currentY][currentX] = ' '; // Tyhjennetään vanha paikka
        board[newY][newX] = 'P'; // Asetetaan uusi paikka
    }

    drawBoard(board);
    }

}

class Ghost{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    moveGhostTowardsPlayer(player,board, oldGhosts){
        let dx = player.x - this.x;
        let dy = player.y - this.y;

        console.log(dx, dy);

        let moves = [];

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) moves.push({ x: this.x + 1, y: this.y }); // Move right
            else moves.push({ x: this.x - 1, y: this.y }); // Move left
            if (dy > 0) moves.push({ x: this.x, y: this.y + 1 }); // Move down
            else moves.push({ x: this.x, y: this.y - 1 }); // Move up
        } else {
            if (dy > 0) moves.push({ x: this.x, y: this.y + 1 }); // Move down
            else moves.push({ x: this.x, y: this.y - 1 }); // Move up
            if (dx > 0) moves.push({ x: this.x + 1, y: this.y }); // Move right
            else moves.push({ x: this.x - 1, y: this.y }); //  Move left
        }

        console.log(moves);

        for (let move of moves) {
            if (board[move.y][move.x] === ' ' || board[move.y][move.x] === 'P' &&
              !oldGhosts.some(h => h.x === move.x && h.y === move.y)) // Tarkista, ettei haamu liiku toisen haamun päälle) 
              { 
                  return move;
              }
        }
        // Jos kaikki pelaajaan päin suunnat ovat esteitä, pysy paikallaan
        return { x: this.x, y: this.y };
        
        /*
        setCell(board, moves[0].x, moves[0].y, 'G'); // haamu liikkuu pelaajan suuntaan
        setCell(board, this.x, this.y, ' '); // tyhjennetään vanha paikka

        ghosts[0].x = moves[0].x;
        ghosts[0].y = moves[0].y; // päivitetään haamun sijainti

        drawBoard(board); // Päivitetään pelikenttä
        
        */



    }
}


function moveGhosts() {

    // Säilytä haamujen vanhat paikat
    const oldGhosts = ghosts.map(ghost => ({ x: ghost.x, y: ghost.y }));
    
      ghosts.forEach(ghost => {
        
        const newPosition = ghost.moveGhostTowardsPlayer(pelaaja, board, oldGhosts);
          
          ghost.x = newPosition.x;
          ghost.y = newPosition.y;
        
          setCell(board, ghost.x, ghost.y, 'G');
    
          // Check if ghost touches the player
          if (ghost.x === pelaaja.x && ghost.y === pelaaja.y) {
              endGame() // End the game
          return;
          }
    
          });
    
        // Tyhjennä vanhat haamujen paikat laudalta
        oldGhosts.forEach(ghost => {
          board[ghost.y][ghost.x] = ' '; // Clear old ghost position
        });
    
        // Update the board with new ghost positions
        ghosts.forEach(ghost => {
            board[ghost.y][ghost.x] = 'G';
        });
    
    // Redraw the board to reflect ghost movement
    drawBoard(board);
    }

    function endGame() {
        isGameRunning = false; // Set the game as game over
        alert('Game Over! The ghost caught you!');
         // Show intro-view ja hide game-view
        ghosts = []; // Tyhjennetään haamut
        clearInterval(ghostInterval);
        document.getElementById('intro-screen').style.display = 'block';
        document.getElementById('game-screen').style.display = 'none';
        
      
      }