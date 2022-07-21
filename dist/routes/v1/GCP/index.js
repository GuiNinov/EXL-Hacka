"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GCP_1 = __importDefault(require("../../../controllers/GCP"));
const multer_1 = __importDefault(require("../../../config/multer"));
exports.default = (router) => {
    router.post("/v1/gcp/upload", (multer_1.default.single('file') || multer_1.default.array('files', 5)), GCP_1.default.upload);
    return router;
};
