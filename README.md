# N-Sided Polygon Tile / Tessellation

This project stemmed out of an svg animation I was working on to animate hexagons
on a screen. The goal is to fully abstract this to an n-sided polygon of any size
and color that can be rendered inside of an HTML element.

Currently, any # of sides is stable, but #s over 100 will result in slower processing.
You can increase animation speed with optional parameters but working to make this more intuitive.

To run this, you can simply download the folder and run the index.html file in
your browser.

Try it here:
https://jsfiddle.net/dkenul/jwvkuqfy/

## To Do

- [x] Produce an n-sided polygon of any color.
- [x] Implement collision detection for even sided polygons
- [x] Improve collision detection to include odd sided polygons
- [x] Implement logic to create non-overlapping patterns for polygons besides triangle, square, hexagon
- [x] Reduce time complexity of clip detection algorithms
- [x] Abstract to apply to any parent HTML element.
- [ ] Add appropriate CSS within PolygonTile object.
- [ ] Add more interesting animations and utility.
