import { nanoid } from "nanoid";
import { Player } from "./player.js";

export function Team(name, color) {
    this.id = nanoid();
    this.name = name;
    this.color = color;
    this.players = [
        new Player(7, 20, 10),
        new Player(10, 50, 10),
    ];
}