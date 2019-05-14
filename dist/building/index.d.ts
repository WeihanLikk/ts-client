import { BuildingManager, BuildingPrototype } from "./manager";
export declare class BuildingManagerComponent {
    readonly manager: BuildingManager;
    load(...path: string[]): void;
}
export declare class BuildingComponent {
    readonly name: string;
    private static readonly validColor;
    private static readonly invalidColor;
    readonly proto: BuildingPrototype;
    constructor(name: string);
    init(): void;
}
