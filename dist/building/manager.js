"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wasp_1 = require("../wasp");
var THREE = require("three");
var basemap_1 = require("../basemap");
var BuildingPrototype = /** @class */ (function () {
    function BuildingPrototype(name, placeholder) {
        this.name = name;
        this.placeholder = placeholder;
        this.object = {};
    }
    BuildingPrototype.transformObject = function (obj, trans) {
        var e_1, _a;
        try {
            for (var trans_1 = __values(trans), trans_1_1 = trans_1.next(); !trans_1_1.done; trans_1_1 = trans_1.next()) {
                var tr = trans_1_1.value;
                if (tr.rotate) {
                    obj.rotateX(tr.rotate[0]);
                    obj.rotateY(tr.rotate[1]);
                    obj.rotateZ(tr.rotate[2]);
                }
                if (tr.translate) {
                    obj.translateX(tr.translate[0]);
                    obj.translateY(tr.translate[1]);
                    obj.translateZ(tr.translate[2]);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (trans_1_1 && !trans_1_1.done && (_a = trans_1.return)) _a.call(trans_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    BuildingPrototype.scaleObject = function (obj, scale) {
        if (typeof scale == "number") {
            obj.scale.set(scale, scale, scale);
        }
        else {
            obj.scale.set(scale[0], scale[1], scale[2]);
        }
    };
    BuildingPrototype.adjustObject = function (obj, def) {
        !def.transform || BuildingPrototype.transformObject(obj, def.transform);
        !def.scale || BuildingPrototype.scaleObject(obj, def.scale);
        obj.scale.multiplyScalar(basemap_1.DistUnit);
        obj.translateY(-new THREE.Box3().setFromObject(obj).min.y);
    };
    BuildingPrototype.load = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        new wasp_1.JsonAsset(path).load().then(function (json) {
                            var def = json;
                            var proto = new BuildingPrototype(def.name, new THREE.Vector2(def.placeholder[0], def.placeholder[1]));
                            resolve(proto);
                        });
                    })];
            });
        });
    };
    BuildingPrototype.frameMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
        displacementScale: 1e-4,
        flatShading: true // hard edges
    });
    BuildingPrototype.planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x156289,
        side: THREE.DoubleSide,
        displacementScale: 1e-4,
        flatShading: true // hard edges
    });
    return BuildingPrototype;
}());
exports.BuildingPrototype = BuildingPrototype;
var BuildingManager = /** @class */ (function () {
    function BuildingManager(assets) {
        if (assets === void 0) { assets = []; }
        this.createdTime = new Date().getTime();
        this.resources = new Map();
        this._ready = false;
        this._requests = 0;
        this._finishedRequests = 0;
        // console.log("%cnew BuildingManager()", "background: #000; color: #ffffff")
        // console.log(this)
        this.load(assets);
    }
    Object.defineProperty(BuildingManager.prototype, "ready", {
        get: function () { return this._ready; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BuildingManager.prototype, "requests", {
        get: function () { return this._requests; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BuildingManager.prototype, "finishedRequests", {
        get: function () { return this._finishedRequests; },
        enumerable: true,
        configurable: true
    });
    BuildingManager.prototype.clear = function () {
        this.resources.clear();
    };
    BuildingManager.prototype.load = function (path) {
        var _this = this;
        console.log("%c[Building Manager] Loading buildings...", "background: #00cc00; color: #fff");
        // console.log(path)
        var paths = (typeof path == "string") ? [path] : path;
        this._requests = paths.length;
        this._finishedRequests = 0;
        this._ready = false;
        return new Promise(function (resolve, reject) {
            var RES = function (protos) {
                var e_2, _a;
                try {
                    for (var protos_1 = __values(protos), protos_1_1 = protos_1.next(); !protos_1_1.done; protos_1_1 = protos_1.next()) {
                        var proto = protos_1_1.value;
                        if (proto) {
                            if (_this.resources.has(proto.name)) {
                                console.warn("Prototype with name " + proto.name + " already exists.");
                            }
                            else {
                                _this.resources.set(proto.name, proto);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (protos_1_1 && !protos_1_1.done && (_a = protos_1.return)) _a.call(protos_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                _this._ready = true;
                resolve(protos);
            };
            var jobs = paths.length;
            var buildings = [];
            var res = function (e, idx) {
                _this._finishedRequests++;
                buildings[idx] = e;
                (--jobs == 0) && RES(buildings);
            };
            var rej = function (e, idx) {
                _this._finishedRequests++;
                buildings[idx] = undefined;
                (--jobs == 0) && RES(buildings);
            };
            paths.forEach(function (path, idx) {
                return BuildingPrototype.load(path.match(/\/index.json$/i) ?
                    path : path + "/index.json")
                    .then(function (e) { return res(e, idx); }, function (e) { return rej(e, idx); });
            });
            console.log("%c[Building Manager] Buildings all loaded.", "background: #00cc00; color: #fff");
        });
    };
    BuildingManager.prototype.get = function (name) {
        return this.resources.get(name);
    };
    return BuildingManager;
}());
exports.BuildingManager = BuildingManager;
//# sourceMappingURL=manager.js.map