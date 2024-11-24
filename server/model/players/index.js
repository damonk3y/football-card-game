import { nanoid } from "nanoid";
import { FIELD_WIDTH, FIELD_HEIGHT } from "../field.js";
import { PlayerStats } from "./stats.js";
import { findNearestOpponent, getAngleBetweenPoints, getDistanceBetweenPoints } from "../../helpers/map.js";

export const SHORT_TERM_GOALS = Object.freeze({
    KEEP_POSITION: "KEEP_POSITION",
    PRESS_BALL: "PRESS_BALL",
    CARRY_BALL_TOWARDS_GOAL: "CARRY_BALL_TOWARDS_GOAL",
    RECEIVE_PASS: "RECEIVE_PASS"
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
            [SHORT_TERM_GOALS.SAFE_PASS]: this.safePass,
            [SHORT_TERM_GOALS.RECEIVE_PASS]: this.receivePass
        }
    }

    keepPosition = (deltaTime, ownTeam, enemyTeam, ball) => {
        const ownTeamHasPossession = ownTeam.players.some(p => p.hasBall);
        
        if (ownTeamHasPossession) {
            const ballHolder = ownTeam.players.find(p => p.hasBall);
            const idealDistance = 4;
            
            const xDiffFromBall = ballHolder.x - this.x;
            const yDiffFromBall = ballHolder.y - this.y;
            const currentDistance = Math.sqrt(xDiffFromBall * xDiffFromBall + yDiffFromBall * yDiffFromBall);
            
            let dx = 0;
            let dy = 0;
            
            const nearestEnemy = enemyTeam.players.reduce((closest, player) => {
                const distance = Math.sqrt(
                    Math.pow(player.x - this.x, 2) + 
                    Math.pow(player.y - this.y, 2)
                );
                return (!closest || distance < closest.distance) 
                    ? { player, distance }
                    : closest;
            }, null);
            if (currentDistance < idealDistance) {
                dx = -xDiffFromBall * 0.1;
                dy = -yDiffFromBall * 0.1;
            } else if (currentDistance > idealDistance * 1.5) {
                dx = xDiffFromBall * 0.1;
                dy = yDiffFromBall * 0.1;
            } else {
                dx = (FIELD_WIDTH / 2 - this.x) * 0.02;
                dy = (FIELD_HEIGHT / 2 - this.y) * 0.02;
            }
            
            const magnitude = Math.sqrt(dx * dx + dy * dy);
            if (magnitude > 0) {
                const normalizedX = dx / magnitude;
                const normalizedY = dy / magnitude;
                
                return {
                    x: normalizedX * (this.stats.physicalStats.speed * (deltaTime / 1000) * 0.5),
                    y: normalizedY * (this.stats.physicalStats.speed * (deltaTime / 1000) * 0.5)
                };
            }
            return { x: 0, y: 0 };
        } else {
            const ownGoal = ownTeam.playingSide === "bottom" ? { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT } : { x: FIELD_WIDTH / 2, y: 0 };
            const nearestOpponent = findNearestOpponent(this, enemyTeam.players);
            const markingDistance = 0.2;
            
            const targetPosition = {
                x: nearestOpponent.x - markingDistance * Math.sign(ownGoal.x - nearestOpponent.x),
                y: nearestOpponent.y
            };

            const dx = targetPosition.x - this.x;
            const dy = targetPosition.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const normalizedX = dx / distance;
            const normalizedY = dy / distance;
            
            return {
                x: normalizedX * (this.stats.physicalStats.speed * (deltaTime / 1000)),
                y: normalizedY * (this.stats.physicalStats.speed * (deltaTime / 1000))
            };
        }
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
        const shouldPass = Math.random() < 0.4;
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
            bestTeammate.shortTermGoal = SHORT_TERM_GOALS.RECEIVE_PASS;
            
            const distance = Math.hypot(
                bestTeammate.x - this.x,
                bestTeammate.y - this.y
            );

            const power = Math.min(distance * 1.5, 30);
            const verticalAngle = 0.1;
            const spin = 3;
            const mistakeRate = 0.15;

            ball.kick(power, horizontalAngle, verticalAngle, spin, mistakeRate);
            this.shortTermGoal = SHORT_TERM_GOALS.KEEP_POSITION;
        }

        return { x: bestTeammate?.x || 0, y: bestTeammate?.y || 0 };
    }

    receivePass = (deltaTime, ownTeam, enemyTeam, ball) => {
        console.log(this.x)
        const distanceToBall = Math.sqrt(
            Math.pow(this.x - ball.x, 2) + 
            Math.pow(this.y - ball.y, 2)
        );

        if (distanceToBall < 0.7) {
            this.shortTermGoal = 'CARRY_BALL_TOWARDS_GOAL';
            return { x: 0, y: 0 };
        }

        const directionX = ball.x - this.x;
        const directionY = ball.y - this.y;
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        console.log(directionX, directionY)
        if (!directionX || !directionY) {
            process.exit(0)
        }
        const normalizedX = directionX / length;
        const normalizedY = directionY / length;
        const distanceThisFrame = this.stats.physicalStats.speed * (deltaTime / 1000);
    
        
        return {
            x: normalizedX * distanceThisFrame,
            y: normalizedY * distanceThisFrame
        };
    };

    move = (deltaTime, ownTeam, enemyTeam, ball) => {
        const movement = this.movements[this.shortTermGoal](deltaTime, ownTeam, enemyTeam, ball);
        this.x += movement.x;
        this.y += movement.y;
    }
}