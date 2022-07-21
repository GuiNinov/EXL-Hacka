import db from "../../database/pg";
import iFile from "../../interfaces/File/iFile";

class File {
  async insert(data: iFile): Promise<iFile> {
    const res = await db("file")
      .returning([
        "id",
        "url",
        "file_name",
        "storaged_at",
        "folder",
        "created_at",
        "updated_at",
        "elapsed_time",
        "user_id",
        "team_id",
      ])
      .insert(data);
    return res[0];
  }

  async getFiles(filters: iFile, file_name?: string): Promise<iFile[]> {
    let res: iFile[] = [];
    if (file_name) {
      res = await db("file")
        .select(
          "id",
          "url",
          "file_name",
          "storaged_at",
          "folder",
          "created_at",
          "updated_at",
          "elapsed_time",
          "user_id",
          "team_id"
        )
        .where({ ...filters, deleted: false })
        .andWhere("file_name", "like", `%${file_name}%`);
    } else {
      res = await db("file")
        .select(
          "id",
          "url",
          "file_name",
          "storaged_at",
          "folder",
          "created_at",
          "updated_at",
          "elapsed_time",
          "user_id",
          "team_id"
        )
        .where({ ...filters, deleted: false });
    }
    return res;
  }

  async getFile(team_id: number, id: number): Promise<iFile> {
    const res = await db("file")
      .select(
        "id",
        "url",
        "file_name",
        "storaged_at",
        "folder",
        "created_at",
        "updated_at",
        "elapsed_time",
        "user_id",
        "team_id"
      )
      .where({ id, team_id, deleted: false });
    return res[0];
  }

  async deleteFile(team_id: number, id: number): Promise<{ valid: boolean }> {
    try {
      const res = await db("file")
        .update({ deleted: true })
        .where({ id, team_id });
      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }

  async update(data: iFile, id: number, team_id: number): Promise<iFile> {
    const res = await db("file")
      .returning([
        "id",
        "url",
        "file_name",
        "storaged_at",
        "folder",
        "created_at",
        "updated_at",
        "elapsed_time",
        "user_id",
        "team_id",
      ])
      .update(data)
      .where({ id, team_id, deleted: false });
    return res[0];
  }
}

export default new File();
