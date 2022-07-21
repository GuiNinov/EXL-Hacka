"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const startTimeMiddleware_1 = __importDefault(require("../middlewares/startTimeMiddleware"));
const Teams_1 = __importDefault(require("./v1/Teams"));
const Users_1 = __importDefault(require("./v1/Users"));
const File_1 = __importDefault(require("./v1/File"));
const Folder_1 = __importDefault(require("./v1/Folder"));
const File_2 = __importDefault(require("./v1/Permissions/File"));
const Folder_2 = __importDefault(require("./v1/Permissions/Folder"));
var router = express_1.default.Router();
exports.default = (app) => {
    router.get("/health", (req, res) => {
        res.json({ status: "ok" });
    });
    app.use(startTimeMiddleware_1.default);
    router = (0, Users_1.default)(router);
    router = (0, File_1.default)(router);
    router = (0, Teams_1.default)(router);
    router = (0, Folder_1.default)(router);
    router = (0, File_2.default)(router);
    router = (0, Folder_2.default)(router);
    app.use(router);
};
