import { nanoid } from "nanoid";
import { FIELD_WIDTH, FIELD_HEIGHT } from "../field.js";
import { PlayerStats } from "./stats.js";

export const SHORT_TERM_GOALS = Object.freeze({
    KEEP_POSITION: "KEEP_POSITION",
    PRESS_BALL: "PRESS_BALL",
    TOWARDS_GOAL: "TOWARDS_GOAL"
});

/**
 * Base player class representing a football player
 */
export class BasePlayer {
    /**
     * Creates a new player
     * @param {Object} team - The team this player belongs to
     * @param {number} shirtNumber - Player's shirt number
     * @param {number} startingX - Initial X coordinate on the field
     * @param {number} startingY - Initial Y coordinate on the field 
     * @param {string} role - Player's role/position on the field
     */
    constructor(team, shirtNumber, startingX, startingY, hasBall = false, shortTermGoal = SHORT_TERM_GOALS.KEEP_POSITION) {
        if (startingX < 0 || startingX > FIELD_WIDTH || startingY < 0 || startingY > FIELD_HEIGHT) {
            throw new Error("Invalid starting position");
        }

        this.id = nanoid();
        this.teamId = team.id;
        this.getTeam = () => team;
        this.shirtNumber = shirtNumber;

        this.x = startingX;
        this.y = startingY;
        this.hasBall = hasBall;
        this.stats = new PlayerStats();
        this.shortTermGoal = shortTermGoal;
        this.movements = {
            [SHORT_TERM_GOALS.KEEP_POSITION]: this.keepPosition,
            [SHORT_TERM_GOALS.PRESS_BALL]: this.pressBall,
            [SHORT_TERM_GOALS.TOWARDS_GOAL]: this.towardsGoal
        }
    }

    keepPosition = () => {
        return { x: 0, y: 0 };
    }

    pressBall = (deltaTime, _, ball) => {
        this.hasBall = false;
        const dx = ball.x - this.x;
        const dy = ball.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        return {
            x: normalizedX * (this.stats.physicalStats.speed * (deltaTime / 1000)),
            y: normalizedY * (this.stats.physicalStats.speed * (deltaTime / 1000))
        };
    }

    towardsGoal = (deltaTime, _, ball) => {
        this.hasBall = true;
        const targetX = FIELD_WIDTH / 2;
        const targetY = this.getTeam().playingSide === 'top' ? FIELD_HEIGHT: 0;
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            const velocityX = (dx / distance) * (this.stats.offensiveStats.speedInPossession 
                * (deltaTime / 1000)
            );
            const velocityY = (dy / distance) * (this.stats.offensiveStats.speedInPossession 
                * (deltaTime / 1000));
            ball.y += velocityY
            return {
                x: velocityX,
                y: velocityY,
            };
        }
        return {x: 0, y: 0};
    }

    move = (deltaTime, enemyTeam, ball) => {
        const movement = this.movements[this.shortTermGoal](deltaTime, enemyTeam, ball);
        this.x += movement.x;
        this.y += movement.y;
    }
}