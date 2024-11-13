//board settings
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird settings
let birdWidth = 34; //width : height ratio = 408 : 228 = 17 : 12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

//creating the bird object with the settings
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}


//pipe settings
let pipeArray = [];
let pipeWidth = 64; //width : height ratio = 384 : 3072 = 1 : 8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;


//game physics
let velocityX = -2; //pipe's moving left speed
let velocityY = 0; //bird's jump speed
let gravity = 0.4; //to bring the bird down
let gameOver = false;
let score = 0;

window.onload = function (){

    //loading the canvas board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");


    //loading bird image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //loading top and bottom pipe images
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";


    requestAnimationFrame(updateLoop);
    setInterval(generatePipes , 1500); //placing pipes every 1.5 seconds

    document.addEventListener("keydown", moveBird); //moving the bird based on keypress
    document.addEventListener("touchstart", moveBird); //moving the bird based on screen touch
}


//main game loop function
function updateLoop(){
    requestAnimationFrame(updateLoop);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //drawing the bird
    velocityY+=gravity; //adding gravity to bring the bird down
    bird.y = Math.max(bird.y + velocityY, 0); //apply velocity to the current bird based on gravity and keypress , limiting the bird to go out of the top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }

    //generating the pipes
    for(let i = 0 ; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x+=velocityX; //adding velocity to move the pipes one by one to the left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);


        //checking if the bird has passed the pipe
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score+=0.5; // adding 0.5 because there are two pipes (top and bottom) and passing both of them should count as 1
            pipe.passed = true;
        }

        //checking if the bird crashes with the pipe
        if(checkCollision(bird, pipe)){
            gameOver = true;
        }
    }

    //removing pipes once they have passed the left corner of the canvas to optimise the array
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); //removes the pipe after it passes the left of the canvas
    }


    //displaying current Score and GAME OVER Text
    context.fillStyle = "white";
    context.font = "45px san-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 5, 90);
    }
}

//function to generate the top and bottom pipe
function generatePipes(){

    // if the game is over, no need generate new pipes
    if(gameOver){
        return;
    }

    //creating pipes of uneven heights by modifying the y axis
    let randomPipeY = (pipeY - pipeHeight/4 - Math.random()*pipeHeight/2);

    //defining opening space to create gap between the top and bottom pipe
    let openingSpace = board.height/4;

    //creating the top pipe object
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe); //adding the top pipe in the array;


    //creating the bottom pipe object
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,  //adding the top pipe + some space to create gap between the top and bottom pipe
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe); //adding the bottom pipe in the array
}


//function to move the bird based on keypress
function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "keyX" || e.type == "touchstart"){
        velocityY = -6;

        //resetting the values if the game is over
        if(gameOver){
            bird.y = birdY;
            pipeArray=[];
            score=0;
            gameOver = false;
        }
    }
}


//function to check if the bird crashed with any of the pipes
function checkCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}