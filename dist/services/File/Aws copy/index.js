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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const crypto_1 = __importDefault(require("crypto"));
class AwsService {
    constructor() {
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
        });
        this.bucket = process.env.AWS_BUCKET;
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash = crypto_1.default.randomBytes(16).toString("utf-8");
                const filename = file.originalname.split(".")[0] +
                    "-" +
                    hash +
                    "." +
                    file.originalname.split(".")[1];
                const data = yield this.s3
                    .upload({
                    Bucket: this.bucket,
                    Key: filename,
                    Body: file.buffer,
                    ACL: "public-read",
                })
                    .promise();
                return {
                    valid: true,
                    data: {
                        url: data.Location,
                        file_name: data.key,
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
exports.default = AwsService;
