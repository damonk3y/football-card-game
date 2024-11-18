import { nanoid } from "nanoid";
import { FIELD_WIDTH, FIELD_HEIGHT } from "./field.js";

export function Ball() {
    this.id = nanoid();
    this.x = FIELD_WIDTH / 2;
    this.y = FIELD_HEIGHT / 2;
}