"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponse = void 0;
const fomartData_1 = require("./fomartData");
const buildResponse = (res, content, valid, message, status_code, start_time) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(status_code).json({
        content,
        valid,
        message,
        status_code,
        elapsed_time: (0, fomartData_1.diffBetweenDatesInMs)(Date.now(), start_time) + " ms",
    });
};
exports.buildResponse = buildResponse;
