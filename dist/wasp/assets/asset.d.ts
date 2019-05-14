interface Loader {
    load(url: string, onLoad: (e: any) => void, onProgress: (e: any) => void, onError: (e: any) => void): void;
}
export declare abstract class Asset<T> {
    protected readonly _path: string;
    static readonly path = "assets/";
    static setPath(path: string): void;
    protected readonly _prefix: string;
    protected readonly _shortName: string;
    protected readonly prefix: string;
    protected readonly shortName: string;
    protected readonly path: string;
    constructor(_path: string);
    abstract load(): Promise<T>;
}
export declare class PromiselifyLoader<T extends Loader> {
    readonly wrapped: T;
    private readonly onProgress;
    constructor(wrapped: T, onProgress?: (e: any) => void);
    load(url: string): Promise<any>;
}
export {};
