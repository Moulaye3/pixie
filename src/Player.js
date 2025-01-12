import { Container, Graphics } from "pixi.js";
import { Arena } from './Arena.js';
import { Sword } from './weapons/sword.js';
import { Bow } from './weapons/bow.js';
import { Trident } from './weapons/trident.js';


export class Player extends Container {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.lives = 3;
        this.isInvulnerable = false;
        this.radius = 20;
        this.graphics = new Graphics();
        this.angle = 0;
        this.weapon = null;
        
        this.addChild(this.graphics);
        this.draw();
    }

    startAttack() {
        if (this.weapon) {
            this.weapon.startAttack();
        }
    }

    getAttackHitbox() {
        return this.weapon ? this.weapon.getHitbox() : null;
    }

    update(deltaTime) {
        this.draw();
        if (this.weapon) {
            this.weapon.update(deltaTime);
        }
    }

    draw() {
        this.graphics.clear();

        // Get weapon-specific colors and styles
        const weaponColors = this.getWeaponColors();

        // Draw player body
        const color = this.isInvulnerable ? 0x888888 : weaponColors.main;
        const innerColor = this.isInvulnerable ? 0x666666 : weaponColors.inner;
        
        // Base circle
        this.graphics.beginFill(innerColor, 0.9);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
        
        this.graphics.beginFill(color, 0.7);
        this.graphics.drawCircle(0, 0, this.radius * 0.8);
        this.graphics.endFill();

        // Draw weapon-specific details
        if (this.weapon) {
            if (this.weapon instanceof Sword) {
                // Draw crossed swords pattern
                const swordLength = this.radius * 0.6;
                this.graphics.lineStyle(3, weaponColors.detail, 0.8);
                
                // First sword
                this.graphics.moveTo(-swordLength, -swordLength);
                this.graphics.lineTo(swordLength, swordLength);
                
                // Second sword
                this.graphics.moveTo(-swordLength, swordLength);
                this.graphics.lineTo(swordLength, -swordLength);
            } else if (this.weapon instanceof Bow) {
                // Draw bow pattern
                const bowRadius = this.radius * 0.6;
                this.graphics.lineStyle(3, weaponColors.detail, 0.8);
                
                // Draw bow arc
                this.graphics.arc(0, 0, bowRadius, -Math.PI/3, Math.PI/3);
                
                // Draw bowstring
                this.graphics.moveTo(bowRadius * Math.cos(-Math.PI/3), bowRadius * Math.sin(-Math.PI/3));
                this.graphics.lineTo(bowRadius * Math.cos(Math.PI/3), bowRadius * Math.sin(Math.PI/3));
            } else if (this.weapon instanceof Trident) {
                // Draw solid trident line
                const tridentSize = this.radius * 0.6;
                const tridentWidth = 3;
                this.graphics.beginFill(weaponColors.detail, 0.8);
                this.graphics.drawRect(-tridentWidth/2, -tridentSize, tridentWidth, tridentSize * 2);
                this.graphics.endFill();
            }
        }

        // Draw direction indicator
        const arrowLength = this.radius + 5;
        
        this.graphics.lineStyle(3, weaponColors.arrow, 0.8);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(
            Math.cos(this.angle) * arrowLength,
            Math.sin(this.angle) * arrowLength
        );
    }

    getWeaponColors() {
        if (!this.weapon) {
            return {
                main: 0xFFFFFF,
                inner: 0xCCFFFF,
                detail: 0xFFFFFF,
                arrow: 0xFF0000
            };
        }
        
        if (this.weapon instanceof Sword) {
            return {
                main: 0x000000,  // Black
                inner: 0x000000, // Dark Gray
                detail: 0xFF0000, // Medium Gray
                arrow: 0xFF0000  // Light Gray
            };
        }
        
        if (this.weapon instanceof Bow) {
            return {
                main: 0x000000,  // Pale Green
                inner: 0x000000, // Lime Green
                detail: 0x8A2BE2,
                arrow: 0x8A2BE2
            };
        }
        
        if (this.weapon instanceof Trident) {
            return {
                main: 0x00CED1,  // Dark Turquoise
                inner: 0x40E0D0, // Turquoise
                detail: 0x00CED1,
                arrow: 0x48D1CC
            };
        }
    }

    handleMouseMove(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.angle = Math.atan2(dy, dx);
    }

    takeDamage() {
        if (this.isInvulnerable) return;
        
        this.lives--;
        this.isInvulnerable = true;

        setTimeout(() => {
            this.isInvulnerable = false;
        }, 1000);
    }

    destroy() {
        if (this.weapon) {
            this.weapon.destroy();
        }
        super.destroy({ children: true });
    }
}
