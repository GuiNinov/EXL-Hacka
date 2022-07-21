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
const storage_1 = require("@google-cloud/storage");
const storage_blob_1 = require("@azure/storage-blob");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
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
                const repos = yield this.createRepos(name);
                return Object.assign(Object.assign({}, user), { team_name: team.name, repositories: repos });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createRepos(team_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const azure_blob = yield this.createBlob(team_name);
            const aws_bucket = yield this.createAwsBucket(team_name);
            const gcp_bucket = yield this.createGcpBucket(team_name);
            const do_spaces = yield this.createSpaces(team_name);
            return {
                "azure_blob": {
                    "name": azure_blob,
                    "created_at": new Date().toISOString()
                },
                "aws_bucket": {
                    "name": aws_bucket,
                    "created_at": new Date().toISOString()
                },
                "gcp_bucket": {
                    "name": gcp_bucket,
                    "created_at": new Date().toISOString()
                },
                "do_spaces": {
                    "name": do_spaces,
                    "created_at": new Date().toISOString()
                }
            };
        });
    }
    createBlob(team_name) {
        return __awaiter(this, void 0, void 0, function* () {
            let con_string = process.env.AZURE_STORAGE_CONNECTION_STRING;
            const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(con_string);
            const containerClient = blobServiceClient.getContainerClient(team_name);
            console.log(`Azure Blob ${containerClient.containerName} created.`);
            return containerClient.containerName;
        });
    }
    createAwsBucket(team_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const aws_bucket_name = team_name;
            new aws_sdk_1.default.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
                region: process.env.AWS_REGION,
            });
            const bucket = aws_bucket_name;
            console.log(`AWS Bucket ${bucket} created.`);
            return bucket;
        });
    }
    createGcpBucket(team_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucket_name = team_name;
            const storage = new storage_1.Storage({
                projectId: process.env.GCP_PROJECT_ID,
                keyFilename: "gcpKey.json",
            });
            const [bucket] = yield storage.createBucket(bucket_name, {
                location: 'US',
                storageClass: 'STANDARD',
            });
            const options = {
                entity: 'allUsers',
                role: storage.acl.OWNER_ROLE
            };
            bucket.acl.add(options, function (err, aclObject) {
                return console.log(err, aclObject);
            });
            console.log(`GCP Bucket ${bucket.name} created.`);
            return bucket.name;
        });
    }
    createSpaces(team_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const do_endpoint = process.env.DO_SPACES_ENDPOINT;
            const spacesEndpoint = new aws_sdk_1.default.Endpoint(do_endpoint);
            const do_space_name = team_name;
            new aws_sdk_1.default.S3({
                endpoint: spacesEndpoint,
                accessKeyId: process.env.DO_SPACES_KEY,
                secretAccessKey: process.env.DO_SPACES_SECRET,
            });
            const bucket = do_space_name;
            console.log(`DO Spaces ${bucket} created.`);
            return bucket;
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
