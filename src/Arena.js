import { Container, Graphics } from 'pixi.js';

export class Arena extends Container {
    static arenaRadius;
    static centerX;
    static centerY;

    constructor(app) {
        super();
        this.app = app;
        
        // Initialize static properties
        Arena.arenaRadius = Math.min(this.app.screen.width, this.app.screen.height) * 0.45 * 0.9;
        Arena.centerX = this.app.screen.width / 2;
        Arena.centerY = this.app.screen.height / 2;
        
        this.draw();
    }

    draw() {
        if (this.children.length > 0) {
            this.removeChildren();
        }

        // Create separate containers for different layers
        this.backgroundLayer = new Container();
        this.gridLayer = new Container();
        this.decorationLayer = new Container();
        this.borderLayer = new Container();

        this.addChild(this.backgroundLayer);
        this.addChild(this.gridLayer);
        this.addChild(this.decorationLayer);
        this.addChild(this.borderLayer);

        this.drawBackground();
        this.drawGrid();
        this.drawDecorations();
        this.drawBorder();
    }

    drawBackground() {
        const graphics = new Graphics();
        this.backgroundLayer.addChild(graphics);
        
        const maxRadius = Math.min(this.app.screen.width, this.app.screen.height) * 0.45;
        Arena.arenaRadius = maxRadius * 0.9;

        // Create a deep space effect with multiple layers
        const spaceColors = [
            { color: 0x000819, position: 0 },
            { color: 0x0a1228, position: 0.3 },
            { color: 0x162038, position: 0.7 },
            { color: 0x0a1228, position: 1 }
        ];

        // Draw the base gradient
        for (let i = 0; i < 30; i++) {
            const ratio = i / 30;
            const currentRadius = maxRadius * (1.2 - ratio * 0.2);
            const spaceColor = this.interpolateColor(spaceColors, ratio);
            
            graphics.lineStyle(0);
            graphics.beginFill(spaceColor, 0.95);
            graphics.drawCircle(Arena.centerX, Arena.centerY, currentRadius);
            graphics.endFill();
        }

        // Add subtle star-like particles
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * maxRadius;
            const x = Arena.centerX + Math.cos(angle) * radius;
            const y = Arena.centerY + Math.sin(angle) * radius;
            const size = Math.random() * 1.5;
            
            graphics.beginFill(0xffffff, 0.1 + Math.random() * 0.2);
            graphics.drawCircle(x, y, size);
            graphics.endFill();
        }
    }

    drawGrid() {
        const graphics = new Graphics();
        this.gridLayer.addChild(graphics);
        
        // Draw hexagonal grid with glow effect
        graphics.lineStyle(1, 0x4444ff, 0.1);
        const hexSize = 50;
        const rows = Math.ceil(Arena.arenaRadius * 2 / (hexSize * Math.sqrt(3)));
        const cols = Math.ceil(Arena.arenaRadius * 2 / hexSize);

        for (let row = -rows; row <= rows; row++) {
            for (let col = -cols; col <= cols; col++) {
                const x = Arena.centerX + col * hexSize + (row % 2) * (hexSize / 2);
                const y = Arena.centerY + row * (hexSize * Math.sqrt(3) / 2);
                
                if (Math.sqrt(Math.pow(x - Arena.centerX, 2) + Math.pow(y - Arena.centerY, 2)) <= Arena.arenaRadius) {
                    this.drawHexagon(graphics, x, y, hexSize / 2);
                }
            }
        }

        // Add circular grid lines
        for (let i = 1; i <= 4; i++) {
            const radius = Arena.arenaRadius * (i / 4);
            graphics.lineStyle(1, 0x4444ff, 0.15);
            graphics.drawCircle(Arena.centerX, Arena.centerY, radius);
        }
    }

    drawDecorations() {
        const graphics = new Graphics();
        this.decorationLayer.addChild(graphics);

        // Draw energy field rings
        for (let i = 0; i < 3; i++) {
            const fieldRadius = Arena.arenaRadius * (0.95 - i * 0.02);
            graphics.lineStyle(2, 0x4444ff, 0.15);
            graphics.drawCircle(Arena.centerX, Arena.centerY, fieldRadius);
        }

        // Add corner decorations
        const corners = [
            { x: -1, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 1 }, { x: 1, y: 1 }
        ];

        corners.forEach(corner => {
            this.drawCornerDecoration(
                graphics,
                Arena.centerX + corner.x * Arena.arenaRadius,
                Arena.centerY + corner.y * Arena.arenaRadius
            );
        });

        // Draw cardinal markers with glow effect
        const markerRadius = Arena.arenaRadius * 1.02;
        const markerSize = 20;
        
        const markers = [
            { x: 0, y: -1 }, // North
            { x: 0, y: 1 },  // South
            { x: 1, y: 0 },  // East
            { x: -1, y: 0 }  // West
        ];

        markers.forEach(marker => {
            const startX = Arena.centerX + marker.x * markerRadius;
            const startY = Arena.centerY + marker.y * markerRadius;
            const endX = Arena.centerX + marker.x * (markerRadius + markerSize);
            const endY = Arena.centerY + marker.y * (markerRadius + markerSize);

            // Glow effect
            graphics.lineStyle(4, 0x4444ff, 0.1);
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);

            // Core line
            graphics.lineStyle(2, 0x6666ff, 0.3);
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
        });
    }

    drawBorder() {
        const graphics = new Graphics();
        this.borderLayer.addChild(graphics);

        // Create a glowing border effect
        const borderColors = [
            { color: 0x4444ff, alpha: 0.4 },
            { color: 0x6666ff, alpha: 0.3 },
            { color: 0x8888ff, alpha: 0.2 }
        ];

        borderColors.forEach((color, i) => {
            const offset = i * 2;
            graphics.lineStyle(3 - i, color.color, color.alpha);
            graphics.drawCircle(Arena.centerX, Arena.centerY, Arena.arenaRadius - offset);
        });
    }

    drawHexagon(graphics, x, y, size) {
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            vertices.push({
                x: x + size * Math.cos(angle),
                y: y + size * Math.sin(angle)
            });
        }
        
        graphics.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            graphics.lineTo(vertices[i].x, vertices[i].y);
        }
        graphics.lineTo(vertices[0].x, vertices[0].y);
    }

    drawCornerDecoration(graphics, x, y) {
        const size = 30;
        
        // Outer glow
        graphics.lineStyle(3, 0x4444ff, 0.1);
        graphics.moveTo(x - size, y);
        graphics.lineTo(x + size, y);
        graphics.moveTo(x, y - size);
        graphics.lineTo(x, y + size);

        // Inner line
        graphics.lineStyle(1, 0x6666ff, 0.3);
        graphics.moveTo(x - size * 0.8, y);
        graphics.lineTo(x + size * 0.8, y);
        graphics.moveTo(x, y - size * 0.8);
        graphics.lineTo(x, y + size * 0.8);
    }

    interpolateColor(gradient, position) {
        if (position <= gradient[0].position) return gradient[0].color;
        if (position >= gradient[gradient.length - 1].position) return gradient[gradient.length - 1].color;

        let i = 0;
        while (gradient[i + 1].position < position) i++;

        const lower = gradient[i];
        const upper = gradient[i + 1];
        const range = upper.position - lower.position;
        const rangePosition = (position - lower.position) / range;

        const r1 = (lower.color >> 16) & 0xff;
        const g1 = (lower.color >> 8) & 0xff;
        const b1 = lower.color & 0xff;

        const r2 = (upper.color >> 16) & 0xff;
        const g2 = (upper.color >> 8) & 0xff;
        const b2 = upper.color & 0xff;

        const r = Math.round(r1 + (r2 - r1) * rangePosition);
        const g = Math.round(g1 + (g2 - g1) * rangePosition);
        const b = Math.round(b1 + (b2 - b1) * rangePosition);

        return (r << 16) | (g << 8) | b;
    }

    resize() {
        // Update static properties
        Arena.arenaRadius = Math.min(this.app.screen.width, this.app.screen.height) * 0.45 * 0.9;
        Arena.centerX = this.app.screen.width / 2;
        Arena.centerY = this.app.screen.height / 2;
        
        // Clear and redraw
        this.removeChildren();
        this.draw();
    }
}