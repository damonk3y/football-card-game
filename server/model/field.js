import { nanoid } from "nanoid";

export const FIELD_WIDTH = 68;
export const FIELD_HEIGHT = 105;

export function Field() {
	this.id = nanoid();
	this.width = FIELD_WIDTH;
	this.height = FIELD_HEIGHT;
}
