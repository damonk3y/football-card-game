import { nanoid } from "nanoid";
import { FIELD_WIDTH, FIELD_HEIGHT } from "./field.js";

export function Player(shirtNumber, startingX, startingY) {
    if (startingX < 0 || startingX > FIELD_WIDTH || startingY < 0 || startingY > FIELD_HEIGHT) {
        throw new Error("Invalid starting position");
    }
    this.id = nanoid();
    this.shirtNumber = shirtNumber;
    this.x = startingX;
    this.y = startingY;

    this.move = () => {
        this.x += 1;
        this.y += 1;
    }
}