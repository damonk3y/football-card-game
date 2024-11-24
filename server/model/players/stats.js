export class PlayerStats {
    constructor() {
        this.physicalStats = {
            speed: 10,            // meters per second
            acceleration: 16      // meters per second squared
        };

        this.offensiveStats = {
            ballControl: 90,          // rating out of 100
            dribbling: 99,            // rating out of 100
            passing: 50,              // rating out of 100
            vision: 50,               // rating out of 100
            crossing: 50,             // rating out of 100
            shooting: 50,             // rating out of 100
            finishing: 50,            // rating out of 100
            longShots: 50,            // rating out of 100
            volleys: 50,              // rating out of 100
            penalties: 50,            // rating out of 100
            positioning: 50,          // rating out of 100
            speedInPossession: 8,    // meters per second
            ballSpin: 8              // rotations per second
        };

        this.defensiveStats = {
            tackling: 50,     // rating out of 100
            marking: 50,      // rating out of 100
            interceptions: 50, // rating out of 100
            heading: 50       // rating out of 100
        };

        this.goalkeeperStats = {
            reflexes: 50,     // rating out of 100
            diving: 50,       // rating out of 100
            handling: 50,     // rating out of 100
            positioning: 50,  // rating out of 100
            kicking: 50       // rating out of 100
        };
    }
}