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

  GameLayer.prototype.removeAll = function() {
    _.each(this.entities, function(entity) {
      this.pixi.removeChild(entity.pixi);
    }.bind(this));

    this.entities = [];
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
    this.width = width || 300;
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

  /** --------- MR SQUARE SPECIFIC --------- **/

  var TILES = {
    SQUARE: 0,
    SQUARE_REVERSE: 1,
    SQUARE_BLOCK: 2,
    SPACE: 3,
    HORIZONTAL: 4,
    VERTICAL: 5,
    BLOCK: 6,
    PORTAL: 7,
    UP: 8,
    RIGHT: 9,
    DOWN: 10,
    LEFT: 11,
  };

  var DIRECTION = {
    STATIONARY: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4,
  };

  var MrSquare = function(row, col, reverse, name) {
    this.reverse = reverse? reverse : false;
    this.row = row;
    this.col = col;
    this.direction = DIRECTION.STATIONARY;
    this.name = name? name : (reverse?'Hookey Reverse':'Hookey');
  };

  var Stage = function(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.entities = [];

    this.resize(rows, cols);
  };

  Stage.prototype.placeTile = function(row, col, tile) {
    this.board[row * this.cols + col] = tile;
  };

  Stage.prototype.addMrSquare = function(mrSquare) {
    // Remove previous instance
    // this.entities = _.filter(this.entities, {name: mrSquare.name});
    // Push!
    this.entities.push(mrSquare);
  };

  Stage.prototype.getTile = function(row, col) {
    var tile = this.board[row * this.cols + col];

    return tile;
  };

  Stage.prototype.hasMrSquare = function(row, col) {
    return _.some(this.entities, {row: row, col: col});
  };

  Stage.prototype.isOutOfBounds = function(row, col) {
    return (row < 0 || col < 0 || row >= this.rows || col >= this.cols);
  };

  Stage.prototype.canPassThrough = function(row, col, direction) {
    if (this.hasMrSquare(row, col)) return false;
    if (this.isOutOfBounds(row, col)) return false;
    if (this.getTile(row, col) == TILES.VERTICAL &&
        (direction == DIRECTION.UP ||
         direction == DIRECTION.DOWN)) return false;
    if (this.getTile(row, col) == TILES.HORIZONTAL &&
        (direction == DIRECTION.LEFT ||
         direction == DIRECTION.RIGHT)) return false;
    if (this.getTile(row, col) == TILES.BLOCK ||
        this.getTile(row, col) == TILES.SQUARE_BLOCK) return false;
    return true;
  };

  Stage.prototype.isFinished = function() {
    return _.every(this.board, function(tile, index) {
      if (tile != TILES.SPACE) return true;
      return this.hasMrSquare(index / this.cols, index % this.cols);
    }.bind(this));
  };

  Stage.prototype.resize = function(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.board = _.times(rows * cols, _.constant(TILES.SPACE));
  };

  Stage.prototype.step = function() {
    _.each(this.entities, function(entity) {
      // Place block on current position
      var index = entity.row * this.cols + entity.col;
      if (this.board[index] == TILES.SPACE ||
          this.board[index] == TILES.VERTICAL ||
          this.board[index] == TILES.HORIZONTAL) {
        this.board[index] = TILES.SQUARE_BLOCK;
      }
    }.bind(this));

    _.each(this.entities, function(entity) {
      var prevRow = entity.row;
      var prevCol = entity.col;

      // Move entity
      if (entity.direction == DIRECTION.UP &&
          this.canPassThrough(entity.row - 1, entity.col, entity.direction)) {
        entity.row -= 1;
      } else if (entity.direction == DIRECTION.DOWN &&
          this.canPassThrough(entity.row + 1, entity.col, entity.direction)) {
        entity.row += 1;
      } else if (entity.direction == DIRECTION.LEFT &&
          this.canPassThrough(entity.row, entity.col - 1, entity.direction)) {
        entity.col -= 1;
      } else if (entity.direction == DIRECTION.RIGHT &&
          this.canPassThrough(entity.row, entity.col + 1, entity.direction)) {
        entity.col += 1;
      }

      if (this.getTile(entity.row, entity.col) == TILES.LEFT) {
        entity.direction = DIRECTION.LEFT;
      } else if (this.getTile(entity.row, entity.col) == TILES.RIGHT) {
        entity.direction = DIRECTION.RIGHT;
      } else if (this.getTile(entity.row, entity.col) == TILES.UP) {
        entity.direction = DIRECTION.UP;
      } else if (this.getTile(entity.row, entity.col) == TILES.DOWN) {
        entity.direction = DIRECTION.DOWN;
      } else if (this.getTile(entity.row, entity.col) == TILES.PORTAL) {

        // get pair portal
        var index = entity.row * this.cols + entity.col;

        var pairIndex = _.findIndex(this.board, function(t, i) {
          if (i == index) return false;
          if (t == TILES.PORTAL) return true;
          return false;
        });

        var pairRow = Math.floor(pairIndex / this.cols);
        var pairCol = Math.floor(pairIndex % this.cols);

        if ((entity.row != prevRow || entity.col != prevCol) &&
            this.canPassThrough(pairRow, pairCol, entity.direction)) {
          entity.row = pairRow;
          entity.col = pairCol;
        }
      }
    }.bind(this));
  };

  Stage.prototype.inputMove = function(direction) {
    _.each(this.entities, function(entity) {
      entity.direction = direction;
      if (entity.reverse) {
        if (direction == DIRECTION.UP) entity.direction = DIRECTION.DOWN;
        if (direction == DIRECTION.DOWN) entity.direction = DIRECTION.UP;
        if (direction == DIRECTION.LEFT) entity.direction = DIRECTION.RIGHT;
        if (direction == DIRECTION.RIGHT) entity.direction = DIRECTION.LEFT;
      }
    });

    while (true) {
      var prevHash = this.hash();
      this.step();
      if (prevHash == this.hash())
        break;
    }

    if (this.isFinished()) {
      console.log('Finished!');
    }
  };

  Stage.prototype.hash = function() {
    return this.board.join('') + _.map(this.entities, function(e) {
      return e.row + '' + e.col;
    }).join('');
  };

  var MrSquareRenderer = function(mrSquareInstance, targetId) {
    this.instance = mrSquareInstance;

    var target = document.getElementById(targetId);
    this.game = new Game(target, 300, 300);

    var scale = {x: 10, y: 10};

    this.envLayer = new GameLayer();
    this.envLayer.pixi.scale = scale;

    this.game.addLayer(this.envLayer);
  };

  MrSquareRenderer.prototype.render = function() {
    this.envLayer.removeAll();
    _.each(_.range(this.instance.rows * this.instance.cols), function(i) {
      var tile = new Entity(this.textureMap[this.instance.board[i]]);
      tile.pixi.x = (i % this.instance.cols) * this.textureTileSize;
      tile.pixi.y = Math.floor(i / this.instance.cols) * this.textureTileSize;

      this.envLayer.addEntity(tile);
    }.bind(this));

    _.each(this.instance.entities, function(e) {
      var texture = this.textureMap[e.reverse?TILES.SQUARE_REVERSE:TILES.SQUARE];
      var tile = new Entity(texture);

      tile.pixi.x = e.col * this.textureTileSize;
      tile.pixi.y = e.row * this.textureTileSize;
      this.envLayer.addEntity(tile);
    }.bind(this));
  };

  MrSquareRenderer.prototype.setTilemap = function(imageName) {
    var baseTexture = PIXI.BaseTexture.fromImage(imageName);
    this.textureTileSize = 3;

    var sz = this.textureTileSize;

    function text(row, col) {
      var texture = new PIXI.Texture(
        baseTexture, new PIXI.Rectangle(sz * row, sz * col, sz, sz));

      return texture;
    };

    this.textureMap = {};
    this.textureMap[TILES.SQUARE] = text(0, 0);
    this.textureMap[TILES.SQUARE_REVERSE] = text(1, 0);
    this.textureMap[TILES.SQUARE_BLOCK] = text(2, 0);
    this.textureMap[TILES.BLOCK] = text(3, 0);
    this.textureMap[TILES.SPACE] = text(4, 0);
    this.textureMap[TILES.HORIZONTAL] = text(5, 0);
    this.textureMap[TILES.VERTICAL] = text(6, 0);
    this.textureMap[TILES.PORTAL] = text(7, 0);
    this.textureMap[TILES.UP] = text(0, 1);
    this.textureMap[TILES.RIGHT] = text(1, 1);
    this.textureMap[TILES.DOWN] = text(2, 1);
    this.textureMap[TILES.LEFT] = text(3, 1);
  };

  MrSquareRenderer.prototype.start = function() {
    this.game.start();
  };

  MrSquareRenderer.prototype.step = function() {
    while (true) {
      var prevHash = this.instance.hash();
      if (this.instance.hash == prevHash) {
        break;
      } else {
        this.instance.step();
      }
    }
  };

  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  PIXI.loader
    .add(arch.getImageResource('mr-square/square'))
    .load(setup);

  function setup() {
    var game = new Stage(8, 8);
    game.addMrSquare(new MrSquare(0, 0));
    game.addMrSquare(new MrSquare(0, 7, true));

    game.placeTile(0, 6, TILES.PORTAL);
    game.placeTile(5, 6, TILES.PORTAL);

    var renderer = new MrSquareRenderer(game, 'target');
    renderer.setTilemap(arch.getImageResource('mr-square/square'));
    renderer.start();

    renderer.render();

    document.addEventListener('keydown', function(key) {
      if (key.keyCode === 87 || key.keyCode === 38) {
        game.inputMove(DIRECTION.UP);
      }
      if (key.keyCode === 83 || key.keyCode === 40) {
        game.inputMove(DIRECTION.DOWN);
      }
      if (key.keyCode === 65 || key.keyCode === 37) {
        game.inputMove(DIRECTION.LEFT);
      }
      if (key.keyCode === 68 || key.keyCode === 39) {
        game.inputMove(DIRECTION.RIGHT);
      }
      renderer.render();
    });

    window.upf = function(s) {
      if (s == 0)
        game.inputMove(DIRECTION.UP);
      if (s == 1)
        game.inputMove(DIRECTION.DOWN);
      if (s == 2)
        game.inputMove(DIRECTION.LEFT);
      if (s == 3)
        game.inputMove(DIRECTION.RIGHT);
      renderer.render();
    }

    var controls = document.getElementById('controls');
    var up = document.createElement('button');
    up.setAttribute('onclick', 'upf(0)' );
    up.innerHTML = 'UP';
    var dn = document.createElement('button');
    dn.setAttribute('onclick', 'upf(1)' );
    dn.innerHTML = 'DOWN';
    var lf = document.createElement('button');
    lf.setAttribute('onclick', 'upf(2)' );
    lf.innerHTML = 'LEFT';
    var rt = document.createElement('button');
    rt.setAttribute('onclick', 'upf(3)' );
    rt.innerHTML = 'RIGHT';
    controls.appendChild(up);
    controls.appendChild(dn);
    controls.appendChild(lf);
    controls.appendChild(rt);
  }

})(PIXI, document, window);