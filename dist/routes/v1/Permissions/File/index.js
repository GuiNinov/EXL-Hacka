"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = __importDefault(require("../../../../controllers/Permissions/File"));
const authMiddleware_1 = __importDefault(require("../../../../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../../../../middlewares/adminMiddleware"));
exports.default = (router) => {
    router.post("/v1/permissions/files", authMiddleware_1.default, adminMiddleware_1.default, File_1.default.create);
    router.get("/v1/permissions/files", authMiddleware_1.default, adminMiddleware_1.default, File_1.default.getAllFilePermissions);
    router.get("/v1/permissions/files/:id", authMiddleware_1.default, adminMiddleware_1.default, File_1.default.findOnePermission);
    router.delete("/v1/permissions/files/:id", authMiddleware_1.default, adminMiddleware_1.default, File_1.default.deletePermission);
    router.patch("/v1/permissions/files/:id", authMiddleware_1.default, adminMiddleware_1.default, File_1.default.updatePermission);
    return router;
};
