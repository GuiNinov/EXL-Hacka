import AWS from "aws-sdk";
import crypto from "crypto";
import { iStoragedFile } from "../../../interfaces/File/iFile";

class DigitalOceanService {
  s3: any;
  bucket: string | undefined;

  constructor() {
    const do_endpoint: any = process.env.DO_SPACES_ENDPOINT;
    const spacesEndpoint = new AWS.Endpoint(do_endpoint);
    this.bucket = process.env.DO_SPACES_NAME;
    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });
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
      console.log(error);
      return {
        valid: false,
      };
    }
  }
}

export default DigitalOceanService;
