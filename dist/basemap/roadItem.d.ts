import { QuadTreeItem, UserData } from "./def";
import { Point, Seg2D, AnyRect2D } from "./geometry";
import * as THREE from "three";
export default class BasemapRoadItem<T = {}> extends UserData<T> {
    readonly width: number;
    private _seg;
    private _rect;
    private _quadTreeItem;
    constructor(width: number, from: Point, to: Point);
    private shouldUpdate;
    from: THREE.Vector2;
    to: THREE.Vector2;
    readonly rect: AnyRect2D;
    readonly seg: Seg2D;
    readonly quadTreeItem: QuadTreeItem<BasemapRoadItem<T>>;
    private checkUpdate;
}
