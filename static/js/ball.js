function drawBall(x, y) {
	const ballSize = FIELD_WIDTH * 0.01;

	const ball = new Path.Circle({
		center: [x, y],
		radius: ballSize,
		fillColor: "white",
		strokeColor: "black",
		strokeWidth: 1.5,
		shadowColor: new Color(0, 0, 0, 0.3),
		shadowBlur: 10,
		shadowOffset: new Point(3, 3),
	});

	const hexagonSize = ballSize * 0.65;
	const centerHexagon = new Path.RegularPolygon({
		center: [x, y],
		sides: 6,
		radius: hexagonSize,
		strokeColor: "black",
		strokeWidth: 1.2,
		fillColor: new Color(0.95, 0.95, 0.95),
	});

	return { ball, pattern: centerHexagon };
}
