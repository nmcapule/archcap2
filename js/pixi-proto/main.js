(function (PIXI) {

  /**
   * @brief Entity
   * @details Objects usually inside the GameLayer
   */
  var Entity = function (texture) {
    this.id = Entity._genId++;
    this.pixi = new PIXI.Sprite(texture);

    // Override
    this.step = function (delta) {};
  };


  /**
   * @brief Stage
   * @details Main layers under a game
   */
  var GameLayer = function () {
    this.pixi = new PIXI.Container();
    this.entities = [];
  };

  GameLayer.prototype.addEntity = function (entity) {
    this.entities.push(entity);
    this.pixi.addChild(entity.pixi);
  };

  GameLayer.prototype.removeEntity = function (entity) {
    this.entities = _.filter(this.entities, function (e) {
      return e.id == entity.id;
    });

    this.pixi.removeChild(entity.pixi);
  };

  GameLayer.prototype.step = function (delta) {
    _.each(this.entities, function (e) {
      e.step(delta);
    });
  };


  /**
   * @brief Game
   * @details Game loop and main game things
   */
  var Game = function (element, width, height) {
    this.element = element;
    this.width = width || 400;
    this.height = height || 300;

    this.renderer = new PIXI.autoDetectRenderer(width, height);
    this.layers = [];

    this.isRunning = false;
    this.lastT = Date.now();

    element.appendChild(this.renderer.view);
  };

  Game.prototype.step = function () {
    var now = Date.now();
    var delta = now - this.lastT;
    
    var context = this;
    _.each(this.layers, function (layer) {
      layer.step(delta);
      context.renderer.render(layer.pixi);
    });

    this.lastT = now;
  };

  Game.prototype.start = function () {
    this.isRunning = true;

    var context = this;
    var run = function () {
      if (context.isRunning == false)
        return;

      requestAnimFrame(run);
      context.step(); 
    }
    requestAnimFrame(run);
  };

  Game.prototype.stop = function () {
    this.isRunning = false;
  };

  Game.prototype.addLayer = function (layer) {
    this.layers.push(layer);
  };


  /**
   * @brief Arena
   * @details sub GameLayer
   */
  var Arena = function (width, height) {
    GameLayer.call(this);

    this.rectangle = new PIXI.Rectangle(0, 0, width, height);
  };

  Arena.prototype = Object.create(GameLayer.prototype);

  // --- Setup
  var texture = PIXI.Texture.fromImage(
    arch.getImageResource('pixi-proto/bunny'));

  var bunny = new Entity(texture);
  bunny.pixi.anchor.x = 0.5;
  bunny.pixi.anchor.y = 0.5;
  bunny.pixi.position.x = 200;
  bunny.pixi.position.y = 150;
  bunny.step = function (delta) {
    bunny.pixi.rotation += delta / 100;
  };

  var layer = new GameLayer();
  layer.addEntity(bunny);

  var target = document.getElementById('target');
  var game = new Game(target, 400, 300);
  game.addLayer(layer);

  game.start();

})(PIXI);