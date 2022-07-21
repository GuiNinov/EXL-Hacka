import { Request, Response } from "express";
import { buildResponse } from "../../helpers/responseHelper";
import FileServices from "../../services/File";
import iUser from "../../interfaces/User/iUser";
import FolderPermissionsService from "../../services/Permissions/Folder";
import FilePermissionsService from "../../services/Permissions/File";

class FileController {
  async create(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    const { storaged_at, folder } = req.body;

    if (storaged_at) {
      if (
        storaged_at != "aws" &&
        storaged_at != "digital_ocean" &&
        storaged_at != "gcp" &&
        storaged_at != "azure"
      ) {
        return buildResponse(
          res,
          null,
          false,
          "Invalid `storaged_at` value",
          400,
          req.headers.start_time
        );
      }
    }

    const fileServices = new FileServices(
      Number(user.id),
      Number(user.team_id)
    );

    const result = await fileServices.saveFile(
      req.file,
      req.headers.start_time ? req.headers.start_time.toString() : "",
      storaged_at,
      folder
    );

    if (!result.valid) {
      return buildResponse(
        res,
        null,
        false,
        result.message,
        400,
        req.headers.start_time
      );
    }

    return buildResponse(
      res,
      result.data,
      true,
      "File saved successfully",
      201,
      req.headers.start_time
    );
  }

  async getFiles(req: Request, res: Response) {
    const { storaged_at, folder, user_id, file_name } = req.query;
    const user = req.body.auth;

    const fileServices = new FileServices(
      Number(user.id),
      Number(user.team_id)
    );

    const filters: any = {};

    if (storaged_at) {
      if (
        storaged_at != "aws" &&
        storaged_at != "digital_ocean" &&
        storaged_at != "gcp" &&
        storaged_at != "azure"
      ) {
        return buildResponse(
          res,
          null,
          false,
          "Invalid storaged_at value",
          400,
          req.headers.start_time
        );
      }
      filters.storaged_at = storaged_at;
    }

    if (folder) {
      filters.folder = folder;

      const folderPermissionsService = new FolderPermissionsService(user);
      const folderAllowed = await folderPermissionsService.verifySingleRead(
        folder
      );
      if (!folderAllowed) {
        return buildResponse(
          res,
          null,
          false,
          "You are not allowed to read this folder",
          403,
          req.headers.start_time
        );
      }
    }

    if (user_id) filters.user_id = user_id;
    if (file_name) filters.file_name = file_name;

    const result = await fileServices.getFiles(filters);

    if (!result.valid) {
      return buildResponse(
        res,
        null,
        false,
        result.message,
        500,
        req.headers.start_time
      );
    }

    const filePermissionsService = new FilePermissionsService(user);

    const filesAllowed = await filePermissionsService.verifyMultipleReads(
      result.data
    );

    return buildResponse(
      res,
      filesAllowed,
      true,
      "Files retrieved successfully",
      200,
      req.headers.start_time
    );
  }

  async getFile(req: Request, res: Response) {
    const { id } = req.params;

    const user = req.body.auth;

    const fileServices = new FileServices(
      Number(user.id),
      Number(user.team_id)
    );

    const result = await fileServices.getFile(Number(id));

    if (!result.valid) {
      return buildResponse(
        res,
        null,
        false,
        result.message,
        500,
        req.headers.start_time
      );
    }

    if (!result.data) {
      return buildResponse(
        res,
        null,
        false,
        "File not found",
        404,
        req.headers.start_time
      );
    }

    const folderPermissionsService = new FolderPermissionsService(user);
    const folderAllowed = await folderPermissionsService.verifySingleRead(
      result.data.folder
    );
    if (!folderAllowed) {
      return buildResponse(
        res,
        null,
        false,
        "You don't have permission to access this file",
        403,
        req.headers.start_time
      );
    }

    const filePermissionsService = new FilePermissionsService(user);
    const fileAllowed = await filePermissionsService.verifySingleRead(
      Number(id)
    );
    if (!fileAllowed) {
      return buildResponse(
        res,
        null,
        false,
        "You don't have permission to read this file",
        403,
        req.headers.start_time
      );
    }

    return buildResponse(
      res,
      result.data,
      true,
      "File retrieved successfully",
      200,
      req.headers.start_time
    );
  }

  async deleteFile(req: Request, res: Response) {
    const { id } = req.params;

    const user = req.body.auth;

    const fileServices = new FileServices(
      Number(user.id),
      Number(user.team_id)
    );

    try {
      const fileExists = await fileServices.getFile(Number(id));
      if (!fileExists.data) {
        return buildResponse(
          res,
          null,
          false,
          "File not found",
          404,
          req.headers.start_time
        );
      }

      const folderPermissionsService = new FolderPermissionsService(user);
      const folderPermissions = await folderPermissionsService.verifyDelete(
        fileExists.data.folder
      );
      if (!folderPermissions) {
        return buildResponse(
          res,
          null,
          false,
          "You don't have permission to delete this file",
          403,
          req.headers.start_time
        );
      }

      const filePermissionsService = new FilePermissionsService(user);
      const filePermissions = await filePermissionsService.verifyDelete(
        Number(id)
      );
      if (!filePermissions) {
        return buildResponse(
          res,
          null,
          false,
          "You don't have permission to delete this file",
          403,
          req.headers.start_time
        );
      }

      const result = await fileServices.deleteFile(Number(id));

      return buildResponse(
        res,
        null,
        true,
        "File deleted successfully",
        200,
        req.headers.start_time
      );
    } catch (error: any) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Error deleting file",
        500,
        req.headers.start_time
      );
    }
  }

  async updateFile(req: Request, res: Response) {
    const { id } = req.params;

    const user = req.body.auth;

    const fileServices = new FileServices(
      Number(user.id),
      Number(user.team_id)
    );

    const { folder } = req.body;

    try {
      const fileExists = await fileServices.getFile(Number(id));
      if (!fileExists.data) {
        return buildResponse(
          res,
          null,
          false,
          "File not found",
          404,
          req.headers.start_time
        );
      }

      const folderPermissionsService = new FolderPermissionsService(user);
      const folderAllowed = await folderPermissionsService.verifySingleWrite(
        fileExists.data.folder
      );
      if (!folderAllowed) {
        return buildResponse(
          res,
          null,
          false,
          "You don't have permission to update this file",
          403,
          req.headers.start_time
        );
      }

      const filePermissionsService = new FilePermissionsService(user);
      const fileAllowed = await filePermissionsService.verifyUpload(Number(id));
      if (!fileAllowed) {
        return buildResponse(
          res,
          null,
          false,
          "You don't have permission to update this file",
          403,
          req.headers.start_time
        );
      }

      const result = await fileServices.updateFile(Number(id), { folder });

      if (!result.valid) {
        return buildResponse(
          res,
          null,
          false,
          result.message,
          400,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        result.data,
        true,
        "File updated successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Error updating file",
        500,
        req.headers.start_time
      );
    }
  }
}

export default new FileController();
