import https from "https";
import fs from "fs";
import iFile, { iStoragedFile } from "../../interfaces/File/iFile";
import FileModel from "../../models/File";
import { diffBetweenDatesInMs } from "../../helpers/fomartData";

import AwsServices from "./Aws";
import GcpServices from "./Gcp";
import AzureServices from "./Azure";
import DigitalOceanService from "./DigitalOcean";
import Folder from "../../models/Folder";
import FolderPermissionsService from "../Permissions/Folder";
import UserServices from "../Users";

class FileServices {
  user: number;
  team: number;

  constructor(user_id: number, team_id: number) {
    this.user = user_id;
    this.team = team_id;
  }

  public async saveFile(
    file: any,
    start_at: string,
    storaged_at?: string,
    folder?: number
  ) {
    if (folder) {
      // verify if folder exists
      const folderExists = await Folder.findById(this.team, folder);

      if (!folderExists) {
        return {
          valid: false,
          data: null,
          message:
            "Folder not found. Please, try to create a new folder first or select an existing one.",
        };
      }

      const userServices = new UserServices(this.team);
      const user = await userServices.findById(this.user);

      const folderPermissionsService = new FolderPermissionsService(user);
      const folderIsValid = await folderPermissionsService.verifySingleWrite(
        folder
      );
      if (!folderIsValid) {
        return {
          valid: false,
          data: null,
          message: "You don't have permission to save files in this folder",
        };
      }
    } else folder = 0;

    let storagedFile: iStoragedFile;

    switch (storaged_at) {
      case "gcp":
        const gcpService = new GcpServices();
        storagedFile = await gcpService.uploadFile(file);
        break;

      case "azure":
        const azureService = new AzureServices();
        storagedFile = await azureService.uploadFile(file);
        break;

      case "digital_ocean":
        const digitalOceanService = new DigitalOceanService();
        storagedFile = await digitalOceanService.uploadFile(file);
        break;

      default:
        const awsService = new AwsServices();
        storagedFile = await awsService.uploadFile(file);
        break;
    }

    if (!storagedFile.valid) {
      return { valid: false, message: "" };
    }

    const savedFile = await this.saveToDb(
      storagedFile,
      storaged_at,
      start_at,
      folder
    );

    return {
      valid: true,
      data: savedFile,
      message: "File saved successfully",
    };
  }

  private async saveToDb(
    fileData: iStoragedFile,
    storaged_at: string = "aws",
    start_at: string,
    folder?: number
  ) {
    try {
      const savedFile = await FileModel.insert({
        file_name: fileData?.data?.file_name,
        url: fileData?.data?.url,
        storaged_at,
        elapsed_time: Number(
          diffBetweenDatesInMs(new Date(), new Date(start_at))
        ),
        folder,
        user_id: this.user,
        team_id: this.team,
      });
      return savedFile;
    } catch (error) {
      console.log("Error while saving file to db");
      console.log(error);
      return {
        valid: true,
        data: null,
        message: "Error while saving the file ",
      };
    }
  }

  public async getFiles(data?: iFile) {
    try {
      const filters: iFile = { team_id: this.team };
      if (data?.folder) filters.folder = data.folder;
      if (data?.storaged_at) filters.storaged_at = data.storaged_at;
      if (data?.user_id) filters.user_id = data.user_id;

      let files: iFile[] = [];
      if (data?.file_name) {
        files = await FileModel.getFiles(filters, data.file_name);
      } else {
        files = await FileModel.getFiles(filters);
      }

      return {
        valid: true,
        data: files,
        message: "Files fetched successfully",
      };
    } catch (error) {
      console.log("Error while fetching files");
      console.log(error);
      return {
        valid: false,
        data: null,
        message: "Error while fetching files",
      };
    }
  }

  public async getFile(file_id: number) {
    try {
      const file = await FileModel.getFile(this.team, file_id);
      return {
        valid: true,
        data: file,
        message: "File fetched successfully",
      };
    } catch (error) {
      console.log("Error while fetching file");
      console.log(error);
      return {
        valid: false,
        data: null,
        message: "Error while fetching file",
      };
    }
  }

  public async deleteFile(file_id: number) {
    const file = await FileModel.deleteFile(this.team, file_id);
    if (!file.valid) {
      return {
        valid: false,
        data: null,
        message: "Error while deleting file",
      };
    }
    return {
      valid: true,
      data: null,
      message: "File deleted successfully",
    };
  }

  public download(url: any, dest: string, cb: any) {
    const file = fs.createWriteStream(dest);

    const request = https

      .get(url, function (response) {
        response.pipe(file);

        file.on("finish", function () {
          file.close(cb); // close() is async, call cb after close completes.
        });
      })

      .on("error", function (err) {
        // Handle errors
        fs.unlink(dest, (err) => {}); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
      });
  }

  public async updateFile(file_id: number, data: any) {
    try {
      if (data.folder) {
        const folderExists = await Folder.findById(this.team, data.folder);

        if (!folderExists) {
          return {
            valid: false,
            data: null,
            message:
              "Folder not found. Please, try to create a new folder first or select an existing one.",
          };
        }

        const userServices = new UserServices(this.team);
        const user = await userServices.findById(this.user);

        const folderPermissionsService = new FolderPermissionsService(user);
        const folderIsValid = await folderPermissionsService.verifySingleWrite(
          data.folder
        );
        if (!folderIsValid) {
          return {
            valid: false,
            data: null,
            message: "You don't have permission to save files in this folder",
          };
        }
      }

      const updatedFile = await FileModel.update(
        { ...data, updated_at: new Date() },
        file_id,
        this.team
      );
      return {
        valid: true,
        data: updatedFile,
        message: "File updated successfully",
      };
    } catch (error) {
      console.log("Error while updating file");
      console.log(error);
      return {
        valid: false,
        data: null,
        message: "Error while updating file",
      };
    }
  }
}

export default FileServices;
