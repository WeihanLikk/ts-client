import BasemapBuildingItem from "./buildingItem";
import { Point } from "./geometry";
import BasemapRoadItem from "./roadItem";
import * as THREE from "three";
import { ModelData } from "../def";
declare type Restype<R> = {
    road: BasemapRoadItem<R> | undefined;
    offset: number | undefined;
    center: THREE.Vector2;
    angle: number;
    valid: boolean;
};
declare class Basemap<R, B> {
    roadID: Map<BasemapRoadItem<R>, number>;
    IDroad: Map<number, BasemapRoadItem<R>>;
    static count: number;
    private readonly edge;
    private readonly buildingTree;
    private readonly roadTree;
    addRoad(width: number, from: Point, to: Point): {
        added: BasemapRoadItem<R>[];
        removed: BasemapRoadItem<R>[];
    };
    private pushRoad;
    getAllRoads(): BasemapRoadItem[];
    getAllBuildings(): BasemapBuildingItem[];
    addBuilding(building: BasemapBuildingItem<B>): void;
    alignRoad(road: BasemapRoadItem<R>, lengthAssert?: boolean): boolean;
    alignBuilding(pt: Point, placeholder: THREE.Vector2): Restype<R>;
    removeBuilding(obj: BasemapBuildingItem<B>): BasemapBuildingItem<B>;
    removeRoad(obj: BasemapRoadItem<R>): BasemapRoadItem<R>;
    private getBoxBuildingItems;
    selectBuilding(pt: Point, distOfBox?: number): BasemapBuildingItem<B> | undefined;
    getBoxBuilding(pt: Point, distOfBox?: number): BasemapBuildingItem<B> | undefined;
    private getBoxRoadItems;
    selectRoad(pt: Point): BasemapRoadItem<R> | undefined;
    getBoxRoad(pt: Point, distOfBox?: number): BasemapRoadItem<R> | undefined;
    getVerticalRoad(pt: Point, distOfBox?: number): BasemapRoadItem<R> | undefined;
    attachNearPoint(pt: Point): Point;
    getCandidatePoint(pt: Point): Point;
    getCandidatePoints(pt: Point): Point[];
    getNearPoints(pt: Point): Point[];
    getNearPoint(pt: Point): Point | undefined;
    export(): ModelData;
}
export { Basemap };
