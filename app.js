/* jshint esversion: 8 */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const width = 10;
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const ScoreDisplay = document.querySelector('#score');
  const StartBtn = document.querySelector('#start-button');
  console.log(squares);
  // the tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2+2],
    [width, width*2, width*2+1, width*2+2],
  ];
  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ];

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ];

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ];

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
  //console.log(theTetrominoes);

  let currentPosition = 4;
  // let currentRotation = 0;

  let randomRotate = Math.floor(Math.random()*(theTetrominoes.length - 1));
  let currentRotation = 0;

  // Making a 'random' variable to select a random shape
  let random = Math.floor(Math.random()*theTetrominoes.length);
  console.log(random, currentRotation);
  let current = theTetrominoes[random][randomRotate];
  let nextRandom = 0;
  // drawing the tetromino by adding a class tothe div and using that class
  // add styling using that class name
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
      //console.log(squares[currentPosition + index]);
    // squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // Using the same logic of manipulating div class to undraw previously drawn
  // figures

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
      //console.log(squares[currentPosition + index]);
    // squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  draw();

  // adding class to the last line of the grid, i.e, last 10 divs
  lastLine = squares.slice(-11);
  for(i=0; i<11; i++){
    lastLine[i].classList.add('taken');
  }


  // making the tetromino move down after a certain timeout
  let moveDownTime = 800; // in milli seconds


  timerId = setInterval(moveDown, moveDownTime);
  console.log(squares);
  function moveDown(){
    undraw();
    currentPosition += width;
    draw();
    // upto here we are basically removing the block and then re-drawing it at from a new currentPosition
    // after time described in moveDownTimer
    freeze();
    // to remember that the block has reached the last level we will add to
    // the last row of <div>s a class name suggesting so outside this function.
  }

  function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));

      // select a tetromino
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * (theTetrominoes.length - 1));
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }
  // move the tetromino until it is at the left most part of the grid
  function moveLeft(){
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if(!isAtLeftEdge){
      currentPosition -= 1;
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition += 1;
    }
    draw();
  }

  // move the tetromino right, unless it's at the edge or there is a blockage
  function moveRight(){
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

    if(!isAtRightEdge){
      currentPosition += 1;
    }

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -= 1;
    }

    draw();
  }

  function rotate(){
    undraw();
    currentRotation += 1;
    if(currentRotation === current.length - 1){
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // listening to keyPress
  function control(e){
    if(e.keyCode === 37){
      moveLeft();
    }
    else if (e.keyCode === 39) {
      moveRight();
    }
    else if (e.keyCode === 38) {
      rotate();
    }
    else if (e.keyCode === 40){
      moveDown();
    }
  }
  document.addEventListener('keyup', control);

  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

  const nextTetromino = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
  ];

  function displayShape(){
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
    });
    nextTetromino[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
    });
  }

  StartBtn.addEventListener('click', () => {
    if(timerId){
      clearInterval(timerId);
      timerId = null;
    } else{
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
      displayShape();
    }
  });


  // add Score
  function addScore(){
    for(i=0; i<199; i++){
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      if(row.every(index => squares[index].classList.contains('taken'))){
        score += 1;
        ScoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  function gameOver(){
    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
      ScoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
      alert('Eh, try again kid');
    }
  }
});
