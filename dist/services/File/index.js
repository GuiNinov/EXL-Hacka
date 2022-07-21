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
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const File_1 = __importDefault(require("../../models/File"));
const fomartData_1 = require("../../helpers/fomartData");
const Aws_1 = __importDefault(require("./Aws"));
const Gcp_1 = __importDefault(require("./Gcp"));
const Azure_1 = __importDefault(require("./Azure"));
const DigitalOcean_1 = __importDefault(require("./DigitalOcean"));
const Folder_1 = __importDefault(require("../../models/Folder"));
const Folder_2 = __importDefault(require("../Permissions/Folder"));
const Users_1 = __importDefault(require("../Users"));
class FileServices {
    constructor(user_id, team_id) {
        this.user = user_id;
        this.team = team_id;
    }
    saveFile(file, start_at, storaged_at, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (folder) {
                const folderExists = yield Folder_1.default.findById(this.team, folder);
                if (!folderExists) {
                    return {
                        valid: false,
                        data: null,
                        message: "Folder not found. Please, try to create a new folder first or select an existing one.",
                    };
                }
                const userServices = new Users_1.default(this.team);
                const user = yield userServices.findById(this.user);
                const folderPermissionsService = new Folder_2.default(user);
                const folderIsValid = yield folderPermissionsService.verifySingleWrite(folder);
                if (!folderIsValid) {
                    return {
                        valid: false,
                        data: null,
                        message: "You don't have permission to save files in this folder",
                    };
                }
            }
            else
                folder = 0;
            let storagedFile;
            switch (storaged_at) {
                case "gcp":
                    const gcpService = new Gcp_1.default();
                    storagedFile = yield gcpService.uploadFile(file);
                    break;
                case "azure":
                    const azureService = new Azure_1.default();
                    storagedFile = yield azureService.uploadFile(file);
                    break;
                case "digital_ocean":
                    const digitalOceanService = new DigitalOcean_1.default();
                    storagedFile = yield digitalOceanService.uploadFile(file);
                    break;
                default:
                    const awsService = new Aws_1.default();
                    storagedFile = yield awsService.uploadFile(file);
                    break;
            }
            if (!storagedFile.valid) {
                return { valid: false, message: "" };
            }
            const savedFile = yield this.saveToDb(storagedFile, storaged_at, start_at, folder);
            return {
                valid: true,
                data: savedFile,
                message: "File saved successfully",
            };
        });
    }
    saveToDb(fileData, storaged_at = "aws", start_at, folder) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedFile = yield File_1.default.insert({
                    file_name: (_a = fileData === null || fileData === void 0 ? void 0 : fileData.data) === null || _a === void 0 ? void 0 : _a.file_name,
                    url: (_b = fileData === null || fileData === void 0 ? void 0 : fileData.data) === null || _b === void 0 ? void 0 : _b.url,
                    storaged_at,
                    elapsed_time: Number((0, fomartData_1.diffBetweenDatesInMs)(new Date(), new Date(start_at))),
                    folder,
                    user_id: this.user,
                    team_id: this.team,
                });
                return savedFile;
            }
            catch (error) {
                console.log("Error while saving file to db");
                console.log(error);
                return {
                    valid: true,
                    data: null,
                    message: "Error while saving the file ",
                };
            }
        });
    }
    getFiles(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = { team_id: this.team };
                if (data === null || data === void 0 ? void 0 : data.folder)
                    filters.folder = data.folder;
                if (data === null || data === void 0 ? void 0 : data.storaged_at)
                    filters.storaged_at = data.storaged_at;
                if (data === null || data === void 0 ? void 0 : data.user_id)
                    filters.user_id = data.user_id;
                let files = [];
                if (data === null || data === void 0 ? void 0 : data.file_name) {
                    files = yield File_1.default.getFiles(filters, data.file_name);
                }
                else {
                    files = yield File_1.default.getFiles(filters);
                }
                return {
                    valid: true,
                    data: files,
                    message: "Files fetched successfully",
                };
            }
            catch (error) {
                console.log("Error while fetching files");
                console.log(error);
                return {
                    valid: false,
                    data: null,
                    message: "Error while fetching files",
                };
            }
        });
    }
    getFile(file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield File_1.default.getFile(this.team, file_id);
                return {
                    valid: true,
                    data: file,
                    message: "File fetched successfully",
                };
            }
            catch (error) {
                console.log("Error while fetching file");
                console.log(error);
                return {
                    valid: false,
                    data: null,
                    message: "Error while fetching file",
                };
            }
        });
    }
    deleteFile(file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield File_1.default.deleteFile(this.team, file_id);
            if (!file.valid) {
                return {
                    valid: false,
                    data: null,
                    message: "Error while deleting file",
                };
            }
            return {
                valid: true,
                data: null,
                message: "File deleted successfully",
            };
        });
    }
    download(url, dest, cb) {
        const file = fs_1.default.createWriteStream(dest);
        const request = https_1.default
            .get(url, function (response) {
            response.pipe(file);
            file.on("finish", function () {
                file.close(cb);
            });
        })
            .on("error", function (err) {
            fs_1.default.unlink(dest, (err) => { });
            if (cb)
                cb(err.message);
        });
    }
    updateFile(file_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.folder) {
                    const folderExists = yield Folder_1.default.findById(this.team, data.folder);
                    if (!folderExists) {
                        return {
                            valid: false,
                            data: null,
                            message: "Folder not found. Please, try to create a new folder first or select an existing one.",
                        };
                    }
                    const userServices = new Users_1.default(this.team);
                    const user = yield userServices.findById(this.user);
                    const folderPermissionsService = new Folder_2.default(user);
                    const folderIsValid = yield folderPermissionsService.verifySingleWrite(data.folder);
                    if (!folderIsValid) {
                        return {
                            valid: false,
                            data: null,
                            message: "You don't have permission to save files in this folder",
                        };
                    }
                }
                const updatedFile = yield File_1.default.update(Object.assign(Object.assign({}, data), { updated_at: new Date() }), file_id, this.team);
                return {
                    valid: true,
                    data: updatedFile,
                    message: "File updated successfully",
                };
            }
            catch (error) {
                console.log("Error while updating file");
                console.log(error);
                return {
                    valid: false,
                    data: null,
                    message: "Error while updating file",
                };
            }
        });
    }
}
exports.default = FileServices;
