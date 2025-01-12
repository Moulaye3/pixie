import { Container, Graphics } from 'pixi.js';
import { Arena } from './Arena.js';

/**
 * Manages the spawning and updating of enemies in the game.
 */
export class WaveManager extends Container {
    /**
     * @param {PIXI.Sprite} player
     */
    constructor(player) {
        super();
        this.player = player;
        this.enemies = [];
        this.currentWave = 1;
        this.enemiesPerWave = 50;
        this.enemiesSpawned = 10;
        this.onEnemyKilled = null; // Callback for when enemy is killed
        this.spawnTimer = 0;
        this.spawnDelay = 500; // 2 seconds between spawns
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // Update every 16ms (60fps)
        this.tankMobCounter = 0; // Counter for spawning tank mobs
    }

    /**
     * Initializes the WaveManager with the game application.
     */
    init() {
        // Reset state
        this.enemies = [];
        this.currentWave = 1;
        this.enemiesSpawned = 0;
        this.spawnTimer = Date.now();
        
        // Clear existing enemies
        this.removeChildren();
    }

    start() {
        this.init();
    }

    /**
     * Updates the WaveManager state, spawning new enemies and updating existing ones.
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        const now = Date.now();
        
        // Only update every 16ms
        if (now - this.lastUpdateTime < this.updateInterval) {
            return;
        }
        this.lastUpdateTime = now;
        
        // Check if it's time to spawn a new enemy
        if (this.enemiesSpawned < this.enemiesPerWave * this.currentWave && 
            now - this.spawnTimer >= this.spawnDelay) {
            this.spawnEnemy();
            this.spawnTimer = now;
            this.enemiesSpawned++;
        }

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Move enemy towards player
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                const speed = 5;
                enemy.x += (dx / distance) * speed;
                enemy.y += (dy / distance) * speed;
            }
            
            // Check for player attack hits
            const attackHitboxes = this.player.getAttackHitbox();
            if (attackHitboxes) {
                // Handle both single hitbox and array of hitboxes
                const hitboxArray = Array.isArray(attackHitboxes) ? attackHitboxes : [attackHitboxes];
                
                // Check collision with any hitbox
                const isHit = hitboxArray.some(hitbox => {
                    const hitDx = enemy.x - hitbox.x;
                    const hitDy = enemy.y - hitbox.y;
                    const hitDistance = Math.sqrt(hitDx * hitDx + hitDy * hitDy);
                    return hitDistance < enemy.radius + hitbox.width/2;
                });

                if (isHit) {
                    enemy.destroy();
                    this.enemies.splice(i, 1);
                    
                    // Call the onEnemyKilled callback if it exists
                    if (this.onEnemyKilled) {
                        this.onEnemyKilled();
                    }
                    continue;
                }
            }

            // Check player collision
            const playerDx = enemy.x - this.player.x;
            const playerDy = enemy.y - this.player.y;
            const playerDistance = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
            
            if (playerDistance < enemy.radius + this.player.radius) {
                this.player.takeDamage();
            }
        }
        
        // Check if wave is complete
        if (this.enemies.length === 0 && this.enemiesSpawned >= this.enemiesPerWave * this.currentWave) {
            this.currentWave++;
            this.enemiesSpawned = 5;
            this.spawnTimer = now;
        }
    }

    /**
     * Spawns a new enemy at a random point on the arena border.
     */
    spawnEnemy() {
        // Calculate spawn position on arena border
        const angle = Math.random() * Math.PI * 2;
        const spawnRadius = 400; // Spawn just outside the arena
        const x = Arena.centerX + Math.cos(angle) * spawnRadius;
        const y = Arena.centerY + Math.sin(angle) * spawnRadius;

        // Every 10th mob, spawn 3 tank mobs
        if (this.tankMobCounter >= 10) {
            this.tankMobCounter = 0;
            for (let i = 0; i < 3; i++) {
                const tankAngle = angle + (i * Math.PI * 2 / 3); // Spread them out evenly
                const tankX = Arena.centerX + Math.cos(tankAngle) * spawnRadius;
                const tankY = Arena.centerY + Math.sin(tankAngle) * spawnRadius;
                
                const tankMob = new Container();
                const tankGraphics = new Graphics();
                tankGraphics.beginFill(0x8800FF); // Purple color
                tankGraphics.drawCircle(0, 0, 25); // Radius 25
                tankGraphics.endFill();
                
                // Add glow effect
                tankGraphics.beginFill(0x8800FF, 0.3);
                tankGraphics.drawCircle(0, 0, 30);
                tankGraphics.endFill();
                
                tankMob.addChild(tankGraphics);
                tankMob.x = tankX;
                tankMob.y = tankY;
                tankMob.radius = 25;
                tankMob.health = 200; // Takes 2 hits to die
                
                this.addChild(tankMob);
                this.enemies.push(tankMob);
            }
        } else {
            // Spawn regular mob
            const enemy = new Container();
            const graphics = new Graphics();
            graphics.beginFill(0xff4757); // Red color
            graphics.drawCircle(0, 0, 15); // Radius 15
            graphics.endFill();
            
            // Add glow effect
            graphics.beginFill(0xff4757, 0.3);
            graphics.drawCircle(0, 0, 20);
            graphics.endFill();
            
            enemy.addChild(graphics);
            enemy.x = x;
            enemy.y = y;
            enemy.radius = 15;
            
            this.addChild(enemy);
            this.enemies.push(enemy);
            this.tankMobCounter++;
        }
    }

    /**
     * Handle collision between player and enemy
     * @param {PIXI.Sprite} enemy
     */
    handleCollision(enemy) {
        if (!this.player.isInvulnerable) {
            this.player.lives--;
            if (this.player.lives > 0) {
                // Make player invulnerable briefly
                this.player.isInvulnerable = true;
                setTimeout(() => {
                    this.player.isInvulnerable = false;
                }, 1000);
            }
        }
    }

    /**
     * Destroys the WaveManager, cleaning up all enemies and resources.
     */
    destroy() {
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];
        super.destroy({ children: true });
    }
}
