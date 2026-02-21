export enum UserPanelState
{
    MINIMIZED,
    EXPANDED
}

export enum UserPanelAnchor{
    TOP = "top",
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right"
}

export class SoundManager
{
    private mode!: string;
    private anchor!: UserPanelAnchor;

    constructor(mode: "dev" | "prod", anchor: UserPanelAnchor)
    {
        this.mode = mode;
        this.anchor = anchor;

        if (this.mode === "dev")
        {
            console.log("SoundManager initialized in development mode.");
        }
    }
}

export interface SoundData
{
    sounds: Record<string, string>;
    events: Record<string, string[]>;
}