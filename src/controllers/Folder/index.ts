import { Request, Response } from "express";
import { buildResponse } from "../../helpers/responseHelper";
import iFolder from "../../interfaces/Folder/iFolder";
import iUser from "../../interfaces/User/iUser";
import FolderServices from "../../services/Folder";
import FolderPermissionsService from "../../services/Permissions/Folder";
class FolderController {
  async create(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    const { name, dir } = req.body;

    const data: iFolder = { name, dir };

    if (!name)
      return buildResponse(
        res,
        null,
        false,
        "Name is required",
        400,
        req.headers.start_time
      );

    if (!data.dir) data.dir = 0;

    try {
      const folderServices = new FolderServices(Number(user.team_id));

      const folder = await folderServices.create(data, user);

      if (!folder.valid) {
        return buildResponse(
          res,
          null,
          false,
          folder.message,
          400,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        folder.data,
        true,
        "Folder created successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong",
        500,
        req.headers.start_time
      );
    }
  }

  async findAllInDirectory(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    const { id } = req.params;

    if (!id)
      return buildResponse(
        res,
        null,
        false,
        "Directory is required",
        400,
        req.headers.start_time
      );

    try {
      const folderServices = new FolderServices(Number(user.team_id));

      const folders: {
        valid: boolean;
        message: string;
        data?: [iFolder];
      } = await folderServices.findAllInDirectory(Number(id));

      if (!folders.valid) {
        return buildResponse(
          res,
          null,
          false,
          folders.message,
          400,
          req.headers.start_time
        );
      }

      const folderPermissionsService = new FolderPermissionsService(user);
      const folderIsValid = await folderPermissionsService.verifySingleRead(
        Number(id)
      );
      if (!folderIsValid) {
        return buildResponse(
          res,
          null,
          false,
          "You don't have permission to access this directory",
          403,
          req.headers.start_time
        );
      }

      const allowedFolders = await folderPermissionsService.verifyMultipleReads(
        folders.data
      );

      return buildResponse(
        res,
        allowedFolders,
        true,
        "Folders found successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong",
        500,
        req.headers.start_time
      );
    }
  }

  async findAll(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    try {
      const folderServices = new FolderServices(Number(user.team_id));

      const folders = await folderServices.findAll();

      const folderPermissionsService = new FolderPermissionsService(user);
      const allowedFolders = await folderPermissionsService.verifyMultipleReads(
        folders
      );

      return buildResponse(
        res,
        allowedFolders,
        true,
        "Folders found successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong",
        500,
        req.headers.start_time
      );
    }
  }

  async findById(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    const { id } = req.params;

    if (!id)
      return buildResponse(
        res,
        null,
        false,
        "Folder id is required",
        400,
        req.headers.start_time
      );

    try {
      const folderServices = new FolderServices(Number(user.team_id));

      const folder = await folderServices.findById(Number(id));

      if (!folder) {
        return buildResponse(
          res,
          null,
          false,
          "Folder not found",
          400,
          req.headers.start_time
        );
      }
      const folderPermissionsService = new FolderPermissionsService(user);
      const folderIsValid = await folderPermissionsService.verifySingleRead(
        Number(id)
      );
      if (!folderIsValid) {
        return buildResponse(
          res,
          null,
          false,
          "You don't have permission to access this folder",
          403,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        folder,
        true,
        "Folder found successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong",
        500,
        req.headers.start_time
      );
    }
  }

  async updateFolder(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    const { id } = req.params;

    const { name, dir } = req.body;

    if (!id)
      return buildResponse(
        res,
        null,
        false,
        "Folder id is required",
        400,
        req.headers.start_time
      );

    let data: iFolder = {};

    if (name) data.name = name;
    if (dir) data.dir = dir;

    try {
      const folderPermissionsService = new FolderPermissionsService(user);
      const folderIsValid = await folderPermissionsService.verifySingleWrite(
        Number(id)
      );
      if (!folderIsValid) {
        return buildResponse(
          res,
          null,
          false,
          "You don't have permission to access this folder",
          403,
          req.headers.start_time
        );
      }

      const folderServices = new FolderServices(Number(user.team_id));

      const folder = await folderServices.updateFolder(Number(id), data, user);

      if (!folder.valid) {
        return buildResponse(
          res,
          null,
          false,
          folder.message,
          400,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        folder.data,
        true,
        "Folder updated successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong",
        500,
        req.headers.start_time
      );
    }
  }

  async deleteFolder(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    const { id } = req.params;

    if (!id)
      return buildResponse(
        res,
        null,
        false,
        "Folder id is required",
        400,
        req.headers.start_time
      );

    try {
      const folderServices = new FolderServices(Number(user.team_id));

      const folder = await folderServices.delete(Number(id), user);

      if (!folder.valid) {
        return buildResponse(
          res,
          null,
          false,
          folder.message,
          400,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        null,
        true,
        "Folder deleted successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong",
        500,
        req.headers.start_time
      );
    }
  }
}

export default new FolderController();
