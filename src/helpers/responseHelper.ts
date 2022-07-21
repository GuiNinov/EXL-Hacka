import { Response } from "express";
import { diffBetweenDatesInMs } from "./fomartData";

const buildResponse = (
  res: Response,
  content: any,
  valid: boolean,
  message: string,
  status_code: number,
  start_time: any
) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  return res.status(status_code).json({
    content,
    valid,
    message,
    status_code,
    elapsed_time: diffBetweenDatesInMs(Date.now(), start_time) + " ms",
  });
};

export { buildResponse };
