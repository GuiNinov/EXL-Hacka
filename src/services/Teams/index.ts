import Users from "../../models/Users";
import Teams from "../../models/Teams";
import iUser from "../../interfaces/User/iUser";
import iTeam from "../../interfaces/Team";
import Crypto from "crypto-js";
import bcrypt from "bcrypt";
import UserServices from "../Users";
import { Storage } from "@google-cloud/storage";
import { BlobServiceClient } from "@azure/storage-blob";
import AWS from "aws-sdk";

class TeamServices {
  public async validateInput(
    name: string,
    email: string
  ): Promise<{ valid: boolean; message: string }> {
    const nameIsValid = await this.validateName(name);
    const emailIsValid = await this.validateEmail(email);
    if (!nameIsValid) {
      return { valid: false, message: "Team name already exists" };
    }
    if (!emailIsValid) {
      return { valid: false, message: "Email already exists" };
    }
    return { valid: true, message: "Valid input" };
  }

  private async validateName(name: string): Promise<boolean> {
    const teams = await Teams.findByName(name);
    if (teams.length > 0) {
      return false;
    }
    return true;
  }

  private async validateEmail(email: string): Promise<boolean> {
    const users = await Users.findByEmail(email);
    if (users.length > 0) {
      return false;
    }
    return true;
  }

  public async create(name: string, email: string) {
    try {
      const team = await this.saveTeam(name);
      const user = await this.saveNewUser(email, Number(team.id));
      const repos = await this.createRepos(name);

      return { ...user, team_name: team.name, repositories: repos };

    } catch (error) {
      console.log(error);
    }
  }

  public async createRepos(team_name: string){
    const azure_blob = await this.createBlob(team_name);
    const aws_bucket = await this.createAwsBucket(team_name);
    const gcp_bucket = await this.createGcpBucket(team_name);
    const do_spaces = await this.createSpaces(team_name);

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
    }
  }

  private async createBlob(team_name: string){
    let con_string: any = process.env.AZURE_STORAGE_CONNECTION_STRING;

    const blobServiceClient = BlobServiceClient.fromConnectionString(con_string);
    const containerClient = blobServiceClient.getContainerClient(team_name);

    console.log(`Azure Blob ${containerClient.containerName} created.`);

    return containerClient.containerName;
  }

  private async createAwsBucket(team_name: string){
    const aws_bucket_name = team_name;

    new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });

    const bucket = aws_bucket_name;
    console.log(`AWS Bucket ${bucket} created.`);
    return bucket;
  }

  private async createGcpBucket(team_name: string){
    const bucket_name = team_name;

    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: "gcpKey.json",
    });

    const [bucket] = await storage.createBucket(bucket_name, {
      location: 'US',
      storageClass: 'STANDARD',
    });

    const options = {
      entity: 'allUsers',
      role: storage.acl.OWNER_ROLE
    };
        
    bucket.acl.add(options, function(err, aclObject) {
      return console.log(err, aclObject)
    });
  
    console.log(`GCP Bucket ${bucket.name} created.`);
    
    return bucket.name;
  }

  private async createSpaces(team_name: string){
    const do_endpoint: any = process.env.DO_SPACES_ENDPOINT;
    const spacesEndpoint = new AWS.Endpoint(do_endpoint);
    const do_space_name = team_name;

    new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });

    const bucket = do_space_name;
    console.log(`DO Spaces ${bucket} created.`);
    return bucket;
  }

  private async saveTeam(name: string): Promise<iTeam> {
    const team = await Teams.insert({
      name,
    });
    return team;
  }

  private async saveNewUser(email: string, team_id: number): Promise<iUser> {
    const key: any = process.env.AES_SIGNUP_KEY;

    const ciphertext = Crypto.AES.encrypt(
      JSON.stringify(email.length * Math.random() * Date.now()),
      key
    ).toString();

    const payload = ciphertext.slice(5, 25);
    const hashedPassword = await bcrypt.hash(payload, 10);

    const user: iUser = await Users.create({
      email,
      team_id,
      password: hashedPassword,
      role: "ADMIN",
    });
    return { ...user, password: payload };
  }

  public async delete(team_id: number) {
    try {
      const userServices = new UserServices(team_id);
      const users = await userServices.findAll();

      await Promise.all(
        users.map(async (user) => {
          await Users.delete(Number(user.id));
        })
      );

      await Teams.delete(team_id);

      return;
    } catch (error) {
      console.log(error);
    }
  }
}

export default TeamServices;
