/*
**ARCADE GAME BY MR.PAUL(this content is licensed under the MIT license @https://opensource.or/licenses/mit-license.php)
*/


const myGameLogic = (function() {
  //initialize all required variables
   let idx, dx, dy, interval, interval1, interval2, difficulty ,level = 1, x = 1.75, heart = 4, init, star, key, stop, stone, win, interval3;
   const message = document.querySelector('.message');
   let defaultRender = function() {
        access.ctx.drawImage(Resources.get(this.sprite), 0, 53, 101, 108, this.dx, this.dy-31, access.imgWidth, access.imgHeight+22); 
      };

  //EnemyClass
    class Enemy {
        constructor() {
            this.sprite ='images/enemy-bug.png';
            this.dx = -access.imgWidth;
            this.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
            this.speed = (5*access.imgWidth) / ( Math.floor(1.9 * Math.random()) + 2 + this.random(0) + this.random(1));
        }

        update (dt) {
          if(stop === true) return;
          if (this.dx >= 5*access.imgWidth){
            this.dx = -access.imgWidth;
            this.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
            this.speed = (5*access.imgWidth) / ( Math.floor(1.9 * Math.random()) + 0.25 + x + this.random(0) + this.random(1));
          }else{

            this.dx += this.speed*dt;
          }

        }

        render () {
            access.ctx.drawImage(Resources.get(this.sprite), 0, 75, 101, 96, this.dx, this.dy, access.imgWidth, access.imgHeight);
        }

        random(num) {
          return num === 0 ? Math.floor(1.9 * Math.random())/2 : Math.floor(1.9 * Math.random())/4;
        }
    }

    //player class
    class Player {

       constructor(character = 'images/char-boy.png') {
        this.sprite = character;
        this.dx = 2*access.imgWidth;
        this.dy = 5*access.imgHeight;
       }

        handleInput(allowedKeys) {
            switch (allowedKeys) {
                case 'left':
                  if (this.dx === 0  || stone === 'left') break;
                  this.dx -= access.imgWidth;
                  break;
                case 'up':

                  if (this.dy === 0 || stone === 'up') break;
                  this.dy -= access.imgHeight;
                  break;
                case 'right':
                  if (this.dx === 4*access.imgWidth || stone === 'right') break;
                  this.dx += access.imgWidth;
                  break;
                case 'down':
                  if (this.dy === 5*access.imgHeight || stone === 'down') break;
                  this.dy += access.imgHeight;
            }

        }

        get activeTouches (){
          return this.touches;
        }

        set activeTouches (Array){
          this.touches = Array;
        }

        handleSwipes(e){

          e.preventDefault();
           const activeTouches = [];

          if (e.type === 'touchstart' ){

          for (const touch of e.changedTouches) {
            activeTouches.push(touch);
            }
            this.activeTouches = activeTouches;
            
          }else {

            for (const touch of e.changedTouches){

              for (const activeTouch of this.activeTouches) {

                if(touch.identifier === activeTouch.identifier){
                  
                  const dx = activeTouch.clientX - touch.clientX;
                  const dy = activeTouch.clientY - touch.clientY;
                  
                  if ((dx > dy && dx >= 50 ) && (dy < 50 && dy >= 0 || dy > -50 && dy <= 0)){
                    this.handleInput('left');
                  }else if((dx < dy && dx < -50 ) && ( dy < 50 && dy >= 0 || dy > -50 && dy <= 0)) {
                    this.handleInput('right');
                  }else if ((dy > dx && dy > 50) || (dy/dx === 1 && dy >= 50)) {
                    this.handleInput('up');
                  }else if ( (dy < dx && dy < -50) || (dy/dx === 1 && dy <= -50)) {
                    this.handleInput('down');
                  }else {
                    if (dx > dy && dx > 50 ){
                    this.handleInput('left');
                  }else if(dx < dy && dx < -50 ) {
                    this.handleInput('right');
                  }
                  }
                }
            }
            }
          }    
          }

        update () {

            if ( win === true ) return;
            for (const enemy of allEnemies){ 
              if (star === true || key === true) break; 
              if (enemy.dx+access.imgWidth > this.dx && this.dy === enemy.dy && this.dx > enemy.dx ||
                this.dx+access.imgWidth > enemy.dx && this.dy === enemy.dy && this.dx < enemy.dx ) {
                this.dx = 2*access.imgWidth;
                this.dy = 5*access.imgHeight;
                if (heart  === 1){
                  heart -= 1;
                  endGame();
                }else {
                   heart -= 1;
                  document.querySelector('.heart').firstElementChild.remove();
                }
              }
            }
            if(this.dy === 0){
              win = true;
              setTimeout(() => {
                this.dx = 2*access.imgWidth;
                this.dy = 5*access.imgHeight;
                win = false;
              }, 200)
              if (key === true) {
                  key = false;
                 startGemCountDown();
                }
              if(level === 11) {
                 endGame();
              }else {
                x -= 0.175;
                level += 1;
                updateScorePanel();
              }
            }
            if(this.render !== defaultRender && difficulty === 'easy' || difficulty === 'hard'){
              if(dx === this.dx && this.dy === dy && idx < 6){
                switch (idx) {
                  case 0 : 
                    x += 5;
                    interval3 = setTimeout(()=> x -= 5 , 3000);
                    break;
                  case 1 :
                    const img = new Image();
                    img.src = 'images/Heart.png';
                    document.querySelector('.scorepanel .heart').appendChild(img)
                    heart += 1;
                    break;
                  case 2 :
                    if(level === 11) endGame();
                    level += 1;
                    x -= 0.175;
                    updateScorePanel();
                    break;
                  case 3 : 
                    star = true;
                    setTimeout(()=> star = false , 3000);
                    break;
                  case 4: 
                    key = true;
                    Player.prototype.render = defaultRender;
                    clearInterval(interval);
                    if (difficulty === 'hard'){
                      idx= 6;
                      dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
                      dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
                      randomStoneBlock();
                    }
                    return;
                  case 5: 
                    stop = true;
                    setTimeout(()=> stop = false , 3000);

                  }
                Player.prototype.render = defaultRender;
                if (difficulty === 'hard'){
                  idx= 6;
                  dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
                  dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
                  randomStoneBlock();
                }
                clearInterval(interval);
                startGemCountDown();
              }else if(this.dx+access.imgWidth === dx && dx > this.dx && dy === this.dy && idx === 6){
                stone = 'right';
              }else if(dx+access.imgWidth === this.dx && dx < this.dx && dy === this.dy && idx === 6){
                stone = 'left';
              }else if(this.dy+access.imgHeight === dy && dy > this.dy && dx === this.dx && idx === 6){
                stone = 'down';
              }else if(dy+access.imgHeight === this.dy && dy < this.dy && dx === this.dx && idx === 6){
                stone = 'up';
              }else{
                stone = undefined;
              }
          }
        }

    }

  Player.prototype.render = defaultRender;
  window.player = new Player();
  window.allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];


    function gemPlacement() {
      let myObjects = [
        'images/Gem Orange.png',
        'images/Gem Green.png',
        'images/Gem Blue.png',
        'images/Star.png',
        'images/Key.png',
        'images/Selector.png',
        'images/Rock.png'];
     
      if (difficulty === 'hard') clearInterval(interval1);
      dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
      dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
      idx = Math.floor(6.9 * Math.random());
      Player.prototype.render = function() {
        access.ctx.drawImage(Resources.get(myObjects[idx]), 0, 63, 101, 108, dx, dy-5, access.imgWidth, access.imgHeight-5);
        access.ctx.drawImage(Resources.get(this.sprite), 0, 53, 101, 108, this.dx, this.dy-31, access.imgWidth, access.imgHeight+22); 
      }

      interval = setTimeout(()=>{
          Player.prototype.render = defaultRender;
          if (difficulty === 'hard'){
            idx= 6;
            dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
            dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
            randomStoneBlock();
          } 
          if (difficulty === 'easy') stone = undefined;
          startGemCountDown();
      }, 10000);

    }

    function randomTime() {
       return 3000*Math.random() + 10000;
    }

    function startGemCountDown() {
      interval2 = setTimeout(gemPlacement, randomTime());
    }

    function randomStoneBlock(){
      interval1 = setInterval(()=>{
          dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
          dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
        }, 5000)
    }

    function endGame() {
      document.querySelector('.scorepanel').classList.add('hide');
      document.querySelector('canvas').classList.add('hide');
      const chars = document.querySelector('.message p').children;
      for (const char of chars ){
        char.remove();
      }
      if(level === 11 && heart > 0){
        message.firstElementChild.textContent = 'Congratulations!!!';
        message.firstElementChild.style.marginBottom = '0';
        message.firstElementChild.nextElementSibling.textContent = `you managed to cross the bug runway 
                                                                    alive only a few legends have done this!!!. 
                                                                    You've proved your competence and now crowned the rightful heir to the throne.`;

        let El = Resources.get(`${player.sprite}`);
        message.firstElementChild.nextElementSibling.prepend(El);
        document.querySelector('.message').classList.remove('hide');
      }else{
        message.firstElementChild.textContent = 'game over!!!';
        message.firstElementChild.style.marginBottom = '100px';
        message.firstElementChild.nextElementSibling.textContent = 'it wasn\'t ever easy, only a few legends have been able to cross the bug runway. You can be one, but you have to work harder';
        document.querySelector('.message').classList.remove('hide');
      }
    }

    function updateScorePanel(){
    const scorePanel = document.getElementsByClassName('scorepanel')[0];
    scorePanel.firstElementChild.textContent = `level: ${level}`;
    scorePanel.lastElementChild.previousElementSibling.textContent = `difficulty: ${difficulty}`
    const hearts = scorePanel.firstElementChild.nextElementSibling.children;
    if (init !== true){
        document.querySelector('.heart').textContent = ''
      for(const heart of hearts){
        heart.remove();
      }
      for(let i = 0; i < 4; i++){
        const img = new Image();
        img.src = 'images/Heart.png';
        document.querySelector('.heart').appendChild(img);
      }
      if(difficulty === 'easy') init = true; startGemCountDown();
      if(difficulty === 'hard' && init !== true ){
        defaultRender = function() {
          access.ctx.drawImage(Resources.get('images/Rock.png'), 0, 63, 101, 108, dx, dy-5, access.imgWidth, access.imgHeight-5);
          access.ctx.drawImage(Resources.get(this.sprite), 0, 53, 101, 108, this.dx, this.dy-31, access.imgWidth, access.imgHeight+22); 
        }
        Player.prototype.render = defaultRender;
        dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
        dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
        idx = 6;
        init = true;
        randomStoneBlock();
      }
    }
    document.getElementsByClassName('scorepanel')[0].classList.remove('hide');
    document.getElementsByTagName('canvas')[0].classList.remove('hide');
  }

  function reset() {
    x = 1.75;
    init = false;
    level = 1;
    heart = 4;
    player.dx = 2*access.imgWidth;
    player.dy = 5*access.imgHeight;
    if (difficulty === 'hard') clearInterval(interval1);
    clearInterval(interval);
    clearInterval(interval1);
    clearInterval(interval2);
    clearInterval(interval3);
    Player.prototype.render = defaultRender;
    updateScorePanel();
    message.classList.add('hide');
  }

  function restart() {
    reset();
    document.querySelector('.scorepanel').classList.add('hide');
    document.querySelector('canvas').classList.add('hide');
    document.querySelector('.intro').removeAttribute('hidden');
  }




                      /*EVENT LISTENERS*/

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.getElementsByTagName('canvas')[0].addEventListener('touchstart', function(e){
  player.handleSwipes(e);
});

document.getElementsByTagName('canvas')[0].addEventListener('touchend', function(e){
    player.handleSwipes(e);
});


document.querySelector('.intro').addEventListener('click', function(e){
    if(e.target.tagName === 'IMG'){player = new Player(e.target.getAttribute('src'));
        document.getElementsByTagName('section')[0].setAttribute('hidden','');
        document.getElementsByTagName('section')[1].classList.remove('hide');}
  });

document.querySelector('.difficulty').addEventListener('click', function(e){
   if (e.target.tagName === 'BUTTON') {difficulty = e.target.textContent;
        document.getElementsByTagName('section')[1].classList.add('hide');
        reset();
        updateScorePanel();
      }
  });

document.querySelector('.scorepanel > button').addEventListener('click', reset);

document.querySelector('.message').addEventListener('click', function(e){
  if(e.target.classList.contains('restart')){
    restart();
  }else if(e.target.tagName === 'BUTTON'){
    reset();
  }else{return}
})})();