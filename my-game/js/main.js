PlayState._spawnCharacters = function (data) {
	// spawn hero
	this.hero = new Hero(this.game, data.hero.x, data.hero.y);
	this.game.add.existing(this.hero);
};

function Hero(game, x, y) {
	//
	Phaser.Sprite.call(this, game, x, y, 'hero');
	//hero positionieren
	this.anchor.set(0.5, 0.5);
}
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

//load game assets here
PlayState.preload = function () {
	// main character laden
	this.game.load.image('hero', 'images/hero_stopped.png');
	//
	this.game.load.image('background', 'images/background.png');
	//
	this.game.load.json('level:1', 'data/level01.json');
	//Bilder für Plattformen laden
	this.game.load.image('ground', 'images/ground.png');
	this.game.load.image('grass:8x1', 'images/grass_8x1.png');
	this.game.load.image('grass:6x1', 'images/grass_6x1.png');
	this.game.load.image('grass:4x1', 'images/grass_4x1.png');
	this.game.load.image('grass:2x1', 'images/grass_2x1.png');
	this.game.load.image('grass:1x1', 'images/grass_1x1.png');

};

// create game entities and set up world here
PlayState.create = function () {
	//Hintergrund
	this.game.add.image(0, 0, 'background');
	//
	this._loadLevel(this.game.cache.getJSON('level:1'));
};

PlayState._loadLevel = function (data) {
	// Hero spawnen
	this._spawnCharacters({hero: data.hero});
	//alle Plattformen spawnen
	data.platforms.forEach(this._spawnPlatform, this);
};


window.onload = function () {
	let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
	game.state.add('play', PlayState);
	game.state.start('play');
};

PlayState._spawnPlatform = function (platform) {
	this.game.add.sprite(platform.x, platform.y, platform.image);
};


