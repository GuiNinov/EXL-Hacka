"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("../config/jwt"));
const responseHelper_1 = require("../helpers/responseHelper");
const Users_1 = __importDefault(require("../models/Users"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [hashType, token] = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ");
        if (hashType.trim() != "Bearer") {
            return (0, responseHelper_1.buildResponse)(res, null, false, "Unauthorized", 403, req.headers.start_time);
        }
        const payload = yield jwt.verify(token);
        const user = yield Users_1.default.findById(Number(payload.user), true);
        if (!user.length) {
            return (0, responseHelper_1.buildResponse)(res, null, false, "Unauthorized", 401, req.headers.start_time);
        }
        req.body.auth = user[0];
        req.body.token = token;
        next();
    }
    catch (error) {
        console.log(error);
        return (0, responseHelper_1.buildResponse)(res, null, false, "Unauthorized", 401, req.headers.start_time);
    }
});
exports.default = authMiddleware;
