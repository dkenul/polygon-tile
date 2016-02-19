var PolygonTile = function(radius, polyColor, numSides) {

  var generateID = function() {
    // Improve this
    return Math.floor(Math.random() * 1000000);
  }

  var radius = radius || 50;
  var polyColor = polyColor || 'blue';
  var numSides = numSides || 4;
  var isRegular = numSides == 3 || numSides == 4 || numSides == 6;
  var tiltAmount = 0;
  var centers = {};
  var polygons = [];
  var overflow = false;
  var element;
  var objectID = generateID();

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

  // Computes min and max distance between centers for polygons to touch but not overlap.
  // States that if the center to center distance is less than the min distance, there is definite overlap.
  // O(n) time instead of above O(n^3) which was slowing animation down.
  // Should address a hole between min and max where clip can occur (this hole diminishes for higher side counts)

  var isClipping = function(center) {

    var minLength = 2*radius * Math.cos(Math.PI / numSides);
    var maxLength = 2*radius;

    for (var i = 0; i < polygons.length; i++) {
      var centerToCenter = Math.sqrt(Math.pow(center[0] - polygons[i]['center'][0], 2) + Math.pow(center[1] - polygons[i]['center'][1], 2))

      if (Math.round(centerToCenter) < Math.round(minLength)) {
        return true;
      }
    }

    return false;
  };

  var createPolygon = function(center, offset, iteration) {
    iteration = iteration || 0;
    offset = offset + tiltAmount || 0;
    var points = [];
    var pointsToStore = [];
    var referenceAngle = (2*Math.PI / numSides);

    for (var i = 0; i < numSides; i++) {
      var x = (center[0] + radius * Math.sin(2*Math.PI*i/numSides + offset));
      var y = (center[1] - radius * Math.cos(2*Math.PI*i/numSides + offset));

      pointsToStore.push([x,y])
      points.push(x + ',' + y);
    }

    if ((isRegular && !isOverlap(center)
        || !isRegular && !isClipping(center))
        && !(center[0] < -(radius) || center[0] > d3.select(element).node().offsetWidth + radius)
        && !(center[1] < -(radius) || center[1] > d3.select(element).node().offsetHeight + radius)
      ) {

      d3.select('.svg-' + objectID)
        .append('polygon')
        .classed('new-poly-' + objectID + ' poly-' + iteration + '-' + objectID, true)
        .attr('fill', polyColor)
        .attr('stroke', polyColor)
        .attr('stroke-width', 2)
        .attr('points', points)
        .attr("style", "fill-opacity:" + (Math.random() + 0.5) / 2)
        .datum({"center": center, "offset": offset, "iteration": iteration});

      centers[[Math.round(center[0]), Math.round(center[1])]] = true;
      polygons.push({"center": center, "points": pointsToStore})
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
    var increment = 1;
    var startIncrement = 0;

    // NOT PERMANENT - Determine which sides to produce polygon on.
    // This should be abstracted into some kind of options hash to determine
    // pathing based on # sides.
    // OR if it's possible to determine this mathematically that would be ideal.

    if (numSides == 9) {
      startIncrement = 1;
      increment = 3;
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

  this.on = function (el) {
    element = el;

    return this;
  }

  this.overflow = function() {
    overflow = !overflow;

    return this;
  }

  this.tilt = function() {
    tiltAmount += (2*Math.PI / (numSides*2))

    return this;
  };

  this.animateRemoval = function(speed, stop) {
    speed = speed || 150;

    var counter = 0;

    var animationInterval = setInterval(function() {
      d3.selectAll('.poly-' + counter + '-' + objectID).each(function() {
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
    element = element || 'body';

    var counter = 0;
    var startX = d3.select(element).node().offsetWidth / 2
    var startY = d3.select(element).node().offsetHeight / 2

    var animationInterval = setInterval(function() {
      if (counter == 0) {
        d3.select(element)
          .append('svg')
          .classed('svg-' + objectID, true)
          .attr('width', startX*2 + 'px')
          .attr('height', startY*2 + 'px')
          .style({'position': 'absolute', 'overflow': overflow ? 'visible' : 'hidden'});

        createPolygon([startX, startY], 0);
      } else {

        d3.selectAll('.new-poly-' + objectID).each(function() {
          var current = d3.select(this);
          var center = current.datum().center;
          var offset = current.datum().offset;

          if (isRegular) {
            appendRegular(center, offset, counter);
          } else {
            appendNonRegular(center, offset, counter);
          }
          current.classed('new-poly-' + objectID, false);
        })
      }

      counter++;

      if (!d3.select('.new-poly-' + objectID).node()) {
        clearInterval(animationInterval);
      }

      // if (counter == 25) {
      //   clearInterval(animationInterval);
      // }
    }.bind(this), speed)
  };

  this.animateExisting = function(speed, stop) {
    speed = speed || 150;

    var counter = 0;

    var animationInterval = setInterval(function() {
      d3.selectAll('.poly-' + counter + '-' + objectID).each(function() {
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

  this.render = function() {
    var counter = 0;

    while (1) {
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
        break;
      }
    }
  };
};
