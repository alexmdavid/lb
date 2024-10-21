const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnRight = document.querySelector('#right');
const btnLeft = document.querySelector('#left');
const parrafo = document.querySelector('#parrafo');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');


let canvasSize;
let elementsSize;
let level = 0 ; 
let lives = 3 ;

let timeStart;
let timePlayer;
let timeInterval;


const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);


// A los valores de canvasSize y elementSize se le quitan los decimales sobrantes.


function setCanvasSize(){
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.85;
  } else {
    canvasSize = window.innerHeight * 0.85;
  }

  canvasSize = Number(canvasSize.toFixed(0));
  
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10.09;

  elementsSize = Number(elementsSize.toFixed(0));
  
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
  
};
function showLives(){
  const heartsArrays = Array(lives).fill(emojis['HEART']);

  spanLives.innerHTML = emojis["HEART"].repeat(lives)
};

function startGame(){
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';
  const map = maps[level];
  
  if(!map){
    gameWin();
    return;
  }

  if(!timeStart){
    timeStart =  Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }
  
  const mapRows = map.trim().split('\n');
  const mapCols = mapRows.map(row => row.trim().split(''))
  showLives();  
  
  enemyPositions = [];
  game.clearRect(0,0,canvasSize,canvasSize);
  mapCols.forEach((row, rowI) => {
    row.forEach(((col,colI)=>{
      const emoji = emojis[col];
      const posX = elementsSize*(colI +1);
      const posY = elementsSize*(rowI +1);

      if(col=='O'){
        if(!playerPosition.x && !playerPosition.y){
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      }else if (col == 'I'){
        giftPosition.x = posX;
        giftPosition.y = posY; 
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      game.fillText(emoji,posX,posY);
      
    }));
    
  });
  movePlayer();
};
 
function levelFail(){
  lives--;
  if(lives <= -1){   
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
function movePlayer(){
  
  const giftCollitionX = playerPosition.x.toFixed(0) == giftPosition.x.toFixed(0);
  const giftCollitionY = playerPosition.y.toFixed(0) == giftPosition.y.toFixed(0);
  const giftCollision = giftCollitionX && giftCollitionY;
  
  
  if(giftCollision){
    levelWin();
  };
  const enemyCollision = enemyPositions.find(enemy =>{
    const enemyCollisionX = enemy.x.toFixed(0) == playerPosition.x.toFixed(0);
    const enemyCollisionY = enemy.y.toFixed(0) == playerPosition.y.toFixed(0);
    return enemyCollisionX && enemyCollisionY;
  });

  if(enemyCollision){
    return levelFail();
  }
  
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
};

function levelWin(){
  level++;
  startGame();
};
function gameWin(){
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

  if(recordTime){ 
    if(recordTime >= playerTime ){
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML ='Nuevo record';
    } else{
      pResult.innerHTML ='Lo siento, no superaste el record';
    }
  } else{
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'Primera vez? Vuelve a intentar y me cuentas'; 
  }
  console.log({recordTime, playerTime});
}
function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord(){
  spanRecord.innerHTML = localStorage.getItem('record_time');
}


window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click',moveUp);
btnDown.addEventListener('click',moveDown);
btnRight.addEventListener('click', moveRight);
  btnLeft.addEventListener('click', moveLeft);


function moveByKeys(event){
  if( event.key == 'ArrowUp') moveUp();
    else if(event.key =='ArrowDown')  moveDown();
    else if(event.key =='ArrowLeft')  moveLeft();
    else if(event.key =='ArrowRight') moveRight();
};

function moveUp(){
  if((playerPosition.y - elementsSize ).toFixed(0) < elementsSize){
    console.log('OUT');
  } else {
  playerPosition.y -= elementsSize;
  startGame();
}  
};
function moveDown(){
  if ((playerPosition.y + elementsSize).toFixed(0) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
  startGame();
  }
    };
function moveLeft(){
  if((playerPosition.x - elementsSize).toFixed(0) < elementsSize){
    console.log('OUT');
  } else {
  playerPosition.x -= elementsSize;
  startGame();
}
};
function moveRight(){
if ((playerPosition.x + elementsSize).toFixed(0) > canvasSize) {
  console.log('OUT');
} else {
  playerPosition.x += elementsSize;
  startGame();
}
};

