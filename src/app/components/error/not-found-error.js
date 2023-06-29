"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var app_error_1 = require("./app-error");
var NotFoudError = /** @class */ (function (_super) {
    __extends(NotFoudError, _super);
    function NotFoudError(error) {
        return _super.call(this, error) || this;
    }
    return NotFoudError;
}(app_error_1.AppError));
exports.NotFoudError = NotFoudError;
