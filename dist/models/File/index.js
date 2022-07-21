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
class File {
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file")
                .returning([
                "id",
                "url",
                "file_name",
                "storaged_at",
                "folder",
                "created_at",
                "updated_at",
                "elapsed_time",
                "user_id",
                "team_id",
            ])
                .insert(data);
            return res[0];
        });
    }
    getFiles(filters, file_name) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            if (file_name) {
                res = yield (0, pg_1.default)("file")
                    .select("id", "url", "file_name", "storaged_at", "folder", "created_at", "updated_at", "elapsed_time", "user_id", "team_id")
                    .where(Object.assign(Object.assign({}, filters), { deleted: false }))
                    .andWhere("file_name", "like", `%${file_name}%`);
            }
            else {
                res = yield (0, pg_1.default)("file")
                    .select("id", "url", "file_name", "storaged_at", "folder", "created_at", "updated_at", "elapsed_time", "user_id", "team_id")
                    .where(Object.assign(Object.assign({}, filters), { deleted: false }));
            }
            return res;
        });
    }
    getFile(team_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file")
                .select("id", "url", "file_name", "storaged_at", "folder", "created_at", "updated_at", "elapsed_time", "user_id", "team_id")
                .where({ id, team_id, deleted: false });
            return res[0];
        });
    }
    deleteFile(team_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, pg_1.default)("file")
                    .update({ deleted: true })
                    .where({ id, team_id });
                return { valid: true };
            }
            catch (error) {
                return { valid: false };
            }
        });
    }
    update(data, id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file")
                .returning([
                "id",
                "url",
                "file_name",
                "storaged_at",
                "folder",
                "created_at",
                "updated_at",
                "elapsed_time",
                "user_id",
                "team_id",
            ])
                .update(data)
                .where({ id, team_id, deleted: false });
            return res[0];
        });
    }
}
exports.default = new File();
