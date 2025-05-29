import { _decorator, Color, Component, EventTouch, Input, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Circle')
export class Circle extends Component {
    
    @property(Sprite)
    circleSprite: Sprite = null!;
    
    private circleColor: string = '';
    private isTargetColor: boolean = false;
    private lifeTime: number = 3.0;
    private currentLifeTime: number = 0;
    private isDestroyed: boolean = false;

    public onTapped: (isCorrect: boolean) => void = null;

    protected start(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouch, this);

        this.node.setScale(new Vec3(0, 0, 1));
        tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1)})
            .start();
    }

    init(color: string, isTarget: boolean) {
        this.circleColor = color;
        this.isTargetColor = isTarget;
        this.setCircleColor(color);
    }

    updateCircle(deltaTime: number) {
        this.currentLifeTime += deltaTime;
        
        if (this.currentLifeTime > this.lifeTime * 0.7) {
            const alpha = Math.sin(this.currentLifeTime * 10) * 0.5 + 0.5;
            const currentColor = this.circleSprite.color.clone();
            currentColor.a = alpha * 255;
            this.circleSprite.color = currentColor;
        }
    }

    shouldDestroy(): boolean {
        return this.currentLifeTime >= this.lifeTime;
    }

    private onTouch(event: EventTouch) {
        if (this.isDestroyed) return;
        
        this.isDestroyed = true;
        
        tween(this.node)
            .to(0.1, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                if (this.onTapped) {
                    this.onTapped(this.isTargetColor);
                }
            })
            .start();      
    }

    private setCircleColor(colorName: string) {
        if (!this.circleSprite) return;
        
        let color = Color.WHITE;
        switch (colorName) {
            case 'red':
                color = Color.RED;
                break;
            case 'blue':
                color = Color.BLUE;
                break;
            case 'green':
                color = Color.GREEN;
                break;
            case 'yellow':
                color = Color.YELLOW;
                break;
            case 'purple':
                color = new Color(128, 0, 128);
                break;
            default:
                color = Color.WHITE;
        }
        
        this.circleSprite.color = color;
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouch, this);
    }

}