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
class Folder {
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder")
                .returning(["id", "name", "dir", "team_id", "created_at", "updated_at"])
                .insert(data);
            return res[0];
        });
    }
    findById(team_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder")
                .select("id", "name", "dir", "team_id", "created_at", "updated_at")
                .where({
                team_id,
                id,
                deleted: false,
            });
            return res[0];
        });
    }
    findByDist(team_id, dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder")
                .select("id", "name", "dir", "team_id", "created_at", "updated_at")
                .where({
                team_id,
                dir,
                deleted: false,
            });
            return res;
        });
    }
    findAll(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder")
                .select("id", "name", "dir", "team_id", "created_at", "updated_at")
                .where({
                team_id,
                deleted: false,
            });
            return res;
        });
    }
    update(data, id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder")
                .returning(["id", "name", "dir", "team_id", "created_at", "updated_at"])
                .update(data)
                .where({
                team_id,
                id,
                deleted: false,
            });
            return res[0];
        });
    }
    delete(id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, pg_1.default)("folder")
                    .update({
                    deleted: true,
                })
                    .where({
                    team_id,
                    id,
                });
                return { deleted: true };
            }
            catch (error) {
                return { deleted: false };
            }
        });
    }
}
exports.default = new Folder();
