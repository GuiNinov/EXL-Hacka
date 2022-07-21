import db from "../../database/pg";
import iFilePermissions from "../../interfaces/FilePermissions/iFIlePermissions";
class FilePermissions {
  async insert(data: any): Promise<iFilePermissions> {
    const res = await db("file_permissions")
      .returning([
        "id",
        "file_id",
        "user_id",
        "block_read",
        "block_update",
        "block_delete",
        "allow_read_till",
        "allow_update_till",
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
  ): Promise<iFilePermissions[]> {
    const res = await db("file_permissions")
      .where({ user_id: userId, team_id })
      .returning([
        "id",
        "file_id",
        "user_id",
        "block_read",
        "block_update",
        "block_delete",
        "allow_read_till",
        "allow_update_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ]);
    return res;
  }

  async findByFileId(
    fileId: number,
    team_id: number
  ): Promise<iFilePermissions[]> {
    const res = await db("file_permissions")
      .where({ file_id: fileId, team_id })
      .returning([
        "id",
        "file_id",
        "user_id",
        "block_read",
        "block_update",
        "block_delete",
        "allow_read_till",
        "allow_update_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ]);
    return res;
  }

  async findByUserIdAndFileId(
    userId: number,
    fileId: number,
    team_id: number
  ): Promise<iFilePermissions[]> {
    const res = await db("file_permissions")
      .where({ user_id: userId, file_id: fileId, team_id })
      .returning([
        "id",
        "file_id",
        "user_id",
        "block_read",
        "block_update",
        "block_delete",
        "allow_read_till",
        "allow_update_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ]);
    return res;
  }

  async delete(id: number, team_id: number): Promise<iFilePermissions> {
    const res = await db("file_permissions")
      .where({ id, team_id })
      .returning([
        "id",
        "file_id",
        "user_id",
        "block_read",
        "block_update",
        "block_delete",
        "allow_read_till",
        "allow_update_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ])
      .del();
    return res[0];
  }

  async update(
    id: number,
    data: iFilePermissions,
    team_id: number
  ): Promise<iFilePermissions> {
    const res = await db("file_permissions")
      .where({ id, team_id })
      .returning([
        "id",
        "file_id",
        "user_id",
        "block_read",
        "block_update",
        "block_delete",
        "allow_read_till",
        "allow_update_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ])
      .update(data);
    return res[0];
  }

  async findById(id: number, team_id: number): Promise<iFilePermissions> {
    const res = await db("file_permissions")
      .where({ id, team_id })
      .returning([
        "id",
        "file_id",
        "user_id",
        "block_read",
        "block_update",
        "block_delete",
        "allow_read_till",
        "allow_update_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ]);
    return res[0];
  }

  async findByTeamId(teamId: number): Promise<iFilePermissions[]> {
    const res = await db("file_permissions")
      .where({ team_id: teamId })
      .returning([
        "id",
        "file_id",
        "user_id",
        "block_read",
        "block_update",
        "block_delete",
        "allow_read_till",
        "allow_update_till",
        "allow_delete_till",
        "access_till",
        "created_at",
        "updated_at",
      ])
      .orderBy("id", "desc");
    return res;
  }
}

export default new FilePermissions();
