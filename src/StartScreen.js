import { Container, Text, Graphics } from 'pixi.js';

export class StartScreen extends Container {
    constructor(app) {
        super();
        this.app = app;

        // Create background with space effect
        this.createBackground();

        // Create title with enhanced styling
        const title = new Text('KING OF THE ARENA', {
            fontFamily: 'Arial Black',
            fontSize: 84,
            fill: ['#66CCFF', '#3399FF', '#0066FF'], // Enhanced blue gradient
            fillGradientType: 1,
            fillGradientStops: [0, 0.5, 1],
            align: 'center',
            stroke: '#001133',
            strokeThickness: 8,
            dropShadow: true,
            dropShadowColor: '#3399FF',
            dropShadowBlur: 20,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 8,
        });
        title.anchor.set(0.5);
        title.x = app.screen.width / 2;
        title.y = app.screen.height / 3;
        
        // Add title animation
        let titleTime = 0;
        app.ticker.add(() => {
            titleTime += 0.02;
            title.scale.set(1 + Math.sin(titleTime) * 0.02); // Gentle pulsing
            title.style.dropShadowDistance = 8 + Math.sin(titleTime) * 2; // Dynamic shadow
        });
        
        this.addChild(title);

        // Create weapon selection text with enhanced styling
        const weaponText = new Text('Choose Your Weapon:', {
            fontFamily: 'Arial Black',
            fontSize: 42,
            fill: ['#FFFFFF', '#99CCFF'], // White to light blue gradient
            fillGradientType: 1,
            fillGradientStops: [0, 1],
            align: 'center',
            stroke: '#001133',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#3399FF',
            dropShadowBlur: 12,
            dropShadowDistance: 4,
        });
        weaponText.anchor.set(0.5);
        weaponText.x = app.screen.width / 2;
        weaponText.y = app.screen.height / 2;
        
        // Add weapon text animation
        let weaponTextTime = Math.PI / 2; // Offset from title animation
        app.ticker.add(() => {
            weaponTextTime += 0.02;
            weaponText.alpha = 0.8 + Math.sin(weaponTextTime) * 0.2; // Subtle fade pulse
        });
        
        this.addChild(weaponText);

        // Create weapon buttons with enhanced styling
        const weapons = [
            { name: 'Sword', icon: '⚔️' },
            { name: 'Bow', icon: '🏹' },
            { name: 'Trident', icon: '🔱' }
        ];
        const buttonWidth = 220;
        const buttonHeight = 70;
        const buttonSpacing = 40;
        const totalWidth = (buttonWidth + buttonSpacing) * weapons.length - buttonSpacing;
        let startX = (app.screen.width - totalWidth) / 2;

        weapons.forEach((weapon, index) => {
            const button = this.createButton(
                weapon,
                startX + (buttonWidth + buttonSpacing) * index,
                app.screen.height * 0.65,
                buttonWidth,
                buttonHeight
            );
            // Add staggered fade-in animation
            button.alpha = 0;
            setTimeout(() => {
                let fadeIn = 0;
                const fadeInterval = setInterval(() => {
                    fadeIn += 0.05;
                    button.alpha = Math.min(1, fadeIn);
                    if (fadeIn >= 1) clearInterval(fadeInterval);
                }, 20);
            }, 200 * index);
            
            this.addChild(button);
        });

        // Create start instruction text with enhanced styling
        const instructionText = new Text('Select your weapon to begin the battle!', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            fill: ['#FFFFFF', '#99CCFF'], // White to light blue gradient
            fillGradientType: 1,
            fillGradientStops: [0, 1],
            align: 'center',
            stroke: '#001133',
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: '#3399FF',
            dropShadowBlur: 8,
            dropShadowDistance: 3,
        });
        instructionText.anchor.set(0.5);
        instructionText.x = app.screen.width / 2;
        instructionText.y = app.screen.height * 0.85;
        
        // Add instruction text animation
        let instructionTime = Math.PI; // Offset from other animations
        app.ticker.add(() => {
            instructionTime += 0.02;
            instructionText.alpha = 0.8 + Math.sin(instructionTime) * 0.2; // Subtle fade pulse
        });
        
        this.addChild(instructionText);

        // Handle window resize
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    createBackground() {
        const background = new Graphics();
        this.addChild(background);

        // Draw enhanced space background
        const spaceColors = [
            { color: 0x000819, position: 0 },
            { color: 0x001133, position: 0.3 },
            { color: 0x002244, position: 0.7 },
            { color: 0x001133, position: 1 }
        ];

        // Create enhanced gradient background
        for (let i = 0; i < 40; i++) {
            const ratio = i / 40;
            const color = this.interpolateColor(spaceColors, ratio);
            
            background.lineStyle(0);
            background.beginFill(color, 0.97);
            background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
            background.endFill();
        }

        // Add enhanced star particles with varying sizes and brightness
        for (let i = 0; i < 300; i++) {
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            const size = Math.random() * 2;
            const brightness = 0.2 + Math.random() * 0.4;
            
            // Star glow
            background.beginFill(0x99CCFF, brightness * 0.3);
            background.drawCircle(x, y, size * 2);
            background.endFill();
            
            // Star core
            background.beginFill(0xFFFFFF, brightness);
            background.drawCircle(x, y, size);
            background.endFill();
        }

        // Add enhanced hexagonal grid pattern
        background.lineStyle(1, 0x3399FF, 0.15);
        const hexSize = 60;
        const rows = Math.ceil(this.app.screen.height / (hexSize * Math.sqrt(3)));
        const cols = Math.ceil(this.app.screen.width / hexSize);

        for (let row = -1; row <= rows; row++) {
            for (let col = -1; col <= cols; col++) {
                const x = col * hexSize + (row % 2) * (hexSize / 2);
                const y = row * (hexSize * Math.sqrt(3) / 2);
                this.drawHexagon(background, x, y, hexSize / 2);
            }
        }
        
        // Add subtle pulsing to the grid
        let gridTime = 0;
        this.app.ticker.add(() => {
            gridTime += 0.01;
            background.alpha = 0.8 + Math.sin(gridTime) * 0.1;
        });
    }

    createButton(weapon, x, y, width, height) {
        const button = new Container();
        button.x = x;
        button.y = y;

        // Create button background with enhanced glow effect
        const background = new Graphics();
        const glowFilter = new Graphics();
        
        // Outer glow
        background.lineStyle(6, 0x3399FF, 0.3);
        background.beginFill(0x001133, 0.7);
        background.drawRoundedRect(-3, -3, width + 6, height + 6, 20);
        background.endFill();

        // Inner border with gradient
        background.lineStyle(2, 0x66CCFF, 0.5);
        background.beginFill(0x002244, 0.85);
        background.drawRoundedRect(0, 0, width, height, 20);
        background.endFill();

        // Add weapon icon and name
        const buttonContent = new Container();
        buttonContent.x = width / 2;
        buttonContent.y = height / 2;

        const icon = new Text(weapon.icon, {
            fontSize: 32,
            align: 'center',
        });
        icon.anchor.set(0.5);
        icon.x = -50;

        const buttonText = new Text(weapon.name, {
            fontFamily: 'Arial Black',
            fontSize: 32,
            fill: ['#FFFFFF', '#99CCFF'],
            fillGradientType: 1,
            fillGradientStops: [0, 1],
            align: 'center',
            stroke: '#001133',
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: '#3399FF',
            dropShadowBlur: 6,
            dropShadowDistance: 2,
        });
        buttonText.anchor.set(0.5);
        buttonText.x = 20;

        buttonContent.addChild(icon);
        buttonContent.addChild(buttonText);
        
        button.addChild(background);
        button.addChild(buttonContent);

        // Make button interactive
        button.eventMode = 'static';
        button.cursor = 'pointer';

        // Enhanced hover effects
        button.on('pointerover', () => {
            background.clear();
            // Enhanced outer glow on hover
            background.lineStyle(8, 0x66CCFF, 0.4);
            background.beginFill(0x001133, 0.8);
            background.drawRoundedRect(-4, -4, width + 8, height + 8, 20);
            background.endFill();
            // Enhanced inner border
            background.lineStyle(3, 0x99CCFF, 0.6);
            background.beginFill(0x002244, 0.9);
            background.drawRoundedRect(0, 0, width, height, 20);
            background.endFill();
            
            // Scale up slightly
            button.scale.set(1.05);
            buttonContent.scale.set(1.05);
            
            // Brighten text
            buttonText.style.fill = ['#FFFFFF', '#CCFFFF'];
        });

        button.on('pointerout', () => {
            background.clear();
            // Normal outer glow
            background.lineStyle(6, 0x3399FF, 0.3);
            background.beginFill(0x001133, 0.7);
            background.drawRoundedRect(-3, -3, width + 6, height + 6, 20);
            background.endFill();
            // Normal inner border
            background.lineStyle(2, 0x66CCFF, 0.5);
            background.beginFill(0x002244, 0.85);
            background.drawRoundedRect(0, 0, width, height, 20);
            background.endFill();
            
            // Reset scale
            button.scale.set(1);
            buttonContent.scale.set(1);
            
            // Reset text color
            buttonText.style.fill = ['#FFFFFF', '#99CCFF'];
        });

        button.on('pointerdown', () => {
            this.emit('weaponSelected', weapon.name);
            button.scale.set(0.95);
        });

        button.on('pointerup', () => {
            button.scale.set(1.05);
        });

        return button;
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

    handleResize() {
        // Update positions of all elements when window is resized
        const background = this.children[0];
        background.clear();
        this.createBackground();

        const title = this.children[1];
        title.x = this.app.screen.width / 2;
        title.y = this.app.screen.height / 3;

        const weaponText = this.children[2];
        weaponText.x = this.app.screen.width / 2;
        weaponText.y = this.app.screen.height / 2;

        // Update weapon buttons
        const buttonWidth = 220;
        const buttonSpacing = 40;
        const totalWidth = (buttonWidth + buttonSpacing) * 3 - buttonSpacing;
        let startX = (this.app.screen.width - totalWidth) / 2;

        for (let i = 0; i < 3; i++) {
            const button = this.children[i + 3];
            button.x = startX + (buttonWidth + buttonSpacing) * i;
            button.y = this.app.screen.height * 0.65;
        }

        const instructionText = this.children[6];
        instructionText.x = this.app.screen.width / 2;
        instructionText.y = this.app.screen.height * 0.85;
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize);
        super.destroy();
    }
}
