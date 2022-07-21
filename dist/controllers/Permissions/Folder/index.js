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
const responseHelper_1 = require("../../../helpers/responseHelper");
const Folder_1 = __importDefault(require("../../../services/Permissions/Folder"));
const Folder_2 = __importDefault(require("../../../services/Folder"));
const Users_1 = __importDefault(require("../../../services/Users"));
class FolderPermissionsController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { folder_id, user_id, permissions } = req.body;
            if (!folder_id || !user_id || !permissions) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "Missing required fields", 400, req.headers.start_time);
            }
            const folderService = new Folder_2.default(user.team_id);
            const folderExists = yield folderService.findById(Number(folder_id));
            if (!folderExists) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "Folder not found", 404, req.headers.start_time);
            }
            const userService = new Users_1.default(user.team_id);
            const userExists = yield userService.findById(Number(user.id));
            if (!userExists) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "User not found", 404, req.headers.start_time);
            }
            const { allow_read_till, allow_write_till, allow_delete_till } = permissions;
            if (allow_read_till || allow_write_till || allow_delete_till) {
                if (!permissions.access_till) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Access till date is required when `allow_read_till`, `allow_write_till` or `allow_delete_till` are true", 400, req.headers.start_time);
                }
            }
            try {
                const folderPermissionsService = new Folder_1.default(user);
                const result = yield folderPermissionsService.createNewPermission(Object.assign(Object.assign({ folder_id,
                    user_id }, permissions), { team_id: user.team_id }));
                return (0, responseHelper_1.buildResponse)(res, result, true, "Folder permission created successfully", 201, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            const { permissions } = req.body;
            const { allow_read_till, allow_write_till, allow_delete_till } = permissions;
            if (allow_read_till || allow_write_till || allow_delete_till) {
                if (!permissions.access_till) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Access till date is required when `allow_read_till`, `allow_write_till` or `allow_delete_till` are true", 400, req.headers.start_time);
                }
            }
            try {
                const folderPermissionsService = new Folder_1.default(user);
                const folderPermissionExists = yield folderPermissionsService.findOnePermission(Number(id));
                if (!folderPermissionExists) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Folder permission not found", 404, req.headers.start_time);
                }
                const result = yield folderPermissionsService.updatePermission(Number(id), Object.assign({}, permissions));
                return (0, responseHelper_1.buildResponse)(res, result, true, "Folder permission updated successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            try {
                const folderPermissionsService = new Folder_1.default(user);
                const folderPermissionExists = yield folderPermissionsService.findOnePermission(Number(id));
                if (!folderPermissionExists) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Folder permission not found", 404, req.headers.start_time);
                }
                yield folderPermissionsService.deletePermission(Number(id));
                return (0, responseHelper_1.buildResponse)(res, null, true, "Folder permission deleted successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { user_id, folder_id } = req.query;
            try {
                const folderPermissionsService = new Folder_1.default(user);
                let result = [];
                if (user_id && !folder_id) {
                    const userServices = new Users_1.default(user.team_id);
                    const userExists = yield userServices.findById(Number(user_id));
                    if (!userExists) {
                        return (0, responseHelper_1.buildResponse)(res, null, false, "User not found", 404, req.headers.start_time);
                    }
                    result = yield folderPermissionsService.findAllByUserId(Number(user_id));
                }
                if (folder_id && !user_id) {
                    const folderService = new Folder_2.default(user.team_id);
                    const folderExists = yield folderService.findById(Number(folder_id));
                    if (!folderExists) {
                        return (0, responseHelper_1.buildResponse)(res, null, false, "Folder not found", 404, req.headers.start_time);
                    }
                    result = yield folderPermissionsService.findAllByFolderId(Number(folder_id));
                }
                if (folder_id && user_id) {
                    const folderService = new Folder_2.default(user.team_id);
                    const folderExists = yield folderService.findById(Number(folder_id));
                    if (!folderExists) {
                        return (0, responseHelper_1.buildResponse)(res, null, false, "Folder not found", 404, req.headers.start_time);
                    }
                    const userServices = new Users_1.default(user.team_id);
                    const userExists = yield userServices.findById(Number(user_id));
                    if (!userExists) {
                        return (0, responseHelper_1.buildResponse)(res, null, false, "User not found", 404, req.headers.start_time);
                    }
                    result = yield folderPermissionsService.findAllByFolderIdAndUserId(Number(folder_id), Number(user_id));
                }
                if (!folder_id && !user_id) {
                    result = yield folderPermissionsService.listAllTeamPermissions();
                }
                if (!result.length) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "No folder permissions found", 404, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, result, true, "Folder permissions fetched successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            try {
                const folderPermissionsService = new Folder_1.default(user);
                const folderPermissionExists = yield folderPermissionsService.findOnePermission(Number(id));
                if (!folderPermissionExists) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Folder permission not found", 404, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, folderPermissionExists, true, "Folder permission fetched successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong", 500, req.headers.start_time);
            }
        });
    }
}
exports.default = new FolderPermissionsController();
