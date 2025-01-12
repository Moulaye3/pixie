import { Graphics } from 'pixi.js';

export class Trident {
    constructor(player) {
        this.player = player;
        this.attackGraphics = new Graphics();
        this.player.addChild(this.attackGraphics);
        
        // Attack properties
        this.isAttacking = false;
        this.attackStartTime = 0;
        this.attackDuration = 250;
        this.attackCooldown = 250;
        this.lastAttackTime = 0;
        this.maxAttackLength = 90;
        this.baseLength = 40;
    }

    getGoldColors() {
        return {
            main: 0x000000,    // Gold
            bright: 0xFFD700,  // Khaki
            dark: 0xFFD700,    // Golden Rod
            glow: 0xFFD700     // Gold glow
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

        const currentAngle = this.player.angle;
        const startX = Math.cos(currentAngle) * 10;
        const startY = Math.sin(currentAngle) * 10;

        if (this.isAttacking) {
            const now = Date.now();
            const attackProgress = (now - this.attackStartTime) / this.attackDuration;

            if (attackProgress >= 1) {
                this.isAttacking = false;
            } else {
                // Calculate thrust properties
                const thrustProgress = Math.sin(attackProgress * Math.PI);
                const fadeOut = Math.sin(attackProgress * Math.PI);
                const currentLength = this.baseLength + (this.maxAttackLength - this.baseLength) * thrustProgress;

                // Draw energy build-up at start
                const chargeSize = 15 * (1 - attackProgress);
                for (let i = 0; i < 3; i++) {
                    const rotationOffset = (Date.now() / 200) + (i * Math.PI * 2 / 3);
                    const orbitX = startX + Math.cos(rotationOffset) * chargeSize;
                    const orbitY = startY + Math.sin(rotationOffset) * chargeSize;
                    
                    this.attackGraphics.beginFill(this.getGoldColors().bright, 0.5 * fadeOut);
                    this.attackGraphics.drawCircle(orbitX, orbitY, 3);
                    this.attackGraphics.endFill();
                }

                // Draw energy spiral effect
                const spiralPoints = 15;
                const spiralRadius = 15;
                for (let i = 0; i < spiralPoints; i++) {
                    const spiralProgress = i / spiralPoints;
                    const spiralDist = currentLength * spiralProgress;
                    const spiralAngle = currentAngle + spiralProgress * Math.PI * 6;
                    const spiralX = startX + Math.cos(currentAngle) * spiralDist + 
                                  Math.cos(spiralAngle) * spiralRadius * (1 - spiralProgress);
                    const spiralY = startY + Math.sin(currentAngle) * spiralDist + 
                                  Math.sin(spiralAngle) * spiralRadius * (1 - spiralProgress);
                    
                    this.attackGraphics.beginFill(this.getGoldColors().bright, 0.3 * (1 - spiralProgress) * fadeOut);
                    this.attackGraphics.drawCircle(spiralX, spiralY, 2 * (1 - spiralProgress));
                    this.attackGraphics.endFill();
                }

                // Draw the trident shaft with golden gradient
                const shaftWidth = 8;
                const tipOffset = 20;
                const prongs = 3;
                const prongSpacing = 12;
                const prongLength = 30;
                const prongCurve = 0.3;

                // Draw shaft glow
                const glowStrength = (Math.sin(attackProgress * Math.PI * 3) * 0.5 + 0.5) * fadeOut;
                this.attackGraphics.lineStyle(shaftWidth + 4, this.getGoldColors().glow, 0.3 * glowStrength);
                this.attackGraphics.moveTo(startX, startY);
                this.attackGraphics.lineTo(
                    startX + Math.cos(currentAngle) * currentLength,
                    startY + Math.sin(currentAngle) * currentLength
                );

                // Draw main shaft with solid fill
                this.attackGraphics.lineStyle(0);
                this.attackGraphics.beginFill(this.getGoldColors().main, fadeOut);
                
                // Draw shaft as a rectangle
                const shaftEndX = startX + Math.cos(currentAngle) * currentLength;
                const shaftEndY = startY + Math.sin(currentAngle) * currentLength;
                const perpAngle = currentAngle + Math.PI/2;
                
                this.attackGraphics.moveTo(
                    startX + Math.cos(perpAngle) * shaftWidth/2,
                    startY + Math.sin(perpAngle) * shaftWidth/2
                );
                this.attackGraphics.lineTo(
                    shaftEndX + Math.cos(perpAngle) * shaftWidth/2,
                    shaftEndY + Math.sin(perpAngle) * shaftWidth/2
                );
                this.attackGraphics.lineTo(
                    shaftEndX - Math.cos(perpAngle) * shaftWidth/2,
                    shaftEndY - Math.sin(perpAngle) * shaftWidth/2
                );
                this.attackGraphics.lineTo(
                    startX - Math.cos(perpAngle) * shaftWidth/2,
                    startY - Math.sin(perpAngle) * shaftWidth/2
                );
                this.attackGraphics.closePath();
                this.attackGraphics.endFill();

                // Add bright accent line
                this.attackGraphics.lineStyle(2, this.getGoldColors().bright, fadeOut);
                this.attackGraphics.moveTo(startX, startY);
                this.attackGraphics.lineTo(shaftEndX, shaftEndY);

                // Calculate trident head position
                const headX = startX + Math.cos(currentAngle) * currentLength;
                const headY = startY + Math.sin(currentAngle) * currentLength;
                const angle = Math.atan2(headY - startY, headX - startX);

                // Draw prongs
                for (let i = 0; i < prongs; i++) {
                    const offset = (i - 1) * prongSpacing;
                    const prongStartX = headX + Math.cos(angle + Math.PI/2) * offset;
                    const prongStartY = headY + Math.sin(angle + Math.PI/2) * offset;
                    const prongEndX = prongStartX + Math.cos(angle) * prongLength;
                    const prongEndY = prongStartY + Math.sin(angle) * prongLength;
                    
                    // Draw prong with solid fill
                    this.attackGraphics.lineStyle(0);
                    this.attackGraphics.beginFill(this.getGoldColors().main, fadeOut);
                    
                    const prongPerpAngle = angle + Math.PI/2;
                    this.attackGraphics.moveTo(
                        prongStartX + Math.cos(prongPerpAngle) * shaftWidth/2,
                        prongStartY + Math.sin(prongPerpAngle) * shaftWidth/2
                    );
                    this.attackGraphics.lineTo(
                        prongEndX + Math.cos(prongPerpAngle) * shaftWidth/2,
                        prongEndY + Math.sin(prongPerpAngle) * shaftWidth/2
                    );
                    this.attackGraphics.lineTo(
                        prongEndX + Math.cos(angle) * (shaftWidth),
                        prongEndY + Math.sin(angle) * (shaftWidth)
                    );
                    this.attackGraphics.lineTo(
                        prongEndX - Math.cos(prongPerpAngle) * shaftWidth/2,
                        prongEndY - Math.sin(prongPerpAngle) * shaftWidth/2
                    );
                    this.attackGraphics.lineTo(
                        prongStartX - Math.cos(prongPerpAngle) * shaftWidth/2,
                        prongStartY - Math.sin(prongPerpAngle) * shaftWidth/2
                    );
                    this.attackGraphics.closePath();
                    this.attackGraphics.endFill();

                    // Add bright accent line
                    this.attackGraphics.lineStyle(2, this.getGoldColors().bright, fadeOut);
                    this.attackGraphics.moveTo(prongStartX, prongStartY);
                    this.attackGraphics.lineTo(prongEndX, prongEndY);
                }

                // Draw connecting piece at trident head
                this.attackGraphics.lineStyle(0);
                this.attackGraphics.beginFill(this.getGoldColors().main, fadeOut);
                this.attackGraphics.drawCircle(headX, headY, shaftWidth * 1.2);
                this.attackGraphics.endFill();
                
                // Add bright accent to connecting piece
                this.attackGraphics.lineStyle(2, this.getGoldColors().bright, fadeOut);
                this.attackGraphics.drawCircle(headX, headY, shaftWidth * 1.2);

                // Add energy particles around prongs
                const particleCount = 12;
                for (let i = 0; i < particleCount; i++) {
                    const particleAngle = (Date.now() / 500) + (i * Math.PI * 2 / particleCount);
                    const distance = 20 + Math.sin(Date.now() / 300) * 5;
                    const particleX = headX + Math.cos(particleAngle) * distance;
                    const particleY = headY + Math.sin(particleAngle) * distance;
                    
                    this.attackGraphics.beginFill(this.getGoldColors().bright, 0.4 * fadeOut);
                    this.attackGraphics.drawCircle(particleX, particleY, 2);
                    this.attackGraphics.endFill();
                }
            }
        } else {
            // Enhanced idle state with better proportions
            const shaftLength = this.baseLength * 0.65;
            const prongLength = this.baseLength * 0.35;
            const prongSpacing = 0;
            const baseX = startX + Math.cos(currentAngle) * shaftLength;
            const baseY = startY + Math.sin(currentAngle) * shaftLength;
            const endX = startX + Math.cos(currentAngle) * this.baseLength;
            const endY = startY + Math.sin(currentAngle) * this.baseLength;

            // Draw shaft with gradient
            const gradient = [0x00ffff, 0x00e6ff, 0x00ccff];
            gradient.forEach((color, i) => {
                const width = 4 - i;
                this.attackGraphics.lineStyle(width, color, 0.8 - i * 0.2);
                this.attackGraphics.moveTo(startX, startY);
                this.attackGraphics.lineTo(baseX, baseY);
            });

            // Draw connecting piece
            this.attackGraphics.lineStyle(3, 0x000000, 0.8);
            this.attackGraphics.moveTo(
                baseX + Math.cos(currentAngle + Math.PI/2) * prongSpacing,
                baseY + Math.sin(currentAngle + Math.PI/2) * prongSpacing
            );
            this.attackGraphics.lineTo(
                baseX + Math.cos(currentAngle - Math.PI/2) * prongSpacing,
                baseY + Math.sin(currentAngle - Math.PI/2) * prongSpacing
            );

            // Draw prongs with gradient
            const drawIdleProng = (startOffsetX, startOffsetY) => {
                gradient.forEach((color, i) => {
                    const width = 3 - i;
                    this.attackGraphics.lineStyle(width, color, 0.8 - i * 0.2);
                    this.attackGraphics.moveTo(baseX + startOffsetX, baseY + startOffsetY);
                    this.attackGraphics.lineTo(endX + startOffsetX, endY + startOffsetY);
                });
            };

            // Draw all three prongs
            drawIdleProng(0, 0);  // Middle
            drawIdleProng(
                Math.cos(currentAngle + Math.PI/2) * prongSpacing,
                Math.sin(currentAngle + Math.PI/2) * prongSpacing
            );  // Left
            drawIdleProng(
                Math.cos(currentAngle - Math.PI/2) * prongSpacing,
                Math.sin(currentAngle - Math.PI/2) * prongSpacing
            );  // Right
        }
    }

    getHitbox() {
        if (!this.isAttacking) return null;

        const now = Date.now();
        const attackProgress = (now - this.attackStartTime) / this.attackDuration;
        
        if (attackProgress >= 1) return null;

        const thrustProgress = Math.sin(attackProgress * Math.PI);
        const currentLength = this.baseLength + (this.maxAttackLength - this.baseLength) * thrustProgress;
        
        // Calculate trident head position for prongs
        const headX = this.player.x + Math.cos(this.player.angle) * currentLength;
        const headY = this.player.y + Math.sin(this.player.angle) * currentLength;
        const prongLength = 30;
        const prongSpacing = 12;

        // Return an array of hitboxes for each part of the trident
        return [
            // Main shaft hitbox
            {
                x: this.player.x + Math.cos(this.player.angle) * (currentLength * 0.5),
                y: this.player.y + Math.sin(this.player.angle) * (currentLength * 0.5),
                width: currentLength,
                height: 12
            },
            // Center prong hitbox
            {
                x: headX + Math.cos(this.player.angle) * (prongLength * 0.5),
                y: headY + Math.sin(this.player.angle) * (prongLength * 0.5),
                width: prongLength,
                height: 10
            },
            // Left prong hitbox
            {
                x: headX + Math.cos(this.player.angle) * (prongLength * 0.5) + Math.cos(this.player.angle + Math.PI/2) * prongSpacing,
                y: headY + Math.sin(this.player.angle) * (prongLength * 0.5) + Math.sin(this.player.angle + Math.PI/2) * prongSpacing,
                width: prongLength,
                height: 10
            },
            // Right prong hitbox
            {
                x: headX + Math.cos(this.player.angle) * (prongLength * 0.5) + Math.cos(this.player.angle - Math.PI/2) * prongSpacing,
                y: headY + Math.sin(this.player.angle) * (prongLength * 0.5) + Math.sin(this.player.angle - Math.PI/2) * prongSpacing,
                width: prongLength,
                height: 10
            }
        ];
    }

    destroy() {
        if (this.attackGraphics.parent) {
            this.attackGraphics.parent.removeChild(this.attackGraphics);
        }
        this.attackGraphics.destroy();
    }
}
