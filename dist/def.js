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
var WebData = /** @class */ (function () {
    function WebData(type, data) {
        this.type = type;
        this.data = data;
    }
    WebData.prototype.toString = function () {
        return JSON.stringify(this, null, 4);
    };
    return WebData;
}());
exports.WebData = WebData;
var MessageData = /** @class */ (function (_super) {
    __extends(MessageData, _super);
    function MessageData(info) {
        return _super.call(this, "Message", {
            info: info
        }) || this;
    }
    return MessageData;
}(WebData));
exports.MessageData = MessageData;
var ErrorData = /** @class */ (function (_super) {
    __extends(ErrorData, _super);
    function ErrorData(info) {
        return _super.call(this, "Error", {
            info: info
        }) || this;
    }
    return ErrorData;
}(WebData));
exports.ErrorData = ErrorData;
var LoginData = /** @class */ (function (_super) {
    __extends(LoginData, _super);
    function LoginData(user, pwd) {
        return _super.call(this, "Login", {
            user: user,
            pwd: pwd
        }) || this;
    }
    return LoginData;
}(WebData));
exports.LoginData = LoginData;
var EnterRoomData = /** @class */ (function (_super) {
    __extends(EnterRoomData, _super);
    function EnterRoomData(room) {
        return _super.call(this, "Login", {
            room: room
        }) || this;
    }
    return EnterRoomData;
}(WebData));
exports.EnterRoomData = EnterRoomData;
var SynchronizationData = /** @class */ (function (_super) {
    __extends(SynchronizationData, _super);
    function SynchronizationData(modelData) {
        return _super.call(this, "Synchronization data", {
            state: modelData.state,
            roads: modelData.roads,
            buildings: modelData.buildings
        }) || this;
    }
    return SynchronizationData;
}(WebData));
exports.SynchronizationData = SynchronizationData;
//# sourceMappingURL=def.js.map