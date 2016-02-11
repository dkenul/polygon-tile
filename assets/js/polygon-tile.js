var PolygonTile = function(polySize, polyColor) {

  var polySize = polySize || 100;
  var polyColor = polyColor || 'blue';

  var parsePoints = function(points) {
    var result = [];
    points.split(' ').forEach(function(point) {
      var intPair = [];
      point.split(',').forEach(function(num){
        intPair.push(parseInt(num));
      });

      result.push(intPair);
    });

    return result;
  };

  var createNewSquare = function(point) {
    var x = point[0];
    var y = point[1];
    var newPoints = x+','+y+' '+x+','+(y+polySize)+' '+(x+polySize)+','+(y+polySize)+' '+(x+polySize)+','+y;

    if (!$('polygon[points="' + newPoints + '"]')[0] &&
        !(x < -(polySize) || x > $(window).width()) &&
        !(y < -(polySize) || y > $(window).height())) {

      d3.select('svg')
        .append('polygon')
        .attr('class', 'new-poly')
        .attr('fill', polyColor)
        .attr('stroke', polyColor)
        .attr('stroke-width', 2)
        .attr('points', newPoints)
        .attr("style", "fill-opacity:" + (Math.random() + 0.5) / 2);

    }
  };

  var createNewSquares = function(points) {
    var parsedPoints = parsePoints(points);

    var left = [parsedPoints[0][0] - polySize, parsedPoints[0][1]];
    var top = [parsedPoints[0][0], parsedPoints[0][1] - polySize];
    var bottom= parsedPoints[1];
    var right = parsedPoints[3];

    createNewSquare(left);
    createNewSquare(top);
    createNewSquare(bottom);
    createNewSquare(right);
  };

  this.startAnimation = function() {
    var counter = 0;
    var animationInterval = setInterval(function() {
      startX = ($(window).width() - polySize) / 2
      startY = ($(window).height() - polySize) / 2
      if (counter == 0) {
        d3.select('body')
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%');

        createNewSquare([startX, startY]);
      }


      $('polygon').each(function() {
        var points = $( this ).attr('points');
        createNewSquares(points);
      })

      counter++;

      if (counter == 30) {
        clearInterval(animationInterval);
      }
    }, 150)
  };
}
