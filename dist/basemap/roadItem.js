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
var BasemapRoadItem = /** @class */ (function (_super) {
    __extends(BasemapRoadItem, _super);
    function BasemapRoadItem(width, from, to) {
        var _this = _super.call(this) || this;
        _this.width = width;
        _this._seg = null;
        _this._rect = null;
        _this._quadTreeItem = {};
        _this.shouldUpdate = true;
        _this._seg = new geometry_1.Seg2D(from, to);
        _this.checkUpdate();
        return _this;
    }
    Object.defineProperty(BasemapRoadItem.prototype, "from", {
        get: function () { return this.seg.from; },
        set: function (pt) {
            this.seg.from = pt;
            this.shouldUpdate = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasemapRoadItem.prototype, "to", {
        get: function () { return this.seg.to; },
        set: function (pt) {
            this.seg.to = pt;
            this.shouldUpdate = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasemapRoadItem.prototype, "rect", {
        // set shouldUpdate(flag: boolean) { this.shouldUpdate = flag }
        // buildings: { building: Building, offset: number }[]
        get: function () {
            this.checkUpdate();
            return this._rect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasemapRoadItem.prototype, "seg", {
        get: function () {
            this.checkUpdate();
            return this._seg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasemapRoadItem.prototype, "quadTreeItem", {
        get: function () {
            this.checkUpdate();
            return this._quadTreeItem;
        },
        enumerable: true,
        configurable: true
    });
    BasemapRoadItem.prototype.checkUpdate = function () {
        if (this.shouldUpdate) {
            this.shouldUpdate = false;
            //update _rect
            var roadDir = this.seg.to.clone().sub(this.seg.from);
            var dir = roadDir.clone().normalize();
            var roadNormDir = dir.clone().rotateAround(new THREE.Vector2(0, 0), Math.PI / 2);
            var roadPts = new Array();
            roadPts[0] = this.seg.from.clone().add(roadNormDir.clone()
                .multiplyScalar(this.width / 2));
            roadPts[1] = roadPts[0].clone().add(roadDir);
            roadPts[3] = this.seg.from.clone().add(roadNormDir.clone()
                .multiplyScalar(-this.width / 2));
            roadPts[2] = roadPts[3].clone().add(roadDir);
            this._rect = new geometry_1.AnyRect2D(roadPts);
            //update QuadTreeItem
            Object.assign(this._quadTreeItem, { obj: this });
            Object.assign(this._quadTreeItem, this._rect.treeItem());
        }
    };
    return BasemapRoadItem;
}(def_1.UserData));
exports.default = BasemapRoadItem;
//# sourceMappingURL=roadItem.js.map