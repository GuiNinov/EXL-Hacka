import { buildResponse } from "../../../helpers/responseHelper";
import FilePermissionsService from "../../../services/Permissions/File";
import { Request, Response } from "express";
import iFilePermissions from "../../../interfaces/FilePermissions/iFIlePermissions";
import FileServices from "../../../services/File";
import UserServices from "../../../services/Users";
class FilePermissionsController {
  async create(req: Request, res: Response) {
    const user = req.body.auth;

    const { file_id, user_id, permissions } = req.body;
    if (!file_id || !user_id || !permissions) {
      return buildResponse(
        res,
        null,
        false,
        "File id, user id and permissions are required",
        400,
        req.headers.start_time
      );
    }

    const fileServices = new FileServices(user.id, user.team_id);
    const fileExists = await fileServices.getFile(Number(file_id));
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

    const { allow_read_till, allow_update_till, allow_delete_till } =
      permissions;

    if (allow_read_till || allow_update_till || allow_delete_till) {
      if (!permissions.access_till) {
        return buildResponse(
          res,
          null,
          false,
          "Access till date is required when `allow_read_till`, `allow_update_till` or `allow_delete_till` are true",
          400,
          req.headers.start_time
        );
      }
    }

    try {
      const filePermissionsService = new FilePermissionsService(user);
      const result: iFilePermissions =
        await filePermissionsService.createNewPermission({
          file_id,
          user_id,
          ...permissions,
          team_id: user.team_id,
        });

      return buildResponse(
        res,
        result,
        true,
        "File permissions created successfully",
        201,
        req.headers.start_time
      );
    } catch (error: any) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong. Internal server error",
        500,
        req.headers.start_time
      );
    }
  }

  async getAllFilePermissions(req: Request, res: Response) {
    const user = req.body.auth;

    const { user_id, file_id } = req.query;

    const filePermissionsService = new FilePermissionsService(user);

    try {
      var result: iFilePermissions[] = [];
      if (user_id && file_id) {
        result = await filePermissionsService.findAllByUserIdAndFileId(
          Number(user_id),
          Number(file_id)
        );
      }
      if (user_id && !file_id) {
        result = await filePermissionsService.findAllByUserId(Number(user_id));
      }
      if (!user_id && file_id) {
        result = await filePermissionsService.findAllByFileId(Number(file_id));
      }
      if (!user_id && !file_id) {
        result = await filePermissionsService.listAllTeamPermissions();
      }

      if (!result.length) {
        return buildResponse(
          res,
          null,
          false,
          "File permissions not found",
          404,
          req.headers.start_time
        );
      }
      return buildResponse(
        res,
        result,
        true,
        "File permissions fetched successfully",
        200,
        req.headers.start_time
      );
    } catch (error: any) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong. Internal server error",
        500,
        req.headers.start_time
      );
    }
  }

  async findOnePermission(req: Request, res: Response) {
    const user = req.body.auth;

    const { id } = req.params;
    try {
      const filePermissionsService = new FilePermissionsService(user);
      const result = await filePermissionsService.findOnePermission(Number(id));
      if (!result) {
        return buildResponse(
          res,
          null,
          false,
          "File permissions not found",
          404,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        result,
        true,
        "File permissions fetched successfully",
        200,
        req.headers.start_time
      );
    } catch (error: any) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong. Internal server error",
        500,
        req.headers.start_time
      );
    }
  }

  async updatePermission(req: Request, res: Response) {
    const user = req.body.auth;

    const { id } = req.params;
    const { permissions } = req.body;

    const { allow_read_till, allow_update_till, allow_delete_till } =
      permissions;

    if (allow_read_till || allow_update_till || allow_delete_till) {
      if (!permissions.access_till) {
        return buildResponse(
          res,
          null,
          false,
          "Access till date is required when `allow_read_till`, `allow_update_till` or `allow_delete_till` are true",
          400,
          req.headers.start_time
        );
      }
    }

    try {
      const filePermissionsService = new FilePermissionsService(user);

      const filePermissionExists: iFilePermissions =
        await filePermissionsService.findOnePermission(Number(id));

      if (!filePermissionExists) {
        return buildResponse(
          res,
          null,
          false,
          "File permissions not found",
          404,
          req.headers.start_time
        );
      }

      const result: iFilePermissions =
        await filePermissionsService.updatePermission(Number(id), {
          ...permissions,
        });

      if (!result) {
        return buildResponse(
          res,
          null,
          false,
          "File permissions not found",
          404,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        result,
        true,
        "File permissions updated successfully",
        200,
        req.headers.start_time
      );
    } catch (error: any) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong. Internal server error",
        500,
        req.headers.start_time
      );
    }
  }

  async deletePermission(req: Request, res: Response) {
    const user = req.body.auth;

    const { id } = req.params;
    try {
      const filePermissionsService = new FilePermissionsService(user);

      const filePermissionExists: iFilePermissions =
        await filePermissionsService.findOnePermission(Number(id));

      if (!filePermissionExists) {
        return buildResponse(
          res,
          null,
          false,
          "File permissions not found",
          404,
          req.headers.start_time
        );
      }

      await filePermissionsService.deletePermission(Number(id));

      return buildResponse(
        res,
        null,
        true,
        "File permissions deleted successfully",
        200,
        req.headers.start_time
      );
    } catch (error: any) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong. Internal server error",
        500,
        req.headers.start_time
      );
    }
  }
}

export default new FilePermissionsController();
