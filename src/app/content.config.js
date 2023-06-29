"use strict";
exports.__esModule = true;
var CONTENT_TYPES = /** @class */ (function () {
    function CONTENT_TYPES() {
    }
    // ALLOWED BY CORS
    CONTENT_TYPES.TEXT_PLAIN = 'text/plain';
    CONTENT_TYPES.URL_ENCODED = 'application/x-www-form-urlencoded';
    CONTENT_TYPES.FORM_DATA = 'multipart/form-data';
    // NOT ALLOWED BY CORS
    CONTENT_TYPES.APP_JSON = 'application/json';
    return CONTENT_TYPES;
}());
exports.CONTENT_TYPES = CONTENT_TYPES;
