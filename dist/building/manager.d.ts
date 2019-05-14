import * as THREE from "three";
export declare class BuildingPrototype {
    readonly name: string;
    readonly placeholder: THREE.Vector2;
    readonly object: {
        model: THREE.Object3D;
        floor: THREE.Object3D;
        frame: THREE.Object3D;
    };
    constructor(name: string, placeholder: THREE.Vector2);
    private static transformObject;
    private static scaleObject;
    private static adjustObject;
    private static frameMaterial;
    private static planeMaterial;
    static load(path: string): Promise<BuildingPrototype>;
}
export declare class BuildingManager {
    private readonly createdTime;
    constructor(assets?: string[]);
    private readonly resources;
    private _ready;
    private _requests;
    private _finishedRequests;
    readonly ready: boolean;
    readonly requests: number;
    readonly finishedRequests: number;
    private clear;
    load(path: string[] | string): Promise<(BuildingPrototype | undefined)[]>;
    get(name: string): BuildingPrototype | undefined;
}
