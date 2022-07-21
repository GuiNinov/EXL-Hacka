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
const Aws_1 = __importDefault(require("../../services/Aws"));
class AwsController {
    create(req, res) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "No file uploaded", 400, req.headers.start_time);
                }
                const user = req.body.auth;
                const awsService = new Aws_1.default(Number(user.id));
                const fileUploaded = yield awsService.upload(req.file, req.headers.start_time);
                if (fileUploaded.error) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, fileUploaded.message, fileUploaded.status, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, {
                    url: (_a = fileUploaded.data) === null || _a === void 0 ? void 0 : _a.url,
                    file_name: (_b = fileUploaded.data) === null || _b === void 0 ? void 0 : _b.file_name,
                    created_at: (_c = fileUploaded.data) === null || _c === void 0 ? void 0 : _c.created_at,
                    updated_at: (_d = fileUploaded.data) === null || _d === void 0 ? void 0 : _d.updated_at,
                    id: (_e = fileUploaded.data) === null || _e === void 0 ? void 0 : _e.id,
                }, true, "File uploaded successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, error.message, 500, req.headers.start_time);
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, responseHelper_1.buildResponse)(res, null, false, "Not implemented", 501, req.headers.start_time);
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, responseHelper_1.buildResponse)(res, null, false, "Not implemented", 501, req.headers.start_time);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, responseHelper_1.buildResponse)(res, null, false, "Not implemented", 501, req.headers.start_time);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, responseHelper_1.buildResponse)(res, null, false, "Not implemented", 501, req.headers.start_time);
        });
    }
}
exports.default = new AwsController();
