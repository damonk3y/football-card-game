import { nanoid } from "nanoid";
import { FIELD_WIDTH, FIELD_HEIGHT } from "../field.js";
import { PlayerStats } from "./stats.js";

export const SHORT_TERM_GOALS = Object.freeze({
    KEEP_POSITION: "KEEP_POSITION",
    PRESS_BALL: "PRESS_BALL",
    CARRY_BALL_TOWARDS_GOAL: "CARRY_BALL_TOWARDS_GOAL"
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
            [SHORT_TERM_GOALS.CARRY_BALL_TOWARDS_GOAL]: this.carryBallTowardsGoal
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

    carryBallTowardsGoal = (deltaTime, _, ball) => {
        const controlDistance = 0.5
        const kickInterval = 200
        this.lastKickTime = this.lastKickTime || 0
        this.currentTime = (this.currentTime || 0) + deltaTime
        
        const targetY = this.getTeam().playingSide === 'top' ? FIELD_HEIGHT : 0
        const targetX = FIELD_WIDTH / 2
        
        const distanceToTarget = Math.sqrt(
            Math.pow(targetX - this.x, 2) + 
            Math.pow(targetY - this.y, 2)
        )
        
        if (distanceToTarget < 1) {
            this.hasBall = true
            return { x: 0, y: 0 }
        }
        
        const ballDistance = Math.sqrt(
            Math.pow(ball.x - this.x, 2) + 
            Math.pow(ball.y - this.y, 2)
        )
        
        if (ballDistance > controlDistance) {
            this.hasBall = false
            const moveX = (ball.x - this.x) / ballDistance
            const moveY = (ball.y - this.y) / ballDistance
            return {
                x: moveX * this.stats.physicalStats.speed * (deltaTime / 1000),
                y: moveY * this.stats.physicalStats.speed * (deltaTime / 1000)
            }
        }
        
        this.hasBall = true
        
        if (this.currentTime - this.lastKickTime > kickInterval) {
            this.lastKickTime = this.currentTime
            
            const directionX = targetX - this.x
            const directionY = targetY - this.y
            const angle = Math.atan2(directionY, directionX)
            
            const ballControl = this.stats.offensiveStats.ballControl / 100
            const dribbling = this.stats.offensiveStats.dribbling / 100
            
            const maxAngleDeviation = 0.3 * (1 - (ballControl + dribbling) / 2)
            const randomAngle = angle + (Math.random() - 0.5) * maxAngleDeviation
            
            const kickPower = this.stats.offensiveStats.speedInPossession * 0.7
            const verticalAngle = 0.02 + (Math.random() * 0.02)
            const spin = this.stats.offensiveStats.ballSpin * (0.1 + Math.random() * 0.05)
            
            ball.kick(kickPower, randomAngle, verticalAngle, spin)
        }
        
        const moveAngle = Math.atan2(targetY - this.y, targetX - this.x)
        return {
            x: Math.cos(moveAngle) * this.stats.offensiveStats.speedInPossession * (deltaTime / 1000),
            y: Math.sin(moveAngle) * this.stats.offensiveStats.speedInPossession * (deltaTime / 1000)
        }
    }

    move = (deltaTime, enemyTeam, ball) => {
        const movement = this.movements[this.shortTermGoal](deltaTime, enemyTeam, ball);
        this.x += movement.x;
        this.y += movement.y;
    }
}