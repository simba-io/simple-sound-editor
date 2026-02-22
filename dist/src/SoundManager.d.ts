import { UserPanelAnchor } from "./EditorView";
export interface SoundData {
    sounds: Record<string, string>;
    events: Record<string, string[]>;
}
/** @internal */
export declare class SoundManager {
    private mode;
    private anchor;
    private editor;
    private soundData;
    /** @internal */
    constructor(mode: "dev" | "prod", anchor: UserPanelAnchor);
}
//# sourceMappingURL=SoundManager.d.ts.map