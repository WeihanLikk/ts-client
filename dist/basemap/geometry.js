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
var def_1 = require("./def");
var THREE = require("three");
function cross2D(a, b) {
    return a.x * b.y - a.y * b.x;
}
exports.cross2D = cross2D;
function inBox(min, pts, max) {
    var e_1, _a;
    try {
        for (var pts_1 = __values(pts), pts_1_1 = pts_1.next(); !pts_1_1.done; pts_1_1 = pts_1.next()) {
            var pt = pts_1_1.value;
            if (cmp(pt.x, min.x) > 0 &&
                cmp(pt.x, max.x) < 0 &&
                cmp(pt.y, min.y) > 0 &&
                cmp(pt.y, max.y) < 0)
                return true;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (pts_1_1 && !pts_1_1.done && (_a = pts_1.return)) _a.call(pts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
exports.inBox = inBox;
function minPt(pts) {
    var e_2, _a;
    var res = new THREE.Vector2(Infinity, Infinity);
    try {
        for (var pts_2 = __values(pts), pts_2_1 = pts_2.next(); !pts_2_1.done; pts_2_1 = pts_2.next()) {
            var pt = pts_2_1.value;
            if (cmp(pt.x, res.x) < 0)
                res.x = pt.x;
            if (cmp(pt.y, res.y) < 0)
                res.y = pt.y;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (pts_2_1 && !pts_2_1.done && (_a = pts_2.return)) _a.call(pts_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return res;
}
exports.minPt = minPt;
function maxPt(pts) {
    var e_3, _a;
    var res = new THREE.Vector2(-Infinity, -Infinity);
    try {
        for (var pts_3 = __values(pts), pts_3_1 = pts_3.next(); !pts_3_1.done; pts_3_1 = pts_3.next()) {
            var pt = pts_3_1.value;
            if (cmp(pt.x, res.x) > 0)
                res.x = pt.x;
            if (cmp(pt.y, res.y) > 0)
                res.y = pt.y;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (pts_3_1 && !pts_3_1.done && (_a = pts_3.return)) _a.call(pts_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return res;
}
exports.maxPt = maxPt;
function copyPts(pts) {
    var e_4, _a;
    var res = [];
    try {
        for (var pts_4 = __values(pts), pts_4_1 = pts_4.next(); !pts_4_1.done; pts_4_1 = pts_4.next()) {
            var pt = pts_4_1.value;
            res.push(pt.clone());
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (pts_4_1 && !pts_4_1.done && (_a = pts_4.return)) _a.call(pts_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return res;
}
var eps = 1e-3;
// <:-1, =:0, >:1
function cmp(a, b) {
    var val = a - b;
    return Math.abs(val) < eps ? 0 : val > 0 ? 1 : -1;
}
exports.cmp = cmp;
function cmpPt(a, b) {
    return (cmp(a.distanceTo(b), 0) == 0);
}
exports.cmpPt = cmpPt;
var Seg2D = /** @class */ (function () {
    function Seg2D(from, to) {
        this.from = from;
        this.to = to;
    }
    Seg2D.prototype.intersect = function (other, flag) {
        if (flag === void 0) { flag = true; }
        //1.rapid judge: rectangle coincide
        var a = this.from;
        var b = this.to;
        var c = other.from;
        var d = other.to;
        // console.log("this seg:", this)
        // console.log("other seg:", other)
        if (cmp(Math.min(a.x, b.x), Math.max(c.x, d.x)) <= 0 &&
            cmp(Math.max(a.x, b.x), Math.min(c.x, d.x)) >= 0 &&
            cmp(Math.min(a.y, b.y), Math.max(c.y, d.y)) <= 0 &&
            cmp(Math.max(a.y, b.y), Math.min(c.y, d.y)) >= 0) {
            // console.log("Rec conincide")
            //possibly line conincide
            var ab = b.clone().sub(a);
            var ac = c.clone().sub(a);
            var ad = d.clone().sub(a);
            var ca = a.clone().sub(c);
            var cd = d.clone().sub(c);
            var cb = b.clone().sub(c);
            //2.cross standing experiment
            if (flag) {
                return cmp(cross2D(ac, ab) * cross2D(ad, ab), 0) <= 0 &&
                    cmp(cross2D(ca, cd) * cross2D(cb, cd), 0) <= 0;
            }
            else
                return cmp(cross2D(ac, ab) * cross2D(ad, ab), 0) < 0 &&
                    cmp(cross2D(ca, cd) * cross2D(cb, cd), 0) < 0;
        }
        return false;
    };
    Seg2D.prototype.distance = function (pt) {
        var ab = this.to.clone().sub(this.from);
        var ac = pt.clone().sub(this.from);
        return Math.abs(cross2D(ab, ac)) / ab.length();
    };
    Seg2D.prototype.ptOnLine = function (pt) {
        if (this.distance(pt) < def_1.distOfPtOnLine) {
            var ap = pt.clone().sub(this.from);
            var bp = pt.clone().sub(this.to);
            var ab = this.to.clone().sub(this.from);
            var ba = ab.clone().negate();
            if (ap.dot(ab) >= 0 && bp.dot(ba) >= 0) {
                return true;
            }
        }
        return false;
        // let p = pt
        // let pa = this.from.clone()
        //     .sub(p)
        // let pb = this.to.clone()
        //     .sub(p)
        // return cmp(pa.dot(pb), 0) == 0
    };
    Seg2D.prototype.length = function () {
        return this.from.clone().sub(this.to).length();
    };
    Seg2D.prototype.angle = function (other) {
        var a = this.to.clone().sub(this.from).normalize();
        var b = other.to.clone().sub(other.from).normalize();
        return Math.acos(a.dot(b));
    };
    Seg2D.prototype.clone = function () {
        return new Seg2D(this.from, this.to);
    };
    Seg2D.prototype.reverseClone = function () {
        return new Seg2D(this.to, this.from);
    };
    return Seg2D;
}());
exports.Seg2D = Seg2D;
var AnyRect2D = /** @class */ (function () {
    function AnyRect2D(pts) {
        this.pts = pts;
        this.bbox2d = null;
        this.bbox2d = new THREE.Box2(minPt(this.pts), maxPt(this.pts));
    }
    AnyRect2D.prototype.containPts = function (pts) {
        var e_5, _a;
        try {
            for (var pts_5 = __values(pts), pts_5_1 = pts_5.next(); !pts_5_1.done; pts_5_1 = pts_5.next()) {
                var pt = pts_5_1.value;
                if (this.containPt(pt))
                    return true;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (pts_5_1 && !pts_5_1.done && (_a = pts_5.return)) _a.call(pts_5);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return false;
    };
    AnyRect2D.prototype.containPt = function (pt) {
        var pts = this.pts;
        var product = [];
        var AB = pts[1].clone().sub(pts[0]);
        var AP = pt.clone().sub(pts[0]);
        product.push(cross2D(AB, AP));
        var BC = pts[2].clone().sub(pts[1]);
        var BP = pt.clone().sub(pts[1]);
        product.push(cross2D(BC, BP));
        if (cmp(product[0] * product[1], 0) <= 0)
            return false;
        var CD = pts[3].clone().sub(pts[2]);
        var CP = pt.clone().sub(pts[2]);
        product.push(cross2D(CD, CP));
        if (cmp(product[1] * product[2], 0) <= 0)
            return false;
        var DA = pts[0].clone().sub(pts[3]);
        var DP = pt.clone().sub(pts[3]);
        product.push(cross2D(DA, DP));
        return cmp(product[2] * product[3], 0) <= 0 ? false : true;
    };
    AnyRect2D.prototype.intersect = function (other) {
        var e_6, _a, e_7, _b;
        if (!other.bbox2d.intersectsBox(this.bbox2d))
            return false;
        //assume road width is integer
        var origin = new THREE.Vector2(0, 0);
        var otherPts = other.pts;
        var otherDir = otherPts[1].clone().sub(otherPts[0]);
        var otherAngle = Math.acos(otherDir.clone().normalize().x) * otherDir.y < 0 ? -1 : 1;
        var thisPts = this.pts;
        var thisDir = thisPts[1].clone().sub(thisPts[0]);
        var thisAngle = Math.acos(thisDir.clone().normalize().x) * thisDir.y < 0 ? -1 : 1;
        var thisPtsInOther = new AnyRect2D(otherPts).containPts(thisPts);
        var otherPtsInThis = new AnyRect2D(thisPts).containPts(otherPts);
        //case 1
        if (thisPtsInOther || otherPtsInThis)
            return true;
        //case 2
        var a1 = [
            new Seg2D(otherPts[0], otherPts[2]),
            new Seg2D(otherPts[1], otherPts[3])
        ];
        var b1 = [
            new Seg2D(thisPts[0], thisPts[2]),
            new Seg2D(thisPts[1], thisPts[3])
        ];
        try {
            for (var a1_1 = __values(a1), a1_1_1 = a1_1.next(); !a1_1_1.done; a1_1_1 = a1_1.next()) {
                var se = a1_1_1.value;
                try {
                    for (var b1_1 = __values(b1), b1_1_1 = b1_1.next(); !b1_1_1.done; b1_1_1 = b1_1.next()) {
                        var sq = b1_1_1.value;
                        if (se.intersect(sq, false)) {
                            return true;
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (b1_1_1 && !b1_1_1.done && (_b = b1_1.return)) _b.call(b1_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (a1_1_1 && !a1_1_1.done && (_a = a1_1.return)) _a.call(a1_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return false;
    };
    AnyRect2D.prototype.treeItem = function () {
        var min = minPt(this.pts);
        var max = maxPt(this.pts);
        return {
            x: min.x,
            y: min.y,
            width: max.x - min.x,
            height: max.y - min.y
        };
    };
    return AnyRect2D;
}());
exports.AnyRect2D = AnyRect2D;
var ParallelRect2D = /** @class */ (function (_super) {
    __extends(ParallelRect2D, _super);
    function ParallelRect2D(pt, radius) {
        var _this = this;
        var rect = [
            pt.clone().add(new THREE.Vector2(radius / 2, radius / 2)),
            pt.clone().add(new THREE.Vector2(radius / 2, -radius / 2)),
            pt.clone().add(new THREE.Vector2(-radius / 2, -radius / 2)),
            pt.clone().add(new THREE.Vector2(-radius / 2, radius / 2))
        ];
        _this = _super.call(this, rect) || this;
        return _this;
    }
    return ParallelRect2D;
}(AnyRect2D));
exports.ParallelRect2D = ParallelRect2D;
//# sourceMappingURL=geometry.js.map