import { Container, Text, Graphics } from 'pixi.js';
import { Player } from './Player.js';
import { WaveManager } from './wave-manager.js';
import { Arena } from './Arena.js';
import { WeaponMenu } from './WeaponMenu.js';

export class Game extends Container {
    constructor(app) {
        super();
        this.app = app;
        
        // Game state
        this.score = 0;
        this.isGameOver = false;
        
        // Input state
        this.keys = {
            'z': false,
            'q': false,
            's': false,
            'd': false,
            'ArrowUp': false,
            'ArrowLeft': false,
            'ArrowDown': false,
            'ArrowRight': false,
            'Space': false
        };
        
        // Create containers
        this.gameObjectsContainer = new Container();
        this.hudContainer = new Container();
        this.addChild(this.gameObjectsContainer);
        this.addChild(this.hudContainer);
        
        // Setup game
        this.setupGame();
        
        // Setup input handlers
        this.setupInputHandlers();
        
        // Start game loop
        this.app.ticker.add(this.update, this);
    }
    
    setupGame() {
        // Create arena
        this.arena = new Arena(this.app);
        this.gameObjectsContainer.addChild(this.arena);
        
        // Create player at arena center
        this.player = new Player(Arena.centerX, Arena.centerY);
        this.gameObjectsContainer.addChild(this.player);
        
        // Create wave manager
        this.waveManager = new WaveManager(this.player);
        this.gameObjectsContainer.addChild(this.waveManager);
        
        // Set up score increment on enemy kill
        this.waveManager.onEnemyKilled = () => {
            this.score += 10;
        };
        
        // Create weapon menu
        this.weaponMenu = new WeaponMenu(this);
        this.hudContainer.addChild(this.weaponMenu);
        
        // Create HUD
        this.setupHUD();
    }
    
    setupHUD() {
        // Create HUD background containers
        const createHUDContainer = (width, height, x, y) => {
            const container = new Container();
            
            // Outer glow effect
            const glow = new Graphics();
            glow.beginFill(0x000000, 0);
            glow.lineStyle(3, 0x666666, 0.2);
            glow.drawRoundedRect(-2, -2, width + 4, height + 4, 12);
            glow.endFill();
            container.addChild(glow);
            
            // Main background
            const background = new Graphics();
            background.beginFill(0x000000, 0.6);
            background.lineStyle(2, 0x444444, 0.9);
            background.drawRoundedRect(0, 0, width, height, 10);
            
            // Add subtle gradient overlay
            const gradientHeight = height / 2;
            background.beginFill(0xFFFFFF, 0.1);
            background.drawRoundedRect(0, 0, width, gradientHeight, 10, 10, 0, 0);
            background.endFill();
            
            container.addChild(background);
            container.x = x;
            container.y = y;
            
            // Add hover effect
            container.eventMode = 'static';
            container.on('pointerover', () => {
                background.clear();
                background.beginFill(0x000000, 0.7);
                background.lineStyle(2, 0x666666, 1);
                background.drawRoundedRect(0, 0, width, height, 10);
                background.beginFill(0xFFFFFF, 0.15);
                background.drawRoundedRect(0, 0, width, gradientHeight, 10, 10, 0, 0);
                background.endFill();
            });
            
            container.on('pointerout', () => {
                background.clear();
                background.beginFill(0x000000, 0.6);
                background.lineStyle(2, 0x444444, 0.9);
                background.drawRoundedRect(0, 0, width, height, 10);
                background.beginFill(0xFFFFFF, 0.1);
                background.drawRoundedRect(0, 0, width, gradientHeight, 10, 10, 0, 0);
                background.endFill();
            });
            
            return container;
        };

        const createIcon = (type) => {
            const icon = new Graphics();
            icon.beginFill(0xFFFFFF);
            
            switch(type) {
                case 'score':
                    // Star shape for score
                    const points = 5;
                    const outerRadius = 10;
                    const innerRadius = 4;
                    const step = Math.PI / points;
                    
                    icon.moveTo(0, -outerRadius);
                    for(let i = 0; i < points * 2; i++) {
                        const radius = i % 2 === 0 ? outerRadius : innerRadius;
                        const angle = i * step - Math.PI / 2;
                        icon.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                    }
                    icon.lineTo(0, -outerRadius);
                    break;
                    
                case 'wave':
                    // Wave symbol
                    icon.lineStyle(2, 0xFFFFFF);
                    icon.beginFill(0x00FFFF, 0);
                    icon.moveTo(0, 8);
                    icon.bezierCurveTo(5, 0, 10, 0, 15, 8);
                    icon.bezierCurveTo(20, 16, 25, 16, 30, 8);
                    break;
            }
            
            icon.endFill();
            return icon;
        };

        const createHeart = (filled = true) => {
            const heart = new Graphics();
            const scale = 0.8;
            
            if (filled) {
                heart.beginFill(0xFF0000);
                heart.lineStyle(2, 0x800000, 1);
            } else {
                heart.beginFill(0x400000, 0.3);
                heart.lineStyle(2, 0x800000, 0.5);
            }
            
            // Draw heart shape
            heart.moveTo(0 * scale, 4 * scale);
            heart.bezierCurveTo(-10 * scale, -8 * scale, -20 * scale, 4 * scale, 0 * scale, 15 * scale);
            heart.bezierCurveTo(20 * scale, 4 * scale, 10 * scale, -8 * scale, 0 * scale, 4 * scale);
            heart.endFill();
            
            // Add subtle gradient overlay for filled hearts
            if (filled) {
                heart.beginFill(0xFFFFFF, 0.3);
                heart.drawCircle(-5 * scale, -2 * scale, 3 * scale); // Highlight
            }
            
            return heart;
        };

        // Constants for positioning
        const PADDING = 20;
        const TOP_MARGIN = 15;
        const CONTAINER_HEIGHT = 45;

        // Score container and text (top right)
        const scoreContainer = createHUDContainer(160, CONTAINER_HEIGHT, 
            this.app.screen.width - 160 - PADDING, TOP_MARGIN);
        const scoreIcon = createIcon('score');
        scoreIcon.x = 15;
        scoreIcon.y = 22;
        scoreContainer.addChild(scoreIcon);
        
        this.scoreText = new Text('', {
            fontFamily: 'Arial Black',
            fontSize: 26,
            fill: ['#FFD700', '#FFA500'],
            fillGradientType: 1,
            fillGradientStops: [0.2, 1],
            stroke: '#000000',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowDistance: 2
        });
        this.scoreText.x = 40;
        this.scoreText.y = 10;
        scoreContainer.addChild(this.scoreText);
        this.hudContainer.addChild(scoreContainer);
        
        // Wave container and text (top center)
        const waveContainer = createHUDContainer(160, CONTAINER_HEIGHT, 
            this.app.screen.width / 2 - 80, TOP_MARGIN);
        const waveIcon = createIcon('wave');
        waveIcon.x = 15;
        waveIcon.y = 22;
        waveContainer.addChild(waveIcon);
        
        this.waveText = new Text('', {
            fontFamily: 'Arial Black',
            fontSize: 26,
            fill: ['#00FFFF', '#0000FF'],
            fillGradientType: 1,
            fillGradientStops: [0.2, 1],
            stroke: '#000000',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowDistance: 2
        });
        this.waveText.x = 40;
        this.waveText.y = 10;
        waveContainer.addChild(this.waveText);
        this.hudContainer.addChild(waveContainer);

        // Lives container with hearts (top left)
        const maxLives = 3;
        const heartSpacing = 30;
        const livesContainer = createHUDContainer(maxLives * heartSpacing + 20, CONTAINER_HEIGHT, 
            PADDING, TOP_MARGIN);
        
        // Create container for hearts
        this.heartsContainer = new Container();
        this.heartsContainer.x = 10;
        this.heartsContainer.y = 12;
        livesContainer.addChild(this.heartsContainer);
        
        // Create initial hearts
        this.hearts = [];
        for (let i = 0; i < maxLives; i++) {
            const heart = createHeart(i < this.player.lives);
            heart.x = i * heartSpacing;
            this.hearts.push(heart);
            this.heartsContainer.addChild(heart);
        }
        
        this.hudContainer.addChild(livesContainer);
    }
    
    setupInputHandlers() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        this.eventMode = 'static';
        this.on('mousedown', this.handleMouseDown, this);
        this.on('mousemove', this.handleMouseMove, this);
    }
    
    handleKeyDown(event) {
        if (event.code === 'Space') {
            this.keys['Space'] = true;
            if (this.player && !this.isGameOver) {
                this.player.startAttack();
            }
        } else if (event.key in this.keys) {
            event.preventDefault();
            this.keys[event.key] = true;
        }
    }
    
    handleKeyUp(event) {
        if (event.code === 'Space') {
            this.keys['Space'] = false;
        } else if (event.key in this.keys) {
            event.preventDefault();
            this.keys[event.key] = false;
        }
    }
    
    handleMouseDown(event) {
        if (this.player && event.button === 0 && !this.isGameOver) {
            this.player.startAttack();
        }
    }
    
    handleMouseMove(event) {
        if (!this.player || this.isGameOver) return;
        
        const mouseX = event.clientX - this.app.view.offsetLeft;
        const mouseY = event.clientY - this.app.view.offsetTop;
        
        this.player.handleMouseMove(mouseX, mouseY);
    }
    
    start() {
        this.isGameOver = false;
        this.score = 0;
        
        if (this.waveManager) {
            this.waveManager.start();
        }
        
        if (this.weaponMenu) {
            this.weaponMenu.selectWeapon('Sword');
        }
    }
    
    update(deltaTime) {
        if (this.isGameOver) return;

        // Update player position based on input
        let dx = 0;
        let dy = 0;

        if (this.keys['z'] || this.keys['ArrowUp']) dy -= this.player.speed;
        if (this.keys['s'] || this.keys['ArrowDown']) dy += this.player.speed;
        if (this.keys['q'] || this.keys['ArrowLeft']) dx -= this.player.speed;
        if (this.keys['d'] || this.keys['ArrowRight']) dx += this.player.speed;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx = dx / length * this.player.speed;
            dy = dy / length * this.player.speed;
        }

        // Calculate new position
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        // Check if new position is within arena bounds
        const distanceFromCenter = Math.sqrt(
            Math.pow(newX - Arena.centerX, 2) + 
            Math.pow(newY - Arena.centerY, 2)
        );

        if (distanceFromCenter <= Arena.arenaRadius - this.player.radius) {
            this.player.x = newX;
            this.player.y = newY;
        }

        // Update game objects
        this.player.update(deltaTime);
        this.waveManager.update(deltaTime);

        // Update HUD
        this.updateHUD();
    }

    updateHUD() {
        if (this.scoreText) {
            this.scoreText.text = `${this.score}`;
        }
        
        // Update hearts
        const maxLives = 3;
        for (let i = 0; i < maxLives; i++) {
            const heart = this.hearts[i];
            if (i < this.player.lives) {
                heart.clear();
                heart.beginFill(0xFF0000);
                heart.lineStyle(2, 0x800000, 1);
                heart.moveTo(0, 4);
                heart.bezierCurveTo(-10, -8, -20, 4, 0, 15);
                heart.bezierCurveTo(20, 4, 10, -8, 0, 4);
                heart.endFill();
                heart.beginFill(0xFFFFFF, 0.3);
                heart.drawCircle(-5, -2, 3); // Highlight
            } else {
                heart.clear();
                heart.beginFill(0x400000, 0.3);
                heart.lineStyle(2, 0x800000, 0.5);
                heart.moveTo(0, 4);
                heart.bezierCurveTo(-10, -8, -20, 4, 0, 15);
                heart.bezierCurveTo(20, 4, 10, -8, 0, 4);
                heart.endFill();
            }
        }
        
        if (this.waveText) {
            this.waveText.text = `${this.waveManager.currentWave}`;
        }

        if (this.player.lives <= 0 && !this.isGameOver) {
            this.gameOver();
        }
    }

    gameOver() {
        this.isGameOver = true;
        
        // Create overlay background with fade in
        const overlay = new Graphics();
        overlay.beginFill(0x000000, 0);
        overlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        overlay.endFill();
        this.hudContainer.addChild(overlay);

        // Create container for game over UI
        const gameOverContainer = new Container();
        this.hudContainer.addChild(gameOverContainer);

        // Main "GAME OVER" text with brighter colors
        const gameOverText = new Text('GAME OVER', {
            fontFamily: 'Arial Black',
            fontSize: 72,
            fill: ['#FF6666', '#FF4444'],
            fillGradientType: 1,
            fillGradientStops: [0, 1],
            align: 'center',
            stroke: '#800000',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#800000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 3,
            dropShadowDistance: 4,
        });
        gameOverText.anchor.set(0.5);
        gameOverText.x = this.app.screen.width / 2;
        gameOverText.y = this.app.screen.height / 3;
        gameOverText.scale.set(0);
        gameOverContainer.addChild(gameOverText);

        // Animate game over text
        const animateText = () => {
            if (!this.isGameOver) return;
            gameOverText.scale.x = Math.min(1, gameOverText.scale.x + 0.1);
            gameOverText.scale.y = Math.min(1, gameOverText.scale.y + 0.1);
            if (gameOverText.scale.x < 1) {
                requestAnimationFrame(animateText);
            }
        };
        requestAnimationFrame(animateText);

        // Final Score Text
        const finalScoreText = new Text(`Final Score: ${this.score}`, {
            fontFamily: 'Arial Black',
            fontSize: 48,
            fill: ['#FFE666', '#FFD700'],
            fillGradientType: 1,
            fillGradientStops: [0, 1],
            align: 'center',
            stroke: '#B8860B',
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: '#B8860B',
            dropShadowBlur: 2,
            dropShadowDistance: 2,
        });
        finalScoreText.anchor.set(0.5);
        finalScoreText.x = this.app.screen.width / 2;
        finalScoreText.y = this.app.screen.height / 2;
        finalScoreText.alpha = 0;
        gameOverContainer.addChild(finalScoreText);

        // Animate score text
        const animateScore = () => {
            if (!this.isGameOver) return;
            finalScoreText.alpha = Math.min(1, finalScoreText.alpha + 0.05);
            if (finalScoreText.alpha < 1) {
                requestAnimationFrame(animateScore);
            }
        };
        setTimeout(() => requestAnimationFrame(animateScore), 500);

        // Create buttons container
        const buttonsContainer = new Container();
        buttonsContainer.x = this.app.screen.width / 2;
        buttonsContainer.y = this.app.screen.height * 0.7;
        buttonsContainer.alpha = 0;
        gameOverContainer.addChild(buttonsContainer);

        // Animate buttons
        const animateButtons = () => {
            if (!this.isGameOver) return;
            buttonsContainer.alpha = Math.min(1, buttonsContainer.alpha + 0.05);
            if (buttonsContainer.alpha < 1) {
                requestAnimationFrame(animateButtons);
            }
        };
        setTimeout(() => requestAnimationFrame(animateButtons), 1000);

        // Create buttons
        const restartButton = this.createButton('Restart', -120, 0, 200, 50);
        restartButton.on('pointerdown', () => {
            this.isGameOver = false;
            this.emit('restart');
        });
        buttonsContainer.addChild(restartButton);

        const menuButton = this.createButton('Main Menu', 120, 0, 200, 50);
        menuButton.on('pointerdown', () => {
            this.isGameOver = false;
            this.emit('mainMenu');
        });
        buttonsContainer.addChild(menuButton);

        // Wave text
        const waveText = new Text(`Wave Reached: ${this.waveManager.currentWave}`, {
            fontFamily: 'Arial Black',
            fontSize: 32,
            fill: ['#99FFFF', '#66CCFF'],
            fillGradientType: 1,
            fillGradientStops: [0, 1],
            align: 'center',
            stroke: '#006699',
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: '#006699',
            dropShadowBlur: 2,
            dropShadowDistance: 2,
        });
        waveText.anchor.set(0.5);
        waveText.x = this.app.screen.width / 2;
        waveText.y = this.app.screen.height * 0.58;
        waveText.alpha = 0;
        gameOverContainer.addChild(waveText);

        // Animate wave text
        const animateWave = () => {
            if (!this.isGameOver) return;
            waveText.alpha = Math.min(1, waveText.alpha + 0.05);
            if (waveText.alpha < 1) {
                requestAnimationFrame(animateWave);
            }
        };
        setTimeout(() => requestAnimationFrame(animateWave), 750);

        // Animate overlay
        const animateOverlay = () => {
            if (!this.isGameOver) return;
            overlay.clear();
            overlay.beginFill(0x000000, Math.min(0.5, overlay.alpha + 0.02));
            overlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
            overlay.endFill();
            
            if (overlay.alpha < 0.5) {
                requestAnimationFrame(animateOverlay);
            }
        };
        requestAnimationFrame(animateOverlay);
    }

    createButton(text, x, y, width, height) {
        const button = new Container();
        button.x = x - width/2;
        button.y = y - height/2;

        // Create button background with gradient
        const background = new Graphics();
        const drawBackground = (isHover = false) => {
            background.clear();
            
            // Main button color with lighter background
            background.lineStyle(3, isHover ? 0xFF9999 : 0xFF6666);
            background.beginFill(0x000000, 0.2);
            background.drawRoundedRect(0, 0, width, height, 15);
            
            // Gradient overlay with brighter highlight
            background.beginFill(0xFFFFFF, isHover ? 0.3 : 0.2);
            background.drawRoundedRect(0, 0, width, height/2, 15, 15, 0, 0);
            background.endFill();
            
            // Bottom highlight
            if (isHover) {
                background.lineStyle(2, 0xFF9999, 0.4);
                background.beginFill(0xFF9999, 0.15);
                background.drawRoundedRect(2, 2, width, height, 15);
                background.endFill();
            }
        };
        
        drawBackground();

        // Create button text with brighter gradient
        const buttonText = new Text(text, {
            fontFamily: 'Arial Black',
            fontSize: 28,
            fill: ['#FFFFFF', '#FFCCCC'],
            fillGradientType: 1,
            fillGradientStops: [0, 1],
            align: 'center',
            stroke: '#FF6666',
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: '#FF6666',
            dropShadowBlur: 2,
            dropShadowDistance: 2
        });
        buttonText.anchor.set(0.5);
        buttonText.x = width / 2;
        buttonText.y = height / 2;

        // Add hover effects
        button.eventMode = 'static';
        button.cursor = 'pointer';
        
        button.on('pointerover', () => {
            drawBackground(true);
            buttonText.style.dropShadowDistance = 3;
            button.scale.set(1.05);
        });
        
        button.on('pointerout', () => {
            drawBackground(false);
            buttonText.style.dropShadowDistance = 2;
            button.scale.set(1);
        });
        
        button.on('pointerdown', () => {
            button.scale.set(0.95);
        });
        
        button.on('pointerup', () => {
            button.scale.set(1.05);
        });

        button.addChild(background);
        button.addChild(buttonText);
        return button;
    }
    
    restart() {
        this.gameObjectsContainer.removeChildren();
        this.hudContainer.removeChildren();
        this.setupGame();
        this.start();
    }
    
    handleResize() {
        const PADDING = 20;
        const TOP_MARGIN = 15;
        
        if (this.arena) {
            this.arena.resize();
        }
        
        if (this.scoreText?.parent) {
            this.scoreText.parent.x = this.app.screen.width - 160 - PADDING;
            this.scoreText.parent.y = TOP_MARGIN;
        }
        
        if (this.heartsContainer?.parent) {
            this.heartsContainer.parent.x = PADDING;
            this.heartsContainer.parent.y = TOP_MARGIN;
        }
        
        if (this.waveText?.parent) {
            this.waveText.parent.x = this.app.screen.width / 2 - 80;
            this.waveText.parent.y = TOP_MARGIN;
        }
    }
    
    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
        window.removeEventListener('keyup', this.handleKeyUp.bind(this));
        
        this.app.ticker.remove(this.update, this);
        
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
        
        if (this.waveManager) {
            this.waveManager.destroy();
            this.waveManager = null;
        }
        
        if (this.weaponMenu) {
            this.weaponMenu.destroy();
            this.weaponMenu = null;
        }
        
        this.gameObjectsContainer.destroy({ children: true });
        this.hudContainer.destroy({ children: true });
        
        super.destroy({ children: true });
    }
    
    resetState() {
        this.isGameOver = false;
        this.score = 0;
        if (this.player) {
            this.player.lives = 3;
        }
        if (this.waveManager) {
            this.waveManager.currentWave = 1;
        }
    }
}
