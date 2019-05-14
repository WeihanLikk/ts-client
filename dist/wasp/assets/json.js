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
var asset_1 = require("./asset");
var FS = require("fs");
var JsonAsset = /** @class */ (function (_super) {
    __extends(JsonAsset, _super);
    function JsonAsset(path) {
        return _super.call(this, path) || this;
    }
    JsonAsset.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var file = FS.readFile(_this.path, function (err, data) {
                if (err) {
                    reject(err);
                    console.log("Fail to open json");
                }
                resolve(JSON.parse(data.toString()));
            });
        });
    };
    return JsonAsset;
}(asset_1.Asset));
exports.JsonAsset = JsonAsset;
//# sourceMappingURL=json.js.map