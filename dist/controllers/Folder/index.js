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
const Folder_1 = __importDefault(require("../../services/Folder"));
const Folder_2 = __importDefault(require("../../services/Permissions/Folder"));
class FolderController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { name, dir } = req.body;
            const data = { name, dir };
            if (!name)
                return (0, responseHelper_1.buildResponse)(res, null, false, "Name is required", 400, req.headers.start_time);
            if (!data.dir)
                data.dir = 0;
            try {
                const folderServices = new Folder_1.default(Number(user.team_id));
                const folder = yield folderServices.create(data, user);
                if (!folder.valid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, folder.message, 400, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, folder.data, true, "Folder created successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    findAllInDirectory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            if (!id)
                return (0, responseHelper_1.buildResponse)(res, null, false, "Directory is required", 400, req.headers.start_time);
            try {
                const folderServices = new Folder_1.default(Number(user.team_id));
                const folders = yield folderServices.findAllInDirectory(Number(id));
                if (!folders.valid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, folders.message, 400, req.headers.start_time);
                }
                const folderPermissionsService = new Folder_2.default(user);
                const folderIsValid = yield folderPermissionsService.verifySingleRead(Number(id));
                if (!folderIsValid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to access this directory", 403, req.headers.start_time);
                }
                const allowedFolders = yield folderPermissionsService.verifyMultipleReads(folders.data);
                return (0, responseHelper_1.buildResponse)(res, allowedFolders, true, "Folders found successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            try {
                const folderServices = new Folder_1.default(Number(user.team_id));
                const folders = yield folderServices.findAll();
                const folderPermissionsService = new Folder_2.default(user);
                const allowedFolders = yield folderPermissionsService.verifyMultipleReads(folders);
                return (0, responseHelper_1.buildResponse)(res, allowedFolders, true, "Folders found successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            if (!id)
                return (0, responseHelper_1.buildResponse)(res, null, false, "Folder id is required", 400, req.headers.start_time);
            try {
                const folderServices = new Folder_1.default(Number(user.team_id));
                const folder = yield folderServices.findById(Number(id));
                if (!folder) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Folder not found", 400, req.headers.start_time);
                }
                const folderPermissionsService = new Folder_2.default(user);
                const folderIsValid = yield folderPermissionsService.verifySingleRead(Number(id));
                if (!folderIsValid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to access this folder", 403, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, folder, true, "Folder found successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    updateFolder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            const { name, dir } = req.body;
            if (!id)
                return (0, responseHelper_1.buildResponse)(res, null, false, "Folder id is required", 400, req.headers.start_time);
            let data = {};
            if (name)
                data.name = name;
            if (dir)
                data.dir = dir;
            try {
                const folderPermissionsService = new Folder_2.default(user);
                const folderIsValid = yield folderPermissionsService.verifySingleWrite(Number(id));
                if (!folderIsValid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "You don't have permission to access this folder", 403, req.headers.start_time);
                }
                const folderServices = new Folder_1.default(Number(user.team_id));
                const folder = yield folderServices.updateFolder(Number(id), data, user);
                if (!folder.valid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, folder.message, 400, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, folder.data, true, "Folder updated successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    deleteFolder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            if (!id)
                return (0, responseHelper_1.buildResponse)(res, null, false, "Folder id is required", 400, req.headers.start_time);
            try {
                const folderServices = new Folder_1.default(Number(user.team_id));
                const folder = yield folderServices.delete(Number(id), user);
                if (!folder.valid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, folder.message, 400, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, null, true, "Folder deleted successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
}
exports.default = new FolderController();
