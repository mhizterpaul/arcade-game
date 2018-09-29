/*
**ARCADE GAME BY MR.PAUL(this content is licensed under the MIT license @https://opensource.or/licenses/mit-license.php)
*/
'use strict';

const myGameLogic = (function() {

  //EnemyClass
    class Enemy {
        constructor() {
            this.sprite ='images/enemy-bug.png';
            this.dx = -access.imgWidth;
            this.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
            this.speed = (5*access.imgWidth) / ( Math.floor(1.9 * Math.random()) + 2 + this.random(0) + this.random(1));
        }

        update (dt) {

          if(environment.stop === true) return;
          if (this.dx >= 5*access.imgWidth){
            this.dx = -access.imgWidth;
            this.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
            this.speed = (5*access.imgWidth) / ( Math.floor(1.9 * Math.random()) + 0.25 + environment.x + this.random(0) + this.random(1));
          }else{
            this.dx +=  this.speed*dt;

          } 
          if (environment.star === true || environment.key === true) return; 
          if (this.dx+access.imgWidth > player.dx && player.dy === this.dy && player.dx > this.dx ||
            player.dx+access.imgWidth > this.dx && player.dy === this.dy && player.dx < this.dx ) {
            player.dx = 2*access.imgWidth;
            player.dy = 5*access.imgHeight;
            if (player.heart  === 1){
              player.heart -= 1;
              environment.endGame();
            }else {
               player.heart -= 1;
              document.querySelector('.heart').firstElementChild.remove();
            }
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
        this.heart = 4;
        this.win = false;
       }

        handleInput(allowedKeys) {
            switch (allowedKeys) {
                case 'left':
                  if (this.dx === 0  || environment.stone === 'left') break;
                  this.dx -= access.imgWidth;
                  break;
                case 'up':

                  if (this.dy === 0 || environment.stone === 'up') break;
                  this.dy -= access.imgHeight;
                  break;
                case 'right':
                  if (this.dx === 4*access.imgWidth || environment.stone === 'right') break;
                  this.dx += access.imgWidth;
                  break;
                case 'down':
                  if (this.dy === 5*access.imgHeight || environment.stone === 'down') break;
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

          render(){
            access.ctx.drawImage(Resources.get(this.sprite), 0, 53, 101, 108, this.dx, this.dy-31, access.imgWidth, access.imgHeight+22);
          }

        update () {

            if ( this.win === true ) return;
            
            if(this.dy === 0){
              this.win = true;
              setTimeout(() => {
                this.dx = 2*access.imgWidth;
                this.dy = 5*access.imgHeight;
                this.win = false;
              }, 200)
              if (environment.key === true) {
                  environment.key = false;
                  environment.startGemCountDown();
                }
              if(environment.level === 11) {
                 environment.endGame();
              }else {
                environment.x -= 0.175;
                environment.level += 1;
                environment.updateScorePanel();
              }
            }
            if( environment.defaultRender === false ){
              if(environment.dx === this.dx && this.dy === environment.dy && environment.idx < 6){
                switch (environment.idx) {
                  case 0 : 
                    environment.x += 5;
                    environment.interval3 = setTimeout(()=> environment.x -= 5 , 3000);
                    break;
                  case 1 :
                    const img = new Image();
                    img.src = 'images/Heart.png';
                    document.querySelector('.heart').appendChild(img);
                    this.heart += 1;
                    break;
                  case 2 :
                    if(environment.level === 11) environment.endGame();
                    environment.level += 1;
                    environment.x -= 0.175;
                    environment.updateScorePanel();
                    break;
                  case 3 : 
                    environment.star = true;
                    setTimeout(()=> environment.star = false , 3000);
                    break;
                  case 4: 
                    environment.key = true;
                    clearInterval(environment.interval);
                    if(environment.difficulty === 'easy'){
                      environment.dx = undefined;
                      environment.dy = undefined;
                    }else {
                      environment.idx= 6;
                      environment.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
                      environment.dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
                      environment.randomStoneBlock();
                    }
                    return;
                  case 5: 
                    environment.stop = true;
                    setTimeout(()=> environment.stop = false , 3000);

                  }

                  if (environment.difficulty === 'easy'){
                    environment.dx = undefined;
                    environment.dy = undefined;
                    
                  }else{
                    environment.idx= 6;
                    environment.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
                    environment.dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
                    environment.randomStoneBlock();
                  }
                  clearInterval(environment.interval);
                  environment.startGemCountDown();
              }else if(this.dx+access.imgWidth === environment.dx && environment.dx > this.dx && environment.dy === this.dy && environment.idx === 6){
                environment.stone = 'right';
              }else if(environment.dx + access.imgWidth === this.dx && environment.dx < this.dx && environment.dy === this.dy && environment.idx === 6){
                environment.stone = 'left';
              }else if(this.dy+access.imgHeight === environment.dy && environment.dy > this.dy && environment.dx === this.dx && environment.idx === 6){
                environment.stone = 'down';
              }else if (environment.dy + access.imgHeight === this.dy && environment.dy < this.dy && environment.dx === this.dx && environment.idx === 6){
                environment.stone = 'up';
              }else{
                environment.stone = undefined;
              }
          }
        }

    }


    // environment class
  class Environment {

    constructor(){
      this.idx = 6;
      this.x = 1.75;
      this.message = document.querySelector('.message');
    }

    render() {
      let myObjects = [
        'images/Gem Orange.png',
        'images/Gem Green.png',
        'images/Gem Blue.png',
        'images/Star.png',
        'images/Key.png',
        'images/Selector.png',
        'images/Rock.png'];
      access.ctx.drawImage(Resources.get(myObjects[this.idx]), 0, 63, 101, 108, this.dx, this.dy-5, access.imgWidth, access.imgHeight-5);
    }

    gemPlacement() {
      if (this.difficulty === 'hard') clearInterval(this.interval1);
      this.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
      this.dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
      this.idx = Math.floor(6.9 * Math.random());
      this.defaultRender = false;

      this.interval = setTimeout(()=>{
          if(this.difficulty === 'easy') {
            this.dx = undefined;
            this.dy = undefined;
            this.stone = undefined;
            this.defaultRender = true;
        
          }else{
            this.idx= 6;
            this.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
            this.dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
            this.randomStoneBlock();
          } 

          this.startGemCountDown();
      }, 10000);

    }

    randomTime() {
       return 3000*Math.random() + 10000;
    }

    startGemCountDown() {
      this.interval2 = setTimeout(() => this.gemPlacement(), this.randomTime());
    }

    randomStoneBlock(){
      this.interval1 = setInterval(()=>{
          this.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
          this.dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
        }, 5000)
    }

    endGame() {
      document.querySelector('.scorepanel').classList.add('hide');
      document.querySelector('canvas').classList.add('hide');
      const chars = document.querySelector('.message p').children;

      for (const char of chars ){
        char.remove();
      }
      if(this.level === 11 && player.heart > 0){
        this.message.firstElementChild.textContent = 'Congratulations!!!';
        this.message.firstElementChild.style.marginBottom = '0';
        this.message.firstElementChild.nextElementSibling.textContent = `you managed to cross the bug runway 
                                                                    alive only a few legends have done this!!!. 
                                                                    You've proved your competence and now crowned the rightful heir to the throne.`;

        let El = Resources.get(`${player.sprite}`);
        this.message.firstElementChild.nextElementSibling.prepend(El);
        
      }else{
        this.message.firstElementChild.textContent = 'game over!!!';
        this.message.firstElementChild.style.marginBottom = '100px';
        this.message.firstElementChild.nextElementSibling.textContent = 'it wasn\'t ever easy, only a few legends have been able to cross the bug runway. You can be one, but you have to work harder';
        
      }
      this.message.classList.remove('hide');
    }

    updateScorePanel(){
      const scorePanel = document.getElementsByClassName('scorepanel')[0];
      scorePanel.firstElementChild.textContent = `level: ${this.level}`;
      scorePanel.lastElementChild.previousElementSibling.textContent = `difficulty: ${this.difficulty}`
      const hearts = scorePanel.firstElementChild.nextElementSibling.children;
      if (this.init !== true){
          document.querySelector('.heart').textContent = ''
          for(const heart of hearts){
            heart.remove();
          }
          for(let i = 0; i < 4; i++){
            const img = new Image();
            img.src = 'images/Heart.png';
            document.querySelector('.heart').appendChild(img);
          }
        if(this.difficulty === 'easy'){
          this.init = true; 
          this.startGemCountDown();

        }else{
          this.dy = ( Math.floor(2.9 * Math.random()) + 1 ) * access.imgHeight;
          this.dx =  Math.floor(4.9 * Math.random()) * access.imgWidth;
          this.idx = 6;
          this.defaultRender = false;
          this.init = true;
          this.randomStoneBlock();
          this.startGemCountDown();
        }
      }
      document.getElementsByClassName('scorepanel')[0].classList.remove('hide');
      document.getElementsByTagName('canvas')[0].classList.remove('hide');
    }

  reset() {
    this.x = 1.75;
    this.init = false;
    this.level = 1;
    player.heart = 4;
    if(this.difficulty === 'easy') this.dx = undefined; this.dy = undefined;
    player.dx = 2*access.imgWidth;
    player.dy = 5*access.imgHeight;
    clearInterval(this.interval);
    clearInterval(this.interval1);
    clearInterval(this.interval2);
    clearInterval(this.interval3);
    this.updateScorePanel();
    this.message.classList.add('hide');
  }

  restart() {
    this.reset();
    document.querySelector('.scorepanel').classList.add('hide');
    document.querySelector('canvas').classList.add('hide');
    document.querySelector('.intro').removeAttribute('hidden');
  }
  }

  //instantiate new environment, player and enemy objects;
  window.environment = new Environment();
  window.player = new Player();
  window.allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];

  

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
   if (e.target.tagName === 'BUTTON') {environment.difficulty = e.target.textContent;
        document.getElementsByTagName('section')[1].classList.add('hide');
        environment.reset();
        environment.updateScorePanel();
      }
  });

document.querySelector('.scorepanel > button').addEventListener('click', environment.reset.bind(environment));

document.querySelector('.message').addEventListener('click', function(e){
  if(e.target.classList.contains('restart')){
    environment.restart();
  }else if(e.target.tagName === 'BUTTON'){
    environment.reset();
  }else{return}
})})();