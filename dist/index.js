"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var websocket_1 = require("websocket");
var basemap_1 = require("./basemap");
var roadItem_1 = require("./basemap/roadItem");
var manager_1 = require("./building/manager");
var buildingItem_1 = require("./basemap/buildingItem");
var def_1 = require("./def");
var Var = /** @class */ (function () {
    function Var(done) {
        if (done === void 0) { done = false; }
        this.done = done;
        this.ID = Var.id++;
    }
    Var.id = 0;
    return Var;
}());
var last = new Var(true);
var basemap = new basemap_1.Basemap();
var manager = new manager_1.BuildingManager();
var WebSocket = /** @class */ (function () {
    function WebSocket(host, port) {
        var _this = this;
        this.host = host;
        this.port = port;
        var conn = "ws://" + this.host + ":" + this.port + "/";
        this.socket = new websocket_1.w3cwebsocket(conn);
        this.socket.onopen = function () {
            console.log("[Socket] connection established.");
            _this.socket.send(new def_1.MessageData("__ts_client").toString());
        };
        this.socket.onmessage = function (msg) {
            var msgData = JSON.parse(msg.data);
            console.log("[Socket] receive " + msg.data + ".");
            var type = msgData.type, data = msgData.data;
            if (type == "Message" && data.info == "Data required") {
                var modelData = basemap.export();
                _this.socket.send(JSON.stringify({
                    type: "Message",
                    data: {
                        info: "Room data",
                        roads: modelData.roads,
                        buildings: modelData.buildings
                    }
                }, null, 4));
            }
            if (type == "Synchronization data") {
                var lastVar_1 = last;
                var selfVar_1 = new Var();
                last = selfVar_1;
                var triggerMainLoop_1 = function () {
                    if (!lastVar_1.done)
                        setTimeout(triggerMainLoop_1, 0);
                    else {
                        console.log("[Socket] begin to check data validation.");
                        var resolve = function () {
                            return new Promise(function (resolve, reject) {
                                var state = data.state, roads = data.roads, buildings = data.buildings;
                                if (roads.length != 0) {
                                    var _a = roads[0], from = _a.from, to = _a.to, width = _a.width;
                                    var fromVec = new THREE.Vector2(from.x, from.y);
                                    var toVec = new THREE.Vector2(to.x, to.y);
                                    var valid = false;
                                    if (state == "insert") {
                                        var roadItem = new roadItem_1.default(width, fromVec, toVec);
                                        valid = basemap.alignRoad(roadItem);
                                        if (valid)
                                            basemap.addRoad(width, fromVec, toVec);
                                    }
                                    else if (state == "remove") {
                                        var center = fromVec.clone().add(toVec).divideScalar(2);
                                        var roadItem = basemap.selectRoad(center);
                                        if (roadItem) {
                                            basemap.removeRoad(roadItem);
                                            valid = true;
                                        }
                                    }
                                    // const valid = basemap.alignRoad(roadItem)
                                    // if (valid) basemap.addRoad(width, fromVec, toVec)
                                    resolve(valid);
                                }
                                else if (buildings.length != 0) {
                                    var _b = buildings[0], prototype = _b.prototype, center = _b.center;
                                    var pos = new THREE.Vector2(center.x, center.y);
                                    var proto = manager.get(prototype);
                                    if (state == "insert") {
                                        var modelInfo = basemap.alignBuilding(pos.clone(), proto.placeholder);
                                        var road = modelInfo.road, angle = modelInfo.angle, valid = modelInfo.valid, offset = modelInfo.offset;
                                        console.log("[insert result]", road, angle, valid, offset);
                                        if (valid)
                                            basemap.addBuilding(new buildingItem_1.default(proto, pos, angle, road, offset));
                                        resolve(valid);
                                    }
                                    else if (state == "remove") {
                                        var building = basemap.selectBuilding(pos, Math.max(proto.placeholder.x, proto.placeholder.y) * 5);
                                        if (building) {
                                            basemap.removeBuilding(building);
                                            resolve(true);
                                        }
                                        else
                                            resolve(false);
                                    }
                                    // if (valid) basemap.addBuilding(new BasemapBuildingItem(proto, center, angle, road, offset))
                                    // resolve(valid)
                                }
                            });
                        };
                        resolve().then(function (valid) {
                            var DATA = {
                                type: "Message",
                                data: {
                                    info: "State check",
                                    valid: valid,
                                    roads: data.roads,
                                    buildings: data.buildings
                                }
                            };
                            _this.socket.send(JSON.stringify(DATA, null, 4));
                            console.log("[Socket] finish data validation check, state:" + valid + ".");
                            selfVar_1.done = true;
                        });
                    }
                };
                triggerMainLoop_1();
            }
        };
        this.socket.onclose = function () {
            console.log("[Socket] connection closed.");
        };
    }
    return WebSocket;
}());
manager.load([
    "export/Building_Auto Service",
    "export/Building_Bakery",
    "export/Building_Bar",
    "export/Building_Books Shop",
    "export/Building_Chicken Shop",
    "export/Building_Clothing",
    "export/Building_Coffee Shop",
    "export/Building_Drug Store",
    "export/Building_Factory",
    "export/Building_Fast Food",
    "export/Building_Fruits  Shop",
    "export/Building_Gas Station",
    "export/Building_Gift Shop",
    "export/Building_House_01_color01",
    "export/Building_House_02_color01",
    "export/Building_House_03_color01",
    "export/Building_House_04_color01",
    "export/Building_Music Store",
    "export/Building_Pizza",
    "export/Building_Residential_color01",
    "export/Building_Restaurant",
    "export/Building_Shoes Shop",
    "export/Building Sky_big_color01",
    "export/Building Sky_small_color01",
    "export/Building_Stadium",
    "export/Building_Super Market"
]).then(function () {
    var ws = new WebSocket("47.98.213.238", 8899);
    // const ws = new WebSocket("localhost", 8899)
});
//# sourceMappingURL=index.js.map