import { nanoid } from "nanoid";
import { FIELD_HEIGHT } from "./field.js";
import { Goalkeeper } from "./players/goalkeeper.js";
import { Centerback } from "./players/centerback.js";
import { Fullback } from "./players/fullback.js";
import { Midfielder } from "./players/midfielder.js";
import { Forward } from "./players/forward.js";

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
			x: 34,
			y: 2,
			shortTermGoal: "KEEP_POSITION",
            instance: Goalkeeper
		},
		{
			number: 2,
			x: 17,
			y: 15,
			shortTermGoal: "KEEP_POSITION",
            instance: Fullback
		},
		{
			number: 4,
			x: 25,
			y: 15,
			shortTermGoal: "KEEP_POSITION",
            instance: Centerback
		},
		{
			number: 5,
			x: 43,
			y: 15,
			shortTermGoal: "KEEP_POSITION",
            instance: Centerback
		},
		{
			number: 3,
			x: 51,
			y: 15,
			shortTermGoal: "KEEP_POSITION",
            instance: Fullback
		},
		{
			number: 7,
			x: 17,
			y: 35,
			shortTermGoal: startsWithBall ? "KEEP_POSITION" : "PRESS_BALL",
            instance: Midfielder
		},
		{
			number: 6,
			x: 25,
			y: 35,
			shortTermGoal: "KEEP_POSITION",
            instance: Midfielder
		},
		{
			number: 8,
			x: 43,
			y: 35,
			shortTermGoal: "KEEP_POSITION",
            instance: Midfielder
		},
		{
			number: 11,
			x: 51,
			y: 35,
			shortTermGoal: "KEEP_POSITION",
            instance: Midfielder
		},
		{
			number: 9,
			x: startsWithBall ? 34 : 25,
			y: 50.5,
			shortTermGoal: startsWithBall ? "TOWARDS_GOAL" : "KEEP_POSITION",
            instance: Forward
		},
		{
			number: 10,
			x: 43,
			y: 50.5,
			shortTermGoal: "KEEP_POSITION",
            instance: Forward
		},
	];

	this.players = basePositions.map((pos) => {
		const y = playingSide === "bottom" ? FIELD_HEIGHT - pos.y : pos.y;
		return new pos.instance(
			this,
			pos.number,
            pos.x,
            y,
            startsWithBall && pos.shortTermGoal === "TOWARDS_GOAL",
            pos.shortTermGoal
		);
	});
}
