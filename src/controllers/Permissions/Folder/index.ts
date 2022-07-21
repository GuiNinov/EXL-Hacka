import { buildResponse } from "../../../helpers/responseHelper";
import { Request, Response } from "express";
import FolderPermissionsService from "../../../services/Permissions/Folder";
import FolderServices from "../../../services/Folder";
import UserServices from "../../../services/Users";
import iFolderPermissions from "../../../interfaces/FolderPermissions/iFolderPermissions";
class FolderPermissionsController {
  async create(req: Request, res: Response) {
    const user = req.body.auth;

    const { folder_id, user_id, permissions } = req.body;
    if (!folder_id || !user_id || !permissions) {
      return buildResponse(
        res,
        null,
        false,
        "Missing required fields",
        400,
        req.headers.start_time
      );
    }

    const folderService = new FolderServices(user.team_id);
    const folderExists = await folderService.findById(Number(folder_id));
    if (!folderExists) {
      return buildResponse(
        res,
        null,
        false,
        "Folder not found",
        404,
        req.headers.start_time
      );
    }

    const userService = new UserServices(user.team_id);
    const userExists = await userService.findById(Number(user.id));
    if (!userExists) {
      return buildResponse(
        res,
        null,
        false,
        "User not found",
        404,
        req.headers.start_time
      );
    }

    const { allow_read_till, allow_write_till, allow_delete_till } =
      permissions;
    if (allow_read_till || allow_write_till || allow_delete_till) {
      if (!permissions.access_till) {
        return buildResponse(
          res,
          null,
          false,
          "Access till date is required when `allow_read_till`, `allow_write_till` or `allow_delete_till` are true",
          400,
          req.headers.start_time
        );
      }
    }

    try {
      const folderPermissionsService = new FolderPermissionsService(user);
      const result: iFolderPermissions =
        await folderPermissionsService.createNewPermission({
          folder_id,
          user_id,
          ...permissions,
          team_id: user.team_id,
        });
      return buildResponse(
        res,
        result,
        true,
        "Folder permission created successfully",
        201,
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

  async update(req: Request, res: Response) {
    const user = req.body.auth;

    const { id } = req.params;
    const { permissions } = req.body;

    const { allow_read_till, allow_write_till, allow_delete_till } =
      permissions;
    if (allow_read_till || allow_write_till || allow_delete_till) {
      if (!permissions.access_till) {
        return buildResponse(
          res,
          null,
          false,
          "Access till date is required when `allow_read_till`, `allow_write_till` or `allow_delete_till` are true",
          400,
          req.headers.start_time
        );
      }
    }

    try {
      const folderPermissionsService = new FolderPermissionsService(user);
      const folderPermissionExists =
        await folderPermissionsService.findOnePermission(Number(id));
      if (!folderPermissionExists) {
        return buildResponse(
          res,
          null,
          false,
          "Folder permission not found",
          404,

          req.headers.start_time
        );
      }

      const result: iFolderPermissions =
        await folderPermissionsService.updatePermission(Number(id), {
          ...permissions,
        });
      return buildResponse(
        res,
        result,
        true,
        "Folder permission updated successfully",
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

  async delete(req: Request, res: Response) {
    const user = req.body.auth;

    const { id } = req.params;

    try {
      const folderPermissionsService = new FolderPermissionsService(user);

      const folderPermissionExists =
        await folderPermissionsService.findOnePermission(Number(id));
      if (!folderPermissionExists) {
        return buildResponse(
          res,
          null,
          false,
          "Folder permission not found",
          404,
          req.headers.start_time
        );
      }

      await folderPermissionsService.deletePermission(Number(id));

      return buildResponse(
        res,
        null,
        true,
        "Folder permission deleted successfully",
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

  async getAll(req: Request, res: Response) {
    const user = req.body.auth;
    const { user_id, folder_id } = req.query;

    try {
      const folderPermissionsService = new FolderPermissionsService(user);

      let result: iFolderPermissions[] = [];
      if (user_id && !folder_id) {
        const userServices = new UserServices(user.team_id);
        const userExists = await userServices.findById(Number(user_id));
        if (!userExists) {
          return buildResponse(
            res,
            null,
            false,
            "User not found",
            404,
            req.headers.start_time
          );
        }
        result = await folderPermissionsService.findAllByUserId(
          Number(user_id)
        );
      }

      if (folder_id && !user_id) {
        const folderService = new FolderServices(user.team_id);
        const folderExists = await folderService.findById(Number(folder_id));
        if (!folderExists) {
          return buildResponse(
            res,
            null,
            false,
            "Folder not found",
            404,
            req.headers.start_time
          );
        }
        result = await folderPermissionsService.findAllByFolderId(
          Number(folder_id)
        );
      }

      if (folder_id && user_id) {
        const folderService = new FolderServices(user.team_id);
        const folderExists = await folderService.findById(Number(folder_id));
        if (!folderExists) {
          return buildResponse(
            res,
            null,
            false,
            "Folder not found",
            404,
            req.headers.start_time
          );
        }
        const userServices = new UserServices(user.team_id);
        const userExists = await userServices.findById(Number(user_id));
        if (!userExists) {
          return buildResponse(
            res,
            null,
            false,
            "User not found",
            404,
            req.headers.start_time
          );
        }
        result = await folderPermissionsService.findAllByFolderIdAndUserId(
          Number(folder_id),
          Number(user_id)
        );
      }

      if (!folder_id && !user_id) {
        result = await folderPermissionsService.listAllTeamPermissions();
      }

      if (!result.length) {
        return buildResponse(
          res,
          null,
          false,
          "No folder permissions found",
          404,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        result,
        true,
        "Folder permissions fetched successfully",
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

  async findOne(req: Request, res: Response) {
    const user = req.body.auth;

    const { id } = req.params;

    try {
      const folderPermissionsService = new FolderPermissionsService(user);
      const folderPermissionExists =
        await folderPermissionsService.findOnePermission(Number(id));
      if (!folderPermissionExists) {
        return buildResponse(
          res,
          null,
          false,
          "Folder permission not found",
          404,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        folderPermissionExists,
        true,
        "Folder permission fetched successfully",
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

export default new FolderPermissionsController();
