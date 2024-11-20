function convertServerCoordinatesToPaper(x, y) {
	const drawX100 = SERVER_FIELD_WIDTH / FIELD_WIDTH;
	const drawY100 = SERVER_FIELD_HEIGHT / FIELD_HEIGHT;
	return { x: FIELD_X + x / drawX100, y: FIELD_Y + y / drawY100 };
}
