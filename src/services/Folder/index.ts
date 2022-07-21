import Folder from "../../models/Folder";
import iFolder from "../../interfaces/Folder/iFolder";
import UserServices from "../Users";
import iUser from "../../interfaces/User/iUser";
import FolderPermissionsService from "../Permissions/Folder";
import FileServices from "../File";
import File from "../../models/File";

class FolderServices {
  team_id: number;

  constructor(team_id: number) {
    this.team_id = team_id;
  }

  public async create(
    data: iFolder,
    user: iUser
  ): Promise<{
    valid: boolean;
    message: string;
    data?: iFolder;
  }> {
    if (data.dir != 0) {
      const folder = await Folder.findById(this.team_id, Number(data.dir));
      if (!folder) {
        return { valid: false, message: "Directory not found" };
      }

      const folderPermissionsService = new FolderPermissionsService(user);
      const folderIsValid = await folderPermissionsService.verifySingleWrite(
        data.dir
      );
      if (!folderIsValid) {
        return {
          valid: false,
          message: "You don't have permission to create folders in this folder",
        };
      }
    }

    const new_folder = await Folder.insert({ ...data, team_id: this.team_id });
    return {
      valid: true,
      data: new_folder,
      message: "Folder created successfully",
    };
  }

  public async findAll() {
    const folders = await Folder.findAll(this.team_id);
    return folders;
  }

  public async findById(id: number) {
    const folder = await Folder.findById(this.team_id, id);
    return folder;
  }

  public async findByName() {}

  public async findAllInDirectory(
    dir: number
  ): Promise<{ valid: boolean; message: string; data?: [iFolder] }> {
    if (dir != 0) {
      const folder = await Folder.findById(this.team_id, dir);
      if (!folder) return { valid: false, message: "Directory not found" };
    }
    const folders = await Folder.findByDist(this.team_id, dir);
    return { valid: true, data: folders, message: "Folders found" };
  }

  public async updateFolder(
    id: number,
    data: iFolder,
    user: iUser
  ): Promise<{ valid: boolean; message: string; data?: iFolder }> {
    const folder = await Folder.findById(this.team_id, id);
    if (!folder) return { valid: false, message: "Folder not found" };

    if (data.dir) {
      const folder = await Folder.findById(this.team_id, data.dir);
      if (!folder) {
        return { valid: false, message: "Directory not found" };
      }

      const folderPermissionsService = new FolderPermissionsService(user);
      const folderIsValid = await folderPermissionsService.verifySingleWrite(
        data.dir
      );
      if (!folderIsValid) {
        return {
          valid: false,
          message: "You don't have permission to create folders in this folder",
        };
      }
    }

    const updated_folder = await Folder.update(
      { ...data, updated_at: new Date() },
      id,
      this.team_id
    );
    return {
      data: updated_folder,
      valid: true,
      message: "Folder updated successfully",
    };
  }

  public async delete(
    id: number,
    user: iUser
  ): Promise<{ valid: boolean; message: string }> {
    const folder = await Folder.findById(this.team_id, id);
    if (!folder) return { valid: false, message: "Folder not found" };

    const foldersInside = await Folder.findByDist(this.team_id, id);
    if (foldersInside.length > 0) {
      return { valid: false, message: "Folder is not empty" };
    }
    const filesInside = await File.getFiles({
      folder: id,
      team_id: this.team_id,
    });
    if (filesInside.length > 0) {
      return { valid: false, message: "Folder is not empty" };
    }

    const folderPermissionsService = new FolderPermissionsService(user);
    const folderIsValid = await folderPermissionsService.verifyDelete(id);
    if (!folderIsValid) {
      return {
        valid: false,
        message: "You don't have permission to delete this folder",
      };
    }

    await Folder.delete(id, this.team_id);
    return { valid: true, message: "Folder deleted successfully" };
  }
}

export default FolderServices;
