import express, { Request, Response } from "express";
import config from "./config";

const app = express();
const server = config(app);
const port = process.env.PORT || 3765;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
