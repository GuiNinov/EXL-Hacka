"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = require("../helpers/responseHelper");
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.auth;
        if (!user) {
            return (0, responseHelper_1.buildResponse)(res, null, false, "Unauthorized", 401, req.headers.start_time);
        }
        if (user.role != "ADMIN") {
            return (0, responseHelper_1.buildResponse)(res, null, false, "Only ADMIN users can access this route", 401, req.headers.start_time);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return (0, responseHelper_1.buildResponse)(res, null, false, "An interna error occurred", 500, req.headers.start_time);
    }
});
exports.default = adminMiddleware;
