import { nanoid } from "nanoid";

export const FIELD_WIDTH = 25;
export const FIELD_HEIGHT = 42;

export function Field() {
	this.id = nanoid();
	this.width = FIELD_WIDTH;
	this.height = FIELD_HEIGHT;
}
