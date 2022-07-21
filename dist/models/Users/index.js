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
const pg_1 = __importDefault(require("../../database/pg"));
class User {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("users")
                .returning(["id", "email", "role", "team_id", "created_at", "updated_at"])
                .insert(data);
            return res[0];
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("users")
                .returning(["id", "email", "role", "team_id", "created_at", "updated_at"])
                .update(data)
                .where("id", id)
                .andWhere("deleted", false);
            return res[0];
        });
    }
    findAll(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("users")
                .select("id", "email", "role", "team_id", "created_at", "updated_at")
                .where({ deleted: false, team_id });
            return res;
        });
    }
    findById(id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [{}];
            if (team_id) {
                res = yield (0, pg_1.default)("users")
                    .select("id", "email", "role", "team_id", "created_at", "updated_at")
                    .where({ id, team_id, deleted: false });
            }
            else {
                res = yield (0, pg_1.default)("users")
                    .select("id", "email", "role", "team_id", "created_at", "updated_at")
                    .where({ id, deleted: false });
            }
            return res[0];
        });
    }
    findByEmail(email, format) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("users")
                .where("email", email)
                .andWhere("deleted", false);
            if (res.length && format) {
                res[0].password = "";
            }
            return res;
        });
    }
    delete(id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, pg_1.default)("users").update({ deleted: true }).where({ id, team_id });
                return { deleted: true };
            }
            catch (_a) {
                return { deleted: false };
            }
        });
    }
}
exports.default = new User();
