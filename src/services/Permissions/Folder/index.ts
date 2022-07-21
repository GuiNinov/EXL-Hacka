import iFolder from "../../../interfaces/Folder/iFolder";
import iFolderPermissions from "../../../interfaces/FolderPermissions/iFolderPermissions";
import iUser from "../../../interfaces/User/iUser";
import FolderPermissions from "../../../models/FolderPermissions";

class FolderPermissionsService {
  user: iUser;
  constructor(user: iUser) {
    this.user = user;
  }

  async createNewPermission(data: iFolderPermissions) {
    const res = await FolderPermissions.insert({
      folder_id: data?.folder_id,
      user_id: data?.user_id,
      block_read: data?.block_read,
      block_write: data?.block_write,
      block_delete: data?.block_delete,
      allow_read_till: data?.allow_read_till,
      allow_write_till: data.allow_write_till,
      allow_delete_till: data.allow_delete_till,
      access_till: data.access_till,
      team_id: Number(this.user.team_id),
    });
    return res;
  }

  async verifySingleRead(folder_id: any) {
    if (this.user.role == "ADMIN") return true;

    const userPermissions = await FolderPermissions.findByFolderIdAndUserId(
      folder_id,
      Number(this.user.id),
      Number(this.user.team_id)
    );
    let allow = true;

    userPermissions.map((permission) => {
      if (permission.folder_id == folder_id) {
        if (permission.block_read) allow = false;

        if (permission.allow_read_till) {
          const now = new Date();
          const access_till = new Date(permission.access_till);
          if (access_till && now > access_till) allow = false;
        }
      }
    });

    return allow;
  }

  async verifyMultipleReads(folders: any): Promise<iFolder[]> {
    if (this.user.role == "ADMIN") return folders;
    const allowedFolders: iFolder[] = [];

    await Promise.all(
      folders.map(async (folder: iFolder): Promise<void> => {
        const allow: boolean = await this.verifySingleRead(Number(folder.id));
        if (allow) allowedFolders.push(folder);
      })
    );

    return allowedFolders;
  }

  async verifySingleWrite(folder_id: any): Promise<boolean> {
    if (this.user.role == "ADMIN") return true;

    let allow = true;

    const userPermissions = await FolderPermissions.findByFolderIdAndUserId(
      folder_id,
      Number(this.user.id),
      Number(this.user.team_id)
    );

    userPermissions.map((permission) => {
      if (permission.block_write) allow = false;

      if (permission.allow_write_till) {
        const now = new Date();
        const access_till = new Date(permission.access_till);
        if (access_till && now > access_till) allow = false;
      }
    });

    return allow;
  }

  async verifyDelete(folder_id: any): Promise<boolean> {
    if (this.user.role == "ADMIN") return true;

    let allow = true;

    const userPermissions = await FolderPermissions.findByFolderIdAndUserId(
      folder_id,
      Number(this.user.id),
      Number(this.user.team_id)
    );

    userPermissions.map((permission) => {
      if (permission.block_delete) allow = false;

      if (permission.allow_delete_till) {
        const now = new Date();
        const access_till = new Date(permission.access_till);
        if (now > access_till) allow = false;
      }
    });

    return allow;
  }

  async updatePermission(
    id: number,
    data: iFolderPermissions
  ): Promise<iFolderPermissions> {
    const res: iFolderPermissions = await FolderPermissions.update(
      id,
      data,
      Number(this.user.team_id)
    );
    return res;
  }

  async deletePermission(id: number): Promise<void> {
    const res: iFolderPermissions = await FolderPermissions.delete(
      id,
      Number(this.user.team_id)
    );
    return;
  }

  async findOnePermission(id: number): Promise<iFolderPermissions> {
    const res: iFolderPermissions = await FolderPermissions.findById(
      id,
      Number(this.user.team_id)
    );
    return res;
  }

  async listAllTeamPermissions(): Promise<iFolderPermissions[]> {
    const res: iFolderPermissions[] = await FolderPermissions.findByTeamId(
      Number(this.user.team_id)
    );
    return res;
  }

  async findAllByUserId(user_id: number): Promise<iFolderPermissions[]> {
    const res: iFolderPermissions[] = await FolderPermissions.findByUserId(
      user_id,
      Number(this.user.team_id)
    );
    return res;
  }

  async findAllByFolderId(folder_id: number): Promise<iFolderPermissions[]> {
    const res: iFolderPermissions[] = await FolderPermissions.findByFolderId(
      folder_id,
      Number(this.user.team_id)
    );
    return res;
  }

  async findAllByFolderIdAndUserId(
    folder_id: number,
    user_id: number
  ): Promise<iFolderPermissions[]> {
    const res: iFolderPermissions[] =
      await FolderPermissions.findByFolderIdAndUserId(
        folder_id,
        user_id,
        Number(this.user.team_id)
      );
    return res;
  }
}

export default FolderPermissionsService;
