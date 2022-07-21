"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_1 = __importDefault(require("../../models/Users"));
const jwt = __importStar(require("../../config/jwt"));
const Users_2 = __importDefault(require("../../services/Users"));
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const { email } = req.body;
            if (!email) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "Email is required", 400, req.headers.start_time);
            }
            try {
                const userServices = new Users_2.default(Number(user.team_id));
                const inputValidation = yield userServices.verifyEmail(email);
                if (inputValidation.valid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Email already exists", 400, req.headers.start_time);
                }
                const createdUser = yield userServices.create(email, Number(user.team_id));
                return (0, responseHelper_1.buildResponse)(res, createdUser, true, "User created successfully", 201, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    signin(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [hashType, hash] = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ");
            if (hashType.trim() != "Basic") {
                return (0, responseHelper_1.buildResponse)(res, null, false, "Unauthorized!", 403, req.headers.start_time);
            }
            const [email, password] = Buffer.from(hash, "base64").toString().split(":");
            if (!email || !password) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "Email and password are required", 400, req.headers.start_time);
            }
            try {
                const user = yield Users_1.default.findByEmail(email);
                if (user.length == 0) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Invalid Email/Password", 400, req.headers.start_time);
                }
                const isValid = yield bcrypt_1.default.compare(password, user[0].password);
                if (!isValid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "Invalid Email/Password", 400, req.headers.start_time);
                }
                const token = jwt.sign({
                    user: user[0].id,
                }, 3600 * 24);
                return (0, responseHelper_1.buildResponse)(res, { token }, true, "User signed in successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const id = req.params.id;
            try {
                const userServices = new Users_2.default(Number(user.team_id));
                const deletedUser = yield userServices.delete(Number(id));
                if (!deletedUser.deleted) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "User not found", 404, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, null, true, "User deleted successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body.auth;
                const userServices = new Users_2.default(user.team_id);
                const users = yield userServices.findAll();
                return (0, responseHelper_1.buildResponse)(res, users, true, "Users retrieved successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const id = req.params.id;
            try {
                const userServices = new Users_2.default(Number(user.team_id));
                const result = yield userServices.findById(Number(id));
                if (!result) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "User not found", 404, req.headers.start_time);
                }
                return (0, responseHelper_1.buildResponse)(res, result, true, "User retrieved successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
    setRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.auth;
            const id = req.params.id;
            const role = req.body.role;
            if (role != "ADMIN" && role != "USER") {
                return (0, responseHelper_1.buildResponse)(res, null, false, "Invalid value for role", 400, req.headers.start_time);
            }
            try {
                const userServices = new Users_2.default(Number(user.team_id));
                const userExists = yield userServices.findById(Number(id));
                if (!userExists) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, "User not found", 404, req.headers.start_time);
                }
                const result = yield userServices.update(Number(id), { role });
                return (0, responseHelper_1.buildResponse)(res, result, true, "User role updated successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
}
exports.default = new UserController();
