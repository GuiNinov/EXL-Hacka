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
const File_1 = __importDefault(require("../../services/File"));
const Folder_1 = __importDefault(require("../../services/Permissions/Folder"));
const File_2 = __importDefault(require("../../services/Permissions/File"));
class FileController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { storaged_at, folder } = req.body;
            if (storaged_at) {
                if (storaged_at != "aws" &&
                    storaged_at != "digital_ocean" &&
                    storaged_at != "gcp" &&
                    storaged_at != "azure") {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Invalid `storaged_at` value", 400, req.headers.start_time);
                }
            }
            const fileServices = new File_1.default(Number(user.id), Number(user.team_id));
            const result = yield fileServices.saveFile(req.file, req.headers.start_time ? req.headers.start_time.toString() : "", storaged_at, folder);
            if (!result.valid) {
                return (0, responseHelper_1.buildResponse)(res, null, false, result.message, 400, req.headers.start_time);
            }
            return (0, responseHelper_1.buildResponse)(res, result.data, true, "File saved successfully", 201, req.headers.start_time);
        });
    }
    getFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storaged_at, folder, user_id, file_name } = req.query;
            const user = req.body.auth;
            const fileServices = new File_1.default(Number(user.id), Number(user.team_id));
            const filters = {};
            if (storaged_at) {
                if (storaged_at != "aws" &&
                    storaged_at != "digital_ocean" &&
                    storaged_at != "gcp" &&
                    storaged_at != "azure") {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Invalid storaged_at value", 400, req.headers.start_time);
                }
                filters.storaged_at = storaged_at;
            }
            if (folder) {
                filters.folder = folder;
                const folderPermissionsService = new Folder_1.default(user);
                const folderAllowed = yield folderPermissionsService.verifySingleRead(folder);
                if (!folderAllowed) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "You are not allowed to read this folder", 403, req.headers.start_time);
                }
            }
            if (user_id)
                filters.user_id = user_id;
            if (file_name)
                filters.file_name = file_name;
            const result = yield fileServices.getFiles(filters);
            if (!result.valid) {
                return (0, responseHelper_1.buildResponse)(res, null, false, result.message, 500, req.headers.start_time);
            }
            const filePermissionsService = new File_2.default(user);
            const filesAllowed = yield filePermissionsService.verifyMultipleReads(result.data);
            return (0, responseHelper_1.buildResponse)(res, filesAllowed, true, "Files retrieved successfully", 200, req.headers.start_time);
        });
    }
    getFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = req.body.auth;
            const fileServices = new File_1.default(Number(user.id), Number(user.team_id));
            const result = yield fileServices.getFile(Number(id));
            if (!result.valid) {
                return (0, responseHelper_1.buildResponse)(res, null, false, result.message, 500, req.headers.start_time);
            }
            if (!result.data) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "File not found", 404, req.headers.start_time);
            }
            const folderPermissionsService = new Folder_1.default(user);
            const folderAllowed = yield folderPermissionsService.verifySingleRead(result.data.folder);
            if (!folderAllowed) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to access this file", 403, req.headers.start_time);
            }
            const filePermissionsService = new File_2.default(user);
            const fileAllowed = yield filePermissionsService.verifySingleRead(Number(id));
            if (!fileAllowed) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to read this file", 403, req.headers.start_time);
            }
            return (0, responseHelper_1.buildResponse)(res, result.data, true, "File retrieved successfully", 200, req.headers.start_time);
        });
    }
    deleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = req.body.auth;
            const fileServices = new File_1.default(Number(user.id), Number(user.team_id));
            try {
                const fileExists = yield fileServices.getFile(Number(id));
                if (!fileExists.data) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "File not found", 404, req.headers.start_time);
                }
                const folderPermissionsService = new Folder_1.default(user);
                const folderPermissions = yield folderPermissionsService.verifyDelete(fileExists.data.folder);
                if (!folderPermissions) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to delete this file", 403, req.headers.start_time);
                }
                const filePermissionsService = new File_2.default(user);
                const filePermissions = yield filePermissionsService.verifyDelete(Number(id));
                if (!filePermissions) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to delete this file", 403, req.headers.start_time);
                }
                const result = yield fileServices.deleteFile(Number(id));
                return (0, responseHelper_1.buildResponse)(res, null, true, "File deleted successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Error deleting file", 500, req.headers.start_time);
            }
        });
    }
    updateFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = req.body.auth;
            const fileServices = new File_1.default(Number(user.id), Number(user.team_id));
            const { folder } = req.body;
            try {
                const fileExists = yield fileServices.getFile(Number(id));
                if (!fileExists.data) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "File not found", 404, req.headers.start_time);
                }
                const folderPermissionsService = new Folder_1.default(user);
                const folderAllowed = yield folderPermissionsService.verifySingleWrite(fileExists.data.folder);
                if (!folderAllowed) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to update this file", 403, req.headers.start_time);
                }
                const filePermissionsService = new File_2.default(user);
                const fileAllowed = yield filePermissionsService.verifyUpload(Number(id));
                if (!fileAllowed) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to update this file", 403, req.headers.start_time);
                }
                const result = yield fileServices.updateFile(Number(id), { folder });
                if (!result.valid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, result.message, 400, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, result.data, true, "File updated successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Error updating file", 500, req.headers.start_time);
            }
        });
    }
}
exports.default = new FileController();
