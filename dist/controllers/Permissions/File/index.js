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
const File_1 = __importDefault(require("../../../services/Permissions/File"));
const File_2 = __importDefault(require("../../../services/File"));
const Users_1 = __importDefault(require("../../../services/Users"));
class FilePermissionsController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { file_id, user_id, permissions } = req.body;
            if (!file_id || !user_id || !permissions) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "File id, user id and permissions are required", 400, req.headers.start_time);
            }
            const fileServices = new File_2.default(user.id, user.team_id);
            const fileExists = yield fileServices.getFile(Number(file_id));
            if (!fileExists.data) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "File not found", 404, req.headers.start_time);
            }
            const userServices = new Users_1.default(user.team_id);
            const userExists = yield userServices.findById(Number(user_id));
            if (!userExists) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "User not found", 404, req.headers.start_time);
            }
            const { allow_read_till, allow_update_till, allow_delete_till } = permissions;
            if (allow_read_till || allow_update_till || allow_delete_till) {
                if (!permissions.access_till) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Access till date is required when `allow_read_till`, `allow_update_till` or `allow_delete_till` are true", 400, req.headers.start_time);
                }
            }
            try {
                const filePermissionsService = new File_1.default(user);
                const result = yield filePermissionsService.createNewPermission(Object.assign(Object.assign({ file_id,
                    user_id }, permissions), { team_id: user.team_id }));
                return (0, responseHelper_1.buildResponse)(res, result, true, "File permissions created successfully", 201, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    getAllFilePermissions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { user_id, file_id } = req.query;
            const filePermissionsService = new File_1.default(user);
            try {
                var result = [];
                if (user_id && file_id) {
                    result = yield filePermissionsService.findAllByUserIdAndFileId(Number(user_id), Number(file_id));
                }
                if (user_id && !file_id) {
                    result = yield filePermissionsService.findAllByUserId(Number(user_id));
                }
                if (!user_id && file_id) {
                    result = yield filePermissionsService.findAllByFileId(Number(file_id));
                }
                if (!user_id && !file_id) {
                    result = yield filePermissionsService.listAllTeamPermissions();
                }
                if (!result.length) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "File permissions not found", 404, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, result, true, "File permissions fetched successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    findOnePermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            try {
                const filePermissionsService = new File_1.default(user);
                const result = yield filePermissionsService.findOnePermission(Number(id));
                if (!result) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "File permissions not found", 404, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, result, true, "File permissions fetched successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    updatePermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            const { permissions } = req.body;
            const { allow_read_till, allow_update_till, allow_delete_till } = permissions;
            if (allow_read_till || allow_update_till || allow_delete_till) {
                if (!permissions.access_till) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Access till date is required when `allow_read_till`, `allow_update_till` or `allow_delete_till` are true", 400, req.headers.start_time);
                }
            }
            try {
                const filePermissionsService = new File_1.default(user);
                const filePermissionExists = yield filePermissionsService.findOnePermission(Number(id));
                if (!filePermissionExists) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "File permissions not found", 404, req.headers.start_time);
                }
                const result = yield filePermissionsService.updatePermission(Number(id), Object.assign({}, permissions));
                if (!result) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "File permissions not found", 404, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, result, true, "File permissions updated successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    deletePermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { id } = req.params;
            try {
                const filePermissionsService = new File_1.default(user);
                const filePermissionExists = yield filePermissionsService.findOnePermission(Number(id));
                if (!filePermissionExists) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "File permissions not found", 404, req.headers.start_time);
                }
                yield filePermissionsService.deletePermission(Number(id));
                return (0, responseHelper_1.buildResponse)(res, null, true, "File permissions deleted successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
}
exports.default = new FilePermissionsController();
