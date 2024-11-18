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
	const parsedCoordinates = convertServerCoordinatesToPaper(data.ball.x, data.ball.y);
    ITEM_MAP.set(data.ball.id, drawBall(parsedCoordinates.x, parsedCoordinates.y));
    data.teams[0].players.forEach(player => {
        const parsedCoordinates = convertServerCoordinatesToPaper(player.x, player.y);
        ITEM_MAP.set(player.id, drawPlayer(parsedCoordinates.x, parsedCoordinates.y, player.shirtNumber, data.teams[0].color));
    });
});

socket.on("game_tick", (data) => {
    console.log("-> game tick");
	const ballItems = ITEM_MAP.get(data.ball.id);
    Object.keys(ballItems).forEach(key => {
        ballItems[key].position = new Point(data.ball[key]);
    });
    data.teams[0].players.forEach(player => {
        const playerItems = ITEM_MAP.get(player.id);
        Object.keys(playerItems).forEach(key => {
            playerItems[key].position = new Point(player[key]);
        });
    });
});
