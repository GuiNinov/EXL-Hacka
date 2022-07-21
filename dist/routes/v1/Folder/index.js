"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Folder_1 = __importDefault(require("../../../controllers/Folder"));
const authMiddleware_1 = __importDefault(require("../../../middlewares/authMiddleware"));
exports.default = (router) => {
    router.post("/v1/folder", authMiddleware_1.default, Folder_1.default.create);
    router.get("/v1/folder", authMiddleware_1.default, Folder_1.default.findAll);
    router.get("/v1/folder/:id", authMiddleware_1.default, Folder_1.default.findById);
    router.get("/v1/dir/:id", authMiddleware_1.default, Folder_1.default.findAllInDirectory);
    router.patch("/v1/folder/:id", authMiddleware_1.default, Folder_1.default.updateFolder);
    router.delete("/v1/folder/:id", authMiddleware_1.default, Folder_1.default.deleteFolder);
    return router;
};
