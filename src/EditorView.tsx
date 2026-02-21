export enum SoundManagerMode
{
    DEV = "dev",
    PROD = "prod"
}

export enum UserPanelState
{
    MINIMIZED,
    EXPANDED
}

export enum UserPanelAnchor
{
    TOP = "top",
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right"
}

export class SoundEditor
{
    private anchor!: UserPanelAnchor;

    private app?: import("pixi.js").Application;

    private panel?: import("pixi.js").Graphics;

    private readonly panelSize = 280;

    constructor(anchor: UserPanelAnchor)
    {
        this.anchor = anchor;

        void this.initializePanel();

        console.log("SoundEditor initialized:\n", `Anchor: ${this.anchor}`);
    }

    private async initializePanel(): Promise<void>
    {
        if (typeof window === "undefined" || typeof document === "undefined")
        {
            return;
        }

        const { Application, Graphics } = await import("pixi.js");

        const app = new Application();

        await app.init({
            resizeTo: window,
            backgroundAlpha: 0,
            antialias: true
        });

        app.canvas.style.position = "fixed";
        app.canvas.style.top = "0";
        app.canvas.style.left = "0";
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";
        app.canvas.style.zIndex = "9999";

        document.body.appendChild(app.canvas);

        const panel = new Graphics();

        app.stage.addChild(panel);

        this.app = app;
        this.panel = panel;

        this.drawPanel();

        window.addEventListener("resize", this.drawPanel);
    }

    private drawPanel = (): void =>
    {
        if (!this.panel)
        {
            return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.panel.clear();
        this.panel.beginFill(0x1c1c1c, 0.92);

        switch (this.anchor)
        {
            case UserPanelAnchor.LEFT:
                this.panel.drawRect(0, 0, this.panelSize, height);
                break;
            case UserPanelAnchor.RIGHT:
                this.panel.drawRect(width - this.panelSize, 0, this.panelSize, height);
                break;
            case UserPanelAnchor.TOP:
                this.panel.drawRect(0, 0, width, this.panelSize);
                break;
            case UserPanelAnchor.BOTTOM:
                this.panel.drawRect(0, height - this.panelSize, width, this.panelSize);
                break;
            default:
                this.panel.drawRect(0, 0, this.panelSize, height);
                break;
        }

        this.panel.endFill();
    };
}