const SERVER_FIELD_WIDTH = 68;
const SERVER_FIELD_HEIGHT = 105;
let FIELD_X, FIELD_Y, FIELD_WIDTH, FIELD_HEIGHT;

function drawField() {
	FIELD_HEIGHT = view.size.height * 0.8;
	FIELD_WIDTH = FIELD_HEIGHT * 0.7;
	FIELD_X = (view.size.width - FIELD_WIDTH) / 2;
	FIELD_Y = (view.size.height - FIELD_HEIGHT) / 2;

	const stripeWidth = FIELD_WIDTH / 12;
	    for (let x = 0; x < FIELD_WIDTH; x += stripeWidth * 2) {
		new Path.Rectangle({
			point: [FIELD_X + x, FIELD_Y],
			size: [stripeWidth, FIELD_HEIGHT],
			fillColor: "#1a6b20",
		});
	}

	var field = new Path.Rectangle({
		point: [FIELD_X, FIELD_Y],
		size: [FIELD_WIDTH, FIELD_HEIGHT],
		fillColor: "#238c2c",
		strokeColor: "white",
		strokeWidth: 2,
	});

	var centerLine = new Path.Line({
		from: [FIELD_X, FIELD_Y + FIELD_HEIGHT / 2],
		to: [FIELD_X + FIELD_WIDTH, FIELD_Y + FIELD_HEIGHT / 2],
		strokeColor: "white",
		strokeWidth: 2,
	});

	var centerCircle = new Path.Circle({
		center: [FIELD_X + FIELD_WIDTH / 2, FIELD_Y + FIELD_HEIGHT / 2],
		radius: FIELD_WIDTH / 10,
		strokeColor: "white",
		strokeWidth: 2,
	});

	function drawPenaltyArea(isTop) {
		const penaltyHeight = FIELD_HEIGHT * 0.2;
		const penaltyWidth = FIELD_WIDTH * 0.44;
		const penaltyX = FIELD_X + (FIELD_WIDTH - penaltyWidth) / 2;
		const penaltyY = isTop ? FIELD_Y : FIELD_Y + FIELD_HEIGHT - penaltyHeight;

		return new Path.Rectangle({
			point: [penaltyX, penaltyY],
			size: [penaltyWidth, penaltyHeight],
			strokeColor: "white",
			strokeWidth: 2,
		});
	}

	drawPenaltyArea(true);
	drawPenaltyArea(false);

	function drawGoalArea(isTop) {
		const goalHeight = FIELD_HEIGHT * 0.08;
		const goalWidth = FIELD_WIDTH * 0.2;
		const goalX = FIELD_X + (FIELD_WIDTH - goalWidth) / 2;
		const goalY = isTop ? FIELD_Y : FIELD_Y + FIELD_HEIGHT - goalHeight;

		return new Path.Rectangle({
			point: [goalX, goalY],
			size: [goalWidth, goalHeight],
			strokeColor: "white",
			strokeWidth: 2,
		});
	}

	drawGoalArea(true);
	drawGoalArea(false);
}