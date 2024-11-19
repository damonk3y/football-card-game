import { nanoid } from "nanoid";
import { Player } from "./player.js";
import { FIELD_HEIGHT } from "./field.js";

/**
 * 
 * @param {*} name 
 * @param {*} color 
 * @param {*} half - "top" | "bottom"
 * @param {*} startsWithBall 
 */
export function Team(name, color, half, startsWithBall) {
    this.id = nanoid();
    this.name = name;
    this.color = color;
    
    const basePositions = [
        {number: 1, x: 34, y: 2, role: "defender", shortTermGoal: "KEEP_POSITION" },      
        {number: 2, x: 17, y: 15, role: "defender", shortTermGoal: "KEEP_POSITION" },     
        {number: 4, x: 25, y: 15, role: "defender", shortTermGoal: "KEEP_POSITION" },     
        {number: 5, x: 43, y: 15, role: "defender", shortTermGoal: "KEEP_POSITION" },     
        {number: 3, x: 51, y: 15, role: "defender", shortTermGoal: "KEEP_POSITION" },     
        {number: 7, x: 17, y: 35, role: "midfielder", shortTermGoal: startsWithBall ? "KEEP_POSITION" : "PRESS_BALL" },     
        { number: 6, x: 25, y: 35, role: "midfielder", shortTermGoal: "KEEP_POSITION" },     
        {number: 8, x: 43, y: 35, role: "midfielder", shortTermGoal: "KEEP_POSITION" },     
        {number: 11, x: 51, y: 35, role: "midfielder", shortTermGoal: "KEEP_POSITION" },    
        {number: 9, x: startsWithBall ? 34 : 25, y: 50.5, role: "forward", shortTermGoal: startsWithBall ? "TOWARDS_GOAL" : "KEEP_POSITION" },     
        {number: 10, x: 43, y: 50.5, role: "forward", shortTermGoal: "KEEP_POSITION"}
    ];

    this.players = basePositions.map(pos => {
        const y = half === 'bottom' ? FIELD_HEIGHT - pos.y : pos.y;
        return new Player(this.id, half, startsWithBall && pos.shortTermGoal === "TOWARDS_GOAL", pos.number, pos.x, y, pos.role, pos.shortTermGoal);
    });
}