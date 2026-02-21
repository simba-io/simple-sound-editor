import "./EditorView.css";

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

enum PanelColors
{
    BACKGROUND = 0x1c1c1c,
    HANDLE = 0x3c3c3c,
    HOVER = 0x4c4c4c
}

enum PanelConfig
{
    DEFAULT_SIZE = 280,
    MIN_SIZE = 100,
    MAX_SIZE = 800,
    HANDLE_THICKNESS = 8
}

enum CursorType
{
    HORIZONTAL = "ew-resize",
    VERTICAL = "ns-resize"
}

enum CSSClass
{
    CANVAS = "sound-editor-canvas",
    INTERACTIVE = "sound-editor-canvas--interactive"
}

export class SoundEditor
{
    private anchor!: UserPanelAnchor;

    private app?: import("pixi.js").Application;

    private panel?: import("pixi.js").Graphics;

    private resizeHandle?: import("pixi.js").Graphics;

    private panelSize: number = PanelConfig.DEFAULT_SIZE;

    private isDragging: boolean = false;

    constructor(anchor: UserPanelAnchor)
    {
        this.anchor = anchor;

        void this.initializePanel();

        console.log("SoundEditor initialized:\n", `Anchor: ${this.anchor}`);
    }

    private async initializePanel(): Promise<void>
    {
        if (!this.isEnvironmentValid())
        {
            return;
        }

        const { Application, Graphics } = await import("pixi.js");

        this.app = await this.createApplication(Application);
        this.panel = this.createPanel(Graphics);
        this.resizeHandle = this.createResizeHandle(Graphics);

        if (this.app && this.panel && this.resizeHandle)
        {
            this.app.stage.addChild(this.panel);
            this.app.stage.addChild(this.resizeHandle);
        }

        this.applyCanvasStyles();
        this.setupEventListeners();
        this.drawPanel();
    }

    private isEnvironmentValid(): boolean
    {
        return typeof window !== "undefined" && typeof document !== "undefined";
    }

    private async createApplication(Application: any): Promise<any>
    {
        const app = new Application();
        
        await app.init({
            resizeTo: window,
            backgroundAlpha: 0,
            antialias: true
        });

        document.body.appendChild(app.canvas);
        
        return app;
    }

    private createPanel(Graphics: any): any
    {
        return new Graphics();
    }

    private createResizeHandle(Graphics: any): any
    {
        const handle = new Graphics();
        handle.eventMode = "static";
        handle.cursor = this.getCursorType();
        return handle;
    }

    private applyCanvasStyles(): void
    {
        if (!this.app?.canvas)
        {
            return;
        }

        this.app.canvas.classList.add(CSSClass.CANVAS);
    }

    private setupEventListeners(): void
    {
        window.addEventListener("resize", this.drawPanel);
        window.addEventListener("pointermove", this.onPointerMove);
        window.addEventListener("pointerup", this.onPointerUp);

        this.resizeHandle?.on("pointerdown", this.onPointerDown);
    }

    private getCursorType(): string
    {
        return this.isHorizontalPanel() ? CursorType.VERTICAL : CursorType.HORIZONTAL;
    }

    private isHorizontalPanel(): boolean
    {
        return this.anchor === UserPanelAnchor.TOP || this.anchor === UserPanelAnchor.BOTTOM;
    }

    private onPointerDown = (event: any): void =>
    {
        this.isDragging = true;
        event.stopPropagation();
    };

    private onPointerMove = (event: PointerEvent): void =>
    {
        if (!this.isDragging)
        {
            return;
        }

        this.updatePanelSize(event);
        this.drawPanel();
    };

    private onPointerUp = (): void =>
    {
        this.isDragging = false;
    };

    private updatePanelSize(event: PointerEvent): void
    {
        const { innerWidth: width, innerHeight: height } = window;
        const { clientX, clientY } = event;

        let newSize: number;

        switch (this.anchor)
        {
            case UserPanelAnchor.LEFT:
                newSize = clientX;
                break;
            case UserPanelAnchor.RIGHT:
                newSize = width - clientX;
                break;
            case UserPanelAnchor.TOP:
                newSize = clientY;
                break;
            case UserPanelAnchor.BOTTOM:
                newSize = height - clientY;
                break;
            default:
                newSize = this.panelSize;
        }

        this.panelSize = this.clampPanelSize(newSize);
    }

    private clampPanelSize(size: number): number
    {
        return Math.max(PanelConfig.MIN_SIZE, Math.min(PanelConfig.MAX_SIZE, size));
    }

    private drawPanel = (): void =>
    {
        if (!this.panel || !this.resizeHandle)
        {
            return;
        }

        const { innerWidth: width, innerHeight: height } = window;

        this.drawPanelBackground(width, height);
        this.drawResizeHandle(width, height);
    };

    private drawPanelBackground(width: number, height: number): void
    {
        if (!this.panel)
        {
            return;
        }

        this.panel.clear();
        this.panel.beginFill(PanelColors.BACKGROUND, 0.92);

        const rect = this.getPanelRect(width, height);
        this.panel.drawRect(rect.x, rect.y, rect.width, rect.height);
        this.panel.endFill();
    }

    private drawResizeHandle(width: number, height: number): void
    {
        if (!this.resizeHandle)
        {
            return;
        }

        this.resizeHandle.clear();
        this.resizeHandle.beginFill(PanelColors.HANDLE, 1.0);

        const rect = this.getHandleRect(width, height);
        this.resizeHandle.drawRect(rect.x, rect.y, rect.width, rect.height);
        this.resizeHandle.endFill();
    }

    private getPanelRect(width: number, height: number): { x: number; y: number; width: number; height: number }
    {
        switch (this.anchor)
        {
            case UserPanelAnchor.LEFT:
                return { x: 0, y: 0, width: this.panelSize, height };
            case UserPanelAnchor.RIGHT:
                return { x: width - this.panelSize, y: 0, width: this.panelSize, height };
            case UserPanelAnchor.TOP:
                return { x: 0, y: 0, width, height: this.panelSize };
            case UserPanelAnchor.BOTTOM:
                return { x: 0, y: height - this.panelSize, width, height: this.panelSize };
            default:
                return { x: 0, y: 0, width: this.panelSize, height };
        }
    }

    private getHandleRect(width: number, height: number): { x: number; y: number; width: number; height: number }
    {
        const thickness = PanelConfig.HANDLE_THICKNESS;
        const offset = thickness / 2;

        switch (this.anchor)
        {
            case UserPanelAnchor.LEFT:
                return { x: this.panelSize - offset, y: 0, width: thickness, height };
            case UserPanelAnchor.RIGHT:
                return { x: width - this.panelSize - offset, y: 0, width: thickness, height };
            case UserPanelAnchor.TOP:
                return { x: 0, y: this.panelSize - offset, width, height: thickness };
            case UserPanelAnchor.BOTTOM:
                return { x: 0, y: height - this.panelSize - offset, width, height: thickness };
            default:
                return { x: this.panelSize - offset, y: 0, width: thickness, height };
        }
    }

    public destroy(): void
    {
        window.removeEventListener("resize", this.drawPanel);
        window.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerup", this.onPointerUp);

        this.resizeHandle?.off("pointerdown", this.onPointerDown);

        if (this.app)
        {
            this.app.destroy(true);
            delete (this as any).app;
        }
        
        delete (this as any).panel;
        delete (this as any).resizeHandle;
    }
}