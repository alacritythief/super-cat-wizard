var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('wizard', 'assets/wizard.png');
  cat = game.load.image('cat', 'assets/flying_cat.png');
  game.load.audio('nya', 'sfx/nya.m4a');
  game.load.audio('adorable', 'sfx/adorable.m4a');
}

var cat;
var cats;
var wizard;
var score = 0;
var scoreText;
var catCounter = 0;
var clock;
var totalClock = 10;
var clockText;
var goverText;

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function listener(item) {
  item.kill();
  nya = game.add.audio('nya');
  nya.play('');
  score += 10;
  scoreText.text = 'Score: ' + score;
}

function updateCounter() {
  totalClock--;
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#E7F2F5';

  clock = game.time.create(false);
  clock.loop(1000, updateCounter, this);
  clock.start();

  scoreText = game.add.text(16, 750, 'Score: 0', { fontSize: '16px', fill: '#000' });
  clockText = game.add.text(450, 750, 'Clock: ' + totalClock + 's', { fontSize: '16px', fill: '#000' });

  wizard = game.add.sprite(800, 425, 'wizard');
  cats = game.add.group();

  wizard.scale.setTo(0.8,0.8);
  cats.scale.setTo(0.8,0.8);

  for (i = 0; i < 6; i++) {
    cat = cats.create(randomNum(0, 950), randomNum(0, 800), 'cat');
  }

  cats.forEach(function(item) {
    game.physics.enable(item, Phaser.Physics.ARCADE);
    item.body.velocity.setTo(100,100);
    item.body.collideWorldBounds = true;
    item.body.bounce.set(1);
    item.inputEnabled = true;
    item.events.onInputDown.add(listener, this);
  }, this);
}

function update() {
  clockText.text = 'Clock: ' + totalClock + "s";

  if (totalClock < 1) {
    clock.stop();
    goverText = game.add.text(300, 380, 'YOU ARE A POOR APPRENTICE.', { fontSize: '32px', fill: '#000' });
    this.game.paused = true;
  }

  if (cats.countLiving() === 0 && totalClock > 0) {
    totalClock = 10;

    adorable = game.add.audio('adorable');
    adorable.play('');

    for (i = 0; i < 6; i++) {
      cat = cats.create(randomNum(0, 950), randomNum(0, 800), 'cat');
      catCounter += 10;
    }

    cats.forEach(function(item) {
      game.physics.enable(item, Phaser.Physics.ARCADE);
      item.body.velocity.setTo(300 + catCounter , 300 + catCounter);
      item.body.collideWorldBounds = true;
      item.body.bounce.set(1);
      item.inputEnabled = true;
      item.events.onInputDown.add(listener, this);
    }, this);
  }
}
