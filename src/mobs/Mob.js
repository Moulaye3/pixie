import { Graphics } from 'pixi.js';

export class Mob {
    constructor(x, y, config) {
        this.graphics = new Graphics();
        this.x = x;
        this.y = y;
        this.config = config;
        this.speed = 100;
        this.health = 100;
        this.damage = 10;
        this.radius = 20;
        this.color = 0xFF0000;
        this.isEnemy = true;
        this.isAlive = true;
        this.invulnerable = false;
        this.lastHitTime = 0;
        this.draw();
    }

    update(player, delta) {
        if (!this.isAlive) return;

        // Calculate direction to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only move if not too close to player
        if (distance > this.radius + player.radius) {
            // Normalize direction
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;

            // Update position with delta time
            const frameSpeed = this.speed * (delta / 16.67); // Normalize to 60fps
            const newX = this.x + normalizedDx * frameSpeed;
            const newY = this.y + normalizedDy * frameSpeed;

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
            }
        }

        // Update invulnerability
        if (this.invulnerable && Date.now() - this.lastHitTime > 500) {
            this.invulnerable = false;
            this.draw();
        }
    }

    draw() {
        this.graphics.clear();
        
        // Draw body
        this.graphics.lineStyle(2, 0x000000);
        this.graphics.beginFill(this.invulnerable ? 0x888888 : (this.health > 100 ? 0x8800FF : (this.health > 50 ? this.color : 0x880000)));
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();

        // Draw health bar
        const healthBarWidth = this.radius * 2;
        const healthBarHeight = 4;
        const maxHealth = this.health > 100 ? 200 : 100; // Adjust for tank mobs
        const healthPercentage = this.health / maxHealth;
        
        // Background
        this.graphics.lineStyle(1, 0x000000);
        this.graphics.beginFill(0x000000, 0.5);
        this.graphics.drawRect(-healthBarWidth/2, -this.radius - 10, healthBarWidth, healthBarHeight);
        this.graphics.endFill();
        
        // Health
        this.graphics.beginFill(this.health > 100 ? 0x8800FF : (this.health > 50 ? 0x00FF00 : 0xFF0000));
        this.graphics.drawRect(-healthBarWidth/2, -this.radius - 10, healthBarWidth * healthPercentage, healthBarHeight);
        this.graphics.endFill();

        // Add glow effect for tank mobs
        if (this.health > 100) {
            this.graphics.lineStyle(0);
            this.graphics.beginFill(0x8800FF, 0.2);
            this.graphics.drawCircle(0, 0, this.radius + 5);
            this.graphics.endFill();
        }

        this.graphics.x = this.x;
        this.graphics.y = this.y;
    }

    takeDamage(damage) {
        if (!this.isAlive || this.invulnerable) return false;
        
        this.health -= damage;
        this.invulnerable = true;
        this.lastHitTime = Date.now();
        this.draw(); // Update visual appearance
        
        if (this.health <= 0) {
            this.isAlive = false;
            return true;
        }
        return false;
    }

    checkCollision(entity) {
        if (!this.isAlive || !entity) return false;

        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + entity.radius;
    }

    destroy() {
        if (this.graphics && this.graphics.parent) {
            this.graphics.parent.removeChild(this.graphics);
        }
        this.graphics.destroy();
    }
}
