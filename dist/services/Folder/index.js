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
const Folder_1 = __importDefault(require("../../models/Folder"));
const Folder_2 = __importDefault(require("../Permissions/Folder"));
const File_1 = __importDefault(require("../../models/File"));
class FolderServices {
    constructor(team_id) {
        this.team_id = team_id;
    }
    create(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.dir != 0) {
                const folder = yield Folder_1.default.findById(this.team_id, Number(data.dir));
                if (!folder) {
                    return { valid: false, message: "Directory not found" };
                }
                const folderPermissionsService = new Folder_2.default(user);
                const folderIsValid = yield folderPermissionsService.verifySingleWrite(data.dir);
                if (!folderIsValid) {
                    return {
                        valid: false,
                        message: "You don't have permission to create folders in this folder",
                    };
                }
            }
            const new_folder = yield Folder_1.default.insert(Object.assign(Object.assign({}, data), { team_id: this.team_id }));
            return {
                valid: true,
                data: new_folder,
                message: "Folder created successfully",
            };
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = yield Folder_1.default.findAll(this.team_id);
            return folders;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = yield Folder_1.default.findById(this.team_id, id);
            return folder;
        });
    }
    findByName() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    findAllInDirectory(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dir != 0) {
                const folder = yield Folder_1.default.findById(this.team_id, dir);
                if (!folder)
                    return { valid: false, message: "Directory not found" };
            }
            const folders = yield Folder_1.default.findByDist(this.team_id, dir);
            return { valid: true, data: folders, message: "Folders found" };
        });
    }
    updateFolder(id, data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = yield Folder_1.default.findById(this.team_id, id);
            if (!folder)
                return { valid: false, message: "Folder not found" };
            if (data.dir) {
                const folder = yield Folder_1.default.findById(this.team_id, data.dir);
                if (!folder) {
                    return { valid: false, message: "Directory not found" };
                }
                const folderPermissionsService = new Folder_2.default(user);
                const folderIsValid = yield folderPermissionsService.verifySingleWrite(data.dir);
                if (!folderIsValid) {
                    return {
                        valid: false,
                        message: "You don't have permission to create folders in this folder",
                    };
                }
            }
            const updated_folder = yield Folder_1.default.update(Object.assign(Object.assign({}, data), { updated_at: new Date() }), id, this.team_id);
            return {
                data: updated_folder,
                valid: true,
                message: "Folder updated successfully",
            };
        });
    }
    delete(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = yield Folder_1.default.findById(this.team_id, id);
            if (!folder)
                return { valid: false, message: "Folder not found" };
            const foldersInside = yield Folder_1.default.findByDist(this.team_id, id);
            if (foldersInside.length > 0) {
                return { valid: false, message: "Folder is not empty" };
            }
            const filesInside = yield File_1.default.getFiles({
                folder: id,
                team_id: this.team_id,
            });
            if (filesInside.length > 0) {
                return { valid: false, message: "Folder is not empty" };
            }
            const folderPermissionsService = new Folder_2.default(user);
            const folderIsValid = yield folderPermissionsService.verifyDelete(id);
            if (!folderIsValid) {
                return {
                    valid: false,
                    message: "You don't have permission to delete this folder",
                };
            }
            yield Folder_1.default.delete(id, this.team_id);
            return { valid: true, message: "Folder deleted successfully" };
        });
    }
}
exports.default = FolderServices;
