import * as THREE from "three";
export declare type WebDataType = "Login" | "Room List" | "Enter Room" | "Synchronization data" | "Error" | "Message";
export declare abstract class WebData {
    readonly type: WebDataType;
    readonly data: any;
    constructor(type: WebDataType, data: any);
    toString(): string;
}
export declare class MessageData extends WebData {
    constructor(info: string);
}
export declare class ErrorData extends WebData {
    constructor(info: string);
}
export declare class LoginData extends WebData {
    constructor(user: string, pwd: string);
}
export declare class EnterRoomData extends WebData {
    constructor(room: number);
}
export declare type ModelData = {
    state: string;
    roads: RoadData[];
    buildings: BuildingData[];
};
export declare type RoadData = {
    from: THREE.Vector2;
    to: THREE.Vector2;
    width: number;
};
export declare type BuildingData = {
    prototype: string;
    center: THREE.Vector2;
};
export declare class SynchronizationData extends WebData {
    constructor(modelData: ModelData);
}
