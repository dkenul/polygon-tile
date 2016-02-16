var isOverlap = function(pointsToCheck) {
  for (var i = 0; i < pointStore.length; i++) {

    var overlap = 0;
    for (var j = 0; j < pointsToCheck.length; j++) {
      if (checkRoundingError(Math.round(pointStore[i][j][0]), Math.round(pointsToCheck[j][0])) &&
      checkRoundingError(Math.round(pointStore[i][j][1]), Math.round(pointsToCheck[j][1]))) {
        overlap += 1;
        if (overlap == numSides) {
          return true;
        }
      } else {
        break;
      }
    }
  }

  return false;
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

var round12 = function(num) {
  return +(Math.round(num + "e+12")  + "e-12");
};

// Rotation of points is no longer necessary with current overlap analysis

// if (!numSides % 2 == 0) {
//   if (offset == 0) {
//     rotations = 0;
//   } else if (Math.round(offset / referenceAngle) == 0) {
//     rotations = numSides - (offset / referenceAngle);
//   } else {
//     rotations = numSides - (offset - (referenceAngle / 2)) / referenceAngle;
//   }
//
//   toStore.rotate(rotations);
//   points.rotate(rotations);
// }

var checkRoundingError = function(num1, num2) {
  return (num1 == num2 || num1 + 1 == num2 || num1 - 1 == num2);
}

// Checks for clipping ON POINT CONNECTIONS. This is not an area based analysis.
// Useful for collision detection when predefined path is guaranteed to work.
// Very slow - is now deprecated.

var isClipping = function(pointsToCheck) {
  return pointStore.some(function(storedPoints) {
    var overlap = 0;
    var lastIsOverlap = false;
    var isOverlap = false;
    var sideCounter = 1;
    var firstOverlap = false;
    var finalOverlap = false;
    return storedPoints.some(function(storedPoint) {


      if (isOverlap) {
        lastIsOverlap = true;
      } else {
        lastIsOverlap = false;
      }

      isOverlap = false;

      pointsToCheck.forEach(function(checkPoint) {
        if (checkRoundingError(Math.round(storedPoint[0]), Math.round(checkPoint[0])) &&
        checkRoundingError(Math.round(storedPoint[1]), Math.round(checkPoint[1]))) {
          overlap += 1;
          isOverlap = true;
        }
      });

      if (isOverlap && sideCounter == 1) {
        firstOverlap = true;
      } else if (isOverlap && sideCounter == numSides) {
        finalOverlap = true;
      }

      if ((overlap == 2 && isOverlap && !(lastIsOverlap || firstOverlap && finalOverlap) || overlap > 2)) {
        return true;
      }

      sideCounter++;
    });
  });
};

Array.prototype.rotate = function(n) {
    while (this.length && n < 0) n += this.length;
    this.push.apply(this, this.splice(0, n));
    return this;
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

var round12 = function(num) {
  return +(Math.round(num + "e+12")  + "e-12");
};
