PlayState = {}

PlayState._spawnCharacters = function (data) {
	this.hero = new Hero(this.game, data.hero.x, data.hero.y);
	this.game.add.existing(this.hero);

};

function Hero(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'hero');
	this.anchor.set(0.5,0.5);
	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

PlayState.preload = function () {
	this.game.load.image('hero', 'images/hero_stopped.png');
	this.game.load.image('background', 'images/background.png');
	this.game.load.json('level:1', 'data/level01.json');
	this.game.load.image('ground', 'images/ground.png');
	this.game.load.image('grass:8x1', 'images/grass_8x1.png');
	this.game.load.image('grass:6x1', 'images/grass_6x1.png');
	this.game.load.image('grass:4x1', 'images/grass_4x1.png');
	this.game.load.image('grass:2x1', 'images/grass_2x1.png');
	this.game.load.image('grass:1x1', 'images/grass_1x1.png');

};

PlayState.create = function () {
	this.game.add.image(0, 0, 'background');
	this._loadLevel(this.game.cache.getJSON('level:1'));
};

PlayState._loadLevel = function (data) {
	this.platforms = this.game.add.group();
	this._spawnCharacters({hero: data.hero});
	data.platforms.forEach(this._spawnPlatform, this);
	const GRAVITY = 1200

	this.game.physics.arcade.gravity.y = GRAVITY;
};

window.onload = function () {
	let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
	game.state.add('play', PlayState);
	game.state.start('play');
};

PlayState._spawnPlatform = function (platform) {
	this.game.add.sprite(platform.x, platform.y, platform.image);
	let sprite = this.platforms.create(
		platform.x, platform.y, platform.image);

	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
};

PlayState.init = function () {
	this.keys = this.game.input.keyboard.addKeys({
		left: Phaser.KeyCode.LEFT,
		right: Phaser.KeyCode.RIGHT,
	});
	this.game.renderer.renderSession.roundPixels = true;
};

Hero.prototype.move = function (direction) {
	const SPEED = 200;
	this.body.velocity.x= direction * SPEED;
};

PlayState.update = function () {
	this._handleCollisions();
	this._handleInput();
};

PlayState._handleInput = function () {
	if (this.keys.left.isDown) {
		this.hero.move(-1);
	}
	else if (this.keys.right.isDown) {
		this.hero.move(1);
	}
	else {
		this.hero.move(0);
	}
};

PlayState._handleCollisions = function () {
	this.game.physics.arcade.collide(this.hero, this.platforms);
};