import { QuadTreeItem } from "./def";
import * as THREE from "three";
declare function cross2D(a: THREE.Vector2, b: THREE.Vector2): number;
declare function inBox(min: Point, pts: Point[], max: Point): boolean;
declare function minPt(pts: Point[]): Point;
declare function maxPt(pts: Point[]): Point;
declare function cmp(a: number, b: number): number;
declare function cmpPt(a: Point, b: Point): boolean;
declare type Point = THREE.Vector2;
declare class Seg2D {
    readonly from: THREE.Vector2;
    readonly to: THREE.Vector2;
    constructor(from: THREE.Vector2, to: THREE.Vector2);
    intersect(other: Seg2D, flag?: boolean): boolean;
    distance(pt: Point): number;
    ptOnLine(pt: Point): boolean;
    length(): number;
    angle(other: Seg2D): number;
    clone(): Seg2D;
    reverseClone(): Seg2D;
}
declare class AnyRect2D {
    private readonly pts;
    private bbox2d;
    constructor(pts: THREE.Vector2[]);
    containPts(pts: Point[]): boolean;
    containPt(pt: Point): boolean;
    intersect(other: AnyRect2D): boolean;
    treeItem(): QuadTreeItem;
}
declare class ParallelRect2D extends AnyRect2D {
    constructor(pt: Point, radius: number);
}
export { inBox, minPt, maxPt, Point, cmp, cmpPt, cross2D, Seg2D, AnyRect2D, ParallelRect2D };
