const socket = io("http://localhost:8080");

// client events
function startNewGame() {
	socket.emit("new_game");
}

// server events
socket.on("connect", () => {
	console.log("-> connected to server");
});
socket.on("disconnect", () => {
	console.log("-> disconnected from server");
});

socket.on("new_game_started", (data) => {
	const parsedCoordinates = convertServerCoordinatesToPaper(
		data.ball.x,
		data.ball.y,
	);
	data.teams[0].players.forEach((player) => {
		const parsedCoordinates = convertServerCoordinatesToPaper(
			player.x,
			player.y,
		);
		ITEM_MAP.set(
			player.id,
			drawPlayer(
				parsedCoordinates.x,
				parsedCoordinates.y,
				player.shirtNumber,
				data.teams[0].color,
			),
		);
	});
	data.teams[1].players.forEach((player) => {
		const parsedCoordinates = convertServerCoordinatesToPaper(
			player.x,
			player.y,
		);
		ITEM_MAP.set(
			player.id,
			drawPlayer(
				parsedCoordinates.x,
				parsedCoordinates.y,
				player.shirtNumber,
				data.teams[1].color,
			),
		);
	});
	ITEM_MAP.set(
		data.ball.id,
		drawBall(parsedCoordinates.x, parsedCoordinates.y),
	);
});

socket.on("game_tick", (data) => {
	const ballItems = ITEM_MAP.get(data.ball.id);
	Object.keys(ballItems).forEach((key) => {
		ballItems[key].position = new Point(
			convertServerCoordinatesToPaper(data.ball.x, data.ball.y),
		);
	});
	data.teams[0].players.forEach((player) => {
		const playerItems = ITEM_MAP.get(player.id);
		Object.keys(playerItems).forEach((key) => {
			const parsedCoordinates = convertServerCoordinatesToPaper(
				player.x,
				player.y,
			);
			playerItems[key].position = new Point(
				parsedCoordinates.x,
				parsedCoordinates.y,
			);
		});
	});
	data.teams[1].players.forEach((player) => {
		const playerItems = ITEM_MAP.get(player.id);
		Object.keys(playerItems).forEach((key) => {
			const parsedCoordinates = convertServerCoordinatesToPaper(
				player.x,
				player.y,
			);
			playerItems[key].position = new Point(
				parsedCoordinates.x,
				parsedCoordinates.y,
			);
		});
	});
});
