import { Graphics } from 'pixi.js';
import { Mob } from './Mob.js';

export class RangedMob extends Mob {
    constructor(x, y, config) {
        super(x, y, config);
        this.color = 0x8800FF;
        this.health = 75; // Less health than melee mobs
        this.preferredDistance = 200;
        this.projectiles = [];
        this.shootCooldown = 0;
        this.shootDelay = 120; // 2 seconds at 60fps
        this.projectileSpeed = 5;
        this.projectileRadius = 5;
        this.projectileDamage = 15;
        this.projectileGraphics = new Graphics();
        this.speed = 1.5; // Slower than melee mobs
        if (this.graphics.parent) {
            this.graphics.parent.addChild(this.projectileGraphics);
        }
    }

    update(player, delta) {
        if (!this.isAlive) return;

        // Calculate direction to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move to maintain preferred distance
        if (distance < this.preferredDistance - 50) {
            // Too close, move away
            const frameSpeed = this.speed * (delta / 16.67); // Normalize to 60fps
            const newX = this.x - (dx / distance) * frameSpeed;
            const newY = this.y - (dy / distance) * frameSpeed;
            
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
        } else if (distance > this.preferredDistance + 50) {
            // Too far, move closer
            const frameSpeed = this.speed * (delta / 16.67); // Normalize to 60fps
            const newX = this.x + (dx / distance) * frameSpeed;
            const newY = this.y + (dy / distance) * frameSpeed;
            
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

        // Update projectiles
        this.projectileGraphics.clear();
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            // Update projectile position
            const frameSpeed = this.projectileSpeed * (delta / 16.67);
            projectile.x += projectile.dx * frameSpeed;
            projectile.y += projectile.dy * frameSpeed;
            
            // Check if projectile is out of bounds
            const distanceFromCenter = Math.sqrt(
                Math.pow(projectile.x - this.config.centerX, 2) + 
                Math.pow(projectile.y - this.config.centerY, 2)
            );
            
            if (distanceFromCenter > this.config.innerRadius) {
                this.projectiles.splice(i, 1);
                continue;
            }
            
            // Check collision with player
            const pdx = projectile.x - player.x;
            const pdy = projectile.y - player.y;
            const projectileDistance = Math.sqrt(pdx * pdx + pdy * pdy);
            
            if (projectileDistance < this.projectileRadius + player.radius) {
                player.takeDamage(this.projectileDamage);
                this.projectiles.splice(i, 1);
                continue;
            }
            
            // Draw projectile
            this.projectileGraphics.lineStyle(2, 0x000000);
            this.projectileGraphics.beginFill(0xFF00FF);
            this.projectileGraphics.drawCircle(projectile.x, projectile.y, this.projectileRadius);
            this.projectileGraphics.endFill();
        }

        // Handle shooting
        if (this.shootCooldown > 0) {
            this.shootCooldown -= delta;
        } else if (distance <= this.preferredDistance * 1.5) {
            this.shoot(player);
            this.shootCooldown = this.shootDelay;
        }

        // Call parent update for invulnerability
        super.update(player, delta);
    }

    shoot(player) {
        // Calculate direction to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create projectile
        this.projectiles.push({
            x: this.x,
            y: this.y,
            dx: (dx / distance) * this.projectileSpeed,
            dy: (dy / distance) * this.projectileSpeed
        });
    }

    draw() {
        super.draw();
        
        // Add ranged indicator
        this.graphics.lineStyle(2, 0xFFFFFF);
        this.graphics.moveTo(-this.radius, -this.radius);
        this.graphics.lineTo(this.radius, this.radius);
        this.graphics.moveTo(-this.radius, this.radius);
        this.graphics.lineTo(this.radius, -this.radius);
    }

    destroy() {
        if (this.projectileGraphics && this.projectileGraphics.parent) {
            this.projectileGraphics.parent.removeChild(this.projectileGraphics);
        }
        this.projectileGraphics.destroy();
        super.destroy();
    }
}
