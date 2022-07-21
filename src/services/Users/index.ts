import iUser from "../../interfaces/User/iUser";
import Users from "../../models/Users";
import Crypto from "crypto-js";
import bcrypt from "bcrypt";

class UserServices {
  team_id: number;
  constructor(team_id: number) {
    this.team_id = team_id;
  }

  public async create(email: string, team_id: number) {
    const key: any = process.env.AES_SIGNUP_KEY;
    const ciphertext = Crypto.AES.encrypt(
      JSON.stringify(email.length * Math.random() * Date.now()),
      key
    ).toString();

    const payload = ciphertext.slice(5, 25);
    const hashedPassword = await bcrypt.hash(payload, 10);

    const newUser: iUser = await Users.create({
      email,
      password: hashedPassword,
      role: "DEV",
      team_id: this.team_id,
    });

    return { ...newUser, password: payload };
  }

  public async verifyEmail(
    email: string
  ): Promise<{ valid: boolean; message: string }> {
    const user = await Users.findByEmail(email);
    if (user.length > 0) {
      return { valid: true, message: "Valid input" };
    }
    return { valid: false, message: "Invalid input" };
  }

  public async findAll(): Promise<iUser[]> {
    const users: iUser[] = await Users.findAll(this.team_id);
    return users;
  }

  public async findById(id: number): Promise<iUser> {
    const user: iUser = await Users.findById(id, this.team_id);
    return user;
  }

  public async delete(id: number): Promise<{ deleted: boolean }> {
    const user = await Users.findById(id, this.team_id);
    if (!user) {
      return { deleted: false };
    }
    const deleted: { deleted: boolean } = await Users.delete(id, this.team_id);
    return deleted;
  }

  public async update(id: number, data: iUser) {
    const updated = await Users.update(id, data);
    return updated;
  }
}

export default UserServices;
