import "./EditorView.css";
/** @internal */
export declare enum SoundManagerMode {
    DEV = "dev",
    PROD = "prod"
}
/** @internal */
export declare enum UserPanelState {
    MINIMIZED = 0,
    EXPANDED = 1
}
/** @internal */
export declare enum UserPanelAnchor {
    TOP = "top",
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right"
}
/** @internal */
export declare class SoundEditor {
    private anchor;
    private app?;
    private panel?;
    private resizeHandle?;
    private panelSize;
    private isDragging;
    constructor(anchor: UserPanelAnchor);
    private initializePanel;
    private isEnvironmentValid;
    private createApplication;
    private createPanel;
    private createResizeHandle;
    private applyCanvasStyles;
    private setupEventListeners;
    private getCursorType;
    private isHorizontalPanel;
    private onPointerDown;
    private onPointerMove;
    private onPointerUp;
    private updatePanelSize;
    private clampPanelSize;
    private drawPanel;
    private drawPanelBackground;
    private drawResizeHandle;
    private getPanelRect;
    private getHandleRect;
    destroy(): void;
}
//# sourceMappingURL=EditorView.d.ts.map