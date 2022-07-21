"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.PASSPORT_SECRET;
const sign = (payload, expires_in) => jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expires_in });
exports.sign = sign;
const verify = (token) => jsonwebtoken_1.default.verify(token, secret);
exports.verify = verify;
