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
class FolderPermissions {
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder_permissions")
                .returning([
                "id",
                "folder_id",
                "user_id",
                "block_read",
                "block_write",
                "block_delete",
                "allow_read_till",
                "allow_write_till",
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
            const res = yield (0, pg_1.default)("folder_permissions")
                .where({ user_id: userId, team_id })
                .returning([
                "id",
                "folder_id",
                "user_id",
                "block_read",
                "block_write",
                "block_delete",
                "allow_read_till",
                "allow_write_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ]);
            return res;
        });
    }
    findByFolderId(folderId, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder_permissions")
                .where({ folder_id: folderId, team_id })
                .returning([
                "id",
                "folder_id",
                "user_id",
                "block_read",
                "block_write",
                "block_delete",
                "allow_read_till",
                "allow_write_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ]);
            return res;
        });
    }
    findByFolderIdAndUserId(folderId, userId, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder_permissions")
                .where({ folder_id: folderId, user_id: userId, team_id })
                .returning([
                "id",
                "folder_id",
                "user_id",
                "block_read",
                "block_write",
                "block_delete",
                "allow_read_till",
                "allow_write_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ]);
            return res;
        });
    }
    update(id, data, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder_permissions")
                .where({ id: id, team_id })
                .returning([
                "id",
                "folder_id",
                "user_id",
                "block_read",
                "block_write",
                "block_delete",
                "allow_read_till",
                "allow_write_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ])
                .update(data);
            return res[0];
        });
    }
    delete(id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder_permissions")
                .where({ id, team_id })
                .returning([
                "id",
                "folder_id",
                "user_id",
                "block_read",
                "block_write",
                "block_delete",
                "allow_read_till",
                "allow_write_till",
                "allow_delete_till",
                "access_till",
                "created_at",
                "updated_at",
            ])
                .del();
            return res[0];
        });
    }
    findById(id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("folder_permissions")
                .where({ id, team_id })
                .returning([
                "id",
                "folder_id",
                "user_id",
                "block_read",
                "block_write",
                "block_delete",
                "allow_read_till",
                "allow_write_till",
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
            const res = yield (0, pg_1.default)("folder_permissions")
                .where({ team_id: teamId })
                .select("id", "folder_id", "user_id", "block_read", "block_write", "block_delete", "allow_read_till", "allow_write_till", "allow_delete_till", "access_till", "created_at", "updated_at");
            return res;
        });
    }
}
exports.default = new FolderPermissions();
