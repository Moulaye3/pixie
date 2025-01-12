import { Graphics } from 'pixi.js';

export class Bow {
    constructor(player) {
        this.player = player;
        this.attackGraphics = new Graphics();
        this.player.addChild(this.attackGraphics);
        
        // Attack properties
        this.isAttacking = false;
        this.attackStartTime = 0;
        this.attackDuration = 200; // Slightly slower than sword
        this.attackCooldown = 350;
        this.lastAttackTime = 0;
        this.maxAttackLength = 300; // Longer range than sword
    }

    getPlayerColors() {
        return {
            main: 0x000000,    // Black
            inner: 0x000000,   // Dark Gray
            detail: 0x8A2BE2,  // Violet/Purple
            arrow: 0x8A2BE2    // Violet/Purple
        };
    }

    startAttack() {
        const now = Date.now();
        if (!this.isAttacking && now - this.lastAttackTime >= this.attackCooldown) {
            this.isAttacking = true;
            this.attackStartTime = now;
            this.lastAttackTime = now;
        }
    }

    update() {
        this.attackGraphics.clear();

        if (this.isAttacking) {
            const now = Date.now();
            const attackProgress = (now - this.attackStartTime) / this.attackDuration;

            if (attackProgress >= 1) {
                this.isAttacking = false;
            } else {
                const angle = this.player.angle;
                const attackLength = this.maxAttackLength * Math.min(attackProgress * 1.5, 1); // Extend quickly
                const fadeOut = attackProgress > 0.7 ? 1 - ((attackProgress - 0.7) * 3.33) : 1; // Fade out at the end
                
                // Calculate the attack line endpoints
                const startX = 0;
                const startY = 0;
                const endX = Math.cos(angle) * attackLength;
                const endY = Math.sin(angle) * attackLength;

                // Draw the arrow
                if (attackProgress < 0.9) {
                    // Draw energy build-up at start
                    const chargeSize = 15 * (1 - attackProgress);
                    for (let i = 0; i < 3; i++) {
                        const rotationOffset = (Date.now() / 200) + (i * Math.PI * 2 / 3);
                        const orbitX = startX + Math.cos(rotationOffset) * chargeSize;
                        const orbitY = startY + Math.sin(rotationOffset) * chargeSize;
                        
                        this.attackGraphics.beginFill(this.getPlayerColors().detail, 0.5 * fadeOut);
                        this.attackGraphics.drawCircle(orbitX, orbitY, 3);
                        this.attackGraphics.endFill();
                    }

                    // Draw arrow trail with enhanced effects
                    const trailSteps = 12;
                    for (let i = 0; i < trailSteps; i++) {
                        const trailProgress = attackProgress - (i * 0.05);
                        if (trailProgress > 0) {
                            const trailLength = this.maxAttackLength * Math.min(trailProgress * 1.5, 1);
                            const trailEndX = Math.cos(angle) * trailLength;
                            const trailEndY = Math.sin(angle) * trailLength;
                            
                            // Enhanced trail with multiple layers
                            const trailAlpha = fadeOut * (1 - i/trailSteps) * 0.3;
                            
                            // Outer glow
                            this.attackGraphics.lineStyle(8, this.getPlayerColors().detail, trailAlpha * 0.3);
                            this.attackGraphics.moveTo(startX, startY);
                            this.attackGraphics.lineTo(trailEndX, trailEndY);
                            
                            // Inner trail
                            this.attackGraphics.lineStyle(3, this.getPlayerColors().detail, trailAlpha);
                            this.attackGraphics.moveTo(startX, startY);
                            this.attackGraphics.lineTo(trailEndX, trailEndY);

                            // Add energy particles along the trail
                            if (i % 2 === 0) {
                                const particleCount = 28;
                                for (let p = 0; p < particleCount; p++) {
                                    const particleProgress = p / particleCount;
                                    const particleX = startX + (trailEndX - startX) * particleProgress;
                                    const particleY = startY + (trailEndY - startY) * particleProgress;
                                    const particleOffset = (Math.random() - 0.5) * 10;
                                    
                                    this.attackGraphics.beginFill(0x8A2BE2, trailAlpha * 0.8);
                                    this.attackGraphics.drawCircle(
                                        particleX + Math.cos(angle + Math.PI/2) * particleOffset,
                                        particleY + Math.sin(angle + Math.PI/2) * particleOffset,
                                        2
                                    );
                                    this.attackGraphics.endFill();
                                }
                            }
                        }
                    }

                    // Draw arrow shaft with enhanced gradient
                    const gradientSteps = 1;
                    for (let i = 0; i < gradientSteps; i++) {
                        const gradientAlpha = fadeOut * (1 - i * 0.15);
                        const lineWidth = 4 - i * 0.5;
                        
                        // Outer glow
                        this.attackGraphics.lineStyle(lineWidth + 4, 0x8A2BE2, gradientAlpha * 0.2);
                        this.attackGraphics.moveTo(startX, startY);
                        this.attackGraphics.lineTo(endX, endY);
                        
                        // Inner shaft
                        this.attackGraphics.lineStyle(lineWidth, 0x8A2BE2, gradientAlpha);
                        this.attackGraphics.moveTo(startX, startY);
                        this.attackGraphics.lineTo(endX, endY);
                    }

                    // Enhanced arrow head
                    const headLength = 25;
                    const headWidth = 25;
                    const headAngle = Math.PI / 6;

                    const tipX = endX;
                    const tipY = endY;
                    const leftX = endX - headLength * Math.cos(angle - headAngle);
                    const leftY = endY - headLength * Math.sin(angle - headAngle);
                    const rightX = endX - headLength * Math.cos(angle + headAngle);
                    const rightY = endY - headLength * Math.sin(angle + headAngle);
                    const baseX = endX - headLength * Math.cos(angle);
                    const baseY = endY - headLength * Math.sin(angle);

                    // Draw arrowhead with multiple layers for depth
                    const arrowGradient = [
                        { color: 0x000000, alpha: fadeOut },
                        { color: 0x8A2BE2, alpha: fadeOut * 0.9 },
                        { color: 0x000000, alpha: fadeOut * 0.8 }
                    ];

                    arrowGradient.forEach((g, i) => {
                        const scale = 1 - i * 0.2;
                        const scaledTipX = baseX + (tipX - baseX) * scale;
                        const scaledTipY = baseY + (tipY - baseY) * scale;
                        const scaledLeftX = baseX + (leftX - baseX) * scale;
                        const scaledLeftY = baseY + (leftY - baseY) * scale;
                        const scaledRightX = baseX + (rightX - baseX) * scale;
                        const scaledRightY = baseY + (rightY - baseY) * scale;

                        // Draw layer
                        this.attackGraphics.lineStyle(2, 0xFFFFFF, g.alpha * 0.5);
                        this.attackGraphics.beginFill(g.color, g.alpha);
                        this.attackGraphics.moveTo(scaledTipX, scaledTipY);
                        this.attackGraphics.lineTo(scaledLeftX, scaledLeftY);
                        this.attackGraphics.lineTo(baseX, baseY);
                        this.attackGraphics.lineTo(scaledRightX, scaledRightY);
                        this.attackGraphics.lineTo(scaledTipX, scaledTipY);
                        this.attackGraphics.endFill();
                    });

                    // Add orbiting energy particles at arrow tip
                    const energyPoints = 6;
                    const energyRadius = 8;
                    for (let i = 0; i < energyPoints; i++) {
                        const energyAngle = (Date.now() / 200) + (i * Math.PI * 2 / energyPoints);
                        const energyX = tipX + Math.cos(energyAngle) * energyRadius * (1 - attackProgress);
                        const energyY = tipY + Math.sin(energyAngle) * energyRadius * (1 - attackProgress);
                        
                        this.attackGraphics.beginFill(0x8A2BE2, 0.4 * fadeOut);
                        this.attackGraphics.drawCircle(energyX, energyY, 2);
                        this.attackGraphics.endFill();
                    }
                }
            }
        }
    }

    getHitbox() {
        if (!this.isAttacking) return null;

        const now = Date.now();
        const attackProgress = (now - this.attackStartTime) / this.attackDuration;
        
        if (attackProgress >= 1) return null;

        const angle = this.player.angle;
        const attackLength = this.maxAttackLength * Math.min(attackProgress * 1.5, 1);
        
        return {
            x: this.player.x + Math.cos(angle) * attackLength,
            y: this.player.y + Math.sin(angle) * attackLength,
            width: 30,
            height: 30
        };
    }

    destroy() {
        if (this.attackGraphics.parent) {
            this.attackGraphics.parent.removeChild(this.attackGraphics);
        }
        this.attackGraphics.destroy();
    }
}