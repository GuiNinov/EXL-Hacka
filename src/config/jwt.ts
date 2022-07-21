import jwt from "jsonwebtoken";

const secret: any = process.env.PASSPORT_SECRET;

export const sign = (payload: any, expires_in: number) =>
  jwt.sign(payload, secret, { expiresIn: expires_in });
export const verify = (token: string) => jwt.verify(token, secret);
