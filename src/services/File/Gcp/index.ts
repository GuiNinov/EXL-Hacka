import { Storage } from "@google-cloud/storage";
import crypto from "crypto";
import { iStoragedFile } from "../../../interfaces/File/iFile";
import { format } from "util";
class GcpService {
  storage: any;
  bucket: any;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: "gcpKey.json",
    });

    this.bucket = this.storage.bucket(process.env.GCP_BUCKET);
  }

  async uploadFile(file: any) {
    try {
      const hash = crypto.randomInt(9999999).toString();
      const filename =
        file.originalname.split(".")[0].replace(/[^a-z0-9]/gi, "") +
        "-" +
        hash +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];

      const blob = this.bucket.file(filename);
      const blobStream = blob.createWriteStream();

      blobStream.end(file.buffer);

      const publicUrl = format(
        `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`
      );

      return {
        valid: true,
        data: {
          url: publicUrl,
          file_name: blob.name,
          original_name: file.originalname,
        },
      };
    } catch (error) {
      return {
        valid: false,
      };
    }
  }
}

export default GcpService;
