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
const Teams_1 = __importDefault(require("../../models/Teams"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users_2 = __importDefault(require("../Users"));
class TeamServices {
    validateInput(name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameIsValid = yield this.validateName(name);
            const emailIsValid = yield this.validateEmail(email);
            if (!nameIsValid) {
                return { valid: false, message: "Team name already exists" };
            }
            if (!emailIsValid) {
                return { valid: false, message: "Email already exists" };
            }
            return { valid: true, message: "Valid input" };
        });
    }
    validateName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const teams = yield Teams_1.default.findByName(name);
            if (teams.length > 0) {
                return false;
            }
            return true;
        });
    }
    validateEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield Users_1.default.findByEmail(email);
            if (users.length > 0) {
                return false;
            }
            return true;
        });
    }
    create(name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const team = yield this.saveTeam(name);
                const user = yield this.saveNewUser(email, Number(team.id));
                return Object.assign(Object.assign({}, user), { team_name: team.name });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveTeam(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield Teams_1.default.insert({
                name,
            });
            return team;
        });
    }
    saveNewUser(email, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = process.env.AES_SIGNUP_KEY;
            const ciphertext = crypto_js_1.default.AES.encrypt(JSON.stringify(email.length * Math.random() * Date.now()), key).toString();
            const payload = ciphertext.slice(5, 25);
            const hashedPassword = yield bcrypt_1.default.hash(payload, 10);
            const user = yield Users_1.default.create({
                email,
                team_id,
                password: hashedPassword,
                role: "ADMIN",
            });
            return Object.assign(Object.assign({}, user), { password: payload });
        });
    }
    delete(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userServices = new Users_2.default(team_id);
                const users = yield userServices.findAll();
                yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    yield Users_1.default.delete(Number(user.id));
                })));
                yield Teams_1.default.delete(team_id);
                return;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = TeamServices;
