import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Game } from "./model/game.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("-> new client connected");
	socket.on("new_game", async () => {
		const game = new Game();
		socket.emit("new_game_started", game);
		await new Promise((resolve) => setTimeout(resolve, 25));
		for (let i = 0; i < 200; i++) {
			game.nextGameTick();
			socket.emit("game_tick", game);
			await new Promise((resolve) => setTimeout(resolve, 25));
		}
	});
	socket.on("disconnect", () => {
		socket.rooms.forEach((room) => {
			io.to(room).emit("player_disconnected", { playerId: socket.id });
		});
	});
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
