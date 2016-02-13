# Polygon Tessellation

This project stemmed out of an svg animation I was working on to animate hexagons
on a screen. The goal is to fully abstract this to an n-sided polygon of any size
and color that can be rendered inside of an HTML element.

Currently, only 4 and 6 sides polygons are stable, as I am working on boundary &
collision logic for odd # of sides AND polygons that do not tessellate perfectly
(anything besides a triangle, square and hexagon).

To run this, you can simply download the folder and run the index.html file in
your browser.

## To Do

[x] Produce an n-sided polygon of any color.
[x] Implement collision detection for any even sided polygonal tessellation
[ ] Improve collision detection to include odd sided polygons
[ ] Implement logic to create non-overlapping patterns for polygons besides triangle, square, hexagon
[ ] Abstract to apply to any parent HTML element.
[ ] Add more interesting animations and utility.
