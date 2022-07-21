import db from "../../database/pg";
import iTeam from "../../interfaces/Team";

class Teams {
  public async findByName(name: string): Promise<[iTeam] | []> {
    const res = await db("team").where({ name });
    return res;
  }

  public async insert(data: iTeam): Promise<iTeam> {
    const res = await db("team").returning("*").insert(data);
    return res[0];
  }

  public async delete(id: number): Promise<iTeam> {
    const res = await db("team").where({ id }).del();
    return res;
  }
}

export default new Teams();
