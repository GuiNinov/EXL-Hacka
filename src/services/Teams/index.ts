import Users from "../../models/Users";
import Teams from "../../models/Teams";
import iUser from "../../interfaces/User/iUser";
import iTeam from "../../interfaces/Team";
import Crypto from "crypto-js";
import bcrypt from "bcrypt";
import UserServices from "../Users";

class TeamServices {
  public async validateInput(
    name: string,
    email: string
  ): Promise<{ valid: boolean; message: string }> {
    const nameIsValid = await this.validateName(name);
    const emailIsValid = await this.validateEmail(email);
    if (!nameIsValid) {
      return { valid: false, message: "Team name already exists" };
    }
    if (!emailIsValid) {
      return { valid: false, message: "Email already exists" };
    }
    return { valid: true, message: "Valid input" };
  }

  private async validateName(name: string): Promise<boolean> {
    const teams = await Teams.findByName(name);
    if (teams.length > 0) {
      return false;
    }
    return true;
  }

  private async validateEmail(email: string): Promise<boolean> {
    const users = await Users.findByEmail(email);
    if (users.length > 0) {
      return false;
    }
    return true;
  }

  public async create(name: string, email: string) {
    try {
      const team = await this.saveTeam(name);

      const user = await this.saveNewUser(email, Number(team.id));

      return { ...user, team_name: team.name };
    } catch (error) {
      console.log(error);
    }
  }

  private async saveTeam(name: string): Promise<iTeam> {
    const team = await Teams.insert({
      name,
    });
    return team;
  }

  private async saveNewUser(email: string, team_id: number): Promise<iUser> {
    const key: any = process.env.AES_SIGNUP_KEY;

    const ciphertext = Crypto.AES.encrypt(
      JSON.stringify(email.length * Math.random() * Date.now()),
      key
    ).toString();

    const payload = ciphertext.slice(5, 25);
    const hashedPassword = await bcrypt.hash(payload, 10);

    const user: iUser = await Users.create({
      email,
      team_id,
      password: hashedPassword,
      role: "ADMIN",
    });
    return { ...user, password: payload };
  }

  public async delete(team_id: number) {
    try {
      const userServices = new UserServices(team_id);
      const users = await userServices.findAll();

      await Promise.all(
        users.map(async (user) => {
          await Users.delete(Number(user.id));
        })
      );

      await Teams.delete(team_id);

      return;
    } catch (error) {
      console.log(error);
    }
  }
}

export default TeamServices;
