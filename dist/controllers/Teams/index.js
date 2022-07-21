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
const responseHelper_1 = require("../../helpers/responseHelper");
const Teams_1 = __importDefault(require("../../services/Teams"));
class TeamController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name } = req.body;
            if (!email) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "Email is required", 400, req.headers.start_time);
            }
            if (!name) {
                return (0, responseHelper_1.buildResponse)(res, null, false, "Name is required", 400, req.headers.start_time);
            }
            try {
                const teamServices = new Teams_1.default();
                const inputValidation = yield teamServices.validateInput(name, email);
                if (!inputValidation.valid) {
                    return (0, responseHelper_1.buildResponse)(res, null, false, inputValidation.message, 400, req.headers.start_time);
                }
                const createdUser = yield teamServices.create(name, email);
                return (0, responseHelper_1.buildResponse)(res, createdUser, true, "Team and master user created successfully", 200, req.headers.start_time);
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
            try {
                const teamService = new Teams_1.default();
                teamService.delete(Number(user.team_id));
                return (0, responseHelper_1.buildResponse)(res, null, true, "Team deleted successfully", 200, req.headers.start_time);
            }
            catch (error) {
                console.log(error);
                return (0, responseHelper_1.buildResponse)(res, null, false, "Something went wrong. Internal server error", 500, req.headers.start_time);
            }
        });
    }
}
exports.default = new TeamController();
