import AWS from "aws-sdk";
import crypto from "crypto";
import { iStoragedFile } from "../../../interfaces/File/iFile";

class AwsService {
  s3: any;
  bucket: string | undefined;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_BUCKET;
  }

  async uploadFile(file: any): Promise<iStoragedFile> {
    try {
      const hash = crypto.randomInt(99999999).toString();
      const filename =
        file.originalname.split(".")[0].replace(/[^a-z0-9]/gi, "") +
        "-" +
        hash +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];

      const data = await this.s3
        .upload({
          Bucket: this.bucket,
          Key: filename,
          Body: file.buffer,
          ACL: "public-read",
        })
        .promise();
      return {
        valid: true,
        data: {
          url: data.Location,
          file_name: data.key,
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

export default AwsService;
