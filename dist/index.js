"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
const server = (0, config_1.default)(app);
const port = process.env.PORT || 3765;
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
