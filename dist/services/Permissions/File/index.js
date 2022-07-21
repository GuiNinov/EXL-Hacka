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
const FilePermissions_1 = __importDefault(require("../../../models/FilePermissions"));
const Folder_1 = __importDefault(require("../Folder"));
class FilePermissionsService {
    constructor(user) {
        this.user = user;
    }
    createNewPermission(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FilePermissions_1.default.insert({
                file_id: data.file_id,
                user_id: data.user_id,
                block_read: data.block_read,
                block_update: data.block_update,
                block_delete: data.block_delete,
                allow_read_till: data.allow_read_till,
                allow_update_till: data.allow_update_till,
                allow_delete_till: data.allow_delete_till,
                access_till: data.access_till,
                created_at: data.created_at,
                updated_at: data.updated_at,
                team_id: data.team_id,
            });
            return res;
        });
    }
    verifyMultipleReads(files) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.role == "ADMIN") {
                return files;
            }
            const userPermissions = yield FilePermissions_1.default.findByUserId(Number(this.user.id), Number(this.user.team_id));
            const folderPermissionsService = new Folder_1.default(this.user);
            const folderPermissions = yield folderPermissionsService.findAllByUserId(Number(this.user.id));
            let allowedFiles = [];
            for (let i = 0; i < files.length; i++) {
                let allow = true;
                userPermissions.map((permission) => {
                    if (permission.file_id == files[i].id) {
                        if (permission.block_read)
                            allow = false;
                        if (permission.allow_read_till) {
                            if (permission.access_till < new Date())
                                allow = false;
                        }
                    }
                });
                folderPermissions.map((permission) => {
                    if (permission.folder_id == files[i].folder) {
                        if (permission.block_read)
                            allow = false;
                        if (permission.allow_read_till) {
                            if (permission.access_till && permission.access_till < new Date())
                                allow = false;
                        }
                    }
                });
                if (allow)
                    allowedFiles.push(files[i]);
            }
            return allowedFiles;
        });
    }
    verifySingleRead(file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.role == "ADMIN") {
                return true;
            }
            const userPermissions = yield FilePermissions_1.default.findByUserIdAndFileId(Number(this.user.id), file_id, Number(this.user.team_id));
            let allow = true;
            userPermissions.map((permission) => {
                if (permission.block_read) {
                    allow = false;
                }
                if (permission.allow_read_till) {
                    if (permission.access_till < new Date()) {
                        allow = false;
                    }
                }
            });
            return allow;
        });
    }
    verifyUpload(file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.role == "ADMIN") {
                return true;
            }
            const userPermissions = yield FilePermissions_1.default.findByUserIdAndFileId(Number(this.user.id), file_id, Number(this.user.team_id));
            let allow = true;
            userPermissions.map((permission) => {
                if (permission.file_id == file_id) {
                    if (permission.block_update) {
                        allow = false;
                    }
                    if (permission.allow_update_till) {
                        if (permission.access_till < new Date()) {
                            allow = false;
                        }
                    }
                }
            });
            return allow;
        });
    }
    verifyDelete(file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.role == "ADMIN") {
                return true;
            }
            const userPermissions = yield FilePermissions_1.default.findByUserIdAndFileId(Number(this.user.id), file_id, Number(this.user.team_id));
            let allow = true;
            userPermissions.map((permission) => {
                if (file_id == permission.file_id) {
                    if (permission.block_delete) {
                        allow = false;
                    }
                    if (permission.allow_delete_till) {
                        if (permission.access_till < new Date()) {
                            allow = false;
                        }
                    }
                }
            });
            return allow;
        });
    }
    updatePermission(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FilePermissions_1.default.update(id, Object.assign(Object.assign({}, data), { updated_at: new Date() }), Number(this.user.team_id));
            return res;
        });
    }
    deletePermission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FilePermissions_1.default.delete(id, Number(this.user.team_id));
            return;
        });
    }
    listAllTeamPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FilePermissions_1.default.findByTeamId(Number(this.user.team_id));
            return res;
        });
    }
    findOnePermission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FilePermissions_1.default.findById(id, Number(this.user.team_id));
            return res;
        });
    }
    findAllByUserIdAndFileId(user_id, file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FilePermissions_1.default.findByUserIdAndFileId(user_id, file_id, Number(this.user.team_id));
            return res;
        });
    }
    findAllByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FilePermissions_1.default.findByUserId(user_id, Number(this.user.team_id));
            return res;
        });
    }
    findAllByFileId(file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FilePermissions_1.default.findByFileId(file_id, Number(this.user.team_id));
            return res;
        });
    }
}
exports.default = FilePermissionsService;
