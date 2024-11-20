export class PlayerStats {
    constructor() {
        this.physicalStats = {
            speed: 35, // Top speed in m/s
            acceleration: 8.2, // Meters per second squared (m/s²)
        };

        this.offensiveStats = {
            ballControl: 50,
            dribbling: 50,
            passing: 50,
            vision: 50,
            crossing: 50,
            shooting: 50,
            finishing: 50,
            longShots: 50,
            volleys: 50,
            penalties: 50,
            positioning: 50,
            speedInPossession: 18, // Speed in possession in m/s
        };

        this.defensiveStats = {
            tackling: 50,
            marking: 50,
            interceptions: 50,
            heading: 50
        };

        this.goalkeeperStats = {
            reflexes: 50,
            diving: 50,
            handling: 50,
            positioning: 50,
            kicking: 50
        };
    }
}