import { nanoid } from "nanoid";
import { FIELD_WIDTH, FIELD_HEIGHT } from "./field.js";

/**
 * 
 * @param {*} teamId 
 * @param {*} playingSide "top" | "bottom"
 * @param {*} shirtNumber 
 * @param {*} startingX 
 * @param {*} startingY 
 * @param {*} role "defender" | "midfielder" | "forward"
 * @param {*} shortTermGoal "KEEP_POSITION" | "PRESS_BALL"
 */
export function Player(teamId, playingSide, hasBall, shirtNumber, startingX, startingY, role = "defender", shortTermGoal = "KEEP_POSITION") {
    if (startingX < 0 || startingX > FIELD_WIDTH || startingY < 0 || startingY > FIELD_HEIGHT) {
        console.error(startingX, startingY);
        throw new Error("Invalid starting position");
    }
    this.id = nanoid();
    this.teamId = teamId;
    this.shirtNumber = shirtNumber;
    this.x = startingX;
    this.y = startingY;
    this.speed = 18; // m/s
    this.speedInPossession = 14;
    this.ballProtection = 10; // %
    this.tackle = 60; // %
    this.role = role;
    this.shortTermGoal = shortTermGoal;
    this.playingSide = playingSide;
    this.hasBall = false;

    this.SHORT_TERM_GOALS = {
        // should be still, little to no movement
        "KEEP_POSITION": () => {return {x: 0, y: 0}},
        // should be moving towards the ball
        "PRESS_BALL": (deltaTime, _, ball) => {
            this.hasBall = false;
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const normalizedX = dx / distance;
            const normalizedY = dy / distance;
            return {
                x: normalizedX * (this.speed * (deltaTime / 1000)),
                y: normalizedY * (this.speed * (deltaTime / 1000)),
            };
        },
        "TOWARDS_GOAL": (deltaTime, _, ball) => {
            this.hasBall = true;
            const targetX = FIELD_WIDTH / 2;
            const targetY = this.playingSide === 'top' ? FIELD_HEIGHT: 0;
            
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
                const velocityX = (dx / distance) * (this.speedInPossession * (deltaTime / 1000));
                const velocityY = (dy / distance) * (this.speedInPossession * (deltaTime / 1000));
                ball.y += velocityY
                return {
                    x: velocityX,
                    y: velocityY,
                };
            }
            return {x: 0, y: 0};
        }
    };

    this.move = (deltaTime, enemyTeam, ball) => {
        const pointToGo = this.SHORT_TERM_GOALS[this.shortTermGoal](deltaTime, enemyTeam, ball);
        this.x += pointToGo.x;
        this.y += pointToGo.y;
    }
}