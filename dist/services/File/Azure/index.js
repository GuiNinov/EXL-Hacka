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
const crypto_1 = __importDefault(require("crypto"));
const storage_blob_1 = require("@azure/storage-blob");
class AzureService {
    constructor() {
        let con_string = process.env.AZURE_STORAGE_CONNECTION_STRING;
        this.container = process.env.AZURE_CONTAINER_NAME;
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(con_string);
        this.containerClient = blobServiceClient.getContainerClient(this.container);
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash = crypto_1.default.randomInt(99999999).toString();
                const filename = file.originalname.split(".")[0] +
                    "-" +
                    hash +
                    "." +
                    file.originalname.split(".")[file.originalname.split(".").length - 1];
                const blockBlobClient = this.containerClient.getBlockBlobClient(filename);
                const response = yield blockBlobClient.uploadData(file.buffer);
                if (response._response.status !== 201) {
                    throw new Error(`Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`);
                }
                return {
                    valid: true,
                    data: {
                        url: response._response.request.url,
                        file_name: filename,
                        original_name: file.originalname,
                    },
                };
            }
            catch (error) {
                console.log(error);
                return {
                    valid: false,
                };
            }
        });
    }
}
exports.default = AzureService;
