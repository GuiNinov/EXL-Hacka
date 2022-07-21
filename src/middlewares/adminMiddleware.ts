import { Request, Response, NextFunction } from "express";

import * as jwt from "../config/jwt";
import { buildResponse } from "../helpers/responseHelper";
import Users from "../models/Users";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body.auth;

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

    if (user.role != "ADMIN") {
      return buildResponse(
        res,
        null,
        false,
        "Only ADMIN users can access this route",
        401,
        req.headers.start_time
      );
    }
    next();
  } catch (error) {
    console.log(error);
    return buildResponse(
      res,
      null,
      false,
      "An interna error occurred",
      500,
      req.headers.start_time
    );
  }
};

export default adminMiddleware;
