var requestAnimFrame = (window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function(cb) { setTimeout(cb, 1000/60); });

(function (PIXI) {
  var stage = new PIXI.Stage(0x66FF99);
  var renderer = new PIXI.autoDetectRenderer(400, 300);

  var target = document.getElementById('target');
  target.appendChild(renderer.view);


  var texture = PIXI.Texture.fromImage('/archcap2/images/pixi-proto/bunny.png')
  var bunny = new PIXI.Sprite(texture);

  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  bunny.position.x = 200;
  bunny.position.y = 150;

  stage.addChild(bunny)

  requestAnimFrame(animate);
  function animate() {
    requestAnimFrame(animate);

    bunny.rotation += 0.1;

    renderer.render(stage);
  }
})(PIXI);