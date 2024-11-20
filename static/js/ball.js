function drawBall(x, y, z = 0) {
	const ballSize = FIELD_WIDTH * 0.017;
	const heightScale = 1 + (z / 100);
	const shadowDistance = 3 + (z / 5);

	const ball = new Path.Circle({
		center: [x, y],
		radius: ballSize * heightScale,
		fillColor: "white",
		strokeColor: "black",
		strokeWidth: 1.5,
		shadowColor: new Color(0, 0, 0, 0.3),
		shadowBlur: 10,
		shadowOffset: new Point(shadowDistance, shadowDistance),
	});

	const hexagonSize = ballSize * 0.65 * heightScale;
	const centerHexagon = new Path.RegularPolygon({
		center: [x, y],
		sides: 6,
		radius: hexagonSize,
		strokeColor: "black",
		strokeWidth: 1.2,
		fillColor: new Color(0.95, 0.95, 0.95),
	});

	return { ball, centerHexagon };
}
