import { nanoid } from "nanoid";
import { FIELD_WIDTH, FIELD_HEIGHT } from "./field.js";

export class Ball {

	constructor() {
		this.id = nanoid();
		this.x = FIELD_WIDTH / 2;
		this.y = FIELD_HEIGHT / 2;
		this.z = 0;
		this.velocityX = 0;
		this.velocityY = 0;
		this.velocityZ = 0;
		this.spinX = 0;
		this.spinY = 0;
		this.spinZ = 0;
		this.airResistance = 0.99;
		this.groundFriction = 0.95;
		this.gravity = 9.8; // m/s^2
		this.radius = 5;
		this.bounceRestitution = 0.7;
		this.magnusStrength = 1.5;
	}

	update = (deltaTime) => {
		const timeStep = deltaTime / 1000;

		this.velocityZ -= this.gravity * timeStep;
		
		const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2 + this.velocityZ ** 2);
		if (speed > 0) {
			const magnusForce = {
				x: (this.spinY * this.velocityZ - this.spinZ * this.velocityY) * this.magnusStrength,
				y: (this.spinZ * this.velocityX - this.spinX * this.velocityZ) * this.magnusStrength,
				z: (this.spinX * this.velocityY - this.spinY * this.velocityX) * this.magnusStrength
			};
			this.velocityX += magnusForce.x * timeStep;
			this.velocityY += magnusForce.y * timeStep;
			this.velocityZ += magnusForce.z * timeStep;
		}

		this.x += this.velocityX * timeStep;
		this.y += this.velocityY * timeStep;
		this.z += this.velocityZ * timeStep;
		
		if (this.z < 0) {
			this.z = 0;
			this.velocityZ = -this.velocityZ * 0.6;
		}

		this.handleGroundCollision();
		this.handleBoundaryCollisions();
		this.validatePosition();
		this.cleanupVelocities();
	}

	handleGroundCollision = () => {
		if (this.z <= 0) {
			this.z = 0;
			this.velocityZ = Math.abs(this.velocityZ) * this.bounceRestitution;
			this.velocityX *= this.groundFriction;
			this.velocityY *= this.groundFriction;
		} else {
			this.velocityX *= this.airResistance;
			this.velocityY *= this.airResistance;
			this.velocityZ *= this.airResistance;
		}
	}

	handleBoundaryCollisions = () => {
		if (this.x - this.radius < 0) {
			this.x = this.radius;
			this.velocityX = -this.velocityX * this.bounceRestitution;
		}
		if (this.x + this.radius > FIELD_WIDTH) {
			this.x = FIELD_WIDTH - this.radius;
			this.velocityX = -this.velocityX * this.bounceRestitution;
		}
		if (this.y - this.radius < 0) {
			this.y = this.radius;
			this.velocityY = -this.velocityY * this.bounceRestitution;
		}
		if (this.y + this.radius > FIELD_HEIGHT) {
			this.y = FIELD_HEIGHT - this.radius;
			this.velocityY = -this.velocityY * this.bounceRestitution;
		}
	}

	validatePosition = () => {
		if (isNaN(this.x) || isNaN(this.y)) {
			this.x = FIELD_WIDTH / 2;
			this.y = FIELD_HEIGHT / 2;
			this.velocityX = 0;
			this.velocityY = 0;
		}
	}

	cleanupVelocities = () => {
		this.velocityX = isNaN(this.velocityX) ? 0 : this.velocityX;
		this.velocityY = isNaN(this.velocityY) ? 0 : this.velocityY;
	}

	kick = (power, horizontalAngle, verticalAngle, spin = 0) => {
		const horizontalPower = power * Math.cos(verticalAngle);
		this.velocityX = Math.cos(horizontalAngle) * horizontalPower;
		this.velocityY = Math.sin(horizontalAngle) * horizontalPower;
		this.velocityZ = Math.sin(verticalAngle) * power;
		
		this.spinX = -Math.sin(horizontalAngle) * spin;
		this.spinY = Math.cos(horizontalAngle) * spin;
	}
}
