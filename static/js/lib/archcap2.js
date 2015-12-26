(function() {
  var requestAnimFrame = (window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(cb) { setTimeout(cb, 1000/60); });

  var arch = {};

  arch.RES_DIR = '/archcap2';
  arch.IMAGE_DIR = arch.RES_DIR + '/images'

  arch.getImageResource = function(fp, extension) {
    extension = extension || '.png';
    return arch.IMAGE_DIR + '/' + fp + extension;
  };

  window.requestAnimFrame = requestAnimFrame;
  window.arch = arch;
})();
