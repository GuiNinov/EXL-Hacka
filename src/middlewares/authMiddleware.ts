import { Request, Response, NextFunction } from "express";

import * as jwt from "../config/jwt";
import { buildResponse } from "../helpers/responseHelper";
import Users from "../models/Users";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [hashType, token]: any = req.headers.authorization?.split(" ");

    if (hashType.trim() != "Bearer" || !token || !hashType) {
      return buildResponse(
        res,
        null,
        false,
        "Unauthorized",
        403,
        req.headers.start_time
      );
    }

    const payload: any = await jwt.verify(token);
    const user: any = await Users.findById(Number(payload.user));

    if (!user) {
      return buildResponse(
        res,
        null,
        false,
        "Unauthorized",
        401,
        req.headers.start_time
      );
    }

    req.body.auth = user;
    req.body.token = token;

    next();
  } catch (error) {
    console.log(error);
    return buildResponse(
      res,
      null,
      false,
      "Unauthorized",
      401,
      req.headers.start_time
    );
  }
};

export default authMiddleware;
