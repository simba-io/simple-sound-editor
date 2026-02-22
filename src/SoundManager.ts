import {SoundEditor, UserPanelAnchor} from "./EditorView";
import * as Tone from "tone";

export interface SoundData
{
    sounds: Record<string, string>;
    events: Record<string, string[]>;
}

/** @internal */
export class SoundManager
{
    private mode!: string;

    private anchor!: UserPanelAnchor;

    private editor!: SoundEditor;

    private soundData!: SoundData;

    /** @internal */
    constructor(mode: "dev" | "prod", anchor: UserPanelAnchor)
    {
        Tone.start();
        this.mode = mode;

        this.anchor = anchor;

        if (this.mode === "dev")
        {
            this.editor = new SoundEditor(this.anchor);
        }

        console.log("SoundManager initialized");
    }
}