"use strict";
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
var geometry_1 = require("./geometry");
var roadItem_1 = require("./roadItem");
var QuadTree = require("quadtree-lib");
var THREE = require("three");
var three_1 = require("three");
var Basemap = /** @class */ (function () {
    function Basemap() {
        this.roadID = new Map();
        this.IDroad = new Map();
        this.edge = new Map();
        this.buildingTree = new QuadTree({
            width: def_1.mapWidth,
            height: def_1.mapHeight,
            maxElements: def_1.maxBuildings
        });
        this.roadTree = new QuadTree({
            width: def_1.mapWidth,
            height: def_1.mapHeight,
            maxElements: def_1.maxRoads
        });
    }
    Basemap.prototype.addRoad = function (width, from, to) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
        var res = {
            added: [],
            removed: []
        };
        var newRoad = new roadItem_1.default(width, from, to);
        var segPts = [];
        var tempRoad = [];
        var treeItems = this.roadTree.colliding(newRoad.quadTreeItem);
        try {
            // let treeItems: any[] = []
            // this.roadTree.each(e => treeItems.push(e))
            for (var treeItems_1 = __values(treeItems), treeItems_1_1 = treeItems_1.next(); !treeItems_1_1.done; treeItems_1_1 = treeItems_1.next()) {
                var item = treeItems_1_1.value;
                var road = item.obj;
                if (road.seg.intersect(newRoad.seg)) {
                    var c = road.from;
                    var d = road.to;
                    var cd = d.clone().sub(c);
                    var dist1 = newRoad.seg.distance(c);
                    var dist2 = newRoad.seg.distance(d);
                    var t = dist1 / (dist1 + dist2);
                    if (isNaN(t)) {
                        // console.log("isNaN")
                        continue;
                    }
                    var crossPt = c.clone().add(cd.clone().multiplyScalar(t));
                    // console.log(Basemap.count)
                    // console.log(crossPt)
                    // let tes = { from: c, to: d, crossPoint: crossPt }
                    //if the cross point is not C or D
                    if (!crossPt.equals(c) && !crossPt.equals(d)) {
                        // this.removeRoad(road)
                        res.removed.push(road);
                        tempRoad.push(new roadItem_1.default(road.width, c, crossPt));
                        tempRoad.push(new roadItem_1.default(road.width, crossPt, d));
                    }
                    //otherwise, if cross point is C or D, nothing to do with line CD
                    //if new this.RoadType is not segmented
                    if (crossPt.equals(from) || crossPt.equals(to))
                        continue;
                    segPts.push(crossPt);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (treeItems_1_1 && !treeItems_1_1.done && (_a = treeItems_1.return)) _a.call(treeItems_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            //remove segmented roads
            for (var _e = __values(res.removed), _f = _e.next(); !_f.done; _f = _e.next()) {
                var road = _f.value;
                this.removeRoad(road);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        segPts.push(to);
        //sort pts by distance to fromPt
        segPts.sort(function (a, b) {
            return a.clone().sub(from).length() - b.clone().sub(from).length();
        });
        var From = from;
        try {
            for (var segPts_1 = __values(segPts), segPts_1_1 = segPts_1.next(); !segPts_1_1.done; segPts_1_1 = segPts_1.next()) {
                var pt = segPts_1_1.value;
                var newRoad_1 = new roadItem_1.default(width, From, pt);
                this.pushRoad(newRoad_1);
                res.added.push(newRoad_1);
                From = pt;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (segPts_1_1 && !segPts_1_1.done && (_c = segPts_1.return)) _c.call(segPts_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var tempRoad_1 = __values(tempRoad), tempRoad_1_1 = tempRoad_1.next(); !tempRoad_1_1.done; tempRoad_1_1 = tempRoad_1.next()) {
                var road = tempRoad_1_1.value;
                this.pushRoad(road);
                res.added.push(road);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (tempRoad_1_1 && !tempRoad_1_1.done && (_d = tempRoad_1.return)) _d.call(tempRoad_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return res;
    };
    Basemap.prototype.pushRoad = function (road) {
        if (this.edge.has(road.from)) {
            this.edge.get(road.from).push(road);
        }
        else {
            this.edge.set(road.from, [road]);
        }
        if (this.edge.has(road.to)) {
            this.edge.get(road.to).push(road);
        }
        else {
            this.edge.set(road.to, [road]);
        }
        this.roadTree.push(road.quadTreeItem, true);
        this.roadID.set(road, Basemap.count);
        this.IDroad.set(Basemap.count, road);
        Basemap.count++;
    };
    Basemap.prototype.getAllRoads = function () {
        var res = [];
        var items = this.roadTree.find(function (elm) { return true; });
        if (items)
            items.forEach(function (item) { return res.push(item.obj); });
        return res;
    };
    Basemap.prototype.getAllBuildings = function () {
        var res = [];
        var items = this.buildingTree.find(function (elm) { return true; });
        if (items)
            items.forEach(function (item) { return res.push(item.obj); });
        return res;
    };
    Basemap.prototype.addBuilding = function (building) {
        this.buildingTree.push(building.quadTreeItem, true);
    };
    Basemap.prototype.alignRoad = function (road, lengthAssert) {
        if (lengthAssert === void 0) { lengthAssert = true; }
        var e_5, _a, e_6, _b;
        if (lengthAssert && geometry_1.cmp(road.seg.length(), def_1.minRoadLength) < 0)
            return false;
        //detect building cross
        var intersectBuilding = this.buildingTree.colliding(road.quadTreeItem);
        try {
            for (var intersectBuilding_1 = __values(intersectBuilding), intersectBuilding_1_1 = intersectBuilding_1.next(); !intersectBuilding_1_1.done; intersectBuilding_1_1 = intersectBuilding_1.next()) {
                var item = intersectBuilding_1_1.value;
                var building = item.obj;
                if (building.intersectRoad(road))
                    return false;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (intersectBuilding_1_1 && !intersectBuilding_1_1.done && (_a = intersectBuilding_1.return)) _a.call(intersectBuilding_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        //detect road cross
        var minAngle = Math.sqrt(2) / 2;
        var intersectRoads = this.roadTree.colliding(road.quadTreeItem);
        try {
            for (var intersectRoads_1 = __values(intersectRoads), intersectRoads_1_1 = intersectRoads_1.next(); !intersectRoads_1_1.done; intersectRoads_1_1 = intersectRoads_1.next()) {
                var item = intersectRoads_1_1.value;
                var r = item.obj;
                if (r.rect.intersect(road.rect)) {
                    if (r.seg.ptOnLine(road.from) || r.seg.ptOnLine(road.to)) {
                        if (geometry_1.cmp(r.seg.from.distanceTo(road.from), 0) == 0) {
                            var ab = r.seg.to.clone().sub(road.from).normalize();
                            var ac = road.to.clone().sub(road.from).normalize();
                            if (geometry_1.cmp(ab.dot(ac), minAngle) <= 0)
                                continue;
                        }
                        else if (geometry_1.cmp(r.seg.from.distanceTo(road.to), 0) == 0) {
                            var ab = r.seg.to.clone().sub(road.to).normalize();
                            var ac = road.from.clone().sub(road.to).normalize();
                            if (geometry_1.cmp(ab.dot(ac), minAngle) <= 0)
                                continue;
                        }
                        else if (geometry_1.cmp(r.seg.to.distanceTo(road.from), 0) == 0) {
                            var ab = r.seg.from.clone().sub(road.from).normalize();
                            var ac = road.to.clone().sub(road.from).normalize();
                            if (geometry_1.cmp(ab.dot(ac), minAngle) <= 0)
                                continue;
                        }
                        else if (geometry_1.cmp(r.seg.to.distanceTo(road.to), 0) == 0) {
                            var ab = r.seg.from.clone().sub(road.to).normalize();
                            var ac = road.from.clone().sub(road.to).normalize();
                            if (geometry_1.cmp(ab.dot(ac), minAngle) <= 0)
                                continue;
                        }
                        var aVec = r.from.clone()
                            .sub(r.to)
                            .normalize();
                        var bVec = road.from.clone()
                            .sub(road.to)
                            .normalize();
                        var sinValue = Math.abs(aVec.cross(bVec));
                        if (geometry_1.cmp(sinValue, minAngle) >= 0)
                            continue;
                    }
                    return false;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (intersectRoads_1_1 && !intersectRoads_1_1.done && (_b = intersectRoads_1.return)) _b.call(intersectRoads_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return true;
    };
    Basemap.prototype.alignBuilding = function (pt, placeholder) {
        var e_7, _a;
        var nullval = {
            road: undefined,
            offset: undefined,
            center: pt,
            angle: 0,
            valid: false
        };
        var road = this.getVerticalRoad(pt, Math.max(placeholder.width, placeholder.height) * 5);
        if (road != undefined) {
            if (road.seg.distance(pt) > (placeholder.height / 2 + road.width / 2) * 1.1) {
                console.log("[assert] road's distance building is too far");
                return nullval;
            }
            var AB = pt.clone().sub(road.from);
            var AC = road.to.clone().sub(road.from);
            var roadLength = AC.length();
            if (roadLength < placeholder.width) {
                console.log("[assert] road is too short");
                return nullval;
            }
            roadLength -= placeholder.width;
            AC.normalize();
            var origin_1 = new THREE.Vector2(0, 0);
            var faceDir = new THREE.Vector2(0, -1);
            //1: left, -1:right
            var offsetSign = geometry_1.cross2D(AC.clone(), (AB)) > 0 ? 1 : -1;
            var offset = Math.round(AC.dot(AB) - placeholder.width / 2) + 1;
            offset = geometry_1.cmp(offset, 1) < 0 ? 1 : geometry_1.cmp(offset, roadLength + 1) > 0 ? roadLength + 1 : offset;
            var normDir = AC.clone().rotateAround(origin_1, Math.PI / 2 * offsetSign);
            var negNormDir = normDir.clone().negate();
            // let angle = Math.acos(faceDir.clone().dot(negNormDir)) * -offsetSign
            var angleSign = geometry_1.cmp(geometry_1.cross2D(negNormDir, faceDir), 0) > 0 ? -1 : 1;
            var angle = Math.acos(negNormDir.dot(faceDir)) * angleSign;
            var center = road.from.clone()
                .add(AC.clone().multiplyScalar(offset - 1 + placeholder.width / 2))
                .add(normDir.clone().multiplyScalar(placeholder.height / 2 + road.width / 2));
            var rect_1 = new geometry_1.AnyRect2D([
                center.clone()
                    .add(normDir.clone().multiplyScalar(placeholder.height / 2))
                    .add(AC.clone().multiplyScalar(placeholder.width / 2)),
                center.clone()
                    .add(negNormDir.clone().multiplyScalar(placeholder.height / 2))
                    .add(AC.clone().multiplyScalar(placeholder.width / 2)),
                center.clone()
                    .add(negNormDir.clone().multiplyScalar(placeholder.height / 2))
                    .sub(AC.clone().multiplyScalar(placeholder.width / 2)),
                center.clone()
                    .add(normDir.clone().multiplyScalar(placeholder.height / 2))
                    .sub(AC.clone().multiplyScalar(placeholder.width / 2)),
            ]);
            offset *= offsetSign;
            var res_1 = {
                road: road,
                offset: offset,
                center: center,
                angle: angle,
                valid: true
            };
            var rectItem = rect_1.treeItem();
            //detect building cross
            var intersectBuilding = this.buildingTree.colliding(rectItem);
            intersectBuilding.forEach(function (item) {
                var building = item.obj;
                if (building.rect.intersect(rect_1)) {
                    // console.log(`detect a building cross`)
                    // console.log(building.rect)
                    // console.log(rect)
                    console.log("[assert] cross building");
                    res_1.valid = false;
                    return res_1;
                }
            });
            //detect road cross
            var intersectRoad = this.roadTree.colliding(rectItem);
            try {
                for (var intersectRoad_1 = __values(intersectRoad), intersectRoad_1_1 = intersectRoad_1.next(); !intersectRoad_1_1.done; intersectRoad_1_1 = intersectRoad_1.next()) {
                    var item = intersectRoad_1_1.value;
                    var r = item.obj;
                    if (road == r)
                        continue;
                    if (rect_1.intersect(r.rect)) {
                        res_1.valid = false;
                        // console.log(`road cross`)
                        // console.log(this.roadID.get(road))
                        console.log("[assert] cross road");
                        return res_1;
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (intersectRoad_1_1 && !intersectRoad_1_1.done && (_a = intersectRoad_1.return)) _a.call(intersectRoad_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return res_1;
        }
        console.log("[assert] no suitable road");
        return nullval;
    };
    // selectBuilding(pt: Point): Building | null
    Basemap.prototype.removeBuilding = function (obj) {
        var building = obj;
        //remove Building in tree
        this.buildingTree.remove(obj.quadTreeItem);
        return obj;
    };
    Basemap.prototype.removeRoad = function (obj) {
        var road = obj;
        //remove road in tree
        this.roadTree.remove(obj.quadTreeItem);
        //remove road in map
        for (var i = 0; i < this.edge.get(road.from).length; ++i) {
            var r = this.edge.get(road.from)[i];
            if (r.to == road.to) {
                this.edge.get(road.from).splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < this.edge.get(road.to).length; ++i) {
            var r = this.edge.get(road.to)[i];
            if (r.from == road.from) {
                this.edge.get(road.to).splice(i, 1);
                break;
            }
        }
        var pt1 = this.edge.get(road.from);
        var idx1 = pt1.indexOf(road);
        pt1.splice(idx1, 1);
        if (pt1.length == 0) {
            this.edge.delete(road.from);
        }
        var pt2 = this.edge.get(road.to);
        var idx2 = pt2.indexOf(road);
        pt2.splice(idx2, 1);
        if (pt2.length == 0) {
            this.edge.delete(road.to);
        }
        return obj;
    };
    Basemap.prototype.getBoxBuildingItems = function (pt, distOfBox) {
        if (distOfBox === void 0) { distOfBox = def_1.defaultBuildingSelectionRange; }
        // return this.buildingTree.colliding({
        // 	x: pt.x,
        // 	y: pt.y,
        // 	width: distOfBox,
        // 	height: distOfBox
        // }, (elt1, elt2) => {
        // 	const pt1 = new THREE.Vector2(elt1.x, elt1.y)
        // 	const pt2 = new THREE.Vector2(elt2.x, elt2.y)
        // 	return pt.distanceTo(pt2) <= distOfBox
        // })
        return this.buildingTree.colliding({
            x: pt.x,
            y: pt.y,
            width: distOfBox * 2,
            height: distOfBox * 2
        });
    };
    Basemap.prototype.selectBuilding = function (pt, distOfBox) {
        if (distOfBox === void 0) { distOfBox = def_1.defaultBuildingSelectionRange; }
        var res = this.getBoxBuilding(pt, distOfBox);
        if (res.rect.containPt(pt))
            return res;
    };
    Basemap.prototype.getBoxBuilding = function (pt, distOfBox) {
        if (distOfBox === void 0) { distOfBox = def_1.defaultBuildingSelectionRange; }
        var items = this.getBoxBuildingItems(pt, distOfBox);
        var minDist = Infinity;
        var res = undefined;
        items.forEach(function (item) {
            var building = item.obj;
            var dist = building.center.distanceTo(pt);
            if (dist < minDist) {
                minDist = dist;
                res = building;
            }
        });
        return res;
    };
    Basemap.prototype.getBoxRoadItems = function (pt, distOfBox) {
        if (distOfBox === void 0) { distOfBox = def_1.defaultRoadSelectionRange; }
        // console.log({
        // 	x: pt.x,
        // 	y: pt.y,
        // 	radius: distOfBox
        // })
        // console.log(distOfBox)
        return this.roadTree.colliding({
            x: pt.x,
            y: pt.y,
            width: distOfBox,
            height: distOfBox
        }, function (elt1, elt2) {
            var box1 = new three_1.Box2(new three_1.Vector2(elt1.x - elt1.width / 2, elt1.y - elt1.height / 2), new three_1.Vector2(elt1.x + elt1.width / 2, elt1.y + elt1.height / 2));
            var box2 = new three_1.Box2(new three_1.Vector2(elt2.x - elt2.width / 2, elt2.y - elt2.height / 2), new three_1.Vector2(elt2.x + elt2.width / 2, elt2.y + elt2.height / 2));
            return box1.intersectsBox(box2);
        });
        // this.roadTree.
        // return this.roadTree.colliding({
        // 	x: pt.x,
        // 	y: pt.y,
        // 	width: distOfBox,
        // 	height: distOfBox
        // }, (elt1, elt2) => {
        // 	const pt1 = new THREE.Vector2(elt1.x, elt1.y)
        // 	const pt2 = new THREE.Vector2(elt2.x, elt2.y)
        // 	return pt1.distanceTo(pt2) >= distOfBox
        // })
    };
    Basemap.prototype.selectRoad = function (pt) {
        var res = this.getVerticalRoad(pt);
        if (res &&
            geometry_1.cmp(res.seg.distance(pt), res.width / 2) <= 0)
            return res;
    };
    Basemap.prototype.getBoxRoad = function (pt, distOfBox) {
        if (distOfBox === void 0) { distOfBox = def_1.defaultRoadSelectionRange; }
        var items = this.getBoxRoadItems(pt, distOfBox);
        var minDist = Infinity;
        var res = undefined;
        items.forEach(function (item) {
            var road = item.obj;
            if (road.seg.distance(pt) < minDist) {
                minDist = road.seg.distance(pt);
                res = road;
            }
        });
        return res;
    };
    Basemap.prototype.getVerticalRoad = function (pt, distOfBox) {
        if (distOfBox === void 0) { distOfBox = def_1.defaultRoadSelectionRange; }
        var res = undefined;
        var minDist = Infinity;
        var items = this.getBoxRoadItems(pt, distOfBox);
        // console.log(this.roadTree)
        // console.log("distOfBox:", distOfBox)
        // console.log("all items:", items.length)
        // console.log("all road nums:", this.getAllRoads.length)
        // // this.getAllRoads().forEach(road => console.log(road))
        // console.log("all treeitems:", this.roadTree.find(e => true).length)
        items.forEach(function (item) {
            var road = item.obj;
            if (road.seg.distance(pt) < minDist) {
                var ap = pt.clone().sub(road.seg.from);
                var bp = pt.clone().sub(road.seg.to);
                var ab = road.seg.to.clone().sub(road.seg.from);
                var ba = ab.clone().negate();
                if (ap.dot(ab) > 0 && bp.dot(ba) > 0) {
                    minDist = road.seg.distance(pt);
                    res = road;
                }
            }
        });
        return res;
    };
    Basemap.prototype.attachNearPoint = function (pt) {
        var near = this.getCandidatePoint(pt);
        if (near && near.distanceTo(pt) <= def_1.AttachRadius)
            return near;
        else {
            var road = this.getVerticalRoad(pt, 2 * def_1.AttachRadius);
            if (road == undefined)
                return pt;
            var nearPt = pt.clone();
            var farPt = pt.clone();
            var origin_2 = new THREE.Vector2(0, 0);
            var dir = road.to.clone().sub(road.from).rotateAround(origin_2, Math.PI / 2).normalize();
            nearPt.add(dir.clone().multiplyScalar(2 * def_1.AttachRadius));
            farPt.add(dir.clone().negate().multiplyScalar(2 * def_1.AttachRadius));
            var newSeg = new geometry_1.Seg2D(nearPt, farPt);
            if (road.seg.intersect(newSeg)) {
                var c = road.from;
                var d = road.to;
                var cd = d.clone().sub(c);
                var dist1 = newSeg.distance(c);
                var dist2 = newSeg.distance(d);
                var t = dist1 / (dist1 + dist2);
                if (isNaN(t)) {
                    return pt;
                }
                var crossPt = c.clone().add(cd.clone().multiplyScalar(t));
                return crossPt;
            }
            return pt;
        }
    };
    Basemap.prototype.getCandidatePoint = function (pt) {
        var e_8, _a;
        var res;
        var minDist = Infinity;
        try {
            for (var _b = __values(this.getCandidatePoints(pt)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var p = _c.value;
                var dist = p.distanceTo(pt);
                if (dist < minDist) {
                    minDist = dist;
                    res = p;
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        return res || pt;
    };
    Basemap.prototype.getCandidatePoints = function (pt) {
        return this.getNearPoints(pt);
    };
    Basemap.prototype.getNearPoints = function (pt) {
        var e_9, _a;
        var res = [];
        var rect = new geometry_1.ParallelRect2D(pt, def_1.PointDetectRadius);
        //detect road cross
        var roads = this.roadTree.colliding(rect.treeItem());
        try {
            for (var roads_1 = __values(roads), roads_1_1 = roads_1.next(); !roads_1_1.done; roads_1_1 = roads_1.next()) {
                var item = roads_1_1.value;
                var road = item.obj;
                if (pt.distanceTo(road.from.clone()) <= def_1.PointDetectRadius)
                    res.push(road.from);
                if (pt.distanceTo(road.to.clone()) <= def_1.PointDetectRadius)
                    res.push(road.to);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (roads_1_1 && !roads_1_1.done && (_a = roads_1.return)) _a.call(roads_1);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return res;
    };
    Basemap.prototype.getNearPoint = function (pt) {
        var e_10, _a;
        var res;
        var minDist = Infinity;
        try {
            for (var _b = __values(this.getNearPoints(pt)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var p = _c.value;
                var dist = p.distanceTo(pt);
                if (dist < minDist) {
                    minDist = dist;
                    res = p;
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return res;
    };
    Basemap.prototype.export = function () {
        var roadData = [];
        var roads = this.getAllRoads();
        roads.forEach(function (road) {
            roadData.push({
                from: road.from,
                to: road.to,
                width: road.width
            });
        });
        var buildingData = [];
        var buildings = this.getAllBuildings();
        buildings.forEach(function (building) {
            buildingData.push({
                prototype: building.proto.name,
                center: building.center
            });
        });
        var modelData = {
            state: "insert",
            roads: roadData,
            buildings: buildingData
        };
        return modelData;
        // return JSON.stringify(webData, null, 4)
    };
    Basemap.count = 0;
    Basemap.cnt = 0;
    return Basemap;
}());
exports.Basemap = Basemap;
//# sourceMappingURL=basemap.js.map