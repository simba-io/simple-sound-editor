import {SoundEditor, UserPanelAnchor} from "./EditorView";

/** @internal */
export class SoundManager
{
    private mode!: string;

    private anchor!: UserPanelAnchor;

    private editor!: SoundEditor;

    constructor(mode: "dev" | "prod", anchor: UserPanelAnchor)
    {
        this.mode = mode;

        this.anchor = anchor;

        if (this.mode === "dev")
        {
            this.editor = new SoundEditor(this.anchor);
        }

        console.log("SoundManager initialized");
    }
}

export interface SoundData
{
    sounds: Record<string, string>;
    events: Record<string, string[]>;
}