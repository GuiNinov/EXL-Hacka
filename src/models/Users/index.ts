import db from "../../database/pg";
import iUser from "../../interfaces/User/iUser";
class User {
  public async create(data: iUser) {
    const res = await db("users")
      .returning(["id", "email", "role", "team_id", "created_at", "updated_at"])
      .insert(data);
    return res[0];
  }

  public async update(id: number, data: iUser) {
    const res = await db("users")
      .returning(["id", "email", "role", "team_id", "created_at", "updated_at"])
      .update(data)
      .where("id", id)
      .andWhere("deleted", false);
    return res[0];
  }

  public async findAll(team_id: number): Promise<iUser[]> {
    const res = await db("users")
      .select("id", "email", "role", "team_id", "created_at", "updated_at")
      .where({ deleted: false, team_id });
    return res;
  }

  public async findById(id: number, team_id?: number): Promise<iUser> {
    let res: [iUser] = [{}];
    if (team_id) {
      res = await db("users")
        .select("id", "email", "role", "team_id", "created_at", "updated_at")
        .where({ id, team_id, deleted: false });
    } else {
      res = await db("users")
        .select("id", "email", "role", "team_id", "created_at", "updated_at")
        .where({ id, deleted: false });
    }
    return res[0];
  }

  public async findByEmail(
    email: string,
    format?: boolean
  ): Promise<[iUser] | []> {
    const res = await db("users")
      .where("email", email)
      .andWhere("deleted", false);
    if (res.length && format) {
      res[0].password = "";
    }
    return res;
  }

  public async delete(
    id?: number,
    team_id?: number
  ): Promise<{ deleted: boolean }> {
    try {
      await db("users").update({ deleted: true }).where({ id, team_id });
      return { deleted: true };
    } catch {
      return { deleted: false };
    }
  }
}

export default new User();
