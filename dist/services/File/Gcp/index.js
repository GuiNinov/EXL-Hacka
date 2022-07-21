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
const storage_1 = require("@google-cloud/storage");
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
class GcpService {
    constructor() {
        this.storage = new storage_1.Storage({
            projectId: process.env.GCP_PROJECT_ID,
            keyFilename: "gcpKey.json",
        });
        this.bucket = this.storage.bucket(process.env.GCP_BUCKET);
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash = crypto_1.default.randomInt(9999999).toString();
                const filename = file.originalname.split(".")[0].replace(/[^a-z0-9]/gi, "") +
                    "-" +
                    hash +
                    "." +
                    file.originalname.split(".")[file.originalname.split(".").length - 1];
                const blob = this.bucket.file(filename);
                const blobStream = blob.createWriteStream();
                blobStream.end(file.buffer);
                const publicUrl = (0, util_1.format)(`https://storage.googleapis.com/${this.bucket.name}/${blob.name}`);
                return {
                    valid: true,
                    data: {
                        url: publicUrl,
                        file_name: blob.name,
                        original_name: file.originalname,
                    },
                };
            }
            catch (error) {
                return {
                    valid: false,
                };
            }
        });
    }
}
exports.default = GcpService;
