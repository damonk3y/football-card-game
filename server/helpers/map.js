export const getDistanceBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export const getAngleBetweenPoints = (x1, y1, x2, y2) => {
    return Math.atan2(y2 - y1, x2 - x1);
}

export const getDistanceToLine = (x, y, lineStartX, lineStartY, lineEndX, lineEndY) => {
    const numerator = Math.abs((lineEndY - lineStartY) * x - (lineEndX - lineStartX) * y + lineEndX * lineStartY - lineEndY * lineStartX);
    const denominator = Math.sqrt((lineEndY - lineStartY) ** 2 + (lineEndX - lineStartX) ** 2);
    return numerator / denominator;
}

export const findNearestOpponent = (player, opponents) => {
    return opponents.reduce((nearest, opponent) => {
        const distanceToOpponent = Math.sqrt(
            Math.pow(player.x - opponent.x, 2) + 
            Math.pow(player.y - opponent.y, 2)
        );
        
        if (!nearest || distanceToOpponent < nearest.distance) {
            return { ...opponent, distance: distanceToOpponent };
        }
        return nearest;
    }, null);
}