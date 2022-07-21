import express, { Request, Response } from "express";
import startTimeMiddleware from "../middlewares/startTimeMiddleware";

// Teams
import TeamRoutes from "./v1/Teams";

// Users
import UserRoutes from "./v1/Users";

// Files
import FileRoutes from "./v1/File";

// Folders
import FolderRoutes from "./v1/Folder";

// Permissions
import FilePermissionsRoutes from "./v1/Permissions/File";
import FolderPermissionsRoutes from "./v1/Permissions/Folder";

var router = express.Router();

export default (app: any) => {
  router.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use(startTimeMiddleware);

  router = UserRoutes(router);
  router = FileRoutes(router);
  router = TeamRoutes(router);
  router = FolderRoutes(router);
  router = FilePermissionsRoutes(router);
  router = FolderPermissionsRoutes(router);

  app.use(router);
};
