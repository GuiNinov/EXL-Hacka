"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = __importDefault(require("../../../controllers/File"));
const authMiddleware_1 = __importDefault(require("../../../middlewares/authMiddleware"));
const multer_1 = __importDefault(require("../../../config/multer"));
exports.default = (router) => {
    router.post("/v1/file", multer_1.default.single("file"), authMiddleware_1.default, File_1.default.create);
    router.get("/v1/file", authMiddleware_1.default, File_1.default.getFiles);
    router.get("/v1/file/:id", authMiddleware_1.default, File_1.default.getFile);
    router.patch("/v1/file/:id", authMiddleware_1.default, File_1.default.updateFile);
    router.delete("/v1/file/:id", authMiddleware_1.default, File_1.default.deleteFile);
    return router;
};
