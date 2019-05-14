export declare const DistUnit = 0.1;
export declare const distOfPtOnLine = 1;
export declare const mapWidth = 500;
export declare const mapHeight = 500;
export declare const maxBuildings = 1000;
export declare const maxRoads = 1000;
export declare const PointDetectRadius = 16;
export declare const AttachRadius = 3;
export declare const minRoadLength: number;
export declare const roadHeight = 0.2;
export declare const defaultRoadSelectionRange = 5;
export declare const defaultBuildingSelectionRange = 8;
export interface QuadTreeItem<T = {}> {
    x: number;
    y: number;
    width: number;
    height: number;
    obj?: T;
}
export declare abstract class UserData<T> {
    userData?: T;
}
