import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routes from "../routes";

const configServer = (app: any) => {
  dotenv.config();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  
  routes(app);

  return app;
};

export default configServer;
