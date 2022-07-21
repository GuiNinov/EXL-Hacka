"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Folder_1 = __importDefault(require("../../../../controllers/Permissions/Folder"));
const authMiddleware_1 = __importDefault(require("../../../../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../../../../middlewares/adminMiddleware"));
exports.default = (router) => {
    router.post("/v1/permissions/folders", authMiddleware_1.default, adminMiddleware_1.default, Folder_1.default.create);
    router.get("/v1/permissions/folders", authMiddleware_1.default, adminMiddleware_1.default, Folder_1.default.getAll);
    router.get("/v1/permissions/folders/:id", authMiddleware_1.default, adminMiddleware_1.default, Folder_1.default.findOne);
    router.delete("/v1/permissions/folders/:id", authMiddleware_1.default, adminMiddleware_1.default, Folder_1.default.delete);
    router.patch("/v1/permissions/folders/:id", authMiddleware_1.default, adminMiddleware_1.default, Folder_1.default.update);
    return router;
};
