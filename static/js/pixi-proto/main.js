(function (PIXI) {
  class Entity {
    constructor(texture) {
      this.id = Entity._genId++;
      this.pixi = new PIXI.Sprite(texture);
    }

    step(delta) {}
  }

  class GameLayer {
    constructor() {
      this.pixi = new PIXI.Container();
      this.entities = [];
    }

    addEntity(entity) {
      this.entities.push(entity);
      this.pixi.addChild(entity.pixi);
    }

    removeEntity(entity) {
      this.entities = _.filter(this.entities, function (e) {
        return e.id == entity.id;
      });

      this.pixi.removeChild(entity.pixi);
    }

    step(delta) {
      _.each(this.entities, function (e) {
        e.step(delta);
      });
    }
  }

  class Game {
    constructor(element, width, height) {
      this.element = element;
      this.width = width || 400;
      this.height = height || 300;

      this.renderer = new PIXI.autoDetectRenderer(width, height);
      this.layers = [];

      this.isRunning = false;
      this.lastT = Date.now();

      element.appendChild(this.renderer.view);
    }

    step() {
      var now = Date.now();
      var delta = now - this.lastT;
      
      var context = this;
      _.each(this.layers, function (layer) {
        layer.step(delta);
        context.renderer.render(layer.pixi);
      });

      this.lastT = now;
    }

    start() {
      this.isRunning = true;

      var context = this;
      var run = function () {
        if (context.isRunning == false)
          return;

        requestAnimFrame(run);
        context.step(); 
      }
      requestAnimFrame(run);
    }

    stop() {
      this.isRunning = false;
    }

    addLayer(layer) {
      this.layers.push(layer);
    }
  }

  var texture = PIXI.Texture.fromImage(
    arch.getImageResource('pixi-proto/bunny'));

  var bunny = new Entity(texture);
  bunny.pixi.anchor.x = 0.5;
  bunny.pixi.anchor.y = 0.5;
  bunny.pixi.position.x = 200;
  bunny.pixi.position.y = 150;
  bunny.step = function (delta) {
    bunny.pixi.rotation += delta / 100;
  }

  var layer = new GameLayer();
  layer.addEntity(bunny);

  var target = document.getElementById('target');
  var game = new Game(target, 800, 600);
  game.addLayer(layer);

  game.start();

})(PIXI);