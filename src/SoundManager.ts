import { Signal } from "tone";
import {SoundEditor, UserPanelAnchor} from "./EditorView";
import * as Tone from "tone";

interface SoundManagerOptions extends AudioParam{
    dispatchSoundManager: () => void;
}
/** @internal */
export class SoundManager
{
    private signal!: Signal;
    private mode!: string;

    private anchor!: UserPanelAnchor;

    private editor!: SoundEditor;

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

        let options!: SoundManagerOptions;

        const dispatchSoundManager = () => {
            console.log("SoundManager DISPATCHED");
        }

        options.dispatchSoundManager = dispatchSoundManager;
        
        this.signal = new Signal();
        this.signal.apply(options);

        this.signal.dispose();

        console.log("SoundManager initialized");
    }
}

export interface SoundData
{
    sounds: Record<string, string>;
    events: Record<string, string[]>;
}