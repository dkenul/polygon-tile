Array.prototype.rotate = function(n) {
    while (this.length && n < 0) n += this.length;
    this.push.apply(this, this.splice(0, n));
    return this;
};

var PolygonTile = function(radius, polyColor, numSides) {

  var radius = radius || 50;
  var polyColor = polyColor || 'blue';
  var numSides = numSides || 4;
  var isRegular = numSides == 3 || numSides == 4 || numSides == 6;
  var tiltAmount = 0;
  var pointStore = [];
  var centers = {};

  var checkRoundingError = function(num1, num2) {
    return (num1 == num2 || num1 + 1 == num2 || num1 - 1 == num2);
  }

  // Checks for an Exact overlap. Very fast lookup with hashing (checks within 1 pixel).
  // Useful only for 3, 4, 6 sided polygon tessellation because there can only be exact overlap.

  var isOverlap = function(center) {
    center = [Math.round(center[0]), Math.round(center[1])];
    x = center[0];
    y = center[1];

    if (centers[center] || centers[[x+1, y]] || centers[[x-1, y]]
      || centers[[x, y+1]] || centers[[x, y-1]] || centers[[x+1,y+1]]
      || centers[[x-1,y-1]] || centers[[x+1,y-1]] || centers[[x-1,y+1]]) {
        return true;
      }

      return false;
  };

  // Checks for clipping ON POINT CONNECTIONS. This is not an area based analysis.
  // Useful for collision detection when predefined path is guaranteed to work.

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

  var createPolygon = function(point, offset, iteration) {

    iteration = iteration || 0;
    offset = offset + tiltAmount || 0;
    var points = [];
    var toStore = [];
    var rotations;
    var referenceAngle = (2*Math.PI / numSides);

    for (var i = 0; i < numSides; i++) {
      var x = (point[0] + radius * Math.sin(2*Math.PI*i/numSides + offset));
      var y = (point[1] - radius * Math.cos(2*Math.PI*i/numSides + offset));



      toStore.push([x,y])
      points.push(x + ',' + y);
    }

    if (!numSides % 2 == 0) {
      if (offset == 0) {
        rotations = 0;
      } else if (Math.round(offset / referenceAngle) == 0) {
        rotations = numSides - (offset / referenceAngle);
      } else {
        rotations = numSides - (offset - (referenceAngle / 2)) / referenceAngle;
      }

      toStore.rotate(rotations);
      points.rotate(rotations);
    }

    points = points.join(' ');

    if ((isRegular && !isOverlap(point)
        || !isRegular && !isClipping(toStore))
        // && !(x < -(radius) || x > $(document).width())
        // && !(y < -(radius) || y > $(document).height())
      ) {

      d3.select('svg')
        .append('polygon')
        .classed('new-poly ' + 'poly-' + iteration, true)
        .attr('fill', polyColor)
        .attr('stroke', polyColor)
        .attr('stroke-width', 2)
        .attr('points', points)
        .attr("style", "fill-opacity:" + (Math.random() + 0.5) / 2)
        .datum({"center": point, "offset": offset, "iteration": iteration});

      pointStore.push(toStore);
      centers[[Math.round(point[0]), Math.round(point[1])]] = true;
    }

  };

  var appendRegular = function(point, offset, iteration) {
    offset = offset + tiltAmount || 0;
    var halfAngle = (Math.PI / numSides);
    var centerToSide = radius*Math.cos(halfAngle);
    offset += halfAngle;


    for (var i = 0; i < numSides; i++) {
      var x = (point[0] + 2*centerToSide * Math.sin(2*Math.PI*i/numSides + offset));
      var y = (point[1] - 2*centerToSide * Math.cos(2*Math.PI*i/numSides + offset));

      if (numSides % 2 == 0) {
        createPolygon([x,y], 0, iteration);
      } else {
        createPolygon([x,y], 2*Math.PI*i/numSides + offset, iteration);
      }
    }
  };

  var appendNonRegular = function(point, offset, iteration) {
    offset = offset + tiltAmount || 0;
    var halfAngle = (Math.PI / numSides);
    var centerToSide = radius*Math.cos(halfAngle);
    offset += halfAngle;
    var increment;
    var startIncrement = 0;

    // NOT PERMANENT - Determine which sides to produce polygon on.
    // This should be abstracted into some kind of options hash to determine
    // pathing based on # sides.
    // OR if it's possible to determine this mathematically that would be ideal.

    if (iteration == 1 && numSides == 5) {
      increment = 1;
    } else if (numSides == 9) {
      startIncrement = 1;
      increment = 3;
    } else if (numSides > 12) {
      increment = 4;
    } else {
      increment = 2;
    }

    for (var i = startIncrement; i < numSides; i += increment) {
      var x = (point[0] + 2*centerToSide * Math.sin(2*Math.PI*i/numSides + offset));
      var y = (point[1] - 2*centerToSide * Math.cos(2*Math.PI*i/numSides + offset));

      if (numSides % 2 == 0) {
        createPolygon([x,y], 0, iteration);
      } else {
        createPolygon([x,y], 2*Math.PI*i/numSides + offset, iteration);
      }
    }
  };

  this.tilt = function() {
    tiltAmount += (2*Math.PI / (numSides*2))

    return this;
  };

  this.animateRemoval = function(speed, stop) {
    speed = speed || 150;

    var counter = 0;

    var animationInterval = setInterval(function() {
      d3.selectAll('.poly-' + counter).each(function() {
        var current = d3.select(this);
        current.style({display: "none"});
      })

      counter++;

      if (stop && counter == stop) {
        clearInterval(animationInterval);
      }
    }, speed)
  };

  this.animate = function(speed) {
    speed = speed || 150;

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
      } else {

        d3.selectAll('.new-poly').each(function() {
          var current = d3.select(this);
          var center = current.datum().center;
          var offset = current.datum().offset;

          if (isRegular) {
            appendRegular(center, offset, counter);
          } else {
            appendNonRegular(center, offset, counter);
          }
          current.classed('new-poly', false);
        })
      }

      counter++;

      if (counter == 25) {
        clearInterval(animationInterval);
      }
    }.bind(this), speed)
  };

  this.animateExisting = function(speed, stop) {
    speed = speed || 150;

    var counter = 0;

    var animationInterval = setInterval(function() {
      d3.selectAll('.poly-' + counter).each(function() {
        var current = d3.select(this);
        current.style({display: "block"});
      })

      counter++;

      if (stop && counter == stop) {
        clearInterval(animationInterval);
      }
    }, speed)
  }

  this.animateThenRemove = function(delay, animationSpeed, removalSpeed, stop) {
    delay = delay || 3000;
    animationSpeed = animationSpeed || 100;
    removalSpeed = removalSpeed || 150;

    this.animate(animationSpeed);

    setTimeout(function() {
      this.animateRemoval(removalSpeed, stop);
    }.bind(this), delay)
  };

  this.addRemoveCycle = function(delay) {
    delay = delay || 2000;

    this.animate();

    counter = 1;
    setInterval(function() {
      if (counter % 2 == 0) {
        this.animateRemoval();
      } else {
        this.animateExisting();
      }

      counter++;

    }.bind(this), delay)
  }

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
};
