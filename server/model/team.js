import { nanoid } from "nanoid";
import { FIELD_HEIGHT } from "./field.js";
import { Goalkeeper } from "./players/goalkeeper.js";
import { Sweeper } from "./players/sweeper.js";
import { Winger } from "./players/winger.js";
import { Striker } from "./players/striker.js";

/**
 *
 * @param {*} name
 * @param {*} color
 * @param {*} half - "top" | "bottom"
 * @param {*} startsWithBall
 */
export function Team(name, color, playingSide, startsWithBall) {
	this.id = nanoid();
	this.name = name;
	this.color = color;
	this.playingSide = playingSide;
	const basePositions = [
		{
			number: 1,
			x: 12.5,
			y: 2,
			shortTermGoal: "KEEP_POSITION",
			instance: Goalkeeper
		},
		{
			number: 2,
			x: 12.5,
			y: 6,
			shortTermGoal: "KEEP_POSITION",
			instance: Sweeper
		},
		{
			number: 3,
			x: 8,
			y: 12,
			shortTermGoal: startsWithBall ? "KEEP_POSITION" : "KEEP_POSITION",
			instance: Winger
		},
		{
			number: 4,
			x: 17,
			y: 12,
			shortTermGoal: "KEEP_POSITION",
			instance: Winger
		},
		{
			number: 5,
			x: 12.5,
			y: startsWithBall ? 21 : 17,
			shortTermGoal: startsWithBall ? "CARRY_BALL_TOWARDS_GOAL" : "KEEP_POSITION",
			instance: Striker
		}
	];

	this.players = basePositions.map((pos) => {
		const y = playingSide === "bottom" ? FIELD_HEIGHT - pos.y : pos.y;
		return new pos.instance(
			this,
			pos.number,
			pos.x,
			y,
			startsWithBall && pos.shortTermGoal === "CARRY_BALL_TOWARDS_GOAL",
			pos.shortTermGoal
		);
	});
}
