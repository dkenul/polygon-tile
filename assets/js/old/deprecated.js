var parsePoints = function(points) {
  var result = [];
  points.split(' ').forEach(function(point) {
    var intPair = [];
    point.split(',').forEach(function(num){
      intPair.push(parseFloat(num));
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

var round12 = function(num) {
  return +(Math.round(num + "e+12")  + "e-12");
};
