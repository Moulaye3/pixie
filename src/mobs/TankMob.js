import { Mob } from './Mob.js';

export class TankMob extends Mob {
    constructor(x, y, config) {
        super(x, y, config);
        // Slow but tough
        this.speed = 1;
        this.health = 200;
        this.damage = 20;
        this.radius = 30;
        this.color = 0x8B0000; // Dark red color
        this.chargeSpeed = 6;
        this.isCharging = false;
        this.chargeTimer = 0;
        this.chargeCooldown = 180; // 3 seconds at 60 fps
        this.chargeDistance = 200;
        this.chargeDirection = { x: 0, y: 0 };
        this.preparingCharge = false;
        this.prepareTimer = 0;
    }

    update(player, delta) {
        if (!this.isAlive) return;

        if (this.preparingCharge) {
            this.prepareTimer -= delta;
            if (this.prepareTimer <= 0) {
                this.startCharge(player);
            }
            return;
        }

        if (this.isCharging) {
            // Continue charge movement
            const frameSpeed = this.chargeSpeed * (delta / 16.67);
            const newX = this.x + this.chargeDirection.x * frameSpeed;
            const newY = this.y + this.chargeDirection.y * frameSpeed;

            // Check if new position is within arena bounds
            const distanceFromCenter = Math.sqrt(
                Math.pow(newX - this.config.centerX, 2) + 
                Math.pow(newY - this.config.centerY, 2)
            );

            if (distanceFromCenter < this.config.innerRadius - this.radius) {
                this.x = newX;
                this.y = newY;
                this.graphics.x = this.x;
                this.graphics.y = this.y;
            } else {
                // Hit wall, end charge
                this.isCharging = false;
            }
            
            this.chargeTimer -= delta;
            if (this.chargeTimer <= 0) {
                this.isCharging = false;
            }

            // Check collision with player during charge
            if (this.checkCollision(player)) {
                player.takeDamage(this.damage * 2); // Double damage during charge
                this.isCharging = false;
            }
        } else {
            // Normal movement
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.chargeDistance && this.chargeTimer <= -this.chargeCooldown) {
                // Start preparing for charge
                this.preparingCharge = true;
                this.prepareTimer = 1000; // 1 second preparation
                // Flash red to indicate incoming charge
                this.color = 0xFF0000;
            } else {
                super.update(player, delta);
            }
        }
    }

    startCharge(player) {
        this.preparingCharge = false;
        this.isCharging = true;
        this.chargeTimer = 500; // Charge duration in ms
        
        // Calculate direction to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.chargeDirection = {
            x: dx / distance,
            y: dy / distance
        };
        
        // Reset color
        this.color = 0x8B0000;
    }

    draw() {
        super.draw();
        
        // Add tank indicators
        this.graphics.lineStyle(3, 0x000000);
        
        // Draw armor plates
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2);
            const x1 = Math.cos(angle) * this.radius;
            const y1 = Math.sin(angle) * this.radius;
            const x2 = Math.cos(angle + Math.PI/4) * (this.radius * 0.7);
            const y2 = Math.sin(angle + Math.PI/4) * (this.radius * 0.7);
            
            this.graphics.moveTo(x1, y1);
            this.graphics.lineTo(x2, y2);
        }
        
        // Add charge indicator if preparing
        if (this.preparingCharge) {
            this.graphics.lineStyle(2, 0xFF0000);
            this.graphics.drawCircle(0, 0, this.radius + 5);
        }
    }
}
