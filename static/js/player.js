function drawPlayer(x, y, number, color) {
	const playerRadius = view.size.height * 0.012;

	const player = new Path.Circle({
		center: [x, y],
		radius: playerRadius,
		strokeColor: color,
		strokeWidth: 2,
		fillColor: color + "80",
	});

	const text = new PointText({
		point: [x, y + playerRadius / 3],
		content: number.toString(),
		fillColor: "white",
		fontFamily: "Arial",
		fontWeight: "bold",
		fontSize: playerRadius * 1.2,
		justification: "center",
	});

	return {
		circle: player,
		number: text,
	};
}
