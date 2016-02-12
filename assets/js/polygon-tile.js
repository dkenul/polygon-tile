var PolygonTile = function(radius, polyColor, numSides) {

  var radius = radius || 50;
  var polyColor = polyColor || 'blue';
  var numSides = numSides || 4;
  var isRegular = numSides == 3 || numSides == 4 || numSides == 6;

  var createRegularPolygon = function(point, offset) {
    offset = offset || 0;
    var points = [];

    for (var i = 1; i <= numSides; i++) {
      var x = point[0] + Math.cos(2*Math.pi*i/numSides + offset);
      var y = point[1] + Math.sin(2*Math.pi*i/numSides + offset);

      points.push(x + ',' + y);
    }

    points = points.join(' ');



  };


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
    var newPoints = x+','+y+' '+x+','+(y+radius)+' '+(x+radius)+','+(y+radius)+' '+(x+radius)+','+y;

    if (!$('polygon[points="' + newPoints + '"]')[0] &&
        !(x < -(radius) || x > $(window).width()) &&
        !(y < -(radius) || y > $(window).height())) {

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

    var left = [parsedPoints[0][0] - radius, parsedPoints[0][1]];
    var top = [parsedPoints[0][0], parsedPoints[0][1] - radius];
    var bottom= parsedPoints[1];
    var right = parsedPoints[3];

    createNewSquare(left);
    createNewSquare(top);
    createNewSquare(bottom);
    createNewSquare(right);
  };

  this.animate = function() {
    var counter = 0;
    var animationInterval = setInterval(function() {
      startX = ($(window).width() - radius) / 2
      startY = ($(window).height() - radius) / 2
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

  this.render = function() {
    var counter = 0;

    while (1) {
      startX = ($(window).width() - radius) / 2
      startY = ($(window).height() - radius) / 2
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

      if (counter == 40) {
        break;
      }
    }
  }
}
