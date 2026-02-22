"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundEditor = exports.UserPanelAnchor = exports.UserPanelState = exports.SoundManagerMode = void 0;
require("./EditorView.css");
/** @internal */
var SoundManagerMode;
(function (SoundManagerMode) {
    SoundManagerMode["DEV"] = "dev";
    SoundManagerMode["PROD"] = "prod";
})(SoundManagerMode || (exports.SoundManagerMode = SoundManagerMode = {}));
/** @internal */
var UserPanelState;
(function (UserPanelState) {
    UserPanelState[UserPanelState["MINIMIZED"] = 0] = "MINIMIZED";
    UserPanelState[UserPanelState["EXPANDED"] = 1] = "EXPANDED";
})(UserPanelState || (exports.UserPanelState = UserPanelState = {}));
/** @internal */
var UserPanelAnchor;
(function (UserPanelAnchor) {
    UserPanelAnchor["TOP"] = "top";
    UserPanelAnchor["BOTTOM"] = "bottom";
    UserPanelAnchor["LEFT"] = "left";
    UserPanelAnchor["RIGHT"] = "right";
})(UserPanelAnchor || (exports.UserPanelAnchor = UserPanelAnchor = {}));
var PanelColors;
(function (PanelColors) {
    PanelColors[PanelColors["BACKGROUND"] = 1842204] = "BACKGROUND";
    PanelColors[PanelColors["HANDLE"] = 3947580] = "HANDLE";
    PanelColors[PanelColors["HOVER"] = 5000268] = "HOVER";
})(PanelColors || (PanelColors = {}));
var PanelConfig;
(function (PanelConfig) {
    PanelConfig[PanelConfig["DEFAULT_SIZE"] = 280] = "DEFAULT_SIZE";
    PanelConfig[PanelConfig["MIN_SIZE"] = 100] = "MIN_SIZE";
    PanelConfig[PanelConfig["MAX_SIZE"] = 800] = "MAX_SIZE";
    PanelConfig[PanelConfig["HANDLE_THICKNESS"] = 8] = "HANDLE_THICKNESS";
})(PanelConfig || (PanelConfig = {}));
var CursorType;
(function (CursorType) {
    CursorType["HORIZONTAL"] = "ew-resize";
    CursorType["VERTICAL"] = "ns-resize";
})(CursorType || (CursorType = {}));
var CSSClass;
(function (CSSClass) {
    CSSClass["CANVAS"] = "sound-editor-canvas";
    CSSClass["INTERACTIVE"] = "sound-editor-canvas--interactive";
})(CSSClass || (CSSClass = {}));
/** @internal */
class SoundEditor {
    anchor;
    app;
    panel;
    resizeHandle;
    panelSize = PanelConfig.DEFAULT_SIZE;
    isDragging = false;
    constructor(anchor) {
        this.anchor = anchor;
        void this.initializePanel();
        console.log("SoundEditor initialized:\n", `Anchor: ${this.anchor}`);
    }
    async initializePanel() {
        if (!this.isEnvironmentValid()) {
            return;
        }
        const { Application, Graphics } = await import("pixi.js");
        this.app = await this.createApplication(Application);
        this.panel = this.createPanel(Graphics);
        this.resizeHandle = this.createResizeHandle(Graphics);
        if (this.app && this.panel && this.resizeHandle) {
            this.app.stage.addChild(this.panel);
            this.app.stage.addChild(this.resizeHandle);
        }
        this.applyCanvasStyles();
        this.setupEventListeners();
        this.drawPanel();
    }
    isEnvironmentValid() {
        return typeof window !== "undefined" && typeof document !== "undefined";
    }
    async createApplication(Application) {
        const app = new Application();
        await app.init({
            resizeTo: window,
            backgroundAlpha: 0,
            antialias: true
        });
        document.body.appendChild(app.canvas);
        return app;
    }
    createPanel(Graphics) {
        return new Graphics();
    }
    createResizeHandle(Graphics) {
        const handle = new Graphics();
        handle.eventMode = "static";
        handle.cursor = this.getCursorType();
        return handle;
    }
    applyCanvasStyles() {
        if (!this.app?.canvas) {
            return;
        }
        this.app.canvas.classList.add(CSSClass.CANVAS);
    }
    setupEventListeners() {
        window.addEventListener("resize", this.drawPanel);
        window.addEventListener("pointermove", this.onPointerMove);
        window.addEventListener("pointerup", this.onPointerUp);
        this.resizeHandle?.on("pointerdown", this.onPointerDown);
    }
    getCursorType() {
        return this.isHorizontalPanel() ? CursorType.VERTICAL : CursorType.HORIZONTAL;
    }
    isHorizontalPanel() {
        return this.anchor === UserPanelAnchor.TOP || this.anchor === UserPanelAnchor.BOTTOM;
    }
    onPointerDown = (event) => {
        this.isDragging = true;
        event.stopPropagation();
    };
    onPointerMove = (event) => {
        if (!this.isDragging) {
            return;
        }
        this.updatePanelSize(event);
        this.drawPanel();
    };
    onPointerUp = () => {
        this.isDragging = false;
    };
    updatePanelSize(event) {
        const { innerWidth: width, innerHeight: height } = window;
        const { clientX, clientY } = event;
        let newSize;
        switch (this.anchor) {
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
    clampPanelSize(size) {
        return Math.max(PanelConfig.MIN_SIZE, Math.min(PanelConfig.MAX_SIZE, size));
    }
    drawPanel = () => {
        if (!this.panel || !this.resizeHandle) {
            return;
        }
        const { innerWidth: width, innerHeight: height } = window;
        this.drawPanelBackground(width, height);
        this.drawResizeHandle(width, height);
    };
    drawPanelBackground(width, height) {
        if (!this.panel) {
            return;
        }
        this.panel.clear();
        this.panel.beginFill(PanelColors.BACKGROUND, 0.92);
        const rect = this.getPanelRect(width, height);
        this.panel.drawRect(rect.x, rect.y, rect.width, rect.height);
        this.panel.endFill();
    }
    drawResizeHandle(width, height) {
        if (!this.resizeHandle) {
            return;
        }
        this.resizeHandle.clear();
        this.resizeHandle.beginFill(PanelColors.HANDLE, 1.0);
        const rect = this.getHandleRect(width, height);
        this.resizeHandle.drawRect(rect.x, rect.y, rect.width, rect.height);
        this.resizeHandle.endFill();
    }
    getPanelRect(width, height) {
        switch (this.anchor) {
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
    getHandleRect(width, height) {
        const thickness = PanelConfig.HANDLE_THICKNESS;
        const offset = thickness / 2;
        switch (this.anchor) {
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
    destroy() {
        window.removeEventListener("resize", this.drawPanel);
        window.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerup", this.onPointerUp);
        this.resizeHandle?.off("pointerdown", this.onPointerDown);
        if (this.app) {
            this.app.destroy(true);
            delete this.app;
        }
        delete this.panel;
        delete this.resizeHandle;
    }
}
exports.SoundEditor = SoundEditor;
//# sourceMappingURL=EditorView.js.map