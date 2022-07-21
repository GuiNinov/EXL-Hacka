"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Teams_1 = __importDefault(require("../../../controllers/Teams"));
const authMiddleware_1 = __importDefault(require("../../../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../../../middlewares/adminMiddleware"));
exports.default = (router) => {
    router.post("/v1/signup", Teams_1.default.create);
    router.delete("/v1/team", authMiddleware_1.default, adminMiddleware_1.default, Teams_1.default.delete);
    return router;
};
