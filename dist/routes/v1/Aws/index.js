"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Aws_1 = __importDefault(require("../../../controllers/Aws"));
const multer_1 = __importDefault(require("../../../config/multer"));
const authMiddleware_1 = __importDefault(require("../../../middlewares/authMiddleware"));
exports.default = (router) => {
    router.post("/v1/aws", multer_1.default.single("file"), authMiddleware_1.default, Aws_1.default.create);
    router.get("/v1/aws", authMiddleware_1.default, Aws_1.default.findAll);
    router.get("/v1/aws/:id", authMiddleware_1.default, Aws_1.default.findOne);
    router.put("/v1/aws/:id", authMiddleware_1.default, Aws_1.default.update);
    router.delete("/v1/aws/:id", authMiddleware_1.default, Aws_1.default.delete);
    return router;
};
