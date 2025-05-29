import { _decorator, Component, Node, Prefab, instantiate, Vec3, randomRange, UITransform } from 'cc';
import { Circle } from './Circle';
import { UIManager } from './UIManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    circlePrefab: Prefab = null!;
    
    @property(Node)
    gameArea: Node = null!;
    
    @property(UIManager)
    uiManager: UIManager = null!;
    
    private gameTime: number = 60;
    private currentTime: number = 0;
    private score: number = 0;
    private isGameActive: boolean = false;
    
    private colors: string[] = ['red', 'blue', 'green', 'yellow', 'purple'];
    private targetColor: string = 'red';
    
    private spawnInterval: number = 1.0;
    private spawnTimer: number = 0;
    private circles: Circle[] = [];
    
    private spawnBounds = {
        minX: -250,
        maxX: 250,
        minY: -400,
        maxY: 400
    };

    start() {
        if (this.uiManager) {
            this.uiManager.onRestartCallback = () => {
                this.restartGame();
            };
        }

        this.startGame();
    }

    update(deltaTime: number) {
        if (!this.isGameActive) return;
        
        this.currentTime += deltaTime;
        this.uiManager.updateTime(this.gameTime - this.currentTime);
        
        if (this.currentTime >= this.gameTime) {
            this.endGame();
            return;
        }
        
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnCircle();
            this.spawnTimer = 0;

            if (this.spawnInterval > 0.3) {
                this.spawnInterval -= 0.01;
            }
        }

        for (let i = this.circles.length - 1; i >= 0; i--) {
            const circle = this.circles[i];
            if (circle && circle.isValid) {
                circle.updateCircle(deltaTime);
                if (circle.shouldDestroy()) {
                    this.removeCircle(i);
                }
            }
        }
    }

    startGame() {
        this.isGameActive = true;
        this.currentTime = 0;
        this.score = 0;
        this.spawnInterval = 1.0;
        this.targetColor = this.getRandomColor();
        
        this.uiManager.updateScore(this.score);
        this.uiManager.updateTime(this.gameTime);
        this.uiManager.updateTargetColor(this.targetColor);
        this.uiManager.showGame();
        
        this.clearAllCircles();
    }

    endGame() {
        this.isGameActive = false;
        this.clearAllCircles();
        this.uiManager.showGameOver(this.score);
    }

    restartGame() {
        this.startGame();
    }

    spawnCircle() {
        if (!this.circlePrefab || !this.gameArea) return;
        
        const circleNode = instantiate(this.circlePrefab);
        const circle = circleNode.getComponent(Circle);
        
        if (circle) {
            const x = randomRange(this.spawnBounds.minX, this.spawnBounds.maxX);
            const y = randomRange(this.spawnBounds.minY, this.spawnBounds.maxY);
            circleNode.setPosition(new Vec3(x, y, 0));
            
            const color = this.getRandomColor();
            circle.init(color, this.targetColor === color);
            
            circle.onTapped = (isCorrect: boolean) => {
                this.onCircleTapped(isCorrect);
            };
            
            this.gameArea.addChild(circleNode);
            this.circles.push(circle);
        }
    }

    onCircleTapped(isCorrect: boolean) {
        if (isCorrect) {
            this.score += 10;
            this.uiManager.updateScore(this.score);
            
            if (Math.random() < 0.3) {
                this.targetColor = this.getRandomColor();
                this.uiManager.updateTargetColor(this.targetColor);
            }
        } else {
            this.score = Math.max(0, this.score - 5);
            this.uiManager.updateScore(this.score);
        }
    }

    removeCircle(index: number) {
        if (index >= 0 && index < this.circles.length) {
            const circle = this.circles[index];
            if (circle && circle.node && circle.node.isValid) {
                circle.node.destroy();
            }
            this.circles.splice(index, 1);
        }
    }

    clearAllCircles() {
        for (const circle of this.circles) {
            if (circle && circle.node && circle.node.isValid) {
                circle.node.destroy();
            }
        }
        this.circles = [];
    }

    getRandomColor(): string {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}