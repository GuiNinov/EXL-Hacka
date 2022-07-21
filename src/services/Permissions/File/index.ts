import iFile from "../../../interfaces/File/iFile";
import iFilePermissions from "../../../interfaces/FilePermissions/iFIlePermissions";
import iFolderPermissions from "../../../interfaces/FolderPermissions/iFolderPermissions";
import iUser from "../../../interfaces/User/iUser";
import FilePermissions from "../../../models/FilePermissions";
import FolderPermissionsService from "../Folder";

class FilePermissionsService {
  user: iUser;

  constructor(user: iUser) {
    this.user = user;
  }

  async createNewPermission(data: iFilePermissions): Promise<iFilePermissions> {
    const res = await FilePermissions.insert({
      file_id: data.file_id,
      user_id: data.user_id,
      block_read: data.block_read,
      block_update: data.block_update,
      block_delete: data.block_delete,
      allow_read_till: data.allow_read_till,
      allow_update_till: data.allow_update_till,
      allow_delete_till: data.allow_delete_till,
      access_till: data.access_till,
      created_at: data.created_at,
      updated_at: data.updated_at,
      team_id: data.team_id,
    });
    return res;
  }

  async verifyMultipleReads(files: any): Promise<iFile[]> {
    if (this.user.role == "ADMIN") {
      return files;
    }
    const userPermissions = await FilePermissions.findByUserId(
      Number(this.user.id),
      Number(this.user.team_id)
    );

    const folderPermissionsService = new FolderPermissionsService(this.user);
    const folderPermissions = await folderPermissionsService.findAllByUserId(
      Number(this.user.id)
    );

    let allowedFiles = [];

    for (let i = 0; i < files.length; i++) {
      let allow = true;

      userPermissions.map((permission: iFilePermissions) => {
        if (permission.file_id == files[i].id) {
          if (permission.block_read) allow = false;

          if (permission.allow_read_till) {
            if (permission.access_till < new Date()) allow = false;
          }
        }
      });

      folderPermissions.map((permission: iFolderPermissions) => {
        if (permission.folder_id == files[i].folder) {
          if (permission.block_read) allow = false;

          if (permission.allow_read_till) {
            if (permission.access_till && permission.access_till < new Date())
              allow = false;
          }
        }
      });
      if (allow) allowedFiles.push(files[i]);
    }

    return allowedFiles;
  }

  async verifySingleRead(file_id: number): Promise<boolean> {
    if (this.user.role == "ADMIN") {
      return true;
    }
    const userPermissions = await FilePermissions.findByUserIdAndFileId(
      Number(this.user.id),
      file_id,
      Number(this.user.team_id)
    );

    let allow = true;

    userPermissions.map((permission: iFilePermissions) => {
      if (permission.block_read) {
        allow = false;
      }
      if (permission.allow_read_till) {
        if (permission.access_till < new Date()) {
          allow = false;
        }
      }
    });

    return allow;
  }

  async verifyUpload(file_id: number): Promise<boolean> {
    if (this.user.role == "ADMIN") {
      return true;
    }
    const userPermissions = await FilePermissions.findByUserIdAndFileId(
      Number(this.user.id),
      file_id,
      Number(this.user.team_id)
    );

    let allow = true;

    userPermissions.map((permission: iFilePermissions) => {
      if (permission.file_id == file_id) {
        if (permission.block_update) {
          allow = false;
        }
        if (permission.allow_update_till) {
          if (permission.access_till < new Date()) {
            allow = false;
          }
        }
      }
    });

    return allow;
  }

  async verifyDelete(file_id: number): Promise<boolean> {
    if (this.user.role == "ADMIN") {
      return true;
    }
    const userPermissions = await FilePermissions.findByUserIdAndFileId(
      Number(this.user.id),
      file_id,
      Number(this.user.team_id)
    );

    let allow = true;

    userPermissions.map((permission: iFilePermissions) => {
      if (file_id == permission.file_id) {
        if (permission.block_delete) {
          allow = false;
        }
        if (permission.allow_delete_till) {
          if (permission.access_till < new Date()) {
            allow = false;
          }
        }
      }
    });

    return allow;
  }

  async updatePermission(
    id: number,
    data: iFilePermissions
  ): Promise<iFilePermissions> {
    const res = await FilePermissions.update(
      id,
      { ...data, updated_at: new Date() },
      Number(this.user.team_id)
    );
    return res;
  }

  async deletePermission(id: number): Promise<void> {
    const res = await FilePermissions.delete(id, Number(this.user.team_id));
    return;
  }

  async listAllTeamPermissions(): Promise<iFilePermissions[]> {
    const res = await FilePermissions.findByTeamId(Number(this.user.team_id));
    return res;
  }

  async findOnePermission(id: number): Promise<iFilePermissions> {
    const res = await FilePermissions.findById(id, Number(this.user.team_id));
    return res;
  }

  async findAllByUserIdAndFileId(
    user_id: number,
    file_id: number
  ): Promise<iFilePermissions[]> {
    const res = await FilePermissions.findByUserIdAndFileId(
      user_id,
      file_id,
      Number(this.user.team_id)
    );
    return res;
  }

  async findAllByUserId(user_id: number): Promise<iFilePermissions[]> {
    const res = await FilePermissions.findByUserId(
      user_id,
      Number(this.user.team_id)
    );
    return res;
  }

  async findAllByFileId(file_id: number): Promise<iFilePermissions[]> {
    const res = await FilePermissions.findByFileId(
      file_id,
      Number(this.user.team_id)
    );
    return res;
  }
}

export default FilePermissionsService;
