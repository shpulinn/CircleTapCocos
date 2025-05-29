import { _decorator, Component, Label, Node, Button, Color, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property(Label)
    scoreLabel: Label = null!;
    
    @property(Label)
    timeLabel: Label = null!;
    
    @property(Label)
    targetColorLabel: Label = null!;
    
    @property(Node)
    gameOverPanel: Node = null!;
    
    @property(Label)
    finalScoreLabel: Label = null!;
    
    @property(Button)
    restartButton: Button = null!;
    
    public onRestartCallback: () => void = null;

    start() {
        if (this.restartButton) {
            this.restartButton.node.on(Button.EventType.CLICK, this.onRestartClick, this);
        }
        
        this.showGame();
    }

    updateScore(score: number) {
        if (this.scoreLabel) {
            this.scoreLabel.string = `SCORE:\n${score}`;
        }
    }

    updateTime(timeLeft: number) {
        if (this.timeLabel) {
            const seconds = Math.max(0, Math.ceil(timeLeft));
            this.timeLabel.string = `TIME:\n${seconds}`;
        }
    }

    updateTargetColor(color: string) {
        if (this.targetColorLabel) {
            this.targetColorLabel.string = `TAP: ${this.getColorNameRu(color)}`;
            this.targetColorLabel.color = this.getColorByName(color);
            tween(this.targetColorLabel.node)
                .to(0.3, { scale: new Vec3(1.2, 1.2, 1) })
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .start();
        }
    }

    private getColorByName(colorName: string): Color {
        switch (colorName) {
            case 'red':
                return Color.RED;
            case 'blue':
                return Color.BLUE;
            case 'green':
                return Color.GREEN;
            case 'yellow':
                return Color.YELLOW;
            case 'purple':
                return new Color(128, 0, 128);
            default:
                return Color.WHITE;
        }
    }

    showGame() {
        if (this.gameOverPanel) {
            this.gameOverPanel.active = false;
        }
    }

    showGameOver(finalScore: number) {
        if (this.gameOverPanel) {
            this.gameOverPanel.active = true;
        }
        
        if (this.finalScoreLabel) {
            this.finalScoreLabel.string = `YOU SCORED:\n${finalScore}`;
        }
    }

    private onRestartClick() {
        if (this.onRestartCallback) {
            this.onRestartCallback();
        }
    }

    private getColorNameRu(color: string): string {
        const colorNames = {
            'red': 'RED',
            'blue': 'BLUE',
            'green': 'GREEN',
            'yellow': 'YELLOW',
            'purple': 'PURPLE'
        };
        return colorNames[color] || color.toUpperCase();
    }

    onDestroy() {
        if (this.restartButton) {
            this.restartButton.node.off(Button.EventType.CLICK, this.onRestartClick, this);
        }
    }
}