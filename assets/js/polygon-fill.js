var PolygonFill = function() {
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
    var newPoints = x+','+y+' '+x+','+(y+100)+' '+(x+100)+','+(y+100)+' '+(x+100)+','+y;

    if (!$('polygon[points="' + newPoints + '"]')[0] &&
        !(x < 0 || x > $(window).width()) &&
        !(y < 0 || y > $(window).height())) {

      d3.select('svg')
        .append('polygon')
        .attr('class', 'new-poly')
        .attr('fill', 'blue')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('points', newPoints)
        .attr("style", "fill-opacity:" + (Math.random() + 0.5) / 2);

    }
  };

  var createNewSquares = function(points) {
    var parsedPoints = parsePoints(points);

    var left = [parsedPoints[0][0] - 100, parsedPoints[0][1]];
    var top = [parsedPoints[0][0], parsedPoints[0][1] - 100];
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
      $('polygon').each(function() {
        var points = $( this ).attr('points');
        createNewSquares(points);

      // if ( $(this).attr('class') == 'new-poly') {
      //   $(this).attr('fill', 'red').attr('class', 'poly-2');
      // } else if ($(this).attr('class') == 'poly-2') {
      //   $(this).attr('fill', 'yellow').attr('class', 'poly-3');
      // } else if ($(this).attr('class') == 'poly-3') {
      //   $(this).attr('fill', 'blue').attr('class', 'poly-4');
      // } else {
      //   // $(this).attr('style', 'display:none');
      // }

      })

      counter++;

      if (counter == 25) {
        clearInterval(animationInterval);
      }
    }, 200)
  };
}
