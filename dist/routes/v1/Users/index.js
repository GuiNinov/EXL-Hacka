"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../../../controllers/Users"));
const authMiddleware_1 = __importDefault(require("../../../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../../../middlewares/adminMiddleware"));
exports.default = (router) => {
    router.post("/v1/user", authMiddleware_1.default, adminMiddleware_1.default, Users_1.default.create);
    router.post("/v1/auth", Users_1.default.signin);
    router.get("/v1/user", authMiddleware_1.default, Users_1.default.getAll);
    router.get("/v1/user/:id", authMiddleware_1.default, Users_1.default.getById);
    router.patch("/v1/user/:id", authMiddleware_1.default, adminMiddleware_1.default, Users_1.default.setRole);
    router.delete("/v1/user/:id", authMiddleware_1.default, adminMiddleware_1.default, Users_1.default.delete);
    return router;
};
