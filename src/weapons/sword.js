import { Graphics } from 'pixi.js';

export class Sword {
    constructor(player) {
        this.player = player;
        this.attackGraphics = new Graphics();
        this.player.addChild(this.attackGraphics);
        
        // Attack properties
        this.isAttacking = false;
        this.attackStartTime = 0;
        this.attackDuration = 100; // Slightly longer for swing
        this.attackCooldown = 100;
        this.lastAttackTime = 0;
        this.maxAttackLength = 100;
        this.swingArc = Math.PI * 0.90; // 135-degree swing
    }

    getPlayerColors() {
        return {
            main: 0x000000,    // Black
            inner: 0x000000,   // Dark Gray
            detail: 0xFF0000,  // Red
            arrow: 0xFF0000    // Red
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
                // Calculate swing angle
                const swingProgress = Math.sin(attackProgress * Math.PI); // Smooth swing motion
                const baseAngle = this.player.angle - this.swingArc / 2;
                const currentAngle = baseAngle + this.swingArc * swingProgress;
                
                // Calculate attack properties
                const fadeOut = Math.sin(attackProgress * Math.PI); // Fade with swing
                const attackLength = this.maxAttackLength * (0.8 + 0.2 * swingProgress); // Slight length variation
                
                // Calculate the attack line endpoints
                const startX = Math.cos(currentAngle) * 10;
                const startY = Math.sin(currentAngle) * 10;
                const endX = Math.cos(currentAngle) * attackLength;
                const endY = Math.sin(currentAngle) * attackLength;

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

                // Draw energy spiral effect along the blade
                const spiralPoints = 0;
                const spiralRadius = 0;
                for (let i = 0; i < spiralPoints; i++) {
                    const spiralProgress = i / spiralPoints;
                    const spiralDist = attackLength * spiralProgress;
                    const spiralAngle = currentAngle + spiralProgress * Math.PI * 6;
                    const spiralX = startX + Math.cos(currentAngle) * spiralDist + 
                                  Math.cos(spiralAngle) * spiralRadius * (1 - spiralProgress);
                    const spiralY = startY + Math.sin(currentAngle) * spiralDist + 
                                  Math.sin(spiralAngle) * spiralRadius * (1 - spiralProgress);
                    
                    this.attackGraphics.beginFill(this.getPlayerColors().detail, 0.3 * (1 - spiralProgress) * fadeOut);
                    this.attackGraphics.drawCircle(spiralX, spiralY, 2 * (1 - spiralProgress));
                    this.attackGraphics.endFill();
                }

                // Draw the solid blade shape with metallic gradient
                const bladeWidth = 5;
                const tipWidth = 15;
                
                // Calculate blade vertices with swing
                const leftNormal = {
                    x: Math.cos(currentAngle + Math.PI/2),
                    y: Math.sin(currentAngle + Math.PI/2)
                };
                const rightNormal = {
                    x: Math.cos(currentAngle - Math.PI/2),
                    y: Math.sin(currentAngle - Math.PI/2)
                };

                // Draw blade glow
                const glowStrength = (Math.sin(attackProgress * Math.PI * 3) * 0.5 + 0.5) * fadeOut;
                this.attackGraphics.lineStyle(16, this.getPlayerColors().detail, 0.15 * glowStrength);
                this.attackGraphics.moveTo(startX, startY);
                this.attackGraphics.lineTo(endX, endY);

                // Inner glow
                this.attackGraphics.lineStyle(8, this.getPlayerColors().main, 0.25 * glowStrength);
                this.attackGraphics.moveTo(startX, startY);
                this.attackGraphics.lineTo(endX, endY);

                // Metallic gradient layers
                const gradient = [
                    { color: this.getPlayerColors().main, alpha: 1.0 * fadeOut },     // Main color
                    { color: this.getPlayerColors().main, alpha: 0.95 * fadeOut },    // Slightly darker
                    { color: this.getPlayerColors().main, alpha: 0.90 * fadeOut },    // Darker
                    { color: this.getPlayerColors().main, alpha: 0.85 * fadeOut },    // Even darker
                    { color: this.getPlayerColors().main, alpha: 0.80 * fadeOut }     // Darkest
                ];

                gradient.forEach((g, i) => {
                    const gradientWidth = bladeWidth * (1 - i * 0.15);
                    const gradientTip = tipWidth * (1 - i * 0.15);

                    // Draw metallic blade layer
                    this.attackGraphics.lineStyle(2, this.getPlayerColors().detail, (g.alpha + 0.1) * 0.8);
                    this.attackGraphics.beginFill(g.color, g.alpha);
                    this.attackGraphics.drawPolygon([
                        // Base left
                        startX + leftNormal.x * gradientWidth,
                        startY + leftNormal.y * gradientWidth,
                        // Tip left
                        endX + leftNormal.x * gradientTip,
                        endY + leftNormal.y * gradientTip,
                        // Tip
                        endX,
                        endY,
                        // Tip right
                        endX + rightNormal.x * gradientTip,
                        endY + rightNormal.y * gradientTip,
                        // Base right
                        startX + rightNormal.x * gradientWidth,
                        startY + rightNormal.y * gradientWidth
                    ]);
                    this.attackGraphics.endFill();

                    // Add decorative patterns along the blade
                    const patterns = 0;
                    for (let p = 1; p <= patterns; p++) {
                        const patternPos = p / (patterns + 1);
                        const patternX = startX + Math.cos(currentAngle) * (attackLength * patternPos);
                        const patternY = startY + Math.sin(currentAngle) * (attackLength * patternPos);
                        
                        this.attackGraphics.beginFill(this.getPlayerColors().detail, 0.5 * g.alpha);
                        this.attackGraphics.drawCircle(patternX, patternY, gradientWidth * 0.3);
                        this.attackGraphics.endFill();
                    }
                });

                // Draw motion trail
                const trailSteps = 0;
                for (let i = 0; i < trailSteps; i++) {
                    const trailProgress = attackProgress - (i * 0.08);
                    if (trailProgress > 0) {
                        const trailAngle = baseAngle + this.swingArc * Math.sin(trailProgress * Math.PI);
                        const trailFade = Math.sin(trailProgress * Math.PI) * (1 - i/trailSteps);
                        
                        // Calculate trail points
                        const trailStartX = Math.cos(trailAngle) * attackLength;
                        const trailStartY = Math.sin(trailAngle) * attackLength;
                        
                        // Draw trail with gradient
                        this.attackGraphics.lineStyle(12 * (1 - i/trailSteps), this.getPlayerColors().detail, 0.1 * trailFade);
                        this.attackGraphics.moveTo(
                            Math.cos(trailAngle) * 10,
                            Math.sin(trailAngle) * 10
                        );
                        this.attackGraphics.lineTo(trailStartX, trailStartY);
                    }
                }
            }
        }
    }

    calculateBladeVertices(angle, length, bladeWidth, tipWidth) {
        const startX = Math.cos(angle) * 10;
        const startY = Math.sin(angle) * 10;
        const endX = Math.cos(angle) * length;
        const endY = Math.sin(angle) * length;

        const leftNormal = {
            x: Math.cos(angle + Math.PI/2),
            y: Math.sin(angle + Math.PI/2)
        };
        const rightNormal = {
            x: Math.cos(angle - Math.PI/2),
            y: Math.sin(angle - Math.PI/2)
        };

        return [
            startX + leftNormal.x * bladeWidth,
            startY + leftNormal.y * bladeWidth,
            endX + leftNormal.x * tipWidth,
            endY + leftNormal.y * tipWidth,
            endX,
            endY,
            endX + rightNormal.x * tipWidth,
            endY + rightNormal.y * tipWidth,
            startX + rightNormal.x * bladeWidth,
            startY + rightNormal.y * bladeWidth
        ];
    }

    getHitbox() {
        if (!this.isAttacking) return null;

        const now = Date.now();
        const attackProgress = (now - this.attackStartTime) / this.attackDuration;
        
        if (attackProgress >= 1) return null;

        const swingProgress = Math.sin(attackProgress * Math.PI);
        const baseAngle = this.player.angle - this.swingArc / 2;
        const currentAngle = baseAngle + this.swingArc * swingProgress;
        const attackLength = this.maxAttackLength * (0.8 + 0.2 * swingProgress);
        
        return {
            x: this.player.x + Math.cos(currentAngle) * (attackLength * 0.7),
            y: this.player.y + Math.sin(currentAngle) * (attackLength * 0.7),
            width: 45,
            height: 45
        };
    }

    destroy() {
        if (this.attackGraphics.parent) {
            this.attackGraphics.parent.removeChild(this.attackGraphics);
        }
        this.attackGraphics.destroy();
    }

    // Helper function to convert HSL to RGB for trail effects
    hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, (h + 1/3) / 360);
            g = hue2rgb(p, q, h / 360);
            b = hue2rgb(p, q, (h - 1/3) / 360);
        }
        return (Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255);
    }
}