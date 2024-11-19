/**
 * @typedef {Object} Event After an event has occurred, the short term goal of the players might change
 * @property {string} type - "BALL_DISPUTE"
 * @property {Player[]} impactedPlayers - Players that are impacted by the event
 * @property {number} goalsBeforeEvent - Short term goals before the event
 * @property {number} goalsAfterEvent - Short term goals after the event
 * @property {string} result - "SUCCESS" | "FAIL"
 */
export class Event {
    constructor(type, players, goalsBeforeEvent, goalsAfterEvent, result) {
        this.type = type;
        this.impactedPlayers = players;
        this.goalsBeforeEvent = goalsBeforeEvent;
        this.goalsAfterEvent = goalsAfterEvent;
        this.result = result;
    }
}