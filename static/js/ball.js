function drawBall(x, y) {
	const ballSize = FIELD_WIDTH * 0.02;

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

	for (let i = 0; i < 6; i++) {
		const angle = i * 60;
		const radians = angle * (Math.PI / 180);
		const centerX = x + Math.cos(radians) * hexagonSize;
		const centerY = y + Math.sin(radians) * hexagonSize;

		new Path.RegularPolygon({
			center: [centerX, centerY],
			sides: 5,
			radius: ballSize * 0.35,
			strokeColor: "black",
			fillColor: new Color(0.98, 0.98, 0.98),
			strokeWidth: 1.2,
			rotation: angle + 30,
		});
	}

	return { ball, pattern: centerHexagon };
}
