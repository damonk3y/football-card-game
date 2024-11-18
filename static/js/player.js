function drawPlayer(x, y, number, color) {
	const playerRadius = view.size.height * 0.02;

	const player = new Path.Circle({
		center: [FIELD_X + x, FIELD_Y + y],
		radius: playerRadius,
		strokeColor: color,
		strokeWidth: 2,
		fillColor: color + "80",
	});

	const text = new PointText({
		point: [FIELD_X + x, FIELD_Y + y + playerRadius / 3],
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

function drawTeam(positions, teamColor) {
	const players = [];

	positions.forEach((pos, index) => {
		const player = drawPlayer(pos.x, pos.y, index + 1, teamColor);
		players.push(player);
	});

	return players;
}