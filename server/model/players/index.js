import { nanoid } from "nanoid";
import { FIELD_WIDTH, FIELD_HEIGHT } from "../field.js";
import { PlayerStats } from "./stats.js";
import { getAngleBetweenPoints, getDistanceBetweenPoints } from "../../helpers/map.js";

export const SHORT_TERM_GOALS = Object.freeze({
    KEEP_POSITION: "KEEP_POSITION",
    PRESS_BALL: "PRESS_BALL",
    CARRY_BALL_TOWARDS_GOAL: "CARRY_BALL_TOWARDS_GOAL",
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
            [SHORT_TERM_GOALS.CARRY_BALL_TOWARDS_GOAL]: this.carryBallTowardsGoal,
            [SHORT_TERM_GOALS.SAFE_PASS]: this.safePass
        }
    }

    keepPosition = () => {
        return { x: 0, y: 0 };
    }

    pressBall = (deltaTime, _, __, ball) => {
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

    carryBallTowardsGoal = (deltaTime, ownTeam, enemyTeam, ball) => {
        const shouldPass = Math.random() < 0.5;
        if (shouldPass) {
            this.safePass(deltaTime, ownTeam, enemyTeam, ball);
            return { x: 0, y: 0 };
        }
        const oppositeGoalPosition = this.getTeam().playingSide === "bottom" ? { x: FIELD_WIDTH / 2, y: 0 } : { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT };
        const distanceFromBallToOppositeGoal = getDistanceBetweenPoints(ball.x, ball.y, oppositeGoalPosition.x, oppositeGoalPosition.y);
        const distanceToBall = getDistanceBetweenPoints(this.x, this.y, ball.x, ball.y);
        if (distanceFromBallToOppositeGoal < 1) {
            this.shortTermGoal = SHORT_TERM_GOALS.KEEP_POSITION;
            return { x: 0, y: 0 };
        }
        else if (distanceToBall < 0.15 && ball.z < 0.15) {
            ball.kick(this.stats.offensiveStats.speedInPossession, getAngleBetweenPoints(ball.x, ball.y, oppositeGoalPosition.x, oppositeGoalPosition.y), Math.random() * 0.1, this.stats.offensiveStats.ballSpin, (100 - this.stats.offensiveStats.dribbling) / 100 );
            return { x: 0, y: 0 };
        }
        const dx = ball.x - this.x;
        const dy = ball.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        return {
            x: normalizedX * (this.stats.offensiveStats.speedInPossession * (deltaTime / 1000)),
            y: normalizedY * (this.stats.offensiveStats.speedInPossession * (deltaTime / 1000))
        };
    }

    /**
     * Aims to be called from another short term goal
     * @param {*} _ 
     * @param {*} ownTeam 
     * @param {*} enemyTeam 
     * @param {*} ball 
     * @returns 
     */
    safePass = (_, ownTeam, enemyTeam, ball) => {
        if (!this.hasBall) return { x: 0, y: 0 };

        let bestTeammate = null;
        let bestScore = -Infinity;

        for (const teammate of ownTeam.players) {
            if (teammate.id === this.id) continue;

            const distance = Math.hypot(
                teammate.x - this.x,
                teammate.y - this.y
            );

            let interceptRisk = 0;
            for (const enemy of enemyTeam.players) {
                const enemyToPassLine = Math.abs(
                    (teammate.y - this.y) * enemy.x -
                    (teammate.x - this.x) * enemy.y +
                    teammate.x * this.y -
                    teammate.y * this.x
                ) / distance;

                if (enemyToPassLine < 5) {
                    interceptRisk += 1;
                }
            }

            const score = 100 - distance - (interceptRisk * 20);
            if (score > bestScore) {
                bestScore = score;
                bestTeammate = teammate;
            }
        }

        if (bestTeammate) {
            const horizontalAngle = Math.atan2(
                bestTeammate.y - this.y,
                bestTeammate.x - this.x
            );
            
            const distance = Math.hypot(
                bestTeammate.x - this.x,
                bestTeammate.y - this.y
            );

            const power = Math.min(distance * 1.5, 30);
            const verticalAngle = 0.1;
            const spin = 20;
            const mistakeRate = 0.15;

            ball.kick(power, horizontalAngle, verticalAngle, spin, mistakeRate);
            this.shortTermGoal = SHORT_TERM_GOALS.KEEP_POSITION;
        }

        return { x: bestTeammate?.x || 0, y: bestTeammate?.y || 0 };
    }

    move = (deltaTime, ownTeam, enemyTeam, ball) => {
        const movement = this.movements[this.shortTermGoal](deltaTime, ownTeam, enemyTeam, ball);
        this.x += movement.x;
        this.y += movement.y;
    }
}