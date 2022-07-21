"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = require("../../helpers/responseHelper");
const pg_1 = __importDefault(require("../../database/pg"));
const storage_1 = require("@google-cloud/storage");
let projectId = "solid-pact-353014";
let keyFilename = "gcpKey.json";
const storage = new storage_1.Storage({
    projectId,
    keyFilename,
});
const bucket = storage.bucket("exl-hacka-2022");
class GcpController {
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const start_time = new Date();
            try {
                if (req.file) {
                    console.log("Uploading file...");
                    yield (0, pg_1.default)("test");
                    const blob = bucket.file(req.file.originalname);
                    const blobStream = blob.createWriteStream();
                    blobStream.on("finish", () => {
                        var _a;
                        console.log("File uploaded successfully!");
                        return (0, responseHelper_1.buildResponse)(res, { file: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname }, true, "File saved successfully", 201, start_time);
                    });
                    blobStream.end(req.file.buffer);
                }
                else if (req.files) {
                    console.log("Uploading files...");
                    yield (0, pg_1.default)("test");
                }
                else {
                    setTimeout(() => {
                        return (0, responseHelper_1.buildResponse)(res, { error: "File not found!" }, false, "error", 500, start_time);
                    }, 1000);
                }
            }
            catch (error) {
                return (0, responseHelper_1.buildResponse)(res, null, false, error.message, 500, start_time);
            }
        });
    }
    uploadMultipleFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = new GcpController();
