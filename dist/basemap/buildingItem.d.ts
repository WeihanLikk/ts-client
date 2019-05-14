import { QuadTreeItem, UserData } from "./def";
import { AnyRect2D } from "./geometry";
import BasemapRoadItem from "./roadItem";
import { BuildingPrototype } from "../building/manager";
import * as THREE from "three";
export default class BasemapBuildingItem<T = {}> extends UserData<T> {
    readonly proto: BuildingPrototype;
    readonly center: THREE.Vector2;
    readonly angle: number;
    readonly road: BasemapRoadItem;
    readonly offset: number;
    private _rect;
    private _quadTreeItem;
    private shouldUpdate;
    private readonly placeholder;
    constructor(proto: BuildingPrototype, center: THREE.Vector2, angle: number, road: BasemapRoadItem, offset: number);
    rectNeedsUpdate: boolean;
    readonly rect: AnyRect2D;
    readonly quadTreeItem: QuadTreeItem<BasemapBuildingItem<T>>;
    intersectRoad(road: BasemapRoadItem): boolean;
    intersectBuilding(building: BasemapBuildingItem<T>): boolean;
    private checkUpdate;
}
