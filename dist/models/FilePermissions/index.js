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
class FilePermissions {
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file_permissions")
                .returning([
                "id",
                "file_id",
                "user_id",
                "block_read",
                "block_update",
                "block_delete",
                "allow_read_till",
                "allow_update_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ])
                .insert(data);
            return res[0];
        });
    }
    findByUserId(userId, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file_permissions")
                .where({ user_id: userId, team_id })
                .returning([
                "id",
                "file_id",
                "user_id",
                "block_read",
                "block_update",
                "block_delete",
                "allow_read_till",
                "allow_update_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ]);
            return res;
        });
    }
    findByFileId(fileId, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file_permissions")
                .where({ file_id: fileId, team_id })
                .returning([
                "id",
                "file_id",
                "user_id",
                "block_read",
                "block_update",
                "block_delete",
                "allow_read_till",
                "allow_update_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ]);
            return res;
        });
    }
    findByUserIdAndFileId(userId, fileId, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file_permissions")
                .where({ user_id: userId, file_id: fileId, team_id })
                .returning([
                "id",
                "file_id",
                "user_id",
                "block_read",
                "block_update",
                "block_delete",
                "allow_read_till",
                "allow_update_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ]);
            return res;
        });
    }
    delete(id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file_permissions")
                .where({ id, team_id })
                .returning([
                "id",
                "file_id",
                "user_id",
                "block_read",
                "block_update",
                "block_delete",
                "allow_read_till",
                "allow_update_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ])
                .del();
            return res[0];
        });
    }
    update(id, data, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file_permissions")
                .where({ id, team_id })
                .returning([
                "id",
                "file_id",
                "user_id",
                "block_read",
                "block_update",
                "block_delete",
                "allow_read_till",
                "allow_update_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ])
                .update(data);
            return res[0];
        });
    }
    findById(id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file_permissions")
                .where({ id, team_id })
                .returning([
                "id",
                "file_id",
                "user_id",
                "block_read",
                "block_update",
                "block_delete",
                "allow_read_till",
                "allow_update_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ]);
            return res[0];
        });
    }
    findByTeamId(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("file_permissions")
                .where({ team_id: teamId })
                .returning([
                "id",
                "file_id",
                "user_id",
                "block_read",
                "block_update",
                "block_delete",
                "allow_read_till",
                "allow_update_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ])
                .orderBy("id", "desc");
            return res;
        });
    }
}
exports.default = new FilePermissions();
