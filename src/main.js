import { Application } from 'pixi.js';
import { Game } from './game.js';
import { StartScreen } from './StartScreen.js';

async function startNewGame(app, selectedWeapon) {
    // Clear previous game if it exists
    if (app.stage.children.length > 0) {
        const oldGame = app.stage.children[0];
        oldGame.destroy();
        app.stage.removeChild(oldGame);
    }

    // Create and start new game
    const game = new Game(app);
    app.stage.addChild(game);
    game.start();
    
    // Select the chosen weapon
    if (selectedWeapon) {
        game.weaponMenu.selectWeapon(selectedWeapon);
    }

    // Handle restart and menu buttons
    const handleRestart = () => {
        game.off('restart', handleRestart);
        game.off('mainMenu', handleMainMenu);
        startNewGame(app, selectedWeapon);
    };

    const handleMainMenu = () => {
        game.off('restart', handleRestart);
        game.off('mainMenu', handleMainMenu);
        game.resetState();
        game.destroy();
        app.stage.removeChild(game);
        showStartScreen(app);
    };

    game.on('restart', handleRestart);
    game.on('mainMenu', handleMainMenu);
}

async function showStartScreen(app) {
    // Clear previous content
    if (app.stage.children.length > 0) {
        const oldContent = app.stage.children[0];
        oldContent.destroy();
        app.stage.removeChild(oldContent);
    }

    // Create and show start screen
    const startScreen = new StartScreen(app);
    app.stage.addChild(startScreen);

    // Listen for weapon selection
    startScreen.on('weaponSelected', (weapon) => {
        startNewGame(app, weapon);
    });
}

async function initGame() {
    const app = new Application();
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1a1a1a,
        resolution: window.devicePixelRatio || 1,
        antialias: true,
        autoDensity: true
    });

    // Make canvas fill the window
    const canvas = app.renderer.canvas;
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';
    document.body.appendChild(canvas);

    // Handle window resize
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        if (app.stage.children.length > 0) {
            const content = app.stage.children[0];
            content.handleResize();
        }
    });

    // Show start screen
    await showStartScreen(app);
}

initGame().catch(error => console.error('Error:', error));