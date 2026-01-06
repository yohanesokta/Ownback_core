"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonResponse = void 0;
const jsonResponse = (c, status, data, message) => {
    return c.json({
        success: status >= 200 && status < 300,
        message,
        data,
    }, 200);
};
exports.jsonResponse = jsonResponse;
