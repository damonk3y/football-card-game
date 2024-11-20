import { Event } from "./event.js";

const EVENT_COOLDOWN = 1000;

let lastEventTimestamp = 0;

function calculateTackleProbability(attackingPlayer, defendingPlayer) {
	const baseTackleChance = defendingPlayer.stats.defensiveStats.tackling / 100;
	const ballProtection = attackingPlayer.stats.offensiveStats.ballControl / 100;
	const tackleSuccessChance =
		(baseTackleChance / (baseTackleChance + ballProtection)) * 100 +
		(Math.random() * 10 - 5);
	return Math.min(Math.max(tackleSuccessChance, 5), 95);
}

export const detectBallDisputeEvent = (game) => {
	if (lastEventTimestamp && Date.now() - lastEventTimestamp < EVENT_COOLDOWN) {
		return;
	}
	const players = game.teams.flatMap((team) => team.players);
	const ball = game.ball;
	const range = 2;
	const nearbyPlayers = players.filter((player) => {
		const distance = Math.sqrt(
			Math.pow(player.x - ball.x, 2) + Math.pow(player.y - ball.y, 2),
		);
		return distance <= range;
	});
	const teamsNearBall = new Set(nearbyPlayers.map((player) => player.teamId));
	if (nearbyPlayers.length >= 2 && teamsNearBall.size > 1) {
		lastEventTimestamp = Date.now();
		const playerWithBall = nearbyPlayers.find((player) => player.hasBall);
		const tacklingPlayers = nearbyPlayers.filter(
			(player) => player.teamId !== playerWithBall.teamId,
		);

		const tackleProbabilities = tacklingPlayers.map((tackler) => ({
			tackler: tackler,
			probability: calculateTackleProbability(playerWithBall, tackler),
		}));

		const randomNumber = Math.random() * 100;
		const successfulTackle = tackleProbabilities.find(
			(tackle) => randomNumber <= tackle.probability,
		);
		const goalsBeforeEvent = nearbyPlayers.map(
			(player) => player.shortTermGoal,
		);
		if (successfulTackle) {
			playerWithBall.hasBall = false;
			playerWithBall.shortTermGoal = "KEEP_POSITION";
			successfulTackle.tackler.hasBall = true;
			successfulTackle.tackler.shortTermGoal = "TOWARDS_GOAL";
			ball.x = successfulTackle.tackler.x;
			ball.y = successfulTackle.tackler.y;
		} else {
			tacklingPlayers.forEach((player) => {
				player.shortTermGoal = "KEEP_POSITION";
			});
		}
		return new Event(
			"BALL_DISPUTE",
			nearbyPlayers,
			goalsBeforeEvent,
			nearbyPlayers.map((player) => player.shortTermGoal),
			playerWithBall.hasBall ? "FAIL" : "SUCCESS",
		);
	}
};
