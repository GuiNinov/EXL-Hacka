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
class Teams {
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("team").where({ name });
            return res;
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("team").returning("*").insert(data);
            return res[0];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, pg_1.default)("team").where({ id }).del();
            return res;
        });
    }
}
exports.default = new Teams();
