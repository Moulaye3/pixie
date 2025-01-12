import { Container, Graphics, Text } from 'pixi.js';
import { Sword } from './weapons/sword.js';
import { Bow } from './weapons/bow.js';
import { Trident } from './weapons/trident.js';

export class WeaponMenu extends Container {
    constructor(game) {
        super();
        this.game = game;
        

        // Track selected weapon
        this.selectedWeapon = null;
        this.buttons = new Map(); // Store button references
        
        // Create menu items
        this.createMenu();
        
        // Select default weapon
        this.selectWeapon('Sword');
    }
    
    createMenu() {
        // Create menu background with border
        const background = new Graphics();
        
        // Draw shadow
        background.beginFill(0x000000, 0.4);
        background.drawRoundedRect(2, 2, this.menuWidth, 170, 10);  
        background.endFill();
        
        // Draw main background
        background.beginFill(0x000000, 0.6);
        background.lineStyle(2, 0x333333);
        background.drawRoundedRect(0, 0, this.menuWidth, 170, 10);  
        background.endFill();
        
        this.addChild(background);
        
        // Title with better styling
        const title = new Text('WEAPONS', {
            fontFamily: 'Arial',
            fontSize: 18,
            fontWeight: 'bold',
            fill: 0xffffff,
            stroke: '#000000',
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowDistance: 2
        });
        title.x = this.menuWidth / 2 - title.width / 2;
        title.y = 15;
        this.addChild(title);
        
      
    }
    
    createWeaponButton(weaponName, x, y, color) {
        const button = new Container();
        button.x = x;
        button.y = y;
        
        // Store button reference
        this.buttons.set(weaponName, button);
        
        // Button background
        const background = new Graphics();
        this.updateButtonStyle(background, false, color);
        button.addChild(background);
        
        // Create weapon icon
        const icon = new Graphics();
        if (weaponName === 'Sword') {
            // Draw sword icon
            icon.lineStyle(2, color);
            icon.moveTo(0, 0);
            icon.lineTo(10, 10);
            icon.lineTo(0, 20);
        } else if (weaponName === 'Bow') {
            // Draw bow icon
            icon.lineStyle(2, color);
            icon.arc(5, 10, 10, -Math.PI/3, Math.PI/3);
            icon.moveTo(5, 0);
            icon.lineTo(5, 20);
        } else if (weaponName === 'Trident') {
            // Draw trident icon
            icon.lineStyle(2, color);
            // Handle
            icon.moveTo(5, 20);
            icon.lineTo(5, 5);
            // Prongs
            icon.moveTo(0, 5);  // Left prong
            icon.lineTo(5, 0);
            icon.moveTo(5, 5);  // Middle prong
            icon.lineTo(5, 0);
            icon.moveTo(10, 5); // Right prong
            icon.lineTo(5, 0);
        }
        icon.x = 15;
        icon.y = 5;
        button.addChild(icon);
        
        // Button text with style
        const text = new Text(weaponName, {
            fontFamily: 'Arial',
            fontSize: 16,
            fontWeight: 'bold',
            fill: 0xffffff,
            stroke: '#000000',
            strokeThickness: 1,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 2,
            dropShadowDistance: 1
        });
        text.x = 40;
        text.y = 10;
        button.addChild(text);
        
        // Make button interactive
        button.eventMode = 'static';
        button.cursor = 'pointer';
        
        // Add hover effect
        button.on('pointerover', () => {
            if (weaponName !== this.selectedWeapon) {
                this.updateButtonStyle(background, false, color, true);
                button.scale.set(1.05);
            }
        });
        
        button.on('pointerout', () => {
            if (weaponName !== this.selectedWeapon) {
                this.updateButtonStyle(background, false, color, false);
                button.scale.set(1);
            }
        });
        
        // Add click handler with visual feedback
        button.on('pointerdown', () => {
            if (weaponName !== this.selectedWeapon) {
                button.scale.set(0.95);
                setTimeout(() => button.scale.set(1), 100);
                this.selectWeapon(weaponName);
            }
        });
        
        this.addChild(button);
    }
    
    updateButtonStyle(graphics, isSelected, color, isHovered = false) {
        graphics.clear();
        
        // Button shadow
        graphics.beginFill(0x000000, 0.3);
        graphics.drawRoundedRect(2, 2, this.menuWidth - 20, this.buttonHeight, 8);
        graphics.endFill();
        
        // Button fill
        const fillColor = isSelected ? color : (isHovered ? 0x444444 : 0x333333);
        graphics.beginFill(fillColor, isSelected ? 0.3 : 0.8);
        graphics.lineStyle(2, isSelected ? color : 0x444444);
        graphics.drawRoundedRect(0, 0, this.menuWidth - 20, this.buttonHeight, 8);
        graphics.endFill();
        
        // Add shine effect if selected
        if (isSelected) {
            graphics.lineStyle(1, 0xffffff, 0.2);
            graphics.moveTo(5, 5);
            graphics.lineTo(this.menuWidth - 30, 5);
            
            // Add glow effect
            graphics.beginFill(color, 0.1);
            graphics.drawRoundedRect(-2, -2, this.menuWidth - 16, this.buttonHeight + 4, 8);
            graphics.endFill();
        }
    }
    
    selectWeapon(weaponName) {
        // Update button styles
        const oldWeapon = this.selectedWeapon;
        if (oldWeapon) {
            const oldButton = this.buttons.get(oldWeapon);
            if (oldButton) {
                this.updateButtonStyle(oldButton.getChildAt(0), false, oldWeapon === 'Sword' ? 0xff4444 : oldWeapon === 'Bow' ? 0x0088ff : 0x00ffff);
                oldButton.scale.set(1);
            }
        }
        
        const newButton = this.buttons.get(weaponName);
        if (newButton) {
            this.updateButtonStyle(newButton.getChildAt(0), true, weaponName === 'Sword' ? 0xff4444 : weaponName === 'Bow' ? 0x0088ff : 0x00ffff);
            newButton.scale.set(1.05);
        }
        
        this.selectedWeapon = weaponName;
        
        // Create new weapon instance
        if (this.game.player) {
            let weapon;
            if (this.game.player.weapon) {
                this.game.player.weapon.destroy();
            }
            
            switch (weaponName) {
                case 'Sword':
                    weapon = new Sword(this.game.player);
                    break;
                case 'Bow':
                    weapon = new Bow(this.game.player);
                    break;
                case 'Trident':
                    weapon = new Trident(this.game.player);
                    break;
                default:
                    console.error('Unknown weapon:', weaponName);
                    return;
            }
            
            this.game.player.weapon = weapon;
        }
    }
    
    destroy() {
        // Clean up button references
        this.buttons.clear();
        
        // Destroy all children
        this.children.forEach(child => {
            if (child instanceof Container) {
                child.destroy({ children: true });
            }
        });
        
        super.destroy({ children: true });
    }
}
