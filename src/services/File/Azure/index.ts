import AWS from "aws-sdk";
import crypto from "crypto";
import { iStoragedFile } from "../../../interfaces/File/iFile";
import { BlobServiceClient } from "@azure/storage-blob";
class AzureService {
  containerClient: any;
  container: any;

  constructor() {
    let con_string: any = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.container = process.env.AZURE_CONTAINER_NAME;

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(con_string);
    this.containerClient = blobServiceClient.getContainerClient(this.container);
  }

  async uploadFile(file: any): Promise<iStoragedFile> {
    try {
      const hash = crypto.randomInt(99999999).toString();

      // Tratar o possível erro de nome de arquivos com . lá no meio
      const filename =
        file.originalname.split(".")[0] +
        "-" +
        hash +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];

      const blockBlobClient = this.containerClient.getBlockBlobClient(filename);
      const response = await blockBlobClient.uploadData(file.buffer);

      if (response._response.status !== 201) {
        throw new Error(
          `Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`
        );
      }

      return {
        valid: true,
        data: {
          url: response._response.request.url,
          file_name: filename,
          original_name: file.originalname,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        valid: false,
      };
    }
  }
}

export default AzureService;
