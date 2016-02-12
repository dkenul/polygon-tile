var PolygonTile = function(radius, polyColor, numSides) {

  var radius = radius || 50;
  var polyColor = polyColor || 'blue';
  var numSides = numSides || 4;
  var isRegular = numSides == 3 || numSides == 4 || numSides == 6;
  var tiltAmount = 0;

  var createPolygon = function(point, offset, iteration) {
    iteration = iteration || 0;
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
        .classed('new-poly ' + 'poly-' + iteration, true)
        .attr('fill', polyColor)
        .attr('stroke', polyColor)
        .attr('stroke-width', 2)
        .attr('points', points)
        .attr("style", "fill-opacity:" + (Math.random() + 0.5) / 2)
        .datum({"center": point, "offset": offset, "iteration": iteration});
    }

  };

  var appendRegular = function(point, offset, iteration) {
    offset = offset + tiltAmount || 0;
    var halfAngle = (Math.PI / numSides);
    var centerToSide = radius*Math.cos(halfAngle);
    offset += halfAngle;


    for (var i = 0; i < numSides; i++) {
      var x = roundBig(point[0] + 2*centerToSide * Math.sin(2*Math.PI*i/numSides + offset));
      var y = roundBig(point[1] - 2*centerToSide * Math.cos(2*Math.PI*i/numSides + offset));

      if (numSides % 2 == 0) {
        createPolygon([x,y], 0, iteration);
      } else {
        createPolygon([x,y], 2*Math.PI*i/numSides + offset, iteration);
      }
    }
  };

  this.tilt = function() {
    tiltAmount += (2*Math.PI / 8)

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
          appendRegular(center, offset, counter);

          current.classed('new-poly', false);
        })
      }

      counter++;

      if (counter == 30) {
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
}
