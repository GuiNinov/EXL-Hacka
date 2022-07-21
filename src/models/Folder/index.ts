import db from "../../database/pg";
import iFolder from "../../interfaces/Folder/iFolder";

class Folder {
  async insert(data: iFolder): Promise<iFolder> {
    const res: [iFolder] = await db("folder")
      .returning(["id", "name", "dir", "team_id", "created_at", "updated_at"])
      .insert(data);
    return res[0];
  }

  async findById(team_id: number, id: number): Promise<iFolder> {
    const res: [iFolder] = await db("folder")
      .select("id", "name", "dir", "team_id", "created_at", "updated_at")
      .where({
        team_id,
        id,
        deleted: false,
      });
    return res[0];
  }

  async findByDist(team_id: number, dir: number): Promise<[iFolder]> {
    const res: [iFolder] = await db("folder")
      .select("id", "name", "dir", "team_id", "created_at", "updated_at")
      .where({
        team_id,
        dir,
        deleted: false,
      });
    return res;
  }

  async findAll(team_id: number): Promise<[iFolder]> {
    const res: [iFolder] = await db("folder")
      .select("id", "name", "dir", "team_id", "created_at", "updated_at")
      .where({
        team_id,
        deleted: false,
      });
    return res;
  }

  async update(data: iFolder, id: number, team_id: number): Promise<iFolder> {
    const res: [iFolder] = await db("folder")
      .returning(["id", "name", "dir", "team_id", "created_at", "updated_at"])
      .update(data)
      .where({
        team_id,
        id,
        deleted: false,
      });
    return res[0];
  }

  async delete(id: number, team_id: number): Promise<{ deleted: boolean }> {
    try {
      await db("folder")
        .update({
          deleted: true,
        })
        .where({
          team_id,
          id,
        });
      return { deleted: true };
    } catch (error) {
      return { deleted: false };
    }
  }
}

export default new Folder();
