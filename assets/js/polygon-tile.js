var PolygonTile = function(radius, polyColor, numSides) {

  var radius = radius || 50;
  var polyColor = polyColor || 'blue';
  var numSides = numSides || 4;
  var isRegular = numSides == 3 || numSides == 4 || numSides == 6;
  var tiltAmount = 0;

  var roundBig = function(num) {
    return +(Math.round(num + "e+12")  + "e-12");
  };

  var createPolygon = function(point, offset) {

    offset = offset + tiltAmount || 0;
    var points = [];

    for (var i = 0; i < numSides; i++) {
      var x = roundBig(point[0] + radius * Math.sin(2*Math.PI*i/numSides + offset));
      var y = roundBig(point[1] - radius * Math.cos(2*Math.PI*i/numSides + offset));

      points.push(x + ',' + y);
    }

    points = points.join(' ');

    if (!$('polygon[points="' + points + '"]')[0] &&
        !(x < -(radius) || x > $(window).width()) &&
        !(y < -(radius) || y > $(window).height())) {

      d3.select('svg')
        .append('polygon')
        .attr('class', 'new-poly')
        .attr('fill', polyColor)
        .attr('stroke', polyColor)
        .attr('stroke-width', 2)
        .attr('points', points)
        .attr("style", "fill-opacity:" + (Math.random() + 0.5) / 2)
        .datum({"center": point, "offset": offset});
    }

  };

  var appendRegular = function(point, offset) {
    debugger;

    offset = offset + tiltAmount || 0;
    var halfAngle = (Math.PI / numSides);
    var centerToSide = radius*Math.cos(halfAngle);
    offset += halfAngle;


    for (var i = 0; i < numSides; i++) {
      var x = roundBig(point[0] + 2*centerToSide * Math.sin(2*Math.PI*i/numSides + offset));
      var y = roundBig(point[1] - 2*centerToSide * Math.cos(2*Math.PI*i/numSides + offset));

      if (numSides % 2 == 0) {
        createPolygon([x,y], 0);
      } else {
        createPolygon([x,y], 2*Math.PI*i/numSides + offset);
      }
    }
  };


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

  this.tilt = function() {
    tiltAmount += (2*Math.PI / 8)

    return this;
  }

  this.animate = function() {
    var counter = 0;
    var animationInterval = setInterval(function() {
      startX = (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - radius) / 2
      startY = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - radius) / 2
      if (counter == 0) {
        d3.select('body')
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%');

        createPolygon([startX, startY], 0);
      }


      d3.selectAll('polygon').each(function() {
        var center = d3.select(this).datum().center;
        var offset = d3.select(this).datum().offset;
        appendRegular(center, offset);
      })

      counter++;

      if (counter == 30) {
        clearInterval(animationInterval);
      }
    }, 150)
  };

  // this.render = function() {
  //   var counter = 0;
  //
  //   while (1) {
  //     startX = ($(window).width() - radius) / 2
  //     startY = ($(window).height() - radius) / 2
  //     if (counter == 0) {
  //       d3.select('body')
  //         .append('svg')
  //         .attr('width', '100%')
  //         .attr('height', '100%');
  //
  //       createPolygon([startX, startY]);
  //     }
  //
  //
  //     // $('polygon').each(function() {
  //     //   var points = $( this ).attr('points');
  //     //   createNewSquares(points);
  //     // })
  //
  //     counter++;
  //
  //     if (counter == 40) {
  //       break;
  //     }
  //   }
  // };
}
