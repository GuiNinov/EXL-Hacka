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
const fomartData_1 = require("../../helpers/fomartData");
const AWS_1 = __importDefault(require("../../models/AWS"));
class AwsServices {
    constructor(user_id, bucket = process.env.AWS_BUCKET) {
        this.user_id = user_id;
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
        });
        this.bucket = bucket;
    }
    upload(file, start_time) {
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
                const awsUploadedFile = yield this.save({
                    user_id: this.user_id,
                    file_name: data.Key,
                    url: data.Location,
                    bucket: data.Bucket,
                    elapsed_time: Number((0, fomartData_1.diffBetweenDatesInMs)(new Date(), start_time)),
                });
                if (awsUploadedFile.error) {
                    return {
                        error: awsUploadedFile.error,
                        message: "Could not save file to internal database",
                        status: 500,
                    };
                }
                return {
                    error: null,
                    data: awsUploadedFile,
                    status: 200,
                    message: "File uploaded successfully",
                };
            }
            catch (error) {
                console.log(error);
                return {
                    error: error,
                    message: "Could not upload file to S3",
                    status: 500,
                };
            }
        });
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const req = yield AWS_1.default.create(data);
                return req;
            }
            catch (error) {
                console.log("An error appeared while trying to save the file to internal database");
                console.log(error);
                return { error };
            }
        });
    }
}
exports.default = AwsServices;
