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
const Users_1 = __importDefault(require("../../models/Users"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserServices {
    constructor(team_id) {
        this.team_id = team_id;
    }
    create(email, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = process.env.AES_SIGNUP_KEY;
            const ciphertext = crypto_js_1.default.AES.encrypt(JSON.stringify(email.length * Math.random() * Date.now()), key).toString();
            const payload = ciphertext.slice(5, 25);
            const hashedPassword = yield bcrypt_1.default.hash(payload, 10);
            const newUser = yield Users_1.default.create({
                email,
                password: hashedPassword,
                role: "DEV",
                team_id: this.team_id,
            });
            return Object.assign(Object.assign({}, newUser), { password: payload });
        });
    }
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.default.findByEmail(email);
            if (user.length > 0) {
                return { valid: true, message: "Valid input" };
            }
            return { valid: false, message: "Invalid input" };
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield Users_1.default.findAll(this.team_id);
            return users;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.default.findById(id, this.team_id);
            return user;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.default.findById(id, this.team_id);
            if (!user) {
                return { deleted: false };
            }
            const deleted = yield Users_1.default.delete(id, this.team_id);
            return deleted;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield Users_1.default.update(id, data);
            return updated;
        });
    }
}
exports.default = UserServices;
