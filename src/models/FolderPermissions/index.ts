import db from "../../database/pg";
import iFolderPermissions from "../../interfaces/FolderPermissions/iFolderPermissions";

class FolderPermissions {
  async insert(data: any): Promise<iFolderPermissions> {
    const res = await db("folder_permissions")
      .returning([
        "id",
        "folder_id",
        "user_id",
        "block_read",
        "block_write",
        "block_delete",
        "allow_read_till",
        "allow_write_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ])
      .insert(data);
    return res[0];
  }

  async findByUserId(
    userId: number,
    team_id: number
  ): Promise<iFolderPermissions[]> {
    const res = await db("folder_permissions")
      .where({ user_id: userId, team_id })
      .returning([
        "id",
        "folder_id",
        "user_id",
        "block_read",
        "block_write",
        "block_delete",
        "allow_read_till",
        "allow_write_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ]);
    return res;
  }

  async findByFolderId(
    folderId: number,
    team_id: number
  ): Promise<iFolderPermissions[]> {
    const res = await db("folder_permissions")
      .where({ folder_id: folderId, team_id })
      .returning([
        "id",
        "folder_id",
        "user_id",
        "block_read",
        "block_write",
        "block_delete",
        "allow_read_till",
        "allow_write_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ]);
    return res;
  }

  async findByFolderIdAndUserId(
    folderId: number,
    userId: number,
    team_id: number
  ): Promise<iFolderPermissions[]> {
    const res = await db("folder_permissions")
      .where({ folder_id: folderId, user_id: userId, team_id })
      .returning([
        "id",
        "folder_id",
        "user_id",
        "block_read",
        "block_write",
        "block_delete",
        "allow_read_till",
        "allow_write_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ]);
    return res;
  }

  async update(
    id: number,
    data: iFolderPermissions,
    team_id: number
  ): Promise<iFolderPermissions> {
    const res = await db("folder_permissions")
      .where({ id: id, team_id })
      .returning([
        "id",
        "folder_id",
        "user_id",
        "block_read",
        "block_write",
        "block_delete",
        "allow_read_till",
        "allow_write_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ])
      .update(data);
    return res[0];
  }

  async delete(id: number, team_id: number): Promise<iFolderPermissions> {
    const res = await db("folder_permissions")
      .where({ id, team_id })
      .returning([
        "id",
        "folder_id",
        "user_id",
        "block_read",
        "block_write",
        "block_delete",
        "allow_read_till",
        "allow_write_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ])
      .del();
    return res[0];
  }

  async findById(id: number, team_id: number): Promise<iFolderPermissions> {
    const res = await db("folder_permissions")
      .where({ id, team_id })
      .returning([
        "id",
        "folder_id",
        "user_id",
        "block_read",
        "block_write",
        "block_delete",
        "allow_read_till",
        "allow_write_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ]);
    return res[0];
  }

  async findByTeamId(teamId: number): Promise<iFolderPermissions[]> {
    const res = await db("folder_permissions")
      .where({ team_id: teamId })
      .select(
        "id",
        "folder_id",
        "user_id",
        "block_read",
        "block_write",
        "block_delete",
        "allow_read_till",
        "allow_write_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at"
      );
    return res;
  }
}

export default new FolderPermissions();
