import { nanoid } from "nanoid";
import { Field } from "./field.js";
import { Ball } from "./ball.js";
import { Team } from "./team.js";
import { detectBallDisputeEvent } from "./events/ball-dispute.js";

export function Game() {
	this.id = nanoid();
	this.field = new Field();
	this.ball = new Ball();
	this.teams = [
		new Team("home", "#00ff00", "top", false),
		new Team("away", "#ff0000", "bottom", true),
	];
	this.lastGameTick = 0;
	this.events = [];
	this.nextGameTick = () => {
		if (!this.lastGameTick) {
			this.lastGameTick = Date.now();
			return;
		}
		// const event = detectBallDisputeEvent(this);
		// if (event) {
		// 	this.events.push(event);
		//}
		const deltaTime = Date.now() - this.lastGameTick;
		this.teams.forEach((team, index) => {
			team.players.forEach((player) => {
				player.move(
					deltaTime,
					index === 0 ? this.teams[1] : this.teams[0],
					this.ball,
				);
			});
		});
		this.ball.update(deltaTime);
		this.lastGameTick = Date.now();
	};
}
