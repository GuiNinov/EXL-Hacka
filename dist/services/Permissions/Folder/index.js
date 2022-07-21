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
const FolderPermissions_1 = __importDefault(require("../../../models/FolderPermissions"));
class FolderPermissionsService {
    constructor(user) {
        this.user = user;
    }
    createNewPermission(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FolderPermissions_1.default.insert({
                folder_id: data === null || data === void 0 ? void 0 : data.folder_id,
                user_id: data === null || data === void 0 ? void 0 : data.user_id,
                block_read: data === null || data === void 0 ? void 0 : data.block_read,
                block_write: data === null || data === void 0 ? void 0 : data.block_write,
                block_delete: data === null || data === void 0 ? void 0 : data.block_delete,
                allow_read_till: data === null || data === void 0 ? void 0 : data.allow_read_till,
                allow_write_till: data.allow_write_till,
                allow_delete_till: data.allow_delete_till,
                access_till: data.access_till,
                team_id: Number(this.user.team_id),
            });
            return res;
        });
    }
    verifySingleRead(folder_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.role == "ADMIN")
                return true;
            const userPermissions = yield FolderPermissions_1.default.findByFolderIdAndUserId(folder_id, Number(this.user.id), Number(this.user.team_id));
            let allow = true;
            userPermissions.map((permission) => {
                if (permission.folder_id == folder_id) {
                    if (permission.block_read)
                        allow = false;
                    if (permission.allow_read_till) {
                        const now = new Date();
                        const access_till = new Date(permission.access_till);
                        if (access_till && now > access_till)
                            allow = false;
                    }
                }
            });
            return allow;
        });
    }
    verifyMultipleReads(folders) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.role == "ADMIN")
                return folders;
            const allowedFolders = [];
            yield Promise.all(folders.map((folder) => __awaiter(this, void 0, void 0, function* () {
                const allow = yield this.verifySingleRead(Number(folder.id));
                if (allow)
                    allowedFolders.push(folder);
            })));
            return allowedFolders;
        });
    }
    verifySingleWrite(folder_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.role == "ADMIN")
                return true;
            let allow = true;
            const userPermissions = yield FolderPermissions_1.default.findByFolderIdAndUserId(folder_id, Number(this.user.id), Number(this.user.team_id));
            userPermissions.map((permission) => {
                if (permission.block_write)
                    allow = false;
                if (permission.allow_write_till) {
                    const now = new Date();
                    const access_till = new Date(permission.access_till);
                    if (access_till && now > access_till)
                        allow = false;
                }
            });
            return allow;
        });
    }
    verifyDelete(folder_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.role == "ADMIN")
                return true;
            let allow = true;
            const userPermissions = yield FolderPermissions_1.default.findByFolderIdAndUserId(folder_id, Number(this.user.id), Number(this.user.team_id));
            userPermissions.map((permission) => {
                if (permission.block_delete)
                    allow = false;
                if (permission.allow_delete_till) {
                    const now = new Date();
                    const access_till = new Date(permission.access_till);
                    if (now > access_till)
                        allow = false;
                }
            });
            return allow;
        });
    }
    updatePermission(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FolderPermissions_1.default.update(id, data, Number(this.user.team_id));
            return res;
        });
    }
    deletePermission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FolderPermissions_1.default.delete(id, Number(this.user.team_id));
            return;
        });
    }
    findOnePermission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FolderPermissions_1.default.findById(id, Number(this.user.team_id));
            return res;
        });
    }
    listAllTeamPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FolderPermissions_1.default.findByTeamId(Number(this.user.team_id));
            return res;
        });
    }
    findAllByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FolderPermissions_1.default.findByUserId(user_id, Number(this.user.team_id));
            return res;
        });
    }
    findAllByFolderId(folder_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FolderPermissions_1.default.findByFolderId(folder_id, Number(this.user.team_id));
            return res;
        });
    }
    findAllByFolderIdAndUserId(folder_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield FolderPermissions_1.default.findByFolderIdAndUserId(folder_id, user_id, Number(this.user.team_id));
            return res;
        });
    }
}
exports.default = FolderPermissionsService;
