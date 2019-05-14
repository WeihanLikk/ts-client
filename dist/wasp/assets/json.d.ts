import { Asset } from "./asset";
export declare class JsonAsset extends Asset<{
    [key: string]: any;
}> {
    constructor(path: string);
    load(): Promise<{
        [key: string]: any;
    }>;
}
