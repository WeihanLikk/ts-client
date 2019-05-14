"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var manager_1 = require("./manager");
var THREE = require("three");
var BuildingManagerComponent = /** @class */ (function () {
    function BuildingManagerComponent() {
        this.manager = new manager_1.BuildingManager();
    }
    BuildingManagerComponent.prototype.load = function () {
        var _this = this;
        var path = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            path[_i] = arguments[_i];
        }
        ;
        this.finish = false;
        this.manager.load(path)
            .then(function () { ; _this.finish = true; });
    };
    return BuildingManagerComponent;
}());
exports.BuildingManagerComponent = BuildingManagerComponent;
var manager = new BuildingManagerComponent();
var BuildingComponent = /** @class */ (function () {
    function BuildingComponent(name) {
        this.name = name;
    }
    BuildingComponent.prototype.init = function () {
        ;
        this.proto = manager.manager.get(this.name);
        if (this.proto) {
            var mat_1 = new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,
                color: BuildingComponent.invalidColor,
                opacity: 0.6,
                transparent: true,
            });
            // new THREE.MeshBasicMaterial({ color: 0xff0000 })
            var ind = this.proto.object.model.clone();
            ind.traverse(function (e) {
                var f = e;
                if (f.isMesh) {
                    f.material = mat_1;
                }
            });
        }
        else {
            console.error("invalid building type: " + this.name);
        }
    };
    BuildingComponent.validColor = new THREE.Color(0.44, 0.52, 0.84).multiplyScalar(2);
    BuildingComponent.invalidColor = new THREE.Color(0.8, 0.3, 0.2).multiplyScalar(2);
    return BuildingComponent;
}());
exports.BuildingComponent = BuildingComponent;
//# sourceMappingURL=index.js.map