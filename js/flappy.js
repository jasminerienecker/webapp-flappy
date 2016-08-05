var stateActions = { preload: preload, create: create, update: update };


var game = new Phaser.Game(850, 400, Phaser.AUTO, 'game', stateActions);
var score = -3;
var pipeBlock;
var gameSpeed = 75;
var pipeSpeed = 0;
var pipeInterval =  2.75 * Phaser.Timer.SECOND;
var labelScore;
var pipes = [];
var fish = [];
var shark = [];
var coin = [];
var canvasHeight = 400;
var gameGravity = 500;
var splashDisplay;
var modes = {
  easy: {
    gameSpeed: 50,
    pipeInterval: 4 * Phaser.Timer.SECOND,
    pipeSpeed: 0,
  },
  normal: {
    gameSpeed: 75,
    pipeInterval: 2.75 * Phaser.Timer.SECOND,
    pipeSpeed: 0
  },
  hard: {
    gameSpeed: 125,
    pipeInterval: 1.70 * Phaser.Timer.SECOND,
    pipeSpeed: 0
  },
  extrahard: {
    gameSpeed: 125,
    pipeInterval: 1.70 * Phaser.Timer.SECOND,
    pipeSpeed: 30
  }
};

function preload() {
  game.load.image("playerImg", "../assets/dolphin.png");
  game.load.image("coin", "../assets/coin.png");
  game.load.image("scrolling", "../assets/imageedit_6_4829295746.jpg");
  game.load.image("backgroundImg", "../assets/under-the-sea.jpg");
  game.load.audio("score", "../assets/bubbling.mp3");
  game.load.image("pipes", "../assets/imageedit_28_2142892550.gif");
  game.load.image("fish", "../assets/fish.gif");
  game.load.image("shark", "../assets/shark.png");
  game.load.image("background2", "../assets/background2.jpg");
  game.load.image("easy", "../assets/EASY.png");
  game.load.image("normal", "../assets/NORMAL.png");
  game.load.image("hard", "../assets/HARD.png");
  game.load.image("extrahard", "../assets/EXTRAHARD.png");
}

function create() {
  var backgroundVelocity = -15;
  var backgroundSprite = game.add.tileSprite(0, 0, 850, 400, "scrolling");
  backgroundSprite.autoScroll(backgroundVelocity, 0);

  player = game.add.sprite(330, 200, "playerImg");
  player.width = player.width * 0.06;
  player.height = player.height * 0.06;
  player.anchor.setTo(0.5, 0.5);
  labelScore = game.add.text(20, 20, "0");
  game.physics.arcade.enable(player);

  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);

  easyTag = game.add.sprite(850, 25, "easy");
  easyTag.height = 40;
  game.physics.arcade.enable(easyTag);
  easyTag.body.velocity.x = -50;
  normalTag = game.add.sprite(850, 127, "normal");
  normalTag.height = 40;
  game.physics.arcade.enable(normalTag);
  normalTag.body.velocity.x = -50;
  hardTag = game.add.sprite(850, 233, "hard");
  hardTag.height = 40;
  game.physics.arcade.enable(hardTag);
  hardTag.body.velocity.x = -50;
  extrahardTag = game.add.sprite(850, 335, "extrahard");
  extrahardTag.height = 40;
  game.physics.arcade.enable(extrahardTag);
  extrahardTag.body.velocity.x = -50;

  player.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(player);
  player.body.gravity.y = 500;

  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(spaceHandler);
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);

}

function start() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  generate();
  game.time.events.loop(pipeInterval, generate);

}

function update() {
  game.physics.arcade.overlap(player, easyTag, function(){
    easyTag.destroy();
    normalTag.destroy();
    hardTag.destroy();
    extrahardTag.destroy();
    setMode(modes.easy);
    game.time.events.loop(pipeInterval, generate);
  });
  game.physics.arcade.overlap(player, normalTag, function(){
    easyTag.destroy();
    normalTag.destroy();
    hardTag.destroy();
    extrahardTag.destroy();
    setMode(modes.normal);
    game.time.events.loop(pipeInterval, generate);
  });
  game.physics.arcade.overlap(player, hardTag, function(){
    easyTag.destroy();
    normalTag.destroy();
    hardTag.destroy();
    extrahardTag.destroy();
    setMode(modes.hard);
    game.time.events.loop(pipeInterval, generate);
  });
  game.physics.arcade.overlap(player, extrahardTag, function(){
    easyTag.destroy();
    normalTag.destroy();
    hardTag.destroy();
    extrahardTag.destroy();
    setMode(modes.extrahard);
    game.time.events.loop(pipeInterval, generate);
  });
  game.physics.arcade.overlap(player, pipes, gameOver);
  player.rotation = Math.atan(player.body.velocity.y / 250);

/*
  for (var i = 0; i < pipes.length; i++) {
    if (pipes[i].x < -50) {
      pipes[i].destroy();
      pipes.splice(i, 1);
    }
}
*/

  if (player.y > canvasHeight) {
    player.body.velocity.y = -player.body.velocity.y;
    player.y = canvasHeight - 20;
  }
  if (player.y < 12) {
    player.y = 12;
  }

  for (var i = 0; i < pipes.length; i +=6){
    if (pipes[i].body.y < -50) {
      for (j = i; j < i+6; j++) {
        pipes[j].body.velocity.y = pipeSpeed;
      }
    }
    else if (pipes[i].body.y > 0){
      for (j = i; j < i + 6; j++) {
        pipes[j].body.velocity.y = -pipeSpeed;
    }
  }
}

  for (var i = coin.length - 1; i >= 0; i--){
    game.physics.arcade.overlap(player, coin[i], function(p, c){
      changeScore();
      c.destroy();
      for(var j = 0; j < coin.length; j ++){
        if(c == coin[j]){
          coin.splice(j, 1);
          break;
        }
      }
    });

  for (var i = fish.length - 1; i >= 0; i--){
    game.physics.arcade.overlap(player, fish[i], function(p, f){
      changeGravity(-50);
      f.destroy();
      for(var j = 0; j < fish.length; j ++){
        if(f == fish[j]){
          fish.splice(j, 1);
          break;
        }
      }
    });
  }

  for (var i = shark.length - 1; i >= 0; i --){
    game.physics.arcade.overlap(player, shark[i], function(p, s){
      changeGravity(100);
      s.destroy();
      for(var j = 0; j < shark.length; j ++){
        if(s == shark[j]){
          shark.splice(j, 1);
          break;
        }
      }
    });
  }
}
}

function setMode(mode) {
  gameSpeed = mode.gameSpeed;
  pipeInterval = mode.pipeInterval;
  pipeSpeed = mode.pipeSpeed;
}

function clickHandler(event) {
  game.add.sprite(event.x, event.y, "playerImg");
}

function spaceHandler() {
    game.sound.play("score");
    player.body.velocity.y = -200;
}

function changeScore(){
  score = score + 1;
  if (score > -1) {
    labelScore.setText(score.toString());
  }
}

function changeGravity(g){
  gameGravity += g;
  player.body.gravity.y = gameGravity;
}


function generatePipe(){
    var gapStart = game.rnd.integerInRange(1, 5);
    for (var count=0; count<8; count++){
      if (count != gapStart && count != gapStart + 1){
        addPipeBlock(850, -50)
        addPipeBlock(850, count*50);
    }
  }
  changeScore();
}

function addPipeBlock(x, y) {
  pipeBlock = game.add.sprite(x, y, "pipes");
  pipes.push(pipeBlock);
  game.physics.arcade.enable(pipeBlock);
  pipeBlock.body.velocity.x = -gameSpeed;
  pipeBlock.body.velocity.y = pipeSpeed;
}

function generateCoin() {
  var bonus = game.add.sprite(950, 200, "coin");
  bonus.width = bonus.width * 0.08;
  bonus.height = bonus.height * 0.08;
  coin.push(bonus);
  game.physics.enable(bonus);
  bonus.body.velocity.x = game.rnd.integerInRange(-30, -75);
  bonus.body.velocity.y = game.rnd.integerInRange(-15, 15);

  generatePipe();
}

function generateFish() {
  var bonus = game.add.sprite(950, 200, "fish");
  bonus.width = bonus.width * 0.08;
  bonus.height = bonus.height * 0.08;
  fish.push(bonus);
  game.physics.enable(bonus);
  bonus.body.velocity.x = game.rnd.integerInRange(-30, -75);
  bonus.body.velocity.y = game.rnd.integerInRange(-15, 15);

  generatePipe();
}

function generateShark() {
  var bonus = game.add.sprite(950, 200, "shark");
  bonus.width = bonus.width * 0.1;
  bonus.height = bonus.height * 0.1;
  shark.push(bonus);
  game.physics.enable(bonus);
  bonus.body.velocity.x = game.rnd.integerInRange(-30, -100);
  bonus.body.velocity.y = game.rnd.integerInRange(-15, 15);

  generatePipe();
}

function generate() {
  var diceRoll = game.rnd.integerInRange(1, 10);
  if (diceRoll == 1) {
    generateFish();
  }
  else if (diceRoll == 2) {
    generateShark();
  }
  else if (diceRoll == 3) {
    generateCoin();
  }
  else if (diceRoll == 4) {
    generateCoin();
  }
  else {
    generatePipe();
  }
}


function gameOver(){
  registerScore(score);
  game.state.restart();
  score = -3;
  gameGravity = 500;
}
