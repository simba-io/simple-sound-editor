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

    constructor(anchor: UserPanelAnchor)
    {
        this.anchor = anchor;

        console.log("SoundEditor initialized:\n", `Anchor: ${this.anchor}`);
    }
}