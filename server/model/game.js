import { nanoid } from 'nanoid'
import { Field } from "./field.js";
import { Ball } from "./ball.js";
import { Team } from "./team.js";

export function Game() {
    this.id = nanoid();
    this.field = new Field();
    this.ball = new Ball();
    this.teams = [new Team("home", "#00ff00")];

    this.nextGameTick = () => {
        this.teams.forEach(team => {
            team.players.forEach(player => {
                player.move();
            });
        });
    }
}