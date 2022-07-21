import { Request, Response, NextFunction } from "express";

const startTimeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.headers.start_time = new Date().toString();
  next();
};

export default startTimeMiddleware;
