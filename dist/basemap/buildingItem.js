"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var def_1 = require("./def");
var geometry_1 = require("./geometry");
var THREE = require("three");
var BasemapBuildingItem = /** @class */ (function (_super) {
    __extends(BasemapBuildingItem, _super);
    function BasemapBuildingItem(proto, center, angle, road, offset //positive: leftside of the road
    ) {
        var _this = _super.call(this) || this;
        _this.proto = proto;
        _this.center = center;
        _this.angle = angle;
        _this.road = road;
        _this.offset = offset;
        _this._rect = null;
        _this._quadTreeItem = {};
        _this.shouldUpdate = true;
        _this.placeholder = _this.proto.placeholder;
        _this.checkUpdate();
        return _this;
    }
    Object.defineProperty(BasemapBuildingItem.prototype, "rectNeedsUpdate", {
        set: function (flag) { this.shouldUpdate = flag; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasemapBuildingItem.prototype, "rect", {
        get: function () {
            this.checkUpdate();
            return this._rect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasemapBuildingItem.prototype, "quadTreeItem", {
        get: function () {
            this.checkUpdate();
            return this._quadTreeItem;
        },
        enumerable: true,
        configurable: true
    });
    BasemapBuildingItem.prototype.intersectRoad = function (road) {
        return this.rect.intersect(road.rect);
    };
    BasemapBuildingItem.prototype.intersectBuilding = function (building) {
        return this.rect.intersect(building.rect);
    };
    BasemapBuildingItem.prototype.checkUpdate = function () {
        if (this.shouldUpdate) {
            this.shouldUpdate = false;
            var offset = Math.abs(this.offset);
            var offsetSign = this.offset > 0 ? 1 : -1;
            var houseRoadDir = this.road.to.clone().sub(this.road.from).normalize();
            var houseRoadNormDir = houseRoadDir.clone()
                .rotateAround(new THREE.Vector2(0, 0), Math.PI / 2 * offsetSign);
            var housePts = new Array();
            housePts[0] = this.road.from.clone()
                .add(houseRoadDir.clone().multiplyScalar(offset - 1))
                .add(houseRoadNormDir.clone().multiplyScalar(this.road.width / 2));
            housePts[1] = housePts[0].clone()
                .add(houseRoadDir.clone().multiplyScalar(this.placeholder.width));
            housePts[2] = housePts[1].clone()
                .add(houseRoadNormDir.clone().multiplyScalar(this.placeholder.height));
            housePts[3] = housePts[2].clone()
                .sub(houseRoadDir.clone().multiplyScalar(this.placeholder.width));
            this._rect = new geometry_1.AnyRect2D(housePts);
            //update QuadTreeItem
            Object.assign(this._quadTreeItem, { obj: this });
            Object.assign(this._quadTreeItem, this._rect.treeItem());
        }
    };
    return BasemapBuildingItem;
}(def_1.UserData));
exports.default = BasemapBuildingItem;
//# sourceMappingURL=buildingItem.js.map