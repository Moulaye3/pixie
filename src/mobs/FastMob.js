import { Mob } from './Mob.js';

export class FastMob extends Mob {
    constructor(x, y, arena) {
        super(x, y, arena);
        // Fast but weak
        this.speed = 4;
        this.health = 50;
        this.damage = 5;
        this.size = 15;
        this.color = 0x00FF00; // Green color

        // Add movement patterns
        this.angle = 0;
        this.circlingDistance = 100;
        this.circlingSpeed = 0.05;
    }

    update(player, delta) {
        if (!this.isAlive) return;

        // Calculate base direction to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.circlingDistance) {
            // Move directly towards player if too far
            super.update(player, delta);
        } else {
            // Circle around player when close
            this.angle += this.circlingSpeed;
            const circleX = player.x + Math.cos(this.angle) * this.circlingDistance;
            const circleY = player.y + Math.sin(this.angle) * this.circlingDistance;
            
            const circleDx = circleX - this.x;
            const circleDy = circleY - this.y;
            const circleDistance = Math.sqrt(circleDx * circleDx + circleDy * circleDy);
            
            this.x += (circleDx / circleDistance) * this.speed;
            this.y += (circleDy / circleDistance) * this.speed;

            // Check arena bounds
            const distanceFromCenter = Math.sqrt(
                Math.pow(this.x - this.arena.centerX, 2) + 
                Math.pow(this.y - this.arena.centerY, 2)
            );
            
            if (distanceFromCenter > this.arena.innerRadius - this.size) {
                const angle = Math.atan2(this.y - this.arena.centerY, this.x - this.arena.centerX);
                this.x = this.arena.centerX + Math.cos(angle) * (this.arena.innerRadius - this.size);
                this.y = this.arena.centerY + Math.sin(angle) * (this.arena.innerRadius - this.size);
            }
        }

        this.draw();
    }

    draw() {
        super.draw();
        // Add trail effect
        this.graphics.lineStyle(2, this.color, 0.5);
        this.graphics.moveTo(-this.size, 0);
        this.graphics.lineTo(-this.size * 2, 0);
    }
}
